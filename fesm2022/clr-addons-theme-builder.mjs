import * as i21 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { EventEmitter, Input, ViewChild, Output, Component } from '@angular/core';
import * as i22 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ClrTimelineStepState, ClarityIcons, sunIcon, moonIcon, undoIcon, homeIcon, cogIcon, userIcon, ClarityModule } from '@clr/angular';
import * as i1 from '@clr/angular/emphasis/alert';
import * as i2 from '@clr/angular/emphasis/label';
import * as i3 from '@clr/angular/data/datagrid';
import * as i4 from '@clr/angular/data/stack-view';
import * as i5 from '@clr/angular/data/tree-view';
import * as i6 from '@clr/angular/icon';
import * as i7 from '@clr/angular/forms/common';
import * as i8 from '@clr/angular/forms/checkbox';
import * as i9 from '@clr/angular/forms/input';
import * as i10 from '@clr/angular/forms/radio';
import * as i11 from '@clr/angular/forms/textarea';
import * as i12 from '@clr/angular/layout/tabs';
import * as i13 from '@clr/angular/layout/vertical-nav';
import * as i14 from '@clr/angular/layout/breadcrumbs';
import * as i15 from '@clr/angular/popover/tooltip';
import * as i16 from '@clr/angular/wizard';
import * as i17 from '@clr/angular/accordion';
import * as i18 from '@clr/angular/stepper';
import * as i19 from '@clr/angular/progress/progress-bars';
import * as i20 from '@clr/angular/timeline';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
/** Normalizes a hue to `[0, 360)` — hue is cyclic, so out-of-range values wrap instead of clamping. */
function wrapDegrees(value) {
    return ((value % 360) + 360) % 360;
}
/** HSL color: hue wraps to 0–360, saturation/lightness clamp to 0–100. */
class HslColor {
    constructor(h, s, l) {
        this.h = wrapDegrees(h);
        this.s = clamp(s, 0, 100);
        this.l = clamp(l, 0, 100);
    }
}
/** RGB color: red/green/blue clamp to 0–255 and round to whole channel values. */
class RgbColor {
    constructor(r, g, b) {
        this.r = Math.round(clamp(r, 0, 255));
        this.g = Math.round(clamp(g, 0, 255));
        this.b = Math.round(clamp(b, 0, 255));
    }
}
/** LinearSRGB color: red/green/blue clamp to 0–1 — continuous linear light, not rounded. */
class LinearSrgbColor {
    constructor({ r, g, b }) {
        this.r = clamp(this.toLinear(r), 0, 1);
        this.g = clamp(this.toLinear(g), 0, 1);
        this.b = clamp(this.toLinear(b), 0, 1);
    }
    /** Un-gammas an sRGB channel (0–1) to linear light, per IEC 61966-2-1. */
    toLinear(c) {
        const s = c / 255;
        return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    }
}
/** OKLCH color: lightness clamps to 0–1, chroma clamps to ≥0, hue wraps to 0–360. */
class OklchColor {
    constructor(l, c, h) {
        this.l = clamp(l, 0, 1);
        this.c = Math.max(0, c);
        this.h = wrapDegrees(h);
    }
}
/** OKLab color: lightness clamps to 0–1; `a`/`b` are unbounded perceptual axes. */
class OKLabColor {
    constructor(l, a, b) {
        this.l = clamp(l, 0, 1);
        this.a = a;
        this.b = b;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * A single theme token: its CSS custom property name, the original Clarity-provided
 * HSL value, and the current (possibly user-edited) color. Colors are stored in HSL;
 * RGB and HEX are derived on demand.
 */
class Color {
    /**
     * @param name CSS custom property name, e.g. `--cds-alias-status-info`
     * @param originalColor Clarity-provided HSL, e.g. `hsl(198deg 100% 59%)`
     */
    constructor(name, originalColor) {
        this.name = name;
        this.originalColor = originalColor;
    }
    /** HSL components. Falls back to parsing `originalColor` when not explicitly set. */
    get color() {
        return this._color ?? this.parseHsl(this.originalColor);
    }
    set color(value) {
        this._color = value;
    }
    /** RGB components — HSL is converted to RGB only for relative luminance checks. */
    get rgb() {
        return this.hslToRgb(this.color);
    }
    /** HEX string — used by native color inputs. */
    get hex() {
        return this.hslToHex(this.color);
    }
    /** HSL string — used by native color inputs. */
    get hsl() {
        const { h, s, l } = this.color;
        return `hsl(${h}deg, ${s}%, ${l}%)`;
    }
    /**
     * OKLCH components — unlike HSL's `L`, OKLCH's `L` tracks perceived lightness
     * uniformly across all hues, which is why it's used for palette/contrast math.
     */
    get oklch() {
        return this.hslToOklch(this.color);
    }
    /** OKLCH string, CSS Color 4 syntax. */
    get oklchString() {
        const { l, c, h } = this.oklch;
        return `oklch(${Math.round(l * 1000) / 10}% ${Math.round(c * 10000) / 10000} ${Math.round(h * 10) / 10}deg)`;
    }
    /** Human-readable variant label derived from the token name suffix, e.g. `Tint dark`. */
    get label() {
        if (this.name.endsWith('-tint-dark')) {
            return 'Tint dark';
        }
        else if (this.name.endsWith('-tint')) {
            return 'Tint';
        }
        else if (this.name.endsWith('-shade')) {
            return 'Shade';
        }
        else if (this.name.endsWith('-dark')) {
            return 'Dark';
        }
        return 'Base';
    }
    get isOriginalColor() {
        // no original color override
        if (!this._color) {
            return true;
        }
        const originalColorHsl = this.parseHsl(this.originalColor);
        return (this._color.h === originalColorHsl.h &&
            this._color.s === originalColorHsl.s &&
            this._color.l === originalColorHsl.l);
    }
    static isHex(hex) {
        return /^#[0-9a-fA-F]{6}$/.test(hex);
    }
    static shiftL({ h, s, l }, delta) {
        return new HslColor(h, s, l + delta);
    }
    static hexToHsl(hex) {
        const h = hex.replace(/^#/, '');
        const full = h.length === 3 ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2] : h;
        const n = parseInt(full, 16);
        const r = ((n >> 16) & 255) / 255;
        const g = ((n >> 8) & 255) / 255;
        const b = (n & 255) / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;
        if (max === min) {
            return new HslColor(0, 0, Math.round(l * 10000) / 100);
        }
        const d = max - min;
        const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        let hue = 0;
        if (max === r) {
            hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        }
        else if (max === g) {
            hue = ((b - r) / d + 2) / 6;
        }
        else {
            hue = ((r - g) / d + 4) / 6;
        }
        // Round to second decimal. `s` and `l` are between 0 and 1.
        const saturation = Math.round(s * 10000) / 100;
        const lightness = Math.round(l * 10000) / 100;
        return new HslColor(Math.round(hue * 360), saturation, lightness);
    }
    /**
     * Converts HSL to OKLCH via linear sRGB and OKLab (CSS Color 4 / Björn Ottosson
     * formulas). Goes through OKLCH — not raw HSL — whenever perceptual uniformity
     * matters, since HSL's `L` looks lighter or darker depending on hue.
     */
    hslToOklch(hsl) {
        const linearSrgbColor = new LinearSrgbColor(this.hslToRgb(hsl));
        const oklabColor = this.linearSrgbToOklab(linearSrgbColor);
        const c = Math.sqrt(oklabColor.a * oklabColor.a + oklabColor.b * oklabColor.b);
        const hue = (Math.atan2(oklabColor.b, oklabColor.a) * 180) / Math.PI;
        return new OklchColor(oklabColor.l, c, hue);
    }
    reset() {
        this._color = undefined;
    }
    hslToHex({ h, s, l }) {
        l /= 100;
        const a = (s * Math.min(l, 1 - l)) / 100;
        const f = (n) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color)
                .toString(16)
                .padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
    /** Converts HSL to RGB — use only for relative luminance calculations. */
    hslToRgb({ h, s, l }) {
        l /= 100;
        const a = (s * Math.min(l, 1 - l)) / 100;
        const f = (n) => {
            const k = (n + h / 30) % 12;
            return 255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1));
        };
        return new RgbColor(f(0), f(8), f(4));
    }
    /** Converts linear sRGB (0–1 channels) to OKLab. */
    linearSrgbToOklab({ r, g, b }) {
        const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
        const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
        const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
        return new OKLabColor(0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s);
    }
    /** Parses a CSS HSL string such as `hsl(198deg 100% 59%)`. */
    parseHsl(input) {
        const [h = 0, s = 0, l = 0] = input.match(/[\d.]+/g)?.map(Number) ?? [];
        return new HslColor(h, s, l);
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const DEFAULT_OVERRIDES = {
    // primary
    '--cds-alias-primary-tint': ['--cds-alias-object-interaction-background-hover'],
    '--cds-alias-primary-shade': ['--cds-alias-typography-link-color', '--cds-alias-object-interaction-primary-hover'],
    '--cds-alias-primary-dark': [
        '--cds-alias-typography-link-color-hover',
        '--cds-alias-typography-primary-hover',
        '--cds-alias-object-interaction-primary-active',
    ],
    '--cds-alias-primary-tint-dark': [
        '--cds-alias-object-interaction-background-selected',
        '--cds-alias-object-interaction-background-shade-active',
        '--cds-alias-object-interaction-primary-secondary-hover',
    ],
    // info
    '--cds-alias-status-info': ['--cds-alias-utility-blue'],
    '--cds-alias-status-info-tint': [
        '--cds-alias-object-interaction-info-secondary-hover',
        '--cds-alias-utility-blue-tint',
    ],
    '--cds-alias-status-info-shade': [
        '--cds-alias-object-interaction-info-hover',
        '--cds-alias-typography-info-hover',
        '--cds-alias-utility-blue-shade',
    ],
    '--cds-alias-status-info-dark': [
        '--cds-alias-object-interaction-info-click',
        '--cds-alias-object-interaction-info-active',
        '--cds-alias-object-interaction-info-selected',
    ],
    // success
    '--cds-alias-status-success': ['--cds-alias-utility-green'],
    '--cds-alias-status-success-tint': [
        '--cds-alias-object-interaction-success-secondary-hover',
        '--cds-alias-utility-green-tint',
    ],
    '--cds-alias-status-success-shade': [
        '--cds-alias-object-interaction-success-hover',
        '--cds-alias-typography-success-hover',
        '--cds-alias-utility-green-shade',
    ],
    '--cds-alias-status-success-dark': [
        '--cds-alias-object-interaction-success-click',
        '--cds-alias-object-interaction-success-active',
    ],
    // warning
    '--cds-alias-status-warning': ['--cds-alias-utility-yellow'],
    '--cds-alias-status-warning-tint': [
        '--cds-alias-object-interaction-warning-secondary-hover',
        '--cds-alias-utility-yellow-tint',
    ],
    '--cds-alias-status-warning-shade': [
        '--cds-alias-object-interaction-warning-hover',
        '--cds-alias-typography-warning-hover',
        '--cds-alias-utility-yellow-shade',
    ],
    '--cds-alias-status-warning-dark': [
        '--cds-alias-object-interaction-warning-click',
        '--cds-alias-object-interaction-warning-active',
    ],
    //danger
    '--cds-alias-status-danger': ['--cds-alias-utility-red'],
    '--cds-alias-status-danger-tint': [
        '--cds-alias-object-interaction-danger-secondary-hover',
        '--cds-alias-utility-red-tint',
    ],
    '--cds-alias-status-danger-shade': [
        '--cds-alias-object-interaction-danger-hover',
        '--cds-alias-typography-danger-hover',
        '--cds-alias-utility-red-shade',
    ],
    '--cds-alias-status-danger-dark': [
        '--cds-alias-object-interaction-danger-click',
        '--cds-alias-object-interaction-danger-active',
    ],
};
const BACKGROUND_TOKENS = [
    {
        name: 'Text',
        token: '--cds-alias-typography-color-100',
    },
    {
        name: 'App Background',
        token: '--cds-alias-object-app-background',
    },
    {
        name: 'Interaction Background',
        token: '--cds-alias-object-interaction-background',
    },
    {
        name: 'Container Background',
        token: '--cds-alias-object-container-background',
    },
];
const TOKEN_KEYS = {
    baseTokens: [
        '--cds-alias-primary',
        '--cds-alias-status-info',
        '--cds-alias-status-success',
        '--cds-alias-status-warning',
        '--cds-alias-status-danger',
    ],
    primary: [
        '--cds-alias-primary',
        '--cds-alias-primary-tint',
        '--cds-alias-primary-tint-dark',
        '--cds-alias-primary-shade',
        '--cds-alias-primary-dark',
    ],
    info: [
        '--cds-alias-status-info',
        '--cds-alias-status-info-tint',
        '--cds-alias-status-info-shade',
        '--cds-alias-status-info-dark',
    ],
    success: [
        '--cds-alias-status-success',
        '--cds-alias-status-success-tint',
        '--cds-alias-status-success-shade',
        '--cds-alias-status-success-dark',
    ],
    warning: [
        '--cds-alias-status-warning',
        '--cds-alias-status-warning-tint',
        '--cds-alias-status-warning-shade',
        '--cds-alias-status-warning-dark',
    ],
    danger: [
        '--cds-alias-status-danger',
        '--cds-alias-status-danger-tint',
        '--cds-alias-status-danger-shade',
        '--cds-alias-status-danger-dark',
    ],
};
/** The Clarity theme. Acts as the identity preset that resets every color back to its shipped value. */
const CLARITY_DEFAULT_PRESET = {
    name: 'Clarity Default',
    light: null,
    dark: null,
};
const PRESETS = [
    {
        name: 'Evergreen',
        light: { primary: new Color('--cds-alias-primary', 'hsl(160deg 69% 36%)') }, // jade-600
        dark: { primary: new Color('--cds-alias-primary', 'hsl(160deg 69% 53%)') }, // jade-400
    },
    {
        name: 'Midnight',
        light: {
            primary: new Color('--cds-alias-primary', 'hsl(282deg 60% 49%)'), // violet-600
            success: new Color('--cds-alias-status-success', 'hsl(184deg 100% 34%)'), // aqua-600
            warning: new Color('--cds-alias-status-warning', 'hsl(50deg 100% 57%)'), // yellow-300
        },
        dark: {
            primary: new Color('--cds-alias-primary', 'hsl(282deg 60% 65%)'), // violet-400
            success: new Color('--cds-alias-status-success', 'hsl(184deg 100% 48%)'), // aqua-400
            warning: new Color('--cds-alias-status-warning', 'hsl(50deg 100% 57%)'), // yellow-300
        },
    },
    {
        name: 'Sunset',
        light: {
            primary: new Color('--cds-alias-primary', 'hsl(39deg 100% 50%)'), // ochre-600
            info: new Color('--cds-alias-status-info', 'hsl(238deg 60% 52%)'), // lavender-600
            success: new Color('--cds-alias-status-success', 'hsl(93deg 80% 37%)'), // green-600
            warning: new Color('--cds-alias-status-warning', 'hsl(9deg 100% 59%)'), // red-600
            danger: new Color('--cds-alias-status-danger', 'hsl(345deg 83% 40%)'), // magenta-600
        },
        dark: {
            primary: new Color('--cds-alias-primary', 'hsl(41deg 100% 70%)'), // ochre-400
            info: new Color('--cds-alias-status-info', 'hsl(238deg 58% 64%)'), // lavender-400
            success: new Color('--cds-alias-status-success', 'hsl(93deg 80% 48%)'), // green-400
            warning: new Color('--cds-alias-status-warning', 'hsl(9deg 100% 71%)'), // red-400
            danger: new Color('--cds-alias-status-danger', 'hsl(345deg 100% 61%)'), // magenta-400
        },
    },
    {
        name: 'Berry',
        light: {
            primary: new Color('--cds-alias-primary', 'hsl(345deg 83% 40%)'), // magenta-600
            info: new Color('--cds-alias-status-info', 'hsl(238deg 60% 52%)'), // lavender-600
            success: new Color('--cds-alias-status-success', 'hsl(160deg 69% 36%)'), // jade-600
            warning: new Color('--cds-alias-status-warning', 'hsl(42deg 100% 42%)'), // yellow-600
            danger: new Color('--cds-alias-status-danger', 'hsl(9deg 100% 59%)'), // red-600
        },
        dark: {
            primary: new Color('--cds-alias-primary', 'hsl(345deg 100% 61%)'), // magenta-400
            info: new Color('--cds-alias-status-info', 'hsl(238deg 58% 64%)'), // lavender-400
            success: new Color('--cds-alias-status-success', 'hsl(160deg 69% 53%)'), // jade-400
            warning: new Color('--cds-alias-status-warning', 'hsl(46deg 100% 52%)'), // yellow-400
            danger: new Color('--cds-alias-status-danger', 'hsl(9deg 100% 71%)'), // red-400
        },
    },
    {
        name: 'Ocean',
        light: {
            primary: new Color('--cds-alias-primary', 'hsl(184deg 100% 34%)'), // aqua-600
            info: new Color('--cds-alias-status-info', 'hsl(282deg 60% 49%)'), // violet-600
            success: new Color('--cds-alias-status-success', 'hsl(93deg 80% 37%)'), // green-600
            warning: new Color('--cds-alias-status-warning', 'hsl(42deg 100% 42%)'), // yellow-600
            danger: new Color('--cds-alias-status-danger', 'hsl(9deg 100% 59%)'), // red-600
        },
        dark: {
            primary: new Color('--cds-alias-primary', 'hsl(184deg 100% 43%)'), // aqua-500
            info: new Color('--cds-alias-status-info', 'hsl(282deg 60% 65%)'), // violet-400
            success: new Color('--cds-alias-status-success', 'hsl(93deg 80% 48%)'), // green-400
            warning: new Color('--cds-alias-status-warning', 'hsl(46deg 100% 52%)'), // yellow-400
            danger: new Color('--cds-alias-status-danger', 'hsl(9deg 100% 71%)'), // red-400
        },
    },
];
const SAMPLE_ROWS = [
    { name: 'Ada Lovelace', role: 'Engineer', status: 'Active' },
    { name: 'Grace Hopper', role: 'Architect', status: 'Active' },
    { name: 'Alan Turing', role: 'Researcher', status: 'Inactive' },
    { name: 'Linus Torvalds', role: 'Engineer', status: 'Active' },
    { name: 'Margaret Hamilton', role: 'Director', status: 'Active' },
];

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function generateCSS(colorStruct, warningTextOverrideEnabled = true) {
    const lines = ['/* Clarity Theme Override — generated by Clarity Theme Builder */'];
    const defaultOverrides = new Set();
    for (const theme in colorStruct) {
        const changedGroups = [];
        for (const colorGroupKey in colorStruct[theme]) {
            const colorVariants = colorStruct[theme][colorGroupKey];
            const changedColors = colorVariants.filter(color => !color.isOriginalColor);
            if (changedColors.length) {
                changedGroups.push({ key: colorGroupKey, colors: changedColors });
            }
        }
        if (!changedGroups.length) {
            continue;
        }
        lines.push(`\n\n[cds-theme~='${theme}'] {`);
        for (const group of changedGroups) {
            lines.push(`  /* ${group.key} */`);
            for (const color of group.colors) {
                lines.push(`  ${color.name}: ${color.hsl};`);
                // warning text override — mirrors the same condition applied live in applyPreviewStyles; light theme only
                if (warningTextOverrideEnabled && theme === 'light' && color.name === '--cds-alias-status-warning') {
                    lines.push(`  --cds-alias-typography-color-black: var(--cds-alias-typography-color-100);`);
                }
                DEFAULT_OVERRIDES[color.name]?.forEach((override) => {
                    const overrideResult = `  ${override}: var(${color.name});`;
                    if (!defaultOverrides.has(overrideResult)) {
                        defaultOverrides.add(overrideResult);
                    }
                });
            }
            lines.push('');
        }
        lines.push(`}`);
    }
    if (lines.length === 1) {
        lines.push('\n/* NO changes */');
    }
    if (defaultOverrides.size > 0) {
        const overrideLines = ['\n\n[cds-theme] {', ...defaultOverrides.values(), '}'];
        return lines.slice(0, 1).concat(overrideLines, lines.slice(1));
    }
    return lines;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const redCoefficient = 0.2126;
const greenCoefficient = 0.7152;
const blueCoefficient = 0.0722;
const lowGammaCoefficient = 12.92;
function adjustGamma(v) {
    return Math.pow((v + 0.055) / 1.055, 2.4);
}
function relativeLuminance({ r, g, b }) {
    const colorMap = [r, g, b].map(c => {
        const s = c / 255;
        return s <= 0.03928 ? s / lowGammaCoefficient : adjustGamma(s);
    });
    return colorMap[0] * redCoefficient + colorMap[1] * greenCoefficient + colorMap[2] * blueCoefficient;
}
function contrastRatio(a, b) {
    const l1 = relativeLuminance(a);
    const l2 = relativeLuminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
function wcagScore(ratio) {
    const result = {
        label: 'Fail',
        score: Math.max(ratio, 0).toFixed(2),
        type: 'danger',
    };
    if (ratio >= 7) {
        result.label = 'AAA';
        result.type = 'success';
    }
    else if (ratio >= 4.5) {
        result.label = 'AA';
        result.type = 'success';
    }
    else if (ratio >= 3) {
        result.label = 'AA Large';
        result.type = 'warning';
    }
    return result;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ThemeBuilderComponent {
    constructor() {
        /** Emits the generated CSS override text whenever a color, preset, reset, or override toggle changes. */
        this.generatedCSS = new EventEmitter();
        // Tracks which preset is active so CSS output can use token refs instead of hex values.
        // Set to null when the user manually edits any color.
        this.activePreset = null;
        this.activeTheme = 'light';
        // Forces black text on the warning color for legibility — toggled via the "Warning text override" switch.
        this.warningTextOverrideEnabled = true;
        this.colorStruct = {
            light: {},
            dark: {},
        };
        this.backgrounds = {
            light: {},
            dark: {},
        };
        this.themeColors = [];
        // State backing the built-in default preview content.
        this.breadcrumbs = [
            { label: 'Framework', href: 'javascript://' },
            { label: 'Angular', href: 'javascript://' },
            { label: 'Clarity', href: 'javascript://' },
        ];
        this.wizardOpen = false;
        this.rows = SAMPLE_ROWS;
        this.stepperForm = {
            account: { fullName: '' },
            confirm: { agree: false },
        };
        this.timelineStates = ClrTimelineStepState;
        this._presets = [CLARITY_DEFAULT_PRESET, ...PRESETS];
        ClarityIcons.addIcons(sunIcon, moonIcon, undoIcon, homeIcon, cogIcon, userIcon);
    }
    /**
     * Presets available in the preset selector. Defaults to Clarity's built-in preset list.
     * The Clarity Default preset is always prepended, so it's guaranteed to remain available
     * as a fallback even when a custom list is provided.
     */
    get presets() {
        return this._presets;
    }
    set presets(value) {
        this._presets = [CLARITY_DEFAULT_PRESET, ...(value ?? [])];
    }
    get isDarkTheme() {
        return this.activeTheme === 'dark';
    }
    get generatedCss() {
        return generateCSS(this.colorStruct, this.warningTextOverrideEnabled).join('\n');
    }
    ngOnInit() {
        this.activePreset = this.presets?.[0] ?? null;
    }
    ngAfterViewInit() {
        this.buildColorStructure();
        this.applyPreviewStyles();
    }
    toggleActiveTheme() {
        this.activeTheme = this.activeTheme === 'dark' ? 'light' : 'dark';
        this.applyPreviewStyles();
        this.refreshThemeColors();
    }
    setCurrentColor(colorVariant, hex, colorGroup = []) {
        if (Color.isHex(hex)) {
            colorVariant.color = Color.hexToHsl(hex);
            this.colorBuilder(colorVariant, colorGroup);
            this.applyPreviewStyles();
            this.refreshThemeColors();
            this.resetActivePreset();
        }
    }
    applyPreset(preset) {
        this.activePreset = preset;
        for (const theme of Object.keys(this.activePreset)) {
            if (theme === 'name') {
                continue;
            }
            this.resetAllThemeColors(theme);
            if (!this.activePreset[theme]) {
                continue;
            }
            for (const activePresetKey of Object.keys(this.activePreset[theme])) {
                const presetColor = this.activePreset[theme][activePresetKey];
                const activeColor = this.colorStruct[theme][activePresetKey].find(c => c.name === presetColor.name);
                activeColor.color = presetColor.color;
                this.colorBuilder(activeColor, this.colorStruct[theme][activePresetKey], theme === 'dark');
            }
        }
        this.applyPreviewStyles();
        this.refreshThemeColors();
    }
    resetAllThemeColors(theme) {
        for (const key of Object.keys(this.colorStruct[theme])) {
            const tokenGroup = this.colorStruct[theme][key];
            for (let i = 0; i < tokenGroup.length; i++) {
                tokenGroup[i].reset();
            }
        }
    }
    resetColor($event, color, colorGroup = []) {
        $event.stopPropagation();
        color.reset();
        colorGroup?.forEach(color => {
            color.reset();
        });
        this.applyPreviewStyles();
        this.refreshThemeColors();
        this.resetActivePreset();
    }
    onWarningTextOverrideChange() {
        this.applyPreviewStyles();
        this.generatedCSS.emit(this.generatedCss);
    }
    applyPreviewStyles() {
        const el = this.previewWrapper?.nativeElement;
        if (!el) {
            return;
        }
        const colorGroups = this.colorStruct[this.activeTheme];
        for (const colorGroupKey in colorGroups) {
            const colorVariants = colorGroups[colorGroupKey];
            for (let i = 0; i < colorVariants.length; i++) {
                const color = colorVariants[i];
                el.style.setProperty(color.name, color.hsl);
                // warning text override — toggled via the "Warning text override" switch; light theme only
                if (color.name === '--cds-alias-status-warning') {
                    const override = '--cds-alias-typography-color-black';
                    if (this.activeTheme !== 'light' || !this.warningTextOverrideEnabled || color.isOriginalColor) {
                        el.style.removeProperty(override);
                    }
                    else {
                        el.style.setProperty(override, 'var(--cds-alias-typography-color-100)');
                    }
                }
                DEFAULT_OVERRIDES[color.name]?.forEach((override) => {
                    // remove override if color isOriginalColor
                    // another shorter variant is:
                    // el.style.setProperty(override, color.isOriginalColor ? null : `var(${color.name})`);
                    if (color.isOriginalColor) {
                        el.style.removeProperty(override);
                    }
                    else {
                        el.style.setProperty(override, `var(${color.name})`);
                    }
                });
            }
        }
    }
    getContrast(color) {
        const backgrounds = [];
        let minScore = 10;
        for (const bgName in this.backgrounds[this.activeTheme]) {
            const background = this.backgrounds[this.activeTheme][bgName];
            const score = Math.max(contrastRatio(color.rgb, background.rgb), 0);
            if (minScore > score) {
                minScore = score;
            }
            backgrounds.push({
                name: bgName,
                score,
                wcag: wcagScore(score),
            });
        }
        return {
            minContrast: { wcag: wcagScore(minScore), score: minScore },
            backgrounds,
        };
    }
    refreshThemeColors() {
        const themeColors = [];
        const colorGroups = this.colorStruct[this.activeTheme];
        for (const key of Object.keys(colorGroups)) {
            const colorGroup = colorGroups[key];
            const baseColor = colorGroup.find(c => c.label === 'Base');
            themeColors.push({
                key,
                base: baseColor,
                variants: colorGroup.filter(c => c.label !== 'Base'),
                contrast: this.getContrast(baseColor),
            });
        }
        this.themeColors = themeColors;
        this.generatedCSS.emit(this.generatedCss);
    }
    resetActivePreset() {
        const themes = Object.values(this.colorStruct);
        const allOriginal = themes.every(theme => {
            return Object.values(theme).every(colors => {
                return colors.every(color => color.isOriginalColor);
            });
        });
        this.activePreset = allOriginal ? (this.presets?.[0] ?? null) : null;
    }
    colorBuilder(colorVariant, colorGroup, isDarkTheme = this.isDarkTheme) {
        if (TOKEN_KEYS.baseTokens.includes(colorVariant.name)) {
            const baseColorHSL = colorVariant.color;
            colorGroup.forEach(item => {
                if (item.name.endsWith('-tint')) {
                    item.color = new HslColor(baseColorHSL.h, baseColorHSL.s, isDarkTheme ? 25 : 94);
                }
                else if (item.name.endsWith('-tint-dark')) {
                    item.color = new HslColor(baseColorHSL.h, baseColorHSL.s, isDarkTheme ? 18 : 95);
                }
                else if (item.name.endsWith('-shade')) {
                    item.color = Color.shiftL(baseColorHSL, isDarkTheme ? 7 : -7);
                }
                else if (item.name.endsWith('-dark')) {
                    item.color = Color.shiftL(baseColorHSL, isDarkTheme ? 20 : -10);
                }
            });
        }
    }
    buildColorStructure() {
        const lightEl = this.previewWrapper?.nativeElement;
        const darkEl = this.previewDarkWrapper?.nativeElement;
        if (!lightEl || !darkEl) {
            return;
        }
        const lightStyles = window.getComputedStyle(lightEl);
        const darkStyles = window.getComputedStyle(darkEl);
        for (const key in TOKEN_KEYS) {
            if (key === 'baseTokens') {
                continue;
            }
            const tokenGroup = TOKEN_KEYS[key];
            this.colorStruct['light'][key] = [];
            this.colorStruct['dark'][key] = [];
            for (let i = 0; i < tokenGroup.length; i++) {
                this.colorStruct['light'][key].push(new Color(tokenGroup[i], lightStyles.getPropertyValue(tokenGroup[i])));
                this.colorStruct['dark'][key].push(new Color(tokenGroup[i], darkStyles.getPropertyValue(tokenGroup[i])));
            }
        }
        BACKGROUND_TOKENS.forEach(bg => {
            this.backgrounds['light'][bg.name] = new Color(bg.token, lightStyles.getPropertyValue(bg.token));
            this.backgrounds['dark'][bg.name] = new Color(bg.token, darkStyles.getPropertyValue(bg.token));
        });
        this.refreshThemeColors();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.22", ngImport: i0, type: ThemeBuilderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.22", type: ThemeBuilderComponent, isStandalone: true, selector: "clr-theme-builder", inputs: { presets: "presets" }, outputs: { generatedCSS: "generatedCSS" }, viewQueries: [{ propertyName: "previewWrapper", first: true, predicate: ["previewWrapper"], descendants: true }, { propertyName: "previewDarkWrapper", first: true, predicate: ["previewDarkWrapper"], descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<!-- Preset selector -->\n<div class=\"tb-presets\" cds-layout=\"m-t:lg\">\n  <div class=\"tb-preset-cards clr-row\">\n    @for (preset of presets; track preset.name) {\n      <a\n        href=\"javascript://\"\n        class=\"card clickable tb-preset-card clr-col-1\"\n        [class.tb-preset-card-active]=\"activePreset?.name === preset.name\"\n        (click)=\"applyPreset(preset)\"\n      >\n        <div class=\"tb-preset-swatch\" [style.background-color]=\"preset.light?.primary?.hex\"></div>\n        <div class=\"card-text\">{{ preset.name }}</div>\n      </a>\n    }\n  </div>\n</div>\n\n<!-- \u2500\u2500 Preview DARK card \u2500\u2500 -->\n<!-- Invisible for filling the dark values on initial load -->\n<div style=\"display: none\" #previewDarkWrapper cds-theme=\"dark\"></div>\n\n<!-- \u2500\u2500 Two-column layout: controls | preview \u2500\u2500 -->\n<div class=\"tb-layout\" cds-layout=\"m-t:lg m-b:lg\">\n  <!-- \u2500\u2500 Controls card (sticky left column) \u2500\u2500 -->\n  <div class=\"card tb-controls-card\">\n    <div class=\"card-block\">\n      @for (colorGroup of themeColors; track colorGroup.key) {\n        <div>\n          <clr-stack-view>\n            <clr-stack-header>\n              <div class=\"tb-control-header\">\n                {{ colorGroup.key | uppercase }}\n\n                <clr-tooltip>\n                  <clr-label\n                    cds-layout=\"m:none\"\n                    clrTooltipTrigger\n                    [clrText]=\"'Contrast ' + colorGroup.contrast.minContrast.wcag.label\"\n                    [clrBadgeText]=\"colorGroup.contrast.minContrast.wcag.score\"\n                    [clrColor]=\"colorGroup.contrast.minContrast.wcag.type\"\n                  >\n                  </clr-label>\n                  <clr-tooltip-content clrPosition=\"right\" clrSize=\"lg\">\n                    <div class=\"tb-wcag-container\">\n                      @for (background of colorGroup.contrast.backgrounds; track background.name) {\n                        <div class=\"tb-wcag-item\">\n                          {{ background.name }}:\n                          <clr-label\n                            cds-layout=\"m:none\"\n                            clrType=\"solid\"\n                            [clrText]=\"background.wcag.label\"\n                            [clrBadgeText]=\"background.wcag.score\"\n                            [clrColor]=\"background.wcag.type\"\n                          />\n                        </div>\n                      }\n                    </div>\n                  </clr-tooltip-content>\n                </clr-tooltip>\n              </div>\n            </clr-stack-header>\n            <clr-stack-block [clrStackViewLevel]=\"1\">\n              <clr-stack-label class=\"tb-stack-label\">{{ colorGroup.base.label }}</clr-stack-label>\n              <clr-stack-content style=\"width: 52%\">\n                <div class=\"tb-color-input-wrap\">\n                  <input\n                    type=\"color\"\n                    class=\"tb-color-picker\"\n                    [value]=\"colorGroup.base.hex\"\n                    [attr.aria-label]=\"colorGroup.key + ' ' + colorGroup.base.label + ' color picker'\"\n                    (input)=\"\n                      setCurrentColor(\n                        colorGroup.base,\n                        $any($event.target).value,\n                        colorStruct[activeTheme][colorGroup.key]\n                      )\n                    \"\n                  />\n                  <input\n                    readonly\n                    type=\"text\"\n                    class=\"tb-hex-input\"\n                    [value]=\"colorGroup.base.hex\"\n                    [attr.aria-label]=\"colorGroup.key + ' ' + colorGroup.base.label + ' color hex value'\"\n                  />\n                  <button\n                    *ngIf=\"!colorGroup.base.isOriginalColor\"\n                    class=\"btn btn-sm btn-icon btn-primary\"\n                    (click)=\"resetColor($event, colorGroup.base, colorStruct[activeTheme][colorGroup.key])\"\n                    title=\"Back to original color\"\n                  >\n                    <cds-icon shape=\"undo\"></cds-icon>\n                  </button>\n                </div>\n              </clr-stack-content>\n\n              @for (colorVariant of colorGroup.variants; track colorVariant.label) {\n                <clr-stack-block [clrStackViewLevel]=\"2\">\n                  <clr-stack-label>{{ colorVariant.label }}</clr-stack-label>\n                  <clr-stack-content>\n                    <div class=\"tb-color-input-wrap\">\n                      <input\n                        type=\"color\"\n                        class=\"tb-color-picker\"\n                        [value]=\"colorVariant.hex\"\n                        [attr.aria-label]=\"colorGroup.key + ' ' + colorVariant.label + ' color picker'\"\n                        (input)=\"setCurrentColor(colorVariant, $any($event.target).value)\"\n                      />\n                      <input\n                        readonly\n                        type=\"text\"\n                        class=\"tb-hex-input\"\n                        [value]=\"colorVariant.hex\"\n                        [attr.aria-label]=\"colorGroup.key + ' ' + colorVariant.label + ' color hex value'\"\n                      />\n                      <button\n                        *ngIf=\"!colorVariant.isOriginalColor\"\n                        class=\"btn btn-sm btn-icon btn-primary\"\n                        (click)=\"resetColor($event, colorVariant)\"\n                        title=\"Back to original color\"\n                      >\n                        <cds-icon shape=\"undo\"></cds-icon>\n                      </button>\n                    </div>\n                  </clr-stack-content>\n                </clr-stack-block>\n              }\n            </clr-stack-block>\n          </clr-stack-view>\n\n          @if (colorGroup.key === 'warning' && !colorGroup.base.isOriginalColor) {\n            <clr-toggle-wrapper>\n              <input\n                type=\"checkbox\"\n                clrToggle\n                [(ngModel)]=\"warningTextOverrideEnabled\"\n                (ngModelChange)=\"onWarningTextOverrideChange()\"\n              />\n              <label>Light Theme Warning Text Override</label>\n            </clr-toggle-wrapper>\n          }\n        </div>\n      }\n    </div>\n  </div>\n  <!-- end controls card -->\n\n  <!-- \u2500\u2500 Preview card (right column) \u2500\u2500 -->\n  <div class=\"card tb-preview-card\">\n    <div class=\"card-header\">\n      Live Preview:\n      <button\n        class=\"btn btn-outline-neutral\"\n        [attr.aria-label]=\"'Switch to ' + (isDarkTheme ? 'light' : 'dark') + ' theme'\"\n        (click)=\"toggleActiveTheme()\"\n      >\n        <cds-icon [shape]=\"isDarkTheme ? 'moon' : 'sun'\" [solid]=\"true\" [size]=\"'md'\"></cds-icon>\n        {{ isDarkTheme ? 'Dark' : 'Light' }}\n      </button>\n    </div>\n\n    <div class=\"card-block tb-preview-sandbox\" #previewWrapper [attr.cds-theme]=\"activeTheme\">\n      <ng-content></ng-content>\n\n      <!-- Breadcrumbs -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Breadcrumbs</p>\n        <div class=\"tb-preview-row\">\n          <clr-breadcrumbs [items]=\"breadcrumbs\"></clr-breadcrumbs>\n        </div>\n      </div>\n\n      <!-- Buttons -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Buttons</p>\n        <div class=\"tb-preview-row\">\n          <button class=\"btn btn-primary\">Primary</button>\n          <button class=\"btn\">Primary Outline</button>\n          <button class=\"btn btn-link\">Primary FLAT</button>\n          <button class=\"btn btn-info\">Info</button>\n          <button class=\"btn btn-info-outline\">Info Outline</button>\n          <button class=\"btn btn-link-info\">Info Flat</button>\n          <button class=\"btn btn-danger\">Danger</button>\n          <button class=\"btn btn-success\">Success</button>\n          <button class=\"btn btn-warning\">Warning</button>\n          <button class=\"btn btn-primary\" disabled>Disabled</button>\n        </div>\n      </div>\n\n      <!-- Badges & Labels -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Badges &amp; Labels</p>\n        <div class=\"tb-preview-row\">\n          <clr-label\n            [clrType]=\"'outlined'\"\n            [clrClickable]=\"true\"\n            [clrColor]=\"'info'\"\n            [clrText]=\"'info'\"\n            [clrBadgeText]=\"'99+'\"\n          />\n          <clr-label [clrType]=\"'outlined'\" [clrColor]=\"'danger'\" [clrText]=\"'danger'\" [clrBadgeText]=\"'99+'\" />\n          <clr-label [clrType]=\"'outlined'\" [clrColor]=\"'success'\" [clrText]=\"'success'\" [clrBadgeText]=\"'99+'\" />\n          <clr-label\n            [clrType]=\"'outlined'\"\n            [clrClickable]=\"true\"\n            [clrColor]=\"'warning'\"\n            [clrText]=\"'warning'\"\n            [clrBadgeText]=\"'99+'\"\n          />\n\n          <clr-label [clrType]=\"'solid'\" [clrColor]=\"'info'\" [clrText]=\"'info'\" [clrBadgeText]=\"'99+'\" />\n          <clr-label\n            [clrType]=\"'solid'\"\n            [clrClickable]=\"true\"\n            [clrColor]=\"'danger'\"\n            [clrText]=\"'danger'\"\n            [clrBadgeText]=\"'99+'\"\n          />\n          <clr-label\n            [clrType]=\"'solid'\"\n            [clrClickable]=\"true\"\n            [clrColor]=\"'success'\"\n            [clrText]=\"'success'\"\n            [clrBadgeText]=\"'99+'\"\n          />\n          <clr-label [clrType]=\"'solid'\" [clrColor]=\"'warning'\" [clrText]=\"'warning'\" [clrBadgeText]=\"'99+'\" />\n        </div>\n      </div>\n\n      <!-- Alerts -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Alerts</p>\n        <clr-alert [clrAlertType]=\"'info'\">\n          <clr-alert-item><span class=\"alert-text\">This is an info alert.</span></clr-alert-item>\n        </clr-alert>\n        <clr-alert [clrAlertType]=\"'success'\">\n          <clr-alert-item><span class=\"alert-text\">Operation completed successfully.</span></clr-alert-item>\n        </clr-alert>\n        <clr-alert [clrAlertType]=\"'warning'\">\n          <clr-alert-item><span class=\"alert-text\">Please review before proceeding.</span></clr-alert-item>\n        </clr-alert>\n        <clr-alert [clrAlertType]=\"'danger'\">\n          <clr-alert-item><span class=\"alert-text\">Something went wrong.</span></clr-alert-item>\n        </clr-alert>\n      </div>\n\n      <!-- App-Level Alerts -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">App-Level Alerts</p>\n        <clr-alert [clrAlertType]=\"'info'\" [clrAlertAppLevel]=\"true\">\n          <clr-alert-item>\n            <span class=\"alert-text\">This is an app level info.</span>\n            <div class=\"alert-actions\">\n              <button class=\"btn alert-action\"><cds-icon shape=\"user\"></cds-icon>Thanks</button>\n            </div>\n          </clr-alert-item>\n        </clr-alert>\n        <clr-alert [clrAlertType]=\"'danger'\" [clrAlertAppLevel]=\"true\">\n          <clr-alert-item>\n            <span class=\"alert-text\">This is an app level alert.</span>\n            <div class=\"alert-actions\">\n              <button class=\"btn alert-action\"><cds-icon shape=\"user\"></cds-icon>Fix</button>\n            </div>\n          </clr-alert-item>\n        </clr-alert>\n        <clr-alert [clrAlertType]=\"'warning'\" [clrAlertAppLevel]=\"true\">\n          <clr-alert-item>\n            <span class=\"alert-text\">This is an app level warning.</span>\n            <div class=\"alert-actions\">\n              <button class=\"btn alert-action\"><cds-icon shape=\"user\"></cds-icon>Check</button>\n            </div>\n          </clr-alert-item>\n        </clr-alert>\n        <clr-alert [clrAlertType]=\"'success'\" [clrAlertAppLevel]=\"true\">\n          <clr-alert-item>\n            <span class=\"alert-text\">This is an app level success.</span>\n            <div class=\"alert-actions\">\n              <button class=\"btn alert-action\"><cds-icon shape=\"user\"></cds-icon>Great</button>\n            </div>\n          </clr-alert-item>\n        </clr-alert>\n      </div>\n\n      <!-- Forms -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Form Controls</p>\n        <form clrForm #tbForm=\"ngForm\" clrLayout=\"horizontal\">\n          <clr-input-container>\n            <label>Text input</label>\n            <input clrInput type=\"text\" placeholder=\"Enter value...\" />\n          </clr-input-container>\n          <clr-checkbox-container>\n            <label>Checkbox</label>\n            <clr-checkbox-wrapper>\n              <input type=\"checkbox\" clrCheckbox checked />\n              <label>Checkbox (checked)</label>\n            </clr-checkbox-wrapper>\n            <clr-checkbox-wrapper>\n              <input type=\"checkbox\" clrCheckbox />\n              <label>Checkbox (unchecked)</label>\n            </clr-checkbox-wrapper>\n          </clr-checkbox-container>\n          <clr-radio-container>\n            <label>Radio</label>\n            <clr-radio-wrapper>\n              <input type=\"radio\" clrRadio name=\"r1\" value=\"a\" checked />\n              <label>Radio A</label>\n            </clr-radio-wrapper>\n            <clr-radio-wrapper>\n              <input type=\"radio\" clrRadio name=\"r1\" value=\"b\" />\n              <label>Radio B</label>\n            </clr-radio-wrapper>\n          </clr-radio-container>\n          <clr-toggle-container>\n            <label>Toggle</label>\n            <clr-toggle-wrapper>\n              <input type=\"checkbox\" clrToggle checked />\n              <label>Toggle (on)</label>\n            </clr-toggle-wrapper>\n          </clr-toggle-container>\n\n          <clr-textarea-container>\n            <label>Textarea</label>\n            <textarea clrTextarea [(ngModel)]=\"description\" name=\"description\" required></textarea>\n            <clr-control-helper>Please provide a description.</clr-control-helper>\n            <clr-control-error *clrIfError=\"'required'\">You must provide a description!</clr-control-error>\n          </clr-textarea-container>\n        </form>\n      </div>\n\n      <!-- Accordion -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Accordion</p>\n        <clr-accordion>\n          <clr-accordion-panel [clrAccordionPanelOpen]=\"true\">\n            <clr-accordion-title>Panel One</clr-accordion-title>\n            <clr-accordion-content>Content for the first accordion panel.</clr-accordion-content>\n          </clr-accordion-panel>\n          <clr-accordion-panel>\n            <clr-accordion-title>Panel Two</clr-accordion-title>\n            <clr-accordion-content>Content for the second accordion panel.</clr-accordion-content>\n          </clr-accordion-panel>\n        </clr-accordion>\n      </div>\n\n      <!-- Tree view -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Tree View</p>\n        <clr-tree>\n          <clr-tree-node [clrExpanded]=\"true\">\n            Root Node\n            <clr-tree-node [clrSelected]=\"1\"> Child One </clr-tree-node>\n            <clr-tree-node>\n              Child Two\n              <clr-tree-node>Grandchild</clr-tree-node>\n            </clr-tree-node>\n          </clr-tree-node>\n        </clr-tree>\n      </div>\n\n      <!-- Progress bar -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Progress Bar</p>\n        <clr-progress-bar clrValue=\"20\" clrMax=\"100\"></clr-progress-bar>\n        <clr-progress-bar clrValue=\"55\" clrMax=\"100\" clrColor=\"warning\" clrLabeled></clr-progress-bar>\n        <clr-progress-bar clrValue=\"80\" clrMax=\"100\" clrColor=\"success\"></clr-progress-bar>\n        <clr-progress-bar clrValue=\"40\" clrMax=\"100\" clrColor=\"danger\"></clr-progress-bar>\n      </div>\n\n      <!-- Vertical nav -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Vertical Navigation</p>\n        <div class=\"tb-nav-preview-wrap\">\n          <clr-vertical-nav [clrVerticalNavCollapsible]=\"true\">\n            <clr-vertical-nav-group clrVerticalNavGroupExpanded>\n              <cds-icon shape=\"home\" clrVerticalNavIcon></cds-icon>\n              Dashboard\n              <clr-vertical-nav-group-children>\n                <a clrVerticalNavLink href=\"javascript:void(0)\" class=\"active\">Overview</a>\n                <a clrVerticalNavLink href=\"javascript:void(0)\">Analytics</a>\n              </clr-vertical-nav-group-children>\n            </clr-vertical-nav-group>\n            <clr-vertical-nav-group>\n              <cds-icon shape=\"cog\" clrVerticalNavIcon></cds-icon>\n              Settings\n              <clr-vertical-nav-group-children>\n                <a clrVerticalNavLink href=\"javascript:void(0)\">Profile</a>\n                <a clrVerticalNavLink href=\"javascript:void(0)\">Security</a>\n              </clr-vertical-nav-group-children>\n            </clr-vertical-nav-group>\n          </clr-vertical-nav>\n        </div>\n      </div>\n\n      <!-- Stepper -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Stepper</p>\n        <form clrStepper #tbStepperForm=\"ngForm\">\n          <clr-stepper-panel ngModelGroup=\"account\">\n            <clr-step-title>Account Details</clr-step-title>\n            <clr-step-description>Tell us about yourself</clr-step-description>\n            <clr-step-content>\n              <clr-input-container>\n                <label>Full Name</label>\n                <input clrInput name=\"fullName\" [(ngModel)]=\"stepperForm.account.fullName\" />\n              </clr-input-container>\n              <button clrStepButton=\"next\">Next</button>\n            </clr-step-content>\n          </clr-stepper-panel>\n\n          <clr-stepper-panel ngModelGroup=\"confirm\">\n            <clr-step-title>Confirmation</clr-step-title>\n            <clr-step-description>Review and submit</clr-step-description>\n            <clr-step-content>\n              <clr-checkbox-container>\n                <clr-checkbox-wrapper>\n                  <input type=\"checkbox\" clrCheckbox name=\"agree\" [(ngModel)]=\"stepperForm.confirm.agree\" />\n                  <label>I agree to the terms</label>\n                </clr-checkbox-wrapper>\n              </clr-checkbox-container>\n              <button clrStepButton=\"previous\">Previous</button>\n              <button clrStepButton=\"submit\">Submit</button>\n            </clr-step-content>\n          </clr-stepper-panel>\n        </form>\n      </div>\n\n      <!-- Datagrid -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Datagrid</p>\n        <clr-datagrid [clrDgSelectionType]=\"'multi'\">\n          <clr-dg-column>Name</clr-dg-column>\n          <clr-dg-column>Role</clr-dg-column>\n          <clr-dg-column>Status</clr-dg-column>\n          @for (row of rows; track row.name) {\n            <clr-dg-row [clrDgItem]=\"row\">\n              <clr-dg-cell>{{ row.name }}</clr-dg-cell>\n              <clr-dg-cell>{{ row.role }}</clr-dg-cell>\n              <clr-dg-cell>\n                <span\n                  class=\"badge\"\n                  [class.badge-success]=\"row.status === 'Active'\"\n                  [class.badge-danger]=\"row.status === 'Inactive'\"\n                >\n                  {{ row.status }}\n                </span>\n              </clr-dg-cell>\n            </clr-dg-row>\n          }\n          <clr-dg-footer>{{ rows.length }} users</clr-dg-footer>\n        </clr-datagrid>\n      </div>\n\n      <!-- Tabs -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Tabs</p>\n        <clr-tabs>\n          <clr-tab>\n            <button clrTabLink>Dashboard</button>\n            <clr-tab-content>\n              <p>Content for the Dashboard tab.</p>\n            </clr-tab-content>\n          </clr-tab>\n          <clr-tab>\n            <button clrTabLink>Management</button>\n            <clr-tab-content>\n              <p>Content for the Management tab.</p>\n            </clr-tab-content>\n          </clr-tab>\n          <clr-tab>\n            <button clrTabLink>Settings</button>\n            <clr-tab-content>\n              <p>Content for the Settings tab.</p>\n            </clr-tab-content>\n          </clr-tab>\n        </clr-tabs>\n      </div>\n\n      <!-- Timeline -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Timeline</p>\n        <clr-timeline>\n          <clr-timeline-step [clrState]=\"timelineStates.SUCCESS\">\n            <clr-timeline-step-header>11:59 am</clr-timeline-step-header>\n            <clr-timeline-step-title>Add KMS</clr-timeline-step-title>\n            <clr-timeline-step-description>Root CA certificate requested.</clr-timeline-step-description>\n          </clr-timeline-step>\n          <clr-timeline-step [clrState]=\"timelineStates.CURRENT\">\n            <clr-timeline-step-header>12:04 pm</clr-timeline-step-header>\n            <clr-timeline-step-title>Make KMS trust vCenter</clr-timeline-step-title>\n            <clr-timeline-step-description>\n              Upload the certificate to the KMS to complete the connection.\n            </clr-timeline-step-description>\n          </clr-timeline-step>\n          <clr-timeline-step [clrState]=\"timelineStates.NOT_STARTED\">\n            <clr-timeline-step-header>--:-- --</clr-timeline-step-header>\n            <clr-timeline-step-title>Enable Encryption</clr-timeline-step-title>\n            <clr-timeline-step-description>Not started yet.</clr-timeline-step-description>\n          </clr-timeline-step>\n        </clr-timeline>\n      </div>\n\n      <!-- Wizard launcher -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Wizard</p>\n        <button class=\"btn btn-outline\" (click)=\"wizardOpen = true\">Open Wizard</button>\n        <clr-wizard [(clrWizardOpen)]=\"wizardOpen\" clrWizardSize=\"md\">\n          <clr-wizard-title>Sample Wizard</clr-wizard-title>\n          <clr-wizard-button [type]=\"'cancel'\">Cancel</clr-wizard-button>\n          <clr-wizard-button [type]=\"'previous'\">Back</clr-wizard-button>\n          <clr-wizard-button [type]=\"'next'\">Next</clr-wizard-button>\n          <clr-wizard-button [type]=\"'finish'\">Finish</clr-wizard-button>\n          <clr-wizard-page>\n            <ng-template clrPageTitle>Step 1: Introduction</ng-template>\n            Welcome to the wizard. This step introduces the process.\n          </clr-wizard-page>\n          <clr-wizard-page>\n            <ng-template clrPageTitle>Step 2: Configuration</ng-template>\n            Configure the required options in this step.\n          </clr-wizard-page>\n          <clr-wizard-page>\n            <ng-template clrPageTitle>Step 3: Confirm</ng-template>\n            Review your choices and click Finish.\n          </clr-wizard-page>\n        </clr-wizard>\n      </div>\n    </div>\n  </div>\n  <!-- end preview card -->\n</div>\n<!-- end .tb-layout -->\n", styles: [":host{display:block}:host ::ng-deep .stack-view .stack-view-key{min-width:26%;max-width:26%}:host ::ng-deep .stack-view .stack-block-content{max-width:46%}:host ::ng-deep .card .alert{margin:0}:host ::ng-deep .card-block .progress,:host ::ng-deep .card-block .progress-static{position:relative;height:var(--clr-base-progress-bar-height);margin:0}:host ::ng-deep .card-block .progress>progress,:host ::ng-deep .card-block .progress-static>progress{height:100%;position:static}.tb-presets{display:flex;align-items:center;gap:var(--clr-base-gap-m);flex-wrap:wrap;margin:0 var(--clr-base-gap-m)}.tb-preset-cards{gap:var(--clr-base-gap-l)}.tb-preset-cards .tb-preset-card{display:inline-flex;align-items:center;gap:var(--clr-base-gap-m);margin:0;padding:var(--clr-base-vertical-offset-m) var(--clr-base-horizontal-offset-m);min-width:170px}.tb-preset-cards .tb-preset-card.tb-preset-card-active{outline:var(--cds-alias-object-border-width-200) solid var(--cds-alias-primary);outline-offset:2px}.tb-preset-cards .tb-preset-card .card-text{margin-bottom:0}.tb-preset-swatch{display:flex;align-items:center;justify-content:center;height:var(--clr-base-row-height-m);min-width:var(--clr-base-row-height-m);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--cds-alias-object-border-radius-100);background:var(--cds-alias-object-container-background);color:var(--cds-alias-typography-color-300)}.tb-layout{display:grid;grid-template-columns:370px 1fr;gap:var(--clr-base-gap-l);align-items:start}.tb-controls-card{margin-top:0;position:sticky;top:0;max-height:calc(100vh - var(--cds-global-space-15));overflow-y:auto}.tb-controls-card .tb-control-header{display:flex;align-items:center;justify-content:space-between}.tb-wcag-container{display:flex;flex-direction:column;gap:var(--clr-base-gap-s)}.tb-wcag-container .tb-wcag-item{display:flex;justify-content:space-between;align-items:center}.card-block{display:flex;flex-direction:column;gap:var(--clr-base-gap-l)}.card-block .tb-color-input-wrap{display:flex;align-items:center;gap:var(--clr-base-gap-s);min-width:190px}.card-block .tb-color-picker{padding:var(--clr-base-vertical-offset-2xs) var(--clr-base-horizontal-offset-2xs);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--cds-alias-object-border-radius-100);cursor:pointer;background:var(--cds-alias-object-container-background);width:var(--cds-global-space-11)}.card-block .tb-hex-input{width:var(--clr-base-layout-space-5xl);padding:var(--clr-base-vertical-offset-2xs) var(--clr-base-horizontal-offset-s);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--cds-alias-object-border-radius-100)}.card-block .tb-stack-label{display:flex;gap:var(--clr-base-gap-m);align-items:center}.tb-preview-card{margin-top:0}.tb-preview-card .card-header{display:flex;align-items:center;gap:var(--clr-base-gap-m)}.tb-preview-sandbox{display:flex;flex-direction:column;gap:var(--clr-base-gap-l);border-bottom-left-radius:var(--cds-alias-object-border-radius-100);border-bottom-right-radius:var(--cds-alias-object-border-radius-100)}.tb-preview-section{display:flex;flex-direction:column;gap:var(--clr-base-gap-m)}.tb-preview-row{display:flex;align-items:center;gap:var(--clr-base-gap-m);flex-wrap:wrap}.tb-nav-preview-wrap{height:180px;border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);overflow:hidden;display:flex}\n"], dependencies: [{ kind: "ngmodule", type: ClarityModule }, { kind: "component", type: i1.ClrAlert, selector: "clr-alert", inputs: ["clrAlertSizeSmall", "clrAlertClosable", "clrAlertAppLevel", "clrCloseButtonAriaLabel", "clrAlertLightweight", "clrAlertType", "clrAlertIcon", "clrAlertClosed"], outputs: ["clrAlertClosedChange"] }, { kind: "component", type: i1.ClrAlertItem, selector: "clr-alert-item" }, { kind: "directive", type: i1.ClrAlertText, selector: ".alert-text" }, { kind: "component", type: i2.ClrLabel, selector: "clr-label", inputs: ["clrColor", "clrBadgeText", "clrText", "clrClickable", "clrDisabled", "clrType"] }, { kind: "component", type: i3.ClrDatagrid, selector: "clr-datagrid", inputs: ["clrLoadingMoreItems", "clrDgSingleSelectionAriaLabel", "clrDgSingleActionableAriaLabel", "clrDetailExpandableAriaLabel", "clrDgDisablePageFocus", "clrDgCustomSelectAllEnabled", "clrDgSelectAllDisabled", "clrDgLoading", "clrDgSelectionType", "clrDgSelected", "clrDgPreserveSelection", "clrDgRowSelection", "clrDgItemsIdentityFn"], outputs: ["clrDgSelectedChange", "clrDgRefresh", "clrDgCustomSelectAll"] }, { kind: "component", type: i3.ClrDatagridCell, selector: "clr-dg-cell" }, { kind: "component", type: i3.ClrDatagridColumn, selector: "clr-dg-column", inputs: ["clrFilterStringPlaceholder", "clrFilterNumberMaxPlaceholder", "clrFilterNumberMinPlaceholder", "clrDgDisableUnsort", "clrDgPinned", "clrDgColType", "clrDgField", "clrDgSortBy", "clrDgSortOrder", "clrFilterValue"], outputs: ["clrDgSortOrderChange", "clrFilterValueChange"] }, { kind: "component", type: i3.ClrDatagridFooter, selector: "clr-dg-footer" }, { kind: "component", type: i3.ClrDatagridRow, selector: "clr-dg-row", inputs: ["clrDgDetailDisabled", "clrDgDetailHidden", "clrDgSkeletonLoading", "clrDgItem", "clrDgSelectable", "clrDgSelected", "clrDgExpanded", "clrDgDetailOpenLabel", "clrDgDetailCloseLabel", "clrDgRowSelectionLabel"], outputs: ["clrDgSelectedChange", "clrDgExpandedChange"] }, { kind: "directive", type: i3.DatagridCellRenderer, selector: "clr-dg-cell" }, { kind: "directive", type: i3.DatagridHeaderRenderer, selector: "clr-dg-column", outputs: ["clrDgColumnResize"] }, { kind: "directive", type: i3.DatagridMainRenderer, selector: "clr-datagrid" }, { kind: "directive", type: i3.DatagridRowRenderer, selector: "clr-dg-row" }, { kind: "directive", type: i3.ActionableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }, { kind: "directive", type: i3.DatagridWillyWonka, selector: "clr-datagrid" }, { kind: "directive", type: i3.ExpandableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }, { kind: "component", type: i4.ClrStackView, selector: "clr-stack-view" }, { kind: "component", type: i4.ClrStackHeader, selector: "clr-stack-header", inputs: ["clrStackHeaderLevel"] }, { kind: "component", type: i4.ClrStackBlock, selector: "clr-stack-block", inputs: ["clrSbExpanded", "clrSbExpandable", "clrStackViewLevel", "clrSbNotifyChange"], outputs: ["clrSbExpandedChange"] }, { kind: "component", type: i4.ClrStackViewLabel, selector: "clr-stack-label", inputs: ["id"] }, { kind: "directive", type: i4.ClrStackViewCustomTags, selector: "clr-stack-content" }, { kind: "component", type: i5.ClrTree, selector: "clr-tree", inputs: ["clrLazy"] }, { kind: "component", type: i5.ClrTreeNode, selector: "clr-tree-node", inputs: ["clrExpandable", "clrDisabled", "clrSelected", "clrExpanded", "clrForTypeAhead"], outputs: ["clrSelectedChange", "clrExpandedChange"] }, { kind: "component", type: i6.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i6.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i7.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: i7.ClrControlError, selector: "clr-control-error" }, { kind: "component", type: i7.ClrControlHelper, selector: "clr-control-helper" }, { kind: "directive", type: i7.ClrIfError, selector: "[clrIfError]", inputs: ["clrIfError"] }, { kind: "directive", type: i7.ClrForm, selector: "[clrForm]", inputs: ["clrLabelSize"] }, { kind: "directive", type: i7.ClrLayout, selector: "[clrForm][clrLayout]", inputs: ["clrLayout"] }, { kind: "directive", type: i8.ClrCheckbox, selector: "[clrCheckbox],[clrToggle]" }, { kind: "component", type: i8.ClrCheckboxContainer, selector: "clr-checkbox-container,clr-toggle-container", inputs: ["clrInline"] }, { kind: "component", type: i8.ClrCheckboxWrapper, selector: "clr-checkbox-wrapper,clr-toggle-wrapper" }, { kind: "directive", type: i9.ClrInput, selector: "[clrInput]" }, { kind: "component", type: i9.ClrInputContainer, selector: "clr-input-container" }, { kind: "directive", type: i10.ClrRadio, selector: "[clrRadio]" }, { kind: "component", type: i10.ClrRadioContainer, selector: "clr-radio-container", inputs: ["clrInline"] }, { kind: "component", type: i10.ClrRadioWrapper, selector: "clr-radio-wrapper" }, { kind: "directive", type: i11.ClrTextarea, selector: "[clrTextarea]" }, { kind: "component", type: i11.ClrTextareaContainer, selector: "clr-textarea-container" }, { kind: "component", type: i12.ClrTabContent, selector: "clr-tab-content", inputs: ["id"] }, { kind: "component", type: i12.ClrTab, selector: "clr-tab" }, { kind: "component", type: i12.ClrTabs, selector: "clr-tabs", inputs: ["clrLayout"] }, { kind: "directive", type: i12.ClrTabLink, selector: "[clrTabLink]", inputs: ["id", "clrTabLinkInOverflow"] }, { kind: "directive", type: i12.TabsWillyWonka, selector: "clr-tabs" }, { kind: "directive", type: i12.ActiveOompaLoompa, selector: "[clrTabLink], clr-tab-content" }, { kind: "component", type: i13.ClrVerticalNav, selector: "clr-vertical-nav", inputs: ["clrVerticalNavToggleLabel", "clrVerticalNavCollapsible", "clrVerticalNavCollapsed"], outputs: ["clrVerticalNavCollapsedChange"] }, { kind: "component", type: i13.ClrVerticalNavLink, selector: "[clrVerticalNavLink]" }, { kind: "component", type: i13.ClrVerticalNavGroup, selector: "clr-vertical-nav-group", inputs: ["clrVerticalNavGroupExpanded"], outputs: ["clrVerticalNavGroupExpandedChange"] }, { kind: "component", type: i13.ClrVerticalNavGroupChildren, selector: "clr-vertical-nav-group-children" }, { kind: "directive", type: i13.ClrVerticalNavIcon, selector: "[clrVerticalNavIcon]" }, { kind: "component", type: i14.ClrBreadcrumbs, selector: "clr-breadcrumbs", inputs: ["items"], outputs: ["clrBreadcrumbItemClick"] }, { kind: "component", type: i15.ClrTooltip, selector: "clr-tooltip" }, { kind: "directive", type: i15.ClrTooltipTrigger, selector: "[clrTooltipTrigger]" }, { kind: "component", type: i15.ClrTooltipContent, selector: "clr-tooltip-content", inputs: ["id", "clrPosition", "clrSize"] }, { kind: "component", type: i16.ClrWizard, selector: "clr-wizard", inputs: ["clrWizardStepnavAriaLabel", "clrWizardStepnavLayout", "clrWizardSize", "clrWizardInPage", "clrWizardInPageFillContentArea", "clrWizardHideFooter", "clrWizardFooterAlign", "clrWizardClosable", "clrWizardPreventModalAnimation", "clrWizardForceForwardNavigation", "clrWizardOpen", "clrWizardPreventDefaultNext", "clrWizardPreventDefaultCancel", "clrWizardPreventNavigation", "clrWizardDisableStepnav"], outputs: ["clrWizardOpenChange", "clrWizardOnCancel", "clrWizardOnFinish", "clrWizardOnReset", "clrWizardCurrentPageChange", "clrWizardOnNext", "clrWizardOnPrevious"] }, { kind: "component", type: i16.ClrWizardPage, selector: "clr-wizard-page", inputs: ["id", "clrWizardPagePreventDefault", "clrWizardPageNextDisabled", "clrWizardPagePreviousDisabled", "clrWizardPageHasError", "clrWizardPagePreventDefaultCancel", "clrWizardPagePreventDefaultNext"], outputs: ["clrWizardPageNextDisabledChange", "clrWizardPagePreviousDisabledChange", "clrWizardPagePreventDefaultCancelChange", "clrWizardPageOnCommit", "clrWizardPageOnLoad", "clrWizardPageOnCancel", "clrWizardPageFinish", "clrWizardPagePrevious", "clrWizardPageNext", "clrWizardPageDanger", "clrWizardPagePrimary", "clrWizardPageCustomButton"] }, { kind: "component", type: i16.ClrWizardButton, selector: "clr-wizard-button", inputs: ["type", "clrWizardButtonDisabled", "clrWizardButtonHidden"], outputs: ["clrWizardButtonClicked"] }, { kind: "directive", type: i16.ClrWizardTitle, selector: "clr-wizard-title", inputs: ["clrHeadingLevel"] }, { kind: "directive", type: i16.ClrWizardPageTitle, selector: "[clrPageTitle]", inputs: ["clrHeadingLevel"] }, { kind: "component", type: i17.ClrAccordion, selector: "clr-accordion", inputs: ["clrAccordionMultiPanel"] }, { kind: "component", type: i17.ClrAccordionPanel, selector: "clr-accordion-panel", inputs: ["clrAccordionPanelDisabled", "clrAccordionPanelOpen", "clrAccordionPanelHeadingLevel"], outputs: ["clrAccordionPanelOpenChange"] }, { kind: "component", type: i17.ClrAccordionTitle, selector: "clr-accordion-title" }, { kind: "component", type: i17.ClrAccordionContent, selector: "clr-accordion-content" }, { kind: "directive", type: i17.AccordionOompaLoompa, selector: "clr-accordion-panel" }, { kind: "directive", type: i17.AccordionWillyWonka, selector: "clr-accordion" }, { kind: "component", type: i18.ClrStepper, selector: "form[clrStepper]", inputs: ["clrInitialStep"] }, { kind: "directive", type: i18.ClrStepButton, selector: "[clrStepButton]", inputs: ["clrStepButton"] }, { kind: "component", type: i18.ClrStepTitle, selector: "clr-step-title" }, { kind: "component", type: i18.ClrStepDescription, selector: "clr-step-description" }, { kind: "component", type: i18.ClrStepContent, selector: "clr-step-content" }, { kind: "component", type: i18.ClrStepperPanel, selector: "clr-stepper-panel" }, { kind: "directive", type: i18.StepperOompaLoompa, selector: "clr-stepper-panel, [clrStepButton]" }, { kind: "directive", type: i18.StepperWillyWonka, selector: "form[clrStepper]" }, { kind: "component", type: i19.ClrProgressBar, selector: "clr-progress-bar", inputs: ["clrMax", "clrDisplayval", "clrColor", "clrValue", "id", "clrCompact", "clrLabeled", "clrFade", "clrLoop", "clrFlash", "clrFlashDanger"] }, { kind: "component", type: i20.ClrTimeline, selector: "clr-timeline", inputs: ["clrLayout"] }, { kind: "component", type: i20.ClrTimelineStep, selector: "clr-timeline-step", inputs: ["clrState"] }, { kind: "component", type: i20.ClrTimelineStepDescription, selector: "clr-timeline-step-description" }, { kind: "component", type: i20.ClrTimelineStepHeader, selector: "clr-timeline-step-header" }, { kind: "component", type: i20.ClrTimelineStepTitle, selector: "clr-timeline-step-title" }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i21.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i22.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i22.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i22.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i22.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i22.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i22.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i22.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i22.NgModelGroup, selector: "[ngModelGroup]", inputs: ["ngModelGroup"], exportAs: ["ngModelGroup"] }, { kind: "directive", type: i22.NgForm, selector: "form:not([ngNoForm]):not([formGroup]):not([formArray]),ng-form,[ngForm]", inputs: ["ngFormOptions"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "pipe", type: i21.UpperCasePipe, name: "uppercase" }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.22", ngImport: i0, type: ThemeBuilderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'clr-theme-builder', imports: [ClarityModule, CommonModule, FormsModule], template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<!-- Preset selector -->\n<div class=\"tb-presets\" cds-layout=\"m-t:lg\">\n  <div class=\"tb-preset-cards clr-row\">\n    @for (preset of presets; track preset.name) {\n      <a\n        href=\"javascript://\"\n        class=\"card clickable tb-preset-card clr-col-1\"\n        [class.tb-preset-card-active]=\"activePreset?.name === preset.name\"\n        (click)=\"applyPreset(preset)\"\n      >\n        <div class=\"tb-preset-swatch\" [style.background-color]=\"preset.light?.primary?.hex\"></div>\n        <div class=\"card-text\">{{ preset.name }}</div>\n      </a>\n    }\n  </div>\n</div>\n\n<!-- \u2500\u2500 Preview DARK card \u2500\u2500 -->\n<!-- Invisible for filling the dark values on initial load -->\n<div style=\"display: none\" #previewDarkWrapper cds-theme=\"dark\"></div>\n\n<!-- \u2500\u2500 Two-column layout: controls | preview \u2500\u2500 -->\n<div class=\"tb-layout\" cds-layout=\"m-t:lg m-b:lg\">\n  <!-- \u2500\u2500 Controls card (sticky left column) \u2500\u2500 -->\n  <div class=\"card tb-controls-card\">\n    <div class=\"card-block\">\n      @for (colorGroup of themeColors; track colorGroup.key) {\n        <div>\n          <clr-stack-view>\n            <clr-stack-header>\n              <div class=\"tb-control-header\">\n                {{ colorGroup.key | uppercase }}\n\n                <clr-tooltip>\n                  <clr-label\n                    cds-layout=\"m:none\"\n                    clrTooltipTrigger\n                    [clrText]=\"'Contrast ' + colorGroup.contrast.minContrast.wcag.label\"\n                    [clrBadgeText]=\"colorGroup.contrast.minContrast.wcag.score\"\n                    [clrColor]=\"colorGroup.contrast.minContrast.wcag.type\"\n                  >\n                  </clr-label>\n                  <clr-tooltip-content clrPosition=\"right\" clrSize=\"lg\">\n                    <div class=\"tb-wcag-container\">\n                      @for (background of colorGroup.contrast.backgrounds; track background.name) {\n                        <div class=\"tb-wcag-item\">\n                          {{ background.name }}:\n                          <clr-label\n                            cds-layout=\"m:none\"\n                            clrType=\"solid\"\n                            [clrText]=\"background.wcag.label\"\n                            [clrBadgeText]=\"background.wcag.score\"\n                            [clrColor]=\"background.wcag.type\"\n                          />\n                        </div>\n                      }\n                    </div>\n                  </clr-tooltip-content>\n                </clr-tooltip>\n              </div>\n            </clr-stack-header>\n            <clr-stack-block [clrStackViewLevel]=\"1\">\n              <clr-stack-label class=\"tb-stack-label\">{{ colorGroup.base.label }}</clr-stack-label>\n              <clr-stack-content style=\"width: 52%\">\n                <div class=\"tb-color-input-wrap\">\n                  <input\n                    type=\"color\"\n                    class=\"tb-color-picker\"\n                    [value]=\"colorGroup.base.hex\"\n                    [attr.aria-label]=\"colorGroup.key + ' ' + colorGroup.base.label + ' color picker'\"\n                    (input)=\"\n                      setCurrentColor(\n                        colorGroup.base,\n                        $any($event.target).value,\n                        colorStruct[activeTheme][colorGroup.key]\n                      )\n                    \"\n                  />\n                  <input\n                    readonly\n                    type=\"text\"\n                    class=\"tb-hex-input\"\n                    [value]=\"colorGroup.base.hex\"\n                    [attr.aria-label]=\"colorGroup.key + ' ' + colorGroup.base.label + ' color hex value'\"\n                  />\n                  <button\n                    *ngIf=\"!colorGroup.base.isOriginalColor\"\n                    class=\"btn btn-sm btn-icon btn-primary\"\n                    (click)=\"resetColor($event, colorGroup.base, colorStruct[activeTheme][colorGroup.key])\"\n                    title=\"Back to original color\"\n                  >\n                    <cds-icon shape=\"undo\"></cds-icon>\n                  </button>\n                </div>\n              </clr-stack-content>\n\n              @for (colorVariant of colorGroup.variants; track colorVariant.label) {\n                <clr-stack-block [clrStackViewLevel]=\"2\">\n                  <clr-stack-label>{{ colorVariant.label }}</clr-stack-label>\n                  <clr-stack-content>\n                    <div class=\"tb-color-input-wrap\">\n                      <input\n                        type=\"color\"\n                        class=\"tb-color-picker\"\n                        [value]=\"colorVariant.hex\"\n                        [attr.aria-label]=\"colorGroup.key + ' ' + colorVariant.label + ' color picker'\"\n                        (input)=\"setCurrentColor(colorVariant, $any($event.target).value)\"\n                      />\n                      <input\n                        readonly\n                        type=\"text\"\n                        class=\"tb-hex-input\"\n                        [value]=\"colorVariant.hex\"\n                        [attr.aria-label]=\"colorGroup.key + ' ' + colorVariant.label + ' color hex value'\"\n                      />\n                      <button\n                        *ngIf=\"!colorVariant.isOriginalColor\"\n                        class=\"btn btn-sm btn-icon btn-primary\"\n                        (click)=\"resetColor($event, colorVariant)\"\n                        title=\"Back to original color\"\n                      >\n                        <cds-icon shape=\"undo\"></cds-icon>\n                      </button>\n                    </div>\n                  </clr-stack-content>\n                </clr-stack-block>\n              }\n            </clr-stack-block>\n          </clr-stack-view>\n\n          @if (colorGroup.key === 'warning' && !colorGroup.base.isOriginalColor) {\n            <clr-toggle-wrapper>\n              <input\n                type=\"checkbox\"\n                clrToggle\n                [(ngModel)]=\"warningTextOverrideEnabled\"\n                (ngModelChange)=\"onWarningTextOverrideChange()\"\n              />\n              <label>Light Theme Warning Text Override</label>\n            </clr-toggle-wrapper>\n          }\n        </div>\n      }\n    </div>\n  </div>\n  <!-- end controls card -->\n\n  <!-- \u2500\u2500 Preview card (right column) \u2500\u2500 -->\n  <div class=\"card tb-preview-card\">\n    <div class=\"card-header\">\n      Live Preview:\n      <button\n        class=\"btn btn-outline-neutral\"\n        [attr.aria-label]=\"'Switch to ' + (isDarkTheme ? 'light' : 'dark') + ' theme'\"\n        (click)=\"toggleActiveTheme()\"\n      >\n        <cds-icon [shape]=\"isDarkTheme ? 'moon' : 'sun'\" [solid]=\"true\" [size]=\"'md'\"></cds-icon>\n        {{ isDarkTheme ? 'Dark' : 'Light' }}\n      </button>\n    </div>\n\n    <div class=\"card-block tb-preview-sandbox\" #previewWrapper [attr.cds-theme]=\"activeTheme\">\n      <ng-content></ng-content>\n\n      <!-- Breadcrumbs -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Breadcrumbs</p>\n        <div class=\"tb-preview-row\">\n          <clr-breadcrumbs [items]=\"breadcrumbs\"></clr-breadcrumbs>\n        </div>\n      </div>\n\n      <!-- Buttons -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Buttons</p>\n        <div class=\"tb-preview-row\">\n          <button class=\"btn btn-primary\">Primary</button>\n          <button class=\"btn\">Primary Outline</button>\n          <button class=\"btn btn-link\">Primary FLAT</button>\n          <button class=\"btn btn-info\">Info</button>\n          <button class=\"btn btn-info-outline\">Info Outline</button>\n          <button class=\"btn btn-link-info\">Info Flat</button>\n          <button class=\"btn btn-danger\">Danger</button>\n          <button class=\"btn btn-success\">Success</button>\n          <button class=\"btn btn-warning\">Warning</button>\n          <button class=\"btn btn-primary\" disabled>Disabled</button>\n        </div>\n      </div>\n\n      <!-- Badges & Labels -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Badges &amp; Labels</p>\n        <div class=\"tb-preview-row\">\n          <clr-label\n            [clrType]=\"'outlined'\"\n            [clrClickable]=\"true\"\n            [clrColor]=\"'info'\"\n            [clrText]=\"'info'\"\n            [clrBadgeText]=\"'99+'\"\n          />\n          <clr-label [clrType]=\"'outlined'\" [clrColor]=\"'danger'\" [clrText]=\"'danger'\" [clrBadgeText]=\"'99+'\" />\n          <clr-label [clrType]=\"'outlined'\" [clrColor]=\"'success'\" [clrText]=\"'success'\" [clrBadgeText]=\"'99+'\" />\n          <clr-label\n            [clrType]=\"'outlined'\"\n            [clrClickable]=\"true\"\n            [clrColor]=\"'warning'\"\n            [clrText]=\"'warning'\"\n            [clrBadgeText]=\"'99+'\"\n          />\n\n          <clr-label [clrType]=\"'solid'\" [clrColor]=\"'info'\" [clrText]=\"'info'\" [clrBadgeText]=\"'99+'\" />\n          <clr-label\n            [clrType]=\"'solid'\"\n            [clrClickable]=\"true\"\n            [clrColor]=\"'danger'\"\n            [clrText]=\"'danger'\"\n            [clrBadgeText]=\"'99+'\"\n          />\n          <clr-label\n            [clrType]=\"'solid'\"\n            [clrClickable]=\"true\"\n            [clrColor]=\"'success'\"\n            [clrText]=\"'success'\"\n            [clrBadgeText]=\"'99+'\"\n          />\n          <clr-label [clrType]=\"'solid'\" [clrColor]=\"'warning'\" [clrText]=\"'warning'\" [clrBadgeText]=\"'99+'\" />\n        </div>\n      </div>\n\n      <!-- Alerts -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Alerts</p>\n        <clr-alert [clrAlertType]=\"'info'\">\n          <clr-alert-item><span class=\"alert-text\">This is an info alert.</span></clr-alert-item>\n        </clr-alert>\n        <clr-alert [clrAlertType]=\"'success'\">\n          <clr-alert-item><span class=\"alert-text\">Operation completed successfully.</span></clr-alert-item>\n        </clr-alert>\n        <clr-alert [clrAlertType]=\"'warning'\">\n          <clr-alert-item><span class=\"alert-text\">Please review before proceeding.</span></clr-alert-item>\n        </clr-alert>\n        <clr-alert [clrAlertType]=\"'danger'\">\n          <clr-alert-item><span class=\"alert-text\">Something went wrong.</span></clr-alert-item>\n        </clr-alert>\n      </div>\n\n      <!-- App-Level Alerts -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">App-Level Alerts</p>\n        <clr-alert [clrAlertType]=\"'info'\" [clrAlertAppLevel]=\"true\">\n          <clr-alert-item>\n            <span class=\"alert-text\">This is an app level info.</span>\n            <div class=\"alert-actions\">\n              <button class=\"btn alert-action\"><cds-icon shape=\"user\"></cds-icon>Thanks</button>\n            </div>\n          </clr-alert-item>\n        </clr-alert>\n        <clr-alert [clrAlertType]=\"'danger'\" [clrAlertAppLevel]=\"true\">\n          <clr-alert-item>\n            <span class=\"alert-text\">This is an app level alert.</span>\n            <div class=\"alert-actions\">\n              <button class=\"btn alert-action\"><cds-icon shape=\"user\"></cds-icon>Fix</button>\n            </div>\n          </clr-alert-item>\n        </clr-alert>\n        <clr-alert [clrAlertType]=\"'warning'\" [clrAlertAppLevel]=\"true\">\n          <clr-alert-item>\n            <span class=\"alert-text\">This is an app level warning.</span>\n            <div class=\"alert-actions\">\n              <button class=\"btn alert-action\"><cds-icon shape=\"user\"></cds-icon>Check</button>\n            </div>\n          </clr-alert-item>\n        </clr-alert>\n        <clr-alert [clrAlertType]=\"'success'\" [clrAlertAppLevel]=\"true\">\n          <clr-alert-item>\n            <span class=\"alert-text\">This is an app level success.</span>\n            <div class=\"alert-actions\">\n              <button class=\"btn alert-action\"><cds-icon shape=\"user\"></cds-icon>Great</button>\n            </div>\n          </clr-alert-item>\n        </clr-alert>\n      </div>\n\n      <!-- Forms -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Form Controls</p>\n        <form clrForm #tbForm=\"ngForm\" clrLayout=\"horizontal\">\n          <clr-input-container>\n            <label>Text input</label>\n            <input clrInput type=\"text\" placeholder=\"Enter value...\" />\n          </clr-input-container>\n          <clr-checkbox-container>\n            <label>Checkbox</label>\n            <clr-checkbox-wrapper>\n              <input type=\"checkbox\" clrCheckbox checked />\n              <label>Checkbox (checked)</label>\n            </clr-checkbox-wrapper>\n            <clr-checkbox-wrapper>\n              <input type=\"checkbox\" clrCheckbox />\n              <label>Checkbox (unchecked)</label>\n            </clr-checkbox-wrapper>\n          </clr-checkbox-container>\n          <clr-radio-container>\n            <label>Radio</label>\n            <clr-radio-wrapper>\n              <input type=\"radio\" clrRadio name=\"r1\" value=\"a\" checked />\n              <label>Radio A</label>\n            </clr-radio-wrapper>\n            <clr-radio-wrapper>\n              <input type=\"radio\" clrRadio name=\"r1\" value=\"b\" />\n              <label>Radio B</label>\n            </clr-radio-wrapper>\n          </clr-radio-container>\n          <clr-toggle-container>\n            <label>Toggle</label>\n            <clr-toggle-wrapper>\n              <input type=\"checkbox\" clrToggle checked />\n              <label>Toggle (on)</label>\n            </clr-toggle-wrapper>\n          </clr-toggle-container>\n\n          <clr-textarea-container>\n            <label>Textarea</label>\n            <textarea clrTextarea [(ngModel)]=\"description\" name=\"description\" required></textarea>\n            <clr-control-helper>Please provide a description.</clr-control-helper>\n            <clr-control-error *clrIfError=\"'required'\">You must provide a description!</clr-control-error>\n          </clr-textarea-container>\n        </form>\n      </div>\n\n      <!-- Accordion -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Accordion</p>\n        <clr-accordion>\n          <clr-accordion-panel [clrAccordionPanelOpen]=\"true\">\n            <clr-accordion-title>Panel One</clr-accordion-title>\n            <clr-accordion-content>Content for the first accordion panel.</clr-accordion-content>\n          </clr-accordion-panel>\n          <clr-accordion-panel>\n            <clr-accordion-title>Panel Two</clr-accordion-title>\n            <clr-accordion-content>Content for the second accordion panel.</clr-accordion-content>\n          </clr-accordion-panel>\n        </clr-accordion>\n      </div>\n\n      <!-- Tree view -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Tree View</p>\n        <clr-tree>\n          <clr-tree-node [clrExpanded]=\"true\">\n            Root Node\n            <clr-tree-node [clrSelected]=\"1\"> Child One </clr-tree-node>\n            <clr-tree-node>\n              Child Two\n              <clr-tree-node>Grandchild</clr-tree-node>\n            </clr-tree-node>\n          </clr-tree-node>\n        </clr-tree>\n      </div>\n\n      <!-- Progress bar -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Progress Bar</p>\n        <clr-progress-bar clrValue=\"20\" clrMax=\"100\"></clr-progress-bar>\n        <clr-progress-bar clrValue=\"55\" clrMax=\"100\" clrColor=\"warning\" clrLabeled></clr-progress-bar>\n        <clr-progress-bar clrValue=\"80\" clrMax=\"100\" clrColor=\"success\"></clr-progress-bar>\n        <clr-progress-bar clrValue=\"40\" clrMax=\"100\" clrColor=\"danger\"></clr-progress-bar>\n      </div>\n\n      <!-- Vertical nav -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Vertical Navigation</p>\n        <div class=\"tb-nav-preview-wrap\">\n          <clr-vertical-nav [clrVerticalNavCollapsible]=\"true\">\n            <clr-vertical-nav-group clrVerticalNavGroupExpanded>\n              <cds-icon shape=\"home\" clrVerticalNavIcon></cds-icon>\n              Dashboard\n              <clr-vertical-nav-group-children>\n                <a clrVerticalNavLink href=\"javascript:void(0)\" class=\"active\">Overview</a>\n                <a clrVerticalNavLink href=\"javascript:void(0)\">Analytics</a>\n              </clr-vertical-nav-group-children>\n            </clr-vertical-nav-group>\n            <clr-vertical-nav-group>\n              <cds-icon shape=\"cog\" clrVerticalNavIcon></cds-icon>\n              Settings\n              <clr-vertical-nav-group-children>\n                <a clrVerticalNavLink href=\"javascript:void(0)\">Profile</a>\n                <a clrVerticalNavLink href=\"javascript:void(0)\">Security</a>\n              </clr-vertical-nav-group-children>\n            </clr-vertical-nav-group>\n          </clr-vertical-nav>\n        </div>\n      </div>\n\n      <!-- Stepper -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Stepper</p>\n        <form clrStepper #tbStepperForm=\"ngForm\">\n          <clr-stepper-panel ngModelGroup=\"account\">\n            <clr-step-title>Account Details</clr-step-title>\n            <clr-step-description>Tell us about yourself</clr-step-description>\n            <clr-step-content>\n              <clr-input-container>\n                <label>Full Name</label>\n                <input clrInput name=\"fullName\" [(ngModel)]=\"stepperForm.account.fullName\" />\n              </clr-input-container>\n              <button clrStepButton=\"next\">Next</button>\n            </clr-step-content>\n          </clr-stepper-panel>\n\n          <clr-stepper-panel ngModelGroup=\"confirm\">\n            <clr-step-title>Confirmation</clr-step-title>\n            <clr-step-description>Review and submit</clr-step-description>\n            <clr-step-content>\n              <clr-checkbox-container>\n                <clr-checkbox-wrapper>\n                  <input type=\"checkbox\" clrCheckbox name=\"agree\" [(ngModel)]=\"stepperForm.confirm.agree\" />\n                  <label>I agree to the terms</label>\n                </clr-checkbox-wrapper>\n              </clr-checkbox-container>\n              <button clrStepButton=\"previous\">Previous</button>\n              <button clrStepButton=\"submit\">Submit</button>\n            </clr-step-content>\n          </clr-stepper-panel>\n        </form>\n      </div>\n\n      <!-- Datagrid -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Datagrid</p>\n        <clr-datagrid [clrDgSelectionType]=\"'multi'\">\n          <clr-dg-column>Name</clr-dg-column>\n          <clr-dg-column>Role</clr-dg-column>\n          <clr-dg-column>Status</clr-dg-column>\n          @for (row of rows; track row.name) {\n            <clr-dg-row [clrDgItem]=\"row\">\n              <clr-dg-cell>{{ row.name }}</clr-dg-cell>\n              <clr-dg-cell>{{ row.role }}</clr-dg-cell>\n              <clr-dg-cell>\n                <span\n                  class=\"badge\"\n                  [class.badge-success]=\"row.status === 'Active'\"\n                  [class.badge-danger]=\"row.status === 'Inactive'\"\n                >\n                  {{ row.status }}\n                </span>\n              </clr-dg-cell>\n            </clr-dg-row>\n          }\n          <clr-dg-footer>{{ rows.length }} users</clr-dg-footer>\n        </clr-datagrid>\n      </div>\n\n      <!-- Tabs -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Tabs</p>\n        <clr-tabs>\n          <clr-tab>\n            <button clrTabLink>Dashboard</button>\n            <clr-tab-content>\n              <p>Content for the Dashboard tab.</p>\n            </clr-tab-content>\n          </clr-tab>\n          <clr-tab>\n            <button clrTabLink>Management</button>\n            <clr-tab-content>\n              <p>Content for the Management tab.</p>\n            </clr-tab-content>\n          </clr-tab>\n          <clr-tab>\n            <button clrTabLink>Settings</button>\n            <clr-tab-content>\n              <p>Content for the Settings tab.</p>\n            </clr-tab-content>\n          </clr-tab>\n        </clr-tabs>\n      </div>\n\n      <!-- Timeline -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Timeline</p>\n        <clr-timeline>\n          <clr-timeline-step [clrState]=\"timelineStates.SUCCESS\">\n            <clr-timeline-step-header>11:59 am</clr-timeline-step-header>\n            <clr-timeline-step-title>Add KMS</clr-timeline-step-title>\n            <clr-timeline-step-description>Root CA certificate requested.</clr-timeline-step-description>\n          </clr-timeline-step>\n          <clr-timeline-step [clrState]=\"timelineStates.CURRENT\">\n            <clr-timeline-step-header>12:04 pm</clr-timeline-step-header>\n            <clr-timeline-step-title>Make KMS trust vCenter</clr-timeline-step-title>\n            <clr-timeline-step-description>\n              Upload the certificate to the KMS to complete the connection.\n            </clr-timeline-step-description>\n          </clr-timeline-step>\n          <clr-timeline-step [clrState]=\"timelineStates.NOT_STARTED\">\n            <clr-timeline-step-header>--:-- --</clr-timeline-step-header>\n            <clr-timeline-step-title>Enable Encryption</clr-timeline-step-title>\n            <clr-timeline-step-description>Not started yet.</clr-timeline-step-description>\n          </clr-timeline-step>\n        </clr-timeline>\n      </div>\n\n      <!-- Wizard launcher -->\n      <div class=\"tb-preview-section\">\n        <p cds-text=\"subsection uppercase bold\">Wizard</p>\n        <button class=\"btn btn-outline\" (click)=\"wizardOpen = true\">Open Wizard</button>\n        <clr-wizard [(clrWizardOpen)]=\"wizardOpen\" clrWizardSize=\"md\">\n          <clr-wizard-title>Sample Wizard</clr-wizard-title>\n          <clr-wizard-button [type]=\"'cancel'\">Cancel</clr-wizard-button>\n          <clr-wizard-button [type]=\"'previous'\">Back</clr-wizard-button>\n          <clr-wizard-button [type]=\"'next'\">Next</clr-wizard-button>\n          <clr-wizard-button [type]=\"'finish'\">Finish</clr-wizard-button>\n          <clr-wizard-page>\n            <ng-template clrPageTitle>Step 1: Introduction</ng-template>\n            Welcome to the wizard. This step introduces the process.\n          </clr-wizard-page>\n          <clr-wizard-page>\n            <ng-template clrPageTitle>Step 2: Configuration</ng-template>\n            Configure the required options in this step.\n          </clr-wizard-page>\n          <clr-wizard-page>\n            <ng-template clrPageTitle>Step 3: Confirm</ng-template>\n            Review your choices and click Finish.\n          </clr-wizard-page>\n        </clr-wizard>\n      </div>\n    </div>\n  </div>\n  <!-- end preview card -->\n</div>\n<!-- end .tb-layout -->\n", styles: [":host{display:block}:host ::ng-deep .stack-view .stack-view-key{min-width:26%;max-width:26%}:host ::ng-deep .stack-view .stack-block-content{max-width:46%}:host ::ng-deep .card .alert{margin:0}:host ::ng-deep .card-block .progress,:host ::ng-deep .card-block .progress-static{position:relative;height:var(--clr-base-progress-bar-height);margin:0}:host ::ng-deep .card-block .progress>progress,:host ::ng-deep .card-block .progress-static>progress{height:100%;position:static}.tb-presets{display:flex;align-items:center;gap:var(--clr-base-gap-m);flex-wrap:wrap;margin:0 var(--clr-base-gap-m)}.tb-preset-cards{gap:var(--clr-base-gap-l)}.tb-preset-cards .tb-preset-card{display:inline-flex;align-items:center;gap:var(--clr-base-gap-m);margin:0;padding:var(--clr-base-vertical-offset-m) var(--clr-base-horizontal-offset-m);min-width:170px}.tb-preset-cards .tb-preset-card.tb-preset-card-active{outline:var(--cds-alias-object-border-width-200) solid var(--cds-alias-primary);outline-offset:2px}.tb-preset-cards .tb-preset-card .card-text{margin-bottom:0}.tb-preset-swatch{display:flex;align-items:center;justify-content:center;height:var(--clr-base-row-height-m);min-width:var(--clr-base-row-height-m);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--cds-alias-object-border-radius-100);background:var(--cds-alias-object-container-background);color:var(--cds-alias-typography-color-300)}.tb-layout{display:grid;grid-template-columns:370px 1fr;gap:var(--clr-base-gap-l);align-items:start}.tb-controls-card{margin-top:0;position:sticky;top:0;max-height:calc(100vh - var(--cds-global-space-15));overflow-y:auto}.tb-controls-card .tb-control-header{display:flex;align-items:center;justify-content:space-between}.tb-wcag-container{display:flex;flex-direction:column;gap:var(--clr-base-gap-s)}.tb-wcag-container .tb-wcag-item{display:flex;justify-content:space-between;align-items:center}.card-block{display:flex;flex-direction:column;gap:var(--clr-base-gap-l)}.card-block .tb-color-input-wrap{display:flex;align-items:center;gap:var(--clr-base-gap-s);min-width:190px}.card-block .tb-color-picker{padding:var(--clr-base-vertical-offset-2xs) var(--clr-base-horizontal-offset-2xs);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--cds-alias-object-border-radius-100);cursor:pointer;background:var(--cds-alias-object-container-background);width:var(--cds-global-space-11)}.card-block .tb-hex-input{width:var(--clr-base-layout-space-5xl);padding:var(--clr-base-vertical-offset-2xs) var(--clr-base-horizontal-offset-s);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--cds-alias-object-border-radius-100)}.card-block .tb-stack-label{display:flex;gap:var(--clr-base-gap-m);align-items:center}.tb-preview-card{margin-top:0}.tb-preview-card .card-header{display:flex;align-items:center;gap:var(--clr-base-gap-m)}.tb-preview-sandbox{display:flex;flex-direction:column;gap:var(--clr-base-gap-l);border-bottom-left-radius:var(--cds-alias-object-border-radius-100);border-bottom-right-radius:var(--cds-alias-object-border-radius-100)}.tb-preview-section{display:flex;flex-direction:column;gap:var(--clr-base-gap-m)}.tb-preview-row{display:flex;align-items:center;gap:var(--clr-base-gap-m);flex-wrap:wrap}.tb-nav-preview-wrap{height:180px;border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);overflow:hidden;display:flex}\n"] }]
        }], ctorParameters: () => [], propDecorators: { generatedCSS: [{
                type: Output
            }], previewWrapper: [{
                type: ViewChild,
                args: ['previewWrapper']
            }], previewDarkWrapper: [{
                type: ViewChild,
                args: ['previewDarkWrapper']
            }], presets: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { Color, PRESETS, ThemeBuilderComponent };
//# sourceMappingURL=clr-addons-theme-builder.mjs.map
