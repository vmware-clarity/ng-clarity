/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ViewChild } from '@angular/core';
import * as i0 from "@angular/core";
export class WrappedColumn {
    ngAfterViewInit() {
        // Create the cells view in memory, not the DOM.
        this.columnView = this.templateRef.createEmbeddedView(null);
    }
    ngOnDestroy() {
        this.columnView.destroy();
    }
}
WrappedColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: WrappedColumn, deps: [], target: i0.ɵɵFactoryTarget.Component });
WrappedColumn.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: WrappedColumn, selector: "dg-wrapped-column", viewQueries: [{ propertyName: "templateRef", first: true, predicate: ["columnPortal"], descendants: true }], ngImport: i0, template: `
    <ng-template #columnPortal>
      <ng-content></ng-content>
    </ng-template>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: WrappedColumn, decorators: [{
            type: Component,
            args: [{
                    selector: 'dg-wrapped-column',
                    template: `
    <ng-template #columnPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
                }]
        }], propDecorators: { templateRef: [{
                type: ViewChild,
                args: ['columnPortal']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcHBlZC1jb2x1bW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL3dyYXBwZWQtY29sdW1uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFpQixTQUFTLEVBQTJDLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFVN0csTUFBTSxPQUFPLGFBQWE7SUFJeEIsZUFBZTtRQUNiLGdEQUFnRDtRQUNoRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzVCLENBQUM7OzBHQVhVLGFBQWE7OEZBQWIsYUFBYSxzS0FOZDs7OztHQUlUOzJGQUVVLGFBQWE7a0JBUnpCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsUUFBUSxFQUFFOzs7O0dBSVQ7aUJBQ0Y7OEJBRTRCLFdBQVc7c0JBQXJDLFNBQVM7dUJBQUMsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbWJlZGRlZFZpZXdSZWYsIE9uRGVzdHJveSwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkZy13cmFwcGVkLWNvbHVtbicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlICNjb2x1bW5Qb3J0YWw+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgV3JhcHBlZENvbHVtbiBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBWaWV3Q2hpbGQoJ2NvbHVtblBvcnRhbCcpIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjx2b2lkPjtcbiAgY29sdW1uVmlldzogRW1iZWRkZWRWaWV3UmVmPHZvaWQ+OyAvLyB0aGUgY29sdW1ucyBwcm9qZWN0ZWQgdmlldyAoaW4gbWVtb3J5KVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBDcmVhdGUgdGhlIGNlbGxzIHZpZXcgaW4gbWVtb3J5LCBub3QgdGhlIERPTS5cbiAgICB0aGlzLmNvbHVtblZpZXcgPSB0aGlzLnRlbXBsYXRlUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyhudWxsKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuY29sdW1uVmlldy5kZXN0cm95KCk7XG4gIH1cbn1cbiJdfQ==