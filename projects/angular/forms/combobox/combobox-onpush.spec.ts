/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { delay } from '@clr/angular/testing';
import { ClrCommonStringsService, ClrLoadingModule } from '@clr/angular/utils';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrCombobox } from './combobox';
import { ClrComboboxModule } from './combobox.module';
import { OptionSelectionService } from './providers/option-selection.service';

const FRUITS = ['Apple', 'Banana', 'Cherry'];

/**
 * An Eager host whose state changes outside of any Angular event, as in a Zone app where an HTTP callback or a timer
 * changes it. `renderFixture()` is then the Zone tick: it refreshes the Eager host, and the OnPush combobox views only
 * when they were notified. The exhaustive `checkNoChanges` fails on any view that was skipped while stale.
 */
@Component({
  template: `
    <clr-combobox-container>
      <label>Fruit</label>
      <clr-combobox [formControl]="control" [clrMulti]="multi" [showSelectAll]="multi" [clrLoading]="loading">
        <ng-container *clrOptionSelected="let item">{{ item }}</ng-container>
        <clr-options>
          @for (item of items; track item) {
            <clr-option [clrValue]="item">{{ item }}</clr-option>
          }
        </clr-options>
      </clr-combobox>
      <clr-control-error>Pick a fruit</clr-control-error>
    </clr-combobox-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ZoneAppHost {
  control = new FormControl<string | string[]>(null, Validators.required);
  multi = false;
  loading = false;
  items = FRUITS;
}

@Component({
  template: `
    <clr-combobox
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
      [clrMulti]="multi()"
      [showSelectAll]="multi()"
      [clrLoading]="loading()"
    >
      <ng-container *clrOptionSelected="let item">{{ item }}</ng-container>
      <clr-options>
        @for (item of items(); track item) {
          <clr-option [clrValue]="item">{{ item }}</clr-option>
        }
      </clr-options>
    </clr-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class SignalHost {
  readonly value = signal<string | string[]>(null);
  readonly multi = signal(false);
  readonly loading = signal(false);
  readonly items = signal(FRUITS);
}

function setup<H>(host: new () => H) {
  TestBed.configureTestingModule({
    imports: [ClrComboboxModule, ClrLoadingModule, FormsModule, ReactiveFormsModule],
    declarations: [host],
  });
  const fixture = TestBed.createComponent(host);
  const comboboxDE = fixture.debugElement.query(By.directive(ClrCombobox));
  return {
    fixture,
    combobox: comboboxDE.componentInstance as ClrCombobox<string>,
    host: comboboxDE.nativeElement as HTMLElement,
    popoverService: comboboxDE.injector.get(ClrPopoverService),
    selectionService: comboboxDE.injector.get(OptionSelectionService) as OptionSelectionService<string>,
    input: comboboxDE.nativeElement.querySelector('.clr-combobox-input') as HTMLInputElement,
    pills: () =>
      Array.from<HTMLElement>(
        comboboxDE.nativeElement.querySelectorAll('.clr-combobox-pills .label-combobox-pill')
      ).map(pill => pill.textContent.trim()),
  };
}

// The options panel is rendered in the document body.
const panel = () => document.querySelector('clr-options');
const optionTexts = () => Array.from(document.querySelectorAll('clr-option')).map(option => option.textContent.trim());
const selectAllButton = () => document.querySelector<HTMLButtonElement>('.clr-combobox-select-all-btn');

describe('Combobox under OnPush', () => {
  describe('in a Zone app (Eager host, state changed outside Angular events)', () => {
    let fixture: ComponentFixture<ZoneAppHost>;
    let t: ReturnType<typeof setup<ZoneAppHost>>;

    beforeEach(async () => {
      t = setup(ZoneAppHost);
      fixture = t.fixture;
      renderFixture(fixture);
      await fixture.whenStable();
    });

    afterEach(() => fixture.destroy());

    it('renders a single value written with setValue()', async () => {
      fixture.componentInstance.control.setValue('Banana');
      renderFixture(fixture);
      await delay();

      expect(t.input.value).toBe('Banana');
    });

    it('renders and removes the pills of a multi-select value written with setValue()', () => {
      fixture.componentInstance.multi = true;
      renderFixture(fixture);

      fixture.componentInstance.control.setValue(['Apple', 'Cherry']);
      renderFixture(fixture);
      expect(t.pills()).toEqual(['Apple', 'Cherry']);

      fixture.componentInstance.control.setValue([]);
      renderFixture(fixture);
      expect(t.pills()).toEqual([]);
    });

    it('updates the select-all button when the whole list is selected with setValue()', () => {
      fixture.componentInstance.multi = true;
      renderFixture(fixture);
      t.popoverService.open = true;
      renderFixture(fixture);
      expect(selectAllButton().textContent.trim()).toBe('Select All');

      fixture.componentInstance.control.setValue([...FRUITS]);
      renderFixture(fixture);
      expect(selectAllButton().textContent.trim()).toBe('Unselect All');
    });

    it('shows and hides the loading state of an open panel', () => {
      t.popoverService.open = true;
      renderFixture(fixture);
      expect(panel().querySelector('.clr-combobox-options-loading')).toBeNull();

      fixture.componentInstance.loading = true;
      renderFixture(fixture);
      expect(panel().querySelector('.clr-combobox-options-loading')).not.toBeNull();

      fixture.componentInstance.loading = false;
      renderFixture(fixture);
      expect(panel().querySelector('.clr-combobox-options-loading')).toBeNull();
      expect(optionTexts()).toEqual(FRUITS);
    });

    it('replaces the "No results" message with options that arrive late', () => {
      fixture.componentInstance.items = [];
      renderFixture(fixture);
      t.popoverService.open = true;
      renderFixture(fixture);
      expect(panel().textContent).toContain('No results');

      fixture.componentInstance.items = ['Kiwi'];
      renderFixture(fixture);
      expect(panel().textContent).not.toContain('No results');
      expect(optionTexts()).toEqual(['Kiwi']);
    });

    it('follows disable() and enable() on the form control', async () => {
      const trigger = t.host.querySelector<HTMLButtonElement>('.clr-combobox-trigger');
      const container = fixture.nativeElement.querySelector('clr-combobox-container');

      fixture.componentInstance.control.disable();
      renderFixture(fixture);
      // The inner input's ngModel applies [disabled] in a microtask.
      await delay();
      expect(t.input.disabled).toBe(true);
      expect(trigger.disabled).toBe(true);
      expect(t.host.classList).toContain('clr-combobox-disabled');
      expect(container.classList).toContain('clr-form-control-disabled');

      fixture.componentInstance.control.enable();
      renderFixture(fixture);
      await delay();
      expect(t.input.disabled).toBe(false);
      expect(t.host.classList).not.toContain('clr-combobox-disabled');
      expect(container.classList).not.toContain('clr-form-control-disabled');
    });

    it('shows the error state after markAsTouched() and clears it after setValue()', () => {
      const wrapper = t.host.querySelector('.clr-combobox-wrapper');
      expect(fixture.nativeElement.textContent).not.toContain('Pick a fruit');

      fixture.componentInstance.control.markAsTouched();
      renderFixture(fixture);
      expect(wrapper.classList).toContain('invalid');
      expect(t.input.getAttribute('aria-invalid')).toBe('true');
      expect(fixture.nativeElement.textContent).toContain('Pick a fruit');

      fixture.componentInstance.control.setValue('Apple');
      renderFixture(fixture);
      expect(wrapper.classList).not.toContain('invalid');
      expect(t.input.getAttribute('aria-invalid')).toBeNull();
      expect(fixture.nativeElement.textContent).not.toContain('Pick a fruit');
    });

    it('renders strings localized after the first render', () => {
      const trigger = t.host.querySelector<HTMLButtonElement>('.clr-combobox-trigger');
      const strings = TestBed.inject(ClrCommonStringsService);
      const original = strings.keys.comboboxOpen;

      strings.localize({ comboboxOpen: 'Open the fruit list' });
      renderFixture(fixture);
      expect(trigger.getAttribute('aria-label')).toBe('Open the fruit list');

      strings.localize({ comboboxOpen: original });
    });
  });

  describe('in an OnPush host driven by signals', () => {
    let fixture: ComponentFixture<SignalHost>;
    let t: ReturnType<typeof setup<SignalHost>>;

    beforeEach(async () => {
      t = setup(SignalHost);
      fixture = t.fixture;
      await fixture.whenStable();
    });

    afterEach(() => fixture.destroy());

    it('renders a value bound through ngModel', async () => {
      fixture.componentInstance.value.set('Cherry');
      await fixture.whenStable();
      await delay();

      expect(t.input.value).toBe('Cherry');
    });

    it('selects with a click on a projected option and renders the pill', async () => {
      fixture.componentInstance.multi.set(true);
      await fixture.whenStable();
      t.popoverService.open = true;
      await fixture.whenStable();

      document.querySelector<HTMLElement>('clr-option:nth-of-type(2)').click();
      await fixture.whenStable();

      expect(fixture.componentInstance.value()).toEqual(['Banana']);
      expect(t.pills()).toEqual(['Banana']);
      expect(document.querySelector('clr-option:nth-of-type(2)').classList).toContain('active');
    });

    it('selects all visible options from the select-all button', async () => {
      fixture.componentInstance.multi.set(true);
      await fixture.whenStable();
      t.popoverService.open = true;
      await fixture.whenStable();

      selectAllButton().click();
      await fixture.whenStable();

      expect(fixture.componentInstance.value()).toEqual(FRUITS);
      expect(selectAllButton().textContent.trim()).toBe('Unselect All');
    });

    it('follows the loading and option signals of the host', async () => {
      fixture.componentInstance.items.set([]);
      fixture.componentInstance.loading.set(true);
      await fixture.whenStable();
      t.popoverService.open = true;
      await fixture.whenStable();
      expect(panel().querySelector('.clr-combobox-options-loading')).not.toBeNull();

      fixture.componentInstance.loading.set(false);
      await fixture.whenStable();
      expect(panel().textContent).toContain('No results');

      fixture.componentInstance.items.set(['Kiwi', 'Lime']);
      await fixture.whenStable();
      expect(panel().textContent).not.toContain('No results');
      expect(optionTexts()).toEqual(['Kiwi', 'Lime']);
    });

    it('stops reacting to selection changes and key presses after it is destroyed', async () => {
      const valueChanges: unknown[] = [];
      t.combobox.registerOnChange((value: unknown) => valueChanges.push(value));
      fixture.destroy();

      t.selectionService.select('Apple');
      t.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      expect(valueChanges).toEqual([]);
      expect(t.popoverService.open).toBe(false);
    });
  });
});
