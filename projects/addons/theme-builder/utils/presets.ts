/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Color } from './color';
import { DataRow, ThemePreset } from './types';

export const DEFAULT_OVERRIDES = {
  // primary
  // '--cds-alias-primary': ['--cds-alias-object-interaction-background-highlight'],
  '--cds-alias-primary-tint': ['--cds-alias-object-interaction-background-hover'],
  '--cds-alias-primary-shade': ['--cds-alias-typography-link-color'],
  '--cds-alias-primary-dark': ['--cds-alias-typography-link-color-hover'],
  '--cds-alias-primary-tint-dark': [
    '--cds-alias-object-interaction-background-selected',
    '--cds-alias-object-interaction-background-shade-active',
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

export const BACKGROUND_TOKENS = [
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

export const TOKEN_KEYS = {
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
export const CLARITY_DEFAULT_PRESET: ThemePreset = {
  name: 'Clarity Default',
  light: null,
  dark: null,
};

export const PRESETS: ThemePreset[] = [
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
      warning: new Color('--cds-alias-status-warning', 'hsl(345deg 83% 40%)'), // magenta-600
      danger: new Color('--cds-alias-status-danger', 'hsl(9deg 100% 59%)'), // red-600
    },
    dark: {
      primary: new Color('--cds-alias-primary', 'hsl(41deg 100% 70%)'), // ochre-400
      info: new Color('--cds-alias-status-info', 'hsl(238deg 58% 64%)'), // lavender-400
      success: new Color('--cds-alias-status-success', 'hsl(93deg 80% 48%)'), // green-400
      warning: new Color('--cds-alias-status-warning', 'hsl(345deg 100% 61%)'), // magenta-400
      danger: new Color('--cds-alias-status-danger', 'hsl(9deg 100% 71%)'), // red-400
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
      primary: new Color('--cds-alias-primary', 'hsl(184deg 100% 48%)'), // aqua-400
      info: new Color('--cds-alias-status-info', 'hsl(282deg 60% 65%)'), // violet-400
      success: new Color('--cds-alias-status-success', 'hsl(93deg 80% 48%)'), // green-400
      warning: new Color('--cds-alias-status-warning', 'hsl(46deg 100% 52%)'), // yellow-400
      danger: new Color('--cds-alias-status-danger', 'hsl(9deg 100% 71%)'), // red-400
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
