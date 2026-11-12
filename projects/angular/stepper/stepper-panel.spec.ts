/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Injectable, Provider, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { delay } from '@clr/angular/testing';
import { ClrConditionalModule, IfExpandService } from '@clr/angular/utils';
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TemplateFormsTestComponent {
  @ViewChild(ClrStepperPanel) step: ClrStepperPanel;
}

@Component({
  template: `
    <form clrStepper [formGroup]="form">
      <clr-stepper-panel formGroupName="groupName">
        <clr-step-title>Step</clr-step-title>
        <clr-step-content *clrIfExpanded>step content</clr-step-content>
      </clr-stepper-panel>
    </form>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class ExpandableContentTestComponent {
  form = new FormGroup({ groupName: new FormGroup({}) });
}

@Component({
  template: `
    <form clrStepper [formGroup]="form">
      <clr-stepper-panel formGroupName="first">
        <clr-step-title>First</clr-step-title>
        <clr-step-content *clrIfExpanded>first step</clr-step-content>
      </clr-stepper-panel>
      <clr-stepper-panel formGroupName="second">
        <clr-step-title>Second</clr-step-title>
        <clr-step-content *clrIfExpanded>second step</clr-step-content>
      </clr-stepper-panel>
    </form>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class StepperTestComponent {
  form = new FormGroup({ first: new FormGroup({}), second: new FormGroup({}) });
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

      vi.spyOn(input, 'focus').mockImplementation(() => undefined);
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

describe('ClrStep animations', () => {
  let fixture: ComponentFixture<ExpandableContentTestComponent>;
  let stepperService: MockStepperService;

  function setup(animationsEnabled: boolean, providers: Provider[] = []) {
    TestBed.configureTestingModule({
      declarations: [ExpandableContentTestComponent],
      imports: [ReactiveFormsModule, ClrStepperModule, ClrConditionalModule],
      providers,
      animationsEnabled,
    });
    TestBed.overrideComponent(ClrStepper, {
      set: { providers: [{ provide: StepperService, useClass: MockStepperService }] },
    });
    fixture = TestBed.createComponent(ExpandableContentTestComponent);
    fixture.detectChanges();
    stepperService = fixture.debugElement
      .query(By.directive(ClrStepperPanel))
      .injector.get(StepperService) as MockStepperService;
  }

  afterEach(() => {
    fixture.destroy();
  });

  function content(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.clr-stepper-content');
  }

  async function openStep(open: boolean) {
    const step = new StepperPanelModel('groupName', 0);
    step.open = open;
    stepperService.step.next(step);
    fixture.detectChanges();
    await delay();
  }

  function finishAnimations() {
    content()
      ?.getAnimations()
      .forEach(animation => animation.finish());
  }

  it('expands the content when the step opens', async () => {
    setup(true);
    await openStep(true);

    const [animation] = content().getAnimations();
    expect((animation.effect as KeyframeEffect).getKeyframes()[0].height).toBe('0px');
  });

  it('collapses the content with its projected content, then removes them', async () => {
    setup(true);
    await openStep(true);
    finishAnimations();
    await openStep(false);

    expect(content().textContent).toContain('step content');
    const [animation] = content().getAnimations();
    expect((animation.effect as KeyframeEffect).getKeyframes()[1].height).toBe('0px');

    finishAnimations();
    await delay();
    fixture.detectChanges();
    expect(content()).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('step content');
  });

  it('keeps the projected content when the step opens again while it collapses', async () => {
    setup(true);
    await openStep(true);
    finishAnimations();
    await openStep(false);
    await openStep(true);

    finishAnimations();
    await delay();
    fixture.detectChanges();
    expect(content().textContent).toContain('step content');
  });

  it('removes the content and its projected content at once when animations are disabled', async () => {
    setup(false);
    await openStep(true);
    await openStep(false);

    expect(content()).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('step content');
  });

  it('does not animate the content with Noop animations', async () => {
    setup(true, [provideNoopAnimations()]);
    await openStep(true);

    expect(content().getAnimations().length).toBe(0);

    await openStep(false);

    expect(content()).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('step content');
  });

  it('does not close the projected content once the step is destroyed while it collapses', async () => {
    setup(true);
    await openStep(true);
    finishAnimations();
    await openStep(false);
    const ifExpandService = fixture.debugElement.query(By.directive(ClrStepperPanel)).injector.get(IfExpandService);
    const [animation] = content().getAnimations();

    fixture.destroy();
    animation.finish();
    await delay();

    expect(ifExpandService.expanded).toBe(true);
  });
});

describe('ClrStepper animations', () => {
  it('does not animate the first step opened by the stepper on the first render', async () => {
    TestBed.configureTestingModule({
      declarations: [StepperTestComponent],
      imports: [ReactiveFormsModule, ClrStepperModule, ClrConditionalModule],
      animationsEnabled: true,
    });
    const stepperFixture = TestBed.createComponent(StepperTestComponent);
    stepperFixture.detectChanges();
    await delay();
    stepperFixture.detectChanges();

    const stepContent: HTMLElement = stepperFixture.nativeElement.querySelector('.clr-stepper-content');
    expect(stepContent.textContent).toContain('first step');
    expect(stepContent.getAnimations().length).toBe(0);
    stepperFixture.destroy();
  });

  it('collapses the previous step while the next step expands', async () => {
    TestBed.configureTestingModule({
      declarations: [StepperTestComponent],
      imports: [ReactiveFormsModule, ClrStepperModule, ClrConditionalModule],
      animationsEnabled: true,
    });
    const stepperFixture = TestBed.createComponent(StepperTestComponent);
    stepperFixture.detectChanges();
    await delay();
    const stepperService = stepperFixture.debugElement.query(By.directive(ClrStepper)).injector.get(StepperService);

    stepperService.navigateToNextPanel('first');
    stepperFixture.detectChanges();
    await delay();

    const [first, second] = stepperFixture.nativeElement.querySelectorAll('.clr-stepper-content');
    expect(first.textContent).toContain('first step');
    expect((first.getAnimations()[0].effect as KeyframeEffect).getKeyframes()[1].height).toBe('0px');
    expect((second.getAnimations()[0].effect as KeyframeEffect).getKeyframes()[0].height).toBe('0px');

    first.getAnimations().forEach((animation: Animation) => animation.finish());
    await delay();
    stepperFixture.detectChanges();
    expect(stepperFixture.nativeElement.querySelectorAll('.clr-stepper-content').length).toBe(1);
    expect(stepperFixture.nativeElement.textContent).not.toContain('first step');
    stepperFixture.destroy();
  });
});
