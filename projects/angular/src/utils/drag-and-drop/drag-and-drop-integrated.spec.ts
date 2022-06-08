/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrDragAndDropModule } from './drag-and-drop.module';
import { ClrDraggable } from './draggable/draggable';
import { emulateDragEvent } from './helpers.spec';

// Here, we test drag and drop directives and components altogether in an integrated way.
// Unlike other .spec test files, we use actual events in the following tests.

const MOCK_DATA_PAYLOAD = {
  data: 'test_drag_data_transfer',
};

export default function (): void {
  describe('With ClrDraggable', function () {
    let fixture: ComponentFixture<any>;
    let testComponent: WithDraggableTest;
    let testElement: HTMLElement;
    let draggable: ElementRef;

    beforeEach(function () {
      TestBed.configureTestingModule({
        imports: [ClrDragAndDropModule, NoopAnimationsModule],
        declarations: [WithDraggableTest],
      });

      fixture = TestBed.createComponent(WithDraggableTest);
      testComponent = fixture.componentInstance;
      testElement = fixture.nativeElement;

      draggable = fixture.debugElement.queryAll(By.directive(ClrDraggable))[1];
      fixture.detectChanges();
    });

    afterEach(function () {
      fixture.destroy();
    });

    describe('Template API', function () {
      const checkStaticProps = function (dragEvent: any) {
        // the following properties don't change accross different drag events
        // and expected to stay the same in all of them.
        expect(dragEvent.group).toBe('draggable-1');
        expect(dragEvent.dragDataTransfer).toEqual(MOCK_DATA_PAYLOAD);
      };

      it('should emit event with proper properties on dragStart', fakeAsync(function () {
        emulateDragEvent('mousedown', 10, 20, draggable.nativeElement);
        tick();
        checkStaticProps(testComponent.dragStartEvent);
        expect(testComponent.dragStartEvent.dragPosition).toEqual({ pageX: 10, pageY: 20, moveX: 0, moveY: 0 });
        expect(testComponent.dragStartEvent.dropPointPosition).toBeUndefined();
      }));

      it('should emit event with proper properties on dragMove', fakeAsync(function () {
        emulateDragEvent('mousedown', 10, 20, draggable.nativeElement);
        tick();
        emulateDragEvent('mousemove', 100, 200);
        checkStaticProps(testComponent.dragMoveEvent);
        expect(testComponent.dragMoveEvent.dragPosition).toEqual({ pageX: 100, pageY: 200, moveX: 90, moveY: 180 });

        // offsetX = dragStart.pageX - draggable.pageX
        // offsetY = dragStart.pageY - draggable.pageY
        // dropPointPosition.pageX =  dragMove.pageX + draggable.width/2 - offsetX
        // dropPointPosition.pageY =  dragMove.pageY + draggable.height/2 - offsetY
        expect(testComponent.dragMoveEvent.dropPointPosition).toEqual({ pageX: 140, pageY: 205 });
      }));

      it('should emit event with proper properties on dragEnter', fakeAsync(function () {
        emulateDragEvent('mousedown', 10, 20, draggable.nativeElement);
        tick();
        emulateDragEvent('mousemove', 500, 300);
        checkStaticProps(testComponent.dragEnterEvent);
        expect(testComponent.dragEnterEvent.dragPosition).toEqual({ pageX: 500, pageY: 300, moveX: 490, moveY: 280 });
        expect(testComponent.dragEnterEvent.dropPointPosition).toEqual({ pageX: 540, pageY: 305 });
      }));

      it('should emit event with proper properties on dragLeave', fakeAsync(function () {
        emulateDragEvent('mousedown', 10, 20, draggable.nativeElement);
        tick();
        emulateDragEvent('mousemove', 500, 300);
        emulateDragEvent('mousemove', 100, 200);
        checkStaticProps(testComponent.dragLeaveEvent);
        expect(testComponent.dragLeaveEvent.dragPosition).toEqual({ pageX: 100, pageY: 200, moveX: 90, moveY: 180 });
        expect(testComponent.dragLeaveEvent.dropPointPosition).toEqual({ pageX: 140, pageY: 205 });
      }));

      it('should emit event with proper properties on dragEnd', fakeAsync(function () {
        emulateDragEvent('mousedown', 10, 20, draggable.nativeElement);
        tick();
        emulateDragEvent('mousemove', 500, 300);
        emulateDragEvent('mousemove', 100, 200);
        emulateDragEvent('mouseup', 100, 200);
        checkStaticProps(testComponent.dragEndEvent);
        expect(testComponent.dragEndEvent.dragPosition).toEqual({ pageX: 100, pageY: 200, moveX: 90, moveY: 180 });
        expect(testComponent.dragEndEvent.dropPointPosition).toEqual({ pageX: 140, pageY: 205 });
      }));

      it('should emit event with proper properties on drop', fakeAsync(function () {
        emulateDragEvent('mousedown', 10, 20, draggable.nativeElement);
        tick();
        emulateDragEvent('mousemove', 500, 300);
        emulateDragEvent('mouseup', 500, 300);
        checkStaticProps(testComponent.dropEvent);
        expect(testComponent.dropEvent.dragPosition).toEqual({ pageX: 500, pageY: 300, moveX: 490, moveY: 280 });
        expect(testComponent.dropEvent.dropPointPosition).toEqual({ pageX: 540, pageY: 305 });
      }));

      it('should delay dragStart event if clrDragStartDelay is provided', fakeAsync(function () {
        testComponent.dragStartDelay = 1000;
        fixture.detectChanges();
        emulateDragEvent('mousedown', 10, 20, draggable.nativeElement);
        tick(500);
        expect(testComponent.dragStartEvent).toBeUndefined();
        tick(500);
        expect(testComponent.dragStartEvent).not.toBeUndefined();
        checkStaticProps(testComponent.dragStartEvent);
      }));

      it('should cancel the entire drag process if mousemove during clrDragStartDelay', fakeAsync(function () {
        testComponent.dragStartDelay = 1000;
        fixture.detectChanges();
        emulateDragEvent('mousedown', 10, 20, draggable.nativeElement);
        tick(500);
        emulateDragEvent('mousemove', 20, 30);
        tick(500);
        expect(testComponent.dragStartEvent).toBeUndefined();
      }));
    });

    describe('View', function () {
      it('should have proper number of draggables and droppables', function () {
        expect(testElement.querySelectorAll('.draggable').length).toBe(2);
        expect(testElement.querySelectorAll('.droppable').length).toBe(3);
        expect(testElement.querySelectorAll('clr-draggable-ghost').length).toBe(0);
      });

      it('should add being-dragged class to draggable being dragged', fakeAsync(function () {
        emulateDragEvent('mousedown', 0, 0, draggable.nativeElement);
        tick();
        fixture.detectChanges();
        const draggableQueries = testElement.querySelectorAll('.being-dragged');
        expect(draggableQueries.length).toBe(1, `Only one draggable should have the "being-dragged" class at a time.`);
        expect(draggableQueries[0]).toBe(draggable.nativeElement);
      }));

      it('should show ghost next to proper draggable on dragStart', fakeAsync(function () {
        emulateDragEvent('mousedown', 0, 0, draggable.nativeElement);
        tick();
        fixture.detectChanges();
        const draggableQueries = testElement.querySelectorAll('.being-dragged');
        expect(draggableQueries[0].nextElementSibling.tagName).toBe('CLR-DRAGGABLE-GHOST');
        expect(draggableQueries[0].nextElementSibling.classList.contains('draggable-ghost')).toBeTruthy();
      }));

      it('should add draggable-match to all droppables with matching group', fakeAsync(function () {
        emulateDragEvent('mousedown', 0, 0, draggable.nativeElement);
        tick();
        fixture.detectChanges();
        const matchingDroppablesQueries = testElement.querySelectorAll('.draggable-match');
        expect(matchingDroppablesQueries.length).toBe(2);

        const overDroppablesQueries = testElement.querySelectorAll('.draggable-over');
        expect(overDroppablesQueries.length).toBe(0);
      }));

      it('should add draggable-over to proper droppable on dragEnter', fakeAsync(function () {
        emulateDragEvent('mousedown', 0, 0, draggable.nativeElement);
        tick();
        emulateDragEvent('mousemove', 500, 300);
        fixture.detectChanges();

        const matchingDroppablesQueries = testElement.querySelectorAll('.draggable-match');
        expect(matchingDroppablesQueries.length).toBe(2);

        const overDroppablesQueries = testElement.querySelectorAll('.draggable-over');
        expect(overDroppablesQueries.length).toBe(1);
      }));

      it('should remove draggable-over to on dragLeave', fakeAsync(function () {
        emulateDragEvent('mousedown', 0, 0, draggable.nativeElement);
        tick();
        emulateDragEvent('mousemove', 500, 300);
        emulateDragEvent('mousemove', 100, 200);
        fixture.detectChanges();

        const matchingDroppablesQueries = testElement.querySelectorAll('.draggable-match');
        expect(matchingDroppablesQueries.length).toBe(2);

        const overDroppablesQueries = testElement.querySelectorAll('.draggable-over');
        expect(overDroppablesQueries.length).toBe(0);
      }));

      it('should have no droppables with draggable-over and draggable-match class on dragEnd', fakeAsync(function () {
        emulateDragEvent('mousedown', 0, 0, draggable.nativeElement);
        tick();
        emulateDragEvent('mousemove', 500, 300);
        emulateDragEvent('mousemove', 100, 200);
        emulateDragEvent('mouseup', 100, 200);
        fixture.detectChanges();

        const matchingDroppablesQueries = testElement.querySelectorAll('.draggable-match');
        expect(matchingDroppablesQueries.length).toBe(0);

        const overDroppablesQueries = testElement.querySelectorAll('.draggable-over');
        expect(overDroppablesQueries.length).toBe(0);
      }));

      it('should add dropped class to ghost on successful drop event', fakeAsync(function () {
        emulateDragEvent('mousedown', 0, 0, draggable.nativeElement);
        tick();
        const ghost = testElement.querySelector('.draggable-ghost');
        emulateDragEvent('mousemove', 500, 300);
        expect(ghost.classList.contains('dropped')).toBeFalsy();
        emulateDragEvent('mouseup', 500, 300);
        expect(ghost.classList.contains('dropped')).toBeTruthy();
      }));
    });
  });
}

@Component({
  styles: [
    `
      .droppable-test-state {
        position: absolute;
        left: 400px;
        top: 200px;
        width: 200px;
        height: 400px;
      }
      .draggable-test-state {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100px;
        height: 50px;
      }
    `,
  ],
  template: `
    <button clrDraggable>draggable button</button>
    <div
      class="draggable-test-state"
      clrGroup="draggable-1"
      [clrDraggable]="mockDataPayload"
      [clrDragStartDelay]="dragStartDelay"
    >
      draggable div
    </div>
    <div clrDroppable clrGroup="draggable-0"></div>
    <div
      class="droppable-test-state"
      clrDroppable
      [clrGroup]="['draggable-1', 'draggable-2']"
      (clrDragStart)="dragStartEvent = $event"
      (clrDragMove)="dragMoveEvent = $event"
      (clrDragEnd)="dragEndEvent = $event"
      (clrDragLeave)="dragLeaveEvent = $event"
      (clrDragEnter)="dragEnterEvent = $event"
      (clrDrop)="dropEvent = $event"
    ></div>
    <div clrDroppable clrGroup="draggable-1"></div>
  `,
})
class WithDraggableTest {
  public mockDataPayload = MOCK_DATA_PAYLOAD;
  public dragStartDelay: number;
  public dragStartEvent: any;
  public dragMoveEvent: any;
  public dragEndEvent: any;
  public dragLeaveEvent: any;
  public dragEnterEvent: any;
  public dropEvent: any;
}
