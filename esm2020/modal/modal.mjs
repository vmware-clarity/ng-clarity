/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostBinding, Input, Output, ViewChild, } from '@angular/core';
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
ClrModal.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrModal, selector: "clr-modal", inputs: { _open: ["clrModalOpen", "_open"], closable: ["clrModalClosable", "closable"], closeButtonAriaLabel: ["clrModalCloseButtonAriaLabel", "closeButtonAriaLabel"], size: ["clrModalSize", "size"], staticBackdrop: ["clrModalStaticBackdrop", "staticBackdrop"], skipAnimation: ["clrModalSkipAnimation", "skipAnimation"], stopClose: ["clrModalPreventClose", "stopClose"], labelledBy: ["clrModalLabelledById", "labelledBy"], bypassScrollService: ["clrModalOverrideScrollService", "bypassScrollService"] }, outputs: { _openChanged: "clrModalOpenChange", altClose: "clrModalAlternateClose" }, host: { properties: { "class.open": "this._open" } }, viewQueries: [{ propertyName: "title", first: true, predicate: ["title"], descendants: true }, { propertyName: "bodyElementRef", first: true, predicate: ["body"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div *ngIf=\"_open\" class=\"modal\" [class.modal-full-screen]=\"size == 'full-screen'\">\n  <!--fixme: revisit when ngClass works with exit animation-->\n  <div\n    cdkTrapFocus\n    [cdkTrapFocusAutoCapture]=\"true\"\n    [@fadeMove]=\"fadeMove\"\n    (@fadeMove.done)=\"fadeDone($event)\"\n    class=\"modal-dialog\"\n    [class.modal-sm]=\"size == 'sm'\"\n    [class.modal-lg]=\"size == 'lg'\"\n    [class.modal-xl]=\"size == 'xl'\"\n    role=\"dialog\"\n    aria-modal=\"true\"\n    [attr.aria-hidden]=\"!_open\"\n    [attr.aria-labelledby]=\"labelledBy || modalId\"\n  >\n    <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n    <div class=\"modal-content-wrapper\">\n      <!-- only used in wizards -->\n      <ng-content select=\".modal-nav\"></ng-content>\n\n      <div class=\"modal-content\">\n        <div class=\"modal-header--accessible\">\n          <ng-content select=\".leading-button\"></ng-content>\n          <div class=\"modal-title-wrapper\" #title [id]=\"modalId\" cdkFocusInitial tabindex=\"-1\">\n            <ng-content select=\".modal-title\"></ng-content>\n          </div>\n          <button\n            type=\"button\"\n            [attr.aria-label]=\"closeButtonAriaLabel || commonStrings.keys.close\"\n            class=\"close\"\n            *ngIf=\"closable\"\n            (click)=\"close()\"\n          >\n            <cds-icon shape=\"window-close\"></cds-icon>\n          </button>\n        </div>\n        <div #body class=\"modal-body-wrapper\">\n          <ng-content select=\".modal-body\"></ng-content>\n        </div>\n        <ng-content select=\".modal-footer\"></ng-content>\n      </div>\n    </div>\n    <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n  </div>\n</div>\n\n<div [@fade] *ngIf=\"backdrop\" class=\"modal-backdrop\" aria-hidden=\"true\" (click)=\"backdropClick()\"></div>\n", styles: [":host{display:none}:host.open{display:inline}\n"], dependencies: [{ kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }, { kind: "directive", type: i7.CdsIconCustomTag, selector: "cds-icon" }], viewProviders: [ScrollingService], animations: [
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
                        ]),
                        trigger('fade', [
                            transition('void => *', [style({ opacity: 0 }), animate('0.2s ease-in-out', style({ opacity: 0.85 }))]),
                            transition('* => void', [animate('0.2s ease-in-out', style({ opacity: 0 }))]),
                        ]),
                    ], template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div *ngIf=\"_open\" class=\"modal\" [class.modal-full-screen]=\"size == 'full-screen'\">\n  <!--fixme: revisit when ngClass works with exit animation-->\n  <div\n    cdkTrapFocus\n    [cdkTrapFocusAutoCapture]=\"true\"\n    [@fadeMove]=\"fadeMove\"\n    (@fadeMove.done)=\"fadeDone($event)\"\n    class=\"modal-dialog\"\n    [class.modal-sm]=\"size == 'sm'\"\n    [class.modal-lg]=\"size == 'lg'\"\n    [class.modal-xl]=\"size == 'xl'\"\n    role=\"dialog\"\n    aria-modal=\"true\"\n    [attr.aria-hidden]=\"!_open\"\n    [attr.aria-labelledby]=\"labelledBy || modalId\"\n  >\n    <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n    <div class=\"modal-content-wrapper\">\n      <!-- only used in wizards -->\n      <ng-content select=\".modal-nav\"></ng-content>\n\n      <div class=\"modal-content\">\n        <div class=\"modal-header--accessible\">\n          <ng-content select=\".leading-button\"></ng-content>\n          <div class=\"modal-title-wrapper\" #title [id]=\"modalId\" cdkFocusInitial tabindex=\"-1\">\n            <ng-content select=\".modal-title\"></ng-content>\n          </div>\n          <button\n            type=\"button\"\n            [attr.aria-label]=\"closeButtonAriaLabel || commonStrings.keys.close\"\n            class=\"close\"\n            *ngIf=\"closable\"\n            (click)=\"close()\"\n          >\n            <cds-icon shape=\"window-close\"></cds-icon>\n          </button>\n        </div>\n        <div #body class=\"modal-body-wrapper\">\n          <ng-content select=\".modal-body\"></ng-content>\n        </div>\n        <ng-content select=\".modal-footer\"></ng-content>\n      </div>\n    </div>\n    <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n  </div>\n</div>\n\n<div [@fade] *ngIf=\"backdrop\" class=\"modal-backdrop\" aria-hidden=\"true\" (click)=\"backdropClick()\"></div>\n", styles: [":host{display:none}:host.open{display:inline}\n"] }]
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
            }], bodyElementRef: [{
                type: ViewChild,
                args: ['body']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9tb2RhbC9tb2RhbC50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL21vZGFsL21vZGFsLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFrQixLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzFGLE9BQU8sRUFDTCxTQUFTLEVBRVQsWUFBWSxFQUNaLFdBQVcsRUFDWCxLQUFLLEVBR0wsTUFBTSxFQUVOLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7Ozs7Ozs7OztBQW9DeEUsTUFBTSxPQUFPLFFBQVE7SUF1Qm5CLFlBQ1UsaUJBQW1DLEVBQ3BDLGFBQXNDLEVBQ3JDLGlCQUFvQyxFQUNwQyxhQUEyQztRQUgzQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBQ3BDLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUNyQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQ3BDLGtCQUFhLEdBQWIsYUFBYSxDQUE4QjtRQTFCckQsWUFBTyxHQUFHLGVBQWUsRUFBRSxDQUFDO1FBR3NCLFVBQUssR0FBRyxLQUFLLENBQUM7UUFDbEMsaUJBQVksR0FBRyxJQUFJLFlBQVksQ0FBVSxLQUFLLENBQUMsQ0FBQztRQUVuRCxhQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ0oseUJBQW9CLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3JFLFNBQUksR0FBRyxJQUFJLENBQUM7UUFDRixtQkFBYyxHQUFHLElBQUksQ0FBQztRQUN2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dUJBQUMsT0FBTztnQkFFZ0MsS0FBSztzQkFBdEQsS0FBSzt1QkFBQyxjQUFjOztzQkFBRyxXQUFXO3VCQUFDLFlBQVk7Z0JBQ2xCLFlBQVk7c0JBQXpDLE1BQU07dUJBQUMsb0JBQW9CO2dCQUVELFFBQVE7c0JBQWxDLEtBQUs7dUJBQUMsa0JBQWtCO2dCQUNjLG9CQUFvQjtzQkFBMUQsS0FBSzt1QkFBQyw4QkFBOEI7Z0JBQ2QsSUFBSTtzQkFBMUIsS0FBSzt1QkFBQyxjQUFjO2dCQUNZLGNBQWM7c0JBQTlDLEtBQUs7dUJBQUMsd0JBQXdCO2dCQUNDLGFBQWE7c0JBQTVDLEtBQUs7dUJBQUMsdUJBQXVCO2dCQUVDLFNBQVM7c0JBQXZDLEtBQUs7dUJBQUMsc0JBQXNCO2dCQUNLLFFBQVE7c0JBQXpDLE1BQU07dUJBQUMsd0JBQXdCO2dCQUVELFVBQVU7c0JBQXhDLEtBQUs7dUJBQUMsc0JBQXNCO2dCQUdXLG1CQUFtQjtzQkFBMUQsS0FBSzt1QkFBQywrQkFBK0I7Z0JBRUYsY0FBYztzQkFBakQsU0FBUzt1QkFBQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBhbmltYXRlLCBBbmltYXRpb25FdmVudCwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0QmluZGluZyxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZSxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgdW5pcXVlSWRGYWN0b3J5IH0gZnJvbSAnLi4vdXRpbHMvaWQtZ2VuZXJhdG9yL2lkLWdlbmVyYXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IFNjcm9sbGluZ1NlcnZpY2UgfSBmcm9tICcuLi91dGlscy9zY3JvbGxpbmcvc2Nyb2xsaW5nLXNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyTW9kYWxDb25maWd1cmF0aW9uU2VydmljZSB9IGZyb20gJy4vbW9kYWwtY29uZmlndXJhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IE1vZGFsU3RhY2tTZXJ2aWNlIH0gZnJvbSAnLi9tb2RhbC1zdGFjay5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLW1vZGFsJyxcbiAgdmlld1Byb3ZpZGVyczogW1Njcm9sbGluZ1NlcnZpY2VdLFxuICB0ZW1wbGF0ZVVybDogJy4vbW9kYWwuaHRtbCcsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgIH1cbiAgICAgIDpob3N0Lm9wZW4ge1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmU7XG4gICAgICB9XG4gICAgYCxcbiAgXSxcbiAgYW5pbWF0aW9uczogW1xuICAgIHRyaWdnZXIoJ2ZhZGVNb3ZlJywgW1xuICAgICAgdHJhbnNpdGlvbignKiA9PiBmYWRlRG93bicsIFtcbiAgICAgICAgc3R5bGUoeyBvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMCwgLTI1JSknIH0pLFxuICAgICAgICBhbmltYXRlKCcwLjJzIGVhc2UtaW4tb3V0JyksXG4gICAgICBdKSxcbiAgICAgIHRyYW5zaXRpb24oJ2ZhZGVEb3duID0+IConLCBbXG4gICAgICAgIGFuaW1hdGUoJzAuMnMgZWFzZS1pbi1vdXQnLCBzdHlsZSh7IG9wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgwLCAtMjUlKScgfSkpLFxuICAgICAgXSksXG4gICAgICB0cmFuc2l0aW9uKCcqID0+IGZhZGVMZWZ0JywgW3N0eWxlKHsgb3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDI1JSwgMCknIH0pLCBhbmltYXRlKCcwLjJzIGVhc2UtaW4tb3V0JyldKSxcbiAgICAgIHRyYW5zaXRpb24oJ2ZhZGVMZWZ0ID0+IConLCBbYW5pbWF0ZSgnMC4ycyBlYXNlLWluLW91dCcsIHN0eWxlKHsgb3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDI1JSwgMCknIH0pKV0pLFxuICAgIF0pLFxuICAgIHRyaWdnZXIoJ2ZhZGUnLCBbXG4gICAgICB0cmFuc2l0aW9uKCd2b2lkID0+IConLCBbc3R5bGUoeyBvcGFjaXR5OiAwIH0pLCBhbmltYXRlKCcwLjJzIGVhc2UtaW4tb3V0Jywgc3R5bGUoeyBvcGFjaXR5OiAwLjg1IH0pKV0pLFxuICAgICAgdHJhbnNpdGlvbignKiA9PiB2b2lkJywgW2FuaW1hdGUoJzAuMnMgZWFzZS1pbi1vdXQnLCBzdHlsZSh7IG9wYWNpdHk6IDAgfSkpXSksXG4gICAgXSksXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIENsck1vZGFsIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBtb2RhbElkID0gdW5pcXVlSWRGYWN0b3J5KCk7XG4gIEBWaWV3Q2hpbGQoJ3RpdGxlJykgdGl0bGU6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIEBJbnB1dCgnY2xyTW9kYWxPcGVuJykgQEhvc3RCaW5kaW5nKCdjbGFzcy5vcGVuJykgX29wZW4gPSBmYWxzZTtcbiAgQE91dHB1dCgnY2xyTW9kYWxPcGVuQ2hhbmdlJykgX29wZW5DaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPihmYWxzZSk7XG5cbiAgQElucHV0KCdjbHJNb2RhbENsb3NhYmxlJykgY2xvc2FibGUgPSB0cnVlO1xuICBASW5wdXQoJ2Nsck1vZGFsQ2xvc2VCdXR0b25BcmlhTGFiZWwnKSBjbG9zZUJ1dHRvbkFyaWFMYWJlbCA9IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmNsb3NlO1xuICBASW5wdXQoJ2Nsck1vZGFsU2l6ZScpIHNpemUgPSAnbWQnO1xuICBASW5wdXQoJ2Nsck1vZGFsU3RhdGljQmFja2Ryb3AnKSBzdGF0aWNCYWNrZHJvcCA9IHRydWU7XG4gIEBJbnB1dCgnY2xyTW9kYWxTa2lwQW5pbWF0aW9uJykgc2tpcEFuaW1hdGlvbiA9IGZhbHNlO1xuXG4gIEBJbnB1dCgnY2xyTW9kYWxQcmV2ZW50Q2xvc2UnKSBzdG9wQ2xvc2UgPSBmYWxzZTtcbiAgQE91dHB1dCgnY2xyTW9kYWxBbHRlcm5hdGVDbG9zZScpIGFsdENsb3NlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPihmYWxzZSk7XG5cbiAgQElucHV0KCdjbHJNb2RhbExhYmVsbGVkQnlJZCcpIGxhYmVsbGVkQnk6IHN0cmluZztcblxuICAvLyBwcmVzZW50bHkgdGhpcyBpcyBvbmx5IHVzZWQgYnkgaW5saW5lIHdpemFyZHNcbiAgQElucHV0KCdjbHJNb2RhbE92ZXJyaWRlU2Nyb2xsU2VydmljZScpIGJ5cGFzc1Njcm9sbFNlcnZpY2UgPSBmYWxzZTtcblxuICBAVmlld0NoaWxkKCdib2R5JykgcHJpdmF0ZSByZWFkb25seSBib2R5RWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfc2Nyb2xsaW5nU2VydmljZTogU2Nyb2xsaW5nU2VydmljZSxcbiAgICBwdWJsaWMgY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBtb2RhbFN0YWNrU2VydmljZTogTW9kYWxTdGFja1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uOiBDbHJNb2RhbENvbmZpZ3VyYXRpb25TZXJ2aWNlXG4gICkge31cblxuICBnZXQgZmFkZU1vdmUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5za2lwQW5pbWF0aW9uID8gJycgOiB0aGlzLmNvbmZpZ3VyYXRpb24uZmFkZU1vdmU7XG4gIH1cbiAgc2V0IGZhZGVNb3ZlKG1vdmU6IHN0cmluZykge1xuICAgIHRoaXMuY29uZmlndXJhdGlvbi5mYWRlTW92ZSA9IG1vdmU7XG4gIH1cblxuICBnZXQgYmFja2Ryb3AoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvbi5iYWNrZHJvcDtcbiAgfVxuXG4gIC8vIERldGVjdCB3aGVuIF9vcGVuIGlzIHNldCB0byB0cnVlIGFuZCBzZXQgbm8tc2Nyb2xsaW5nIHRvIHRydWVcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBbcHJvcE5hbWU6IHN0cmluZ106IFNpbXBsZUNoYW5nZSB9KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmJ5cGFzc1Njcm9sbFNlcnZpY2UgJiYgY2hhbmdlcyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY2hhbmdlcywgJ19vcGVuJykpIHtcbiAgICAgIGlmIChjaGFuZ2VzLl9vcGVuLmN1cnJlbnRWYWx1ZSkge1xuICAgICAgICB0aGlzLl9zY3JvbGxpbmdTZXJ2aWNlLnN0b3BTY3JvbGxpbmcoKTtcbiAgICAgICAgdGhpcy5tb2RhbFN0YWNrU2VydmljZS50cmFja01vZGFsT3Blbih0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3Njcm9sbGluZ1NlcnZpY2UucmVzdW1lU2Nyb2xsaW5nKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fc2Nyb2xsaW5nU2VydmljZS5yZXN1bWVTY3JvbGxpbmcoKTtcbiAgfVxuXG4gIG9wZW4oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29wZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fb3BlbiA9IHRydWU7XG4gICAgdGhpcy5fb3BlbkNoYW5nZWQuZW1pdCh0cnVlKTtcbiAgICB0aGlzLm1vZGFsU3RhY2tTZXJ2aWNlLnRyYWNrTW9kYWxPcGVuKHRoaXMpO1xuICB9XG5cbiAgYmFja2Ryb3BDbGljaygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdGF0aWNCYWNrZHJvcCkge1xuICAgICAgdGhpcy50aXRsZS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3RvcENsb3NlKSB7XG4gICAgICB0aGlzLmFsdENsb3NlLmVtaXQoZmFsc2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuY2xvc2FibGUgfHwgIXRoaXMuX29wZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fb3BlbiA9IGZhbHNlO1xuICB9XG5cbiAgZmFkZURvbmUoZTogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICBpZiAoZS50b1N0YXRlID09PSAndm9pZCcpIHtcbiAgICAgIC8vIFRPRE86IEludmVzdGlnYXRlIGlmIHdlIGNhbiBkZWNvdXBsZSBmcm9tIGFuaW1hdGlvbiBldmVudHNcbiAgICAgIHRoaXMuX29wZW5DaGFuZ2VkLmVtaXQoZmFsc2UpO1xuICAgICAgdGhpcy5tb2RhbFN0YWNrU2VydmljZS50cmFja01vZGFsQ2xvc2UodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgc2Nyb2xsVG9wKCkge1xuICAgIHRoaXMuYm9keUVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxUbygwLCAwKTtcbiAgfVxufVxuIiwiPCEtLVxuICB+IENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICB+IFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAgfiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICB+IFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAgLS0+XG5cbjxkaXYgKm5nSWY9XCJfb3BlblwiIGNsYXNzPVwibW9kYWxcIiBbY2xhc3MubW9kYWwtZnVsbC1zY3JlZW5dPVwic2l6ZSA9PSAnZnVsbC1zY3JlZW4nXCI+XG4gIDwhLS1maXhtZTogcmV2aXNpdCB3aGVuIG5nQ2xhc3Mgd29ya3Mgd2l0aCBleGl0IGFuaW1hdGlvbi0tPlxuICA8ZGl2XG4gICAgY2RrVHJhcEZvY3VzXG4gICAgW2Nka1RyYXBGb2N1c0F1dG9DYXB0dXJlXT1cInRydWVcIlxuICAgIFtAZmFkZU1vdmVdPVwiZmFkZU1vdmVcIlxuICAgIChAZmFkZU1vdmUuZG9uZSk9XCJmYWRlRG9uZSgkZXZlbnQpXCJcbiAgICBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiXG4gICAgW2NsYXNzLm1vZGFsLXNtXT1cInNpemUgPT0gJ3NtJ1wiXG4gICAgW2NsYXNzLm1vZGFsLWxnXT1cInNpemUgPT0gJ2xnJ1wiXG4gICAgW2NsYXNzLm1vZGFsLXhsXT1cInNpemUgPT0gJ3hsJ1wiXG4gICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgYXJpYS1tb2RhbD1cInRydWVcIlxuICAgIFthdHRyLmFyaWEtaGlkZGVuXT1cIiFfb3BlblwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImxhYmVsbGVkQnkgfHwgbW9kYWxJZFwiXG4gID5cbiAgICA8ZGl2IGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57e2NvbW1vblN0cmluZ3Mua2V5cy5tb2RhbENvbnRlbnRTdGFydH19PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQtd3JhcHBlclwiPlxuICAgICAgPCEtLSBvbmx5IHVzZWQgaW4gd2l6YXJkcyAtLT5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIi5tb2RhbC1uYXZcIj48L25nLWNvbnRlbnQ+XG5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXItLWFjY2Vzc2libGVcIj5cbiAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCIubGVhZGluZy1idXR0b25cIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLXRpdGxlLXdyYXBwZXJcIiAjdGl0bGUgW2lkXT1cIm1vZGFsSWRcIiBjZGtGb2N1c0luaXRpYWwgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiLm1vZGFsLXRpdGxlXCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjbG9zZUJ1dHRvbkFyaWFMYWJlbCB8fCBjb21tb25TdHJpbmdzLmtleXMuY2xvc2VcIlxuICAgICAgICAgICAgY2xhc3M9XCJjbG9zZVwiXG4gICAgICAgICAgICAqbmdJZj1cImNsb3NhYmxlXCJcbiAgICAgICAgICAgIChjbGljayk9XCJjbG9zZSgpXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJ3aW5kb3ctY2xvc2VcIj48L2Nkcy1pY29uPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiAjYm9keSBjbGFzcz1cIm1vZGFsLWJvZHktd3JhcHBlclwiPlxuICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIi5tb2RhbC1ib2R5XCI+PC9uZy1jb250ZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiLm1vZGFsLWZvb3RlclwiPjwvbmctY29udGVudD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjbHItc3Itb25seVwiPnt7Y29tbW9uU3RyaW5ncy5rZXlzLm1vZGFsQ29udGVudEVuZH19PC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG5cbjxkaXYgW0BmYWRlXSAqbmdJZj1cImJhY2tkcm9wXCIgY2xhc3M9XCJtb2RhbC1iYWNrZHJvcFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIChjbGljayk9XCJiYWNrZHJvcENsaWNrKClcIj48L2Rpdj5cbiJdfQ==