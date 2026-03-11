/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
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

export default function (): void {
  describe('ClrPopoverService', function () {
    describe('API', () => {
      beforeEach(function (this: TestContext) {
        TestBed.configureTestingModule({
          imports: [ClrPopoverModuleNext],
          declarations: [TestHost],
        });
        const fixture = TestBed.createComponent(TestHost);
        this.popoverService = fixture.debugElement.injector.get(ClrPopoverService, null);
      });

      it('exposes an observable for the open change events', function (this: TestContext) {
        const changeObservable: Observable<boolean> = this.popoverService.openChange;
        expect(changeObservable).toBeDefined();
        expect(changeObservable instanceof Observable).toBe(true);
      });

      it('exposes an observable for the change events', function (this: TestContext) {
        const eventObservable: Observable<Event> = this.popoverService.getEventChange();
        expect(eventObservable).toBeDefined();
        expect(eventObservable instanceof Observable).toBe(true);
      });

      it('exposes an observable for the popover visible change events', function (this: TestContext) {
        const visibleObservable: Observable<boolean> = this.popoverService.popoverVisible;
        expect(visibleObservable).toBeDefined();
        expect(visibleObservable instanceof Observable).toBe(true);
        let visible = false;
        const subscription = visibleObservable.subscribe(() => {
          visible = true;
        });
        this.popoverService.popoverVisibleEmit(null);
        expect(visible).toBeTrue();
        subscription.unsubscribe();
      });

      it('updates and notifies when the openEvent changes', function (this: TestContext) {
        const clickEvent: Event = new MouseEvent('click');
        let testEvent: Event;
        const eventSubscription = this.popoverService.getEventChange().subscribe(event => {
          testEvent = event;
        });
        expect(this.popoverService.openEvent).toBeUndefined();
        this.popoverService.openEvent = clickEvent;
        expect(clickEvent).toEqual(testEvent);
        expect(this.popoverService.openEvent).toBe(testEvent);
        eventSubscription.unsubscribe();
      });

      it('updates and notifies when the open value changes', function (this: TestContext) {
        let openValue: boolean;
        const openSubscription = this.popoverService.openChange.subscribe(change => {
          openValue = change;
        });
        expect(this.popoverService.open).toBe(false);
        expect(this.popoverService.open).toBeFalse();
        this.popoverService.open = true;
        expect(this.popoverService.open).toBeTrue();
        expect(this.popoverService.open).toEqual(openValue);
        openSubscription.unsubscribe();
      });

      it('toggles open state with events', function (this: TestContext) {
        const openClickEvent: Event = new MouseEvent('click');
        const closeClickEvent: Event = new MouseEvent('click');
        expect(this.popoverService.open).toBeFalse();
        expect(this.popoverService.openEvent).toBeUndefined();
        this.popoverService.toggleWithEvent(openClickEvent);
        expect(this.popoverService.open).toBeTrue();
        expect(this.popoverService.openEvent).toBe(openClickEvent);
        this.popoverService.toggleWithEvent(closeClickEvent);
        expect(this.popoverService.open).toBeFalse();
        expect(this.popoverService.openEvent).toBe(closeClickEvent);
      });

      it('opens at a specific point', function (this: TestContext) {
        const point = { x: 100, y: 200 };
        this.popoverService.openAtPoint(point);
        expect(this.popoverService.open).toBeTrue();
        expect(this.popoverService.origin).toEqual(point);
        expect(this.popoverService.originPoint).toEqual(point);
      });

      it('returns originPoint when origin is a point', function (this: TestContext) {
        const point = { x: 300, y: 400 };
        this.popoverService.origin = point;
        expect(this.popoverService.originPoint).toEqual(point);
        expect(this.popoverService.originElement).toBeNull();
      });

      it('returns originElement when origin is an ElementRef', function (this: TestContext) {
        const elRef = { nativeElement: document.createElement('button') };
        this.popoverService.origin = elRef as any;
        expect(this.popoverService.originElement).toBe(elRef as any);
        expect(this.popoverService.originPoint).toBeNull();
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
          it(`prevents the default toggle action for the ${key} key`, function (this: TestContext) {
            spyOn(arrowKeyEvent, 'preventDefault');
            this.popoverService.toggleWithEvent(arrowKeyEvent);
            expect(arrowKeyEvent.preventDefault).toHaveBeenCalled();
          });
        } else {
          it(`does not prevent the default toggle action for the ${key} key`, function (this: TestContext) {
            spyOn(arrowKeyEvent, 'preventDefault');
            this.popoverService.toggleWithEvent(arrowKeyEvent);
            expect(arrowKeyEvent.preventDefault).not.toHaveBeenCalled();
          });
        }
      });
    });
  });
}
