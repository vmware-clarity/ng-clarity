/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import * as i0 from "@angular/core";
import * as i1 from "./providers/column-resizer.service";
import * as i2 from "./providers/table-size.service";
import * as i3 from "../../utils/i18n/common-strings.service";
import * as i4 from "../../utils/cdk/cdk-drag.module";
// Default resize length on each keyboard move event
const KEYBOARD_RESIZE_LENGTH = 12;
export class ClrDatagridColumnSeparator {
    constructor(columnResizerService, renderer, ngZone, tableSizeService, commonString, document) {
        this.columnResizerService = columnResizerService;
        this.renderer = renderer;
        this.ngZone = ngZone;
        this.tableSizeService = tableSizeService;
        this.commonString = commonString;
        this.document = document;
        this.columnSeparatorId = uniqueIdFactory();
        this.resizeStartedOnKeyDown = false;
        this.unlisteners = [];
    }
    get descriptionId() {
        return `${this.columnSeparatorId}-aria-describedby`;
    }
    get resizeTrackerEl() {
        return this.resizeTrackerRef.nativeElement;
    }
    get columnHandleEl() {
        return this.columnHandleRef.nativeElement;
    }
    ngAfterViewInit() {
        this.ngZone.runOutsideAngular(() => {
            this.unlisteners.push(this.renderer.listen(this.columnHandleEl, 'keydown', event => {
                this.showTrackerOnFirstKeyDown(event);
                this.moveTrackerOnKeyDown(event);
            }));
            this.unlisteners.push(this.renderer.listen(this.columnHandleEl, 'keyup', event => {
                this.hideTrackerOnKeyUp(event);
            }));
        });
    }
    ngOnDestroy() {
        this.unlisteners.forEach(unlistener => unlistener());
    }
    showTracker() {
        this.columnResizerService.startResize();
        const tableHeight = this.tableSizeService.getColumnDragHeight();
        this.renderer.setStyle(this.resizeTrackerEl, 'height', tableHeight);
        this.renderer.setStyle(this.resizeTrackerEl, 'display', 'block');
    }
    moveTracker(movedBy) {
        this.columnResizerService.calculateResize(movedBy);
        this.renderer.setStyle(this.resizeTrackerEl, 'transform', `translateX(${this.columnResizerService.resizedBy}px)`);
        this.renderer.setStyle(this.document.body, 'cursor', 'col-resize');
        this.redFlagTracker();
    }
    hideTracker() {
        this.columnResizerService.endResize();
        this.renderer.setStyle(this.resizeTrackerEl, 'display', 'none');
        this.renderer.setStyle(this.resizeTrackerEl, 'transform', `translateX(0px)`);
        this.renderer.setStyle(this.columnHandleEl, 'transform', `translateX(0px)`);
        this.renderer.setStyle(this.document.body, 'cursor', 'auto');
    }
    showTrackerOnFirstKeyDown(event) {
        if (!this.resizeStartedOnKeyDown && (this.isArrowLeftKeyEvent(event) || this.isArrowRightKeyEvent(event))) {
            this.resizeStartedOnKeyDown = true;
            this.renderer.addClass(this.resizeTrackerEl, 'on-arrow-key-resize');
            this.showTracker();
        }
    }
    moveTrackerOnKeyDown(event) {
        if (this.isArrowLeftKeyEvent(event)) {
            event.stopPropagation();
            this.moveTracker(this.columnResizerService.resizedBy - KEYBOARD_RESIZE_LENGTH);
        }
        else if (this.isArrowRightKeyEvent(event)) {
            event.stopPropagation();
            this.moveTracker(this.columnResizerService.resizedBy + KEYBOARD_RESIZE_LENGTH);
        }
    }
    hideTrackerOnKeyUp(event) {
        if (this.resizeStartedOnKeyDown && (this.isArrowLeftKeyEvent(event) || this.isArrowRightKeyEvent(event))) {
            this.resizeStartedOnKeyDown = false;
            this.renderer.removeClass(this.resizeTrackerEl, 'on-arrow-key-resize');
            this.hideTracker();
            this.columnHandleEl.focus();
        }
    }
    redFlagTracker() {
        if (this.isWithinMaxResizeRange !== this.columnResizerService.isWithinMaxResizeRange) {
            this.isWithinMaxResizeRange = this.columnResizerService.isWithinMaxResizeRange;
            if (!this.isWithinMaxResizeRange) {
                this.renderer.addClass(this.resizeTrackerEl, 'exceeded-max');
            }
            else {
                this.renderer.removeClass(this.resizeTrackerEl, 'exceeded-max');
            }
        }
    }
    isArrowLeftKeyEvent(event) {
        return normalizeKey(event.key) === Keys.ArrowLeft;
    }
    isArrowRightKeyEvent(event) {
        return normalizeKey(event.key) === Keys.ArrowRight;
    }
}
ClrDatagridColumnSeparator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridColumnSeparator, deps: [{ token: i1.ColumnResizerService }, { token: i0.Renderer2 }, { token: i0.NgZone }, { token: i2.TableSizeService }, { token: i3.ClrCommonStringsService }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridColumnSeparator.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridColumnSeparator, selector: "clr-dg-column-separator", host: { properties: { "class.datagrid-column-separator": "true" } }, viewQueries: [{ propertyName: "resizeTrackerRef", first: true, predicate: ["resizeTracker"], descendants: true }, { propertyName: "columnHandleRef", first: true, predicate: ["columnHandle"], descendants: true }], ngImport: i0, template: `
    <button
      type="button"
      class="datagrid-column-handle"
      [attr.aria-label]="commonString.keys.columnSeparatorAriaLabel"
      [attr.aria-describedby]="descriptionId"
      cdkDrag
      cdkDragLockAxis="x"
      (cdkDragStarted)="showTracker()"
      (cdkDragMoved)="moveTracker($event.distance.x)"
      (cdkDragEnded)="hideTracker(); $event.source._dragRef.reset()"
      #columnHandle
    ></button>
    <span class="clr-sr-only" [attr.id]="descriptionId">
      {{ commonString.keys.columnSeparatorDescription }}
    </span>
    <div class="datagrid-column-resize-tracker" #resizeTracker></div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i4.CdkDragModule_CdkDrag, selector: "[cdkDrag]" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridColumnSeparator, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-column-separator',
                    template: `
    <button
      type="button"
      class="datagrid-column-handle"
      [attr.aria-label]="commonString.keys.columnSeparatorAriaLabel"
      [attr.aria-describedby]="descriptionId"
      cdkDrag
      cdkDragLockAxis="x"
      (cdkDragStarted)="showTracker()"
      (cdkDragMoved)="moveTracker($event.distance.x)"
      (cdkDragEnded)="hideTracker(); $event.source._dragRef.reset()"
      #columnHandle
    ></button>
    <span class="clr-sr-only" [attr.id]="descriptionId">
      {{ commonString.keys.columnSeparatorDescription }}
    </span>
    <div class="datagrid-column-resize-tracker" #resizeTracker></div>
  `,
                    host: {
                        '[class.datagrid-column-separator]': 'true',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.ColumnResizerService }, { type: i0.Renderer2 }, { type: i0.NgZone }, { type: i2.TableSizeService }, { type: i3.ClrCommonStringsService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { resizeTrackerRef: [{
                type: ViewChild,
                args: ['resizeTracker']
            }], columnHandleRef: [{
                type: ViewChild,
                args: ['columnHandle']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtY29sdW1uLXNlcGFyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvZGF0YWdyaWQtY29sdW1uLXNlcGFyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQWlCLFNBQVMsRUFBYyxNQUFNLEVBQWdDLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV0SCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBRWhFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQzs7Ozs7O0FBSWhGLG9EQUFvRDtBQUNwRCxNQUFNLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztBQTBCbEMsTUFBTSxPQUFPLDBCQUEwQjtJQVVyQyxZQUNVLG9CQUEwQyxFQUMxQyxRQUFtQixFQUNuQixNQUFjLEVBQ2QsZ0JBQWtDLEVBQ25DLFlBQXFDLEVBQ2xCLFFBQWE7UUFML0IseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ25DLGlCQUFZLEdBQVosWUFBWSxDQUF5QjtRQUNsQixhQUFRLEdBQVIsUUFBUSxDQUFLO1FBZnpDLHNCQUFpQixHQUFHLGVBQWUsRUFBRSxDQUFDO1FBRTlCLDJCQUFzQixHQUFHLEtBQUssQ0FBQztRQUUvQixnQkFBVyxHQUFtQixFQUFFLENBQUM7SUFZdEMsQ0FBQztJQUVKLElBQUksYUFBYTtRQUNmLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLG1C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O3VCQUFDLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5qZWN0LCBOZ1pvbmUsIE9uRGVzdHJveSwgUmVuZGVyZXIyLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgS2V5cyB9IGZyb20gJy4uLy4uL3V0aWxzL2VudW1zL2tleXMuZW51bSc7XG5pbXBvcnQgeyBub3JtYWxpemVLZXkgfSBmcm9tICcuLi8uLi91dGlscy9mb2N1cy9rZXktZm9jdXMvdXRpbCc7XG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL2kxOG4vY29tbW9uLXN0cmluZ3Muc2VydmljZSc7XG5pbXBvcnQgeyB1bmlxdWVJZEZhY3RvcnkgfSBmcm9tICcuLi8uLi91dGlscy9pZC1nZW5lcmF0b3IvaWQtZ2VuZXJhdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29sdW1uUmVzaXplclNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9jb2x1bW4tcmVzaXplci5zZXJ2aWNlJztcbmltcG9ydCB7IFRhYmxlU2l6ZVNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy90YWJsZS1zaXplLnNlcnZpY2UnO1xuXG4vLyBEZWZhdWx0IHJlc2l6ZSBsZW5ndGggb24gZWFjaCBrZXlib2FyZCBtb3ZlIGV2ZW50XG5jb25zdCBLRVlCT0FSRF9SRVNJWkVfTEVOR1RIID0gMTI7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1kZy1jb2x1bW4tc2VwYXJhdG9yJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uLWhhbmRsZVwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZy5rZXlzLmNvbHVtblNlcGFyYXRvckFyaWFMYWJlbFwiXG4gICAgICBbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XT1cImRlc2NyaXB0aW9uSWRcIlxuICAgICAgY2RrRHJhZ1xuICAgICAgY2RrRHJhZ0xvY2tBeGlzPVwieFwiXG4gICAgICAoY2RrRHJhZ1N0YXJ0ZWQpPVwic2hvd1RyYWNrZXIoKVwiXG4gICAgICAoY2RrRHJhZ01vdmVkKT1cIm1vdmVUcmFja2VyKCRldmVudC5kaXN0YW5jZS54KVwiXG4gICAgICAoY2RrRHJhZ0VuZGVkKT1cImhpZGVUcmFja2VyKCk7ICRldmVudC5zb3VyY2UuX2RyYWdSZWYucmVzZXQoKVwiXG4gICAgICAjY29sdW1uSGFuZGxlXG4gICAgPjwvYnV0dG9uPlxuICAgIDxzcGFuIGNsYXNzPVwiY2xyLXNyLW9ubHlcIiBbYXR0ci5pZF09XCJkZXNjcmlwdGlvbklkXCI+XG4gICAgICB7eyBjb21tb25TdHJpbmcua2V5cy5jb2x1bW5TZXBhcmF0b3JEZXNjcmlwdGlvbiB9fVxuICAgIDwvc3Bhbj5cbiAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uLXJlc2l6ZS10cmFja2VyXCIgI3Jlc2l6ZVRyYWNrZXI+PC9kaXY+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmRhdGFncmlkLWNvbHVtbi1zZXBhcmF0b3JdJzogJ3RydWUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZENvbHVtblNlcGFyYXRvciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIGNvbHVtblNlcGFyYXRvcklkID0gdW5pcXVlSWRGYWN0b3J5KCk7XG5cbiAgcHJpdmF0ZSByZXNpemVTdGFydGVkT25LZXlEb3duID0gZmFsc2U7XG4gIHByaXZhdGUgaXNXaXRoaW5NYXhSZXNpemVSYW5nZTogYm9vbGVhbjtcbiAgcHJpdmF0ZSB1bmxpc3RlbmVyczogKCgpID0+IHZvaWQpW10gPSBbXTtcblxuICBAVmlld0NoaWxkKCdyZXNpemVUcmFja2VyJykgcHJpdmF0ZSByZXNpemVUcmFja2VyUmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgnY29sdW1uSGFuZGxlJykgcHJpdmF0ZSBjb2x1bW5IYW5kbGVSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY29sdW1uUmVzaXplclNlcnZpY2U6IENvbHVtblJlc2l6ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgdGFibGVTaXplU2VydmljZTogVGFibGVTaXplU2VydmljZSxcbiAgICBwdWJsaWMgY29tbW9uU3RyaW5nOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBhbnlcbiAgKSB7fVxuXG4gIGdldCBkZXNjcmlwdGlvbklkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3RoaXMuY29sdW1uU2VwYXJhdG9ySWR9LWFyaWEtZGVzY3JpYmVkYnlgO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgcmVzaXplVHJhY2tlckVsKCkge1xuICAgIHJldHVybiB0aGlzLnJlc2l6ZVRyYWNrZXJSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGNvbHVtbkhhbmRsZUVsKCkge1xuICAgIHJldHVybiB0aGlzLmNvbHVtbkhhbmRsZVJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMudW5saXN0ZW5lcnMucHVzaChcbiAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5jb2x1bW5IYW5kbGVFbCwgJ2tleWRvd24nLCBldmVudCA9PiB7XG4gICAgICAgICAgdGhpcy5zaG93VHJhY2tlck9uRmlyc3RLZXlEb3duKGV2ZW50KTtcbiAgICAgICAgICB0aGlzLm1vdmVUcmFja2VyT25LZXlEb3duKGV2ZW50KTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgICB0aGlzLnVubGlzdGVuZXJzLnB1c2goXG4gICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuY29sdW1uSGFuZGxlRWwsICdrZXl1cCcsIGV2ZW50ID0+IHtcbiAgICAgICAgICB0aGlzLmhpZGVUcmFja2VyT25LZXlVcChldmVudCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy51bmxpc3RlbmVycy5mb3JFYWNoKHVubGlzdGVuZXIgPT4gdW5saXN0ZW5lcigpKTtcbiAgfVxuXG4gIHNob3dUcmFja2VyKCk6IHZvaWQge1xuICAgIHRoaXMuY29sdW1uUmVzaXplclNlcnZpY2Uuc3RhcnRSZXNpemUoKTtcbiAgICBjb25zdCB0YWJsZUhlaWdodCA9IHRoaXMudGFibGVTaXplU2VydmljZS5nZXRDb2x1bW5EcmFnSGVpZ2h0KCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLnJlc2l6ZVRyYWNrZXJFbCwgJ2hlaWdodCcsIHRhYmxlSGVpZ2h0KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMucmVzaXplVHJhY2tlckVsLCAnZGlzcGxheScsICdibG9jaycpO1xuICB9XG5cbiAgbW92ZVRyYWNrZXIobW92ZWRCeTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5jb2x1bW5SZXNpemVyU2VydmljZS5jYWxjdWxhdGVSZXNpemUobW92ZWRCeSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLnJlc2l6ZVRyYWNrZXJFbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGVYKCR7dGhpcy5jb2x1bW5SZXNpemVyU2VydmljZS5yZXNpemVkQnl9cHgpYCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmRvY3VtZW50LmJvZHksICdjdXJzb3InLCAnY29sLXJlc2l6ZScpO1xuICAgIHRoaXMucmVkRmxhZ1RyYWNrZXIoKTtcbiAgfVxuXG4gIGhpZGVUcmFja2VyKCk6IHZvaWQge1xuICAgIHRoaXMuY29sdW1uUmVzaXplclNlcnZpY2UuZW5kUmVzaXplKCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLnJlc2l6ZVRyYWNrZXJFbCwgJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5yZXNpemVUcmFja2VyRWwsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlWCgwcHgpYCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNvbHVtbkhhbmRsZUVsLCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZVgoMHB4KWApO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5kb2N1bWVudC5ib2R5LCAnY3Vyc29yJywgJ2F1dG8nKTtcbiAgfVxuXG4gIHByaXZhdGUgc2hvd1RyYWNrZXJPbkZpcnN0S2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5yZXNpemVTdGFydGVkT25LZXlEb3duICYmICh0aGlzLmlzQXJyb3dMZWZ0S2V5RXZlbnQoZXZlbnQpIHx8IHRoaXMuaXNBcnJvd1JpZ2h0S2V5RXZlbnQoZXZlbnQpKSkge1xuICAgICAgdGhpcy5yZXNpemVTdGFydGVkT25LZXlEb3duID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5yZXNpemVUcmFja2VyRWwsICdvbi1hcnJvdy1rZXktcmVzaXplJyk7XG4gICAgICB0aGlzLnNob3dUcmFja2VyKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlVHJhY2tlck9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzQXJyb3dMZWZ0S2V5RXZlbnQoZXZlbnQpKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRoaXMubW92ZVRyYWNrZXIodGhpcy5jb2x1bW5SZXNpemVyU2VydmljZS5yZXNpemVkQnkgLSBLRVlCT0FSRF9SRVNJWkVfTEVOR1RIKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNBcnJvd1JpZ2h0S2V5RXZlbnQoZXZlbnQpKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRoaXMubW92ZVRyYWNrZXIodGhpcy5jb2x1bW5SZXNpemVyU2VydmljZS5yZXNpemVkQnkgKyBLRVlCT0FSRF9SRVNJWkVfTEVOR1RIKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGhpZGVUcmFja2VyT25LZXlVcChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJlc2l6ZVN0YXJ0ZWRPbktleURvd24gJiYgKHRoaXMuaXNBcnJvd0xlZnRLZXlFdmVudChldmVudCkgfHwgdGhpcy5pc0Fycm93UmlnaHRLZXlFdmVudChldmVudCkpKSB7XG4gICAgICB0aGlzLnJlc2l6ZVN0YXJ0ZWRPbktleURvd24gPSBmYWxzZTtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5yZXNpemVUcmFja2VyRWwsICdvbi1hcnJvdy1rZXktcmVzaXplJyk7XG4gICAgICB0aGlzLmhpZGVUcmFja2VyKCk7XG4gICAgICB0aGlzLmNvbHVtbkhhbmRsZUVsLmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZWRGbGFnVHJhY2tlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1dpdGhpbk1heFJlc2l6ZVJhbmdlICE9PSB0aGlzLmNvbHVtblJlc2l6ZXJTZXJ2aWNlLmlzV2l0aGluTWF4UmVzaXplUmFuZ2UpIHtcbiAgICAgIHRoaXMuaXNXaXRoaW5NYXhSZXNpemVSYW5nZSA9IHRoaXMuY29sdW1uUmVzaXplclNlcnZpY2UuaXNXaXRoaW5NYXhSZXNpemVSYW5nZTtcbiAgICAgIGlmICghdGhpcy5pc1dpdGhpbk1heFJlc2l6ZVJhbmdlKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5yZXNpemVUcmFja2VyRWwsICdleGNlZWRlZC1tYXgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5yZXNpemVUcmFja2VyRWwsICdleGNlZWRlZC1tYXgnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGlzQXJyb3dMZWZ0S2V5RXZlbnQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplS2V5KGV2ZW50LmtleSkgPT09IEtleXMuQXJyb3dMZWZ0O1xuICB9XG5cbiAgcHJpdmF0ZSBpc0Fycm93UmlnaHRLZXlFdmVudChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIHJldHVybiBub3JtYWxpemVLZXkoZXZlbnQua2V5KSA9PT0gS2V5cy5BcnJvd1JpZ2h0O1xuICB9XG59XG4iXX0=