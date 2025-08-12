/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Optional, ViewChild } from '@angular/core';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ComboboxContainerService } from './providers/combobox-container.service';
import * as i0 from "@angular/core";
import * as i1 from "../common/if-control-state/if-control-state.service";
import * as i2 from "../common/providers/layout.service";
import * as i3 from "../common/providers/control-class.service";
import * as i4 from "../common/providers/ng-control.service";
import * as i5 from "./providers/combobox-container.service";
import * as i6 from "@angular/common";
import * as i7 from "../../icon/icon";
import * as i8 from "../common/label";
export class ClrComboboxContainer extends ClrAbstractContainer {
    constructor(ifControlStateService, layoutService, controlClassService, ngControlService, containerService, el) {
        super(ifControlStateService, layoutService, controlClassService, ngControlService);
        this.containerService = containerService;
        this.el = el;
    }
    ngAfterContentInit() {
        if (this.label) {
            this.containerService.labelText = this.label.labelText;
        }
    }
    ngAfterViewInit() {
        this.containerService.labelOffset =
            this.controlContainer.nativeElement.offsetHeight - this.el.nativeElement.offsetHeight;
    }
}
ClrComboboxContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrComboboxContainer, deps: [{ token: i1.IfControlStateService }, { token: i2.LayoutService, optional: true }, { token: i3.ControlClassService }, { token: i4.NgControlService }, { token: i5.ComboboxContainerService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
ClrComboboxContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrComboboxContainer, selector: "clr-combobox-container", host: { properties: { "class.clr-form-control": "true", "class.clr-combobox-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [IfControlStateService, NgControlService, ControlIdService, ControlClassService, ComboboxContainerService], viewQueries: [{ propertyName: "controlContainer", first: true, predicate: ["controlContainer"], descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()" #controlContainer>
      <ng-content select="clr-combobox"></ng-content>
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
      <ng-content select="clr-control-helper" *ngIf="showHelper"></ng-content>
      <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
      <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i6.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i7.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i8.ClrLabel, selector: "label", inputs: ["id", "for"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrComboboxContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-combobox-container',
                    template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()" #controlContainer>
      <ng-content select="clr-combobox"></ng-content>
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
      <ng-content select="clr-control-helper" *ngIf="showHelper"></ng-content>
      <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
      <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
    </div>
  `,
                    host: {
                        '[class.clr-form-control]': 'true',
                        '[class.clr-combobox-form-control]': 'true',
                        '[class.clr-form-control-disabled]': 'control?.disabled',
                        '[class.clr-row]': 'addGrid()',
                    },
                    providers: [IfControlStateService, NgControlService, ControlIdService, ControlClassService, ComboboxContainerService],
                }]
        }], ctorParameters: function () { return [{ type: i1.IfControlStateService }, { type: i2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i3.ControlClassService }, { type: i4.NgControlService }, { type: i5.ComboboxContainerService }, { type: i0.ElementRef }]; }, propDecorators: { controlContainer: [{
                type: ViewChild,
                args: ['controlContainer']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYm9ib3gtY29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tYm9ib3gvY29tYm9ib3gtY29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFtQyxTQUFTLEVBQWMsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU1RyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNwRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUM1RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNoRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUUxRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQzs7Ozs7Ozs7OztBQW9DbEYsTUFBTSxPQUFPLG9CQUFxQixTQUFRLG9CQUFvQjtJQUc1RCxZQUNFLHFCQUE0QyxFQUNoQyxhQUE0QixFQUN4QyxtQkFBd0MsRUFDeEMsZ0JBQWtDLEVBQzFCLGdCQUEwQyxFQUMxQyxFQUEyQjtRQUVuQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFIM0UscUJBQWdCLEdBQWhCLGdCQUFnQixDQUEwQjtRQUMxQyxPQUFFLEdBQUYsRUFBRSxDQUF5QjtJQUdyQyxDQUFDO0lBRVEsa0JBQWtCO1FBQ3pCLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7U0FDeEQ7SUFDSCxDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXO1lBQy9CLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQztJQUMxRixDQUFDOztpSEF2QlUsb0JBQW9CO3FHQUFwQixvQkFBb0IsOE9BRnBCLENBQUMscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLEVBQUUsd0JBQXdCLENBQUMsdUtBOUIzRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1QlQ7MkZBU1Usb0JBQW9CO2tCQWxDaEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsd0JBQXdCO29CQUNsQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUJUO29CQUNELElBQUksRUFBRTt3QkFDSiwwQkFBMEIsRUFBRSxNQUFNO3dCQUNsQyxtQ0FBbUMsRUFBRSxNQUFNO3dCQUMzQyxtQ0FBbUMsRUFBRSxtQkFBbUI7d0JBQ3hELGlCQUFpQixFQUFFLFdBQVc7cUJBQy9CO29CQUNELFNBQVMsRUFBRSxDQUFDLHFCQUFxQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixFQUFFLHdCQUF3QixDQUFDO2lCQUN0SDs7MEJBTUksUUFBUTs2S0FKb0IsZ0JBQWdCO3NCQUE5QyxTQUFTO3VCQUFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBPcHRpb25hbCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckFic3RyYWN0Q29udGFpbmVyIH0gZnJvbSAnLi4vY29tbW9uL2Fic3RyYWN0LWNvbnRhaW5lcic7XG5pbXBvcnQgeyBJZkNvbnRyb2xTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vaWYtY29udHJvbC1zdGF0ZS9pZi1jb250cm9sLXN0YXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udHJvbENsYXNzU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvY29udHJvbC1jbGFzcy5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnRyb2xJZFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL2NvbnRyb2wtaWQuc2VydmljZSc7XG5pbXBvcnQgeyBMYXlvdXRTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9sYXlvdXQuc2VydmljZSc7XG5pbXBvcnQgeyBOZ0NvbnRyb2xTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9uZy1jb250cm9sLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tYm9ib3hDb250YWluZXJTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvY29tYm9ib3gtY29udGFpbmVyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItY29tYm9ib3gtY29udGFpbmVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJsYWJlbFwiPjwvbmctY29udGVudD5cbiAgICA8bGFiZWwgKm5nSWY9XCIhbGFiZWwgJiYgYWRkR3JpZCgpXCI+PC9sYWJlbD5cbiAgICA8ZGl2IGNsYXNzPVwiY2xyLWNvbnRyb2wtY29udGFpbmVyXCIgW25nQ2xhc3NdPVwiY29udHJvbENsYXNzKClcIiAjY29udHJvbENvbnRhaW5lcj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb21ib2JveFwiPjwvbmctY29udGVudD5cbiAgICAgIDxjZHMtaWNvblxuICAgICAgICAqbmdJZj1cInNob3dJbnZhbGlkXCJcbiAgICAgICAgY2xhc3M9XCJjbHItdmFsaWRhdGUtaWNvblwiXG4gICAgICAgIHNoYXBlPVwiZXhjbGFtYXRpb24tY2lyY2xlXCJcbiAgICAgICAgc3RhdHVzPVwiZGFuZ2VyXCJcbiAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgID48L2Nkcy1pY29uPlxuICAgICAgPGNkcy1pY29uXG4gICAgICAgICpuZ0lmPVwic2hvd1ZhbGlkXCJcbiAgICAgICAgY2xhc3M9XCJjbHItdmFsaWRhdGUtaWNvblwiXG4gICAgICAgIHNoYXBlPVwiY2hlY2stY2lyY2xlXCJcbiAgICAgICAgc3RhdHVzPVwic3VjY2Vzc1wiXG4gICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICA+PC9jZHMtaWNvbj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLWhlbHBlclwiICpuZ0lmPVwic2hvd0hlbHBlclwiPjwvbmctY29udGVudD5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLWVycm9yXCIgKm5nSWY9XCJzaG93SW52YWxpZFwiPjwvbmctY29udGVudD5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLXN1Y2Nlc3NcIiAqbmdJZj1cInNob3dWYWxpZFwiPjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLWZvcm0tY29udHJvbF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5jbHItY29tYm9ib3gtZm9ybS1jb250cm9sXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmNsci1mb3JtLWNvbnRyb2wtZGlzYWJsZWRdJzogJ2NvbnRyb2w/LmRpc2FibGVkJyxcbiAgICAnW2NsYXNzLmNsci1yb3ddJzogJ2FkZEdyaWQoKScsXG4gIH0sXG4gIHByb3ZpZGVyczogW0lmQ29udHJvbFN0YXRlU2VydmljZSwgTmdDb250cm9sU2VydmljZSwgQ29udHJvbElkU2VydmljZSwgQ29udHJvbENsYXNzU2VydmljZSwgQ29tYm9ib3hDb250YWluZXJTZXJ2aWNlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyQ29tYm9ib3hDb250YWluZXIgZXh0ZW5kcyBDbHJBYnN0cmFjdENvbnRhaW5lciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0luaXQge1xuICBAVmlld0NoaWxkKCdjb250cm9sQ29udGFpbmVyJykgY29udHJvbENvbnRhaW5lcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaWZDb250cm9sU3RhdGVTZXJ2aWNlOiBJZkNvbnRyb2xTdGF0ZVNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgbGF5b3V0U2VydmljZTogTGF5b3V0U2VydmljZSxcbiAgICBjb250cm9sQ2xhc3NTZXJ2aWNlOiBDb250cm9sQ2xhc3NTZXJ2aWNlLFxuICAgIG5nQ29udHJvbFNlcnZpY2U6IE5nQ29udHJvbFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb250YWluZXJTZXJ2aWNlOiBDb21ib2JveENvbnRhaW5lclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD5cbiAgKSB7XG4gICAgc3VwZXIoaWZDb250cm9sU3RhdGVTZXJ2aWNlLCBsYXlvdXRTZXJ2aWNlLCBjb250cm9sQ2xhc3NTZXJ2aWNlLCBuZ0NvbnRyb2xTZXJ2aWNlKTtcbiAgfVxuXG4gIG92ZXJyaWRlIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAodGhpcy5sYWJlbCkge1xuICAgICAgdGhpcy5jb250YWluZXJTZXJ2aWNlLmxhYmVsVGV4dCA9IHRoaXMubGFiZWwubGFiZWxUZXh0O1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmNvbnRhaW5lclNlcnZpY2UubGFiZWxPZmZzZXQgPVxuICAgICAgdGhpcy5jb250cm9sQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgfVxufVxuIl19