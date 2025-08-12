/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrKeyFocus } from './key-focus';
import { ClrKeyFocusItem } from './key-focus-item';
import { ClrRovingTabindex } from './roving-tabindex';
import * as i0 from "@angular/core";
const KEY_FOCUS_DIRECTIVES = [ClrKeyFocus, ClrRovingTabindex, ClrKeyFocusItem];
export class ClrKeyFocusModule {
}
ClrKeyFocusModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrKeyFocusModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrKeyFocusModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrKeyFocusModule, declarations: [ClrKeyFocus, ClrRovingTabindex, ClrKeyFocusItem], imports: [CommonModule], exports: [ClrKeyFocus, ClrRovingTabindex, ClrKeyFocusItem] });
ClrKeyFocusModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrKeyFocusModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrKeyFocusModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [KEY_FOCUS_DIRECTIVES],
                    exports: [KEY_FOCUS_DIRECTIVES],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LWZvY3VzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL2ZvY3VzL2tleS1mb2N1cy9rZXktZm9jdXMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFFL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMxQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7O0FBRXRELE1BQU0sb0JBQW9CLEdBQWdCLENBQUMsV0FBVyxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBTzVGLE1BQU0sT0FBTyxpQkFBaUI7OzhHQUFqQixpQkFBaUI7K0dBQWpCLGlCQUFpQixpQkFQYSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxhQUc5RSxZQUFZLGFBSG1CLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxlQUFlOytHQU83RSxpQkFBaUIsWUFKbEIsWUFBWTsyRkFJWCxpQkFBaUI7a0JBTDdCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixZQUFZLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDcEMsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUM7aUJBQ2hDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUsIFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyS2V5Rm9jdXMgfSBmcm9tICcuL2tleS1mb2N1cyc7XG5pbXBvcnQgeyBDbHJLZXlGb2N1c0l0ZW0gfSBmcm9tICcuL2tleS1mb2N1cy1pdGVtJztcbmltcG9ydCB7IENsclJvdmluZ1RhYmluZGV4IH0gZnJvbSAnLi9yb3ZpbmctdGFiaW5kZXgnO1xuXG5jb25zdCBLRVlfRk9DVVNfRElSRUNUSVZFUzogVHlwZTxhbnk+W10gPSBbQ2xyS2V5Rm9jdXMsIENsclJvdmluZ1RhYmluZGV4LCBDbHJLZXlGb2N1c0l0ZW1dO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbS0VZX0ZPQ1VTX0RJUkVDVElWRVNdLFxuICBleHBvcnRzOiBbS0VZX0ZPQ1VTX0RJUkVDVElWRVNdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJLZXlGb2N1c01vZHVsZSB7fVxuIl19