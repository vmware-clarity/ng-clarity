/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, EventEmitter, HostListener, Input, Output, ViewChild, } from '@angular/core';
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
        this._open = false;
        this.openChange = new EventEmitter(false);
        this.skipAnimation = false;
        this.staticBackdrop = false;
        this.preventClose = false;
        this.altClose = new EventEmitter(false);
        this._pinnable = false;
        this._pinned = false;
        this._size = 'md';
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
            if (this.clrSidePanelPinnable && this.pinned) {
                this.displayOverlapping();
                this.displaySideBySide();
            }
        }
    }
    get pinned() {
        return this._pinned;
    }
    set pinned(pinned) {
        if (this.clrSidePanelPinnable) {
            this._pinned = pinned;
            if (pinned) {
                this.originalStopClose = this.modal.stopClose;
                this.modal.stopClose = true;
                this.displaySideBySide();
            }
            else {
                this.modal.stopClose = this.originalStopClose;
                this.displayOverlapping();
            }
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
    get hostElement() {
        return this.element.nativeElement.closest('.clr-modal-host') || document.body;
    }
    ngOnInit() {
        this.configuration.fadeMove = 'fadeLeft';
    }
    ngOnChanges(changes) {
        if (changes && Object.prototype.hasOwnProperty.call(changes, '_open')) {
            if (changes._open.currentValue) {
                if (this.clrSidePanelPinnable && this.pinned) {
                    this.displaySideBySide();
                }
            }
            else {
                if (this.clrSidePanelPinnable && this.pinned) {
                    this.displayOverlapping();
                }
            }
        }
    }
    ngOnDestroy() {
        this.displayOverlapping();
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
    displaySideBySide() {
        this.hostElement.classList.add('clr-side-panel-pinned-' + this.size);
    }
    displayOverlapping() {
        this.hostElement.classList.forEach(className => {
            if (className.startsWith('clr-side-panel-pinned-')) {
                this.hostElement.classList.remove(className);
            }
        });
    }
}
ClrSidePanel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSidePanel, deps: [{ token: i0.ElementRef }, { token: i1.ClrModalConfigurationService }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrSidePanel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrSidePanel, selector: "clr-side-panel", inputs: { _open: ["clrSidePanelOpen", "_open"], closeButtonAriaLabel: ["clrSidePanelCloseButtonAriaLabel", "closeButtonAriaLabel"], skipAnimation: ["clrSidePanelSkipAnimation", "skipAnimation"], labelledById: ["clrSidePanelLabelledById", "labelledById"], staticBackdrop: ["clrSidePanelStaticBackdrop", "staticBackdrop"], preventClose: ["clrSidePanelPreventClose", "preventClose"], size: ["clrSidePanelSize", "size"], clrSidePanelBackdrop: "clrSidePanelBackdrop", clrSidePanelPinnable: "clrSidePanelPinnable" }, outputs: { openChange: "clrSidePanelOpenChange", altClose: "clrSidePanelAlternateClose" }, host: { listeners: { "document:pointerup": "documentClick($event)" }, properties: { "class.side-panel": "true" } }, viewQueries: [{ propertyName: "modal", first: true, predicate: ClrModal, descendants: true }], usesOnChanges: true, ngImport: i0, template: "<clr-modal\n  [clrModalOpen]=\"_open\"\n  (clrModalOpenChange)=\"openChange.emit($event)\"\n  [clrModalCloseButtonAriaLabel]=\"closeButtonAriaLabel\"\n  [clrModalSize]=\"size\"\n  [clrModalSkipAnimation]=\"skipAnimation\"\n  [clrModalStaticBackdrop]=\"staticBackdrop\"\n  [clrModalLabelledById]=\"labelledById\"\n  [clrModalPreventClose]=\"preventClose\"\n  (clrModalAlternateClose)=\"altClose.emit($event)\"\n  [clrModalOverrideScrollService]=\"true\"\n>\n  <button\n    type=\"button\"\n    [attr.aria-label]=\"commonStrings.keys.sidePanelPin\"\n    class=\"leading-button pinnable\"\n    *ngIf=\"clrSidePanelPinnable\"\n    (click)=\"togglePinned()\"\n  >\n    <cds-icon [attr.shape]=\"pinned ? 'unpin' : 'pin'\"></cds-icon>\n  </button>\n  <div class=\"modal-title\"><ng-content select=\".side-panel-title\"></ng-content></div>\n  <div class=\"modal-body\"><ng-content select=\".side-panel-body\"></ng-content></div>\n  <div class=\"modal-footer\"><ng-content select=\".side-panel-footer\"></ng-content></div>\n</clr-modal>\n", dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i5.ClrModal, selector: "clr-modal", inputs: ["clrModalOpen", "clrModalClosable", "clrModalCloseButtonAriaLabel", "clrModalSize", "clrModalStaticBackdrop", "clrModalSkipAnimation", "clrModalPreventClose", "clrModalLabelledById", "clrModalOverrideScrollService"], outputs: ["clrModalOpenChange", "clrModalAlternateClose"] }, { kind: "directive", type: i6.ClrModalBody, selector: ".modal-body" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSidePanel, decorators: [{
            type: Component,
            args: [{ selector: 'clr-side-panel', host: {
                        '[class.side-panel]': 'true',
                    }, template: "<clr-modal\n  [clrModalOpen]=\"_open\"\n  (clrModalOpenChange)=\"openChange.emit($event)\"\n  [clrModalCloseButtonAriaLabel]=\"closeButtonAriaLabel\"\n  [clrModalSize]=\"size\"\n  [clrModalSkipAnimation]=\"skipAnimation\"\n  [clrModalStaticBackdrop]=\"staticBackdrop\"\n  [clrModalLabelledById]=\"labelledById\"\n  [clrModalPreventClose]=\"preventClose\"\n  (clrModalAlternateClose)=\"altClose.emit($event)\"\n  [clrModalOverrideScrollService]=\"true\"\n>\n  <button\n    type=\"button\"\n    [attr.aria-label]=\"commonStrings.keys.sidePanelPin\"\n    class=\"leading-button pinnable\"\n    *ngIf=\"clrSidePanelPinnable\"\n    (click)=\"togglePinned()\"\n  >\n    <cds-icon [attr.shape]=\"pinned ? 'unpin' : 'pin'\"></cds-icon>\n  </button>\n  <div class=\"modal-title\"><ng-content select=\".side-panel-title\"></ng-content></div>\n  <div class=\"modal-body\"><ng-content select=\".side-panel-body\"></ng-content></div>\n  <div class=\"modal-footer\"><ng-content select=\".side-panel-footer\"></ng-content></div>\n</clr-modal>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.ClrModalConfigurationService }, { type: i2.ClrCommonStringsService }]; }, propDecorators: { _open: [{
                type: Input,
                args: ['clrSidePanelOpen']
            }], openChange: [{
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
            }], preventClose: [{
                type: Input,
                args: ['clrSidePanelPreventClose']
            }], altClose: [{
                type: Output,
                args: ['clrSidePanelAlternateClose']
            }], modal: [{
                type: ViewChild,
                args: [ClrModal]
            }], size: [{
                type: Input,
                args: ['clrSidePanelSize']
            }], clrSidePanelBackdrop: [{
                type: Input
            }], clrSidePanelPinnable: [{
                type: Input
            }], documentClick: [{
                type: HostListener,
                args: ['document:pointerup', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZS1wYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL21vZGFsL3NpZGUtcGFuZWwudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9tb2RhbC9zaWRlLXBhbmVsLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUVULFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUlMLE1BQU0sRUFFTixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7Ozs7Ozs7QUFVbkMsTUFBTSxPQUFPLFlBQVk7SUFpQnZCLFlBQ1UsT0FBZ0MsRUFDaEMsYUFBMkMsRUFDNUMsYUFBc0M7UUFGckMsWUFBTyxHQUFQLE9BQU8sQ0FBeUI7UUFDaEMsa0JBQWEsR0FBYixhQUFhLENBQThCO1FBQzVDLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQW5CcEIsVUFBSyxHQUFHLEtBQUssQ0FBQztRQUNQLGVBQVUsR0FBRyxJQUFJLFlBQVksQ0FBVSxLQUFLLENBQUMsQ0FBQztRQUU1QyxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUVyQixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUN6QixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNsQixhQUFRLEdBQUcsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7UUFHMUUsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBR2hCLFVBQUssR0FBRyxJQUFJLENBQUM7SUFNbEIsQ0FBQztJQUVKLElBQ0ksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSSxJQUFJLENBQUMsS0FBYTtRQUNwQixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsS0FB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QUE5QyxLQUFLO3VCQUFDLDBCQUEwQjtnQkFDSyxRQUFRO3NCQUE3QyxNQUFNO3VCQUFDLDRCQUE0QjtnQkFDUCxLQUFLO3NCQUFqQyxTQUFTO3VCQUFDLFFBQVE7Z0JBZWYsSUFBSTtzQkFEUCxLQUFLO3VCQUFDLGtCQUFrQjtnQkFxQ3JCLG9CQUFvQjtzQkFEdkIsS0FBSztnQkFZRixvQkFBb0I7c0JBRHZCLEtBQUs7Z0JBZ0RFLGFBQWE7c0JBRHBCLFlBQVk7dUJBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZSxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBDbHJNb2RhbCB9IGZyb20gJy4vbW9kYWwnO1xuaW1wb3J0IHsgQ2xyTW9kYWxDb25maWd1cmF0aW9uU2VydmljZSB9IGZyb20gJy4vbW9kYWwtY29uZmlndXJhdGlvbi5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLXNpZGUtcGFuZWwnLFxuICB0ZW1wbGF0ZVVybDogJ3NpZGUtcGFuZWwuaHRtbCcsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLnNpZGUtcGFuZWxdJzogJ3RydWUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJTaWRlUGFuZWwgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgQElucHV0KCdjbHJTaWRlUGFuZWxPcGVuJykgX29wZW4gPSBmYWxzZTtcbiAgQE91dHB1dCgnY2xyU2lkZVBhbmVsT3BlbkNoYW5nZScpIG9wZW5DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKTtcbiAgQElucHV0KCdjbHJTaWRlUGFuZWxDbG9zZUJ1dHRvbkFyaWFMYWJlbCcpIGNsb3NlQnV0dG9uQXJpYUxhYmVsOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgnY2xyU2lkZVBhbmVsU2tpcEFuaW1hdGlvbicpIHNraXBBbmltYXRpb24gPSBmYWxzZTtcbiAgQElucHV0KCdjbHJTaWRlUGFuZWxMYWJlbGxlZEJ5SWQnKSBsYWJlbGxlZEJ5SWQ6IHN0cmluZztcbiAgQElucHV0KCdjbHJTaWRlUGFuZWxTdGF0aWNCYWNrZHJvcCcpIHN0YXRpY0JhY2tkcm9wID0gZmFsc2U7XG4gIEBJbnB1dCgnY2xyU2lkZVBhbmVsUHJldmVudENsb3NlJykgcHJldmVudENsb3NlID0gZmFsc2U7XG4gIEBPdXRwdXQoJ2NsclNpZGVQYW5lbEFsdGVybmF0ZUNsb3NlJykgYWx0Q2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKTtcbiAgQFZpZXdDaGlsZChDbHJNb2RhbCkgcHJpdmF0ZSBtb2RhbDogQ2xyTW9kYWw7XG5cbiAgcHJpdmF0ZSBfcGlubmFibGUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfcGlubmVkID0gZmFsc2U7XG4gIHByaXZhdGUgb3JpZ2luYWxTdG9wQ2xvc2U6IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBfc2l6ZSA9ICdtZCc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb246IENsck1vZGFsQ29uZmlndXJhdGlvblNlcnZpY2UsXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlXG4gICkge31cblxuICBASW5wdXQoJ2NsclNpZGVQYW5lbFNpemUnKVxuICBnZXQgc2l6ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9zaXplO1xuICB9XG5cbiAgc2V0IHNpemUodmFsdWU6IHN0cmluZykge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHZhbHVlID0gJ21kJztcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NpemUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9zaXplID0gdmFsdWU7XG4gICAgICBpZiAodGhpcy5jbHJTaWRlUGFuZWxQaW5uYWJsZSAmJiB0aGlzLnBpbm5lZCkge1xuICAgICAgICB0aGlzLmRpc3BsYXlPdmVybGFwcGluZygpO1xuICAgICAgICB0aGlzLmRpc3BsYXlTaWRlQnlTaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IHBpbm5lZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcGlubmVkO1xuICB9XG5cbiAgc2V0IHBpbm5lZChwaW5uZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5jbHJTaWRlUGFuZWxQaW5uYWJsZSkge1xuICAgICAgdGhpcy5fcGlubmVkID0gcGlubmVkO1xuICAgICAgaWYgKHBpbm5lZCkge1xuICAgICAgICB0aGlzLm9yaWdpbmFsU3RvcENsb3NlID0gdGhpcy5tb2RhbC5zdG9wQ2xvc2U7XG4gICAgICAgIHRoaXMubW9kYWwuc3RvcENsb3NlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5U2lkZUJ5U2lkZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb2RhbC5zdG9wQ2xvc2UgPSB0aGlzLm9yaWdpbmFsU3RvcENsb3NlO1xuICAgICAgICB0aGlzLmRpc3BsYXlPdmVybGFwcGluZygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBjbHJTaWRlUGFuZWxCYWNrZHJvcCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uLmJhY2tkcm9wO1xuICB9XG5cbiAgc2V0IGNsclNpZGVQYW5lbEJhY2tkcm9wKGJhY2tkcm9wOiBib29sZWFuKSB7XG4gICAgaWYgKGJhY2tkcm9wICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuY29uZmlndXJhdGlvbi5iYWNrZHJvcCA9IGJhY2tkcm9wO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgpXG4gIGdldCBjbHJTaWRlUGFuZWxQaW5uYWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcGlubmFibGU7XG4gIH1cblxuICBzZXQgY2xyU2lkZVBhbmVsUGlubmFibGUocGlubmFibGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9waW5uYWJsZSA9IHBpbm5hYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgaG9zdEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiAodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmNsb3Nlc3QoJy5jbHItbW9kYWwtaG9zdCcpIHx8IGRvY3VtZW50LmJvZHk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb24uZmFkZU1vdmUgPSAnZmFkZUxlZnQnO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBbcHJvcE5hbWU6IHN0cmluZ106IFNpbXBsZUNoYW5nZSB9KTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNoYW5nZXMsICdfb3BlbicpKSB7XG4gICAgICBpZiAoY2hhbmdlcy5fb3Blbi5jdXJyZW50VmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xyU2lkZVBhbmVsUGlubmFibGUgJiYgdGhpcy5waW5uZWQpIHtcbiAgICAgICAgICB0aGlzLmRpc3BsYXlTaWRlQnlTaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmNsclNpZGVQYW5lbFBpbm5hYmxlICYmIHRoaXMucGlubmVkKSB7XG4gICAgICAgICAgdGhpcy5kaXNwbGF5T3ZlcmxhcHBpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGxheU92ZXJsYXBwaW5nKCk7XG4gIH1cblxuICBvcGVuKCkge1xuICAgIHRoaXMubW9kYWwub3BlbigpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5tb2RhbC5jbG9zZSgpO1xuICB9XG5cbiAgdG9nZ2xlUGlubmVkKCkge1xuICAgIHRoaXMucGlubmVkID0gIXRoaXMucGlubmVkO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6cG9pbnRlcnVwJywgWyckZXZlbnQnXSlcbiAgcHJpdmF0ZSBkb2N1bWVudENsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgIGlmIChcbiAgICAgICF0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQgYXMgTm9kZSkgJiZcbiAgICAgIHRoaXMubW9kYWwuX29wZW4gJiZcbiAgICAgICF0aGlzLmNvbmZpZ3VyYXRpb24uYmFja2Ryb3BcbiAgICApIHtcbiAgICAgIHRoaXMubW9kYWwuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRpc3BsYXlTaWRlQnlTaWRlKCkge1xuICAgIHRoaXMuaG9zdEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY2xyLXNpZGUtcGFuZWwtcGlubmVkLScgKyB0aGlzLnNpemUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwbGF5T3ZlcmxhcHBpbmcoKSB7XG4gICAgdGhpcy5ob3N0RWxlbWVudC5jbGFzc0xpc3QuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgaWYgKGNsYXNzTmFtZS5zdGFydHNXaXRoKCdjbHItc2lkZS1wYW5lbC1waW5uZWQtJykpIHtcbiAgICAgICAgdGhpcy5ob3N0RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsIjxjbHItbW9kYWxcbiAgW2Nsck1vZGFsT3Blbl09XCJfb3BlblwiXG4gIChjbHJNb2RhbE9wZW5DaGFuZ2UpPVwib3BlbkNoYW5nZS5lbWl0KCRldmVudClcIlxuICBbY2xyTW9kYWxDbG9zZUJ1dHRvbkFyaWFMYWJlbF09XCJjbG9zZUJ1dHRvbkFyaWFMYWJlbFwiXG4gIFtjbHJNb2RhbFNpemVdPVwic2l6ZVwiXG4gIFtjbHJNb2RhbFNraXBBbmltYXRpb25dPVwic2tpcEFuaW1hdGlvblwiXG4gIFtjbHJNb2RhbFN0YXRpY0JhY2tkcm9wXT1cInN0YXRpY0JhY2tkcm9wXCJcbiAgW2Nsck1vZGFsTGFiZWxsZWRCeUlkXT1cImxhYmVsbGVkQnlJZFwiXG4gIFtjbHJNb2RhbFByZXZlbnRDbG9zZV09XCJwcmV2ZW50Q2xvc2VcIlxuICAoY2xyTW9kYWxBbHRlcm5hdGVDbG9zZSk9XCJhbHRDbG9zZS5lbWl0KCRldmVudClcIlxuICBbY2xyTW9kYWxPdmVycmlkZVNjcm9sbFNlcnZpY2VdPVwidHJ1ZVwiXG4+XG4gIDxidXR0b25cbiAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5zaWRlUGFuZWxQaW5cIlxuICAgIGNsYXNzPVwibGVhZGluZy1idXR0b24gcGlubmFibGVcIlxuICAgICpuZ0lmPVwiY2xyU2lkZVBhbmVsUGlubmFibGVcIlxuICAgIChjbGljayk9XCJ0b2dnbGVQaW5uZWQoKVwiXG4gID5cbiAgICA8Y2RzLWljb24gW2F0dHIuc2hhcGVdPVwicGlubmVkID8gJ3VucGluJyA6ICdwaW4nXCI+PC9jZHMtaWNvbj5cbiAgPC9idXR0b24+XG4gIDxkaXYgY2xhc3M9XCJtb2RhbC10aXRsZVwiPjxuZy1jb250ZW50IHNlbGVjdD1cIi5zaWRlLXBhbmVsLXRpdGxlXCI+PC9uZy1jb250ZW50PjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPjxuZy1jb250ZW50IHNlbGVjdD1cIi5zaWRlLXBhbmVsLWJvZHlcIj48L25nLWNvbnRlbnQ+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj48bmctY29udGVudCBzZWxlY3Q9XCIuc2lkZS1wYW5lbC1mb290ZXJcIj48L25nLWNvbnRlbnQ+PC9kaXY+XG48L2Nsci1tb2RhbD5cbiJdfQ==