        /**
         * ============================================================================
         * SELECTOR DE TEMA VISUAL
         * original : diseño actual (azul noche + acentos cian)
         * claro    : fondo claro, tarjetas blancas y semáforo saturado
         * oscuro   : tonos carbón apagados + semáforo neón
         *
         * El tema se guarda en localStorage y se aplica con data-theme en <html>
         * para que css/styles.css redefina las variables y los overrides.
         * ============================================================================
         */
        (function () {
            const THEME_KEY = 'auditoria_caba_theme_v1';
            const THEMES = ['original', 'claro', 'oscuro'];
            const DEFAULT_THEME = 'original';
            const root = document.documentElement;

            function normalizarTema(tema) {
                return THEMES.includes(tema) ? tema : DEFAULT_THEME;
            }

            function leerTemaGuardado() {
                try {
                    return localStorage.getItem(THEME_KEY);
                } catch (err) {
                    return null;
                }
            }

            function aplicarTema(tema, persistir = true) {
                const elegido = normalizarTema(tema);

                root.setAttribute('data-theme', elegido);
                // El tema claro no usa la variante dark de Tailwind
                root.classList.toggle('dark', elegido !== 'claro');

                if (persistir) {
                    try {
                        localStorage.setItem(THEME_KEY, elegido);
                    } catch (err) { /* almacenamiento no disponible */ }
                }

                document.querySelectorAll('[data-theme-option]').forEach(btn => {
                    const activo = btn.getAttribute('data-theme-option') === elegido;
                    btn.classList.toggle('is-active', activo);
                    btn.setAttribute('aria-pressed', activo ? 'true' : 'false');
                });

                window.dispatchEvent(new CustomEvent('auditoria:themechange', {
                    detail: { theme: elegido }
                }));

                // Repinta los puntos del mapa con la paleta del tema activo
                if (typeof window.auditoriaApplyMapTheme === 'function') {
                    window.auditoriaApplyMapTheme();
                }
            }

            function initTheme() {
                aplicarTema(leerTemaGuardado() || DEFAULT_THEME, false);

                document.querySelectorAll('[data-theme-option]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        aplicarTema(btn.getAttribute('data-theme-option'));
                    });
                });
            }

            // Aplicar antes del primer pintado para evitar el flash de tema
            root.setAttribute('data-theme', normalizarTema(leerTemaGuardado()));

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initTheme);
            } else {
                initTheme();
            }

            // API mínima por si se necesita cambiar el tema desde consola
            window.AuditorIATheme = { aplicarTema, temas: THEMES.slice() };
        })();
