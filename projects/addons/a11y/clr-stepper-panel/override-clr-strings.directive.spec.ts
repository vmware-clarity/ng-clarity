/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClrCommonStringsService, ClrStepperModule, ClrStepperPanel } from '@clr/angular';
import { ClrCommonStrings } from '@clr/angular/utils/i18n/common-strings.interface';

import { AppfxA11yModule } from '../a11y.module';

const successText = 'Step {STEP} complete';
const dangerText = 'Error in step {STEP}';

@Component({
  imports: [AppfxA11yModule, ClrStepperModule, FormsModule, ReactiveFormsModule],
  template: `
    <form clrStepper [formGroup]="form">
      <clr-stepper-panel formGroupName="step0" [appfxOverrideClrStrings]="stepPanelOverriddenStrings">
        <clr-step-title>Test title</clr-step-title>
        <clr-step-content>Step content goes here</clr-step-content>
      </clr-stepper-panel>
    </form>
  `,
  standalone: true,
})
export class TestClrStepperComponent {
  readonly form: UntypedFormGroup;
  readonly stepPanelOverriddenStrings: Partial<ClrCommonStrings>;

  @ViewChildren(ClrStepperPanel) stepperPanels: QueryList<ClrStepperPanel>;

  constructor(private readonly formBuilder: UntypedFormBuilder) {
    this.form = formBuilder.group({
      step0: formBuilder.group({}),
    });

    this.stepPanelOverriddenStrings = {
      success: successText,
      danger: dangerText,
    };
  }
}

interface ThisTest {
  fixture: ComponentFixture<TestClrStepperComponent>;
  component: TestClrStepperComponent;
  clrStringsService: ClrCommonStringsService;
}

function createThisTest(): ThisTest {
  TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule, AppfxA11yModule, NoopAnimationsModule, TestClrStepperComponent],
  });

  const fixture = TestBed.createComponent(TestClrStepperComponent);
  fixture.detectChanges();

  return {
    fixture: fixture,
    component: fixture.componentInstance,
    clrStringsService: TestBed.inject(ClrCommonStringsService),
  };
}

describe('OverrideClrStringsDirective', () => {
  afterEach(function (this: ThisTest) {
    if (this.fixture) {
      this.fixture.destroy();
    }
  });

  it('ClrStepperPanel.commonStrings has correct values', fakeAsync(function (this: ThisTest) {
    Object.assign(this, createThisTest());

    const panel: ClrStepperPanel | undefined = this.component.stepperPanels.get(0);
    expect(panel?.commonStrings.keys.stepComplete).toEqual(successText);
    expect(panel?.commonStrings.keys.stepError).toEqual(dangerText);

    // Verify that original strings in ClrCommonStringsService are not modified.
    expect(this.clrStringsService.keys.success).not.toBe(successText);
    expect(this.clrStringsService.keys.danger).not.toBe(dangerText);
  }));
});
