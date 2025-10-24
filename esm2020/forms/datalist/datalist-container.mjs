/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Optional } from '@angular/core';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { DatalistIdService } from './providers/datalist-id.service';
import * as i0 from "@angular/core";
import * as i1 from "../common/providers/control-class.service";
import * as i2 from "../common/providers/layout.service";
import * as i3 from "../common/providers/ng-control.service";
import * as i4 from "../common/providers/focus.service";
import * as i5 from "../common/if-control-state/if-control-state.service";
import * as i6 from "@angular/common";
import * as i7 from "../common/label";
import * as i8 from "../../icon/icon";
export class ClrDatalistContainer extends ClrAbstractContainer {
    constructor(controlClassService, layoutService, ngControlService, focusService, ifControlStateService) {
        super(ifControlStateService, layoutService, controlClassService, ngControlService);
        this.ifControlStateService = ifControlStateService;
        this.focus = false;
        this.subscriptions.push(focusService.focusChange.subscribe(state => (this.focus = state)));
    }
}
ClrDatalistContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatalistContainer, deps: [{ token: i1.ControlClassService }, { token: i2.LayoutService, optional: true }, { token: i3.NgControlService }, { token: i4.FocusService }, { token: i5.IfControlStateService }], target: i0.ɵɵFactoryTarget.Component });
ClrDatalistContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatalistContainer, selector: "clr-datalist-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [
        ControlClassService,
        ControlIdService,
        FocusService,
        NgControlService,
        DatalistIdService,
        IfControlStateService,
    ], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus">
          <ng-content select="[clrDatalistInput]"></ng-content>
          <ng-content select="datalist"></ng-content>
          <cds-icon shape="angle" class="clr-datalist-caret" direction="down"></cds-icon>
        </div>
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
      </div>
      <ng-content select="clr-control-helper" *ngIf="showHelper"></ng-content>
      <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
      <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i6.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i7.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i8.CdsIconCustomTag, selector: "cds-icon" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatalistContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-datalist-container',
                    template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus">
          <ng-content select="[clrDatalistInput]"></ng-content>
          <ng-content select="datalist"></ng-content>
          <cds-icon shape="angle" class="clr-datalist-caret" direction="down"></cds-icon>
        </div>
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
      </div>
      <ng-content select="clr-control-helper" *ngIf="showHelper"></ng-content>
      <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
      <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
    </div>
  `,
                    host: {
                        '[class.clr-form-control]': 'true',
                        '[class.clr-form-control-disabled]': 'control?.disabled',
                        '[class.clr-row]': 'addGrid()',
                    },
                    providers: [
                        ControlClassService,
                        ControlIdService,
                        FocusService,
                        NgControlService,
                        DatalistIdService,
                        IfControlStateService,
                    ],
                }]
        }], ctorParameters: function () { return [{ type: i1.ControlClassService }, { type: i2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i3.NgControlService }, { type: i4.FocusService }, { type: i5.IfControlStateService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWxpc3QtY29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvZGF0YWxpc3QvZGF0YWxpc3QtY29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFcEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDcEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDNUYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDaEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDMUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRWpFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDOzs7Ozs7Ozs7O0FBZ0RwRSxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsb0JBQW9CO0lBRzVELFlBQ0UsbUJBQXdDLEVBQzVCLGFBQTRCLEVBQ3hDLGdCQUFrQyxFQUNsQyxZQUEwQixFQUNQLHFCQUE0QztRQUUvRCxLQUFLLENBQUMscUJBQXFCLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFGaEUsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQVBqRSxVQUFLLEdBQUcsS0FBSyxDQUFDO1FBV1osSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7O2lIQWJVLG9CQUFvQjtxR0FBcEIsb0JBQW9CLG1NQVRwQjtRQUNULG1CQUFtQjtRQUNuQixnQkFBZ0I7UUFDaEIsWUFBWTtRQUNaLGdCQUFnQjtRQUNoQixpQkFBaUI7UUFDakIscUJBQXFCO0tBQ3RCLGlEQTFDUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2QlQ7MkZBZVUsb0JBQW9CO2tCQTlDaEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsd0JBQXdCO29CQUNsQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkJUO29CQUNELElBQUksRUFBRTt3QkFDSiwwQkFBMEIsRUFBRSxNQUFNO3dCQUNsQyxtQ0FBbUMsRUFBRSxtQkFBbUI7d0JBQ3hELGlCQUFpQixFQUFFLFdBQVc7cUJBQy9CO29CQUNELFNBQVMsRUFBRTt3QkFDVCxtQkFBbUI7d0JBQ25CLGdCQUFnQjt3QkFDaEIsWUFBWTt3QkFDWixnQkFBZ0I7d0JBQ2hCLGlCQUFpQjt3QkFDakIscUJBQXFCO3FCQUN0QjtpQkFDRjs7MEJBTUksUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJBYnN0cmFjdENvbnRhaW5lciB9IGZyb20gJy4uL2NvbW1vbi9hYnN0cmFjdC1jb250YWluZXInO1xuaW1wb3J0IHsgSWZDb250cm9sU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL2lmLWNvbnRyb2wtc3RhdGUvaWYtY29udHJvbC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnRyb2xDbGFzc1NlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL2NvbnRyb2wtY2xhc3Muc2VydmljZSc7XG5pbXBvcnQgeyBDb250cm9sSWRTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9jb250cm9sLWlkLnNlcnZpY2UnO1xuaW1wb3J0IHsgRm9jdXNTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9mb2N1cy5zZXJ2aWNlJztcbmltcG9ydCB7IExheW91dFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL2xheW91dC5zZXJ2aWNlJztcbmltcG9ydCB7IE5nQ29udHJvbFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL25nLWNvbnRyb2wuc2VydmljZSc7XG5pbXBvcnQgeyBEYXRhbGlzdElkU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RhdGFsaXN0LWlkLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGF0YWxpc3QtY29udGFpbmVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJsYWJlbFwiPjwvbmctY29udGVudD5cbiAgICA8bGFiZWwgKm5nSWY9XCIhbGFiZWwgJiYgYWRkR3JpZCgpXCI+PC9sYWJlbD5cbiAgICA8ZGl2IGNsYXNzPVwiY2xyLWNvbnRyb2wtY29udGFpbmVyXCIgW25nQ2xhc3NdPVwiY29udHJvbENsYXNzKClcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjbHItaW5wdXQtd3JhcHBlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2xyLWlucHV0LWdyb3VwXCIgW2NsYXNzLmNsci1mb2N1c109XCJmb2N1c1wiPlxuICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIltjbHJEYXRhbGlzdElucHV0XVwiPjwvbmctY29udGVudD5cbiAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJkYXRhbGlzdFwiPjwvbmctY29udGVudD5cbiAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJhbmdsZVwiIGNsYXNzPVwiY2xyLWRhdGFsaXN0LWNhcmV0XCIgZGlyZWN0aW9uPVwiZG93blwiPjwvY2RzLWljb24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAqbmdJZj1cInNob3dJbnZhbGlkXCJcbiAgICAgICAgICBjbGFzcz1cImNsci12YWxpZGF0ZS1pY29uXCJcbiAgICAgICAgICBzaGFwZT1cImV4Y2xhbWF0aW9uLWNpcmNsZVwiXG4gICAgICAgICAgc3RhdHVzPVwiZGFuZ2VyXCJcbiAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICA+PC9jZHMtaWNvbj5cbiAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgKm5nSWY9XCJzaG93VmFsaWRcIlxuICAgICAgICAgIGNsYXNzPVwiY2xyLXZhbGlkYXRlLWljb25cIlxuICAgICAgICAgIHNoYXBlPVwiY2hlY2stY2lyY2xlXCJcbiAgICAgICAgICBzdGF0dXM9XCJzdWNjZXNzXCJcbiAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICA+PC9jZHMtaWNvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWNvbnRyb2wtaGVscGVyXCIgKm5nSWY9XCJzaG93SGVscGVyXCI+PC9uZy1jb250ZW50PlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWNvbnRyb2wtZXJyb3JcIiAqbmdJZj1cInNob3dJbnZhbGlkXCI+PC9uZy1jb250ZW50PlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWNvbnRyb2wtc3VjY2Vzc1wiICpuZ0lmPVwic2hvd1ZhbGlkXCI+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICBgLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5jbHItZm9ybS1jb250cm9sXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmNsci1mb3JtLWNvbnRyb2wtZGlzYWJsZWRdJzogJ2NvbnRyb2w/LmRpc2FibGVkJyxcbiAgICAnW2NsYXNzLmNsci1yb3ddJzogJ2FkZEdyaWQoKScsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIENvbnRyb2xDbGFzc1NlcnZpY2UsXG4gICAgQ29udHJvbElkU2VydmljZSxcbiAgICBGb2N1c1NlcnZpY2UsXG4gICAgTmdDb250cm9sU2VydmljZSxcbiAgICBEYXRhbGlzdElkU2VydmljZSxcbiAgICBJZkNvbnRyb2xTdGF0ZVNlcnZpY2UsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIENsckRhdGFsaXN0Q29udGFpbmVyIGV4dGVuZHMgQ2xyQWJzdHJhY3RDb250YWluZXIge1xuICBmb2N1cyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNvbnRyb2xDbGFzc1NlcnZpY2U6IENvbnRyb2xDbGFzc1NlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgbGF5b3V0U2VydmljZTogTGF5b3V0U2VydmljZSxcbiAgICBuZ0NvbnRyb2xTZXJ2aWNlOiBOZ0NvbnRyb2xTZXJ2aWNlLFxuICAgIGZvY3VzU2VydmljZTogRm9jdXNTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBpZkNvbnRyb2xTdGF0ZVNlcnZpY2U6IElmQ29udHJvbFN0YXRlU2VydmljZVxuICApIHtcbiAgICBzdXBlcihpZkNvbnRyb2xTdGF0ZVNlcnZpY2UsIGxheW91dFNlcnZpY2UsIGNvbnRyb2xDbGFzc1NlcnZpY2UsIG5nQ29udHJvbFNlcnZpY2UpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goZm9jdXNTZXJ2aWNlLmZvY3VzQ2hhbmdlLnN1YnNjcmliZShzdGF0ZSA9PiAodGhpcy5mb2N1cyA9IHN0YXRlKSkpO1xuICB9XG59XG4iXX0=