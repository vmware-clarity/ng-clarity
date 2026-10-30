/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DebugElement, Directive, ElementRef, Host, Input, Self } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { ZoomLevelServiceMock } from '@clr/addons/testing';
import {
  Step,
  StepContainer,
  StepInternal,
  TabLayout,
  Var,
  WorkflowConfigurationService,
  WorkflowModelManager,
} from '@clr/addons/var';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { ClrIcon } from '@clr/angular/icon';
import { ClrTab, ClrTabsModule } from '@clr/angular/layout/tabs';
import { renderFixture } from '@clr/angular/utils/testing';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  InvalidMockComponent,
  MockStepComponent,
  MockStepModel,
  MockWorkflowConfigurationService,
  MockWorkflowTestModule,
  TabsHelper,
} from '../testing';
import { RenderAsButtonDirective } from './render-as-button/render-as-button.directive';
import { TabLinksComponent } from './tab-links/tab-links.component';
import { TabsComponent } from './tabs.component';

class MockWorkflowModelManager {
  injectPropertiesToPendingStep() {
    // no action
  }

  ejectPropertiesFromCurrentStep() {
    // no action
  }
}

class MockElementRef extends ElementRef {
  override nativeElement = {
    querySelector: () => {
      // no action
    },
  };

  constructor() {
    super(null);
  }
}

// Mirrors only the activation wiring of the real IfTabActiveDirective (so Clarity's native
// [hidden]/`.active` tab-content state reflects `activeTabStep` in tests), without its
// `currentChange` subscription: that subscription re-emits `appfxIfTabActiveChange` for every
// tab on every activation, which double-invokes `onStepActiveChange` and corrupts the
// step-validation assertions below.
@Directive({
  selector: '[appfxIfTabActive]',
  standalone: false,
})
class DummyIfTabActiveDirective {
  @Input() activeClass: string;

  constructor(
    @Host()
    @Self()
    private tab: ClrTab
  ) {}

  @Input()
  set activateTab(value: boolean) {
    if (value && this.tab.ifActiveService.current !== this.tab.id) {
      this.tab.ifActiveService.current = this.tab.id;
    }
  }
}

interface ThisTest {
  steps: Step[];
  tabsModel: any;
  fixture: ComponentFixture<TabsComponent>;
  component: TabsComponent;
  modelManager: WorkflowModelManager;
  mockElementRef: MockElementRef;
  firstStepModel: MockStepModel;
  zoomLevelService: ZoomLevelService;
}

describe('Appfx Tabs', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    testContext.tabsModel = {};

    TestBed.configureTestingModule({
      imports: [ClrTabsModule, ClrIcon, MockWorkflowTestModule],
      declarations: [
        TabsComponent,
        StepContainer,
        TabLinksComponent,
        RenderAsButtonDirective,
        DummyIfTabActiveDirective,
      ],
      providers: [
        WorkflowStrings,
        { provide: WorkflowModelManager, useClass: MockWorkflowModelManager },
        { provide: ElementRef, useClass: MockElementRef },
        {
          provide: WorkflowConfigurationService,
          useClass: MockWorkflowConfigurationService,
        },
        {
          provide: ZoomLevelService,
          useClass: ZoomLevelServiceMock,
        },
      ],
    });
    testContext.fixture = TestBed.createComponent(TabsComponent);

    testContext.modelManager = testContext.fixture.debugElement.injector.get(WorkflowModelManager);
    testContext.mockElementRef = testContext.fixture.debugElement.injector.get(ElementRef);

    testContext.component = testContext.fixture.componentInstance;
    testContext.fixture.componentRef.setInput('model', testContext.tabsModel);

    vi.spyOn(testContext.modelManager, 'injectPropertiesToPendingStep');
    vi.spyOn(testContext.modelManager, 'ejectPropertiesFromCurrentStep');

    renderFixture(testContext.fixture);
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });

  const ipAllocationStepTitle = 'IP Allocation';
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
          title: ipAllocationStepTitle,
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

      testContext.fixture.componentRef.setInput('tabs', testContext.steps);
      renderFixture(testContext.fixture);
    });

    it('renders pages disabled when disableTabContent = true', () => {
      testContext.fixture.componentRef.setInput('disableTabsContent', true);
      renderFixture(testContext.fixture);

      expect(
        testContext.fixture.nativeElement.querySelectorAll('appfx-step-container')[0].classList.contains('div-disabled')
      ).toEqual(true);

      testContext.component.onStepActiveChange(testContext.steps[2], true);
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
          title: ipAllocationStepTitle,
          componentClass: MockStepComponent,
          model: new MockStepModel('ipAllocationProperty'),
          instantiateLazy: true,
        },
        {
          title: 'Details',
          componentClass: InvalidMockComponent,
          model: new MockStepModel('detailsProperty'),
          instantiateLazy: true,
        },
      ];

      testContext.fixture.componentRef.setInput('tabs', testContext.steps);
      renderFixture(testContext.fixture);
    });

    it(
      'renders page tabs links correctly, shows the first page and clicking' +
        ' on a page tab opens the page associated with that tab',
      async () => {
        return testContext.fixture.whenStable().then(() => {
          expect(testContext.modelManager.injectPropertiesToPendingStep).toHaveBeenCalledWith(testContext.steps[0]);

          const tabsHelper = new TabsHelper(testContext.fixture.debugElement);
          const labels: string[] = tabsHelper
            .getLinkList()
            .map((link: DebugElement) => link.nativeElement.textContent.trim());
          expect(labels).toEqual(['Resources', ipAllocationStepTitle, 'Details']);

          testContext.component.onStepActiveChange(testContext.steps[2], true);
          renderFixture(testContext.fixture);

          expect(testContext.modelManager.injectPropertiesToPendingStep).toHaveBeenCalledWith(testContext.steps[2]);
          expect(testContext.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(testContext.steps[0]);
        });
      }
    );

    it('activates the next page when navigating to another page', () => {
      verifyAllStepPagesNotValidated(testContext.steps);

      testContext.component.onStepActiveChange(testContext.steps[1], true);
      renderFixture(testContext.fixture);

      expect((testContext.steps[1].model as MockStepModel).isActivated).toEqual(true);
      expect((testContext.steps[2].model as MockStepModel).isActivated).toEqual(false);

      testContext.component.onStepActiveChange(testContext.steps[2], true);
      renderFixture(testContext.fixture);

      expect((testContext.steps[2].model as MockStepModel).isActivated).toEqual(true);
    });

    it('validates the current page when navigating to another page', () => {
      expect((testContext.steps[0].model as MockStepModel).isValidated).toEqual(false);

      testContext.component.onStepActiveChange(testContext.steps[1], true);

      renderFixture(testContext.fixture);

      expect((testContext.steps[0].model as MockStepModel).isValidated).toEqual(true);
      expect((testContext.steps[1].model as MockStepModel).isValidated).toEqual(false);

      testContext.component.onStepActiveChange(testContext.steps[0], true);
      renderFixture(testContext.fixture);

      expect((testContext.steps[1].model as MockStepModel).isValidated).toEqual(true);
    });

    it('does not validate the current page when navigating to another page when disableTabsContent = true', () => {
      testContext.fixture.componentRef.setInput('disableTabsContent', true);
      renderFixture(testContext.fixture);

      expect((testContext.steps[0].model as MockStepModel).isValidated).toEqual(false);
      expect((testContext.steps[1].model as MockStepModel).isValidated).toEqual(false);
      testContext.component.onStepActiveChange(testContext.steps[1], true);

      renderFixture(testContext.fixture);

      expect((testContext.steps[0].model as MockStepModel).isValidated).toEqual(false);
      expect((testContext.steps[1].model as MockStepModel).isValidated).toEqual(false);
    });

    it('return true when validate$ method is called and all steps are valid', () => {
      expect((testContext.steps[0].model as MockStepModel).isValidated).toEqual(false);
      expect((testContext.steps[1].model as MockStepModel).isValidated).toEqual(false);

      testContext.component.onStepActiveChange(testContext.steps[1], true);
      renderFixture(testContext.fixture);

      expect((testContext.steps[0].model as MockStepModel).isValidated).toEqual(true);
      expect(testContext.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(testContext.steps[0]);

      expect((testContext.steps[1].model as MockStepModel).isValidated).toEqual(false);

      let isValid = false;
      testContext.component
        .validate$()
        .pipe(take(1))
        .subscribe(valid => {
          isValid = valid;
        });

      expect((testContext.steps[1].model as MockStepModel).isValidated).toEqual(true);
      expect(testContext.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(testContext.steps[1]);
      expect(isValid, 'All steps should be valid').toBeTruthy();
    });

    it('validates all visited pages when validate$ is called and navigates to the invalid page', async () => {
      verifyAllStepPagesNotValidated(testContext.steps);

      // Activate the invalid page
      testContext.component.onStepActiveChange(testContext.steps[2], true);
      renderFixture(testContext.fixture);

      expect(testContext.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(testContext.steps[0]);

      expect(
        testContext.steps.map(step => (step.model as MockStepModel).isValidated),
        'First page should be validated'
      ).toEqual([true, false, false]);

      expect((testContext.steps[2].model as MockStepModel).isActivated).toEqual(true);

      // Go to the second valid page
      testContext.component.onStepActiveChange(testContext.steps[1], true);
      renderFixture(testContext.fixture);

      expect(testContext.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(testContext.steps[2]);

      expect((testContext.steps[2].model as MockStepModel).isValidated).toEqual(true);

      let isValid = false;
      testContext.component
        .validate$()
        .pipe(take(1))
        .subscribe(valid => {
          isValid = valid;
        });
      renderFixture(testContext.fixture);

      // The user is navigated to the first invalid page and it is activated
      expect(testContext.modelManager.injectPropertiesToPendingStep).toHaveBeenCalledWith(testContext.steps[2]);

      // The validate$ returns false
      expect(isValid, 'The third page should be invalid').toBeFalsy();
    });

    it('does not validate pages when validate$ is called, one step is invalid and disableTabsContent = true', () => {
      testContext.fixture.componentRef.setInput('disableTabsContent', true);
      renderFixture(testContext.fixture);

      verifyAllStepPagesNotValidated(testContext.steps);

      testContext.component.onStepActiveChange(testContext.steps[1], true);
      renderFixture(testContext.fixture);

      expect((testContext.steps[0].model as MockStepModel).isValidated).toEqual(false);
      expect(testContext.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(testContext.steps[0]);

      let isValid = false;
      testContext.component
        .validate$()
        .pipe(take(1))
        .subscribe(valid => {
          isValid = valid;
        });

      expect((testContext.steps[1].model as MockStepModel).isValidated).toEqual(false);
      expect(testContext.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(testContext.steps[1]);
      expect(isValid, 'The second page should be valid').toBeTruthy();
    });

    it('validates the active pages when validateActiveTab$ is called and current tab is valid', async () => {
      verifyAllStepPagesNotValidated(testContext.steps);

      // Activate the invalid page
      testContext.component.onStepActiveChange(testContext.steps[2], true);
      renderFixture(testContext.fixture);

      expect(testContext.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(testContext.steps[0]);

      expect(
        testContext.steps.map(step => (step.model as MockStepModel).isValidated),
        'Only first page should be validated'
      ).toEqual([true, false, false]);

      expect((testContext.steps[2].model as MockStepModel).isActivated, 'Third page should be activated').toEqual(true);

      // Go to the second valid page
      testContext.component.onStepActiveChange(testContext.steps[1], true);
      renderFixture(testContext.fixture);

      expect(testContext.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(testContext.steps[2]);

      expect((testContext.steps[2].model as MockStepModel).isValidated, 'Third page should be validated').toEqual(true);

      let isValid = false;
      testContext.component
        .validateActiveTab$()
        .pipe(take(1))
        .subscribe(valid => {
          isValid = valid;
        });
      renderFixture(testContext.fixture);

      expect(isValid, 'The second page should be valid').toBe(true);
    });

    it('validates the active pages when validateActiveTab$ is called and current tab is invalid', async () => {
      verifyAllStepPagesNotValidated(testContext.steps);

      // Activate the invalid page
      testContext.component.onStepActiveChange(testContext.steps[2], true);
      renderFixture(testContext.fixture);

      expect(testContext.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(testContext.steps[0]);

      expect(
        testContext.steps.map(step => (step.model as MockStepModel).isValidated),
        'Only first page should be validated'
      ).toEqual([true, false, false]);

      let isValid = true;
      testContext.component
        .validateActiveTab$()
        .pipe(take(1))
        .subscribe(valid => {
          isValid = valid;
        });
      renderFixture(testContext.fixture);

      expect(isValid, 'The third page should not be valid').toBe(false);
    });

    function verifyAllStepPagesNotValidated(steps: Step[]) {
      expect(
        steps.map(step => (step.model as MockStepModel).isValidated),
        'All pages should not be validated'
      ).toEqual([false, false, false]);
    }
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
          title: ipAllocationStepTitle,
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

      testContext.fixture.componentRef.setInput('tabs', testContext.steps);

      renderFixture(testContext.fixture);
    });

    it('the first page is skipped', () => {
      expect((<StepInternal>testContext.steps[0]).isSkipped).toEqual(true);
      expect((<StepInternal>testContext.steps[1]).isSkipped).toBeUndefined();
      expect((<StepInternal>testContext.steps[2]).isSkipped).toBeUndefined();
    });

    it('the second page is activated if the first one is skipped', () => {
      expect((testContext.steps[0].model as MockStepModel).isActivated).toEqual(false);
      expect((testContext.steps[1].model as MockStepModel).isActivated).toEqual(true);
    });

    it('renders page tabs links correctly', async () => {
      return testContext.fixture.whenStable().then(() => {
        expect(testContext.modelManager.injectPropertiesToPendingStep).toHaveBeenCalledWith(testContext.steps[1]);

        const tabsHelper = new TabsHelper(testContext.fixture.debugElement);
        const labels: string[] = tabsHelper
          .getLinkList()
          .map((link: DebugElement) => link.nativeElement.textContent.trim());
        expect(labels).toEqual([ipAllocationStepTitle, 'Details']);
      });
    });
  });

  describe('vertical tabs zoom accessibility', () => {
    let queryTabLinks: () => DebugElement;

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
      testContext.fixture.componentRef.setInput('tabs', testContext.steps);
      testContext.fixture.componentRef.setInput('tabLayout', TabLayout.vertical);
      renderFixture(testContext.fixture);
      queryTabLinks = () => testContext.fixture.debugElement.query(By.css('appfx-tab-links'));
    });

    describe('WHEN showTabLinks = false', () => {
      beforeEach(() => {
        testContext.fixture.componentRef.setInput('showTabLinks', false);
        renderFixture(testContext.fixture);
      });

      it('appfx-tab-links is not visible', () => {
        const appfxTabLinks = queryTabLinks();
        expect(appfxTabLinks).toBeFalsy();
      });

      it('tab nav is not visible', () => {
        const tabNav = testContext.fixture.debugElement.query(By.css('.nav'));
        const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
        expect(isVisible).toBeFalsy();
      });
    });

    describe('zoom2x', () => {
      beforeEach(() => {
        testContext.zoomLevelService['resizeSubject'].next(ZoomLevel.x2);
        renderFixture(testContext.fixture);
      });

      it('appfx-tab-links is visible', () => {
        const appfxTabLinks = queryTabLinks();
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

      it('tab name is visible in the header', () => {
        const activeTabTitle = testContext.fixture.debugElement.query(By.css(`.nav-step-title`)).nativeElement
          .innerText;
        expect(activeTabTitle).toEqual(testContext.steps[0].title);
      });

      it('only the active tab-content is visible by default', () => {
        const tabContents = testContext.fixture.debugElement.queryAll(By.css(`.tab-content`));
        tabContents.forEach((tabContent, index) => {
          const isVisible = getComputedStyle(tabContent.nativeElement)['display'] !== 'none';
          expect(isVisible).toBe(index === 0);
        });
      });

      it('tab nav is not visible by default', () => {
        const tabNav = testContext.fixture.debugElement.query(By.css('.nav'));
        const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
        expect(isVisible).toBeFalsy();
      });

      describe('when `Show tabs` burger icon is clicked', () => {
        beforeEach(() => {
          const showTabsIcon = testContext.fixture.debugElement.query(By.css(`.btn-show-tabs`));
          showTabsIcon.nativeElement.click();
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
            closeTabsIcon.nativeElement.click();
            renderFixture(testContext.fixture);
          });

          it('tabs panel is closed', () => {
            const tabsHelper = new TabsHelper(testContext.fixture.debugElement);
            expect(tabsHelper.areTabsVisible()).toBeFalsy();
          });

          it('showTabsLink is false', () => {
            expect(testContext.component.tabLinksOpened).toBeFalsy();
          });

          it('only the active tab-content is visible', () => {
            const tabContents = testContext.fixture.debugElement.queryAll(By.css(`.tab-content`));
            tabContents.forEach((tabContent, index) => {
              const isVisible = getComputedStyle(tabContent.nativeElement)['display'] !== 'none';
              expect(isVisible).toBe(index === 0);
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
        const appfxTabLinks = queryTabLinks();
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

      it('tab name is visible in the header', () => {
        const activeTabTitle = testContext.fixture.debugElement.query(By.css(`.nav-step-title`)).nativeElement
          .innerText;
        expect(activeTabTitle).toEqual(testContext.steps[0].title);
      });

      it('only the active tab-content is visible by default', () => {
        const tabContents = testContext.fixture.debugElement.queryAll(By.css(`.tab-content`));
        tabContents.forEach((tabContent, index) => {
          const isVisible = getComputedStyle(tabContent.nativeElement)['display'] !== 'none';
          expect(isVisible).toBe(index === 0);
        });
      });

      it('tab nav is not visible by default', () => {
        const tabNav = testContext.fixture.debugElement.query(By.css('.nav'));
        const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
        expect(isVisible).toBeFalsy();
      });

      describe('when `Show tabs` burger icon is clicked', () => {
        beforeEach(() => {
          const showTabsIcon = testContext.fixture.debugElement.query(By.css(`.btn-show-tabs`));
          showTabsIcon.nativeElement.click();
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
            closeTabsIcon.nativeElement.click();
            renderFixture(testContext.fixture);
          });

          it('tabs panel is closed', () => {
            const tabsHelper = new TabsHelper(testContext.fixture.debugElement);
            expect(tabsHelper.areTabsVisible()).toBeFalsy();
          });

          it('showTabsLink is false', () => {
            expect(testContext.component.tabLinksOpened).toBeFalsy();
          });

          it('only the active tab-content is visible', () => {
            const tabContents = testContext.fixture.debugElement.queryAll(By.css(`.tab-content`));
            tabContents.forEach((tabContent, index) => {
              const isVisible = getComputedStyle(tabContent.nativeElement)['display'] !== 'none';
              expect(isVisible).toBe(index === 0);
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
