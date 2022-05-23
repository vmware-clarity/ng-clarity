/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { setCompodocJson } from '@storybook/addon-docs/angular';
import docs from './../documentation.json';
import styles from './../dist/clr-ui/clr-ui.css';

const privateModifier = 121;

addStyles(styles);
addDocs(docs);

export const parameters = {
  docs: { inlineStories: true },
  chromatic: { disableSnapshot: true },
};

function addStyles(styles) {
  const style = document.createElement('style');
  style.textContent = `${styles}`;
  window.document.head.append(style);
}

function addDocs(docs) {
  removeProperties(docs);
  removePrivateMethods(docs);
  removeAngularLifeCycleMethods(docs);
  setCompodocJson(docs);
}

function removeProperties(docs) {
  docs.components.forEach(component => {
    delete component.propertiesClass;
  });
}

function removePrivateMethods(docs) {
  docs.components.forEach(component => {
    component.methodsClass = component.methodsClass.filter(
      method => method.modifierKind?.includes(privateModifier) !== true
    );
  });
}

function removeAngularLifeCycleMethods(docs) {
  docs.components.forEach(component => {
    component.methodsClass = component.methodsClass.filter(method => method.name.startsWith('ng') === false);
  });
}
