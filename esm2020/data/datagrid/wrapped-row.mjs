/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ViewChild } from '@angular/core';
import * as i0 from "@angular/core";
export class WrappedRow {
    ngAfterViewInit() {
        // Create the cells view in memory, not the DOM.
        this.rowView = this.templateRef.createEmbeddedView(null);
    }
    ngOnDestroy() {
        this.rowView.destroy();
    }
}
WrappedRow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: WrappedRow, deps: [], target: i0.ɵɵFactoryTarget.Component });
WrappedRow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: WrappedRow, selector: "dg-wrapped-row", viewQueries: [{ propertyName: "templateRef", first: true, predicate: ["rowPortal"], descendants: true }], ngImport: i0, template: `
    <ng-template #rowPortal>
      <ng-content></ng-content>
    </ng-template>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: WrappedRow, decorators: [{
            type: Component,
            args: [{
                    selector: 'dg-wrapped-row',
                    template: `
    <ng-template #rowPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
                }]
        }], propDecorators: { templateRef: [{
                type: ViewChild,
                args: ['rowPortal']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcHBlZC1yb3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL3dyYXBwZWQtcm93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFpQixTQUFTLEVBQTJDLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFVN0csTUFBTSxPQUFPLFVBQVU7SUFJckIsZUFBZTtRQUNiLGdEQUFnRDtRQUNoRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3pCLENBQUM7O3VHQVhVLFVBQVU7MkZBQVYsVUFBVSxnS0FOWDs7OztHQUlUOzJGQUVVLFVBQVU7a0JBUnRCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsUUFBUSxFQUFFOzs7O0dBSVQ7aUJBQ0Y7OEJBRXlCLFdBQVc7c0JBQWxDLFNBQVM7dUJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbWJlZGRlZFZpZXdSZWYsIE9uRGVzdHJveSwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkZy13cmFwcGVkLXJvdycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlICNyb3dQb3J0YWw+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgV3JhcHBlZFJvdyBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBWaWV3Q2hpbGQoJ3Jvd1BvcnRhbCcpIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjx2b2lkPjtcbiAgcm93VmlldzogRW1iZWRkZWRWaWV3UmVmPHZvaWQ+OyAvLyB0aGUgcm93cyBwcm9qZWN0ZWQgdmlldyAoaW4gbWVtb3J5KVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBDcmVhdGUgdGhlIGNlbGxzIHZpZXcgaW4gbWVtb3J5LCBub3QgdGhlIERPTS5cbiAgICB0aGlzLnJvd1ZpZXcgPSB0aGlzLnRlbXBsYXRlUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyhudWxsKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMucm93Vmlldy5kZXN0cm95KCk7XG4gIH1cbn1cbiJdfQ==