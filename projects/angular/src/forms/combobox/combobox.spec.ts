/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrCombobox } from './combobox';
import { ClrComboboxModule } from './combobox.module';
import { ClrIcon } from '../../icon';
import { MultiSelectComboboxModel } from './model/multi-select-combobox.model';
import { SingleSelectComboboxModel } from './model/single-select-combobox.model';
import { COMBOBOX_FOCUS_HANDLER_PROVIDER } from './providers/combobox-focus-handler.service';
import { OptionSelectionService } from './providers/option-selection.service';
import { ClrPopoverContent } from '../../popover';
import { ClrPopoverService } from '../../popover/common/providers/popover.service';
import { IF_ACTIVE_ID_PROVIDER } from '../../utils/conditional/if-active.service';
import { FOCUS_SERVICE_PROVIDER } from '../../utils/focus/focus.service';
import { delay } from '../../utils/testing/helpers.spec';

@Component({
  template: `
    <clr-combobox
      [placeholder]="placeholder"
      [(ngModel)]="selection"
      [clrMulti]="multi"
      [clrEditable]="editable"
      (clrInputChange)="inputChanged($event)"
      (clrOpenChange)="openChanged($event)"
      [disabled]="disabled"
    >
      <clr-options>
        <clr-option [clrValue]="1">1</clr-option>
        <clr-option [clrValue]="2">2</clr-option>
        <clr-option [clrValue]="3">3</clr-option>
      </clr-options>
    </clr-combobox>
  `,
  standalone: false,
})
class TestComponent {
  multi: boolean;
  editable = false;
  selection: any;
  inputValue: string;
  openState: boolean;
  placeholder: string;
  disabled = false;
  inputChanged(value: string) {
    this.inputValue = value;
  }
  openChanged(open: boolean) {
    this.openState = open;
  }
}

export default function (): void {
  describe('Combobox Component', function () {
    let clarityElement: HTMLElement;
    let popoverService: ClrPopoverService;
    let selectionService: OptionSelectionService<string>;
    let fixture: ComponentFixture<TestComponent>;
    let clarityDirective: ClrCombobox<string>;

    beforeEach(function () {
      TestBed.configureTestingModule({
        imports: [ClrComboboxModule, ClrIcon, FormsModule, NoopAnimationsModule],
        declarations: [TestComponent, ClrPopoverContent],
        providers: [
          OptionSelectionService,
          IF_ACTIVE_ID_PROVIDER,
          FOCUS_SERVICE_PROVIDER,
          COMBOBOX_FOCUS_HANDLER_PROVIDER,
        ],
      });

      fixture = TestBed.createComponent(TestComponent);
      const comboboxDebugElement = fixture.debugElement.query(By.directive(ClrCombobox));
      clarityDirective = comboboxDebugElement.componentInstance;
      clarityElement = comboboxDebugElement.nativeElement;
      selectionService = comboboxDebugElement.injector.get(OptionSelectionService) as OptionSelectionService<string>;
      popoverService = comboboxDebugElement.injector.get(ClrPopoverService);

      fixture.detectChanges();
    });

    afterEach(function () {
      popoverService.open = false;
      fixture.detectChanges();
    });

    describe('Typescript API', function () {
      it('implements method that updates the model', () => {
        clarityDirective.writeValue('test');
        expect(selectionService.selectionModel.containsItem('test')).toBeTrue();
      });

      it('has method to unselect value after deletion', () => {
        selectionService.select('test');
        expect(selectionService.selectionModel.containsItem('test')).toBeTrue();
        clarityDirective.unselect('test');
        expect(selectionService.selectionModel.containsItem('test')).toBeFalse();
      });

      it('has open state read-only property', () => {
        expect(clarityDirective.openState).toBeFalsy();
        popoverService.open = true;
        expect(clarityDirective.openState).toBeTrue();
      });

      it('has associated form control', () => {
        expect(clarityDirective.control).toBeTruthy();
      });

      it('does not close panel on clear', () => {
        popoverService.open = true;
        clarityDirective.writeValue(null);
        expect(clarityDirective.openState).toBeTrue();
      });

      it('closes panel on selection', () => {
        popoverService.open = true;
        selectionService.select('test');
        expect(clarityDirective.openState).toBeFalse();
      });

      it('does not close panel on selection if multiselect', () => {
        clarityDirective.multiSelect = true;
        popoverService.open = true;
        selectionService.select('test');
        expect(clarityDirective.openState).toBeTrue();
      });

      // The forms framework has some inner asychronisity, which requires the async/whenStable
      // approach in the following tests
      it('sets selection model based on selection binding', async () => {
        fixture.componentInstance.selection = 'test';
        fixture.detectChanges();
        await fixture.whenStable();
        expect(selectionService.selectionModel.containsItem('test')).toBeTrue();
      });

      it('clears selection model', async () => {
        fixture.componentInstance.selection = null;
        fixture.detectChanges();
        await fixture.whenStable();
        expect(selectionService.selectionModel.isEmpty()).toBeTrue();
      });
    });

    describe('Template API', function () {
      it('defaults to single model', () => {
        expect(selectionService.selectionModel instanceof SingleSelectComboboxModel).toBeTrue();
      });

      it('can change to multi model', () => {
        fixture.componentInstance.multi = true;
        fixture.detectChanges();
        expect(selectionService.selectionModel instanceof MultiSelectComboboxModel).toBeTrue();
      });

      it('notifies on input changes', () => {
        expect(fixture.componentInstance.inputValue).toBeFalsy();
        clarityDirective.searchText = 'test';
        fixture.detectChanges();
        expect(fixture.componentInstance.inputValue).toBe('test');
      });

      it('notifies on open changes', () => {
        expect(fixture.componentInstance.openState).toBeFalsy();
        popoverService.open = true;
        expect(fixture.componentInstance.openState).toBeTrue();
      });
    });

    describe('View Basics', () => {
      it('adds the .clr-combobox class on the host', () => {
        expect(clarityElement.classList.contains('clr-combobox')).toBe(true);
      });

      it('has a generated id', () => {
        expect(clarityElement.hasAttribute('id')).toBeTrue();
      });

      it('contains an editable input', () => {
        const input = clarityElement.querySelector('.clr-combobox-input');
        expect(input).not.toBeNull();
      });

      it('keep input value on blur if combobox is editable', async () => {
        fixture.componentInstance.editable = true;
        const input = clarityElement.querySelector('.clr-combobox-input') as HTMLInputElement;
        expect(input).not.toBeNull();
        input.value = '4';
        input.dispatchEvent(new Event('change'));
        expect(input.value).toBe('4');
        input.blur();
        expect(input.value).toBe('4');
      });

      it('clear input value on blur if combobox is not editable', async () => {
        fixture.componentInstance.editable = false;
        popoverService.open = true;
        const input = clarityElement.querySelector('.clr-combobox-input') as HTMLInputElement;
        expect(input).not.toBeNull();
        input.value = '4';
        input.dispatchEvent(new Event('change'));
        expect(input.value).toBe('4');
        input.blur();
        await delay(100);
        expect(input.value).toBe('');
      });

      it('contains a options menu trigger', () => {
        expect(clarityElement.querySelector('.clr-combobox-trigger')).not.toBeNull();
      });

      it('opens the menu on the trigger click', () => {
        const trigger: HTMLElement = clarityElement.querySelector('.clr-combobox-trigger');
        expect(popoverService.open).toBe(false);
        trigger.click();
        expect(popoverService.open).toBe(true);
      });

      it('has aria-owns attribute', () => {
        const trigger: HTMLElement = clarityElement.querySelector('.clr-combobox-input');
        expect(trigger.hasAttribute('aria-owns')).toBeTrue();
        expect(trigger.getAttribute('aria-owns')).toContain('clr-options-');
      });

      it('has aria-expanded attribute', () => {
        const trigger: HTMLElement = clarityElement.querySelector('.clr-combobox-input');
        expect(trigger.hasAttribute('aria-expanded')).toBeTrue();
        expect(trigger.getAttribute('aria-expanded')).toEqual('false');
        popoverService.open = true;
        fixture.detectChanges();
        expect(trigger.getAttribute('aria-expanded')).toEqual('true');
      });

      it('should pass placeholder to internal input', () => {
        fixture.componentInstance.placeholder = 'hello world';
        fixture.detectChanges();
        const combobox: HTMLElement = clarityElement.querySelector('.clr-combobox-input');
        expect(combobox.getAttribute('placeholder')).toEqual('hello world');
      });

      it('should disable openClose button', async function () {
        fixture.componentInstance.disabled = true;
        fixture.detectChanges();
        await delay();
        fixture.detectChanges();
        const button: HTMLButtonElement = clarityElement.querySelector('.clr-combobox-trigger');
        expect(button.disabled).toBeTruthy();
      });
    });
  });
}
