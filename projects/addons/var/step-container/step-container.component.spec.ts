/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { ClrAlertModule } from '@clr/angular/emphasis/alert';
import { Observable, of } from 'rxjs';
import type { Mock } from 'vitest';

import { StepContainerComponent } from './step-container.component';
import { ActivationError } from '../error/interfaces';
import { OnStepActivate, OnStepValidate, StepModelHolder } from '../model/step-interfaces';
import { StepValidationState } from '../model/step-validation-state';
import { StepModel } from '../model/step.model';
import {
  ValidationBannerComponent,
  ValidationBannerInternalComponent,
} from './validation-banner/validation-banner.component';

type Spy<T extends (...args: any[]) => any = (...args: any[]) => any> = Mock<T>;

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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  let queryPageContent: () => DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrAlertModule, ThisTestModule],
      declarations: [StepContainerComponent, ValidationBannerComponent, ValidationBannerInternalComponent],
    });

    testContext.fixture = TestBed.createComponent(StepContainerComponent);
    testContext.component = testContext.fixture.componentInstance;
    testContext.component.step = {
      title: 'Mock Page Title',
      componentClass: MockPageComponent,
    };
    testContext.pageModel = new MockPageModel();
    testContext.description = 'description';
    queryPageContent = () => testContext.fixture.debugElement.query(By.css('mock-page-component div'));
  });

  afterEach(() => {
    const untypedContext: any = testContext;

    untypedContext.fixture.destroy();
  });

  describe('WHEN the component is rendered', () => {
    beforeEach(() => {
      testContext.component.step.componentClass = MockPageComponent;
      testContext.component.step.modelInstance = testContext.pageModel;
      testContext.component.description = testContext.description;
    });

    it('THEN the component is instantiated', () => {
      testContext.fixture.detectChanges();
      const element: any = queryPageContent();
      const descriptionElement: any = testContext.fixture.debugElement.query(By.css('div > span'));
      expect(element).toBeDefined();
      expect(element.nativeElement.innerText).toBe('Mock Page Content');
      expect(descriptionElement).toBeDefined();
      expect(descriptionElement.nativeElement.innerText).toBe('description');
    });

    it('THEN onActivate clears stepValidationState', () => {
      testContext.fixture.detectChanges();
      testContext.pageModel.validationState.errors = ['Error Message'];
      testContext.pageModel.validationState.warnings = ['Warning Message'];
      testContext.pageModel.validationState.infos = ['Info Message'];
      expect(testContext.pageModel.validationState.isValid()).toEqual(false);
      testContext.component.onActivate();
      expect(testContext.pageModel.validationState.errors).toEqual([]);
      expect(testContext.pageModel.validationState.warnings).toEqual([]);
      expect(testContext.pageModel.validationState.infos).toEqual([]);
      expect(testContext.pageModel.validationState.isValid()).toEqual(true);
    });

    describe('WHEN StepModel.readyToComplete = true', () => {
      beforeEach(() => {
        testContext.pageModel.readyToComplete = true;
      });

      it('THEN onActivate reaches the components activate() method', () => {
        testContext.fixture.detectChanges();

        expect(testContext.pageModel.activateCallsCount).toEqual(0);
        testContext.component.onActivate();
        expect(testContext.pageModel.activateCallsCount).toEqual(1);
      });

      it('THEN onCommit reaches the components validate() method', () => {
        testContext.fixture.detectChanges();

        expect(testContext.pageModel.validateCallsCount).toEqual(0);
        testContext.pageModel.validationResult = true;
        let onCommitResult = false;
        testContext.component.onCommit().subscribe(result => {
          onCommitResult = result;
        });
        expect(onCommitResult).toEqual(true);
        expect(testContext.pageModel.validateCallsCount).toEqual(1);
      });

      it('THEN WizardPage.readyToComplete should return true', () => {
        testContext.fixture.detectChanges();
        expect(testContext.component.readyToComplete).toEqual(true);
      });

      it('WHEN StepValidationState.errors is not empty, onCommit should return false', () => {
        testContext.fixture.detectChanges();
        expect(testContext.pageModel.validateCallsCount).toEqual(0);
        testContext.pageModel.validationResult = true;
        testContext.pageModel.validationState.errors = ['Error Message'];
        let onCommitResult = true;
        testContext.component.onCommit().subscribe(result => {
          onCommitResult = result;
        });
        expect(onCommitResult).toEqual(false);
        expect(testContext.pageModel.validateCallsCount).toEqual(1);
      });
    });

    describe('WHEN StepModel.readyToComplete = false', () => {
      beforeEach(() => {
        testContext.pageModel.readyToComplete = false;
      });

      it('THEN WizardPage.readyToComplete should return false', () => {
        testContext.fixture.detectChanges();
        expect(testContext.component.readyToComplete).toEqual(false);
      });

      it('WHEN StepValidationState.errors is empty, onCommit should return false', () => {
        testContext.fixture.detectChanges();
        expect(testContext.pageModel.validateCallsCount).toEqual(0);
        testContext.pageModel.validationResult = true;
        let onCommitResult = true;
        testContext.component.onCommit().subscribe(result => {
          onCommitResult = result;
        });
        expect(onCommitResult).toEqual(false);
        expect(testContext.pageModel.validateCallsCount).toEqual(1);
      });

      it('THEN onActivate should reset readyToComplete to true', () => {
        testContext.fixture.detectChanges();
        expect(testContext.component.readyToComplete).toEqual(false);
        testContext.component.onActivate();
        expect(testContext.component.readyToComplete).toEqual(true);
      });
    });
  });

  describe('WHEN instantiateLazy=true', () => {
    beforeEach(() => {
      testContext.component.step.instantiateLazy = true;
      testContext.component.step.componentClass = MockPageComponent;
      testContext.component.step.modelInstance = testContext.pageModel;
    });

    it('THEN the page component is instantiated when activate() method is invoked', () => {
      // Upon creation, MockPageComponent should not be instantiated.
      testContext.fixture.detectChanges();
      let element: any = queryPageContent();
      expect(element).toBeNull();

      // After onActivate() the component should be created.
      testContext.component.onActivate();

      testContext.fixture.detectChanges();
      element = queryPageContent();
      expect(element).toBeDefined();
      expect(testContext.pageModel.activateCallsCount).toEqual(1);
    });
  });

  describe('WHEN recreateComponent=true', () => {
    beforeEach(() => {
      testContext.component.step.recreateComponent = () => true;
      testContext.component.step.componentClass = MockPageComponent;
      testContext.component.step.modelInstance = testContext.pageModel;
    });

    it('THEN the page component is re-instantiated when activate() method is invoked with changes', () => {
      testContext.fixture.detectChanges();
      const element: any = queryPageContent();
      expect(element).toBeDefined();
      expect(element.nativeElement.innerText).toBe('Mock Page Content');
      expect(testContext.component['pageComponent'].componentProperty).toEqual('defaultcomponentPropertyValue');
      expect(testContext.pageModel.activateCallsCount).toEqual(0);
      testContext.component['pageComponent'].componentProperty = 'modifiedcomponentPropertyValue';
      // After onActivate() the component should re-created.
      testContext.component.onActivate(
        undefined,
        {
          propName: { propertyName: 'propName', oldValue: 'x', newValue: 'y' },
        },
        true
      );
      expect(testContext.pageModel.activateCallsCount).toEqual(1);
      expect(testContext.component['pageComponent'].componentProperty).toEqual('defaultcomponentPropertyValue');
    });

    describe('WHEN instantiateLazy=true', () => {
      beforeEach(() => {
        testContext.component.step.instantiateLazy = true;
      });
      it(`THEN the page component is instantiated when activate() method is invoked
               and re-instantiated again with activate()`, () => {
        // Upon creation, MockPageComponent should not be instantiated.
        testContext.fixture.detectChanges();
        let element: any = queryPageContent();
        expect(element).toBeNull();

        // After onActivate() the component should be created.
        testContext.component.onActivate();

        testContext.fixture.detectChanges();
        element = queryPageContent();
        expect(element).toBeDefined();
        expect(testContext.pageModel.activateCallsCount).toEqual(1);
        expect(testContext.component['pageComponent'].componentProperty).toEqual('defaultcomponentPropertyValue');
        testContext.component['pageComponent'].componentProperty = 'modifiedcomponentPropertyValue';
        // After onActivate() the component should be re-created.
        testContext.component.onActivate(undefined, {}, true);
        expect(testContext.pageModel.activateCallsCount).toEqual(2);
        expect(testContext.component['pageComponent'].componentProperty).toEqual('defaultcomponentPropertyValue');
      });
    });
  });

  describe('WHEN validation state changed', () => {
    let queryAlert: () => DebugElement;
    let queryAlertItemText: () => DebugElement;

    beforeEach(() => {
      testContext.component.step.componentClass = MockPageComponent;
      testContext.component.step.modelInstance = testContext.pageModel;
      queryAlert = () => testContext.fixture.debugElement.query(By.css('clr-alert-item'));
      queryAlertItemText = () => testContext.fixture.debugElement.query(By.css('clr-alert-item > span.alert-text'));
    });

    it('THEN the page should display errors when error message is set.', () => {
      testContext.fixture.detectChanges();
      let element: any = queryAlert();
      expect(element).toBeNull();

      testContext.pageModel.validationState.errors = ['Error from page'];

      testContext.fixture.detectChanges();
      element = queryAlertItemText();
      expect(element).toBeDefined();
      expect(element.nativeElement.innerText).toBe('Error from page');

      testContext.pageModel.validationState.errors = [];
      testContext.fixture.detectChanges();
      element = queryAlert();
      expect(element).toBeNull();
    });

    it('THEN the page should display warnings when warning message is set.', () => {
      testContext.fixture.detectChanges();
      let element: any = queryAlert();
      expect(element).toBeNull();

      testContext.pageModel.validationState.warnings = ['Warning from page'];

      testContext.fixture.detectChanges();
      element = queryAlertItemText();
      expect(element).toBeDefined();
      expect(element.nativeElement.innerText).toBe('Warning from page');

      testContext.pageModel.validationState.warnings = [];
      testContext.fixture.detectChanges();
      element = queryAlert();
      expect(element).toBeNull();
    });

    it('THEN the page should display infos when info message is set.', () => {
      testContext.fixture.detectChanges();
      let element: any = queryAlert();
      expect(element).toBeNull();

      testContext.pageModel.validationState.infos = ['Info from page'];

      testContext.fixture.detectChanges();
      element = queryAlertItemText();
      expect(element).toBeDefined();
      expect(element.nativeElement.innerText).toBe('Info from page');

      testContext.pageModel.validationState.infos = [];
      testContext.fixture.detectChanges();
      element = queryAlert();
      expect(element).toBeNull();
    });

    it('THEN the page should not render validation banner when messages are empty.', () => {
      testContext.pageModel.validationState = new StepValidationState();
      vi.spyOn(testContext.pageModel.validationState, 'isEmpty').mockReturnValue(true);
      testContext.fixture.detectChanges();

      const validationBanner = testContext.fixture.debugElement.query(
        By.directive(ValidationBannerComponent)
      )?.componentInstance;
      expect(validationBanner).toBeUndefined();
    });

    it('THEN the page should render validation banner when messages are not empty.', () => {
      testContext.pageModel.validationState = new StepValidationState();
      vi.spyOn(testContext.pageModel.validationState, 'isEmpty').mockReturnValue(false);
      testContext.fixture.detectChanges();

      const validationBanner = testContext.fixture.debugElement.query(
        By.directive(ValidationBannerComponent)
      ).componentInstance;
      expect(validationBanner).toBeDefined();
    });
  });

  describe('WHEN onActivate called with Error', () => {
    beforeEach(() => {
      testContext.component.step.componentClass = MockPageComponent;
      testContext.component.step.modelInstance = testContext.pageModel;
      testContext.fixture.detectChanges();
      const error: ActivationError = {
        data: {
          message: 'error message',
          stackTrace: 'stack trace',
        },
      };
      testContext.component.onActivate(error);
      testContext.fixture.detectChanges();
    });
    it('THEN error component should be rendered', () => {
      const errorComponent = testContext.fixture.debugElement.query(By.css('appfx-error'));
      expect(errorComponent).toBeTruthy();
    });

    describe('WHEN retry button clicked', () => {
      beforeEach(() => {
        vi.spyOn(testContext.component.onRetry, 'emit');
      });

      it('should emit onRetry event', () => {
        const retryButton = testContext.fixture.debugElement.query(By.css('appfx-error button')).nativeElement;
        expect(retryButton).toBeTruthy();
        retryButton.click();
        expect(testContext.component.onRetry.emit).toHaveBeenCalled();
      });
    });
  });
});
