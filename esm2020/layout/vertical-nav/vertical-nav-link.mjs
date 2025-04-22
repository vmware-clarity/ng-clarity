/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Inject, Optional } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VerticalNavGroupService } from './providers/vertical-nav-group.service';
import * as i0 from "@angular/core";
import * as i1 from "./providers/vertical-nav-group.service";
export class ClrVerticalNavLink {
    constructor(host, ref, navGroupService) {
        this.destroy$ = new Subject();
        // Note: since the `VerticalNavGroupService` is an optional provider, we'll setup the event
        // listener only when the `[clrVerticalLink]` is located within the `clr-vertical-nav-group`.
        navGroupService &&
            fromEvent(host.nativeElement, 'click')
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                navGroupService.expand();
                ref.markForCheck();
            });
    }
    ngOnDestroy() {
        this.destroy$.next();
    }
}
ClrVerticalNavLink.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrVerticalNavLink, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: VerticalNavGroupService, optional: true }], target: i0.ɵɵFactoryTarget.Component });
ClrVerticalNavLink.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrVerticalNavLink, selector: "[clrVerticalNavLink]", host: { classAttribute: "nav-link" }, ngImport: i0, template: `
    <ng-content select="[clrVerticalNavIcon]"></ng-content>
    <span class="nav-text">
      <ng-content></ng-content>
    </span>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrVerticalNavLink, decorators: [{
            type: Component,
            args: [{
                    selector: '[clrVerticalNavLink]',
                    template: `
    <ng-content select="[clrVerticalNavIcon]"></ng-content>
    <span class="nav-text">
      <ng-content></ng-content>
    </span>
  `,
                    host: {
                        class: 'nav-link',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.VerticalNavGroupService, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [VerticalNavGroupService]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVydGljYWwtbmF2LWxpbmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9sYXlvdXQvdmVydGljYWwtbmF2L3ZlcnRpY2FsLW5hdi1saW5rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFxQixTQUFTLEVBQWMsTUFBTSxFQUFhLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sd0NBQXdDLENBQUM7OztBQWNqRixNQUFNLE9BQU8sa0JBQWtCO0lBRzdCLFlBQ0UsSUFBNkIsRUFDN0IsR0FBc0IsRUFDdUIsZUFBK0M7UUFMdEYsYUFBUSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFPckMsMkZBQTJGO1FBQzNGLDZGQUE2RjtRQUM3RixlQUFlO1lBQ2IsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO2lCQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDOUIsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDZCxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3pCLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztJQUNULENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDOzsrR0FyQlUsa0JBQWtCLDZFQU1QLHVCQUF1QjttR0FObEMsa0JBQWtCLGtHQVZuQjs7Ozs7R0FLVDsyRkFLVSxrQkFBa0I7a0JBWjlCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsUUFBUSxFQUFFOzs7OztHQUtUO29CQUNELElBQUksRUFBRTt3QkFDSixLQUFLLEVBQUUsVUFBVTtxQkFDbEI7aUJBQ0Y7OzBCQU9JLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbmplY3QsIE9uRGVzdHJveSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZyb21FdmVudCwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBWZXJ0aWNhbE5hdkdyb3VwU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3ZlcnRpY2FsLW5hdi1ncm91cC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW2NsclZlcnRpY2FsTmF2TGlua10nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIltjbHJWZXJ0aWNhbE5hdkljb25dXCI+PC9uZy1jb250ZW50PlxuICAgIDxzcGFuIGNsYXNzPVwibmF2LXRleHRcIj5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L3NwYW4+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ25hdi1saW5rJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyVmVydGljYWxOYXZMaW5rIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaG9zdDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFZlcnRpY2FsTmF2R3JvdXBTZXJ2aWNlKSBuYXZHcm91cFNlcnZpY2U6IFZlcnRpY2FsTmF2R3JvdXBTZXJ2aWNlIHwgbnVsbFxuICApIHtcbiAgICAvLyBOb3RlOiBzaW5jZSB0aGUgYFZlcnRpY2FsTmF2R3JvdXBTZXJ2aWNlYCBpcyBhbiBvcHRpb25hbCBwcm92aWRlciwgd2UnbGwgc2V0dXAgdGhlIGV2ZW50XG4gICAgLy8gbGlzdGVuZXIgb25seSB3aGVuIHRoZSBgW2NsclZlcnRpY2FsTGlua11gIGlzIGxvY2F0ZWQgd2l0aGluIHRoZSBgY2xyLXZlcnRpY2FsLW5hdi1ncm91cGAuXG4gICAgbmF2R3JvdXBTZXJ2aWNlICYmXG4gICAgICBmcm9tRXZlbnQoaG9zdC5uYXRpdmVFbGVtZW50LCAnY2xpY2snKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIG5hdkdyb3VwU2VydmljZS5leHBhbmQoKTtcbiAgICAgICAgICByZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gIH1cbn1cbiJdfQ==