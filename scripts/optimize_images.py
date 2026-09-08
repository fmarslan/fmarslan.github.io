"""Generate responsive WebP assets without changing original images or article files.

Run with Python + Pillow after adding images, then commit assets/optimized and
_data/image_assets.json. Jekyll consumes the manifest; Pillow is not needed in CI.
"""
import hashlib
import json
from pathlib import Path
from urllib.parse import quote
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
output = ROOT / 'assets/optimized'
output.mkdir(exist_ok=True)
manifest = {}
original_bytes = generated_bytes = 0
for path in sorted((ROOT / 'assets').rglob('*')):
    if not path.is_file() or output in path.parents:
        continue
    if path.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp'}:
        continue
    with Image.open(path) as source:
        if getattr(source, 'is_animated', False):
            continue
        picture = ImageOps.exif_transpose(source).convert('RGBA' if 'A' in source.getbands() else 'RGB')
        width, height = picture.size
        url = '/' + path.relative_to(ROOT).as_posix()
        entry = {'width': width, 'height': height, 'src': quote(url)}
        if path.stat().st_size > 80000 or width > 1600:
            digest = hashlib.sha256(path.read_bytes()).hexdigest()[:16]
            variants = []
            for size in sorted({min(width, 480), min(width, 960), min(width, 1600)}):
                dest = output / f'{digest}-{size}.webp'
                image = picture.copy()
                image.thumbnail((size, max(1, round(height * size / width))), Image.Resampling.LANCZOS)
                image.save(dest, 'WEBP', quality=85, method=6)
                variants.append({'src': '/assets/optimized/' + dest.name, 'width': image.width})
                generated_bytes += dest.stat().st_size
            entry.update(src=variants[-1]['src'], variants=variants)
            original_bytes += path.stat().st_size
        manifest[url] = entry
(ROOT / '_data/image_assets.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(manifest)} images mapped; optimized originals {original_bytes:,} bytes; all responsive variants {generated_bytes:,} bytes')
