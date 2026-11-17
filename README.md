# AuditorIA CABA · Sistema Híbrido de Auditoría de Obras

Prototipo del IFTS N° 33 (Grupo 1): dashboard de fiscalización de obras de la Ciudad
Autónoma de Buenos Aires con sistema experto (Forward Chaining), redes neuronales y
georreferenciación.

## Estructura

```
index.html                  Estructura de la página
css/styles.css              Estilos propios (temas, glassmorphism, LEDs del mapa, etc.)
js/tailwind-config.js       Configuración de Tailwind (colores civic, animaciones)
js/theme.js                 Selector de tema (original / claro / oscuro) + persistencia
js/app.js                   Lógica: dataset, auditoría, mapa, búsqueda, localStorage
data/geocodes.js            Coordenadas por dirección (se carga con <script>)
data/geocodes.json          Misma información en JSON (fuente)
tools/geocode_obras.py      Script para regenerar las coordenadas
```

## Cómo ejecutarlo

Necesita internet (Tailwind, Leaflet, Lucide, fuentes y tiles del mapa salen por CDN).

- Con VS Code + Live Server: abrir `index.html` con "Open with Live Server".
- O con Python:

```bash
python -m http.server 8765
```

y entrar a <http://localhost:8765/index.html>.

## Dataset del mapa

El mapa consume en vivo el CSV publicado de Google Sheets:

<https://docs.google.com/spreadsheets/d/e/2PACX-1vTpOche_nf-u-NvPAV7YWBGRUQ9HgtFByqD2GG5Yt8ORcnsCKizWHEPacbMjNo4Nb8Vu-7w1sJ27H_D/pub?output=csv>

La hoja no incluye latitud/longitud, así que las coordenadas se resuelven por dirección
con los servicios oficiales **Georef** (apis.datos.gob.ar) y **USIG GCBA**, y se guardan
en `data/geocodes.js`.

Si se agregan o cambian direcciones en la hoja, regenerar con:

```bash
python tools/geocode_obras.py
```

El script descarga el CSV, geocodifica las direcciones nuevas y reescribe
`data/geocodes.json` y `data/geocodes.js`. Tarda unos 3 minutos para ~9.700 direcciones.

## Temas visuales

Arriba a la derecha del header hay un selector con tres temas:

- **Original**: el diseño azul noche con acentos cian.
- **Claro**: fondo claro, tarjetas blancas y semáforo (verde/ámbar/rojo) saturado.
- **Oscuro**: tonos carbón apagados con semáforo neón y basemap oscurecido.

El tema elegido se guarda en `localStorage` (`auditoria_caba_theme_v1`) y se aplica antes
del primer pintado. Para cambiarlo por código: `AuditorIATheme.aplicarTema('claro')`.

## Basemap

Por defecto se usa **Esri World Street Map** (gratis, sin API key). CARTO ahora exige una
key válida: si tenés una, pegala en `CARTO_API_KEY` dentro de `js/app.js` y el mapa pasa
a usar CARTO Voyager automáticamente.
