/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { SiteFooterComponent } from '../shared/site-footer/site-footer.component';
import { SiteNavComponent } from '../shared/site-nav/site-nav.component';

// ── WCAG contrast utilities (formulas extracted from wcag-contrast@3.0.0, BSD-2-Clause) ──

function adjustGamma(v: number): number {
  return Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const ch = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : adjustGamma(s);
  });
  return ch[0] * 0.2126 + ch[1] * 0.7152 + ch[2] * 0.0722;
}

function contrastRatio(a: [number, number, number], b: [number, number, number]): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function wcagScore(ratio: number): 'AAA' | 'AA' | 'AA Large' | 'Fail' {
  if (ratio >= 7) {
    return 'AAA';
  }
  if (ratio >= 4.5) {
    return 'AA';
  }
  if (ratio >= 3) {
    return 'AA Large';
  }
  return 'Fail';
}

// ── Color utilities ──

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace(/^#/, '');
  const full = h.length === 3 ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2] : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map(c => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) {
    return [0, 0, Math.round(l * 100)];
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) {
    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  } else if (max === g) {
    h = ((b - r) / d + 2) / 6;
  } else {
    h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function shiftL(hex: string, delta: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0, Math.min(100, l + delta)));
}

// ── Types ──

export interface ThemeColors {
  primary: string;
  success: string;
  warning: string;
  danger: string;
  appBg: string;
  containerBg: string;
  text: string;
}

export interface DerivableField {
  auto: string;
  override: string;
  useManual: boolean;
}

export interface DerivedSet {
  primaryTint: DerivableField;
  primaryShade: DerivableField;
  primaryHover: DerivableField;
  primaryActive: DerivableField;
  successTint: DerivableField;
  successShade: DerivableField;
  successHover: DerivableField;
  successActive: DerivableField;
  warningTint: DerivableField;
  warningShade: DerivableField;
  warningHover: DerivableField;
  warningActive: DerivableField;
  dangerTint: DerivableField;
  dangerShade: DerivableField;
  dangerHover: DerivableField;
  dangerActive: DerivableField;
}

export interface ThemePreset {
  name: string;
  light: ThemeColors;
  dark: ThemeColors;
}

// ── Defaults (derived from Clarity SCSS HSL token values) ──

const CLARITY_LIGHT: ThemeColors = {
  primary: hslToHex(198, 100, 34), // blue-700
  success: hslToHex(93, 80, 28), // green-700
  warning: hslToHex(40, 100, 59), // ochre-500
  danger: hslToHex(9, 100, 44), // red-700
  appBg: hslToHex(198, 33, 99), // construction-25
  containerBg: '#ffffff',
  text: '#000000',
};

const CLARITY_DARK: ThemeColors = {
  primary: hslToHex(198, 100, 59), // blue-400
  success: hslToHex(93, 80, 44), // green-500
  warning: hslToHex(41, 100, 70), // ochre-400
  danger: hslToHex(9, 100, 65), // red-500
  appBg: hslToHex(198, 30, 15), // construction-1000
  containerBg: hslToHex(198, 28, 18), // construction-900
  text: '#ffffff',
};

export const PRESETS: ThemePreset[] = [
  {
    name: 'Clarity Default',
    light: { ...CLARITY_LIGHT },
    dark: { ...CLARITY_DARK },
  },
  {
    name: 'Evergreen',
    light: {
      primary: hslToHex(160, 69, 36), // jade-600
      success: hslToHex(93, 80, 28), // green-700
      warning: hslToHex(40, 100, 59), // ochre-500
      danger: hslToHex(9, 100, 44), // red-700
      appBg: CLARITY_LIGHT.appBg,
      containerBg: '#ffffff',
      text: '#000000',
    },
    dark: {
      primary: hslToHex(160, 69, 53), // jade-400
      success: hslToHex(93, 80, 44), // green-500
      warning: hslToHex(41, 100, 70), // ochre-400
      danger: hslToHex(9, 100, 65), // red-500
      appBg: CLARITY_DARK.appBg,
      containerBg: CLARITY_DARK.containerBg,
      text: '#ffffff',
    },
  },
  {
    name: 'Midnight',
    light: {
      primary: hslToHex(282, 60, 49), // violet-600
      success: hslToHex(184, 100, 34), // aqua-600
      warning: hslToHex(50, 100, 57), // yellow-300
      danger: hslToHex(9, 100, 44), // red-700
      appBg: CLARITY_LIGHT.appBg,
      containerBg: '#ffffff',
      text: '#000000',
    },
    dark: {
      primary: hslToHex(282, 60, 65), // violet-400
      success: hslToHex(184, 100, 48), // aqua-400
      warning: hslToHex(50, 100, 57), // yellow-300
      danger: hslToHex(9, 100, 65), // red-500
      appBg: CLARITY_DARK.appBg,
      containerBg: CLARITY_DARK.containerBg,
      text: '#ffffff',
    },
  },
];

// ── Derived color computation ──

function computeAutos(base: ThemeColors, isDark: boolean): Record<string, string> {
  const tk = (
    key: 'primary' | 'success' | 'warning' | 'danger',
    tint: number,
    shade: number,
    hover: number,
    active: number
  ) => ({
    [`${key}Tint`]: shiftL(base[key], isDark ? -tint : tint),
    [`${key}Shade`]: shiftL(base[key], isDark ? shade : -shade),
    [`${key}Hover`]: shiftL(base[key], isDark ? hover : -hover),
    [`${key}Active`]: shiftL(base[key], isDark ? active : -active),
  });
  return {
    ...tk('primary', 40, 7, 10, 17),
    ...tk('success', 40, 7, 10, 17),
    ...tk('warning', 35, 9, 10, 17),
    ...tk('danger', 40, 7, 10, 17),
  };
}

function buildDerivedSet(base: ThemeColors, existing: DerivedSet | null, isDark: boolean): DerivedSet {
  const autos = computeAutos(base, isDark);
  const make = (key: string): DerivableField => {
    const auto = autos[key] ?? '#000000';
    const prev = existing?.[key as keyof DerivedSet];
    return {
      auto,
      override: prev?.useManual ? prev.override : auto,
      useManual: prev?.useManual ?? false,
    };
  };
  return {
    primaryTint: make('primaryTint'),
    primaryShade: make('primaryShade'),
    primaryHover: make('primaryHover'),
    primaryActive: make('primaryActive'),
    successTint: make('successTint'),
    successShade: make('successShade'),
    successHover: make('successHover'),
    successActive: make('successActive'),
    warningTint: make('warningTint'),
    warningShade: make('warningShade'),
    warningHover: make('warningHover'),
    warningActive: make('warningActive'),
    dangerTint: make('dangerTint'),
    dangerShade: make('dangerShade'),
    dangerHover: make('dangerHover'),
    dangerActive: make('dangerActive'),
  };
}

function effectiveValue(f: DerivableField): string {
  return f.useManual ? f.override : f.auto;
}

// ── CSS generation ──

function buildCssBlock(colors: ThemeColors, d: DerivedSet, mode: 'light' | 'dark'): string {
  const sel = mode === 'light' ? `[cds-theme~='light']` : `[cds-theme~='dark']`;
  const lines: string[] = [`${sel} {`];
  const v = (prop: string, val: string) => lines.push(`  ${prop}: ${val};`);

  lines.push('  /* Primary / Info */');
  v('--cds-alias-status-info', colors.primary);
  v('--cds-alias-status-info-tint', effectiveValue(d.primaryTint));
  v('--cds-alias-status-info-shade', effectiveValue(d.primaryShade));
  v('--cds-alias-object-interaction-background-highlight', colors.primary);
  v('--cds-alias-object-interaction-background-selected', effectiveValue(d.primaryTint));
  v('--cds-alias-object-interaction-info-hover', effectiveValue(d.primaryHover));
  v('--cds-alias-object-interaction-info-click', effectiveValue(d.primaryActive));
  v('--cds-alias-object-interaction-info-active', effectiveValue(d.primaryActive));
  v('--cds-alias-object-interaction-info-selected', effectiveValue(d.primaryActive));
  v('--cds-alias-object-interaction-info-secondary-hover', effectiveValue(d.primaryTint));
  v('--cds-alias-typography-link-color', colors.primary);
  v('--cds-alias-typography-link-color-hover', effectiveValue(d.primaryHover));
  v('--cds-alias-typography-info-hover', effectiveValue(d.primaryHover));

  lines.push('');
  lines.push('  /* Success */');
  v('--cds-alias-status-success', colors.success);
  v('--cds-alias-status-success-tint', effectiveValue(d.successTint));
  v('--cds-alias-status-success-shade', effectiveValue(d.successShade));
  v('--cds-alias-object-interaction-success-hover', effectiveValue(d.successHover));
  v('--cds-alias-object-interaction-success-click', effectiveValue(d.successActive));
  v('--cds-alias-object-interaction-success-active', effectiveValue(d.successActive));
  v('--cds-alias-object-interaction-success-secondary-hover', effectiveValue(d.successTint));
  v('--cds-alias-typography-success-hover', effectiveValue(d.successHover));

  lines.push('');
  lines.push('  /* Warning */');
  v('--cds-alias-status-warning', colors.warning);
  v('--cds-alias-status-warning-tint', effectiveValue(d.warningTint));
  v('--cds-alias-status-warning-shade', effectiveValue(d.warningShade));
  v('--cds-alias-status-warning-dark', effectiveValue(d.warningActive));
  v('--cds-alias-object-interaction-warning-hover', effectiveValue(d.warningHover));
  v('--cds-alias-object-interaction-warning-click', effectiveValue(d.warningActive));
  v('--cds-alias-object-interaction-warning-active', effectiveValue(d.warningActive));
  v('--cds-alias-object-interaction-warning-secondary-hover', effectiveValue(d.warningTint));
  v('--cds-alias-typography-warning-hover', effectiveValue(d.warningHover));

  lines.push('');
  lines.push('  /* Danger */');
  v('--cds-alias-status-danger', colors.danger);
  v('--cds-alias-status-danger-tint', effectiveValue(d.dangerTint));
  v('--cds-alias-status-danger-shade', effectiveValue(d.dangerShade));
  v('--cds-alias-status-danger-dark', effectiveValue(d.dangerActive));
  v('--cds-alias-object-interaction-danger-hover', effectiveValue(d.dangerHover));
  v('--cds-alias-object-interaction-danger-click', effectiveValue(d.dangerActive));
  v('--cds-alias-object-interaction-danger-active', effectiveValue(d.dangerActive));
  v('--cds-alias-object-interaction-danger-secondary-hover', effectiveValue(d.dangerTint));
  v('--cds-alias-typography-danger-hover', effectiveValue(d.dangerHover));

  lines.push('');
  lines.push('  /* Backgrounds */');
  v('--cds-alias-object-app-background', colors.appBg);
  v('--cds-alias-object-container-background', colors.containerBg);
  v('--cds-alias-object-overlay-background', colors.containerBg);

  lines.push('');
  lines.push('  /* Typography */');
  v('--cds-alias-typography-color-500', colors.text);

  lines.push('}');
  return lines.join('\n');
}

// ── Datagrid sample data ──

export interface DataRow {
  name: string;
  role: string;
  status: string;
}

const SAMPLE_ROWS: DataRow[] = [
  { name: 'Ada Lovelace', role: 'Engineer', status: 'Active' },
  { name: 'Grace Hopper', role: 'Architect', status: 'Active' },
  { name: 'Alan Turing', role: 'Researcher', status: 'Inactive' },
  { name: 'Linus Torvalds', role: 'Engineer', status: 'Active' },
  { name: 'Margaret Hamilton', role: 'Director', status: 'Active' },
];

// ── Component ──

@Component({
  selector: 'app-theme-builder',
  templateUrl: './theme-builder.component.html',
  styleUrl: './theme-builder.component.scss',
  host: { '[class.content-container]': 'true' },
  imports: [CommonModule, ClarityModule, FormsModule, SiteNavComponent, SiteFooterComponent],
})
export class ThemeBuilderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('previewWrapper') previewWrapper!: ElementRef<HTMLElement>;

  presets = PRESETS;
  activeTheme: 'light' | 'dark' = 'light';
  outputTab: 'light' | 'dark' | 'combined' = 'combined';

  colors: { light: ThemeColors; dark: ThemeColors } = {
    light: { ...CLARITY_LIGHT },
    dark: { ...CLARITY_DARK },
  };

  derived: { light: DerivedSet; dark: DerivedSet } = {
    light: buildDerivedSet(CLARITY_LIGHT, null, false),
    dark: buildDerivedSet(CLARITY_DARK, null, true),
  };

  // Preview state
  wizardOpen = false;
  rows = SAMPLE_ROWS;

  // Copy feedback
  copied = false;
  private copiedTimer: ReturnType<typeof setTimeout> | null = null;

  get current(): ThemeColors {
    return this.colors[this.activeTheme];
  }

  get currentDerived(): DerivedSet {
    return this.derived[this.activeTheme];
  }

  get isDarkTheme(): boolean {
    return this.activeTheme === 'dark';
  }

  // WCAG contrast info for primary vs white/black
  get primaryContrastOnWhite(): number {
    return contrastRatio(hexToRgb(this.current.primary), [255, 255, 255]);
  }

  get primaryContrastOnBlack(): number {
    return contrastRatio(hexToRgb(this.current.primary), [0, 0, 0]);
  }

  get primaryScoreOnWhite(): string {
    return wcagScore(this.primaryContrastOnWhite);
  }

  get primaryScoreOnBlack(): string {
    return wcagScore(this.primaryContrastOnBlack);
  }

  get textContrastOnContainer(): number {
    return contrastRatio(hexToRgb(this.current.text), hexToRgb(this.current.containerBg));
  }

  get textScoreOnContainer(): string {
    return wcagScore(this.textContrastOnContainer);
  }

  get generatedCss(): string {
    const light = buildCssBlock(this.colors.light, this.derived.light, 'light');
    const dark = buildCssBlock(this.colors.dark, this.derived.dark, 'dark');
    if (this.outputTab === 'light') {
      return light;
    }
    if (this.outputTab === 'dark') {
      return dark;
    }
    return `/* Clarity Theme Override — generated by Clarity Theme Builder */\n\n${light}\n\n${dark}`;
  }

  ngOnInit(): void {
    document.querySelector('app-root')?.classList.add('layout-theme-builder');
  }

  ngAfterViewInit(): void {
    this.applyPreviewStyles();
  }

  ngOnDestroy(): void {
    document.querySelector('app-root')?.classList.remove('layout-theme-builder');
    if (this.copiedTimer) {
      clearTimeout(this.copiedTimer);
    }
  }

  applyPreset(preset: ThemePreset): void {
    this.colors.light = { ...preset.light };
    this.colors.dark = { ...preset.dark };
    this.recomputeDerived();
  }

  onColorChange(): void {
    this.recomputeDerived();
  }

  toggleManual(field: keyof DerivedSet): void {
    const f = this.currentDerived[field];
    if (!f.useManual) {
      f.override = f.auto;
    }
    f.useManual = !f.useManual;
    this.applyPreviewStyles();
  }

  onDerivedChange(): void {
    this.applyPreviewStyles();
  }

  async copyCSS(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.generatedCss);
      this.copied = true;
      if (this.copiedTimer) {
        clearTimeout(this.copiedTimer);
      }
      this.copiedTimer = setTimeout(() => (this.copied = false), 2000);
    } catch {
      // clipboard not available — silently ignore
    }
  }

  applyPreviewStyles(): void {
    const el = this.previewWrapper?.nativeElement;
    if (!el) {
      return;
    }
    const c = this.colors[this.activeTheme];
    const d = this.derived[this.activeTheme];
    const vars: Record<string, string> = {
      '--cds-alias-status-info': c.primary,
      '--cds-alias-status-info-tint': effectiveValue(d.primaryTint),
      '--cds-alias-status-info-shade': effectiveValue(d.primaryShade),
      '--cds-alias-object-interaction-background-highlight': c.primary,
      '--cds-alias-object-interaction-background-selected': effectiveValue(d.primaryTint),
      '--cds-alias-object-interaction-info-hover': effectiveValue(d.primaryHover),
      '--cds-alias-object-interaction-info-click': effectiveValue(d.primaryActive),
      '--cds-alias-object-interaction-info-active': effectiveValue(d.primaryActive),
      '--cds-alias-object-interaction-info-selected': effectiveValue(d.primaryActive),
      '--cds-alias-object-interaction-info-secondary-hover': effectiveValue(d.primaryTint),
      '--cds-alias-typography-link-color': c.primary,
      '--cds-alias-typography-link-color-hover': effectiveValue(d.primaryHover),
      '--cds-alias-typography-info-hover': effectiveValue(d.primaryHover),
      '--cds-alias-status-success': c.success,
      '--cds-alias-status-success-tint': effectiveValue(d.successTint),
      '--cds-alias-status-success-shade': effectiveValue(d.successShade),
      '--cds-alias-object-interaction-success-hover': effectiveValue(d.successHover),
      '--cds-alias-object-interaction-success-click': effectiveValue(d.successActive),
      '--cds-alias-object-interaction-success-active': effectiveValue(d.successActive),
      '--cds-alias-object-interaction-success-secondary-hover': effectiveValue(d.successTint),
      '--cds-alias-typography-success-hover': effectiveValue(d.successHover),
      '--cds-alias-status-warning': c.warning,
      '--cds-alias-status-warning-tint': effectiveValue(d.warningTint),
      '--cds-alias-status-warning-shade': effectiveValue(d.warningShade),
      '--cds-alias-status-warning-dark': effectiveValue(d.warningActive),
      '--cds-alias-object-interaction-warning-hover': effectiveValue(d.warningHover),
      '--cds-alias-object-interaction-warning-click': effectiveValue(d.warningActive),
      '--cds-alias-object-interaction-warning-active': effectiveValue(d.warningActive),
      '--cds-alias-object-interaction-warning-secondary-hover': effectiveValue(d.warningTint),
      '--cds-alias-typography-warning-hover': effectiveValue(d.warningHover),
      '--cds-alias-status-danger': c.danger,
      '--cds-alias-status-danger-tint': effectiveValue(d.dangerTint),
      '--cds-alias-status-danger-shade': effectiveValue(d.dangerShade),
      '--cds-alias-status-danger-dark': effectiveValue(d.dangerActive),
      '--cds-alias-object-interaction-danger-hover': effectiveValue(d.dangerHover),
      '--cds-alias-object-interaction-danger-click': effectiveValue(d.dangerActive),
      '--cds-alias-object-interaction-danger-active': effectiveValue(d.dangerActive),
      '--cds-alias-object-interaction-danger-secondary-hover': effectiveValue(d.dangerTint),
      '--cds-alias-typography-danger-hover': effectiveValue(d.dangerHover),
      '--cds-alias-object-app-background': c.appBg,
      '--cds-alias-object-container-background': c.containerBg,
      '--cds-alias-object-overlay-background': c.containerBg,
      '--cds-alias-typography-color-500': c.text,
    };
    for (const [prop, val] of Object.entries(vars)) {
      el.style.setProperty(prop, val);
    }
    el.style.backgroundColor = c.appBg;
    el.style.color = c.text;
  }

  private recomputeDerived(): void {
    this.derived.light = buildDerivedSet(this.colors.light, this.derived.light, false);
    this.derived.dark = buildDerivedSet(this.colors.dark, this.derived.dark, true);
    this.applyPreviewStyles();
  }
}
