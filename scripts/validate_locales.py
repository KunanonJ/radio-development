#!/usr/bin/env python3
"""
Validate locale files: UTF-8 encoding, JSON validity, and key parity between en and th.
PRD §21.1: UTF-8 mandatory. Thai Unicode block U+0E00–U+0E7F.
"""
from pathlib import Path
import json
import sys

LOCALES_DIR = Path(__file__).resolve().parent.parent / "locales"
THAI_RANGE = (0x0E00, 0x0E7F)


def is_thai_char(c: str) -> bool:
    o = ord(c)
    return THAI_RANGE[0] <= o <= THAI_RANGE[1]


def load_json(path: Path):
    # Returns (data, error_message). error_message is None on success.
    """Load JSON from path. Return (data, error_message)."""
    try:
        text = path.read_text(encoding="utf-8")
    except Exception as e:
        return None, f"UTF-8 read failed: {e}"
    try:
        return json.loads(text), None
    except json.JSONDecodeError as e:
        return None, f"Invalid JSON: {e}"


def keys_from(data: dict) -> set[str]:
    """All string keys except _meta."""
    return {k for k, v in data.items() if k != "_meta" and isinstance(v, str)}


def check_thai_entries(data: dict, lang: str) -> list[str]:
    """If lang is th, ensure Thai strings contain valid Thai chars where expected."""
    issues = []
    if lang != "th":
        return issues
    for k, v in data.items():
        if k == "_meta" or not isinstance(v, str):
            continue
        # Allow mixed (e.g. "RadioBOSS"); flag if we expect Thai but find none
        has_thai = any(is_thai_char(c) for c in v)
        if not has_thai and len(v) > 2 and not v.isascii():
            # Could be other script; no error
            pass
        # Optional: warn if value looks like English key (untranslated)
        if v.replace(" ", "").replace(".", "").isascii() and len(v) < 30:
            pass  # Might be proper noun or term left in English
    return issues


def main() -> int:
    en_dir = LOCALES_DIR / "en"
    th_dir = LOCALES_DIR / "th"
    if not en_dir.is_dir() or not th_dir.is_dir():
        print("locales/en or locales/th missing", file=sys.stderr)
        return 1

    errors: list[str] = []
    en_files = sorted(en_dir.glob("*.json"))
    th_files = sorted(th_dir.glob("*.json"))

    en_modules = {}
    th_modules = {}

    for path in en_files:
        data, err = load_json(path)
        if err:
            errors.append(f"en/{path.name}: {err}")
            continue
        en_modules[path.stem] = data

    for path in th_files:
        data, err = load_json(path)
        if err:
            errors.append(f"th/{path.name}: {err}")
            continue
        th_modules[path.stem] = data

    # Key parity: every key in en should exist in th
    for mod, en_data in en_modules.items():
        en_keys = keys_from(en_data)
        th_data = th_modules.get(mod, {})
        th_keys = keys_from(th_data)
        missing_in_th = en_keys - th_keys
        extra_in_th = th_keys - en_keys
        if missing_in_th:
            errors.append(f"th/{mod}.json: missing keys vs en: {sorted(missing_in_th)}")
        if extra_in_th:
            # Informational only
            print(f"  [info] th/{mod}.json: extra keys not in en: {sorted(extra_in_th)}", file=sys.stderr)

    # Ensure every en module has a th counterpart
    for mod in en_modules:
        if mod not in th_modules:
            errors.append(f"th: missing module {mod}.json")

    if errors:
        for e in errors:
            print(e, file=sys.stderr)
        return 1

    print("Locale validation passed: UTF-8, valid JSON, key parity (en → th).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
