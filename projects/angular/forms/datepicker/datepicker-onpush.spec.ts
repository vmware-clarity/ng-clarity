/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClrCommonFormsModule } from '@clr/angular/forms/common';

import { ClrDatepickerModule } from './datepicker.module';
import { ClrWeekday } from './enums/weekday.enum';
import { DateRangeOption } from './interfaces/date-range.interface';

// The datepicker views are OnPush. Their state lives in signals on the datepicker services,
// so the views refresh whatever the host strategy is. The hosts below cover both kinds of consumer:
// an OnPush host that only changes signals, and an Eager host (a Zone app) that changes plain fields.

@Component({
  template: `
    <clr-date-container [clrFirstDayOfWeek]="firstDayOfWeek()" [showActionButtons]="actionButtons()">
      <label>Date</label>
      <input clrDate [ngModel]="date()" (ngModelChange)="date.set($event)" />
    </clr-date-container>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class OnPushDateHost {
  readonly date = signal('10/15/2026');
  readonly firstDayOfWeek = signal<ClrWeekday>(ClrWeekday.Sunday);
  readonly actionButtons = signal(false);
}

@Component({
  template: `
    <clr-date-range-container [rangeOptions]="rangeOptions">
      <label>Range</label>
      <input clrStartDate [(ngModel)]="start" />
      <input clrEndDate [(ngModel)]="end" />
    </clr-date-range-container>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class EagerRangeHost {
  start = '10/05/2026';
  end = '';
  rangeOptions: DateRangeOption[] = [];
}

@Component({
  template: `
    <clr-date-container>
      <label>Date</label>
      @if (showInput) {
        <input clrDate [formControl]="control" />
      }
    </clr-date-container>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class EagerReactiveHost {
  showInput = false;
  control = new FormControl('10/15/2026');
}

// What Zone.js does after any async task: refresh the whole tree from the root, where only
// dirty OnPush views and views with changed signals are refreshed. `ApplicationRef.tick()` in a zoneless
// test refreshes only the views that were marked, so it would hide stale OnPush views.
function zoneTick(fixture: ComponentFixture<unknown>) {
  fixture.changeDetectorRef.detectChanges();
  fixture.checkNoChanges();
}

@Component({
  template: `
    <clr-date-container>
      <label>Date</label>
      <input clrDate [formControl]="control" />
      @if (showHelper) {
        <clr-control-helper>Pick a date</clr-control-helper>
      }
      <clr-control-error>Required</clr-control-error>
    </clr-date-container>
    <clr-date-container>
      <label>Date</label>
      <input clrDate [(ngModel)]="date" [disabled]="disabled" />
    </clr-date-container>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class EagerContainerHost {
  control = new FormControl('', Validators.required);
  showHelper = false;
  date = '';
  disabled = false;
}

function overlay(): HTMLElement {
  return document.querySelector('clr-datepicker-view-manager');
}

function dayButton(date: number): HTMLButtonElement {
  // Only buttons of the displayed month: days of the months around it are marked as excluded.
  return Array.from(document.querySelectorAll<HTMLButtonElement>('.day-btn:not(.is-excluded)')).find(
    button => button.textContent.trim() === String(date)
  );
}

function hover(date: number) {
  dayButton(date).closest('clr-day').dispatchEvent(new MouseEvent('mouseenter'));
}

function selectedDays(): string[] {
  return Array.from(document.querySelectorAll('.day-btn.is-selected')).map(button => button.textContent.trim());
}

function inRangeDays(): string[] {
  return Array.from(document.querySelectorAll('.day-btn.in-range')).map(button => button.textContent.trim());
}

function weekdays(): string[] {
  return Array.from(document.querySelectorAll('.weekday span')).map(span => span.getAttribute('aria-label'));
}

function monthTrigger(): HTMLButtonElement {
  return document.querySelector('.monthpicker-trigger');
}

describe('Datepicker OnPush views', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ClrCommonFormsModule, ClrDatepickerModule],
      declarations: [OnPushDateHost, EagerRangeHost, EagerReactiveHost, EagerContainerHost],
    });
  });

  describe('in an OnPush host driven by signals', () => {
    let fixture: ComponentFixture<OnPushDateHost>;

    beforeEach(async () => {
      fixture = TestBed.createComponent(OnPushDateHost);
      await fixture.whenStable();
      fixture.nativeElement.querySelector('.clr-input-group-icon-action').click();
      await fixture.whenStable();
    });

    afterEach(() => fixture.destroy());

    it('renders the next month when the daypicker switches month', async () => {
      expect(monthTrigger().textContent.trim()).toBe('Oct');
      const firstDay = dayButton(1);

      (document.querySelectorAll('.switcher')[2] as HTMLButtonElement).click();
      await fixture.whenStable();

      expect(monthTrigger().textContent.trim()).toBe('Nov');
      expect(dayButton(1)).not.toBe(firstDay);
      // 1 November 2026 is a Sunday, so it is the first cell of the calendar.
      expect(document.querySelector('.day-btn').textContent.trim()).toBe('1');
    });

    it('moves the selection between days while the popover stays open', async () => {
      fixture.componentInstance.actionButtons.set(true);
      await fixture.whenStable();
      expect(selectedDays()).toEqual(['15']);

      dayButton(20).click();
      await fixture.whenStable();

      expect(overlay()).not.toBeNull();
      expect(selectedDays()).toEqual(['20']);
      expect(dayButton(15).getAttribute('aria-selected')).toBe('false');
      expect(dayButton(20).getAttribute('aria-selected')).toBe('true');
    });

    it('moves the focusable day with the keyboard', async () => {
      const day15 = dayButton(15);
      expect(day15.tabIndex).toBe(0);

      day15.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await fixture.whenStable();

      expect(day15.tabIndex).toBe(-1);
      expect(dayButton(22).tabIndex).toBe(0);
      expect(document.activeElement).toBe(dayButton(22));
    });

    it('switches between the day, month and year views', async () => {
      monthTrigger().click();
      await fixture.whenStable();
      expect(document.querySelector('clr-monthpicker')).not.toBeNull();
      expect(document.querySelector('clr-daypicker')).toBeNull();

      document.querySelectorAll<HTMLButtonElement>('.month')[0].click();
      await fixture.whenStable();
      expect(document.querySelector('clr-daypicker')).not.toBeNull();
      expect(monthTrigger().textContent.trim()).toBe('Jan');

      (document.querySelector('.yearpicker-trigger') as HTMLButtonElement).click();
      await fixture.whenStable();
      document.querySelectorAll<HTMLButtonElement>('.year')[0].click();
      await fixture.whenStable();
      expect(document.querySelector('clr-daypicker')).not.toBeNull();
      expect(document.querySelector('.yearpicker-trigger').textContent.trim()).toBe('2020');
    });

    it('follows clrFirstDayOfWeek while the calendar is open', async () => {
      expect(weekdays()[0]).toBe('Sunday');
      expect(document.querySelector('.day-btn').textContent.trim()).toBe('27');

      fixture.componentInstance.firstDayOfWeek.set(ClrWeekday.Monday);
      await fixture.whenStable();

      expect(weekdays()[0]).toBe('Monday');
      // 1 October 2026 is a Thursday, so a Monday-first grid starts on 28 September.
      expect(document.querySelector('.day-btn').textContent.trim()).toBe('28');
    });

    it('shows the action buttons when showActionButtons turns on while open', async () => {
      expect(document.querySelector('clr-datepicker-actions')).toBeNull();

      fixture.componentInstance.actionButtons.set(true);
      await fixture.whenStable();

      expect(document.querySelector('clr-datepicker-actions')).not.toBeNull();
    });

    it('applies a selection with the action buttons and closes', async () => {
      fixture.componentInstance.actionButtons.set(true);
      await fixture.whenStable();

      dayButton(20).click();
      await fixture.whenStable();
      (document.querySelector('.datepicker-actions .btn-primary') as HTMLButtonElement).click();
      await fixture.whenStable();

      expect(overlay()).toBeNull();
      expect(fixture.componentInstance.date()).toBe('10/20/2026');
      expect(fixture.nativeElement.querySelector('input').value).toBe('10/20/2026');
    });
  });

  describe('in an Eager host that changes plain fields (Zone app)', () => {
    it('highlights the range under the hovered day on every day view', async () => {
      const fixture = TestBed.createComponent(EagerRangeHost);
      await fixture.whenStable();
      fixture.nativeElement.querySelector('.clr-input-group-icon-action').click();
      await fixture.whenStable();

      hover(9);
      await fixture.whenStable();
      expect(inRangeDays()).toEqual(['6', '7', '8', '9']);

      hover(7);
      await fixture.whenStable();
      expect(inRangeDays()).toEqual(['6', '7']);

      dayButton(12).click();
      await fixture.whenStable();
      expect(selectedDays()).toEqual(['5', '12']);
      expect(document.querySelector('.is-start-range').textContent.trim()).toBe('5');
      expect(document.querySelector('.is-end-range').textContent.trim()).toBe('12');

      fixture.destroy();
    });

    it('shows range options set by the host after the first render', async () => {
      const fixture = TestBed.createComponent(EagerRangeHost);
      await fixture.whenStable();

      fixture.componentInstance.rangeOptions = [{ label: 'Today', value: [new Date(), new Date()] }];
      zoneTick(fixture);
      fixture.nativeElement.querySelector('.clr-input-group-icon-action').click();
      await fixture.whenStable();

      expect(document.querySelector('.clr-date-range-picker-nav').textContent.trim()).toBe('Today');

      fixture.destroy();
    });

    it('opens on a value the host set from outside a datepicker event, on an input rendered late', async () => {
      const fixture = TestBed.createComponent(EagerReactiveHost);
      await fixture.whenStable();

      fixture.componentInstance.showInput = true;
      zoneTick(fixture);
      await fixture.whenStable();
      // As a Zone app would after an HTTP response: a plain change, then a tick.
      fixture.componentInstance.control.setValue('03/09/2027');
      zoneTick(fixture);

      fixture.nativeElement.querySelector('.clr-input-group-icon-action').click();
      await fixture.whenStable();

      expect(monthTrigger().textContent.trim()).toBe('Mar');
      expect(document.querySelector('.yearpicker-trigger').textContent.trim()).toBe('2027');
      expect(selectedDays()).toEqual(['9']);

      fixture.destroy();
    });
  });

  describe('date container in an Eager host (Zone app)', () => {
    let fixture: ComponentFixture<EagerContainerHost>;
    let containers: HTMLElement[];

    beforeEach(async () => {
      fixture = TestBed.createComponent(EagerContainerHost);
      await fixture.whenStable();
      containers = Array.from(fixture.nativeElement.querySelectorAll('clr-date-container'));
    });

    afterEach(() => fixture.destroy());

    it('shows the error after the host marks the form as touched', () => {
      expect(containers[0].querySelector('clr-control-error')).toBeNull();

      fixture.componentInstance.control.markAsTouched();
      zoneTick(fixture);

      expect(containers[0].querySelector('clr-control-error')).not.toBeNull();
      expect(containers[0].querySelector('.clr-control-container').classList).toContain('clr-error');
    });

    it('disables the toggle when the host disables the control from code', () => {
      fixture.componentInstance.control.disable();
      zoneTick(fixture);

      expect(containers[0].classList).toContain('clr-form-control-disabled');
      expect(containers[0].querySelector<HTMLButtonElement>('.clr-input-group-icon-action').disabled).toBe(true);
    });

    it('disables the toggle when the host binds disabled on the input', () => {
      fixture.componentInstance.disabled = true;
      zoneTick(fixture);

      expect(containers[1].classList).toContain('clr-form-control-disabled');
      expect(containers[1].querySelector<HTMLButtonElement>('.clr-input-group-icon-action').disabled).toBe(true);
    });

    it('shows the focus ring while the input has focus', async () => {
      const input: HTMLInputElement = containers[0].querySelector('input');
      const group = containers[0].querySelector('.clr-input-group');

      input.focus();
      await fixture.whenStable();
      expect(group.classList).toContain('clr-focus');

      input.blur();
      await fixture.whenStable();
      expect(group.classList).not.toContain('clr-focus');
    });

    it('projects a helper the host adds later', () => {
      fixture.componentInstance.showHelper = true;
      zoneTick(fixture);

      expect(containers[0].querySelector('clr-control-helper').textContent).toBe('Pick a date');
    });
  });

  it('removes the calendar and stops listening when the host is destroyed while open', async () => {
    const fixture = TestBed.createComponent(OnPushDateHost);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('.clr-input-group-icon-action').click();
    await fixture.whenStable();
    expect(overlay()).not.toBeNull();

    fixture.destroy();

    expect(overlay()).toBeNull();
    expect(document.querySelector('.day-btn')).toBeNull();
  });
});
