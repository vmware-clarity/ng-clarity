/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ClrTimelineLayout } from './enums/timeline-layout.enum';
import { ClrTimelineStepState } from './enums/timeline-step-state.enum';
import { ClrTimelineModule } from './timeline.module';

interface Step {
  title: string;
  state: ClrTimelineStepState;
}

@Component({
  template: `
    <clr-timeline [clrLayout]="layout()">
      @for (step of steps(); track step.title) {
        <clr-timeline-step [clrState]="step.state">
          <clr-timeline-step-header>{{ header() }}</clr-timeline-step-header>
          <clr-timeline-step-title>{{ step.title }}</clr-timeline-step-title>
          <clr-timeline-step-description>{{ description() }}</clr-timeline-step-description>
        </clr-timeline-step>
      }
    </clr-timeline>
  `,
  imports: [ClrTimelineModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class OnPushHost {
  readonly layout = signal(ClrTimelineLayout.HORIZONTAL);
  readonly header = signal('11:00 am');
  readonly description = signal('Description');
  readonly steps = signal<Step[]>([
    { title: 'First', state: ClrTimelineStepState.SUCCESS },
    { title: 'Second', state: ClrTimelineStepState.CURRENT },
  ]);

  setState(index: number, state: ClrTimelineStepState) {
    this.steps.update(steps => steps.map((step, i) => (i === index ? { ...step, state } : step)));
  }
}

/** A zone-era consumer: an Eager host with plain fields that relies on the next tick. */
@Component({
  template: `
    <clr-timeline>
      <clr-timeline-step [clrState]="state">
        <clr-timeline-step-title>Eager</clr-timeline-step-title>
        <clr-timeline-step-description>{{ description }}</clr-timeline-step-description>
      </clr-timeline-step>
    </clr-timeline>
  `,
  imports: [ClrTimelineModule],
  changeDetection: ChangeDetectionStrategy.Eager,
})
class EagerHost {
  state = ClrTimelineStepState.NOT_STARTED;
  description = 'Waiting';
}

/**
 * A Zone.js tick: refreshes every Eager view from the root and skips OnPush views that are not dirty.
 * (`fixture.detectChanges()` in a zoneless TestBed only refreshes views that were notified.)
 */
function zoneTick(fixture: ComponentFixture<unknown>) {
  fixture.componentRef.changeDetectorRef.detectChanges();
  fixture.checkNoChanges();
}

describe('ClrTimeline (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<OnPushHost>;
  let host: OnPushHost;

  function steps(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('clr-timeline-step'));
  }

  function icon(step: HTMLElement): HTMLElement {
    return step.querySelector('cds-icon');
  }

  function srText(step: HTMLElement): string {
    return step.querySelector('.clr-sr-only').textContent;
  }

  beforeEach(async () => {
    fixture = TestBed.createComponent(OnPushHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('renders each step state from its input', () => {
    const [first, second] = steps();
    expect(icon(first).getAttribute('shape')).toBe('success-standard');
    expect(icon(first).getAttribute('aria-label')).toBe('Completed');
    expect(icon(second).getAttribute('shape')).toBe('dot-circle');
    expect(srText(first)).toBe('First');
  });

  it('updates a step when its state changes through a host signal', async () => {
    host.setState(1, ClrTimelineStepState.PROCESSING);
    await fixture.whenStable();
    expect(icon(steps()[1])).toBeNull();
    expect(steps()[1].querySelector('clr-spinner').getAttribute('aria-label')).toBe('In progress');

    host.setState(1, ClrTimelineStepState.ERROR);
    await fixture.whenStable();
    expect(steps()[1].querySelector('clr-spinner')).toBeNull();
    expect(icon(steps()[1]).getAttribute('shape')).toBe('error-standard');
    expect(icon(steps()[1]).getAttribute('status')).toBe('danger');
  });

  it('updates projected header, title and description', async () => {
    host.header.set('12:00 pm');
    host.description.set('Changed');
    host.steps.update(list => [{ ...list[0], title: 'Renamed' }, list[1]]);
    await fixture.whenStable();

    const step = steps().find(element => element.textContent.includes('Renamed'));
    expect(step.querySelector('clr-timeline-step-header').textContent).toBe('12:00 pm');
    expect(step.querySelector('clr-timeline-step-description').textContent).toBe('Changed');
    expect(srText(step)).toBe('Renamed');
  });

  it('renders steps added and removed after the first render', async () => {
    host.steps.update(list => [...list, { title: 'Third', state: ClrTimelineStepState.NOT_STARTED }]);
    await fixture.whenStable();
    expect(steps().length).toBe(3);
    expect(icon(steps()[2]).getAttribute('shape')).toBe('circle');
    expect(srText(steps()[2])).toBe('Third');

    host.steps.set([]);
    await fixture.whenStable();
    expect(steps().length).toBe(0);
  });

  it('updates the layout class', async () => {
    const timeline: HTMLElement = fixture.nativeElement.querySelector('clr-timeline');
    expect(timeline.classList).not.toContain('clr-timeline-vertical');

    host.layout.set(ClrTimelineLayout.VERTICAL);
    await fixture.whenStable();
    expect(timeline.classList).toContain('clr-timeline-vertical');
  });

  it('renders a state that arrives after an async task', async () => {
    await new Promise<void>(resolve =>
      setTimeout(() => {
        host.setState(0, ClrTimelineStepState.NOT_STARTED);
        resolve();
      })
    );
    await fixture.whenStable();
    expect(icon(steps()[0]).getAttribute('shape')).toBe('circle');
  });

  it('updates the icon labels when the strings are localized after the first render', async () => {
    TestBed.inject(ClrCommonStringsService).localize({ timelineStepSuccess: 'Done', timelineStepError: 'Failed' });
    await fixture.whenStable();
    expect(icon(steps()[0]).getAttribute('aria-label')).toBe('Done');

    host.setState(0, ClrTimelineStepState.ERROR);
    await fixture.whenStable();
    expect(icon(steps()[0]).getAttribute('aria-label')).toBe('Failed');
  });
});

describe('ClrTimeline (Eager host, Zone tick)', () => {
  it('renders changed host fields on the next tick', () => {
    const fixture = TestBed.createComponent(EagerHost);
    zoneTick(fixture);

    fixture.componentInstance.state = ClrTimelineStepState.SUCCESS;
    fixture.componentInstance.description = 'Done';
    zoneTick(fixture);

    expect(fixture.nativeElement.querySelector('cds-icon').getAttribute('shape')).toBe('success-standard');
    expect(fixture.nativeElement.querySelector('clr-timeline-step-description').textContent).toBe('Done');
  });
});
