/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DebugElement, Directive, ElementRef, Input, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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
import { ClrTabsModule } from '@clr/angular/layout/tabs';
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

// XXX: using the real directive breaks 4 tests. Should be investigated.
@Directive({
  selector: '[appfxIfTabActive]',
  standalone: false,
})
class DummyIfTabActiveDirective {
  @Input() activeClass: string;
  @Input() activateTab: boolean;
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
  beforeEach(function (this: ThisTest) {
    this.tabsModel = {};

    TestBed.configureTestingModule({
      imports: [ClrTabsModule, ClrIcon, MockWorkflowTestModule],
      declarations: [TabsComponent, StepContainer, TabLinksComponent, RenderAsButtonDirective, DummyIfTabActiveDirective],
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
    this.fixture = TestBed.createComponent(TabsComponent);

    this.modelManager = this.fixture.debugElement.injector.get(WorkflowModelManager);
    this.mockElementRef = this.fixture.debugElement.injector.get(ElementRef);

    this.component = this.fixture.componentInstance;
    this.component.model = this.tabsModel;

    spyOn(this.modelManager, 'injectPropertiesToPendingStep').and.callThrough();
    spyOn(this.modelManager, 'ejectPropertiesFromCurrentStep').and.callThrough();

    this.fixture.detectChanges();
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });

  const ipAllocationStepTitle = 'IP Allocation';
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

      this.component.tabs = this.steps;
      this.fixture.detectChanges();
    });

    it('renders pages disabled when disableTabContent = true', function (this: ThisTest) {
      this.component.disableTabsContent = true;
      this.fixture.detectChanges();

      expect(
        this.fixture.nativeElement.querySelectorAll('appfx-step-container')[0].classList.contains('div-disabled')
      ).toEqual(true);

      this.component.onStepActiveChange(this.steps[2], true);
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

      this.component.tabs = this.steps;
      this.fixture.detectChanges();
    });

    it(
      'renders page tabs links correctly, shows the first page and clicking' +
        ' on a page tab opens the page associated with that tab',
      waitForAsync(function (this: ThisTest) {
        this.fixture.whenStable().then(() => {
          expect(this.modelManager.injectPropertiesToPendingStep).toHaveBeenCalledWith(this.steps[0]);

          const tabsHelper = new TabsHelper(this.fixture.debugElement);
          const labels: string[] = tabsHelper
            .getLinkList()
            .map((link: DebugElement) => link.nativeElement.textContent.trim());
          expect(labels).toEqual(['Resources', ipAllocationStepTitle, 'Details']);

          this.component.onStepActiveChange(this.steps[2], true);
          this.fixture.detectChanges();

          expect(this.modelManager.injectPropertiesToPendingStep).toHaveBeenCalledWith(this.steps[2]);
          expect(this.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(this.steps[0]);
        });
      })
    );

    it('activates the next page when navigating to another page', function (this: ThisTest) {
      verifyAllStepPagesNotValidated(this.steps);

      this.component.onStepActiveChange(this.steps[1], true);
      this.fixture.detectChanges();

      expect(((this.steps[1].model as MockStepModel)).isActivated).toEqual(true);
      expect(((this.steps[2].model as MockStepModel)).isActivated).toEqual(false);

      this.component.onStepActiveChange(this.steps[2], true);
      this.fixture.detectChanges();

      expect(((this.steps[2].model as MockStepModel)).isActivated).toEqual(true);
    });

    it('validates the current page when navigating to another page', function (this: ThisTest) {
      expect(((this.steps[0].model as MockStepModel)).isValidated).toEqual(false);

      this.component.onStepActiveChange(this.steps[1], true);

      this.fixture.detectChanges();

      expect(((this.steps[0].model as MockStepModel)).isValidated).toEqual(true);
      expect(((this.steps[1].model as MockStepModel)).isValidated).toEqual(false);

      this.component.onStepActiveChange(this.steps[0], true);
      this.fixture.detectChanges();

      expect(((this.steps[1].model as MockStepModel)).isValidated).toEqual(true);
    });

    it('does not validate the current page when navigating to another page when disableTabsContent = true', function (this: ThisTest) {
      this.component.disableTabsContent = true;
      this.fixture.detectChanges();

      expect(((this.steps[0].model as MockStepModel)).isValidated).toEqual(false);
      expect(((this.steps[1].model as MockStepModel)).isValidated).toEqual(false);
      this.component.onStepActiveChange(this.steps[1], true);

      this.fixture.detectChanges();

      expect(((this.steps[0].model as MockStepModel)).isValidated).toEqual(false);
      expect(((this.steps[1].model as MockStepModel)).isValidated).toEqual(false);
    });

    it('return true when validate$ method is called and all steps are valid', function (this: ThisTest) {
      expect(((this.steps[0].model as MockStepModel)).isValidated).toEqual(false);
      expect(((this.steps[1].model as MockStepModel)).isValidated).toEqual(false);

      this.component.onStepActiveChange(this.steps[1], true);
      this.fixture.detectChanges();

      expect(((this.steps[0].model as MockStepModel)).isValidated).toEqual(true);
      expect(this.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(this.steps[0]);

      expect(((this.steps[1].model as MockStepModel)).isValidated).toEqual(false);

      let isValid = false;
      this.component
        .validate$()
        .pipe(take(1))
        .subscribe(valid => {
          isValid = valid;
        });

      expect(((this.steps[1].model as MockStepModel)).isValidated).toEqual(true);
      expect(this.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(this.steps[1]);
      expect(isValid).withContext('All steps should be valid').toBeTruthy();
    });

    it('validates all visited pages when validate$ is called and navigates to the invalid page', waitForAsync(function (
      this: ThisTest
    ) {
      verifyAllStepPagesNotValidated(this.steps);

      // Activate the invalid page
      this.component.onStepActiveChange(this.steps[2], true);
      this.fixture.detectChanges();

      expect(this.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(this.steps[0]);

      expect(this.steps.map(step => ((step.model as MockStepModel)).isValidated))
        .withContext('First page should be validated')
        .toEqual([true, false, false]);

      expect(((this.steps[2].model as MockStepModel)).isActivated).toEqual(true);

      // Go to the second valid page
      this.component.onStepActiveChange(this.steps[1], true);
      this.fixture.detectChanges();

      expect(this.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(this.steps[2]);

      expect(((this.steps[2].model as MockStepModel)).isValidated).toEqual(true);

      let isValid = false;
      this.component
        .validate$()
        .pipe(take(1))
        .subscribe(valid => {
          isValid = valid;
        });
      this.fixture.detectChanges();

      // The user is navigated to the first invalid page and it is activated
      expect(this.modelManager.injectPropertiesToPendingStep).toHaveBeenCalledWith(this.steps[2]);

      // The validate$ returns false
      expect(isValid).withContext('The third page should be invalid').toBeFalsy();
    }));

    it('does not validate pages when validate$ is called, one step is invalid and disableTabsContent = true', function (this: ThisTest) {
      this.component.disableTabsContent = true;
      this.fixture.detectChanges();

      verifyAllStepPagesNotValidated(this.steps);

      this.component.onStepActiveChange(this.steps[1], true);
      this.fixture.detectChanges();

      expect(((this.steps[0].model as MockStepModel)).isValidated).toEqual(false);
      expect(this.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(this.steps[0]);

      let isValid = false;
      this.component
        .validate$()
        .pipe(take(1))
        .subscribe(valid => {
          isValid = valid;
        });

      expect(((this.steps[1].model as MockStepModel)).isValidated).toEqual(false);
      expect(this.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(this.steps[1]);
      expect(isValid).withContext('The second page should be valid').toBeTruthy();
    });

    it('validates the active pages when validateActiveTab$ is called and current tab is valid', waitForAsync(function (
      this: ThisTest
    ) {
      verifyAllStepPagesNotValidated(this.steps);

      // Activate the invalid page
      this.component.onStepActiveChange(this.steps[2], true);
      this.fixture.detectChanges();

      expect(this.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(this.steps[0]);

      expect(this.steps.map(step => ((step.model as MockStepModel)).isValidated))
        .withContext('Only first page should be validated')
        .toEqual([true, false, false]);

      expect(((this.steps[2].model as MockStepModel)).isActivated).withContext('Third page should be activated').toEqual(true);

      // Go to the second valid page
      this.component.onStepActiveChange(this.steps[1], true);
      this.fixture.detectChanges();

      expect(this.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(this.steps[2]);

      expect(((this.steps[2].model as MockStepModel)).isValidated).withContext('Third page should be validated').toEqual(true);

      let isValid = false;
      this.component
        .validateActiveTab$()
        .pipe(take(1))
        .subscribe(valid => {
          isValid = valid;
        });
      this.fixture.detectChanges();

      expect(isValid).withContext('The second page should be valid').toBeTrue();
    }));

    it('validates the active pages when validateActiveTab$ is called and current tab is invalid', waitForAsync(function (
      this: ThisTest
    ) {
      verifyAllStepPagesNotValidated(this.steps);

      // Activate the invalid page
      this.component.onStepActiveChange(this.steps[2], true);
      this.fixture.detectChanges();

      expect(this.modelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(this.steps[0]);

      expect(this.steps.map(step => ((step.model as MockStepModel)).isValidated))
        .withContext('Only first page should be validated')
        .toEqual([true, false, false]);

      let isValid = true;
      this.component
        .validateActiveTab$()
        .pipe(take(1))
        .subscribe(valid => {
          isValid = valid;
        });
      this.fixture.detectChanges();

      expect(isValid).withContext('The third page should not be valid').toBeFalse();
    }));

    function verifyAllStepPagesNotValidated(steps: Step[]) {
      expect(steps.map(step => ((step.model as MockStepModel)).isValidated))
        .withContext('All pages should not be validated')
        .toEqual([false, false, false]);
    }
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
      this.steps[0].isRelevant = Var.from(relevanceProperty).by(prop => of(prop));
      relevanceProperty.value = false;

      this.component.tabs = this.steps;

      this.fixture.detectChanges();
    });

    it('the first page is skipped', function (this: ThisTest) {
      expect((<StepInternal>this.steps[0]).isSkipped).toEqual(true);
      expect((<StepInternal>this.steps[1]).isSkipped).toBeUndefined();
      expect((<StepInternal>this.steps[2]).isSkipped).toBeUndefined();
    });

    it('the second page is activated if the first one is skipped', function (this: ThisTest) {
      expect(((this.steps[0].model as MockStepModel)).isActivated).toEqual(false);
      expect(((this.steps[1].model as MockStepModel)).isActivated).toEqual(true);
    });

    it('renders page tabs links correctly', waitForAsync(function (this: ThisTest) {
      this.fixture.whenStable().then(() => {
        expect(this.modelManager.injectPropertiesToPendingStep).toHaveBeenCalledWith(this.steps[1]);

        const tabsHelper = new TabsHelper(this.fixture.debugElement);
        const labels: string[] = tabsHelper
          .getLinkList()
          .map((link: DebugElement) => link.nativeElement.textContent.trim());
        expect(labels).toEqual([ipAllocationStepTitle, 'Details']);
      });
    }));
  });

  describe('vertical tabs zoom accessibility', () => {
    let queryTabLinks: () => DebugElement;

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
      this.component.tabs = this.steps;
      this.component.tabLayout = TabLayout.vertical;
      this.fixture.detectChanges();
      this.component.ngOnChanges({
        tabLayout: new SimpleChange({} as TabLayout, TabLayout.vertical, true),
      });
      queryTabLinks = () => this.fixture.debugElement.query(By.css('appfx-tab-links'));
    });

    describe('WHEN showTabLinks = false', () => {
      beforeEach(function (this: ThisTest) {
        this.component.showTabLinks = false;
        this.fixture.detectChanges();
      });

      it('appfx-tab-links is not visible', function (this: ThisTest) {
        const appfxTabLinks = queryTabLinks();
        expect(appfxTabLinks).toBeFalsy();
      });

      it('tab nav is not visible', function (this: ThisTest) {
        const tabNav = this.fixture.debugElement.query(By.css('.nav'));
        const isVisible = getComputedStyle(tabNav.nativeElement)['display'] !== 'none';
        expect(isVisible).toBeFalsy();
      });
    });

    describe('zoom2x', () => {
      beforeEach(function (this: ThisTest) {
        this.zoomLevelService['resizeSubject'].next(ZoomLevel.x2);
        this.fixture.detectChanges();
      });

      it('appfx-tab-links is visible', function (this: ThisTest) {
        const appfxTabLinks = queryTabLinks();
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

      it('tab name is visible in the header', function (this: ThisTest) {
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
          showTabsIcon.nativeElement.click();
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
            closeTabsIcon.nativeElement.click();
            this.fixture.detectChanges();
          });

          it('tabs panel is closed', function (this: ThisTest) {
            const tabsHelper = new TabsHelper(this.fixture.debugElement);
            expect(tabsHelper.areTabsVisible()).toBeFalsy();
          });

          it('showTabsLink is false', function (this: ThisTest) {
            expect(this.component.tabLinksOpened).toBeFalsy();
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
        const appfxTabLinks = queryTabLinks();
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

      it('tab name is visible in the header', function (this: ThisTest) {
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
          showTabsIcon.nativeElement.click();
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
            closeTabsIcon.nativeElement.click();
            this.fixture.detectChanges();
          });

          it('tabs panel is closed', function (this: ThisTest) {
            const tabsHelper = new TabsHelper(this.fixture.debugElement);
            expect(tabsHelper.areTabsVisible()).toBeFalsy();
          });

          it('showTabsLink is false', function (this: ThisTest) {
            expect(this.component.tabLinksOpened).toBeFalsy();
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
