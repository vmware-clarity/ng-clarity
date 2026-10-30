/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { createTestHelpers, delay, TestContext } from '@clr/angular/testing';

import { PageCollectionService } from './providers/page-collection.service';
import { WizardNavigationService } from './providers/wizard-navigation.service';
import { TemplateApiWizardTestComponent } from './test-components/api-wizard.mock';
import { BasicWizardTestComponent } from './test-components/basic-wizard.mock';
import { DynamicEmptyWizardTestComponent } from './test-components/dynamic-empty-wizard.mock';
import { DynamicWizardTestComponent } from './test-components/dynamic-wizard.mock';
import { UnopenedWizardTestComponent } from './test-components/unopened-wizard.mock';
import { ClrWizard } from './wizard';

describe('New Wizard Tests', () => {
  describe('Wizard', () => {
    const helpers = createTestHelpers();

    describe('Typescript API', () => {
      describe('Opening and closing', () => {
        let context: TestContext<ClrWizard, UnopenedWizardTestComponent>;
        let wizard: ClrWizard;
        let component: UnopenedWizardTestComponent;

        beforeEach(async () => {
          context = helpers.create(ClrWizard, UnopenedWizardTestComponent);
          wizard = context.clarityDirective;
          component = context.testComponent;
          context.detectChanges();

          await context.fixture.whenStable();
        });

        describe('open', () => {
          it('should set this._open', () => {
            expect(wizard._open, 'hidden wizard._open should be false').toBe(false);
            wizard.open();
            expect(wizard._open, 'visible wizard._open should be true').toBe(true);
          });

          it('should handle two way binding on clrWizardOpen', () => {
            expect(wizard._open, 'hidden wizard._open should be false').toBe(false);
            expect(component.open, 'component binding is set to false').toBe(false);
            component.open = true;
            context.detectChanges();
            expect(wizard._open, 'hidden wizard._open should be true').toBe(true);
            expect(component.open, 'component binding is set to true').toBe(true);
          });
        });

        describe('close', () => {
          it('should set this._open', () => {
            expect(wizard._open, 'hidden wizard._open should be false').toBe(false);
            wizard.open();
            expect(wizard._open, 'visible wizard._open should be true').toBe(true);
            wizard.close();
            expect(wizard._open, 'closed wizard._open should be false').toBe(false);
          });

          it('should not do anything if stop navigation is set', () => {
            wizard.open();
            expect(wizard._open, 'visible wizard._open should be true').toBe(true);

            wizard.stopNavigation = true;
            wizard.close();

            expect(wizard._open, 'wizard._open should not have changed').toBe(true);
          });

          it('should not close on escape if clrWizardClosable is set to false', () => {
            wizard.open();
            expect(wizard.closable).toBe(true);
            expect(wizard._open).toBe(true);

            wizard.closable = false;
            document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
            context.detectChanges();

            expect(wizard.closable).toBe(false);
            expect(wizard._open).toBe(true);
          });
        });

        describe('toggle', () => {
          it('should call .open() if passed true', () => {
            vi.spyOn(wizard, 'open').mockImplementation(() => undefined);
            wizard.toggle(false);
            expect(wizard.open).not.toHaveBeenCalled();
            wizard.toggle(true);
            expect(wizard.open).toHaveBeenCalledTimes(1);
          });

          it('should call .close() if passed false', () => {
            vi.spyOn(wizard, 'close').mockImplementation(() => undefined);
            wizard.toggle(true);
            expect(wizard.close).not.toHaveBeenCalled();
            wizard.toggle(false);
            expect(wizard.close).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe('Convenience functions', () => {
        let context: TestContext<ClrWizard, BasicWizardTestComponent>;
        let wizardNavigationService: WizardNavigationService;
        let pageCollectionService: PageCollectionService;
        let wizard: ClrWizard;

        beforeEach(async () => {
          context = helpers.create(ClrWizard, BasicWizardTestComponent);
          wizardNavigationService = context.getClarityProvider(WizardNavigationService);
          pageCollectionService = context.getClarityProvider(PageCollectionService);
          wizard = context.clarityDirective;
          context.detectChanges();

          await context.fixture.whenStable();
        });

        describe('currentPage', () => {
          it('should match the navService', () => {
            let currentPagesMatch: boolean;
            currentPagesMatch = wizard.currentPage === wizardNavigationService.currentPage;
            expect(currentPagesMatch, 'current pages init as expected').toBe(true);
            wizard.next();
            context.detectChanges();
            currentPagesMatch = wizard.currentPage === wizardNavigationService.currentPage;
            expect(currentPagesMatch, 'current pages match after navigation').toBe(true);
          });
        });

        describe('isLast', () => {
          it('should return false if current page is not the last page', () => {
            const lastPage = pageCollectionService.lastPage;
            expect(wizard.currentPage, 'verify currentPage is not the last page').not.toBe(lastPage);
            expect(wizard.isLast, 'isLast should return false').toBe(false);
          });

          it('should return true if current page is the last page', () => {
            const lastPage = pageCollectionService.lastPage;

            // set last page
            wizardNavigationService.currentPage = lastPage;
            context.detectChanges();
            expect(wizard.currentPage, 'verify currentPage is the last page').toBe(lastPage);
            expect(wizard.isLast, 'isLast should return true').toBe(true);
          });
        });

        describe('isFirst', () => {
          it('should return false if current page is not the first page', () => {
            const firstPage = pageCollectionService.firstPage;
            // move wizard off first page
            wizard.next();
            context.detectChanges();
            expect(wizard.currentPage, 'verify currentPage is not the first page').not.toBe(firstPage);
            expect(wizard.isFirst, 'isFirst should return false').toBe(false);
          });

          it('should return true if current page is the last page', () => {
            const firstPage = pageCollectionService.firstPage;
            expect(wizard.currentPage, 'verify currentPage is the first page').toBe(firstPage);
            expect(wizard.isFirst, 'isFirst should return true').toBe(true);
          });
        });

        describe('previous', () => {
          it('should call the navService', () => {
            vi.spyOn(wizardNavigationService, 'previous').mockImplementation(() => undefined);
            wizard.previous();
            expect(wizardNavigationService.previous).toHaveBeenCalledTimes(1);
          });
        });

        describe('next', () => {
          it('should call the navService to emit checks and events if told to', () => {
            vi.spyOn(wizardNavigationService, 'next').mockImplementation(() => undefined);
            vi.spyOn(wizard, 'forceNext').mockImplementation(() => undefined);
            wizard.next(false);
            expect(wizardNavigationService.next).toHaveBeenCalledTimes(1);
            expect(wizard.forceNext).not.toHaveBeenCalled();
          });

          it('should call forceNext if told not to emit checks and events', () => {
            vi.spyOn(wizardNavigationService, 'next').mockImplementation(() => undefined);
            vi.spyOn(wizard, 'forceNext').mockImplementation(() => undefined);
            wizard.next(true);
            expect(wizardNavigationService.next).not.toHaveBeenCalled();
            expect(wizard.forceNext).toHaveBeenCalledTimes(1);
          });

          it('should call forceNext by default', () => {
            vi.spyOn(wizardNavigationService, 'next').mockImplementation(() => undefined);
            vi.spyOn(wizard, 'forceNext').mockImplementation(() => undefined);
            wizard.next();
            expect(wizardNavigationService.next).not.toHaveBeenCalled();
            expect(wizard.forceNext).toHaveBeenCalledTimes(1);
          });
        });

        describe('goTo', () => {
          it('should call the navService', () => {
            const testId = pageCollectionService.lastPage.id;
            vi.spyOn(wizardNavigationService, 'goTo').mockImplementation(() => undefined);
            wizard.goTo(testId);
            expect(wizardNavigationService.goTo).toHaveBeenCalledWith(testId);
          });

          it('should early return if not given a page id', () => {
            vi.spyOn(wizardNavigationService, 'goTo').mockImplementation(() => undefined);
            wizard.goTo(null);
            wizard.goTo('');
            expect(wizardNavigationService.goTo).not.toHaveBeenCalled();
          });
        });

        describe('reset', () => {
          it('should call the pageCollection and update the nav', () => {
            const firstPage = pageCollectionService.firstPage;
            vi.spyOn(pageCollectionService, 'reset');
            vi.spyOn(wizard.onReset, 'emit').mockImplementation(() => undefined);
            expect(wizard.currentPage, 'inits as expected').toBe(firstPage);
            wizard.next();
            context.detectChanges();
            expect(wizard.currentPage, 'navigates as expected').not.toBe(firstPage);
            wizard.reset();
            expect(pageCollectionService.reset).toHaveBeenCalledTimes(1);
            expect(wizard.onReset.emit).toHaveBeenCalledTimes(1);
            context.detectChanges();
            expect(wizard.currentPage, 'resets to first page').toBe(firstPage);
          });
        });
      });
    });

    // Inputs, Outputs, and initialization of component based on content-children
    describe('Template API', () => {
      let context: TestContext<ClrWizard, TemplateApiWizardTestComponent>;
      let wizard: ClrWizard;

      beforeEach(async () => {
        context = helpers.create(ClrWizard, TemplateApiWizardTestComponent);
        wizard = context.clarityDirective;
        context.detectChanges();

        await context.fixture.whenStable();
      });

      describe('Current page onchange', () => {
        it('should emit pageOnLoad when wizard is created', () => {
          context.detectChanges();
          expect(context.testComponent._firstPageLoaded, 'only once when created').toBe(1);
        });

        it('should emit page on load when navigating', () => {
          wizard.next();
          wizard.next();
          expect(context.testComponent._pagesLoaded).toBe(1);
        });

        it('should notify clrWizardCurrentPageChange output', () => {
          expect(context.testComponent._currentPageChange, 'only initial load').toBe(1);
          wizard.next();
          expect(context.testComponent._currentPageChange, 'increases with move forward').toBe(2);
          wizard.next();
          expect(context.testComponent._currentPageChange, 'increases with move forward').toBe(3);
          wizard.previous();
          expect(context.testComponent._currentPageChange, 'increases with move backward').toBe(4);
        });

        it('should notify clrWizardOnNext output', () => {
          expect(context.testComponent._movedForward, 'initial load').toBe(0);
          // need to do event emissions here, so passing false
          wizard.next(false);
          expect(context.testComponent._movedForward, 'increases with move forward').toBe(1);
          // need to do event emissions here, so passing false
          wizard.next(false);
          expect(context.testComponent._movedForward, 'increases with move forward').toBe(2);
          wizard.previous();
          expect(context.testComponent._movedForward, 'stays put with move backward').toBe(2);
        });

        it('should notify clrWizardOnPrevious output', () => {
          expect(context.testComponent._movedBackward, 'initial load').toBe(0);
          wizard.next();
          expect(context.testComponent._movedBackward, 'stays put with move forward').toBe(0);
          wizard.next();
          expect(context.testComponent._movedBackward, 'stays put with move forward').toBe(0);
          wizard.previous();
          expect(context.testComponent._movedBackward, 'increases with move backward').toBe(1);
          wizard.previous();
          expect(context.testComponent._movedBackward, 'increases with move backward').toBe(2);
        });
      });

      describe('Projection', () => {
        it('wizard title is projected', () => {
          let val = context.testElement.querySelector('.clr-wizard-title').textContent.trim();
          expect(val, 'projects as expected').toBe(context.testComponent.projectedTitle);
          context.testComponent.projectedTitle = 'OHAI';
          context.detectChanges();
          val = context.testElement.querySelector('.clr-wizard-title').textContent.trim();
          expect(val, 'updates as expected').toBe('OHAI');
        });

        it('wizard title has default heading level', () => {
          const wizardTitleElement = context.testElement.querySelector('.clr-wizard-title');
          expect(wizardTitleElement.getAttribute('role')).toBe('heading');
          expect(wizardTitleElement.getAttribute('aria-level')).toBe('1');
        });

        it('wizard title has customizable heading level', () => {
          context.testComponent.titleHeadingLevel = 2;
          context.detectChanges();

          const wizardTitleElement = context.testElement.querySelector('.clr-wizard-title');
          expect(wizardTitleElement.getAttribute('role')).toBe('heading');
          expect(wizardTitleElement.getAttribute('aria-level')).toBe('2');
        });

        it('wizard page title has default heading level', () => {
          const pageTitleElement = context.testElement.querySelector('.clr-wizard-page-title');
          expect(pageTitleElement.getAttribute('role')).toBe('heading');
          expect(pageTitleElement.getAttribute('aria-level')).toBe('2');
        });

        it('wizard page title has customizable heading level', () => {
          context.testComponent.pageTitleHeadingLevel = 3;
          context.detectChanges();

          const pageTitleElement = context.testElement.querySelector('.clr-wizard-page-title');
          expect(pageTitleElement.getAttribute('role')).toBe('heading');
          expect(pageTitleElement.getAttribute('aria-level')).toBe('3');
        });

        it('stepnav is present', () => {
          const val = context.testElement.querySelector('.clr-wizard-stepnav');
          expect(val).toBeTruthy();
        });

        it('content title should reflect current page and changes with it', () => {
          let val = context.testElement.querySelector('.clr-wizard-page-title-text').textContent.trim();
          expect(val, 'inits as expected').toBe('Longer Title for Page 1');

          wizard.next();
          context.detectChanges();

          val = context.testElement.querySelector('.clr-wizard-page-title-text').textContent.trim();
          expect(val, 'projects as expected').toBe(context.testComponent.projectedPageTitle);

          context.testComponent.projectedPageTitle = 'OHAI';
          context.detectChanges();

          val = context.testElement.querySelector('.clr-wizard-page-title-text').textContent.trim();
          expect(val, 'updates as expected').toBe('OHAI');
        });

        describe('Content', () => {
          it('content shows up', () => {
            const val = context.testElement.querySelector('.clr-wizard-page.active').textContent.trim();
            expect(val).toBe('Content for step 1');
          });

          it('content changes', () => {
            let val: string;

            wizard.pageCollection.lastPage.makeCurrent();
            context.detectChanges();

            // page 3 has projected content
            val = context.testElement.querySelector('.clr-wizard-page.active').textContent.trim();
            expect(val, 'projects as expected').toBe(context.testComponent.projectedContent);

            context.testComponent.projectedContent = 'OHAI';
            context.detectChanges();

            val = context.testElement.querySelector('.clr-wizard-page.active').textContent.trim();
            expect(val, 'updates as expected').toBe('OHAI');
          });

          it('content can lazy load if needed', async () => {
            let val: string;

            wizard.next();
            context.detectChanges();

            val = context.testElement.querySelector('.clr-wizard-page.active').textContent.trim();
            expect(val, 'projects as expected').toBe(context.testComponent.lazyLoadContent);

            context.testComponent.doLazyLoad();
            await delay();
            context.detectChanges();

            val = context.testElement.querySelector('.clr-wizard-page.active').textContent.trim();
            expect(val, 'updates as expected').toBe('Content loaded!');
          });
        });

        describe('Buttons', () => {
          it('buttons show up', () => {
            const cancel = context.testElement.querySelector('.clr-wizard-btn--tertiary');
            const previous = context.testElement.querySelector('.clr-wizard-btn--secondary');
            const next = context.testElement.querySelector('.clr-wizard-btn--primary:not(.disabled)');
            const finish = context.testElement.querySelector('.clr-wizard-btn--primary.disabled');

            expect(cancel).toBeTruthy();
            expect(previous).toBeTruthy();
            expect(next).toBeTruthy();
            expect(finish).toBeTruthy();
          });

          it('previous button is hidden on first page', () => {
            const previous = context.testElement.querySelector('.clr-wizard-btn--secondary');
            const val = previous.parentElement.attributes['aria-hidden'].value;
            expect(val).toBe('true');
          });

          it('next button is visible on every page except the last page', () => {
            const next = context.testElement.querySelector('.clr-wizard-btn--primary:not(.disabled)');
            let val = next.parentElement.attributes['aria-hidden'].value;
            expect(val).toBe('false');

            wizard.pageCollection.lastPage.makeCurrent();
            context.detectChanges();

            val = next.parentElement.attributes['aria-hidden'].value;
            expect(val).toBe('true');
          });

          it('finish button is hidden on every page except the last one', () => {
            const finish = context.testElement.querySelector('.clr-wizard-btn--primary.disabled');
            let val = finish.parentElement.attributes['aria-hidden'].value;
            expect(val).toBe('true');

            wizard.pageCollection.lastPage.makeCurrent();
            context.detectChanges();

            val = finish.parentElement.attributes['aria-hidden'].value;
            expect(val).toBe('false');
          });

          it('button text is projected as expected', () => {
            const previous = context.testElement.querySelector('.clr-wizard-btn--secondary');
            let val = previous.textContent.trim();
            expect(val, 'projects as expected').toBe(context.testComponent.projectedButton);

            context.testComponent.projectedButton = 'OHAI';
            context.detectChanges();

            val = previous.textContent.trim();
            expect(val, 'updates as expected').toBe('OHAI');
          });

          it('page buttons override default wizard buttons', () => {
            wizard.pageCollection.lastPage.makeCurrent();
            context.detectChanges();

            const cancel = context.testElement.querySelector('.clr-wizard-btn--tertiary');
            const previous = context.testElement.querySelector('.clr-wizard-btn--secondary');
            const next = context.testElement.querySelector('.clr-wizard-btn--primary.disabled');
            const finish = context.testElement.querySelector('.clr-wizard-btn--primary:not(.disabled)');

            // custom buttons can omit expected buttons if they want
            expect(cancel).toBeNull();
            expect(previous).toBeNull();
            expect(next).toBeNull();
            expect(finish).toBeTruthy();
            expect(finish.textContent.trim()).toBe(context.testComponent.projectedCustomButton);

            context.testComponent.projectedCustomButton = 'Ohai';
            context.detectChanges();
            expect(finish.textContent.trim()).toBe('Ohai');
          });
        });
      });

      describe('Misc Observables', () => {
        it('clrWizardOnCancel output is fired when cancel button is clicked', () => {
          const cancel: HTMLElement = context.testElement.querySelector('.clr-wizard-btn--tertiary');

          expect(context.testComponent._cancelled, 'verify initial state').toBe(0);
          cancel.click();
          context.detectChanges();
          expect(context.testComponent._cancelled, 'cancel button worked').toBe(1);
        });

        it('clrWizardOnCancel output is fired when close X is clicked', () => {
          const closeBtn: HTMLElement = context.testElement.querySelector('button.close');
          expect(context.testComponent._cancelled, 'verify initial state').toBe(0);

          closeBtn.click();
          context.detectChanges();
          expect(context.testComponent._cancelled, 'close X worked').toBe(1);
        });

        it('clrWizardOnCancel output is not fired when wizard is closed by finish button', () => {
          expect(context.testComponent._cancelled, 'verify initial state').toBe(0);

          wizard.pageCollection.lastPage.makeCurrent();
          context.detectChanges();
          const finish = context.testElement.querySelector('.clr-wizard-btn--primary:not(.disabled)') as HTMLElement;
          finish.click();
          context.detectChanges();

          // also validates that custom button worked...
          expect(context.testComponent._cancelled, 'finish button did not fire cancel').toBe(0);
          expect(wizard._open, 'custom finish closed the wizard').toBe(false);
        });

        it('clrWizardOnFinish output is fired', () => {
          expect(context.testComponent._finished, 'verify initial state').toBe(0);

          wizard.pageCollection.lastPage.makeCurrent();
          context.detectChanges();
          const finish = context.testElement.querySelector('.clr-wizard-btn--primary:not(.disabled)') as HTMLElement;
          finish.click();
          context.detectChanges();

          // also validates that custom button worked...
          expect(context.testComponent._finished, 'finish button fired event').toBe(1);
        });
      });

      describe('Pages', () => {
        it('sets pageCollection.pages', () => {
          const wizpages = wizard.pages;
          const pagecollection = wizard.pageCollection.pages;
          const expected = wizpages === pagecollection;
          expect(expected).toBe(true);
        });

        it('pageCollection.pages updates when Wizard.pages does', () => {
          const wizpages = wizard.pages;
          const pagecollection = wizard.pageCollection.pages;
          let expected = wizpages === pagecollection;
          const origPageCount = wizard.pageCollection.pagesCount + 0;

          expect(expected, 'inits as the same').toBe(true);
          context.testComponent.showExtraPage = true;
          context.detectChanges();

          expected = wizpages === pagecollection;
          expect(wizard.pageCollection.pagesCount).not.toEqual(origPageCount);
          expect(expected, 'updates as expected').toBe(true);
        });
      });

      describe('Alt-Cancel', () => {
        it('navService.wizardHasAltCancel is set to wizard.stopCancel and updates dynamically', () => {
          let val = wizard.navService.wizardHasAltCancel;
          let expected = wizard.stopCancel;
          expect(val, 'inits as expected').toBe(expected);

          wizard.stopCancel = true;
          context.detectChanges();

          val = wizard.navService.wizardHasAltCancel;
          expected = true;
          expect(val, 'updates as expected').toBe(expected);
        });
      });

      describe('Alt-Next', () => {
        it('navService.wizardHasAltNext is set to wizard.stopNext and updates dynamically', () => {
          let val = wizard.navService.wizardHasAltNext;
          let expected = wizard.stopNext;
          expect(val, 'inits as expected').toBe(expected);

          wizard.stopNext = true;
          context.detectChanges();

          val = wizard.navService.wizardHasAltNext;
          expected = true;
          expect(val, 'updates as expected').toBe(expected);
        });
      });

      describe('Stop Navigation', () => {
        it('navService.wizardStopNavigation is set to wizard.stopNavigation and updates dynamically', () => {
          let val = wizard.navService.wizardStopNavigation;
          let expected = wizard.stopNavigation;
          expect(val, 'inits as expected').toBe(expected);

          wizard.stopNavigation = true;
          context.detectChanges();

          val = wizard.navService.wizardStopNavigation;
          expected = true;
          expect(val, 'updates as expected').toBe(expected);
        });
      });

      describe('Force-Forward', () => {
        it('navService.forceForwardNavigation is set to wizard.forceForward and updates dynamically', () => {
          let val = wizard.navService.forceForwardNavigation;
          let expected = wizard.forceForward;
          expect(val, 'inits as expected').toBe(expected);

          wizard.forceForward = true;
          context.detectChanges();

          val = wizard.navService.forceForwardNavigation;
          expected = true;
          expect(val, 'updates as expected').toBe(expected);
        });
      });

      describe('Sizing', () => {
        it('can be set and updates via the clrWizardSize input', () => {
          const wizardModal = context.testElement.querySelector('.modal-dialog');
          expect(context.testComponent.mySize).toBeUndefined();
          context.testComponent.mySize = 'lg';
          context.detectChanges();
          expect(wizard.size).toBe('lg');
          expect(wizardModal.classList.contains('modal-lg')).toBe(true);
        });
      });

      describe('Opening', () => {
        it('emits clrWizardOpenChange output', () => {
          wizard.close();
          context.detectChanges();
          context.testComponent._openChange = 0;
          expect(context.testComponent._openChange, 'make sure we have reset').toBe(0);
          wizard.open();
          context.detectChanges();
          expect(context.testComponent._openChange, 'make sure we have reset').toBe(1);
        });
      });

      describe('Closing', () => {
        it('emits clrWizardOpenChange output', () => {
          context.testComponent._openChange = 0;
          expect(context.testComponent._openChange, 'make sure we have reset').toBe(0);
          wizard.close();
          context.detectChanges();
          expect(context.testComponent._openChange, 'make sure we have reset').toBe(1);
        });
      });

      describe('Alt Cancel Override', () => {
        it('clrWizardPreventDefaultCancel input sets and updates stopCancel', () => {
          expect(wizard.stopCancel).toBe(context.testComponent.stopCancel);
          context.testComponent.stopCancel = true;
          context.detectChanges();
          expect(wizard.stopCancel).toBe(true);
        });
      });

      describe('Aria-label', () => {
        it('clrWizardStepnavAriaLabel input sets and updates aria-label for the stepnav', () => {
          const stepnav = context.testElement.querySelector('.clr-wizard-stepnav nav');
          expect(stepnav.getAttribute('aria-label')).toBe('Label for stepnav');
          context.testComponent.stepnavAriaLabel = 'Updated step navigation label';
          context.detectChanges();
          expect(stepnav.getAttribute('aria-label')).toBe('Updated step navigation label');
        });
      });
    });

    // CDE-2156
    describe('Initialization', () => {
      it('should be initilized empty and with navigation prevented.', () => {
        expect(() => {
          helpers.create(ClrWizard, DynamicEmptyWizardTestComponent);
        }).not.toThrow();
      });
    });

    describe('Dynamic Content', () => {
      let context: TestContext<ClrWizard, DynamicWizardTestComponent>;
      let wizard: ClrWizard;

      beforeEach(async () => {
        context = helpers.create(ClrWizard, DynamicWizardTestComponent);
        wizard = context.clarityDirective;
        context.detectChanges();

        await context.fixture.whenStable();
      });

      it('pages can be added via an ngFor', () => {
        let checkme: HTMLElement;

        expect(wizard.pageCollection.pagesCount).toBe(3);

        checkme = context.testElement.querySelector('#clr-wizard-page-1');
        expect(checkme.textContent.trim(), 'page 1 content ok').toBe('Content for page 1');

        checkme = context.testElement.querySelector('#clr-wizard-page-2');
        expect(checkme.textContent.trim(), 'page 2 content ok').toBe('Content for page 2');

        checkme = context.testElement.querySelector('#clr-wizard-page-4');
        expect(checkme.textContent.trim(), 'page 4 content ok').toBe('Content for page 4');

        // NOW THE STEPNAV
        checkme = context.testElement.querySelector('#clr-wizard-step-1 .clr-wizard-stepnav-link-title');
        expect(checkme.textContent.trim(), 'step 1 ok').toBe('Page 1');

        checkme = context.testElement.querySelector('#clr-wizard-step-2 .clr-wizard-stepnav-link-title');
        expect(checkme.textContent.trim(), 'step 2 ok').toBe('Page 2');

        checkme = context.testElement.querySelector('#clr-wizard-step-4 .clr-wizard-stepnav-link-title');
        expect(checkme.textContent.trim(), 'step 4 ok').toBe('Page 4');
      });

      it('content can be changed dynamically', () => {
        let checkme: HTMLElement;
        expect(wizard.pageCollection.pagesCount).toBe(3);

        // adding an element to my array
        context.testComponent.pages.splice(2, 0, 3);
        context.detectChanges();

        expect(wizard.pageCollection.pagesCount).toBe(4);
        checkme = context.testElement.querySelector('#clr-wizard-page-1');
        expect(checkme.textContent.trim(), 'page 1 content ok').toBe('Content for page 1');

        checkme = context.testElement.querySelector('#clr-wizard-page-2');
        expect(checkme.textContent.trim(), 'page 2 content ok').toBe('Content for page 2');

        checkme = context.testElement.querySelector('#clr-wizard-page-3');
        expect(checkme.textContent.trim(), 'page 3 content ok').toBe('Content for page 3');

        checkme = context.testElement.querySelector('#clr-wizard-page-4');
        expect(checkme.textContent.trim(), 'page 4 content ok').toBe('Content for page 4');

        // NOW THE STEPNAV
        checkme = context.testElement.querySelector('#clr-wizard-step-1 .clr-wizard-stepnav-link-title');
        expect(checkme.textContent.trim(), 'step 1 ok').toBe('Page 1');

        checkme = context.testElement.querySelector('#clr-wizard-step-2 .clr-wizard-stepnav-link-title');
        expect(checkme.textContent.trim(), 'step 2 ok').toBe('Page 2');

        checkme = context.testElement.querySelector('#clr-wizard-step-3 .clr-wizard-stepnav-link-title');
        expect(checkme.textContent.trim(), 'step 3 ok').toBe('Page 3');

        checkme = context.testElement.querySelector('#clr-wizard-step-4 .clr-wizard-stepnav-link-title');
        expect(checkme.textContent.trim(), 'step 4 ok').toBe('Page 4');

        // dynamically hiding a page
        context.testComponent.showSecondPage = false;
        context.detectChanges();

        expect(wizard.pageCollection.pagesCount).toBe(3);
        checkme = context.testElement.querySelector('#clr-wizard-page-1');
        expect(checkme.textContent.trim(), 'page 1 content ok').toBe('Content for page 1');

        checkme = context.testElement.querySelector('#clr-wizard-page-2');
        expect(checkme).toBeNull();

        checkme = context.testElement.querySelector('#clr-wizard-page-3');
        expect(checkme.textContent.trim(), 'page 3 content ok').toBe('Content for page 3');

        checkme = context.testElement.querySelector('#clr-wizard-page-4');
        expect(checkme.textContent.trim(), 'page 4 content ok').toBe('Content for page 4');

        // NOW THE STEPNAV
        checkme = context.testElement.querySelector('#clr-wizard-step-1 .clr-wizard-stepnav-link-title');
        expect(checkme.textContent.trim(), 'step 1 ok').toBe('Page 1');

        checkme = context.testElement.querySelector('#clr-wizard-step-2 .clr-wizard-stepnav-link-title');
        expect(checkme).toBeNull();

        checkme = context.testElement.querySelector('#clr-wizard-step-3 .clr-wizard-stepnav-link-title');
        expect(checkme.textContent.trim(), 'step 3 ok').toBe('Page 3');

        checkme = context.testElement.querySelector('#clr-wizard-step-4 .clr-wizard-stepnav-link-title');
        expect(checkme.textContent.trim(), 'step 4 ok').toBe('Page 4');
      });

      it('should survive if there are no pages', () => {
        expect(wizard.pageCollection.pagesCount).toBe(3);
        expect(function () {
          context.testComponent.pages = [];
          context.detectChanges();
        }).not.toThrowError();
        expect(wizard.pageCollection.pagesCount).toBe(0);
      });
    });

    describe('View and Behavior', () => {
      let context: TestContext<ClrWizard, TemplateApiWizardTestComponent>;
      let wizard: ClrWizard;

      beforeEach(async () => {
        context = helpers.create(ClrWizard, TemplateApiWizardTestComponent);
        wizard = context.clarityDirective;
        context.detectChanges();

        await context.fixture.whenStable();
      });

      describe('Page title focus', () => {
        it('should be placed on the page title after page change', () => {
          wizard.pageCollection.lastPage.makeCurrent();
          context.detectChanges();
          const titleString = context.testElement.querySelector('.clr-wizard-page-title').textContent.trim();
          expect(document.activeElement.textContent.trim()).toBe(titleString);
        });
      });
    });

    describe('Accessibility', () => {
      let context: TestContext<ClrWizard, TemplateApiWizardTestComponent>;
      let wizard: ClrWizard;

      beforeEach(async () => {
        context = helpers.create(ClrWizard, TemplateApiWizardTestComponent);
        wizard = context.clarityDirective;
        context.detectChanges();

        await context.fixture.whenStable();
      });

      describe('aria-labelledby', () => {
        it('should be placed on the page title after page change', () => {
          wizard.pageCollection.lastPage.makeCurrent();
          context.detectChanges();
          const modalWrapper = context.testElement.querySelector('.modal-dialog');
          const wizardId = wizard.wizardId;
          expect(modalWrapper.getAttribute('aria-labelledby')).toBe(wizardId);
        });
      });
    });
  });
});
