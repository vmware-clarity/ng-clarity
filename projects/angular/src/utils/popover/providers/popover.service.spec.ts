/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { Keys } from '../../enums/keys.enum';
import { ClrPopoverService } from './popover.service';

@Component({
  selector: 'test-host',
  template: '',
  providers: [ClrPopoverService],
})
class TestHost {}

interface TestContext {
  stateService: ClrPopoverService;
}

export default function (): void {
  describe('ClrPopoverService', function () {
    describe('API', () => {
      beforeEach(function (this: TestContext) {
        TestBed.configureTestingModule({
          declarations: [TestHost],
          providers: [ClrPopoverService],
        });
        const fixture = TestBed.createComponent(TestHost);
        this.stateService = fixture.debugElement.injector.get(ClrPopoverService, null);
      });

      it('exposes an observable for the open change events', function (this: TestContext) {
        const changeObservable: Observable<boolean> = this.stateService.openChange;
        expect(changeObservable).toBeDefined();
        expect(changeObservable instanceof Observable).toBe(true);
      });

      it('exposes an observable for the change events', function (this: TestContext) {
        const eventObservable: Observable<Event> = this.stateService.getEventChange();
        expect(eventObservable).toBeDefined();
        expect(eventObservable instanceof Observable).toBe(true);
      });

      it('exposes an observable for the alignment events', function (this: TestContext) {
        const alignedObservable: Observable<HTMLElement> = this.stateService.popoverAligned;
        expect(alignedObservable).toBeDefined();
        expect(alignedObservable instanceof Observable).toBe(true);
        let aligned = false;
        const subscription = alignedObservable.subscribe(() => {
          aligned = true;
        });
        this.stateService.popoverAlignedEmit(null);
        expect(aligned).toBeTrue();
        subscription.unsubscribe();
      });

      it('exposes an observable for the popover visible change events', function (this: TestContext) {
        const visibleObservable: Observable<boolean> = this.stateService.popoverVisible;
        expect(visibleObservable).toBeDefined();
        expect(visibleObservable instanceof Observable).toBe(true);
        let visible = false;
        const subscription = visibleObservable.subscribe(() => {
          visible = true;
        });
        this.stateService.popoverVisibleEmit(null);
        expect(visible).toBeTrue();
        subscription.unsubscribe();
      });

      it('updates and notifies when the openEvent changes', function (this: TestContext) {
        const clickEvent: Event = new MouseEvent('click');
        let testEvent: Event;
        const eventSubscription = this.stateService.getEventChange().subscribe(event => {
          testEvent = event;
        });
        expect(this.stateService.openEvent).toBeUndefined();
        this.stateService.openEvent = clickEvent;
        expect(clickEvent).toEqual(testEvent);
        expect(this.stateService.openEvent).toBe(testEvent);
        eventSubscription.unsubscribe();
      });

      it('updates and notifies when the open value changes', function (this: TestContext) {
        let openValue: boolean;
        const openSubscription = this.stateService.openChange.subscribe(change => {
          openValue = change;
        });
        expect(this.stateService.open).toBe(false);
        expect(this.stateService.open).toBeFalse();
        this.stateService.open = true;
        expect(this.stateService.open).toBeTrue();
        expect(this.stateService.open).toEqual(openValue);
        openSubscription.unsubscribe();
      });

      it('toggles open state with events', function (this: TestContext) {
        const openClickEvent: Event = new MouseEvent('click');
        const closeClickEvent: Event = new MouseEvent('click');
        expect(this.stateService.open).toBeFalse();
        expect(this.stateService.openEvent).toBeUndefined();
        this.stateService.toggleWithEvent(openClickEvent);
        expect(this.stateService.open).toBeTrue();
        expect(this.stateService.openEvent).toBe(openClickEvent);
        this.stateService.toggleWithEvent(closeClickEvent);
        expect(this.stateService.open).toBeFalse();
        expect(this.stateService.openEvent).toBe(closeClickEvent);
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
            this.stateService.toggleWithEvent(arrowKeyEvent);
            expect(arrowKeyEvent.preventDefault).toHaveBeenCalled();
          });
        } else {
          it(`does not prevent the default toggle action for the ${key} key`, function (this: TestContext) {
            spyOn(arrowKeyEvent, 'preventDefault');
            this.stateService.toggleWithEvent(arrowKeyEvent);
            expect(arrowKeyEvent.preventDefault).not.toHaveBeenCalled();
          });
        }
      });
    });
  });
}
