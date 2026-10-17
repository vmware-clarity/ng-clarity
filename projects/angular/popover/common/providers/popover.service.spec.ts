/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Keys } from '@clr/angular/utils';
import { Observable } from 'rxjs';

import { ClrPopoverService } from './popover.service';
import { ClrPopoverModuleNext } from '../popover.module';

@Component({
  selector: 'test-host',
  template: '',
  providers: [ClrPopoverService],
  standalone: false,
})
class TestHost {}

interface TestContext {
  popoverService: ClrPopoverService;
}

describe('ClrPopover', () => {
  describe('Service', () => {
    describe('ClrPopoverService', () => {
      let testContext: TestContext;
      beforeEach(() => {
        testContext = {} as TestContext;
      });

      describe('API', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [ClrPopoverModuleNext],
            declarations: [TestHost],
          });
          const fixture = TestBed.createComponent(TestHost);
          testContext.popoverService = fixture.debugElement.injector.get(ClrPopoverService, null);
        });

        it('exposes an observable for the open change events', () => {
          const changeObservable: Observable<boolean> = testContext.popoverService.openChange;
          expect(changeObservable).toBeDefined();
          expect(changeObservable instanceof Observable).toBe(true);
        });

        it('exposes an observable for the change events', () => {
          const eventObservable: Observable<Event> = testContext.popoverService.getEventChange();
          expect(eventObservable).toBeDefined();
          expect(eventObservable instanceof Observable).toBe(true);
        });

        it('exposes an observable for the popover visible change events', () => {
          const visibleObservable: Observable<boolean> = testContext.popoverService.popoverVisible;
          expect(visibleObservable).toBeDefined();
          expect(visibleObservable instanceof Observable).toBe(true);
          let visible = false;
          const subscription = visibleObservable.subscribe(() => {
            visible = true;
          });
          testContext.popoverService.popoverVisibleEmit(null);
          expect(visible).toBe(true);
          subscription.unsubscribe();
        });

        it('updates and notifies when the openEvent changes', () => {
          const clickEvent: Event = new MouseEvent('click');
          let testEvent: Event;
          const eventSubscription = testContext.popoverService.getEventChange().subscribe(event => {
            testEvent = event;
          });
          expect(testContext.popoverService.openEvent).toBeUndefined();
          testContext.popoverService.openEvent = clickEvent;
          expect(clickEvent).toEqual(testEvent);
          expect(testContext.popoverService.openEvent).toBe(testEvent);
          eventSubscription.unsubscribe();
        });

        it('updates and notifies when the open value changes', () => {
          let openValue: boolean;
          const openSubscription = testContext.popoverService.openChange.subscribe(change => {
            openValue = change;
          });
          expect(testContext.popoverService.open).toBe(false);
          expect(testContext.popoverService.open).toBe(false);
          testContext.popoverService.open = true;
          expect(testContext.popoverService.open).toBe(true);
          expect(testContext.popoverService.open).toEqual(openValue);
          openSubscription.unsubscribe();
        });

        it('toggles open state with events', () => {
          const openClickEvent: Event = new MouseEvent('click');
          const closeClickEvent: Event = new MouseEvent('click');
          expect(testContext.popoverService.open).toBe(false);
          expect(testContext.popoverService.openEvent).toBeUndefined();
          testContext.popoverService.toggleWithEvent(openClickEvent);
          expect(testContext.popoverService.open).toBe(true);
          expect(testContext.popoverService.openEvent).toBe(openClickEvent);
          testContext.popoverService.toggleWithEvent(closeClickEvent);
          expect(testContext.popoverService.open).toBe(false);
          expect(testContext.popoverService.openEvent).toBe(closeClickEvent);
        });

        it('opens at a specific point', () => {
          const point = { x: 100, y: 200 };
          testContext.popoverService.openAtPoint(point);
          expect(testContext.popoverService.open).toBe(true);
          expect(testContext.popoverService.origin).toEqual(point);
          expect(testContext.popoverService.originPoint).toEqual(point);
        });

        it('returns originPoint when origin is a point', () => {
          const point = { x: 300, y: 400 };
          testContext.popoverService.origin = point;
          expect(testContext.popoverService.originPoint).toEqual(point);
          expect(testContext.popoverService.originElement).toBeNull();
        });

        it('returns originElement when origin is an ElementRef', () => {
          const elRef = new ElementRef(document.createElement('button'));
          testContext.popoverService.origin = elRef;
          expect(testContext.popoverService.originElement).toBe(elRef);
          expect(testContext.popoverService.originPoint).toBeNull();
        });

        /**
         * Call `event.preventDefault` for arrow key events
         * and
         * skip `event.preventDefault` for non arrow key events
         */
        Object.keys(Keys).forEach(key => {
          const arrowKeyEvent = new KeyboardEvent(key, { key });
          if (key.search('Arrow') > -1) {
            // Arrow keys are ignored to prevent content from closing the popover content
            it(`prevents the default toggle action for the ${key} key`, () => {
              vi.spyOn(arrowKeyEvent, 'preventDefault').mockImplementation(() => undefined);
              testContext.popoverService.toggleWithEvent(arrowKeyEvent);
              expect(arrowKeyEvent.preventDefault).toHaveBeenCalled();
            });
          } else {
            it(`does not prevent the default toggle action for the ${key} key`, () => {
              vi.spyOn(arrowKeyEvent, 'preventDefault').mockImplementation(() => undefined);
              testContext.popoverService.toggleWithEvent(arrowKeyEvent);
              expect(arrowKeyEvent.preventDefault).not.toHaveBeenCalled();
            });
          }
        });
      });
    });
  });
});
