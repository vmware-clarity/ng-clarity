/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Injectable, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { delay, enableCssAnimations, finishAnimations } from '@clr/angular/testing';
import { BehaviorSubject, Subject } from 'rxjs';

import { StepperPanelStatus } from './enums/stepper-panel-status.enum';
import { StepperPanelModel } from './models/stepper-panel.model';
import { StepperService } from './providers/stepper.service';
import { ClrStepper } from './stepper';
import { ClrStepperPanel } from './stepper-panel';
import { ClrStepperModule } from './stepper.module';

@Component({
  template: `
    <form clrStepper [formGroup]="form">
      <clr-stepper-panel formGroupName="groupName">test step</clr-stepper-panel>
    </form>
  `,
  standalone: false,
})
class ReactiveFormsTestComponent {
  @ViewChild(ClrStepperPanel) step: ClrStepperPanel;
  form = new FormGroup({ groupName: new FormGroup({}) });
}

@Component({
  template: `
    <form clrStepper #testForm="ngForm">
      <clr-stepper-panel ngModelGroup="groupName">test step</clr-stepper-panel>
    </form>
  `,
  standalone: false,
})
class TemplateFormsTestComponent {
  @ViewChild(ClrStepperPanel) step: ClrStepperPanel;
}

@Injectable()
class MockStepperService extends StepperService {
  step = new BehaviorSubject(new StepperPanelModel('groupName', 0));
  activeStep = new Subject<string>();

  getPanelChanges() {
    return this.step;
  }
}

describe('ClrStep Reactive Forms', () => {
  describe('View', () => {
    let fixture: ComponentFixture<ReactiveFormsTestComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ReactiveFormsTestComponent],
        providers: [{ provide: StepperService, useClass: MockStepperService }],
        imports: [ReactiveFormsModule, ClrStepperModule],
      });

      TestBed.overrideComponent(ClrStepper, {
        set: { providers: [{ provide: StepperService, useClass: MockStepperService }] },
      });

      fixture = TestBed.createComponent(ReactiveFormsTestComponent);
      fixture.detectChanges();
    });

    it('should use reactive forms to access form groups', () => {
      fixture.componentInstance.step.ngOnInit();
      expect(fixture.componentInstance.step.id).toBe('groupName');
    });

    it('adds a .clr-stepper-panel class on the host element', () => {
      const stepperPanelElement = fixture.debugElement.query(By.directive(ClrStepperPanel)).nativeElement;
      expect(stepperPanelElement.classList.contains('clr-stepper-panel')).toBe(true);
    });

    it('should show appropriate screen reader only status in button based on form state', () => {
      const mockStep = new StepperPanelModel('groupName', 0);
      const stepperService = fixture.debugElement.query(By.directive(ClrStepperPanel)).injector.get(StepperService);
      mockStep.status = StepperPanelStatus.Error;
      (stepperService as MockStepperService).step.next(mockStep);
      fixture.detectChanges();

      const statusMessage = fixture.nativeElement.querySelector('.clr-stepper-header .clr-sr-only');
      expect(statusMessage.innerText.trim()).toBe('Error in step 1');

      mockStep.status = StepperPanelStatus.Complete;
      (stepperService as MockStepperService).step.next(mockStep);
      fixture.detectChanges();

      expect(statusMessage.innerText.trim()).toBe(`Step 1 complete`);
    });

    it('should add aria-disabled attribute to the header button based on the appropriate step state', () => {
      const mockStep = new StepperPanelModel('groupName', 0);
      const stepperService = fixture.debugElement.query(By.directive(ClrStepperPanel)).injector.get(StepperService);

      mockStep.status = StepperPanelStatus.Error;
      mockStep.disabled = true;
      (stepperService as MockStepperService).step.next(mockStep);
      fixture.detectChanges();
      // use 'aria-disabled' instead of 'disabled' so screen reader users can be auto focused to next step and have title be readable
      expect(fixture.nativeElement.querySelector('.clr-stepper-header-button').getAttribute('aria-disabled')).toBe(
        'true'
      );
      expect(fixture.nativeElement.querySelector('.clr-stepper-header-button').getAttribute('disabled')).toBe(null);
    });

    it('should auto focus the step heading button when previous step next button was clicked', async () => {
      const stepperService = fixture.debugElement.query(By.directive(ClrStepperPanel)).injector.get(StepperService);
      const input = fixture.nativeElement.querySelector('.clr-stepper-header-button');

      spyOn(input, 'focus');
      expect(input.focus).not.toHaveBeenCalled();

      (stepperService as MockStepperService).activeStep.next('groupName');

      expect(input.focus).toHaveBeenCalled();
    });
  });
});

describe('ClrStep Template Forms', () => {
  describe('View', () => {
    let fixture: ComponentFixture<TemplateFormsTestComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TemplateFormsTestComponent],
        imports: [FormsModule, ClrStepperModule],
      });

      fixture = TestBed.createComponent(TemplateFormsTestComponent);
      fixture.detectChanges();
    });

    it('should use template forms to access form groups', () => {
      expect(fixture.componentInstance.step.id).toBe('groupName');
    });
  });
});

describe('ClrStep collapse animation', () => {
  let fixture: ComponentFixture<ReactiveFormsTestComponent>;
  let stepperService: MockStepperService;
  let restoreAnimations: () => void;

  beforeEach(() => {
    restoreAnimations = enableCssAnimations();
    TestBed.configureTestingModule({
      declarations: [ReactiveFormsTestComponent],
      providers: [{ provide: StepperService, useClass: MockStepperService }],
      imports: [ReactiveFormsModule, ClrStepperModule],
      animationsEnabled: true,
    });
    TestBed.overrideComponent(ClrStepper, {
      set: { providers: [{ provide: StepperService, useClass: MockStepperService }] },
    });

    fixture = TestBed.createComponent(ReactiveFormsTestComponent);
    fixture.detectChanges();
    stepperService = fixture.debugElement
      .query(By.directive(ClrStepperPanel))
      .injector.get(StepperService) as MockStepperService;
  });

  afterEach(() => {
    fixture.destroy();
    restoreAnimations();
  });

  function content(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.clr-stepper-content');
  }

  function emitStep(open: boolean) {
    const step = new StepperPanelModel('groupName', 0);
    step.open = open;
    stepperService.step.next(step);
    fixture.detectChanges();
  }

  it('keeps the content rendered while it collapses', async () => {
    emitStep(true);
    expect(content().classList).toContain('clr-collapsible-panel-expanding');
    finishAnimations(fixture.nativeElement);
    await delay();

    emitStep(false);

    expect(content()).not.toBeNull();
    expect(content().classList).toContain('clr-collapsible-panel-collapsing');
    expect(content().getAnimations().length).toBe(1);

    finishAnimations(fixture.nativeElement);
    await delay();

    expect(content()).toBeNull();
  });

  it('keeps the content when opened again while it collapses', async () => {
    emitStep(true);
    finishAnimations(fixture.nativeElement);
    await delay();

    emitStep(false);
    emitStep(true);
    finishAnimations(fixture.nativeElement);
    await delay();

    expect(content()).not.toBeNull();
    expect(content().classList).not.toContain('clr-collapsible-panel-collapsing');
  });
});
