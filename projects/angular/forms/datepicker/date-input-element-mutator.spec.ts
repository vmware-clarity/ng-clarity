/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ClrContextEngineService,
  ClrElementMutationResult,
  ClrMutationEngineService,
  ClrPageContext,
  provideClrMutationPolicy,
} from '@clr/angular/ai';
import { ClrCommonFormsModule } from '@clr/angular/forms/common';
import { ClrComponentContext, ClrElementMutation, readElementMutator } from '@clr/angular/utils';

import { ClrDateContainer } from './date-container';
import { ClrDatepickerModule } from './datepicker.module';
import { DayModel } from './model/day.model';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerEnabledService } from './providers/datepicker-enabled.service';

/** The picker a small-screen mobile browser gets: the browser's own, not Clarity's. */
@Injectable()
class NativeDatepickerEnabledService extends DatepickerEnabledService {
  override get isEnabled(): boolean {
    return false;
  }
}

@Component({
  selector: 'date-host',
  template: `
    <form [formGroup]="form">
      <clr-date-container>
        <label>When</label>
        <input type="date" clrDate formControlName="when" />
      </clr-date-container>
    </form>
  `,
  standalone: false,
})
class DateHost {
  form = new FormGroup({ when: new FormControl<string | null>('') });
}

@Component({
  selector: 'native-date-host',
  template: `
    <form [formGroup]="form">
      <clr-date-container>
        <label>When</label>
        <input type="date" clrDate formControlName="when" />
      </clr-date-container>
    </form>
  `,
  standalone: false,
})
class NativeDateHost {
  form = new FormGroup({ when: new FormControl<string | null>('2026-03-05') });
}

function findNode(
  nodes: ClrComponentContext[],
  match: (node: ClrComponentContext) => boolean
): ClrComponentContext | null {
  for (const node of nodes) {
    if (match(node)) {
      return node;
    }
    const inside = findNode(node.children ?? [], match);
    if (inside) {
      return inside;
    }
  }
  return null;
}

function refOf(snapshot: ClrPageContext, label: string): string {
  const node = findNode(snapshot.components, candidate => !!candidate.ref && candidate.label === label);
  if (!node?.ref) {
    throw new Error(`no ref for "${label}" in ${JSON.stringify(snapshot.components)}`);
  }
  return node.ref;
}

function pad(part: number): string {
  return String(part).padStart(2, '0');
}

/** The en-US display string of a date's local calendar day, which is what the control holds. */
function displayOf(date: Date): string {
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
}

function isoOf(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

describe('ClrDateInput element mutator', () => {
  let fixture: ComponentFixture<DateHost | NativeDateHost>;
  let input: HTMLInputElement;
  let control: FormControl<string | null>;
  let dateNavigationService: DateNavigationService;

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function create(component: typeof DateHost | typeof NativeDateHost) {
    fixture = TestBed.createComponent(component);
    await settle();
    input = fixture.nativeElement.querySelector('input[clrDate]');
    control = fixture.componentInstance.form.controls.when;
    dateNavigationService = fixture.debugElement
      .query(By.directive(ClrDateContainer))
      .injector.get(DateNavigationService);
  }

  function coerce(proposed: unknown): ClrElementMutation {
    const mutator = readElementMutator(input);
    if (!mutator?.coerce) {
      throw new Error('expected the date input to publish a mutator with coerce');
    }
    return mutator.coerce(proposed);
  }

  /** Writes the way the mutation engine does: coerce, then set the form control. */
  async function write(proposed: unknown): Promise<ClrElementMutation> {
    const coerced = coerce(proposed);
    if (coerced.refused === undefined) {
      control.markAsDirty();
      control.markAsTouched();
      control.setValue(coerced.value as string);
      await settle();
    }
    return coerced;
  }

  function expectSelectedDay(year: number, month: number, day: number) {
    expect(dateNavigationService.selectedDay).toEqual(new DayModel(year, month, day));
  }

  function configure() {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, ClrCommonFormsModule, ClrDatepickerModule],
      declarations: [DateHost, NativeDateHost],
      providers: [provideClrMutationPolicy({ classify: () => 'reversible' })],
    });
  }

  afterEach(() => fixture?.destroy());

  describe('with the Clarity datepicker', () => {
    beforeEach(async () => {
      configure();
      await create(DateHost);
    });

    it('publishes a mutator on the input and removes it on destroy', () => {
      expect(readElementMutator(input)).not.toBeNull();

      fixture.destroy();

      expect(readElementMutator(input)).toBeNull();
    });

    describe('exact values', () => {
      it('writes an ISO date as exactly that day, with no time-zone shift', async () => {
        const result = await write('2026-03-05');

        expect(result).toEqual({ value: '03/05/2026' });
        expect(control.value).toBe('03/05/2026');
        expect(input.value).toBe('03/05/2026');
        expectSelectedDay(2026, 2, 5);
      });

      it('keeps the first and last days of the year on their own year', async () => {
        await write('2026-01-01');
        expectSelectedDay(2026, 0, 1);
        expect(control.value).toBe('01/01/2026');

        await write('2026-12-31');
        expectSelectedDay(2026, 11, 31);
        expect(control.value).toBe('12/31/2026');
      });

      it('reads back what it wrote: the value it holds coerces to itself', async () => {
        await write('2026-03-05');
        const held = control.value;

        expect(coerce(held)).toEqual({ value: held });
        expect(coerce(new Date(2026, 2, 5))).toEqual({ value: held });
      });

      it('ignores the time of day of a Date', () => {
        expect(coerce(new Date(2026, 2, 5, 23, 59, 59))).toEqual({ value: '03/05/2026' });
        expect(coerce(new Date(2026, 2, 5, 0, 0, 0))).toEqual({ value: '03/05/2026' });
      });

      it('trims whitespace around an ISO date', () => {
        expect(coerce('  2026-03-05 ')).toEqual({ value: '03/05/2026' });
      });

      it('takes null and the empty string as clearing', async () => {
        await write('2026-03-05');

        expect(await write(null)).toEqual({ value: '' });
        expect(control.value).toBe('');
        expect(input.value).toBe('');
        expect(coerce('')).toEqual({ value: '' });
      });
    });

    describe('moments in time', () => {
      it('resolves an ISO date-time with an offset to the local calendar day of that instant', async () => {
        // 23:30 at UTC-5 is 04:30 UTC on the 6th; the day it is where the user is may be either.
        const instant = new Date(Date.UTC(2026, 2, 6, 4, 30));

        const result = await write('2026-03-05T23:30:00-05:00');

        expect(result).toEqual({ value: displayOf(instant) });
        expectSelectedDay(instant.getFullYear(), instant.getMonth(), instant.getDate());
      });

      it('resolves a UTC instant to the local calendar day of that instant', () => {
        const instant = new Date(Date.UTC(2026, 11, 31, 23, 0));

        expect(coerce('2026-12-31T23:00:00Z')).toEqual({ value: displayOf(instant) });
      });

      it('refuses a date-time that is not a moment', () => {
        expect(coerce('2026-03-05Tnoon').refused).toBeDefined();
      });
    });

    describe('impossible dates', () => {
      const impossible = ['2026-02-30', '2026-02-29', '2026-13-01', '2026-00-10', '2026-04-31', 'not a date'];

      for (const proposal of impossible) {
        it(`refuses "${proposal}" and leaves the control as it was`, async () => {
          await write('2026-03-05');

          const result = await write(proposal);

          expect(result.refused).toContain('MM/DD/YYYY');
          expect(result.refused).toContain('YYYY-MM-DD');
          expect(control.value).toBe('03/05/2026');
          expectSelectedDay(2026, 2, 5);
        });
      }

      it('accepts the 29th of February in a leap year', () => {
        expect(coerce('2028-02-29')).toEqual({ value: '02/29/2028' });
      });

      it('refuses an invalid Date and anything that is not a date', () => {
        expect(coerce(new Date('nonsense')).refused).toBeDefined();
        expect(coerce(20260305).refused).toBeDefined();
        expect(coerce({ year: 2026, month: 3, day: 5 }).refused).toBeDefined();
        expect(coerce(true).refused).toBeDefined();
      });
    });

    describe('dates from another realm', () => {
      let frame: HTMLIFrameElement;

      beforeEach(() => {
        frame = document.createElement('iframe');
        document.body.appendChild(frame);
      });

      afterEach(() => frame.remove());

      it('accepts a Date made in another frame, which instanceof would reject', async () => {
        const ForeignDate = (frame.contentWindow as unknown as { Date: DateConstructor }).Date;
        const foreign = new ForeignDate(2026, 2, 5);
        expect(foreign instanceof Date).toBeFalse();

        const result = await write(foreign);

        expect(result).toEqual({ value: '03/05/2026' });
        expectSelectedDay(2026, 2, 5);
      });

      it('refuses an invalid Date made in another frame', () => {
        const ForeignDate = (frame.contentWindow as unknown as { Date: DateConstructor }).Date;

        expect(coerce(new ForeignDate('nonsense')).refused).toBeDefined();
      });
    });

    describe('through the mutation engine', () => {
      async function set(value: unknown): Promise<ClrElementMutationResult> {
        const ref = refOf(TestBed.inject(ClrContextEngineService).getSnapshot(), 'When');
        const report = await TestBed.inject(ClrMutationEngineService).apply([
          { operation: 'setValue', ref, description: 'When', value },
        ]);
        await settle();
        return report.results[0] as ClrElementMutationResult;
      }

      it('writes an ISO date as exactly that day and reads it back', async () => {
        const result = await set('2026-03-05');

        expect(result.applied).toBeTrue();
        expect(result.value).toBe('03/05/2026');
        expect(control.value).toBe('03/05/2026');
        expect(input.value).toBe('03/05/2026');
        expectSelectedDay(2026, 2, 5);
      });

      it('writes an instant with an offset as its local calendar day', async () => {
        const instant = new Date(Date.UTC(2026, 2, 6, 4, 30));

        const result = await set('2026-03-05T23:30:00-05:00');

        expect(result.applied).toBeTrue();
        expect(control.value).toBe(displayOf(instant));
      });

      it('refuses an impossible date with the accepted forms named, and keeps the value', async () => {
        await set('2026-03-05');

        for (const proposal of ['2026-02-30', 'not a date']) {
          const result = await set(proposal);

          expect(result.applied).toBeFalse();
          expect(result.refused).toBe('invalid');
          expect(result.detail).toContain('YYYY-MM-DD');
          expect(control.value).toBe('03/05/2026');
        }
      });

      it('accepts a Date made in another frame', async () => {
        const frame = document.createElement('iframe');
        document.body.appendChild(frame);
        try {
          const ForeignDate = (frame.contentWindow as unknown as { Date: DateConstructor }).Date;

          const result = await set(new ForeignDate(2026, 6, 14));

          expect(result.applied).toBeTrue();
          expect(control.value).toBe('07/14/2026');
        } finally {
          frame.remove();
        }
      });
    });
  });

  describe('with the native datepicker', () => {
    beforeEach(async () => {
      configure();
      TestBed.overrideComponent(ClrDateContainer, {
        add: { providers: [{ provide: DatepickerEnabledService, useClass: NativeDatepickerEnabledService }] },
      });
      await create(NativeDateHost);
    });

    it('renders the browser date input', () => {
      expect(input.getAttribute('type')).toBe('date');
    });

    it('does not blank the field when the form control starts with an ISO date', () => {
      expectSelectedDay(2026, 2, 5);
      expect(control.value).toBe('2026-03-05');
      expect(input.value).toBe('2026-03-05');
    });

    it('does not blank the field when the application sets an ISO date', async () => {
      control.setValue('2026-07-14');
      await settle();

      expect(control.value).toBe('2026-07-14');
      expect(input.value).toBe('2026-07-14');
      expectSelectedDay(2026, 6, 14);
    });

    it('coerces to the ISO date the native input holds, whatever form it is given in', () => {
      expect(coerce('2026-07-14')).toEqual({ value: '2026-07-14' });
      expect(coerce('07/14/2026')).toEqual({ value: '2026-07-14' });
      expect(coerce(new Date(2026, 6, 14, 23, 30))).toEqual({ value: '2026-07-14' });

      const instant = new Date(Date.UTC(2026, 2, 6, 4, 30));
      expect(coerce('2026-03-05T23:30:00-05:00')).toEqual({ value: isoOf(instant) });
    });

    it('refuses an impossible date', () => {
      expect(coerce('2026-02-30').refused).toBeDefined();
    });

    it('writes an ISO date through the mutator without blanking the field', async () => {
      await write('2026-11-02');

      expect(control.value).toBe('2026-11-02');
      expect(input.value).toBe('2026-11-02');
      expectSelectedDay(2026, 10, 2);
    });

    it('writes through the mutation engine and keeps the field', async () => {
      const ref = refOf(TestBed.inject(ClrContextEngineService).getSnapshot(), 'When');

      const report = await TestBed.inject(ClrMutationEngineService).apply([
        { operation: 'setValue', ref, description: 'When', value: '2026-11-02' },
      ]);
      await settle();

      expect(report.results[0].applied).toBeTrue();
      expect(control.value).toBe('2026-11-02');
      expect(input.value).toBe('2026-11-02');
      expectSelectedDay(2026, 10, 2);
    });
  });
});
