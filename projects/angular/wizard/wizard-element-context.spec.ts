/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClrContextEngineService } from '@clr/angular/ai';
import { publishedOn, publishedState } from '@clr/angular/testing';
import { CLR_ELEMENT_CONTEXT_PROPERTY, ClrComponentContext } from '@clr/angular/utils';

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

@Component({
  template: `
    <clr-wizard [clrWizardOpen]="open">
      <clr-wizard-title>Provision</clr-wizard-title>
      <clr-wizard-page></clr-wizard-page>
    </clr-wizard>
  `,
  standalone: false,
})
class UntitledTestComponent {
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
      declarations: [TestComponent, UntitledTestComponent],
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
      { index: 0, title: 'Identity', current: true, complete: false, error: false, navigable: true },
      { index: 1, title: 'Networking', current: false, complete: false, error: true, navigable: false },
      { index: 2, title: 'Review', current: false, complete: false, error: false, navigable: false },
    ]);
  });

  it('publishes each step with the title its stepnav item shows', () => {
    // A snapshot that leaves out the stepnav, as the minimal preset does, still says
    // which step is which.
    const steps = publishedState(wizard()).steps as { title: string }[];

    expect(steps.map(step => step.title)).toEqual(['Identity', 'Networking', 'Review']);
  });

  it('publishes a step without a title when its stepnav item shows none', () => {
    fixture.destroy();
    fixture = TestBed.createComponent(UntitledTestComponent);
    fixture.detectChanges();

    const steps = publishedState(wizard()).steps as Record<string, unknown>[];
    expect(steps.length).toBe(1);
    expect('title' in steps[0]).toBe(false);
  });

  // A modal-focused walk starts at clr-wizard, the custom element around the open dialog,
  // so the state the wizard publishes on its host reaches the snapshot.
  it('puts the published steps on the dialog node of a modal-focused snapshot', () => {
    const snapshot = TestBed.inject(ClrContextEngineService).getSnapshot({ focus: 'modal' });
    expect(snapshot.focus).toBe('modal');

    const dialogs: ClrComponentContext[] = [];
    const visit = (nodes: ClrComponentContext[] | undefined) =>
      nodes?.forEach(node => {
        if (node.type === 'dialog') {
          dialogs.push(node);
        }
        visit(node.children);
      });
    visit(snapshot.components);

    expect(dialogs.length).toBe(1);
    expect(dialogs[0].state?.['stepCount']).toBe(3);
    expect(dialogs[0].state?.['currentStepIndex']).toBe(0);
    expect((dialogs[0].state?.['steps'] as { title: string }[]).map(step => step.title)).toEqual([
      'Identity',
      'Networking',
      'Review',
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
