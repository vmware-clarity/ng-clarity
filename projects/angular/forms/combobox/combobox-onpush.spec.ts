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
import { ClrComboboxIdentityFunction } from './model/combobox.model';
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

interface Fruit {
  id: number;
  name: string;
}

const FRUIT_OBJECTS: Fruit[] = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
];

@Component({
  template: `
    <clr-combobox
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
      [clrMulti]="multi()"
      [showSelectAll]="multi()"
      [clrEditable]="editable()"
      [clrComboboxIdentityFn]="identityFn()"
    >
      <ng-container *clrOptionSelected="let item">{{ item.name }}</ng-container>
      <clr-options>
        <clr-option *clrOptionItems="let item of items(); field: 'name'" [clrValue]="item">{{ item.name }}</clr-option>
      </clr-options>
    </clr-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class OptionItemsHost {
  readonly value = signal<Fruit | Fruit[]>(null);
  readonly multi = signal(false);
  readonly editable = signal(false);
  readonly items = signal(FRUIT_OBJECTS);
  readonly identityFn = signal<ClrComboboxIdentityFunction<Fruit>>(item => item);
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

  describe('in an OnPush host using *clrOptionItems', () => {
    let fixture: ComponentFixture<OptionItemsHost>;
    let t: ReturnType<typeof setup<OptionItemsHost>>;

    beforeEach(async () => {
      t = setup(OptionItemsHost);
      fixture = t.fixture;
      await fixture.whenStable();
    });

    afterEach(() => fixture.destroy());

    it('renders the options and filters them while typing', async () => {
      t.popoverService.open = true;
      await fixture.whenStable();
      expect(optionTexts()).toEqual(['Apple', 'Banana', 'Cherry']);

      t.selectionService.showAllOptions = false;
      t.input.value = 'an';
      t.input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      expect(optionTexts()).toEqual(['Banana']);

      t.input.value = 'zzz';
      t.input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      expect(panel().textContent).toContain('No results');
    });

    it('moves the pseudo focus with the arrow keys', async () => {
      t.popoverService.open = true;
      await fixture.whenStable();
      expect(document.querySelector('clr-option.clr-focus')).toBeNull();

      t.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await fixture.whenStable();
      const first = document.querySelectorAll('clr-option')[0];
      expect(first.classList).toContain('clr-focus');
      expect(t.input.getAttribute('aria-activedescendant')).toBe(first.id);

      t.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await fixture.whenStable();
      const second = document.querySelectorAll('clr-option')[1];
      expect(first.classList).not.toContain('clr-focus');
      expect(second.classList).toContain('clr-focus');
      expect(t.input.getAttribute('aria-activedescendant')).toBe(second.id);
    });

    it('truncates the pills of a total selection and expands them with the toggle', async () => {
      fixture.componentInstance.multi.set(true);
      await fixture.whenStable();
      t.popoverService.open = true;
      await fixture.whenStable();

      selectAllButton().click();
      await fixture.whenStable();
      const toggle = () => t.host.querySelector<HTMLButtonElement>('.clr-combobox-show-more-btn');
      expect(t.pills().join(' ')).toContain('All 3 selected');
      expect(toggle().getAttribute('aria-expanded')).toBe('false');

      toggle().click();
      await fixture.whenStable();
      expect(toggle().getAttribute('aria-expanded')).toBe('true');
      expect(t.pills()).toEqual(expect.arrayContaining(['Apple', 'Banana', 'Cherry']));

      toggle().click();
      await fixture.whenStable();
      expect(toggle().getAttribute('aria-expanded')).toBe('false');
      expect(t.pills().join(' ')).toContain('All 3 selected');
    });

    it('resolves typed text into a selection when it is editable', async () => {
      fixture.componentInstance.multi.set(true);
      fixture.componentInstance.editable.set(true);
      (t.combobox as ClrCombobox<any>).editableResolver = (input: string) => ({ id: 99, name: input });
      await fixture.whenStable();
      t.popoverService.open = true;
      await fixture.whenStable();

      t.selectionService.showAllOptions = false;
      t.input.value = 'Plum';
      t.input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      t.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await fixture.whenStable();

      expect(fixture.componentInstance.value()).toEqual([{ id: 99, name: 'Plum' }]);
      expect(t.pills()).toEqual(['Plum']);
      expect(t.input.value).toBe('');
    });

    it('re-renders the selection when the identity function changes', async () => {
      fixture.componentInstance.value.set({ id: 2, name: 'Banana (copy)' });
      await fixture.whenStable();
      await delay();
      t.popoverService.open = true;
      await fixture.whenStable();
      const banana = () => document.querySelectorAll('clr-option')[1];
      expect(banana().classList).not.toContain('active');

      fixture.componentInstance.identityFn.set(item => item.id);
      await fixture.whenStable();
      expect(banana().classList).toContain('active');
    });
  });
});
