/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { Keys } from '@clr/angular/utils';

import { COMBOBOX_FOCUS_HANDLER_PROVIDER, ComboboxFocusHandler, OptionData } from './combobox-focus-handler.service';
import { OptionSelectionService } from './option-selection.service';
import { SingleSelectComboboxModel } from '../model/single-select-combobox.model';

@Component({
  template: `
    <form (submit)="onSubmit()">
      <input type="text" #textInput /><button #trigger></button>
      <ul #listbox></ul>
    </form>
  `,
  standalone: false,
})
class SimpleHost {
  @ViewChild('textInput') textInput: ElementRef<HTMLInputElement>;
  @ViewChild('trigger') trigger: ElementRef<HTMLButtonElement>;
  @ViewChild('listbox') listbox: ElementRef<HTMLUListElement>;
  onSubmit() {
    // do nothing; it makes eslint happy
  }
}

interface TestContext {
  fixture: ComponentFixture<SimpleHost>;
  testComponent: SimpleHost;
  el: HTMLElement;
  focusHandler: ComboboxFocusHandler<any>;
  selectionService: OptionSelectionService<any>;
  popoverService: ClrPopoverService;
}

export default function (): void {
  describe('Basic focusHandler', () => {
    let testContext: TestContext;
    beforeEach(() => {
      testContext = {} as TestContext;
    });

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SimpleHost],
        providers: [ClrPopoverService, OptionSelectionService, COMBOBOX_FOCUS_HANDLER_PROVIDER],
      });
      testContext.fixture = TestBed.createComponent(SimpleHost);
      testContext.testComponent = testContext.fixture.componentInstance;
      testContext.el = testContext.fixture.debugElement.nativeElement;
      testContext.focusHandler = testContext.fixture.debugElement.injector.get(ComboboxFocusHandler);
      testContext.popoverService = testContext.fixture.debugElement.injector.get(ClrPopoverService);
      testContext.selectionService = testContext.fixture.debugElement.injector.get(OptionSelectionService);

      testContext.fixture.detectChanges();

      testContext.focusHandler.textInput = testContext.testComponent.textInput.nativeElement;
      testContext.focusHandler.trigger = testContext.testComponent.trigger.nativeElement;
      testContext.focusHandler.listbox = testContext.testComponent.listbox.nativeElement;

      testContext.focusHandler.addOptionValues([
        new OptionData('1', 'one'),
        new OptionData('2', 'two'),
        new OptionData('3', 'three'),
      ]);
    });

    it('declares itself as a ComboboxFocusHandler provider', () => {
      expect(testContext.focusHandler).toBeTruthy();
    });

    it('has empty pseudoFocus on initialization', () => {
      expect(testContext.focusHandler.pseudoFocus).toBeTruthy();
      expect(testContext.focusHandler.pseudoFocus.isEmpty()).toBeTrue();
      expect(testContext.popoverService.open).toBeFalse();
    });

    it('can open a listbox and set focus', () => {
      const event = new KeyboardEvent('keydown', { key: Keys.ArrowDown });
      testContext.testComponent.textInput.nativeElement.dispatchEvent(event);
      expect(testContext.popoverService.open).toBeTrue();
      expect(testContext.focusHandler.pseudoFocus.model).toEqual(new OptionData('1', 'one'));
    });

    it('moves focus with keys', () => {
      const event = new KeyboardEvent('keydown', { key: Keys.ArrowDown });
      testContext.testComponent.textInput.nativeElement.dispatchEvent(event);
      expect(testContext.focusHandler.pseudoFocus.model).toEqual(new OptionData('1', 'one'));
      testContext.testComponent.textInput.nativeElement.dispatchEvent(event);
      expect(testContext.focusHandler.pseudoFocus.model).toEqual(new OptionData('2', 'two'));
      const upEvent = new KeyboardEvent('keydown', { key: Keys.ArrowUp });
      testContext.testComponent.textInput.nativeElement.dispatchEvent(upEvent);
      expect(testContext.focusHandler.pseudoFocus.model).toEqual(new OptionData('1', 'one'));
    });

    it('closes popover on textInput blur', () => {
      testContext.popoverService.open = true;
      const event = new FocusEvent('blur');
      testContext.testComponent.textInput.nativeElement.dispatchEvent(event);
      expect(testContext.popoverService.open).toBeFalse();
    });

    it('closes popover on trigger blur', () => {
      testContext.popoverService.open = true;
      const event = new FocusEvent('blur');
      testContext.testComponent.trigger.nativeElement.dispatchEvent(event);
      expect(testContext.popoverService.open).toBeFalse();
    });

    it('closes popover on listbox blur', () => {
      testContext.popoverService.open = true;
      const event = new FocusEvent('blur');
      testContext.testComponent.listbox.nativeElement.dispatchEvent(event);
      expect(testContext.popoverService.open).toBeFalse();
    });

    it('can set focus on textInput', () => {
      spyOn(testContext.testComponent.textInput.nativeElement, 'focus');
      testContext.focusHandler.focusInput();
      expect(testContext.testComponent.textInput.nativeElement.focus).toHaveBeenCalled();
    });

    it('can set focus on first active item', () => {
      testContext.selectionService.selectionModel = new SingleSelectComboboxModel();
      const item = 'two';
      testContext.selectionService.select(item);
      testContext.focusHandler.focusFirstActive();
      expect(testContext.focusHandler.pseudoFocus.model).toEqual(new OptionData('2', 'two'));
    });

    it('can set focus on the first item if no item is active', () => {
      testContext.selectionService.selectionModel = new SingleSelectComboboxModel();
      testContext.focusHandler.focusFirstActive();
      expect(testContext.focusHandler.pseudoFocus.model).toEqual(new OptionData('1', 'one'));
    });

    it('Option data can be compared', () => {
      const item = new OptionData('1', 'one');
      const sameItem = new OptionData('1', 'one');
      const otherItem = new OptionData('2', 'two');

      expect(item.equals(sameItem)).toBeTrue();
      expect(item.equals(otherItem)).toBeFalse();
    });

    it('does submit on Enter when dialog is closed', () => {
      spyOn(testContext.testComponent, 'onSubmit');
      const event = new KeyboardEvent('keydown', { key: Keys.Enter });
      testContext.testComponent.textInput.nativeElement.dispatchEvent(event);
      expect(testContext.testComponent.onSubmit).not.toHaveBeenCalled();
    });

    it('does not submit on Enter when dialog is open', () => {
      spyOn(testContext.testComponent, 'onSubmit');
      testContext.popoverService.open = true;
      const event = new KeyboardEvent('keydown', { key: Keys.Enter });
      testContext.testComponent.textInput.nativeElement.dispatchEvent(event);
      expect(testContext.testComponent.onSubmit).not.toHaveBeenCalled();
    });
  });
}
