/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Injectable, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { StepperService } from './providers/stepper.service';
import { ClrStepButton, ClrStepButtonType } from './step-button';
import { ClrStepperModule } from './stepper.module';

@Component({
  template: `
    <form clrStepper [formGroup]="form">
      <clr-stepper-panel formGroupName="group">
        <button [clrStepButton]="buttonType">Next</button>
      </clr-stepper-panel>
    </form>
  `,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrStepButton) button: ClrStepButton;
  buttonType = ClrStepButtonType.Next;
  form = new FormGroup({ group: new FormGroup({}) });
}

@Component({
  template: `
    <form clrStepper [formGroup]="form">
      <clr-stepper-panel formGroupName="group">
        <button [clrStepButton]="buttonType">Previous</button>
      </clr-stepper-panel>
    </form>
  `,
  standalone: false,
})
class TestPreviousButtonComponent {
  @ViewChild(ClrStepButton) button: ClrStepButton;
  buttonType = ClrStepButtonType.Previous;
  form = new FormGroup({ group: new FormGroup({}) });
}

@Injectable()
class MockStepperService extends StepperService {
  navigateToNextPanel() {
    // Do nothing.
  }
  navigateToPreviousPanel(currentPanelId: string) {
    super.navigateToPreviousPanel(currentPanelId);
  }
}

describe('ClrStepButton Next', () => {
  let fixture: ComponentFixture<any>;
  let testComponent: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      providers: [StepperService, { provide: StepperService, useClass: MockStepperService }],
      imports: [ReactiveFormsModule, NoopAnimationsModule, ClrStepperModule],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
  });

  it('should update ClrStepButton type', () => {
    expect(testComponent.button.type).toBe(ClrStepButtonType.Next);
    testComponent.buttonType = ClrStepButtonType.Submit;
    fixture.detectChanges();
    expect(testComponent.button.type).toBe(ClrStepButtonType.Submit);
  });

  it('should trigger click that sets the next step', () => {
    const stepperService = fixture.debugElement.query(By.directive(ClrStepButton)).injector.get(StepperService);
    spyOn(stepperService, 'navigateToNextPanel');

    fixture.nativeElement.querySelector('.clr-step-button').click();
    fixture.detectChanges();
    expect(stepperService.navigateToNextPanel).toHaveBeenCalled();
  });

  it('should have type="button" attribute set on the host element', () => {
    const btn = fixture.debugElement.query(By.directive(ClrStepButton));
    expect(btn.nativeElement.getAttribute('type')).toBe('button');
  });

  it('should prevent default on click to avoid form submission', () => {
    const btn = fixture.debugElement.query(By.directive(ClrStepButton));
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefaultSpy = spyOn(event, 'preventDefault');
    btn.nativeElement.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});

describe('ClrStepButton Custom type', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      providers: [StepperService, { provide: StepperService, useClass: MockStepperService }],
      imports: [ReactiveFormsModule, NoopAnimationsModule, ClrStepperModule],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.buttonType = 'custom' as ClrStepButtonType;
    fixture.detectChanges();
  });

  it('should not navigate when button type is not next, previous, or submit', () => {
    const stepperService = fixture.debugElement.query(By.directive(ClrStepButton)).injector.get(StepperService);
    spyOn(stepperService, 'navigateToNextPanel');
    spyOn(stepperService, 'navigateToPreviousPanel');

    fixture.nativeElement.querySelector('.clr-step-button').click();
    fixture.detectChanges();

    expect(stepperService.navigateToNextPanel).not.toHaveBeenCalled();
    expect(stepperService.navigateToPreviousPanel).not.toHaveBeenCalled();
  });
});

describe('ClrStepButton Previous', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestPreviousButtonComponent],
      providers: [StepperService, { provide: StepperService, useClass: MockStepperService }],
      imports: [ReactiveFormsModule, NoopAnimationsModule, ClrStepperModule],
    });

    fixture = TestBed.createComponent(TestPreviousButtonComponent);
    fixture.detectChanges();
  });

  it('should trigger click that sets the previous step', () => {
    const stepperService = fixture.debugElement.query(By.directive(ClrStepButton)).injector.get(StepperService);
    spyOn(stepperService, 'navigateToPreviousPanel');

    fixture.nativeElement.querySelector('.clr-step-button').click();
    fixture.detectChanges();
    expect(stepperService.navigateToPreviousPanel).toHaveBeenCalled();
  });
});
