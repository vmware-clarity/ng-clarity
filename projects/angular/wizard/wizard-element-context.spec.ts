/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { publishedOn, publishedState } from '@clr/angular/testing';
import { CLR_ELEMENT_CONTEXT_PROPERTY } from '@clr/angular/utils';

import { ClrWizardModule } from './wizard.module';

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
    const state = publishedState(wizard());

    expect(state.stepCount).toBe(3);
    expect(state.currentStepIndex).toBe(0);
  });

  it('publishes per-step completion and error, which live in CSS classes', () => {
    // The stepnav icon does carry a label for these, but it sits inside a button, and a
    // button is described as a leaf — so nothing reaches the icon.
    expect(publishedState(wizard()).steps).toEqual([
      { index: 0, current: true, complete: false, error: false, navigable: true },
      { index: 1, current: false, complete: false, error: true, navigable: false },
      { index: 2, current: false, complete: false, error: false, navigable: false },
    ]);
  });

  it('publishes which steps can be navigated to, so an agent does not propose an unreachable one', () => {
    // A step is navigable once it, or the step before it, is complete — which no attribute
    // on the stepnav conveys.
    const steps = publishedState(wizard()).steps as { navigable: boolean }[];

    expect(steps.map(step => step.navigable)).toEqual([true, false, false]);
  });

  it('publishes nothing while the wizard is closed, which is not on the page', () => {
    fixture.componentInstance.open = false;
    fixture.detectChanges();

    expect(publishedOn(wizard())).toBeNull();
  });

  it('stops publishing once the wizard is destroyed', () => {
    const host = wizard();
    fixture.destroy();

    expect(CLR_ELEMENT_CONTEXT_PROPERTY in host).toBe(false);
  });
});
