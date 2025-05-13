/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, Optional, Output, PLATFORM_ID, ViewChild, } from '@angular/core';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrAlignment } from '../../utils/popover/enums/alignment.enum';
import { ClrAxis } from '../../utils/popover/enums/axis.enum';
import { ClrSide } from '../../utils/popover/enums/side.enum';
import { CustomFilter } from './providers/custom-filter';
import { DatagridFilterRegistrar } from './utils/datagrid-filter-registrar';
import * as i0 from "@angular/core";
import * as i1 from "./providers/filters";
import * as i2 from "../../utils/i18n/common-strings.service";
import * as i3 from "../../utils/popover/providers/popover-toggle.service";
import * as i4 from "./utils/key-navigation-grid.controller";
import * as i5 from "../../utils/cdk/cdk-trap-focus.module";
import * as i6 from "../../icon/icon";
import * as i7 from "../../utils/popover/popover-anchor";
import * as i8 from "../../utils/popover/popover-close-button";
import * as i9 from "../../utils/popover/popover-open-close-button";
import * as i10 from "../../utils/popover/popover-content";
/**
 * Custom filter that can be added in any column to override the default object property string filter.
 * The reason this is not just an input on DatagridColumn is because we need the filter's template to be projected,
 * since it can be anything (not just a text input).
 */
export class ClrDatagridFilter extends DatagridFilterRegistrar {
    constructor(_filters, commonStrings, smartToggleService, platformId, elementRef, keyNavigation) {
        super(_filters);
        this.commonStrings = commonStrings;
        this.smartToggleService = smartToggleService;
        this.platformId = platformId;
        this.elementRef = elementRef;
        this.keyNavigation = keyNavigation;
        this.openChange = new EventEmitter(false);
        this.ariaExpanded = false;
        this.popoverId = uniqueIdFactory();
        // Smart Popover
        this.smartPosition = {
            axis: ClrAxis.VERTICAL,
            side: ClrSide.AFTER,
            anchor: ClrAlignment.END,
            content: ClrAlignment.END,
        };
        this._open = false;
        this.subs = [];
        this.subs.push(smartToggleService.openChange.subscribe(change => {
            this.open = change;
            this.ariaExpanded = change;
        }));
    }
    get open() {
        return this._open;
    }
    set open(open) {
        open = !!open;
        if (this.open !== open) {
            this.smartToggleService.open = open;
            this.openChange.emit(open);
            if (!open && isPlatformBrowser(this.platformId)) {
                this.anchor.nativeElement.focus();
            }
            if (this.keyNavigation) {
                this.keyNavigation.skipItemFocus = open;
            }
            // keep track of the state
            this._open = open;
        }
    }
    set customFilter(filter) {
        this.setFilter(filter);
    }
    /**
     * Indicates if the filter is currently active
     */
    get active() {
        return !!this.filter && this.filter.isActive();
    }
    ngOnChanges() {
        setTimeout(() => {
            this.setToggleButtonAriaLabel();
        });
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this.subs.forEach(sub => sub.unsubscribe());
    }
    /**
     * This is not in a getter to prevent "expression has changed after it was checked" errors.
     * And it's more performant this way since it only runs on change.
     */
    setToggleButtonAriaLabel() {
        const columnElement = this.elementRef.nativeElement?.closest('clr-dg-column');
        const columnTitleElement = columnElement?.querySelector('.datagrid-column-title');
        const columnTitle = columnTitleElement?.textContent.trim().toLocaleLowerCase();
        this.toggleButtonAriaLabel = this.commonStrings.parse(this.commonStrings.keys.datagridFilterAriaLabel, {
            COLUMN: columnTitle || '',
        });
    }
}
ClrDatagridFilter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridFilter, deps: [{ token: i1.FiltersProvider }, { token: i2.ClrCommonStringsService }, { token: i3.ClrPopoverToggleService }, { token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i4.KeyNavigationGridController, optional: true }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridFilter.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridFilter, selector: "clr-dg-filter", inputs: { open: ["clrDgFilterOpen", "open"], customFilter: ["clrDgFilter", "customFilter"] }, outputs: { openChange: "clrDgFilterOpenChange" }, providers: [{ provide: CustomFilter, useExisting: ClrDatagridFilter }], viewQueries: [{ propertyName: "anchor", first: true, predicate: ["anchor"], descendants: true, read: ElementRef }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: `
    <button
      class="datagrid-filter-toggle"
      type="button"
      #anchor
      [attr.aria-label]="toggleButtonAriaLabel"
      [attr.aria-expanded]="ariaExpanded"
      [attr.aria-controls]="popoverId"
      clrPopoverAnchor
      clrPopoverOpenCloseButton
      [class.datagrid-filter-open]="open"
      [class.datagrid-filtered]="active"
    >
      <cds-icon
        [attr.status]="active ? 'info' : null"
        [attr.shape]="active ? 'filter-grid-circle' : 'filter-grid'"
        solid
      ></cds-icon>
    </button>

    <div
      class="datagrid-filter"
      [id]="popoverId"
      cdkTrapFocus
      *clrPopoverContent="open; at: smartPosition; outsideClickToClose: true; scrollToClose: true"
      role="dialog"
      [attr.aria-label]="commonStrings.keys.datagridFilterDialogAriaLabel"
    >
      <div class="datagrid-filter-close-wrapper">
        <button type="button" class="close" clrPopoverCloseButton>
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>

      <ng-content></ng-content>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i5.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }, { kind: "directive", type: i6.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i7.ClrPopoverAnchor, selector: "[clrPopoverAnchor]" }, { kind: "directive", type: i8.ClrPopoverCloseButton, selector: "[clrPopoverCloseButton]", outputs: ["clrPopoverOnCloseChange"] }, { kind: "directive", type: i9.ClrPopoverOpenCloseButton, selector: "[clrPopoverOpenCloseButton]", outputs: ["clrPopoverOpenCloseChange"] }, { kind: "directive", type: i10.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridFilter, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-filter',
                    // We register this component as a CustomFilter, for the parent column to detect it.
                    providers: [{ provide: CustomFilter, useExisting: ClrDatagridFilter }],
                    template: `
    <button
      class="datagrid-filter-toggle"
      type="button"
      #anchor
      [attr.aria-label]="toggleButtonAriaLabel"
      [attr.aria-expanded]="ariaExpanded"
      [attr.aria-controls]="popoverId"
      clrPopoverAnchor
      clrPopoverOpenCloseButton
      [class.datagrid-filter-open]="open"
      [class.datagrid-filtered]="active"
    >
      <cds-icon
        [attr.status]="active ? 'info' : null"
        [attr.shape]="active ? 'filter-grid-circle' : 'filter-grid'"
        solid
      ></cds-icon>
    </button>

    <div
      class="datagrid-filter"
      [id]="popoverId"
      cdkTrapFocus
      *clrPopoverContent="open; at: smartPosition; outsideClickToClose: true; scrollToClose: true"
      role="dialog"
      [attr.aria-label]="commonStrings.keys.datagridFilterDialogAriaLabel"
    >
      <div class="datagrid-filter-close-wrapper">
        <button type="button" class="close" clrPopoverCloseButton>
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>

      <ng-content></ng-content>
    </div>
  `,
                }]
        }], ctorParameters: function () { return [{ type: i1.FiltersProvider }, { type: i2.ClrCommonStringsService }, { type: i3.ClrPopoverToggleService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }, { type: i4.KeyNavigationGridController, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { openChange: [{
                type: Output,
                args: ['clrDgFilterOpenChange']
            }], anchor: [{
                type: ViewChild,
                args: ['anchor', { read: ElementRef }]
            }], open: [{
                type: Input,
                args: ['clrDgFilterOpen']
            }], customFilter: [{
                type: Input,
                args: ['clrDgFilter']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFdBQVcsRUFDWCxTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFJdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDOUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBSTlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUV6RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQzs7Ozs7Ozs7Ozs7O0FBRzVFOzs7O0dBSUc7QUEyQ0gsTUFBTSxPQUFPLGlCQUNYLFNBQVEsdUJBQXlEO0lBc0JqRSxZQUNFLFFBQTRCLEVBQ3JCLGFBQXNDLEVBQ3JDLGtCQUEyQyxFQUN0QixVQUFlLEVBQ3BDLFVBQW1DLEVBQ3ZCLGFBQTBDO1FBRTlELEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQU5ULGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUNyQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQXlCO1FBQ3RCLGVBQVUsR0FBVixVQUFVLENBQUs7UUFDcEMsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUFDdkIsa0JBQWEsR0FBYixh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dUIsRUFBRTtZQUNyRyxNQUFNLEVBQUUsV0FBVyxJQUFJLEVBQUU7U0FDMUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7OEdBaEdVLGlCQUFpQiwrSEEyQmxCLFdBQVc7a0dBM0JWLGlCQUFpQix3TEF2Q2pCLENBQUMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxDQUFDLHVHQXlEekMsVUFBVSx5RUF4RDdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQ1Q7MkZBRVUsaUJBQWlCO2tCQTFDN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsb0ZBQW9GO29CQUNwRixTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxtQkFBbUIsRUFBRSxDQUFDO29CQUN0RSxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9DVDtpQkFDRjs7MEJBNEJJLE1BQU07MkJBQUMsV0FBVzs7MEJBRWxCLFFBQVE7NENBekJzQixVQUFVO3NCQUExQyxNQUFNO3VCQUFDLHVCQUF1QjtnQkFjWSxNQUFNO3NCQUFoRCxTQUFTO3VCQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7Z0JBdUJyQyxJQUFJO3NCQURQLEtBQUs7dUJBQUMsaUJBQWlCO2dCQXFCcEIsWUFBWTtzQkFEZixLQUFLO3VCQUFDLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUExBVEZPUk1fSUQsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgdW5pcXVlSWRGYWN0b3J5IH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQtZ2VuZXJhdG9yL2lkLWdlbmVyYXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IENsckFsaWdubWVudCB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvZW51bXMvYWxpZ25tZW50LmVudW0nO1xuaW1wb3J0IHsgQ2xyQXhpcyB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvZW51bXMvYXhpcy5lbnVtJztcbmltcG9ydCB7IENsclNpZGUgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL2VudW1zL3NpZGUuZW51bSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyUG9zaXRpb24gfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL2ludGVyZmFjZXMvcG9wb3Zlci1wb3NpdGlvbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL3Byb3ZpZGVycy9wb3BvdmVyLXRvZ2dsZS5zZXJ2aWNlJztcbmltcG9ydCB7IENsckRhdGFncmlkRmlsdGVySW50ZXJmYWNlIH0gZnJvbSAnLi9pbnRlcmZhY2VzL2ZpbHRlci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ3VzdG9tRmlsdGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvY3VzdG9tLWZpbHRlcic7XG5pbXBvcnQgeyBGaWx0ZXJzUHJvdmlkZXIsIFJlZ2lzdGVyZWRGaWx0ZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9maWx0ZXJzJztcbmltcG9ydCB7IERhdGFncmlkRmlsdGVyUmVnaXN0cmFyIH0gZnJvbSAnLi91dGlscy9kYXRhZ3JpZC1maWx0ZXItcmVnaXN0cmFyJztcbmltcG9ydCB7IEtleU5hdmlnYXRpb25HcmlkQ29udHJvbGxlciB9IGZyb20gJy4vdXRpbHMva2V5LW5hdmlnYXRpb24tZ3JpZC5jb250cm9sbGVyJztcblxuLyoqXG4gKiBDdXN0b20gZmlsdGVyIHRoYXQgY2FuIGJlIGFkZGVkIGluIGFueSBjb2x1bW4gdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb2JqZWN0IHByb3BlcnR5IHN0cmluZyBmaWx0ZXIuXG4gKiBUaGUgcmVhc29uIHRoaXMgaXMgbm90IGp1c3QgYW4gaW5wdXQgb24gRGF0YWdyaWRDb2x1bW4gaXMgYmVjYXVzZSB3ZSBuZWVkIHRoZSBmaWx0ZXIncyB0ZW1wbGF0ZSB0byBiZSBwcm9qZWN0ZWQsXG4gKiBzaW5jZSBpdCBjYW4gYmUgYW55dGhpbmcgKG5vdCBqdXN0IGEgdGV4dCBpbnB1dCkuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1kZy1maWx0ZXInLFxuICAvLyBXZSByZWdpc3RlciB0aGlzIGNvbXBvbmVudCBhcyBhIEN1c3RvbUZpbHRlciwgZm9yIHRoZSBwYXJlbnQgY29sdW1uIHRvIGRldGVjdCBpdC5cbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBDdXN0b21GaWx0ZXIsIHVzZUV4aXN0aW5nOiBDbHJEYXRhZ3JpZEZpbHRlciB9XSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YnV0dG9uXG4gICAgICBjbGFzcz1cImRhdGFncmlkLWZpbHRlci10b2dnbGVcIlxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAjYW5jaG9yXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cInRvZ2dsZUJ1dHRvbkFyaWFMYWJlbFwiXG4gICAgICBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cImFyaWFFeHBhbmRlZFwiXG4gICAgICBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cInBvcG92ZXJJZFwiXG4gICAgICBjbHJQb3BvdmVyQW5jaG9yXG4gICAgICBjbHJQb3BvdmVyT3BlbkNsb3NlQnV0dG9uXG4gICAgICBbY2xhc3MuZGF0YWdyaWQtZmlsdGVyLW9wZW5dPVwib3BlblwiXG4gICAgICBbY2xhc3MuZGF0YWdyaWQtZmlsdGVyZWRdPVwiYWN0aXZlXCJcbiAgICA+XG4gICAgICA8Y2RzLWljb25cbiAgICAgICAgW2F0dHIuc3RhdHVzXT1cImFjdGl2ZSA/ICdpbmZvJyA6IG51bGxcIlxuICAgICAgICBbYXR0ci5zaGFwZV09XCJhY3RpdmUgPyAnZmlsdGVyLWdyaWQtY2lyY2xlJyA6ICdmaWx0ZXItZ3JpZCdcIlxuICAgICAgICBzb2xpZFxuICAgICAgPjwvY2RzLWljb24+XG4gICAgPC9idXR0b24+XG5cbiAgICA8ZGl2XG4gICAgICBjbGFzcz1cImRhdGFncmlkLWZpbHRlclwiXG4gICAgICBbaWRdPVwicG9wb3ZlcklkXCJcbiAgICAgIGNka1RyYXBGb2N1c1xuICAgICAgKmNsclBvcG92ZXJDb250ZW50PVwib3BlbjsgYXQ6IHNtYXJ0UG9zaXRpb247IG91dHNpZGVDbGlja1RvQ2xvc2U6IHRydWU7IHNjcm9sbFRvQ2xvc2U6IHRydWVcIlxuICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5kYXRhZ3JpZEZpbHRlckRpYWxvZ0FyaWFMYWJlbFwiXG4gICAgPlxuICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWZpbHRlci1jbG9zZS13cmFwcGVyXCI+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBjbHJQb3BvdmVyQ2xvc2VCdXR0b24+XG4gICAgICAgICAgPGNkcy1pY29uIHNoYXBlPVwid2luZG93LWNsb3NlXCIgW2F0dHIudGl0bGVdPVwiY29tbW9uU3RyaW5ncy5rZXlzLmNsb3NlXCI+PC9jZHMtaWNvbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZEZpbHRlcjxUID0gYW55PlxuICBleHRlbmRzIERhdGFncmlkRmlsdGVyUmVnaXN0cmFyPFQsIENsckRhdGFncmlkRmlsdGVySW50ZXJmYWNlPFQ+PlxuICBpbXBsZW1lbnRzIEN1c3RvbUZpbHRlciwgT25DaGFuZ2VzLCBPbkRlc3Ryb3lcbntcbiAgQE91dHB1dCgnY2xyRGdGaWx0ZXJPcGVuQ2hhbmdlJykgb3BlbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gIGFyaWFFeHBhbmRlZCA9IGZhbHNlO1xuICBwb3BvdmVySWQgPSB1bmlxdWVJZEZhY3RvcnkoKTtcbiAgdG9nZ2xlQnV0dG9uQXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLy8gU21hcnQgUG9wb3ZlclxuICBzbWFydFBvc2l0aW9uOiBDbHJQb3BvdmVyUG9zaXRpb24gPSB7XG4gICAgYXhpczogQ2xyQXhpcy5WRVJUSUNBTCxcbiAgICBzaWRlOiBDbHJTaWRlLkFGVEVSLFxuICAgIGFuY2hvcjogQ2xyQWxpZ25tZW50LkVORCxcbiAgICBjb250ZW50OiBDbHJBbGlnbm1lbnQuRU5ELFxuICB9O1xuXG4gIEBWaWV3Q2hpbGQoJ2FuY2hvcicsIHsgcmVhZDogRWxlbWVudFJlZiB9KSBhbmNob3I6IEVsZW1lbnRSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+O1xuXG4gIHByaXZhdGUgX29wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBzdWJzOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIF9maWx0ZXJzOiBGaWx0ZXJzUHJvdmlkZXI8VD4sXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlLFxuICAgIHByaXZhdGUgc21hcnRUb2dnbGVTZXJ2aWNlOiBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSxcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IGFueSxcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUga2V5TmF2aWdhdGlvbjogS2V5TmF2aWdhdGlvbkdyaWRDb250cm9sbGVyXG4gICkge1xuICAgIHN1cGVyKF9maWx0ZXJzKTtcbiAgICB0aGlzLnN1YnMucHVzaChcbiAgICAgIHNtYXJ0VG9nZ2xlU2VydmljZS5vcGVuQ2hhbmdlLnN1YnNjcmliZShjaGFuZ2UgPT4ge1xuICAgICAgICB0aGlzLm9wZW4gPSBjaGFuZ2U7XG4gICAgICAgIHRoaXMuYXJpYUV4cGFuZGVkID0gY2hhbmdlO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgQElucHV0KCdjbHJEZ0ZpbHRlck9wZW4nKVxuICBnZXQgb3BlbigpIHtcbiAgICByZXR1cm4gdGhpcy5fb3BlbjtcbiAgfVxuICBzZXQgb3BlbihvcGVuOiBib29sZWFuKSB7XG4gICAgb3BlbiA9ICEhb3BlbjtcbiAgICBpZiAodGhpcy5vcGVuICE9PSBvcGVuKSB7XG4gICAgICB0aGlzLnNtYXJ0VG9nZ2xlU2VydmljZS5vcGVuID0gb3BlbjtcbiAgICAgIHRoaXMub3BlbkNoYW5nZS5lbWl0KG9wZW4pO1xuICAgICAgaWYgKCFvcGVuICYmIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgdGhpcy5hbmNob3IubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMua2V5TmF2aWdhdGlvbikge1xuICAgICAgICB0aGlzLmtleU5hdmlnYXRpb24uc2tpcEl0ZW1Gb2N1cyA9IG9wZW47XG4gICAgICB9XG4gICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSBzdGF0ZVxuICAgICAgdGhpcy5fb3BlbiA9IG9wZW47XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdjbHJEZ0ZpbHRlcicpXG4gIHNldCBjdXN0b21GaWx0ZXIoZmlsdGVyOiBDbHJEYXRhZ3JpZEZpbHRlckludGVyZmFjZTxUPiB8IFJlZ2lzdGVyZWRGaWx0ZXI8VCwgQ2xyRGF0YWdyaWRGaWx0ZXJJbnRlcmZhY2U8VD4+KSB7XG4gICAgdGhpcy5zZXRGaWx0ZXIoZmlsdGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgdGhlIGZpbHRlciBpcyBjdXJyZW50bHkgYWN0aXZlXG4gICAqL1xuICBnZXQgYWN0aXZlKCkge1xuICAgIHJldHVybiAhIXRoaXMuZmlsdGVyICYmIHRoaXMuZmlsdGVyLmlzQWN0aXZlKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0VG9nZ2xlQnV0dG9uQXJpYUxhYmVsKCk7XG4gICAgfSk7XG4gIH1cblxuICBvdmVycmlkZSBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuc3Vicy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBpcyBub3QgaW4gYSBnZXR0ZXIgdG8gcHJldmVudCBcImV4cHJlc3Npb24gaGFzIGNoYW5nZWQgYWZ0ZXIgaXQgd2FzIGNoZWNrZWRcIiBlcnJvcnMuXG4gICAqIEFuZCBpdCdzIG1vcmUgcGVyZm9ybWFudCB0aGlzIHdheSBzaW5jZSBpdCBvbmx5IHJ1bnMgb24gY2hhbmdlLlxuICAgKi9cbiAgcHJpdmF0ZSBzZXRUb2dnbGVCdXR0b25BcmlhTGFiZWwoKSB7XG4gICAgY29uc3QgY29sdW1uRWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Py5jbG9zZXN0KCdjbHItZGctY29sdW1uJyk7XG4gICAgY29uc3QgY29sdW1uVGl0bGVFbGVtZW50ID0gY29sdW1uRWxlbWVudD8ucXVlcnlTZWxlY3RvcignLmRhdGFncmlkLWNvbHVtbi10aXRsZScpO1xuXG4gICAgY29uc3QgY29sdW1uVGl0bGUgPSBjb2x1bW5UaXRsZUVsZW1lbnQ/LnRleHRDb250ZW50LnRyaW0oKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuXG4gICAgdGhpcy50b2dnbGVCdXR0b25BcmlhTGFiZWwgPSB0aGlzLmNvbW1vblN0cmluZ3MucGFyc2UodGhpcy5jb21tb25TdHJpbmdzLmtleXMuZGF0YWdyaWRGaWx0ZXJBcmlhTGFiZWwsIHtcbiAgICAgIENPTFVNTjogY29sdW1uVGl0bGUgfHwgJycsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==