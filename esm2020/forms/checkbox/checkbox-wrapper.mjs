/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, forwardRef, Inject, InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClrLabel } from '../common/label';
import { ControlIdService } from '../common/providers/control-id.service';
import { ClrCheckbox } from './checkbox';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../common/label";
import * as i3 from "rxjs";
export const IS_TOGGLE = new InjectionToken('IS_TOGGLE');
export function isToggleFactory() {
    return new BehaviorSubject(false);
}
export const IS_TOGGLE_PROVIDER = { provide: IS_TOGGLE, useFactory: isToggleFactory };
export class ClrCheckboxWrapper {
    constructor(toggleService) {
        this.toggle = false;
        this.subscriptions = [];
        this.subscriptions.push(toggleService.subscribe(state => {
            this.toggle = state;
        }));
    }
    ngOnInit() {
        if (this.label) {
            this.label.disableGrid();
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
ClrCheckboxWrapper.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCheckboxWrapper, deps: [{ token: IS_TOGGLE }], target: i0.ɵɵFactoryTarget.Component });
ClrCheckboxWrapper.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrCheckboxWrapper, selector: "clr-checkbox-wrapper,clr-toggle-wrapper", host: { properties: { "class.clr-checkbox-wrapper": "!toggle", "class.clr-checkbox-wrapper-disabled": "checkbox?.controlDisabled", "class.clr-toggle-wrapper": "toggle" } }, providers: [ControlIdService, IS_TOGGLE_PROVIDER], queries: [{ propertyName: "label", first: true, predicate: ClrLabel, descendants: true, static: true }, { propertyName: "checkbox", first: true, predicate: i0.forwardRef(function () { return ClrCheckbox; }), descendants: true, static: true }], ngImport: i0, template: `
    <ng-content select="[clrCheckbox],[clrToggle]"></ng-content>
    <ng-content select="label"></ng-content>
    <label *ngIf="!label"></label>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.ClrLabel, selector: "label", inputs: ["id", "for"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCheckboxWrapper, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-checkbox-wrapper,clr-toggle-wrapper',
                    template: `
    <ng-content select="[clrCheckbox],[clrToggle]"></ng-content>
    <ng-content select="label"></ng-content>
    <label *ngIf="!label"></label>
  `,
                    host: {
                        '[class.clr-checkbox-wrapper]': '!toggle',
                        '[class.clr-checkbox-wrapper-disabled]': 'checkbox?.controlDisabled',
                        '[class.clr-toggle-wrapper]': 'toggle',
                    },
                    providers: [ControlIdService, IS_TOGGLE_PROVIDER],
                }]
        }], ctorParameters: function () { return [{ type: i3.BehaviorSubject, decorators: [{
                    type: Inject,
                    args: [IS_TOGGLE]
                }] }]; }, propDecorators: { label: [{
                type: ContentChild,
                args: [ClrLabel, { static: true }]
            }], checkbox: [{
                type: ContentChild,
                args: [forwardRef(() => ClrCheckbox), { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtd3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2NoZWNrYm94L2NoZWNrYm94LXdyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBcUIsTUFBTSxlQUFlLENBQUM7QUFDL0csT0FBTyxFQUFFLGVBQWUsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFFckQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7Ozs7O0FBRXpDLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxJQUFJLGNBQWMsQ0FBMkIsV0FBVyxDQUFDLENBQUM7QUFDbkYsTUFBTSxVQUFVLGVBQWU7SUFDN0IsT0FBTyxJQUFJLGVBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBQ0QsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsQ0FBQztBQWdCdEYsTUFBTSxPQUFPLGtCQUFrQjtJQU03QixZQUErQixhQUF1QztRQUh0RSxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ1Asa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBR3pDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixhQUFhLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQzs7K0dBdEJVLGtCQUFrQixrQkFNVCxTQUFTO21HQU5sQixrQkFBa0IsK09BRmxCLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsNkRBR25DLFFBQVEsNEhBQ1MsV0FBVyxrRUFkaEM7Ozs7R0FJVDsyRkFRVSxrQkFBa0I7a0JBZDlCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHlDQUF5QztvQkFDbkQsUUFBUSxFQUFFOzs7O0dBSVQ7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLDhCQUE4QixFQUFFLFNBQVM7d0JBQ3pDLHVDQUF1QyxFQUFFLDJCQUEyQjt3QkFDcEUsNEJBQTRCLEVBQUUsUUFBUTtxQkFDdkM7b0JBQ0QsU0FBUyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUM7aUJBQ2xEOzswQkFPYyxNQUFNOzJCQUFDLFNBQVM7NENBTGEsS0FBSztzQkFBOUMsWUFBWTt1QkFBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUN1QixRQUFRO3NCQUF0RSxZQUFZO3VCQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgQ29udGVudENoaWxkLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdGlvblRva2VuLCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ2xyTGFiZWwgfSBmcm9tICcuLi9jb21tb24vbGFiZWwnO1xuaW1wb3J0IHsgQ29udHJvbElkU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvY29udHJvbC1pZC5zZXJ2aWNlJztcbmltcG9ydCB7IENsckNoZWNrYm94IH0gZnJvbSAnLi9jaGVja2JveCc7XG5cbmV4cG9ydCBjb25zdCBJU19UT0dHTEUgPSBuZXcgSW5qZWN0aW9uVG9rZW48QmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+PignSVNfVE9HR0xFJyk7XG5leHBvcnQgZnVuY3Rpb24gaXNUb2dnbGVGYWN0b3J5KCkge1xuICByZXR1cm4gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG59XG5leHBvcnQgY29uc3QgSVNfVE9HR0xFX1BST1ZJREVSID0geyBwcm92aWRlOiBJU19UT0dHTEUsIHVzZUZhY3Rvcnk6IGlzVG9nZ2xlRmFjdG9yeSB9O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItY2hlY2tib3gtd3JhcHBlcixjbHItdG9nZ2xlLXdyYXBwZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIltjbHJDaGVja2JveF0sW2NsclRvZ2dsZV1cIj48L25nLWNvbnRlbnQ+XG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwibGFiZWxcIj48L25nLWNvbnRlbnQ+XG4gICAgPGxhYmVsICpuZ0lmPVwiIWxhYmVsXCI+PC9sYWJlbD5cbiAgYCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLWNoZWNrYm94LXdyYXBwZXJdJzogJyF0b2dnbGUnLFxuICAgICdbY2xhc3MuY2xyLWNoZWNrYm94LXdyYXBwZXItZGlzYWJsZWRdJzogJ2NoZWNrYm94Py5jb250cm9sRGlzYWJsZWQnLFxuICAgICdbY2xhc3MuY2xyLXRvZ2dsZS13cmFwcGVyXSc6ICd0b2dnbGUnLFxuICB9LFxuICBwcm92aWRlcnM6IFtDb250cm9sSWRTZXJ2aWNlLCBJU19UT0dHTEVfUFJPVklERVJdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJDaGVja2JveFdyYXBwZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBDb250ZW50Q2hpbGQoQ2xyTGFiZWwsIHsgc3RhdGljOiB0cnVlIH0pIGxhYmVsOiBDbHJMYWJlbDtcbiAgQENvbnRlbnRDaGlsZChmb3J3YXJkUmVmKCgpID0+IENsckNoZWNrYm94KSwgeyBzdGF0aWM6IHRydWUgfSkgY2hlY2tib3g6IENsckNoZWNrYm94O1xuICB0b2dnbGUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoSVNfVE9HR0xFKSB0b2dnbGVTZXJ2aWNlOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4pIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRvZ2dsZVNlcnZpY2Uuc3Vic2NyaWJlKHN0YXRlID0+IHtcbiAgICAgICAgdGhpcy50b2dnbGUgPSBzdGF0ZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLmxhYmVsKSB7XG4gICAgICB0aGlzLmxhYmVsLmRpc2FibGVHcmlkKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2goc3ViID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgfVxufVxuIl19