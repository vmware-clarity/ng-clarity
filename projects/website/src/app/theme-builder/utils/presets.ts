/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Color } from './color';
import { CssThemeTokens, DataRow, ThemeColors, ThemePreset } from './types';

export const TOKEN_KEYS = {
  primary: [
    '--cds-alias-primary',
    '--cds-alias-primary-tint',
    '--cds-alias-primary-tint-dark',
    '--cds-alias-primary-shade',
    '--cds-alias-primary-dark',
  ],
  info: ['--cds-alias-status-info', '--cds-alias-status-info-tint', '--cds-alias-status-info-shade'],
  success: ['--cds-alias-status-success', '--cds-alias-status-success-tint', '--cds-alias-status-success-shade'],
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

// CSS custom property each base token maps to — passed to the Color constructor as the token name.
const TOKEN_NAMES: Record<keyof ThemeColors, string> = {
  primary: '--cds-alias-status-info',
  success: '--cds-alias-status-success',
  warning: '--cds-alias-status-warning',
  danger: '--cds-alias-status-danger',
  appBg: '--cds-alias-object-app-background',
  containerBg: '--cds-alias-object-container-background',
  text: '--cds-alias-typography-color-500',
};

/** Builds a ThemeColors set of Color tokens from Clarity-provided HSL strings. */
function makeColors(originals: Record<keyof ThemeColors, string>): ThemeColors {
  return {
    primary: new Color(TOKEN_NAMES.primary, originals.primary),
    success: new Color(TOKEN_NAMES.success, originals.success),
    warning: new Color(TOKEN_NAMES.warning, originals.warning),
    danger: new Color(TOKEN_NAMES.danger, originals.danger),
    appBg: new Color(TOKEN_NAMES.appBg, originals.appBg),
    containerBg: new Color(TOKEN_NAMES.containerBg, originals.containerBg),
    text: new Color(TOKEN_NAMES.text, originals.text),
  };
}

/** Returns an independent copy of a ThemeColors set so editing never mutates a preset. */
export function cloneThemeColors(colors: ThemeColors): ThemeColors {
  return {
    primary: colors.primary.clone(),
    success: colors.success.clone(),
    warning: colors.warning.clone(),
    danger: colors.danger.clone(),
    appBg: colors.appBg.clone(),
    containerBg: colors.containerBg.clone(),
    text: colors.text.clone(),
  };
}

// HSL values derived from Clarity's SCSS HSL tokens — used for color pickers and WCAG calculations.
const CLARITY_LIGHT_ORIGINALS: Record<keyof ThemeColors, string> = {
  primary: 'hsl(198deg 100% 34%)', // blue-700
  success: 'hsl(93deg 80% 28%)', // green-700
  warning: 'hsl(40deg 100% 59%)', // ochre-500
  danger: 'hsl(9deg 100% 44%)', // red-700
  appBg: 'hsl(198deg 33% 99%)', // construction-25
  containerBg: 'hsl(0deg 0% 100%)',
  text: 'hsl(0deg 0% 0%)',
};

const CLARITY_DARK_ORIGINALS: Record<keyof ThemeColors, string> = {
  primary: 'hsl(198deg 100% 59%)', // blue-400
  success: 'hsl(93deg 80% 44%)', // green-500
  warning: 'hsl(41deg 100% 70%)', // ochre-400
  danger: 'hsl(9deg 100% 65%)', // red-500
  appBg: 'hsl(198deg 30% 15%)', // construction-1000
  containerBg: 'hsl(198deg 28% 18%)', // construction-900
  text: 'hsl(0deg 0% 100%)',
};

const CLARITY_LIGHT: ThemeColors = makeColors(CLARITY_LIGHT_ORIGINALS);
const CLARITY_DARK: ThemeColors = makeColors(CLARITY_DARK_ORIGINALS);

// Token expressions that map to the exact global color tokens Clarity's own SCSS uses.
// These are used in the CSS output for the Clarity Default preset so the output
// references global tokens rather than hardcoded hex values.
const CLARITY_LIGHT_CSS_TOKENS: CssThemeTokens = {
  '--cds-alias-status-info': 'var(--cds-global-color-blue-700)',
  '--cds-alias-status-info-tint': 'var(--cds-global-color-blue-50)',
  '--cds-alias-status-info-shade': 'var(--cds-global-color-blue-800)',
  '--cds-alias-object-interaction-background-highlight': 'var(--cds-global-color-blue-700)',
  '--cds-alias-object-interaction-background-selected': 'var(--cds-global-color-blue-75)',
  '--cds-alias-object-interaction-info-hover': 'var(--cds-global-color-blue-800)',
  '--cds-alias-object-interaction-info-click': 'var(--cds-global-color-blue-900)',
  '--cds-alias-object-interaction-info-active': 'var(--cds-global-color-blue-900)',
  '--cds-alias-object-interaction-info-selected': 'var(--cds-global-color-blue-900)',
  '--cds-alias-object-interaction-info-secondary-hover': 'var(--cds-global-color-blue-50)',
  '--cds-alias-typography-link-color': 'var(--cds-global-color-blue-800)',
  '--cds-alias-typography-link-color-hover': 'var(--cds-global-color-blue-900)',
  '--cds-alias-typography-info-hover': 'var(--cds-global-color-blue-800)',
  '--cds-alias-status-success': 'var(--cds-global-color-green-700)',
  '--cds-alias-status-success-tint': 'var(--cds-global-color-green-50)',
  '--cds-alias-status-success-shade': 'var(--cds-global-color-green-800)',
  '--cds-alias-object-interaction-success-hover': 'var(--cds-global-color-green-800)',
  '--cds-alias-object-interaction-success-click': 'var(--cds-global-color-green-900)',
  '--cds-alias-object-interaction-success-active': 'var(--cds-global-color-green-900)',
  '--cds-alias-object-interaction-success-secondary-hover': 'var(--cds-global-color-green-50)',
  '--cds-alias-typography-success-hover': 'var(--cds-global-color-green-800)',
  '--cds-alias-status-warning': 'var(--cds-global-color-ochre-500)',
  '--cds-alias-status-warning-tint': 'var(--cds-global-color-ochre-100)',
  '--cds-alias-status-warning-shade': 'var(--cds-global-color-ochre-600)',
  '--cds-alias-status-warning-dark': 'var(--cds-global-color-ochre-800)',
  '--cds-alias-object-interaction-warning-hover': 'var(--cds-global-color-ochre-600)',
  '--cds-alias-object-interaction-warning-click': 'var(--cds-global-color-ochre-700)',
  '--cds-alias-object-interaction-warning-active': 'var(--cds-global-color-ochre-700)',
  '--cds-alias-object-interaction-warning-secondary-hover': 'var(--cds-global-color-ochre-50)',
  '--cds-alias-typography-warning-hover': 'var(--cds-global-color-ochre-900)',
  '--cds-alias-status-danger': 'var(--cds-global-color-red-700)',
  '--cds-alias-status-danger-tint': 'var(--cds-global-color-red-50)',
  '--cds-alias-status-danger-shade': 'var(--cds-global-color-red-800)',
  '--cds-alias-status-danger-dark': 'var(--cds-global-color-red-900)',
  '--cds-alias-object-interaction-danger-hover': 'var(--cds-global-color-red-800)',
  '--cds-alias-object-interaction-danger-click': 'var(--cds-global-color-red-900)',
  '--cds-alias-object-interaction-danger-active': 'var(--cds-global-color-red-900)',
  '--cds-alias-object-interaction-danger-secondary-hover': 'var(--cds-global-color-red-50)',
  '--cds-alias-typography-danger-hover': 'var(--cds-global-color-red-800)',
  '--cds-alias-object-app-background': 'var(--cds-global-color-construction-25)',
  '--cds-alias-object-container-background': 'var(--cds-global-color-white)',
  '--cds-alias-object-overlay-background': 'var(--cds-global-color-white)',
  '--cds-alias-typography-color-500': 'var(--cds-global-color-black)',
};

const CLARITY_DARK_CSS_TOKENS: CssThemeTokens = {
  '--cds-alias-status-info': 'var(--cds-global-color-blue-400)',
  '--cds-alias-status-info-tint': 'var(--cds-global-color-blue-800)',
  '--cds-alias-status-info-shade': 'var(--cds-global-color-blue-500)',
  '--cds-alias-object-interaction-background-highlight': 'var(--cds-global-color-blue-400)',
  '--cds-alias-object-interaction-background-selected': 'var(--cds-global-color-blue-900)',
  '--cds-alias-object-interaction-info-hover': 'var(--cds-global-color-blue-300)',
  '--cds-alias-object-interaction-info-click': 'var(--cds-global-color-blue-500)',
  '--cds-alias-object-interaction-info-active': 'var(--cds-global-color-blue-500)',
  '--cds-alias-object-interaction-info-selected': 'var(--cds-global-color-blue-500)',
  '--cds-alias-object-interaction-info-secondary-hover': 'var(--cds-global-color-blue-1000)',
  '--cds-alias-typography-link-color': 'var(--cds-global-color-blue-400)',
  '--cds-alias-typography-link-color-hover': 'var(--cds-global-color-blue-200)',
  '--cds-alias-typography-info-hover': 'var(--cds-global-color-blue-200)',
  '--cds-alias-status-success': 'var(--cds-global-color-green-500)',
  '--cds-alias-status-success-tint': 'var(--cds-global-color-green-800)',
  '--cds-alias-status-success-shade': 'var(--cds-global-color-green-600)',
  '--cds-alias-object-interaction-success-hover': 'var(--cds-global-color-green-400)',
  '--cds-alias-object-interaction-success-click': 'var(--cds-global-color-green-600)',
  '--cds-alias-object-interaction-success-active': 'var(--cds-global-color-green-600)',
  '--cds-alias-object-interaction-success-secondary-hover': 'var(--cds-global-color-green-1000)',
  '--cds-alias-typography-success-hover': 'var(--cds-global-color-green-400)',
  '--cds-alias-status-warning': 'var(--cds-global-color-ochre-400)',
  '--cds-alias-status-warning-tint': 'var(--cds-global-color-ochre-900)',
  '--cds-alias-status-warning-shade': 'var(--cds-global-color-ochre-500)',
  '--cds-alias-status-warning-dark': 'var(--cds-global-color-ochre-600)',
  '--cds-alias-object-interaction-warning-hover': 'var(--cds-global-color-yellow-300)',
  '--cds-alias-object-interaction-warning-click': 'var(--cds-global-color-yellow-500)',
  '--cds-alias-object-interaction-warning-active': 'var(--cds-global-color-yellow-500)',
  '--cds-alias-object-interaction-warning-secondary-hover': 'var(--cds-global-color-yellow-1000)',
  '--cds-alias-typography-warning-hover': 'var(--cds-global-color-yellow-600)',
  '--cds-alias-status-danger': 'var(--cds-global-color-red-500)',
  '--cds-alias-status-danger-tint': 'var(--cds-global-color-red-900)',
  '--cds-alias-status-danger-shade': 'var(--cds-global-color-red-600)',
  '--cds-alias-status-danger-dark': 'var(--cds-global-color-red-900)',
  '--cds-alias-object-interaction-danger-hover': 'var(--cds-global-color-red-400)',
  '--cds-alias-object-interaction-danger-click': 'var(--cds-global-color-red-600)',
  '--cds-alias-object-interaction-danger-active': 'var(--cds-global-color-red-600)',
  '--cds-alias-object-interaction-danger-secondary-hover': 'var(--cds-global-color-red-1000)',
  '--cds-alias-typography-danger-hover': 'var(--cds-global-color-red-400)',
  '--cds-alias-object-app-background': 'var(--cds-global-color-construction-1000)',
  '--cds-alias-object-container-background': 'var(--cds-global-color-construction-900)',
  '--cds-alias-object-overlay-background': 'var(--cds-global-color-construction-900)',
  '--cds-alias-typography-color-500': 'var(--cds-global-color-white)',
};

export const PRESETS: ThemePreset[] = [
  {
    name: 'Clarity Default',
    light: CLARITY_LIGHT,
    dark: CLARITY_DARK,
    lightCssTokens: CLARITY_LIGHT_CSS_TOKENS,
    darkCssTokens: CLARITY_DARK_CSS_TOKENS,
  },
  {
    name: 'Evergreen',
    light: makeColors({ ...CLARITY_LIGHT_ORIGINALS, primary: 'hsl(160deg 69% 36%)' }), // jade-600
    dark: makeColors({ ...CLARITY_DARK_ORIGINALS, primary: 'hsl(160deg 69% 53%)' }), // jade-400
  },
  {
    name: 'Midnight',
    light: makeColors({
      ...CLARITY_LIGHT_ORIGINALS,
      primary: 'hsl(282deg 60% 49%)', // violet-600
      success: 'hsl(184deg 100% 34%)', // aqua-600
      warning: 'hsl(50deg 100% 57%)', // yellow-300
    }),
    dark: makeColors({
      ...CLARITY_DARK_ORIGINALS,
      primary: 'hsl(282deg 60% 65%)', // violet-400
      success: 'hsl(184deg 100% 48%)', // aqua-400
      warning: 'hsl(50deg 100% 57%)', // yellow-300
    }),
  },
];

export const SAMPLE_ROWS: DataRow[] = [
  { name: 'Ada Lovelace', role: 'Engineer', status: 'Active' },
  { name: 'Grace Hopper', role: 'Architect', status: 'Active' },
  { name: 'Alan Turing', role: 'Researcher', status: 'Inactive' },
  { name: 'Linus Torvalds', role: 'Engineer', status: 'Active' },
  { name: 'Margaret Hamilton', role: 'Director', status: 'Active' },
];
