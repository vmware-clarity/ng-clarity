/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/no-empty-function */
import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DismissableDirective } from './dismissable.directive';

class MockElementRef {}

class MockRenderer2 {
  createElement() {
    return { setAttribute: function () {}, style: { margin: 'mock' } };
  }
  appendChild() {}
  listen(atr1: any, atr2: any, callback: (event: KeyboardEvent) => boolean | void) {
    const event: KeyboardEvent = new KeyboardEvent('keyDown', { key: 'Enter' });
    callback(event);
  }
  setStyle() {}
}

describe('Directive: DismissableDirective', () => {
  let directive: DismissableDirective;
  const renderer2: MockRenderer2 = new MockRenderer2();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DismissableDirective],
      providers: [
        { provide: ElementRef, useClass: MockElementRef },
        { provide: Renderer2, useValue: renderer2 },
        DismissableDirective,
      ],
    });
    directive = TestBed.inject(DismissableDirective);
  });

  it('is called during ngAfterViewInit', () => {
    spyOn(renderer2, 'createElement').and.callThrough();
    spyOn(renderer2, 'appendChild').and.callThrough();
    spyOn(renderer2, 'listen').and.callThrough();
    spyOn(renderer2, 'setStyle').and.callThrough();
    directive.ngAfterViewInit();
    expect(renderer2.createElement).toHaveBeenCalled();
    expect(renderer2.appendChild).toHaveBeenCalled();
    expect(renderer2.listen).toHaveBeenCalled();
    expect(renderer2.setStyle).toHaveBeenCalled();
  });
});
