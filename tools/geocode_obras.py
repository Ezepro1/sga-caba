"""
Genera las coordenadas del dataset GCABA publicado en Google Sheets.

La hoja (CSV) no trae latitud/longitud, asi que se geocodifica cada direccion
unica con dos servicios oficiales:
  1) Georef (apis.datos.gob.ar) - rapido y masivo.
  2) USIG GCBA (servicios.usig.buenosaires.gob.ar) - respaldo para las que fallan.

Salidas:
  data/geocodes.json  -> direccion: [lat, lng]
  data/geocodes.js    -> window.GEOCODES_CABA = {...}  (lo carga index.html)

Uso:
  python tools/geocode_obras.py

Requiere Python 3.9+ y conexion a internet.
"""

import csv
import io
import json
import os
import threading
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

SHEET_CSV_URL = (
    "https://docs.google.com/spreadsheets/d/e/"
    "2PACX-1vTpOche_nf-u-NvPAV7YWBGRUQ9HgtFByqD2GG5Yt8ORcnsCKizWHEPacbMjNo4Nb8Vu-7w1sJ27H_D"
    "/pub?output=csv"
)

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(BASE, "data")
JSON_PATH = os.path.join(OUT_DIR, "geocodes.json")
JS_PATH = os.path.join(OUT_DIR, "geocodes.js")

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; AuditorIA-CABA/1.0)"}
lock = threading.Lock()
done = 0


def get_json(url, timeout=20):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.load(resp)


def georef(addr):
    url = "https://apis.datos.gob.ar/georef/api/direcciones?" + urllib.parse.urlencode(
        {"direccion": addr, "provincia": "02"}
    )
    data = get_json(url)
    for item in data.get("direcciones") or []:
        ubic = item.get("ubicacion") or {}
        if ubic.get("lat") is not None and ubic.get("lon") is not None:
            return [round(float(ubic["lat"]), 6), round(float(ubic["lon"]), 6)]
    return None


def usig(addr):
    url = (
        "https://servicios.usig.buenosaires.gob.ar/normalizar/?geocodificar=TRUE&direccion="
        + urllib.parse.quote(addr)
    )
    data = get_json(url)
    for item in data.get("direccionesNormalizadas") or []:
        if item.get("cod_partido") == "caba" and item.get("coordenadas"):
            c = item["coordenadas"]
            return [round(float(c["y"]), 6), round(float(c["x"]), 6)]
    return None


def resolve(addr):
    global done
    coords = None
    for attempt in range(4):
        try:
            coords = georef(addr)
            break
        except Exception:
            time.sleep(0.3 * (attempt + 1))
    with lock:
        done += 1
        if done % 250 == 0:
            print(f"  georef {done}/{TOTAL} ...", flush=True)
    return addr, coords


def resolve_usig(addr):
    global done
    coords = None
    for attempt in range(4):
        try:
            coords = usig(addr)
            break
        except Exception:
            time.sleep(0.5 * (attempt + 1))
    with lock:
        done += 1
        if done % 100 == 0:
            print(f"  usig {done}/{TOTAL} ...", flush=True)
    return addr, coords


def main():
    global TOTAL
    os.makedirs(OUT_DIR, exist_ok=True)

    print("Descargando CSV publicado ...", flush=True)
    req = urllib.request.Request(SHEET_CSV_URL, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60) as resp:
        text = resp.read().decode("utf-8-sig")

    rows = list(csv.DictReader(io.StringIO(text)))
    addresses = sorted(
        {
            (row.get("direccion_busqueda") or "").strip()
            for row in rows
            if (row.get("direccion_busqueda") or "").strip()
        }
    )
    TOTAL = len(addresses)
    print(f"filas={len(rows)} direcciones_unicas={TOTAL}", flush=True)

    t0 = time.time()
    results = {}

    with ThreadPoolExecutor(max_workers=12) as pool:
        for addr, coords in pool.map(resolve, addresses):
            if coords:
                results[addr] = coords

    pending = [a for a in addresses if a not in results]
    print(f"georef: {len(results)} ok, {len(pending)} pendientes en {time.time()-t0:.1f}s", flush=True)

    if pending:
        with ThreadPoolExecutor(max_workers=4) as pool:
            for addr, coords in pool.map(resolve_usig, pending):
                if coords:
                    results[addr] = coords

    print(f"total geocodificadas: {len(results)}/{TOTAL} en {time.time()-t0:.1f}s", flush=True)

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, separators=(",", ":"))

    with open(JS_PATH, "w", encoding="utf-8") as f:
        f.write("/* Coordenadas por direccion generadas desde el CSV publicado (Georef + USIG). */\n")
        f.write("window.GEOCODES_CABA = ")
        json.dump(results, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")

    print(f"guardado: {JS_PATH} ({os.path.getsize(JS_PATH)} bytes)", flush=True)


TOTAL = 0

if __name__ == "__main__":
    main()
