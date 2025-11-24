/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { addons } from 'storybook/manager-api';
import { isDarkThemeMatcher, getThemeObj } from './helpers/theme.helper';

import styles from './public/manager.css';

addStyles();

// initial theme set
addons.setConfig(getThemeObj(isDarkThemeMatcher.matches));

// dynamic theme change
isDarkThemeMatcher.addEventListener('change', change => {
  addons.setConfig(getThemeObj(change.matches));
});

function addStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  window.document.head.append(styleElement);
}
