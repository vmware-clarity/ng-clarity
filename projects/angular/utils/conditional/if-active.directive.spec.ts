/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrIfActive } from './if-active.directive';
import { IF_ACTIVE_ID_PROVIDER, IfActiveService } from './if-active.service';

interface Context {
  fixture: ComponentFixture<IfActiveTest>;
  testComponent: IfActiveTest;
  testElement: HTMLElement;
  clarityDirective: ClrIfActive;
  ifActiveService: IfActiveService;
}

export default function (): void {
  describe('IfActive Directive', function () {
    describe('Typescript API', function () {
      beforeEach(function (this: Context) {
        TestBed.configureTestingModule({
          imports: [ClrIfActive],
          declarations: [IfActiveTest],
          providers: [IfActiveService, IF_ACTIVE_ID_PROVIDER],
        });
        this.fixture = TestBed.createComponent(IfActiveTest);
        this.fixture.detectChanges();
        this.testComponent = this.fixture.componentInstance;
        this.testElement = this.fixture.nativeElement;
        this.clarityDirective = this.fixture.componentInstance.directive;
        this.ifActiveService = TestBed.inject(IfActiveService);
      });

      afterEach(function (this: Context) {
        this.fixture.destroy();
      });

      it('sets the active state of the directive', function (this: Context) {
        this.testComponent.activeState = true;
        this.fixture.detectChanges();
        expect(this.clarityDirective.active).toEqual(true);
      });

      it('gets the current value of the active state', function (this: Context) {
        this.ifActiveService.current = new Object() as number;
        this.fixture.detectChanges();
        expect(this.testComponent.activeState).toEqual(false);
      });

      it('provides a function to update the view', function (this: Context) {
        expect(this.clarityDirective.updateView).toBeDefined();

        // when activeState is false there should be no embedded views
        expect(this.clarityDirective['container'].length).toEqual(0);

        // We can call the updateView function
        this.clarityDirective.updateView(true);
        expect(this.clarityDirective['container'].length).toEqual(1);
      });

      it('emits an activeChange event only if the active state changes', function (this: Context) {
        let nbChanges = 0;
        let currentChange: boolean;
        this.testComponent.directive.activeChange.subscribe((change: boolean) => {
          currentChange = change;
          nbChanges++;
        });
        expect(nbChanges).toBe(0);
        expect(currentChange).toBeUndefined();

        // setting the current to something other than the test directive's id
        this.ifActiveService.current = this.testComponent.directive['id'] + 1;
        this.fixture.detectChanges();
        expect(nbChanges).toBe(0);
        expect(currentChange).toBeUndefined();

        // setting the current to the test directive's id
        this.ifActiveService.current = this.testComponent.directive['id'];
        this.fixture.detectChanges();
        expect(nbChanges).toBe(1);
        expect(currentChange).toBe(true);

        // setting the current to the test directive's id again
        this.ifActiveService.current = this.testComponent.directive['id'];
        this.fixture.detectChanges();
        expect(nbChanges).toBe(1);
        expect(currentChange).toBe(true);

        // setting the current to something other than the test directive's id again
        this.ifActiveService.current = this.testComponent.directive['id'] + 1;
        this.fixture.detectChanges();
        expect(nbChanges).toBe(2);
        expect(currentChange).toBe(false);
      });
    });

    describe('View', function () {
      beforeEach(function (this: Context) {
        TestBed.configureTestingModule({
          imports: [ClrIfActive],
          declarations: [IfActiveTest],
          providers: [IfActiveService, IF_ACTIVE_ID_PROVIDER],
        });
        this.fixture = TestBed.createComponent(IfActiveTest);
        this.fixture.detectChanges();
        this.testComponent = this.fixture.componentInstance;
        this.testElement = this.fixture.nativeElement;
        this.clarityDirective = this.fixture.componentInstance.directive;
        this.ifActiveService = TestBed.inject(IfActiveService);
      });

      afterEach(function (this: Context) {
        this.fixture.destroy();
      });

      // More for view tests.
      it('should not display anything when false', function (this: Context) {
        expect(this.testElement.textContent.trim()).toBe('');
      });

      it('projects content when this directive is set to current', function (this: Context) {
        this.ifActiveService.current = this.clarityDirective['id'];
        this.fixture.detectChanges();
        expect(this.testElement.textContent.trim()).toBe('Hello Template!');
      });
    });
  });
}

@Component({
  template: `<ng-template [(clrIfActive)]="activeState">Hello Template!</ng-template>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class IfActiveTest {
  @ViewChild(ClrIfActive) directive: ClrIfActive;
  activeState = false;
}
