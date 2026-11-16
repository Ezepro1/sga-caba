        /**
         * ============================================================================
         * 1. DATASET DE OBRAS EN CABA (REGISTROS REALES DEPURADOS SIN DATA LEAKAGE)
         * Coordenadas WGS84 verificadas en la Ciudad Autónoma de Buenos Aires
         * ============================================================================
         */
        const OBRAS_DATASET = [
            {
                id: "OB-01",
                etiquetaCaso: "Normal · Obra Mayor",
                expediente: "EX-2024-46877598- -GCABA-DGROC",
                calle: "DEL LIBERTADOR AV.",
                altura: 7055,
                barrio: "Núñez",
                comuna: "Comuna 13",
                lat: -34.5478,
                lng: -58.4632,
                tipoObra: "Obra Mayor",
                superficie: 2840.50,
                ultimoAvo: "AVO 3 - Estructura",
                estadoRegistral: "En Ejecución",
                permisoVencido: false,
                clausurada: false,
                paralizada: false,
                avanceFisico: 68.0,
                avanceFinanciero: 71.0,
                probExitoNN1: 91.4
            },
            {
                id: "OB-02",
                etiquetaCaso: "Crítico · Desfasaje Financiero",
                expediente: "EX-2024-31904821- -GCABA-DGROC",
                calle: "FITZ ROY",
                altura: 801,
                barrio: "Villa Crespo",
                comuna: "Comuna 15",
                lat: -34.5912,
                lng: -58.4428,
                tipoObra: "Obra Media",
                superficie: 1450.00,
                ultimoAvo: "AVO 2 - Excavación y Submuración",
                estadoRegistral: "En Ejecución",
                permisoVencido: false,
                clausurada: false,
                paralizada: false,
                avanceFisico: 34.0,
                avanceFinanciero: 66.5, // Desfasaje de 32.5% (> 15% umbral)
                probExitoNN1: 28.6
            },
            {
                id: "OB-03",
                etiquetaCaso: "Crítico · Clausura AGC",
                expediente: "EX-2023-28451902- -GCABA-DGROC",
                calle: "PERU",
                altura: 1560,
                barrio: "San Telmo",
                comuna: "Comuna 1",
                lat: -34.6254,
                lng: -58.3746,
                tipoObra: "Obra Mayor",
                superficie: 3120.00,
                ultimoAvo: "AVO 1 - Inicio de Obra",
                estadoRegistral: "Clausurada por Contravención",
                permisoVencido: false,
                clausurada: true,
                paralizada: false,
                avanceFisico: 22.0,
                avanceFinanciero: 45.0,
                probExitoNN1: 14.2
            },
            {
                id: "OB-04",
                etiquetaCaso: "Alerta · Superficie > 1000m²",
                expediente: "EX-2024-19283745- -GCABA-DGROC",
                calle: "CABILDO AV.",
                altura: 2450,
                barrio: "Belgrano",
                comuna: "Comuna 13",
                lat: -34.5594,
                lng: -58.4589,
                tipoObra: "Obra Mayor",
                superficie: 4680.75,
                ultimoAvo: "AVO 3 - Estructura",
                estadoRegistral: "En Ejecución",
                permisoVencido: false,
                clausurada: false,
                paralizada: false,
                avanceFisico: 55.0,
                avanceFinanciero: 58.0,
                probExitoNN1: 82.0
            },
            {
                id: "OB-05",
                etiquetaCaso: "Alerta · Permiso Vencido",
                expediente: "EX-2022-40918273- -GCABA-DGROC",
                calle: "CORRIENTES AV.",
                altura: 3240,
                barrio: "Balvanera",
                comuna: "Comuna 3",
                lat: -34.6039,
                lng: -58.4112,
                tipoObra: "Obra Media",
                superficie: 890.20,
                ultimoAvo: "AVO 2 - Demolición",
                estadoRegistral: "Permiso Vencido - Sin Renovación",
                permisoVencido: true,
                clausurada: false,
                paralizada: false,
                avanceFisico: 41.0,
                avanceFinanciero: 44.0,
                probExitoNN1: 54.5
            },
            {
                id: "OB-06",
                etiquetaCaso: "Crítico · Obra Paralizada",
                expediente: "EX-2023-11209384- -GCABA-DGROC",
                calle: "JUAN B. JUSTO AV.",
                altura: 4820,
                barrio: "Villa General Mitre",
                comuna: "Comuna 11",
                lat: -34.6062,
                lng: -58.4685,
                tipoObra: "Obra Mayor",
                superficie: 2190.00,
                ultimoAvo: "AVO 2 - Excavación",
                estadoRegistral: "Paralizada",
                permisoVencido: true,
                clausurada: false,
                paralizada: true,
                avanceFisico: 19.5,
                avanceFinanciero: 48.0,
                probExitoNN1: 18.9
            },
            {
                id: "OB-07",
                etiquetaCaso: "Normal · Obra Menor",
                expediente: "EX-2024-50129384- -GCABA-DGROC",
                calle: "GORRITI",
                altura: 4920,
                barrio: "Palermo",
                comuna: "Comuna 14",
                lat: -34.5881,
                lng: -58.4294,
                tipoObra: "Obra Menor",
                superficie: 420.00,
                ultimoAvo: "AVO 4 - Terminaciones",
                estadoRegistral: "En Ejecución",
                permisoVencido: false,
                clausurada: false,
                paralizada: false,
                avanceFisico: 86.0,
                avanceFinanciero: 88.5,
                probExitoNN1: 96.2
            },
            {
                id: "OB-08",
                etiquetaCaso: "Normal · Microobra",
                expediente: "EX-2024-44102938- -GCABA-DGROC",
                calle: "PEDRO GOYENA AV.",
                altura: 840,
                barrio: "Caballito",
                comuna: "Comuna 6",
                lat: -34.6248,
                lng: -58.4385,
                tipoObra: "Microobra",
                superficie: 215.40,
                ultimoAvo: "AVO 4 - Finalización",
                estadoRegistral: "En Ejecución",
                permisoVencido: false,
                clausurada: false,
                paralizada: false,
                avanceFisico: 92.0,
                avanceFinanciero: 90.0,
                probExitoNN1: 97.8
            },
            {
                id: "OB-09",
                etiquetaCaso: "Alerta · Gran Escala Puerto",
                expediente: "EX-2024-38765432- -GCABA-DGROC",
                calle: "JUANA MANSO",
                altura: 1180,
                barrio: "Puerto Madero",
                comuna: "Comuna 1",
                lat: -34.6115,
                lng: -58.3624,
                tipoObra: "Obra Mayor",
                superficie: 6450.00,
                ultimoAvo: "AVO 3 - Estructura",
                estadoRegistral: "En Ejecución",
                permisoVencido: false,
                clausurada: false,
                paralizada: false,
                avanceFisico: 61.0,
                avanceFinanciero: 64.5,
                probExitoNN1: 84.7
            },
            {
                id: "OB-10",
                etiquetaCaso: "Crítico · Desvío Presupuestario",
                expediente: "EX-2023-49812376- -GCABA-DGROC",
                calle: "RIVADAVIA AV.",
                altura: 6750,
                barrio: "Flores",
                comuna: "Comuna 7",
                lat: -34.6291,
                lng: -58.4612,
                tipoObra: "Obra Mayor",
                superficie: 1890.00,
                ultimoAvo: "AVO 2 - Submuración",
                estadoRegistral: "En Ejecución",
                permisoVencido: false,
                clausurada: false,
                paralizada: false,
                avanceFisico: 29.0,
                avanceFinanciero: 53.5, // Desfasaje 24.5%
                probExitoNN1: 33.4
            },
            {
                id: "OB-11",
                etiquetaCaso: "Normal · Residencial",
                expediente: "EX-2024-47291045- -GCABA-DGROC",
                calle: "ALVAREZ THOMAS AV.",
                altura: 1950,
                barrio: "Villa Ortúzar",
                comuna: "Comuna 15",
                lat: -34.5819,
                lng: -58.4661,
                tipoObra: "Obra Media",
                superficie: 780.60,
                ultimoAvo: "AVO 3 - Albañilería",
                estadoRegistral: "En Ejecución",
                permisoVencido: false,
                clausurada: false,
                paralizada: false,
                avanceFisico: 74.0,
                avanceFinanciero: 75.5,
                probExitoNN1: 93.1
            },
            {
                id: "OB-12",
                etiquetaCaso: "Alerta · Demolición > 1000m²",
                expediente: "EX-2024-29384756- -GCABA-DGROC",
                calle: "SANTA FE AV.",
                altura: 1845,
                barrio: "Recoleta",
                comuna: "Comuna 2",
                lat: -34.5956,
                lng: -58.3937,
                tipoObra: "Demolición Total / Obra Mayor",
                superficie: 1620.00,
                ultimoAvo: "AVO 1 - Demolición",
                estadoRegistral: "En Ejecución",
                permisoVencido: false,
                clausurada: false,
                paralizada: false,
                avanceFisico: 45.0,
                avanceFinanciero: 47.0,
                probExitoNN1: 79.5
            },
            {
                id: "OB-13",
                etiquetaCaso: "Normal · Rehabilitación",
                expediente: "EX-2024-41029381- -GCABA-DGROC",
                calle: "CASEROS AV.",
                altura: 2890,
                barrio: "Parque Patricios",
                comuna: "Comuna 4",
                lat: -34.6368,
                lng: -58.4045,
                tipoObra: "Obra Menor",
                superficie: 610.00,
                ultimoAvo: "AVO 3 - Instalaciones",
                estadoRegistral: "En Ejecución",
                permisoVencido: false,
                clausurada: false,
                paralizada: false,
                avanceFisico: 79.0,
                avanceFinanciero: 80.5,
                probExitoNN1: 94.0
            },
            {
                id: "OB-14",
                etiquetaCaso: "Crítico · Clausura + Desvío",
                expediente: "EX-2023-35647382- -GCABA-DGROC",
                calle: "BOEDO AV.",
                altura: 1120,
                barrio: "Boedo",
                comuna: "Comuna 5",
                lat: -34.6264,
                lng: -58.4165,
                tipoObra: "Obra Media",
                superficie: 1150.00,
                ultimoAvo: "AVO 1 - Excavación",
                estadoRegistral: "Clausurada - Intimación Vigente",
                permisoVencido: true,
                clausurada: true,
                paralizada: true,
                avanceFisico: 15.0,
                avanceFinanciero: 42.0,
                probExitoNN1: 11.8
            }
        ];

        /**
         * ============================================================================
         * 2. MOTOR DE INFERENCIA HÍBRIDO (FORWARD CHAINING + REDES NEURONALES)
         * Evalúa hechos iniciales, aplica reglas SI -> ENTONCES y determina severidad
         * ============================================================================
         */
        function auditarExpediente(obra) {
            const desfasaje = Math.abs(obra.avanceFinanciero - obra.avanceFisico);
            const desfasajeConSigno = +(obra.avanceFinanciero - obra.avanceFisico).toFixed(1);
            
            // Base de Hechos Iniciales (Working Memory)
            const hechos = [
                `tipo_obra("${obra.tipoObra}")`,
                `superficie_m2(${obra.superficie})`,
                `ultimo_avo("${obra.ultimoAvo}")`,
                `prob_nn1(${obra.probExitoNN1}%)`,
                `delta_financiero_fisico(${desfasajeConSigno > 0 ? '+' : ''}${desfasajeConSigno}%)`,
                `permiso_vencido(${obra.permisoVencido ? 'VERDADERO' : 'FALSO'})`,
                `estado_clausura(${obra.clausurada ? 'ACTIVA' : 'NINGUNA'})`
            ];

            const reglasEvaluadas = [];
            let nivelRiesgo = "NORMAL"; // NORMAL | ALERTA | CRITICO

            // REGLA R1: Verificación de Clausura o Paralización Registral
            if (obra.clausurada || obra.paralizada) {
                nivelRiesgo = "CRITICO";
                reglasEvaluadas.push({
                    id: "R1-CONTRAVENCION",
                    estado: "critico",
                    condicion: `SI (clausurada == ${obra.clausurada} O paralizada == ${obra.paralizada})`,
                    accion: `ENTONCES disparar ALERTA_CRITICA_AGC y bloquear certificación de avance.`,
                    detalle: `Se detecta irregularidad grave en estado registral (${obra.estadoRegistral}).`
                });
            } else {
                reglasEvaluadas.push({
                    id: "R1-CONTRAVENCION",
                    estado: "ok",
                    condicion: `SI (clausurada == FALSO Y paralizada == FALSO)`,
                    accion: `ENTONCES validar continuidad operativa legal ante DGROC.`,
                    detalle: `Sin clausuras preventivas ni paralizaciones vigentes en el expediente.`
                });
            }

            // REGLA R2: Coherencia Física vs Financiera (Red Neuronal 2 - Umbral 15%)
            if (desfasaje > 15.0) {
                nivelRiesgo = "CRITICO";
                reglasEvaluadas.push({
                    id: "R2-DESFASAJE-NN2",
                    estado: "critico",
                    condicion: `SI (|Presupuesto_Ejecutado (${obra.avanceFinanciero}%) - Avance_Físico (${obra.avanceFisico}%)| = ${desfasaje.toFixed(1)}% > 15.0%)`,
                    accion: `ENTONCES inferir DESVIACION_FINANCIERA_SEVERA y solicitar auditoría contable/técnica.`,
                    detalle: `El gasto ejecutado supera en ${desfasaje.toFixed(1)} puntos al avance físico real predicho por NN2.`
                });
            } else {
                reglasEvaluadas.push({
                    id: "R2-DESFASAJE-NN2",
                    estado: "ok",
                    condicion: `SI (|Presupuesto (${obra.avanceFinanciero}%) - Físico (${obra.avanceFisico}%)| = ${desfasaje.toFixed(1)}% <= 15.0%)`,
                    accion: `ENTONCES confirmar EQUILIBRIO_FISICO_FINANCIERO.`,
                    detalle: `La curva de inversión acompaña proporcionalmente el progreso físico de la obra.`
                });
            }

            // REGLA R3: Evaluación de Superficie (> 1000 m² requiere fiscalización reforzada)
            if (obra.superficie > 1000) {
                if (nivelRiesgo === "NORMAL") nivelRiesgo = "ALERTA";
                reglasEvaluadas.push({
                    id: "R3-ENVERGADURA-M2",
                    estado: "alerta",
                    condicion: `SI (superficie_m2 (${obra.superficie.toLocaleString('es-AR')} m²) > 1.000 m²)`,
                    accion: `ENTONCES asignar PROTOCOLO_GRAN_ENVERGADURA (Inspección de Seguridad e Higiene obligatoria).`,
                    detalle: `Por superar los 1.000 m², la normativa CABA exige control estructural y plan de impacto.`
                });
            } else {
                reglasEvaluadas.push({
                    id: "R3-ENVERGADURA-M2",
                    estado: "ok",
                    condicion: `SI (superficie_m2 (${obra.superficie.toLocaleString('es-AR')} m²) <= 1.000 m²)`,
                    accion: `ENTONCES aplicar régimen estándar de verificación por escala.`,
                    detalle: `Superficie dentro del umbral estándar para obras menores/medias.`
                });
            }

            // REGLA R4: Vigencia Administrativa del Permiso de Obra
            if (obra.permisoVencido) {
                if (nivelRiesgo === "NORMAL") nivelRiesgo = "ALERTA";
                reglasEvaluadas.push({
                    id: "R4-VIGENCIA-PERMISO",
                    estado: "alerta",
                    condicion: `SI (permiso_vencido == VERDADERO)`,
                    accion: `ENTONCES emitir INTIMACION_PRORROGA_DGROC (Plazo 15 días hábiles).`,
                    detalle: `El plazo administrativo del permiso requiere actualización o presentación de prórroga.`
                });
            } else {
                reglasEvaluadas.push({
                    id: "R4-VIGENCIA-PERMISO",
                    estado: "ok",
                    condicion: `SI (permiso_vencido == FALSO)`,
                    accion: `ENTONCES validar vigencia administrativa del legajo.`,
                    detalle: `Permiso de obra activo y dentro de los plazos reglamentarios.`
                });
            }

            // REGLA R5: Umbral de Confianza de Red Neuronal 1 / Regresión Logística
            if (obra.probExitoNN1 < 50.0) {
                nivelRiesgo = "CRITICO";
                reglasEvaluadas.push({
                    id: "R5-SCORE-NN1",
                    estado: "critico",
                    condicion: `SI (Prob_Exito_NN1 (${obra.probExitoNN1}%) < 50.0%)`,
                    accion: `ENTONCES clasificar EXPEDIENTE_ALTO_RIESGO en tablero de prioridades.`,
                    detalle: `Los patrones aprendidos por la Red Neuronal indican alta probabilidad de conflicto o demora.`
                });
            } else if (obra.probExitoNN1 < 85.0) {
                if (nivelRiesgo === "NORMAL") nivelRiesgo = "ALERTA";
                reglasEvaluadas.push({
                    id: "R5-SCORE-NN1",
                    estado: "alerta",
                    condicion: `SI (50.0% <= Prob_Exito_NN1 (${obra.probExitoNN1}%) < 85.0%)`,
                    accion: `ENTONCES programar seguimiento preventivo trimestral.`,
                    detalle: `Probabilidad moderada-alta; requiere monitoreo por complejidad o antigüedad del trámite.`
                });
            } else {
                reglasEvaluadas.push({
                    id: "R5-SCORE-NN1",
                    estado: "ok",
                    condicion: `SI (Prob_Exito_NN1 (${obra.probExitoNN1}%) >= 85.0%)`,
                    accion: `ENTONCES certificar CONFORMIDAD_PREDICTIVA_OPTIMA.`,
                    detalle: `Alta probabilidad de finalización exitosa sin desvíos relevantes.`
                });
            }

            // Construcción de Conclusiones y Diagnóstico Ejecutivo (Cajita 3)
            let diagnostico = {};
            if (nivelRiesgo === "CRITICO") {
                const motivos = [];
                if (obra.clausurada) motivos.push("clausura vigente por contravención");
                if (obra.paralizada) motivos.push("paralización operativa declarada");
                if (desfasaje > 15) motivos.push(`desfasaje financiero/físico crítico del ${desfasaje.toFixed(1)}% (supera el umbral del 15%)`);
                if (obra.probExitoNN1 < 50) motivos.push(`baja probabilidad de conformidad en NN1 (${obra.probExitoNN1}%)`);

                diagnostico = {
                    nivel: "CRITICO",
                    badgeText: "ESTADO CRÍTICO",
                    titulo: "Dictamen Crítico: Intervención Prioritaria Requerida",
                    explicacion: `El sistema híbrido detectó anomalías severas asociadas a ${motivos.join(", ")}. La combinación entre la inferencia neuronal y las reglas de control DGROC evidencia un riesgo alto que impide la validación automática del expediente.`,
                    accion: "Disponer inspección presencial urgente de la Agencia Gubernamental de Control (AGC), auditar certificaciones de obra y suspender nuevas aprobaciones hasta regularizar el desfasaje o levantamiento de clausura."
                };
            } else if (nivelRiesgo === "ALERTA") {
                const motivosAlerta = [];
                if (obra.superficie > 1000) motivosAlerta.push(`superficie de gran envergadura (${obra.superficie.toLocaleString('es-AR')} m² > 1.000 m²)`);
                if (obra.permisoVencido) motivosAlerta.push("vencimiento del plazo administrativo del permiso");
                if (obra.probExitoNN1 < 85) motivosAlerta.push(`score preventivo NN1 del ${obra.probExitoNN1}%`);

                diagnostico = {
                    nivel: "ALERTA",
                    badgeText: "ALERTA PREVENTIVA",
                    titulo: "Dictamen de Alerta: Monitoreo y Verificación Especial",
                    explicacion: `Si bien no existe un desfasaje financiero crítico entre avance físico (${obra.avanceFisico}%) y presupuestario (${obra.avanceFinanciero}%), el motor de reglas activó alertas preventivas por ${motivosAlerta.join(" y ")}.`,
                    accion: obra.permisoVencido 
                        ? "Notificar al Director de Obra para presentar renovación/prórroga de permiso ante DGROC dentro de los próximos 15 días hábiles y verificar libro de obra."
                        : "Asignar auditoría técnica programada de seguridad en obra mayor (>1.000 m²) y validar documentación del último AVO declarado."
                };
            } else {
                diagnostico = {
                    nivel: "NORMAL",
                    badgeText: "ESTADO NORMAL",
                    titulo: "Dictamen Favorable: Obra en Parámetros Normales",
                    explicacion: `Tanto los modelos de aprendizaje profundo (NN1: ${obra.probExitoNN1}% de éxito) como el motor simbólico Forward Chaining confirman una ejecución saludable. Existe plena coherencia entre el avance físico (${obra.avanceFisico}%) y el presupuesto ejecutado (${obra.avanceFinanciero}%), sin infracciones ni vencimientos.`,
                    accion: "Mantener el flujo habitual de seguimiento digital mediante n8n y aprobar la continuidad del cronograma de AVO sin necesidad de inspección extraordinaria."
                };
            }

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
         * 3. GESTIÓN DEL MAPA LEAFLET DE CABA CON PUNTOS LED PULSANTES
         * ============================================================================
         */
        let map = null;
        let markersById = {};
        let currentObraId = OBRAS_DATASET[0].id;

        /**
         * ============================================================================
         * BASEMAP DEL MAPA
         * CARTO ahora exige una API key válida: sin key (o con una key falsa como
         * "YOUR_KEY") devuelve tiles vacíos, por eso el mapa se veía en blanco.
         *
         * - Si pegás una API key real de CARTO acá abajo, se usa CARTO Voyager.
         * - Si no hay key, se usa Esri World Street Map (gratis, sin key, similar a
         *   Voyager) y, si fallara, cae automáticamente a OpenStreetMap.
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

            // Renderizar cada obra con un marcador LED pulsante
            OBRAS_DATASET.forEach(obra => {
                const audit = auditarExpediente(obra);
                const statusClass = audit.nivelRiesgo === 'CRITICO' 
                    ? 'led-critico' 
                    : (audit.nivelRiesgo === 'ALERTA' ? 'led-alerta' : 'led-normal');

                const customIcon = L.divIcon({
                    className: 'custom-led-div-icon',
                    html: `
                        <div id="marker-wrapper-${obra.id}" class="led-marker-wrapper ${statusClass} ${obra.id === currentObraId ? 'led-active' : ''}">
                            <div class="led-ring"></div>
                            <div class="led-core"></div>
                        </div>
                    `,
                    iconSize: [36, 36],
                    iconAnchor: [18, 18],
                    popupAnchor: [0, -16]
                });

                const marker = L.marker([obra.lat, obra.lng], { icon: customIcon }).addTo(map);

                const badgeColor = audit.nivelRiesgo === 'CRITICO' 
                    ? 'text-rose-400 bg-rose-500/15 border-rose-500/30' 
                    : (audit.nivelRiesgo === 'ALERTA' ? 'text-amber-400 bg-amber-500/15 border-amber-500/30' : 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30');

                const popupHtml = `
                    <div class="p-1 min-w-[220px] space-y-2">
                        <div class="flex items-center justify-between gap-2">
                            <span class="text-[10px] font-mono text-slate-400">${obra.id} · ${obra.barrio}</span>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}">
                                ${audit.diagnostico.badgeText}
                            </span>
                        </div>
                        <div>
                            <div class="text-xs font-bold text-white">${obra.calle} ${obra.altura}</div>
                            <div class="text-[11px] font-mono text-sky-300 mt-0.5">${obra.expediente}</div>
                        </div>
                        <div class="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-700/70 text-[11px]">
                            <div>
                                <span class="text-slate-400 block">Superficie:</span>
                                <strong class="text-slate-200">${obra.superficie.toLocaleString('es-AR')} m²</strong>
                            </div>
                            <div>
                                <span class="text-slate-400 block">Éxito NN1:</span>
                                <strong class="text-slate-200">${obra.probExitoNN1}%</strong>
                            </div>
                        </div>
                    </div>
                `;

                marker.bindPopup(popupHtml);

                // Al hacer clic en un punto del mapa, auditar esa obra directamente
                marker.on('click', () => {
                    seleccionarObra(obra.id, false);
                });

                markersById[obra.id] = marker;
            });
        }

        function focusMapOnObra(obra, shouldFly = true) {
            if (!map) return;

            // Actualizar clase activa en todos los marcadores LED
            OBRAS_DATASET.forEach(item => {
                const el = document.getElementById(`marker-wrapper-${item.id}`);
                if (el) {
                    if (item.id === obra.id) {
                        el.classList.add('led-active');
                    } else {
                        el.classList.remove('led-active');
                    }
                }
            });

            const marker = markersById[obra.id];
            if (marker) {
                if (shouldFly) {
                    map.flyTo([obra.lat, obra.lng], 15, {
                        animate: true,
                        duration: 1.1
                    });
                }
                setTimeout(() => {
                    marker.openPopup();
                }, shouldFly ? 450 : 50);
            }

            // Actualizar HUD de coordenadas
            const hud = document.getElementById('mapCoordsHud');
            if (hud) {
                hud.textContent = `WGS84: ${obra.lat.toFixed(4)}, ${obra.lng.toFixed(4)} · ${obra.barrio} (${obra.comuna})`;
            }
        }

        /**
         * ============================================================================
         * 4. RENDERIZADO DE UI (CAJITAS 1, 2 Y 3 + BOTONES DE CASOS DE PRUEBA)
         * ============================================================================
         */
        function renderQuickTestCases() {
            const container = document.getElementById('quickCasesContainer');
            container.innerHTML = '';

            // Contar KPIs globales
            let countNormal = 0, countAlerta = 0, countCritico = 0;

            OBRAS_DATASET.forEach(obra => {
                const audit = auditarExpediente(obra);
                if (audit.nivelRiesgo === 'NORMAL') countNormal++;
                else if (audit.nivelRiesgo === 'ALERTA') countAlerta++;
                else countCritico++;

                const isSelected = obra.id === currentObraId;
                
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
                    <span class="font-mono font-semibold">${obra.calle.split(' ')[0]} ${obra.altura}</span>
                    <span class="text-[11px] opacity-75">(${obra.etiquetaCaso.split('·')[0].trim()})</span>
                `;
                btn.onclick = () => seleccionarObra(obra.id, true);
                container.appendChild(btn);
            });

            document.getElementById('kpiTotal').textContent = OBRAS_DATASET.length;
            document.getElementById('kpiNormal').textContent = countNormal;
            document.getElementById('kpiAlerta').textContent = countAlerta;
            document.getElementById('kpiCritico').textContent = countCritico;
        }

        function seleccionarObra(obraId, shouldFlyMap = true, animateSteps = false) {
            const obra = OBRAS_DATASET.find(o => o.id === obraId) || OBRAS_DATASET[0];
            currentObraId = obra.id;

            const audit = auditarExpediente(obra);

            // Re-render botones de casos rápidos para marcar el activo
            renderQuickTestCases();

            // --- ACTUALIZAR CAJITA 1: FICHA TÉCNICA Y MÉTRICAS IA ---
            document.getElementById('fichaExpediente').textContent = obra.expediente;
            document.getElementById('fichaDomicilio').textContent = `${obra.calle} ${obra.altura}`;
            document.getElementById('fichaBarrioComuna').textContent = `${obra.barrio} · ${obra.comuna}`;
            document.getElementById('fichaTipoObra').textContent = obra.tipoObra;
            document.getElementById('fichaSuperficie').textContent = `${obra.superficie.toLocaleString('es-AR', { minimumFractionDigits: 2 })} m²`;
            document.getElementById('fichaAvo').textContent = obra.ultimoAvo;
            document.getElementById('fichaEstadoObra').textContent = obra.estadoRegistral;

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

            // Red Neuronal 1: Probabilidad de Éxito
            const nn1ProbText = document.getElementById('nn1ProbText');
            const nn1ProbBar = document.getElementById('nn1ProbBar');
            const nn1Clasificacion = document.getElementById('nn1Clasificacion');

            nn1ProbText.textContent = `${obra.probExitoNN1.toFixed(1)}%`;
            nn1ProbBar.style.width = `${obra.probExitoNN1}%`;

            if (obra.probExitoNN1 < 50) {
                nn1ProbText.className = "text-2xl font-extrabold font-mono text-rose-400";
                nn1ProbBar.className = "h-full rounded-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-700";
                nn1Clasificacion.className = "text-rose-300 font-semibold";
                nn1Clasificacion.textContent = "Clasificación: Alto Riesgo";
            } else if (obra.probExitoNN1 < 85) {
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
            document.getElementById('avanceFisicoBar').style.width = `${obra.avanceFisico}%`;
            document.getElementById('avanceFinancieroVal').textContent = `${obra.avanceFinanciero.toFixed(1)}%`;
            document.getElementById('avanceFinancieroBar').style.width = `${obra.avanceFinanciero}%`;

            const desfBadge = document.getElementById('desfasajeBadge');
            const desfBar = document.getElementById('avanceFinancieroBar');
            if (audit.desfasaje > 15) {
                desfBadge.className = "px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40";
                desfBadge.textContent = `Δ ${audit.desfasaje.toFixed(1)}% (>15% CRÍTICO)`;
                desfBar.className = "h-full bg-rose-500 bg-stripes rounded-full transition-all duration-700";
            } else {
                desfBadge.className = "px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30";
                desfBadge.textContent = `Δ ${audit.desfasaje.toFixed(1)}% (OK)`;
                desfBar.className = "h-full bg-indigo-400 rounded-full transition-all duration-700";
            }

            // --- ACTUALIZAR CAJITA 2: MOTOR DE INFERENCIA EN TIEMPO REAL ---
            const hechosContainer = document.getElementById('hechosInicialesContainer');
            hechosContainer.innerHTML = audit.hechos.map(h => `
                <span class="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-slate-800 font-mono text-[11px] text-sky-300">
                    ${h}
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
                                <span class="text-sky-400 font-semibold">${regla.condicion}</span>
                                <span class="text-slate-400"> &rarr; </span>
                                <span class="text-slate-100">${regla.accion}</span>
                            </div>
                            <p class="text-xs text-slate-400">${regla.detalle}</p>
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
            focusMapOnObra(obra, shouldFlyMap);
        }

        /**
         * ============================================================================
         * 5. BUSCADOR INTELIGENTE POR EXPEDIENTE Y DIRECCIÓN
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

            function normalizeStr(str) {
                return str.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
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

                const matches = OBRAS_DATASET.filter(obra => {
                    const expNorm = normalizeStr(obra.expediente);
                    const dirNorm = normalizeStr(`${obra.calle} ${obra.altura} ${obra.barrio}`);
                    
                    const matchE = qExp ? expNorm.includes(qExp) : true;
                    const matchD = qDir ? dirNorm.includes(qDir) : true;
                    return matchE && matchD;
                });

                resultsBar.classList.remove('hidden');

                if (matches.length === 0) {
                    matchCount.innerHTML = `<span class="text-rose-400 font-semibold">No se encontraron expedientes con esos criterios. Probá con "46877598", "FITZ ROY" o "PERU".</span>`;
                    resultsList.innerHTML = '';
                    return;
                }

                matchCount.textContent = `Coincidencias encontradas (${matches.length}):`;
                resultsList.innerHTML = matches.map(m => {
                    const audit = auditarExpediente(m);
                    const badgeCls = audit.nivelRiesgo === 'CRITICO' 
                        ? 'text-rose-400 bg-rose-500/15' 
                        : (audit.nivelRiesgo === 'ALERTA' ? 'text-amber-400 bg-amber-500/15' : 'text-emerald-400 bg-emerald-500/15');
                    
                    return `
                        <button 
                            type="button"
                            data-id="${m.id}"
                            class="search-item-btn text-left p-2.5 rounded-xl bg-slate-950/90 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 transition flex flex-col justify-between gap-1"
                        >
                            <div class="flex items-center justify-between gap-2 w-full">
                                <span class="text-xs font-bold text-white truncate">${m.calle} ${m.altura}</span>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${badgeCls}">${audit.nivelRiesgo}</span>
                            </div>
                            <span class="text-[11px] font-mono text-sky-300 truncate">${m.expediente}</span>
                            <span class="text-[10px] text-slate-400">${m.barrio} · ${m.superficie.toLocaleString('es-AR')} m²</span>
                        </button>
                    `;
                }).join('');

                document.querySelectorAll('.search-item-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        seleccionarObra(id, true, true);
                        resultsBar.classList.add('hidden');
                    });
                });

                if (autoSelectFirst && matches.length > 0) {
                    seleccionarObra(matches[0].id, true, true);
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
         * 6. CAJITA 5: AGRADECIMIENTOS DEL GRUPO 1 (MODO EDICIÓN PROTEGIDO PARA DEREK)
         * ============================================================================
         */
        const DEFAULT_AGRADECIMIENTOS = `Como integrantes del Grupo 1 (Gabriel Leon, Guillermo Hernandez, Lucía Herrera, Derek Reyes y Ezequiel Berterame), queremos expresar nuestro más sincero agradecimiento al docente de la materia "Desarrollo de Sistemas de IA" del IFTS N° 33 por su guía constante, exigencia académica y acompañamiento durante todo el cuatrimestre.

A lo largo de este Trabajo Práctico Final logramos integrar de manera tangible los pilares fundamentales de la Inteligencia Artificial moderna aplicada a la gestión pública de la Ciudad Autónoma de Buenos Aires: desde la rigurosa limpieza de datos y la prevención crítica del Data Leakage en los expedientes de la DGROC, pasando por el diseño de un Sistema Experto simbólico con encadenamiento hacia adelante (Forward Chaining), hasta el entrenamiento de modelos de Machine Learning (Regresión Logística y Árboles de Decisión) y Redes Neuronales profundas con TensorFlow/Keras, articulados en flujos de automatización inteligente con n8n.

Nos llevamos no solo herramientas técnicas de vanguardia, sino una metodología de trabajo colaborativo y pensamiento crítico para resolver problemáticas reales con impacto social.`;

        const STORAGE_KEY_AGRADECIMIENTOS = 'ifts33_grupo1_agradecimientos_v1';
        let isDerekUnlocked = false;

        function initAgradecimientosSection() {
            const displayEl = document.getElementById('agradecimientosDisplay');
            const editorEl = document.getElementById('agradecimientosEditor');
            const btnToggleEdit = document.getElementById('btnToggleDerekEdit');
            const btnSave = document.getElementById('btnSaveDerekText');
            const btnReset = document.getElementById('btnResetDerekText');
            const pinPanel = document.getElementById('derekPinPanel');
            const pinInput = document.getElementById('derekPinInput');
            const btnConfirmPin = document.getElementById('btnConfirmPin');
            const btnCancelPin = document.getElementById('btnCancelPin');
            const lockIcon = document.getElementById('derekLockIcon');
            const btnLabel = document.getElementById('derekBtnLabel');
            const toastEl = document.getElementById('derekToast');

            function showToast(msg, type = 'success') {
                toastEl.classList.remove('hidden', 'bg-emerald-500/15', 'text-emerald-300', 'border-emerald-500/30', 'bg-rose-500/15', 'text-rose-300', 'border-rose-500/30');
                if (type === 'success') {
                    toastEl.className = "rounded-xl px-4 py-2.5 text-xs font-medium flex items-center gap-2 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30";
                } else {
                    toastEl.className = "rounded-xl px-4 py-2.5 text-xs font-medium flex items-center gap-2 bg-rose-500/15 text-rose-300 border border-rose-500/30";
                }
                toastEl.textContent = msg;
                setTimeout(() => {
                    toastEl.classList.add('hidden');
                }, 4000);
            }

            function renderFormattedText(rawText) {
                const paragraphs = rawText.split('\n').filter(p => p.trim().length > 0);
                displayEl.innerHTML = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
            }

            function escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }

            // Cargar texto desde localStorage o usar el predeterminado
            const savedText = localStorage.getItem(STORAGE_KEY_AGRADECIMIENTOS) || DEFAULT_AGRADECIMIENTOS;
            renderFormattedText(savedText);
            editorEl.value = savedText;

            function setEditMode(enabled) {
                isDerekUnlocked = enabled;
                if (enabled) {
                    pinPanel.classList.add('hidden');
                    displayEl.classList.add('hidden');
                    editorEl.classList.remove('hidden');
                    btnSave.classList.remove('hidden');
                    btnReset.classList.remove('hidden');
                    lockIcon.setAttribute('data-lucide', 'unlock');
                    lockIcon.classList.remove('text-amber-400');
                    lockIcon.classList.add('text-emerald-400');
                    btnLabel.textContent = 'Salir de Edición (Derek)';
                    editorEl.focus();
                } else {
                    displayEl.classList.remove('hidden');
                    editorEl.classList.add('hidden');
                    btnSave.classList.add('hidden');
                    btnReset.classList.add('hidden');
                    lockIcon.setAttribute('data-lucide', 'lock');
                    lockIcon.classList.remove('text-emerald-400');
                    lockIcon.classList.add('text-amber-400');
                    btnLabel.textContent = 'Modo Edición (Solo Derek)';
                }
                lucide.createIcons();
            }

            btnToggleEdit.addEventListener('click', () => {
                if (isDerekUnlocked) {
                    setEditMode(false);
                } else {
                    pinPanel.classList.toggle('hidden');
                    if (!pinPanel.classList.contains('hidden')) {
                        pinInput.value = '';
                        pinInput.focus();
                    }
                }
            });

            function verifyDerekPin() {
                const val = pinInput.value.trim().toLowerCase();
                if (val === '1928' || val === 'derek') {
                    setEditMode(true);
                    showToast('¡Bienvenido Derek! Modo de edición habilitado.', 'success');
                } else {
                    showToast('PIN incorrecto. Acceso exclusivo para Derek Reyes (pista: 1928).', 'error');
                    pinInput.value = '';
                    pinInput.focus();
                }
            }

            btnConfirmPin.addEventListener('click', verifyDerekPin);
            pinInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') verifyDerekPin();
            });
            btnCancelPin.addEventListener('click', () => {
                pinPanel.classList.add('hidden');
            });

            btnSave.addEventListener('click', () => {
                const updatedText = editorEl.value.trim();
                if (!updatedText) {
                    showToast('El texto de agradecimiento no puede quedar vacío.', 'error');
                    return;
                }
                localStorage.setItem(STORAGE_KEY_AGRADECIMIENTOS, updatedText);
                renderFormattedText(updatedText);
                setEditMode(false);
                showToast('Agradecimientos guardados correctamente en almacenamiento local.', 'success');
            });

            btnReset.addEventListener('click', () => {
                localStorage.removeItem(STORAGE_KEY_AGRADECIMIENTOS);
                editorEl.value = DEFAULT_AGRADECIMIENTOS;
                renderFormattedText(DEFAULT_AGRADECIMIENTOS);
                showToast('Se restauró el mensaje institucional original del Grupo 1.', 'success');
            });
        }

        /**
         * ============================================================================
         * 7. INICIALIZACIÓN GLOBAL DE LA APLICACIÓN
         * ============================================================================
         */
        window.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
            initCabaMap();
            initSearchSystem();
            initAgradecimientosSection();

            // Cargar la primera obra del dataset por defecto
            seleccionarObra(OBRAS_DATASET[0].id, false, false);

            // Botón para re-simular paso a paso el motor Forward Chaining
            document.getElementById('btnReEjecutarInferencia').addEventListener('click', () => {
                seleccionarObra(currentObraId, false, true);
            });

            // Botón para centrar nuevamente todo el mapa de CABA
            document.getElementById('btnResetMap').addEventListener('click', () => {
                if (map) {
                    map.flyTo([-34.6037, -58.3816], 12, { animate: true, duration: 1.0 });
                }
            });
        });
