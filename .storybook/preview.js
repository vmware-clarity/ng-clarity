/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@cds/core/icon/register.js';

import { loadCoreIconSet, loadEssentialIconSet } from '@cds/core/icon';
import { setCompodocJson } from '@storybook/addon-docs/angular';

import previewStyles from 'raw-loader!./public/preview.css';
import docs from '../documentation.json';
import resetStyles from 'raw-loader!../node_modules/@cds/core/styles/module.reset.min.css';
import coreTokens from 'raw-loader!../node_modules/@cds/core/global.min.css';
import darkThemeCoreStyles from 'raw-loader!../node_modules/@cds/core/styles/theme.dark.min.css';

// Styles that should be watched/reloaded
import clrUiStyles from 'raw-loader!sass-loader!../projects/ui/src/clr-ui.scss';
import shimStyles from 'raw-loader!sass-loader!../projects/ui/src/shim.cds-core.scss';

import { THEMES } from './helpers/constants';

const privateModifier = 121;
const cdsThemeAttribute = 'cds-theme';
const styleElement = addStyleElement();

const cdsCoreAndShimStyles = [previewStyles, resetStyles, coreTokens, darkThemeCoreStyles, clrUiStyles, shimStyles];

loadIcons();
addDocs(docs);

const customViewports = {
  large: {
    name: 'CLR Large',
    styles: {
      width: '992px',
      height: '100%',
    },
  },
  medium: {
    name: 'CLR Medium',
    styles: {
      width: '768px',
      height: '100%',
    },
  },
  small: {
    name: 'CLR Small',
    styles: {
      width: '576px',
      height: '100%',
    },
  },
  smallMobile: {
    name: 'Small mobile',
    styles: {
      width: '320px',
      height: '568px',
    },
  },
  largeMobile: {
    name: 'Large mobile',
    styles: {
      width: '414px',
      height: '896px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '834px',
      height: '1112px',
    },
  },
};

export const parameters = {
  docs: { inlineStories: true },
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['Home'],
    },
  },
  viewport: {
    viewports: {
      ...customViewports,
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
        { value: THEMES.CORE_LIGHT, title: 'Light Theme' },
        { value: THEMES.CORE_DARK, title: 'Dark Theme' },
      ],
    },
  },
};

const themeDecorator = (story, { globals }) => {
  const { theme } = globals;

  styleElement.textContent = `${cdsCoreAndShimStyles.join('')}`;
  document.body.setAttribute(cdsThemeAttribute, theme);

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
