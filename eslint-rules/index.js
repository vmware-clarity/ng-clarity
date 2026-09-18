/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const noParameterPropertyThisInConstructorRule = require('./no-parameter-property-this-in-constructor');
const htmlLicenseHeaderRule = require('./html-license-header');
const storybookTypedMetaRule = require('./storybook-typed-meta');
const storybookSingleRenderRule = require('./storybook-single-render');
const storybookNoComponentDecoratorRule = require('./storybook-no-component-decorator');
const storybookNoInlineHiddenControlRule = require('./storybook-no-inline-hidden-control');
const storybookNoInlineStyleRule = require('./storybook-no-inline-style');
const storybookTitleRule = require('./storybook-title');

const projectName = 'ng-clarity-eslint-rules';

const configs = {
  all: {
    plugins: [projectName],
  },
};

const rules = {
  'no-parameter-property-this-in-constructor': noParameterPropertyThisInConstructorRule,
  'html-license-header': htmlLicenseHeaderRule,
  'storybook-typed-meta': storybookTypedMetaRule,
  'storybook-single-render': storybookSingleRenderRule,
  'storybook-no-component-decorator': storybookNoComponentDecoratorRule,
  'storybook-no-inline-hidden-control': storybookNoInlineHiddenControlRule,
  'storybook-no-inline-style': storybookNoInlineStyleRule,
  'storybook-title': storybookTitleRule,
};

module.exports = { configs, rules };
