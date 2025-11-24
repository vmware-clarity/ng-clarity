/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { create, themes } from 'storybook/theming';

import { THEMES } from './constants';

export const cdsThemeAttribute = 'cds-theme';
export const isDarkThemeMatcher = window.matchMedia('(prefers-color-scheme: dark)');

export function getThemeObj(isDark = false) {
  return {
    theme: create({
      base: isDark ? 'dark' : 'light',
      brandTitle: 'Clarity Angular',
      brandImage: 'https://raw.githubusercontent.com/vmware-clarity/ng-clarity/main/logo.png',
    }),
  };
}

export function setDocsTheme(isDark = false) {
  document.body.setAttribute(cdsThemeAttribute, isDark ? THEMES.DARK : THEMES.LIGHT);

  return isDark ? themes.dark : themes.light;
}
