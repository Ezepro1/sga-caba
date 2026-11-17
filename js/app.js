        /**
         * ============================================================================
         * 1. DATASET DE OBRAS EN CABA (GOOGLE SHEETS PUBLICADO COMO CSV)
         * La hoja no trae lat/lng: data/geocodes.js resuelve las coordenadas por
         * dirección con Georef + USIG (ver tools/geocode_obras.py).
         * ============================================================================
         */
        const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpOche_nf-u-NvPAV7YWBGRUQ9HgtFByqD2GG5Yt8ORcnsCKizWHEPacbMjNo4Nb8Vu-7w1sJ27H_D/pub?output=csv';

        let datasetSheet = [];
        let obrasEjemplo = [];
        let datasetAuditMs = 0;
        let sheetLayer = null;
        let selectedMarker = null;
        let currentObraId = null;
        let map = null;

        /**
         * ============================================================================
         * 2. UTILIDADES DEL DATASET
         * ============================================================================
         */
        function escapeHtmlSheet(text) {
            return String(text ?? '').replace(/[&<>"']/g, c => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
            }[c]));
        }

        // Parser CSV mínimo: soporta comillas, comas y saltos de línea dentro de campos
        function parseCSVSheet(text) {
            const rows = [];
            let row = [];
            let field = '';
            let inQuotes = false;

            for (let i = 0; i < text.length; i++) {
                const c = text[i];

                if (inQuotes) {
                    if (c === '"') {
                        if (text[i + 1] === '"') { field += '"'; i++; }
                        else { inQuotes = false; }
                    } else {
                        field += c;
                    }
                    continue;
                }

                if (c === '"') inQuotes = true;
                else if (c === ',') { row.push(field); field = ''; }
                else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
                else if (c !== '\r') field += c;
            }

            if (field !== '' || row.length) { row.push(field); rows.push(row); }
            return rows;
        }

        function csvSheetToObjects(text) {
            const rows = parseCSVSheet(text);
            if (!rows.length) return [];
            const headers = rows[0].map(h => h.trim());
            return rows.slice(1).map(values => {
                const obj = {};
                headers.forEach((h, i) => { obj[h] = values[i] ?? ''; });
                return obj;
            });
        }

        // Clasificación usada por el mapa y por el motor: la hoja trae la salud
        // financiera en estado_salud_rn y el estado registral en estado_actual.
        function severidadSheet(obra) {
            const estado = (obra.estado_actual || '').toLowerCase();
            const salud = (obra.estado_salud_rn || '').toLowerCase();

            if (/clausur|contravenci|judicial/.test(estado)) return 'CRITICO';
            if (salud.includes('alerta') || /paralizad/.test(estado)) return 'ALERTA';
            return 'NORMAL';
        }

        /**
         * ============================================================================
         * 3. MOTOR DE INFERENCIA SOBRE EL DATASET REAL
         * Reproduce la clasificación de la hoja y expone la traza de reglas para
         * las cajitas 2 y 3. No modifica los datos: solo deriva hechos y dictamen.
         * ============================================================================
         */
        function construirDiagnosticoSheet(obra, nivelRiesgo, desfasaje, flags) {
            const motivoBackend = (obra.motivo || '').trim();
            const accionBackend = (obra.accion || '').trim();
            const saludLimpia = (obra.salud || '').replace(/[^\x20-\x7E\u00C0-\u024F]/g, '').trim();

            if (nivelRiesgo === 'CRITICO') {
                return {
                    nivel: 'CRITICO',
                    badgeText: 'ESTADO CRÍTICO',
                    titulo: 'Dictamen Crítico: Intervención Prioritaria Requerida',
                    explicacion: motivoBackend || `El sistema detectó una irregularidad registral crítica (${obra.estado_actual}).`,
                    accion: accionBackend || 'Disponer inspección presencial urgente de la AGC y suspender nuevas aprobaciones hasta regularizar la situación.'
                };
            }

            if (nivelRiesgo === 'ALERTA') {
                const explicacion = flags.paralizada
                    ? (motivoBackend || `La obra figura como "${obra.estado_actual}".`)
                    : `Se detectó un desvío financiero de ${desfasaje.toFixed(1)}% (${saludLimpia || 'alerta'}). ${motivoBackend}`.trim();

                return {
                    nivel: 'ALERTA',
                    badgeText: 'ALERTA PREVENTIVA',
                    titulo: 'Dictamen de Alerta: Monitoreo y Verificación Especial',
                    explicacion,
                    accion: accionBackend || 'Asignar auditoría técnica programada y validar la documentación del último AVO declarado.'
                };
            }

            return {
                nivel: 'NORMAL',
                badgeText: 'ESTADO NORMAL',
                titulo: 'Dictamen Favorable: Obra en Parámetros Normales',
                explicacion: motivoBackend || 'El sistema no detectó clausuras, paralizaciones ni desvíos financieros relevantes.',
                accion: accionBackend || 'Mantener el flujo habitual de seguimiento digital y aprobar la continuidad del cronograma de AVO.'
            };
        }

        function auditarObraSheet(obra) {
            const estado = (obra.estado_actual || '').toLowerCase();
            const salud = (obra.salud || '').toLowerCase();
            const desfasaje = Math.abs(obra.avanceFinanciero - obra.avanceFisico);
            const desfasajeConSigno = +(obra.avanceFinanciero - obra.avanceFisico).toFixed(1);
            const saludLimpia = (obra.salud || 'SIN DATO').replace(/[^\x20-\x7E\u00C0-\u024F]/g, '').trim();

            // Base de Hechos Iniciales (Working Memory)
            const hechos = [
                `estado_actual("${obra.estado_actual || 'SIN DATO'}")`,
                `superficie_m2(${obra.superficie.toLocaleString('es-AR')})`,
                `prob_finalizacion(${obra.probabilidad.toFixed(1)}%)`,
                `avance_fisico(${obra.avanceFisico.toFixed(1)}%)`,
                `avance_financiero(${obra.avanceFinanciero.toFixed(1)}%)`,
                `delta_financiero_fisico(${desfasajeConSigno > 0 ? '+' : ''}${desfasajeConSigno}%)`,
                `estado_salud("${saludLimpia}")`,
                `regla_aplicada("${obra.regla || 'SIN REGLA'}")`
            ];

            const reglasEvaluadas = [];
            let nivelRiesgo = 'NORMAL';

            // R1: Clausura / contravención / proceso judicial
            const clausura = /clausur|contravenci|judicial/.test(estado);
            if (clausura) {
                nivelRiesgo = 'CRITICO';
                reglasEvaluadas.push({
                    id: 'R1-CONTRAVENCION',
                    estado: 'critico',
                    condicion: `SI estado_actual("${obra.estado_actual}") contiene clausura / contravención / judicial`,
                    accion: 'ENTONCES disparar ALERTA_CRITICA_AGC y bloquear la certificación de avance.',
                    detalle: 'La hoja registra una irregularidad registral grave que exige intervención de la AGC.'
                });
            } else {
                reglasEvaluadas.push({
                    id: 'R1-CONTRAVENCION',
                    estado: 'ok',
                    condicion: `SI estado_actual("${obra.estado_actual || 'SIN DATO'}") NO contiene clausura / contravención / judicial`,
                    accion: 'ENTONCES validar continuidad operativa legal ante DGROC.',
                    detalle: 'Sin clausuras, contravenciones ni procesos judiciales vigentes.'
                });
            }

            // R2: Paralización declarada
            const paralizada = /paralizad/.test(estado);
            if (paralizada) {
                if (nivelRiesgo === 'NORMAL') nivelRiesgo = 'ALERTA';
                reglasEvaluadas.push({
                    id: 'R2-PARALIZACION',
                    estado: 'alerta',
                    condicion: `SI estado_actual("${obra.estado_actual}") contiene "paralizada"`,
                    accion: 'ENTONCES marcar OBRA_PARALIZADA y solicitar plan de reactivación.',
                    detalle: 'La obra no registra actividad; se requiere seguimiento para evitar deterioro y sobrecostos.'
                });
            } else {
                reglasEvaluadas.push({
                    id: 'R2-PARALIZACION',
                    estado: 'ok',
                    condicion: `SI estado_actual("${obra.estado_actual || 'SIN DATO'}") NO contiene "paralizada"`,
                    accion: 'ENTONCES confirmar continuidad de la obra.',
                    detalle: 'La obra no figura paralizada en el registro.'
                });
            }

            // R3: Desvío financiero (la hoja usa umbral de 5%)
            const desvio = salud.includes('alerta') || desfasaje > 5.0;
            if (desvio) {
                if (nivelRiesgo === 'NORMAL') nivelRiesgo = 'ALERTA';
                reglasEvaluadas.push({
                    id: 'R3-DESVIO-FINANCIERO',
                    estado: 'alerta',
                    condicion: `SI (|Avance_Financiero (${obra.avanceFinanciero.toFixed(1)}%) - Avance_Físico (${obra.avanceFisico.toFixed(1)}%)| = ${desfasaje.toFixed(1)}% > 5.0%)`,
                    accion: 'ENTONCES inferir DESVIO_FINANCIERO_LEVE y solicitar conciliación contable.',
                    detalle: `La hoja clasifica el estado de salud como "${saludLimpia || 'sin dato'}".`
                });
            } else {
                reglasEvaluadas.push({
                    id: 'R3-DESVIO-FINANCIERO',
                    estado: 'ok',
                    condicion: `SI (|Avance_Financiero (${obra.avanceFinanciero.toFixed(1)}%) - Avance_Físico (${obra.avanceFisico.toFixed(1)}%)| = ${desfasaje.toFixed(1)}% <= 5.0%)`,
                    accion: 'ENTONCES confirmar EQUILIBRIO_FISICO_FINANCIERO.',
                    detalle: 'La curva de inversión acompaña el avance físico dentro del umbral de la hoja (5%).'
                });
            }

            // R4: Envergadura (recomendación preventiva, no altera el nivel)
            if (obra.superficie > 1000) {
                reglasEvaluadas.push({
                    id: 'R4-ENVERGADURA-M2',
                    estado: 'info',
                    condicion: `SI superficie_m2 (${obra.superficie.toLocaleString('es-AR')} m²) > 1.000 m²`,
                    accion: 'ENTONCES asignar PROTOCOLO_GRAN_ENVERGADURA (inspección de seguridad e higiene).',
                    detalle: 'Recomendación preventiva: no modifica el nivel de riesgo, pero exige control reforzado.'
                });
            } else {
                reglasEvaluadas.push({
                    id: 'R4-ENVERGADURA-M2',
                    estado: 'ok',
                    condicion: `SI superficie_m2 (${obra.superficie.toLocaleString('es-AR')} m²) <= 1.000 m²`,
                    accion: 'ENTONCES aplicar régimen estándar de verificación por escala.',
                    detalle: 'Superficie dentro del umbral estándar para obras menores/medias.'
                });
            }

            // R5: Score de finalización (prioridad de seguimiento, no altera el nivel)
            if (obra.probabilidad < 50) {
                reglasEvaluadas.push({
                    id: 'R5-SCORE-FINALIZACION',
                    estado: 'info',
                    condicion: `SI prob_finalizacion (${obra.probabilidad.toFixed(1)}%) < 50.0%`,
                    accion: 'ENTONCES priorizar el expediente en el tablero de seguimiento.',
                    detalle: 'Baja probabilidad de finalización estimada por el modelo predictivo.'
                });
            } else if (obra.probabilidad < 85) {
                reglasEvaluadas.push({
                    id: 'R5-SCORE-FINALIZACION',
                    estado: 'ok',
                    condicion: `SI 50.0% <= prob_finalizacion (${obra.probabilidad.toFixed(1)}%) < 85.0%`,
                    accion: 'ENTONCES programar seguimiento preventivo trimestral.',
                    detalle: 'Probabilidad moderada; requiere monitoreo periódico.'
                });
            } else {
                reglasEvaluadas.push({
                    id: 'R5-SCORE-FINALIZACION',
                    estado: 'ok',
                    condicion: `SI prob_finalizacion (${obra.probabilidad.toFixed(1)}%) >= 85.0%`,
                    accion: 'ENTONCES certificar CONFORMIDAD_ÓPTIMA.',
                    detalle: 'Alta probabilidad de finalización exitosa según el modelo predictivo.'
                });
            }

            const diagnostico = construirDiagnosticoSheet(obra, nivelRiesgo, desfasaje, { clausura, paralizada, desvio });

            return {
                nivelRiesgo,
                desfasaje,
                desfasajeConSigno,
                hechos,
                reglasEvaluadas,
                diagnostico
            };
        }

        /**
         * ============================================================================
         * 4. BASEMAP DEL MAPA
         * CARTO ahora exige una API key válida: sin key devuelve tiles vacíos, por
         * eso el mapa se veía en blanco.
         *
         * - Si pegás una API key real de CARTO acá abajo, se usa CARTO Voyager.
         * - Si no hay key, se usa Esri World Street Map (gratis, sin key) y, si
         *   fallara, cae automáticamente a OpenStreetMap.
         * ============================================================================
         */
        const CARTO_API_KEY = ""; // Ej: "eyJhbGciOi..." (dejalo vacío si no tenés key)

        function agregarBasemap() {
            const agregarEsri = () => {
                const esri = L.tileLayer(
                    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                        attribution: 'Tiles &copy; Esri | Datos GCABA',
                        maxZoom: 19
                    }
                );

                // Si Esri falla, usar OpenStreetMap como último respaldo
                esri.once('tileerror', () => {
                    if (map.hasLayer(esri)) map.removeLayer(esri);
                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors | Datos GCABA',
                        maxZoom: 19
                    }).addTo(map);
                });

                esri.addTo(map);
            };

            if (CARTO_API_KEY) {
                // CARTO Voyager (Raster) con API key
                const carto = L.tileLayer(
                    `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`, {
                        attribution: '&copy; OpenStreetMap &copy; CARTO | Datos GCABA',
                        subdomains: 'abcd',
                        maxZoom: 20
                    }
                );

                // Si la key no sirve, pasar a Esri sin dejar el mapa en blanco
                carto.once('tileerror', () => {
                    if (map.hasLayer(carto)) map.removeLayer(carto);
                    agregarEsri();
                });

                carto.addTo(map);
            } else {
                agregarEsri();
            }
        }

        /**
         * ============================================================================
         * 5. CARGA DEL DATASET GCABA EN VIVO
         * ============================================================================
         */
        function setMapDatasetStatus(text, tone = 'info') {
            const el = document.getElementById('mapDatasetStatus');
            if (!el) return;
            const toneClass = tone === 'error'
                ? 'border-rose-500/40 text-rose-200'
                : (tone === 'ok' ? 'border-emerald-500/40 text-emerald-200' : 'border-sky-500/30 text-sky-200');
            const dotClass = tone === 'error'
                ? 'bg-rose-400'
                : (tone === 'ok' ? 'bg-emerald-400' : 'bg-sky-400 animate-pulse');
            el.className = 'absolute top-3 right-3 z-20 pointer-events-none bg-slate-950/85 backdrop-blur-md border px-3 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-2 ' + toneClass;
            el.innerHTML = `<span class="w-2 h-2 rounded-full ${dotClass}"></span><span>${escapeHtmlSheet(text)}</span>`;
        }

        function popupSheetObra(obra) {
            const badge = {
                NORMAL: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
                ALERTA: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
                CRITICO: 'text-rose-300 bg-rose-500/15 border-rose-500/30'
            }[obra.severidad];

            return `
                <div class="p-1 min-w-[240px] max-w-[300px] space-y-2">
                    <div class="flex items-center justify-between gap-2">
                        <span class="text-[10px] font-mono text-slate-400">${escapeHtmlSheet(obra.comuna)}</span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge}">${obra.severidad}</span>
                    </div>
                    <div>
                        <div class="text-xs font-bold text-white">${escapeHtmlSheet(obra.calle)} ${escapeHtmlSheet(obra.altura)}</div>
                        <div class="text-[11px] font-mono text-sky-300 mt-0.5">${escapeHtmlSheet(obra.expediente)}</div>
                    </div>
                    <div class="text-[11px] text-slate-300">${escapeHtmlSheet(obra.estado_actual || 'Sin estado')}</div>
                    <div class="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-700/70 text-[11px]">
                        <div><span class="text-slate-400 block">Superficie:</span><strong class="text-slate-200">${obra.superficie.toLocaleString('es-AR')} m²</strong></div>
                        <div><span class="text-slate-400 block">Prob. finalizar:</span><strong class="text-slate-200">${obra.probabilidad.toFixed(1)}%</strong></div>
                        <div><span class="text-slate-400 block">Avance físico:</span><strong class="text-slate-200">${obra.avanceFisico.toFixed(1)}%</strong></div>
                        <div><span class="text-slate-400 block">Avance financ.:</span><strong class="text-slate-200">${obra.avanceFinanciero.toFixed(1)}%</strong></div>
                    </div>
                    <div class="text-[10px] text-slate-400 pt-1 border-t border-slate-700/70">${escapeHtmlSheet(obra.regla)}</div>
                </div>
            `;
        }

        function popupObraSeleccionada(obra, audit) {
            const badgeColor = audit.nivelRiesgo === 'CRITICO'
                ? 'text-rose-400 bg-rose-500/15 border-rose-500/30'
                : (audit.nivelRiesgo === 'ALERTA' ? 'text-amber-400 bg-amber-500/15 border-amber-500/30' : 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30');

            return `
                <div class="p-1 min-w-[230px] space-y-2">
                    <div class="flex items-center justify-between gap-2">
                        <span class="text-[10px] font-mono text-slate-400">${escapeHtmlSheet(obra.comuna)}</span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}">
                            ${audit.diagnostico.badgeText}
                        </span>
                    </div>
                    <div>
                        <div class="text-xs font-bold text-white">${escapeHtmlSheet(obra.calle)} ${escapeHtmlSheet(obra.altura)}</div>
                        <div class="text-[11px] font-mono text-sky-300 mt-0.5">${escapeHtmlSheet(obra.expediente)}</div>
                    </div>
                    <div class="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-700/70 text-[11px]">
                        <div>
                            <span class="text-slate-400 block">Superficie:</span>
                            <strong class="text-slate-200">${obra.superficie.toLocaleString('es-AR')} m²</strong>
                        </div>
                        <div>
                            <span class="text-slate-400 block">Prob. finalizar:</span>
                            <strong class="text-slate-200">${obra.probabilidad.toFixed(1)}%</strong>
                        </div>
                    </div>
                </div>
            `;
        }

        function mapThemeColors() {
            const cs = getComputedStyle(document.documentElement);
            const read = (name, fallback) => {
                const v = cs.getPropertyValue(name).trim();
                return v || fallback;
            };
            return {
                NORMAL: read('--map-normal', '#10b981'),
                ALERTA: read('--map-alerta', '#f59e0b'),
                CRITICO: read('--map-critico', '#f43f5e')
            };
        }

        function renderizarDatasetSheet(obras) {
            if (sheetLayer) {
                map.removeLayer(sheetLayer);
                sheetLayer = null;
            }

            const renderer = L.canvas({ padding: 0.4 });
            const colors = mapThemeColors();
            const popup = L.popup({ maxWidth: 320 });
            sheetLayer = L.layerGroup();

            obras.forEach(obra => {
                const circle = L.circleMarker([obra.lat, obra.lng], {
                    renderer,
                    radius: 3,
                    weight: 0,
                    fillColor: colors[obra.severidad],
                    fillOpacity: 0.7
                });
                circle._sev = obra.severidad;

                // Clic en el punto: abre el detalle y actualiza cajitas 1, 2 y 3
                circle.on('click', () => {
                    popup.setLatLng([obra.lat, obra.lng]).setContent(popupSheetObra(obra)).openOn(map);
                    seleccionarObra(obra.uid, false, false, false);
                });

                sheetLayer.addLayer(circle);
            });

            sheetLayer.addTo(map);

            const total = datasetSheet.length;
            const enMapa = obras.length;
            const countEl = document.getElementById('mapDatasetCount');
            if (countEl) countEl.textContent = `${total.toLocaleString('es-AR')} obras · ${enMapa.toLocaleString('es-AR')} en mapa`;

            setMapDatasetStatus(`${enMapa.toLocaleString('es-AR')} obras geolocalizadas`, 'ok');
            setTimeout(() => {
                const el = document.getElementById('mapDatasetStatus');
                if (el) el.classList.add('hidden');
            }, 5000);
        }

        // Repinta la capa de puntos cuando cambia el tema (original / claro / oscuro)
        window.auditoriaApplyMapTheme = function () {
            if (!sheetLayer || typeof sheetLayer.eachLayer !== 'function') return;
            const colors = mapThemeColors();
            sheetLayer.eachLayer(layer => {
                if (layer && layer._sev && colors[layer._sev]) {
                    layer.setStyle({ fillColor: colors[layer._sev] });
                }
            });
        };

        async function cargarDatasetSheet() {
            setMapDatasetStatus('Cargando obras GCABA…');
            const t0 = performance.now();

            try {
                const res = await fetch(SHEET_CSV_URL, { cache: 'no-cache' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const csvText = await res.text();
                const geocodes = window.GEOCODES_CABA || {};
                const rows = csvSheetToObjects(csvText);

                const tMap = performance.now();
                datasetSheet = rows.map((r, i) => {
                    const direccion = (r.direccion_busqueda || '').trim();
                    const coords = geocodes[direccion];
                    const num = v => {
                        const n = parseFloat(v);
                        return Number.isFinite(n) ? n : 0;
                    };

                    const rawComuna = (r.comuna_barrio || '').trim();
                    const comunaMatch = rawComuna.match(/^(.*?)\s*\((.*)\)\s*$/);
                    const comuna = (comunaMatch ? comunaMatch[1] : rawComuna) || 'Sin comuna';
                    const barrio = (comunaMatch ? comunaMatch[2] : '') || 'Sin barrio';

                    return {
                        uid: `SHEET-${i}`,
                        id: r.expediente || `SHEET-${i}`,
                        expediente: (r.expediente || '').trim(),
                        calle: (r.calle || '').trim(),
                        altura: (r.altura || '').trim(),
                        direccion,
                        comuna,
                        barrio,
                        superficie: num(r.superficie_m2),
                        estado_actual: (r.estado_actual || '').trim(),
                        regla: (r.regla_sistema_experto || '').trim(),
                        motivo: (r.motivo_diagnostico || '').trim(),
                        accion: (r.accion_para_destrabar || '').trim(),
                        probabilidad: num(r.probabilidad_finalizacion_pct),
                        avanceFisico: num(r.avance_fisico_pct),
                        avanceFinanciero: num(r.avance_financiero_pct),
                        desfasaje: num(r.desfasaje_financiero_pct),
                        salud: (r.estado_salud_rn || '').trim(),
                        severidad: severidadSheet(r),
                        lat: coords ? coords[0] : null,
                        lng: coords ? coords[1] : null
                    };
                });
                datasetAuditMs = performance.now() - tMap;

                const geolocalizadas = datasetSheet.filter(o => o.lat !== null && o.lng !== null);
                renderizarDatasetSheet(geolocalizadas);

                obrasEjemplo = construirCasosEjemplo();
                renderBackendAuditSummary();
                renderQuickTestCases();

                const inicial = obrasEjemplo[0]?.obra || geolocalizadas[0] || datasetSheet[0];
                if (inicial) seleccionarObra(inicial.uid, false, false);

                console.info(`[AuditorIA] Dataset GCABA: ${datasetSheet.length} obras, ${geolocalizadas.length} geolocalizadas en ${Math.round(performance.now() - t0)} ms (motor: ${Math.round(datasetAuditMs)} ms).`);
            } catch (err) {
                console.error('[AuditorIA] No se pudo cargar el dataset GCABA:', err);
                setMapDatasetStatus('No se pudieron cargar las obras', 'error');
                const countEl = document.getElementById('mapDatasetCount');
                if (countEl) countEl.textContent = 'Obras GCABA no disponibles';
                const grid = document.getElementById('backendAuditGrid');
                if (grid) grid.innerHTML = '<div class="col-span-full text-xs text-rose-300">No se pudieron cargar las obras publicadas.</div>';
                const qc = document.getElementById('quickCasesContainer');
                if (qc) qc.innerHTML = '<span class="text-xs text-rose-300">Obras no disponibles.</span>';
                const status = document.getElementById('backendAuditStatus');
                if (status) status.textContent = 'Error al cargar las obras';
            }
        }

        /**
         * Casos de ejemplo extraídos automáticamente del propio dataset.
         */
        function construirCasosEjemplo() {
            const conCoords = datasetSheet.filter(o => o.lat !== null && o.lng !== null);
            const casos = [];
            const usados = new Set();

            const agregar = (obra, tag) => {
                if (!obra || usados.has(obra.uid)) return;
                usados.add(obra.uid);
                casos.push({ obra, tag });
            };

            const buscar = (pred) => conCoords.find(pred);

            // Mayor superficie del dataset (con coordenadas)
            const mayor = conCoords.reduce((a, b) => (b.superficie > a.superficie ? b : a), conCoords[0]);
            agregar(mayor, 'Mayor superficie');
            // Clausura / contravención
            agregar(buscar(o => /clausur|contravenci|judicial/i.test(o.estado_actual)), 'Clausura');
            // Desvío financiero leve
            agregar(buscar(o => o.severidad === 'ALERTA' && !/paralizad/i.test(o.estado_actual)), 'Desvío');
            // Obra paralizada
            agregar(buscar(o => /paralizad/i.test(o.estado_actual)), 'Paralizada');
            // Gran escala normal (sin repetir la de mayor superficie)
            agregar(buscar(o => o.severidad === 'NORMAL' && o.superficie > 1000 && !usados.has(o.uid)), 'Gran escala');
            // Obra menor
            agregar(buscar(o => o.severidad === 'NORMAL' && o.superficie > 0 && o.superficie < 500), 'Obra menor');
            // Regla AVO autorizado
            agregar(buscar(o => o.regla === 'AVO AUTORIZADO' && !usados.has(o.uid)), 'AVO');
            // Obra finalizada
            agregar(buscar(o => o.regla === 'OBRA FINALIZADA' && !usados.has(o.uid)), 'Finalizada');

            return casos.slice(0, 8);
        }

        function initCabaMap() {
            // Centro geográfico de CABA
            const cabaCenter = [-34.6037, -58.3816];

            map = L.map('cabaMap', {
                center: cabaCenter,
                zoom: 12,
                zoomControl: true,
                attributionControl: true
            });

            agregarBasemap();

            // La capa de 12k+ puntos y el marcador de selección se crean al cargar
            // el dataset publicado en Google Sheets.
            cargarDatasetSheet();
        }

        function focusMapOnObra(obra, audit, shouldFly = true, abrirPopup = true) {
            if (!map) return;

            const hud = document.getElementById('mapCoordsHud');

            if (obra.lat === null || obra.lng === null) {
                if (selectedMarker) {
                    map.removeLayer(selectedMarker);
                    selectedMarker = null;
                }
                if (hud) hud.textContent = 'Sin geolocalización para esta dirección';
                return;
            }

            const statusClass = audit.nivelRiesgo === 'CRITICO'
                ? 'led-critico'
                : (audit.nivelRiesgo === 'ALERTA' ? 'led-alerta' : 'led-normal');

            if (selectedMarker) {
                map.removeLayer(selectedMarker);
                selectedMarker = null;
            }

            const customIcon = L.divIcon({
                className: 'custom-led-div-icon',
                html: `
                    <div id="marker-wrapper-selected" class="led-marker-wrapper ${statusClass} led-active">
                        <div class="led-ring"></div>
                        <div class="led-core"></div>
                    </div>
                `,
                iconSize: [36, 36],
                iconAnchor: [18, 18],
                popupAnchor: [0, -16]
            });

            selectedMarker = L.marker([obra.lat, obra.lng], {
                icon: customIcon,
                zIndexOffset: 1000
            }).addTo(map);

            selectedMarker.bindPopup(popupObraSeleccionada(obra, audit));

            if (shouldFly) {
                map.flyTo([obra.lat, obra.lng], 15, {
                    animate: true,
                    duration: 1.1
                });
            }

            if (abrirPopup) {
                setTimeout(() => {
                    if (selectedMarker) selectedMarker.openPopup();
                }, shouldFly ? 450 : 50);
            }

            if (hud) {
                const barrio = obra.barrio && obra.barrio !== 'Sin barrio' ? ` · ${obra.barrio}` : '';
                hud.textContent = `WGS84: ${obra.lat.toFixed(4)}, ${obra.lng.toFixed(4)} · ${obra.comuna}${barrio}`;
            }
        }

        /**
         * ============================================================================
         * 6. RENDERIZADO DE UI (CAJITAS 1, 2 Y 3 + RESUMEN TOTAL DEL BACKEND)
         * ============================================================================
         */
        function renderBackendAuditSummary() {
            const total = datasetSheet.length;
            const geo = datasetSheet.filter(o => o.lat !== null).length;
            const counts = { NORMAL: 0, ALERTA: 0, CRITICO: 0 };
            const reglas = {};

            datasetSheet.forEach(o => {
                if (counts[o.severidad] !== undefined) counts[o.severidad]++;
                const regla = o.regla || 'SIN REGLA';
                reglas[regla] = (reglas[regla] || 0) + 1;
            });

            const fmt = n => n.toLocaleString('es-AR');
            const pctNum = n => total ? (100 * n) / total : 0;
            const pct = n => total ? `${pctNum(n).toFixed(1).replace('.', ',')}%` : '0%';

            const setText = (id, value) => {
                const el = document.getElementById(id);
                if (el) el.textContent = value;
            };

            setText('kpiTotal', fmt(total));
            setText('kpiNormal', fmt(counts.NORMAL));
            setText('kpiAlerta', fmt(counts.ALERTA));
            setText('kpiCritico', fmt(counts.CRITICO));

            const grid = document.getElementById('backendAuditGrid');
            if (grid) {
                const tiles = [
                    { label: 'Registros procesados', value: fmt(total), tone: 'text-white' },
                    { label: 'Geolocalizados', value: `${fmt(geo)} (${pct(geo)})`, tone: 'text-sky-300' },
                    { label: 'Normal', value: `${fmt(counts.NORMAL)} (${pct(counts.NORMAL)})`, tone: 'text-emerald-300' },
                    { label: 'Alerta', value: `${fmt(counts.ALERTA)} (${pct(counts.ALERTA)})`, tone: 'text-amber-300' },
                    { label: 'Crítico', value: `${fmt(counts.CRITICO)} (${pct(counts.CRITICO)})`, tone: 'text-rose-300' },
                    { label: 'Sin geolocalizar', value: fmt(total - geo), tone: 'text-slate-400' }
                ];
                grid.innerHTML = tiles.map(t => `
                    <div class="rounded-lg bg-slate-900/80 border border-slate-800 px-2.5 py-2">
                        <span class="text-[10px] text-slate-400 block">${t.label}</span>
                        <strong class="text-sm font-mono ${t.tone}">${t.value}</strong>
                    </div>
                `).join('');
            }

            const barNormal = document.getElementById('barNormal');
            const barAlerta = document.getElementById('barAlerta');
            const barCritico = document.getElementById('barCritico');
            if (barNormal) barNormal.style.width = `${pctNum(counts.NORMAL).toFixed(2)}%`;
            if (barAlerta) barAlerta.style.width = `${pctNum(counts.ALERTA).toFixed(2)}%`;
            if (barCritico) barCritico.style.width = `${pctNum(counts.CRITICO).toFixed(2)}%`;

            const rulesEl = document.getElementById('backendAuditRules');
            if (rulesEl) {
                rulesEl.innerHTML = Object.entries(reglas)
                    .sort((a, b) => b[1] - a[1])
                    .map(([regla, n]) => `
                        <span class="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                            ${escapeHtmlSheet(regla)}: <strong class="text-white">${fmt(n)}</strong>
                        </span>
                    `).join('');
            }

            setText('backendAuditStatus', `${fmt(total)} registros auditados en ${Math.round(datasetAuditMs)} ms`);
        }

        function renderQuickTestCases() {
            const container = document.getElementById('quickCasesContainer');
            if (!container) return;
            container.innerHTML = '';

            if (!obrasEjemplo.length) {
                container.innerHTML = '<span class="text-xs text-slate-500">Cargando casos de ejemplo…</span>';
                return;
            }

            obrasEjemplo.forEach(({ obra, tag }) => {
                const audit = auditarObraSheet(obra);
                const isSelected = obra.uid === currentObraId;

                let dotColor = 'bg-emerald-400';
                let activeBorder = 'border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-slate-500';

                if (audit.nivelRiesgo === 'CRITICO') {
                    dotColor = 'bg-rose-500';
                    if (isSelected) activeBorder = 'border-rose-500 bg-rose-500/15 text-white shadow-md shadow-rose-500/10';
                } else if (audit.nivelRiesgo === 'ALERTA') {
                    dotColor = 'bg-amber-400';
                    if (isSelected) activeBorder = 'border-amber-500 bg-amber-500/15 text-white shadow-md shadow-amber-500/10';
                } else {
                    if (isSelected) activeBorder = 'border-emerald-500 bg-emerald-500/15 text-white shadow-md shadow-emerald-500/10';
                }

                const btn = document.createElement('button');
                btn.className = `shrink-0 px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition ${activeBorder}`;
                btn.innerHTML = `
                    <span class="w-2 h-2 rounded-full ${dotColor}"></span>
                    <span class="font-mono font-semibold">${escapeHtmlSheet(obra.calle)} ${escapeHtmlSheet(obra.altura)}</span>
                    <span class="text-[11px] opacity-75">(${escapeHtmlSheet(tag)})</span>
                `;
                btn.onclick = () => seleccionarObra(obra.uid, true);
                container.appendChild(btn);
            });
        }

        function seleccionarObra(obraUid, shouldFlyMap = true, animateSteps = false, abrirPopupMapa = true) {
            const obra = datasetSheet.find(o => o.uid === obraUid);
            if (!obra) return;

            currentObraId = obra.uid;
            const audit = auditarObraSheet(obra);

            // Re-render botones de casos de ejemplo para marcar el activo
            renderQuickTestCases();

            // --- ACTUALIZAR CAJITA 1: FICHA TÉCNICA Y MÉTRICAS IA ---
            document.getElementById('fichaExpediente').textContent = obra.expediente || 'Sin expediente';
            document.getElementById('fichaDomicilio').textContent = `${obra.calle} ${obra.altura}`.trim() || obra.direccion;
            document.getElementById('fichaBarrioComuna').textContent = obra.barrio && obra.barrio !== 'Sin barrio'
                ? `${obra.barrio} · ${obra.comuna}`
                : obra.comuna;
            document.getElementById('fichaTipoObra').textContent = obra.regla || 'Sin regla';
            document.getElementById('fichaSuperficie').textContent = `${obra.superficie.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m²`;
            document.getElementById('fichaAvo').textContent = obra.estado_actual || 'Sin estado';
            document.getElementById('fichaEstadoObra').textContent = obra.salud || 'Sin dato';

            // Badge de Estado en Cajita 1
            const fichaBadge = document.getElementById('fichaBadgeEstado');
            if (audit.nivelRiesgo === 'CRITICO') {
                fichaBadge.className = "self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-rose-500/15 text-rose-300 border border-rose-500/35";
                fichaBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span><span>${audit.diagnostico.badgeText}</span>`;
            } else if (audit.nivelRiesgo === 'ALERTA') {
                fichaBadge.className = "self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-amber-500/15 text-amber-300 border border-amber-500/35";
                fichaBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span><span>${audit.diagnostico.badgeText}</span>`;
            } else {
                fichaBadge.className = "self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-emerald-500/15 text-emerald-300 border border-emerald-500/35";
                fichaBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span>${audit.diagnostico.badgeText}</span>`;
            }

            // Red Neuronal 1: Probabilidad de Finalización
            const nn1ProbText = document.getElementById('nn1ProbText');
            const nn1ProbBar = document.getElementById('nn1ProbBar');
            const nn1Clasificacion = document.getElementById('nn1Clasificacion');

            nn1ProbText.textContent = `${obra.probabilidad.toFixed(1)}%`;
            nn1ProbBar.style.width = `${Math.max(0, Math.min(100, obra.probabilidad))}%`;

            if (obra.probabilidad < 50) {
                nn1ProbText.className = "text-2xl font-extrabold font-mono text-rose-400";
                nn1ProbBar.className = "h-full rounded-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-700";
                nn1Clasificacion.className = "text-rose-300 font-semibold";
                nn1Clasificacion.textContent = "Clasificación: Alto Riesgo";
            } else if (obra.probabilidad < 85) {
                nn1ProbText.className = "text-2xl font-extrabold font-mono text-amber-400";
                nn1ProbBar.className = "h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700";
                nn1Clasificacion.className = "text-amber-300 font-semibold";
                nn1Clasificacion.textContent = "Clasificación: Observación";
            } else {
                nn1ProbText.className = "text-2xl font-extrabold font-mono text-emerald-400";
                nn1ProbBar.className = "h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700";
                nn1Clasificacion.className = "text-emerald-300 font-semibold";
                nn1Clasificacion.textContent = "Clasificación: Viable";
            }

            // Red Neuronal 2: Avance Físico vs Presupuesto
            document.getElementById('avanceFisicoVal').textContent = `${obra.avanceFisico.toFixed(1)}%`;
            document.getElementById('avanceFisicoBar').style.width = `${Math.max(0, Math.min(100, obra.avanceFisico))}%`;
            document.getElementById('avanceFinancieroVal').textContent = `${obra.avanceFinanciero.toFixed(1)}%`;
            document.getElementById('avanceFinancieroBar').style.width = `${Math.max(0, Math.min(100, obra.avanceFinanciero))}%`;

            const desfBadge = document.getElementById('desfasajeBadge');
            const desfBar = document.getElementById('avanceFinancieroBar');
            if (audit.desfasaje > 15) {
                desfBadge.className = "px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40";
                desfBadge.textContent = `Δ ${audit.desfasaje.toFixed(1)}% (>15% CRÍTICO)`;
                desfBar.className = "h-full bg-rose-500 bg-stripes rounded-full transition-all duration-700";
            } else if (audit.desfasaje > 5) {
                desfBadge.className = "px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35";
                desfBadge.textContent = `Δ ${audit.desfasaje.toFixed(1)}% (DESVÍO LEVE)`;
                desfBar.className = "h-full bg-amber-400 rounded-full transition-all duration-700";
            } else {
                desfBadge.className = "px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30";
                desfBadge.textContent = `Δ ${audit.desfasaje.toFixed(1)}% (OK)`;
                desfBar.className = "h-full bg-indigo-400 rounded-full transition-all duration-700";
            }

            // --- ACTUALIZAR CAJITA 2: MOTOR DE INFERENCIA EN TIEMPO REAL ---
            const hechosContainer = document.getElementById('hechosInicialesContainer');
            hechosContainer.innerHTML = audit.hechos.map(h => `
                <span class="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-slate-800 font-mono text-[11px] text-sky-300">
                    ${escapeHtmlSheet(h)}
                </span>
            `).join('');

            const reglasContainer = document.getElementById('reglasInferenciaContainer');
            reglasContainer.innerHTML = '';

            audit.reglasEvaluadas.forEach((regla, idx) => {
                let cardStyle = "border-emerald-500/25 bg-emerald-950/15";
                let iconName = "check-circle-2";
                let iconColor = "text-emerald-400";
                let badgeText = "PASÓ";
                let badgeStyle = "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";

                if (regla.estado === "alerta") {
                    cardStyle = "border-amber-500/35 bg-amber-950/20";
                    iconName = "alert-triangle";
                    iconColor = "text-amber-400";
                    badgeText = "ADVERTENCIA";
                    badgeStyle = "bg-amber-500/15 text-amber-300 border-amber-500/30";
                } else if (regla.estado === "critico") {
                    cardStyle = "border-rose-500/40 bg-rose-950/25";
                    iconName = "x-octagon";
                    iconColor = "text-rose-400";
                    badgeText = "DESVÍO CRÍTICO";
                    badgeStyle = "bg-rose-500/20 text-rose-300 border-rose-500/40";
                } else if (regla.estado === "info") {
                    cardStyle = "border-sky-500/30 bg-sky-950/20";
                    iconName = "info";
                    iconColor = "text-sky-400";
                    badgeText = "PREVENTIVO";
                    badgeStyle = "bg-sky-500/15 text-sky-300 border-sky-500/30";
                }

                const stepDiv = document.createElement('div');
                stepDiv.className = `rounded-xl border p-3.5 transition-all ${cardStyle} ${animateSteps ? 'opacity-0 translate-y-2' : 'animate-fade-in'}`;
                stepDiv.innerHTML = `
                    <div class="flex items-start gap-3">
                        <i data-lucide="${iconName}" class="w-5 h-5 ${iconColor} shrink-0 mt-0.5"></i>
                        <div class="flex-1 min-w-0 space-y-1">
                            <div class="flex items-center justify-between gap-2 flex-wrap">
                                <span class="font-mono text-xs font-bold text-white">${regla.id}</span>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeStyle}">
                                    ${badgeText}
                                </span>
                            </div>
                            <div class="font-mono text-[11px] sm:text-xs text-slate-300 break-words">
                                <span class="text-sky-400 font-semibold">${escapeHtmlSheet(regla.condicion)}</span>
                                <span class="text-slate-400"> &rarr; </span>
                                <span class="text-slate-100">${escapeHtmlSheet(regla.accion)}</span>
                            </div>
                            <p class="text-xs text-slate-400">${escapeHtmlSheet(regla.detalle)}</p>
                        </div>
                    </div>
                `;
                reglasContainer.appendChild(stepDiv);

                if (animateSteps) {
                    setTimeout(() => {
                        stepDiv.classList.remove('opacity-0', 'translate-y-2');
                        stepDiv.classList.add('opacity-100', 'translate-y-0');
                    }, idx * 140);
                }
            });

            // --- ACTUALIZAR CAJITA 3: CONCLUSIONES Y DIAGNÓSTICO ---
            const cajita3 = document.getElementById('cajita3');
            const diagIconWrapper = document.getElementById('diagIconWrapper');
            const diagTitulo = document.getElementById('diagTitulo');
            const diagExplicacion = document.getElementById('diagExplicacion');
            const diagAccion = document.getElementById('diagAccion');

            diagTitulo.textContent = audit.diagnostico.titulo;
            diagExplicacion.textContent = audit.diagnostico.explicacion;
            diagAccion.textContent = audit.diagnostico.accion;

            if (audit.nivelRiesgo === 'CRITICO') {
                cajita3.className = "glass-card rounded-2xl p-5 sm:p-6 space-y-4 border-l-4 border-l-rose-500";
                diagIconWrapper.className = "w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/35 flex items-center justify-center text-rose-400 shrink-0";
                diagIconWrapper.innerHTML = `<i data-lucide="shield-alert" class="w-6 h-6"></i>`;
            } else if (audit.nivelRiesgo === 'ALERTA') {
                cajita3.className = "glass-card rounded-2xl p-5 sm:p-6 space-y-4 border-l-4 border-l-amber-500";
                diagIconWrapper.className = "w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center text-amber-400 shrink-0";
                diagIconWrapper.innerHTML = `<i data-lucide="alert-circle" class="w-6 h-6"></i>`;
            } else {
                cajita3.className = "glass-card rounded-2xl p-5 sm:p-6 space-y-4 border-l-4 border-l-emerald-500";
                diagIconWrapper.className = "w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-emerald-400 shrink-0";
                diagIconWrapper.innerHTML = `<i data-lucide="shield-check" class="w-6 h-6"></i>`;
            }

            // Re-inicializar íconos Lucide recién inyectados
            lucide.createIcons();

            // --- ENFOCAR MAPA CABA ---
            focusMapOnObra(obra, audit, shouldFlyMap, abrirPopupMapa);
        }

        /**
         * ============================================================================
         * 7. BUSCADOR INTELIGENTE POR EXPEDIENTE Y DIRECCIÓN (DATASET COMPLETO)
         * ============================================================================
         */
        function initSearchSystem() {
            const inputExp = document.getElementById('searchExpediente');
            const inputDir = document.getElementById('searchDireccion');
            const clearExpBtn = document.getElementById('clearExpBtn');
            const clearDirBtn = document.getElementById('clearDirBtn');
            const btnAuditar = document.getElementById('btnAuditarBusqueda');
            const resultsBar = document.getElementById('searchResultsBar');
            const resultsList = document.getElementById('searchResultsList');
            const matchCount = document.getElementById('searchMatchCount');
            const closeResults = document.getElementById('closeSearchResults');

            const MAX_RESULTS = 30;

            function normalizeStr(str) {
                return String(str ?? '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            }

            function performLiveSearch(autoSelectFirst = false) {
                const qExp = normalizeStr(inputExp.value);
                const qDir = normalizeStr(inputDir.value);

                clearExpBtn.classList.toggle('hidden', qExp.length === 0);
                clearDirBtn.classList.toggle('hidden', qDir.length === 0);

                if (!qExp && !qDir) {
                    resultsBar.classList.add('hidden');
                    return;
                }

                resultsBar.classList.remove('hidden');

                if (!datasetSheet.length) {
                    matchCount.textContent = 'Cargando obras publicadas…';
                    resultsList.innerHTML = '';
                    return;
                }

                const matches = datasetSheet.filter(obra => {
                    const expNorm = normalizeStr(obra.expediente);
                    const dirNorm = normalizeStr(`${obra.calle} ${obra.altura} ${obra.direccion} ${obra.barrio} ${obra.comuna}`);

                    const matchE = qExp ? expNorm.includes(qExp) : true;
                    const matchD = qDir ? dirNorm.includes(qDir) : true;
                    return matchE && matchD;
                });

                if (matches.length === 0) {
                    matchCount.innerHTML = `<span class="text-rose-400 font-semibold">No se encontraron obras con esos criterios. Probá con "32845307", "PERU 1560" o "FITZ ROY".</span>`;
                    resultsList.innerHTML = '';
                    return;
                }

                matchCount.textContent = `Coincidencias encontradas (${matches.length.toLocaleString('es-AR')})${matches.length > MAX_RESULTS ? ` · mostrando ${MAX_RESULTS}` : ''}:`;

                resultsList.innerHTML = matches.slice(0, MAX_RESULTS).map(m => {
                    const badgeCls = m.severidad === 'CRITICO'
                        ? 'text-rose-400 bg-rose-500/15'
                        : (m.severidad === 'ALERTA' ? 'text-amber-400 bg-amber-500/15' : 'text-emerald-400 bg-emerald-500/15');

                    return `
                        <button
                            type="button"
                            data-uid="${m.uid}"
                            class="search-item-btn text-left p-2.5 rounded-xl bg-slate-950/90 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 transition flex flex-col justify-between gap-1"
                        >
                            <div class="flex items-center justify-between gap-2 w-full">
                                <span class="text-xs font-bold text-white truncate">${escapeHtmlSheet(m.calle)} ${escapeHtmlSheet(m.altura)}</span>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${badgeCls}">${m.severidad}</span>
                            </div>
                            <span class="text-[11px] font-mono text-sky-300 truncate">${escapeHtmlSheet(m.expediente)}</span>
                            <span class="text-[10px] text-slate-400">${escapeHtmlSheet(m.comuna)} · ${m.superficie.toLocaleString('es-AR')} m²</span>
                        </button>
                    `;
                }).join('');

                document.querySelectorAll('.search-item-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const uid = btn.getAttribute('data-uid');
                        seleccionarObra(uid, true, true);
                        resultsBar.classList.add('hidden');
                    });
                });

                if (autoSelectFirst && matches.length > 0) {
                    seleccionarObra(matches[0].uid, true, true);
                    resultsBar.classList.add('hidden');
                }
            }

            inputExp.addEventListener('input', () => performLiveSearch(false));
            inputDir.addEventListener('input', () => performLiveSearch(false));

            inputExp.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') performLiveSearch(true);
            });
            inputDir.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') performLiveSearch(true);
            });

            btnAuditar.addEventListener('click', () => performLiveSearch(true));

            clearExpBtn.addEventListener('click', () => {
                inputExp.value = '';
                performLiveSearch(false);
            });
            clearDirBtn.addEventListener('click', () => {
                inputDir.value = '';
                performLiveSearch(false);
            });
            closeResults.addEventListener('click', () => {
                resultsBar.classList.add('hidden');
            });
        }

        /**
         * ============================================================================
         * 8. CAJITA 5: AGRADECIMIENTOS DEL GRUPO 1
         * ============================================================================
         */
        const DEFAULT_AGRADECIMIENTOS = `Como integrantes del Grupo 1 (Gabriel Leon, Guillermo Hernandez, Lucía Herrera, Derek Reyes y Ezequiel Berterame), queremos expresar nuestro más sincero agradecimiento al docente de la materia "Desarrollo de Sistemas de IA" del IFTS N° 33 por su guía constante, exigencia académica y acompañamiento durante todo el cuatrimestre.

A lo largo de este Trabajo Práctico Final logramos integrar de manera tangible los pilares fundamentales de la Inteligencia Artificial moderna aplicada a la gestión pública de la Ciudad Autónoma de Buenos Aires: desde la rigurosa limpieza de datos y la prevención crítica del Data Leakage en los expedientes de la DGROC, pasando por el diseño de un Sistema Experto simbólico con encadenamiento hacia adelante (Forward Chaining), hasta el entrenamiento de modelos de Machine Learning (Regresión Logística y Árboles de Decisión) y Redes Neuronales profundas con TensorFlow/Keras, articulados en flujos de automatización inteligente con n8n.

Nos llevamos no solo herramientas técnicas de vanguardia, sino una metodología de trabajo colaborativo y pensamiento crítico para resolver problemáticas reales con impacto social.`;

        function initAgradecimientosSection() {
            const displayEl = document.getElementById('agradecimientosDisplay');
            if (!displayEl) return;

            const escapeHtml = (text) => {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            };

            displayEl.innerHTML = DEFAULT_AGRADECIMIENTOS
                .split('\n')
                .filter(p => p.trim().length > 0)
                .map(p => `<p>${escapeHtml(p)}</p>`)
                .join('');
        }

        /**
         * ============================================================================
         * 8.1 CAJITA 5 · BARRA DESPLEGABLE
         * La barra queda siempre visible; el contenido se abre/cierra con
         * data-open en #cajita5Content (animado desde css/styles.css).
         * ============================================================================
         */
        function initCajita5Toggle() {
            const btn = document.getElementById('btnToggleCajita5');
            const content = document.getElementById('cajita5Content');
            const chevron = document.getElementById('cajita5Chevron');
            const label = document.getElementById('cajita5ToggleLabel');
            if (!btn || !content) return;

            function setOpen(open) {
                content.setAttribute('data-open', open ? 'true' : 'false');
                btn.setAttribute('aria-expanded', open ? 'true' : 'false');
                if (chevron) chevron.classList.toggle('rotate-180', open);
                if (label) label.textContent = open ? 'Ocultar contenido' : 'Ver contenido';
            }

            btn.addEventListener('click', () => {
                setOpen(content.getAttribute('data-open') !== 'true');
            });

            setOpen(content.getAttribute('data-open') === 'true');
        }

        /**
         * ============================================================================
         * 9. INICIALIZACIÓN GLOBAL DE LA APLICACIÓN
         * ============================================================================
         */
        window.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
            initCabaMap();
            initSearchSystem();
            initAgradecimientosSection();
            initCajita5Toggle();

            // Botón para re-simular paso a paso el motor Forward Chaining
            document.getElementById('btnReEjecutarInferencia').addEventListener('click', () => {
                if (currentObraId) seleccionarObra(currentObraId, false, true);
            });

            // Botón para centrar nuevamente todo el mapa de CABA
            document.getElementById('btnResetMap').addEventListener('click', () => {
                if (map) {
                    map.flyTo([-34.6037, -58.3816], 12, { animate: true, duration: 1.0 });
                }
            });
        });
