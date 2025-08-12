/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild, } from '@angular/core';
import { ClrModal } from './modal';
import * as i0 from "@angular/core";
import * as i1 from "./modal-configuration.service";
import * as i2 from "../utils";
import * as i3 from "@angular/common";
import * as i4 from "../icon/icon";
import * as i5 from "./modal";
import * as i6 from "./modal-body";
export class ClrSidePanel {
    constructor(element, configuration, commonStrings) {
        this.element = element;
        this.configuration = configuration;
        this.commonStrings = commonStrings;
        this.openChange = new EventEmitter(false);
        this.skipAnimation = false;
        this.staticBackdrop = false;
        this.closable = true;
        this.preventClose = false;
        this.altClose = new EventEmitter(false);
        this._pinnable = false;
        this._pinned = false;
        this._position = 'right';
        this.__open = false;
        this._size = 'md';
    }
    get _open() {
        return this.__open;
    }
    set _open(open) {
        if (open !== this.__open) {
            this.__open = open;
            if (this.pinned) {
                this.updateModalState();
            }
        }
    }
    get size() {
        return this._size;
    }
    set size(value) {
        if (!value) {
            value = 'md';
        }
        if (this._size !== value) {
            this._size = value;
            if (this.pinned) {
                this.updateModalState();
            }
        }
    }
    get position() {
        return this._position;
    }
    set position(position) {
        if (position && position !== this._position) {
            this._position = position;
            if (this._position === 'right') {
                this.configuration.fadeMove = 'fadeLeft';
            }
            else if (this._position === 'bottom') {
                this.configuration.fadeMove = 'fadeUp';
            }
        }
    }
    get pinned() {
        return this._pinned;
    }
    set pinned(pinned) {
        this._pinned = pinned;
        if (this.modal) {
            this.updateModalState();
        }
    }
    get clrSidePanelBackdrop() {
        return this.configuration.backdrop;
    }
    set clrSidePanelBackdrop(backdrop) {
        if (backdrop !== undefined) {
            this.configuration.backdrop = backdrop;
        }
    }
    get clrSidePanelPinnable() {
        return this._pinnable;
    }
    set clrSidePanelPinnable(pinnable) {
        this._pinnable = pinnable;
    }
    get modal() {
        return this._modal;
    }
    set modal(modal) {
        this._modal = modal;
        this.originalStopClose = this.modal.stopClose;
        this.updateModalState();
    }
    get hostElement() {
        return this.element.nativeElement.closest('.clr-modal-host') || document.body;
    }
    get bottomPositionCssClass() {
        return this.position === 'bottom';
    }
    ngOnInit() {
        this.configuration.fadeMove = 'fadeLeft';
        if (this.position === 'bottom') {
            this.configuration.fadeMove = 'fadeUp';
        }
    }
    ngOnDestroy() {
        this.cleanupPinnedClasses();
    }
    handleModalOpen(open) {
        if (open) {
            this.updateModalState();
        }
        else {
            this.cleanupPinnedClasses();
        }
        this.openChange.emit(open);
    }
    open() {
        this.modal.open();
    }
    close() {
        this.modal.close();
    }
    togglePinned() {
        this.pinned = !this.pinned;
    }
    documentClick(event) {
        if (!this.element.nativeElement.contains(event.target) &&
            this.modal._open &&
            !this.configuration.backdrop) {
            this.modal.close();
        }
    }
    updateModalState() {
        if (!this.modal) {
            return;
        }
        if (this.pinned) {
            this.modal.stopClose = true;
            this.updatePinnedClasses();
        }
        else {
            this.modal.stopClose = this.originalStopClose;
            this.cleanupPinnedClasses();
        }
    }
    cleanupPinnedClasses() {
        [this.hostElement, document.body].forEach(host => {
            host.classList.forEach(className => {
                if (className.startsWith('clr-side-panel-pinned-')) {
                    host.classList.remove(className);
                }
            });
        });
    }
    updatePinnedClasses() {
        this.cleanupPinnedClasses();
        this.hostElement.classList.add(`clr-side-panel-pinned-${this.position}-${this.size}`);
    }
}
ClrSidePanel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSidePanel, deps: [{ token: i0.ElementRef }, { token: i1.ClrModalConfigurationService }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrSidePanel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrSidePanel, selector: "clr-side-panel", inputs: { closeButtonAriaLabel: ["clrSidePanelCloseButtonAriaLabel", "closeButtonAriaLabel"], skipAnimation: ["clrSidePanelSkipAnimation", "skipAnimation"], labelledById: ["clrSidePanelLabelledById", "labelledById"], staticBackdrop: ["clrSidePanelStaticBackdrop", "staticBackdrop"], closable: ["clrSidePanelClosable", "closable"], preventClose: ["clrSidePanelPreventClose", "preventClose"], _open: ["clrSidePanelOpen", "_open"], size: ["clrSidePanelSize", "size"], position: ["clrSidePanelPosition", "position"], pinned: ["clrSidePanelPinned", "pinned"], clrSidePanelBackdrop: "clrSidePanelBackdrop", clrSidePanelPinnable: "clrSidePanelPinnable" }, outputs: { openChange: "clrSidePanelOpenChange", altClose: "clrSidePanelAlternateClose" }, host: { listeners: { "document:pointerup": "documentClick($event)" }, properties: { "class.side-panel": "true", "class.side-panel-bottom": "this.bottomPositionCssClass" } }, viewQueries: [{ propertyName: "modal", first: true, predicate: ClrModal, descendants: true }], ngImport: i0, template: "<clr-modal\n  [clrModalOpen]=\"_open\"\n  (clrModalOpenChange)=\"handleModalOpen($event)\"\n  [clrModalCloseButtonAriaLabel]=\"closeButtonAriaLabel\"\n  [clrModalSize]=\"size\"\n  [clrModalSkipAnimation]=\"skipAnimation\"\n  [clrModalStaticBackdrop]=\"staticBackdrop\"\n  [clrModalLabelledById]=\"labelledById\"\n  [clrModalPreventClose]=\"preventClose\"\n  [clrModalClosable]=\"closable\"\n  (clrModalAlternateClose)=\"altClose.emit($event)\"\n  [clrModalOverrideScrollService]=\"true\"\n>\n  <button\n    type=\"button\"\n    [attr.aria-label]=\"commonStrings.keys.sidePanelPin\"\n    class=\"leading-button pinnable\"\n    *ngIf=\"clrSidePanelPinnable\"\n    (click)=\"togglePinned()\"\n  >\n    <cds-icon [attr.shape]=\"pinned ? 'unpin' : 'pin'\"></cds-icon>\n  </button>\n  <div class=\"modal-title\"><ng-content select=\".side-panel-title\"></ng-content></div>\n  <div class=\"modal-body\"><ng-content select=\".side-panel-body\"></ng-content></div>\n  <div class=\"modal-footer\"><ng-content select=\".side-panel-footer\"></ng-content></div>\n</clr-modal>\n", dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i5.ClrModal, selector: "clr-modal", inputs: ["clrModalOpen", "clrModalClosable", "clrModalCloseButtonAriaLabel", "clrModalSize", "clrModalStaticBackdrop", "clrModalSkipAnimation", "clrModalPreventClose", "clrModalLabelledById", "clrModalOverrideScrollService"], outputs: ["clrModalOpenChange", "clrModalAlternateClose"] }, { kind: "directive", type: i6.ClrModalBody, selector: ".modal-body" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSidePanel, decorators: [{
            type: Component,
            args: [{ selector: 'clr-side-panel', host: {
                        '[class.side-panel]': 'true',
                    }, template: "<clr-modal\n  [clrModalOpen]=\"_open\"\n  (clrModalOpenChange)=\"handleModalOpen($event)\"\n  [clrModalCloseButtonAriaLabel]=\"closeButtonAriaLabel\"\n  [clrModalSize]=\"size\"\n  [clrModalSkipAnimation]=\"skipAnimation\"\n  [clrModalStaticBackdrop]=\"staticBackdrop\"\n  [clrModalLabelledById]=\"labelledById\"\n  [clrModalPreventClose]=\"preventClose\"\n  [clrModalClosable]=\"closable\"\n  (clrModalAlternateClose)=\"altClose.emit($event)\"\n  [clrModalOverrideScrollService]=\"true\"\n>\n  <button\n    type=\"button\"\n    [attr.aria-label]=\"commonStrings.keys.sidePanelPin\"\n    class=\"leading-button pinnable\"\n    *ngIf=\"clrSidePanelPinnable\"\n    (click)=\"togglePinned()\"\n  >\n    <cds-icon [attr.shape]=\"pinned ? 'unpin' : 'pin'\"></cds-icon>\n  </button>\n  <div class=\"modal-title\"><ng-content select=\".side-panel-title\"></ng-content></div>\n  <div class=\"modal-body\"><ng-content select=\".side-panel-body\"></ng-content></div>\n  <div class=\"modal-footer\"><ng-content select=\".side-panel-footer\"></ng-content></div>\n</clr-modal>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.ClrModalConfigurationService }, { type: i2.ClrCommonStringsService }]; }, propDecorators: { openChange: [{
                type: Output,
                args: ['clrSidePanelOpenChange']
            }], closeButtonAriaLabel: [{
                type: Input,
                args: ['clrSidePanelCloseButtonAriaLabel']
            }], skipAnimation: [{
                type: Input,
                args: ['clrSidePanelSkipAnimation']
            }], labelledById: [{
                type: Input,
                args: ['clrSidePanelLabelledById']
            }], staticBackdrop: [{
                type: Input,
                args: ['clrSidePanelStaticBackdrop']
            }], closable: [{
                type: Input,
                args: ['clrSidePanelClosable']
            }], preventClose: [{
                type: Input,
                args: ['clrSidePanelPreventClose']
            }], altClose: [{
                type: Output,
                args: ['clrSidePanelAlternateClose']
            }], _open: [{
                type: Input,
                args: ['clrSidePanelOpen']
            }], size: [{
                type: Input,
                args: ['clrSidePanelSize']
            }], position: [{
                type: Input,
                args: ['clrSidePanelPosition']
            }], pinned: [{
                type: Input,
                args: ['clrSidePanelPinned']
            }], clrSidePanelBackdrop: [{
                type: Input
            }], clrSidePanelPinnable: [{
                type: Input
            }], modal: [{
                type: ViewChild,
                args: [ClrModal]
            }], bottomPositionCssClass: [{
                type: HostBinding,
                args: ['class.side-panel-bottom']
            }], documentClick: [{
                type: HostListener,
                args: ['document:pointerup', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZS1wYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL21vZGFsL3NpZGUtcGFuZWwudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9tb2RhbC9zaWRlLXBhbmVsLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUVULFlBQVksRUFDWixXQUFXLEVBQ1gsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7Ozs7Ozs7O0FBVW5DLE1BQU0sT0FBTyxZQUFZO0lBbUJ2QixZQUNVLE9BQWdDLEVBQ2hDLGFBQTJDLEVBQzVDLGFBQXNDO1FBRnJDLFlBQU8sR0FBUCxPQUFPLENBQXlCO1FBQ2hDLGtCQUFhLEdBQWIsYUFBYSxDQUE4QjtRQUM1QyxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFyQmIsZUFBVSxHQUFHLElBQUksWUFBWSxDQUFVLEtBQUssQ0FBQyxDQUFDO1FBRTVDLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBRXJCLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzdCLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFDWixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNsQixhQUFRLEdBQUcsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7UUFFMUUsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBRWhCLGNBQVMsR0FBRyxPQUFPLENBQUM7UUFFcEIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUVmLFVBQUssR0FBRyxJQUFJLENBQUM7SUFNbEIsQ0FBQztJQUVKLElBQ0ksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFD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O3VCQUFDLDBCQUEwQjtnQkFDSSxjQUFjO3NCQUFsRCxLQUFLO3VCQUFDLDRCQUE0QjtnQkFDSixRQUFRO3NCQUF0QyxLQUFLO3VCQUFDLHNCQUFzQjtnQkFDTSxZQUFZO3NCQUE5QyxLQUFLO3VCQUFDLDBCQUEwQjtnQkFDSyxRQUFRO3NCQUE3QyxNQUFNO3VCQUFDLDRCQUE0QjtnQkFrQmhDLEtBQUs7c0JBRFIsS0FBSzt1QkFBQyxrQkFBa0I7Z0JBY3JCLElBQUk7c0JBRFAsS0FBSzt1QkFBQyxrQkFBa0I7Z0JBa0JyQixRQUFRO3NCQURYLEtBQUs7dUJBQUMsc0JBQXNCO2dCQWlCekIsTUFBTTtzQkFEVCxLQUFLO3VCQUFDLG9CQUFvQjtnQkFhdkIsb0JBQW9CO3NCQUR2QixLQUFLO2dCQVlGLG9CQUFvQjtzQkFEdkIsS0FBSztnQkFVTSxLQUFLO3NCQURoQixTQUFTO3VCQUFDLFFBQVE7Z0JBZ0JQLHNCQUFzQjtzQkFEakMsV0FBVzt1QkFBQyx5QkFBeUI7Z0JBc0M5QixhQUFhO3NCQURwQixZQUFZO3VCQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdEJpbmRpbmcsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgQ2xyTW9kYWwgfSBmcm9tICcuL21vZGFsJztcbmltcG9ydCB7IENsck1vZGFsQ29uZmlndXJhdGlvblNlcnZpY2UgfSBmcm9tICcuL21vZGFsLWNvbmZpZ3VyYXRpb24uc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1zaWRlLXBhbmVsJyxcbiAgdGVtcGxhdGVVcmw6ICdzaWRlLXBhbmVsLmh0bWwnLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5zaWRlLXBhbmVsXSc6ICd0cnVlJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyU2lkZVBhbmVsIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBAT3V0cHV0KCdjbHJTaWRlUGFuZWxPcGVuQ2hhbmdlJykgb3BlbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuICBASW5wdXQoJ2NsclNpZGVQYW5lbENsb3NlQnV0dG9uQXJpYUxhYmVsJykgY2xvc2VCdXR0b25BcmlhTGFiZWw6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCdjbHJTaWRlUGFuZWxTa2lwQW5pbWF0aW9uJykgc2tpcEFuaW1hdGlvbiA9IGZhbHNlO1xuICBASW5wdXQoJ2NsclNpZGVQYW5lbExhYmVsbGVkQnlJZCcpIGxhYmVsbGVkQnlJZDogc3RyaW5nO1xuICBASW5wdXQoJ2NsclNpZGVQYW5lbFN0YXRpY0JhY2tkcm9wJykgc3RhdGljQmFja2Ryb3AgPSBmYWxzZTtcbiAgQElucHV0KCdjbHJTaWRlUGFuZWxDbG9zYWJsZScpIGNsb3NhYmxlID0gdHJ1ZTtcbiAgQElucHV0KCdjbHJTaWRlUGFuZWxQcmV2ZW50Q2xvc2UnKSBwcmV2ZW50Q2xvc2UgPSBmYWxzZTtcbiAgQE91dHB1dCgnY2xyU2lkZVBhbmVsQWx0ZXJuYXRlQ2xvc2UnKSBhbHRDbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gIHByaXZhdGUgX3Bpbm5hYmxlID0gZmFsc2U7XG4gIHByaXZhdGUgX3Bpbm5lZCA9IGZhbHNlO1xuICBwcml2YXRlIG9yaWdpbmFsU3RvcENsb3NlOiBib29sZWFuO1xuICBwcml2YXRlIF9wb3NpdGlvbiA9ICdyaWdodCc7XG4gIHByaXZhdGUgX21vZGFsOiBDbHJNb2RhbDtcbiAgcHJpdmF0ZSBfX29wZW4gPSBmYWxzZTtcblxuICBwcml2YXRlIF9zaXplID0gJ21kJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgY29uZmlndXJhdGlvbjogQ2xyTW9kYWxDb25maWd1cmF0aW9uU2VydmljZSxcbiAgICBwdWJsaWMgY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2VcbiAgKSB7fVxuXG4gIEBJbnB1dCgnY2xyU2lkZVBhbmVsT3BlbicpXG4gIGdldCBfb3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fX29wZW47XG4gIH1cbiAgc2V0IF9vcGVuKG9wZW46IGJvb2xlYW4pIHtcbiAgICBpZiAob3BlbiAhPT0gdGhpcy5fX29wZW4pIHtcbiAgICAgIHRoaXMuX19vcGVuID0gb3BlbjtcbiAgICAgIGlmICh0aGlzLnBpbm5lZCkge1xuICAgICAgICB0aGlzLnVwZGF0ZU1vZGFsU3RhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2NsclNpZGVQYW5lbFNpemUnKVxuICBnZXQgc2l6ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9zaXplO1xuICB9XG5cbiAgc2V0IHNpemUodmFsdWU6IHN0cmluZykge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHZhbHVlID0gJ21kJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NpemUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9zaXplID0gdmFsdWU7XG4gICAgICBpZiAodGhpcy5waW5uZWQpIHtcbiAgICAgICAgdGhpcy51cGRhdGVNb2RhbFN0YXRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdjbHJTaWRlUGFuZWxQb3NpdGlvbicpXG4gIGdldCBwb3NpdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcbiAgfVxuXG4gIHNldCBwb3NpdGlvbihwb3NpdGlvbjogc3RyaW5nKSB7XG4gICAgaWYgKHBvc2l0aW9uICYmIHBvc2l0aW9uICE9PSB0aGlzLl9wb3NpdGlvbikge1xuICAgICAgdGhpcy5fcG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgIGlmICh0aGlzLl9wb3NpdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb24uZmFkZU1vdmUgPSAnZmFkZUxlZnQnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9wb3NpdGlvbiA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uLmZhZGVNb3ZlID0gJ2ZhZGVVcCc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdjbHJTaWRlUGFuZWxQaW5uZWQnKVxuICBnZXQgcGlubmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9waW5uZWQ7XG4gIH1cblxuICBzZXQgcGlubmVkKHBpbm5lZDogYm9vbGVhbikge1xuICAgIHRoaXMuX3Bpbm5lZCA9IHBpbm5lZDtcbiAgICBpZiAodGhpcy5tb2RhbCkge1xuICAgICAgdGhpcy51cGRhdGVNb2RhbFN0YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGNsclNpZGVQYW5lbEJhY2tkcm9wKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb24uYmFja2Ryb3A7XG4gIH1cblxuICBzZXQgY2xyU2lkZVBhbmVsQmFja2Ryb3AoYmFja2Ryb3A6IGJvb2xlYW4pIHtcbiAgICBpZiAoYmFja2Ryb3AgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5jb25maWd1cmF0aW9uLmJhY2tkcm9wID0gYmFja2Ryb3A7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGNsclNpZGVQYW5lbFBpbm5hYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9waW5uYWJsZTtcbiAgfVxuXG4gIHNldCBjbHJTaWRlUGFuZWxQaW5uYWJsZShwaW5uYWJsZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3Bpbm5hYmxlID0gcGlubmFibGU7XG4gIH1cblxuICBAVmlld0NoaWxkKENsck1vZGFsKVxuICBwcml2YXRlIGdldCBtb2RhbCgpOiBDbHJNb2RhbCB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGFsO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXQgbW9kYWwobW9kYWw6IENsck1vZGFsKSB7XG4gICAgdGhpcy5fbW9kYWwgPSBtb2RhbDtcbiAgICB0aGlzLm9yaWdpbmFsU3RvcENsb3NlID0gdGhpcy5tb2RhbC5zdG9wQ2xvc2U7XG4gICAgdGhpcy51cGRhdGVNb2RhbFN0YXRlKCk7XG4gIH1cblxuICBwcml2YXRlIGdldCBob3N0RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuICh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCkuY2xvc2VzdCgnLmNsci1tb2RhbC1ob3N0JykgfHwgZG9jdW1lbnQuYm9keTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3Muc2lkZS1wYW5lbC1ib3R0b20nKVxuICBwcml2YXRlIGdldCBib3R0b21Qb3NpdGlvbkNzc0NsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uID09PSAnYm90dG9tJztcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY29uZmlndXJhdGlvbi5mYWRlTW92ZSA9ICdmYWRlTGVmdCc7XG4gICAgaWYgKHRoaXMucG9zaXRpb24gPT09ICdib3R0b20nKSB7XG4gICAgICB0aGlzLmNvbmZpZ3VyYXRpb24uZmFkZU1vdmUgPSAnZmFkZVVwJztcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmNsZWFudXBQaW5uZWRDbGFzc2VzKCk7XG4gIH1cblxuICBoYW5kbGVNb2RhbE9wZW4ob3BlbjogYm9vbGVhbikge1xuICAgIGlmIChvcGVuKSB7XG4gICAgICB0aGlzLnVwZGF0ZU1vZGFsU3RhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGVhbnVwUGlubmVkQ2xhc3NlcygpO1xuICAgIH1cbiAgICB0aGlzLm9wZW5DaGFuZ2UuZW1pdChvcGVuKTtcbiAgfVxuXG4gIG9wZW4oKSB7XG4gICAgdGhpcy5tb2RhbC5vcGVuKCk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICB0aGlzLm1vZGFsLmNsb3NlKCk7XG4gIH1cblxuICB0b2dnbGVQaW5uZWQoKSB7XG4gICAgdGhpcy5waW5uZWQgPSAhdGhpcy5waW5uZWQ7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDpwb2ludGVydXAnLCBbJyRldmVudCddKVxuICBwcml2YXRlIGRvY3VtZW50Q2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCBhcyBOb2RlKSAmJlxuICAgICAgdGhpcy5tb2RhbC5fb3BlbiAmJlxuICAgICAgIXRoaXMuY29uZmlndXJhdGlvbi5iYWNrZHJvcFxuICAgICkge1xuICAgICAgdGhpcy5tb2RhbC5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlTW9kYWxTdGF0ZSgpIHtcbiAgICBpZiAoIXRoaXMubW9kYWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMucGlubmVkKSB7XG4gICAgICB0aGlzLm1vZGFsLnN0b3BDbG9zZSA9IHRydWU7XG4gICAgICB0aGlzLnVwZGF0ZVBpbm5lZENsYXNzZXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tb2RhbC5zdG9wQ2xvc2UgPSB0aGlzLm9yaWdpbmFsU3RvcENsb3NlO1xuICAgICAgdGhpcy5jbGVhbnVwUGlubmVkQ2xhc3NlcygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2xlYW51cFBpbm5lZENsYXNzZXMoKSB7XG4gICAgW3RoaXMuaG9zdEVsZW1lbnQsIGRvY3VtZW50LmJvZHldLmZvckVhY2goaG9zdCA9PiB7XG4gICAgICBob3N0LmNsYXNzTGlzdC5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XG4gICAgICAgIGlmIChjbGFzc05hbWUuc3RhcnRzV2l0aCgnY2xyLXNpZGUtcGFuZWwtcGlubmVkLScpKSB7XG4gICAgICAgICAgaG9zdC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQaW5uZWRDbGFzc2VzKCkge1xuICAgIHRoaXMuY2xlYW51cFBpbm5lZENsYXNzZXMoKTtcbiAgICB0aGlzLmhvc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoYGNsci1zaWRlLXBhbmVsLXBpbm5lZC0ke3RoaXMucG9zaXRpb259LSR7dGhpcy5zaXplfWApO1xuICB9XG59XG4iLCI8Y2xyLW1vZGFsXG4gIFtjbHJNb2RhbE9wZW5dPVwiX29wZW5cIlxuICAoY2xyTW9kYWxPcGVuQ2hhbmdlKT1cImhhbmRsZU1vZGFsT3BlbigkZXZlbnQpXCJcbiAgW2Nsck1vZGFsQ2xvc2VCdXR0b25BcmlhTGFiZWxdPVwiY2xvc2VCdXR0b25BcmlhTGFiZWxcIlxuICBbY2xyTW9kYWxTaXplXT1cInNpemVcIlxuICBbY2xyTW9kYWxTa2lwQW5pbWF0aW9uXT1cInNraXBBbmltYXRpb25cIlxuICBbY2xyTW9kYWxTdGF0aWNCYWNrZHJvcF09XCJzdGF0aWNCYWNrZHJvcFwiXG4gIFtjbHJNb2RhbExhYmVsbGVkQnlJZF09XCJsYWJlbGxlZEJ5SWRcIlxuICBbY2xyTW9kYWxQcmV2ZW50Q2xvc2VdPVwicHJldmVudENsb3NlXCJcbiAgW2Nsck1vZGFsQ2xvc2FibGVdPVwiY2xvc2FibGVcIlxuICAoY2xyTW9kYWxBbHRlcm5hdGVDbG9zZSk9XCJhbHRDbG9zZS5lbWl0KCRldmVudClcIlxuICBbY2xyTW9kYWxPdmVycmlkZVNjcm9sbFNlcnZpY2VdPVwidHJ1ZVwiXG4+XG4gIDxidXR0b25cbiAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5zaWRlUGFuZWxQaW5cIlxuICAgIGNsYXNzPVwibGVhZGluZy1idXR0b24gcGlubmFibGVcIlxuICAgICpuZ0lmPVwiY2xyU2lkZVBhbmVsUGlubmFibGVcIlxuICAgIChjbGljayk9XCJ0b2dnbGVQaW5uZWQoKVwiXG4gID5cbiAgICA8Y2RzLWljb24gW2F0dHIuc2hhcGVdPVwicGlubmVkID8gJ3VucGluJyA6ICdwaW4nXCI+PC9jZHMtaWNvbj5cbiAgPC9idXR0b24+XG4gIDxkaXYgY2xhc3M9XCJtb2RhbC10aXRsZVwiPjxuZy1jb250ZW50IHNlbGVjdD1cIi5zaWRlLXBhbmVsLXRpdGxlXCI+PC9uZy1jb250ZW50PjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPjxuZy1jb250ZW50IHNlbGVjdD1cIi5zaWRlLXBhbmVsLWJvZHlcIj48L25nLWNvbnRlbnQ+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj48bmctY29udGVudCBzZWxlY3Q9XCIuc2lkZS1wYW5lbC1mb290ZXJcIj48L25nLWNvbnRlbnQ+PC9kaXY+XG48L2Nsci1tb2RhbD5cbiJdfQ==