/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { delay, expectActiveElementNotToBe, expectActiveElementToBe } from '@clr/angular/testing';
import {
  ArrowKeyDirection,
  FOCUS_SERVICE_PROVIDER,
  FocusableItem,
  FocusService,
  Linkers,
  MockFocusableItem,
} from '@clr/angular/utils';
import { isObservable, Observable } from 'rxjs';

import { DROPDOWN_FOCUS_HANDLER_PROVIDER, DropdownFocusHandler } from './dropdown-focus-handler.service';
@Component({
  selector: 'simple-host',
  template: '',
  providers: [ClrPopoverService, FOCUS_SERVICE_PROVIDER, DROPDOWN_FOCUS_HANDLER_PROVIDER],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class SimpleHost {}

@Component({
  template: '<simple-host></simple-host>',
  providers: [ClrPopoverService, FOCUS_SERVICE_PROVIDER, DROPDOWN_FOCUS_HANDLER_PROVIDER],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class NestedHost {}

interface TestContext {
  fixture: ComponentFixture<SimpleHost | NestedHost>;
  popoverService: ClrPopoverService;
  focusService: FocusService;
  focusHandler: DropdownFocusHandler;
  trigger: HTMLElement;
  container: HTMLElement;
  outside: HTMLElement;
  children: FocusableItem[];
}

describe('Dropdown', () => {
  describe('Providers', () => {
    describe('DropdownFocusHandler', () => {
      let testContext: TestContext;
      beforeEach(() => {
        testContext = {} as TestContext;
      });

      describe('basic dropdown', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({ declarations: [SimpleHost] });
          testContext.fixture = TestBed.createComponent(SimpleHost);
          testContext.popoverService = testContext.fixture.debugElement.injector.get(ClrPopoverService);
          testContext.focusService = testContext.fixture.debugElement.injector.get(FocusService);
          testContext.focusHandler = testContext.fixture.debugElement.injector.get(DropdownFocusHandler, null);
          testContext.trigger = document.createElement('button');
          testContext.container = document.createElement('div');
          testContext.outside = document.createElement('button');
          // We need the elements in the DOM to be able to focus them
          document.body.append(testContext.trigger, testContext.container, testContext.outside);
          testContext.children = new Array(3).fill(0).map((_, i) => new MockFocusableItem(`${i}`));
        });

        afterEach(() => {
          document.body.removeChild(testContext.trigger);
          document.body.removeChild(testContext.container);
          document.body.removeChild(testContext.outside);
        });

        it('declares a DropdownFocusHandler provider', () => {
          expect(testContext.focusHandler).not.toBeNull();
        });

        it('aliases the DropdownFocusHandler as a FocusableItem', () => {
          expect(testContext.fixture.debugElement.injector.get(FocusableItem, null)).toBe(testContext.focusHandler);
        });

        it('toggles open when arrow up or down on the trigger', async () => {
          expect(testContext.popoverService.open).toBeFalsy();
          testContext.focusHandler.trigger = testContext.trigger;

          testContext.focusHandler.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'arrowup' }));
          await delay();
          expect(testContext.popoverService.open).toBeTruthy();

          //once open, the up/down arrow keys control the focus on menu items, so we close again for the next test
          testContext.popoverService.open = false;
          await delay();
          expect(testContext.popoverService.open).toBeFalsy();

          testContext.focusHandler.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'arrowdown' }));
          await delay();
          expect(testContext.popoverService.open).toBeTruthy();
        });

        it('proxies focus() and blur() to the trigger', () => {
          testContext.focusHandler.trigger = testContext.trigger;
          expectActiveElementNotToBe(testContext.trigger);
          testContext.focusHandler.focus();
          expectActiveElementToBe(testContext.trigger);
          testContext.focusHandler.blur();
          expectActiveElementNotToBe(testContext.trigger);
        });

        it('clicks on the trigger when activated', () => {
          let clicks = 0;
          testContext.trigger.addEventListener('click', () => clicks++);
          testContext.focusHandler.trigger = testContext.trigger;
          expect(clicks).toBe(0);
          testContext.focusHandler.activate();
          expect(clicks).toBe(1);
          testContext.focusHandler.activate();
          expect(clicks).toBe(2);
        });

        it('registers the container to the FocusService', () => {
          const spy = vi.spyOn(testContext.focusService, 'registerContainer').mockImplementation(() => undefined);
          testContext.focusHandler.container = testContext.container;
          expect(spy).toHaveBeenCalledWith(testContext.container);
        });

        it('does not prevent moving focus to a different part of the page', async () => {
          testContext.focusHandler.trigger = testContext.trigger;
          testContext.focusHandler.container = testContext.container;
          testContext.popoverService.open = true;
          await delay();
          testContext.outside.focus();
          expectActiveElementToBe(testContext.outside);
        });

        it('links received children vertically', () => {
          const spy = vi.spyOn(Linkers, 'linkVertical').mockImplementation(() => undefined);
          testContext.focusHandler.addChildren(testContext.children);
          expect(spy).toHaveBeenCalledWith(testContext.children);
        });

        it('points down to the first child', () => {
          let down: FocusableItem;
          testContext.focusHandler.down.subscribe(child => (down = child));
          testContext.focusHandler.addChildren(testContext.children);
          expect(down).toBe(testContext.children[0]);
        });

        it('points up to the last child', () => {
          let up: FocusableItem;
          testContext.focusHandler.up.subscribe(child => (up = child));
          testContext.focusHandler.addChildren(testContext.children);
          expect(up).toBe(testContext.children[testContext.children.length - 1]);
        });

        it('does not point left or right', () => {
          testContext.focusHandler.addChildren(testContext.children);
          expect((testContext.focusHandler as FocusableItem).left).toBeUndefined();
          expect((testContext.focusHandler as FocusableItem).right).toBeUndefined();
        });

        it('points correctly even if children have been added early', () => {
          let down: FocusableItem;
          testContext.focusHandler.addChildren(testContext.children);
          testContext.focusHandler.down.subscribe(child => (down = child));
          expect(down).toBe(testContext.children[0]);
        });

        it('properly resets children', () => {
          testContext.focusHandler.addChildren(testContext.children);
          testContext.focusHandler.resetChildren();
          const down = vi.fn();
          const up = vi.fn();
          const downSubscription = testContext.focusHandler.down.subscribe(down);
          const upSubscription = testContext.focusHandler.up.subscribe(up);
          try {
            expect(down).not.toHaveBeenCalled();
            expect(up).not.toHaveBeenCalled();
          } finally {
            downSubscription.unsubscribe();
            upSubscription.unsubscribe();
          }
        });

        it('opens the dropdown when trying to go down or up', () => {
          expect(testContext.popoverService.open).toBeFalsy();
          testContext.focusHandler.down.subscribe(() => null);
          expect(testContext.popoverService.open).toBeTruthy();
          testContext.popoverService.open = false;
          testContext.focusHandler.up.subscribe(() => null);
          expect(testContext.popoverService.open).toBeTruthy();
        });

        it('cancels pending initial focus when closed before the next task', async () => {
          const moveTo = vi.spyOn(testContext.focusService, 'moveTo').mockImplementation(() => undefined);
          testContext.popoverService.toggleWithEvent({});
          testContext.popoverService.open = false;
          await delay();
          expect(moveTo).not.toHaveBeenCalled();
        });

        it('cancels pending initial focus on destruction', async () => {
          const moveTo = vi.spyOn(testContext.focusService, 'moveTo').mockImplementation(() => undefined);
          testContext.popoverService.toggleWithEvent({});
          testContext.fixture.destroy();
          await delay();
          expect(moveTo).not.toHaveBeenCalled();
        });

        it('cancels pending focus recovery on destruction', async () => {
          testContext.focusHandler.container = testContext.container;
          testContext.focusHandler.addChildren(testContext.children);
          testContext.popoverService.open = true;
          const moveTo = vi.spyOn(testContext.focusService, 'moveTo').mockImplementation(() => undefined);
          testContext.container.dispatchEvent(new FocusEvent('focusout'));
          testContext.fixture.destroy();
          await delay();
          expect(moveTo).not.toHaveBeenCalled();
        });

        it('moves to the first child when opened with a click', async () => {
          testContext.focusHandler.addChildren(testContext.children);
          const moveTo = vi.spyOn(testContext.focusService, 'moveTo').mockImplementation(() => undefined);
          const move = vi.spyOn(testContext.focusService, 'move').mockImplementation(() => undefined);
          testContext.popoverService.toggleWithEvent({});
          await delay();

          // First we move to the clicked item, which is the trigger,
          expect(moveTo).toHaveBeenCalledWith(testContext.focusHandler);
          // then we move down to the first item,
          expect(move).toHaveBeenCalledWith(ArrowKeyDirection.DOWN);
          // but maybe that's too detailed for this unit test? It's just the easiest way to test it right now.
        });
      });

      describe('nested dropdown', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({ declarations: [SimpleHost, NestedHost] });
          testContext.fixture = TestBed.createComponent(NestedHost);
          const nestedInjector = testContext.fixture.debugElement.query(By.directive(SimpleHost)).injector;
          testContext.popoverService = nestedInjector.get(ClrPopoverService);
          testContext.focusService = nestedInjector.get(FocusService);
          testContext.focusHandler = nestedInjector.get(DropdownFocusHandler, null);
          testContext.trigger = document.createElement('button');
          testContext.container = document.createElement('div');
          // We need the elements in the DOM to be able to focus them
          document.body.append(testContext.trigger, testContext.container);
          testContext.children = new Array(3).fill(0).map((_, i) => new MockFocusableItem(`${i}`));
        });

        afterEach(() => {
          document.body.removeChild(testContext.trigger);
          document.body.removeChild(testContext.container);
        });

        it('calls native elements focus() and blur when focused and blurred', () => {
          testContext.focusHandler.trigger = testContext.trigger;
          testContext.focusHandler.focus();
          expectActiveElementToBe(testContext.trigger);
          testContext.focusHandler.blur();
          expectActiveElementNotToBe(testContext.trigger);
        });

        it('does not register the container to the FocusService', () => {
          const spy = vi.spyOn(testContext.focusService, 'registerContainer').mockImplementation(() => undefined);
          testContext.focusHandler.container = testContext.container;
          expect(spy).toHaveBeenCalled();
        });

        it('does not focus on the container when the dropdown becomes open', async () => {
          testContext.focusHandler.container = testContext.container;
          testContext.popoverService.open = true;
          // This specific focusing action is asynchronous so we have to tick
          await delay();
          expectActiveElementNotToBe(testContext.container);
        });
        it('does not focus on the trigger when the dropdown becomes closed', () => {
          testContext.focusHandler.trigger = testContext.trigger;
          testContext.focusHandler.container = testContext.container;
          testContext.popoverService.open = true;
          testContext.popoverService.open = false;
          expectActiveElementNotToBe(testContext.trigger);
        });

        it('points right to the first child', () => {
          let right: FocusableItem;
          testContext.focusHandler.right.subscribe(child => (right = child));
          testContext.focusHandler.addChildren(testContext.children);
          expect(right).toBe(testContext.children[0]);
        });

        it('does not point up, down or left', () => {
          testContext.focusHandler.addChildren(testContext.children);
          expect((testContext.focusHandler as FocusableItem).up).toBeUndefined();
          expect((testContext.focusHandler as FocusableItem).down).toBeUndefined();
          expect((testContext.focusHandler as FocusableItem).left).toBeUndefined();
        });

        it('links received children back to the trigger', () => {
          const spy = vi.spyOn(Linkers, 'linkParent').mockImplementation(() => undefined);
          testContext.focusHandler.addChildren(testContext.children);
          expect(spy).toHaveBeenCalledWith(testContext.children, expect.any(Observable), ArrowKeyDirection.LEFT);
        });

        it('closes the dropdown when trying to go back to the trigger', () => {
          testContext.focusHandler.addChildren(testContext.children);
          testContext.popoverService.open = true;
          const back = testContext.children[0].left;
          expect(isObservable(back)).toBeTruthy();
          (back as Observable<FocusableItem>).subscribe(() => null);
          expect(testContext.popoverService.open).toBeFalsy();
        });

        it('moves to the first child when opened with a click', async () => {
          testContext.focusHandler.addChildren(testContext.children);
          const moveTo = vi.spyOn(testContext.focusService, 'moveTo').mockImplementation(() => undefined);
          const move = vi.spyOn(testContext.focusService, 'move').mockImplementation(() => undefined);
          testContext.popoverService.toggleWithEvent({});
          await delay();

          expect(moveTo).toHaveBeenCalledWith(testContext.focusHandler);
          expect(move).toHaveBeenCalledWith(ArrowKeyDirection.RIGHT);
        });
      });
    });
  });
});
