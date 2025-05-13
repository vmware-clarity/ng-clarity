/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrFocusOnViewInit } from './focus-on-view-init';
import { FOCUS_ON_VIEW_INIT_PROVIDER } from './focus-on-view-init.provider';
import * as i0 from "@angular/core";
export const FOCUS_ON_VIEW_INIT_DIRECTIVES = [ClrFocusOnViewInit];
export class ClrFocusOnViewInitModule {
}
ClrFocusOnViewInitModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFocusOnViewInitModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrFocusOnViewInitModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrFocusOnViewInitModule, declarations: [ClrFocusOnViewInit], imports: [CommonModule], exports: [ClrFocusOnViewInit] });
ClrFocusOnViewInitModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFocusOnViewInitModule, providers: [FOCUS_ON_VIEW_INIT_PROVIDER], imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFocusOnViewInitModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [FOCUS_ON_VIEW_INIT_DIRECTIVES],
                    providers: [FOCUS_ON_VIEW_INIT_PROVIDER],
                    exports: [FOCUS_ON_VIEW_INIT_DIRECTIVES],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9jdXMtb24tdmlldy1pbml0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL2ZvY3VzL2ZvY3VzLW9uLXZpZXctaW5pdC9mb2N1cy1vbi12aWV3LWluaXQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFFL0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDMUQsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sK0JBQStCLENBQUM7O0FBRTVFLE1BQU0sQ0FBQyxNQUFNLDZCQUE2QixHQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFRL0UsTUFBTSxPQUFPLHdCQUF3Qjs7cUhBQXhCLHdCQUF3QjtzSEFBeEIsd0JBQXdCLGlCQVJzQixrQkFBa0IsYUFHakUsWUFBWSxhQUhtQyxrQkFBa0I7c0hBUWhFLHdCQUF3QixhQUh4QixDQUFDLDJCQUEyQixDQUFDLFlBRjlCLFlBQVk7MkZBS1gsd0JBQXdCO2tCQU5wQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsWUFBWSxFQUFFLENBQUMsNkJBQTZCLENBQUM7b0JBQzdDLFNBQVMsRUFBRSxDQUFDLDJCQUEyQixDQUFDO29CQUN4QyxPQUFPLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQztpQkFDekMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSwgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJGb2N1c09uVmlld0luaXQgfSBmcm9tICcuL2ZvY3VzLW9uLXZpZXctaW5pdCc7XG5pbXBvcnQgeyBGT0NVU19PTl9WSUVXX0lOSVRfUFJPVklERVIgfSBmcm9tICcuL2ZvY3VzLW9uLXZpZXctaW5pdC5wcm92aWRlcic7XG5cbmV4cG9ydCBjb25zdCBGT0NVU19PTl9WSUVXX0lOSVRfRElSRUNUSVZFUzogVHlwZTxhbnk+W10gPSBbQ2xyRm9jdXNPblZpZXdJbml0XTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0ZPQ1VTX09OX1ZJRVdfSU5JVF9ESVJFQ1RJVkVTXSxcbiAgcHJvdmlkZXJzOiBbRk9DVVNfT05fVklFV19JTklUX1BST1ZJREVSXSxcbiAgZXhwb3J0czogW0ZPQ1VTX09OX1ZJRVdfSU5JVF9ESVJFQ1RJVkVTXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRm9jdXNPblZpZXdJbml0TW9kdWxlIHt9XG4iXX0=