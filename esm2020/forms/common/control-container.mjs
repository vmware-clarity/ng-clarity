/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from './if-control-state/if-control-state.service';
import { ControlClassService } from './providers/control-class.service';
import { ControlIdService } from './providers/control-id.service';
import { NgControlService } from './providers/ng-control.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../../icon/icon";
import * as i3 from "./label";
export class ClrControlContainer extends ClrAbstractContainer {
}
ClrControlContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrControlContainer, deps: null, target: i0.ɵɵFactoryTarget.Component });
ClrControlContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrControlContainer, selector: "clr-control-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [IfControlStateService, NgControlService, ControlIdService, ControlClassService], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <ng-content></ng-content>
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrControlContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-control-container',
                    template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <ng-content></ng-content>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbC1jb250YWluZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9jb21tb24vY29udHJvbC1jb250YWluZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDOzs7OztBQXFDbEUsTUFBTSxPQUFPLG1CQUFvQixTQUFRLG9CQUFvQjs7Z0hBQWhELG1CQUFtQjtvR0FBbkIsbUJBQW1CLGtNQUZuQixDQUFDLHFCQUFxQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDLGlEQS9CakY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5QlQ7MkZBUVUsbUJBQW1CO2tCQW5DL0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsdUJBQXVCO29CQUNqQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5QlQ7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLDBCQUEwQixFQUFFLE1BQU07d0JBQ2xDLG1DQUFtQyxFQUFFLG1CQUFtQjt3QkFDeEQsaUJBQWlCLEVBQUUsV0FBVztxQkFDL0I7b0JBQ0QsU0FBUyxFQUFFLENBQUMscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUM7aUJBQzVGIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyQWJzdHJhY3RDb250YWluZXIgfSBmcm9tICcuLi9jb21tb24vYWJzdHJhY3QtY29udGFpbmVyJztcbmltcG9ydCB7IElmQ29udHJvbFN0YXRlU2VydmljZSB9IGZyb20gJy4vaWYtY29udHJvbC1zdGF0ZS9pZi1jb250cm9sLXN0YXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udHJvbENsYXNzU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2NvbnRyb2wtY2xhc3Muc2VydmljZSc7XG5pbXBvcnQgeyBDb250cm9sSWRTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvY29udHJvbC1pZC5zZXJ2aWNlJztcbmltcG9ydCB7IE5nQ29udHJvbFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9uZy1jb250cm9sLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItY29udHJvbC1jb250YWluZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImxhYmVsXCI+PC9uZy1jb250ZW50PlxuICAgIDxsYWJlbCAqbmdJZj1cIiFsYWJlbCAmJiBhZGRHcmlkKClcIj48L2xhYmVsPlxuICAgIDxkaXYgY2xhc3M9XCJjbHItY29udHJvbC1jb250YWluZXJcIiBbbmdDbGFzc109XCJjb250cm9sQ2xhc3MoKVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImNsci1pbnB1dC13cmFwcGVyXCI+XG4gICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgKm5nSWY9XCJzaG93SW52YWxpZFwiXG4gICAgICAgICAgY2xhc3M9XCJjbHItdmFsaWRhdGUtaWNvblwiXG4gICAgICAgICAgc2hhcGU9XCJleGNsYW1hdGlvbi1jaXJjbGVcIlxuICAgICAgICAgIHN0YXR1cz1cImRhbmdlclwiXG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICpuZ0lmPVwic2hvd1ZhbGlkXCJcbiAgICAgICAgICBjbGFzcz1cImNsci12YWxpZGF0ZS1pY29uXCJcbiAgICAgICAgICBzaGFwZT1cImNoZWNrLWNpcmNsZVwiXG4gICAgICAgICAgc3RhdHVzPVwic3VjY2Vzc1wiXG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLWhlbHBlclwiICpuZ0lmPVwic2hvd0hlbHBlclwiPjwvbmctY29udGVudD5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLWVycm9yXCIgKm5nSWY9XCJzaG93SW52YWxpZFwiPjwvbmctY29udGVudD5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLXN1Y2Nlc3NcIiAqbmdJZj1cInNob3dWYWxpZFwiPjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLWZvcm0tY29udHJvbF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5jbHItZm9ybS1jb250cm9sLWRpc2FibGVkXSc6ICdjb250cm9sPy5kaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5jbHItcm93XSc6ICdhZGRHcmlkKCknLFxuICB9LFxuICBwcm92aWRlcnM6IFtJZkNvbnRyb2xTdGF0ZVNlcnZpY2UsIE5nQ29udHJvbFNlcnZpY2UsIENvbnRyb2xJZFNlcnZpY2UsIENvbnRyb2xDbGFzc1NlcnZpY2VdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJDb250cm9sQ29udGFpbmVyIGV4dGVuZHMgQ2xyQWJzdHJhY3RDb250YWluZXIge31cbiJdfQ==