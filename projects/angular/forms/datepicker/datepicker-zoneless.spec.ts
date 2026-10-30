/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ClrDatepickerModule } from './datepicker.module';

@Component({
  template: `
    <clr-date-container>
      <label>Date</label>
      <input clrDate [ngModel]="date()" (ngModelChange)="date.set($event)" />
    </clr-date-container>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DatepickerHost {
  readonly date = signal('10/15/2026');
}

describe('Datepicker focus (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<DatepickerHost>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ClrDatepickerModule],
      declarations: [DatepickerHost],
      providers: [provideZonelessChangeDetection(), provideCheckNoChangesConfig({ exhaustive: true })],
    });
    fixture = TestBed.createComponent(DatepickerHost);
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('focuses the calendar, follows keyboard navigation, and restores input focus after selection', async () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.clr-input-group-icon-action');
    toggle.click();
    await fixture.whenStable();

    const day: HTMLButtonElement = document.querySelector('.day-btn[tabindex="0"]');
    expect(day).not.toBeNull();
    expect(document.activeElement).toBe(day);

    day.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    const nextDay: HTMLButtonElement = document.querySelector('.day-btn[tabindex="0"]');
    expect(nextDay).not.toBe(day);
    expect(document.activeElement).toBe(nextDay);

    nextDay.click();
    await fixture.whenStable();
    expect(document.querySelector('.calendar-table')).toBeNull();
    expect(document.activeElement).toBe(input);
  });
});
