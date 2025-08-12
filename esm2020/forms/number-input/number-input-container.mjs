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
    focusOut() {
        this.input.dispatchBlur();
    }
}
ClrNumberInputContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrNumberInputContainer, deps: [{ token: i1.ControlClassService }, { token: i2.LayoutService, optional: true }, { token: i3.NgControlService }, { token: i4.FocusService }, { token: i5.IfControlStateService }], target: i0.ɵɵFactoryTarget.Component });
ClrNumberInputContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrNumberInputContainer, selector: "clr-number-input-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-form-control-readonly": "input.readonly", "class.clr-row": "addGrid()" } }, providers: [FocusService, IfControlStateService, NgControlService, ControlIdService, ControlClassService], queries: [{ propertyName: "input", first: true, predicate: i0.forwardRef(function () { return ClrNumberInput; }), descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-number-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus" (focusout)="focusOut()">
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
        <div class="clr-input-group" [class.clr-focus]="focus" (focusout)="focusOut()">
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyLWlucHV0LWNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL251bWJlci1pbnB1dC9udW1iZXItaW5wdXQtY29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNwRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUM1RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNoRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFakUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDMUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7O0FBMkRoRCxNQUFNLE9BQU8sdUJBQXdCLFNBQVEsb0JBQW9CO0lBSy9ELFlBQ0UsbUJBQXdDLEVBQzVCLGFBQTRCLEVBQ3hDLGdCQUFrQyxFQUNsQyxZQUEwQixFQUNQLHFCQUE0QztRQUUvRCxLQUFLLENBQUMscUJBQXFCLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFGaEUsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQVRqRSxVQUFLLEdBQUcsS0FBSyxDQUFDO1FBYVosSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUM1QixDQUFDOztvSEFuQlUsdUJBQXVCO3dHQUF2Qix1QkFBdUIsNFBBRnZCLENBQUMsWUFBWSxFQUFFLHFCQUFxQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDLGdHQUsxRSxjQUFjLDJFQTFEbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Q1Q7MkZBU1UsdUJBQXVCO2tCQXpEbkMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Q1Q7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLDBCQUEwQixFQUFFLE1BQU07d0JBQ2xDLG1DQUFtQyxFQUFFLG1CQUFtQjt3QkFDeEQsbUNBQW1DLEVBQUUsZ0JBQWdCO3dCQUNyRCxpQkFBaUIsRUFBRSxXQUFXO3FCQUMvQjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxZQUFZLEVBQUUscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUM7aUJBQzFHOzswQkFRSSxRQUFROzBJQUp3RCxLQUFLO3NCQUF2RSxZQUFZO3VCQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgQ29udGVudENoaWxkLCBmb3J3YXJkUmVmLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJBYnN0cmFjdENvbnRhaW5lciB9IGZyb20gJy4uL2NvbW1vbi9hYnN0cmFjdC1jb250YWluZXInO1xuaW1wb3J0IHsgSWZDb250cm9sU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL2lmLWNvbnRyb2wtc3RhdGUvaWYtY29udHJvbC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnRyb2xDbGFzc1NlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL2NvbnRyb2wtY2xhc3Muc2VydmljZSc7XG5pbXBvcnQgeyBDb250cm9sSWRTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9jb250cm9sLWlkLnNlcnZpY2UnO1xuaW1wb3J0IHsgRm9jdXNTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9mb2N1cy5zZXJ2aWNlJztcbmltcG9ydCB7IExheW91dFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL2xheW91dC5zZXJ2aWNlJztcbmltcG9ydCB7IE5nQ29udHJvbFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL25nLWNvbnRyb2wuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJOdW1iZXJJbnB1dCB9IGZyb20gJy4vbnVtYmVyLWlucHV0JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLW51bWJlci1pbnB1dC1jb250YWluZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImxhYmVsXCI+PC9uZy1jb250ZW50PlxuICAgIDxsYWJlbCAqbmdJZj1cIiFsYWJlbCAmJiBhZGRHcmlkKClcIj48L2xhYmVsPlxuICAgIDxkaXYgY2xhc3M9XCJjbHItY29udHJvbC1jb250YWluZXJcIiBbbmdDbGFzc109XCJjb250cm9sQ2xhc3MoKVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImNsci1udW1iZXItaW5wdXQtd3JhcHBlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2xyLWlucHV0LWdyb3VwXCIgW2NsYXNzLmNsci1mb2N1c109XCJmb2N1c1wiIChmb2N1c291dCk9XCJmb2N1c091dCgpXCI+XG4gICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2Nsck51bWJlcklucHV0XVwiPjwvbmctY29udGVudD5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2xyLWlucHV0LWdyb3VwLWFjdGlvbnNcIj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGNsYXNzPVwiY2xyLWlucHV0LWdyb3VwLWljb24tYWN0aW9uXCJcbiAgICAgICAgICAgICAgKGNsaWNrKT1cImlucHV0LnN0ZXBEb3duKClcIlxuICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiY29udHJvbD8uZGlzYWJsZWRcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJtaW51c1wiIHNpemU9XCJzbVwiPjwvY2RzLWljb24+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbHItbnVtYmVyLWlucHV0LXNlcGFyYXRvclwiPjwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJjbHItaW5wdXQtZ3JvdXAtaWNvbi1hY3Rpb25cIlxuICAgICAgICAgICAgICAoY2xpY2spPVwiaW5wdXQuc3RlcFVwKClcIlxuICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiY29udHJvbD8uZGlzYWJsZWRcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJwbHVzXCIgc2l6ZT1cInNtXCI+PC9jZHMtaWNvbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgKm5nSWY9XCJzaG93SW52YWxpZFwiXG4gICAgICAgICAgY2xhc3M9XCJjbHItdmFsaWRhdGUtaWNvblwiXG4gICAgICAgICAgc2hhcGU9XCJleGNsYW1hdGlvbi1jaXJjbGVcIlxuICAgICAgICAgIHN0YXR1cz1cImRhbmdlclwiXG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICpuZ0lmPVwic2hvd1ZhbGlkXCJcbiAgICAgICAgICBjbGFzcz1cImNsci12YWxpZGF0ZS1pY29uXCJcbiAgICAgICAgICBzaGFwZT1cImNoZWNrLWNpcmNsZVwiXG4gICAgICAgICAgc3RhdHVzPVwic3VjY2Vzc1wiXG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLWhlbHBlclwiICpuZ0lmPVwic2hvd0hlbHBlclwiPjwvbmctY29udGVudD5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLWVycm9yXCIgKm5nSWY9XCJzaG93SW52YWxpZFwiPjwvbmctY29udGVudD5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLXN1Y2Nlc3NcIiAqbmdJZj1cInNob3dWYWxpZFwiPjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLWZvcm0tY29udHJvbF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5jbHItZm9ybS1jb250cm9sLWRpc2FibGVkXSc6ICdjb250cm9sPy5kaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5jbHItZm9ybS1jb250cm9sLXJlYWRvbmx5XSc6ICdpbnB1dC5yZWFkb25seScsXG4gICAgJ1tjbGFzcy5jbHItcm93XSc6ICdhZGRHcmlkKCknLFxuICB9LFxuICBwcm92aWRlcnM6IFtGb2N1c1NlcnZpY2UsIElmQ29udHJvbFN0YXRlU2VydmljZSwgTmdDb250cm9sU2VydmljZSwgQ29udHJvbElkU2VydmljZSwgQ29udHJvbENsYXNzU2VydmljZV0sXG59KVxuZXhwb3J0IGNsYXNzIENsck51bWJlcklucHV0Q29udGFpbmVyIGV4dGVuZHMgQ2xyQWJzdHJhY3RDb250YWluZXIge1xuICBmb2N1cyA9IGZhbHNlO1xuXG4gIEBDb250ZW50Q2hpbGQoZm9yd2FyZFJlZigoKSA9PiBDbHJOdW1iZXJJbnB1dCkpIHByb3RlY3RlZCByZWFkb25seSBpbnB1dDogQ2xyTnVtYmVySW5wdXQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY29udHJvbENsYXNzU2VydmljZTogQ29udHJvbENsYXNzU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBsYXlvdXRTZXJ2aWNlOiBMYXlvdXRTZXJ2aWNlLFxuICAgIG5nQ29udHJvbFNlcnZpY2U6IE5nQ29udHJvbFNlcnZpY2UsXG4gICAgZm9jdXNTZXJ2aWNlOiBGb2N1c1NlcnZpY2UsXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIGlmQ29udHJvbFN0YXRlU2VydmljZTogSWZDb250cm9sU3RhdGVTZXJ2aWNlXG4gICkge1xuICAgIHN1cGVyKGlmQ29udHJvbFN0YXRlU2VydmljZSwgbGF5b3V0U2VydmljZSwgY29udHJvbENsYXNzU2VydmljZSwgbmdDb250cm9sU2VydmljZSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChmb2N1c1NlcnZpY2UuZm9jdXNDaGFuZ2Uuc3Vic2NyaWJlKHN0YXRlID0+ICh0aGlzLmZvY3VzID0gc3RhdGUpKSk7XG4gIH1cblxuICBmb2N1c091dCgpIHtcbiAgICB0aGlzLmlucHV0LmRpc3BhdGNoQmx1cigpO1xuICB9XG59XG4iXX0=