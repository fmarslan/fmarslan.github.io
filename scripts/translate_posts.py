"""Create the missing Turkish/English counterpart for every Jekyll post.

The translator preserves fenced code, inline code, and URLs. Existing source
post filenames and dates are never changed.
"""

from __future__ import annotations

import argparse
import hashlib
import re
import sys
import time
import unicodedata
from pathlib import Path

from deep_translator import GoogleTranslator


ROOT = Path(__file__).resolve().parents[1]
POSTS = ROOT / "_posts"
GENERATED_DIRS = {"en", "tr"}
FENCE_RE = re.compile(r"```[\s\S]*?```|~~~[\s\S]*?~~~")
INLINE_CODE_RE = re.compile(r"`[^`\n]+`")
URL_RE = re.compile(r"https?://[^\s)>]+")


def parse_document(text: str) -> tuple[list[str], str]:
    match = re.match(r"^---\r?\n([\s\S]*?)\r?\n---\r?\n?", text)
    if not match:
        raise ValueError("Missing YAML front matter")
    return match.group(1).splitlines(), text[match.end() :]


def field(lines: list[str], name: str) -> str | None:
    prefix = f"{name}:"
    for line in lines:
        if line.startswith(prefix):
            return line[len(prefix) :].strip().strip("\"'")
    return None


def set_field(lines: list[str], name: str, value: str) -> list[str]:
    prefix = f"{name}:"
    replacement = f'{name}: "{value.replace(chr(34), chr(39))}"'
    for index, line in enumerate(lines):
        if line.startswith(prefix):
            lines[index] = replacement
            return lines
    lines.append(replacement)
    return lines


def protect(text: str) -> tuple[str, dict[str, str]]:
    values: dict[str, str] = {}

    def replace(match: re.Match[str]) -> str:
        token = f"FMARSLANTOKEN{len(values):05d}END"
        values[token] = match.group(0)
        return token

    text = FENCE_RE.sub(replace, text)
    text = INLINE_CODE_RE.sub(replace, text)
    text = URL_RE.sub(replace, text)
    return text, values


def restore(text: str, values: dict[str, str]) -> str:
    for token, value in values.items():
        text = text.replace(token, value)
        text = text.replace(token.lower(), value)
    return text


def chunks(text: str, limit: int = 4200) -> list[str]:
    paragraphs = re.split(r"(\n\s*\n)", text)
    result: list[str] = []
    current = ""
    for part in paragraphs:
        if len(current) + len(part) <= limit:
            current += part
            continue
        if current:
            result.append(current)
            current = ""
        if len(part) <= limit:
            current = part
        else:
            for start in range(0, len(part), limit):
                result.append(part[start : start + limit])
    if current:
        result.append(current)
    return result


def translate_text(text: str, source: str, target: str) -> str:
    if not text.strip():
        return text
    protected, values = protect(text)
    translator = GoogleTranslator(source=source, target=target)
    translated_parts: list[str] = []
    for part in chunks(protected):
        if not part.strip():
            translated_parts.append(part)
            continue
        for attempt in range(5):
            try:
                translated_parts.append(translator.translate(part))
                break
            except Exception:
                if attempt == 4:
                    raise
                time.sleep(2**attempt)
        time.sleep(0.15)
    return restore("".join(translated_parts), values)


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii").lower()
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_value).strip("-")
    return slug[:100] or "article"


def translation_key(name: str) -> str:
    raw_slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", name)
    raw_slug = re.sub(r"\.md(?:\.md)?$", "", raw_slug)
    digest = hashlib.sha1(name.encode("utf-8")).hexdigest()[:8]
    return f"{slugify(raw_slug)}-{digest}"


def passthrough_front_matter(lines: list[str]) -> list[str]:
    result: list[str] = []
    capture_list = False
    for line in lines:
        key = line.split(":", 1)[0] if ":" in line and not line.startswith((" ", "-")) else ""
        if key in {"image", "tags", "categories", "published"}:
            result.append(line)
            capture_list = key in {"tags", "categories"} and not line.split(":", 1)[1].strip()
        elif capture_list and (line.startswith("  -") or line.startswith("- ")):
            result.append(line)
        else:
            capture_list = False
    return result


def build_translation(source_path: Path, dry_run: bool = False) -> Path | None:
    text = source_path.read_text(encoding="utf-8")
    lines, body = parse_document(text)
    language = field(lines, "lang") or "tr-TR"
    source_code = "tr" if language.startswith("tr") else "en"
    target_code = "en" if source_code == "tr" else "tr"
    key = field(lines, "translation_key") or translation_key(source_path.name)

    existing = list(POSTS.rglob("*.md"))
    for candidate in existing:
        if candidate == source_path:
            continue
        candidate_lines, _ = parse_document(candidate.read_text(encoding="utf-8"))
        if field(candidate_lines, "translation_key") == key:
            set_field(lines, "translation_key", key)
            source_path.write_text("---\n" + "\n".join(lines) + "\n---\n\n" + body.lstrip(), encoding="utf-8")
            return None

    title = field(lines, "title") or source_path.stem
    description = field(lines, "description") or title
    translated_title = translate_text(title, source_code, target_code).strip()
    translated_description = translate_text(description, source_code, target_code).strip()
    translated_body = translate_text(body, source_code, target_code).strip() + "\n"

    date_match = re.match(r"^(\d{4})-(\d{2})-(\d{2})-", source_path.name)
    if not date_match:
        raise ValueError(f"Cannot determine date from {source_path.name}")
    date = "-".join(date_match.groups())
    slug = slugify(translated_title)
    target_dir = POSTS / target_code
    target_path = target_dir / f"{date}-{slug}.md"
    permalink = f"/{target_code}/{date.replace('-', '/')}/{slug}.html"

    translated_lines = [
        "layout: post",
        f'title: "{translated_title.replace(chr(34), chr(39))}"',
        f"date: {date}",
        f'description: "{translated_description.replace(chr(34), chr(39))}"',
        *passthrough_front_matter(lines),
        f"lang: {'en-US' if target_code == 'en' else 'tr-TR'}",
        f'translation_key: "{key}"',
        f"permalink: {permalink}",
    ]
    set_field(lines, "translation_key", key)

    if not dry_run:
        target_dir.mkdir(parents=True, exist_ok=True)
        source_path.write_text("---\n" + "\n".join(lines) + "\n---\n\n" + body.lstrip(), encoding="utf-8")
        target_path.write_text(
            "---\n" + "\n".join(translated_lines) + "\n---\n\n" + translated_body,
            encoding="utf-8",
        )
    return target_path


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    source_posts = [
        path
        for path in sorted(POSTS.glob("*.md"))
        if path.parent.name not in GENERATED_DIRS
    ]
    created = 0
    for index, source_path in enumerate(source_posts, start=1):
        print(f"[{index}/{len(source_posts)}] {source_path.name}", flush=True)
        target = build_translation(source_path, dry_run=args.dry_run)
        if target:
            created += 1
            print(f"  -> {target.relative_to(ROOT)}", flush=True)
        if args.limit and created >= args.limit:
            break
    print(f"created={created}", flush=True)


if __name__ == "__main__":
    main()
