/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { hslToHex } from './color';
import { CssThemeTokens, DataRow, ThemeColors, ThemePreset } from './types';

// Hex values derived from Clarity's SCSS HSL tokens — used for color pickers and WCAG calculations.
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
    light: { ...CLARITY_LIGHT },
    dark: { ...CLARITY_DARK },
    lightCssTokens: CLARITY_LIGHT_CSS_TOKENS,
    darkCssTokens: CLARITY_DARK_CSS_TOKENS,
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

export const SAMPLE_ROWS: DataRow[] = [
  { name: 'Ada Lovelace', role: 'Engineer', status: 'Active' },
  { name: 'Grace Hopper', role: 'Architect', status: 'Active' },
  { name: 'Alan Turing', role: 'Researcher', status: 'Inactive' },
  { name: 'Linus Torvalds', role: 'Engineer', status: 'Active' },
  { name: 'Margaret Hamilton', role: 'Director', status: 'Active' },
];
