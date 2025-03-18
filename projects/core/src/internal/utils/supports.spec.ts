/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@cds/core/badge/register.js'; // trigger global setup

describe('browser support feature checks', () => {
  it('should check browser support value strings in cds-support attr', () => {
    const supportValues = document.body.getAttribute('cds-supports');
    expect(supportValues).toContain('js');
  });
});
