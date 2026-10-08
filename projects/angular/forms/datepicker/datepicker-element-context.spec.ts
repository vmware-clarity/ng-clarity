/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClrContextEngineService } from '@clr/angular/ai';
import { ClrComponentContext } from '@clr/angular/utils';

import { ClrDateContainer } from './date-container';
import { ClrDatepickerModule } from './datepicker.module';
import { DayModel } from './model/day.model';
import { DateNavigationService } from './providers/date-navigation.service';

@Component({
  template: `
    <form [attr.data-clr-context-redact]="redacted ? '' : null">
      <clr-date-container>
        <label>Date of birth</label>
        <input name="dob" clrDate [(ngModel)]="dob" />
      </clr-date-container>
    </form>
  `,
  standalone: false,
})
class DatepickerTestComponent {
  redacted = false;
  dob: Date | null = null;
}

function findNodes(nodes: ClrComponentContext[], type: string, found: ClrComponentContext[] = []) {
  for (const node of nodes) {
    if (node.type === type) {
      found.push(node);
    }
    findNodes(node.children ?? [], type, found);
  }
  return found;
}

describe('ClrDateContainer, as page-context tooling sees it', () => {
  let fixture: ComponentFixture<DatepickerTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrDatepickerModule, FormsModule, NoopAnimationsModule],
      declarations: [DatepickerTestComponent],
    });
  });

  afterEach(() => fixture?.destroy());

  async function snapshot(redacted: boolean): Promise<ClrComponentContext[]> {
    fixture = TestBed.createComponent(DatepickerTestComponent);
    fixture.componentInstance.redacted = redacted;
    fixture.detectChanges();
    await fixture.whenStable();
    // The user picks a date in the calendar.
    fixture.debugElement
      .query(By.directive(ClrDateContainer))
      .injector.get(DateNavigationService)
      .notifySelectedDayChanged(new DayModel(1984, 2, 2));
    fixture.detectChanges();
    return TestBed.inject(ClrContextEngineService).getSnapshot().components;
  }

  function toggle(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.clr-input-group-icon-action');
  }

  it('names the toggle without the selected date, which its accessible name carries', async () => {
    const components = await snapshot(false);

    // The date is in the toggle's name for screen readers.
    expect(toggle().getAttribute('aria-label')).toContain('1984');
    const buttons = findNodes(components, 'button');
    expect(buttons.map(button => button.label)).toContain('Choose date');
    expect(JSON.stringify(buttons)).not.toContain('1984');
  });

  it('leaves the toggle unnamed inside a region the application redacts', async () => {
    const components = await snapshot(true);

    expect(toggle().getAttribute('aria-label')).toContain('1984');
    const buttons = findNodes(components, 'button');
    expect(buttons.length).toBe(1);
    // Neither the name its markup gives it nor the one it publishes: inside a redacted
    // region a published name may itself be what the region withholds.
    expect(buttons[0].label).toBeUndefined();
    expect(buttons[0].state?.['redacted']).toBe(true);
    expect(JSON.stringify(components)).not.toContain('1984');
  });

  it('keeps the selected date from a consumer the application does not control', async () => {
    await snapshot(true);
    const engine = TestBed.inject(ClrContextEngineService);
    engine.enableGlobalAccess('testDatepickerClrContext');
    try {
      const accessor = (window as unknown as Record<string, () => unknown>)['testDatepickerClrContext'];

      expect(JSON.stringify(accessor())).not.toContain('1984');
    } finally {
      engine.disableGlobalAccess();
    }
  });
});
