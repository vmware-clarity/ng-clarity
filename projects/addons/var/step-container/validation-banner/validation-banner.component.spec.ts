/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrAlertModule } from '@clr/angular/emphasis/alert';

import { ValidationBannerComponent, ValidationBannerInternalComponent } from './validation-banner.component';
import { StepValidationState } from '../../model/step-validation-state';

type AlertType = 'info' | 'danger' | 'warning';

function queryAlertItems(rootDebugElement: DebugElement, alertType?: AlertType): DebugElement[] {
  const alertTypeFilterSelector = alertType ? `.alert-${alertType}` : '';
  const alert = rootDebugElement.query(By.css(`clr-alert > .alert${alertTypeFilterSelector}`));
  return alert ? alert.queryAll(By.css('.alert-items > clr-alert-item')) : [];
}

function findAlertItemText(alertItemDebugElement: DebugElement): string | undefined {
  const text = alertItemDebugElement.query(By.css('.alert-text'));
  return text ? text.nativeElement.textContent : undefined;
}

interface ThisTest {
  fixtureInternal: ComponentFixture<ValidationBannerInternalComponent>;
  componentInternal: ValidationBannerInternalComponent;
  dummyItems: string[];
  myCustomType: AlertType;

  fixture: ComponentFixture<ValidationBannerComponent>;
  component: ValidationBannerComponent;
  state: StepValidationState;
}

describe('wizard-banner.spec', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  describe('wizard-banner-internal', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrAlertModule],
        declarations: [ValidationBannerInternalComponent],
      });

      testContext.fixtureInternal = TestBed.createComponent(ValidationBannerInternalComponent);
      testContext.componentInternal = testContext.fixtureInternal.componentInstance;
      testContext.dummyItems = ['Dummy Item 1', 'Dummy Item 2'];
      testContext.myCustomType = 'danger';
    });

    afterEach(() => {
      testContext.fixtureInternal.destroy();
    });

    describe('WHEN rendered', () => {
      beforeEach(() => {
        testContext.componentInternal.items = testContext.dummyItems;
        testContext.componentInternal.type = testContext.myCustomType;
        testContext.componentInternal.closable = false;
      });

      it('THEN all items are visible', () => {
        testContext.fixtureInternal.detectChanges();

        const items = queryAlertItems(testContext.fixtureInternal.debugElement);
        expect(items.length).toEqual(testContext.dummyItems.length);
        items.forEach((item: DebugElement, index: number) => {
          expect(findAlertItemText(item)).toEqual(testContext.dummyItems[index]);
        });
      });

      it('THEN correct type is applied', () => {
        testContext.fixtureInternal.detectChanges();

        const items = queryAlertItems(testContext.fixtureInternal.debugElement, testContext.myCustomType);
        expect(items.length).toEqual(testContext.dummyItems.length);
      });
    });
  });

  describe('wizard-banner', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrAlertModule],
        declarations: [ValidationBannerInternalComponent, ValidationBannerComponent],
      });

      testContext.fixture = TestBed.createComponent(ValidationBannerComponent);
      testContext.component = testContext.fixture.componentInstance;
      testContext.state = new StepValidationState(
        ['Error Item 1', 'Error Item 2'],
        ['Warning Item 1', 'Warning Item 2'],
        ['Info Item 1', 'Info Item 2']
      );
    });

    afterEach(() => {
      testContext.fixture.destroy();
    });

    describe('WHEN rendered', () => {
      beforeEach(() => {
        testContext.component.state = testContext.state;
      });

      it('THEN all items are displayed correctly', () => {
        const untypedContext: any = testContext;

        untypedContext.fixture.detectChanges();

        (['info', 'danger', 'warning'] as AlertType[]).forEach(alertType => {
          const items = queryAlertItems(untypedContext.fixture.debugElement, alertType);
          expect(items.length).toEqual(2); // 2 per dummy Item type
        });
      });
    });
  });
});
