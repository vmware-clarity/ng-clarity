/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createTestHelpers, TestContext } from '@clr/angular/testing';

import { ClrFilterHighlight } from './filter-highlight.directive';
import { OptionSelectionService } from './providers/option-selection.service';

@Component({
  template: `
    <div clrFilterHighlight #test>
      hay needle hay needle hay
      <div></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestComponent {}

describe('Combobox component', () => {
  describe('Directives', () => {
    // Temporarily disabled while the directive is being verified to be properly sanitized.
    describe('Highlight directive', () => {
      const helpers = createTestHelpers();

      let context: TestContext<ClrFilterHighlight<string>, TestComponent>;
      let optionService: OptionSelectionService<string>;

      beforeEach(() => {
        context = helpers.createOnly<ClrFilterHighlight<string>, TestComponent>(ClrFilterHighlight, TestComponent, [
          OptionSelectionService,
        ]);
        optionService = context.getClarityProvider(OptionSelectionService) as OptionSelectionService<string>;
      });

      it('highlights the search text inside the element content', () => {
        optionService.currentInput = 'needle';
        expect(context.testElement.innerHTML).toContain('hay <b>needle</b> hay <b>needle</b> hay');
      });
    });
  });
});
