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
    ngOnDestroy() {
        super.ngOnDestroy();
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
ClrDatagridFilter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridFilter, deps: [{ token: i1.FiltersProvider }, { token: i2.ClrCommonStringsService }, { token: i3.ClrPopoverToggleService }, { token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i4.KeyNavigationGridController, optional: true }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridFilter.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridFilter, selector: "clr-dg-filter", inputs: { open: ["clrDgFilterOpen", "open"], customFilter: ["clrDgFilter", "customFilter"] }, outputs: { openChange: "clrDgFilterOpenChange" }, providers: [{ provide: CustomFilter, useExisting: ClrDatagridFilter }], viewQueries: [{ propertyName: "anchor", first: true, predicate: ["anchor"], descendants: true, read: ElementRef }], usesInheritance: true, ngImport: i0, template: `
    <button
      class="datagrid-filter-toggle"
      type="button"
      #anchor
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFdBQVcsRUFDWCxTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFJdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDOUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBSTlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUV6RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQzs7Ozs7Ozs7Ozs7O0FBRzVFOzs7O0dBSUc7QUEwQ0gsTUFBTSxPQUFPLGlCQUNYLFNBQVEsdUJBQXlEO0lBcUJqRSxZQUNFLFFBQTRCLEVBQ3JCLGFBQXNDLEVBQ3JDLGtCQUEyQyxFQUN0QixVQUFlLEVBQ3BDLFVBQW1DLEVBQ3ZCLGFBQTBDO1FBRTlELEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQU5ULGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUNyQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQXlCO1FBQ3RCLGVBQVUsR0FBVixVQUFVLENBQUs7UUFDcEMsZUFBVSxHQUFWLFVBQVUsQ0FBeUI7UUFDdkIsa0JBQWEsR0FBYixhQUFhLENBQTZCO1FBeEIvQixlQUFVLEdBQUcsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7UUFFL0UsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsY0FBUyxHQUFHLGVBQWUsRUFBRSxDQUFDO1FBRTlCLGdCQUFnQjtRQUNoQixrQkFBYSxHQUF1QjtZQUNsQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFFBQVE7WUFDdEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLO1lBQ25CLE1BQU0sRUFBRSxZQUFZLENBQUMsR0FBRztZQUN4QixPQUFPLEVBQUUsWUFBWSxDQUFDLEdBQUc7U0FDMUIsQ0FBQztRQUlNLFVBQUssR0FBRyxLQUFLLENBQUM7UUFDZCxTQUFJLEdBQW1CLEVBQUUsQ0FBQztRQVdoQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDWixrQkFBa0IsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQy9DLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1lBQ25CLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0lBRUQsSUFDSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFDRCxJQUFJLElBQUksQ0FBQyxJQUFhO1FBQ3BCLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2QsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtZQUN0QixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNwQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsSUFBSSxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDbkM7WUFDRCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzthQUN6QztZQUNELDBCQUEwQjtZQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNuQjtJQUNILENBQUM7SUFFRCxJQUNJLFlBQVksQ0FBQyxNQUEwRjtRQUN6RyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksTUFBTTtRQUNSLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRVEsV0FBVztRQUNsQixLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUM5QyxDQUFDOzs4R0ExRVUsaUJBQWlCLCtIQTBCbEIsV0FBVztrR0ExQlYsaUJBQWlCLHdMQXRDakIsQ0FBQyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLENBQUMsdUdBdUR6QyxVQUFVLG9EQXREN0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUNUOzJGQUVVLGlCQUFpQjtrQkF6QzdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLG9GQUFvRjtvQkFDcEYsU0FBUyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsbUJBQW1CLEVBQUUsQ0FBQztvQkFDdEUsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1DVDtpQkFDRjs7MEJBMkJJLE1BQU07MkJBQUMsV0FBVzs7MEJBRWxCLFFBQVE7NENBeEJzQixVQUFVO3NCQUExQyxNQUFNO3VCQUFDLHVCQUF1QjtnQkFhWSxNQUFNO3NCQUFoRCxTQUFTO3VCQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7Z0JBdUJyQyxJQUFJO3NCQURQLEtBQUs7dUJBQUMsaUJBQWlCO2dCQXFCcEIsWUFBWTtzQkFEZixLQUFLO3VCQUFDLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFBMQVRGT1JNX0lELFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IHVuaXF1ZUlkRmFjdG9yeSB9IGZyb20gJy4uLy4uL3V0aWxzL2lkLWdlbmVyYXRvci9pZC1nZW5lcmF0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJBbGlnbm1lbnQgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL2VudW1zL2FsaWdubWVudC5lbnVtJztcbmltcG9ydCB7IENsckF4aXMgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL2VudW1zL2F4aXMuZW51bSc7XG5pbXBvcnQgeyBDbHJTaWRlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9lbnVtcy9zaWRlLmVudW0nO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclBvc2l0aW9uIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9pbnRlcmZhY2VzL3BvcG92ZXItcG9zaXRpb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZEZpbHRlckludGVyZmFjZSB9IGZyb20gJy4vaW50ZXJmYWNlcy9maWx0ZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7IEN1c3RvbUZpbHRlciB9IGZyb20gJy4vcHJvdmlkZXJzL2N1c3RvbS1maWx0ZXInO1xuaW1wb3J0IHsgRmlsdGVyc1Byb3ZpZGVyLCBSZWdpc3RlcmVkRmlsdGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvZmlsdGVycyc7XG5pbXBvcnQgeyBEYXRhZ3JpZEZpbHRlclJlZ2lzdHJhciB9IGZyb20gJy4vdXRpbHMvZGF0YWdyaWQtZmlsdGVyLXJlZ2lzdHJhcic7XG5pbXBvcnQgeyBLZXlOYXZpZ2F0aW9uR3JpZENvbnRyb2xsZXIgfSBmcm9tICcuL3V0aWxzL2tleS1uYXZpZ2F0aW9uLWdyaWQuY29udHJvbGxlcic7XG5cbi8qKlxuICogQ3VzdG9tIGZpbHRlciB0aGF0IGNhbiBiZSBhZGRlZCBpbiBhbnkgY29sdW1uIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9iamVjdCBwcm9wZXJ0eSBzdHJpbmcgZmlsdGVyLlxuICogVGhlIHJlYXNvbiB0aGlzIGlzIG5vdCBqdXN0IGFuIGlucHV0IG9uIERhdGFncmlkQ29sdW1uIGlzIGJlY2F1c2Ugd2UgbmVlZCB0aGUgZmlsdGVyJ3MgdGVtcGxhdGUgdG8gYmUgcHJvamVjdGVkLFxuICogc2luY2UgaXQgY2FuIGJlIGFueXRoaW5nIChub3QganVzdCBhIHRleHQgaW5wdXQpLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGctZmlsdGVyJyxcbiAgLy8gV2UgcmVnaXN0ZXIgdGhpcyBjb21wb25lbnQgYXMgYSBDdXN0b21GaWx0ZXIsIGZvciB0aGUgcGFyZW50IGNvbHVtbiB0byBkZXRlY3QgaXQuXG4gIHByb3ZpZGVyczogW3sgcHJvdmlkZTogQ3VzdG9tRmlsdGVyLCB1c2VFeGlzdGluZzogQ2xyRGF0YWdyaWRGaWx0ZXIgfV0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGJ1dHRvblxuICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1maWx0ZXItdG9nZ2xlXCJcbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgI2FuY2hvclxuICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJhcmlhRXhwYW5kZWRcIlxuICAgICAgW2F0dHIuYXJpYS1jb250cm9sc109XCJwb3BvdmVySWRcIlxuICAgICAgY2xyUG9wb3ZlckFuY2hvclxuICAgICAgY2xyUG9wb3Zlck9wZW5DbG9zZUJ1dHRvblxuICAgICAgW2NsYXNzLmRhdGFncmlkLWZpbHRlci1vcGVuXT1cIm9wZW5cIlxuICAgICAgW2NsYXNzLmRhdGFncmlkLWZpbHRlcmVkXT1cImFjdGl2ZVwiXG4gICAgPlxuICAgICAgPGNkcy1pY29uXG4gICAgICAgIFthdHRyLnN0YXR1c109XCJhY3RpdmUgPyAnaW5mbycgOiBudWxsXCJcbiAgICAgICAgW2F0dHIuc2hhcGVdPVwiYWN0aXZlID8gJ2ZpbHRlci1ncmlkLWNpcmNsZScgOiAnZmlsdGVyLWdyaWQnXCJcbiAgICAgICAgc29saWRcbiAgICAgID48L2Nkcy1pY29uPlxuICAgIDwvYnV0dG9uPlxuXG4gICAgPGRpdlxuICAgICAgY2xhc3M9XCJkYXRhZ3JpZC1maWx0ZXJcIlxuICAgICAgW2lkXT1cInBvcG92ZXJJZFwiXG4gICAgICBjZGtUcmFwRm9jdXNcbiAgICAgICpjbHJQb3BvdmVyQ29udGVudD1cIm9wZW47IGF0OiBzbWFydFBvc2l0aW9uOyBvdXRzaWRlQ2xpY2tUb0Nsb3NlOiB0cnVlOyBzY3JvbGxUb0Nsb3NlOiB0cnVlXCJcbiAgICAgIHJvbGU9XCJkaWFsb2dcIlxuICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMuZGF0YWdyaWRGaWx0ZXJEaWFsb2dBcmlhTGFiZWxcIlxuICAgID5cbiAgICAgIDxkaXYgY2xhc3M9XCJkYXRhZ3JpZC1maWx0ZXItY2xvc2Utd3JhcHBlclwiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgY2xyUG9wb3ZlckNsb3NlQnV0dG9uPlxuICAgICAgICAgIDxjZHMtaWNvbiBzaGFwZT1cIndpbmRvdy1jbG9zZVwiIFthdHRyLnRpdGxlXT1cImNvbW1vblN0cmluZ3Mua2V5cy5jbG9zZVwiPjwvY2RzLWljb24+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRGaWx0ZXI8VCA9IGFueT5cbiAgZXh0ZW5kcyBEYXRhZ3JpZEZpbHRlclJlZ2lzdHJhcjxULCBDbHJEYXRhZ3JpZEZpbHRlckludGVyZmFjZTxUPj5cbiAgaW1wbGVtZW50cyBDdXN0b21GaWx0ZXIsIE9uRGVzdHJveVxue1xuICBAT3V0cHV0KCdjbHJEZ0ZpbHRlck9wZW5DaGFuZ2UnKSBvcGVuQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPihmYWxzZSk7XG5cbiAgYXJpYUV4cGFuZGVkID0gZmFsc2U7XG4gIHBvcG92ZXJJZCA9IHVuaXF1ZUlkRmFjdG9yeSgpO1xuXG4gIC8vIFNtYXJ0IFBvcG92ZXJcbiAgc21hcnRQb3NpdGlvbjogQ2xyUG9wb3ZlclBvc2l0aW9uID0ge1xuICAgIGF4aXM6IENsckF4aXMuVkVSVElDQUwsXG4gICAgc2lkZTogQ2xyU2lkZS5BRlRFUixcbiAgICBhbmNob3I6IENsckFsaWdubWVudC5FTkQsXG4gICAgY29udGVudDogQ2xyQWxpZ25tZW50LkVORCxcbiAgfTtcblxuICBAVmlld0NoaWxkKCdhbmNob3InLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgYW5jaG9yOiBFbGVtZW50UmVmPEhUTUxCdXR0b25FbGVtZW50PjtcblxuICBwcml2YXRlIF9vcGVuID0gZmFsc2U7XG4gIHByaXZhdGUgc3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBfZmlsdGVyczogRmlsdGVyc1Byb3ZpZGVyPFQ+LFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIHNtYXJ0VG9nZ2xlU2VydmljZTogQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGtleU5hdmlnYXRpb246IEtleU5hdmlnYXRpb25HcmlkQ29udHJvbGxlclxuICApIHtcbiAgICBzdXBlcihfZmlsdGVycyk7XG4gICAgdGhpcy5zdWJzLnB1c2goXG4gICAgICBzbWFydFRvZ2dsZVNlcnZpY2Uub3BlbkNoYW5nZS5zdWJzY3JpYmUoY2hhbmdlID0+IHtcbiAgICAgICAgdGhpcy5vcGVuID0gY2hhbmdlO1xuICAgICAgICB0aGlzLmFyaWFFeHBhbmRlZCA9IGNoYW5nZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyRGdGaWx0ZXJPcGVuJylcbiAgZ2V0IG9wZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wZW47XG4gIH1cbiAgc2V0IG9wZW4ob3BlbjogYm9vbGVhbikge1xuICAgIG9wZW4gPSAhIW9wZW47XG4gICAgaWYgKHRoaXMub3BlbiAhPT0gb3Blbikge1xuICAgICAgdGhpcy5zbWFydFRvZ2dsZVNlcnZpY2Uub3BlbiA9IG9wZW47XG4gICAgICB0aGlzLm9wZW5DaGFuZ2UuZW1pdChvcGVuKTtcbiAgICAgIGlmICghb3BlbiAmJiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICAgIHRoaXMuYW5jaG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmtleU5hdmlnYXRpb24pIHtcbiAgICAgICAgdGhpcy5rZXlOYXZpZ2F0aW9uLnNraXBJdGVtRm9jdXMgPSBvcGVuO1xuICAgICAgfVxuICAgICAgLy8ga2VlcCB0cmFjayBvZiB0aGUgc3RhdGVcbiAgICAgIHRoaXMuX29wZW4gPSBvcGVuO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgnY2xyRGdGaWx0ZXInKVxuICBzZXQgY3VzdG9tRmlsdGVyKGZpbHRlcjogQ2xyRGF0YWdyaWRGaWx0ZXJJbnRlcmZhY2U8VD4gfCBSZWdpc3RlcmVkRmlsdGVyPFQsIENsckRhdGFncmlkRmlsdGVySW50ZXJmYWNlPFQ+Pikge1xuICAgIHRoaXMuc2V0RmlsdGVyKGZpbHRlcik7XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoZSBmaWx0ZXIgaXMgY3VycmVudGx5IGFjdGl2ZVxuICAgKi9cbiAgZ2V0IGFjdGl2ZSgpIHtcbiAgICByZXR1cm4gISF0aGlzLmZpbHRlciAmJiB0aGlzLmZpbHRlci5pc0FjdGl2ZSgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLnN1YnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG59XG4iXX0=