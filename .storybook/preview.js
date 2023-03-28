/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@cds/core/icon/register.js';

import { loadCoreIconSet, loadEssentialIconSet } from '@cds/core/icon';
import { setCompodocJson } from '@storybook/addon-docs/angular';

import docs from '../documentation.json';
import clrUiStyles from '../dist/clr-ui/clr-ui.css';
import clrUiDarkStyles from '../dist/clr-ui/clr-ui-dark.css';
import cdsCoreAndShimStyles from './public/cds-core-and-shim.css';
import { getClrUiAppBackgroundColor } from './helpers/clr-ui-theme.helpers';
import { THEMES } from './helpers/constants';

const privateModifier = 121;
const cdsThemeAttribute = 'cds-theme';
const styleElement = addStyleElement();

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
        { value: THEMES.NG_LIGHT, title: '@clr/ui Light Theme' },
        { value: THEMES.NG_DARK, title: '@clr/ui Dark Theme' },
        { value: THEMES.CORE_LIGHT, title: '@cds/core Light Theme' },
        { value: THEMES.CORE_DARK, title: '@cds/core Dark Theme' },
        { value: THEMES.HIGH_CONTRAST, title: '@cds/core High Contrast Theme' },
      ],
    },
  },
};

const themeDecorator = (story, { globals }) => {
  const { theme } = globals;

  switch (theme) {
    case THEMES.NG_LIGHT:
      styleElement.textContent = clrUiStyles;
      document.body.removeAttribute(cdsThemeAttribute);
      document.body.style.backgroundColor = getClrUiAppBackgroundColor(theme);
      break;
    case THEMES.NG_DARK:
      styleElement.textContent = clrUiDarkStyles;
      document.body.removeAttribute(cdsThemeAttribute);
      document.body.style.backgroundColor = getClrUiAppBackgroundColor(theme);
      break;
    default:
      styleElement.textContent = `${clrUiStyles}${cdsCoreAndShimStyles}`;
      document.body.setAttribute(cdsThemeAttribute, theme);
      document.body.style.backgroundColor = null;
      break;
  }

  return story();
};

export const decorators = [themeDecorator];

function addStyleElement() {
  const styleElement = document.createElement('style');
  window.document.head.append(styleElement);

  return styleElement;
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
