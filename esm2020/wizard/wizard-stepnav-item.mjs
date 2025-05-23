/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Input } from '@angular/core';
import { tap } from 'rxjs';
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
        this.navService.goTo(this.page);
    }
    pageGuard() {
        if (!this.page) {
            throw new Error('Wizard stepnav item is not associated with a wizard page.');
        }
    }
    ensureCurrentStepIsScrolledIntoView() {
        const stepnavItemElement = this.elementRef.nativeElement;
        const stepnavWrapperElement = stepnavItemElement.closest('.clr-wizard-stepnav-wrapper');
        return this.navService.currentPageChanged.pipe(tap(currentPage => {
            if (currentPage === this.page &&
                !elementIsScrolledIntoView({ container: stepnavWrapperElement, element: stepnavItemElement })) {
                stepnavItemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
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
function elementIsScrolledIntoView({ container, element }) {
    const elementTop = element.offsetTop;
    const elementBottom = elementTop + element.clientHeight;
    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;
    return elementTop >= containerTop && elementBottom <= containerBottom;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXN0ZXBuYXYtaXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3dpemFyZC93aXphcmQtc3RlcG5hdi1pdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBYyxLQUFLLEVBQXFCLE1BQU0sZUFBZSxDQUFDO0FBQ2hGLE9BQU8sRUFBZ0IsR0FBRyxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7Ozs7O0FBa0R6QyxNQUFNLE9BQU8sb0JBQW9CO0lBSy9CLFlBQ1MsVUFBbUMsRUFDbkMsY0FBcUMsRUFDckMsYUFBc0MsRUFDNUIsVUFBbUM7UUFIN0MsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUFDbkMsbUJBQWMsR0FBZCxjQUFjLENBQXVCO1FBQ3JDLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUM1QixlQUFVLEdBQVYsVUFBVSxDQUF5QjtJQUNuRCxDQUFDO0lBRUosSUFBSSxFQUFFO1FBQ0osSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFvQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUM7SUFDNUcsQ0FBQztJQUVELElBQUksU0FBUztRQUNYLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMs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LEVBQUUsV0FBVzt3QkFDN0Isa0JBQWtCLEVBQUUsWUFBWTt3QkFDaEMsa0JBQWtCLEVBQUUsY0FBYzt3QkFDbEMsa0JBQWtCLEVBQUUsWUFBWTt3QkFDaEMsZUFBZSxFQUFFLFVBQVU7cUJBQzVCO2lCQUNGO2lOQUVnQixJQUFJO3NCQUFsQixLQUFLO3VCQUFDLE1BQU07O0FBbUlmLFNBQVMseUJBQXlCLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFvRDtJQUN6RyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0lBQ3JDLE1BQU0sYUFBYSxHQUFHLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO0lBRXhELE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUM7SUFDekMsTUFBTSxlQUFlLEdBQUcsWUFBWSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUM7SUFFOUQsT0FBTyxVQUFVLElBQUksWUFBWSxJQUFJLGFBQWEsSUFBSSxlQUFlLENBQUM7QUFDeEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiwgdGFwIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgUGFnZUNvbGxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcGFnZS1jb2xsZWN0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy93aXphcmQtbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IENscldpemFyZFBhZ2UgfSBmcm9tICcuL3dpemFyZC1wYWdlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW2Nsci13aXphcmQtc3RlcG5hdi1pdGVtXScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGJ1dHRvblxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICBjbGFzcz1cImJ0biBidG4tbGluayBjbHItd2l6YXJkLXN0ZXBuYXYtbGlua1wiXG4gICAgICAoY2xpY2spPVwiY2xpY2soKVwiXG4gICAgICBbYXR0ci5kaXNhYmxlZF09XCJpc0Rpc2FibGVkID8gJycgOiBudWxsXCJcbiAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJsYWJlbGxlZGJ5XCJcbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzPVwiY2xyLXdpemFyZC1zdGVwbmF2LWxpbmstaWNvblwiPlxuICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAqbmdJZj1cImljb247IGxldCBpY29uXCJcbiAgICAgICAgICBbaWRdPVwic3RlcEljb25JZFwiXG4gICAgICAgICAgcm9sZT1cImltZ1wiXG4gICAgICAgICAgY2xhc3M9XCJjbHItd2l6YXJkLXN0ZXBuYXYtbGluay1pY29uXCJcbiAgICAgICAgICBbYXR0ci5zaGFwZV09XCJpY29uLnNoYXBlXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImljb24ubGFiZWxcIlxuICAgICAgICA+PC9jZHMtaWNvbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8c3BhbiBbaWRdPVwic3RlcFRleHRJZFwiIGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57eyBjb21tb25TdHJpbmdzLmtleXMud2l6YXJkU3RlcCB9fTwvc3Bhbj5cbiAgICAgIDxkaXYgW2lkXT1cInN0ZXBOdW1iZXJJZFwiIGNsYXNzPVwiY2xyLXdpemFyZC1zdGVwbmF2LWxpbmstcGFnZS1udW1iZXJcIj5cbiAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgPC9kaXY+XG4gICAgICA8c3BhbiBbaWRdPVwic3RlcFRpdGxlSWRcIiBjbGFzcz1cImNsci13aXphcmQtc3RlcG5hdi1saW5rLXRpdGxlXCI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJwYWdlLm5hdlRpdGxlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cbiAgYCxcbiAgaG9zdDoge1xuICAgICdbaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIuYXJpYS1jdXJyZW50XSc6ICdzdGVwQXJpYUN1cnJlbnQnLFxuICAgICdbYXR0ci5hcmlhLWNvbnRyb2xzXSc6ICdwYWdlLmlkJyxcbiAgICAnW2NsYXNzLmNsci1uYXYtbGlua10nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5uYXYtaXRlbV0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5hY3RpdmVdJzogJ2lzQ3VycmVudCcsXG4gICAgJ1tjbGFzcy5kaXNhYmxlZF0nOiAnaXNEaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5uby1jbGlja10nOiAnIWNhbk5hdmlnYXRlJyxcbiAgICAnW2NsYXNzLmNvbXBsZXRlXSc6ICdpc0NvbXBsZXRlJyxcbiAgICAnW2NsYXNzLmVycm9yXSc6ICdoYXNFcnJvcicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENscldpemFyZFN0ZXBuYXZJdGVtIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoJ3BhZ2UnKSBwYWdlOiBDbHJXaXphcmRQYWdlO1xuXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIG5hdlNlcnZpY2U6IFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlLFxuICAgIHB1YmxpYyBwYWdlQ29sbGVjdGlvbjogUGFnZUNvbGxlY3Rpb25TZXJ2aWNlLFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+XG4gICkge31cblxuICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICB0aGlzLnBhZ2VHdWFyZCgpO1xuICAgIHJldHVybiB0aGlzLnBhZ2VDb2xsZWN0aW9uLmdldFN0ZXBJdGVtSWRGb3JQYWdlKHRoaXMucGFnZSk7XG4gIH1cblxuICBnZXQgc3RlcEFyaWFDdXJyZW50KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaXNDdXJyZW50ICYmICdzdGVwJztcbiAgfVxuXG4gIGdldCBpc0Rpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMucGFnZUd1YXJkKCk7XG4gICAgcmV0dXJuIHRoaXMucGFnZS5kaXNhYmxlZCB8fCB0aGlzLm5hdlNlcnZpY2Uud2l6YXJkU3RvcE5hdmlnYXRpb24gfHwgdGhpcy5uYXZTZXJ2aWNlLndpemFyZERpc2FibGVTdGVwbmF2O1xuICB9XG5cbiAgZ2V0IGlzQ3VycmVudCgpOiBib29sZWFuIHtcbiAgICB0aGlzLnBhZ2VHdWFyZCgpO1xuICAgIHJldHVybiB0aGlzLnBhZ2UuY3VycmVudDtcbiAgfVxuXG4gIGdldCBpc0NvbXBsZXRlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMucGFnZUd1YXJkKCk7XG4gICAgcmV0dXJuIHRoaXMucGFnZS5jb21wbGV0ZWQ7XG4gIH1cblxuICBnZXQgaGFzRXJyb3IoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5wYWdlR3VhcmQoKTtcbiAgICByZXR1cm4gdGhpcy5wYWdlLmhhc0Vycm9yICYmIHRoaXMuaXNDb21wbGV0ZTtcbiAgfVxuXG4gIGdldCBjYW5OYXZpZ2F0ZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLnBhZ2VHdWFyZCgpO1xuICAgIHJldHVybiB0aGlzLnBhZ2VDb2xsZWN0aW9uLnByZXZpb3VzUGFnZUlzQ29tcGxldGVkKHRoaXMucGFnZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IHN0ZXBJY29uSWQoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuaWR9LXN0ZXAtaWNvbmA7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IHN0ZXBUZXh0SWQoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuaWR9LXN0ZXAtdGV4dGA7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IHN0ZXBOdW1iZXJJZCgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5pZH0tc3RlcC1udW1iZXJgO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBzdGVwVGl0bGVJZCgpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5pZH0tc3RlcC10aXRsZWA7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGxhYmVsbGVkYnkoKSB7XG4gICAgY29uc3QgdGV4dElkcyA9IFt0aGlzLnN0ZXBUZXh0SWQsIHRoaXMuc3RlcE51bWJlcklkLCB0aGlzLnN0ZXBUaXRsZUlkXTtcbiAgICBjb25zdCBhbGxJZHMgPSB0aGlzLmlzQ29tcGxldGUgPyBbdGhpcy5zdGVwSWNvbklkLCAuLi50ZXh0SWRzXSA6IHRleHRJZHM7XG5cbiAgICByZXR1cm4gYWxsSWRzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgaWNvbigpOiB7IHNoYXBlOiBzdHJpbmc7IGxhYmVsOiBzdHJpbmcgfSB8IG51bGwge1xuICAgIGlmICh0aGlzLmlzQ3VycmVudCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2hhcGU6ICdkb3QtY2lyY2xlJyxcbiAgICAgICAgbGFiZWw6IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLndpemFyZFN0ZXBDdXJyZW50IHx8IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLnRpbWVsaW5lU3RlcEN1cnJlbnQsXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodGhpcy5oYXNFcnJvcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2hhcGU6ICdlcnJvci1zdGFuZGFyZCcsXG4gICAgICAgIGxhYmVsOiB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy53aXphcmRTdGVwRXJyb3IgfHwgdGhpcy5jb21tb25TdHJpbmdzLmtleXMudGltZWxpbmVTdGVwRXJyb3IsXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbXBsZXRlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzaGFwZTogJ3N1Y2Nlc3Mtc3RhbmRhcmQnLFxuICAgICAgICBsYWJlbDogdGhpcy5jb21tb25TdHJpbmdzLmtleXMud2l6YXJkU3RlcFN1Y2Nlc3MgfHwgdGhpcy5jb21tb25TdHJpbmdzLmtleXMudGltZWxpbmVTdGVwU3VjY2VzcyxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5lbnN1cmVDdXJyZW50U3RlcElzU2Nyb2xsZWRJbnRvVmlldygpLnN1YnNjcmliZSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBjbGljaygpOiB2b2lkIHtcbiAgICB0aGlzLnBhZ2VHdWFyZCgpO1xuXG4gICAgLy8gaWYgd2UgY2xpY2sgb24gb3VyIG93biBzdGVwbmF2IG9yIGEgZGlzYWJsZWQgc3RlcG5hdiwgd2UgZG9uJ3Qgd2FudCB0byBkbyBhbnl0aGluZ1xuICAgIGlmICh0aGlzLmlzRGlzYWJsZWQgfHwgdGhpcy5pc0N1cnJlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm5hdlNlcnZpY2UuZ29Ubyh0aGlzLnBhZ2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBwYWdlR3VhcmQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnBhZ2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignV2l6YXJkIHN0ZXBuYXYgaXRlbSBpcyBub3QgYXNzb2NpYXRlZCB3aXRoIGEgd2l6YXJkIHBhZ2UuJyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlbnN1cmVDdXJyZW50U3RlcElzU2Nyb2xsZWRJbnRvVmlldygpIHtcbiAgICBjb25zdCBzdGVwbmF2SXRlbUVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBzdGVwbmF2V3JhcHBlckVsZW1lbnQgPSBzdGVwbmF2SXRlbUVsZW1lbnQuY2xvc2VzdDxIVE1MRGl2RWxlbWVudD4oJy5jbHItd2l6YXJkLXN0ZXBuYXYtd3JhcHBlcicpO1xuXG4gICAgcmV0dXJuIHRoaXMubmF2U2VydmljZS5jdXJyZW50UGFnZUNoYW5nZWQucGlwZShcbiAgICAgIHRhcChjdXJyZW50UGFnZSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjdXJyZW50UGFnZSA9PT0gdGhpcy5wYWdlICYmXG4gICAgICAgICAgIWVsZW1lbnRJc1Njcm9sbGVkSW50b1ZpZXcoeyBjb250YWluZXI6IHN0ZXBuYXZXcmFwcGVyRWxlbWVudCwgZWxlbWVudDogc3RlcG5hdkl0ZW1FbGVtZW50IH0pXG4gICAgICAgICkge1xuICAgICAgICAgIHN0ZXBuYXZJdGVtRWxlbWVudC5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdjZW50ZXInIH0pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZWxlbWVudElzU2Nyb2xsZWRJbnRvVmlldyh7IGNvbnRhaW5lciwgZWxlbWVudCB9OiB7IGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7IGVsZW1lbnQ6IEhUTUxFbGVtZW50IH0pIHtcbiAgY29uc3QgZWxlbWVudFRvcCA9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICBjb25zdCBlbGVtZW50Qm90dG9tID0gZWxlbWVudFRvcCArIGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuXG4gIGNvbnN0IGNvbnRhaW5lclRvcCA9IGNvbnRhaW5lci5zY3JvbGxUb3A7XG4gIGNvbnN0IGNvbnRhaW5lckJvdHRvbSA9IGNvbnRhaW5lclRvcCArIGNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG5cbiAgcmV0dXJuIGVsZW1lbnRUb3AgPj0gY29udGFpbmVyVG9wICYmIGVsZW1lbnRCb3R0b20gPD0gY29udGFpbmVyQm90dG9tO1xufVxuIl19