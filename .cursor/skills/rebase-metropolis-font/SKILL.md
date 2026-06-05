---
name: rebase-metropolis-font
description: Rebase and customize the Metropolis font for Clarity. Use when updating or customizing the Metropolis font, modifying vertical metrics, or fixing spacing/overlap issues (such as CDE-2042).
disable-model-invocation: true
---

# Rebase Metropolis Font

This skill guides you through the process of rebasing and customizing the Metropolis font (baseline version r8) for Clarity, ensuring perfect preservation of advanced OpenType layout tables while surgically patching the `GDEF` table to fix glyph spacing issues.

## Core Domain Knowledge & Constraints

### 1. The OpenType Table Stripping Trap

Standard JavaScript font manipulation libraries (such as `fonteditor-core` or `opentype.js`) are incapable of properly serializing/building advanced layout tables like `GPOS`, `GSUB`, and `GDEF`. Using them silently strips these tables, resulting in:

- **Lost Kerning**: No kerning between glyphs (e.g., `W` and `o`, `r` and `l`), causing minor layout shifts in visual regression tests.
- **Incorrect Glyph Classification**: Spacing accents overlap with following characters.

**Rule**: Always use Python's `fontTools` library for high-fidelity font rebasing and customization.

### 2. Spacing Accents Fix (CDE-2042)

The root cause of CDE-2042 (spacing accents like backtick/grave overlapping the next character) is that the spacing accents are incorrectly classified as Class 3 (Mark) in the `GDEF` table's `GlyphClassDef` mapping.

- **The Fix**: Directly map these glyphs to Class 1 (Base Glyph) in the `GDEF` table.
- **Affected Accent Glyphs**: `grave`, `acute`, `circumflex`, `tilde`, `dieresis`, `macron`, `breve`, `dotaccent`, `ring`, 'caron', `hungarumlaut`.

### 3. WOFF 1.0 Specification Table Sorting

The WOFF 1.0 specification requires all table directory entries to be strictly sorted alphabetically by tag (e.g., `DSIG`, `GDEF`, `GPOS`, `GSUB`, `OS/2`, `cmap`...). If they are out of order, modern web browsers will reject the font, falling back to system fonts.

- **Rule**: Do not rename tables to dummy names (like `GDEE`) to bypass sorting rules; keep `GDEF`, `GPOS`, and `GSUB` properly named and let `fontTools` compile them in alphabetical order.

---

## Instructions & Customizations

### 1. Vertical Metrics

Apply the following vertical metrics during the rebase process:

```python
# hhea table
font['hhea'].ascent = 965
font['hhea'].descent = -295
font['hhea'].lineGap = 0

# OS/2 table
font['OS/2'].usWinAscent = 965
font['OS/2'].usWinDescent = 295
font['OS/2'].sTypoAscender = 795
font['OS/2'].sTypoDescender = -205
font['OS/2'].sTypoLineGap = 0
```

### 2. Custom Glyphs

Inject the following solid square and layout helper glyphs:

- **`uni25FC` (Solid Square - Unicode `0x25fc`)**:
  - Advance Width: `515`
  - Contour Coordinates: `[(0, 515), (515, 515), (515, 0), (0, 0)]`
- **`ascender` (Helper)**:
  - Advance Width: `638`
  - Contour Coordinates: `[(83, 699), (158, 699), (158, 0), (83, 0)]`
- **`descender` (Helper)**:
  - Advance Width: `638`
  - Contour Coordinates: `[(83, 517), (158, 517), (158, -172), (83, -172)]`

---

## One-Shot Python Rebase Compiler Script

When you need to rebase the Metropolis baseline files (typically extracted to `/tmp/Metropolis_extracted/`), execute the following Python helper:

```python
import sys
import os
import base64
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphCoordinates
from fontTools.ttLib.tables.ttProgram import Program

weights_map = {
    '200': ('Metropolis-Light.ttf', 'normal'),
    '400': ('Metropolis-Regular.ttf', 'normal'),
    '500': ('Metropolis-Medium.ttf', 'normal'),
    '600': ('Metropolis-SemiBold.ttf', 'normal')
}

source_dir = "/tmp/Metropolis_extracted"
out_scss_path = "projects/angular/typography/_font-metropolis.scss"

scss_output = """/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Customized Metropolis Font Rebased using AI Powered Rebasing Tool
// Fixed backtick spacing issue (CDE-2042 / Clarity GitHub Issue #1521)
// Preservation of perfect original kerning via GPOS/GSUB tables
@use '../styles/variables/variables.typography';

@if variables.$clr-fontSkipBase64 == false {
"""

for weight, (ttf_file, style) in weights_map.items():
    ttf_path = os.path.join(source_dir, ttf_file)
    if not os.path.exists(ttf_path):
        print(f"Skipping weight {weight}, file not found: {ttf_path}")
        continue

    print(f"Rebasing weight {weight} using {ttf_file}...")
    font = TTFont(ttf_path)

    # 1. Apply vertical metrics
    font['hhea'].ascent = 965
    font['hhea'].descent = -295
    font['hhea'].lineGap = 0
    font['OS/2'].usWinAscent = 965
    font['OS/2'].usWinDescent = 295
    font['OS/2'].sTypoAscender = 795
    font['OS/2'].sTypoDescender = -205
    font['OS/2'].sTypoLineGap = 0

    # 2. Fix GDEF classes (CDE-2042 backtick/grave overlapping next character)
    if 'GDEF' in font and hasattr(font['GDEF'].table, 'GlyphClassDef'):
        class_def = font['GDEF'].table.GlyphClassDef.classDefs
        spacing_accents = ['grave', 'acute', 'circumflex', 'tilde', 'dieresis', 'macron', 'breve', 'dotaccent', 'ring', 'caron', 'hungarumlaut']
        for name in spacing_accents:
            class_def[name] = 1

    # 3. Inject solid square (uni25FC)
    glyf_table = font['glyf']
    hmtx_table = font['hmtx']

    g = Glyph()
    g.numberOfContours = 1
    g.coordinates = GlyphCoordinates([(0, 515), (515, 515), (515, 0), (0, 0)])
    g.endPtsOfContours = [3]
    g.flags = bytearray([1, 1, 1, 1])
    g.program = Program()

    glyf_table['uni25FC'] = g
    hmtx_table['uni25FC'] = (515, 0)

    # Add to character map
    for table in font['cmap'].tables:
        if table.isUnicode():
            table.cmap[0x25fc] = 'uni25FC'

    # 4. Add helpers ascender/descender
    for name, coords in [
        ('ascender', [(83, 699), (158, 699), (158, 0), (83, 0)]),
        ('descender', [(83, 517), (158, 517), (158, -172), (83, -172)])
    ]:
        if name not in glyf_table:
            g_h = Glyph()
            g_h.numberOfContours = 1
            g_h.coordinates = GlyphCoordinates(coords)
            g_h.endPtsOfContours = [3]
            g_h.flags = bytearray([1, 1, 1, 1])
            g_h.program = Program()
            glyf_table[name] = g_h
            hmtx_table[name] = (638, 83)

    # Save as temporary WOFF/WOFF2 files
    temp_woff = os.path.join('/tmp', f'rebase_tmp_{weight}.woff')
    temp_woff2 = os.path.join('/tmp', f'rebase_tmp_{weight}.woff2')

    font.flavor = 'woff'
    font.save(temp_woff)
    font.flavor = 'woff2'
    font.save(temp_woff2)

    # Base64 encode
    with open(temp_woff, 'rb') as w_f:
        b64_woff = base64.b64encode(w_f.read()).decode('utf-8')
    with open(temp_woff2, 'rb') as w2_f:
        b64_woff2 = base64.b64encode(w2_f.read()).decode('utf-8')

    # Cleanup temp files
    os.remove(temp_woff)
    os.remove(temp_woff2)

    # Append to SCSS
    comment_label = ""
    if weight == '500':
         comment_label = "    // medium\n"
    elif weight == '600':
         comment_label = "    // semibold\n"

    scss_output += f"""  @font-face {{
    font-family: Metropolis;
{comment_label}    src: url("data:font/woff2;charset=utf-8;base64,{b64_woff2}") format('woff2'),
         url("data:application/font-woff;charset=utf-8;base64,{b64_woff}") format('woff');
    font-weight: {weight};
    font-style: {style};
  }}
"""

scss_output += "}\n"

with open(out_scss_path, 'w') as out_scss:
    out_scss.write(scss_output)

# Run prettier on SCSS file to formatting
os.system(f"npx prettier --write {out_scss_path}")
```
