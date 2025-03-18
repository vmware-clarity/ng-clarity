/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, HostBinding, Input, Optional, Output, SkipSelf, } from '@angular/core';
import { tap } from 'rxjs/operators';
import { IfExpandService } from '../utils/conditional/if-expanded.service';
import { uniqueIdFactory } from '../utils/id-generator/id-generator.service';
import { ClrAccordionDescription } from './accordion-description';
import { panelAnimation } from './utils/animation';
import * as i0 from "@angular/core";
import * as i1 from "../utils/i18n/common-strings.service";
import * as i2 from "./providers/accordion.service";
import * as i3 from "../utils/conditional/if-expanded.service";
import * as i4 from "@angular/common";
import * as i5 from "../icon/icon";
export class ClrAccordionPanel {
    constructor(parent, commonStrings, accordionService, ifExpandService, cdr) {
        this.parent = parent;
        this.commonStrings = commonStrings;
        this.accordionService = accordionService;
        this.ifExpandService = ifExpandService;
        this.cdr = cdr;
        this.disabled = false;
        this.panelOpen = false;
        this.headingEnabled = false;
        this.panelOpenChange = new EventEmitter();
        this._id = uniqueIdFactory();
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get panelNumber() {
        return this._panelIndex + 1;
    }
    get headingLevel() {
        if (this.explicitHeadingLevel) {
            return this.explicitHeadingLevel;
        }
        return this.parent ? 4 : 3;
    }
    ngOnInit() {
        this.panel = this.accordionService.getPanelChanges(this.id).pipe(tap(panel => this.emitPanelChange(panel)));
        this.accordionService.addPanel(this.id, this.panelOpen);
        this.accordionService.togglePanel(this.id, this.panelOpen);
        this.accordionService.disablePanel(this.id, this.disabled);
    }
    ngOnChanges(changes) {
        if (this.panel && changes.panelOpen && changes.panelOpen.currentValue !== changes.panelOpen.previousValue) {
            this.accordionService.togglePanel(this.id, changes.panelOpen.currentValue);
        }
        if (this.panel && changes.disabled && changes.disabled.currentValue !== changes.disabled.previousValue) {
            this.accordionService.disablePanel(this.id, changes.disabled.currentValue);
        }
    }
    togglePanel() {
        this.accordionService.togglePanel(this.id);
    }
    collapsePanelOnAnimationDone(panel) {
        if (!panel.open) {
            this.ifExpandService.expanded = false;
        }
    }
    getPanelStateClasses(panel) {
        return `clr-accordion-panel-${panel.status} ${panel.open ? 'clr-accordion-panel-open' : ''}`;
    }
    getAccordionContentId(id) {
        return `clr-accordion-content-${id}'`;
    }
    getAccordionHeaderId(id) {
        return `clr-accordion-header-${id}`;
    }
    stepCompleteText(panelNumber) {
        return this.commonStrings.parse(this.commonStrings.keys.stepComplete, { STEP: panelNumber.toString() });
    }
    stepErrorText(panelNumber) {
        return this.commonStrings.parse(this.commonStrings.keys.stepError, { STEP: panelNumber.toString() });
    }
    emitPanelChange(panel) {
        if (panel.index !== this._panelIndex) {
            this._panelIndex = panel.index;
            // The whole chain of updates leading to this line starts in a ngAfterViewInit subscription in accordion.ts,
            // listening for DOM changes. It seems to only fails in tests, but as this is not a frequently called code,
            // I prefer to stay on the safe side and initiate a detection cycle here.
            this.cdr.detectChanges();
        }
        if (panel.open !== this.panelOpen) {
            this.panelOpenChange.emit(panel.open);
            /**
             * @Note: this line below is needed because we don't want to use another value to track
             * for changes of the panel. Because we use BehaviorSubject this emit event is trigger on
             * init (that is not needed - there is no change of the original value) - in some cases this
             * lead to duplicate events.
             *
             * To prevent this we try to emit only when the value is changed and keep the value in sync
             * even that is used only into the Initial Lifecycle (ngOnInit).
             */
            this.panelOpen = panel.open;
        }
        if (panel.open) {
            this.ifExpandService.expanded = true;
        }
    }
}
ClrAccordionPanel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAccordionPanel, deps: [{ token: ClrAccordionPanel, optional: true, skipSelf: true }, { token: i1.ClrCommonStringsService }, { token: i2.AccordionService }, { token: i3.IfExpandService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
ClrAccordionPanel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrAccordionPanel, selector: "clr-accordion-panel", inputs: { disabled: ["clrAccordionPanelDisabled", "disabled"], panelOpen: ["clrAccordionPanelOpen", "panelOpen"], headingEnabled: ["clrAccordionPanelHeadingEnabled", "headingEnabled"], explicitHeadingLevel: ["clrAccordionPanelHeadingLevel", "explicitHeadingLevel"] }, outputs: { panelOpenChange: "clrAccordionPanelOpenChange" }, host: { properties: { "class.clr-accordion-panel": "true", "class.clr-accordion-panel-disabled": "this.disabled" } }, providers: [IfExpandService], queries: [{ propertyName: "accordionDescription", predicate: ClrAccordionDescription }], usesOnChanges: true, ngImport: i0, template: "<ng-container *ngIf=\"panel | async; let panel\">\n  <div [ngClass]=\"getPanelStateClasses(panel)\">\n    <div\n      class=\"clr-accordion-header\"\n      [attr.role]=\"headingEnabled || explicitHeadingLevel ? 'heading' : null\"\n      [attr.aria-level]=\"headingEnabled || explicitHeadingLevel ? headingLevel : null\"\n    >\n      <button\n        type=\"button\"\n        class=\"clr-accordion-header-button\"\n        (click)=\"togglePanel()\"\n        [id]=\"getAccordionHeaderId(panel.templateId)\"\n        [disabled]=\"panel.disabled\"\n        [attr.aria-controls]=\"!panel.disabled && panel.open ? getAccordionContentId(panel.templateId) : null\"\n        [attr.aria-expanded]=\"panel.open\"\n        [class.clr-accordion-header-has-description]=\"(accordionDescription.changes | async)?.length || accordionDescription.length\"\n        #headerButton\n      >\n        <span class=\"clr-accordion-status\">\n          <cds-icon shape=\"angle\" direction=\"right\" class=\"clr-accordion-angle\"></cds-icon>\n        </span>\n        <ng-content select=\"clr-accordion-title, clr-step-title\"></ng-content>\n        <ng-content select=\"clr-accordion-description, clr-step-description\"></ng-content>\n      </button>\n    </div>\n    <div\n      @skipInitialRender\n      role=\"region\"\n      class=\"clr-accordion-content-region\"\n      [id]=\"getAccordionContentId(panel.templateId)\"\n      [attr.aria-hidden]=\"!panel.open\"\n      [attr.aria-labelledby]=\"getAccordionHeaderId(panel.templateId)\"\n    >\n      <div\n        *ngIf=\"panel.open\"\n        @toggle\n        (@toggle.done)=\"collapsePanelOnAnimationDone(panel)\"\n        class=\"clr-accordion-content\"\n      >\n        <div class=\"clr-accordion-inner-content\">\n          <ng-content></ng-content>\n        </div>\n      </div>\n    </div>\n  </div>\n</ng-container>\n", dependencies: [{ kind: "directive", type: i4.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i5.CdsIconCustomTag, selector: "cds-icon" }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }], animations: panelAnimation, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAccordionPanel, decorators: [{
            type: Component,
            args: [{ selector: 'clr-accordion-panel', host: { '[class.clr-accordion-panel]': 'true' }, changeDetection: ChangeDetectionStrategy.OnPush, animations: panelAnimation, providers: [IfExpandService], template: "<ng-container *ngIf=\"panel | async; let panel\">\n  <div [ngClass]=\"getPanelStateClasses(panel)\">\n    <div\n      class=\"clr-accordion-header\"\n      [attr.role]=\"headingEnabled || explicitHeadingLevel ? 'heading' : null\"\n      [attr.aria-level]=\"headingEnabled || explicitHeadingLevel ? headingLevel : null\"\n    >\n      <button\n        type=\"button\"\n        class=\"clr-accordion-header-button\"\n        (click)=\"togglePanel()\"\n        [id]=\"getAccordionHeaderId(panel.templateId)\"\n        [disabled]=\"panel.disabled\"\n        [attr.aria-controls]=\"!panel.disabled && panel.open ? getAccordionContentId(panel.templateId) : null\"\n        [attr.aria-expanded]=\"panel.open\"\n        [class.clr-accordion-header-has-description]=\"(accordionDescription.changes | async)?.length || accordionDescription.length\"\n        #headerButton\n      >\n        <span class=\"clr-accordion-status\">\n          <cds-icon shape=\"angle\" direction=\"right\" class=\"clr-accordion-angle\"></cds-icon>\n        </span>\n        <ng-content select=\"clr-accordion-title, clr-step-title\"></ng-content>\n        <ng-content select=\"clr-accordion-description, clr-step-description\"></ng-content>\n      </button>\n    </div>\n    <div\n      @skipInitialRender\n      role=\"region\"\n      class=\"clr-accordion-content-region\"\n      [id]=\"getAccordionContentId(panel.templateId)\"\n      [attr.aria-hidden]=\"!panel.open\"\n      [attr.aria-labelledby]=\"getAccordionHeaderId(panel.templateId)\"\n    >\n      <div\n        *ngIf=\"panel.open\"\n        @toggle\n        (@toggle.done)=\"collapsePanelOnAnimationDone(panel)\"\n        class=\"clr-accordion-content\"\n      >\n        <div class=\"clr-accordion-inner-content\">\n          <ng-content></ng-content>\n        </div>\n      </div>\n    </div>\n  </div>\n</ng-container>\n" }]
        }], ctorParameters: function () { return [{ type: ClrAccordionPanel, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i1.ClrCommonStringsService }, { type: i2.AccordionService }, { type: i3.IfExpandService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { disabled: [{
                type: Input,
                args: ['clrAccordionPanelDisabled']
            }, {
                type: HostBinding,
                args: ['class.clr-accordion-panel-disabled']
            }], panelOpen: [{
                type: Input,
                args: ['clrAccordionPanelOpen']
            }], headingEnabled: [{
                type: Input,
                args: ['clrAccordionPanelHeadingEnabled']
            }], explicitHeadingLevel: [{
                type: Input,
                args: ['clrAccordionPanelHeadingLevel']
            }], panelOpenChange: [{
                type: Output,
                args: ['clrAccordionPanelOpenChange']
            }], accordionDescription: [{
                type: ContentChildren,
                args: [ClrAccordionDescription]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLXBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvYWNjb3JkaW9uL2FjY29yZGlvbi1wYW5lbC50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2FjY29yZGlvbi9hY2NvcmRpb24tcGFuZWwuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFFdkIsU0FBUyxFQUNULGVBQWUsRUFDZixZQUFZLEVBQ1osV0FBVyxFQUNYLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUdOLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBRTNFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUU3RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUdsRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7Ozs7Ozs7QUFVbkQsTUFBTSxPQUFPLGlCQUFpQjtJQW1CNUIsWUFDa0MsTUFBeUIsRUFDbEQsYUFBc0MsRUFDckMsZ0JBQWtDLEVBQ2xDLGVBQWdDLEVBQ2hDLEdBQXNCO1FBSkUsV0FBTSxHQUFOLE1BQU0sQ0FBbUI7UUFDbEQsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQ3JDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBdkJ1RCxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3hFLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFUixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQU0xQixv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O2tCQVI3QixTQUFTOytCQUNFLHFCQUFxQixRQUV6QixFQUFFLDZCQUE2QixFQUFFLE1BQU0sRUFBRSxtQkFDOUIsdUJBQXVCLENBQUMsTUFBTSxjQUNuQyxjQUFjLGFBQ2YsQ0FBQyxlQUFlLENBQUM7OzBCQXNCekIsUUFBUTs7MEJBQUksUUFBUTsrS0FuQmdFLFFBQVE7c0JBQTlGLEtBQUs7dUJBQUMsMkJBQTJCOztzQkFBRyxXQUFXO3VCQUFDLG9DQUFvQztnQkFDckQsU0FBUztzQkFBeEMsS0FBSzt1QkFBQyx1QkFBdUI7Z0JBRVksY0FBYztzQkFBdkQsS0FBSzt1QkFBQyxpQ0FBaUM7Z0JBSUEsb0JBQW9CO3NCQUEzRCxLQUFLO3VCQUFDLCtCQUErQjtnQkFFQyxlQUFlO3NCQUFyRCxNQUFNO3VCQUFDLDZCQUE2QjtnQkFFSyxvQkFBb0I7c0JBQTdELGVBQWU7dUJBQUMsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RCaW5kaW5nLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgU2tpcFNlbGYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBJZkV4cGFuZFNlcnZpY2UgfSBmcm9tICcuLi91dGlscy9jb25kaXRpb25hbC9pZi1leHBhbmRlZC5zZXJ2aWNlJztcbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IHVuaXF1ZUlkRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL2lkLWdlbmVyYXRvci9pZC1nZW5lcmF0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBIZWFkaW5nTGV2ZWwgfSBmcm9tICcuLi93aXphcmQnO1xuaW1wb3J0IHsgQ2xyQWNjb3JkaW9uRGVzY3JpcHRpb24gfSBmcm9tICcuL2FjY29yZGlvbi1kZXNjcmlwdGlvbic7XG5pbXBvcnQgeyBBY2NvcmRpb25QYW5lbE1vZGVsIH0gZnJvbSAnLi9tb2RlbHMvYWNjb3JkaW9uLm1vZGVsJztcbmltcG9ydCB7IEFjY29yZGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9hY2NvcmRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBwYW5lbEFuaW1hdGlvbiB9IGZyb20gJy4vdXRpbHMvYW5pbWF0aW9uJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWFjY29yZGlvbi1wYW5lbCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9hY2NvcmRpb24tcGFuZWwuaHRtbCcsXG4gIGhvc3Q6IHsgJ1tjbGFzcy5jbHItYWNjb3JkaW9uLXBhbmVsXSc6ICd0cnVlJyB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgYW5pbWF0aW9uczogcGFuZWxBbmltYXRpb24sXG4gIHByb3ZpZGVyczogW0lmRXhwYW5kU2VydmljZV0sXG59KVxuZXhwb3J0IGNsYXNzIENsckFjY29yZGlvblBhbmVsIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICBASW5wdXQoJ2NsckFjY29yZGlvblBhbmVsRGlzYWJsZWQnKSBASG9zdEJpbmRpbmcoJ2NsYXNzLmNsci1hY2NvcmRpb24tcGFuZWwtZGlzYWJsZWQnKSBkaXNhYmxlZCA9IGZhbHNlO1xuICBASW5wdXQoJ2NsckFjY29yZGlvblBhbmVsT3BlbicpIHBhbmVsT3BlbiA9IGZhbHNlO1xuXG4gIEBJbnB1dCgnY2xyQWNjb3JkaW9uUGFuZWxIZWFkaW5nRW5hYmxlZCcpIGhlYWRpbmdFbmFibGVkID0gZmFsc2U7XG4gIC8qKlxuICAgKiBMZXZlbCBvZiB0aGUgYWNjb3JkaW9uL3N0ZXBwZXIgaGVhZGluZyBmcm9tIDEgdG8gNi5cbiAgICovXG4gIEBJbnB1dCgnY2xyQWNjb3JkaW9uUGFuZWxIZWFkaW5nTGV2ZWwnKSBleHBsaWNpdEhlYWRpbmdMZXZlbDogSGVhZGluZ0xldmVsO1xuXG4gIEBPdXRwdXQoJ2NsckFjY29yZGlvblBhbmVsT3BlbkNoYW5nZScpIHBhbmVsT3BlbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICBAQ29udGVudENoaWxkcmVuKENsckFjY29yZGlvbkRlc2NyaXB0aW9uKSBhY2NvcmRpb25EZXNjcmlwdGlvbjogUXVlcnlMaXN0PENsckFjY29yZGlvbkRlc2NyaXB0aW9uPjtcblxuICBwYW5lbDogT2JzZXJ2YWJsZTxBY2NvcmRpb25QYW5lbE1vZGVsPjtcblxuICBwcml2YXRlIF9pZCA9IHVuaXF1ZUlkRmFjdG9yeSgpO1xuICBwcml2YXRlIF9wYW5lbEluZGV4OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcHJpdmF0ZSBwYXJlbnQ6IENsckFjY29yZGlvblBhbmVsLFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGFjY29yZGlvblNlcnZpY2U6IEFjY29yZGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBpZkV4cGFuZFNlcnZpY2U6IElmRXhwYW5kU2VydmljZSxcbiAgICBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgKSB7fVxuXG4gIGdldCBpZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9pZDtcbiAgfVxuICBzZXQgaWQodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2lkID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcGFuZWxOdW1iZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsSW5kZXggKyAxO1xuICB9XG5cbiAgZ2V0IGhlYWRpbmdMZXZlbCgpIHtcbiAgICBpZiAodGhpcy5leHBsaWNpdEhlYWRpbmdMZXZlbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZXhwbGljaXRIZWFkaW5nTGV2ZWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID8gNCA6IDM7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnBhbmVsID0gdGhpcy5hY2NvcmRpb25TZXJ2aWNlLmdldFBhbmVsQ2hhbmdlcyh0aGlzLmlkKS5waXBlKHRhcChwYW5lbCA9PiB0aGlzLmVtaXRQYW5lbENoYW5nZShwYW5lbCkpKTtcbiAgICB0aGlzLmFjY29yZGlvblNlcnZpY2UuYWRkUGFuZWwodGhpcy5pZCwgdGhpcy5wYW5lbE9wZW4pO1xuICAgIHRoaXMuYWNjb3JkaW9uU2VydmljZS50b2dnbGVQYW5lbCh0aGlzLmlkLCB0aGlzLnBhbmVsT3Blbik7XG4gICAgdGhpcy5hY2NvcmRpb25TZXJ2aWNlLmRpc2FibGVQYW5lbCh0aGlzLmlkLCB0aGlzLmRpc2FibGVkKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAodGhpcy5wYW5lbCAmJiBjaGFuZ2VzLnBhbmVsT3BlbiAmJiBjaGFuZ2VzLnBhbmVsT3Blbi5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXMucGFuZWxPcGVuLnByZXZpb3VzVmFsdWUpIHtcbiAgICAgIHRoaXMuYWNjb3JkaW9uU2VydmljZS50b2dnbGVQYW5lbCh0aGlzLmlkLCBjaGFuZ2VzLnBhbmVsT3Blbi5jdXJyZW50VmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhbmVsICYmIGNoYW5nZXMuZGlzYWJsZWQgJiYgY2hhbmdlcy5kaXNhYmxlZC5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXMuZGlzYWJsZWQucHJldmlvdXNWYWx1ZSkge1xuICAgICAgdGhpcy5hY2NvcmRpb25TZXJ2aWNlLmRpc2FibGVQYW5lbCh0aGlzLmlkLCBjaGFuZ2VzLmRpc2FibGVkLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlUGFuZWwoKSB7XG4gICAgdGhpcy5hY2NvcmRpb25TZXJ2aWNlLnRvZ2dsZVBhbmVsKHRoaXMuaWQpO1xuICB9XG5cbiAgY29sbGFwc2VQYW5lbE9uQW5pbWF0aW9uRG9uZShwYW5lbDogQWNjb3JkaW9uUGFuZWxNb2RlbCkge1xuICAgIGlmICghcGFuZWwub3Blbikge1xuICAgICAgdGhpcy5pZkV4cGFuZFNlcnZpY2UuZXhwYW5kZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBnZXRQYW5lbFN0YXRlQ2xhc3NlcyhwYW5lbDogQWNjb3JkaW9uUGFuZWxNb2RlbCkge1xuICAgIHJldHVybiBgY2xyLWFjY29yZGlvbi1wYW5lbC0ke3BhbmVsLnN0YXR1c30gJHtwYW5lbC5vcGVuID8gJ2Nsci1hY2NvcmRpb24tcGFuZWwtb3BlbicgOiAnJ31gO1xuICB9XG5cbiAgZ2V0QWNjb3JkaW9uQ29udGVudElkKGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYGNsci1hY2NvcmRpb24tY29udGVudC0ke2lkfSdgO1xuICB9XG5cbiAgZ2V0QWNjb3JkaW9uSGVhZGVySWQoaWQ6IHN0cmluZykge1xuICAgIHJldHVybiBgY2xyLWFjY29yZGlvbi1oZWFkZXItJHtpZH1gO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0ZXBDb21wbGV0ZVRleHQocGFuZWxOdW1iZXI6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmNvbW1vblN0cmluZ3MucGFyc2UodGhpcy5jb21tb25TdHJpbmdzLmtleXMuc3RlcENvbXBsZXRlLCB7IFNURVA6IHBhbmVsTnVtYmVyLnRvU3RyaW5nKCkgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RlcEVycm9yVGV4dChwYW5lbE51bWJlcjogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbW9uU3RyaW5ncy5wYXJzZSh0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5zdGVwRXJyb3IsIHsgU1RFUDogcGFuZWxOdW1iZXIudG9TdHJpbmcoKSB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdFBhbmVsQ2hhbmdlKHBhbmVsOiBBY2NvcmRpb25QYW5lbE1vZGVsKSB7XG4gICAgaWYgKHBhbmVsLmluZGV4ICE9PSB0aGlzLl9wYW5lbEluZGV4KSB7XG4gICAgICB0aGlzLl9wYW5lbEluZGV4ID0gcGFuZWwuaW5kZXg7XG4gICAgICAvLyBUaGUgd2hvbGUgY2hhaW4gb2YgdXBkYXRlcyBsZWFkaW5nIHRvIHRoaXMgbGluZSBzdGFydHMgaW4gYSBuZ0FmdGVyVmlld0luaXQgc3Vic2NyaXB0aW9uIGluIGFjY29yZGlvbi50cyxcbiAgICAgIC8vIGxpc3RlbmluZyBmb3IgRE9NIGNoYW5nZXMuIEl0IHNlZW1zIHRvIG9ubHkgZmFpbHMgaW4gdGVzdHMsIGJ1dCBhcyB0aGlzIGlzIG5vdCBhIGZyZXF1ZW50bHkgY2FsbGVkIGNvZGUsXG4gICAgICAvLyBJIHByZWZlciB0byBzdGF5IG9uIHRoZSBzYWZlIHNpZGUgYW5kIGluaXRpYXRlIGEgZGV0ZWN0aW9uIGN5Y2xlIGhlcmUuXG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgaWYgKHBhbmVsLm9wZW4gIT09IHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLnBhbmVsT3BlbkNoYW5nZS5lbWl0KHBhbmVsLm9wZW4pO1xuICAgICAgLyoqXG4gICAgICAgKiBATm90ZTogdGhpcyBsaW5lIGJlbG93IGlzIG5lZWRlZCBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdG8gdXNlIGFub3RoZXIgdmFsdWUgdG8gdHJhY2tcbiAgICAgICAqIGZvciBjaGFuZ2VzIG9mIHRoZSBwYW5lbC4gQmVjYXVzZSB3ZSB1c2UgQmVoYXZpb3JTdWJqZWN0IHRoaXMgZW1pdCBldmVudCBpcyB0cmlnZ2VyIG9uXG4gICAgICAgKiBpbml0ICh0aGF0IGlzIG5vdCBuZWVkZWQgLSB0aGVyZSBpcyBubyBjaGFuZ2Ugb2YgdGhlIG9yaWdpbmFsIHZhbHVlKSAtIGluIHNvbWUgY2FzZXMgdGhpc1xuICAgICAgICogbGVhZCB0byBkdXBsaWNhdGUgZXZlbnRzLlxuICAgICAgICpcbiAgICAgICAqIFRvIHByZXZlbnQgdGhpcyB3ZSB0cnkgdG8gZW1pdCBvbmx5IHdoZW4gdGhlIHZhbHVlIGlzIGNoYW5nZWQgYW5kIGtlZXAgdGhlIHZhbHVlIGluIHN5bmNcbiAgICAgICAqIGV2ZW4gdGhhdCBpcyB1c2VkIG9ubHkgaW50byB0aGUgSW5pdGlhbCBMaWZlY3ljbGUgKG5nT25Jbml0KS5cbiAgICAgICAqL1xuICAgICAgdGhpcy5wYW5lbE9wZW4gPSBwYW5lbC5vcGVuO1xuICAgIH1cblxuICAgIGlmIChwYW5lbC5vcGVuKSB7XG4gICAgICB0aGlzLmlmRXhwYW5kU2VydmljZS5leHBhbmRlZCA9IHRydWU7XG4gICAgfVxuICB9XG59XG4iLCI8bmctY29udGFpbmVyICpuZ0lmPVwicGFuZWwgfCBhc3luYzsgbGV0IHBhbmVsXCI+XG4gIDxkaXYgW25nQ2xhc3NdPVwiZ2V0UGFuZWxTdGF0ZUNsYXNzZXMocGFuZWwpXCI+XG4gICAgPGRpdlxuICAgICAgY2xhc3M9XCJjbHItYWNjb3JkaW9uLWhlYWRlclwiXG4gICAgICBbYXR0ci5yb2xlXT1cImhlYWRpbmdFbmFibGVkIHx8IGV4cGxpY2l0SGVhZGluZ0xldmVsID8gJ2hlYWRpbmcnIDogbnVsbFwiXG4gICAgICBbYXR0ci5hcmlhLWxldmVsXT1cImhlYWRpbmdFbmFibGVkIHx8IGV4cGxpY2l0SGVhZGluZ0xldmVsID8gaGVhZGluZ0xldmVsIDogbnVsbFwiXG4gICAgPlxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3M9XCJjbHItYWNjb3JkaW9uLWhlYWRlci1idXR0b25cIlxuICAgICAgICAoY2xpY2spPVwidG9nZ2xlUGFuZWwoKVwiXG4gICAgICAgIFtpZF09XCJnZXRBY2NvcmRpb25IZWFkZXJJZChwYW5lbC50ZW1wbGF0ZUlkKVwiXG4gICAgICAgIFtkaXNhYmxlZF09XCJwYW5lbC5kaXNhYmxlZFwiXG4gICAgICAgIFthdHRyLmFyaWEtY29udHJvbHNdPVwiIXBhbmVsLmRpc2FibGVkICYmIHBhbmVsLm9wZW4gPyBnZXRBY2NvcmRpb25Db250ZW50SWQocGFuZWwudGVtcGxhdGVJZCkgOiBudWxsXCJcbiAgICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJwYW5lbC5vcGVuXCJcbiAgICAgICAgW2NsYXNzLmNsci1hY2NvcmRpb24taGVhZGVyLWhhcy1kZXNjcmlwdGlvbl09XCIoYWNjb3JkaW9uRGVzY3JpcHRpb24uY2hhbmdlcyB8IGFzeW5jKT8ubGVuZ3RoIHx8IGFjY29yZGlvbkRlc2NyaXB0aW9uLmxlbmd0aFwiXG4gICAgICAgICNoZWFkZXJCdXR0b25cbiAgICAgID5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItYWNjb3JkaW9uLXN0YXR1c1wiPlxuICAgICAgICAgIDxjZHMtaWNvbiBzaGFwZT1cImFuZ2xlXCIgZGlyZWN0aW9uPVwicmlnaHRcIiBjbGFzcz1cImNsci1hY2NvcmRpb24tYW5nbGVcIj48L2Nkcy1pY29uPlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1hY2NvcmRpb24tdGl0bGUsIGNsci1zdGVwLXRpdGxlXCI+PC9uZy1jb250ZW50PlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItYWNjb3JkaW9uLWRlc2NyaXB0aW9uLCBjbHItc3RlcC1kZXNjcmlwdGlvblwiPjwvbmctY29udGVudD5cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIDxkaXZcbiAgICAgIEBza2lwSW5pdGlhbFJlbmRlclxuICAgICAgcm9sZT1cInJlZ2lvblwiXG4gICAgICBjbGFzcz1cImNsci1hY2NvcmRpb24tY29udGVudC1yZWdpb25cIlxuICAgICAgW2lkXT1cImdldEFjY29yZGlvbkNvbnRlbnRJZChwYW5lbC50ZW1wbGF0ZUlkKVwiXG4gICAgICBbYXR0ci5hcmlhLWhpZGRlbl09XCIhcGFuZWwub3BlblwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiZ2V0QWNjb3JkaW9uSGVhZGVySWQocGFuZWwudGVtcGxhdGVJZClcIlxuICAgID5cbiAgICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJwYW5lbC5vcGVuXCJcbiAgICAgICAgQHRvZ2dsZVxuICAgICAgICAoQHRvZ2dsZS5kb25lKT1cImNvbGxhcHNlUGFuZWxPbkFuaW1hdGlvbkRvbmUocGFuZWwpXCJcbiAgICAgICAgY2xhc3M9XCJjbHItYWNjb3JkaW9uLWNvbnRlbnRcIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2xyLWFjY29yZGlvbi1pbm5lci1jb250ZW50XCI+XG4gICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvbmctY29udGFpbmVyPlxuIl19