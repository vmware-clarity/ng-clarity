/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CLR_ELEMENT_CONTEXT_PROPERTY, ClrContextSnapshotOptions, ClrElementContextCallback } from '@clr/angular/utils';

import { ClrWizardModule } from './wizard.module';

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
    <clr-wizard [(clrWizardOpen)]="open">
      <clr-wizard-title>Provision</clr-wizard-title>
      <clr-wizard-page>
        <ng-template clrPageTitle>Identity</ng-template>
      </clr-wizard-page>
      <clr-wizard-page [clrWizardPageHasError]="true">
        <ng-template clrPageTitle>Networking</ng-template>
      </clr-wizard-page>
      <clr-wizard-page>
        <ng-template clrPageTitle>Review</ng-template>
      </clr-wizard-page>
    </clr-wizard>
  `,
  standalone: false,
})
class TestComponent {
  open = true;
}

describe('ClrWizard element context', () => {
  let fixture: ComponentFixture<TestComponent>;

  function wizard(): HTMLElement {
    return fixture.nativeElement.querySelector('clr-wizard');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrWizardModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('publishes how many steps there are and which one is current', () => {
    const state = publishedOn(wizard());

    expect(state.stepCount).toBe(3);
    expect(state.currentStepIndex).toBe(0);
  });

  it('publishes per-step completion and error, which live in CSS classes', () => {
    // The stepnav icon does carry a label for these, but it sits inside a button, and a
    // button is described as a leaf — so nothing reaches the icon.
    expect(publishedOn(wizard()).steps).toEqual([
      { index: 0, current: true, complete: false, error: false, navigable: true },
      { index: 1, current: false, complete: false, error: true, navigable: false },
      { index: 2, current: false, complete: false, error: false, navigable: false },
    ]);
  });

  it('publishes which steps can be navigated to, so an agent does not propose an unreachable one', () => {
    // A step is navigable once it, or the step before it, is complete — which no attribute
    // on the stepnav conveys.
    const steps = publishedOn(wizard()).steps as { navigable: boolean }[];

    expect(steps.map(step => step.navigable)).toEqual([true, false, false]);
  });

  it('stops publishing once the wizard is destroyed', () => {
    const host = wizard();
    fixture.destroy();

    expect(CLR_ELEMENT_CONTEXT_PROPERTY in host).toBe(false);
  });
});
