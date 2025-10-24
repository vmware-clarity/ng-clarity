/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChildren, EventEmitter, HostListener, Input, Output, } from '@angular/core';
import { Keys } from '../../enums/keys.enum';
import { ClrFocusDirection } from './enums/focus-direction.enum';
import { ClrKeyFocusItem } from './key-focus-item';
import { normalizeKey, preventArrowKeyScroll } from './util';
import * as i0 from "@angular/core";
export class ClrKeyFocus {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.direction = ClrFocusDirection.VERTICAL;
        this.focusOnLoad = false;
        this.subscriptions = [];
        this.focusChange = new EventEmitter();
        this._current = 0;
    }
    /**
     * Here we use `any` cause any other type require reworking all methods below and a lot of more ifs.
     * this method will only work with array with FocusableItems anyway so any other value will be ignored.
     */
    get focusableItems() {
        if (this._focusableItems) {
            return this._focusableItems;
        }
        else if (this.clrKeyFocusItems) {
            return this.clrKeyFocusItems.toArray();
        }
        return [];
    }
    set focusableItems(elements) {
        // We accept a list of focusable elements (HTMLElements or existing Directives) or auto query for clrKeyFocusItem
        // We accept a list reference in the cases where we cannot use ContentChildren to query
        // ContentChildren can be unavailable if content is projected outside the scope of the component (see tabs).
        if (Array.isArray(elements) && elements.length) {
            this._focusableItems = elements;
            this.initializeFocus();
        }
    }
    get nativeElement() {
        return this.elementRef.nativeElement;
    }
    get current() {
        return this._current;
    }
    set current(value) {
        if (this._current !== value) {
            this._current = value;
        }
    }
    get currentItem() {
        return this.focusableItems[this._current];
    }
    get currentItemElement() {
        return this.currentItem.nativeElement ? this.currentItem.nativeElement : this.currentItem;
    }
    ngAfterContentInit() {
        this.subscriptions.push(this.listenForItemUpdates());
        this.initializeFocus();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
    handleKeyboardEvent(event) {
        // Make sure event was originated on the current item's element
        if (this.currentItemElement !== event.target) {
            const position = this.getItemPosition(event.target);
            if (this.positionInRange(position)) {
                this.current = position;
            }
        }
        if (this.prevKeyPressed(event) && this.currentFocusIsNotFirstItem()) {
            this.moveTo(this.current - 1);
        }
        else if (this.nextKeyPressed(event) && this.currentFocusIsNotLastItem()) {
            this.moveTo(this.current + 1);
        }
        else if (event.code === Keys.Home) {
            this.moveTo(0);
        }
        else if (event.code === Keys.End) {
            this.moveTo(this.focusableItems.length - 1);
        }
        preventArrowKeyScroll(event);
    }
    setClickedItemCurrent(event) {
        const position = this.getItemPosition(event.target);
        if (position > -1) {
            this.moveTo(position);
        }
    }
    focusCurrent() {
        this.currentItem.focus();
        this.focusChange.next(this._current);
    }
    moveTo(position) {
        if (this.positionInRange(position)) {
            this.current = position;
            this.focusCurrent();
        }
    }
    positionInRange(position) {
        return position >= 0 && position < this.focusableItems.length;
    }
    currentFocusIsNotFirstItem() {
        return this._current - 1 >= 0;
    }
    currentFocusIsNotLastItem() {
        return this._current + 1 < this.focusableItems.length;
    }
    initializeFocus() {
        if (this.focusableItems && this.focusableItems.length) {
            // It is possible that the focus was on an element, whose index is no longer available.
            // This can happen when some of the focusable elements are being removed.
            // In such cases, the new focus is initialized on the last focusable element.
            if (this._current >= this.focusableItems.length) {
                this._current = this.focusableItems.length - 1;
            }
            if (this.focusOnLoad) {
                this.currentItem.focus();
                this.focusChange.emit();
            }
        }
    }
    nextKeyPressed(event) {
        const key = normalizeKey(event.key);
        switch (this.direction) {
            case ClrFocusDirection.VERTICAL:
                return key === Keys.ArrowDown;
            case ClrFocusDirection.HORIZONTAL:
                return key === Keys.ArrowRight;
            case ClrFocusDirection.BOTH:
                return key === Keys.ArrowDown || key === Keys.ArrowRight;
            default:
                return false;
        }
    }
    prevKeyPressed(event) {
        const key = normalizeKey(event.key);
        switch (this.direction) {
            case ClrFocusDirection.VERTICAL:
                return key === Keys.ArrowUp;
            case ClrFocusDirection.HORIZONTAL:
                return key === Keys.ArrowLeft;
            case ClrFocusDirection.BOTH:
                return key === Keys.ArrowUp || key === Keys.ArrowLeft;
            default:
                return false;
        }
    }
    getItemPosition(item) {
        if (this._focusableItems) {
            return this.focusableItems.indexOf(item);
        }
        else {
            return this.focusableItems.map(_item => _item.nativeElement).indexOf(item);
        }
    }
    listenForItemUpdates() {
        return this.clrKeyFocusItems.changes.subscribe(() => {
            this.initializeFocus();
        });
    }
}
ClrKeyFocus.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrKeyFocus, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
ClrKeyFocus.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrKeyFocus, selector: "[clrKeyFocus]", inputs: { direction: ["clrDirection", "direction"], focusOnLoad: ["clrFocusOnLoad", "focusOnLoad"], focusableItems: ["clrKeyFocus", "focusableItems"] }, outputs: { focusChange: "clrFocusChange" }, host: { listeners: { "keydown": "handleKeyboardEvent($event)", "click": "setClickedItemCurrent($event)" } }, queries: [{ propertyName: "clrKeyFocusItems", predicate: ClrKeyFocusItem, descendants: true }], ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrKeyFocus, decorators: [{
            type: Component,
            args: [{
                    selector: '[clrKeyFocus]',
                    template: '<ng-content></ng-content>',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { direction: [{
                type: Input,
                args: ['clrDirection']
            }], focusOnLoad: [{
                type: Input,
                args: ['clrFocusOnLoad']
            }], clrKeyFocusItems: [{
                type: ContentChildren,
                args: [ClrKeyFocusItem, { descendants: true }]
            }], focusChange: [{
                type: Output,
                args: ['clrFocusChange']
            }], focusableItems: [{
                type: Input,
                args: ['clrKeyFocus']
            }], handleKeyboardEvent: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }], setClickedItemCurrent: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LWZvY3VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvZm9jdXMva2V5LWZvY3VzL2tleS1mb2N1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsZUFBZSxFQUVmLFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFFakUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxRQUFRLENBQUM7O0FBTTdELE1BQU0sT0FBTyxXQUFXO0lBYXRCLFlBQW9CLFVBQW1DO1FBQW5DLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBWmhDLGNBQVMsR0FBK0IsaUJBQWlCLENBQUMsUUFBUSxDQUFDO1FBQ2pFLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBSW5DLGtCQUFhLEdBQW1CLEVBQUUsQ0FBQztRQUVYLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUVuRSxhQUFRLEdBQUcsQ0FBQyxDQUFDO0lBR3FDLENBQUM7SUFFM0Q7OztPQUdHO0lBQ0gsSUFDSSxjQUFjO1FBQ2hCLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN4QixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7U0FDN0I7YUFBTSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUNoQyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN4QztRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUNE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O1FBQ3ZDLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN4QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFDO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1RTtJQUNILENBQUM7SUFFTyxvQkFBb0I7UUFDMUIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDbEQsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7d0dBdExVLFdBQVc7NEZBQVgsV0FBVyx3WUFJTCxlQUFlLGdEQU50QiwyQkFBMkI7MkZBRTFCLFdBQVc7a0JBSnZCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLFFBQVEsRUFBRSwyQkFBMkI7aUJBQ3RDO2lHQUV3QixTQUFTO3NCQUEvQixLQUFLO3VCQUFDLGNBQWM7Z0JBQ0ksV0FBVztzQkFBbkMsS0FBSzt1QkFBQyxnQkFBZ0I7Z0JBRTRDLGdCQUFnQjtzQkFBbEYsZUFBZTt1QkFBQyxlQUFlLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFO2dCQUlyQixXQUFXO3NCQUE1QyxNQUFNO3VCQUFDLGdCQUFnQjtnQkFZcEIsY0FBYztzQkFEakIsS0FBSzt1QkFBQyxhQUFhO2dCQWtEcEIsbUJBQW1CO3NCQURsQixZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkF3Qm5DLHFCQUFxQjtzQkFEcEIsWUFBWTt1QkFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBLZXlzIH0gZnJvbSAnLi4vLi4vZW51bXMva2V5cy5lbnVtJztcbmltcG9ydCB7IENsckZvY3VzRGlyZWN0aW9uIH0gZnJvbSAnLi9lbnVtcy9mb2N1cy1kaXJlY3Rpb24uZW51bSc7XG5pbXBvcnQgeyBGb2N1c2FibGVJdGVtIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IENscktleUZvY3VzSXRlbSB9IGZyb20gJy4va2V5LWZvY3VzLWl0ZW0nO1xuaW1wb3J0IHsgbm9ybWFsaXplS2V5LCBwcmV2ZW50QXJyb3dLZXlTY3JvbGwgfSBmcm9tICcuL3V0aWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbY2xyS2V5Rm9jdXNdJyxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+Jyxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyS2V5Rm9jdXMge1xuICBASW5wdXQoJ2NsckRpcmVjdGlvbicpIGRpcmVjdGlvbjogQ2xyRm9jdXNEaXJlY3Rpb24gfCBzdHJpbmcgPSBDbHJGb2N1c0RpcmVjdGlvbi5WRVJUSUNBTDtcbiAgQElucHV0KCdjbHJGb2N1c09uTG9hZCcpIGZvY3VzT25Mb2FkID0gZmFsc2U7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihDbHJLZXlGb2N1c0l0ZW0sIHsgZGVzY2VuZGFudHM6IHRydWUgfSkgcHJvdGVjdGVkIGNscktleUZvY3VzSXRlbXM6IFF1ZXJ5TGlzdDxDbHJLZXlGb2N1c0l0ZW0+O1xuXG4gIHByb3RlY3RlZCBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIEBPdXRwdXQoJ2NsckZvY3VzQ2hhbmdlJykgcHJpdmF0ZSBmb2N1c0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIHByaXZhdGUgX2N1cnJlbnQgPSAwO1xuICBwcml2YXRlIF9mb2N1c2FibGVJdGVtczogQXJyYXk8Rm9jdXNhYmxlSXRlbT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge31cblxuICAvKipcbiAgICogSGVyZSB3ZSB1c2UgYGFueWAgY2F1c2UgYW55IG90aGVyIHR5cGUgcmVxdWlyZSByZXdvcmtpbmcgYWxsIG1ldGhvZHMgYmVsb3cgYW5kIGEgbG90IG9mIG1vcmUgaWZzLlxuICAgKiB0aGlzIG1ldGhvZCB3aWxsIG9ubHkgd29yayB3aXRoIGFycmF5IHdpdGggRm9jdXNhYmxlSXRlbXMgYW55d2F5IHNvIGFueSBvdGhlciB2YWx1ZSB3aWxsIGJlIGlnbm9yZWQuXG4gICAqL1xuICBASW5wdXQoJ2NscktleUZvY3VzJylcbiAgZ2V0IGZvY3VzYWJsZUl0ZW1zKCkge1xuICAgIGlmICh0aGlzLl9mb2N1c2FibGVJdGVtcykge1xuICAgICAgcmV0dXJuIHRoaXMuX2ZvY3VzYWJsZUl0ZW1zO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jbHJLZXlGb2N1c0l0ZW1zKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbHJLZXlGb2N1c0l0ZW1zLnRvQXJyYXkoKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHNldCBmb2N1c2FibGVJdGVtcyhlbGVtZW50czogQXJyYXk8Rm9jdXNhYmxlSXRlbT4gfCBhbnkpIHtcbiAgICAvLyBXZSBhY2NlcHQgYSBsaXN0IG9mIGZvY3VzYWJsZSBlbGVtZW50cyAoSFRNTEVsZW1lbnRzIG9yIGV4aXN0aW5nIERpcmVjdGl2ZXMpIG9yIGF1dG8gcXVlcnkgZm9yIGNscktleUZvY3VzSXRlbVxuICAgIC8vIFdlIGFjY2VwdCBhIGxpc3QgcmVmZXJlbmNlIGluIHRoZSBjYXNlcyB3aGVyZSB3ZSBjYW5ub3QgdXNlIENvbnRlbnRDaGlsZHJlbiB0byBxdWVyeVxuICAgIC8vIENvbnRlbnRDaGlsZHJlbiBjYW4gYmUgdW5hdmFpbGFibGUgaWYgY29udGVudCBpcyBwcm9qZWN0ZWQgb3V0c2lkZSB0aGUgc2NvcGUgb2YgdGhlIGNvbXBvbmVudCAoc2VlIHRhYnMpLlxuICAgIGlmIChBcnJheS5pc0FycmF5KGVsZW1lbnRzKSAmJiBlbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2ZvY3VzYWJsZUl0ZW1zID0gZWxlbWVudHMgYXMgQXJyYXk8Rm9jdXNhYmxlSXRlbT47XG4gICAgICB0aGlzLmluaXRpYWxpemVGb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBuYXRpdmVFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBnZXQgY3VycmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudDtcbiAgfVxuICBzZXQgY3VycmVudCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuX2N1cnJlbnQgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9jdXJyZW50ID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGN1cnJlbnRJdGVtKCkge1xuICAgIHJldHVybiB0aGlzLmZvY3VzYWJsZUl0ZW1zW3RoaXMuX2N1cnJlbnRdO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRJdGVtRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudEl0ZW0ubmF0aXZlRWxlbWVudCA/IHRoaXMuY3VycmVudEl0ZW0ubmF0aXZlRWxlbWVudCA6ICh0aGlzLmN1cnJlbnRJdGVtIGFzIEhUTUxFbGVtZW50KTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaCh0aGlzLmxpc3RlbkZvckl0ZW1VcGRhdGVzKCkpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUZvY3VzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzID0+IHMudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlS2V5Ym9hcmRFdmVudChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIC8vIE1ha2Ugc3VyZSBldmVudCB3YXMgb3JpZ2luYXRlZCBvbiB0aGUgY3VycmVudCBpdGVtJ3MgZWxlbWVudFxuICAgIGlmICh0aGlzLmN1cnJlbnRJdGVtRWxlbWVudCAhPT0gZXZlbnQudGFyZ2V0KSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuZ2V0SXRlbVBvc2l0aW9uKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCk7XG4gICAgICBpZiAodGhpcy5wb3NpdGlvbkluUmFuZ2UocG9zaXRpb24pKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IHBvc2l0aW9uO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnByZXZLZXlQcmVzc2VkKGV2ZW50KSAmJiB0aGlzLmN1cnJlbnRGb2N1c0lzTm90Rmlyc3RJdGVtKCkpIHtcbiAgICAgIHRoaXMubW92ZVRvKHRoaXMuY3VycmVudCAtIDEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5uZXh0S2V5UHJlc3NlZChldmVudCkgJiYgdGhpcy5jdXJyZW50Rm9jdXNJc05vdExhc3RJdGVtKCkpIHtcbiAgICAgIHRoaXMubW92ZVRvKHRoaXMuY3VycmVudCArIDEpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQuY29kZSA9PT0gS2V5cy5Ib21lKSB7XG4gICAgICB0aGlzLm1vdmVUbygwKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LmNvZGUgPT09IEtleXMuRW5kKSB7XG4gICAgICB0aGlzLm1vdmVUbyh0aGlzLmZvY3VzYWJsZUl0ZW1zLmxlbmd0aCAtIDEpO1xuICAgIH1cblxuICAgIHByZXZlbnRBcnJvd0tleVNjcm9sbChldmVudCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIHNldENsaWNrZWRJdGVtQ3VycmVudChldmVudDogYW55KSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmdldEl0ZW1Qb3NpdGlvbihldmVudC50YXJnZXQpO1xuXG4gICAgaWYgKHBvc2l0aW9uID4gLTEpIHtcbiAgICAgIHRoaXMubW92ZVRvKHBvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmb2N1c0N1cnJlbnQoKSB7XG4gICAgdGhpcy5jdXJyZW50SXRlbS5mb2N1cygpO1xuICAgIHRoaXMuZm9jdXNDaGFuZ2UubmV4dCh0aGlzLl9jdXJyZW50KTtcbiAgfVxuXG4gIG1vdmVUbyhwb3NpdGlvbjogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMucG9zaXRpb25JblJhbmdlKHBvc2l0aW9uKSkge1xuICAgICAgdGhpcy5jdXJyZW50ID0gcG9zaXRpb247XG4gICAgICB0aGlzLmZvY3VzQ3VycmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBwb3NpdGlvbkluUmFuZ2UocG9zaXRpb246IG51bWJlcikge1xuICAgIHJldHVybiBwb3NpdGlvbiA+PSAwICYmIHBvc2l0aW9uIDwgdGhpcy5mb2N1c2FibGVJdGVtcy5sZW5ndGg7XG4gIH1cblxuICBwcm90ZWN0ZWQgY3VycmVudEZvY3VzSXNOb3RGaXJzdEl0ZW0oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnQgLSAxID49IDA7XG4gIH1cblxuICBwcm90ZWN0ZWQgY3VycmVudEZvY3VzSXNOb3RMYXN0SXRlbSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudCArIDEgPCB0aGlzLmZvY3VzYWJsZUl0ZW1zLmxlbmd0aDtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0aWFsaXplRm9jdXMoKSB7XG4gICAgaWYgKHRoaXMuZm9jdXNhYmxlSXRlbXMgJiYgdGhpcy5mb2N1c2FibGVJdGVtcy5sZW5ndGgpIHtcbiAgICAgIC8vIEl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIGZvY3VzIHdhcyBvbiBhbiBlbGVtZW50LCB3aG9zZSBpbmRleCBpcyBubyBsb25nZXIgYXZhaWxhYmxlLlxuICAgICAgLy8gVGhpcyBjYW4gaGFwcGVuIHdoZW4gc29tZSBvZiB0aGUgZm9jdXNhYmxlIGVsZW1lbnRzIGFyZSBiZWluZyByZW1vdmVkLlxuICAgICAgLy8gSW4gc3VjaCBjYXNlcywgdGhlIG5ldyBmb2N1cyBpcyBpbml0aWFsaXplZCBvbiB0aGUgbGFzdCBmb2N1c2FibGUgZWxlbWVudC5cbiAgICAgIGlmICh0aGlzLl9jdXJyZW50ID49IHRoaXMuZm9jdXNhYmxlSXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnQgPSB0aGlzLmZvY3VzYWJsZUl0ZW1zLmxlbmd0aCAtIDE7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmZvY3VzT25Mb2FkKSB7XG4gICAgICAgIHRoaXMuY3VycmVudEl0ZW0uZm9jdXMoKTtcbiAgICAgICAgdGhpcy5mb2N1c0NoYW5nZS5lbWl0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIG5leHRLZXlQcmVzc2VkKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3Qga2V5ID0gbm9ybWFsaXplS2V5KGV2ZW50LmtleSk7XG5cbiAgICBzd2l0Y2ggKHRoaXMuZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIENsckZvY3VzRGlyZWN0aW9uLlZFUlRJQ0FMOlxuICAgICAgICByZXR1cm4ga2V5ID09PSBLZXlzLkFycm93RG93bjtcbiAgICAgIGNhc2UgQ2xyRm9jdXNEaXJlY3Rpb24uSE9SSVpPTlRBTDpcbiAgICAgICAgcmV0dXJuIGtleSA9PT0gS2V5cy5BcnJvd1JpZ2h0O1xuICAgICAgY2FzZSBDbHJGb2N1c0RpcmVjdGlvbi5CT1RIOlxuICAgICAgICByZXR1cm4ga2V5ID09PSBLZXlzLkFycm93RG93biB8fCBrZXkgPT09IEtleXMuQXJyb3dSaWdodDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgcHJldktleVByZXNzZWQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBrZXkgPSBub3JtYWxpemVLZXkoZXZlbnQua2V5KTtcblxuICAgIHN3aXRjaCAodGhpcy5kaXJlY3Rpb24pIHtcbiAgICAgIGNhc2UgQ2xyRm9jdXNEaXJlY3Rpb24uVkVSVElDQUw6XG4gICAgICAgIHJldHVybiBrZXkgPT09IEtleXMuQXJyb3dVcDtcbiAgICAgIGNhc2UgQ2xyRm9jdXNEaXJlY3Rpb24uSE9SSVpPTlRBTDpcbiAgICAgICAgcmV0dXJuIGtleSA9PT0gS2V5cy5BcnJvd0xlZnQ7XG4gICAgICBjYXNlIENsckZvY3VzRGlyZWN0aW9uLkJPVEg6XG4gICAgICAgIHJldHVybiBrZXkgPT09IEtleXMuQXJyb3dVcCB8fCBrZXkgPT09IEtleXMuQXJyb3dMZWZ0O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0SXRlbVBvc2l0aW9uKGl0ZW06IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuX2ZvY3VzYWJsZUl0ZW1zKSB7XG4gICAgICByZXR1cm4gdGhpcy5mb2N1c2FibGVJdGVtcy5pbmRleE9mKGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5mb2N1c2FibGVJdGVtcy5tYXAoX2l0ZW0gPT4gX2l0ZW0ubmF0aXZlRWxlbWVudCkuaW5kZXhPZihpdGVtKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxpc3RlbkZvckl0ZW1VcGRhdGVzKCkge1xuICAgIHJldHVybiB0aGlzLmNscktleUZvY3VzSXRlbXMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5pbml0aWFsaXplRm9jdXMoKTtcbiAgICB9KTtcbiAgfVxufVxuIl19