/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Pure value converters that translate CSS values into Figma variable payloads:
 * colors (hsl/rgb/hex), float resolution (px / bare / % / calc), variable
 * aliases, and type inference.
 */

/** hsl(H deg S% L%) or hsl(H, S%, L%) → Figma {r,g,b,a} (0-1 floats) */
export function hslToFigmaColor(value) {
  const m = value.match(/hsl\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%(?:\s*[,/]\s*([\d.]+%?))?\s*\)/);
  if (!m) {
    return null;
  }
  const h = parseFloat(m[1]) / 360;
  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;
  const a = m[4] !== undefined ? (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4])) : 1;
  // HSL to RGB
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hue2rgb = (p, q, t) => {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    };
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 1e6) / 1e6, g: Math.round(g * 1e6) / 1e6, b: Math.round(b * 1e6) / 1e6, a };
}

/** rgb(R G B) or rgb(R, G, B) → Figma {r,g,b,a} */
export function rgbToFigmaColor(value) {
  const m = value.match(/rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)/);
  if (!m) {
    return null;
  }
  const a = m[4] !== undefined ? (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4])) : 1;
  return { r: parseFloat(m[1]) / 255, g: parseFloat(m[2]) / 255, b: parseFloat(m[3]) / 255, a };
}

/** #rrggbb / #rgb / #rgba / #rrggbbaa → Figma {r,g,b,a}; null for anything that isn't a hex color */
export function hexToFigmaColor(value) {
  const v = value.trim();
  // Require a leading '#'; otherwise this is not a hex color (e.g. "Metropolis", "1000px").
  if (!v.startsWith('#')) {
    return null;
  }
  let hex = v.slice(1);
  // Expand shorthand #rgb / #rgba to #rrggbb / #rrggbbaa
  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  // Only 6-digit (rgb) or 8-digit (rgba) hex values made of valid hex digits qualify.
  if (!/^(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex)) {
    return null;
  }
  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255,
    a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
  };
}

/**
 * Resolve `calc(N * 1rem / var(--cds-global-base))` and its parenthesised variant
 * `calc(N * (1rem / var(--cds-global-base)))` to N px (N may be negative).
 * At the default base of 20, `1rem / base = 1 px`.
 *
 * @param {string} value
 * @returns {number | null}
 */
export function calcRemBase(value) {
  const m =
    value.match(/^calc\(\s*(-?[\d.]+)\s*\*\s*1rem\s*\/\s*var\(--cds-global-base\)\s*\)$/) ??
    value.match(/^calc\(\s*(-?[\d.]+)\s*\*\s*\(1rem\s*\/\s*var\(--cds-global-base\)\)\s*\)$/);
  return m ? parseFloat(m[1]) : null;
}

/**
 * Resolve `calc((1rem / var(--cds-global-base)) * var(--scale-name))` to a px number.
 *
 * The referenced scale variable must hold a dimensionless bare-number multiplier
 * (e.g. `1`, `0.875`). Treating `1rem/base` as 1 px at default scale, the result
 * equals that multiplier directly.
 *
 * @param {string} value
 * @param {(name: string) => string | undefined} varLookup
 * @returns {number | null}
 */
export function calcScaleVar(value, varLookup) {
  const m = value.match(/^calc\(\s*\(1rem\s*\/\s*var\(--cds-global-base\)\)\s*\*\s*var\((--[a-zA-Z0-9-]+)\)\s*\)$/);
  if (!m) {
    return null;
  }
  const scaleRaw = varLookup(m[1]);
  if (scaleRaw === undefined) {
    return null;
  }
  const scaleVal = parseFloat(scaleRaw);
  return isNaN(scaleVal) ? null : scaleVal;
}

/**
 * Resolve `calc(N * var(--name))` by looking up `--name`, recursively resolving
 * its value to px via {@link resolveCalcToPx}, then multiplying by N.
 *
 * @param {string} value
 * @param {(name: string) => string | undefined} varLookup
 * @returns {number | null}
 */
export function calcVarMultiply(value, varLookup) {
  const m = value.match(/^calc\(\s*(-?[\d.]+)\s*\*\s*var\((--[a-zA-Z0-9-]+)\)\s*\)$/);
  if (!m) {
    return null;
  }
  const n = parseFloat(m[1]);
  const varRaw = varLookup(m[2]);
  if (varRaw === undefined) {
    return null;
  }
  const varPx = resolveCalcToPx(varRaw, varLookup);
  return varPx !== null ? n * varPx : null;
}

/**
 * Resolve any CSS numeric value to a plain number, recursively following
 * `var()` chains until a concrete form is reached.
 *
 * Recognised forms (in priority order):
 *   1. `Npx`        — strip unit, return N  (N may be negative, e.g. `-4px`)
 *   2. bare number  — return as-is (font-weights, multipliers, …; may be negative)
 *   3. `N%`         — return N (Figma stores percentages as their numeric value)
 *   4. `calc(…)`    — delegate to {@link resolveCalcToPx}
 *   5. `var(--x)`   — look up via `varLookup` and recurse
 *
 * This is intentionally not exported — it is a shared implementation detail
 * used by {@link resolveValue} (for the FLOAT branches) and by
 * {@link resolveEmToPx} (to resolve the peer font-size chain).
 *
 * @param {string} rawValue
 * @param {(name: string) => string | undefined} varLookup
 * @returns {number | null}
 */
function resolveToPx(rawValue, varLookup) {
  const v = rawValue.trim();

  // `-?` allows negative values such as `-4px` (inset shadows, negative letter-spacing).
  const px = v.match(/^(-?[\d.]+)px$/);
  if (px) {
    return parseFloat(px[1]);
  }

  // `-?` allows negative bare numbers (e.g. `-0.5` as a multiplier or offset).
  const bare = v.match(/^(-?[\d.]+)$/);
  if (bare) {
    return parseFloat(bare[1]);
  }

  const pct = v.match(/^([\d.]+)%$/);
  if (pct) {
    return parseFloat(pct[1]);
  }

  const calcResult = resolveCalcToPx(v, varLookup);
  if (calcResult !== null) {
    return calcResult;
  }

  const varRef = v.match(/^var\((--[a-zA-Z0-9-]+)\)$/);
  if (varRef) {
    const raw = varLookup(varRef[1]);
    return raw !== undefined ? resolveToPx(raw, varLookup) : null;
  }

  return null;
}

/**
 * Convert an `em`-unit letter-spacing value to pixels by multiplying it with
 * the resolved pixel size of the corresponding font-size token.
 *
 * The font-size token name is derived from `cssVarName` by replacing the
 * `-letter-spacing` suffix with `-font-size`.  If the suffix is absent, or
 * the font-size cannot be resolved to a number, `null` is returned so the
 * caller can fall through to a STRING representation.
 *
 * @param {string} value   CSS value, e.g. `"-0.0125em"`.
 * @param {string} cssVarName  Full CSS custom-property name of the token being
 *   resolved (e.g. `"--cds-alias-typography-display-letter-spacing"`).
 * @param {(name: string) => string | undefined} varLookup
 * @returns {number | null}
 */
export function resolveEmToPx(value, cssVarName, varLookup) {
  const m = value.match(/^(-?[\d.]+)em$/);
  if (!m || !varLookup) {
    return null;
  }

  const fontSizeName = cssVarName.replace(/-letter-spacing$/, '-font-size');
  if (fontSizeName === cssVarName) {
    return null;
  }

  const fontSizeRaw = varLookup(fontSizeName);
  if (!fontSizeRaw) {
    return null;
  }

  const fontSizePx = resolveToPx(fontSizeRaw, varLookup);

  return fontSizePx !== null ? parseFloat(m[1]) * fontSizePx : null;
}

/**
 * Resolve a `calc()` expression to a plain px number.
 *
 * Delegates to the focused helpers in priority order:
 *   1. {@link calcRemBase}     — `calc(N * 1rem / var(--cds-global-base))` and parenthesised form
 *   2. {@link calcScaleVar}    — `calc((1rem / var(--base)) * var(--scale))` (requires `varLookup`)
 *   3. {@link calcVarMultiply} — `calc(N * var(--name))` recursive  (requires `varLookup`)
 *
 * Why `varLookup` is required for patterns 2 and 3:
 * The compiled stylesheet expresses spacing and typography tokens as
 * `calc(N * var(--cds-internal-scale-2))`, where `--cds-internal-scale-2` is
 * itself `calc((1rem / var(--cds-global-base)) * var(--cds-global-scale-space))`.
 * Without a lookup into the full CSS variable map there is no way to reduce
 * these two levels to a static number. With the lookup, 29 additional tokens
 * are promoted from STRING to FLOAT at default scale=1.
 *
 * @param {string} value
 * @param {((name: string) => string | undefined) | null} [varLookup]
 *   Full CSS variable map getter (e.g. `rootVars.get.bind(rootVars)`).
 *   Required to resolve `var(--name)` references inside calc expressions.
 * @returns {number | null}
 */
export function resolveCalcToPx(value, varLookup = null) {
  return (
    calcRemBase(value) ?? (varLookup ? (calcScaleVar(value, varLookup) ?? calcVarMultiply(value, varLookup)) : null)
  );
}

/**
 * Extract the primary (first) font name from a CSS font-family fallback stack.
 * Strips surrounding single or double quotes.
 *
 * e.g. `'Metropolis', 'Avenir Next', sans-serif` → `Metropolis`
 *
 * @param {string} value Raw CSS font-family value.
 * @returns {string}
 */
function normalizeFontFamilyStack(value) {
  const first = value.split(',')[0].trim();
  return first.replace(/^(['"])(.*)\1$/, '$2').trim();
}

/**
 * Resolve a raw CSS value into a typed Figma payload.
 *
 * @param {string} rawValue
 * @param {import('./id-map.mjs').IdMap} idMap
 * @param {((name: string) => string | undefined) | null} [varLookup]
 *   Optional CSS variable value resolver forwarded to {@link resolveCalcToPx}
 *   and {@link resolveEmToPx}.
 * @param {string | null} [cssVarName]
 *   Full CSS custom-property name of the token being resolved
 *   (e.g. `"--cds-alias-typography-display-letter-spacing"`).
 *   Required for em→px conversion via {@link resolveEmToPx}.
 * @returns {{ type: 'ALIAS' | 'COLOR' | 'FLOAT' | 'STRING', figmaValue: unknown }}
 */
export function resolveValue(rawValue, idMap, varLookup = null, cssVarName = null) {
  const v = rawValue.trim();

  // VARIABLE_ALIAS: var(--token-name)
  const aliasMatch = v.match(/^var\((--[a-zA-Z0-9-]+)\)$/);
  if (aliasMatch) {
    const refName = aliasMatch[1];
    const refId = idMap.get(refName);
    if (refId) {
      return { type: 'ALIAS', figmaValue: { type: 'VARIABLE_ALIAS', id: refId } };
    }
    // If the referenced var isn't in our idMap, fall through to string
  }

  // COLOR
  const color = hslToFigmaColor(v) ?? rgbToFigmaColor(v) ?? hexToFigmaColor(v);
  if (color) {
    return { type: 'COLOR', figmaValue: color };
  }

  // FLOAT: Npx / bare number / N% / calc(…)
  // Top-level var() references are excluded here: those either resolved as ALIAS
  // above or must fall through to STRING — we must not follow their chain to a
  // number and silently drop the alias relationship.
  if (!v.startsWith('var(')) {
    const numPx = resolveToPx(v, varLookup);
    if (numPx !== null) {
      return { type: 'FLOAT', figmaValue: numPx };
    }
  }

  // FLOAT: em unit (e.g. letter-spacing: -0.0125em) → px via peer font-size token
  if (/^-?[\d.]+em$/.test(v) && cssVarName && varLookup) {
    const emPx = resolveEmToPx(v, cssVarName, varLookup);
    if (emPx !== null) {
      return { type: 'FLOAT', figmaValue: emPx };
    }
  }

  // STRING: font-family — Figma accepts only a single font name, so reduce the
  // CSS fallback stack to the first (primary) font and strip any surrounding quotes.
  if (cssVarName?.includes('font-family')) {
    return { type: 'STRING', figmaValue: normalizeFontFamilyStack(v) };
  }

  // STRING fallback
  return { type: 'STRING', figmaValue: v };
}

/**
 * Resolve a value into the proper Figma payload object, dereferencing aliases to
 * the referenced variable's concrete type.
 *
 * Unlike {@link resolveValue}, this never returns the transient `ALIAS` type: an
 * alias is reported with the type of the variable it points to (falling back to
 * `STRING` when the target is unknown), while keeping the `VARIABLE_ALIAS`
 * payload as its `figmaValue`.
 *
 * @param {string} name
 * @param {string} value
 * @param {import('./id-map.mjs').IdMap} idMap
 * @param {((name: string) => string | undefined) | null} [varLookup]
 *   Optional CSS variable value resolver forwarded to {@link resolveValue}.
 * @returns {{ type: 'COLOR' | 'FLOAT' | 'STRING', figmaValue: unknown }}
 */
export function inferType(name, value, idMap, varLookup = null) {
  const resolved = resolveValue(value, idMap, varLookup, name);
  if (resolved.type !== 'ALIAS') {
    return resolved;
  }
  // For aliases, the concrete type is that of the referenced variable.
  const aliasMatch = value.trim().match(/^var\((--[a-zA-Z0-9-]+)\)$/);
  const refId = aliasMatch ? idMap.get(aliasMatch[1]) : undefined;
  const refType = refId ? idMap.getMeta(refId)?.type : undefined;
  return { type: refType ?? 'STRING', figmaValue: resolved.figmaValue };
}
