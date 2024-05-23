/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

import { TestContext } from '../../data/datagrid/helpers.spec';
import { ClrPopoverService } from '../../utils/popover/providers/popover.service';
import { ClrCombobox } from './combobox';

@Component({
  template: `
    <clr-combobox>
      <clr-option [clrValue]="'Option 1'">Option 1</clr-option>
      <clr-option [clrValue]="'Option 2'">Option 2</clr-option>
    </clr-combobox>
  `,
})
class TestOptionSelection {}

export default function (): void {
  describe('Rendering Selected Option', function () {
    let context: TestContext<ClrCombobox<string>, TestOptionSelection>;
    let popoverService: ClrPopoverService;

    beforeEach(function () {
      context = this.create(ClrCombobox, TestOptionSelection, [], []);
      popoverService = context.getClarityProvider(ClrPopoverService);
      popoverService.open = true;
      context.detectChanges();
    });

    afterEach(function () {
      popoverService.open = false;
      context.detectChanges();
    });

    it('renders the selected option in the input when it is clicked', fakeAsync(function () {
      const options = document.body.querySelectorAll('.clr-combobox-option');
      const selection: HTMLInputElement = context.clarityElement.querySelector('.clr-combobox-input');

      expect(selection.value).toMatch('');
      (options[0] as HTMLElement).click();
      context.detectChanges();
      tick();
      expect(selection.value).toMatch(/Option 1/);
    }));

    it('clears the previous selection and renders the new selection', fakeAsync(function () {
      const options = document.body.querySelectorAll('.clr-combobox-option');
      const selection: HTMLInputElement = context.clarityElement.querySelector('.clr-combobox-input');
      (options[0] as HTMLElement).click();
      context.detectChanges();
      tick();
      expect(selection.value).toMatch(/Option 1/);
      popoverService.open = true;
      (options[1] as HTMLElement).click();
      context.detectChanges();
      tick();
      expect(selection.value).toMatch(/Option 2/);
    }));
  });
}
