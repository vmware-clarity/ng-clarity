/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

import styles from './public/manager.css';

addStyles();

const themeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
// static initial theme set
setTheme(themeMatcher?.matches);

// dynamic theme change
themeMatcher.addListener(e => {
  setTheme(e.matches);
});

function addStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  window.document.head.append(styleElement);
}

function setTheme(isDark = false) {
  if (isDark) {
    addons.setConfig({
      theme: create({
        base: 'dark',
        brandTitle: 'Clarity Angular',
        brandImage: 'https://raw.githubusercontent.com/vmware-clarity/ng-clarity/main/logo.png',
      }),
    });
  } else {
    addons.setConfig({
      theme: create({
        base: 'light',
        brandTitle: 'Clarity Angular',
        brandImage: 'https://raw.githubusercontent.com/vmware-clarity/ng-clarity/main/logo.png',
      }),
    });
  }
}
