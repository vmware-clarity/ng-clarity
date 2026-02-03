/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
