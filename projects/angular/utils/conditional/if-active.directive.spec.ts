/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrIfActive } from './if-active.directive';
import { IF_ACTIVE_ID_PROVIDER, IfActiveService } from './if-active.service';

describe('Conditional Utils', () => {
  describe('clrIfActive', () => {
    describe('IfActive Directive', () => {
      let testContext: any;
      beforeEach(() => {
        testContext = {};
      });

      describe('Typescript API', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [ClrIfActive],
            declarations: [IfActiveTest],
            providers: [IfActiveService, IF_ACTIVE_ID_PROVIDER],
          });
          testContext.fixture = TestBed.createComponent(IfActiveTest);
          renderFixture(testContext.fixture);
          testContext.testComponent = testContext.fixture.componentInstance;
          testContext.testElement = testContext.fixture.nativeElement;
          testContext.clarityDirective = testContext.fixture.componentInstance.directive;
          testContext.ifActiveService = TestBed.inject(IfActiveService);
        });

        afterEach(() => {
          testContext.fixture.destroy();
        });

        it('sets the active state of the directive', () => {
          testContext.testComponent.activeState = true;
          renderFixture(testContext.fixture);
          expect(testContext.clarityDirective.active).toEqual(true);
        });

        it('gets the current value of the active state', () => {
          testContext.ifActiveService.current = new Object();
          renderFixture(testContext.fixture);
          expect(testContext.testComponent.activeState).toEqual(false);
        });

        it('provides a function to update the view', () => {
          expect(testContext.clarityDirective.updateView).toBeDefined();

          // when activeState is false there should be no embedded views
          expect(testContext.clarityDirective.container.length).toEqual(0);

          // We can call the updateView function
          testContext.clarityDirective.updateView(true);
          expect(testContext.clarityDirective.container.length).toEqual(1);
        });

        it('emits an activeChange event only if the active state changes', () => {
          let nbChanges = 0;
          let currentChange: boolean;
          testContext.testComponent.directive.activeChange.subscribe((change: boolean) => {
            currentChange = change;
            nbChanges++;
          });
          expect(nbChanges).toBe(0);
          expect(currentChange).toBeUndefined();

          // setting the current to something other than the test directive's id
          testContext.ifActiveService.current = testContext.testComponent.directive.id + 1;
          renderFixture(testContext.fixture);
          expect(nbChanges).toBe(0);
          expect(currentChange).toBeUndefined();

          // setting the current to the test directive's id
          testContext.ifActiveService.current = testContext.testComponent.directive.id;
          renderFixture(testContext.fixture);
          expect(nbChanges).toBe(1);
          expect(currentChange).toBe(true);

          // setting the current to the test directive's id again
          testContext.ifActiveService.current = testContext.testComponent.directive.id;
          renderFixture(testContext.fixture);
          expect(nbChanges).toBe(1);
          expect(currentChange).toBe(true);

          // setting the current to something other than the test directive's id again
          testContext.ifActiveService.current = testContext.testComponent.directive.id + 1;
          renderFixture(testContext.fixture);
          expect(nbChanges).toBe(2);
          expect(currentChange).toBe(false);
        });
      });

      describe('View', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [ClrIfActive],
            declarations: [IfActiveTest],
            providers: [IfActiveService, IF_ACTIVE_ID_PROVIDER],
          });
          testContext.fixture = TestBed.createComponent(IfActiveTest);
          renderFixture(testContext.fixture);
          testContext.testComponent = testContext.fixture.componentInstance;
          testContext.testElement = testContext.fixture.nativeElement;
          testContext.clarityDirective = testContext.fixture.componentInstance.directive;
          testContext.ifActiveService = TestBed.inject(IfActiveService);
        });

        afterEach(() => {
          testContext.fixture.destroy();
        });

        // More for view tests.
        it('should not display anything when false', () => {
          expect(testContext.testElement.textContent.trim()).toBe('');
        });

        it('projects content when this directive is set to current', () => {
          testContext.ifActiveService.current = testContext.clarityDirective.id;
          renderFixture(testContext.fixture);
          expect(testContext.testElement.textContent.trim()).toBe('Hello Template!');
        });
      });
    });
  });
});

@Component({
  template: `<ng-template [(clrIfActive)]="activeState">Hello Template!</ng-template>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class IfActiveTest {
  @ViewChild(ClrIfActive) directive: ClrIfActive;
  activeState = false;
}
