/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive } from '@angular/core';
import { DatagridRowRenderer } from './row-renderer';
import * as i0 from "@angular/core";
import * as i1 from "./row-renderer";
import * as i2 from "../providers/columns.service";
export class DatagridRowDetailRenderer extends DatagridRowRenderer {
    constructor(parentRow, columnsService) {
        super(columnsService);
        this.parentRow = parentRow;
        parentRow.expandableRows.push(this);
    }
    ngOnDestroy() {
        this.parentRow.expandableRows = [];
        super.ngOnDestroy();
    }
}
DatagridRowDetailRenderer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridRowDetailRenderer, deps: [{ token: i1.DatagridRowRenderer }, { token: i2.ColumnsService }], target: i0.ɵɵFactoryTarget.Directive });
DatagridRowDetailRenderer.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: DatagridRowDetailRenderer, selector: "clr-dg-row-detail", usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridRowDetailRenderer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-dg-row-detail',
                }]
        }], ctorParameters: function () { return [{ type: i1.DatagridRowRenderer }, { type: i2.ColumnsService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LWRldGFpbC1yZW5kZXJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvcmVuZGVyL3Jvdy1kZXRhaWwtcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBR3JELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7O0FBS3JELE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxtQkFBbUI7SUFDaEUsWUFBb0IsU0FBOEIsRUFBRSxjQUE4QjtRQUNoRixLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFESixjQUFTLEdBQVQsU0FBUyxDQUFxQjtRQUVoRCxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRVEsV0FBVztRQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDbkMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7O3NIQVRVLHlCQUF5QjswR0FBekIseUJBQXlCOzJGQUF6Qix5QkFBeUI7a0JBSHJDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtpQkFDOUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENvbHVtbnNTZXJ2aWNlIH0gZnJvbSAnLi4vcHJvdmlkZXJzL2NvbHVtbnMuc2VydmljZSc7XG5pbXBvcnQgeyBEYXRhZ3JpZFJvd1JlbmRlcmVyIH0gZnJvbSAnLi9yb3ctcmVuZGVyZXInO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdjbHItZGctcm93LWRldGFpbCcsXG59KVxuZXhwb3J0IGNsYXNzIERhdGFncmlkUm93RGV0YWlsUmVuZGVyZXIgZXh0ZW5kcyBEYXRhZ3JpZFJvd1JlbmRlcmVyIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwYXJlbnRSb3c6IERhdGFncmlkUm93UmVuZGVyZXIsIGNvbHVtbnNTZXJ2aWNlOiBDb2x1bW5zU2VydmljZSkge1xuICAgIHN1cGVyKGNvbHVtbnNTZXJ2aWNlKTtcbiAgICBwYXJlbnRSb3cuZXhwYW5kYWJsZVJvd3MucHVzaCh0aGlzKTtcbiAgfVxuXG4gIG92ZXJyaWRlIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMucGFyZW50Um93LmV4cGFuZGFibGVSb3dzID0gW107XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgfVxufVxuIl19