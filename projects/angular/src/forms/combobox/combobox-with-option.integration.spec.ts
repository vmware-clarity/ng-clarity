/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrCombobox } from './combobox';
import { TestContext } from '../../data/datagrid/helpers.spec';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { delay } from '../../utils/testing/helpers.spec';

@Component({
  template: `
    <clr-combobox>
      <clr-option [clrValue]="'Option 1'">Option 1</clr-option>
      <clr-option [clrValue]="'Option 2'">Option 2</clr-option>
    </clr-combobox>
  `,
  standalone: false,
})
class TestOptionSelection {}

export default function (): void {
  describe('Rendering Selected Option', function () {
    let context: TestContext<ClrCombobox<string>, TestOptionSelection>;
    let toggleService: ClrPopoverToggleService;

    beforeEach(function () {
      context = this.create(ClrCombobox, TestOptionSelection, [], []);
      toggleService = context.getClarityProvider(ClrPopoverToggleService);
      toggleService.open = true;
      context.detectChanges();
    });

    afterEach(function () {
      toggleService.open = false;
      context.detectChanges();
    });

    it('renders the selected option in the input when it is clicked', async function () {
      const options = document.body.querySelectorAll('.clr-combobox-option');
      const selection: HTMLInputElement = context.clarityElement.querySelector('.clr-combobox-input');

      expect(selection.value).toMatch('');
      (options[0] as HTMLElement).click();
      context.detectChanges();
      await delay();
      expect(selection.value).toMatch(/Option 1/);
    });
    it('clears the previous selection and renders the new selection', async function () {
      const options = document.body.querySelectorAll('.clr-combobox-option');
      const selection: HTMLInputElement = context.clarityElement.querySelector('.clr-combobox-input');
      (options[0] as HTMLElement).click();
      context.detectChanges();
      await delay();
      expect(selection.value).toMatch(/Option 1/);
      toggleService.open = true;
      (options[1] as HTMLElement).click();
      context.detectChanges();
      await delay();
      expect(selection.value).toMatch(/Option 2/);
    });
  });
}
