/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { camelCaseToKebabCase } from './string.js';

export interface FeatureSupportMatrix {
  js?: boolean;
}

class BrowserFeatures {
  supports = {
    js: true,
  };

  constructor() {
    if (!document.body.hasAttribute('cds-supports') || document.body.getAttribute('cds-supports') === 'no-js') {
      const supports = camelCaseToKebabCase(
        Object.keys(this.supports).reduce(
          (prev, next) => `${prev} ${(this.supports as any)[next] ? next : `no-${next}`}`,
          ''
        )
      ).trim();
      document.body.setAttribute('cds-supports', supports);
    }
  }
}

export const browserFeatures = new BrowserFeatures();
