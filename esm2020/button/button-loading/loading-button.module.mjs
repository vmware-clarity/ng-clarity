/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrLoadingButton } from './loading-button';
import * as i0 from "@angular/core";
export const CLR_LOADING_BUTTON_DIRECTIVES = [ClrLoadingButton];
export class ClrLoadingButtonModule {
}
ClrLoadingButtonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrLoadingButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrLoadingButtonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrLoadingButtonModule, declarations: [ClrLoadingButton], imports: [CommonModule], exports: [ClrLoadingButton] });
ClrLoadingButtonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrLoadingButtonModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrLoadingButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [CLR_LOADING_BUTTON_DIRECTIVES],
                    exports: [CLR_LOADING_BUTTON_DIRECTIVES],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZy1idXR0b24ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvYnV0dG9uL2J1dHRvbi1sb2FkaW5nL2xvYWRpbmctYnV0dG9uLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBRS9DLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDOztBQUVwRCxNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBTzdFLE1BQU0sT0FBTyxzQkFBc0I7O21IQUF0QixzQkFBc0I7b0hBQXRCLHNCQUFzQixpQkFQd0IsZ0JBQWdCLGFBRy9ELFlBQVksYUFIbUMsZ0JBQWdCO29IQU85RCxzQkFBc0IsWUFKdkIsWUFBWTsyRkFJWCxzQkFBc0I7a0JBTGxDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixZQUFZLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQztvQkFDN0MsT0FBTyxFQUFFLENBQUMsNkJBQTZCLENBQUM7aUJBQ3pDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUsIFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyTG9hZGluZ0J1dHRvbiB9IGZyb20gJy4vbG9hZGluZy1idXR0b24nO1xuXG5leHBvcnQgY29uc3QgQ0xSX0xPQURJTkdfQlVUVE9OX0RJUkVDVElWRVM6IFR5cGU8YW55PltdID0gW0NsckxvYWRpbmdCdXR0b25dO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbQ0xSX0xPQURJTkdfQlVUVE9OX0RJUkVDVElWRVNdLFxuICBleHBvcnRzOiBbQ0xSX0xPQURJTkdfQlVUVE9OX0RJUkVDVElWRVNdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJMb2FkaW5nQnV0dG9uTW9kdWxlIHt9XG4iXX0=