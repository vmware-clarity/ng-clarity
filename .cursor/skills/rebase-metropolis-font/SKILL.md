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

**Rule**: Always use an advanced font manipulation library capable of preserving complex tables for high-fidelity font rebasing and customization. No specific toolchain or language version is strictly mandated, but the chosen tooling must fully support `GDEF`, `GPOS`, and `GSUB` read/write capabilities without destructive stripping.

### 2. Spacing Accents Fix (CDE-2042)

The root cause of CDE-2042 (spacing accents like backtick/grave overlapping the next character) is that the spacing accents are incorrectly classified as Class 3 (Mark) in the `GDEF` table's `GlyphClassDef` mapping.

- **The Fix**: Directly map these glyphs to Class 1 (Base Glyph) in the `GDEF` table.
- **Affected Accent Glyphs**: `grave`, `acute`, `circumflex`, `tilde`, `dieresis`, `macron`, `breve`, `dotaccent`, `ring`, `caron`, `hungarumlaut`.

### 3. WOFF 1.0 Specification Table Sorting

The WOFF 1.0 specification requires all table directory entries to be strictly sorted alphabetically by tag (e.g., `DSIG`, `GDEF`, `GPOS`, `GSUB`, `OS/2`, `cmap`...). If they are out of order, modern web browsers will reject the font, falling back to system fonts.

- **Rule**: Do not rename tables to dummy names (like `GDEE`) to bypass sorting rules; keep `GDEF`, `GPOS`, and `GSUB` properly named and ensure your font compiler writes the final binary table directory in strict alphabetical order.

---

## Required Customizations

### 1. Vertical Metrics

The following vertical metrics must be applied during any rebase process to maintain historical spacing:

**`hhea` table**:

- `ascent`: 965
- `descent`: -295
- `lineGap`: 0

**`OS/2` table**:

- `usWinAscent`: 965
- `usWinDescent`: 295
- `sTypoAscender`: 795
- `sTypoDescender`: -205
- `sTypoLineGap`: 0

### 2. Custom Glyphs

The following solid square and layout helper glyphs must be injected into the font binary (`glyf` and `hmtx` tables) and properly mapped in `cmap` if they have a Unicode value:

- **`uni25FC` (Solid Square - Unicode `0x25fc`)**:
  - Advance Width: `515`
  - Contour Coordinates: `[(0, 515), (515, 515), (515, 0), (0, 0)]`
- **`ascender` (Helper - No Unicode)**:
  - Advance Width: `638`
  - Contour Coordinates: `[(83, 699), (158, 699), (158, 0), (83, 0)]`
- **`descender` (Helper - No Unicode)**:
  - Advance Width: `638`
  - Contour Coordinates: `[(83, 517), (158, 517), (158, -172), (83, -172)]`

### 3. Weights Mapping & Formats

The base fonts must be mapped to their appropriate web weights. Currently, only **WOFF** format is needed (do not generate or embed WOFF2).

- Weight `200`: Base file `Metropolis-Light.ttf`, Style `normal`
- Weight `400`: Base file `Metropolis-Regular.ttf`, Style `normal`
- Weight `500`: Base file `Metropolis-Medium.ttf`, Style `normal`
- Weight `600`: Base file `Metropolis-SemiBold.ttf`, Style `normal`
