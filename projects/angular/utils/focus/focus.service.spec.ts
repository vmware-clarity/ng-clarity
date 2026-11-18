/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { ArrowKeyDirection } from './arrow-key-direction.enum';
import { FOCUS_SERVICE_PROVIDER, FocusService } from './focus.service';
import { FocusableItem } from './focusable-item/focusable-item';
import { MockFocusableItem } from './focusable-item/focusable-item.mock';

@Component({
  selector: 'simple-host',
  template: '',
  providers: [FOCUS_SERVICE_PROVIDER],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class SimpleHost {}

@Component({
  template: '<simple-host></simple-host>',
  providers: [FOCUS_SERVICE_PROVIDER],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class NestedHost {}

interface TestContext {
  focusService: FocusService;
}

describe('Focus management', () => {
  describe('Focus service', () => {
    let testContext: TestContext;
    beforeEach(() => {
      testContext = {} as TestContext;
    });

    describe('FOCUS_SERVICE_PROVIDER', () => {
      it('declares itself as a FocusService provider', () => {
        TestBed.configureTestingModule({ declarations: [SimpleHost] });
        const fixture = TestBed.createComponent(SimpleHost);
        expect(fixture.debugElement.injector.get(FocusService, null)).not.toBeNull();
      });

      it('creates a single instance for nested components declaring it as a provider', () => {
        TestBed.configureTestingModule({ declarations: [SimpleHost, NestedHost] });
        const fixture = TestBed.createComponent(NestedHost);
        const parentService = fixture.debugElement.injector.get(FocusService, null);
        const childService = fixture.debugElement.query(By.directive(SimpleHost)).injector.get(FocusService, null);
        expect(childService).toBe(parentService);
      });
    });

    describe('API', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({ declarations: [SimpleHost] });
        const fixture = TestBed.createComponent(SimpleHost);
        testContext.focusService = fixture.debugElement.injector.get(FocusService, null);
      });

      function setupContainer(context: TestContext) {
        const container = document.createElement('div');
        context.focusService.registerContainer(container);
        return container;
      }

      it('can be reset to a specific currently focused item', () => {
        const item = new MockFocusableItem('');
        testContext.focusService.reset(item);
        expect(testContext.focusService.current).toBe(item);
      });

      it('can activate the currently focused item', () => {
        const item = new MockFocusableItem('');
        const spy = vi.spyOn(item, 'activate').mockImplementation(() => undefined);
        testContext.focusService.reset(item);
        testContext.focusService.activateCurrent();
        expect(spy).toHaveBeenCalled();
      });

      it('calls the focus() method of the new focused item', () => {
        setupContainer(testContext);
        const item = new MockFocusableItem('');
        const spy = vi.spyOn(item, 'focus').mockImplementation(() => undefined);
        testContext.focusService.moveTo(item);
        expect(spy).toHaveBeenCalled();
      });

      it('calls the blur() method of the previously focused item', () => {
        setupContainer(testContext);
        const first = new MockFocusableItem('1');
        const second = new MockFocusableItem('2');
        testContext.focusService.reset(first);
        const spy = vi.spyOn(first, 'blur').mockImplementation(() => undefined);
        testContext.focusService.moveTo(second);
        expect(spy).toHaveBeenCalled();
      });

      it('can move in all directions', () => {
        const spy = vi.spyOn(testContext.focusService, 'moveTo').mockImplementation(() => undefined);
        const current = new MockFocusableItem('center');
        for (const direction of Object.values(ArrowKeyDirection)) {
          const target = new MockFocusableItem(direction);
          current[direction] = target;
          testContext.focusService.reset(current);
          testContext.focusService.move(direction);
          expect(spy).toHaveBeenCalledWith(target);
        }
      });

      it('focuses on disabled item in navigation', () => {
        const current = new MockFocusableItem('1');
        const nope = new MockFocusableItem('2');
        nope.disabled = true;
        current.down = nope;
        const spy = vi.spyOn(testContext.focusService, 'moveTo').mockImplementation(() => undefined);
        testContext.focusService.reset(current);
        testContext.focusService.move(ArrowKeyDirection.DOWN);
        expect(spy).toHaveBeenCalledWith(nope);
      });

      it('does not move focus to another item if current is undefined', () => {
        const spy = vi.spyOn(testContext.focusService, 'moveTo').mockImplementation(() => undefined);
        const result = testContext.focusService.move(ArrowKeyDirection.DOWN);
        expect(spy).not.toHaveBeenCalled();
        expect(result).toBe(false);
      });

      it('waits for the next item if it is an Observable', () => {
        const first = new MockFocusableItem('1');
        const second = new MockFocusableItem('2');
        const delayed = new Subject<FocusableItem>();
        first.down = delayed;
        const spy = vi.spyOn(testContext.focusService, 'moveTo').mockImplementation(() => undefined);
        testContext.focusService.reset(first);
        testContext.focusService.move(ArrowKeyDirection.DOWN);
        expect(spy).not.toHaveBeenCalled();
        delayed.next(second);
        expect(spy).toHaveBeenCalledWith(second);
      });

      it('should return boolean state dependend on the focus', () => {
        const current = new MockFocusableItem('1');
        const down = new MockFocusableItem('2');
        current.down = down;
        testContext.focusService.reset(current);
        const result = testContext.focusService.move(ArrowKeyDirection.DOWN);
        const result2 = testContext.focusService.move(ArrowKeyDirection.DOWN);

        expect(result).toBe(true);
        expect(result2).toBe(false);
      });

      it('can listen to arrow keys on an element', () => {
        const spy = vi.spyOn(testContext.focusService, 'move').mockImplementation(() => undefined);
        const el = document.createElement('div');
        testContext.focusService.registerContainer(el);
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        expect(spy).toHaveBeenCalledWith(ArrowKeyDirection.UP);
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(spy).toHaveBeenCalledWith(ArrowKeyDirection.DOWN);
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
        expect(spy).toHaveBeenCalledWith(ArrowKeyDirection.LEFT);
        // el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        // expect(spy).toHaveBeenCalledWith(ArrowKeyDirection.RIGHT);
      });

      it('activates the current item when pressing Enter on the container', () => {
        const spy = vi.spyOn(testContext.focusService, 'activateCurrent').mockImplementation(() => undefined);
        const container = setupContainer(testContext);
        container.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(spy).toHaveBeenCalled();
      });

      it('activates the current item when pressing Space on the container', () => {
        const spy = vi.spyOn(testContext.focusService, 'activateCurrent').mockImplementation(() => undefined);
        const container = setupContainer(testContext);
        container.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
