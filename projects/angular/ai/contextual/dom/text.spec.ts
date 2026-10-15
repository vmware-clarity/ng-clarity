/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { truncate } from './text';

describe('truncate', () => {
  it('collapses runs of whitespace into single spaces', () => {
    expect(truncate('  Add   firewall\n  rule ', 100)).toBe('Add firewall rule');
  });

  it('leaves text within the budget untouched', () => {
    expect(truncate('Add rule', 100)).toBe('Add rule');
  });

  it('marks text it had to shorten with an ellipsis', () => {
    expect(truncate('abcdefghij', 5)).toBe('abcd…');
  });

  it('never exceeds the budget it was given', () => {
    expect(truncate('abcdefghij', 5).length).toBe(5);
  });
});
