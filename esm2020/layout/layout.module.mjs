/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { NgModule } from '@angular/core';
import { ClrBreadcrumbsModule } from './breadcrumbs';
import { ClrMainContainerModule } from './main-container/main-container.module';
import { ClrNavigationModule } from './nav/navigation.module';
import { ClrTabsModule } from './tabs/tabs.module';
import { ClrVerticalNavModule } from './vertical-nav/vertical-nav.module';
import * as i0 from "@angular/core";
export class ClrLayoutModule {
}
ClrLayoutModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrLayoutModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrLayoutModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrLayoutModule, exports: [ClrMainContainerModule, ClrNavigationModule, ClrTabsModule, ClrVerticalNavModule, ClrBreadcrumbsModule] });
ClrLayoutModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrLayoutModule, imports: [ClrMainContainerModule, ClrNavigationModule, ClrTabsModule, ClrVerticalNavModule, ClrBreadcrumbsModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrLayoutModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [ClrMainContainerModule, ClrNavigationModule, ClrTabsModule, ClrVerticalNavModule, ClrBreadcrumbsModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2xheW91dC9sYXlvdXQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDaEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDOztBQUsxRSxNQUFNLE9BQU8sZUFBZTs7NEdBQWYsZUFBZTs2R0FBZixlQUFlLFlBRmhCLHNCQUFzQixFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBRSxvQkFBb0IsRUFBRSxvQkFBb0I7NkdBRXJHLGVBQWUsWUFGaEIsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixFQUFFLG9CQUFvQjsyRkFFckcsZUFBZTtrQkFIM0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxhQUFhLEVBQUUsb0JBQW9CLEVBQUUsb0JBQW9CLENBQUM7aUJBQ2xIIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJCcmVhZGNydW1ic01vZHVsZSB9IGZyb20gJy4vYnJlYWRjcnVtYnMnO1xuaW1wb3J0IHsgQ2xyTWFpbkNvbnRhaW5lck1vZHVsZSB9IGZyb20gJy4vbWFpbi1jb250YWluZXIvbWFpbi1jb250YWluZXIubW9kdWxlJztcbmltcG9ydCB7IENsck5hdmlnYXRpb25Nb2R1bGUgfSBmcm9tICcuL25hdi9uYXZpZ2F0aW9uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJUYWJzTW9kdWxlIH0gZnJvbSAnLi90YWJzL3RhYnMubW9kdWxlJztcbmltcG9ydCB7IENsclZlcnRpY2FsTmF2TW9kdWxlIH0gZnJvbSAnLi92ZXJ0aWNhbC1uYXYvdmVydGljYWwtbmF2Lm1vZHVsZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGV4cG9ydHM6IFtDbHJNYWluQ29udGFpbmVyTW9kdWxlLCBDbHJOYXZpZ2F0aW9uTW9kdWxlLCBDbHJUYWJzTW9kdWxlLCBDbHJWZXJ0aWNhbE5hdk1vZHVsZSwgQ2xyQnJlYWRjcnVtYnNNb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJMYXlvdXRNb2R1bGUge31cbiJdfQ==