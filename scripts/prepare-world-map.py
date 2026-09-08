"""Convert Natural Earth 1:110m GeoJSON into compact, locally served SVG paths.

Usage: python3 scripts/prepare-world-map.py /path/to/ne_110m_admin_0_countries.geojson
Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson
Data is in the public domain. The map uses a plate carree projection.
Antarctica is omitted to keep this travel map compact.
"""

import json
from pathlib import Path
import sys


def ring_path(ring):
    points = [(20 + (lon + 180) * 960 / 360, 15 + (85 - lat) * 960 / 360) for lon, lat in ring]
    return 'M' + 'L'.join(f'{x:.2f},{y:.2f}' for x, y in points) + 'Z'


features = json.loads(Path(sys.argv[1]).read_text())['features']
countries = []
for feature in features:
    properties = feature['properties']
    code = properties['ADM0_A3']
    if code == 'ATA':
        continue
    geometry = feature['geometry']
    polygons = geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]
    countries.append({
        'code': code,
        'name': properties['NAME_EN'],
        'path': ''.join(ring_path(ring) for polygon in polygons for ring in polygon),
    })
output = Path(__file__).resolve().parent.parent / 'content/world-map.json'
output.write_text(json.dumps(countries, separators=(',', ':')) + '\n')
print(f'Prepared {len(countries)} country geometries ({output.stat().st_size} bytes).')
