/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Color } from './color';
import { DataRow, ThemePreset } from './types';

export const DEFAULT_OVERRIDES = {
  '--cds-alias-status-info': ['--cds-alias-utility-blue'],
  '--cds-alias-status-info-tint': [
    '--cds-alias-utility-blue-tint',
    '--cds-alias-object-interaction-info-secondary-hover',
  ],
  '--cds-alias-status-info-shade': [
    '--cds-alias-object-interaction-info-hover',
    '--cds-alias-typography-info-hover',
    '--cds-alias-utility-blue-shade',
  ],
  '--cds-alias-status-info-dark': [
    '--cds-alias-utility-blue-dark',
    '--cds-alias-object-interaction-info-click',
    '--cds-alias-object-interaction-info-active',
    '--cds-alias-object-interaction-info-selected',
  ],
};

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

export const PRESETS: ThemePreset[] = [
  {
    name: 'Clarity Default',
    light: null,
    dark: null,
  },
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
];

export const SAMPLE_ROWS: DataRow[] = [
  { name: 'Ada Lovelace', role: 'Engineer', status: 'Active' },
  { name: 'Grace Hopper', role: 'Architect', status: 'Active' },
  { name: 'Alan Turing', role: 'Researcher', status: 'Inactive' },
  { name: 'Linus Torvalds', role: 'Engineer', status: 'Active' },
  { name: 'Margaret Hamilton', role: 'Director', status: 'Active' },
];
