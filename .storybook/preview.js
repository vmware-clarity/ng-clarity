/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@cds/core/icon/register.js';

import { loadCoreIconSet, loadEssentialIconSet } from '@cds/core/icon';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import docs from '../documentation.json';
import { DENSITY, THEMES } from './helpers/constants';
import AutoDocsTemplate from './stories/auto-docs.mdx';

const privateModifier = 121;
const cdsThemeAttribute = 'cds-theme';
const clrDensityAttribute = 'clr-density';

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
  docs: { page: AutoDocsTemplate },
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
        { value: THEMES.LIGHT, title: 'Light Theme' },
        { value: THEMES.DARK, title: 'Dark Theme' },
      ],
    },
  },
  density: {
    name: 'Density',
    description: 'Available Clarity density models',
    defaultValue: '',
    toolbar: {
      icon: 'graphbar',
      showName: true,
      items: [
        { value: DENSITY.NONE, title: 'None' },
        { value: DENSITY.REGULAR, title: 'Regular' },
        { value: DENSITY.COMPACT, title: 'Compact' },
      ],
    },
  },
};

const themeDecorator = (story, { initialGlobals }) => {
  const { theme } = initialGlobals;

  document.body.setAttribute(cdsThemeAttribute, theme);

  return story();
};
const densityDecorator = (story, { initialGlobals }) => {
  const { density } = initialGlobals;
  if (density === DENSITY.NONE) {
    document.body.removeAttribute(clrDensityAttribute);
  } else {
    document.body.setAttribute(clrDensityAttribute, density);
  }

  return story();
};

export const decorators = [
  themeDecorator,
  densityDecorator,
  applicationConfig({
    providers: [provideAnimations()],
  }),
];

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
export const tags = ['autodocs'];
