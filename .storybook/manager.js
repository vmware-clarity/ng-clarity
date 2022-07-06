/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

import styles from 'raw-loader!./public/manager.css';

addStyles();

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Clarity Angular',
    brandImage: 'https://raw.githubusercontent.com/vmware-clarity/ng-clarity/main/logo.png',
  }),
});

function addStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  window.document.head.append(styleElement);
}
