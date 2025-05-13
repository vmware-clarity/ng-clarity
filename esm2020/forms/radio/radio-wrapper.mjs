/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild } from '@angular/core';
import { ClrLabel } from '../common/label';
import { ControlIdService } from '../common/providers/control-id.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../common/label";
export class ClrRadioWrapper {
    ngOnInit() {
        if (this.label) {
            this.label.disableGrid();
        }
    }
}
ClrRadioWrapper.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRadioWrapper, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClrRadioWrapper.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrRadioWrapper, selector: "clr-radio-wrapper", host: { properties: { "class.clr-radio-wrapper": "true" } }, providers: [ControlIdService], queries: [{ propertyName: "label", first: true, predicate: ClrLabel, descendants: true, static: true }], ngImport: i0, template: `
    <ng-content select="[clrRadio]"></ng-content>
    <ng-content select="label"></ng-content>
    <label *ngIf="!label"></label>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.ClrLabel, selector: "label", inputs: ["id", "for"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRadioWrapper, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-radio-wrapper',
                    template: `
    <ng-content select="[clrRadio]"></ng-content>
    <ng-content select="label"></ng-content>
    <label *ngIf="!label"></label>
  `,
                    host: {
                        '[class.clr-radio-wrapper]': 'true',
                    },
                    providers: [ControlIdService],
                }]
        }], propDecorators: { label: [{
                type: ContentChild,
                args: [ClrLabel, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8td3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL3JhZGlvL3JhZGlvLXdyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUVoRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7Ozs7QUFjMUUsTUFBTSxPQUFPLGVBQWU7SUFHMUIsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDMUI7SUFDSCxDQUFDOzs0R0FQVSxlQUFlO2dHQUFmLGVBQWUseUdBRmYsQ0FBQyxnQkFBZ0IsQ0FBQyw2REFHZixRQUFRLDhEQVhaOzs7O0dBSVQ7MkZBTVUsZUFBZTtrQkFaM0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixRQUFRLEVBQUU7Ozs7R0FJVDtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osMkJBQTJCLEVBQUUsTUFBTTtxQkFDcEM7b0JBQ0QsU0FBUyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7aUJBQzlCOzhCQUUyQyxLQUFLO3NCQUE5QyxZQUFZO3VCQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgQ29udGVudENoaWxkLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyTGFiZWwgfSBmcm9tICcuLi9jb21tb24vbGFiZWwnO1xuaW1wb3J0IHsgQ29udHJvbElkU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvY29udHJvbC1pZC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLXJhZGlvLXdyYXBwZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIltjbHJSYWRpb11cIj48L25nLWNvbnRlbnQ+XG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwibGFiZWxcIj48L25nLWNvbnRlbnQ+XG4gICAgPGxhYmVsICpuZ0lmPVwiIWxhYmVsXCI+PC9sYWJlbD5cbiAgYCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLXJhZGlvLXdyYXBwZXJdJzogJ3RydWUnLFxuICB9LFxuICBwcm92aWRlcnM6IFtDb250cm9sSWRTZXJ2aWNlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyUmFkaW9XcmFwcGVyIGltcGxlbWVudHMgT25Jbml0IHtcbiAgQENvbnRlbnRDaGlsZChDbHJMYWJlbCwgeyBzdGF0aWM6IHRydWUgfSkgbGFiZWw6IENsckxhYmVsO1xuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLmxhYmVsKSB7XG4gICAgICB0aGlzLmxhYmVsLmRpc2FibGVHcmlkKCk7XG4gICAgfVxuICB9XG59XG4iXX0=