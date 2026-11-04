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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IfExpandService } from '@clr/angular/utils';

import { StepperService } from './providers/stepper.service';
import { ClrStepper } from './stepper';
import { ClrStepperPanel } from './stepper-panel';
import { ClrStepperModule } from './stepper.module';

/**
 * OnPush component that renders the panel's expanded state straight from `IfExpandService`.
 * It never calls `markForCheck()`: it is only refreshed because the service state is a signal.
 */
@Component({
  selector: 'expanded-probe',
  template: `<span class="probe">{{ expand.expanded ? 'expanded' : 'collapsed' }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class ExpandedProbe {
  constructor(public expand: IfExpandService) {}
}

@Component({
  template: `
    <form clrStepper [formGroup]="form" [clrInitialStep]="initialStep()">
      <clr-stepper-panel formGroupName="step1">
        <clr-step-title>Step 1</clr-step-title>
        <clr-step-content>
          <expanded-probe></expanded-probe>
          <button clrStepButton="next">next</button>
        </clr-step-content>
      </clr-stepper-panel>
      <clr-stepper-panel formGroupName="step2">
        <clr-step-title>Step 2</clr-step-title>
        <clr-step-content>
          <expanded-probe></expanded-probe>
          <button clrStepButton="previous">previous</button>
          <button clrStepButton="next">next</button>
        </clr-step-content>
      </clr-stepper-panel>
      <clr-stepper-panel formGroupName="step3">
        <clr-step-title>Step 3</clr-step-title>
        <clr-step-content>
          <expanded-probe></expanded-probe>
          <button clrStepButton="submit">submit</button>
        </clr-step-content>
      </clr-stepper-panel>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class ZonelessStepperHost {
  readonly initialStep = signal('');
  readonly form = new FormGroup({
    step1: new FormGroup({ name: new FormControl('') }),
    step2: new FormGroup({ name: new FormControl('') }),
    step3: new FormGroup({ name: new FormControl('') }),
  });
}

describe('ClrStepper (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<ZonelessStepperHost>;

  function panelServices(): IfExpandService[] {
    return fixture.debugElement
      .queryAll(By.directive(ClrStepperPanel))
      .map(panel => panel.injector.get(IfExpandService));
  }

  function expandedHeaders(): string[] {
    return fixture.debugElement
      .queryAll(By.css('.clr-stepper-header-button'))
      .map(button => button.nativeElement.getAttribute('aria-expanded'));
  }

  function probeTexts(): string[] {
    return fixture.debugElement.queryAll(By.css('.probe')).map(probe => probe.nativeElement.textContent.trim());
  }

  function stepButton(text: string): HTMLButtonElement {
    return fixture.debugElement
      .queryAll(By.css('.clr-step-button'))
      .map(button => button.nativeElement as HTMLButtonElement)
      .find(button => button.textContent.trim() === text);
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ZonelessStepperHost, ExpandedProbe],
      imports: [ClrStepperModule, ReactiveFormsModule],
      providers: [provideZonelessChangeDetection(), provideCheckNoChangesConfig({ exhaustive: true })],
    });

    fixture = TestBed.createComponent(ZonelessStepperHost);
    await fixture.whenStable();
  });

  it('opens the first panel on first render', () => {
    expect(expandedHeaders()).toEqual(['true', 'false', 'false']);
    expect(panelServices().map(service => service.expanded)).toEqual([true, false, false]);
    expect(probeTexts()).toEqual(['expanded']);
  });

  it('updates the panels when a step button opens the next panel', async () => {
    stepButton('next').click();
    await fixture.whenStable();

    expect(expandedHeaders()).toEqual(['false', 'true', 'false']);
    expect(panelServices().map(service => service.expanded)).toEqual([false, true, false]);
    expect(probeTexts()).toEqual(['expanded']);

    stepButton('previous').click();
    await fixture.whenStable();

    expect(expandedHeaders()).toEqual(['true', 'false', 'false']);
    expect(panelServices().map(service => service.expanded)).toEqual([true, false, false]);
    expect(probeTexts()).toEqual(['expanded']);
  });

  it('updates the panels when the next panel is opened through the service', async () => {
    const stepperService = fixture.debugElement.query(By.directive(ClrStepper)).injector.get(StepperService);

    stepperService.navigateToNextPanel('step1');
    await fixture.whenStable();
    expect(expandedHeaders()).toEqual(['false', 'true', 'false']);

    stepperService.navigateToNextPanel('step2');
    await fixture.whenStable();
    expect(expandedHeaders()).toEqual(['false', 'false', 'true']);
    expect(panelServices().map(service => service.expanded)).toEqual([false, false, true]);
    expect(probeTexts()).toEqual(['expanded']);
  });

  it('updates the panels when the host changes the initial step through a signal after the first render', async () => {
    fixture.componentInstance.initialStep.set('step3');
    await fixture.whenStable();

    expect(expandedHeaders()).toEqual(['false', 'false', 'true']);
    expect(panelServices().map(service => service.expanded)).toEqual([false, false, true]);
    expect(probeTexts()).toEqual(['expanded']);
  });

  it('refreshes OnPush views reading IfExpandService when it is changed programmatically', async () => {
    panelServices()[0].expanded = false;
    await fixture.whenStable();
    expect(probeTexts()).toEqual(['collapsed']);

    panelServices()[0].expanded = true;
    await fixture.whenStable();
    expect(probeTexts()).toEqual(['expanded']);
  });
});
