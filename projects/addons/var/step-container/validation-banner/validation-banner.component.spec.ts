/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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
  describe('wizard-banner-internal', () => {
    beforeEach(function (this: ThisTest) {
      TestBed.configureTestingModule({
        imports: [ClrAlertModule, NoopAnimationsModule],
        declarations: [ValidationBannerInternalComponent],
      });

      this.fixtureInternal = TestBed.createComponent(ValidationBannerInternalComponent);
      this.componentInternal = this.fixtureInternal.componentInstance;
      this.dummyItems = ['Dummy Item 1', 'Dummy Item 2'];
      this.myCustomType = 'danger';
    });

    afterEach(function (this: ThisTest) {
      this.fixtureInternal.destroy();
    });

    describe('WHEN rendered', () => {
      beforeEach(function (this: ThisTest) {
        this.componentInternal.items = this.dummyItems;
        this.componentInternal.type = this.myCustomType;
        this.componentInternal.closable = false;
      });

      it('THEN all items are visible', function (this: ThisTest) {
        this.fixtureInternal.detectChanges();

        const items = queryAlertItems(this.fixtureInternal.debugElement);
        expect(items.length).toEqual(this.dummyItems.length);
        items.forEach((item: DebugElement, index: number) => {
          expect(findAlertItemText(item)).toEqual(this.dummyItems[index]);
        });
      });

      it('THEN correct type is applied', function (this: ThisTest) {
        this.fixtureInternal.detectChanges();

        const items = queryAlertItems(this.fixtureInternal.debugElement, this.myCustomType);
        expect(items.length).toEqual(this.dummyItems.length);
      });
    });
  });

  describe('wizard-banner', () => {
    beforeEach(function (this: ThisTest) {
      TestBed.configureTestingModule({
        imports: [ClrAlertModule, NoopAnimationsModule],
        declarations: [ValidationBannerInternalComponent, ValidationBannerComponent],
      });

      this.fixture = TestBed.createComponent(ValidationBannerComponent);
      this.component = this.fixture.componentInstance;
      this.state = new StepValidationState(
        ['Error Item 1', 'Error Item 2'],
        ['Warning Item 1', 'Warning Item 2'],
        ['Info Item 1', 'Info Item 2']
      );
    });

    afterEach(function (this: ThisTest) {
      this.fixture.destroy();
    });

    describe('WHEN rendered', () => {
      beforeEach(function (this: ThisTest) {
        this.component.state = this.state;
      });

      it('THEN all items are displayed correctly', function (this: any) {
        this.fixture.detectChanges();

        (['info', 'danger', 'warning'] as AlertType[]).forEach(alertType => {
          const items = queryAlertItems(this.fixture.debugElement, alertType);
          expect(items.length).toEqual(2); // 2 per dummy Item type
        });
      });
    });
  });
});
