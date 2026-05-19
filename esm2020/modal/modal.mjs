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
ClrModal.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ClrModal, deps: [{ token: i1.ScrollingService }, { token: i2.ClrCommonStringsService }, { token: i3.ModalStackService }, { token: i4.ClrModalConfigurationService }], target: i0.ɵɵFactoryTarget.Component });
ClrModal.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.10", type: ClrModal, selector: "clr-modal", inputs: { _open: ["clrModalOpen", "_open"], closable: ["clrModalClosable", "closable"], closeButtonAriaLabel: ["clrModalCloseButtonAriaLabel", "closeButtonAriaLabel"], size: ["clrModalSize", "size"], staticBackdrop: ["clrModalStaticBackdrop", "staticBackdrop"], skipAnimation: ["clrModalSkipAnimation", "skipAnimation"], stopClose: ["clrModalPreventClose", "stopClose"], labelledBy: ["clrModalLabelledById", "labelledBy"], bypassScrollService: ["clrModalOverrideScrollService", "bypassScrollService"] }, outputs: { _openChanged: "clrModalOpenChange", altClose: "clrModalAlternateClose" }, host: { properties: { "class.open": "this._open" } }, queries: [{ propertyName: "modalContentTemplate", first: true, predicate: ["clrInternalModalContentTemplate"], descendants: true }], viewQueries: [{ propertyName: "title", first: true, predicate: ["title"], descendants: true }, { propertyName: "bodyElementRef", first: true, predicate: ["body"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div *ngIf=\"_open\" class=\"modal\" [class.modal-full-screen]=\"size == 'full-screen'\">\n  <!--fixme: revisit when ngClass works with exit animation-->\n  <div\n    cdkTrapFocus\n    [cdkTrapFocusAutoCapture]=\"true\"\n    [@fadeMove]=\"fadeMove\"\n    (@fadeMove.done)=\"fadeDone($event)\"\n    class=\"modal-dialog\"\n    [class.modal-sm]=\"size == 'sm'\"\n    [class.modal-lg]=\"size == 'lg'\"\n    [class.modal-xl]=\"size == 'xl'\"\n    role=\"dialog\"\n    aria-modal=\"true\"\n    [attr.aria-hidden]=\"!_open\"\n    [attr.aria-labelledby]=\"labelledBy || modalId\"\n  >\n    <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n    <!-- This wizard is tightly coupled to the modal styles, so changes here could require changes in the wizard. -->\n    <!--\n      Use an explicit *ngTemplateOutlet when a content template is provided.\n      The `*ngIf-else` mechanism with a template ref subtly breaks content projection\n      through that template in Angular 21 (wizard <ng-content> slots resolve empty),\n      whereas a direct [ngTemplateOutlet] keeps the projection chain intact.\n    -->\n    <div *ngIf=\"!modalContentTemplate\" class=\"modal-content-wrapper\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header--accessible\">\n          <ng-content select=\".leading-button\"></ng-content>\n          <div class=\"modal-title-wrapper\" #title [id]=\"modalId\" cdkFocusInitial tabindex=\"-1\">\n            <ng-content select=\".modal-title\"></ng-content>\n          </div>\n          <button\n            type=\"button\"\n            [attr.aria-label]=\"closeButtonAriaLabel || commonStrings.keys.close\"\n            class=\"close\"\n            *ngIf=\"closable\"\n            (click)=\"close()\"\n          >\n            <cds-icon shape=\"window-close\"></cds-icon>\n          </button>\n        </div>\n        <div #body class=\"modal-body-wrapper\">\n          <ng-content select=\".modal-body\"></ng-content>\n        </div>\n        <ng-content select=\".modal-footer\"></ng-content>\n      </div>\n    </div>\n    <ng-container *ngIf=\"modalContentTemplate\" [ngTemplateOutlet]=\"modalContentTemplate\"></ng-container>\n    <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n  </div>\n  <div [@fade] *ngIf=\"backdrop\" class=\"modal-backdrop\" aria-hidden=\"true\" (click)=\"backdropClick()\"></div>\n</div>\n", styles: [":host{display:none}:host.open{display:inline}\n"], dependencies: [{ kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i6.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }, { kind: "directive", type: i7.CdsIconCustomTag, selector: "cds-icon" }], viewProviders: [ScrollingService], animations: [
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ClrModal, decorators: [{
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
                    ], template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div *ngIf=\"_open\" class=\"modal\" [class.modal-full-screen]=\"size == 'full-screen'\">\n  <!--fixme: revisit when ngClass works with exit animation-->\n  <div\n    cdkTrapFocus\n    [cdkTrapFocusAutoCapture]=\"true\"\n    [@fadeMove]=\"fadeMove\"\n    (@fadeMove.done)=\"fadeDone($event)\"\n    class=\"modal-dialog\"\n    [class.modal-sm]=\"size == 'sm'\"\n    [class.modal-lg]=\"size == 'lg'\"\n    [class.modal-xl]=\"size == 'xl'\"\n    role=\"dialog\"\n    aria-modal=\"true\"\n    [attr.aria-hidden]=\"!_open\"\n    [attr.aria-labelledby]=\"labelledBy || modalId\"\n  >\n    <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n    <!-- This wizard is tightly coupled to the modal styles, so changes here could require changes in the wizard. -->\n    <!--\n      Use an explicit *ngTemplateOutlet when a content template is provided.\n      The `*ngIf-else` mechanism with a template ref subtly breaks content projection\n      through that template in Angular 21 (wizard <ng-content> slots resolve empty),\n      whereas a direct [ngTemplateOutlet] keeps the projection chain intact.\n    -->\n    <div *ngIf=\"!modalContentTemplate\" class=\"modal-content-wrapper\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header--accessible\">\n          <ng-content select=\".leading-button\"></ng-content>\n          <div class=\"modal-title-wrapper\" #title [id]=\"modalId\" cdkFocusInitial tabindex=\"-1\">\n            <ng-content select=\".modal-title\"></ng-content>\n          </div>\n          <button\n            type=\"button\"\n            [attr.aria-label]=\"closeButtonAriaLabel || commonStrings.keys.close\"\n            class=\"close\"\n            *ngIf=\"closable\"\n            (click)=\"close()\"\n          >\n            <cds-icon shape=\"window-close\"></cds-icon>\n          </button>\n        </div>\n        <div #body class=\"modal-body-wrapper\">\n          <ng-content select=\".modal-body\"></ng-content>\n        </div>\n        <ng-content select=\".modal-footer\"></ng-content>\n      </div>\n    </div>\n    <ng-container *ngIf=\"modalContentTemplate\" [ngTemplateOutlet]=\"modalContentTemplate\"></ng-container>\n    <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n  </div>\n  <div [@fade] *ngIf=\"backdrop\" class=\"modal-backdrop\" aria-hidden=\"true\" (click)=\"backdropClick()\"></div>\n</div>\n", styles: [":host{display:none}:host.open{display:inline}\n"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9tb2RhbC9tb2RhbC50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL21vZGFsL21vZGFsLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFrQixLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzFGLE9BQU8sRUFDTCxTQUFTLEVBQ1QsWUFBWSxFQUVaLFlBQVksRUFDWixXQUFXLEVBQ1gsS0FBSyxFQUdMLE1BQU0sRUFHTixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDOzs7Ozs7Ozs7QUFzQ3hFLE1BQU0sT0FBTyxRQUFRO0lBMEJuQixZQUNVLGlCQUFtQyxFQUNwQyxhQUFzQyxFQUNyQyxpQkFBb0MsRUFDcEMsYUFBMkM7UUFIM0Msc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNwQyxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFDckMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQyxrQkFBYSxHQUFiLGFBQWEsQ0FBOEI7UUE3QnJELFlBQU8sR0FBRyxlQUFlLEVBQUUsQ0FBQztRQUdzQixVQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2xDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7UUFFbkQsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNKLHlCQUFvQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNyRSxTQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ0YsbUJBQWMsR0FBRyxJQUFJ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VTtzQkFBeEMsS0FBSzt1QkFBQyxzQkFBc0I7Z0JBR1csbUJBQW1CO3NCQUExRCxLQUFLO3VCQUFDLCtCQUErQjtnQkFHOEIsb0JBQW9CO3NCQUF2RixZQUFZO3VCQUFDLGlDQUFpQztnQkFFWCxjQUFjO3NCQUFqRCxTQUFTO3VCQUFDLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IGFuaW1hdGUsIEFuaW1hdGlvbkV2ZW50LCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2UsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uL3V0aWxzL2kxOG4vY29tbW9uLXN0cmluZ3Muc2VydmljZSc7XG5pbXBvcnQgeyB1bmlxdWVJZEZhY3RvcnkgfSBmcm9tICcuLi91dGlscy9pZC1nZW5lcmF0b3IvaWQtZ2VuZXJhdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgU2Nyb2xsaW5nU2VydmljZSB9IGZyb20gJy4uL3V0aWxzL3Njcm9sbGluZy9zY3JvbGxpbmctc2VydmljZSc7XG5pbXBvcnQgeyBDbHJNb2RhbENvbmZpZ3VyYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9tb2RhbC1jb25maWd1cmF0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgTW9kYWxTdGFja1NlcnZpY2UgfSBmcm9tICcuL21vZGFsLXN0YWNrLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItbW9kYWwnLFxuICB2aWV3UHJvdmlkZXJzOiBbU2Nyb2xsaW5nU2VydmljZV0sXG4gIHRlbXBsYXRlVXJsOiAnLi9tb2RhbC5odG1sJyxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAgICAgOmhvc3Qge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgfVxuICAgICAgOmhvc3Qub3BlbiB7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZTtcbiAgICAgIH1cbiAgICBgLFxuICBdLFxuICBhbmltYXRpb25zOiBbXG4gICAgdHJpZ2dlcignZmFkZU1vdmUnLCBbXG4gICAgICB0cmFuc2l0aW9uKCcqID0+IGZhZGVEb3duJywgW1xuICAgICAgICBzdHlsZSh7IG9wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgwLCAtMjUlKScgfSksXG4gICAgICAgIGFuaW1hdGUoJzAuMnMgZWFzZS1pbi1vdXQnKSxcbiAgICAgIF0pLFxuICAgICAgdHJhbnNpdGlvbignZmFkZURvd24gPT4gKicsIFtcbiAgICAgICAgYW5pbWF0ZSgnMC4ycyBlYXNlLWluLW91dCcsIHN0eWxlKHsgb3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDAsIC0yNSUpJyB9KSksXG4gICAgICBdKSxcbiAgICAgIHRyYW5zaXRpb24oJyogPT4gZmFkZUxlZnQnLCBbc3R5bGUoeyBvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMjUlLCAwKScgfSksIGFuaW1hdGUoJzAuMnMgZWFzZS1pbi1vdXQnKV0pLFxuICAgICAgdHJhbnNpdGlvbignZmFkZUxlZnQgPT4gKicsIFthbmltYXRlKCcwLjJzIGVhc2UtaW4tb3V0Jywgc3R5bGUoeyBvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMjUlLCAwKScgfSkpXSksXG4gICAgICB0cmFuc2l0aW9uKCcqID0+IGZhZGVVcCcsIFtzdHlsZSh7IG9wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgwLCA1MCUpJyB9KSwgYW5pbWF0ZSgnMC4ycyBlYXNlLWluLW91dCcpXSksXG4gICAgICB0cmFuc2l0aW9uKCdmYWRlVXAgPT4gKicsIFthbmltYXRlKCcwLjJzIGVhc2UtaW4tb3V0Jywgc3R5bGUoeyBvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMCwgNTAlKScgfSkpXSksXG4gICAgXSksXG4gICAgdHJpZ2dlcignZmFkZScsIFtcbiAgICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gKicsIFtzdHlsZSh7IG9wYWNpdHk6IDAgfSksIGFuaW1hdGUoJzAuMnMgZWFzZS1pbi1vdXQnLCBzdHlsZSh7IG9wYWNpdHk6IDAuODUgfSkpXSksXG4gICAgICB0cmFuc2l0aW9uKCcqID0+IHZvaWQnLCBbYW5pbWF0ZSgnMC4ycyBlYXNlLWluLW91dCcsIHN0eWxlKHsgb3BhY2l0eTogMCB9KSldKSxcbiAgICBdKSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyTW9kYWwgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIG1vZGFsSWQgPSB1bmlxdWVJZEZhY3RvcnkoKTtcbiAgQFZpZXdDaGlsZCgndGl0bGUnKSB0aXRsZTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgQElucHV0KCdjbHJNb2RhbE9wZW4nKSBASG9zdEJpbmRpbmcoJ2NsYXNzLm9wZW4nKSBfb3BlbiA9IGZhbHNlO1xuICBAT3V0cHV0KCdjbHJNb2RhbE9wZW5DaGFuZ2UnKSBfb3BlbkNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKTtcblxuICBASW5wdXQoJ2Nsck1vZGFsQ2xvc2FibGUnKSBjbG9zYWJsZSA9IHRydWU7XG4gIEBJbnB1dCgnY2xyTW9kYWxDbG9zZUJ1dHRvbkFyaWFMYWJlbCcpIGNsb3NlQnV0dG9uQXJpYUxhYmVsID0gdGhpcy5jb21tb25TdHJpbmdzLmtleXMuY2xvc2U7XG4gIEBJbnB1dCgnY2xyTW9kYWxTaXplJykgc2l6ZSA9ICdtZCc7XG4gIEBJbnB1dCgnY2xyTW9kYWxTdGF0aWNCYWNrZHJvcCcpIHN0YXRpY0JhY2tkcm9wID0gdHJ1ZTtcbiAgQElucHV0KCdjbHJNb2RhbFNraXBBbmltYXRpb24nKSBza2lwQW5pbWF0aW9uID0gZmFsc2U7XG5cbiAgQElucHV0KCdjbHJNb2RhbFByZXZlbnRDbG9zZScpIHN0b3BDbG9zZSA9IGZhbHNlO1xuICBAT3V0cHV0KCdjbHJNb2RhbEFsdGVybmF0ZUNsb3NlJykgYWx0Q2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKTtcblxuICBASW5wdXQoJ2Nsck1vZGFsTGFiZWxsZWRCeUlkJykgbGFiZWxsZWRCeTogc3RyaW5nO1xuXG4gIC8vIHByZXNlbnRseSB0aGlzIGlzIG9ubHkgdXNlZCBieSBpbmxpbmUgd2l6YXJkc1xuICBASW5wdXQoJ2Nsck1vZGFsT3ZlcnJpZGVTY3JvbGxTZXJ2aWNlJykgYnlwYXNzU2Nyb2xsU2VydmljZSA9IGZhbHNlO1xuXG4gIC8vIFByb3ZpZGUgcmF3IG1vZGFsIGNvbnRlbnQuIFRoaXMgaXMgdXNlZCBieSB0aGUgd2l6YXJkIHNvIHRoYXQgdGhlIHNhbWUgdGVtcGxhdGUgY2FuIGJlIHJlbmRlcmVkIHdpdGggYW5kIHdpdGhvdXQgYSBtb2RhbC5cbiAgQENvbnRlbnRDaGlsZCgnY2xySW50ZXJuYWxNb2RhbENvbnRlbnRUZW1wbGF0ZScpIHByb3RlY3RlZCByZWFkb25seSBtb2RhbENvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAVmlld0NoaWxkKCdib2R5JykgcHJpdmF0ZSByZWFkb25seSBib2R5RWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfc2Nyb2xsaW5nU2VydmljZTogU2Nyb2xsaW5nU2VydmljZSxcbiAgICBwdWJsaWMgY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBtb2RhbFN0YWNrU2VydmljZTogTW9kYWxTdGFja1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uOiBDbHJNb2RhbENvbmZpZ3VyYXRpb25TZXJ2aWNlXG4gICkge31cblxuICBnZXQgZmFkZU1vdmUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5za2lwQW5pbWF0aW9uID8gJycgOiB0aGlzLmNvbmZpZ3VyYXRpb24uZmFkZU1vdmU7XG4gIH1cbiAgc2V0IGZhZGVNb3ZlKG1vdmU6IHN0cmluZykge1xuICAgIHRoaXMuY29uZmlndXJhdGlvbi5mYWRlTW92ZSA9IG1vdmU7XG4gIH1cblxuICBnZXQgYmFja2Ryb3AoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvbi5iYWNrZHJvcDtcbiAgfVxuXG4gIC8vIERldGVjdCB3aGVuIF9vcGVuIGlzIHNldCB0byB0cnVlIGFuZCBzZXQgbm8tc2Nyb2xsaW5nIHRvIHRydWVcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBbcHJvcE5hbWU6IHN0cmluZ106IFNpbXBsZUNoYW5nZSB9KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmJ5cGFzc1Njcm9sbFNlcnZpY2UgJiYgY2hhbmdlcyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY2hhbmdlcywgJ19vcGVuJykpIHtcbiAgICAgIGlmIChjaGFuZ2VzLl9vcGVuLmN1cnJlbnRWYWx1ZSkge1xuICAgICAgICB0aGlzLl9zY3JvbGxpbmdTZXJ2aWNlLnN0b3BTY3JvbGxpbmcoKTtcbiAgICAgICAgdGhpcy5tb2RhbFN0YWNrU2VydmljZS50cmFja01vZGFsT3Blbih0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3Njcm9sbGluZ1NlcnZpY2UucmVzdW1lU2Nyb2xsaW5nKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fc2Nyb2xsaW5nU2VydmljZS5yZXN1bWVTY3JvbGxpbmcoKTtcbiAgfVxuXG4gIG9wZW4oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29wZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fb3BlbiA9IHRydWU7XG4gICAgdGhpcy5fb3BlbkNoYW5nZWQuZW1pdCh0cnVlKTtcbiAgICB0aGlzLm1vZGFsU3RhY2tTZXJ2aWNlLnRyYWNrTW9kYWxPcGVuKHRoaXMpO1xuICB9XG5cbiAgYmFja2Ryb3BDbGljaygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdGF0aWNCYWNrZHJvcCkge1xuICAgICAgdGhpcy50aXRsZS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3RvcENsb3NlKSB7XG4gICAgICB0aGlzLmFsdENsb3NlLmVtaXQoZmFsc2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuY2xvc2FibGUgfHwgIXRoaXMuX29wZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fb3BlbiA9IGZhbHNlO1xuICB9XG5cbiAgZmFkZURvbmUoZTogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICBpZiAoZS50b1N0YXRlID09PSAndm9pZCcpIHtcbiAgICAgIC8vIFRPRE86IEludmVzdGlnYXRlIGlmIHdlIGNhbiBkZWNvdXBsZSBmcm9tIGFuaW1hdGlvbiBldmVudHNcbiAgICAgIHRoaXMuX29wZW5DaGFuZ2VkLmVtaXQoZmFsc2UpO1xuICAgICAgdGhpcy5tb2RhbFN0YWNrU2VydmljZS50cmFja01vZGFsQ2xvc2UodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgc2Nyb2xsVG9wKCkge1xuICAgIHRoaXMuYm9keUVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxUbygwLCAwKTtcbiAgfVxufVxuIiwiPCEtLVxuICB+IENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICB+IFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAgfiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICB+IFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAgLS0+XG5cbjxkaXYgKm5nSWY9XCJfb3BlblwiIGNsYXNzPVwibW9kYWxcIiBbY2xhc3MubW9kYWwtZnVsbC1zY3JlZW5dPVwic2l6ZSA9PSAnZnVsbC1zY3JlZW4nXCI+XG4gIDwhLS1maXhtZTogcmV2aXNpdCB3aGVuIG5nQ2xhc3Mgd29ya3Mgd2l0aCBleGl0IGFuaW1hdGlvbi0tPlxuICA8ZGl2XG4gICAgY2RrVHJhcEZvY3VzXG4gICAgW2Nka1RyYXBGb2N1c0F1dG9DYXB0dXJlXT1cInRydWVcIlxuICAgIFtAZmFkZU1vdmVdPVwiZmFkZU1vdmVcIlxuICAgIChAZmFkZU1vdmUuZG9uZSk9XCJmYWRlRG9uZSgkZXZlbnQpXCJcbiAgICBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiXG4gICAgW2NsYXNzLm1vZGFsLXNtXT1cInNpemUgPT0gJ3NtJ1wiXG4gICAgW2NsYXNzLm1vZGFsLWxnXT1cInNpemUgPT0gJ2xnJ1wiXG4gICAgW2NsYXNzLm1vZGFsLXhsXT1cInNpemUgPT0gJ3hsJ1wiXG4gICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgYXJpYS1tb2RhbD1cInRydWVcIlxuICAgIFthdHRyLmFyaWEtaGlkZGVuXT1cIiFfb3BlblwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImxhYmVsbGVkQnkgfHwgbW9kYWxJZFwiXG4gID5cbiAgICA8ZGl2IGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57e2NvbW1vblN0cmluZ3Mua2V5cy5tb2RhbENvbnRlbnRTdGFydH19PC9kaXY+XG4gICAgPCEtLSBUaGlzIHdpemFyZCBpcyB0aWdodGx5IGNvdXBsZWQgdG8gdGhlIG1vZGFsIHN0eWxlcywgc28gY2hhbmdlcyBoZXJlIGNvdWxkIHJlcXVpcmUgY2hhbmdlcyBpbiB0aGUgd2l6YXJkLiAtLT5cbiAgICA8IS0tXG4gICAgICBVc2UgYW4gZXhwbGljaXQgKm5nVGVtcGxhdGVPdXRsZXQgd2hlbiBhIGNvbnRlbnQgdGVtcGxhdGUgaXMgcHJvdmlkZWQuXG4gICAgICBUaGUgYCpuZ0lmLWVsc2VgIG1lY2hhbmlzbSB3aXRoIGEgdGVtcGxhdGUgcmVmIHN1YnRseSBicmVha3MgY29udGVudCBwcm9qZWN0aW9uXG4gICAgICB0aHJvdWdoIHRoYXQgdGVtcGxhdGUgaW4gQW5ndWxhciAyMSAod2l6YXJkIDxuZy1jb250ZW50PiBzbG90cyByZXNvbHZlIGVtcHR5KSxcbiAgICAgIHdoZXJlYXMgYSBkaXJlY3QgW25nVGVtcGxhdGVPdXRsZXRdIGtlZXBzIHRoZSBwcm9qZWN0aW9uIGNoYWluIGludGFjdC5cbiAgICAtLT5cbiAgICA8ZGl2ICpuZ0lmPVwiIW1vZGFsQ29udGVudFRlbXBsYXRlXCIgY2xhc3M9XCJtb2RhbC1jb250ZW50LXdyYXBwZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXItLWFjY2Vzc2libGVcIj5cbiAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCIubGVhZGluZy1idXR0b25cIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLXRpdGxlLXdyYXBwZXJcIiAjdGl0bGUgW2lkXT1cIm1vZGFsSWRcIiBjZGtGb2N1c0luaXRpYWwgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiLm1vZGFsLXRpdGxlXCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjbG9zZUJ1dHRvbkFyaWFMYWJlbCB8fCBjb21tb25TdHJpbmdzLmtleXMuY2xvc2VcIlxuICAgICAgICAgICAgY2xhc3M9XCJjbG9zZVwiXG4gICAgICAgICAgICAqbmdJZj1cImNsb3NhYmxlXCJcbiAgICAgICAgICAgIChjbGljayk9XCJjbG9zZSgpXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJ3aW5kb3ctY2xvc2VcIj48L2Nkcy1pY29uPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiAjYm9keSBjbGFzcz1cIm1vZGFsLWJvZHktd3JhcHBlclwiPlxuICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIi5tb2RhbC1ib2R5XCI+PC9uZy1jb250ZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiLm1vZGFsLWZvb3RlclwiPjwvbmctY29udGVudD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJtb2RhbENvbnRlbnRUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm1vZGFsQ29udGVudFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgPGRpdiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3tjb21tb25TdHJpbmdzLmtleXMubW9kYWxDb250ZW50RW5kfX08L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgW0BmYWRlXSAqbmdJZj1cImJhY2tkcm9wXCIgY2xhc3M9XCJtb2RhbC1iYWNrZHJvcFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIChjbGljayk9XCJiYWNrZHJvcENsaWNrKClcIj48L2Rpdj5cbjwvZGl2PlxuIl19