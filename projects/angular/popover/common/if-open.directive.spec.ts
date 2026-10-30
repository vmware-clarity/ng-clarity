/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrIfOpen } from './if-open.directive';
import { ClrPopoverService } from './providers/popover.service';

describe('ClrPopover', () => {
  describe('clrIfOpen', () => {
    describe('IfOpen Directive', () => {
      let testContext: any;
      beforeEach(() => {
        testContext = {};
      });

      describe('Typescript API', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [ClrIfOpen],
            declarations: [IfOpenTest],
            providers: [ClrPopoverService],
          });
          testContext.fixture = TestBed.createComponent(IfOpenTest);
          renderFixture(testContext.fixture);
          testContext.testComponent = testContext.fixture.componentInstance;
          testContext.testElement = testContext.fixture.nativeElement;
          testContext.clarityDirective = testContext.fixture.componentInstance.directive;
          testContext.popoverService = TestBed.inject(ClrPopoverService);
        });

        afterEach(() => {
          testContext.fixture.destroy();
        });

        it('sets the open state of the directive', () => {
          testContext.testComponent.openState = true;
          renderFixture(testContext.fixture);
          expect(testContext.clarityDirective.open).toEqual(true);
        });

        it('gets the current value of the open state', () => {
          testContext.popoverService.open = true;
          expect(testContext.testComponent.openState).toEqual(true);
          testContext.popoverService.popoverVisibleEmit(false);
          expect(testContext.testComponent.openState).toEqual(false);
        });

        it('provides a function to update the view', () => {
          expect(testContext.clarityDirective.updateView).toBeDefined();

          // when openState is false there should be no embedded views
          expect(testContext.clarityDirective.container.length).toEqual(0);

          // We can call the updateView function
          testContext.clarityDirective.updateView(true);
          expect(testContext.clarityDirective.container.length).toEqual(1);
        });

        it('emits an openChange event', () => {
          let nbChanges = 0;
          let currentChange: boolean;
          testContext.testComponent.directive.openChange.subscribe((change: boolean) => {
            currentChange = change;
            nbChanges++;
          });
          expect(nbChanges).toBe(0);
          expect(currentChange).toBeUndefined();
          testContext.popoverService.open = true;
          renderFixture(testContext.fixture);
          expect(nbChanges).toBe(1);
          expect(currentChange).toBe(true);
        });
      });

      describe('View', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [ClrIfOpen],
            declarations: [IfOpenTest],
            providers: [ClrPopoverService],
          });
          testContext.fixture = TestBed.createComponent(IfOpenTest);
          renderFixture(testContext.fixture);
          testContext.testComponent = testContext.fixture.componentInstance;
          testContext.testElement = testContext.fixture.nativeElement;
          testContext.clarityDirective = testContext.fixture.componentInstance.directive;
          testContext.popoverService = TestBed.inject(ClrPopoverService);
        });

        afterEach(() => {
          testContext.fixture.destroy();
        });

        // More for view tests.
        it('should not display anything when false', () => {
          expect(testContext.testElement.textContent.trim()).toBe('');
        });

        it('projects content when true', () => {
          testContext.popoverService.open = true;
          renderFixture(testContext.fixture);
          expect(testContext.testElement.textContent.trim()).toBe('Hello Template!');
        });
      });
    });
  });
});

@Component({
  template: `<ng-template [(clrIfOpen)]="openState">Hello Template!</ng-template>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class IfOpenTest {
  @ViewChild(ClrIfOpen) directive: ClrIfOpen;
  openState = false;
}
