/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FilterPopoverRepositionDirective } from './filter-popover-reposition-directive';

class MockElementRef {
  nativeElement = {
    offsetWidth: 100,
    closest: function () {
      return new MockElementRef();
    },
    style: { transform: 'mock' },
  };
}

describe('Directive: FilterPopoverReposition', () => {
  let directive: FilterPopoverRepositionDirective;
  const mockElementRef = new MockElementRef();
  const style: CSSStyleDeclaration = document.createElement('span').style;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterPopoverRepositionDirective],
      providers: [{ provide: ElementRef, useValue: mockElementRef }, FilterPopoverRepositionDirective],
    });
    directive = TestBed.inject(FilterPopoverRepositionDirective);
  });

  it('is called during ngAfterViewInit', () => {
    spyOn(window, 'getComputedStyle').and.returnValue(style);
    directive.ngAfterViewInit();
    expect(window.getComputedStyle).toHaveBeenCalled();
  });
});
