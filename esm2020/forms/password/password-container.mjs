/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Inject, InjectionToken, Input, Optional } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { NgControlService } from '../common/providers/ng-control.service';
import * as i0 from "@angular/core";
import * as i1 from "../common/if-control-state/if-control-state.service";
import * as i2 from "../common/providers/layout.service";
import * as i3 from "../common/providers/control-class.service";
import * as i4 from "../common/providers/ng-control.service";
import * as i5 from "../common/providers/focus.service";
import * as i6 from "../../utils/i18n/common-strings.service";
import * as i7 from "@angular/common";
import * as i8 from "../../icon/icon";
import * as i9 from "../common/label";
import * as i10 from "rxjs";
export const TOGGLE_SERVICE = new InjectionToken(undefined);
export function ToggleServiceFactory() {
    return new BehaviorSubject(false);
}
export const TOGGLE_SERVICE_PROVIDER = { provide: TOGGLE_SERVICE, useFactory: ToggleServiceFactory };
export class ClrPasswordContainer extends ClrAbstractContainer {
    constructor(ifControlStateService, layoutService, controlClassService, ngControlService, focusService, toggleService, commonStrings) {
        super(ifControlStateService, layoutService, controlClassService, ngControlService);
        this.focusService = focusService;
        this.toggleService = toggleService;
        this.commonStrings = commonStrings;
        this.show = false;
        this.focus = false;
        this._toggle = true;
        /* The unsubscribe is handle inside the ClrAbstractContainer */
        this.subscriptions.push(focusService.focusChange.subscribe(state => {
            this.focus = state;
        }));
    }
    get clrToggle() {
        return this._toggle;
    }
    set clrToggle(state) {
        this._toggle = state;
        if (!state) {
            this.show = false;
        }
    }
    toggle() {
        this.show = !this.show;
        this.toggleService.next(this.show);
    }
    showPasswordText(label) {
        return this.commonStrings.parse(this.commonStrings.keys.passwordShow, { LABEL: label });
    }
    hidePasswordText(label) {
        return this.commonStrings.parse(this.commonStrings.keys.passwordHide, { LABEL: label });
    }
}
ClrPasswordContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPasswordContainer, deps: [{ token: i1.IfControlStateService }, { token: i2.LayoutService, optional: true }, { token: i3.ControlClassService }, { token: i4.NgControlService }, { token: i5.FocusService }, { token: TOGGLE_SERVICE }, { token: i6.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrPasswordContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrPasswordContainer, selector: "clr-password-container", inputs: { clrToggle: "clrToggle" }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [
        NgControlService,
        ControlIdService,
        ControlClassService,
        FocusService,
        TOGGLE_SERVICE_PROVIDER,
        IfControlStateService,
    ], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus">
          <ng-content select="[clrPassword]"></ng-content>
          <button
            *ngIf="clrToggle"
            (click)="toggle()"
            [disabled]="control?.disabled"
            class="clr-input-group-icon-action"
            type="button"
          >
            <cds-icon class="clr-password-eye-icon" [attr.shape]="show ? 'eye-hide' : 'eye'"></cds-icon>
            <span class="clr-sr-only">
              {{ show ? hidePasswordText(label?.labelText) : showPasswordText(label?.labelText) }}
            </span>
          </button>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i7.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i7.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i8.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i9.ClrLabel, selector: "label", inputs: ["id", "for"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPasswordContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-password-container',
                    template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus">
          <ng-content select="[clrPassword]"></ng-content>
          <button
            *ngIf="clrToggle"
            (click)="toggle()"
            [disabled]="control?.disabled"
            class="clr-input-group-icon-action"
            type="button"
          >
            <cds-icon class="clr-password-eye-icon" [attr.shape]="show ? 'eye-hide' : 'eye'"></cds-icon>
            <span class="clr-sr-only">
              {{ show ? hidePasswordText(label?.labelText) : showPasswordText(label?.labelText) }}
            </span>
          </button>
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
                        NgControlService,
                        ControlIdService,
                        ControlClassService,
                        FocusService,
                        TOGGLE_SERVICE_PROVIDER,
                        IfControlStateService,
                    ],
                }]
        }], ctorParameters: function () { return [{ type: i1.IfControlStateService }, { type: i2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i3.ControlClassService }, { type: i4.NgControlService }, { type: i5.FocusService }, { type: i10.BehaviorSubject, decorators: [{
                    type: Inject,
                    args: [TOGGLE_SERVICE]
                }] }, { type: i6.ClrCommonStringsService }]; }, propDecorators: { clrToggle: [{
                type: Input,
                args: ['clrToggle']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3dvcmQtY29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvcGFzc3dvcmQvcGFzc3dvcmQtY29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUd2QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNwRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUM1RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNoRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFakUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7Ozs7Ozs7Ozs7OztBQUUxRSxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQTJCLFNBQVMsQ0FBQyxDQUFDO0FBQ3RGLE1BQU0sVUFBVSxvQkFBb0I7SUFDbEMsT0FBTyxJQUFJLGVBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBQ0QsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBRSxvQkFBb0IsRUFBRSxDQUFDO0FBMERyRyxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsb0JBQW9CO0lBTTVELFlBQ0UscUJBQTRDLEVBQ2hDLGFBQTRCLEVBQ3hDLG1CQUF3QyxFQUN4QyxnQkFBa0MsRUFDM0IsWUFBMEIsRUFDRCxhQUF1QyxFQUNoRSxhQUFzQztRQUU3QyxLQUFLLENBQUMscUJBQXFCLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFKNUUsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDRCxrQkFBYSxHQUFiLGFBQWEsQ0FBMEI7UUFDaEUsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBWi9DLFNBQUksR0FBRyxLQUFLLENBQUM7UUFDYixVQUFLLEdBQUcsS0FBSyxDQUFDO1FBRU4sWUFBTyxHQUFHLElBQUksQ0FBQztRQWFyQiwrREFBK0Q7UUFDL0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ3JCLFlBQVksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0lBRUQsSUFDSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFDRCxJQUFJLFNBQVMsQ0FBQyxLQUFjO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztTQUNuQjtJQUNILENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxLQUFhO1FBQzVCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUVELGdCQUFnQixDQUFDLEtBQWE7UUFDNUIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUMxRixDQUFDOztpSEEvQ1Usb0JBQW9CLG1NQVlyQixjQUFjO3FHQVpiLG9CQUFvQix1T0FUcEI7UUFDVCxnQkFBZ0I7UUFDaEIsZ0JBQWdCO1FBQ2hCLG1CQUFtQjtRQUNuQixZQUFZO1FBQ1osdUJBQXVCO1FBQ3ZCLHFCQUFxQjtLQUN0QixpREFwRFM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVDVDsyRkFlVSxvQkFBb0I7a0JBeERoQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUNUO29CQUNELElBQUksRUFBRTt3QkFDSiwwQkFBMEIsRUFBRSxNQUFNO3dCQUNsQyxtQ0FBbUMsRUFBRSxtQkFBbUI7d0JBQ3hELGlCQUFpQixFQUFFLFdBQVc7cUJBQy9CO29CQUNELFNBQVMsRUFBRTt3QkFDVCxnQkFBZ0I7d0JBQ2hCLGdCQUFnQjt3QkFDaEIsbUJBQW1CO3dCQUNuQixZQUFZO3dCQUNaLHVCQUF1Qjt3QkFDdkIscUJBQXFCO3FCQUN0QjtpQkFDRjs7MEJBU0ksUUFBUTs7MEJBSVIsTUFBTTsyQkFBQyxjQUFjO2tGQWNwQixTQUFTO3NCQURaLEtBQUs7dUJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIEluamVjdGlvblRva2VuLCBJbnB1dCwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL2kxOG4vY29tbW9uLXN0cmluZ3Muc2VydmljZSc7XG5pbXBvcnQgeyBDbHJBYnN0cmFjdENvbnRhaW5lciB9IGZyb20gJy4uL2NvbW1vbi9hYnN0cmFjdC1jb250YWluZXInO1xuaW1wb3J0IHsgSWZDb250cm9sU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL2lmLWNvbnRyb2wtc3RhdGUvaWYtY29udHJvbC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnRyb2xDbGFzc1NlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL2NvbnRyb2wtY2xhc3Muc2VydmljZSc7XG5pbXBvcnQgeyBDb250cm9sSWRTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9jb250cm9sLWlkLnNlcnZpY2UnO1xuaW1wb3J0IHsgRm9jdXNTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9mb2N1cy5zZXJ2aWNlJztcbmltcG9ydCB7IExheW91dFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL2xheW91dC5zZXJ2aWNlJztcbmltcG9ydCB7IE5nQ29udHJvbFNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL25nLWNvbnRyb2wuc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBUT0dHTEVfU0VSVklDRSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4+KHVuZGVmaW5lZCk7XG5leHBvcnQgZnVuY3Rpb24gVG9nZ2xlU2VydmljZUZhY3RvcnkoKSB7XG4gIHJldHVybiBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbn1cbmV4cG9ydCBjb25zdCBUT0dHTEVfU0VSVklDRV9QUk9WSURFUiA9IHsgcHJvdmlkZTogVE9HR0xFX1NFUlZJQ0UsIHVzZUZhY3Rvcnk6IFRvZ2dsZVNlcnZpY2VGYWN0b3J5IH07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1wYXNzd29yZC1jb250YWluZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImxhYmVsXCI+PC9uZy1jb250ZW50PlxuICAgIDxsYWJlbCAqbmdJZj1cIiFsYWJlbCAmJiBhZGRHcmlkKClcIj48L2xhYmVsPlxuICAgIDxkaXYgY2xhc3M9XCJjbHItY29udHJvbC1jb250YWluZXJcIiBbbmdDbGFzc109XCJjb250cm9sQ2xhc3MoKVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImNsci1pbnB1dC13cmFwcGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjbHItaW5wdXQtZ3JvdXBcIiBbY2xhc3MuY2xyLWZvY3VzXT1cImZvY3VzXCI+XG4gICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2NsclBhc3N3b3JkXVwiPjwvbmctY29udGVudD5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAqbmdJZj1cImNsclRvZ2dsZVwiXG4gICAgICAgICAgICAoY2xpY2spPVwidG9nZ2xlKClcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImNvbnRyb2w/LmRpc2FibGVkXCJcbiAgICAgICAgICAgIGNsYXNzPVwiY2xyLWlucHV0LWdyb3VwLWljb24tYWN0aW9uXCJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxjZHMtaWNvbiBjbGFzcz1cImNsci1wYXNzd29yZC1leWUtaWNvblwiIFthdHRyLnNoYXBlXT1cInNob3cgPyAnZXllLWhpZGUnIDogJ2V5ZSdcIj48L2Nkcy1pY29uPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItc3Itb25seVwiPlxuICAgICAgICAgICAgICB7eyBzaG93ID8gaGlkZVBhc3N3b3JkVGV4dChsYWJlbD8ubGFiZWxUZXh0KSA6IHNob3dQYXNzd29yZFRleHQobGFiZWw/LmxhYmVsVGV4dCkgfX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICpuZ0lmPVwic2hvd0ludmFsaWRcIlxuICAgICAgICAgIGNsYXNzPVwiY2xyLXZhbGlkYXRlLWljb25cIlxuICAgICAgICAgIHNoYXBlPVwiZXhjbGFtYXRpb24tY2lyY2xlXCJcbiAgICAgICAgICBzdGF0dXM9XCJkYW5nZXJcIlxuICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAqbmdJZj1cInNob3dWYWxpZFwiXG4gICAgICAgICAgY2xhc3M9XCJjbHItdmFsaWRhdGUtaWNvblwiXG4gICAgICAgICAgc2hhcGU9XCJjaGVjay1jaXJjbGVcIlxuICAgICAgICAgIHN0YXR1cz1cInN1Y2Nlc3NcIlxuICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgPC9kaXY+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItY29udHJvbC1oZWxwZXJcIiAqbmdJZj1cInNob3dIZWxwZXJcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItY29udHJvbC1lcnJvclwiICpuZ0lmPVwic2hvd0ludmFsaWRcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItY29udHJvbC1zdWNjZXNzXCIgKm5nSWY9XCJzaG93VmFsaWRcIj48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmNsci1mb3JtLWNvbnRyb2xdJzogJ3RydWUnLFxuICAgICdbY2xhc3MuY2xyLWZvcm0tY29udHJvbC1kaXNhYmxlZF0nOiAnY29udHJvbD8uZGlzYWJsZWQnLFxuICAgICdbY2xhc3MuY2xyLXJvd10nOiAnYWRkR3JpZCgpJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTmdDb250cm9sU2VydmljZSxcbiAgICBDb250cm9sSWRTZXJ2aWNlLFxuICAgIENvbnRyb2xDbGFzc1NlcnZpY2UsXG4gICAgRm9jdXNTZXJ2aWNlLFxuICAgIFRPR0dMRV9TRVJWSUNFX1BST1ZJREVSLFxuICAgIElmQ29udHJvbFN0YXRlU2VydmljZSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyUGFzc3dvcmRDb250YWluZXIgZXh0ZW5kcyBDbHJBYnN0cmFjdENvbnRhaW5lciB7XG4gIHNob3cgPSBmYWxzZTtcbiAgZm9jdXMgPSBmYWxzZTtcblxuICBwcml2YXRlIF90b2dnbGUgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGlmQ29udHJvbFN0YXRlU2VydmljZTogSWZDb250cm9sU3RhdGVTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIGxheW91dFNlcnZpY2U6IExheW91dFNlcnZpY2UsXG4gICAgY29udHJvbENsYXNzU2VydmljZTogQ29udHJvbENsYXNzU2VydmljZSxcbiAgICBuZ0NvbnRyb2xTZXJ2aWNlOiBOZ0NvbnRyb2xTZXJ2aWNlLFxuICAgIHB1YmxpYyBmb2N1c1NlcnZpY2U6IEZvY3VzU2VydmljZSxcbiAgICBASW5qZWN0KFRPR0dMRV9TRVJWSUNFKSBwcml2YXRlIHRvZ2dsZVNlcnZpY2U6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPixcbiAgICBwdWJsaWMgY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2VcbiAgKSB7XG4gICAgc3VwZXIoaWZDb250cm9sU3RhdGVTZXJ2aWNlLCBsYXlvdXRTZXJ2aWNlLCBjb250cm9sQ2xhc3NTZXJ2aWNlLCBuZ0NvbnRyb2xTZXJ2aWNlKTtcblxuICAgIC8qIFRoZSB1bnN1YnNjcmliZSBpcyBoYW5kbGUgaW5zaWRlIHRoZSBDbHJBYnN0cmFjdENvbnRhaW5lciAqL1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgZm9jdXNTZXJ2aWNlLmZvY3VzQ2hhbmdlLnN1YnNjcmliZShzdGF0ZSA9PiB7XG4gICAgICAgIHRoaXMuZm9jdXMgPSBzdGF0ZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVG9nZ2xlJylcbiAgZ2V0IGNsclRvZ2dsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdG9nZ2xlO1xuICB9XG4gIHNldCBjbHJUb2dnbGUoc3RhdGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl90b2dnbGUgPSBzdGF0ZTtcbiAgICBpZiAoIXN0YXRlKSB7XG4gICAgICB0aGlzLnNob3cgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICB0b2dnbGUoKSB7XG4gICAgdGhpcy5zaG93ID0gIXRoaXMuc2hvdztcbiAgICB0aGlzLnRvZ2dsZVNlcnZpY2UubmV4dCh0aGlzLnNob3cpO1xuICB9XG5cbiAgc2hvd1Bhc3N3b3JkVGV4dChsYWJlbDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbW9uU3RyaW5ncy5wYXJzZSh0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5wYXNzd29yZFNob3csIHsgTEFCRUw6IGxhYmVsIH0pO1xuICB9XG5cbiAgaGlkZVBhc3N3b3JkVGV4dChsYWJlbDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbW9uU3RyaW5ncy5wYXJzZSh0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5wYXNzd29yZEhpZGUsIHsgTEFCRUw6IGxhYmVsIH0pO1xuICB9XG59XG4iXX0=