/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/global-expandable-rows";
/*
 * I don't think this deserves to be in IfExpanded itself,
 * so I'm adding a second directive on the same selector for now just for the datagrid
 */
export class DatagridDetailRegisterer {
    constructor(expandableRowsCount) {
        this.expandableRowsCount = expandableRowsCount;
        if (expandableRowsCount) {
            expandableRowsCount.register();
        }
    }
    ngOnDestroy() {
        if (this.expandableRowsCount) {
            this.expandableRowsCount.unregister();
        }
    }
}
DatagridDetailRegisterer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridDetailRegisterer, deps: [{ token: i1.ExpandableRowsCount, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
DatagridDetailRegisterer.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: DatagridDetailRegisterer, selector: "[clrIfExpanded]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridDetailRegisterer, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfExpanded]',
                }]
        }], ctorParameters: function () { return [{ type: i1.ExpandableRowsCount, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtZGV0YWlsLXJlZ2lzdGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLWRldGFpbC1yZWdpc3RlcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQUlwRDs7O0dBR0c7QUFJSCxNQUFNLE9BQU8sd0JBQXdCO0lBQ25DLFlBQWdDLG1CQUF3QztRQUF4Qyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3RFLElBQUksbUJBQW1CLEVBQUU7WUFDdkIsbUJBQW1CLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDaEM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUN2QztJQUNILENBQUM7O3FIQVhVLHdCQUF3Qjt5R0FBeEIsd0JBQXdCOzJGQUF4Qix3QkFBd0I7a0JBSHBDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtpQkFDNUI7OzBCQUVjLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRXhwYW5kYWJsZVJvd3NDb3VudCB9IGZyb20gJy4vcHJvdmlkZXJzL2dsb2JhbC1leHBhbmRhYmxlLXJvd3MnO1xuXG4vKlxuICogSSBkb24ndCB0aGluayB0aGlzIGRlc2VydmVzIHRvIGJlIGluIElmRXhwYW5kZWQgaXRzZWxmLFxuICogc28gSSdtIGFkZGluZyBhIHNlY29uZCBkaXJlY3RpdmUgb24gdGhlIHNhbWUgc2VsZWN0b3IgZm9yIG5vdyBqdXN0IGZvciB0aGUgZGF0YWdyaWRcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NscklmRXhwYW5kZWRdJyxcbn0pXG5leHBvcnQgY2xhc3MgRGF0YWdyaWREZXRhaWxSZWdpc3RlcmVyIHtcbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgcHJpdmF0ZSBleHBhbmRhYmxlUm93c0NvdW50OiBFeHBhbmRhYmxlUm93c0NvdW50KSB7XG4gICAgaWYgKGV4cGFuZGFibGVSb3dzQ291bnQpIHtcbiAgICAgIGV4cGFuZGFibGVSb3dzQ291bnQucmVnaXN0ZXIoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5leHBhbmRhYmxlUm93c0NvdW50KSB7XG4gICAgICB0aGlzLmV4cGFuZGFibGVSb3dzQ291bnQudW5yZWdpc3RlcigpO1xuICAgIH1cbiAgfVxufVxuIl19