/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { publishedState } from '@clr/angular/testing';
import { CLR_ELEMENT_CONTEXT_PROPERTY } from '@clr/angular/utils';

import { ClrTimelineModule } from './timeline.module';

@Component({
  template: `
    <clr-timeline>
      <clr-timeline-step clrState="success">
        <clr-timeline-step-title>Requested</clr-timeline-step-title>
      </clr-timeline-step>
      <clr-timeline-step clrState="error">
        <clr-timeline-step-title>Provisioned</clr-timeline-step-title>
      </clr-timeline-step>
      <clr-timeline-step>
        <clr-timeline-step-title>Verified</clr-timeline-step-title>
      </clr-timeline-step>
    </clr-timeline>
  `,
  standalone: false,
})
class TestComponent {}

describe('ClrTimelineStep element context', () => {
  let fixture: ComponentFixture<TestComponent>;

  function steps(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('clr-timeline-step'));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ClrTimelineModule], declarations: [TestComponent] });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('publishes the outcome of each step', () => {
    // The timeline is a list and its steps are list items, so the list is summarised by
    // item name — which never reaches the icon whose label carries the outcome.
    expect(steps().map(step => publishedState(step).status)).toEqual(['success', 'error', 'not-started']);
  });

  it('stops publishing once a step is destroyed', () => {
    const step = steps()[0];
    fixture.destroy();

    expect(CLR_ELEMENT_CONTEXT_PROPERTY in step).toBe(false);
  });
});
