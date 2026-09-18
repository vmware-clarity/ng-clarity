/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Run every Storybook story rule test: `node eslint-rules/__tests__/index.js`
require('./storybook-typed-meta.test');
require('./storybook-single-render.test');
require('./storybook-no-component-decorator.test');
require('./storybook-no-inline-hidden-control.test');
require('./storybook-no-inline-style.test');

console.log('all eslint-rules story tests passed');
