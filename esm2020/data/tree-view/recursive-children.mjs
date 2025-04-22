/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Input, Optional } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./tree-features.service";
import * as i2 from "../../utils/conditional/if-expanded.service";
import * as i3 from "@angular/common";
/**
 * Internal component, do not export!
 * This is part of the hack to get around https://github.com/angular/angular/issues/15998
 */
export class RecursiveChildren {
    constructor(featuresService, expandService) {
        this.featuresService = featuresService;
        this.expandService = expandService;
        if (expandService) {
            this.subscription = expandService.expandChange.subscribe(value => {
                if (!value && this.parent && !featuresService.eager && featuresService.recursion) {
                    // In the case of lazy-loading recursive trees, we clear the children on collapse.
                    // This is better in case they change between two user interaction, and that way
                    // the app itself can decide whether to cache them or not.
                    this.parent.clearChildren();
                }
            });
        }
    }
    ngAfterContentInit() {
        this.setAriaRoles();
    }
    shouldRender() {
        return (this.featuresService.recursion &&
            // In the smart case, we eagerly render all the recursive children
            // to make sure two-way bindings for selection are available.
            // They will be hidden with CSS by the parent.
            (this.featuresService.eager || !this.expandService || this.expandService.expanded));
    }
    getContext(node) {
        return {
            $implicit: node.model,
            clrModel: node,
        };
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    setAriaRoles() {
        this.role = this.parent ? 'group' : null;
    }
}
RecursiveChildren.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: RecursiveChildren, deps: [{ token: i1.TreeFeaturesService }, { token: i2.IfExpandService, optional: true }], target: i0.ɵɵFactoryTarget.Component });
RecursiveChildren.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: RecursiveChildren, selector: "clr-recursive-children", inputs: { parent: "parent", children: "children" }, host: { properties: { "attr.role": "role" } }, ngImport: i0, template: `
    <ng-container *ngIf="shouldRender()">
      <ng-container *ngFor="let child of parent?.children || children">
        <ng-container *ngTemplateOutlet="featuresService.recursion.template; context: getContext(child)"></ng-container>
      </ng-container>
    </ng-container>
  `, isInline: true, dependencies: [{ kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: RecursiveChildren, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-recursive-children',
                    template: `
    <ng-container *ngIf="shouldRender()">
      <ng-container *ngFor="let child of parent?.children || children">
        <ng-container *ngTemplateOutlet="featuresService.recursion.template; context: getContext(child)"></ng-container>
      </ng-container>
    </ng-container>
  `,
                    host: {
                        '[attr.role]': 'role', // Safari + VO needs direct relationship between treeitem and group; no element should exist between them
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.TreeFeaturesService }, { type: i2.IfExpandService, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { parent: [{
                type: Input,
                args: ['parent']
            }], children: [{
                type: Input,
                args: ['children']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdXJzaXZlLWNoaWxkcmVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS90cmVlLXZpZXcvcmVjdXJzaXZlLWNoaWxkcmVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQXNCM0Q7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLGlCQUFpQjtJQVM1QixZQUFtQixlQUF1QyxFQUFzQixhQUE4QjtRQUEzRixvQkFBZSxHQUFmLGVBQWUsQ0FBd0I7UUFBc0Isa0JBQWEsR0FBYixhQUFhLENBQWlCO1FBQzVHLElBQUksYUFBYSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxZQUFZLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQy9ELElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLElBQUksZUFBZSxDQUFDLFNBQVMsRUFBRTtvQkFDaEYsa0ZBQWtGO29CQUNsRixnRkFBZ0Y7b0JBQ2hGLDBEQUEwRDtvQkFDekQsSUFBSSxDQUFDLE1BQW9DLENBQUMsYUFBYSxFQUFFLENBQUM7aUJBQzVEO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxZQUFZO1FBQ1YsT0FBTyxDQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUztZQUM5QixrRUFBa0U7WUFDbEUsNkRBQTZEO1lBQzdELDhDQUE4QztZQUM5QyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUNuRixDQUFDO0lBQ0osQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFzQjtRQUMvQixPQUFPO1lBQ0wsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ3JCLFFBQVEsRUFBRSxJQUFJO1NBQ2YsQ0FBQztJQUNKLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBRU8sWUFBWTtRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzNDLENBQUM7OzhHQW5EVSxpQkFBaUI7a0dBQWpCLGlCQUFpQixpS0FmbEI7Ozs7OztHQU1UOzJGQVNVLGlCQUFpQjtrQkFqQjdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtvQkFDbEMsUUFBUSxFQUFFOzs7Ozs7R0FNVDtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osYUFBYSxFQUFFLE1BQU0sRUFBRSx5R0FBeUc7cUJBQ2pJO2lCQUNGOzswQkFjOEQsUUFBUTs0Q0FOcEQsTUFBTTtzQkFBdEIsS0FBSzt1QkFBQyxRQUFRO2dCQUNJLFFBQVE7c0JBQTFCLEtBQUs7dUJBQUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJZkV4cGFuZFNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9jb25kaXRpb25hbC9pZi1leHBhbmRlZC5zZXJ2aWNlJztcbmltcG9ydCB7IFJlY3Vyc2l2ZVRyZWVOb2RlTW9kZWwgfSBmcm9tICcuL21vZGVscy9yZWN1cnNpdmUtdHJlZS1ub2RlLm1vZGVsJztcbmltcG9ydCB7IFRyZWVOb2RlTW9kZWwgfSBmcm9tICcuL21vZGVscy90cmVlLW5vZGUubW9kZWwnO1xuaW1wb3J0IHsgQ2xyUmVjdXJzaXZlRm9yT2ZDb250ZXh0IH0gZnJvbSAnLi9yZWN1cnNpdmUtZm9yLW9mJztcbmltcG9ydCB7IFRyZWVGZWF0dXJlc1NlcnZpY2UgfSBmcm9tICcuL3RyZWUtZmVhdHVyZXMuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1yZWN1cnNpdmUtY2hpbGRyZW4nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJzaG91bGRSZW5kZXIoKVwiPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgY2hpbGQgb2YgcGFyZW50Py5jaGlsZHJlbiB8fCBjaGlsZHJlblwiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZmVhdHVyZXNTZXJ2aWNlLnJlY3Vyc2lvbi50ZW1wbGF0ZTsgY29udGV4dDogZ2V0Q29udGV4dChjaGlsZClcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwvbmctY29udGFpbmVyPlxuICBgLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLnJvbGVdJzogJ3JvbGUnLCAvLyBTYWZhcmkgKyBWTyBuZWVkcyBkaXJlY3QgcmVsYXRpb25zaGlwIGJldHdlZW4gdHJlZWl0ZW0gYW5kIGdyb3VwOyBubyBlbGVtZW50IHNob3VsZCBleGlzdCBiZXR3ZWVuIHRoZW1cbiAgfSxcbn0pXG4vKipcbiAqIEludGVybmFsIGNvbXBvbmVudCwgZG8gbm90IGV4cG9ydCFcbiAqIFRoaXMgaXMgcGFydCBvZiB0aGUgaGFjayB0byBnZXQgYXJvdW5kIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE1OTk4XG4gKi9cbmV4cG9ydCBjbGFzcyBSZWN1cnNpdmVDaGlsZHJlbjxUPiB7XG4gIC8vIE9mZmVyaW5nIHRoZSBvcHRpb24gdG8gZWl0aGVyIGdpdmUgdGhlIHBhcmVudCBub2RlIHRvIHJlY3Vyc2UgcG90ZW50aWFsbHkgbGF6aWx5LFxuICAvLyBvciBkaXJlY3RseSB0aGUgbGlzdCBvZiBjaGlsZHJlbiB0byBkaXNwbGF5LlxuICBASW5wdXQoJ3BhcmVudCcpIHBhcmVudDogVHJlZU5vZGVNb2RlbDxUPjtcbiAgQElucHV0KCdjaGlsZHJlbicpIGNoaWxkcmVuOiBUcmVlTm9kZU1vZGVsPFQ+W107XG5cbiAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHJvbGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZmVhdHVyZXNTZXJ2aWNlOiBUcmVlRmVhdHVyZXNTZXJ2aWNlPFQ+LCBAT3B0aW9uYWwoKSBwcml2YXRlIGV4cGFuZFNlcnZpY2U6IElmRXhwYW5kU2VydmljZSkge1xuICAgIGlmIChleHBhbmRTZXJ2aWNlKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IGV4cGFuZFNlcnZpY2UuZXhwYW5kQ2hhbmdlLnN1YnNjcmliZSh2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghdmFsdWUgJiYgdGhpcy5wYXJlbnQgJiYgIWZlYXR1cmVzU2VydmljZS5lYWdlciAmJiBmZWF0dXJlc1NlcnZpY2UucmVjdXJzaW9uKSB7XG4gICAgICAgICAgLy8gSW4gdGhlIGNhc2Ugb2YgbGF6eS1sb2FkaW5nIHJlY3Vyc2l2ZSB0cmVlcywgd2UgY2xlYXIgdGhlIGNoaWxkcmVuIG9uIGNvbGxhcHNlLlxuICAgICAgICAgIC8vIFRoaXMgaXMgYmV0dGVyIGluIGNhc2UgdGhleSBjaGFuZ2UgYmV0d2VlbiB0d28gdXNlciBpbnRlcmFjdGlvbiwgYW5kIHRoYXQgd2F5XG4gICAgICAgICAgLy8gdGhlIGFwcCBpdHNlbGYgY2FuIGRlY2lkZSB3aGV0aGVyIHRvIGNhY2hlIHRoZW0gb3Igbm90LlxuICAgICAgICAgICh0aGlzLnBhcmVudCBhcyBSZWN1cnNpdmVUcmVlTm9kZU1vZGVsPFQ+KS5jbGVhckNoaWxkcmVuKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLnNldEFyaWFSb2xlcygpO1xuICB9XG5cbiAgc2hvdWxkUmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmZlYXR1cmVzU2VydmljZS5yZWN1cnNpb24gJiZcbiAgICAgIC8vIEluIHRoZSBzbWFydCBjYXNlLCB3ZSBlYWdlcmx5IHJlbmRlciBhbGwgdGhlIHJlY3Vyc2l2ZSBjaGlsZHJlblxuICAgICAgLy8gdG8gbWFrZSBzdXJlIHR3by13YXkgYmluZGluZ3MgZm9yIHNlbGVjdGlvbiBhcmUgYXZhaWxhYmxlLlxuICAgICAgLy8gVGhleSB3aWxsIGJlIGhpZGRlbiB3aXRoIENTUyBieSB0aGUgcGFyZW50LlxuICAgICAgKHRoaXMuZmVhdHVyZXNTZXJ2aWNlLmVhZ2VyIHx8ICF0aGlzLmV4cGFuZFNlcnZpY2UgfHwgdGhpcy5leHBhbmRTZXJ2aWNlLmV4cGFuZGVkKVxuICAgICk7XG4gIH1cblxuICBnZXRDb250ZXh0KG5vZGU6IFRyZWVOb2RlTW9kZWw8VD4pOiBDbHJSZWN1cnNpdmVGb3JPZkNvbnRleHQ8VD4ge1xuICAgIHJldHVybiB7XG4gICAgICAkaW1wbGljaXQ6IG5vZGUubW9kZWwsXG4gICAgICBjbHJNb2RlbDogbm9kZSxcbiAgICB9O1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0QXJpYVJvbGVzKCkge1xuICAgIHRoaXMucm9sZSA9IHRoaXMucGFyZW50ID8gJ2dyb3VwJyA6IG51bGw7XG4gIH1cbn1cbiJdfQ==