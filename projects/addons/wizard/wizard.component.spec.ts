/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { InteractivityChecker } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DebugElement, Input, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { PropertyViewSectionBuilder, PropertyViewSectionModel } from '@clr/addons/property-view';
import {
  MockPropertyViewComponent,
  MockWorkflowConfigurationService,
  WizardHelper,
  ZoomLevelServiceMock,
} from '@clr/addons/testing';
import {
  CancelableStepValidation,
  In,
  Mappings,
  ModelChange,
  ModelChanges,
  Out,
  Spinner,
  Step,
  StepComponent,
  StepContainer,
  StepInternal,
  StepModel,
  StepModelHolder,
  StepValidationState,
  ValidationBanner,
  ValidationBannerInternal,
  Var,
  WizardFooter,
  WorkflowConfigurationService,
  WorkflowModel,
  WorkflowModelMonitor,
} from '@clr/addons/var';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { ClrAlertModule } from '@clr/angular/emphasis/alert';
import { ClrIcon } from '@clr/angular/icon';
import { ClrSignpostModule } from '@clr/angular/popover/signpost';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';
import { renderFixture } from '@clr/angular/utils/testing';
import { ClrWizardModule } from '@clr/angular/wizard';
import { Observable, of, Subject, throwError } from 'rxjs';

import { useTestTimers } from '../../test-timers';
import { SummaryComponent } from './summary/summary.component';
import { SummaryModel } from './summary/summary.model';
import { WorkflowService } from './wizard-workflow.service';
import { preventDisplayingWizardError, WizardComponent } from './wizard.component';

class MockWizardModel {
  contextObjectId = 'vm-11';
  newContextObjectId = 'host-11';

  dep1 = Var.of<boolean>();
  isPage2Relevant: Var<boolean> = Var.of(true);
  var1 = Var.of<number>();
}

class MockWorkflowService extends WorkflowService {}

class MockPage1Model implements StepModel {
  loading = false;
  validationResult = true;
  activateCallsCount = 0;
  validateCallsCount = 0;
  var1Value = 0;
  changes: ModelChanges;

  @In() vmId?: string;

  @Out() newVmId?: string;

  @Out() showPage2: boolean;

  @Out() var1 = Var.of<number>(this.var1Value);
}

class MockPage2Model implements StepModel {
  loading = false;
  validationResult = true;
  activateCallsCount = 0;
  validateCallsCount = 0;
  validationState = new StepValidationState();
  readyToComplete: boolean;
  changes: ModelChanges;

  @In() newVmId?: string;
}

class MockPage3Model implements StepModel {
  loading = false;
  validationResult = true;
  activateCallsCount = 0;
  validateCallsCount = 0;
}

class MockPage4Model implements StepModel {
  loading = false;

  validation$ = new Subject<boolean>();

  cancelableValidation: CancelableStepValidation | undefined = undefined;

  canceledValidationCallsCount = 0;
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'mock-page-1-component',
  standalone: false,
  template: `<div>Page 1 Content</div>`,
})
class MockPage1Component implements StepComponent {
  model: MockPage1Model;

  activate(changes: ModelChanges) {
    this.model.activateCallsCount += 1;
    this.model.changes = changes;
  }

  validate(): Observable<boolean> {
    this.model.validateCallsCount += 1;
    this.model.var1.value = this.model.var1Value;
    return of(this.model.validationResult);
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'mock-page-2-component',
  standalone: false,
  template: `<div>Page 2 Content</div>`,
})
class MockPage2Component implements StepComponent {
  model: MockPage2Model;

  activate(changes: ModelChanges) {
    this.model.activateCallsCount += 1;
    this.model.changes = changes;
  }

  validate(): Observable<boolean> {
    this.model.validateCallsCount += 1;
    return of(this.model.validationResult);
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'mock-page-3-component',
  standalone: false,
  template: `<div>Page 3 Content</div>`,
})
class MockPage3Component implements StepModelHolder {
  model: MockPage3Model;

  activate() {
    this.model.activateCallsCount += 1;
  }

  validate(): Observable<boolean> {
    return of(this.model.validationResult);
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'mock-page-4-component',
  standalone: false,
  template: `<div>Page 4 Content</div>`,
})
class MockPage4Component implements StepModelHolder {
  model: MockPage4Model;

  validate(): Observable<boolean> {
    this.model.cancelableValidation = {
      cancelButtonLabel: 'cancel-validation',
      cancelValidation: () => {
        this.model.canceledValidationCallsCount++;
        this.model.validation$.next(false);
      },
    };

    return this.model.validation$.asObservable();
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'mock-footer-component',
  imports: [CommonModule],
  standalone: true,
  template: `<span>Footer: {{ currentStep?.title }}</span>`,
})
class MockFooterComponent implements WizardFooter {
  @Input() currentStep: Step;
  @Input() steps: Step[];
  @Input() workflowModel: WorkflowModel;
}

function isLoadingIndicatorVisible(wizardElement: DebugElement): boolean {
  return !!wizardElement.query(By.css('appfx-spinner'));
}

interface ThisTest {
  pageOneText: string;
  pageTwoText: string;
  fixture: ComponentFixture<WizardComponent>;
  component: WizardComponent;
  wizardModel: MockWizardModel;
  page1: StepInternal;
  page1Model: MockPage1Model;
  page2: StepInternal;
  page2Model: MockPage2Model;
  workflowService: WorkflowService;
  wizardHelper: WizardHelper;
  page3Model: MockPage3Model;
  page3: StepInternal;
  page4Model: MockPage4Model;
  page4: StepInternal;
  strings: WorkflowStrings;
  zoomLevelService: ZoomLevelService;
}

@NgModule({
  declarations: [MockPage1Component, MockPage2Component, MockPage3Component],
})
class AppfxWizardTestModule {}

describe('appfx-wizard', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  const page1Title = 'Page 1 Title';
  const page2Title = 'Page 2 Title';
  const page3Title = 'Page 3 Title';
  const page4Title = 'Page 4 Title';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrAlertModule, ClrSignpostModule, ClrSpinnerModule, ClrWizardModule, ClrIcon, AppfxWizardTestModule],
      declarations: [
        Spinner,
        WizardComponent,
        StepContainer,
        ValidationBanner,
        ValidationBannerInternal,
        WorkflowModelMonitor,
        MockPropertyViewComponent,
        SummaryComponent,
      ],
      providers: [
        {
          provide: WorkflowConfigurationService,
          useClass: MockWorkflowConfigurationService,
        },
        ChangeDetectorRef,
        {
          provide: ZoomLevelService,
          useClass: ZoomLevelServiceMock,
        },
        WorkflowStrings,
      ],
    }).overrideProvider(InteractivityChecker, {
      useValue: {
        isFocusable: () => true,
      },
    });

    testContext.pageOneText = 'I am page 1';
    testContext.pageTwoText = 'I am page 2';

    testContext.fixture = TestBed.createComponent(WizardComponent);
    testContext.component = testContext.fixture.componentInstance;

    testContext.wizardModel = new MockWizardModel();

    testContext.page1Model = new MockPage1Model();
    testContext.page2Model = new MockPage2Model();
    testContext.page3Model = new MockPage3Model();
    testContext.page4Model = new MockPage4Model();

    testContext.page1 = {
      title: page1Title,
      navTitle: 'Page 1 Nav',
      componentClass: MockPage1Component,
      model: testContext.page1Model,
      mappings: new Mappings<MockPage1Model, MockWizardModel>()
        .mapStepProp('vmId')
        .to('contextObjectId')
        .mapStepProp('newVmId')
        .to('newContextObjectId')
        .mapStepProp('showPage2')
        .to('isPage2Relevant'),
    };

    testContext.page2 = {
      title: page2Title,
      navTitle: 'Page 2 Nav',
      componentClass: MockPage2Component,
      model: testContext.page2Model,
      mappings: new Mappings<MockPage2Model, MockWizardModel>().mapStepProp('newVmId').to('newContextObjectId'),
    };

    testContext.page3 = {
      title: page3Title,
      navTitle: 'Page 3 Nav',
      componentClass: MockPage3Component,
      model: testContext.page3Model,
    };

    testContext.page4 = {
      title: page4Title,
      navTitle: 'Page 4 Nav',
      componentClass: MockPage4Component,
      model: testContext.page4Model,
    };

    testContext.workflowService = new MockWorkflowService();
    testContext.workflowService.addWorkflow('main', [testContext.page1, testContext.page2]);
    testContext.workflowService.switchToWorkflow('main');

    testContext.fixture.componentRef.setInput('title', 'JS Unit Tested Wizard');
    testContext.fixture.componentRef.setInput('wizardModel', testContext.wizardModel);
    testContext.fixture.componentRef.setInput('pages', testContext.workflowService.flow);

    testContext.wizardHelper = new WizardHelper(testContext.fixture.debugElement.query(By.css('clr-wizard')));
    testContext.strings = TestBed.inject(WorkflowStrings);
    expect(testContext.strings).toBeDefined();
  });

  afterEach(() => {
    const untypedContext: any = testContext;

    untypedContext.fixture.destroy();
  });

  describe('WHEN the Component is rendered', () => {
    it('THEN the wizard is visible', () => {
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.isVisible).toEqual(true);
    });

    it('THEN the page titles are visible in the TOC component', () => {
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.pageNavTitles).toEqual([testContext.page1.navTitle, testContext.page2.navTitle]);
    });

    it("THEN the size of the modal is 'lg' by default", () => {
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.size).toEqual('lg');
    });

    describe('WHEN the size input of the wizard is changed', () => {
      beforeEach(() => {
        testContext.fixture.componentRef.setInput('size', 'xl');
        renderFixture(testContext.fixture);
      });

      it('THEN the new size is applied to the wizard', () => {
        expect(testContext.wizardHelper.size).toEqual('xl');
      });
    });

    describe('WHEN debug mode is on', () => {
      const mockDebugModel = {
        ...new MockWizardModel(),
        contextObjectId: Var.of('vm-11'),
        newContextObjectId: Var.of('host-11'),
      };
      beforeEach(() => {
        testContext.component.configService.debug = true;
        testContext.component.modelMgr.model = mockDebugModel;
        renderFixture(testContext.fixture);
      });

      it('THEN should render mock popup', async () => {
        useTestTimers();
        renderFixture(testContext.fixture);
        await vi.advanceTimersByTimeAsync(0);

        const popupElement = testContext.fixture.debugElement.query(By.css('appfx-model-popup')).componentInstance;
        expect(popupElement).toBeDefined();
        expect(popupElement.modelMgr.model).toEqual(mockDebugModel);
      });
    });

    it("THEN the first page is rendered AND it's title is selected AND page.activate() lifecycle is invoked", () => {
      expect(testContext.page1Model.activateCallsCount).toEqual(0);

      renderFixture(testContext.fixture);

      expect(testContext.wizardHelper.activePageTitle).toEqual(testContext.page1.title);
      expect(testContext.wizardHelper.activePageNavTitle).toEqual(testContext.page1.navTitle);

      expect(testContext.page1Model.activateCallsCount).toEqual(1);
    });

    it('THEN the buttons are correctly rendered', () => {
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.visibleButtons.length).toBe(2);

      expect(testContext.wizardHelper.cancelButtonText).toEqual(testContext.strings.cancel.toUpperCase());
      expect(testContext.wizardHelper.nextButtonText).toEqual(testContext.strings.next.toUpperCase());
    });

    it("WHEN 'Next' is clicked THEN validate() and activate() methods are called", () => {
      vi.spyOn(testContext.component, 'onWizardCommit');
      vi.spyOn(testContext.component, 'onWizardPageActivated');

      renderFixture(testContext.fixture);

      expect(testContext.page1Model.validateCallsCount).toEqual(0);
      expect(testContext.page2Model.activateCallsCount).toEqual(0);

      testContext.wizardHelper.next();
      expect(testContext.component.onWizardCommit).toHaveBeenCalled();
      expect(testContext.component.onWizardPageActivated).toHaveBeenCalled();

      expect(testContext.page1Model.validateCallsCount).toEqual(1);
      expect(testContext.page2Model.activateCallsCount).toEqual(1);
    });

    it("WHEN 'Cancel' is clicked THEN onClose event is emitted", () => {
      renderFixture(testContext.fixture);

      let invoked = false;
      testContext.component.onClose.subscribe(() => (invoked = true));

      testContext.wizardHelper.cancel();

      expect(invoked).toEqual(true);
    });

    it('THEN the displays correctly a loading indicator if requested to do so', () => {
      renderFixture(testContext.fixture);

      // Initially indicator should be hidden
      expect(isLoadingIndicatorVisible(testContext.fixture.debugElement)).toEqual(false);

      // Show indicator when the wizard reports loading
      testContext.fixture.componentRef.setInput('loading', true);
      renderFixture(testContext.fixture);
      expect(isLoadingIndicatorVisible(testContext.fixture.debugElement)).toEqual(true);

      // Hide indicator
      testContext.fixture.componentRef.setInput('loading', false);
      renderFixture(testContext.fixture);
      expect(isLoadingIndicatorVisible(testContext.fixture.debugElement)).toEqual(false);

      // Show indicator when the page model reports loading
      testContext.page1Model.loading = true;
      renderFixture(testContext.fixture);
      expect(isLoadingIndicatorVisible(testContext.fixture.debugElement)).toEqual(true);

      // Hide indicator
      testContext.page1Model.loading = false;
      renderFixture(testContext.fixture);
      expect(isLoadingIndicatorVisible(testContext.fixture.debugElement)).toEqual(false);
    });
  });

  describe('WHEN we go to the next page', () => {
    beforeEach(() => {
      renderFixture(testContext.fixture);
      testContext.wizardHelper.next();
    });

    it('THEN the selected navigation AND the page title are correct', () => {
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.activePageTitle).toEqual(testContext.page2.title);
      expect(testContext.wizardHelper.activePageNavTitle).toEqual(testContext.page2.navTitle);
    });

    it('THEN the buttons are correctly rendered', () => {
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.cancelButtonText).toEqual(testContext.strings.cancel.toUpperCase());
      expect(testContext.wizardHelper.backButtonText).toEqual(testContext.strings.back.toUpperCase());
      // we have only 2 pages so the second is last
      expect(testContext.wizardHelper.finishButtonText).toEqual(testContext.strings.finish.toUpperCase());
    });

    it("WHEN 'Back' is clicked THEN onBack method is called", () => {
      vi.spyOn(testContext.component, 'onWizardBack');

      renderFixture(testContext.fixture);

      testContext.wizardHelper.back();
      expect(testContext.component.onWizardBack).toHaveBeenCalled();
    });

    it('THEN activate(changes) should receive correct data', () => {
      // currently in page 2
      let changes: ModelChanges = {};
      changes['vmId'] = new ModelChange('vmId', undefined, 'vm-11');
      expect(testContext.page1Model.changes).toEqual(changes);
      expect(testContext.page2Model.changes).toEqual({}); // no update to newVmId
      testContext.wizardHelper.back();
      expect(testContext.page1Model.changes).toEqual({}); // revisit page1
      testContext.page1Model.newVmId = 'updatedVmId'; // update page model newVmId
      testContext.wizardHelper.next(); // revisit page2 with changes
      changes = {};
      changes['newVmId'] = new ModelChange('newVmId', undefined, 'updatedVmId');
      expect(testContext.page2Model.changes).toEqual(changes);
      testContext.wizardHelper.back();
      expect(testContext.page1Model.changes).toEqual({});
      testContext.wizardHelper.next();
      expect(testContext.page1Model.changes).toEqual({});
    });
  });

  describe('WHEN a page has cancelable validation', () => {
    it('THEN should render cancel validation button ', () => {
      testContext.fixture.componentRef.setInput('pages', [testContext.page4, testContext.page1]);
      renderFixture(testContext.fixture);
      testContext.wizardHelper.next();
      renderFixture(testContext.fixture);

      expect(isLoadingIndicatorVisible(testContext.fixture.debugElement)).toEqual(true);

      expect(
        testContext.fixture.debugElement.query(By.css('appfx-spinner button.btn')).nativeElement.innerText
      ).toEqual(testContext.page4Model.cancelableValidation?.cancelButtonLabel?.toUpperCase());

      testContext.fixture.debugElement.query(By.css('appfx-spinner button.btn')).nativeElement.click();
      renderFixture(testContext.fixture);

      expect(isLoadingIndicatorVisible(testContext.fixture.debugElement)).toEqual(false);
      expect(testContext.page4Model.canceledValidationCallsCount).toEqual(1);
    });
  });

  describe('WHEN Finish is clicked', () => {
    it('THEN onFinish() and onClose() events are emitted', () => {
      const untypedContext: any = testContext;

      renderFixture(untypedContext.fixture);

      untypedContext.wizardHelper.next();

      renderFixture(untypedContext.fixture);

      let ok = false;
      let ok2 = false;
      untypedContext.component.onFinish.subscribe(() => (ok = true));
      untypedContext.component.onClose.subscribe(() => (ok2 = true));

      untypedContext.wizardHelper.finish();

      renderFixture(untypedContext.fixture);

      expect(ok).toBe(true);
      expect(ok2).toBe(true);
    });
  });

  describe('WHEN closeHandle handler is set', () => {
    const customError = 'Custom validation error';

    it('WHEN onSubmit throws error THEN error is set', () => {
      const untypedContext: any = testContext;

      untypedContext.component.closeHandler = {
        onSubmit: () => {
          return throwError(() => new Error(customError));
        },
      };

      renderFixture(untypedContext.fixture);
      untypedContext.wizardHelper.next();
      untypedContext.component.onWizardCommit();

      expect(untypedContext.component.closeHandlerValidationState.errors).toEqual([customError]);
    });

    it('WHEN onSubmit returns preventDisplayingWizardError THEN error is not set', () => {
      const untypedContext: any = testContext;

      untypedContext.component.closeHandler = {
        onSubmit: () => {
          return throwError(() => preventDisplayingWizardError);
        },
      };

      renderFixture(untypedContext.fixture);
      untypedContext.wizardHelper.next();
      untypedContext.component.onWizardCommit();

      expect(untypedContext.component.closeHandlerValidationState.errors).toEqual([]);
    });

    it('WHEN onCancel throws error THEN error is set', () => {
      const untypedContext: any = testContext;

      untypedContext.component.closeHandler = {
        onCancel: () => {
          return throwError(() => new Error(customError));
        },
      };

      renderFixture(untypedContext.fixture);
      untypedContext.component.onWizardCancel();

      expect(untypedContext.component.closeHandlerValidationState.errors).toEqual([customError]);
    });

    it('WHEN onCancel returns preventDisplayingWizardError THEN error is not set', () => {
      const untypedContext: any = testContext;

      untypedContext.component.closeHandler = {
        onCancel: () => {
          return throwError(() => preventDisplayingWizardError);
        },
      };

      renderFixture(untypedContext.fixture);
      untypedContext.component.onWizardCancel();

      expect(untypedContext.component.closeHandlerValidationState.errors).toEqual([]);
    });
  });

  describe('WHEN the models have inject/eject properties', () => {
    beforeEach(() => {
      testContext.page1Model.vmId = undefined;
      testContext.page1Model.newVmId = undefined;
      testContext.page2Model.newVmId = undefined;
    });

    describe('WHEN a page is activated', () => {
      beforeEach(() => {
        expect(testContext.page1Model.vmId).toBeUndefined();

        renderFixture(testContext.fixture);
      });

      it('THEN the wizard model properties are injected into the page model', () => {
        // The data was injected from the wizard model into the page 1 model
        expect(testContext.page1Model.vmId).toEqual('vm-11');

        // The second page model is still not affected as the page is not active yet
        expect(testContext.page2Model.newVmId).toBeUndefined();
      });

      describe('AND LATER a page is de-activated', () => {
        it('THEN the page model properties are injected into the wizard model', () => {
          testContext.page1Model.newVmId = 'vm-12';

          expect(testContext.wizardModel.newContextObjectId).toEqual('host-11');
          expect(testContext.page2Model.newVmId).toBeUndefined();

          // Press the Next button
          const nextButton = testContext.fixture.debugElement.queryAll(
            By.css('clr-wizard-button[aria-hidden=false] button')
          )[1];
          nextButton.triggerEventHandler('click', null);

          renderFixture(testContext.fixture);

          // From page1 the data was outjected into the wizard model
          expect(testContext.wizardModel.newContextObjectId).toEqual('vm-12');

          // From the wizard model was injected into page 2
          expect(testContext.page2Model.newVmId).toEqual('vm-12');
        });
      });
    });
  });

  describe('WHEN compute function executed', () => {
    beforeEach(async () => {
      testContext.page1.isRelevant = Var.from(testContext.wizardModel.dep1).by(dep1 => of(dep1));
      testContext.fixture.componentRef.setInput('pages', [...testContext.workflowService.flow]);
      await testContext.fixture.whenStable();
    });
    it('page relevance should be evaluated again', () => {
      expect(testContext.page1.isSkipped).toEqual(true);
      // this should update isSkipped property
      testContext.wizardModel.dep1.value = true;
      expect(testContext.page1.isSkipped).toEqual(false);
      // this should update isSkipped property again
      testContext.wizardModel.dep1.value = false;
      expect(testContext.page1.isSkipped).toEqual(true);
    });
  });

  describe('Relevance checks', () => {
    it('WHEN Page 1 is not relevant, THEN should display page2', () => {
      testContext.page1.isRelevant = Var.of(false);
      testContext.fixture.componentRef.setInput('pages', testContext.workflowService.flow);
      expect(testContext.component.pages.length).toEqual(2);
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.pageNavTitles.length).toEqual(1);
      expect(testContext.wizardHelper.activePageTitle).toEqual(page2Title);
    });
    it('WHEN next page becomes irrelevant, after page1 commit', () => {
      testContext.page2.isRelevant = testContext.wizardModel.isPage2Relevant;
      testContext.fixture.componentRef.setInput('pages', [testContext.page1, testContext.page2, testContext.page3]);
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.pageNavTitles.length).toEqual(3);
      expect(testContext.wizardHelper.activePageTitle).toEqual(page1Title);
      // This should skip page 2 because, it become irrelevant
      testContext.page1Model.showPage2 = false;
      testContext.wizardHelper.next();
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.pageNavTitles.length).toEqual(2);
      expect(testContext.wizardHelper.activePageTitle).toEqual(page3Title);
    });
    it('WHEN last page becomes relevant, after finish', () => {
      vi.spyOn(testContext.component.onFinish, 'emit');
      testContext.page3.isSkipped = true;
      testContext.page3.isRelevant = Var.from(testContext.wizardModel.dep1).by(dep1 => of(dep1));
      testContext.wizardModel.dep1.value = false;
      testContext.fixture.componentRef.setInput('pages', [testContext.page1, testContext.page2, testContext.page3]);
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.pageNavTitles.length).toEqual(2);
      expect(testContext.wizardHelper.activePageTitle).toEqual(page1Title);
      testContext.wizardHelper.next();
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.pageNavTitles.length).toEqual(2);
      expect(testContext.wizardHelper.activePageTitle).toEqual(page2Title);
      testContext.wizardModel.dep1.value = true;
      testContext.wizardHelper.finish();
      renderFixture(testContext.fixture);
      // This should add one more page, last page become relevant.
      expect(testContext.wizardHelper.pageNavTitles.length).toEqual(3);
      expect(testContext.wizardHelper.activePageTitle).toEqual(page3Title);
      testContext.wizardHelper.finish();
      expect(testContext.component.onFinish.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Step Navigation ->', () => {
    beforeEach(() => {
      testContext.fixture.componentRef.setInput('pages', [testContext.page1, testContext.page2, testContext.page3]);
      renderFixture(testContext.fixture);
    });

    it('WHEN rendered, Only step 1 is enabled', () => {
      expect(testContext.wizardHelper.pageNavTitles.length).toEqual(3);
      expect(testContext.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
      expect(testContext.wizardHelper.isStepNavEnabled(1)).toBeFalsy();
      expect(testContext.wizardHelper.isStepNavEnabled(2)).toBeFalsy();
    });

    it('activate should be called for step1', () => {
      expect(testContext.page1Model.activateCallsCount).toEqual(1);
      expect(testContext.wizardHelper.activePageTitle).toEqual(page1Title);
    });

    describe('Go to step2 using Next button ->', () => {
      beforeEach(() => {
        testContext.wizardHelper.next();
        renderFixture(testContext.fixture);
      });

      it('Only step 3 is disabled', () => {
        expect(testContext.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
        expect(testContext.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
        expect(testContext.wizardHelper.isStepNavEnabled(2)).toBeFalsy();
      });

      it('activate should be called for step2', () => {
        expect(testContext.page2Model.activateCallsCount).toEqual(1);
        expect(testContext.wizardHelper.activePageTitle).toEqual(page2Title);
      });

      it('validate should be called for step1', () => {
        expect(testContext.page1Model.validateCallsCount).toEqual(1);
      });

      describe('Go to step3 using Next button ->', () => {
        beforeEach(() => {
          testContext.wizardHelper.next();
          renderFixture(testContext.fixture);
        });

        it('All step Nav should be enabled', () => {
          expect(testContext.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
          expect(testContext.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
          expect(testContext.wizardHelper.isStepNavEnabled(2)).toBeTruthy();
        });

        it('activate should be called for step3', () => {
          expect(testContext.page3Model.activateCallsCount).toEqual(1);
          expect(testContext.wizardHelper.activePageTitle).toEqual(page3Title);
        });

        it('validate should be called for step2', () => {
          expect(testContext.page2Model.validateCallsCount).toEqual(1);
        });

        describe('Go back to step 1 using Step Nav ->', () => {
          beforeEach(() => {
            testContext.wizardHelper.navigateToStep(0);
            renderFixture(testContext.fixture);
          });

          it('All step Nav should be enabled', () => {
            expect(testContext.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
            expect(testContext.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
            expect(testContext.wizardHelper.isStepNavEnabled(2)).toBeTruthy();
          });

          it('activate should be called for step1', () => {
            expect(testContext.page1Model.activateCallsCount).toEqual(2);
            expect(testContext.wizardHelper.activePageTitle).toEqual(page1Title);
          });

          it('validate should NOT be called for step3', () => {
            expect(testContext.page3Model.validateCallsCount).toEqual(0);
          });

          describe('Go to step 2 using Step Nav ->', () => {
            beforeEach(() => {
              testContext.wizardHelper.navigateToStep(1);
              renderFixture(testContext.fixture);
            });

            it('All step Nav should be enabled', () => {
              expect(testContext.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
              expect(testContext.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
              expect(testContext.wizardHelper.isStepNavEnabled(2)).toBeTruthy();
            });

            it('activate should be called for step2', () => {
              expect(testContext.page2Model.activateCallsCount).toEqual(2);
              expect(testContext.wizardHelper.activePageTitle).toEqual(page2Title);
            });

            it('validate should be called for step1', () => {
              expect(testContext.page1Model.validateCallsCount).toEqual(2);
            });
          });

          describe('Go to step 3 using Step Nav ->', () => {
            beforeEach(() => {
              testContext.wizardHelper.navigateToStep(2);
              renderFixture(testContext.fixture);
            });

            it('All step Nav should be enabled', () => {
              expect(testContext.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
              expect(testContext.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
              expect(testContext.wizardHelper.isStepNavEnabled(2)).toBeTruthy();
            });

            it('activate should be called for step3', () => {
              expect(testContext.page3Model.activateCallsCount).toEqual(2);
              expect(testContext.wizardHelper.activePageTitle).toEqual(page3Title);
            });

            it('validate should be called for step1', () => {
              expect(testContext.page1Model.validateCallsCount).toEqual(2);
            });
          });

          describe('Step 1 is invalid ->', () => {
            beforeEach(() => {
              testContext.page1Model.validationResult = false;
              renderFixture(testContext.fixture);
            });

            describe('Go to step 2 using Step Nav ->', () => {
              beforeEach(() => {
                testContext.wizardHelper.navigateToStep(1);
                renderFixture(testContext.fixture);
              });

              it('All step Nav should be enabled', () => {
                expect(testContext.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
                expect(testContext.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
                expect(testContext.wizardHelper.isStepNavEnabled(2)).toBeTruthy();
              });

              it('activate should NOT be called for step2', () => {
                expect(testContext.page2Model.activateCallsCount).toEqual(1);
                expect(testContext.wizardHelper.activePageTitle).toEqual(page1Title);
              });

              it('validate should be called for step1', () => {
                expect(testContext.page1Model.validateCallsCount).toEqual(2);
              });
            });

            describe('Go to step 3 using Step Nav ->', () => {
              beforeEach(() => {
                testContext.wizardHelper.navigateToStep(2);
                renderFixture(testContext.fixture);
              });

              it('All step Nav should be enabled', () => {
                expect(testContext.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
                expect(testContext.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
                expect(testContext.wizardHelper.isStepNavEnabled(2)).toBeTruthy();
              });

              it('activate should NOT be called for step3', () => {
                expect(testContext.page3Model.activateCallsCount).toEqual(1);
                expect(testContext.wizardHelper.activePageTitle).toEqual(page1Title);
              });

              it('validate should be called for step1', () => {
                expect(testContext.page1Model.validateCallsCount).toEqual(2);
              });
            });
          });
        });
      });

      describe('Go back to step 1 using Step Nav ->', () => {
        beforeEach(() => {
          testContext.wizardHelper.navigateToStep(0);
          renderFixture(testContext.fixture);
        });

        it('Only step 3 is disabled', () => {
          expect(testContext.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
          expect(testContext.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
          expect(testContext.wizardHelper.isStepNavEnabled(2)).toBeFalsy();
        });

        it('activate should be called for step1', () => {
          expect(testContext.page1Model.activateCallsCount).toEqual(2);
          expect(testContext.wizardHelper.activePageTitle).toEqual(page1Title);
        });

        it('validate should NOT be called for step2', () => {
          expect(testContext.page2Model.validateCallsCount).toEqual(0);
        });

        describe('WHEN there is a change in wizard model ->', () => {
          beforeEach(() => {
            testContext.page1Model.var1Value = 1;
          });

          describe('Go to step2 using Step Nav ->', () => {
            beforeEach(() => {
              testContext.wizardHelper.navigateToStep(1);
              renderFixture(testContext.fixture);
            });

            it('Only step 1 is enabled', () => {
              expect(testContext.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
              expect(testContext.wizardHelper.isStepNavEnabled(1)).toBeFalsy();
              expect(testContext.wizardHelper.isStepNavEnabled(2)).toBeFalsy();
            });

            it('activate should NOT be called for step2', () => {
              expect(testContext.page2Model.activateCallsCount).toEqual(1);
              expect(testContext.wizardHelper.activePageTitle).toEqual(page1Title);
            });

            it('validate should be called for step1', () => {
              expect(testContext.page1Model.validateCallsCount).toEqual(2);
            });
          });
        });

        describe('Go to step2 using Step Nav ->', () => {
          beforeEach(() => {
            testContext.wizardHelper.navigateToStep(1);
            renderFixture(testContext.fixture);
          });

          it('Only step 3 is disabled', () => {
            expect(testContext.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
            expect(testContext.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
            expect(testContext.wizardHelper.isStepNavEnabled(2)).toBeFalsy();
          });

          it('activate should be called for step2', () => {
            expect(testContext.page2Model.activateCallsCount).toEqual(2);
            expect(testContext.wizardHelper.activePageTitle).toEqual(page2Title);
          });

          it('validate should be called for step1', () => {
            expect(testContext.page1Model.validateCallsCount).toEqual(2);
          });
        });
      });

      describe('Step2 is invalid ->', () => {
        beforeEach(() => {
          testContext.page2Model.validationResult = false;
        });

        describe('Go back to step 1 using Step Nav, Step2 is invalid ->', () => {
          beforeEach(() => {
            testContext.wizardHelper.navigateToStep(0);
            renderFixture(testContext.fixture);
          });

          it('Only step 3 is disabled', () => {
            expect(testContext.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
            expect(testContext.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
            expect(testContext.wizardHelper.isStepNavEnabled(2)).toBeFalsy();
          });

          it('activate should be called for step1', () => {
            expect(testContext.page1Model.activateCallsCount).toEqual(2);
            expect(testContext.wizardHelper.activePageTitle).toEqual(page1Title);
          });

          it('validate should NOT be called for step2', () => {
            expect(testContext.page1Model.validateCallsCount).toEqual(1);
          });
        });
      });
    });
  });

  describe('WHEN StepModel.readyToComplete=false', () => {
    beforeEach(() => {
      renderFixture(testContext.fixture);
      testContext.wizardHelper.next();
      renderFixture(testContext.fixture); // in Step 2
      testContext.page2Model.readyToComplete = false;
      renderFixture(testContext.fixture);
    });

    it('Next button should be disabled', () => {
      expect(testContext.wizardHelper.activePageTitle).toEqual(page2Title);
      expect(testContext.component.isNextButtonDisabled).toEqual(true);
    });

    it('Cannot go to Next step', () => {
      testContext.wizardHelper.next();
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.activePageTitle).toEqual(page2Title);
    });

    it('Can go to Previous step', () => {
      testContext.wizardHelper.back();
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.activePageTitle).toEqual(page1Title);
    });
  });

  describe('WHEN StepValidationState.isValid()=false', () => {
    beforeEach(() => {
      renderFixture(testContext.fixture);
      testContext.wizardHelper.next();
      renderFixture(testContext.fixture); // in Step 2
      testContext.page2Model.validationState.errors = ['Error Message'];
      renderFixture(testContext.fixture);
    });

    it('Next button should be enabled', () => {
      expect(testContext.wizardHelper.activePageTitle).toEqual(page2Title);
      expect(testContext.component.isNextButtonDisabled).toEqual(false);
    });

    it('Cannot go to Next step', () => {
      testContext.wizardHelper.next();
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.activePageTitle).toEqual(page2Title);
    });

    it('Can go to Previous step', () => {
      testContext.wizardHelper.back();
      renderFixture(testContext.fixture);
      expect(testContext.wizardHelper.activePageTitle).toEqual(page1Title);
    });
  });

  describe('WHEN Step#summary is defined', () => {
    beforeEach(() => {
      testContext.page1.summary = (builder: PropertyViewSectionBuilder): PropertyViewSectionModel => {
        return builder.build();
      };
      testContext.page2.summary = (builder: PropertyViewSectionBuilder): PropertyViewSectionModel => {
        return builder.build();
      };
      testContext.fixture.componentRef.setInput('pages', [testContext.page1, testContext.page2, testContext.page3]);
      renderFixture(testContext.fixture);
    });

    it('THEN, SummaryComponent should be appended', () => {
      expect(testContext.component.pages.length).toEqual(4);
      expect(testContext.component.pages[3].componentClass).toEqual(SummaryComponent);
    });

    describe('WHEN all pages are relevant', () => {
      it('THEN, appfx-summary should be rendered in last step', () => {
        testContext.wizardHelper.next();
        testContext.wizardHelper.next();
        testContext.wizardHelper.next();
        expect(testContext.wizardHelper.activePageTitle).toEqual('Ready To Complete');
        expect(testContext.fixture.debugElement.query(By.css('appfx-summary'))).toBeDefined();
      });

      it('THEN, should have section from all pages', () => {
        testContext.wizardHelper.next();
        testContext.wizardHelper.next();
        testContext.wizardHelper.next();
        const propertyViewSections = ((testContext.component.pages[3] as any)['modelInstance'] as SummaryModel).data
          .categories[0].content;

        expect(propertyViewSections.length).toEqual(2);
        expect(propertyViewSections[0].title).toEqual(testContext.page1.navTitle as string);
        expect(propertyViewSections[1].title).toEqual(testContext.page2.navTitle as string);
      });
    });

    describe('WHEN some pages are NOT relevant', () => {
      beforeEach(() => {
        testContext.page2.isRelevant = Var.of(false);
        testContext.fixture.componentRef.setInput('pages', [testContext.page1, testContext.page2, testContext.page3]);
        renderFixture(testContext.fixture);
      });

      it('THEN, appfx-summary should be rendered in last step', () => {
        testContext.wizardHelper.next();
        testContext.wizardHelper.next();
        expect(testContext.wizardHelper.activePageTitle).toEqual('Ready To Complete');
        expect(testContext.fixture.debugElement.query(By.css('appfx-summary'))).toBeDefined();
      });

      it('THEN, should have section from only relevant pages', () => {
        testContext.wizardHelper.next();
        testContext.wizardHelper.next();
        testContext.wizardHelper.next();
        const propertyViewSections = ((testContext.component.pages[3] as any)['modelInstance'] as SummaryModel).data
          .categories[0].content;
        expect(propertyViewSections.length).toEqual(1);
        expect(propertyViewSections[0].title).toEqual(testContext.page1.navTitle as string);
      });

      it('THEN, should have isSkpped state equal to true if all pages with summary are not relevant', () => {
        expect((<StepInternal>testContext.component.pages[3]).isSkipped).toEqual(false);
        testContext.page1.isRelevant = Var.of(false);
        testContext.fixture.componentRef.setInput('pages', [testContext.page1, testContext.page2, testContext.page3]);
        renderFixture(testContext.fixture);
        expect((<StepInternal>testContext.component.pages[3]).isSkipped).toEqual(true);
      });
    });
  });

  describe('zoom accessibility', () => {
    beforeEach(() => {
      testContext.fixture.componentRef.setInput('pages', [testContext.page1, testContext.page2]);
      testContext.zoomLevelService = TestBed.inject(ZoomLevelService);
    });

    describe('zoom2x', () => {
      beforeEach(() => {
        testContext.zoomLevelService['resizeSubject'].next(ZoomLevel.x2);
        renderFixture(testContext.fixture);
      });

      it('step nav panel is hidden by default', () => {
        expect(testContext.wizardHelper.isNavVisible()).toBeFalsy();
      });

      it('`Show step nav` burger icon is visible by default', () => {
        expect(testContext.wizardHelper.isShowNavIconVisible()).toBeTruthy();
      });

      it('page name is prefixed by visible page index', () => {
        expect(testContext.wizardHelper.activePageTitle).toEqual('1.\xA0' + testContext.page1.title);

        testContext.wizardHelper.next();

        expect(testContext.wizardHelper.activePageTitle).toEqual('2.\xA0' + testContext.page2.title);
      });

      describe('when `Show step nav` burger icon is clicked', () => {
        beforeEach(() => {
          testContext.wizardHelper.showNavigator();
          renderFixture(testContext.fixture);
        });

        it('step nav panel is opened', () => {
          expect(testContext.wizardHelper.isNavVisible()).toBeTruthy();
        });

        describe('when `Close step nav` icon icon is clicked', () => {
          beforeEach(() => {
            testContext.wizardHelper.closeNavigator();
            renderFixture(testContext.fixture);
          });

          it('step nav panel is closed', () => {
            expect(testContext.wizardHelper.isNavVisible()).toBeFalsy();
          });
        });
      });
    });

    describe('zoom4x', () => {
      beforeEach(() => {
        testContext.zoomLevelService['resizeSubject'].next(ZoomLevel.x4);
        renderFixture(testContext.fixture);
      });

      it('step nav panel is hidden by default', () => {
        expect(testContext.wizardHelper.isNavVisible()).toBeFalsy();
      });

      it('`Show step nav` burger icon is visible by default', () => {
        expect(testContext.wizardHelper.isShowNavIconVisible()).toBeTruthy();
      });

      it('page name is prefixed by visible page index', () => {
        expect(testContext.wizardHelper.activePageTitle).toEqual('1.\xA0' + testContext.page1.title);

        testContext.wizardHelper.next();

        expect(testContext.wizardHelper.activePageTitle).toEqual('2.\xA0' + testContext.page2.title);
      });

      describe('when `Show step nav` burger icon is clicked', () => {
        beforeEach(() => {
          testContext.wizardHelper.showNavigator();
          renderFixture(testContext.fixture);
        });

        it('step nav panel is opened', () => {
          expect(testContext.wizardHelper.isNavVisible()).toBeTruthy();
        });

        describe('when `Close step nav` icon icon is clicked', () => {
          beforeEach(() => {
            testContext.wizardHelper.closeNavigator();
            renderFixture(testContext.fixture);
          });

          it('step nav panel is closed', () => {
            expect(testContext.wizardHelper.isNavVisible()).toBeFalsy();
          });
        });
      });
    });
  });

  describe('Footer API', () => {
    it('WHEN footer config is NOT provided THEN no footer component is rendered', () => {
      expect(testContext.fixture.debugElement.query(By.css('.appfx-wizard-footer-component'))).toBeNull();
    });

    describe('WHEN footer config is provided', () => {
      beforeEach(() => {
        testContext.fixture.componentRef.setInput('footer', { componentClass: MockFooterComponent });
        renderFixture(testContext.fixture);
      });

      it('THEN the footer inputs are updated when the step changes', () => {
        const getFooterInstance = () =>
          testContext.fixture.debugElement.query(By.directive(MockFooterComponent))
            .componentInstance as MockFooterComponent;

        const footer = getFooterInstance();
        expect(footer.currentStep).toBeDefined();
        expect(footer.currentStep.title).toEqual(testContext.page1.title);
        expect(footer.steps).toBeDefined();
        expect(footer.steps.length).toEqual(2);
        expect(footer.workflowModel).toBe(testContext.wizardModel);

        testContext.wizardHelper.next();
        renderFixture(testContext.fixture);

        const updatedFooter = getFooterInstance();
        expect(updatedFooter.currentStep.title).toEqual(testContext.page2.title);
        expect(updatedFooter.workflowModel).toBe(testContext.wizardModel);
      });
    });
  });
});
