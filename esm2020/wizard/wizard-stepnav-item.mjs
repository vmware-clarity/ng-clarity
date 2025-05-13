/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/wizard-navigation.service";
import * as i2 from "./providers/page-collection.service";
import * as i3 from "../utils";
import * as i4 from "@angular/common";
import * as i5 from "../icon/icon";
export class ClrWizardStepnavItem {
    constructor(navService, pageCollection, commonStrings) {
        this.navService = navService;
        this.pageCollection = pageCollection;
        this.commonStrings = commonStrings;
    }
    get id() {
        this.pageGuard();
        return this.pageCollection.getStepItemIdForPage(this.page);
    }
    get stepAriaCurrent() {
        return this.isCurrent && 'step';
    }
    get isDisabled() {
        this.pageGuard();
        return this.page.disabled || this.navService.wizardStopNavigation || this.navService.wizardDisableStepnav;
    }
    get isCurrent() {
        this.pageGuard();
        return this.page.current;
    }
    get isComplete() {
        this.pageGuard();
        return this.page.completed;
    }
    get hasError() {
        this.pageGuard();
        return this.page.hasError && this.isComplete;
    }
    get canNavigate() {
        this.pageGuard();
        return this.pageCollection.previousPageIsCompleted(this.page);
    }
    get stepIconId() {
        return `${this.id}-step-icon`;
    }
    get stepTextId() {
        return `${this.id}-step-text`;
    }
    get stepNumberId() {
        return `${this.id}-step-number`;
    }
    get stepTitleId() {
        return `${this.id}-step-title`;
    }
    get labelledby() {
        const textIds = [this.stepTextId, this.stepNumberId, this.stepTitleId];
        const allIds = this.isComplete ? [this.stepIconId, ...textIds] : textIds;
        return allIds.join(' ');
    }
    click() {
        this.pageGuard();
        // if we click on our own stepnav or a disabled stepnav, we don't want to do anything
        if (this.isDisabled || this.isCurrent) {
            return;
        }
        this.navService.goTo(this.page);
    }
    pageGuard() {
        if (!this.page) {
            throw new Error('Wizard stepnav item is not associated with a wizard page.');
        }
    }
}
ClrWizardStepnavItem.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardStepnavItem, deps: [{ token: i1.WizardNavigationService }, { token: i2.PageCollectionService }, { token: i3.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrWizardStepnavItem.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrWizardStepnavItem, selector: "[clr-wizard-stepnav-item]", inputs: { page: "page" }, host: { properties: { "id": "id", "attr.aria-current": "stepAriaCurrent", "attr.aria-controls": "page.id", "class.clr-nav-link": "true", "class.nav-item": "true", "class.active": "isCurrent", "class.disabled": "isDisabled", "class.no-click": "!canNavigate", "class.complete": "isComplete", "class.error": "hasError" } }, ngImport: i0, template: `
    <button
      type="button"
      class="btn btn-link clr-wizard-stepnav-link"
      (click)="click()"
      [attr.disabled]="isDisabled ? '' : null"
      [attr.aria-labelledby]="labelledby"
    >
      <div class="clr-wizard-stepnav-link-icon">
        <cds-icon
          *ngIf="hasError"
          [id]="stepIconId"
          shape="error-standard"
          role="img"
          [attr.aria-label]="commonStrings.keys.wizardStepError"
        ></cds-icon>
        <cds-icon
          *ngIf="!hasError && isComplete"
          [id]="stepIconId"
          shape="success-standard"
          role="img"
          [attr.aria-label]="commonStrings.keys.wizardStepSuccess"
        ></cds-icon>
      </div>

      <span [id]="stepTextId" class="clr-sr-only">{{ commonStrings.keys.wizardStep }}</span>
      <div [id]="stepNumberId" class="clr-wizard-stepnav-link-page-number">
        <ng-content></ng-content>
      </div>
      <span [id]="stepTitleId" class="clr-wizard-stepnav-link-title">
        <ng-template [ngTemplateOutlet]="page.navTitle"></ng-template>
      </span>
    </button>
  `, isInline: true, dependencies: [{ kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i5.CdsIconCustomTag, selector: "cds-icon" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardStepnavItem, decorators: [{
            type: Component,
            args: [{
                    selector: '[clr-wizard-stepnav-item]',
                    template: `
    <button
      type="button"
      class="btn btn-link clr-wizard-stepnav-link"
      (click)="click()"
      [attr.disabled]="isDisabled ? '' : null"
      [attr.aria-labelledby]="labelledby"
    >
      <div class="clr-wizard-stepnav-link-icon">
        <cds-icon
          *ngIf="hasError"
          [id]="stepIconId"
          shape="error-standard"
          role="img"
          [attr.aria-label]="commonStrings.keys.wizardStepError"
        ></cds-icon>
        <cds-icon
          *ngIf="!hasError && isComplete"
          [id]="stepIconId"
          shape="success-standard"
          role="img"
          [attr.aria-label]="commonStrings.keys.wizardStepSuccess"
        ></cds-icon>
      </div>

      <span [id]="stepTextId" class="clr-sr-only">{{ commonStrings.keys.wizardStep }}</span>
      <div [id]="stepNumberId" class="clr-wizard-stepnav-link-page-number">
        <ng-content></ng-content>
      </div>
      <span [id]="stepTitleId" class="clr-wizard-stepnav-link-title">
        <ng-template [ngTemplateOutlet]="page.navTitle"></ng-template>
      </span>
    </button>
  `,
                    host: {
                        '[id]': 'id',
                        '[attr.aria-current]': 'stepAriaCurrent',
                        '[attr.aria-controls]': 'page.id',
                        '[class.clr-nav-link]': 'true',
                        '[class.nav-item]': 'true',
                        '[class.active]': 'isCurrent',
                        '[class.disabled]': 'isDisabled',
                        '[class.no-click]': '!canNavigate',
                        '[class.complete]': 'isComplete',
                        '[class.error]': 'hasError',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.WizardNavigationService }, { type: i2.PageCollectionService }, { type: i3.ClrCommonStringsService }]; }, propDecorators: { page: [{
                type: Input,
                args: ['page']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXN0ZXBuYXYtaXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3dpemFyZC93aXphcmQtc3RlcG5hdi1pdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7QUF3RGpELE1BQU0sT0FBTyxvQkFBb0I7SUFHL0IsWUFDUyxVQUFtQyxFQUNuQyxjQUFxQyxFQUNyQyxhQUFzQztRQUZ0QyxlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUNuQyxtQkFBYyxHQUFkLGNBQWMsQ0FBdUI7UUFDckMsa0JBQWEsR0FBYixhQUFhLENBQXlCO0lBQzVDLENBQUM7SUFFSixJQUFJLEVBQUU7UUFDSixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsSUFBSSxlQUFlO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUM7SUFDbEMsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQztJQUM1RyxDQUFDO0lBRUQsSUFBSSxTQUFTO1FBQ1gsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDVixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQy9DLENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDYixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsSUFBYyxVQUFVO1FBQ3RCLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxZQUFZLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQWMsVUFBVTtRQUN0QixPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsWUFBWSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFjLFlBQVk7UUFDeEIsT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLGNBQWMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsSUFBYyxXQUFXO1FBQ3ZCLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxhQUFhLENBQUM7SUFDakMsQ0FBQztJQUVELElBQWMsVUFBVTtRQUN0QixNQUFNLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUV6RSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFakIscUZBQXFGO1FBQ3JGLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3JDLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU8sU0FBUztRQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1NBQzlFO0lBQ0gsQ0FBQzs7aUhBakZVLG9CQUFvQjtxR0FBcEIsb0JBQW9CLDRaQS9DckI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWlDVDsyRkFjVSxvQkFBb0I7a0JBakRoQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUNUO29CQUNELElBQUksRUFBRTt3QkFDSixNQUFNLEVBQUUsSUFBSTt3QkFDWixxQkFBcUIsRUFBRSxpQkFBaUI7d0JBQ3hDLHNCQUFzQixFQUFFLFNBQVM7d0JBQ2pDLHNCQUFzQixFQUFFLE1BQU07d0JBQzlCLGtCQUFrQixFQUFFLE1BQU07d0JBQzFCLGdCQUFnQixFQUFFLFdBQVc7d0JBQzdCLGtCQUFrQixFQUFFLFlBQVk7d0JBQ2hDLGtCQUFrQixFQUFFLGNBQWM7d0JBQ2xDLGtCQUFrQixFQUFFLFlBQVk7d0JBQ2hDLGVBQWUsRUFBRSxVQUFVO3FCQUM1QjtpQkFDRjt3TEFFZ0IsSUFBSTtzQkFBbEIsS0FBSzt1QkFBQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgUGFnZUNvbGxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcGFnZS1jb2xsZWN0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy93aXphcmQtbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IENscldpemFyZFBhZ2UgfSBmcm9tICcuL3dpemFyZC1wYWdlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW2Nsci13aXphcmQtc3RlcG5hdi1pdGVtXScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzcz1cImJ0biBidG4tbGluayBjbHItd2l6YXJkLXN0ZXBuYXYtbGlua1wiXG4gICAgICAoY2xpY2spPVwiY2xpY2soKVwiXG4gICAgICBbYXR0ci5kaXNhYmxlZF09XCJpc0Rpc2FibGVkID8gJycgOiBudWxsXCJcbiAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJsYWJlbGxlZGJ5XCJcbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzPVwiY2xyLXdpemFyZC1zdGVwbmF2LWxpbmstaWNvblwiPlxuICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAqbmdJZj1cImhhc0Vycm9yXCJcbiAgICAgICAgICBbaWRdPVwic3RlcEljb25JZFwiXG4gICAgICAgICAgc2hhcGU9XCJlcnJvci1zdGFuZGFyZFwiXG4gICAgICAgICAgcm9sZT1cImltZ1wiXG4gICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMud2l6YXJkU3RlcEVycm9yXCJcbiAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICpuZ0lmPVwiIWhhc0Vycm9yICYmIGlzQ29tcGxldGVcIlxuICAgICAgICAgIFtpZF09XCJzdGVwSWNvbklkXCJcbiAgICAgICAgICBzaGFwZT1cInN1Y2Nlc3Mtc3RhbmRhcmRcIlxuICAgICAgICAgIHJvbGU9XCJpbWdcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiY29tbW9uU3RyaW5ncy5rZXlzLndpemFyZFN0ZXBTdWNjZXNzXCJcbiAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPHNwYW4gW2lkXT1cInN0ZXBUZXh0SWRcIiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3sgY29tbW9uU3RyaW5ncy5rZXlzLndpemFyZFN0ZXAgfX08L3NwYW4+XG4gICAgICA8ZGl2IFtpZF09XCJzdGVwTnVtYmVySWRcIiBjbGFzcz1cImNsci13aXphcmQtc3RlcG5hdi1saW5rLXBhZ2UtbnVtYmVyXCI+XG4gICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgIDwvZGl2PlxuICAgICAgPHNwYW4gW2lkXT1cInN0ZXBUaXRsZUlkXCIgY2xhc3M9XCJjbHItd2l6YXJkLXN0ZXBuYXYtbGluay10aXRsZVwiPlxuICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwicGFnZS5uYXZUaXRsZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICA8L3NwYW4+XG4gICAgPC9idXR0b24+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2lkXSc6ICdpZCcsXG4gICAgJ1thdHRyLmFyaWEtY3VycmVudF0nOiAnc3RlcEFyaWFDdXJyZW50JyxcbiAgICAnW2F0dHIuYXJpYS1jb250cm9sc10nOiAncGFnZS5pZCcsXG4gICAgJ1tjbGFzcy5jbHItbmF2LWxpbmtdJzogJ3RydWUnLFxuICAgICdbY2xhc3MubmF2LWl0ZW1dJzogJ3RydWUnLFxuICAgICdbY2xhc3MuYWN0aXZlXSc6ICdpc0N1cnJlbnQnLFxuICAgICdbY2xhc3MuZGlzYWJsZWRdJzogJ2lzRGlzYWJsZWQnLFxuICAgICdbY2xhc3Mubm8tY2xpY2tdJzogJyFjYW5OYXZpZ2F0ZScsXG4gICAgJ1tjbGFzcy5jb21wbGV0ZV0nOiAnaXNDb21wbGV0ZScsXG4gICAgJ1tjbGFzcy5lcnJvcl0nOiAnaGFzRXJyb3InLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJXaXphcmRTdGVwbmF2SXRlbSB7XG4gIEBJbnB1dCgncGFnZScpIHBhZ2U6IENscldpemFyZFBhZ2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIG5hdlNlcnZpY2U6IFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlLFxuICAgIHB1YmxpYyBwYWdlQ29sbGVjdGlvbjogUGFnZUNvbGxlY3Rpb25TZXJ2aWNlLFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZVxuICApIHt9XG5cbiAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgdGhpcy5wYWdlR3VhcmQoKTtcbiAgICByZXR1cm4gdGhpcy5wYWdlQ29sbGVjdGlvbi5nZXRTdGVwSXRlbUlkRm9yUGFnZSh0aGlzLnBhZ2UpO1xuICB9XG5cbiAgZ2V0IHN0ZXBBcmlhQ3VycmVudCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmlzQ3VycmVudCAmJiAnc3RlcCc7XG4gIH1cblxuICBnZXQgaXNEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICB0aGlzLnBhZ2VHdWFyZCgpO1xuICAgIHJldHVybiB0aGlzLnBhZ2UuZGlzYWJsZWQgfHwgdGhpcy5uYXZTZXJ2aWNlLndpemFyZFN0b3BOYXZpZ2F0aW9uIHx8IHRoaXMubmF2U2VydmljZS53aXphcmREaXNhYmxlU3RlcG5hdjtcbiAgfVxuXG4gIGdldCBpc0N1cnJlbnQoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5wYWdlR3VhcmQoKTtcbiAgICByZXR1cm4gdGhpcy5wYWdlLmN1cnJlbnQ7XG4gIH1cblxuICBnZXQgaXNDb21wbGV0ZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLnBhZ2VHdWFyZCgpO1xuICAgIHJldHVybiB0aGlzLnBhZ2UuY29tcGxldGVkO1xuICB9XG5cbiAgZ2V0IGhhc0Vycm9yKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMucGFnZUd1YXJkKCk7XG4gICAgcmV0dXJuIHRoaXMucGFnZS5oYXNFcnJvciAmJiB0aGlzLmlzQ29tcGxldGU7XG4gIH1cblxuICBnZXQgY2FuTmF2aWdhdGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5wYWdlR3VhcmQoKTtcbiAgICByZXR1cm4gdGhpcy5wYWdlQ29sbGVjdGlvbi5wcmV2aW91c1BhZ2VJc0NvbXBsZXRlZCh0aGlzLnBhZ2UpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBzdGVwSWNvbklkKCkge1xuICAgIHJldHVybiBgJHt0aGlzLmlkfS1zdGVwLWljb25gO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBzdGVwVGV4dElkKCkge1xuICAgIHJldHVybiBgJHt0aGlzLmlkfS1zdGVwLXRleHRgO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBzdGVwTnVtYmVySWQoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuaWR9LXN0ZXAtbnVtYmVyYDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgc3RlcFRpdGxlSWQoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuaWR9LXN0ZXAtdGl0bGVgO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBsYWJlbGxlZGJ5KCkge1xuICAgIGNvbnN0IHRleHRJZHMgPSBbdGhpcy5zdGVwVGV4dElkLCB0aGlzLnN0ZXBOdW1iZXJJZCwgdGhpcy5zdGVwVGl0bGVJZF07XG4gICAgY29uc3QgYWxsSWRzID0gdGhpcy5pc0NvbXBsZXRlID8gW3RoaXMuc3RlcEljb25JZCwgLi4udGV4dElkc10gOiB0ZXh0SWRzO1xuXG4gICAgcmV0dXJuIGFsbElkcy5qb2luKCcgJyk7XG4gIH1cblxuICBjbGljaygpOiB2b2lkIHtcbiAgICB0aGlzLnBhZ2VHdWFyZCgpO1xuXG4gICAgLy8gaWYgd2UgY2xpY2sgb24gb3VyIG93biBzdGVwbmF2IG9yIGEgZGlzYWJsZWQgc3RlcG5hdiwgd2UgZG9uJ3Qgd2FudCB0byBkbyBhbnl0aGluZ1xuICAgIGlmICh0aGlzLmlzRGlzYWJsZWQgfHwgdGhpcy5pc0N1cnJlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm5hdlNlcnZpY2UuZ29Ubyh0aGlzLnBhZ2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBwYWdlR3VhcmQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnBhZ2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignV2l6YXJkIHN0ZXBuYXYgaXRlbSBpcyBub3QgYXNzb2NpYXRlZCB3aXRoIGEgd2l6YXJkIHBhZ2UuJyk7XG4gICAgfVxuICB9XG59XG4iXX0=