/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CLR_ELEMENT_CONTEXT_PROPERTY, ClrContextSnapshotOptions, ClrElementContextCallback } from '@clr/angular/utils';

import { ClrStepperModule } from './stepper.module';

const BUDGETS: Required<ClrContextSnapshotOptions> = {
  maxTextLength: 100,
  maxItemsPerCollection: 25,
  maxComponents: 100,
  includeDomComponents: true,
};

function publishedOn(element: Element): Record<string, unknown> {
  const callback = (element as Element & { [CLR_ELEMENT_CONTEXT_PROPERTY]?: ClrElementContextCallback })[
    CLR_ELEMENT_CONTEXT_PROPERTY
  ];
  if (!callback) {
    throw new Error('expected an element context callback to be published');
  }
  return (callback(BUDGETS)?.state ?? {}) as Record<string, unknown>;
}

@Component({
  template: `
    <form clrStepper [formGroup]="form">
      <clr-stepper-panel formGroupName="identity">
        <clr-step-title>Identity</clr-step-title>
        <clr-step-content>
          <input formControlName="name" />
        </clr-step-content>
      </clr-stepper-panel>
      <clr-stepper-panel formGroupName="network">
        <clr-step-title>Networking</clr-step-title>
        <clr-step-content>
          <input formControlName="subnet" />
        </clr-step-content>
      </clr-stepper-panel>
    </form>
  `,
  standalone: false,
})
class TestComponent {
  form = new FormGroup({
    identity: new FormGroup({ name: new FormControl('') }),
    network: new FormGroup({ subnet: new FormControl('') }),
  });
}

describe('ClrStepperPanel element context', () => {
  let fixture: ComponentFixture<TestComponent>;

  function panels(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('clr-stepper-panel'));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrStepperModule, ReactiveFormsModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('publishes each step status as state on the step itself', () => {
    // The status is otherwise announced as a transient live-region message beside the
    // step, and only for two of its states.
    expect(panels().map(panel => publishedOn(panel).status)).toEqual(['inactive', 'inactive']);
  });

  it('stops publishing once the panel is destroyed', () => {
    const panel = panels()[0];
    fixture.destroy();

    expect(CLR_ELEMENT_CONTEXT_PROPERTY in panel).toBe(false);
  });
});
