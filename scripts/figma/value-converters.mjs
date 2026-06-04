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
  // HLS to RGB
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
 * Resolve a `calc()` expression to a plain px number.
 *
 * Handles the following forms (N may be negative):
 *   • `calc(N * 1rem / var(--cds-global-base))`       — standard rem/base scale
 *   • `calc(N * (1rem / var(--cds-global-base)))`      — parenthesised form, same semantics
 *   • `calc(N * 1px)`                                  — explicit pixel multiply
 *
 * When `varLookup` is supplied, two additional forms are resolved recursively:
 *   • `calc((1rem / var(--cds-global-base)) * var(--scale-name))`
 *     → looks up `--scale-name` as a bare scale factor (e.g. 1, 0.875)
 *   • `calc(N * var(--name))`
 *     → looks up `--name`, resolves it to px, then multiplies by N
 *     (enables e.g. `calc(6 * var(--cds-internal-scale-2))` → 6 px at default scale)
 *
 * @param {string} value
 * @param {((name: string) => string | undefined) | null} [varLookup]
 *   Optional CSS variable value resolver used for the `var(--name)` patterns.
 * @returns {number | null}
 */
export function resolveCalcToPx(value, varLookup = null) {
  // calc(N * 1rem / var(--cds-global-base)) at default base 20 → N px  (N may be negative)
  let m = value.match(/^calc\(\s*(-?[\d.]+)\s*\*\s*1rem\s*\/\s*var\(--cds-global-base\)\s*\)$/);
  if (m) {
    return parseFloat(m[1]);
  }

  // calc(N * (1rem / var(--cds-global-base))) — parenthesised form, same semantics
  m = value.match(/^calc\(\s*(-?[\d.]+)\s*\*\s*\(1rem\s*\/\s*var\(--cds-global-base\)\)\s*\)$/);
  if (m) {
    return parseFloat(m[1]);
  }

  // calc(N * 1px)
  m = value.match(/^calc\(\s*(-?[\d.]+)\s*\*\s*1px\s*\)$/);
  if (m) {
    return parseFloat(m[1]);
  }

  if (varLookup) {
    // calc((1rem / var(--cds-global-base)) * var(--scale-name))
    // The scale variable holds a dimensionless multiplier (e.g. 1, 0.875).
    // Treating 1rem/base as 1 px at default scale, the result is that multiplier.
    m = value.match(/^calc\(\s*\(1rem\s*\/\s*var\(--cds-global-base\)\)\s*\*\s*var\((--[a-zA-Z0-9-]+)\)\s*\)$/);
    if (m) {
      const scaleRaw = varLookup(m[1]);
      if (scaleRaw !== undefined) {
        const scaleVal = parseFloat(scaleRaw);
        if (!isNaN(scaleVal)) {
          return scaleVal;
        }
      }
    }

    // calc(N * var(--name)) — resolve --name to px recursively, then multiply
    m = value.match(/^calc\(\s*(-?[\d.]+)\s*\*\s*var\((--[a-zA-Z0-9-]+)\)\s*\)$/);
    if (m) {
      const n = parseFloat(m[1]);
      const varRaw = varLookup(m[2]);
      if (varRaw !== undefined) {
        const varPx = resolveCalcToPx(varRaw, varLookup);
        if (varPx !== null) {
          return n * varPx;
        }
      }
    }
  }

  return null;
}

/**
 * Resolve a raw CSS value into a typed Figma payload.
 *
 * @param {string} rawValue
 * @param {import('./id-map.mjs').IdMap} idMap
 * @param {((name: string) => string | undefined) | null} [varLookup]
 *   Optional CSS variable value resolver forwarded to {@link resolveCalcToPx}.
 * @returns {{ type: 'ALIAS' | 'COLOR' | 'FLOAT' | 'STRING', figmaValue: unknown }}
 */
export function resolveValue(rawValue, idMap, varLookup = null) {
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

  // FLOAT: Npx
  const px = v.match(/^([\d.]+)px$/);
  if (px) {
    return { type: 'FLOAT', figmaValue: parseFloat(px[1]) };
  }

  // FLOAT: bare number (font weights, opacity, line-height)
  const bare = v.match(/^([\d.]+)$/);
  if (bare) {
    return { type: 'FLOAT', figmaValue: parseFloat(bare[1]) };
  }

  // FLOAT: N%  (e.g. border-radius: 50% → 50)
  const pct = v.match(/^([\d.]+)%$/);
  if (pct) {
    return { type: 'FLOAT', figmaValue: parseFloat(pct[1]) };
  }

  // FLOAT: calc expression
  const calcPx = resolveCalcToPx(v, varLookup);
  if (calcPx !== null) {
    return { type: 'FLOAT', figmaValue: calcPx };
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
  const resolved = resolveValue(value, idMap, varLookup);
  if (resolved.type !== 'ALIAS') {
    return resolved;
  }
  // For aliases, the concrete type is that of the referenced variable.
  const aliasMatch = value.trim().match(/^var\((--[a-zA-Z0-9-]+)\)$/);
  const refId = aliasMatch ? idMap.get(aliasMatch[1]) : undefined;
  const refType = refId ? idMap.getMeta(refId)?.type : undefined;
  return { type: refType ?? 'STRING', figmaValue: resolved.figmaValue };
}
