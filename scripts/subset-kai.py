#!/usr/bin/env python3
"""
Subset the FZKai Chinese font to only the glyphs used on the site.

The full FZKai_Z03T.ttf is ~4.4 MB (a complete Chinese glyph set). The site
only renders a few dozen Chinese characters (the resort-map legends), so we
ship a tiny subset (~26 KB) loaded via next/font in src/app/layout.tsx.

RUN THIS whenever you add or change Chinese text that uses `font-kai`:
    python3 scripts/subset-kai.py

It scans src/lib/event-data.ts for the glyphs in use, plus printable ASCII and
common punctuation, then writes src/fonts/FZKai_Z03T.subset.woff2.

Requires: fonttools + brotli  (pip install fonttools brotli)
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_FONT = ROOT / "src/fonts/FZKai_Z03T.ttf"
OUT_FONT = ROOT / "src/fonts/FZKai_Z03T.subset.woff2"
DATA = ROOT / "src/lib/event-data.ts"


def collect_chars() -> str:
    text = DATA.read_text(encoding="utf-8")
    chars = set()
    # Any quoted string value on a zh/en/brand/brandZh key (covers mixed
    # Latin+CJK fields like "Cavaya池畔吧").
    for m in re.finditer(r'(zh|en|brand|brandZh):\s*"([^"]*)"', text):
        chars.update(m.group(2))
    # Printable ASCII + punctuation we use in those spans.
    chars.update(chr(cp) for cp in range(0x20, 0x7F))
    chars.update("·—–’“”&")
    return "".join(sorted(chars))


def main() -> int:
    if not SRC_FONT.exists():
        print(f"Source font missing: {SRC_FONT}", file=sys.stderr)
        return 1
    chars = collect_chars()
    cjk = "".join(c for c in chars if ord(c) > 0x2E7F)
    print(f"Keeping {len(chars)} glyphs ({len(cjk)} CJK): {cjk}")
    subprocess.run(
        [
            sys.executable, "-m", "fontTools.subset", str(SRC_FONT),
            f"--text={chars}",
            f"--output-file={OUT_FONT}",
            "--flavor=woff2",
            "--layout-features=*",
            "--no-hinting",
        ],
        check=True,
    )
    print(f"Wrote {OUT_FONT} ({OUT_FONT.stat().st_size // 1024} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
