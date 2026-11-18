/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrappedRow } from './wrapped-row';

@Component({
  template: `<dg-wrapped-row>Hello World!</dg-wrapped-row>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class WrappedRowTest {
  @ViewChild(WrappedRow, { static: true }) wrapper: WrappedRow;
}

interface TestContext {
  fixture: ComponentFixture<WrappedRowTest>;
  wrapper: WrappedRow;
}

describe('Datagrid', () => {
  describe('Components', () => {
    describe('WrappedRow', () => {
      let testContext: TestContext;
      beforeEach(() => {
        testContext = {} as TestContext;
      });

      beforeEach(() => {
        TestBed.configureTestingModule({ declarations: [WrappedRow, WrappedRowTest] });
        testContext.fixture = TestBed.createComponent(WrappedRowTest);
        testContext.wrapper = testContext.fixture.componentInstance.wrapper;
        testContext.fixture.detectChanges();
      });

      it('should have a rowView', () => {
        expect(testContext.wrapper.rowView).toBeDefined();
      });

      it('should have a templateRef to the portal', () => {
        expect(testContext.wrapper.templateRef).toBeDefined();
      });

      it('should project content into the template', () => {
        expect(testContext.wrapper.rowView.rootNodes[0].textContent.trim()).toBe('Hello World!');
      });
    });
  });
});
