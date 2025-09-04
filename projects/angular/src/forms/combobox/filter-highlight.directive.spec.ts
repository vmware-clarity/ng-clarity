/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrFilterHighlight } from './filter-highlight.directive';
import { OptionSelectionService } from './providers/option-selection.service';
import { TestContext } from '../../data/datagrid/helpers.spec';

@Component({
  template: `
    <div clrFilterHighlight #test>
      hay needle hay needle hay
      <div></div>
    </div>
  `,
  standalone: false,
})
class TestComponent {}

export default function () {
  // Temporarily disabled while the directive is being verified to be properly sanitized.
  describe('Highlight directive', () => {
    let context: TestContext<ClrFilterHighlight<string>, TestComponent>;
    let optionService: OptionSelectionService<string>;

    beforeEach(function () {
      context = this.createOnly(ClrFilterHighlight, TestComponent, [OptionSelectionService]);
      optionService = context.getClarityProvider(OptionSelectionService) as OptionSelectionService<string>;
    });

    it('highlights the search text inside the element content', () => {
      optionService.currentInput = 'needle';
      expect(context.testElement.innerHTML).toContain('hay <b>needle</b> hay <b>needle</b> hay');
    });
  });
}
