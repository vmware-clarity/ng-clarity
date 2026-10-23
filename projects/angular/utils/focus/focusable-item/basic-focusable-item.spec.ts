/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BASIC_FOCUSABLE_ITEM_PROVIDER } from './basic-focusable-item.service';
import { FocusableItem } from './focusable-item';

@Component({
  template: '',
  providers: [BASIC_FOCUSABLE_ITEM_PROVIDER],
  standalone: false,
})
class SimpleHost {}

interface TestContext {
  el: HTMLElement;
  item: FocusableItem;
  id: string;
}

describe('Focus management', () => {
  describe('Basic focusable item', () => {
    let testContext: TestContext;
    beforeEach(() => {
      testContext = {} as TestContext;
    });

    beforeEach(() => {
      // Because the "service" uses ElementRef and Renderer (it's not really a service),
      // we need to use Angular's testing tools to run this spec.
      TestBed.configureTestingModule({ declarations: [SimpleHost] });
      const fixture = TestBed.createComponent(SimpleHost);
      testContext.el = fixture.debugElement.nativeElement;
      testContext.item = fixture.debugElement.injector.get(FocusableItem, null);
      testContext.id = testContext.item.id;
    });

    it('declares a default id', () => {
      expect(testContext.id).toBeTruthy();
    });

    it('declares itself as a FocusableItem provider', () => {
      expect(testContext.item).toBeTruthy();
    });

    it('sets the id attribute of the host', () => {
      expect(testContext.el.getAttribute('id')).toBe(testContext.id);
    });

    it('removes the host from tab order', () => {
      expect(testContext.el.getAttribute('tabindex')).toBe('-1');
    });

    it('removes the .clr-focus class from the host when not focused', () => {
      testContext.item.focus();
      testContext.item.blur();
      expect(testContext.el.classList).not.toContain('clr-focus');
    });

    it('triggers a click on the host when activated', () => {
      let clicks = 0;
      testContext.el.addEventListener('click', () => clicks++);
      expect(clicks).toBe(0);
      testContext.item.activate();
      expect(clicks).toBe(1);
      testContext.item.activate();
      expect(clicks).toBe(2);
    });
  });
});
