/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, DebugElement, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrAlert, ClrAlertModule } from '@clr/angular/emphasis/alert';
import { ClrIcon } from '@clr/angular/icon';
import { delay } from '@clr/angular/testing';
import { renderFixture } from '@clr/angular/utils/testing';

import { ButtonHubService } from './providers/button-hub.service';
import { PageCollectionService } from './providers/page-collection.service';
import { PageCollectionMock } from './providers/page-collection.service.mock';
import { WizardNavigationService } from './providers/wizard-navigation.service';
import { ClrWizard } from './wizard';
import { ClrWizardButton } from './wizard-button';
import { ClrWizardPage } from './wizard-page';
import { MockPage } from './wizard-page.mock';
import { ClrWizardModule } from './wizard.module';

class MyPageCollectionMock extends PageCollectionMock {
  previousPage: MockPage;

  getPreviousPage(): MockPage {
    if (this.previousPage) {
      return this.previousPage;
    }
    return null;
  }
}

@Component({
  template: `
    <clr-wizard-page>
      <ng-template clrPageTitle>Mandatory Title</ng-template>
      Hello moto
    </clr-wizard-page>
    <clr-wizard-page>
      <ng-template clrPageTitle>Mandatory Title</ng-template>
      <ng-template clrPageNavTitle>Optional nav title</ng-template>
      <ng-template clrPageHeaderActions>
        <clr-wizard-header-action id="fhtagn">hi</clr-wizard-header-action>
      </ng-template>
      Other wizard page needed as competition in tests
      <ng-template clrPageButtons>
        <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
      </ng-template>
    </clr-wizard-page>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TypescriptTestComponent {
  @ViewChildren(ClrWizardPage) wizardPageChildren: QueryList<ClrWizardPage>;
}

@Component({
  template: `
    <clr-wizard-page
      #nav
      [(clrWizardPageNextDisabled)]="navTestNextDisabled"
      [(clrWizardPagePreviousDisabled)]="navTestPreviousDisabled"
      [(clrWizardPagePreventDefaultCancel)]="navStopCancel"
    >
      <ng-template clrPageTitle>Tests of page nav inputs and outputs</ng-template>
    </clr-wizard-page>
    <clr-wizard-page #lifecycle>
      <ng-template clrPageTitle>Tests for lifecycle outputs and event handlers</ng-template>
    </clr-wizard-page>
    <clr-wizard-page #other [id]="testId" (clrWizardPageOnLoad)="onLoadCheck($event)">
      <ng-template clrPageTitle>Other template API tests</ng-template>
    </clr-wizard-page>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TemplateTestComponent {
  @ViewChild('nav') navigationTemplateTester: ClrWizardPage;
  @ViewChild('lifecycle') lifecycleTemplateTester: ClrWizardPage;
  @ViewChild('other') otherTemplateTester: ClrWizardPage;

  testId = 'ohai';
  loadedPageId = '';
  navTwoWayBindingPassed = false;

  private _navTestNextDisabled = false;
  private _navTestPreviousDisabled = true;
  private _navStopCancel = false;

  get navTestNextDisabled(): boolean {
    return this._navTestNextDisabled;
  }
  set navTestNextDisabled(val: boolean) {
    if (val !== this._navTestNextDisabled) {
      this.navTwoWayBindingPassed = true;
      this._navTestNextDisabled = val;
    }
  }

  get navTestPreviousDisabled(): boolean {
    return this._navTestPreviousDisabled;
  }
  set navTestPreviousDisabled(val: boolean) {
    if (val !== this._navTestPreviousDisabled) {
      this.navTwoWayBindingPassed = true;
      this._navTestPreviousDisabled = val;
    }
  }

  get navStopCancel(): boolean {
    return this._navStopCancel;
  }
  set navStopCancel(val: boolean) {
    this.navTwoWayBindingPassed = true;
    this._navStopCancel = val;
  }

  onLoadCheck(pageId: string): void {
    this.loadedPageId = pageId;
  }
}

@Component({
  template: `
    <clr-wizard #viewTestWizard [(clrWizardOpen)]="open">
      <clr-wizard-title>Wizard for Wizard Page View Tests</clr-wizard-title>

      <clr-wizard-button [type]="'cancel'" #wizardCancelBtn class="clr-test-wizard-cancel">Cancel</clr-wizard-button>
      <clr-wizard-button [type]="'previous'" class="clrtest-wizard-previous" #wizardPreviousBtn>Back</clr-wizard-button>
      <clr-wizard-button [type]="'custom-custom'" class="clrtest-wizard-custom">Custom</clr-wizard-button>
      <clr-wizard-button [type]="'next'" class="clrtest-wizard-next">Next</clr-wizard-button>
      <clr-wizard-button [type]="'danger'" class="clrtest-wizard-danger">Danger</clr-wizard-button>
      <clr-wizard-button [type]="'finish'" class="clrtest-wizard-finish">Finish</clr-wizard-button>

      <clr-wizard-header-action (actionClicked)="headerActionClicked($event)">
        <cds-icon shape="cloud" solid></cds-icon>
      </clr-wizard-header-action>

      <clr-wizard-page #viewTestWizardPageOne [id]="testId" [clrWizardPagePreventDefaultCancel]="preventCancel">
        <ng-template clrPageTitle>View Page 1</ng-template>

        <ng-template clrPageHeaderActions>
          <clr-wizard-header-action (actionClicked)="headerActionClicked($event)" id="bell">
            <cds-icon shape="bell" badge></cds-icon>
          </clr-wizard-header-action>
          <clr-wizard-header-action (actionClicked)="headerActionClicked($event)" id="warning">
            <cds-icon shape="warning"></cds-icon>
          </clr-wizard-header-action>
        </ng-template>

        <ng-template clrPageButtons>
          <clr-wizard-button [type]="'cancel'" class="clrtest-page-cancel" #pageCancelBtn>Cancel</clr-wizard-button>
          <clr-wizard-button [type]="'previous'" class="clrtest-page-previous-1">Previous</clr-wizard-button>
          <clr-wizard-button [type]="'danger'">Caution</clr-wizard-button>
        </ng-template>
      </clr-wizard-page>

      <clr-wizard-page #viewTestWizardPageTwo [(clrWizardPagePreviousDisabled)]="disablePrevious">
        <ng-template clrPageTitle>View Page 2</ng-template>
        <p>{{ projector }}</p>
      </clr-wizard-page>

      <clr-wizard-page #viewTestWizardPageThree [(clrWizardPagePreviousDisabled)]="disablePrevious">
        <ng-template clrPageTitle>View Page 3</ng-template>
        <ng-template clrPageNavTitle>short title</ng-template>
        @if (!asyncLoaded) {
          <p>Loading...</p>
        }
        @if (asyncLoaded) {
          <p>{{ asyncContent }}</p>
        }

        <ng-template clrPageButtons>
          <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
          <clr-wizard-button [type]="'previous'" #pagePreviousBtn class="clrtest-page-previous-2">
            Previous
          </clr-wizard-button>
          <clr-wizard-button [type]="'danger'">Danger</clr-wizard-button>
        </ng-template>
      </clr-wizard-page>

      <clr-wizard-page
        #viewTestWizardPageFour
        [clrWizardPagePreventDefaultCancel]="preventCancel"
        (clrWizardPageOnCancel)="altCancel()"
      >
        <ng-template clrPageTitle>View Page 4</ng-template>
        <clr-alert [clrAlertClosable]="false">
          <div class="alert-item">
            <span class="alert-text">i believe the answer is {{ innerProjector / 2 }}</span>
          </div>
        </clr-alert>
      </clr-wizard-page>
    </clr-wizard>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ViewTestComponent {
  @ViewChild('viewTestWizard') testWizard: ClrWizard;
  @ViewChild('viewTestWizardPageOne') pageOne: ClrWizardPage;
  @ViewChild('viewTestWizardPageTwo') pageTwo: ClrWizardPage;
  @ViewChild('viewTestWizardPageThree') pageThree: ClrWizardPage;
  @ViewChild('viewTestWizardPageFour') pageFour: ClrWizardPage;
  @ViewChild('wizardPreviousBtn') wizardPreviousBtn: ClrWizardButton;
  @ViewChild('pagePreviousBtn') pagePreviousBtn: ClrWizardButton;
  @ViewChild('wizardCancelBtn') wizardCancelBtn: ClrWizardButton;
  @ViewChild('pageCancelBtn') pageCancelBtn: ClrWizardButton;

  projector = 'my projected content';
  innerProjector = 12;
  asyncLoaded = false;
  asyncContent = '';
  testId = 'ohai';
  disablePrevious = false;
  preventCancel = false;
  altCancelRan = false;

  // wizard has to init to open or all the pages are hidden inside modal
  open = true;

  loadAsync(): void {
    setTimeout(() => {
      this.asyncLoaded = true;
      this.asyncContent = 'better late than never';
    }, 100);
  }

  altCancel() {
    this.altCancelRan = true;
  }
}

@Component({
  template: `
    @for (page of [0, 1, 2, 3]; track page) {
      <clr-wizard-page [id]="3 === page ? 'lastpage' : page">Content for page {{ page }}</clr-wizard-page>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class IdTestComponent {
  @ViewChildren(ClrWizardPage) pages: QueryList<ClrWizardPage>;
}

describe('New Wizard Tests', () => {
  describe('ClrWizardPage', () => {
    let fixture: ComponentFixture<any>;
    let testComponent: TypescriptTestComponent;
    let testWizardPage: ClrWizardPage;
    let otherWizardPage: ClrWizardPage;
    let pageCollection: MyPageCollectionMock;

    beforeEach(() => {
      pageCollection = new MyPageCollectionMock();
    });
    let navService: WizardNavigationService;

    describe('Numeric id bug', () => {
      let firstPage: ClrWizardPage;
      let secondPage: ClrWizardPage;
      let thirdPage: ClrWizardPage;
      let fourthPage: ClrWizardPage;
      let myTestComponent: IdTestComponent;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrWizardModule, ClrAlertModule],
          declarations: [IdTestComponent],
          providers: [
            WizardNavigationService,
            { provide: PageCollectionService, useValue: pageCollection },
            ButtonHubService,
          ],
        });
        fixture = TestBed.createComponent(IdTestComponent);
        renderFixture(fixture);
        myTestComponent = fixture.componentInstance;
        firstPage = myTestComponent.pages.toArray()[0];
        secondPage = myTestComponent.pages.toArray()[1];
        thirdPage = myTestComponent.pages.toArray()[2];
        fourthPage = myTestComponent.pages.toArray()[3];
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('should not auto-assign an id of zero', () => {
        const myId = firstPage.id;

        const myMungedId = myId.split('-').reverse();
        const generatedId = myMungedId[0];
        expect(generatedId, 'should pass 0 as id if specified').toBe('0');
      });

      it('should not pass an id of false', () => {
        firstPage._id = false;
        const myId = firstPage.id;
        const myMungedId = myId.split('-').reverse();
        const generatedId = myMungedId[0];
        expect(generatedId, 'should not pass false as an id').not.toBe('false');
      });

      it('should not pass an id of null', () => {
        firstPage._id = null;
        const myId = firstPage.id;
        const myMungedId = myId.split('-').reverse();
        const generatedId = myMungedId[0];
        expect(generatedId, 'should not pass null as an id').not.toBe('null');
      });

      it('should not pass an id of empty string', () => {
        firstPage._id = '';
        const myId = firstPage.id;
        const myMungedId = myId.split('-').reverse();
        const generatedId = myMungedId[0];
        expect(generatedId, 'should not pass null as an id').not.toBe('null');
      });

      it('should not pass an undefined id', () => {
        firstPage._id = undefined;
        const myId = firstPage.id;
        const myMungedId = myId.split('-').reverse();
        const generatedId = myMungedId[0];
        expect(generatedId, 'should not pass undefined as an id').not.toBe('undefined');
      });

      it('should not pass a negative number as an id', () => {
        firstPage._id = -1;
        const myId = firstPage.id;
        expect(myId, 'should not pass a negative number as an id').not.toBe('clr-wizard-page--1');
      });

      it('should match numeric ids if passed', () => {
        // had an issue here because ppl were using indexes as ids and our logic
        // was not awesome for that
        let myId = firstPage.id;
        let myMungedId: string[];
        let generatedId: string;

        myMungedId = myId.split('-').reverse();
        generatedId = myMungedId[0];
        expect(generatedId, 'first page id should be 0').toBe('0');

        myId = secondPage.id;
        myMungedId = myId.split('-').reverse();
        generatedId = myMungedId[0];

        myMungedId = myId.split('-').reverse();
        generatedId = myMungedId[0];
        expect(generatedId, 'should pass 1 as id if specified').toBe('1');

        myId = thirdPage.id;
        myMungedId = myId.split('-').reverse();
        generatedId = myMungedId[0];

        myMungedId = myId.split('-').reverse();
        generatedId = myMungedId[0];
        expect(generatedId, 'should pass 2 as id if specified').toBe('2');

        myId = fourthPage.id;
        myMungedId = myId.split('-').reverse();
        generatedId = myMungedId[0];

        myMungedId = myId.split('-').reverse();
        generatedId = myMungedId[0];
        expect(generatedId, 'should pass string label as id').toBe('lastpage');
      });
    });

    describe('Typescript API', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrWizardModule],
          declarations: [TypescriptTestComponent],
          providers: [
            WizardNavigationService,
            { provide: PageCollectionService, useValue: pageCollection },
            ButtonHubService,
          ],
        });
        fixture = TestBed.createComponent(TypescriptTestComponent);
        renderFixture(fixture);
        testComponent = fixture.componentInstance;
        navService = fixture.debugElement.injector.get(WizardNavigationService);
        testWizardPage = testComponent.wizardPageChildren.toArray()[0];
        otherWizardPage = testComponent.wizardPageChildren.toArray()[1];
      });

      afterEach(() => {
        fixture.destroy();
      });

      describe('id', () => {
        it('should return an indexed id if none is specified', () => {
          const myId = testWizardPage.id;
          expect(myId, 'id should contain prefix').toContain('clr-wizard-page-');
          const myMungedId = myId.split('-').reverse();
          const mungedIdNaN = isNaN(Number(myMungedId[0]));
          expect(mungedIdNaN, 'index should be a number').toBe(false);
        });

        it('should return expected id', () => {
          expect(testWizardPage.id, 'verify default').toContain('clr-wizard-page-');
          testWizardPage._id = 'ohai';
          renderFixture(fixture);
          expect(testWizardPage.id, 'verify custom id').toBe('clr-wizard-page-ohai');
        });
      });

      describe('readyToComplete', () => {
        it('should reflect nextStepDisabled state', () => {
          // testcomponent's wizard page isn't a part of a wizard so it doesn't preset
          // nextStepDisabled's value
          expect(testWizardPage.nextStepDisabled, 'nextStepDisabled initialized to false').toBe(false);
          expect(testWizardPage.readyToComplete, 'readyToComplete ' + 'initialized to true').toBe(true);
          testWizardPage.nextStepDisabled = true;
          renderFixture(fixture);
          expect(
            testWizardPage.readyToComplete,
            'readyToComplete ' + 'reflect update to nextStepDisabled, part 2'
          ).toBe(false);
        });
      });

      describe('completed', () => {
        it('should be true if complete and readyToComplete are true', () => {
          testWizardPage.nextStepDisabled = false;
          testWizardPage.completed = true;
          renderFixture(fixture);
          expect(testWizardPage.completed).toBe(true);
        });

        it('should return false if not complete', () => {
          testWizardPage.nextStepDisabled = false;
          testWizardPage.completed = false;
          renderFixture(fixture);
          expect(testWizardPage.completed).toBe(false);
        });

        it('should return false if not readyToComplete', () => {
          testWizardPage.nextStepDisabled = true;
          testWizardPage.completed = true;
          renderFixture(fixture);
          expect(testWizardPage.completed).toBe(false);
        });
      });

      describe('hasError', () => {
        it('should be false by default', () => {
          expect(testWizardPage.hasError).toBe(false);
        });
      });

      describe('current', () => {
        it('should return false if not current', () => {
          // make sure another page is current
          navService.currentPage = otherWizardPage;
          renderFixture(fixture);
          expect(testWizardPage.current).toBe(false);
        });

        it('should be true if page is current', () => {
          navService.currentPage = testWizardPage;
          renderFixture(fixture);
          expect(testWizardPage.current).toBe(true);
        });
      });

      describe('disabled', () => {
        it('should be reflect enabled status', () => {
          // enabled full coverage below
          const dummyPreviousPage = new MockPage(99);
          pageCollection.previousPage = dummyPreviousPage;
          dummyPreviousPage.completed = false;
          navService.currentPage = otherWizardPage;
          testWizardPage.completed = false;
          renderFixture(fixture);
          expect(testWizardPage.enabled, 'enabled is set to false').toBe(false);
          expect(testWizardPage.disabled, 'disabled is true when enabled is false').toBe(true);

          navService.currentPage = testWizardPage;
          expect(testWizardPage.enabled, 'enabled is set to true').toBe(true);
          expect(testWizardPage.disabled, 'disabled is false when enabled is true').toBe(false);
        });
      });

      describe('enabled', () => {
        it('should return true if page is current', () => {
          navService.currentPage = testWizardPage;
          renderFixture(fixture);
          expect(testWizardPage.enabled).toBe(true);
        });

        it('should return true if page is completed', () => {
          testWizardPage.completed = true;
          renderFixture(fixture);
          expect(testWizardPage.enabled).toBe(true);
        });

        it('should return true if previous page is completed', () => {
          const dummyPreviousPage = new MockPage(99);
          pageCollection.previousPage = dummyPreviousPage;
          dummyPreviousPage.completed = true;
          navService.currentPage = otherWizardPage;
          testWizardPage.completed = false;
          renderFixture(fixture);
          expect(testWizardPage.enabled).toBe(true);
        });

        it('should return false if page is not current or completed or if ' + 'previous page is not completed', () => {
          const dummyPreviousPage = new MockPage(99);
          pageCollection.previousPage = dummyPreviousPage;
          dummyPreviousPage.completed = false;
          navService.currentPage = otherWizardPage;
          testWizardPage.completed = false;
          renderFixture(fixture);
          expect(testWizardPage.enabled).toBe(false);
        });
      });

      describe('previousCompleted', () => {
        it('should return true if there is no previous page', () => {
          pageCollection.previousPage = null; // explicitly remove previous page
          renderFixture(fixture);
          expect(testWizardPage.previousCompleted).toBe(true);
        });

        it('should return true if previous page is completed', () => {
          const dummyPreviousPage = new MockPage(99);
          pageCollection.previousPage = dummyPreviousPage;
          dummyPreviousPage.completed = true;
          renderFixture(fixture);
          expect(testWizardPage.previousCompleted).toBe(true);
        });

        it('should return false if previous page is NOT completed', () => {
          const dummyPreviousPage = new MockPage(99);
          pageCollection.previousPage = dummyPreviousPage;
          dummyPreviousPage.completed = false; // set explicitly
          renderFixture(fixture);
          expect(testWizardPage.previousCompleted).toBe(false);
        });
      });

      describe('title', () => {
        it('should return page title template ref', () => {
          const testMe = testWizardPage.title;
          expect(testMe, 'title template ref should be a thing').toBeDefined();
          // expect(testMe).toEqual(expect.any(TemplateRef), "page title should be a template ref");
        });
      });

      describe('navTitle', () => {
        it('should return page nav title template ref instead of page title, if it exists', () => {
          const testMe = otherWizardPage.navTitle;
          const notToBe = otherWizardPage.title;

          // otherpage has a nav title
          expect(testMe, 'nav title template ref should be a thing').toBeDefined();
          // view piece is covered below; for now, we want to test just the API
          expect(testMe, 'expect titles to be different').not.toBe(notToBe);
        });

        it('should return page title if no page nav title is specified', () => {
          const testMe = testWizardPage.navTitle;
          const expected = testWizardPage.title;
          // testpage has no nav title
          expect(testMe, 'nav title template ref should be a thing').toBeDefined();
          // view piece is covered below; for now, we want to test just the API
          expect(testMe, 'expect titles to be the same').toBe(expected);
        });
      });

      describe('headerActions', () => {
        it('should return page header actions if they are present', () => {
          // other wizard page has header actions
          const testMe = otherWizardPage.headerActions;
          expect(testMe, 'header actions exist').toBeDefined();
        });

        it('should return undefined if page header actions are not present', () => {
          // test wizard page has no header actions
          const testMe = testWizardPage.headerActions;
          expect(testMe).not.toBeDefined();
        });
      });

      describe('hasHeaderActions', () => {
        it('should return true if page header actions exist', () => {
          // other wizard page has header actions
          const test = otherWizardPage.hasHeaderActions;
          expect(test).toBe(true);
        });

        it('should return false if no page header actions are present', () => {
          // test wizard page has no header actions
          const test = testWizardPage.hasHeaderActions;
          expect(test).toBe(false);
        });
      });

      describe('buttons', () => {
        it('should return buttons template ref if page has buttons in it', () => {
          // other wizard page has custom buttons
          const test = otherWizardPage.buttons;
          expect(test, 'custom buttons exist').toBeDefined();
        });

        it('should return undefined if the page does not have buttons', () => {
          // test wizard page has no custom buttons
          const test = testWizardPage.buttons;
          expect(test).not.toBeDefined();
        });
      });

      describe('hasButtons', () => {
        it('should return true if page has buttons in it', () => {
          // other wizard page has custom buttons
          const test = otherWizardPage.hasButtons;
          expect(test).toBe(true);
        });

        it('should return false if the page does not have buttons', () => {
          // test wizard page has no custom buttons
          const test = testWizardPage.hasButtons;
          expect(test).toBe(false);
        });
      });

      describe('makeCurrent', () => {
        it('should call the navService to make the page current', () => {
          testWizardPage.makeCurrent();
          expect(navService.currentPage).toBe(testWizardPage);
        });

        it('should emit onLoad event', () => {
          const eventSpy = vi.spyOn(otherWizardPage.onLoad, 'emit').mockImplementation(() => undefined);
          otherWizardPage.makeCurrent();
          renderFixture(fixture);
          expect(eventSpy).toHaveBeenCalled();
        });
      });

      describe('stepItemId', () => {
        it('calls to page collection service to retrieve related stepnav item id', () => {
          const testId = testWizardPage.stepItemId;
          const wasCalled = pageCollection.stepItemIdWasCalled;
          expect(testId, 'make sure it grabbed id as expected').toBe('mock-id');
          expect(wasCalled, 'page routine went through the page collection').toBe(true);
        });
      });
    });

    let templateTestComponent: TemplateTestComponent;
    let lifecycleWizardPage: ClrWizardPage;
    let navWizardPage: ClrWizardPage;

    describe('Template API', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrWizardModule],
          declarations: [TemplateTestComponent],
          providers: [
            WizardNavigationService,
            { provide: PageCollectionService, useValue: pageCollection },
            ButtonHubService,
          ],
        });
        fixture = TestBed.createComponent(TemplateTestComponent);
        renderFixture(fixture);
        templateTestComponent = fixture.componentInstance;
        navService = fixture.debugElement.injector.get(WizardNavigationService);
        navWizardPage = templateTestComponent.navigationTemplateTester;
        lifecycleWizardPage = templateTestComponent.lifecycleTemplateTester;
        otherWizardPage = templateTestComponent.otherTemplateTester;
      });

      afterEach(() => {
        fixture.destroy();
      });

      describe('nextStepDisabled input/output/binding', () => {
        it('should allow for setting input through component', () => {
          let nextDisabledVal = templateTestComponent.navTestNextDisabled;
          let wizardPageNextDisabled = navWizardPage.nextStepDisabled;
          expect(nextDisabledVal, 'expect init value to be false').toBe(false);
          expect(wizardPageNextDisabled, 'expect component value and wizard page value to be the same').toBe(
            nextDisabledVal
          );
          templateTestComponent.navTestNextDisabled = true;
          renderFixture(fixture);

          // get new values
          nextDisabledVal = templateTestComponent.navTestNextDisabled;
          wizardPageNextDisabled = navWizardPage.nextStepDisabled;

          expect(nextDisabledVal, 'expect updated value to be true').toBe(true);
          expect(
            wizardPageNextDisabled,
            'expect component value and wizard page value to be the same after update'
          ).toBe(nextDisabledVal);
        });

        it('should notify host component when set from somewhere else', () => {
          const newValue = !templateTestComponent.navTestNextDisabled;
          const emitSpy = vi.spyOn(navWizardPage.nextStepDisabledChange, 'emit');
          let twoWayBindingTest = templateTestComponent.navTwoWayBindingPassed;

          expect(twoWayBindingTest, 'do not expect binding to have passed up from page').toBe(false);
          expect(emitSpy).not.toHaveBeenCalled();
          navWizardPage.nextStepDisabled = newValue;

          renderFixture(fixture);

          // get new value
          twoWayBindingTest = templateTestComponent.navTwoWayBindingPassed;

          expect(twoWayBindingTest, 'two-way binding should have notified host').toBe(true);
          expect(emitSpy).toHaveBeenCalledWith(newValue);
        });

        it('should emit when set through host component', () => {
          const newValue = !templateTestComponent.navTestNextDisabled;
          const emitSpy = vi.spyOn(navWizardPage.nextStepDisabledChange, 'emit');
          let twoWayBindingTest = templateTestComponent.navTwoWayBindingPassed;

          expect(twoWayBindingTest, 'do not expect binding to have executed').toBe(false);
          expect(emitSpy).not.toHaveBeenCalled();

          templateTestComponent.navTestNextDisabled = newValue;
          renderFixture(fixture);

          // get new value
          twoWayBindingTest = templateTestComponent.navTwoWayBindingPassed;

          expect(twoWayBindingTest, 'two-way binding should have notified host').toBe(true);
          expect(emitSpy).toHaveBeenCalledWith(newValue);
        });
      });

      describe('previousStepDisabled', () => {
        it('should allow for setting input through component', () => {
          let hostVal = templateTestComponent.navTestPreviousDisabled;
          let testVal = navWizardPage.previousStepDisabled;

          expect(hostVal, 'expect init value to be true').toBe(true);
          expect(
            navWizardPage.previousStepDisabled,
            'expect component value and wizard page value to be the same'
          ).toBe(hostVal);

          templateTestComponent.navTestPreviousDisabled = false;
          renderFixture(fixture);

          // get new values
          hostVal = templateTestComponent.navTestPreviousDisabled;
          testVal = navWizardPage.previousStepDisabled;

          expect(hostVal, 'expect updated value to be false').toBe(false);
          expect(testVal, 'expect component value and wizard page value to be the same after update').toBe(hostVal);
        });

        it('should notify host component when set from somewhere else', () => {
          const newValue = !templateTestComponent.navTestPreviousDisabled;
          const emitSpy = vi.spyOn(navWizardPage.previousStepDisabledChange, 'emit');
          let twoWayBindingTest = templateTestComponent.navTwoWayBindingPassed;

          expect(twoWayBindingTest, 'do not expect binding to have passed up from page').toBe(false);
          expect(emitSpy).not.toHaveBeenCalled();

          navWizardPage.previousStepDisabled = newValue;
          renderFixture(fixture);

          // get new vals
          twoWayBindingTest = templateTestComponent.navTwoWayBindingPassed;

          expect(twoWayBindingTest, 'two-way binding should have notified host').toBe(true);
          expect(emitSpy).toHaveBeenCalledWith(newValue);
        });

        it('should emit when set through host component', () => {
          const newValue = !templateTestComponent.navTestPreviousDisabled;
          const emitSpy = vi.spyOn(navWizardPage.previousStepDisabledChange, 'emit');
          let twoWayBindingTest = templateTestComponent.navTwoWayBindingPassed;

          expect(twoWayBindingTest, 'do not expect binding to have executed').toBe(false);
          expect(emitSpy).not.toHaveBeenCalled();

          templateTestComponent.navTestPreviousDisabled = newValue;
          renderFixture(fixture);

          // new vals
          twoWayBindingTest = templateTestComponent.navTwoWayBindingPassed;

          expect(twoWayBindingTest, 'two-way binding should have notified host').toBe(true);
          expect(emitSpy).toHaveBeenCalledWith(newValue);
        });
      });

      describe('stopCancel', () => {
        it('should initialize as false', () => {
          // not set on other page
          const test = otherWizardPage.stopCancel;
          expect(test).toBe(false);
        });

        it('should allow for setting input through component', () => {
          let hostVal = templateTestComponent.navStopCancel;
          let testVal = navWizardPage.stopCancel;

          expect(hostVal, 'expect init value to be false').toBe(false);
          expect(testVal, 'expect component value and wizard page value to be the same').toBe(hostVal);

          templateTestComponent.navStopCancel = false;
          renderFixture(fixture);

          hostVal = templateTestComponent.navStopCancel;
          testVal = navWizardPage.stopCancel;

          expect(hostVal, 'expect updated value to be false').toBe(false);
          expect(testVal, 'expect component value and wizard page value to be the same after update').toBe(hostVal);
        });

        it('should notify host component when set from somewhere else', () => {
          const newValue = !templateTestComponent.navStopCancel;
          const emitSpy = vi.spyOn(navWizardPage.stopCancelChange, 'emit');
          let twoWayBindingTest = templateTestComponent.navTwoWayBindingPassed;

          expect(twoWayBindingTest, 'do not expect binding to have passed up from page').toBe(false);
          expect(emitSpy).not.toHaveBeenCalled();

          navWizardPage.stopCancel = newValue;
          renderFixture(fixture);

          twoWayBindingTest = templateTestComponent.navTwoWayBindingPassed;

          expect(twoWayBindingTest, 'two-way binding should have notified host').toBe(true);
          expect(emitSpy).toHaveBeenCalledWith(newValue);
        });

        it('should emit when set through host component', () => {
          const newValue = !templateTestComponent.navStopCancel;
          const emitSpy = vi.spyOn(navWizardPage.stopCancelChange, 'emit');
          let twoWayBindingTest = templateTestComponent.navTwoWayBindingPassed;

          expect(twoWayBindingTest, 'do not expect binding to have executed').toBe(false);
          expect(emitSpy).not.toHaveBeenCalled();

          templateTestComponent.navStopCancel = newValue;
          renderFixture(fixture);

          twoWayBindingTest = templateTestComponent.navTwoWayBindingPassed;

          expect(twoWayBindingTest, 'two-way binding should have notified host').toBe(true);
          expect(emitSpy).toHaveBeenCalledWith(newValue);
        });
      });

      describe('onLoad', () => {
        it('should emit when page is made current and pass page id when emitted', () => {
          const emitSpy = vi.spyOn(otherWizardPage.onLoad, 'emit');
          expect(
            templateTestComponent.loadedPageId,
            'other wizard page should not be the current page starting out'
          ).not.toBe(otherWizardPage.id);
          emitSpy.mockClear();
          otherWizardPage.makeCurrent();
          renderFixture(fixture);
          expect(emitSpy).toHaveBeenCalledWith(otherWizardPage.id);
          expect(templateTestComponent.loadedPageId).toBe(otherWizardPage.id);
        });

        it('should not emit when another page is made current', () => {
          const emitSpy = vi.spyOn(otherWizardPage.onLoad, 'emit');
          lifecycleWizardPage.makeCurrent();
          renderFixture(fixture);
          expect(emitSpy).not.toHaveBeenCalled();
          expect(templateTestComponent.loadedPageId).not.toBe(otherWizardPage.id);
        });
      });

      describe('id', () => {
        it('should use custom id when defined in input', () => {
          expect(otherWizardPage.id).toBe('clr-wizard-page-ohai');
        });

        it('should update id when input is updated', () => {
          templateTestComponent.testId = 'onoez';
          renderFixture(fixture);
          expect(otherWizardPage.id).toBe('clr-wizard-page-onoez');
        });

        it('should use numeric index when input is not defined', () => {
          const idToTest = navWizardPage.id;
          const idSplitAndFlipped = idToTest.split('-').reverse();
          const idIndex = Number(idSplitAndFlipped[0]);
          expect(idToTest, 'default id should include expected prefix').toContain('clr-wizard-page-');
          expect(isNaN(idIndex), 'default id should have numeric index').toBe(false);
        });
      });

      describe('onInit', () => {
        it('should make page current if no current page is defined in navService', () => {
          // first page in list should be made current when wizard starts up
          const currentPage = navService.currentPage;
          expect(currentPage).toBe(navWizardPage);
        });

        it('should not make page current if current page is defined in navService', () => {
          const currentPage = navService.currentPage;
          expect(currentPage).not.toBe(otherWizardPage);
        });
      });
    });

    let viewTestComponent: ViewTestComponent;
    let allTestPages: DebugElement[];
    let pageOne: DebugElement;
    let pageTwo: DebugElement;
    let pageThree: DebugElement;
    let pageFour: DebugElement;

    describe('View and Behavior', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrWizardModule, ClrIcon, ClrAlertModule],
          declarations: [ViewTestComponent],
          providers: [WizardNavigationService, PageCollectionService, ButtonHubService],
        });
        fixture = TestBed.createComponent(ViewTestComponent);
        renderFixture(fixture);
        viewTestComponent = fixture.componentInstance;
        navService = fixture.debugElement.injector.get(WizardNavigationService);
        allTestPages = fixture.debugElement.queryAll(By.directive(ClrWizardPage));
        allTestPages.forEach(thisPage => {
          switch (thisPage.componentInstance) {
            case viewTestComponent.pageOne:
              pageOne = thisPage;
              break;
            case viewTestComponent.pageTwo:
              pageTwo = thisPage;
              break;
            case viewTestComponent.pageThree:
              pageThree = thisPage;
              break;
            case viewTestComponent.pageFour:
              pageFour = thisPage;
              break;
            default:
              break;
          }
        });
      });

      afterEach(() => {
        fixture.destroy();
      });

      describe('content', () => {
        it('should display projected content', () => {
          expect(pageTwo, 'test page should be in wizard').toBeTruthy();
          expect(
            pageTwo.nativeElement.textContent.trim(),
            'projected content should match content in host component'
          ).toBe(viewTestComponent.projector);
        });

        it('should update projected content', () => {
          const oldContent = viewTestComponent.projector;
          const newContent = 'my updated content';

          viewTestComponent.projector = newContent;
          renderFixture(fixture);

          const updatedContent = pageTwo.nativeElement.textContent.trim();

          expect(updatedContent, 'old content should not be there').not.toBe(oldContent);
          expect(updatedContent, 'projected content should be updated').toBe(newContent);
        });

        it('should be able to project other components', () => {
          const myInnerComponent = pageFour.query(By.directive(ClrAlert));

          expect(myInnerComponent, 'inner alert component should exist').toBeDefined();
          expect(
            myInnerComponent.nativeElement.textContent.trim(),
            'content should project through to inner components'
          ).toContain('i believe the answer is 6');
        });

        it('should allow for asynchronous content', async () => {
          expect(pageThree.nativeElement.textContent.trim()).toBe('Loading...');
          viewTestComponent.loadAsync();

          await delay(120);

          renderFixture(fixture);
          expect(viewTestComponent.asyncLoaded, 'make sure async routine ran').toBe(true);
          expect(pageThree.nativeElement.textContent.trim()).toBe('better late than never');
        });
      });

      describe('id', () => {
        let idToTest: string;
        let idSplitAndFlipped: string[];
        let idIndex: number;

        it('should have its id in the id attribute', () => {
          expect(pageOne.nativeElement.id).toBe('clr-wizard-page-ohai');
        });

        it('updating id input should update id attribute', () => {
          viewTestComponent.testId = 'onoez';
          renderFixture(fixture);
          expect(pageOne.nativeElement.id).toBe('clr-wizard-page-onoez');
        });

        it('should have an id even if the id input is not defined', () => {
          idToTest = pageTwo.nativeElement.id;
          expect(idToTest, 'page id is defined by default').toBeDefined();
          idSplitAndFlipped = idToTest.split('-').reverse();
          idIndex = Number(idSplitAndFlipped[0]);
          expect(idToTest, 'default id should include expected prefix').toContain('clr-wizard-page-');
          expect(isNaN(idIndex), 'default id should have numeric index').toBe(false);
        });

        it('should have an id even if id input is changed to falsy', () => {
          viewTestComponent.testId = null;
          renderFixture(fixture);
          idToTest = pageOne.nativeElement.id;
          idSplitAndFlipped = idToTest.split('-').reverse();
          idIndex = Number(idSplitAndFlipped[0]);
          expect(idToTest, 'id should still exist').toBeDefined();
          expect(idToTest, 'id should not use string value of falsy input').not.toBe('clr-wizard-page-null');
          expect(idToTest, 'default id should include expected prefix').toContain('clr-wizard-page-');
          expect(isNaN(idIndex), 'default id should have numeric index').toBe(false);
        });
      });

      describe('view', () => {
        it('aria-hidden should reflect if page is not current', () => {
          // explicitly set a page to current
          const expectedPage = pageTwo.componentInstance;

          viewTestComponent.testWizard.next();
          renderFixture(fixture);

          const currentPage = viewTestComponent.testWizard.navService.currentPage;
          const pageOneTest = pageOne.nativeElement.getAttribute('aria-hidden');
          const pageTwoTest = pageTwo.nativeElement.getAttribute('aria-hidden');
          const currentPageIdTest = currentPage.id === expectedPage.id;

          expect(currentPageIdTest, 'make sure current page got set as expected').toBe(true);

          // check aria-hidden on non-current page
          expect(pageOneTest, 'non-current page has aria-hidden true').toBe('true');
          expect(pageTwoTest, 'current page has aria-hidden false').toBe('false');
        });

        it("aria-labelledby should reflect page's stepItemId", () => {
          const pageColl = viewTestComponent.testWizard.pageCollection;
          const test = pageOne.nativeElement.getAttribute('aria-labelledby');
          const expected = pageColl.getStepItemIdForPage(pageOne.componentInstance);
          expect(test).toBe(expected);
        });

        it("aria-labelledby should update if page's id is changed", () => {
          const pageColl = viewTestComponent.testWizard.pageCollection;

          viewTestComponent.testId = 'onoez';
          renderFixture(fixture);

          const labelToTest = pageOne.nativeElement.getAttribute('aria-labelledby');
          const expected = pageColl.getStepItemIdForPage(pageOne.componentInstance);

          expect(labelToTest, 'updated label should be reflected in component view').toBe(expected);
          expect(labelToTest, 'aria-labelledBy should update').toContain('onoez');
        });

        it('should have .clr-wizard-page class', () => {
          const test = pageThree.nativeElement.classList.contains('clr-wizard-page');
          expect(test).toBe(true);
        });
      });

      describe('previousStepDisabled', () => {
        it('should disable previous button at wizard level when set ' + 'and page is the current page', () => {
          // verify button is not disabled at this point
          const pageToTest = pageTwo.componentInstance;
          const wizard = viewTestComponent.testWizard;
          const debugWiz = fixture.debugElement.query(By.directive(ClrWizard));
          let previousBtn: Node;
          let wizardBtnDisabled: boolean;

          // setup
          wizard.navService.next();
          renderFixture(fixture);

          const testIfCurrent = wizard.navService.currentPage === pageToTest;

          expect(testIfCurrent, 'expect page to have been made current').toBe(true);

          previousBtn = debugWiz.nativeElement.querySelector('.clrtest-wizard-previous > button');
          expect(previousBtn, 'expect wizard buttons to be present').not.toBe(null);

          wizardBtnDisabled = viewTestComponent.wizardPreviousBtn.isDisabled;
          expect(wizardBtnDisabled, 'expect wizard level button not to be disabled').toBe(false);

          previousBtn = debugWiz.nativeElement.querySelector('.clrtest-wizard-previous > button.disabled');
          expect(previousBtn, 'expect wizard level button to not have disabled class').toBe(null);

          viewTestComponent.disablePrevious = true;
          renderFixture(fixture);

          wizardBtnDisabled = viewTestComponent.wizardPreviousBtn.isDisabled;
          expect(wizardBtnDisabled, 'expect wizard level button to be disabled').toBe(true);

          previousBtn = debugWiz.nativeElement.querySelector('.clrtest-wizard-previous > button.disabled');
          expect(previousBtn, 'expect wizard level button to have disabled class').not.toBe(null);
        });

        it('should disable previous button at page level when set ' + 'and page is the current page', () => {
          // verify button is not disabled at this point
          const pageToTest = pageThree.componentInstance;
          const wizard = viewTestComponent.testWizard;
          const debugWiz = fixture.debugElement.query(By.directive(ClrWizard));
          let previousBtn: DebugElement;
          let wizardBtnDisabled: boolean;

          // setup -- going to page three
          wizard.next();
          wizard.next();

          renderFixture(fixture);

          const testIfCurrent = wizard.navService.currentPage === pageToTest;
          expect(testIfCurrent, 'expect page to have been made current').toBe(true);

          previousBtn = debugWiz.nativeElement.querySelector('.clrtest-page-previous-2');
          expect(previousBtn, 'expect page buttons to be present').not.toBe(null);
          wizardBtnDisabled = viewTestComponent.pagePreviousBtn.isDisabled;
          expect(wizardBtnDisabled, 'expect page level button not to be disabled').toBe(false);

          previousBtn = debugWiz.nativeElement.querySelector('.clrtest-page-previous-2 > button.disabled');
          expect(previousBtn, 'expect page level button to not have disabled class').toBe(null);

          viewTestComponent.disablePrevious = true;
          renderFixture(fixture);

          wizardBtnDisabled = viewTestComponent.pagePreviousBtn.isDisabled;
          expect(wizardBtnDisabled, 'expect page level button to be disabled').toBe(true);

          previousBtn = debugWiz.nativeElement.querySelector('.clrtest-page-previous-2 > button.disabled');
          expect(previousBtn, 'expect page level button to have disabled class').not.toBe(null);
        });
      });

      describe('buttons', () => {
        it('should not show page-level buttons when page is not current', () => {
          const pageToTest = pageThree.componentInstance;
          const wizard = viewTestComponent.testWizard;
          const debugWiz = fixture.debugElement.query(By.directive(ClrWizard));

          // setup
          wizard.next();
          viewTestComponent.disablePrevious = true;
          renderFixture(fixture);

          const testIfCurrent = wizard.navService.currentPage === pageToTest;
          expect(testIfCurrent, 'expect page not to be current').not.toBe(true);
          const previousBtn = debugWiz.nativeElement.querySelector('.clrtest-page-previous-2 > button');

          // absent query result is null
          expect(previousBtn, 'page-level buttons should not be here').toBeNull();
        });
      });

      describe('stopCancel', () => {
        it('should subvert cancel routine if true', () => {
          const pageToTest = pageOne;
          const wizard = viewTestComponent.testWizard;
          const debugWiz = fixture.debugElement.query(By.directive(ClrWizard));
          const serviceSpy = vi.spyOn(wizard.navService, 'cancel');
          const pageSpy = vi.spyOn(pageToTest.componentInstance.pageOnCancel, 'emit');
          const wizardCancelSpy = vi.spyOn(wizard.onCancel, 'emit');
          const wizardCloseSpy = vi.spyOn(wizard, 'close');

          // setup
          viewTestComponent.preventCancel = true;
          renderFixture(fixture);

          const currentPage = wizard.navService.currentPage;
          const expectedCurrent = currentPage === pageToTest.componentInstance;
          expect(expectedCurrent, 'expect page to be current').toBe(true);

          const cancelBtn = debugWiz.nativeElement.querySelector('.clrtest-page-cancel > button');
          cancelBtn.click();

          // navservice should fire cancel event
          expect(serviceSpy).toHaveBeenCalled();

          // page should fire cancel event
          expect(pageSpy).toHaveBeenCalled();

          // wizard should not fire cancel event if cancel is overridden at page level
          expect(wizardCancelSpy).not.toHaveBeenCalled();

          // close should not happen
          expect(wizardCloseSpy).not.toHaveBeenCalled();
        });

        it('should allow cancel routine if false', () => {
          const pageToTest = pageOne;
          const wizard = viewTestComponent.testWizard;
          const debugWiz = fixture.debugElement.query(By.directive(ClrWizard));
          const serviceSpy = vi.spyOn(wizard.navService, 'cancel');
          const pageSpy = vi.spyOn(pageToTest.componentInstance.pageOnCancel, 'emit');
          const wizardCancelSpy = vi.spyOn(wizard.onCancel, 'emit');
          const wizardCloseSpy = vi.spyOn(wizard, 'close');

          // setup
          viewTestComponent.preventCancel = false; // set explicitly
          renderFixture(fixture);

          const currentPage = wizard.navService.currentPage;
          const expectedCurrent = currentPage === pageToTest.componentInstance;
          expect(expectedCurrent, 'expect page to be current').toBe(true);

          const cancelBtn = debugWiz.nativeElement.querySelector('.clrtest-page-cancel > button');
          cancelBtn.click();

          // navservice should fire cancel event
          expect(serviceSpy).toHaveBeenCalled();
          // page should fire cancel event
          expect(pageSpy).toHaveBeenCalled();
          // wizard should fire cancel event
          expect(wizardCancelSpy).toHaveBeenCalled();
          // close should happen
          expect(wizardCloseSpy).toHaveBeenCalled();
        });

        it('should allow cancel routine by default', () => {
          const pageToTest = pageTwo;
          const wizard = viewTestComponent.testWizard;
          const debugWiz = fixture.debugElement.query(By.directive(ClrWizard));
          const serviceSpy = vi.spyOn(wizard.navService, 'cancel');
          const pageSpy = vi.spyOn(pageToTest.componentInstance.pageOnCancel, 'emit');
          const wizardCancelSpy = vi.spyOn(wizard.onCancel, 'emit');
          const wizardCloseSpy = vi.spyOn(wizard, 'close');

          wizard.next();
          renderFixture(fixture);

          // setup
          const currentPage = wizard.navService.currentPage;
          const expectedCurrent = currentPage === pageToTest.componentInstance;
          expect(expectedCurrent, 'expect page to be current').toBe(true);

          const cancelBtn = debugWiz.nativeElement.querySelector('.clr-test-wizard-cancel > button');
          cancelBtn.click();

          // navservice should fire cancel event
          expect(serviceSpy).toHaveBeenCalled();

          // page should fire cancel event
          expect(pageSpy).toHaveBeenCalled();

          // wizard should fire cancel event
          expect(wizardCancelSpy).toHaveBeenCalled();

          // close should happen
          expect(wizardCloseSpy).toHaveBeenCalled();
        });

        it('should run alt cancel routine if true and pageOnCancel is provided', () => {
          const pageToTest = pageFour;
          const wizard = viewTestComponent.testWizard;
          const debugWiz = fixture.debugElement.query(By.directive(ClrWizard));
          const serviceSpy = vi.spyOn(wizard.navService, 'cancel');
          const pageSpy = vi.spyOn(pageToTest.componentInstance.pageOnCancel, 'emit');
          const wizardCancelSpy = vi.spyOn(wizard.onCancel, 'emit');
          const wizardCloseSpy = vi.spyOn(wizard, 'close');
          const componentSpy = vi.spyOn(viewTestComponent, 'altCancel');

          // setup
          wizard.next(); // => page 2
          wizard.next(); // => page 3
          wizard.next(); // => page 4

          viewTestComponent.preventCancel = true;

          renderFixture(fixture);

          const currentPage = wizard.navService.currentPage;
          const expectedCurrent = currentPage === pageToTest.componentInstance;
          expect(expectedCurrent, 'expect page to be current').toBe(true);

          expect(viewTestComponent.altCancelRan, 'verify alt cancel is false').toBe(false);

          const cancelBtn = debugWiz.nativeElement.querySelector('.clr-test-wizard-cancel > button');
          cancelBtn.click();

          // navservice should fire cancel event
          expect(serviceSpy).toHaveBeenCalled();

          // page should fire cancel event
          expect(pageSpy).toHaveBeenCalled();

          // wizard should not fire cancel event if page has override
          expect(wizardCancelSpy).not.toHaveBeenCalled();

          // close should not happen
          expect(wizardCloseSpy).not.toHaveBeenCalled();

          // we did alt-cancel
          expect(componentSpy).toHaveBeenCalled();

          // alt-cancel did work
          expect(viewTestComponent.altCancelRan, 'alt cancel ran').toBe(true);
        });
      });

      describe('onCommit', () => {
        let innerPage: DebugElement;
        let endPage: DebugElement;
        let wizard: ClrWizard;
        let debugWiz: DebugElement;
        let debugElem: HTMLElement;
        let cancelBtn: any;
        let previousBtn: any;
        let customBtn: any;
        let nextBtn: any;
        let dangerBtn: any;
        let finishBtn: any;

        beforeEach(() => {
          innerPage = pageTwo;
          endPage = pageFour;
          wizard = viewTestComponent.testWizard;
          debugWiz = fixture.debugElement.query(By.directive(ClrWizard));
          debugElem = debugWiz.nativeElement;

          wizard.next(); // => page 2

          // make sure primary buttons aren't disabled...
          innerPage.componentInstance.nextStepDisabled = false;
          renderFixture(fixture);

          cancelBtn = debugElem.querySelector('.clr-test-wizard-cancel > button');
          previousBtn = debugElem.querySelector('.clrtest-wizard-previous > button');
          customBtn = debugElem.querySelector('.clrtest-wizard-custom > button');
          nextBtn = debugElem.querySelector('.clrtest-wizard-next > button');
          dangerBtn = debugElem.querySelector('.clrtest-wizard-danger > button');
          finishBtn = debugElem.querySelector('.clrtest-wizard-finish > button');
        });

        it('should emit when next button is clicked', () => {
          // need to use innerPage because next doesn't work on last page
          const clickSpy = vi.spyOn(innerPage.componentInstance.nextButtonClicked, 'emit');
          const otherClickSpy = vi.spyOn(endPage.componentInstance.nextButtonClicked, 'emit');
          const primaryBtnSpy = vi.spyOn(innerPage.componentInstance.primaryButtonClicked, 'emit');
          const commitSpy = vi.spyOn(innerPage.componentInstance.onCommit, 'emit');

          nextBtn.click();

          expect(clickSpy).toHaveBeenCalled();
          expect(primaryBtnSpy).toHaveBeenCalled();
          expect(commitSpy).toHaveBeenCalled();

          // make sure other page click events weren't emitted
          expect(otherClickSpy).not.toHaveBeenCalled();
        });

        it('should emit when finish button is clicked', () => {
          const clickSpy = vi.spyOn(endPage.componentInstance.finishButtonClicked, 'emit');
          const otherClickSpy = vi.spyOn(innerPage.componentInstance.nextButtonClicked, 'emit');
          const primaryBtnSpy = vi.spyOn(endPage.componentInstance.primaryButtonClicked, 'emit');
          const commitSpy = vi.spyOn(endPage.componentInstance.onCommit, 'emit');

          // need end page for finish button to work
          // have to set up for navigation to end page
          endPage.componentInstance.nextStepDisabled = false;

          wizard.next(); // page 3
          wizard.next(); // page 4

          // this gets called with .next() to page 3; reset for testing below;
          otherClickSpy.mockClear();

          renderFixture(fixture);

          finishBtn.click();

          expect(clickSpy).toHaveBeenCalled();
          expect(primaryBtnSpy).toHaveBeenCalled();
          expect(commitSpy).toHaveBeenCalled();

          // make sure other page click events weren't emitted
          expect(otherClickSpy).not.toHaveBeenCalled();
        });

        it('should emit when danger button is clicked', () => {
          // need to use innerPage because next doesn't work on last page
          const clickSpy = vi.spyOn(innerPage.componentInstance.dangerButtonClicked, 'emit');
          const primaryBtnSpy = vi.spyOn(innerPage.componentInstance.primaryButtonClicked, 'emit');
          const commitSpy = vi.spyOn(innerPage.componentInstance.onCommit, 'emit');

          dangerBtn.click();

          expect(clickSpy).toHaveBeenCalled();
          expect(primaryBtnSpy).toHaveBeenCalled();
          expect(commitSpy).toHaveBeenCalled();
        });

        it('should not emit when cancel button is clicked', () => {
          // need to use innerPage because next doesn't work on last page
          const clickSpy = vi.spyOn(innerPage.componentInstance.pageOnCancel, 'emit');
          const primaryBtnSpy = vi.spyOn(innerPage.componentInstance.primaryButtonClicked, 'emit');
          const commitSpy = vi.spyOn(innerPage.componentInstance.onCommit, 'emit');

          cancelBtn.click();

          expect(clickSpy).toHaveBeenCalled();
          expect(primaryBtnSpy).not.toHaveBeenCalled();
          expect(commitSpy).not.toHaveBeenCalled();
        });

        it('should not emit when previous button is clicked', () => {
          // need to use innerPage because next doesn't work on last page
          const clickSpy = vi.spyOn(innerPage.componentInstance.previousButtonClicked, 'emit');
          const primaryBtnSpy = vi.spyOn(innerPage.componentInstance.primaryButtonClicked, 'emit');
          const commitSpy = vi.spyOn(innerPage.componentInstance.onCommit, 'emit');

          previousBtn.click();

          expect(clickSpy).toHaveBeenCalled();
          expect(primaryBtnSpy).not.toHaveBeenCalled();
          expect(commitSpy).not.toHaveBeenCalled();
        });

        it('should not emit when a custom button is clicked', () => {
          // need to use innerPage because next doesn't work on last page
          const primaryBtnSpy = vi.spyOn(innerPage.componentInstance.primaryButtonClicked, 'emit');
          const clickSpy = vi.spyOn(innerPage.componentInstance.customButtonClicked, 'emit');
          const commitSpy = vi.spyOn(innerPage.componentInstance.onCommit, 'emit');

          customBtn.click();

          expect(clickSpy).toHaveBeenCalledWith('custom-custom');
          expect(primaryBtnSpy).not.toHaveBeenCalled();
          expect(commitSpy).not.toHaveBeenCalled();
        });
      });
    });
  });
});
