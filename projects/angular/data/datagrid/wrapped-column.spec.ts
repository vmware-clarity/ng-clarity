/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrappedColumn } from './wrapped-column';

@Component({
  template: `<dg-wrapped-column>Hello World!</dg-wrapped-column>`,
  standalone: false,
})
class WrappedColumnTest {
  @ViewChild(WrappedColumn, { static: true }) wrapper: WrappedColumn;
}

interface TestContext {
  fixture: ComponentFixture<WrappedColumnTest>;
  wrapper: WrappedColumn;
}

describe('Datagrid', () => {
  describe('Components', () => {
    describe('WrappedColumn', () => {
      let testContext: TestContext;
      beforeEach(() => {
        testContext = {} as TestContext;
      });

      beforeEach(() => {
        TestBed.configureTestingModule({ declarations: [WrappedColumn, WrappedColumnTest] });
        testContext.fixture = TestBed.createComponent(WrappedColumnTest);
        testContext.wrapper = testContext.fixture.componentInstance.wrapper;
        testContext.fixture.detectChanges();
      });

      it('should have a columnView', () => {
        expect(testContext.wrapper.columnView).toBeDefined();
      });

      it('should have a templateRef to the portal', () => {
        expect(testContext.wrapper.templateRef).toBeDefined();
      });

      it('projects content into the template', () => {
        expect(testContext.wrapper.columnView.rootNodes[0].textContent.trim()).toBe('Hello World!');
      });
    });
  });
});
