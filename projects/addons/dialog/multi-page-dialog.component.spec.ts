/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { InteractivityChecker } from '@angular/cdk/a11y';
import { DebugElement, Directive, ElementRef, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { renderFixture } from '@clr/angular/utils/testing';
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
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    testContext.dialogModel = {};

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
    testContext.fixture = TestBed.createComponent(DialogComponent);

    testContext.mockElementRef = testContext.fixture.debugElement.injector.get(ElementRef);

    testContext.component = testContext.fixture.componentInstance;
    testContext.fixture.componentRef.setInput('model', testContext.dialogModel);
    testContext.fixture.componentRef.setInput('closeHandler', {
      onSubmit: () => of({}),
      onCancel: () => of({}),
    } as CloseHandler);
    vi.spyOn(testContext.component.openedChange, 'emit');
    vi.spyOn(testContext.component.onClose, 'emit');
    vi.spyOn(testContext.component.closeHandler, 'onSubmit');
    vi.spyOn(testContext.component.closeHandler as any, 'onCancel');

    renderFixture(testContext.fixture);
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });

  it('is created', () => {
    expect(testContext.component).toBeTruthy();
    expect(testContext.component.tabs).toBeTruthy();
  });

  const errorMessage = 'Error Message';
  describe('WHEN cancel button clicked', () => {
    it('THEN onCancel closeHandler is invoked and onClose event is emitted', () => {
      renderFixture(testContext.fixture);
      testContext.component.onCancelButtonClick();
      expect(testContext.component.closeHandler.onCancel).toHaveBeenCalled();
      expect(testContext.component.onClose.emit).toHaveBeenCalled();
      expect(testContext.component.openedChange.emit).toHaveBeenCalledWith(false);
    });

    describe('WHEN onCancel throws error', () => {
      beforeEach(() => {
        testContext.component.closeHandler.onCancel = () => throwError(errorMessage);
        vi.spyOn(testContext.component.closeHandler as any, 'onCancel');
        renderFixture(testContext.fixture);
        testContext.component.onCancelButtonClick();
        renderFixture(testContext.fixture);
      });

      it('THEN onCancel closeHandler is invoked and onClose event is NOT emitted', () => {
        expect(testContext.component.closeHandler.onCancel).toHaveBeenCalled();
        expect(testContext.component.onClose.emit).not.toHaveBeenCalled();
        expect(testContext.component.openedChange.emit).not.toHaveBeenCalled();
      });

      it('THEN closeHandlerValidationState has error message', () => {
        expect(testContext.component.closeHandlerValidationState.errors[0]).toEqual(errorMessage);
      });
    });
  });

  describe('WHEN close button clicked', () => {
    it('THEN onCancel closeHandler is invoked and onClose event is emitted', () => {
      renderFixture(testContext.fixture);
      testContext.component.onModalOpenChange(false);
      expect(testContext.component.closeHandler.onCancel).toHaveBeenCalled();
      expect(testContext.component.onClose.emit).toHaveBeenCalled();
      expect(testContext.component.openedChange.emit).toHaveBeenCalledWith(false);
    });

    describe('WHEN onCancel throws error', () => {
      beforeEach(() => {
        testContext.component.closeHandler.onCancel = () => throwError(errorMessage);
        vi.spyOn(testContext.component.closeHandler as any, 'onCancel');
        renderFixture(testContext.fixture);
        testContext.component.onModalOpenChange(false);
      });

      it('THEN onCancel closeHandler is invoked and onClose event is NOT emitted', () => {
        expect(testContext.component.closeHandler.onCancel).toHaveBeenCalled();
        expect(testContext.component.onClose.emit).not.toHaveBeenCalled();
        expect(testContext.component.openedChange.emit).not.toHaveBeenCalled();
      });

      it('THEN closeHandlerValidationState has error message', () => {
        expect(testContext.component.closeHandlerValidationState.errors[0]).toEqual(errorMessage);
      });
    });
  });

  const ipAllocationTitle = 'IP Allocation';
  describe('when all steps are valid', () => {
    beforeEach(() => {
      testContext.firstStepModel = new MockStepModel('resourcesProperty');
      testContext.steps = [
        {
          title: 'Resources',
          componentClass: MockStepComponent,
          model: testContext.firstStepModel,
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

      testContext.fixture.componentRef.setInput('steps', testContext.steps);
      renderFixture(testContext.fixture);
    });

    it('renders pages disabled when disableTabContent = true', () => {
      testContext.fixture.componentRef.setInput('disableTabsContent', true);
      renderFixture(testContext.fixture);

      expect(
        testContext.fixture.nativeElement.querySelectorAll('appfx-step-container')[0].classList.contains('div-disabled')
      ).toEqual(true);

      renderFixture(testContext.fixture);

      expect(
        testContext.fixture.nativeElement.querySelectorAll('appfx-step-container')[0].classList.contains('div-disabled')
      ).toEqual(true);
    });

    it('the first page is always instantiateLazy = false', () => {
      expect(testContext.steps[0].instantiateLazy).toEqual(false);
      expect(testContext.steps[1].instantiateLazy).toEqual(true);
      expect(testContext.steps[2].instantiateLazy).toEqual(true);
    });

    it('WHEN StepModel.readyToComplete=false, Ok button should be disabled', () => {
      testContext.firstStepModel.readyToComplete = false;
      renderFixture(testContext.fixture);
      expect(testContext.component.isOkButtonDisabled).toEqual(true);
    });

    it('should set a title', () => {
      testContext.fixture.componentRef.setInput('title', 'Title');
      renderFixture(testContext.fixture);

      expect(testContext.fixture.nativeElement.querySelector('.modal-title .primaryTitle').innerHTML).toEqual(
        testContext.component.title
      );
    });
  });

  describe('when one step is invalid', () => {
    beforeEach(() => {
      testContext.steps = [
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

      testContext.fixture.componentRef.setInput('steps', testContext.steps);
      renderFixture(testContext.fixture);
    });

    it('closes the dialog when when the OK button is clicked and all steps are valid', () => {
      vi.spyOn(testContext.component.tabs, 'validate$').mockReturnValue(of(true));

      testContext.component.onOkButtonClick();
      expect(testContext.component.closeHandler.onSubmit).toHaveBeenCalled();
      expect(testContext.component.openedChange.emit).toHaveBeenCalledWith(false);
      expect(testContext.component.onClose.emit).toHaveBeenCalled();
    });

    it('does not close the dialog when the OK button is clicked and onSubmit closeHandler throws Error', () => {
      testContext.component.closeHandler.onSubmit = () => throwError(errorMessage);
      vi.spyOn(testContext.component.closeHandler, 'onSubmit');

      renderFixture(testContext.fixture);
      testContext.component.onOkButtonClick();

      expect(testContext.component.closeHandler.onSubmit).toHaveBeenCalled();
      expect(testContext.component.openedChange.emit).not.toHaveBeenCalled();
      expect(testContext.component.onClose.emit).not.toHaveBeenCalled();
    });

    it(`validates all visited pages when OK is clicked
            and does not call onSubmit when #tabs.validate$ return false`, async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      vi.spyOn(testContext.component.tabs, 'validate$').mockReturnValue(of(false));

      testContext.component.onOkButtonClick();
      renderFixture(testContext.fixture);

      // The dialog is not closed
      expect(testContext.component.closeHandler.onSubmit).not.toHaveBeenCalledWith();
    });
  });

  describe('when the first step is skipped', () => {
    beforeEach(() => {
      testContext.steps = [
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
      testContext.steps[0].isRelevant = Var.from(relevanceProperty).by(prop => of(prop));
      relevanceProperty.value = false;

      testContext.fixture.componentRef.setInput('steps', testContext.steps);

      renderFixture(testContext.fixture);
    });

    it('the first page is skipped', () => {
      expect(testContext.steps[0].isSkipped).toEqual(true);
      expect(testContext.steps[1].isSkipped).toBeUndefined();
      expect(testContext.steps[2].isSkipped).toBeUndefined();
    });

    it('the second page is activated if the first one is skipped', () => {
      expect(testContext.steps[0].model.isActivated).toEqual(false);
      expect(testContext.steps[1].model.isActivated).toEqual(true);
    });

    it('renders page tabs links correctly', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      testContext.fixture.whenStable().then(() => {
        const tabsHelper = new TabsHelper(testContext.fixture.debugElement);
        const labels: string[] = tabsHelper
          .getLinkList()
          .map((link: DebugElement) => link.nativeElement.textContent.trim());
        expect(labels).toEqual([ipAllocationTitle, 'Details']);
      });
    });
  });

  describe('vertical tabs zoom accessibility', () => {
    beforeEach(() => {
      testContext.steps = [
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

      testContext.zoomLevelService = TestBed.inject(ZoomLevelService);
      testContext.fixture.componentRef.setInput('steps', testContext.steps);
      testContext.fixture.componentRef.setInput('tabLayout', TabLayout.vertical);
      renderFixture(testContext.fixture);
    });

    describe('zoom2x', () => {
      beforeEach(() => {
        testContext.zoomLevelService['resizeSubject'].next(ZoomLevel.x2);
        renderFixture(testContext.fixture);
      });

      it('appfx-tab-links is visible', () => {
        const appfxTabLinks = testContext.fixture.debugElement.query(By.css('appfx-tab-links'));
        expect(appfxTabLinks).toBeTruthy();
      });

      it('tabs panel is hidden by default', () => {
        const tabsHelper = new TabsHelper(testContext.fixture.debugElement);
        expect(tabsHelper.areTabsVisible()).toBeFalsy();
      });

      it('`Show tabs` burger icon is visible by default', () => {
        const showTabsIcon = testContext.fixture.debugElement.query(By.css(`.btn-show-tabs`));
        const isVisible = getComputedStyle(showTabsIcon.nativeElement)['display'] !== 'none';
        expect(isVisible).toBeTruthy();
      });

      it('tab name is visible in the dialog header', () => {
        const activeTabTitle = testContext.fixture.debugElement.query(By.css(`.nav-step-title`)).nativeElement
          .innerText;
        expect(activeTabTitle).toEqual(testContext.steps[0].title);
      });

      it('tab-content is visible by default', () => {
        const activeTabContent = testContext.fixture.debugElement.query(By.css('.tab-content.active'));
        expect(activeTabContent).toBeTruthy();
        const isVisible = getComputedStyle(activeTabContent.nativeElement)['display'] !== 'none';
        expect(isVisible).toBeTruthy();
      });

      it('tab nav is not visible by default', () => {
        const tabNav = testContext.fixture.debugElement.query(By.css('.nav'));
        const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
        expect(isVisible).toBeFalsy();
      });

      describe('when `Show tabs` burger icon is clicked', () => {
        beforeEach(() => {
          const showTabsIcon = testContext.fixture.debugElement.query(By.css(`.btn-show-tabs`));
          showTabsIcon.triggerEventHandler('click', null);
          renderFixture(testContext.fixture);
        });

        it('tabs panel is opened', () => {
          const tabsHelper = new TabsHelper(testContext.fixture.debugElement);
          expect(tabsHelper.areTabsVisible()).toBeTruthy();
        });

        it('showTabsLink is true', () => {
          expect(testContext.component.tabLinksOpened).toBeTruthy();
        });

        it('tab-content is hidden', () => {
          const tabContents = testContext.fixture.debugElement.queryAll(By.css(`.tab-content`));
          tabContents.forEach(tabContent => {
            const isVisible = getComputedStyle(tabContent.nativeElement)['display'] !== 'none';
            expect(isVisible).toBeFalsy();
          });
        });

        it('tab nav is visible', () => {
          const tabNav = testContext.fixture.debugElement.query(By.css('.nav'));
          const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
          expect(isVisible).toBeTruthy();
        });

        describe('when `Close tabs` icon is clicked', () => {
          beforeEach(() => {
            const closeTabsIcon = testContext.fixture.debugElement.query(By.css(`.btn-close-tabs`));
            closeTabsIcon.triggerEventHandler('click', null);
            renderFixture(testContext.fixture);
          });

          it('tabs panel is closed', () => {
            const tabsHelper = new TabsHelper(testContext.fixture.debugElement);
            expect(tabsHelper.areTabsVisible()).toBeFalsy();
          });

          it('tabs panel is closed', () => {
            const tabsHelper = new TabsHelper(testContext.fixture.debugElement);
            expect(tabsHelper.areTabsVisible()).toBeFalsy();
          });

          it('tab-content is visible', () => {
            const activeTabContent = testContext.fixture.debugElement.query(By.css('.tab-content.active'));
            expect(activeTabContent).toBeTruthy();
            const isVisible = getComputedStyle(activeTabContent.nativeElement)['display'] !== 'none';
            expect(isVisible).toBeTruthy();

            const inactiveTabContents = testContext.fixture.debugElement.queryAll(By.css('.tab-content:not(.active)'));
            expect(inactiveTabContents.length).toBeGreaterThan(0);
            inactiveTabContents.forEach(tabContent => {
              const isInactiveVisible = getComputedStyle(tabContent.nativeElement)['display'] !== 'none';
              expect(isInactiveVisible).toBeFalsy();
            });
          });

          it('tab nav is not visible', () => {
            const tabNav = testContext.fixture.debugElement.query(By.css('.nav'));
            const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
            expect(isVisible).toBeFalsy();
          });
        });
      });
    });

    describe('zoom4x', () => {
      beforeEach(() => {
        testContext.zoomLevelService['resizeSubject'].next(ZoomLevel.x4);
        renderFixture(testContext.fixture);
      });

      it('appfx-tab-links is visible', () => {
        const appfxTabLinks = testContext.fixture.debugElement.query(By.css('appfx-tab-links'));
        expect(appfxTabLinks).toBeTruthy();
      });

      it('tabs panel is hidden by default', () => {
        const tabsHelper = new TabsHelper(testContext.fixture.debugElement);
        expect(tabsHelper.areTabsVisible()).toBeFalsy();
      });

      it('`Show tabs` burger icon is visible by default', () => {
        const showTabsIcon = testContext.fixture.debugElement.query(By.css(`.btn-show-tabs`));
        const isVisible = getComputedStyle(showTabsIcon.nativeElement)['display'] !== 'none';
        expect(isVisible).toBeTruthy();
      });

      it('tab name is visible in the dialog header', () => {
        const activeTabTitle = testContext.fixture.debugElement.query(By.css(`.nav-step-title`)).nativeElement
          .innerText;
        expect(activeTabTitle).toEqual(testContext.steps[0].title);
      });

      it('tab-content is visible by default', () => {
        const activeTabContent = testContext.fixture.debugElement.query(By.css('.tab-content.active'));
        expect(activeTabContent).toBeTruthy();
        const isVisible = getComputedStyle(activeTabContent.nativeElement)['display'] !== 'none';
        expect(isVisible).toBeTruthy();
      });

      it('tab nav is not visible by default', () => {
        const tabNav = testContext.fixture.debugElement.query(By.css('.nav'));
        const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
        expect(isVisible).toBeFalsy();
      });

      describe('when `Show tabs` burger icon is clicked', () => {
        beforeEach(() => {
          const showTabsIcon = testContext.fixture.debugElement.query(By.css(`.btn-show-tabs`));
          showTabsIcon.triggerEventHandler('click', null);
          renderFixture(testContext.fixture);
        });

        it('tabs panel is opened', () => {
          const tabsHelper = new TabsHelper(testContext.fixture.debugElement);
          expect(tabsHelper.areTabsVisible()).toBeTruthy();
        });

        it('showTabsLink is true', () => {
          expect(testContext.component.tabLinksOpened).toBeTruthy();
        });

        it('tab-content is hidden', () => {
          const tabContents = testContext.fixture.debugElement.queryAll(By.css(`.tab-content`));
          tabContents.forEach(tabContent => {
            const isVisible = getComputedStyle(tabContent.nativeElement)['display'] !== 'none';
            expect(isVisible).toBeFalsy();
          });
        });

        it('tab nav is visible', () => {
          const tabNav = testContext.fixture.debugElement.query(By.css('.nav'));
          const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
          expect(isVisible).toBeTruthy();
        });

        describe('when `Close tabs` icon is clicked', () => {
          beforeEach(() => {
            const closeTabsIcon = testContext.fixture.debugElement.query(By.css(`.btn-close-tabs`));
            closeTabsIcon.triggerEventHandler('click', null);
            renderFixture(testContext.fixture);
          });

          it('tabs panel is closed', () => {
            const tabsHelper = new TabsHelper(testContext.fixture.debugElement);
            expect(tabsHelper.areTabsVisible()).toBeFalsy();
          });

          it('tabs panel is closed', () => {
            const tabsHelper = new TabsHelper(testContext.fixture.debugElement);
            expect(tabsHelper.areTabsVisible()).toBeFalsy();
          });

          it('tab-content is visible', () => {
            const activeTabContent = testContext.fixture.debugElement.query(By.css('.tab-content.active'));
            expect(activeTabContent).toBeTruthy();
            const isVisible = getComputedStyle(activeTabContent.nativeElement)['display'] !== 'none';
            expect(isVisible).toBeTruthy();

            const inactiveTabContents = testContext.fixture.debugElement.queryAll(By.css('.tab-content:not(.active)'));
            expect(inactiveTabContents.length).toBeGreaterThan(0);
            inactiveTabContents.forEach(tabContent => {
              const isInactiveVisible = getComputedStyle(tabContent.nativeElement)['display'] !== 'none';
              expect(isInactiveVisible).toBeFalsy();
            });
          });

          it('tab nav is not visible', () => {
            const tabNav = testContext.fixture.debugElement.query(By.css('.nav'));
            const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
            expect(isVisible).toBeFalsy();
          });
        });
      });
    });
  });
});
