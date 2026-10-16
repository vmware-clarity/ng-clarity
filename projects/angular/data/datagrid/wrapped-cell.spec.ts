/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrappedCell } from './wrapped-cell';

@Component({
  template: `<dg-wrapped-cell>Hello World!</dg-wrapped-cell>`,
  standalone: false,
})
class WrappedCellTest {
  @ViewChild(WrappedCell, { static: true }) wrapper: WrappedCell;
}

interface TestContext {
  fixture: ComponentFixture<WrappedCellTest>;
  wrapper: WrappedCell;
}

export default function (): void {
  describe('WrappedCell', () => {
    let testContext: TestContext;
    beforeEach(() => {
      testContext = {} as TestContext;
    });

    beforeEach(() => {
      TestBed.configureTestingModule({ declarations: [WrappedCell, WrappedCellTest] });
      testContext.fixture = TestBed.createComponent(WrappedCellTest);
      testContext.wrapper = testContext.fixture.componentInstance.wrapper;
      testContext.fixture.detectChanges();
    });

    it('should have a cellView', () => {
      expect(testContext.wrapper.cellView).toBeDefined();
    });

    it('should have a templateRef to the portal', () => {
      expect(testContext.wrapper.templateRef).toBeDefined();
    });

    it('projects content into the template', () => {
      expect(testContext.wrapper.cellView.rootNodes[0].textContent.trim()).toBe('Hello World!');
    });
  });
}
