/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * @description
 * Internal datagrid service that holds a reference to the clr-dg-table element and exposes a method to get height.
 */
export class TableSizeService {
    constructor(platformId) {
        this.platformId = platformId;
    }
    get tableRef() {
        return this._tableRef;
    }
    set tableRef(element) {
        this._tableRef = element;
    }
    set table(table) {
        if (isPlatformBrowser(this.platformId) && table.nativeElement) {
            this.tableRef = table.nativeElement.querySelector('.datagrid-table');
        }
    }
    // Used when resizing columns to show the column border being dragged.
    getColumnDragHeight() {
        if (!this.tableRef) {
            return null;
        }
        return `${this.tableRef.clientHeight}px`;
    }
}
TableSizeService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TableSizeService, deps: [{ token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
TableSizeService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TableSizeService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TableSizeService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtc2l6ZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9wcm92aWRlcnMvdGFibGUtc2l6ZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFjLE1BQU0sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUU1RTs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sZ0JBQWdCO0lBRzNCLFlBQXlDLFVBQWU7UUFBZixlQUFVLEdBQVYsVUFBVSxDQUFLO0lBQUcsQ0FBQztJQUU1RCxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLE9BQW9CO1FBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJLEtBQUssQ0FBQyxLQUE4QjtRQUN0QyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFO1lBQzdELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUN0RTtJQUNILENBQUM7SUFFRCxzRUFBc0U7SUFDdEUsbUJBQW1CO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLElBQUksQ0FBQztJQUMzQyxDQUFDOzs2R0F4QlUsZ0JBQWdCLGtCQUdQLFdBQVc7aUhBSHBCLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQUQ1QixVQUFVOzswQkFJSSxNQUFNOzJCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEVsZW1lbnRSZWYsIEluamVjdCwgSW5qZWN0YWJsZSwgUExBVEZPUk1fSUQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEludGVybmFsIGRhdGFncmlkIHNlcnZpY2UgdGhhdCBob2xkcyBhIHJlZmVyZW5jZSB0byB0aGUgY2xyLWRnLXRhYmxlIGVsZW1lbnQgYW5kIGV4cG9zZXMgYSBtZXRob2QgdG8gZ2V0IGhlaWdodC5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRhYmxlU2l6ZVNlcnZpY2Uge1xuICBwcml2YXRlIF90YWJsZVJlZjogSFRNTEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnkpIHt9XG5cbiAgZ2V0IHRhYmxlUmVmKCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fdGFibGVSZWY7XG4gIH1cbiAgc2V0IHRhYmxlUmVmKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5fdGFibGVSZWYgPSBlbGVtZW50O1xuICB9XG5cbiAgc2V0IHRhYmxlKHRhYmxlOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpICYmIHRhYmxlLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMudGFibGVSZWYgPSB0YWJsZS5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXRhZ3JpZC10YWJsZScpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFVzZWQgd2hlbiByZXNpemluZyBjb2x1bW5zIHRvIHNob3cgdGhlIGNvbHVtbiBib3JkZXIgYmVpbmcgZHJhZ2dlZC5cbiAgZ2V0Q29sdW1uRHJhZ0hlaWdodCgpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy50YWJsZVJlZikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBgJHt0aGlzLnRhYmxlUmVmLmNsaWVudEhlaWdodH1weGA7XG4gIH1cbn1cbiJdfQ==