/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Input } from '@angular/core';
import { startWith, tap } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./providers/wizard-navigation.service";
import * as i2 from "./providers/page-collection.service";
import * as i3 from "../utils";
import * as i4 from "@angular/common";
import * as i5 from "../icon/icon";
export class ClrWizardStepnavItem {
    constructor(navService, pageCollection, commonStrings, elementRef) {
        this.navService = navService;
        this.pageCollection = pageCollection;
        this.commonStrings = commonStrings;
        this.elementRef = elementRef;
        /**
         * This is used to prevent the steps from scrolling as the user clicks on the steps.
         */
        this.skipNextScroll = false;
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
    get icon() {
        if (this.isCurrent) {
            return {
                shape: 'dot-circle',
                label: this.commonStrings.keys.wizardStepCurrent || this.commonStrings.keys.timelineStepCurrent,
            };
        }
        else if (this.hasError) {
            return {
                shape: 'error-standard',
                label: this.commonStrings.keys.wizardStepError || this.commonStrings.keys.timelineStepError,
            };
        }
        else if (this.isComplete) {
            return {
                shape: 'success-standard',
                label: this.commonStrings.keys.wizardStepSuccess || this.commonStrings.keys.timelineStepSuccess,
            };
        }
        else {
            return null;
        }
    }
    ngOnInit() {
        this.subscription = this.ensureCurrentStepIsScrolledIntoView().subscribe();
    }
    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
    click() {
        this.pageGuard();
        // if we click on our own stepnav or a disabled stepnav, we don't want to do anything
        if (this.isDisabled || this.isCurrent) {
            return;
        }
        this.skipNextScroll = true;
        this.navService.goTo(this.page);
    }
    pageGuard() {
        if (!this.page) {
            throw new Error('Wizard stepnav item is not associated with a wizard page.');
        }
    }
    ensureCurrentStepIsScrolledIntoView() {
        // Don't use "smooth" scrolling when the wizard is first opened to avoid a delay in scrolling the current step into view.
        // The current step when the wizard is opened might not be the first step. For example, the wizard can be closed and re-opened.
        let scrollBehavior = 'auto';
        return this.navService.currentPageChanged.pipe(startWith(this.navService.currentPage), tap(currentPage => {
            if (!this.skipNextScroll && currentPage === this.page) {
                this.elementRef.nativeElement.scrollIntoView({ behavior: scrollBehavior, block: 'center', inline: 'center' });
            }
            scrollBehavior = 'smooth';
            this.skipNextScroll = false;
        }));
    }
}
ClrWizardStepnavItem.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardStepnavItem, deps: [{ token: i1.WizardNavigationService }, { token: i2.PageCollectionService }, { token: i3.ClrCommonStringsService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
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
          *ngIf="icon; let icon"
          [id]="stepIconId"
          role="img"
          class="clr-wizard-stepnav-link-icon"
          [attr.shape]="icon.shape"
          [attr.aria-label]="icon.label"
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
          *ngIf="icon; let icon"
          [id]="stepIconId"
          role="img"
          class="clr-wizard-stepnav-link-icon"
          [attr.shape]="icon.shape"
          [attr.aria-label]="icon.label"
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
        }], ctorParameters: function () { return [{ type: i1.WizardNavigationService }, { type: i2.PageCollectionService }, { type: i3.ClrCommonStringsService }, { type: i0.ElementRef }]; }, propDecorators: { page: [{
                type: Input,
                args: ['page']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXN0ZXBuYXYtaXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3dpemFyZC93aXphcmQtc3RlcG5hdi1pdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBYyxLQUFLLEVBQXFCLE1BQU0sZUFBZSxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxTQUFTLEVBQWdCLEdBQUcsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7Ozs7OztBQWtEcEQsTUFBTSxPQUFPLG9CQUFvQjtJQVUvQixZQUNTLFVBQW1DLEVBQ25DLGNBQXFDLEVBQ3JDLGFBQXNDLEVBQzVCLFVBQW1DO1FBSDdDLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBQ25DLG1CQUFjLEdBQWQsY0FBYyxDQUF1QjtRQUNyQyxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFDNUIsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUFUdEQ7O1dBRUc7UUFDSyxtQkFBYyxHQUFHLEtBQUssQ0FBQztJQU81QixDQUFDO0lBRUosSUFBSSxFQUFFO1FBQ0osSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFvQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUM7SUFDNUcsQ0FBQztJQUVELElBQUksU0FBUztRQUNYLElBQUksQ0FB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QUFFLElBQUk7d0JBQ1oscUJBQXFCLEVBQUUsaUJBQWlCO3dCQUN4QyxzQkFBc0IsRUFBRSxTQUFTO3dCQUNqQyxzQkFBc0IsRUFBRSxNQUFNO3dCQUM5QixrQkFBa0IsRUFBRSxNQUFNO3dCQUMxQixnQkFBZ0IsRUFBRSxXQUFXO3dCQUM3QixrQkFBa0IsRUFBRSxZQUFZO3dCQUNoQyxrQkFBa0IsRUFBRSxjQUFjO3dCQUNsQyxrQkFBa0IsRUFBRSxZQUFZO3dCQUNoQyxlQUFlLEVBQUUsVUFBVTtxQkFDNUI7aUJBQ0Y7aU5BRWdCLElBQUk7c0JBQWxCLEtBQUs7dUJBQUMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHN0YXJ0V2l0aCwgU3Vic2NyaXB0aW9uLCB0YXAgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBQYWdlQ29sbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9wYWdlLWNvbGxlY3Rpb24uc2VydmljZSc7XG5pbXBvcnQgeyBXaXphcmROYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3dpemFyZC1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyV2l6YXJkUGFnZSB9IGZyb20gJy4vd2l6YXJkLXBhZ2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbY2xyLXdpemFyZC1zdGVwbmF2LWl0ZW1dJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIGNsYXNzPVwiYnRuIGJ0bi1saW5rIGNsci13aXphcmQtc3RlcG5hdi1saW5rXCJcbiAgICAgIChjbGljayk9XCJjbGljaygpXCJcbiAgICAgIFthdHRyLmRpc2FibGVkXT1cImlzRGlzYWJsZWQgPyAnJyA6IG51bGxcIlxuICAgICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImxhYmVsbGVkYnlcIlxuICAgID5cbiAgICAgIDxkaXYgY2xhc3M9XCJjbHItd2l6YXJkLXN0ZXBuYXYtbGluay1pY29uXCI+XG4gICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICpuZ0lmPVwiaWNvbjsgbGV0IGljb25cIlxuICAgICAgICAgIFtpZF09XCJzdGVwSWNvbklkXCJcbiAgICAgICAgICByb2xlPVwiaW1nXCJcbiAgICAgICAgICBjbGFzcz1cImNsci13aXphcmQtc3RlcG5hdi1saW5rLWljb25cIlxuICAgICAgICAgIFthdHRyLnNoYXBlXT1cImljb24uc2hhcGVcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiaWNvbi5sYWJlbFwiXG4gICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxzcGFuIFtpZF09XCJzdGVwVGV4dElkXCIgY2xhc3M9XCJjbHItc3Itb25seVwiPnt7IGNvbW1vblN0cmluZ3Mua2V5cy53aXphcmRTdGVwIH19PC9zcGFuPlxuICAgICAgPGRpdiBbaWRdPVwic3RlcE51bWJlcklkXCIgY2xhc3M9XCJjbHItd2l6YXJkLXN0ZXBuYXYtbGluay1wYWdlLW51bWJlclwiPlxuICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxzcGFuIFtpZF09XCJzdGVwVGl0bGVJZFwiIGNsYXNzPVwiY2xyLXdpemFyZC1zdGVwbmF2LWxpbmstdGl0bGVcIj5cbiAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInBhZ2UubmF2VGl0bGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgPC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICBgLFxuICBob3N0OiB7XG4gICAgJ1tpZF0nOiAnaWQnLFxuICAgICdbYXR0ci5hcmlhLWN1cnJlbnRdJzogJ3N0ZXBBcmlhQ3VycmVudCcsXG4gICAgJ1thdHRyLmFyaWEtY29udHJvbHNdJzogJ3BhZ2UuaWQnLFxuICAgICdbY2xhc3MuY2xyLW5hdi1saW5rXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLm5hdi1pdGVtXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmFjdGl2ZV0nOiAnaXNDdXJyZW50JyxcbiAgICAnW2NsYXNzLmRpc2FibGVkXSc6ICdpc0Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm5vLWNsaWNrXSc6ICchY2FuTmF2aWdhdGUnLFxuICAgICdbY2xhc3MuY29tcGxldGVdJzogJ2lzQ29tcGxldGUnLFxuICAgICdbY2xhc3MuZXJyb3JdJzogJ2hhc0Vycm9yJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyV2l6YXJkU3RlcG5hdkl0ZW0gaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgncGFnZScpIHBhZ2U6IENscldpemFyZFBhZ2U7XG5cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKipcbiAgICogVGhpcyBpcyB1c2VkIHRvIHByZXZlbnQgdGhlIHN0ZXBzIGZyb20gc2Nyb2xsaW5nIGFzIHRoZSB1c2VyIGNsaWNrcyBvbiB0aGUgc3RlcHMuXG4gICAqL1xuICBwcml2YXRlIHNraXBOZXh0U2Nyb2xsID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIG5hdlNlcnZpY2U6IFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlLFxuICAgIHB1YmxpYyBwYWdlQ29sbGVjdGlvbjogUGFnZUNvbGxlY3Rpb25TZXJ2aWNlLFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+XG4gICkge31cblxuICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICB0aGlzLnBhZ2VHdWFyZCgpO1xuICAgIHJldHVybiB0aGlzLnBhZ2VDb2xsZWN0aW9uLmdldFN0ZXBJdGVtSWRGb3JQYWdlKHRoaXMucGFnZSk7XG4gIH1cblxuICBnZXQgc3RlcEFyaWFDdXJyZW50KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaXNDdXJyZW50ICYmICdzdGVwJztcbiAgfVxuXG4gIGdldCBpc0Rpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMucGFnZUd1YXJkKCk7XG4gICAgcmV0dXJuIHRoaXMucGFnZS5kaXNhYmxlZCB8fCB0aGlzLm5hdlNlcnZpY2Uud2l6YXJkU3RvcE5hdmlnYXRpb24gfHwgdGhpcy5uYXZTZXJ2aWNlLndpemFyZERpc2FibGVTdGVwbmF2O1xuICB9XG5cbiAgZ2V0IGlzQ3VycmVudCgpOiBib29sZWFuIHtcbiAgICB0aGlzLnBhZ2VHdWFyZCgpO1xuICAgIHJldHVybiB0aGlzLnBhZ2UuY3VycmVudDtcbiAgfVxuXG4gIGdldCBpc0NvbXBsZXRlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMucGFnZUd1YXJkKCk7XG4gICAgcmV0dXJuIHRoaXMucGFnZS5jb21wbGV0ZWQ7XG4gIH1cblxuICBnZXQgaGFzRXJyb3IoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5wYWdlR3VhcmQoKTtcbiAgICByZXR1cm4gdGhpcy5wYWdlLmhhc0Vycm9yICYmIHRoaXMuaXNDb21wbGV0ZTtcbiAgfVxuXG4gIGdldCBjYW5OYXZpZ2F0ZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLnBhZ2VHdWFyZCgpO1xuICAgIHJldHVybiB0aGlzLnBhZ2VDb2xsZWN0aW9uLnByZXZpb3VzUGFnZUlzQ29tcGxldGVkKHRoaXMucGFnZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IHN0ZXBJY29uSWQoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuaWR9LXN0ZXAtaWNvbmA7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IHN0ZXBUZXh0SWQoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuaWR9LXN0ZXAtdGV4dGA7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IHN0ZXBOdW1iZXJJZCgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5pZH0tc3RlcC1udW1iZXJgO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBzdGVwVGl0bGVJZCgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5pZH0tc3RlcC10aXRsZWA7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGxhYmVsbGVkYnkoKSB7XG4gICAgY29uc3QgdGV4dElkcyA9IFt0aGlzLnN0ZXBUZXh0SWQsIHRoaXMuc3RlcE51bWJlcklkLCB0aGlzLnN0ZXBUaXRsZUlkXTtcbiAgICBjb25zdCBhbGxJZHMgPSB0aGlzLmlzQ29tcGxldGUgPyBbdGhpcy5zdGVwSWNvbklkLCAuLi50ZXh0SWRzXSA6IHRleHRJZHM7XG5cbiAgICByZXR1cm4gYWxsSWRzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgaWNvbigpOiB7IHNoYXBlOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmcgfSB8IG51bGwge1xuICAgIGlmICh0aGlzLmlzQ3VycmVudCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2hhcGU6ICdkb3QtY2lyY2xlJyxcbiAgICAgICAgbGFiZWw6IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLndpemFyZFN0ZXBDdXJyZW50IHx8IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLnRpbWVsaW5lU3RlcEN1cnJlbnQsXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodGhpcy5oYXNFcnJvcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2hhcGU6ICdlcnJvci1zdGFuZGFyZCcsXG4gICAgICAgIGxhYmVsOiB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy53aXphcmRTdGVwRXJyb3IgfHwgdGhpcy5jb21tb25TdHJpbmdzLmtleXMudGltZWxpbmVTdGVwRXJyb3IsXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbXBsZXRlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzaGFwZTogJ3N1Y2Nlc3Mtc3RhbmRhcmQnLFxuICAgICAgICBsYWJlbDogdGhpcy5jb21tb25TdHJpbmdzLmtleXMud2l6YXJkU3RlcFN1Y2Nlc3MgfHwgdGhpcy5jb21tb25TdHJpbmdzLmtleXMudGltZWxpbmVTdGVwU3VjY2VzcyxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5lbnN1cmVDdXJyZW50U3RlcElzU2Nyb2xsZWRJbnRvVmlldygpLnN1YnNjcmliZSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBjbGljaygpOiB2b2lkIHtcbiAgICB0aGlzLnBhZ2VHdWFyZCgpO1xuXG4gICAgLy8gaWYgd2UgY2xpY2sgb24gb3VyIG93biBzdGVwbmF2IG9yIGEgZGlzYWJsZWQgc3RlcG5hdiwgd2UgZG9uJ3Qgd2FudCB0byBkbyBhbnl0aGluZ1xuICAgIGlmICh0aGlzLmlzRGlzYWJsZWQgfHwgdGhpcy5pc0N1cnJlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNraXBOZXh0U2Nyb2xsID0gdHJ1ZTtcbiAgICB0aGlzLm5hdlNlcnZpY2UuZ29Ubyh0aGlzLnBhZ2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBwYWdlR3VhcmQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnBhZ2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignV2l6YXJkIHN0ZXBuYXYgaXRlbSBpcyBub3QgYXNzb2NpYXRlZCB3aXRoIGEgd2l6YXJkIHBhZ2UuJyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlbnN1cmVDdXJyZW50U3RlcElzU2Nyb2xsZWRJbnRvVmlldygpIHtcbiAgICAvLyBEb24ndCB1c2UgXCJzbW9vdGhcIiBzY3JvbGxpbmcgd2hlbiB0aGUgd2l6YXJkIGlzIGZpcnN0IG9wZW5lZCB0byBhdm9pZCBhIGRlbGF5IGluIHNjcm9sbGluZyB0aGUgY3VycmVudCBzdGVwIGludG8gdmlldy5cbiAgICAvLyBUaGUgY3VycmVudCBzdGVwIHdoZW4gdGhlIHdpemFyZCBpcyBvcGVuZWQgbWlnaHQgbm90IGJlIHRoZSBmaXJzdCBzdGVwLiBGb3IgZXhhbXBsZSwgdGhlIHdpemFyZCBjYW4gYmUgY2xvc2VkIGFuZCByZS1vcGVuZWQuXG4gICAgbGV0IHNjcm9sbEJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvciA9ICdhdXRvJztcblxuICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2UuY3VycmVudFBhZ2VDaGFuZ2VkLnBpcGUoXG4gICAgICBzdGFydFdpdGgodGhpcy5uYXZTZXJ2aWNlLmN1cnJlbnRQYWdlKSxcbiAgICAgIHRhcChjdXJyZW50UGFnZSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5za2lwTmV4dFNjcm9sbCAmJiBjdXJyZW50UGFnZSA9PT0gdGhpcy5wYWdlKSB7XG4gICAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvcjogc2Nyb2xsQmVoYXZpb3IsIGJsb2NrOiAnY2VudGVyJywgaW5saW5lOiAnY2VudGVyJyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjcm9sbEJlaGF2aW9yID0gJ3Ntb290aCc7XG4gICAgICAgIHRoaXMuc2tpcE5leHRTY3JvbGwgPSBmYWxzZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuIl19