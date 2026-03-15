#!/usr/bin/env python3
"""
Load locale files for a given language and resolve keys (module.key or key).
Use from app code: from load_locales import get_locale; t = get_locale('th'); print(t('common.ok'))
"""
from pathlib import Path
import json

LOCALES_DIR = Path(__file__).resolve().parent.parent / "locales"


def get_locale(lang: str, fallback_lang: str = "en"):
    """
    Load all JSON modules for lang (e.g. 'en', 'th'). Fallback to fallback_lang for missing keys.
    Returns a function t(key) where key is 'module.key' or 'key' (looks up in common).
    """
    data = {}
    for path in (LOCALES_DIR / lang).glob("*.json"):
        with open(path, encoding="utf-8") as f:
            mod = json.load(f)
        module_name = path.stem
        for k, v in mod.items():
            if k == "_meta" or not isinstance(v, str):
                continue
            data[f"{module_name}.{k}"] = v
            if module_name == "common":
                data[k] = v

    fallback = {}
    if fallback_lang != lang:
        for path in (LOCALES_DIR / fallback_lang).glob("*.json"):
            with open(path, encoding="utf-8") as f:
                mod = json.load(f)
            module_name = path.stem
            for k, v in mod.items():
                if k == "_meta" or not isinstance(v, str):
                    continue
                key = f"{module_name}.{k}"
                if key not in data:
                    fallback[key] = v
                if module_name == "common" and k not in data:
                    fallback[k] = v

    def t(key: str) -> str:
        return data.get(key) or fallback.get(key) or key

    return t


def get_all_strings(lang: str) -> dict:
    """Return flat dict of all module.key -> value for lang. Useful for export or debugging."""
    flat = {}
    for path in (LOCALES_DIR / lang).glob("*.json"):
        with open(path, encoding="utf-8") as f:
            mod = json.load(f)
        for k, v in mod.items():
            if k == "_meta" or not isinstance(v, str):
                continue
            flat[f"{path.stem}.{k}"] = v
    return flat


if __name__ == "__main__":
    import sys
    lang = sys.argv[1] if len(sys.argv) > 1 else "en"
    t = get_locale(lang)
    print("Sample keys for lang =", lang)
    print("  common.ok:", t("common.ok"))
    print("  player.title:", t("player.title"))
    print("  errors.file_not_found:", t("errors.file_not_found"))
    print("  ok (short):", t("ok"))
