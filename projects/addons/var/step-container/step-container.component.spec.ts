/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { ClrAlertModule } from '@clr/angular/emphasis/alert';
import { Observable, of } from 'rxjs';

import { StepContainerComponent } from './step-container.component';
import { ActivationError } from '../error/interfaces';
import { OnStepActivate, OnStepValidate, StepModelHolder } from '../model/step-interfaces';
import { StepValidationState } from '../model/step-validation-state';
import { StepModel } from '../model/step.model';
import {
  ValidationBannerComponent,
  ValidationBannerInternalComponent,
} from './validation-banner/validation-banner.component';

import Spy = jasmine.Spy;

class MockPageModel implements StepModel {
  loading = false;
  activateCallsCount = 0;
  validateCallsCount = 0;
  validationState: StepValidationState = new StepValidationState();
  validationResult = true;
  readyToComplete = true;
}

@Component({
  selector: 'mock-page-component',
  template: `<div>Mock Page Content</div>`,
})
class MockPageComponent implements OnStepActivate, OnStepValidate, StepModelHolder {
  componentProperty = 'defaultcomponentPropertyValue';
  model: MockPageModel;

  activate() {
    this.model.activateCallsCount += 1;
  }

  validate(): Observable<boolean> {
    this.model.validateCallsCount += 1;
    return of(this.model.validationResult);
  }
}

@NgModule({
  imports: [CommonModule, MockPageComponent],
  providers: [WorkflowStrings],
})
class ThisTestModule {}

interface ThisTest {
  fixture: ComponentFixture<StepContainerComponent>;
  component: StepContainerComponent;
  loadComponent: Spy;
  pageModel: MockPageModel;
  description: string;
}

describe('wizard-page-container.component.spec', () => {
  let queryPageContent: () => DebugElement;

  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      imports: [ClrAlertModule, NoopAnimationsModule, ThisTestModule],
      declarations: [StepContainerComponent, ValidationBannerComponent, ValidationBannerInternalComponent],
    });

    this.fixture = TestBed.createComponent(StepContainerComponent);
    this.component = this.fixture.componentInstance;
    this.component.step = {
      title: 'Mock Page Title',
      componentClass: MockPageComponent,
    };
    this.pageModel = new MockPageModel();
    this.description = 'description';
    queryPageContent = () => this.fixture.debugElement.query(By.css('mock-page-component div'));
  });

  afterEach(function (this: any) {
    this.fixture.destroy();
  });

  describe('WHEN the component is rendered', () => {
    beforeEach(function (this: ThisTest) {
      this.component.step.componentClass = MockPageComponent;
      this.component.step.modelInstance = this.pageModel;
      this.component.description = this.description;
    });

    it('THEN the component is instantiated', function (this: ThisTest) {
      this.fixture.detectChanges();
      const element: any = queryPageContent();
      const descriptionElement: any = this.fixture.debugElement.query(By.css('div > span'));
      expect(element).toBeDefined();
      expect(element.nativeElement.innerText).toBe('Mock Page Content');
      expect(descriptionElement).toBeDefined();
      expect(descriptionElement.nativeElement.innerText).toBe('description');
    });

    it('THEN onActivate clears stepValidationState', function (this: ThisTest) {
      this.fixture.detectChanges();
      this.pageModel.validationState.errors = ['Error Message'];
      this.pageModel.validationState.warnings = ['Warning Message'];
      this.pageModel.validationState.infos = ['Info Message'];
      expect(this.pageModel.validationState.isValid()).toEqual(false);
      this.component.onActivate();
      expect(this.pageModel.validationState.errors).toEqual([]);
      expect(this.pageModel.validationState.warnings).toEqual([]);
      expect(this.pageModel.validationState.infos).toEqual([]);
      expect(this.pageModel.validationState.isValid()).toEqual(true);
    });

    describe('WHEN StepModel.readyToComplete = true', () => {
      beforeEach(function (this: ThisTest) {
        this.pageModel.readyToComplete = true;
      });

      it('THEN onActivate reaches the components activate() method', function (this: ThisTest) {
        this.fixture.detectChanges();

        expect(this.pageModel.activateCallsCount).toEqual(0);
        this.component.onActivate();
        expect(this.pageModel.activateCallsCount).toEqual(1);
      });

      it('THEN onCommit reaches the components validate() method', function (this: ThisTest) {
        this.fixture.detectChanges();

        expect(this.pageModel.validateCallsCount).toEqual(0);
        this.pageModel.validationResult = true;
        let onCommitResult = false;
        this.component.onCommit().subscribe(result => {
          onCommitResult = result;
        });
        expect(onCommitResult).toEqual(true);
        expect(this.pageModel.validateCallsCount).toEqual(1);
      });

      it('THEN WizardPage.readyToComplete should return true', function (this: ThisTest) {
        this.fixture.detectChanges();
        expect(this.component.readyToComplete).toEqual(true);
      });

      it('WHEN StepValidationState.errors is not empty, onCommit should return false', function (this: ThisTest) {
        this.fixture.detectChanges();
        expect(this.pageModel.validateCallsCount).toEqual(0);
        this.pageModel.validationResult = true;
        this.pageModel.validationState.errors = ['Error Message'];
        let onCommitResult = true;
        this.component.onCommit().subscribe(result => {
          onCommitResult = result;
        });
        expect(onCommitResult).toEqual(false);
        expect(this.pageModel.validateCallsCount).toEqual(1);
      });
    });

    describe('WHEN StepModel.readyToComplete = false', () => {
      beforeEach(function (this: ThisTest) {
        this.pageModel.readyToComplete = false;
      });

      it('THEN WizardPage.readyToComplete should return false', function (this: ThisTest) {
        this.fixture.detectChanges();
        expect(this.component.readyToComplete).toEqual(false);
      });

      it('WHEN StepValidationState.errors is empty, onCommit should return false', function (this: ThisTest) {
        this.fixture.detectChanges();
        expect(this.pageModel.validateCallsCount).toEqual(0);
        this.pageModel.validationResult = true;
        let onCommitResult = true;
        this.component.onCommit().subscribe(result => {
          onCommitResult = result;
        });
        expect(onCommitResult).toEqual(false);
        expect(this.pageModel.validateCallsCount).toEqual(1);
      });

      it('THEN onActivate should reset readyToComplete to true', function (this: ThisTest) {
        this.fixture.detectChanges();
        expect(this.component.readyToComplete).toEqual(false);
        this.component.onActivate();
        expect(this.component.readyToComplete).toEqual(true);
      });
    });
  });

  describe('WHEN instantiateLazy=true', () => {
    beforeEach(function (this: ThisTest) {
      this.component.step.instantiateLazy = true;
      this.component.step.componentClass = MockPageComponent;
      this.component.step.modelInstance = this.pageModel;
    });

    it('THEN the page component is instantiated when activate() method is invoked', function (this: ThisTest) {
      // Upon creation, MockPageComponent should not be instantiated.
      this.fixture.detectChanges();
      let element: any = queryPageContent();
      expect(element).toBeNull();

      // After onActivate() the component should be created.
      this.component.onActivate();

      this.fixture.detectChanges();
      element = queryPageContent();
      expect(element).toBeDefined();
      expect(this.pageModel.activateCallsCount).toEqual(1);
    });
  });

  describe('WHEN recreateComponent=true', () => {
    beforeEach(function (this: ThisTest) {
      this.component.step.recreateComponent = () => true;
      this.component.step.componentClass = MockPageComponent;
      this.component.step.modelInstance = this.pageModel;
    });

    it('THEN the page component is re-instantiated when activate() method is invoked with changes', function (this: ThisTest) {
      this.fixture.detectChanges();
      const element: any = queryPageContent();
      expect(element).toBeDefined();
      expect(element.nativeElement.innerText).toBe('Mock Page Content');
      expect(this.component['pageComponent'].componentProperty).toEqual('defaultcomponentPropertyValue');
      expect(this.pageModel.activateCallsCount).toEqual(0);
      this.component['pageComponent'].componentProperty = 'modifiedcomponentPropertyValue';
      // After onActivate() the component should re-created.
      this.component.onActivate(
        undefined,
        {
          propName: { propertyName: 'propName', oldValue: 'x', newValue: 'y' },
        },
        true
      );
      expect(this.pageModel.activateCallsCount).toEqual(1);
      expect(this.component['pageComponent'].componentProperty).toEqual('defaultcomponentPropertyValue');
    });

    describe('WHEN instantiateLazy=true', () => {
      beforeEach(function (this: ThisTest) {
        this.component.step.instantiateLazy = true;
      });
      it(`THEN the page component is instantiated when activate() method is invoked
               and re-instantiated again with activate()`, function (this: ThisTest) {
        // Upon creation, MockPageComponent should not be instantiated.
        this.fixture.detectChanges();
        let element: any = queryPageContent();
        expect(element).toBeNull();

        // After onActivate() the component should be created.
        this.component.onActivate();

        this.fixture.detectChanges();
        element = queryPageContent();
        expect(element).toBeDefined();
        expect(this.pageModel.activateCallsCount).toEqual(1);
        expect(this.component['pageComponent'].componentProperty).toEqual('defaultcomponentPropertyValue');
        this.component['pageComponent'].componentProperty = 'modifiedcomponentPropertyValue';
        // After onActivate() the component should be re-created.
        this.component.onActivate(undefined, {}, true);
        expect(this.pageModel.activateCallsCount).toEqual(2);
        expect(this.component['pageComponent'].componentProperty).toEqual('defaultcomponentPropertyValue');
      });
    });
  });

  describe('WHEN validation state changed', () => {
    let queryAlert: () => DebugElement;
    let queryAlertItemText: () => DebugElement;

    beforeEach(function (this: ThisTest) {
      this.component.step.componentClass = MockPageComponent;
      this.component.step.modelInstance = this.pageModel;
      queryAlert = () => this.fixture.debugElement.query(By.css('clr-alert-item'));
      queryAlertItemText = () => this.fixture.debugElement.query(By.css('clr-alert-item > span.alert-text'));
    });

    it('THEN the page should display errors when error message is set.', function (this: ThisTest) {
      this.fixture.detectChanges();
      let element: any = queryAlert();
      expect(element).toBeNull();

      this.pageModel.validationState.errors = ['Error from page'];

      this.fixture.detectChanges();
      element = queryAlertItemText();
      expect(element).toBeDefined();
      expect(element.nativeElement.innerText).toBe('Error from page');

      this.pageModel.validationState.errors = [];
      this.fixture.detectChanges();
      element = queryAlert();
      expect(element).toBeNull();
    });

    it('THEN the page should display warnings when warning message is set.', function (this: ThisTest) {
      this.fixture.detectChanges();
      let element: any = queryAlert();
      expect(element).toBeNull();

      this.pageModel.validationState.warnings = ['Warning from page'];

      this.fixture.detectChanges();
      element = queryAlertItemText();
      expect(element).toBeDefined();
      expect(element.nativeElement.innerText).toBe('Warning from page');

      this.pageModel.validationState.warnings = [];
      this.fixture.detectChanges();
      element = queryAlert();
      expect(element).toBeNull();
    });

    it('THEN the page should display infos when info message is set.', function (this: ThisTest) {
      this.fixture.detectChanges();
      let element: any = queryAlert();
      expect(element).toBeNull();

      this.pageModel.validationState.infos = ['Info from page'];

      this.fixture.detectChanges();
      element = queryAlertItemText();
      expect(element).toBeDefined();
      expect(element.nativeElement.innerText).toBe('Info from page');

      this.pageModel.validationState.infos = [];
      this.fixture.detectChanges();
      element = queryAlert();
      expect(element).toBeNull();
    });

    it('THEN the page should not render validation banner when messages are empty.', function (this: ThisTest) {
      this.pageModel.validationState = new StepValidationState();
      spyOn(this.pageModel.validationState, 'isEmpty').and.returnValue(true);
      this.fixture.detectChanges();

      const validationBanner = this.fixture.debugElement.query(
        By.directive(ValidationBannerComponent)
      )?.componentInstance;
      expect(validationBanner).toBeUndefined();
    });

    it('THEN the page should render validation banner when messages are not empty.', function (this: ThisTest) {
      this.pageModel.validationState = new StepValidationState();
      spyOn(this.pageModel.validationState, 'isEmpty').and.returnValue(false);
      this.fixture.detectChanges();

      const validationBanner = this.fixture.debugElement.query(
        By.directive(ValidationBannerComponent)
      ).componentInstance;
      expect(validationBanner).toBeDefined();
    });
  });

  describe('WHEN onActivate called with Error', () => {
    beforeEach(function (this: ThisTest) {
      this.component.step.componentClass = MockPageComponent;
      this.component.step.modelInstance = this.pageModel;
      this.fixture.detectChanges();
      const error: ActivationError = {
        data: {
          message: 'error message',
          stackTrace: 'stack trace',
        },
      };
      this.component.onActivate(error);
      this.fixture.detectChanges();
    });
    it('THEN error component should be rendered', function (this: ThisTest) {
      const errorComponent = this.fixture.debugElement.query(By.css('appfx-error'));
      expect(errorComponent).toBeTruthy();
    });

    describe('WHEN retry button clicked', () => {
      beforeEach(function (this: ThisTest) {
        spyOn(this.component.onRetry, 'emit').and.callThrough();
      });

      it('should emit onRetry event', function (this: ThisTest) {
        const retryButton = this.fixture.debugElement.query(By.css('appfx-error button')).nativeElement;
        expect(retryButton).toBeTruthy();
        retryButton.click();
        expect(this.component.onRetry.emit).toHaveBeenCalled();
      });
    });
  });
});
