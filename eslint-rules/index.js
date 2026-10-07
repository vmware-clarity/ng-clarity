/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const noParameterPropertyThisInConstructorRule = require('./no-parameter-property-this-in-constructor');
const htmlLicenseHeaderRule = require('./html-license-header');

const projectName = 'ng-clarity-eslint-rules';

const configs = {
  all: {
    plugins: [projectName],
  },
};

const rules = {
  'no-parameter-property-this-in-constructor': noParameterPropertyThisInConstructorRule,
  'html-license-header': htmlLicenseHeaderRule,
};

module.exports = { configs, rules };
