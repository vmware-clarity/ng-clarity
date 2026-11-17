/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, QueryList, Type, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ClrAlert } from './alert';
import { ClrAlertsPager } from './alerts-pager';
import { ClrEmphasisModule } from '../emphasis.module';
import { MultiAlertService } from './providers/multi-alert.service';

describe('Alert Tests', () => {
  describe('ClrAlerts pager component', () => {
    let testContext: any;
    beforeEach(() => {
      testContext = {};
    });

    describe('Typescript API', () => {
      let component: ClrAlertsPager;
      let service: MultiAlertService;

      beforeEach(() => {
        service = new MultiAlertService();
        component = new ClrAlertsPager(service, new ClrCommonStringsService());
      });

      afterEach(() => {
        service = null;
        component = null;
      });

      it('page up calls the multi alert service', () => {
        vi.spyOn(service, 'next').mockImplementation(() => {
          // Do nothing
        });
        component.pageUp();
        expect(service.next).toHaveBeenCalled();
      });

      it('page down calls the multi alert service', () => {
        vi.spyOn(service, 'previous').mockImplementation(() => {
          // Do nothingno
        });
        component.pageDown();
        expect(service.previous).toHaveBeenCalled();
      });
    });

    describe('Template API', () => {
      beforeEach(() => {
        const service = new MultiAlertService();
        const queryList = new QueryList<ClrAlert>();

        testContext.create = <T>(componentType: Type<T>) => {
          TestBed.configureTestingModule({
            imports: [ClrEmphasisModule],
            declarations: [componentType],
            providers: [{ provide: MultiAlertService, useValue: service }],
          });
          testContext.fixture = TestBed.createComponent(componentType);

          testContext.alertFixture = TestBed.createComponent(ClrAlert);
          testContext.alert = testContext.alertFixture.componentInstance;
          testContext.secondAlertFixture = TestBed.createComponent(ClrAlert);
          testContext.secondAlert = testContext.secondAlertFixture.componentInstance;

          queryList.reset([testContext.alert, testContext.secondAlert]);
          service.manage(queryList);

          testContext.fixture.detectChanges();
        };
      });

      afterEach(() => {
        testContext.fixture.destroy();
        testContext.alertFixture.destroy();
        testContext.secondAlertFixture.destroy();
      });

      it('offers two way binding on the alert index', () => {
        testContext.create(TestIndex);
        testContext.fixture.componentInstance.index = 1;
        testContext.fixture.detectChanges();
        expect(testContext.fixture.componentInstance.pagerInstance.currentAlertIndex).toEqual(1);

        testContext.fixture.componentInstance.pagerInstance.currentAlertIndex = 0;
        testContext.fixture.detectChanges();
        expect(testContext.fixture.componentInstance.index).toEqual(0);
      });

      it('offers two way binding on the alert instance', () => {
        testContext.create(TestInstance);
        testContext.fixture.componentInstance.currentAlert = testContext.secondAlert;
        testContext.fixture.detectChanges();
        expect(testContext.fixture.componentInstance.pagerInstance.currentAlert).toEqual(testContext.secondAlert);

        testContext.fixture.componentInstance.pagerInstance.currentAlert = testContext.alert;
        testContext.fixture.detectChanges();
        expect(testContext.fixture.componentInstance.currentAlert).toEqual(testContext.alert);
      });
    });

    describe('View Basics', () => {
      let fixture: ComponentFixture<TestBasics>;
      let pagerInstance: ClrAlertsPager;

      beforeEach(() => {
        const service = new MultiAlertService();
        const queryList = new QueryList<ClrAlert>();
        TestBed.configureTestingModule({
          imports: [ClrEmphasisModule],
          declarations: [TestBasics],
          providers: [{ provide: MultiAlertService, useValue: service }],
        });
        fixture = TestBed.createComponent(TestBasics);
        queryList.reset(Array(4).fill(TestBed.createComponent(ClrAlert).componentInstance));
        service.manage(queryList);
        fixture.detectChanges();
        pagerInstance = fixture.componentInstance.pagerInstance;
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('next alert aria-label is correct after page change', () => {
        const button = fixture.nativeElement.querySelector('.alerts-page-up button');
        expect(button.getAttribute('aria-label')).toBe('Next alert message, 2 of 4');
        pagerInstance.pageUp();
        fixture.detectChanges();
        expect(button.getAttribute('aria-label')).toBe('Next alert message, 3 of 4');
      });

      it('previous alert aria-label is correct after page change', () => {
        const button = fixture.nativeElement.querySelector('.alerts-page-down button');
        expect(button.getAttribute('aria-label')).toBe('Previous alert message, 4 of 4');
        pagerInstance.pageUp();
        fixture.detectChanges();
        expect(button.getAttribute('aria-label')).toBe('Previous alert message, 1 of 4');
      });
    });
  });
});

@Component({
  template: `<clr-alerts-pager [(clrCurrentAlertIndex)]="index"></clr-alerts-pager>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TestIndex {
  @ViewChild(ClrAlertsPager) pagerInstance: ClrAlertsPager;
  index = 0;
}

@Component({
  template: `<clr-alerts-pager [(clrCurrentAlert)]="currentAlert"></clr-alerts-pager>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TestInstance {
  @ViewChild(ClrAlertsPager) pagerInstance: ClrAlertsPager;
  currentAlert: ClrAlert;
}

@Component({
  template: `<clr-alerts-pager></clr-alerts-pager>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TestBasics {
  @ViewChild(ClrAlertsPager) pagerInstance: ClrAlertsPager;
}
