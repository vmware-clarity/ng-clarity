/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { NgControlService } from '../common/providers/ng-control.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../../icon/icon";
import * as i3 from "../common/label";
export class ClrInputContainer extends ClrAbstractContainer {
}
ClrInputContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrInputContainer, deps: null, target: i0.ɵɵFactoryTarget.Component });
ClrInputContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrInputContainer, selector: "clr-input-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [IfControlStateService, NgControlService, ControlIdService, ControlClassService], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group">
          <ng-content select="[clrInputPrefix]"></ng-content>
          <ng-content select="[clrInput]"></ng-content>
          <ng-content select="[clrInputSuffix]"></ng-content>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i3.ClrLabel, selector: "label", inputs: ["id", "for"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrInputContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-input-container',
                    template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group">
          <ng-content select="[clrInputPrefix]"></ng-content>
          <ng-content select="[clrInput]"></ng-content>
          <ng-content select="[clrInputSuffix]"></ng-content>
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
                    providers: [IfControlStateService, NgControlService, ControlIdService, ControlClassService],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtY29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvaW5wdXQvaW5wdXQtY29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUxQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNwRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUM1RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNoRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQzs7Ozs7QUF5QzFFLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxvQkFBb0I7OzhHQUE5QyxpQkFBaUI7a0dBQWpCLGlCQUFpQixnTUFGakIsQ0FBQyxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQyxpREFuQ2pGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZCVDsyRkFRVSxpQkFBaUI7a0JBdkM3QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2QlQ7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLDBCQUEwQixFQUFFLE1BQU07d0JBQ2xDLG1DQUFtQyxFQUFFLG1CQUFtQjt3QkFDeEQsaUJBQWlCLEVBQUUsV0FBVztxQkFDL0I7b0JBQ0QsU0FBUyxFQUFFLENBQUMscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUM7aUJBQzVGIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyQWJzdHJhY3RDb250YWluZXIgfSBmcm9tICcuLi9jb21tb24vYWJzdHJhY3QtY29udGFpbmVyJztcbmltcG9ydCB7IElmQ29udHJvbFN0YXRlU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9pZi1jb250cm9sLXN0YXRlL2lmLWNvbnRyb2wtc3RhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBDb250cm9sQ2xhc3NTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9jb250cm9sLWNsYXNzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udHJvbElkU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvY29udHJvbC1pZC5zZXJ2aWNlJztcbmltcG9ydCB7IE5nQ29udHJvbFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL25nLWNvbnRyb2wuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1pbnB1dC1jb250YWluZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImxhYmVsXCI+PC9uZy1jb250ZW50PlxuICAgIDxsYWJlbCAqbmdJZj1cIiFsYWJlbCAmJiBhZGRHcmlkKClcIj48L2xhYmVsPlxuICAgIDxkaXYgY2xhc3M9XCJjbHItY29udHJvbC1jb250YWluZXJcIiBbbmdDbGFzc109XCJjb250cm9sQ2xhc3MoKVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImNsci1pbnB1dC13cmFwcGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjbHItaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbY2xySW5wdXRQcmVmaXhdXCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIltjbHJJbnB1dF1cIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2NscklucHV0U3VmZml4XVwiPjwvbmctY29udGVudD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICpuZ0lmPVwic2hvd0ludmFsaWRcIlxuICAgICAgICAgIGNsYXNzPVwiY2xyLXZhbGlkYXRlLWljb25cIlxuICAgICAgICAgIHNoYXBlPVwiZXhjbGFtYXRpb24tY2lyY2xlXCJcbiAgICAgICAgICBzdGF0dXM9XCJkYW5nZXJcIlxuICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAqbmdJZj1cInNob3dWYWxpZFwiXG4gICAgICAgICAgY2xhc3M9XCJjbHItdmFsaWRhdGUtaWNvblwiXG4gICAgICAgICAgc2hhcGU9XCJjaGVjay1jaXJjbGVcIlxuICAgICAgICAgIHN0YXR1cz1cInN1Y2Nlc3NcIlxuICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgPC9kaXY+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItY29udHJvbC1oZWxwZXJcIiAqbmdJZj1cInNob3dIZWxwZXJcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItY29udHJvbC1lcnJvclwiICpuZ0lmPVwic2hvd0ludmFsaWRcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItY29udHJvbC1zdWNjZXNzXCIgKm5nSWY9XCJzaG93VmFsaWRcIj48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmNsci1mb3JtLWNvbnRyb2xdJzogJ3RydWUnLFxuICAgICdbY2xhc3MuY2xyLWZvcm0tY29udHJvbC1kaXNhYmxlZF0nOiAnY29udHJvbD8uZGlzYWJsZWQnLFxuICAgICdbY2xhc3MuY2xyLXJvd10nOiAnYWRkR3JpZCgpJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbSWZDb250cm9sU3RhdGVTZXJ2aWNlLCBOZ0NvbnRyb2xTZXJ2aWNlLCBDb250cm9sSWRTZXJ2aWNlLCBDb250cm9sQ2xhc3NTZXJ2aWNlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xySW5wdXRDb250YWluZXIgZXh0ZW5kcyBDbHJBYnN0cmFjdENvbnRhaW5lciB7fVxuIl19