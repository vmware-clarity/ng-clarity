/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChildren, Input, Optional } from '@angular/core';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ContainerIdService } from '../common/providers/container-id.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ClrCheckbox } from './checkbox';
import * as i0 from "@angular/core";
import * as i1 from "../common/providers/layout.service";
import * as i2 from "../common/providers/control-class.service";
import * as i3 from "../common/providers/ng-control.service";
import * as i4 from "../common/if-control-state/if-control-state.service";
import * as i5 from "@angular/common";
import * as i6 from "../../icon/icon";
import * as i7 from "../common/label";
export class ClrCheckboxContainer extends ClrAbstractContainer {
    constructor(layoutService, controlClassService, ngControlService, ifControlStateService) {
        super(ifControlStateService, layoutService, controlClassService, ngControlService);
        this.layoutService = layoutService;
        this.controlClassService = controlClassService;
        this.ngControlService = ngControlService;
        this.ifControlStateService = ifControlStateService;
        this.inline = false;
    }
    /*
     * Here we want to support the following cases
     * clrInline - true by presence
     * clrInline="true|false" - unless it is explicitly false, strings are considered true
     * [clrInline]="true|false" - expect a boolean
     */
    get clrInline() {
        return this.inline;
    }
    set clrInline(value) {
        if (typeof value === 'string') {
            this.inline = value === 'false' ? false : true;
        }
        else {
            this.inline = !!value;
        }
    }
    get allCheckboxesDisabled() {
        return (this.control?.disabled &&
            (!this.additionalControls?.length || this.additionalControls.every(control => control.disabled)));
    }
    ngAfterContentInit() {
        this.setAriaRoles();
    }
    setAriaRoles() {
        this.role = this.checkboxes.length ? 'group' : null;
    }
}
ClrCheckboxContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCheckboxContainer, deps: [{ token: i1.LayoutService, optional: true }, { token: i2.ControlClassService }, { token: i3.NgControlService }, { token: i4.IfControlStateService }], target: i0.ɵɵFactoryTarget.Component });
ClrCheckboxContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrCheckboxContainer, selector: "clr-checkbox-container,clr-toggle-container", inputs: { clrInline: "clrInline" }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "allCheckboxesDisabled", "class.clr-row": "addGrid()", "attr.role": "role" } }, providers: [IfControlStateService, NgControlService, ControlClassService, ContainerIdService], queries: [{ propertyName: "checkboxes", predicate: ClrCheckbox, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [class.clr-control-inline]="clrInline" [ngClass]="controlClass()">
      <ng-content select="clr-checkbox-wrapper,clr-toggle-wrapper"></ng-content>
      <div *ngIf="showHelper" class="clr-subtext-wrapper">
        <ng-content select="clr-control-helper"></ng-content>
      </div>
      <div *ngIf="showInvalid || showValid" class="clr-subtext-wrapper">
        <cds-icon
          *ngIf="showInvalid"
          class="clr-validate-icon"
          shape="exclamation-circle"
          status="danger"
          aria-hidden="true"
        ></cds-icon>
        <cds-icon
          *ngIf="showValid"
          class="clr-validate-icon"
          shape="check-circle"
          status="success"
          aria-hidden="true"
        ></cds-icon>
        <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
        <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
      </div>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i5.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i7.ClrLabel, selector: "label", inputs: ["id", "for"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCheckboxContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-checkbox-container,clr-toggle-container',
                    template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [class.clr-control-inline]="clrInline" [ngClass]="controlClass()">
      <ng-content select="clr-checkbox-wrapper,clr-toggle-wrapper"></ng-content>
      <div *ngIf="showHelper" class="clr-subtext-wrapper">
        <ng-content select="clr-control-helper"></ng-content>
      </div>
      <div *ngIf="showInvalid || showValid" class="clr-subtext-wrapper">
        <cds-icon
          *ngIf="showInvalid"
          class="clr-validate-icon"
          shape="exclamation-circle"
          status="danger"
          aria-hidden="true"
        ></cds-icon>
        <cds-icon
          *ngIf="showValid"
          class="clr-validate-icon"
          shape="check-circle"
          status="success"
          aria-hidden="true"
        ></cds-icon>
        <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
        <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
      </div>
    </div>
  `,
                    host: {
                        '[class.clr-form-control]': 'true',
                        '[class.clr-form-control-disabled]': 'allCheckboxesDisabled',
                        '[class.clr-row]': 'addGrid()',
                        '[attr.role]': 'role',
                    },
                    providers: [IfControlStateService, NgControlService, ControlClassService, ContainerIdService],
                }]
        }], ctorParameters: function () { return [{ type: i1.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i2.ControlClassService }, { type: i3.NgControlService }, { type: i4.IfControlStateService }]; }, propDecorators: { checkboxes: [{
                type: ContentChildren,
                args: [ClrCheckbox, { descendants: true }]
            }], clrInline: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtY29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY2hlY2tib3gvY2hlY2tib3gtY29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFvQixTQUFTLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFFekcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDcEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDNUYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDOUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFFaEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDMUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQzs7Ozs7Ozs7O0FBd0N6QyxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsb0JBQW9CO0lBTzVELFlBQ2lDLGFBQTRCLEVBQ3hDLG1CQUF3QyxFQUN4QyxnQkFBa0MsRUFDbEMscUJBQTRDO1FBRS9ELEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUxwRCxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUN4Qyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQU56RCxXQUFNLEdBQUcsS0FBSyxDQUFDO0lBU3ZCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILElBQ0ksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBQ0QsSUFBSSxTQUFTLENBQUMsS0FBdUI7UUFDbkMsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztTQUNoRDthQUFNO1lBQ0wsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQ3ZCO0lBQ0gsQ0FBQztJQUVELElBQWMscUJBQXFCO1FBQ2pDLE9BQU8sQ0FDTCxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVE7WUFDdEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUNqRyxDQUFDO0lBQ0osQ0FBQztJQUVRLGtCQUFrQjtRQUN6QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVPLFlBQVk7UUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDdEQsQ0FBQzs7aUhBL0NVLG9CQUFvQjtxR0FBcEIsb0JBQW9CLHFSQUZwQixDQUFDLHFCQUFxQixFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixFQUFFLGtCQUFrQixDQUFDLHFEQUs1RSxXQUFXLHVFQXZDbEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJCVDsyRkFTVSxvQkFBb0I7a0JBdENoQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSw2Q0FBNkM7b0JBQ3ZELFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkJUO29CQUNELElBQUksRUFBRTt3QkFDSiwwQkFBMEIsRUFBRSxNQUFNO3dCQUNsQyxtQ0FBbUMsRUFBRSx1QkFBdUI7d0JBQzVELGlCQUFpQixFQUFFLFdBQVc7d0JBQzlCLGFBQWEsRUFBRSxNQUFNO3FCQUN0QjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsQ0FBQztpQkFDOUY7OzBCQVNJLFFBQVE7aUpBTDBDLFVBQVU7c0JBQTlELGVBQWU7dUJBQUMsV0FBVyxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRTtnQkFvQi9DLFNBQVM7c0JBRFosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIElucHV0LCBPcHRpb25hbCwgUXVlcnlMaXN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckFic3RyYWN0Q29udGFpbmVyIH0gZnJvbSAnLi4vY29tbW9uL2Fic3RyYWN0LWNvbnRhaW5lcic7XG5pbXBvcnQgeyBJZkNvbnRyb2xTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vaWYtY29udHJvbC1zdGF0ZS9pZi1jb250cm9sLXN0YXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udGFpbmVySWRTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9jb250YWluZXItaWQuc2VydmljZSc7XG5pbXBvcnQgeyBDb250cm9sQ2xhc3NTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9jb250cm9sLWNsYXNzLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5b3V0U2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvbGF5b3V0LnNlcnZpY2UnO1xuaW1wb3J0IHsgTmdDb250cm9sU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvbmctY29udHJvbC5zZXJ2aWNlJztcbmltcG9ydCB7IENsckNoZWNrYm94IH0gZnJvbSAnLi9jaGVja2JveCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1jaGVja2JveC1jb250YWluZXIsY2xyLXRvZ2dsZS1jb250YWluZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImxhYmVsXCI+PC9uZy1jb250ZW50PlxuICAgIDxsYWJlbCAqbmdJZj1cIiFsYWJlbCAmJiBhZGRHcmlkKClcIj48L2xhYmVsPlxuICAgIDxkaXYgY2xhc3M9XCJjbHItY29udHJvbC1jb250YWluZXJcIiBbY2xhc3MuY2xyLWNvbnRyb2wtaW5saW5lXT1cImNscklubGluZVwiIFtuZ0NsYXNzXT1cImNvbnRyb2xDbGFzcygpXCI+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItY2hlY2tib3gtd3JhcHBlcixjbHItdG9nZ2xlLXdyYXBwZXJcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8ZGl2ICpuZ0lmPVwic2hvd0hlbHBlclwiIGNsYXNzPVwiY2xyLXN1YnRleHQtd3JhcHBlclwiPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItY29udHJvbC1oZWxwZXJcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgKm5nSWY9XCJzaG93SW52YWxpZCB8fCBzaG93VmFsaWRcIiBjbGFzcz1cImNsci1zdWJ0ZXh0LXdyYXBwZXJcIj5cbiAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgKm5nSWY9XCJzaG93SW52YWxpZFwiXG4gICAgICAgICAgY2xhc3M9XCJjbHItdmFsaWRhdGUtaWNvblwiXG4gICAgICAgICAgc2hhcGU9XCJleGNsYW1hdGlvbi1jaXJjbGVcIlxuICAgICAgICAgIHN0YXR1cz1cImRhbmdlclwiXG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICpuZ0lmPVwic2hvd1ZhbGlkXCJcbiAgICAgICAgICBjbGFzcz1cImNsci12YWxpZGF0ZS1pY29uXCJcbiAgICAgICAgICBzaGFwZT1cImNoZWNrLWNpcmNsZVwiXG4gICAgICAgICAgc3RhdHVzPVwic3VjY2Vzc1wiXG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLWVycm9yXCIgKm5nSWY9XCJzaG93SW52YWxpZFwiPjwvbmctY29udGVudD5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWNvbnRyb2wtc3VjY2Vzc1wiICpuZ0lmPVwic2hvd1ZhbGlkXCI+PC9uZy1jb250ZW50PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmNsci1mb3JtLWNvbnRyb2xdJzogJ3RydWUnLFxuICAgICdbY2xhc3MuY2xyLWZvcm0tY29udHJvbC1kaXNhYmxlZF0nOiAnYWxsQ2hlY2tib3hlc0Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLmNsci1yb3ddJzogJ2FkZEdyaWQoKScsXG4gICAgJ1thdHRyLnJvbGVdJzogJ3JvbGUnLFxuICB9LFxuICBwcm92aWRlcnM6IFtJZkNvbnRyb2xTdGF0ZVNlcnZpY2UsIE5nQ29udHJvbFNlcnZpY2UsIENvbnRyb2xDbGFzc1NlcnZpY2UsIENvbnRhaW5lcklkU2VydmljZV0sXG59KVxuZXhwb3J0IGNsYXNzIENsckNoZWNrYm94Q29udGFpbmVyIGV4dGVuZHMgQ2xyQWJzdHJhY3RDb250YWluZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcbiAgcm9sZTogc3RyaW5nO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oQ2xyQ2hlY2tib3gsIHsgZGVzY2VuZGFudHM6IHRydWUgfSkgY2hlY2tib3hlczogUXVlcnlMaXN0PENsckNoZWNrYm94PjtcblxuICBwcml2YXRlIGlubGluZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIHByb3RlY3RlZCBvdmVycmlkZSBsYXlvdXRTZXJ2aWNlOiBMYXlvdXRTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBjb250cm9sQ2xhc3NTZXJ2aWNlOiBDb250cm9sQ2xhc3NTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBuZ0NvbnRyb2xTZXJ2aWNlOiBOZ0NvbnRyb2xTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBpZkNvbnRyb2xTdGF0ZVNlcnZpY2U6IElmQ29udHJvbFN0YXRlU2VydmljZVxuICApIHtcbiAgICBzdXBlcihpZkNvbnRyb2xTdGF0ZVNlcnZpY2UsIGxheW91dFNlcnZpY2UsIGNvbnRyb2xDbGFzc1NlcnZpY2UsIG5nQ29udHJvbFNlcnZpY2UpO1xuICB9XG5cbiAgLypcbiAgICogSGVyZSB3ZSB3YW50IHRvIHN1cHBvcnQgdGhlIGZvbGxvd2luZyBjYXNlc1xuICAgKiBjbHJJbmxpbmUgLSB0cnVlIGJ5IHByZXNlbmNlXG4gICAqIGNscklubGluZT1cInRydWV8ZmFsc2VcIiAtIHVubGVzcyBpdCBpcyBleHBsaWNpdGx5IGZhbHNlLCBzdHJpbmdzIGFyZSBjb25zaWRlcmVkIHRydWVcbiAgICogW2NscklubGluZV09XCJ0cnVlfGZhbHNlXCIgLSBleHBlY3QgYSBib29sZWFuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgY2xySW5saW5lKCkge1xuICAgIHJldHVybiB0aGlzLmlubGluZTtcbiAgfVxuICBzZXQgY2xySW5saW5lKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuaW5saW5lID0gdmFsdWUgPT09ICdmYWxzZScgPyBmYWxzZSA6IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5saW5lID0gISF2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGFsbENoZWNrYm94ZXNEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5jb250cm9sPy5kaXNhYmxlZCAmJlxuICAgICAgKCF0aGlzLmFkZGl0aW9uYWxDb250cm9scz8ubGVuZ3RoIHx8IHRoaXMuYWRkaXRpb25hbENvbnRyb2xzLmV2ZXJ5KGNvbnRyb2wgPT4gY29udHJvbC5kaXNhYmxlZCkpXG4gICAgKTtcbiAgfVxuXG4gIG92ZXJyaWRlIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLnNldEFyaWFSb2xlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRBcmlhUm9sZXMoKSB7XG4gICAgdGhpcy5yb2xlID0gdGhpcy5jaGVja2JveGVzLmxlbmd0aCA/ICdncm91cCcgOiBudWxsO1xuICB9XG59XG4iXX0=