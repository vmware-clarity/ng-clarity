/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@cds/core/icon/register.js';

import { loadCoreIconSet, loadEssentialIconSet } from '@cds/core/icon';
import { setCompodocJson } from '@storybook/addon-docs/angular';

import docs from '../documentation.json';
import styles from './public/preview.css';

const privateModifier = 121;
const cdsThemeAttribute = 'cds-theme';

addStyles();
loadIcons();
addDocs(docs);

export const parameters = {
  chromatic: { disableSnapshot: true },
  docs: { inlineStories: true },
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['Home'],
    },
  },
};

export const globalTypes = {
  theme: {
    name: 'Themes',
    description: 'Available Clarity themes',
    defaultValue: '',
    toolbar: {
      icon: 'paintbrush',
      showName: true,
      items: [
        { value: '', title: 'None' },
        { value: 'light', title: 'Core Light Theme' },
        { value: 'dark', title: 'Core Dark Theme' },
        { value: 'high-contrast', title: 'Core High Contrast Theme' },
      ],
    },
  },
};

const themeDecorator = (story, { globals }) => {
  const { theme } = globals;

  if (theme) {
    document.body.setAttribute(cdsThemeAttribute, theme);
  } else {
    document.body.removeAttribute(cdsThemeAttribute);
  }

  return story();
};

export const decorators = [themeDecorator];

function addStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  window.document.head.append(styleElement);
}

function loadIcons() {
  loadCoreIconSet();
  loadEssentialIconSet();
}

function addDocs(docs) {
  removeProperties(docs);
  removePrivateMethods(docs);
  removeAngularLifeCycleMethods(docs);
  setCompodocJson(docs);
}

function removeProperties(docs) {
  [...docs.components, ...docs.directives].forEach(declaration => {
    delete declaration.propertiesClass;
  });
}

function removePrivateMethods(docs) {
  [...docs.components, ...docs.directives].forEach(declaration => {
    declaration.methodsClass = declaration.methodsClass.filter(
      method => method.modifierKind?.includes(privateModifier) !== true
    );
  });
}

function removeAngularLifeCycleMethods(docs) {
  [...docs.components, ...docs.directives].forEach(declaration => {
    declaration.methodsClass = declaration.methodsClass.filter(method => method.name.startsWith('ng') === false);
  });
}
