/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { NgForOf } from '@angular/common';
import { Directive, Input, } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/items";
export class ClrDatagridItems {
    constructor(template, differs, items, vcr) {
        this.template = template;
        this.differs = differs;
        this.items = items;
        this.differ = null;
        this.subscriptions = [];
        items.smartenUp();
        this.iterableProxy = new NgForOf(vcr, template, differs);
        this.subscriptions.push(items.change.subscribe(newItems => {
            this.iterableProxy.ngForOf = newItems;
            this.iterableProxy.ngDoCheck();
        }));
    }
    set rawItems(items) {
        this._rawItems = items ? items : []; // local copy for ngOnChange diffing
    }
    set trackBy(value) {
        this.iterableProxy.ngForTrackBy = value;
    }
    /**
     * Asserts the correct type of the template context that the directive will render.
     * See https://angular.io/guide/structural-directives#typing-the-directives-context
     *
     * The presence of this method is a signal to the Ivy template type-check compiler that the
     * structural directive renders its template with a specific context type.
     */
    static ngTemplateContextGuard(_dir, _ctx) {
        return true;
    }
    ngDoCheck() {
        if (!this.differ) {
            this.differ = this.differs.find(this._rawItems).create(this.iterableProxy.ngForTrackBy);
        }
        if (this.differ) {
            const changes = this.differ.diff(this._rawItems);
            if (changes) {
                // TODO: not very efficient right now,
                // but premature optimization is the root of all evil.
                this.items.all = this._rawItems;
            }
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
ClrDatagridItems.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridItems, deps: [{ token: i0.TemplateRef }, { token: i0.IterableDiffers }, { token: i1.Items }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrDatagridItems.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridItems, selector: "[clrDgItems][clrDgItemsOf]", inputs: { rawItems: ["clrDgItemsOf", "rawItems"], trackBy: ["clrDgItemsTrackBy", "trackBy"] }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridItems, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDgItems][clrDgItemsOf]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.IterableDiffers }, { type: i1.Items }, { type: i0.ViewContainerRef }]; }, propDecorators: { rawItems: [{
                type: Input,
                args: ['clrDgItemsOf']
            }], trackBy: [{
                type: Input,
                args: ['clrDgItemsTrackBy']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtaXRlbXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLWl0ZW1zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLE9BQU8sRUFBa0IsTUFBTSxpQkFBaUIsQ0FBQztBQUMxRCxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssR0FPTixNQUFNLGVBQWUsQ0FBQzs7O0FBUXZCLE1BQU0sT0FBTyxnQkFBZ0I7SUFNM0IsWUFDUyxRQUF3QyxFQUN2QyxPQUF3QixFQUN4QixLQUFZLEVBQ3BCLEdBQXFCO1FBSGQsYUFBUSxHQUFSLFFBQVEsQ0FBZ0M7UUFDdkMsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFDeEIsVUFBSyxHQUFMLEtBQUssQ0FBTztRQU5kLFdBQU0sR0FBNkIsSUFBSSxDQUFDO1FBQ3hDLGtCQUFhLEdBQW1CLEVBQUUsQ0FBQztRQVF6QyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLE9BQU8sQ0FBSSxHQUFHLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNoQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7WUFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELElBQ0ksUUFBUSxDQUFDLEtBQVU7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsb0NBQW9DO0lBQzNFLENBQUM7SUFFRCxJQUNJLE9BQU8sQ0FBQyxLQUF5QjtRQUNuQyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDMUMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILE1BQU0sQ0FBQyxzQkFBc0IsQ0FBSSxJQUF5QixFQUFFLElBQWE7UUFDdkUsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ3pGO1FBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2pELElBQUksT0FBTyxFQUFFO2dCQUNYLHNDQUFzQztnQkFDdEMsc0RBQXNEO2dCQUN0RCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO2FBQ2pDO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQzs7NkdBM0RVLGdCQUFnQjtpR0FBaEIsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBSDVCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtpQkFDdkM7bUxBd0JLLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxjQUFjO2dCQU1qQixPQUFPO3NCQURWLEtBQUs7dUJBQUMsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBOZ0Zvck9mLCBOZ0Zvck9mQ29udGV4dCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIElucHV0LFxuICBJdGVyYWJsZURpZmZlcixcbiAgSXRlcmFibGVEaWZmZXJzLFxuICBPbkRlc3Ryb3ksXG4gIFRlbXBsYXRlUmVmLFxuICBUcmFja0J5RnVuY3Rpb24sXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEl0ZW1zIH0gZnJvbSAnLi9wcm92aWRlcnMvaXRlbXMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xyRGdJdGVtc11bY2xyRGdJdGVtc09mXScsXG59KVxuZXhwb3J0IGNsYXNzIENsckRhdGFncmlkSXRlbXM8VD4gaW1wbGVtZW50cyBEb0NoZWNrLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIGl0ZXJhYmxlUHJveHk6IE5nRm9yT2Y8VD47XG4gIHByaXZhdGUgX3Jhd0l0ZW1zOiBUW107XG4gIHByaXZhdGUgZGlmZmVyOiBJdGVyYWJsZURpZmZlcjxUPiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxOZ0Zvck9mQ29udGV4dDxUPj4sXG4gICAgcHJpdmF0ZSBkaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gICAgcHJpdmF0ZSBpdGVtczogSXRlbXMsXG4gICAgdmNyOiBWaWV3Q29udGFpbmVyUmVmXG4gICkge1xuICAgIGl0ZW1zLnNtYXJ0ZW5VcCgpO1xuICAgIHRoaXMuaXRlcmFibGVQcm94eSA9IG5ldyBOZ0Zvck9mPFQ+KHZjciwgdGVtcGxhdGUsIGRpZmZlcnMpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgaXRlbXMuY2hhbmdlLnN1YnNjcmliZShuZXdJdGVtcyA9PiB7XG4gICAgICAgIHRoaXMuaXRlcmFibGVQcm94eS5uZ0Zvck9mID0gbmV3SXRlbXM7XG4gICAgICAgIHRoaXMuaXRlcmFibGVQcm94eS5uZ0RvQ2hlY2soKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyRGdJdGVtc09mJylcbiAgc2V0IHJhd0l0ZW1zKGl0ZW1zOiBUW10pIHtcbiAgICB0aGlzLl9yYXdJdGVtcyA9IGl0ZW1zID8gaXRlbXMgOiBbXTsgLy8gbG9jYWwgY29weSBmb3IgbmdPbkNoYW5nZSBkaWZmaW5nXG4gIH1cblxuICBASW5wdXQoJ2NsckRnSXRlbXNUcmFja0J5JylcbiAgc2V0IHRyYWNrQnkodmFsdWU6IFRyYWNrQnlGdW5jdGlvbjxUPikge1xuICAgIHRoaXMuaXRlcmFibGVQcm94eS5uZ0ZvclRyYWNrQnkgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnRzIHRoZSBjb3JyZWN0IHR5cGUgb2YgdGhlIHRlbXBsYXRlIGNvbnRleHQgdGhhdCB0aGUgZGlyZWN0aXZlIHdpbGwgcmVuZGVyLlxuICAgKiBTZWUgaHR0cHM6Ly9hbmd1bGFyLmlvL2d1aWRlL3N0cnVjdHVyYWwtZGlyZWN0aXZlcyN0eXBpbmctdGhlLWRpcmVjdGl2ZXMtY29udGV4dFxuICAgKlxuICAgKiBUaGUgcHJlc2VuY2Ugb2YgdGhpcyBtZXRob2QgaXMgYSBzaWduYWwgdG8gdGhlIEl2eSB0ZW1wbGF0ZSB0eXBlLWNoZWNrIGNvbXBpbGVyIHRoYXQgdGhlXG4gICAqIHN0cnVjdHVyYWwgZGlyZWN0aXZlIHJlbmRlcnMgaXRzIHRlbXBsYXRlIHdpdGggYSBzcGVjaWZpYyBjb250ZXh0IHR5cGUuXG4gICAqL1xuICBzdGF0aWMgbmdUZW1wbGF0ZUNvbnRleHRHdWFyZDxUPihfZGlyOiBDbHJEYXRhZ3JpZEl0ZW1zPFQ+LCBfY3R4OiB1bmtub3duKTogX2N0eCBpcyBOZ0Zvck9mQ29udGV4dDxUPiB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKCF0aGlzLmRpZmZlcikge1xuICAgICAgdGhpcy5kaWZmZXIgPSB0aGlzLmRpZmZlcnMuZmluZCh0aGlzLl9yYXdJdGVtcykuY3JlYXRlKHRoaXMuaXRlcmFibGVQcm94eS5uZ0ZvclRyYWNrQnkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5kaWZmZXIpIHtcbiAgICAgIGNvbnN0IGNoYW5nZXMgPSB0aGlzLmRpZmZlci5kaWZmKHRoaXMuX3Jhd0l0ZW1zKTtcbiAgICAgIGlmIChjaGFuZ2VzKSB7XG4gICAgICAgIC8vIFRPRE86IG5vdCB2ZXJ5IGVmZmljaWVudCByaWdodCBub3csXG4gICAgICAgIC8vIGJ1dCBwcmVtYXR1cmUgb3B0aW1pemF0aW9uIGlzIHRoZSByb290IG9mIGFsbCBldmlsLlxuICAgICAgICB0aGlzLml0ZW1zLmFsbCA9IHRoaXMuX3Jhd0l0ZW1zO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cbn1cbiJdfQ==