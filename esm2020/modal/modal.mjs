/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ContentChild, EventEmitter, HostBinding, Input, Output, ViewChild, } from '@angular/core';
import { uniqueIdFactory } from '../utils/id-generator/id-generator.service';
import { ScrollingService } from '../utils/scrolling/scrolling-service';
import * as i0 from "@angular/core";
import * as i1 from "../utils/scrolling/scrolling-service";
import * as i2 from "../utils/i18n/common-strings.service";
import * as i3 from "./modal-stack.service";
import * as i4 from "./modal-configuration.service";
import * as i5 from "@angular/common";
import * as i6 from "../utils/cdk/cdk-trap-focus.module";
import * as i7 from "../icon/icon";
export class ClrModal {
    constructor(_scrollingService, commonStrings, modalStackService, configuration) {
        this._scrollingService = _scrollingService;
        this.commonStrings = commonStrings;
        this.modalStackService = modalStackService;
        this.configuration = configuration;
        this.modalId = uniqueIdFactory();
        this._open = false;
        this._openChanged = new EventEmitter(false);
        this.closable = true;
        this.closeButtonAriaLabel = this.commonStrings.keys.close;
        this.size = 'md';
        this.staticBackdrop = true;
        this.skipAnimation = false;
        this.stopClose = false;
        this.altClose = new EventEmitter(false);
        // presently this is only used by inline wizards
        this.bypassScrollService = false;
    }
    get fadeMove() {
        return this.skipAnimation ? '' : this.configuration.fadeMove;
    }
    set fadeMove(move) {
        this.configuration.fadeMove = move;
    }
    get backdrop() {
        return this.configuration.backdrop;
    }
    // Detect when _open is set to true and set no-scrolling to true
    ngOnChanges(changes) {
        if (!this.bypassScrollService && changes && Object.prototype.hasOwnProperty.call(changes, '_open')) {
            if (changes._open.currentValue) {
                this._scrollingService.stopScrolling();
                this.modalStackService.trackModalOpen(this);
            }
            else {
                this._scrollingService.resumeScrolling();
            }
        }
    }
    ngOnDestroy() {
        this._scrollingService.resumeScrolling();
    }
    open() {
        if (this._open) {
            return;
        }
        this._open = true;
        this._openChanged.emit(true);
        this.modalStackService.trackModalOpen(this);
    }
    backdropClick() {
        if (this.staticBackdrop) {
            this.title.nativeElement.focus();
            return;
        }
        this.close();
    }
    close() {
        if (this.stopClose) {
            this.altClose.emit(false);
            return;
        }
        if (!this.closable || !this._open) {
            return;
        }
        this._open = false;
    }
    fadeDone(e) {
        if (e.toState === 'void') {
            // TODO: Investigate if we can decouple from animation events
            this._openChanged.emit(false);
            this.modalStackService.trackModalClose(this);
        }
    }
    scrollTop() {
        this.bodyElementRef.nativeElement.scrollTo(0, 0);
    }
}
ClrModal.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrModal, deps: [{ token: i1.ScrollingService }, { token: i2.ClrCommonStringsService }, { token: i3.ModalStackService }, { token: i4.ClrModalConfigurationService }], target: i0.ɵɵFactoryTarget.Component });
ClrModal.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrModal, selector: "clr-modal", inputs: { _open: ["clrModalOpen", "_open"], closable: ["clrModalClosable", "closable"], closeButtonAriaLabel: ["clrModalCloseButtonAriaLabel", "closeButtonAriaLabel"], size: ["clrModalSize", "size"], staticBackdrop: ["clrModalStaticBackdrop", "staticBackdrop"], skipAnimation: ["clrModalSkipAnimation", "skipAnimation"], stopClose: ["clrModalPreventClose", "stopClose"], labelledBy: ["clrModalLabelledById", "labelledBy"], bypassScrollService: ["clrModalOverrideScrollService", "bypassScrollService"] }, outputs: { _openChanged: "clrModalOpenChange", altClose: "clrModalAlternateClose" }, host: { properties: { "class.open": "this._open" } }, queries: [{ propertyName: "modalContentTemplate", first: true, predicate: ["clrInternalModalContentTemplate"], descendants: true }], viewQueries: [{ propertyName: "title", first: true, predicate: ["title"], descendants: true }, { propertyName: "bodyElementRef", first: true, predicate: ["body"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div *ngIf=\"_open\" class=\"modal\" [class.modal-full-screen]=\"size == 'full-screen'\">\n  <!--fixme: revisit when ngClass works with exit animation-->\n  <div\n    cdkTrapFocus\n    [cdkTrapFocusAutoCapture]=\"true\"\n    [@fadeMove]=\"fadeMove\"\n    (@fadeMove.done)=\"fadeDone($event)\"\n    class=\"modal-dialog\"\n    [class.modal-sm]=\"size == 'sm'\"\n    [class.modal-lg]=\"size == 'lg'\"\n    [class.modal-xl]=\"size == 'xl'\"\n    role=\"dialog\"\n    aria-modal=\"true\"\n    [attr.aria-hidden]=\"!_open\"\n    [attr.aria-labelledby]=\"labelledBy || modalId\"\n  >\n    <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n    <!-- This wizard is tightly coupled to the modal styles, so changes here could require changes in the wizard. -->\n    <div *ngIf=\"!modalContentTemplate; else modalContentTemplate\" class=\"modal-content-wrapper\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header--accessible\">\n          <ng-content select=\".leading-button\"></ng-content>\n          <div class=\"modal-title-wrapper\" #title [id]=\"modalId\" cdkFocusInitial tabindex=\"-1\">\n            <ng-content select=\".modal-title\"></ng-content>\n          </div>\n          <button\n            type=\"button\"\n            [attr.aria-label]=\"closeButtonAriaLabel || commonStrings.keys.close\"\n            class=\"close\"\n            *ngIf=\"closable\"\n            (click)=\"close()\"\n          >\n            <cds-icon shape=\"window-close\"></cds-icon>\n          </button>\n        </div>\n        <div #body class=\"modal-body-wrapper\">\n          <ng-content select=\".modal-body\"></ng-content>\n        </div>\n        <ng-content select=\".modal-footer\"></ng-content>\n      </div>\n    </div>\n    <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n  </div>\n  <div [@fade] *ngIf=\"backdrop\" class=\"modal-backdrop\" aria-hidden=\"true\" (click)=\"backdropClick()\"></div>\n</div>\n", styles: [":host{display:none}:host.open{display:inline}\n"], dependencies: [{ kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }, { kind: "directive", type: i7.CdsIconCustomTag, selector: "cds-icon" }], viewProviders: [ScrollingService], animations: [
        trigger('fadeMove', [
            transition('* => fadeDown', [
                style({ opacity: 0, transform: 'translate(0, -25%)' }),
                animate('0.2s ease-in-out'),
            ]),
            transition('fadeDown => *', [
                animate('0.2s ease-in-out', style({ opacity: 0, transform: 'translate(0, -25%)' })),
            ]),
            transition('* => fadeLeft', [style({ opacity: 0, transform: 'translate(25%, 0)' }), animate('0.2s ease-in-out')]),
            transition('fadeLeft => *', [animate('0.2s ease-in-out', style({ opacity: 0, transform: 'translate(25%, 0)' }))]),
            transition('* => fadeUp', [style({ opacity: 0, transform: 'translate(0, 50%)' }), animate('0.2s ease-in-out')]),
            transition('fadeUp => *', [animate('0.2s ease-in-out', style({ opacity: 0, transform: 'translate(0, 50%)' }))]),
        ]),
        trigger('fade', [
            transition('void => *', [style({ opacity: 0 }), animate('0.2s ease-in-out', style({ opacity: 0.85 }))]),
            transition('* => void', [animate('0.2s ease-in-out', style({ opacity: 0 }))]),
        ]),
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrModal, decorators: [{
            type: Component,
            args: [{ selector: 'clr-modal', viewProviders: [ScrollingService], animations: [
                        trigger('fadeMove', [
                            transition('* => fadeDown', [
                                style({ opacity: 0, transform: 'translate(0, -25%)' }),
                                animate('0.2s ease-in-out'),
                            ]),
                            transition('fadeDown => *', [
                                animate('0.2s ease-in-out', style({ opacity: 0, transform: 'translate(0, -25%)' })),
                            ]),
                            transition('* => fadeLeft', [style({ opacity: 0, transform: 'translate(25%, 0)' }), animate('0.2s ease-in-out')]),
                            transition('fadeLeft => *', [animate('0.2s ease-in-out', style({ opacity: 0, transform: 'translate(25%, 0)' }))]),
                            transition('* => fadeUp', [style({ opacity: 0, transform: 'translate(0, 50%)' }), animate('0.2s ease-in-out')]),
                            transition('fadeUp => *', [animate('0.2s ease-in-out', style({ opacity: 0, transform: 'translate(0, 50%)' }))]),
                        ]),
                        trigger('fade', [
                            transition('void => *', [style({ opacity: 0 }), animate('0.2s ease-in-out', style({ opacity: 0.85 }))]),
                            transition('* => void', [animate('0.2s ease-in-out', style({ opacity: 0 }))]),
                        ]),
                    ], template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div *ngIf=\"_open\" class=\"modal\" [class.modal-full-screen]=\"size == 'full-screen'\">\n  <!--fixme: revisit when ngClass works with exit animation-->\n  <div\n    cdkTrapFocus\n    [cdkTrapFocusAutoCapture]=\"true\"\n    [@fadeMove]=\"fadeMove\"\n    (@fadeMove.done)=\"fadeDone($event)\"\n    class=\"modal-dialog\"\n    [class.modal-sm]=\"size == 'sm'\"\n    [class.modal-lg]=\"size == 'lg'\"\n    [class.modal-xl]=\"size == 'xl'\"\n    role=\"dialog\"\n    aria-modal=\"true\"\n    [attr.aria-hidden]=\"!_open\"\n    [attr.aria-labelledby]=\"labelledBy || modalId\"\n  >\n    <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n    <!-- This wizard is tightly coupled to the modal styles, so changes here could require changes in the wizard. -->\n    <div *ngIf=\"!modalContentTemplate; else modalContentTemplate\" class=\"modal-content-wrapper\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header--accessible\">\n          <ng-content select=\".leading-button\"></ng-content>\n          <div class=\"modal-title-wrapper\" #title [id]=\"modalId\" cdkFocusInitial tabindex=\"-1\">\n            <ng-content select=\".modal-title\"></ng-content>\n          </div>\n          <button\n            type=\"button\"\n            [attr.aria-label]=\"closeButtonAriaLabel || commonStrings.keys.close\"\n            class=\"close\"\n            *ngIf=\"closable\"\n            (click)=\"close()\"\n          >\n            <cds-icon shape=\"window-close\"></cds-icon>\n          </button>\n        </div>\n        <div #body class=\"modal-body-wrapper\">\n          <ng-content select=\".modal-body\"></ng-content>\n        </div>\n        <ng-content select=\".modal-footer\"></ng-content>\n      </div>\n    </div>\n    <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n  </div>\n  <div [@fade] *ngIf=\"backdrop\" class=\"modal-backdrop\" aria-hidden=\"true\" (click)=\"backdropClick()\"></div>\n</div>\n", styles: [":host{display:none}:host.open{display:inline}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.ScrollingService }, { type: i2.ClrCommonStringsService }, { type: i3.ModalStackService }, { type: i4.ClrModalConfigurationService }]; }, propDecorators: { title: [{
                type: ViewChild,
                args: ['title']
            }], _open: [{
                type: Input,
                args: ['clrModalOpen']
            }, {
                type: HostBinding,
                args: ['class.open']
            }], _openChanged: [{
                type: Output,
                args: ['clrModalOpenChange']
            }], closable: [{
                type: Input,
                args: ['clrModalClosable']
            }], closeButtonAriaLabel: [{
                type: Input,
                args: ['clrModalCloseButtonAriaLabel']
            }], size: [{
                type: Input,
                args: ['clrModalSize']
            }], staticBackdrop: [{
                type: Input,
                args: ['clrModalStaticBackdrop']
            }], skipAnimation: [{
                type: Input,
                args: ['clrModalSkipAnimation']
            }], stopClose: [{
                type: Input,
                args: ['clrModalPreventClose']
            }], altClose: [{
                type: Output,
                args: ['clrModalAlternateClose']
            }], labelledBy: [{
                type: Input,
                args: ['clrModalLabelledById']
            }], bypassScrollService: [{
                type: Input,
                args: ['clrModalOverrideScrollService']
            }], modalContentTemplate: [{
                type: ContentChild,
                args: ['clrInternalModalContentTemplate']
            }], bodyElementRef: [{
                type: ViewChild,
                args: ['body']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9tb2RhbC9tb2RhbC50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL21vZGFsL21vZGFsLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFrQixLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzFGLE9BQU8sRUFDTCxTQUFTLEVBQ1QsWUFBWSxFQUVaLFlBQVksRUFDWixXQUFXLEVBQ1gsS0FBSyxFQUdMLE1BQU0sRUFHTixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDOzs7Ozs7Ozs7QUFzQ3hFLE1BQU0sT0FBTyxRQUFRO0lBMEJuQixZQUNVLGlCQUFtQyxFQUNwQyxhQUFzQyxFQUNyQyxpQkFBb0MsRUFDcEMsYUFBMkM7UUFIM0Msc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNwQyxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFDckMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQyxrQkFBYSxHQUFiLGFBQWEsQ0FBOEI7UUE3QnJELFlBQU8sR0FBRyxlQUFlLEVBQUUsQ0FBQztRQUdzQixVQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2xDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7UUFFbkQsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNKLHlCQUFvQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNyRSxTQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ0YsbUJBQWMsR0FBRyxJQUFJ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O3NCQUF4QyxLQUFLO3VCQUFDLHNCQUFzQjtnQkFHVyxtQkFBbUI7c0JBQTFELEtBQUs7dUJBQUMsK0JBQStCO2dCQUc4QixvQkFBb0I7c0JBQXZGLFlBQVk7dUJBQUMsaUNBQWlDO2dCQUVYLGNBQWM7c0JBQWpELFNBQVM7dUJBQUMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgYW5pbWF0ZSwgQW5pbWF0aW9uRXZlbnQsIHN0eWxlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0QmluZGluZyxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZSxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IHVuaXF1ZUlkRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL2lkLWdlbmVyYXRvci9pZC1nZW5lcmF0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBTY3JvbGxpbmdTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbHMvc2Nyb2xsaW5nL3Njcm9sbGluZy1zZXJ2aWNlJztcbmltcG9ydCB7IENsck1vZGFsQ29uZmlndXJhdGlvblNlcnZpY2UgfSBmcm9tICcuL21vZGFsLWNvbmZpZ3VyYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBNb2RhbFN0YWNrU2VydmljZSB9IGZyb20gJy4vbW9kYWwtc3RhY2suc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1tb2RhbCcsXG4gIHZpZXdQcm92aWRlcnM6IFtTY3JvbGxpbmdTZXJ2aWNlXSxcbiAgdGVtcGxhdGVVcmw6ICcuL21vZGFsLmh0bWwnLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICA6aG9zdCB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICB9XG4gICAgICA6aG9zdC5vcGVuIHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lO1xuICAgICAgfVxuICAgIGAsXG4gIF0sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICB0cmlnZ2VyKCdmYWRlTW92ZScsIFtcbiAgICAgIHRyYW5zaXRpb24oJyogPT4gZmFkZURvd24nLCBbXG4gICAgICAgIHN0eWxlKHsgb3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDAsIC0yNSUpJyB9KSxcbiAgICAgICAgYW5pbWF0ZSgnMC4ycyBlYXNlLWluLW91dCcpLFxuICAgICAgXSksXG4gICAgICB0cmFuc2l0aW9uKCdmYWRlRG93biA9PiAqJywgW1xuICAgICAgICBhbmltYXRlKCcwLjJzIGVhc2UtaW4tb3V0Jywgc3R5bGUoeyBvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMCwgLTI1JSknIH0pKSxcbiAgICAgIF0pLFxuICAgICAgdHJhbnNpdGlvbignKiA9PiBmYWRlTGVmdCcsIFtzdHlsZSh7IG9wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgyNSUsIDApJyB9KSwgYW5pbWF0ZSgnMC4ycyBlYXNlLWluLW91dCcpXSksXG4gICAgICB0cmFuc2l0aW9uKCdmYWRlTGVmdCA9PiAqJywgW2FuaW1hdGUoJzAuMnMgZWFzZS1pbi1vdXQnLCBzdHlsZSh7IG9wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgyNSUsIDApJyB9KSldKSxcbiAgICAgIHRyYW5zaXRpb24oJyogPT4gZmFkZVVwJywgW3N0eWxlKHsgb3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDAsIDUwJSknIH0pLCBhbmltYXRlKCcwLjJzIGVhc2UtaW4tb3V0JyldKSxcbiAgICAgIHRyYW5zaXRpb24oJ2ZhZGVVcCA9PiAqJywgW2FuaW1hdGUoJzAuMnMgZWFzZS1pbi1vdXQnLCBzdHlsZSh7IG9wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgwLCA1MCUpJyB9KSldKSxcbiAgICBdKSxcbiAgICB0cmlnZ2VyKCdmYWRlJywgW1xuICAgICAgdHJhbnNpdGlvbigndm9pZCA9PiAqJywgW3N0eWxlKHsgb3BhY2l0eTogMCB9KSwgYW5pbWF0ZSgnMC4ycyBlYXNlLWluLW91dCcsIHN0eWxlKHsgb3BhY2l0eTogMC44NSB9KSldKSxcbiAgICAgIHRyYW5zaXRpb24oJyogPT4gdm9pZCcsIFthbmltYXRlKCcwLjJzIGVhc2UtaW4tb3V0Jywgc3R5bGUoeyBvcGFjaXR5OiAwIH0pKV0pLFxuICAgIF0pLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJNb2RhbCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgbW9kYWxJZCA9IHVuaXF1ZUlkRmFjdG9yeSgpO1xuICBAVmlld0NoaWxkKCd0aXRsZScpIHRpdGxlOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBASW5wdXQoJ2Nsck1vZGFsT3BlbicpIEBIb3N0QmluZGluZygnY2xhc3Mub3BlbicpIF9vcGVuID0gZmFsc2U7XG4gIEBPdXRwdXQoJ2Nsck1vZGFsT3BlbkNoYW5nZScpIF9vcGVuQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gIEBJbnB1dCgnY2xyTW9kYWxDbG9zYWJsZScpIGNsb3NhYmxlID0gdHJ1ZTtcbiAgQElucHV0KCdjbHJNb2RhbENsb3NlQnV0dG9uQXJpYUxhYmVsJykgY2xvc2VCdXR0b25BcmlhTGFiZWwgPSB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5jbG9zZTtcbiAgQElucHV0KCdjbHJNb2RhbFNpemUnKSBzaXplID0gJ21kJztcbiAgQElucHV0KCdjbHJNb2RhbFN0YXRpY0JhY2tkcm9wJykgc3RhdGljQmFja2Ryb3AgPSB0cnVlO1xuICBASW5wdXQoJ2Nsck1vZGFsU2tpcEFuaW1hdGlvbicpIHNraXBBbmltYXRpb24gPSBmYWxzZTtcblxuICBASW5wdXQoJ2Nsck1vZGFsUHJldmVudENsb3NlJykgc3RvcENsb3NlID0gZmFsc2U7XG4gIEBPdXRwdXQoJ2Nsck1vZGFsQWx0ZXJuYXRlQ2xvc2UnKSBhbHRDbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gIEBJbnB1dCgnY2xyTW9kYWxMYWJlbGxlZEJ5SWQnKSBsYWJlbGxlZEJ5OiBzdHJpbmc7XG5cbiAgLy8gcHJlc2VudGx5IHRoaXMgaXMgb25seSB1c2VkIGJ5IGlubGluZSB3aXphcmRzXG4gIEBJbnB1dCgnY2xyTW9kYWxPdmVycmlkZVNjcm9sbFNlcnZpY2UnKSBieXBhc3NTY3JvbGxTZXJ2aWNlID0gZmFsc2U7XG5cbiAgLy8gUHJvdmlkZSByYXcgbW9kYWwgY29udGVudC4gVGhpcyBpcyB1c2VkIGJ5IHRoZSB3aXphcmQgc28gdGhhdCB0aGUgc2FtZSB0ZW1wbGF0ZSBjYW4gYmUgcmVuZGVyZWQgd2l0aCBhbmQgd2l0aG91dCBhIG1vZGFsLlxuICBAQ29udGVudENoaWxkKCdjbHJJbnRlcm5hbE1vZGFsQ29udGVudFRlbXBsYXRlJykgcHJvdGVjdGVkIHJlYWRvbmx5IG1vZGFsQ29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBWaWV3Q2hpbGQoJ2JvZHknKSBwcml2YXRlIHJlYWRvbmx5IGJvZHlFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9zY3JvbGxpbmdTZXJ2aWNlOiBTY3JvbGxpbmdTZXJ2aWNlLFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIG1vZGFsU3RhY2tTZXJ2aWNlOiBNb2RhbFN0YWNrU2VydmljZSxcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb246IENsck1vZGFsQ29uZmlndXJhdGlvblNlcnZpY2VcbiAgKSB7fVxuXG4gIGdldCBmYWRlTW92ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnNraXBBbmltYXRpb24gPyAnJyA6IHRoaXMuY29uZmlndXJhdGlvbi5mYWRlTW92ZTtcbiAgfVxuICBzZXQgZmFkZU1vdmUobW92ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5jb25maWd1cmF0aW9uLmZhZGVNb3ZlID0gbW92ZTtcbiAgfVxuXG4gIGdldCBiYWNrZHJvcCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uLmJhY2tkcm9wO1xuICB9XG5cbiAgLy8gRGV0ZWN0IHdoZW4gX29wZW4gaXMgc2V0IHRvIHRydWUgYW5kIHNldCBuby1zY3JvbGxpbmcgdG8gdHJ1ZVxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiB7IFtwcm9wTmFtZTogc3RyaW5nXTogU2ltcGxlQ2hhbmdlIH0pOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuYnlwYXNzU2Nyb2xsU2VydmljZSAmJiBjaGFuZ2VzICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjaGFuZ2VzLCAnX29wZW4nKSkge1xuICAgICAgaWYgKGNoYW5nZXMuX29wZW4uY3VycmVudFZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3Njcm9sbGluZ1NlcnZpY2Uuc3RvcFNjcm9sbGluZygpO1xuICAgICAgICB0aGlzLm1vZGFsU3RhY2tTZXJ2aWNlLnRyYWNrTW9kYWxPcGVuKHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsaW5nU2VydmljZS5yZXN1bWVTY3JvbGxpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLl9zY3JvbGxpbmdTZXJ2aWNlLnJlc3VtZVNjcm9sbGluZygpO1xuICB9XG5cbiAgb3BlbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3Blbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9vcGVuID0gdHJ1ZTtcbiAgICB0aGlzLl9vcGVuQ2hhbmdlZC5lbWl0KHRydWUpO1xuICAgIHRoaXMubW9kYWxTdGFja1NlcnZpY2UudHJhY2tNb2RhbE9wZW4odGhpcyk7XG4gIH1cblxuICBiYWNrZHJvcENsaWNrKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN0YXRpY0JhY2tkcm9wKSB7XG4gICAgICB0aGlzLnRpdGxlLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdG9wQ2xvc2UpIHtcbiAgICAgIHRoaXMuYWx0Q2xvc2UuZW1pdChmYWxzZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5jbG9zYWJsZSB8fCAhdGhpcy5fb3Blbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9vcGVuID0gZmFsc2U7XG4gIH1cblxuICBmYWRlRG9uZShlOiBBbmltYXRpb25FdmVudCkge1xuICAgIGlmIChlLnRvU3RhdGUgPT09ICd2b2lkJykge1xuICAgICAgLy8gVE9ETzogSW52ZXN0aWdhdGUgaWYgd2UgY2FuIGRlY291cGxlIGZyb20gYW5pbWF0aW9uIGV2ZW50c1xuICAgICAgdGhpcy5fb3BlbkNoYW5nZWQuZW1pdChmYWxzZSk7XG4gICAgICB0aGlzLm1vZGFsU3RhY2tTZXJ2aWNlLnRyYWNrTW9kYWxDbG9zZSh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBzY3JvbGxUb3AoKSB7XG4gICAgdGhpcy5ib2R5RWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbFRvKDAsIDApO1xuICB9XG59XG4iLCI8IS0tXG4gIH4gQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gIH4gVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICB+IFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gIH4gVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICAtLT5cblxuPGRpdiAqbmdJZj1cIl9vcGVuXCIgY2xhc3M9XCJtb2RhbFwiIFtjbGFzcy5tb2RhbC1mdWxsLXNjcmVlbl09XCJzaXplID09ICdmdWxsLXNjcmVlbidcIj5cbiAgPCEtLWZpeG1lOiByZXZpc2l0IHdoZW4gbmdDbGFzcyB3b3JrcyB3aXRoIGV4aXQgYW5pbWF0aW9uLS0+XG4gIDxkaXZcbiAgICBjZGtUcmFwRm9jdXNcbiAgICBbY2RrVHJhcEZvY3VzQXV0b0NhcHR1cmVdPVwidHJ1ZVwiXG4gICAgW0BmYWRlTW92ZV09XCJmYWRlTW92ZVwiXG4gICAgKEBmYWRlTW92ZS5kb25lKT1cImZhZGVEb25lKCRldmVudClcIlxuICAgIGNsYXNzPVwibW9kYWwtZGlhbG9nXCJcbiAgICBbY2xhc3MubW9kYWwtc21dPVwic2l6ZSA9PSAnc20nXCJcbiAgICBbY2xhc3MubW9kYWwtbGddPVwic2l6ZSA9PSAnbGcnXCJcbiAgICBbY2xhc3MubW9kYWwteGxdPVwic2l6ZSA9PSAneGwnXCJcbiAgICByb2xlPVwiZGlhbG9nXCJcbiAgICBhcmlhLW1vZGFsPVwidHJ1ZVwiXG4gICAgW2F0dHIuYXJpYS1oaWRkZW5dPVwiIV9vcGVuXCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwibGFiZWxsZWRCeSB8fCBtb2RhbElkXCJcbiAgPlxuICAgIDxkaXYgY2xhc3M9XCJjbHItc3Itb25seVwiPnt7Y29tbW9uU3RyaW5ncy5rZXlzLm1vZGFsQ29udGVudFN0YXJ0fX08L2Rpdj5cbiAgICA8IS0tIFRoaXMgd2l6YXJkIGlzIHRpZ2h0bHkgY291cGxlZCB0byB0aGUgbW9kYWwgc3R5bGVzLCBzbyBjaGFuZ2VzIGhlcmUgY291bGQgcmVxdWlyZSBjaGFuZ2VzIGluIHRoZSB3aXphcmQuIC0tPlxuICAgIDxkaXYgKm5nSWY9XCIhbW9kYWxDb250ZW50VGVtcGxhdGU7IGVsc2UgbW9kYWxDb250ZW50VGVtcGxhdGVcIiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQtd3JhcHBlclwiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlci0tYWNjZXNzaWJsZVwiPlxuICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIi5sZWFkaW5nLWJ1dHRvblwiPjwvbmctY29udGVudD5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtdGl0bGUtd3JhcHBlclwiICN0aXRsZSBbaWRdPVwibW9kYWxJZFwiIGNka0ZvY3VzSW5pdGlhbCB0YWJpbmRleD1cIi0xXCI+XG4gICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCIubW9kYWwtdGl0bGVcIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNsb3NlQnV0dG9uQXJpYUxhYmVsIHx8IGNvbW1vblN0cmluZ3Mua2V5cy5jbG9zZVwiXG4gICAgICAgICAgICBjbGFzcz1cImNsb3NlXCJcbiAgICAgICAgICAgICpuZ0lmPVwiY2xvc2FibGVcIlxuICAgICAgICAgICAgKGNsaWNrKT1cImNsb3NlKClcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxjZHMtaWNvbiBzaGFwZT1cIndpbmRvdy1jbG9zZVwiPjwvY2RzLWljb24+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2ICNib2R5IGNsYXNzPVwibW9kYWwtYm9keS13cmFwcGVyXCI+XG4gICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiLm1vZGFsLWJvZHlcIj48L25nLWNvbnRlbnQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCIubW9kYWwtZm9vdGVyXCI+PC9uZy1jb250ZW50PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3tjb21tb25TdHJpbmdzLmtleXMubW9kYWxDb250ZW50RW5kfX08L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgW0BmYWRlXSAqbmdJZj1cImJhY2tkcm9wXCIgY2xhc3M9XCJtb2RhbC1iYWNrZHJvcFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIChjbGljayk9XCJiYWNrZHJvcENsaWNrKClcIj48L2Rpdj5cbjwvZGl2PlxuIl19