/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { InteractivityChecker } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DebugElement, Input, NgModule } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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
import { ClrWizardModule } from '@clr/angular/wizard';
import { Observable, of, Subject, throwError } from 'rxjs';

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
  const page1Title = 'Page 1 Title';
  const page2Title = 'Page 2 Title';
  const page3Title = 'Page 3 Title';
  const page4Title = 'Page 4 Title';
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      imports: [
        ClrAlertModule,
        ClrSignpostModule,
        ClrSpinnerModule,
        ClrWizardModule,
        ClrIcon,
        NoopAnimationsModule,
        AppfxWizardTestModule,
      ],
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

    this.pageOneText = 'I am page 1';
    this.pageTwoText = 'I am page 2';

    this.fixture = TestBed.createComponent(WizardComponent);
    this.component = this.fixture.componentInstance;

    this.wizardModel = new MockWizardModel();

    this.page1Model = new MockPage1Model();
    this.page2Model = new MockPage2Model();
    this.page3Model = new MockPage3Model();
    this.page4Model = new MockPage4Model();

    this.page1 = {
      title: page1Title,
      navTitle: 'Page 1 Nav',
      componentClass: MockPage1Component,
      model: this.page1Model,
      mappings: new Mappings<MockPage1Model, MockWizardModel>()
        .mapStepProp('vmId')
        .to('contextObjectId')
        .mapStepProp('newVmId')
        .to('newContextObjectId')
        .mapStepProp('showPage2')
        .to('isPage2Relevant'),
    };

    this.page2 = {
      title: page2Title,
      navTitle: 'Page 2 Nav',
      componentClass: MockPage2Component,
      model: this.page2Model,
      mappings: new Mappings<MockPage2Model, MockWizardModel>().mapStepProp('newVmId').to('newContextObjectId'),
    };

    this.page3 = {
      title: page3Title,
      navTitle: 'Page 3 Nav',
      componentClass: MockPage3Component,
      model: this.page3Model,
    };

    this.page4 = {
      title: page4Title,
      navTitle: 'Page 4 Nav',
      componentClass: MockPage4Component,
      model: this.page4Model,
    };

    this.workflowService = new MockWorkflowService();
    this.workflowService.addWorkflow('main', [this.page1, this.page2]);
    this.workflowService.switchToWorkflow('main');

    this.component.title = 'JS Unit Tested Wizard';
    this.component.wizardModel = this.wizardModel;
    this.component.pages = this.workflowService.flow;

    this.wizardHelper = new WizardHelper(this.fixture.debugElement.query(By.css('clr-wizard')));
    this.strings = TestBed.inject(WorkflowStrings);
    expect(this.strings).toBeDefined();
  });

  afterEach(function (this: any) {
    this.fixture.destroy();
  });

  describe('WHEN the Component is rendered', () => {
    it('THEN the wizard is visible', function (this: ThisTest) {
      this.fixture.detectChanges();
      expect(this.wizardHelper.isVisible).toEqual(true);
    });

    it('THEN the page titles are visible in the TOC component', function (this: ThisTest) {
      this.fixture.detectChanges();
      expect(this.wizardHelper.pageNavTitles).toEqual([this.page1.navTitle, this.page2.navTitle]);
    });

    it("THEN the size of the modal is 'lg' by default", function (this: ThisTest) {
      this.fixture.detectChanges();
      expect(this.wizardHelper.size).toEqual('lg');
    });

    describe('WHEN the size input of the wizard is changed', () => {
      beforeEach(function (this: ThisTest) {
        this.component.size = 'xl';
        this.fixture.detectChanges();
      });

      it('THEN the new size is applied to the wizard', function (this: ThisTest) {
        expect(this.wizardHelper.size).toEqual('xl');
      });
    });

    describe('WHEN debug mode is on', () => {
      const mockDebugModel = {
        ...new MockWizardModel(),
        contextObjectId: Var.of('vm-11'),
        newContextObjectId: Var.of('host-11'),
      };
      beforeEach(function (this: ThisTest) {
        this.component.configService.debug = true;
        this.component.modelMgr.model = mockDebugModel;
        this.fixture.detectChanges();
      });

      it('THEN should render mock popup', fakeAsync(function (this: ThisTest) {
        this.fixture.detectChanges();
        tick();

        const popupElement = this.fixture.debugElement.query(By.css('appfx-model-popup')).componentInstance;
        expect(popupElement).toBeDefined();
        expect(popupElement.modelMgr.model).toEqual(mockDebugModel);
      }));
    });

    it("THEN the first page is rendered AND it's title is selected AND page.activate() lifecycle is invoked", function (this: ThisTest) {
      expect(this.page1Model.activateCallsCount).toEqual(0);

      this.fixture.detectChanges();

      expect(this.wizardHelper.activePageTitle).toEqual(this.page1.title);
      expect(this.wizardHelper.activePageNavTitle).toEqual(this.page1.navTitle);

      expect(this.page1Model.activateCallsCount).toEqual(1);
    });

    it('THEN the buttons are correctly rendered', function (this: ThisTest) {
      this.fixture.detectChanges();
      expect(this.wizardHelper.visibleButtons.length).toBe(2);

      expect(this.wizardHelper.cancelButtonText).toEqual(this.strings.cancel.toUpperCase());
      expect(this.wizardHelper.nextButtonText).toEqual(this.strings.next.toUpperCase());
    });

    it("WHEN 'Next' is clicked THEN validate() and activate() methods are called", function (this: ThisTest) {
      spyOn(this.component, 'onWizardCommit').and.callThrough();
      spyOn(this.component, 'onWizardPageActivated').and.callThrough();

      this.fixture.detectChanges();

      expect(this.page1Model.validateCallsCount).toEqual(0);
      expect(this.page2Model.activateCallsCount).toEqual(0);

      this.wizardHelper.next();
      expect(this.component.onWizardCommit).toHaveBeenCalled();
      expect(this.component.onWizardPageActivated).toHaveBeenCalled();

      expect(this.page1Model.validateCallsCount).toEqual(1);
      expect(this.page2Model.activateCallsCount).toEqual(1);
    });

    it("WHEN 'Cancel' is clicked THEN onClose event is emitted", function (this: ThisTest) {
      this.fixture.detectChanges();

      let invoked = false;
      this.component.onClose.subscribe(() => (invoked = true));

      this.wizardHelper.cancel();

      expect(invoked).toEqual(true);
    });

    it('THEN the displays correctly a loading indicator if requested to do so', function (this: ThisTest) {
      this.fixture.detectChanges();

      // Initially indicator should be hidden
      expect(isLoadingIndicatorVisible(this.fixture.debugElement)).toEqual(false);

      // Show indicator when the wizard reports loading
      this.component.loading = true;
      this.fixture.detectChanges();
      expect(isLoadingIndicatorVisible(this.fixture.debugElement)).toEqual(true);

      // Hide indicator
      this.component.loading = false;
      this.fixture.detectChanges();
      expect(isLoadingIndicatorVisible(this.fixture.debugElement)).toEqual(false);

      // Show indicator when the page model reports loading
      this.page1Model.loading = true;
      this.fixture.detectChanges();
      expect(isLoadingIndicatorVisible(this.fixture.debugElement)).toEqual(true);

      // Hide indicator
      this.page1Model.loading = false;
      this.fixture.detectChanges();
      expect(isLoadingIndicatorVisible(this.fixture.debugElement)).toEqual(false);
    });
  });

  describe('WHEN we go to the next page', () => {
    beforeEach(function (this: ThisTest) {
      this.fixture.detectChanges();
      this.wizardHelper.next();
    });

    it('THEN the selected navigation AND the page title are correct', function (this: ThisTest) {
      this.fixture.detectChanges();
      expect(this.wizardHelper.activePageTitle).toEqual(this.page2.title);
      expect(this.wizardHelper.activePageNavTitle).toEqual(this.page2.navTitle);
    });

    it('THEN the buttons are correctly rendered', function (this: ThisTest) {
      this.fixture.detectChanges();
      expect(this.wizardHelper.cancelButtonText).toEqual(this.strings.cancel.toUpperCase());
      expect(this.wizardHelper.backButtonText).toEqual(this.strings.back.toUpperCase());
      // we have only 2 pages so the second is last
      expect(this.wizardHelper.finishButtonText).toEqual(this.strings.finish.toUpperCase());
    });

    it("WHEN 'Back' is clicked THEN onBack method is called", function (this: ThisTest) {
      spyOn(this.component, 'onWizardBack').and.callThrough();

      this.fixture.detectChanges();

      this.wizardHelper.back();
      expect(this.component.onWizardBack).toHaveBeenCalled();
    });

    it('THEN activate(changes) should receive correct data', function (this: ThisTest) {
      // currently in page 2
      let changes: ModelChanges = {};
      changes['vmId'] = new ModelChange('vmId', undefined, 'vm-11');
      expect(this.page1Model.changes).toEqual(changes);
      expect(this.page2Model.changes).toEqual({}); // no update to newVmId
      this.wizardHelper.back();
      expect(this.page1Model.changes).toEqual({}); // revisit page1
      this.page1Model.newVmId = 'updatedVmId'; // update page model newVmId
      this.wizardHelper.next(); // revisit page2 with changes
      changes = {};
      changes['newVmId'] = new ModelChange('newVmId', undefined, 'updatedVmId');
      expect(this.page2Model.changes).toEqual(changes);
      this.wizardHelper.back();
      expect(this.page1Model.changes).toEqual({});
      this.wizardHelper.next();
      expect(this.page1Model.changes).toEqual({});
    });
  });

  describe('WHEN a page has cancelable validation', () => {
    it('THEN should render cancel validation button ', function (this: ThisTest) {
      this.component.pages = [this.page4, this.page1];
      this.fixture.detectChanges();
      this.wizardHelper.next();
      this.fixture.detectChanges();

      expect(isLoadingIndicatorVisible(this.fixture.debugElement)).toEqual(true);

      expect(this.fixture.debugElement.query(By.css('appfx-spinner button.btn')).nativeElement.innerText).toEqual(
        this.page4Model.cancelableValidation?.cancelButtonLabel?.toUpperCase()
      );

      this.fixture.debugElement.query(By.css('appfx-spinner button.btn')).nativeElement.click();
      this.fixture.detectChanges();

      expect(isLoadingIndicatorVisible(this.fixture.debugElement)).toEqual(false);
      expect(this.page4Model.canceledValidationCallsCount).toEqual(1);
    });
  });

  describe('WHEN Finish is clicked', () => {
    it('THEN onFinish() and onClose() events are emitted', function (this: any) {
      this.fixture.detectChanges();

      this.wizardHelper.next();

      this.fixture.detectChanges();

      let ok = false;
      let ok2 = false;
      this.component.onFinish.subscribe(() => (ok = true));
      this.component.onClose.subscribe(() => (ok2 = true));

      this.wizardHelper.finish();

      this.fixture.detectChanges();

      expect(ok).toBe(true);
      expect(ok2).toBe(true);
    });
  });

  describe('WHEN closeHandle handler is set', () => {
    const customError = 'Custom validation error';

    it('WHEN onSubmit throws error THEN error is set', function (this: any) {
      this.component.closeHandler = {
        onSubmit: () => {
          return throwError(() => new Error(customError));
        },
      };

      this.fixture.detectChanges();
      this.wizardHelper.next();
      this.component.onWizardCommit();

      expect(this.component.closeHandlerValidationState.errors).toEqual([customError]);
    });

    it('WHEN onSubmit returns preventDisplayingWizardError THEN error is not set', function (this: any) {
      this.component.closeHandler = {
        onSubmit: () => {
          return throwError(() => preventDisplayingWizardError);
        },
      };

      this.fixture.detectChanges();
      this.wizardHelper.next();
      this.component.onWizardCommit();

      expect(this.component.closeHandlerValidationState.errors).toEqual([]);
    });

    it('WHEN onCancel throws error THEN error is set', function (this: any) {
      this.component.closeHandler = {
        onCancel: () => {
          return throwError(() => new Error(customError));
        },
      };

      this.fixture.detectChanges();
      this.component.onWizardCancel();

      expect(this.component.closeHandlerValidationState.errors).toEqual([customError]);
    });

    it('WHEN onCancel returns preventDisplayingWizardError THEN error is not set', function (this: any) {
      this.component.closeHandler = {
        onCancel: () => {
          return throwError(() => preventDisplayingWizardError);
        },
      };

      this.fixture.detectChanges();
      this.component.onWizardCancel();

      expect(this.component.closeHandlerValidationState.errors).toEqual([]);
    });
  });

  describe('WHEN the models have inject/eject properties', () => {
    beforeEach(function (this: ThisTest) {
      this.page1Model.vmId = undefined;
      this.page1Model.newVmId = undefined;
      this.page2Model.newVmId = undefined;
    });

    describe('WHEN a page is activated', () => {
      beforeEach(function (this: ThisTest) {
        expect(this.page1Model.vmId).toBeUndefined();

        this.fixture.detectChanges();
      });

      it('THEN the wizard model properties are injected into the page model', function (this: ThisTest) {
        // The data was injected from the wizard model into the page 1 model
        expect(this.page1Model.vmId).toEqual('vm-11');

        // The second page model is still not affected as the page is not active yet
        expect(this.page2Model.newVmId).toBeUndefined();
      });

      describe('AND LATER a page is de-activated', () => {
        it('THEN the page model properties are injected into the wizard model', function (this: ThisTest) {
          this.page1Model.newVmId = 'vm-12';

          expect(this.wizardModel.newContextObjectId).toEqual('host-11');
          expect(this.page2Model.newVmId).toBeUndefined();

          // Press the Next button
          const nextButton = this.fixture.debugElement.queryAll(
            By.css('clr-wizard-button[aria-hidden=false] button')
          )[1];
          nextButton.triggerEventHandler('click', null);

          this.fixture.detectChanges();

          // From page1 the data was outjected into the wizard model
          expect(this.wizardModel.newContextObjectId).toEqual('vm-12');

          // From the wizard model was injected into page 2
          expect(this.page2Model.newVmId).toEqual('vm-12');
        });
      });
    });
  });

  describe('WHEN compute function executed', () => {
    beforeEach(function (this: ThisTest) {
      this.page1.isRelevant = Var.from(this.wizardModel.dep1).by(dep1 => of(dep1));
      this.component.pages = this.workflowService.flow;
    });
    it('page relevance should be evaluated again', function (this: ThisTest) {
      expect(this.page1.isSkipped).toEqual(true);
      // this should update isSkipped property
      this.wizardModel.dep1.value = true;
      expect(this.page1.isSkipped).toEqual(false);
      // this should update isSkipped property again
      this.wizardModel.dep1.value = false;
      expect(this.page1.isSkipped).toEqual(true);
    });
  });

  describe('Relevance checks', () => {
    it('WHEN Page 1 is not relevant, THEN should display page2', function (this: ThisTest) {
      this.page1.isRelevant = Var.of(false);
      this.component.pages = this.workflowService.flow;
      expect(this.component.pages.length).toEqual(2);
      this.fixture.detectChanges();
      expect(this.wizardHelper.pageNavTitles.length).toEqual(1);
      expect(this.wizardHelper.activePageTitle).toEqual(page2Title);
    });
    it('WHEN next page becomes irrelevant, after page1 commit', function (this: ThisTest) {
      this.page2.isRelevant = this.wizardModel.isPage2Relevant;
      this.component.pages = [this.page1, this.page2, this.page3];
      this.fixture.detectChanges();
      expect(this.wizardHelper.pageNavTitles.length).toEqual(3);
      expect(this.wizardHelper.activePageTitle).toEqual(page1Title);
      // This should skip page 2 because, it become irrelevant
      this.page1Model.showPage2 = false;
      this.wizardHelper.next();
      this.fixture.detectChanges();
      expect(this.wizardHelper.pageNavTitles.length).toEqual(2);
      expect(this.wizardHelper.activePageTitle).toEqual(page3Title);
    });
    it('WHEN last page becomes relevant, after finish', function (this: ThisTest) {
      spyOn(this.component.onFinish, 'emit').and.callThrough();
      this.page3.isSkipped = true;
      this.page3.isRelevant = Var.from(this.wizardModel.dep1).by(dep1 => of(dep1));
      this.wizardModel.dep1.value = false;
      this.component.pages = [this.page1, this.page2, this.page3];
      this.fixture.detectChanges();
      expect(this.wizardHelper.pageNavTitles.length).toEqual(2);
      expect(this.wizardHelper.activePageTitle).toEqual(page1Title);
      this.wizardHelper.next();
      this.fixture.detectChanges();
      expect(this.wizardHelper.pageNavTitles.length).toEqual(2);
      expect(this.wizardHelper.activePageTitle).toEqual(page2Title);
      this.wizardModel.dep1.value = true;
      this.wizardHelper.finish();
      this.fixture.detectChanges();
      // This should add one more page, last page become relevant.
      expect(this.wizardHelper.pageNavTitles.length).toEqual(3);
      expect(this.wizardHelper.activePageTitle).toEqual(page3Title);
      this.wizardHelper.finish();
      expect(this.component.onFinish.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Step Navigation ->', () => {
    beforeEach(function (this: ThisTest) {
      this.component.pages = [this.page1, this.page2, this.page3];
      this.fixture.detectChanges();
    });

    it('WHEN rendered, Only step 1 is enabled', function (this: ThisTest) {
      expect(this.wizardHelper.pageNavTitles.length).toEqual(3);
      expect(this.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
      expect(this.wizardHelper.isStepNavEnabled(1)).toBeFalsy();
      expect(this.wizardHelper.isStepNavEnabled(2)).toBeFalsy();
    });

    it('activate should be called for step1', function (this: ThisTest) {
      expect(this.page1Model.activateCallsCount).toEqual(1);
      expect(this.wizardHelper.activePageTitle).toEqual(page1Title);
    });

    describe('Go to step2 using Next button ->', () => {
      beforeEach(function (this: ThisTest) {
        this.wizardHelper.next();
        this.fixture.detectChanges();
      });

      it('Only step 3 is disabled', function (this: ThisTest) {
        expect(this.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
        expect(this.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
        expect(this.wizardHelper.isStepNavEnabled(2)).toBeFalsy();
      });

      it('activate should be called for step2', function (this: ThisTest) {
        expect(this.page2Model.activateCallsCount).toEqual(1);
        expect(this.wizardHelper.activePageTitle).toEqual(page2Title);
      });

      it('validate should be called for step1', function (this: ThisTest) {
        expect(this.page1Model.validateCallsCount).toEqual(1);
      });

      describe('Go to step3 using Next button ->', () => {
        beforeEach(function (this: ThisTest) {
          this.wizardHelper.next();
          this.fixture.detectChanges();
        });

        it('All step Nav should be enabled', function (this: ThisTest) {
          expect(this.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
          expect(this.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
          expect(this.wizardHelper.isStepNavEnabled(2)).toBeTruthy();
        });

        it('activate should be called for step3', function (this: ThisTest) {
          expect(this.page3Model.activateCallsCount).toEqual(1);
          expect(this.wizardHelper.activePageTitle).toEqual(page3Title);
        });

        it('validate should be called for step2', function (this: ThisTest) {
          expect(this.page2Model.validateCallsCount).toEqual(1);
        });

        describe('Go back to step 1 using Step Nav ->', () => {
          beforeEach(function (this: ThisTest) {
            this.wizardHelper.navigateToStep(0);
            this.fixture.detectChanges();
          });

          it('All step Nav should be enabled', function (this: ThisTest) {
            expect(this.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
            expect(this.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
            expect(this.wizardHelper.isStepNavEnabled(2)).toBeTruthy();
          });

          it('activate should be called for step1', function (this: ThisTest) {
            expect(this.page1Model.activateCallsCount).toEqual(2);
            expect(this.wizardHelper.activePageTitle).toEqual(page1Title);
          });

          it('validate should NOT be called for step3', function (this: ThisTest) {
            expect(this.page3Model.validateCallsCount).toEqual(0);
          });

          describe('Go to step 2 using Step Nav ->', () => {
            beforeEach(function (this: ThisTest) {
              this.wizardHelper.navigateToStep(1);
              this.fixture.detectChanges();
            });

            it('All step Nav should be enabled', function (this: ThisTest) {
              expect(this.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
              expect(this.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
              expect(this.wizardHelper.isStepNavEnabled(2)).toBeTruthy();
            });

            it('activate should be called for step2', function (this: ThisTest) {
              expect(this.page2Model.activateCallsCount).toEqual(2);
              expect(this.wizardHelper.activePageTitle).toEqual(page2Title);
            });

            it('validate should be called for step1', function (this: ThisTest) {
              expect(this.page1Model.validateCallsCount).toEqual(2);
            });
          });

          describe('Go to step 3 using Step Nav ->', () => {
            beforeEach(function (this: ThisTest) {
              this.wizardHelper.navigateToStep(2);
              this.fixture.detectChanges();
            });

            it('All step Nav should be enabled', function (this: ThisTest) {
              expect(this.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
              expect(this.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
              expect(this.wizardHelper.isStepNavEnabled(2)).toBeTruthy();
            });

            it('activate should be called for step3', function (this: ThisTest) {
              expect(this.page3Model.activateCallsCount).toEqual(2);
              expect(this.wizardHelper.activePageTitle).toEqual(page3Title);
            });

            it('validate should be called for step1', function (this: ThisTest) {
              expect(this.page1Model.validateCallsCount).toEqual(2);
            });
          });

          describe('Step 1 is invalid ->', () => {
            beforeEach(function (this: ThisTest) {
              this.page1Model.validationResult = false;
              this.fixture.detectChanges();
            });

            describe('Go to step 2 using Step Nav ->', () => {
              beforeEach(function (this: ThisTest) {
                this.wizardHelper.navigateToStep(1);
                this.fixture.detectChanges();
              });

              it('All step Nav should be enabled', function (this: ThisTest) {
                expect(this.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
                expect(this.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
                expect(this.wizardHelper.isStepNavEnabled(2)).toBeTruthy();
              });

              it('activate should NOT be called for step2', function (this: ThisTest) {
                expect(this.page2Model.activateCallsCount).toEqual(1);
                expect(this.wizardHelper.activePageTitle).toEqual(page1Title);
              });

              it('validate should be called for step1', function (this: ThisTest) {
                expect(this.page1Model.validateCallsCount).toEqual(2);
              });
            });

            describe('Go to step 3 using Step Nav ->', () => {
              beforeEach(function (this: ThisTest) {
                this.wizardHelper.navigateToStep(2);
                this.fixture.detectChanges();
              });

              it('All step Nav should be enabled', function (this: ThisTest) {
                expect(this.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
                expect(this.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
                expect(this.wizardHelper.isStepNavEnabled(2)).toBeTruthy();
              });

              it('activate should NOT be called for step3', function (this: ThisTest) {
                expect(this.page3Model.activateCallsCount).toEqual(1);
                expect(this.wizardHelper.activePageTitle).toEqual(page1Title);
              });

              it('validate should be called for step1', function (this: ThisTest) {
                expect(this.page1Model.validateCallsCount).toEqual(2);
              });
            });
          });
        });
      });

      describe('Go back to step 1 using Step Nav ->', () => {
        beforeEach(function (this: ThisTest) {
          this.wizardHelper.navigateToStep(0);
          this.fixture.detectChanges();
        });

        it('Only step 3 is disabled', function (this: ThisTest) {
          expect(this.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
          expect(this.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
          expect(this.wizardHelper.isStepNavEnabled(2)).toBeFalsy();
        });

        it('activate should be called for step1', function (this: ThisTest) {
          expect(this.page1Model.activateCallsCount).toEqual(2);
          expect(this.wizardHelper.activePageTitle).toEqual(page1Title);
        });

        it('validate should NOT be called for step2', function (this: ThisTest) {
          expect(this.page2Model.validateCallsCount).toEqual(0);
        });

        describe('WHEN there is a change in wizard model ->', () => {
          beforeEach(function (this: ThisTest) {
            this.page1Model.var1Value = 1;
          });

          describe('Go to step2 using Step Nav ->', () => {
            beforeEach(function (this: ThisTest) {
              this.wizardHelper.navigateToStep(1);
              this.fixture.detectChanges();
            });

            it('Only step 1 is enabled', function (this: ThisTest) {
              expect(this.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
              expect(this.wizardHelper.isStepNavEnabled(1)).toBeFalsy();
              expect(this.wizardHelper.isStepNavEnabled(2)).toBeFalsy();
            });

            it('activate should NOT be called for step2', function (this: ThisTest) {
              expect(this.page2Model.activateCallsCount).toEqual(1);
              expect(this.wizardHelper.activePageTitle).toEqual(page1Title);
            });

            it('validate should be called for step1', function (this: ThisTest) {
              expect(this.page1Model.validateCallsCount).toEqual(2);
            });
          });
        });

        describe('Go to step2 using Step Nav ->', () => {
          beforeEach(function (this: ThisTest) {
            this.wizardHelper.navigateToStep(1);
            this.fixture.detectChanges();
          });

          it('Only step 3 is disabled', function (this: ThisTest) {
            expect(this.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
            expect(this.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
            expect(this.wizardHelper.isStepNavEnabled(2)).toBeFalsy();
          });

          it('activate should be called for step2', function (this: ThisTest) {
            expect(this.page2Model.activateCallsCount).toEqual(2);
            expect(this.wizardHelper.activePageTitle).toEqual(page2Title);
          });

          it('validate should be called for step1', function (this: ThisTest) {
            expect(this.page1Model.validateCallsCount).toEqual(2);
          });
        });
      });

      describe('Step2 is invalid ->', () => {
        beforeEach(function (this: ThisTest) {
          this.page2Model.validationResult = false;
        });

        describe('Go back to step 1 using Step Nav, Step2 is invalid ->', () => {
          beforeEach(function (this: ThisTest) {
            this.wizardHelper.navigateToStep(0);
            this.fixture.detectChanges();
          });

          it('Only step 3 is disabled', function (this: ThisTest) {
            expect(this.wizardHelper.isStepNavEnabled(0)).toBeTruthy();
            expect(this.wizardHelper.isStepNavEnabled(1)).toBeTruthy();
            expect(this.wizardHelper.isStepNavEnabled(2)).toBeFalsy();
          });

          it('activate should be called for step1', function (this: ThisTest) {
            expect(this.page1Model.activateCallsCount).toEqual(2);
            expect(this.wizardHelper.activePageTitle).toEqual(page1Title);
          });

          it('validate should NOT be called for step2', function (this: ThisTest) {
            expect(this.page1Model.validateCallsCount).toEqual(1);
          });
        });
      });
    });
  });

  describe('WHEN StepModel.readyToComplete=false', () => {
    beforeEach(function (this: ThisTest) {
      this.fixture.detectChanges();
      this.wizardHelper.next();
      this.fixture.detectChanges(); // in Step 2
      this.page2Model.readyToComplete = false;
      this.fixture.detectChanges();
    });

    it('Next button should be disabled', function (this: ThisTest) {
      expect(this.wizardHelper.activePageTitle).toEqual(page2Title);
      expect(this.component.isNextButtonDisabled).toEqual(true);
    });

    it('Cannot go to Next step', function (this: ThisTest) {
      this.wizardHelper.next();
      this.fixture.detectChanges();
      expect(this.wizardHelper.activePageTitle).toEqual(page2Title);
    });

    it('Can go to Previous step', function (this: ThisTest) {
      this.wizardHelper.back();
      this.fixture.detectChanges();
      expect(this.wizardHelper.activePageTitle).toEqual(page1Title);
    });
  });

  describe('WHEN StepValidationState.isValid()=false', () => {
    beforeEach(function (this: ThisTest) {
      this.fixture.detectChanges();
      this.wizardHelper.next();
      this.fixture.detectChanges(); // in Step 2
      this.page2Model.validationState.errors = ['Error Message'];
      this.fixture.detectChanges();
    });

    it('Next button should be enabled', function (this: ThisTest) {
      expect(this.wizardHelper.activePageTitle).toEqual(page2Title);
      expect(this.component.isNextButtonDisabled).toEqual(false);
    });

    it('Cannot go to Next step', function (this: ThisTest) {
      this.wizardHelper.next();
      this.fixture.detectChanges();
      expect(this.wizardHelper.activePageTitle).toEqual(page2Title);
    });

    it('Can go to Previous step', function (this: ThisTest) {
      this.wizardHelper.back();
      this.fixture.detectChanges();
      expect(this.wizardHelper.activePageTitle).toEqual(page1Title);
    });
  });

  describe('WHEN Step#summary is defined', () => {
    beforeEach(function (this: ThisTest) {
      this.page1.summary = (builder: PropertyViewSectionBuilder): PropertyViewSectionModel => {
        return builder.build();
      };
      this.page2.summary = (builder: PropertyViewSectionBuilder): PropertyViewSectionModel => {
        return builder.build();
      };
      this.component.pages = [this.page1, this.page2, this.page3];
      this.fixture.detectChanges();
    });

    it('THEN, SummaryComponent should be appended', function (this: ThisTest) {
      expect(this.component.pages.length).toEqual(4);
      expect(this.component.pages[3].componentClass).toEqual(SummaryComponent);
    });

    describe('WHEN all pages are relevant', () => {
      it('THEN, appfx-summary should be rendered in last step', function (this: ThisTest) {
        this.wizardHelper.next();
        this.wizardHelper.next();
        this.wizardHelper.next();
        expect(this.wizardHelper.activePageTitle).toEqual('Ready To Complete');
        expect(this.fixture.debugElement.query(By.css('appfx-summary'))).toBeDefined();
      });

      it('THEN, should have section from all pages', function (this: ThisTest) {
        this.wizardHelper.next();
        this.wizardHelper.next();
        this.wizardHelper.next();
        const propertyViewSections = ((this.component.pages[3] as any)['modelInstance'] as SummaryModel).data
          .categories[0].content;

        expect(propertyViewSections.length).toEqual(2);
        expect(propertyViewSections[0].title).toEqual(this.page1.navTitle as string);
        expect(propertyViewSections[1].title).toEqual(this.page2.navTitle as string);
      });
    });

    describe('WHEN some pages are NOT relevant', () => {
      beforeEach(function (this: ThisTest) {
        this.page2.isRelevant = Var.of(false);
        this.component.pages = [this.page1, this.page2, this.page3];
        this.fixture.detectChanges();
      });

      it('THEN, appfx-summary should be rendered in last step', function (this: ThisTest) {
        this.wizardHelper.next();
        this.wizardHelper.next();
        expect(this.wizardHelper.activePageTitle).toEqual('Ready To Complete');
        expect(this.fixture.debugElement.query(By.css('appfx-summary'))).toBeDefined();
      });

      it('THEN, should have section from only relevant pages', function (this: ThisTest) {
        this.wizardHelper.next();
        this.wizardHelper.next();
        this.wizardHelper.next();
        const propertyViewSections = ((this.component.pages[3] as any)['modelInstance'] as SummaryModel).data
          .categories[0].content;
        expect(propertyViewSections.length).toEqual(1);
        expect(propertyViewSections[0].title).toEqual(this.page1.navTitle as string);
      });

      it('THEN, should have isSkpped state equal to true if all pages with summary are not relevant', function (this: ThisTest) {
        expect((<StepInternal>this.component.pages[3]).isSkipped).toEqual(false);
        this.page1.isRelevant = Var.of(false);
        this.component.pages = [this.page1, this.page2, this.page3];
        this.fixture.detectChanges();
        expect((<StepInternal>this.component.pages[3]).isSkipped).toEqual(true);
      });
    });
  });

  describe('zoom accessibility', () => {
    beforeEach(function (this: ThisTest) {
      this.component.pages = [this.page1, this.page2];
      this.zoomLevelService = TestBed.inject(ZoomLevelService);
    });

    describe('zoom2x', () => {
      beforeEach(function (this: ThisTest) {
        this.zoomLevelService['resizeSubject'].next(ZoomLevel.x2);
        this.fixture.detectChanges();
      });

      it('step nav panel is hidden by default', function (this: ThisTest) {
        expect(this.wizardHelper.isNavVisible()).toBeFalsy();
      });

      it('`Show step nav` burger icon is visible by default', function (this: ThisTest) {
        expect(this.wizardHelper.isShowNavIconVisible()).toBeTruthy();
      });

      it('page name is prefixed by visible page index', function (this: ThisTest) {
        expect(this.wizardHelper.activePageTitle).toEqual('1.\xA0' + this.page1.title);

        this.wizardHelper.next();

        expect(this.wizardHelper.activePageTitle).toEqual('2.\xA0' + this.page2.title);
      });

      describe('when `Show step nav` burger icon is clicked', () => {
        beforeEach(function (this: ThisTest) {
          this.wizardHelper.showNavigator();
          this.fixture.detectChanges();
        });

        it('step nav panel is opened', function (this: ThisTest) {
          expect(this.wizardHelper.isNavVisible()).toBeTruthy();
        });

        describe('when `Close step nav` icon icon is clicked', () => {
          beforeEach(function (this: ThisTest) {
            this.wizardHelper.closeNavigator();
            this.fixture.detectChanges();
          });

          it('step nav panel is closed', function (this: ThisTest) {
            expect(this.wizardHelper.isNavVisible()).toBeFalsy();
          });
        });
      });
    });

    describe('zoom4x', () => {
      beforeEach(function (this: ThisTest) {
        this.zoomLevelService['resizeSubject'].next(ZoomLevel.x4);
        this.fixture.detectChanges();
      });

      it('step nav panel is hidden by default', function (this: ThisTest) {
        expect(this.wizardHelper.isNavVisible()).toBeFalsy();
      });

      it('`Show step nav` burger icon is visible by default', function (this: ThisTest) {
        expect(this.wizardHelper.isShowNavIconVisible()).toBeTruthy();
      });

      it('page name is prefixed by visible page index', function (this: ThisTest) {
        expect(this.wizardHelper.activePageTitle).toEqual('1.\xA0' + this.page1.title);

        this.wizardHelper.next();

        expect(this.wizardHelper.activePageTitle).toEqual('2.\xA0' + this.page2.title);
      });

      describe('when `Show step nav` burger icon is clicked', () => {
        beforeEach(function (this: ThisTest) {
          this.wizardHelper.showNavigator();
          this.fixture.detectChanges();
        });

        it('step nav panel is opened', function (this: ThisTest) {
          expect(this.wizardHelper.isNavVisible()).toBeTruthy();
        });

        describe('when `Close step nav` icon icon is clicked', () => {
          beforeEach(function (this: ThisTest) {
            this.wizardHelper.closeNavigator();
            this.fixture.detectChanges();
          });

          it('step nav panel is closed', function (this: ThisTest) {
            expect(this.wizardHelper.isNavVisible()).toBeFalsy();
          });
        });
      });
    });
  });

  describe('Footer API', () => {
    it('WHEN footer config is NOT provided THEN no footer component is rendered', function (this: ThisTest) {
      expect(this.fixture.debugElement.query(By.css('.appfx-wizard-footer-component'))).toBeNull();
    });

    describe('WHEN footer config is provided', () => {
      beforeEach(function (this: ThisTest) {
        this.component.footer = { componentClass: MockFooterComponent };
        this.fixture.detectChanges();
      });

      it('THEN the footer inputs are updated when the step changes', function (this: ThisTest) {
        const getFooterInstance = () =>
          this.fixture.debugElement.query(By.directive(MockFooterComponent)).componentInstance as MockFooterComponent;

        const footer = getFooterInstance();
        expect(footer.currentStep).toBeDefined();
        expect(footer.currentStep.title).toEqual(this.page1.title);
        expect(footer.steps).toBeDefined();
        expect(footer.steps.length).toEqual(2);
        expect(footer.workflowModel).toBe(this.wizardModel);

        this.wizardHelper.next();
        this.fixture.detectChanges();

        const updatedFooter = getFooterInstance();
        expect(updatedFooter.currentStep.title).toEqual(this.page2.title);
        expect(updatedFooter.workflowModel).toBe(this.wizardModel);
      });
    });
  });
});
