/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/items";
import * as i2 from "@angular/common";
export class ClrDatagridPlaceholder {
    constructor(items) {
        this.items = items;
    }
    /**
     * Tests if the datagrid is empty, meaning it doesn't contain any items
     */
    get emptyDatagrid() {
        return !this.items.loading && (!this.items.displayed || this.items.displayed.length === 0);
    }
}
ClrDatagridPlaceholder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridPlaceholder, deps: [{ token: i1.Items }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridPlaceholder.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridPlaceholder, selector: "clr-dg-placeholder", host: { properties: { "class.datagrid-placeholder-container": "true" } }, ngImport: i0, template: `
    <div class="datagrid-placeholder" [class.datagrid-empty]="emptyDatagrid">
      <div class="datagrid-placeholder-image" *ngIf="emptyDatagrid"></div>
      <span class="datagrid-placeholder-content"><ng-content *ngIf="emptyDatagrid"></ng-content></span>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridPlaceholder, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-placeholder',
                    template: `
    <div class="datagrid-placeholder" [class.datagrid-empty]="emptyDatagrid">
      <div class="datagrid-placeholder-image" *ngIf="emptyDatagrid"></div>
      <span class="datagrid-placeholder-content"><ng-content *ngIf="emptyDatagrid"></ng-content></span>
    </div>
  `,
                    host: { '[class.datagrid-placeholder-container]': 'true' },
                }]
        }], ctorParameters: function () { return [{ type: i1.Items }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtcGxhY2Vob2xkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLXBsYWNlaG9sZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQWMxQyxNQUFNLE9BQU8sc0JBQXNCO0lBQ2pDLFlBQW9CLEtBQWU7UUFBZixVQUFLLEdBQUwsS0FBSyxDQUFVO0lBQUcsQ0FBQztJQUV2Qzs7T0FFRztJQUNILElBQUksYUFBYTtRQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7O21IQVJVLHNCQUFzQjt1R0FBdEIsc0JBQXNCLG9JQVJ2Qjs7Ozs7R0FLVDsyRkFHVSxzQkFBc0I7a0JBVmxDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtvQkFDOUIsUUFBUSxFQUFFOzs7OztHQUtUO29CQUNELElBQUksRUFBRSxFQUFFLHdDQUF3QyxFQUFFLE1BQU0sRUFBRTtpQkFDM0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJdGVtcyB9IGZyb20gJy4vcHJvdmlkZXJzL2l0ZW1zJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWRnLXBsYWNlaG9sZGVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtcGxhY2Vob2xkZXJcIiBbY2xhc3MuZGF0YWdyaWQtZW1wdHldPVwiZW1wdHlEYXRhZ3JpZFwiPlxuICAgICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLXBsYWNlaG9sZGVyLWltYWdlXCIgKm5nSWY9XCJlbXB0eURhdGFncmlkXCI+PC9kaXY+XG4gICAgICA8c3BhbiBjbGFzcz1cImRhdGFncmlkLXBsYWNlaG9sZGVyLWNvbnRlbnRcIj48bmctY29udGVudCAqbmdJZj1cImVtcHR5RGF0YWdyaWRcIj48L25nLWNvbnRlbnQ+PC9zcGFuPlxuICAgIDwvZGl2PlxuICBgLFxuICBob3N0OiB7ICdbY2xhc3MuZGF0YWdyaWQtcGxhY2Vob2xkZXItY29udGFpbmVyXSc6ICd0cnVlJyB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZFBsYWNlaG9sZGVyPFQgPSBhbnk+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpdGVtczogSXRlbXM8VD4pIHt9XG5cbiAgLyoqXG4gICAqIFRlc3RzIGlmIHRoZSBkYXRhZ3JpZCBpcyBlbXB0eSwgbWVhbmluZyBpdCBkb2Vzbid0IGNvbnRhaW4gYW55IGl0ZW1zXG4gICAqL1xuICBnZXQgZW1wdHlEYXRhZ3JpZCgpIHtcbiAgICByZXR1cm4gIXRoaXMuaXRlbXMubG9hZGluZyAmJiAoIXRoaXMuaXRlbXMuZGlzcGxheWVkIHx8IHRoaXMuaXRlbXMuZGlzcGxheWVkLmxlbmd0aCA9PT0gMCk7XG4gIH1cbn1cbiJdfQ==