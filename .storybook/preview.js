/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@cds/core/icon/register.js';

import { loadCoreIconSet, loadEssentialIconSet } from '@cds/core/icon';
import { setCompodocJson } from '@storybook/addon-docs/angular';

import docs from '../documentation.json';
import clrUiStyles from 'raw-loader!../dist/clr-ui/clr-ui.css';
import resetStyles from 'raw-loader!../node_modules/@cds/core/styles/module.reset.min.css';
import tokensStyles from 'raw-loader!../node_modules/@cds/core/styles/module.tokens.min.css';
import layoutStyles from 'raw-loader!../node_modules/@cds/core/styles/module.layout.min.css';
import typographyStyles from 'raw-loader!../node_modules/@cds/core/styles/module.typography.min.css';
import darkThemeStyles from 'raw-loader!../node_modules/@cds/core/styles/theme.dark.min.css';
import highContrastThemeStyles from 'raw-loader!../node_modules/@cds/core/styles/theme.high-contrast.min.css';
import shimStyles from 'raw-loader!../node_modules/@cds/core/styles/shim.clr-ui.min.css';

const privateModifier = 121;
const cdsThemeAttribute = 'cds-theme';

const styles = [
  clrUiStyles,
  resetStyles,
  tokensStyles,
  layoutStyles,
  typographyStyles,
  darkThemeStyles,
  highContrastThemeStyles,
  shimStyles,
];

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
  styleElement.textContent = styles.join('');
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
