/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { ClrBreadcrumbItem } from './breadcrumb-item';
import { ClrBreadcrumbs } from './breadcrumbs';
import * as i0 from "@angular/core";
export class ClrBreadcrumbsModule {
}
ClrBreadcrumbsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrBreadcrumbsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrBreadcrumbsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrBreadcrumbsModule, declarations: [ClrBreadcrumbs, ClrBreadcrumbItem], imports: [CommonModule, ClrIconModule, ClrHostWrappingModule, RouterModule], exports: [ClrBreadcrumbs] });
ClrBreadcrumbsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrBreadcrumbsModule, imports: [CommonModule, ClrIconModule, ClrHostWrappingModule, RouterModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrBreadcrumbsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ClrBreadcrumbs, ClrBreadcrumbItem],
                    exports: [ClrBreadcrumbs],
                    imports: [CommonModule, ClrIconModule, ClrHostWrappingModule, RouterModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWRjcnVtYnMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvbGF5b3V0L2JyZWFkY3J1bWJzL2JyZWFkY3J1bWJzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDdkYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDdEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFPL0MsTUFBTSxPQUFPLG9CQUFvQjs7aUhBQXBCLG9CQUFvQjtrSEFBcEIsb0JBQW9CLGlCQUpoQixjQUFjLEVBQUUsaUJBQWlCLGFBRXRDLFlBQVksRUFBRSxhQUFhLEVBQUUscUJBQXFCLEVBQUUsWUFBWSxhQURoRSxjQUFjO2tIQUdiLG9CQUFvQixZQUZyQixZQUFZLEVBQUUsYUFBYSxFQUFFLHFCQUFxQixFQUFFLFlBQVk7MkZBRS9ELG9CQUFvQjtrQkFMaEMsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUM7b0JBQ2pELE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztvQkFDekIsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxxQkFBcUIsRUFBRSxZQUFZLENBQUM7aUJBQzVFIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi8uLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENsckhvc3RXcmFwcGluZ01vZHVsZSB9IGZyb20gJy4uLy4uL3V0aWxzL2hvc3Qtd3JhcHBpbmcvaG9zdC13cmFwcGluZy5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyQnJlYWRjcnVtYkl0ZW0gfSBmcm9tICcuL2JyZWFkY3J1bWItaXRlbSc7XG5pbXBvcnQgeyBDbHJCcmVhZGNydW1icyB9IGZyb20gJy4vYnJlYWRjcnVtYnMnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtDbHJCcmVhZGNydW1icywgQ2xyQnJlYWRjcnVtYkl0ZW1dLFxuICBleHBvcnRzOiBbQ2xyQnJlYWRjcnVtYnNdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBDbHJJY29uTW9kdWxlLCBDbHJIb3N0V3JhcHBpbmdNb2R1bGUsIFJvdXRlck1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIENsckJyZWFkY3J1bWJzTW9kdWxlIHt9XG4iXX0=