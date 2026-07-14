/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { InteractivityChecker } from '@angular/cdk/a11y';
import { DebugElement, Directive, ElementRef, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { IfTabActiveDirective, TabLinksComponent, Tabs } from '@clr/addons/tabs';
import {
  MockStepComponent,
  MockStepModel,
  MockWorkflowConfigurationService,
  MockWorkflowTestModule,
  TabsHelper,
  ZoomLevelServiceMock,
} from '@clr/addons/testing';
import {
  CloseHandler,
  StepContainer,
  TabLayout,
  ValidationBannerComponent,
  ValidationBannerInternalComponent,
  Var,
  WorkflowConfigurationService,
} from '@clr/addons/var';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { ClrAlertModule } from '@clr/angular/emphasis/alert';
import { ClrTabsModule } from '@clr/angular/layout/tabs';
import { ClrModalModule } from '@clr/angular/modal';
import { of, throwError } from 'rxjs';

import { DialogComponent } from './multi-page-dialog.component';

class MockElementRef extends ElementRef {
  nativeElement = {
    querySelector: () => {
      // no action
    },
  };

  constructor() {
    super(null);
  }
}

@Directive({
  selector: '[renderAsButton]',
  standalone: false,
})
class RenderAsButtonDirective {
  @Input() renderAsButton: boolean;
}

interface ThisTest {
  steps: any;
  dialogModel: any;
  fixture: ComponentFixture<DialogComponent>;
  component: DialogComponent;

  mockElementRef: MockElementRef;
  firstStepModel: MockStepModel;
  zoomLevelService: ZoomLevelService;
}

describe('Appfx Multi Page Dialog', () => {
  beforeEach(function (this: ThisTest) {
    this.dialogModel = {};

    TestBed.configureTestingModule({
      imports: [ClrAlertModule, ClrModalModule, ClrTabsModule, MockWorkflowTestModule],
      declarations: [
        DialogComponent,
        StepContainer,
        Tabs,
        TabLinksComponent,
        RenderAsButtonDirective,
        IfTabActiveDirective,
        ValidationBannerComponent,
        ValidationBannerInternalComponent,
      ],
      providers: [
        { provide: ElementRef, useClass: MockElementRef },
        WorkflowStrings,
        {
          provide: WorkflowConfigurationService,
          useClass: MockWorkflowConfigurationService,
        },
        {
          provide: ZoomLevelService,
          useClass: ZoomLevelServiceMock,
        },
      ],
    }).overrideProvider(InteractivityChecker, {
      useValue: {
        isFocusable: () => true,
      },
    });
    this.fixture = TestBed.createComponent(DialogComponent);

    this.mockElementRef = this.fixture.debugElement.injector.get(ElementRef);

    this.component = this.fixture.componentInstance;
    this.component.model = this.dialogModel;
    this.component.closeHandler = {
      onSubmit: () => of({}),
      onCancel: () => of({}),
    } as CloseHandler;
    spyOn(this.component.openedChange, 'emit').and.callThrough();
    spyOn(this.component.onClose, 'emit').and.callThrough();
    spyOn(this.component.closeHandler, 'onSubmit').and.callThrough();
    spyOn(this.component.closeHandler as any, 'onCancel').and.callThrough();

    this.fixture.detectChanges();
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });

  it('is created', function (this: ThisTest) {
    expect(this.component).toBeTruthy();
    expect(this.component.tabs).toBeTruthy();
  });

  const errorMessage = 'Error Message';
  describe('WHEN cancel button clicked', () => {
    it('THEN onCancel closeHandler is invoked and onClose event is emitted', function (this: ThisTest) {
      this.fixture.detectChanges();
      this.component.onCancelButtonClick();
      expect(this.component.closeHandler.onCancel).toHaveBeenCalled();
      expect(this.component.onClose.emit).toHaveBeenCalled();
      expect(this.component.openedChange.emit).toHaveBeenCalledWith(false);
    });

    describe('WHEN onCancel throws error', () => {
      beforeEach(function (this: ThisTest) {
        this.component.closeHandler.onCancel = () => throwError(errorMessage);
        spyOn(this.component.closeHandler as any, 'onCancel').and.callThrough();
        this.fixture.detectChanges();
        this.component.onCancelButtonClick();
        this.fixture.detectChanges();
      });

      it('THEN onCancel closeHandler is invoked and onClose event is NOT emitted', function (this: ThisTest) {
        expect(this.component.closeHandler.onCancel).toHaveBeenCalled();
        expect(this.component.onClose.emit).not.toHaveBeenCalled();
        expect(this.component.openedChange.emit).not.toHaveBeenCalled();
      });

      it('THEN closeHandlerValidationState has error message', function (this: ThisTest) {
        expect(this.component.closeHandlerValidationState.errors[0]).toEqual(errorMessage);
      });
    });
  });

  describe('WHEN close button clicked', () => {
    it('THEN onCancel closeHandler is invoked and onClose event is emitted', function (this: ThisTest) {
      this.fixture.detectChanges();
      this.component.onModalOpenChange(false);
      expect(this.component.closeHandler.onCancel).toHaveBeenCalled();
      expect(this.component.onClose.emit).toHaveBeenCalled();
      expect(this.component.openedChange.emit).toHaveBeenCalledWith(false);
    });

    describe('WHEN onCancel throws error', () => {
      beforeEach(function (this: ThisTest) {
        this.component.closeHandler.onCancel = () => throwError(errorMessage);
        spyOn(this.component.closeHandler as any, 'onCancel').and.callThrough();
        this.fixture.detectChanges();
        this.component.onModalOpenChange(false);
      });

      it('THEN onCancel closeHandler is invoked and onClose event is NOT emitted', function (this: ThisTest) {
        expect(this.component.closeHandler.onCancel).toHaveBeenCalled();
        expect(this.component.onClose.emit).not.toHaveBeenCalled();
        expect(this.component.openedChange.emit).not.toHaveBeenCalled();
      });

      it('THEN closeHandlerValidationState has error message', function (this: ThisTest) {
        expect(this.component.closeHandlerValidationState.errors[0]).toEqual(errorMessage);
      });
    });
  });

  const ipAllocationTitle = 'IP Allocation';
  describe('when all steps are valid', () => {
    beforeEach(function (this: ThisTest) {
      this.firstStepModel = new MockStepModel('resourcesProperty');
      this.steps = [
        {
          title: 'Resources',
          componentClass: MockStepComponent,
          model: this.firstStepModel,
          instantiateLazy: true,
        },
        {
          title: ipAllocationTitle,
          componentClass: MockStepComponent,
          model: new MockStepModel('ipAllocationProperty'),
          instantiateLazy: true,
        },
        {
          title: 'Details',
          componentClass: MockStepComponent,
          model: new MockStepModel('detailsProperty'),
          instantiateLazy: true,
        },
      ];

      this.component.steps = this.steps;
      this.fixture.detectChanges();
    });

    it('renders pages disabled when disableTabContent = true', function (this: ThisTest) {
      this.component.disableTabsContent = true;
      this.fixture.detectChanges();

      expect(
        this.fixture.nativeElement.querySelectorAll('appfx-step-container')[0].classList.contains('div-disabled')
      ).toEqual(true);

      this.fixture.detectChanges();

      expect(
        this.fixture.nativeElement.querySelectorAll('appfx-step-container')[0].classList.contains('div-disabled')
      ).toEqual(true);
    });

    it('the first page is always instantiateLazy = false', function (this: ThisTest) {
      expect(this.steps[0].instantiateLazy).toEqual(false);
      expect(this.steps[1].instantiateLazy).toEqual(true);
      expect(this.steps[2].instantiateLazy).toEqual(true);
    });

    it('WHEN StepModel.readyToComplete=false, Ok button should be disabled', function (this: ThisTest) {
      this.firstStepModel.readyToComplete = false;
      this.fixture.detectChanges();
      expect(this.component.isOkButtonDisabled).toEqual(true);
    });

    it('should set a title', function (this: ThisTest) {
      this.component.title = 'Title';
      this.fixture.detectChanges();

      expect(this.fixture.nativeElement.querySelector('.modal-title .primaryTitle').innerHTML).toEqual(
        this.component.title
      );
    });
  });

  describe('when one step is invalid', () => {
    beforeEach(function (this: ThisTest) {
      this.steps = [
        {
          title: 'Resources',
          componentClass: MockStepComponent,
          model: new MockStepModel('resourcesProperty'),
          instantiateLazy: true,
        },
        {
          title: ipAllocationTitle,
          componentClass: MockStepComponent,
          model: new MockStepModel('ipAllocationProperty'),
          instantiateLazy: true,
        },
        {
          title: 'Details',
          componentClass: MockStepComponent,
          model: new MockStepModel('detailsProperty'),
          instantiateLazy: true,
        },
      ];

      this.component.steps = this.steps;
      this.fixture.detectChanges();
    });

    it('closes the dialog when when the OK button is clicked and all steps are valid', function (this: ThisTest) {
      spyOn(this.component.tabs, 'validate$').and.returnValue(of(true));

      this.component.onOkButtonClick();
      expect(this.component.closeHandler.onSubmit).toHaveBeenCalled();
      expect(this.component.openedChange.emit).toHaveBeenCalledWith(false);
      expect(this.component.onClose.emit).toHaveBeenCalled();
    });

    it('does not close the dialog when the OK button is clicked and onSubmit closeHandler throws Error', function (this: ThisTest) {
      this.component.closeHandler.onSubmit = () => throwError(errorMessage);
      spyOn(this.component.closeHandler, 'onSubmit').and.callThrough();

      this.fixture.detectChanges();
      this.component.onOkButtonClick();

      expect(this.component.closeHandler.onSubmit).toHaveBeenCalled();
      expect(this.component.openedChange.emit).not.toHaveBeenCalled();
      expect(this.component.onClose.emit).not.toHaveBeenCalled();
    });

    it(`validates all visited pages when OK is clicked
            and does not call onSubmit when #tabs.validate$ return false`, fakeAsync(function (this: ThisTest) {
      spyOn(this.component.tabs, 'validate$').and.returnValue(of(false));

      this.component.onOkButtonClick();
      this.fixture.detectChanges();

      // The dialog is not closed
      expect(this.component.closeHandler.onSubmit).not.toHaveBeenCalledWith();
    }));
  });

  describe('when the first step is skipped', () => {
    beforeEach(function (this: ThisTest) {
      this.steps = [
        {
          title: 'Resources - skipped',
          componentClass: MockStepComponent,
          model: new MockStepModel('resourcesProperty'),
          instantiateLazy: true,
        },
        {
          title: ipAllocationTitle,
          componentClass: MockStepComponent,
          model: new MockStepModel('ipAllocationProperty'),
          instantiateLazy: true,
        },
        {
          title: 'Details',
          componentClass: MockStepComponent,
          model: new MockStepModel('detailsProperty'),
          instantiateLazy: true,
        },
      ];

      const relevanceProperty: Var<boolean> = Var.of<boolean>();
      this.steps[0].isRelevant = Var.from(relevanceProperty).by(prop => of(prop));
      relevanceProperty.value = false;

      this.component.steps = this.steps;

      this.fixture.detectChanges();
    });

    it('the first page is skipped', function (this: ThisTest) {
      expect(this.steps[0].isSkipped).toEqual(true);
      expect(this.steps[1].isSkipped).toBeUndefined();
      expect(this.steps[2].isSkipped).toBeUndefined();
    });

    it('the second page is activated if the first one is skipped', function (this: ThisTest) {
      expect(this.steps[0].model.isActivated).toEqual(false);
      expect(this.steps[1].model.isActivated).toEqual(true);
    });

    it('renders page tabs links correctly', fakeAsync(function (this: ThisTest) {
      this.fixture.whenStable().then(() => {
        const tabsHelper = new TabsHelper(this.fixture.debugElement);
        const labels: string[] = tabsHelper
          .getLinkList()
          .map((link: DebugElement) => link.nativeElement.textContent.trim());
        expect(labels).toEqual([ipAllocationTitle, 'Details']);
      });
    }));
  });

  describe('vertical tabs zoom accessibility', () => {
    beforeEach(function (this: ThisTest) {
      this.steps = [
        {
          title: 'Step 1',
          componentClass: MockStepComponent,
          model: new MockStepModel('step1'),
          instantiateLazy: true,
        },
        {
          title: 'Step 2',
          componentClass: MockStepComponent,
          model: new MockStepModel('step2'),
          instantiateLazy: true,
        },
        {
          title: 'Step 3',
          componentClass: MockStepComponent,
          model: new MockStepModel('step3'),
          instantiateLazy: true,
        },
        {
          title: 'Step 4',
          componentClass: MockStepComponent,
          model: new MockStepModel('step4'),
          instantiateLazy: true,
        },
        {
          title: 'Step 5',
          componentClass: MockStepComponent,
          model: new MockStepModel('step5'),
          instantiateLazy: true,
        },
      ];

      this.zoomLevelService = TestBed.inject(ZoomLevelService);
      this.component.steps = this.steps;
      this.component.tabLayout = TabLayout.vertical;
      this.fixture.detectChanges();
    });

    describe('zoom2x', () => {
      beforeEach(function (this: ThisTest) {
        this.zoomLevelService['resizeSubject'].next(ZoomLevel.x2);
        this.fixture.detectChanges();
      });

      it('appfx-tab-links is visible', function (this: ThisTest) {
        const appfxTabLinks = this.fixture.debugElement.query(By.css('appfx-tab-links'));
        expect(appfxTabLinks).toBeTruthy();
      });

      it('tabs panel is hidden by default', function (this: ThisTest) {
        const tabsHelper = new TabsHelper(this.fixture.debugElement);
        expect(tabsHelper.areTabsVisible()).toBeFalsy();
      });

      it('`Show tabs` burger icon is visible by default', function (this: ThisTest) {
        const showTabsIcon = this.fixture.debugElement.query(By.css(`.btn-show-tabs`));
        const isVisible = getComputedStyle(showTabsIcon.nativeElement)['display'] !== 'none';
        expect(isVisible).toBeTruthy();
      });

      it('tab name is visible in the dialog header', function (this: ThisTest) {
        const activeTabTitle = this.fixture.debugElement.query(By.css(`.nav-step-title`)).nativeElement.innerText;
        expect(activeTabTitle).toEqual(this.steps[0].title);
      });

      it('tab-content is visible by default', function (this: ThisTest) {
        const tabContents = this.fixture.debugElement.queryAll(By.css(`.tab-content`));
        tabContents.forEach(tabContent => {
          const isVisible = getComputedStyle(tabContent.nativeElement)['display'] !== 'none';
          expect(isVisible).toBeTruthy();
        });
      });

      it('tab nav is not visible by default', function (this: ThisTest) {
        const tabNav = this.fixture.debugElement.query(By.css('.nav'));
        const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
        expect(isVisible).toBeFalsy();
      });

      describe('when `Show tabs` burger icon is clicked', () => {
        beforeEach(function (this: ThisTest) {
          const showTabsIcon = this.fixture.debugElement.query(By.css(`.btn-show-tabs`));
          showTabsIcon.triggerEventHandler('click', null);
          this.fixture.detectChanges();
        });

        it('tabs panel is opened', function (this: ThisTest) {
          const tabsHelper = new TabsHelper(this.fixture.debugElement);
          expect(tabsHelper.areTabsVisible()).toBeTruthy();
        });

        it('showTabsLink is true', function (this: ThisTest) {
          expect(this.component.tabLinksOpened).toBeTruthy();
        });

        it('tab-content is hidden', function (this: ThisTest) {
          const tabContents = this.fixture.debugElement.queryAll(By.css(`.tab-content`));
          tabContents.forEach(tabContent => {
            const isVisible = getComputedStyle(tabContent.nativeElement)['display'] !== 'none';
            expect(isVisible).toBeFalsy();
          });
        });

        it('tab nav is visible', function (this: ThisTest) {
          const tabNav = this.fixture.debugElement.query(By.css('.nav'));
          const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
          expect(isVisible).toBeTruthy();
        });

        describe('when `Close tabs` icon is clicked', () => {
          beforeEach(function (this: ThisTest) {
            const closeTabsIcon = this.fixture.debugElement.query(By.css(`.btn-close-tabs`));
            closeTabsIcon.triggerEventHandler('click', null);
            this.fixture.detectChanges();
          });

          it('tabs panel is closed', function (this: ThisTest) {
            const tabsHelper = new TabsHelper(this.fixture.debugElement);
            expect(tabsHelper.areTabsVisible()).toBeFalsy();
          });

          it('tabs panel is closed', function (this: ThisTest) {
            const tabsHelper = new TabsHelper(this.fixture.debugElement);
            expect(tabsHelper.areTabsVisible()).toBeFalsy();
          });

          it('tab-content is visible', function (this: ThisTest) {
            const tabContents = this.fixture.debugElement.queryAll(By.css(`.tab-content`));
            tabContents.forEach(tabContent => {
              const isVisible = getComputedStyle(tabContent.nativeElement)['display'] !== 'none';
              expect(isVisible).toBeTruthy();
            });
          });

          it('tab nav is not visible', function (this: ThisTest) {
            const tabNav = this.fixture.debugElement.query(By.css('.nav'));
            const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
            expect(isVisible).toBeFalsy();
          });
        });
      });
    });

    describe('zoom4x', () => {
      beforeEach(function (this: ThisTest) {
        this.zoomLevelService['resizeSubject'].next(ZoomLevel.x4);
        this.fixture.detectChanges();
      });

      it('appfx-tab-links is visible', function (this: ThisTest) {
        const appfxTabLinks = this.fixture.debugElement.query(By.css('appfx-tab-links'));
        expect(appfxTabLinks).toBeTruthy();
      });

      it('tabs panel is hidden by default', function (this: ThisTest) {
        const tabsHelper = new TabsHelper(this.fixture.debugElement);
        expect(tabsHelper.areTabsVisible()).toBeFalsy();
      });

      it('`Show tabs` burger icon is visible by default', function (this: ThisTest) {
        const showTabsIcon = this.fixture.debugElement.query(By.css(`.btn-show-tabs`));
        const isVisible = getComputedStyle(showTabsIcon.nativeElement)['display'] !== 'none';
        expect(isVisible).toBeTruthy();
      });

      it('tab name is visible in the dialog header', function (this: ThisTest) {
        const activeTabTitle = this.fixture.debugElement.query(By.css(`.nav-step-title`)).nativeElement.innerText;
        expect(activeTabTitle).toEqual(this.steps[0].title);
      });

      it('tab-content is visible by default', function (this: ThisTest) {
        const tabContents = this.fixture.debugElement.queryAll(By.css(`.tab-content`));
        tabContents.forEach(tabContent => {
          const isVisible = getComputedStyle(tabContent.nativeElement)['display'] !== 'none';
          expect(isVisible).toBeTruthy();
        });
      });

      it('tab nav is not visible by default', function (this: ThisTest) {
        const tabNav = this.fixture.debugElement.query(By.css('.nav'));
        const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
        expect(isVisible).toBeFalsy();
      });

      describe('when `Show tabs` burger icon is clicked', () => {
        beforeEach(function (this: ThisTest) {
          const showTabsIcon = this.fixture.debugElement.query(By.css(`.btn-show-tabs`));
          showTabsIcon.triggerEventHandler('click', null);
          this.fixture.detectChanges();
        });

        it('tabs panel is opened', function (this: ThisTest) {
          const tabsHelper = new TabsHelper(this.fixture.debugElement);
          expect(tabsHelper.areTabsVisible()).toBeTruthy();
        });

        it('showTabsLink is true', function (this: ThisTest) {
          expect(this.component.tabLinksOpened).toBeTruthy();
        });

        it('tab-content is hidden', function (this: ThisTest) {
          const tabContents = this.fixture.debugElement.queryAll(By.css(`.tab-content`));
          tabContents.forEach(tabContent => {
            const isVisible = getComputedStyle(tabContent.nativeElement)['display'] !== 'none';
            expect(isVisible).toBeFalsy();
          });
        });

        it('tab nav is visible', function (this: ThisTest) {
          const tabNav = this.fixture.debugElement.query(By.css('.nav'));
          const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
          expect(isVisible).toBeTruthy();
        });

        describe('when `Close tabs` icon is clicked', () => {
          beforeEach(function (this: ThisTest) {
            const closeTabsIcon = this.fixture.debugElement.query(By.css(`.btn-close-tabs`));
            closeTabsIcon.triggerEventHandler('click', null);
            this.fixture.detectChanges();
          });

          it('tabs panel is closed', function (this: ThisTest) {
            const tabsHelper = new TabsHelper(this.fixture.debugElement);
            expect(tabsHelper.areTabsVisible()).toBeFalsy();
          });

          it('tabs panel is closed', function (this: ThisTest) {
            const tabsHelper = new TabsHelper(this.fixture.debugElement);
            expect(tabsHelper.areTabsVisible()).toBeFalsy();
          });

          it('tab-content is visible', function (this: ThisTest) {
            const tabContents = this.fixture.debugElement.queryAll(By.css(`.tab-content`));
            tabContents.forEach(tabContent => {
              const isVisible = getComputedStyle(tabContent.nativeElement)['display'] !== 'none';
              expect(isVisible).toBeTruthy();
            });
          });

          it('tab nav is not visible', function (this: ThisTest) {
            const tabNav = this.fixture.debugElement.query(By.css('.nav'));
            const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
            expect(isVisible).toBeFalsy();
          });
        });
      });
    });
  });
});
