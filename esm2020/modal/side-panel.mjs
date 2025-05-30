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
        this._open = false;
        this.openChange = new EventEmitter(false);
        this.skipAnimation = false;
        this.staticBackdrop = false;
        this.preventClose = false;
        this.altClose = new EventEmitter(false);
        this._pinnable = false;
        this._pinned = false;
        this._position = 'right';
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
        if (this.clrSidePanelPinnable) {
            this._pinned = pinned;
            if (this.modal) {
                this.updateModalState();
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
ClrSidePanel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrSidePanel, selector: "clr-side-panel", inputs: { _open: ["clrSidePanelOpen", "_open"], closeButtonAriaLabel: ["clrSidePanelCloseButtonAriaLabel", "closeButtonAriaLabel"], skipAnimation: ["clrSidePanelSkipAnimation", "skipAnimation"], labelledById: ["clrSidePanelLabelledById", "labelledById"], staticBackdrop: ["clrSidePanelStaticBackdrop", "staticBackdrop"], preventClose: ["clrSidePanelPreventClose", "preventClose"], size: ["clrSidePanelSize", "size"], position: ["clrSidePanelPosition", "position"], pinned: ["clrSidePanelPinned", "pinned"], clrSidePanelBackdrop: "clrSidePanelBackdrop", clrSidePanelPinnable: "clrSidePanelPinnable" }, outputs: { openChange: "clrSidePanelOpenChange", altClose: "clrSidePanelAlternateClose" }, host: { listeners: { "document:pointerup": "documentClick($event)" }, properties: { "class.side-panel": "true", "class.side-panel-bottom": "this.bottomPositionCssClass" } }, viewQueries: [{ propertyName: "modal", first: true, predicate: ClrModal, descendants: true }], ngImport: i0, template: "<clr-modal\n  [clrModalOpen]=\"_open\"\n  (clrModalOpenChange)=\"handleModalOpen($event)\"\n  [clrModalCloseButtonAriaLabel]=\"closeButtonAriaLabel\"\n  [clrModalSize]=\"size\"\n  [clrModalSkipAnimation]=\"skipAnimation\"\n  [clrModalStaticBackdrop]=\"staticBackdrop\"\n  [clrModalLabelledById]=\"labelledById\"\n  [clrModalPreventClose]=\"preventClose\"\n  (clrModalAlternateClose)=\"altClose.emit($event)\"\n  [clrModalOverrideScrollService]=\"true\"\n>\n  <button\n    type=\"button\"\n    [attr.aria-label]=\"commonStrings.keys.sidePanelPin\"\n    class=\"leading-button pinnable\"\n    *ngIf=\"clrSidePanelPinnable\"\n    (click)=\"togglePinned()\"\n  >\n    <cds-icon [attr.shape]=\"pinned ? 'unpin' : 'pin'\"></cds-icon>\n  </button>\n  <div class=\"modal-title\"><ng-content select=\".side-panel-title\"></ng-content></div>\n  <div class=\"modal-body\"><ng-content select=\".side-panel-body\"></ng-content></div>\n  <div class=\"modal-footer\"><ng-content select=\".side-panel-footer\"></ng-content></div>\n</clr-modal>\n", dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i5.ClrModal, selector: "clr-modal", inputs: ["clrModalOpen", "clrModalClosable", "clrModalCloseButtonAriaLabel", "clrModalSize", "clrModalStaticBackdrop", "clrModalSkipAnimation", "clrModalPreventClose", "clrModalLabelledById", "clrModalOverrideScrollService"], outputs: ["clrModalOpenChange", "clrModalAlternateClose"] }, { kind: "directive", type: i6.ClrModalBody, selector: ".modal-body" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSidePanel, decorators: [{
            type: Component,
            args: [{ selector: 'clr-side-panel', host: {
                        '[class.side-panel]': 'true',
                    }, template: "<clr-modal\n  [clrModalOpen]=\"_open\"\n  (clrModalOpenChange)=\"handleModalOpen($event)\"\n  [clrModalCloseButtonAriaLabel]=\"closeButtonAriaLabel\"\n  [clrModalSize]=\"size\"\n  [clrModalSkipAnimation]=\"skipAnimation\"\n  [clrModalStaticBackdrop]=\"staticBackdrop\"\n  [clrModalLabelledById]=\"labelledById\"\n  [clrModalPreventClose]=\"preventClose\"\n  (clrModalAlternateClose)=\"altClose.emit($event)\"\n  [clrModalOverrideScrollService]=\"true\"\n>\n  <button\n    type=\"button\"\n    [attr.aria-label]=\"commonStrings.keys.sidePanelPin\"\n    class=\"leading-button pinnable\"\n    *ngIf=\"clrSidePanelPinnable\"\n    (click)=\"togglePinned()\"\n  >\n    <cds-icon [attr.shape]=\"pinned ? 'unpin' : 'pin'\"></cds-icon>\n  </button>\n  <div class=\"modal-title\"><ng-content select=\".side-panel-title\"></ng-content></div>\n  <div class=\"modal-body\"><ng-content select=\".side-panel-body\"></ng-content></div>\n  <div class=\"modal-footer\"><ng-content select=\".side-panel-footer\"></ng-content></div>\n</clr-modal>\n" }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZS1wYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL21vZGFsL3NpZGUtcGFuZWwudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9tb2RhbC9zaWRlLXBhbmVsLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUVULFlBQVksRUFDWixXQUFXLEVBQ1gsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7Ozs7Ozs7O0FBVW5DLE1BQU0sT0FBTyxZQUFZO0lBa0J2QixZQUNVLE9BQWdDLEVBQ2hDLGFBQTJDLEVBQzVDLGFBQXNDO1FBRnJDLFlBQU8sR0FBUCxPQUFPLENBQXlCO1FBQ2hDLGtCQUFhLEdBQWIsYUFBYSxDQUE4QjtRQUM1QyxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFwQnBCLFVBQUssR0FBRyxLQUFLLENBQUM7UUFDUCxlQUFVLEdBQUcsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7UUFFNUMsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFFckIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFDekIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDbEIsYUFBUSxHQUFHLElBQUksWUFBWSxDQUFVLEtBQUssQ0FBQyxDQUFDO1FBRTFFLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUVoQixjQUFTLEdBQUcsT0FBTyxDQUFDO1FBR3BCLFVBQUssR0FBRyxJQUFJLENBQUM7SUFNbEIsQ0FBQztJQUVKLElBQ0ksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSSxJQUFJLENBQUMsS0FB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QVE7c0JBRFgsS0FBSzt1QkFBQyxzQkFBc0I7Z0JBaUJ6QixNQUFNO3NCQURULEtBQUs7dUJBQUMsb0JBQW9CO2dCQWV2QixvQkFBb0I7c0JBRHZCLEtBQUs7Z0JBWUYsb0JBQW9CO3NCQUR2QixLQUFLO2dCQVVNLEtBQUs7c0JBRGhCLFNBQVM7dUJBQUMsUUFBUTtnQkFnQlAsc0JBQXNCO3NCQURqQyxXQUFXO3VCQUFDLHlCQUF5QjtnQkFzQzlCLGFBQWE7c0JBRHBCLFlBQVk7dUJBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0QmluZGluZyxcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBDbHJNb2RhbCB9IGZyb20gJy4vbW9kYWwnO1xuaW1wb3J0IHsgQ2xyTW9kYWxDb25maWd1cmF0aW9uU2VydmljZSB9IGZyb20gJy4vbW9kYWwtY29uZmlndXJhdGlvbi5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLXNpZGUtcGFuZWwnLFxuICB0ZW1wbGF0ZVVybDogJ3NpZGUtcGFuZWwuaHRtbCcsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLnNpZGUtcGFuZWxdJzogJ3RydWUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJTaWRlUGFuZWwgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgnY2xyU2lkZVBhbmVsT3BlbicpIF9vcGVuID0gZmFsc2U7XG4gIEBPdXRwdXQoJ2NsclNpZGVQYW5lbE9wZW5DaGFuZ2UnKSBvcGVuQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPihmYWxzZSk7XG4gIEBJbnB1dCgnY2xyU2lkZVBhbmVsQ2xvc2VCdXR0b25BcmlhTGFiZWwnKSBjbG9zZUJ1dHRvbkFyaWFMYWJlbDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoJ2NsclNpZGVQYW5lbFNraXBBbmltYXRpb24nKSBza2lwQW5pbWF0aW9uID0gZmFsc2U7XG4gIEBJbnB1dCgnY2xyU2lkZVBhbmVsTGFiZWxsZWRCeUlkJykgbGFiZWxsZWRCeUlkOiBzdHJpbmc7XG4gIEBJbnB1dCgnY2xyU2lkZVBhbmVsU3RhdGljQmFja2Ryb3AnKSBzdGF0aWNCYWNrZHJvcCA9IGZhbHNlO1xuICBASW5wdXQoJ2NsclNpZGVQYW5lbFByZXZlbnRDbG9zZScpIHByZXZlbnRDbG9zZSA9IGZhbHNlO1xuICBAT3V0cHV0KCdjbHJTaWRlUGFuZWxBbHRlcm5hdGVDbG9zZScpIGFsdENsb3NlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPihmYWxzZSk7XG5cbiAgcHJpdmF0ZSBfcGlubmFibGUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfcGlubmVkID0gZmFsc2U7XG4gIHByaXZhdGUgb3JpZ2luYWxTdG9wQ2xvc2U6IGJvb2xlYW47XG4gIHByaXZhdGUgX3Bvc2l0aW9uID0gJ3JpZ2h0JztcbiAgcHJpdmF0ZSBfbW9kYWw6IENsck1vZGFsO1xuXG4gIHByaXZhdGUgX3NpemUgPSAnbWQnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uOiBDbHJNb2RhbENvbmZpZ3VyYXRpb25TZXJ2aWNlLFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZVxuICApIHt9XG5cbiAgQElucHV0KCdjbHJTaWRlUGFuZWxTaXplJylcbiAgZ2V0IHNpemUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fc2l6ZTtcbiAgfVxuXG4gIHNldCBzaXplKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICB2YWx1ZSA9ICdtZCc7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zaXplICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy5fc2l6ZSA9IHZhbHVlO1xuICAgICAgaWYgKHRoaXMuY2xyU2lkZVBhbmVsUGlubmFibGUgJiYgdGhpcy5waW5uZWQpIHtcbiAgICAgICAgdGhpcy51cGRhdGVNb2RhbFN0YXRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdjbHJTaWRlUGFuZWxQb3NpdGlvbicpXG4gIGdldCBwb3NpdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcbiAgfVxuXG4gIHNldCBwb3NpdGlvbihwb3NpdGlvbjogc3RyaW5nKSB7XG4gICAgaWYgKHBvc2l0aW9uICYmIHBvc2l0aW9uICE9PSB0aGlzLl9wb3NpdGlvbikge1xuICAgICAgdGhpcy5fcG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgIGlmICh0aGlzLl9wb3NpdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb24uZmFkZU1vdmUgPSAnZmFkZUxlZnQnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9wb3NpdGlvbiA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uLmZhZGVNb3ZlID0gJ2ZhZGVVcCc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdjbHJTaWRlUGFuZWxQaW5uZWQnKVxuICBnZXQgcGlubmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9waW5uZWQ7XG4gIH1cblxuICBzZXQgcGlubmVkKHBpbm5lZDogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLmNsclNpZGVQYW5lbFBpbm5hYmxlKSB7XG4gICAgICB0aGlzLl9waW5uZWQgPSBwaW5uZWQ7XG4gICAgICBpZiAodGhpcy5tb2RhbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZU1vZGFsU3RhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgY2xyU2lkZVBhbmVsQmFja2Ryb3AoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvbi5iYWNrZHJvcDtcbiAgfVxuXG4gIHNldCBjbHJTaWRlUGFuZWxCYWNrZHJvcChiYWNrZHJvcDogYm9vbGVhbikge1xuICAgIGlmIChiYWNrZHJvcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNvbmZpZ3VyYXRpb24uYmFja2Ryb3AgPSBiYWNrZHJvcDtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoKVxuICBnZXQgY2xyU2lkZVBhbmVsUGlubmFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Bpbm5hYmxlO1xuICB9XG5cbiAgc2V0IGNsclNpZGVQYW5lbFBpbm5hYmxlKHBpbm5hYmxlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcGlubmFibGUgPSBwaW5uYWJsZTtcbiAgfVxuXG4gIEBWaWV3Q2hpbGQoQ2xyTW9kYWwpXG4gIHByaXZhdGUgZ2V0IG1vZGFsKCk6IENsck1vZGFsIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kYWw7XG4gIH1cblxuICBwcml2YXRlIHNldCBtb2RhbChtb2RhbDogQ2xyTW9kYWwpIHtcbiAgICB0aGlzLl9tb2RhbCA9IG1vZGFsO1xuICAgIHRoaXMub3JpZ2luYWxTdG9wQ2xvc2UgPSB0aGlzLm1vZGFsLnN0b3BDbG9zZTtcbiAgICB0aGlzLnVwZGF0ZU1vZGFsU3RhdGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGhvc3RFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCcuY2xyLW1vZGFsLWhvc3QnKSB8fCBkb2N1bWVudC5ib2R5O1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5zaWRlLXBhbmVsLWJvdHRvbScpXG4gIHByaXZhdGUgZ2V0IGJvdHRvbVBvc2l0aW9uQ3NzQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb24gPT09ICdib3R0b20nO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5jb25maWd1cmF0aW9uLmZhZGVNb3ZlID0gJ2ZhZGVMZWZ0JztcbiAgICBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ2JvdHRvbScpIHtcbiAgICAgIHRoaXMuY29uZmlndXJhdGlvbi5mYWRlTW92ZSA9ICdmYWRlVXAnO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY2xlYW51cFBpbm5lZENsYXNzZXMoKTtcbiAgfVxuXG4gIGhhbmRsZU1vZGFsT3BlbihvcGVuOiBib29sZWFuKSB7XG4gICAgaWYgKG9wZW4pIHtcbiAgICAgIHRoaXMudXBkYXRlTW9kYWxTdGF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsZWFudXBQaW5uZWRDbGFzc2VzKCk7XG4gICAgfVxuICAgIHRoaXMub3BlbkNoYW5nZS5lbWl0KG9wZW4pO1xuICB9XG5cbiAgb3BlbigpIHtcbiAgICB0aGlzLm1vZGFsLm9wZW4oKTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMubW9kYWwuY2xvc2UoKTtcbiAgfVxuXG4gIHRvZ2dsZVBpbm5lZCgpIHtcbiAgICB0aGlzLnBpbm5lZCA9ICF0aGlzLnBpbm5lZDtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OnBvaW50ZXJ1cCcsIFsnJGV2ZW50J10pXG4gIHByaXZhdGUgZG9jdW1lbnRDbGljayhldmVudDogRXZlbnQpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0IGFzIE5vZGUpICYmXG4gICAgICB0aGlzLm1vZGFsLl9vcGVuICYmXG4gICAgICAhdGhpcy5jb25maWd1cmF0aW9uLmJhY2tkcm9wXG4gICAgKSB7XG4gICAgICB0aGlzLm1vZGFsLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVNb2RhbFN0YXRlKCkge1xuICAgIGlmICghdGhpcy5tb2RhbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5waW5uZWQpIHtcbiAgICAgIHRoaXMubW9kYWwuc3RvcENsb3NlID0gdHJ1ZTtcbiAgICAgIHRoaXMudXBkYXRlUGlubmVkQ2xhc3NlcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vZGFsLnN0b3BDbG9zZSA9IHRoaXMub3JpZ2luYWxTdG9wQ2xvc2U7XG4gICAgICB0aGlzLmNsZWFudXBQaW5uZWRDbGFzc2VzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjbGVhbnVwUGlubmVkQ2xhc3NlcygpIHtcbiAgICBbdGhpcy5ob3N0RWxlbWVudCwgZG9jdW1lbnQuYm9keV0uZm9yRWFjaChob3N0ID0+IHtcbiAgICAgIGhvc3QuY2xhc3NMaXN0LmZvckVhY2goY2xhc3NOYW1lID0+IHtcbiAgICAgICAgaWYgKGNsYXNzTmFtZS5zdGFydHNXaXRoKCdjbHItc2lkZS1wYW5lbC1waW5uZWQtJykpIHtcbiAgICAgICAgICBob3N0LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVBpbm5lZENsYXNzZXMoKSB7XG4gICAgdGhpcy5jbGVhbnVwUGlubmVkQ2xhc3NlcygpO1xuICAgIHRoaXMuaG9zdEVsZW1lbnQuY2xhc3NMaXN0LmFkZChgY2xyLXNpZGUtcGFuZWwtcGlubmVkLSR7dGhpcy5wb3NpdGlvbn0tJHt0aGlzLnNpemV9YCk7XG4gIH1cbn1cbiIsIjxjbHItbW9kYWxcbiAgW2Nsck1vZGFsT3Blbl09XCJfb3BlblwiXG4gIChjbHJNb2RhbE9wZW5DaGFuZ2UpPVwiaGFuZGxlTW9kYWxPcGVuKCRldmVudClcIlxuICBbY2xyTW9kYWxDbG9zZUJ1dHRvbkFyaWFMYWJlbF09XCJjbG9zZUJ1dHRvbkFyaWFMYWJlbFwiXG4gIFtjbHJNb2RhbFNpemVdPVwic2l6ZVwiXG4gIFtjbHJNb2RhbFNraXBBbmltYXRpb25dPVwic2tpcEFuaW1hdGlvblwiXG4gIFtjbHJNb2RhbFN0YXRpY0JhY2tkcm9wXT1cInN0YXRpY0JhY2tkcm9wXCJcbiAgW2Nsck1vZGFsTGFiZWxsZWRCeUlkXT1cImxhYmVsbGVkQnlJZFwiXG4gIFtjbHJNb2RhbFByZXZlbnRDbG9zZV09XCJwcmV2ZW50Q2xvc2VcIlxuICAoY2xyTW9kYWxBbHRlcm5hdGVDbG9zZSk9XCJhbHRDbG9zZS5lbWl0KCRldmVudClcIlxuICBbY2xyTW9kYWxPdmVycmlkZVNjcm9sbFNlcnZpY2VdPVwidHJ1ZVwiXG4+XG4gIDxidXR0b25cbiAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5zaWRlUGFuZWxQaW5cIlxuICAgIGNsYXNzPVwibGVhZGluZy1idXR0b24gcGlubmFibGVcIlxuICAgICpuZ0lmPVwiY2xyU2lkZVBhbmVsUGlubmFibGVcIlxuICAgIChjbGljayk9XCJ0b2dnbGVQaW5uZWQoKVwiXG4gID5cbiAgICA8Y2RzLWljb24gW2F0dHIuc2hhcGVdPVwicGlubmVkID8gJ3VucGluJyA6ICdwaW4nXCI+PC9jZHMtaWNvbj5cbiAgPC9idXR0b24+XG4gIDxkaXYgY2xhc3M9XCJtb2RhbC10aXRsZVwiPjxuZy1jb250ZW50IHNlbGVjdD1cIi5zaWRlLXBhbmVsLXRpdGxlXCI+PC9uZy1jb250ZW50PjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPjxuZy1jb250ZW50IHNlbGVjdD1cIi5zaWRlLXBhbmVsLWJvZHlcIj48L25nLWNvbnRlbnQ+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj48bmctY29udGVudCBzZWxlY3Q9XCIuc2lkZS1wYW5lbC1mb290ZXJcIj48L25nLWNvbnRlbnQ+PC9kaXY+XG48L2Nsci1tb2RhbD5cbiJdfQ==