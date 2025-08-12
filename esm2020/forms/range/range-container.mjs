/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Input, Optional } from '@angular/core';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { NgControlService } from '../common/providers/ng-control.service';
import * as i0 from "@angular/core";
import * as i1 from "../common/providers/layout.service";
import * as i2 from "../common/providers/control-class.service";
import * as i3 from "../common/providers/ng-control.service";
import * as i4 from "../common/providers/control-id.service";
import * as i5 from "../common/if-control-state/if-control-state.service";
import * as i6 from "@angular/common";
import * as i7 from "../common/label";
import * as i8 from "../../icon/icon";
export class ClrRangeContainer extends ClrAbstractContainer {
    constructor(layoutService, controlClassService, ngControlService, renderer, idService, ifControlStateService) {
        super(ifControlStateService, layoutService, controlClassService, ngControlService);
        this.renderer = renderer;
        this.idService = idService;
        this.ifControlStateService = ifControlStateService;
        this._hasProgress = false;
    }
    get hasProgress() {
        return this._hasProgress;
    }
    set hasProgress(val) {
        const valBool = !!val;
        if (valBool !== this._hasProgress) {
            this._hasProgress = valBool;
        }
    }
    getRangeProgressFillWidth() {
        const input = this.selectRangeElement();
        if (!input) {
            return this.lastRangeProgressFillWidth;
        }
        const inputWidth = input.offsetWidth;
        const inputMinValue = +input.min;
        let inputMaxValue = +input.max;
        if (inputMinValue === 0 && inputMaxValue === 0) {
            inputMaxValue = 100;
        }
        const inputMiddle = (inputMinValue + inputMaxValue) / 2;
        const inputValue = !!this.control && this.control.value !== undefined ? this.control.value : inputMiddle;
        const valueAsPercent = ((inputValue - inputMinValue) * 100) / (inputMaxValue - inputMinValue);
        this.lastRangeProgressFillWidth = (valueAsPercent * inputWidth) / 100 + 'px';
        return this.lastRangeProgressFillWidth;
    }
    selectRangeElement() {
        try {
            return this.renderer.selectRootElement('[clrRange]#' + this.idService.id);
        }
        catch {
            return undefined;
        }
    }
}
ClrRangeContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRangeContainer, deps: [{ token: i1.LayoutService, optional: true }, { token: i2.ControlClassService }, { token: i3.NgControlService }, { token: i0.Renderer2 }, { token: i4.ControlIdService }, { token: i5.IfControlStateService }], target: i0.ɵɵFactoryTarget.Component });
ClrRangeContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrRangeContainer, selector: "clr-range-container", inputs: { hasProgress: ["clrRangeHasProgress", "hasProgress"] }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [IfControlStateService, NgControlService, ControlIdService, ControlClassService], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-range-wrapper" [class.progress-fill]="hasProgress">
        <ng-content select="[clrRange]"></ng-content>
        <span *ngIf="hasProgress" class="fill-input" [style.width]="getRangeProgressFillWidth()"></span>
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRangeContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-range-container',
                    template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-range-wrapper" [class.progress-fill]="hasProgress">
        <ng-content select="[clrRange]"></ng-content>
        <span *ngIf="hasProgress" class="fill-input" [style.width]="getRangeProgressFillWidth()"></span>
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
        }], ctorParameters: function () { return [{ type: i1.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i2.ControlClassService }, { type: i3.NgControlService }, { type: i0.Renderer2 }, { type: i4.ControlIdService }, { type: i5.IfControlStateService }]; }, propDecorators: { hasProgress: [{
                type: Input,
                args: ['clrRangeHasProgress']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UtY29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvcmFuZ2UvcmFuZ2UtY29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBRXRFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRTFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDOzs7Ozs7Ozs7O0FBc0MxRSxNQUFNLE9BQU8saUJBQWtCLFNBQVEsb0JBQW9CO0lBSXpELFlBQ2MsYUFBNEIsRUFDeEMsbUJBQXdDLEVBQ3hDLGdCQUFrQyxFQUMxQixRQUFtQixFQUNuQixTQUEyQixFQUNoQixxQkFBNEM7UUFFL0QsS0FBSyxDQUFDLHFCQUFxQixFQUFFLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBSjNFLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDaEIsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQVR6RCxpQkFBWSxHQUFHLEtBQUssQ0FBQztJQVk3QixDQUFDO0lBRUQsSUFDSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFDRCxJQUFJLFdBQVcsQ0FBQyxHQUFZO1FBQzFCLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDdEIsSUFBSSxPQUFPLEtBQUssSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQyxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFRCx5QkFBeUI7UUFDdkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFeEMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE9BQU8sSUFBSSxDQUFDLDBCQUEwQixDQUFDO1NBQ3hDO1FBRUQsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxNQUFNLGFBQWEsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDakMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBRS9CLElBQUksYUFBYSxLQUFLLENBQUMsSUFBSSxhQUFhLEtBQUssQ0FBQyxFQUFFO1lBQzlDLGFBQWEsR0FBRyxHQUFHLENBQUM7U0FDckI7UUFFRCxNQUFNLFdBQVcsR0FBRyxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO1FBQ3pHLE1BQU0sY0FBYyxHQUFHLENBQUMsQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDLENBQUM7UUFFOUYsSUFBSSxDQUFDLDBCQUEwQixHQUFHLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFFN0UsT0FBTyxJQUFJLENBQUMsMEJBQTBCLENBQUM7SUFDekMsQ0FBQztJQUVPLGtCQUFrQjtRQUN4QixJQUFJO1lBQ0YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzNFO1FBQUMsTUFBTTtZQUNOLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQzs7OEdBeERVLGlCQUFpQjtrR0FBakIsaUJBQWlCLGlRQUZqQixDQUFDLHFCQUFxQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixDQUFDLGlEQWhDakY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEJUOzJGQVFVLGlCQUFpQjtrQkFwQzdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCVDtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osMEJBQTBCLEVBQUUsTUFBTTt3QkFDbEMsbUNBQW1DLEVBQUUsbUJBQW1CO3dCQUN4RCxpQkFBaUIsRUFBRSxXQUFXO3FCQUMvQjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQztpQkFDNUY7OzBCQU1JLFFBQVE7d01BV1AsV0FBVztzQkFEZCxLQUFLO3VCQUFDLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3B0aW9uYWwsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJBYnN0cmFjdENvbnRhaW5lciB9IGZyb20gJy4uL2NvbW1vbi9hYnN0cmFjdC1jb250YWluZXInO1xuaW1wb3J0IHsgSWZDb250cm9sU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL2lmLWNvbnRyb2wtc3RhdGUvaWYtY29udHJvbC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnRyb2xDbGFzc1NlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL2NvbnRyb2wtY2xhc3Muc2VydmljZSc7XG5pbXBvcnQgeyBDb250cm9sSWRTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9jb250cm9sLWlkLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5b3V0U2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvbGF5b3V0LnNlcnZpY2UnO1xuaW1wb3J0IHsgTmdDb250cm9sU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvbmctY29udHJvbC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLXJhbmdlLWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwibGFiZWxcIj48L25nLWNvbnRlbnQ+XG4gICAgPGxhYmVsICpuZ0lmPVwiIWxhYmVsICYmIGFkZEdyaWQoKVwiPjwvbGFiZWw+XG4gICAgPGRpdiBjbGFzcz1cImNsci1jb250cm9sLWNvbnRhaW5lclwiIFtuZ0NsYXNzXT1cImNvbnRyb2xDbGFzcygpXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiY2xyLXJhbmdlLXdyYXBwZXJcIiBbY2xhc3MucHJvZ3Jlc3MtZmlsbF09XCJoYXNQcm9ncmVzc1wiPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbY2xyUmFuZ2VdXCI+PC9uZy1jb250ZW50PlxuICAgICAgICA8c3BhbiAqbmdJZj1cImhhc1Byb2dyZXNzXCIgY2xhc3M9XCJmaWxsLWlucHV0XCIgW3N0eWxlLndpZHRoXT1cImdldFJhbmdlUHJvZ3Jlc3NGaWxsV2lkdGgoKVwiPjwvc3Bhbj5cbiAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgKm5nSWY9XCJzaG93SW52YWxpZFwiXG4gICAgICAgICAgY2xhc3M9XCJjbHItdmFsaWRhdGUtaWNvblwiXG4gICAgICAgICAgc2hhcGU9XCJleGNsYW1hdGlvbi1jaXJjbGVcIlxuICAgICAgICAgIHN0YXR1cz1cImRhbmdlclwiXG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICpuZ0lmPVwic2hvd1ZhbGlkXCJcbiAgICAgICAgICBjbGFzcz1cImNsci12YWxpZGF0ZS1pY29uXCJcbiAgICAgICAgICBzaGFwZT1cImNoZWNrLWNpcmNsZVwiXG4gICAgICAgICAgc3RhdHVzPVwic3VjY2Vzc1wiXG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLWhlbHBlclwiICpuZ0lmPVwic2hvd0hlbHBlclwiPjwvbmctY29udGVudD5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLWVycm9yXCIgKm5nSWY9XCJzaG93SW52YWxpZFwiPjwvbmctY29udGVudD5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLXN1Y2Nlc3NcIiAqbmdJZj1cInNob3dWYWxpZFwiPjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLWZvcm0tY29udHJvbF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5jbHItZm9ybS1jb250cm9sLWRpc2FibGVkXSc6ICdjb250cm9sPy5kaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5jbHItcm93XSc6ICdhZGRHcmlkKCknLFxuICB9LFxuICBwcm92aWRlcnM6IFtJZkNvbnRyb2xTdGF0ZVNlcnZpY2UsIE5nQ29udHJvbFNlcnZpY2UsIENvbnRyb2xJZFNlcnZpY2UsIENvbnRyb2xDbGFzc1NlcnZpY2VdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJSYW5nZUNvbnRhaW5lciBleHRlbmRzIENsckFic3RyYWN0Q29udGFpbmVyIHtcbiAgcHJpdmF0ZSBfaGFzUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgcHJpdmF0ZSBsYXN0UmFuZ2VQcm9ncmVzc0ZpbGxXaWR0aDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIGxheW91dFNlcnZpY2U6IExheW91dFNlcnZpY2UsXG4gICAgY29udHJvbENsYXNzU2VydmljZTogQ29udHJvbENsYXNzU2VydmljZSxcbiAgICBuZ0NvbnRyb2xTZXJ2aWNlOiBOZ0NvbnRyb2xTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIGlkU2VydmljZTogQ29udHJvbElkU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgaWZDb250cm9sU3RhdGVTZXJ2aWNlOiBJZkNvbnRyb2xTdGF0ZVNlcnZpY2VcbiAgKSB7XG4gICAgc3VwZXIoaWZDb250cm9sU3RhdGVTZXJ2aWNlLCBsYXlvdXRTZXJ2aWNlLCBjb250cm9sQ2xhc3NTZXJ2aWNlLCBuZ0NvbnRyb2xTZXJ2aWNlKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyUmFuZ2VIYXNQcm9ncmVzcycpXG4gIGdldCBoYXNQcm9ncmVzcygpIHtcbiAgICByZXR1cm4gdGhpcy5faGFzUHJvZ3Jlc3M7XG4gIH1cbiAgc2V0IGhhc1Byb2dyZXNzKHZhbDogYm9vbGVhbikge1xuICAgIGNvbnN0IHZhbEJvb2wgPSAhIXZhbDtcbiAgICBpZiAodmFsQm9vbCAhPT0gdGhpcy5faGFzUHJvZ3Jlc3MpIHtcbiAgICAgIHRoaXMuX2hhc1Byb2dyZXNzID0gdmFsQm9vbDtcbiAgICB9XG4gIH1cblxuICBnZXRSYW5nZVByb2dyZXNzRmlsbFdpZHRoKCk6IHN0cmluZyB7XG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLnNlbGVjdFJhbmdlRWxlbWVudCgpO1xuXG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgcmV0dXJuIHRoaXMubGFzdFJhbmdlUHJvZ3Jlc3NGaWxsV2lkdGg7XG4gICAgfVxuXG4gICAgY29uc3QgaW5wdXRXaWR0aCA9IGlucHV0Lm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IGlucHV0TWluVmFsdWUgPSAraW5wdXQubWluO1xuICAgIGxldCBpbnB1dE1heFZhbHVlID0gK2lucHV0Lm1heDtcblxuICAgIGlmIChpbnB1dE1pblZhbHVlID09PSAwICYmIGlucHV0TWF4VmFsdWUgPT09IDApIHtcbiAgICAgIGlucHV0TWF4VmFsdWUgPSAxMDA7XG4gICAgfVxuXG4gICAgY29uc3QgaW5wdXRNaWRkbGUgPSAoaW5wdXRNaW5WYWx1ZSArIGlucHV0TWF4VmFsdWUpIC8gMjtcbiAgICBjb25zdCBpbnB1dFZhbHVlID0gISF0aGlzLmNvbnRyb2wgJiYgdGhpcy5jb250cm9sLnZhbHVlICE9PSB1bmRlZmluZWQgPyB0aGlzLmNvbnRyb2wudmFsdWUgOiBpbnB1dE1pZGRsZTtcbiAgICBjb25zdCB2YWx1ZUFzUGVyY2VudCA9ICgoaW5wdXRWYWx1ZSAtIGlucHV0TWluVmFsdWUpICogMTAwKSAvIChpbnB1dE1heFZhbHVlIC0gaW5wdXRNaW5WYWx1ZSk7XG5cbiAgICB0aGlzLmxhc3RSYW5nZVByb2dyZXNzRmlsbFdpZHRoID0gKHZhbHVlQXNQZXJjZW50ICogaW5wdXRXaWR0aCkgLyAxMDAgKyAncHgnO1xuXG4gICAgcmV0dXJuIHRoaXMubGFzdFJhbmdlUHJvZ3Jlc3NGaWxsV2lkdGg7XG4gIH1cblxuICBwcml2YXRlIHNlbGVjdFJhbmdlRWxlbWVudCgpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuc2VsZWN0Um9vdEVsZW1lbnQoJ1tjbHJSYW5nZV0jJyArIHRoaXMuaWRTZXJ2aWNlLmlkKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59XG4iXX0=