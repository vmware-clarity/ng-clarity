/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, forwardRef, Optional } from '@angular/core';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ClrNumberInput } from './number-input';
import * as i0 from "@angular/core";
import * as i1 from "../common/providers/control-class.service";
import * as i2 from "../common/providers/layout.service";
import * as i3 from "../common/providers/ng-control.service";
import * as i4 from "../common/providers/focus.service";
import * as i5 from "../common/if-control-state/if-control-state.service";
import * as i6 from "@angular/common";
import * as i7 from "../../icon/icon";
import * as i8 from "../common/label";
export class ClrNumberInputContainer extends ClrAbstractContainer {
    constructor(controlClassService, layoutService, ngControlService, focusService, ifControlStateService) {
        super(ifControlStateService, layoutService, controlClassService, ngControlService);
        this.ifControlStateService = ifControlStateService;
        this.focus = false;
        this.subscriptions.push(focusService.focusChange.subscribe(state => (this.focus = state)));
    }
}
ClrNumberInputContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrNumberInputContainer, deps: [{ token: i1.ControlClassService }, { token: i2.LayoutService, optional: true }, { token: i3.NgControlService }, { token: i4.FocusService }, { token: i5.IfControlStateService }], target: i0.ɵɵFactoryTarget.Component });
ClrNumberInputContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrNumberInputContainer, selector: "clr-number-input-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-form-control-readonly": "input.readonly", "class.clr-row": "addGrid()" } }, providers: [FocusService, IfControlStateService, NgControlService, ControlIdService, ControlClassService], queries: [{ propertyName: "input", first: true, predicate: i0.forwardRef(function () { return ClrNumberInput; }), descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-number-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus">
          <ng-content select="[clrNumberInput]"></ng-content>
          <div class="clr-input-group-actions">
            <button
              type="button"
              class="clr-input-group-icon-action"
              (click)="input.stepDown()"
              [disabled]="control?.disabled"
            >
              <cds-icon shape="minus" size="sm"></cds-icon>
            </button>
            <div class="clr-number-input-separator"></div>
            <button
              type="button"
              class="clr-input-group-icon-action"
              (click)="input.stepUp()"
              [disabled]="control?.disabled"
            >
              <cds-icon shape="plus" size="sm"></cds-icon>
            </button>
          </div>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i6.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i7.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i8.ClrLabel, selector: "label", inputs: ["id", "for"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrNumberInputContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-number-input-container',
                    template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-number-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus">
          <ng-content select="[clrNumberInput]"></ng-content>
          <div class="clr-input-group-actions">
            <button
              type="button"
              class="clr-input-group-icon-action"
              (click)="input.stepDown()"
              [disabled]="control?.disabled"
            >
              <cds-icon shape="minus" size="sm"></cds-icon>
            </button>
            <div class="clr-number-input-separator"></div>
            <button
              type="button"
              class="clr-input-group-icon-action"
              (click)="input.stepUp()"
              [disabled]="control?.disabled"
            >
              <cds-icon shape="plus" size="sm"></cds-icon>
            </button>
          </div>
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
                        '[class.clr-form-control-readonly]': 'input.readonly',
                        '[class.clr-row]': 'addGrid()',
                    },
                    providers: [FocusService, IfControlStateService, NgControlService, ControlIdService, ControlClassService],
                }]
        }], ctorParameters: function () { return [{ type: i1.ControlClassService }, { type: i2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i3.NgControlService }, { type: i4.FocusService }, { type: i5.IfControlStateService }]; }, propDecorators: { input: [{
                type: ContentChild,
                args: [forwardRef(() => ClrNumberInput)]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyLWlucHV0LWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL251bWJlci1pbnB1dC9udW1iZXItaW5wdXQtY29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNwRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUM1RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNoRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFakUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDMUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7O0FBMkRoRCxNQUFNLE9BQU8sdUJBQXdCLFNBQVEsb0JBQW9CO0lBSy9ELFlBQ0UsbUJBQXdDLEVBQzVCLGFBQTRCLEVBQ3hDLGdCQUFrQyxFQUNsQyxZQUEwQixFQUNQLHFCQUE0QztRQUUvRCxLQUFLLENBQUMscUJBQXFCLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFGaEUsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQVRqRSxVQUFLLEdBQUcsS0FBSyxDQUFDO1FBYVosSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7O29IQWZVLHVCQUF1Qjt3R0FBdkIsdUJBQXVCLDRQQUZ2QixDQUFDLFlBQVksRUFBRSxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQyxnR0FLMUUsY0FBYywyRUExRG5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOENUOzJGQVNVLHVCQUF1QjtrQkF6RG5DLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtvQkFDdEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOENUO29CQUNELElBQUksRUFBRTt3QkFDSiwwQkFBMEIsRUFBRSxNQUFNO3dCQUNsQyxtQ0FBbUMsRUFBRSxtQkFBbUI7d0JBQ3hELG1DQUFtQyxFQUFFLGdCQUFnQjt3QkFDckQsaUJBQWlCLEVBQUUsV0FBVztxQkFDL0I7b0JBQ0QsU0FBUyxFQUFFLENBQUMsWUFBWSxFQUFFLHFCQUFxQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDO2lCQUMxRzs7MEJBUUksUUFBUTswSUFKd0QsS0FBSztzQkFBdkUsWUFBWTt1QkFBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgZm9yd2FyZFJlZiwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyQWJzdHJhY3RDb250YWluZXIgfSBmcm9tICcuLi9jb21tb24vYWJzdHJhY3QtY29udGFpbmVyJztcbmltcG9ydCB7IElmQ29udHJvbFN0YXRlU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9pZi1jb250cm9sLXN0YXRlL2lmLWNvbnRyb2wtc3RhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBDb250cm9sQ2xhc3NTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9jb250cm9sLWNsYXNzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udHJvbElkU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvY29udHJvbC1pZC5zZXJ2aWNlJztcbmltcG9ydCB7IEZvY3VzU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvZm9jdXMuc2VydmljZSc7XG5pbXBvcnQgeyBMYXlvdXRTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9sYXlvdXQuc2VydmljZSc7XG5pbXBvcnQgeyBOZ0NvbnRyb2xTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9uZy1jb250cm9sLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyTnVtYmVySW5wdXQgfSBmcm9tICcuL251bWJlci1pbnB1dCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1udW1iZXItaW5wdXQtY29udGFpbmVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJsYWJlbFwiPjwvbmctY29udGVudD5cbiAgICA8bGFiZWwgKm5nSWY9XCIhbGFiZWwgJiYgYWRkR3JpZCgpXCI+PC9sYWJlbD5cbiAgICA8ZGl2IGNsYXNzPVwiY2xyLWNvbnRyb2wtY29udGFpbmVyXCIgW25nQ2xhc3NdPVwiY29udHJvbENsYXNzKClcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjbHItbnVtYmVyLWlucHV0LXdyYXBwZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNsci1pbnB1dC1ncm91cFwiIFtjbGFzcy5jbHItZm9jdXNdPVwiZm9jdXNcIj5cbiAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbY2xyTnVtYmVySW5wdXRdXCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbHItaW5wdXQtZ3JvdXAtYWN0aW9uc1wiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJjbHItaW5wdXQtZ3JvdXAtaWNvbi1hY3Rpb25cIlxuICAgICAgICAgICAgICAoY2xpY2spPVwiaW5wdXQuc3RlcERvd24oKVwiXG4gICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJjb250cm9sPy5kaXNhYmxlZFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxjZHMtaWNvbiBzaGFwZT1cIm1pbnVzXCIgc2l6ZT1cInNtXCI+PC9jZHMtaWNvbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNsci1udW1iZXItaW5wdXQtc2VwYXJhdG9yXCI+PC9kaXY+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzcz1cImNsci1pbnB1dC1ncm91cC1pY29uLWFjdGlvblwiXG4gICAgICAgICAgICAgIChjbGljayk9XCJpbnB1dC5zdGVwVXAoKVwiXG4gICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJjb250cm9sPy5kaXNhYmxlZFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxjZHMtaWNvbiBzaGFwZT1cInBsdXNcIiBzaXplPVwic21cIj48L2Nkcy1pY29uPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAqbmdJZj1cInNob3dJbnZhbGlkXCJcbiAgICAgICAgICBjbGFzcz1cImNsci12YWxpZGF0ZS1pY29uXCJcbiAgICAgICAgICBzaGFwZT1cImV4Y2xhbWF0aW9uLWNpcmNsZVwiXG4gICAgICAgICAgc3RhdHVzPVwiZGFuZ2VyXCJcbiAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICA+PC9jZHMtaWNvbj5cbiAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgKm5nSWY9XCJzaG93VmFsaWRcIlxuICAgICAgICAgIGNsYXNzPVwiY2xyLXZhbGlkYXRlLWljb25cIlxuICAgICAgICAgIHNoYXBlPVwiY2hlY2stY2lyY2xlXCJcbiAgICAgICAgICBzdGF0dXM9XCJzdWNjZXNzXCJcbiAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICA+PC9jZHMtaWNvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWNvbnRyb2wtaGVscGVyXCIgKm5nSWY9XCJzaG93SGVscGVyXCI+PC9uZy1jb250ZW50PlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWNvbnRyb2wtZXJyb3JcIiAqbmdJZj1cInNob3dJbnZhbGlkXCI+PC9uZy1jb250ZW50PlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWNvbnRyb2wtc3VjY2Vzc1wiICpuZ0lmPVwic2hvd1ZhbGlkXCI+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICBgLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5jbHItZm9ybS1jb250cm9sXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmNsci1mb3JtLWNvbnRyb2wtZGlzYWJsZWRdJzogJ2NvbnRyb2w/LmRpc2FibGVkJyxcbiAgICAnW2NsYXNzLmNsci1mb3JtLWNvbnRyb2wtcmVhZG9ubHldJzogJ2lucHV0LnJlYWRvbmx5JyxcbiAgICAnW2NsYXNzLmNsci1yb3ddJzogJ2FkZEdyaWQoKScsXG4gIH0sXG4gIHByb3ZpZGVyczogW0ZvY3VzU2VydmljZSwgSWZDb250cm9sU3RhdGVTZXJ2aWNlLCBOZ0NvbnRyb2xTZXJ2aWNlLCBDb250cm9sSWRTZXJ2aWNlLCBDb250cm9sQ2xhc3NTZXJ2aWNlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyTnVtYmVySW5wdXRDb250YWluZXIgZXh0ZW5kcyBDbHJBYnN0cmFjdENvbnRhaW5lciB7XG4gIGZvY3VzID0gZmFsc2U7XG5cbiAgQENvbnRlbnRDaGlsZChmb3J3YXJkUmVmKCgpID0+IENsck51bWJlcklucHV0KSkgcHJvdGVjdGVkIHJlYWRvbmx5IGlucHV0OiBDbHJOdW1iZXJJbnB1dDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjb250cm9sQ2xhc3NTZXJ2aWNlOiBDb250cm9sQ2xhc3NTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIGxheW91dFNlcnZpY2U6IExheW91dFNlcnZpY2UsXG4gICAgbmdDb250cm9sU2VydmljZTogTmdDb250cm9sU2VydmljZSxcbiAgICBmb2N1c1NlcnZpY2U6IEZvY3VzU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgaWZDb250cm9sU3RhdGVTZXJ2aWNlOiBJZkNvbnRyb2xTdGF0ZVNlcnZpY2VcbiAgKSB7XG4gICAgc3VwZXIoaWZDb250cm9sU3RhdGVTZXJ2aWNlLCBsYXlvdXRTZXJ2aWNlLCBjb250cm9sQ2xhc3NTZXJ2aWNlLCBuZ0NvbnRyb2xTZXJ2aWNlKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKGZvY3VzU2VydmljZS5mb2N1c0NoYW5nZS5zdWJzY3JpYmUoc3RhdGUgPT4gKHRoaXMuZm9jdXMgPSBzdGF0ZSkpKTtcbiAgfVxufVxuIl19