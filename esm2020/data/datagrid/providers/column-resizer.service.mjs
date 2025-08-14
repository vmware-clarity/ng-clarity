/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../utils/dom-adapter/dom-adapter";
import * as i2 from "../render/render-organizer";
const MIN_COLUMN_WIDTH = 96;
// This service allows DatagridHeaderRenderer and ClrDatagridColumnSeparator
// to share column resize data with each other.
export class ColumnResizerService {
    constructor(el, domAdapter, organizer) {
        this.el = el;
        this.domAdapter = domAdapter;
        this.organizer = organizer;
        this._resizedBy = 0;
    }
    get resizedBy() {
        return this._resizedBy;
    }
    get minColumnWidth() {
        return this.domAdapter.minWidth(this.el.nativeElement) || MIN_COLUMN_WIDTH;
    }
    get maxResizeRange() {
        return this.widthBeforeResize - this.minColumnWidth;
    }
    get widthAfterResize() {
        return this.widthBeforeResize + this._resizedBy;
    }
    startResize() {
        this._resizedBy = 0;
        this.isWithinMaxResizeRange = true;
        this.widthBeforeResize = this.domAdapter.clientRect(this.el.nativeElement).width;
    }
    endResize() {
        this.organizer.resize();
    }
    calculateResize(resizedBy) {
        // calculates the resize amount within the allowed range
        if (resizedBy < -this.maxResizeRange) {
            this._resizedBy = -this.maxResizeRange;
            this.isWithinMaxResizeRange = false;
        }
        else {
            this._resizedBy = resizedBy;
            this.isWithinMaxResizeRange = true;
        }
    }
}
ColumnResizerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ColumnResizerService, deps: [{ token: i0.ElementRef }, { token: i1.DomAdapter }, { token: i2.DatagridRenderOrganizer }], target: i0.ɵɵFactoryTarget.Injectable });
ColumnResizerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ColumnResizerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ColumnResizerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.DomAdapter }, { type: i2.DatagridRenderOrganizer }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXJlc2l6ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvcHJvdmlkZXJzL2NvbHVtbi1yZXNpemVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQWMsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBS3ZELE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBRTVCLDRFQUE0RTtBQUM1RSwrQ0FBK0M7QUFHL0MsTUFBTSxPQUFPLG9CQUFvQjtJQU8vQixZQUNVLEVBQTJCLEVBQzNCLFVBQXNCLEVBQ3RCLFNBQWtDO1FBRmxDLE9BQUUsR0FBRixFQUFFLENBQXlCO1FBQzNCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsY0FBUyxHQUFULFNBQVMsQ0FBeUI7UUFMcEMsZUFBVSxHQUFHLENBQUMsQ0FBQztJQU1wQixDQUFDO0lBRUosSUFBSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLGdCQUFnQixDQUFDO0lBQzdFLENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsSUFBSSxnQkFBZ0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUNsRCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUM7UUFDbkMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ25GLENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsZUFBZSxDQUFDLFNBQWlCO1FBQy9CLHdEQUF3RDtRQUN4RCxJQUFJLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7WUFDdkMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQztTQUNyQzthQUFNO1lBQ0wsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7WUFDNUIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztTQUNwQztJQUNILENBQUM7O2lIQWhEVSxvQkFBb0I7cUhBQXBCLG9CQUFvQjsyRkFBcEIsb0JBQW9CO2tCQURoQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBFbGVtZW50UmVmLCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IERvbUFkYXB0ZXIgfSBmcm9tICcuLi8uLi8uLi91dGlscy9kb20tYWRhcHRlci9kb20tYWRhcHRlcic7XG5pbXBvcnQgeyBEYXRhZ3JpZFJlbmRlck9yZ2FuaXplciB9IGZyb20gJy4uL3JlbmRlci9yZW5kZXItb3JnYW5pemVyJztcblxuY29uc3QgTUlOX0NPTFVNTl9XSURUSCA9IDk2O1xuXG4vLyBUaGlzIHNlcnZpY2UgYWxsb3dzIERhdGFncmlkSGVhZGVyUmVuZGVyZXIgYW5kIENsckRhdGFncmlkQ29sdW1uU2VwYXJhdG9yXG4vLyB0byBzaGFyZSBjb2x1bW4gcmVzaXplIGRhdGEgd2l0aCBlYWNoIG90aGVyLlxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29sdW1uUmVzaXplclNlcnZpY2Uge1xuICAvLyBpcyBpdCB3aXRoaW4gdGhlIG1heGltdW0gcmVzaXplIHJhbmdlIHRvIHRoZSBsZWZ0XG4gIGlzV2l0aGluTWF4UmVzaXplUmFuZ2U6IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSB3aWR0aEJlZm9yZVJlc2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIF9yZXNpemVkQnkgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgZG9tQWRhcHRlcjogRG9tQWRhcHRlcixcbiAgICBwcml2YXRlIG9yZ2FuaXplcjogRGF0YWdyaWRSZW5kZXJPcmdhbml6ZXJcbiAgKSB7fVxuXG4gIGdldCByZXNpemVkQnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc2l6ZWRCeTtcbiAgfVxuXG4gIGdldCBtaW5Db2x1bW5XaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5kb21BZGFwdGVyLm1pbldpZHRoKHRoaXMuZWwubmF0aXZlRWxlbWVudCkgfHwgTUlOX0NPTFVNTl9XSURUSDtcbiAgfVxuXG4gIGdldCBtYXhSZXNpemVSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy53aWR0aEJlZm9yZVJlc2l6ZSAtIHRoaXMubWluQ29sdW1uV2lkdGg7XG4gIH1cblxuICBnZXQgd2lkdGhBZnRlclJlc2l6ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLndpZHRoQmVmb3JlUmVzaXplICsgdGhpcy5fcmVzaXplZEJ5O1xuICB9XG5cbiAgc3RhcnRSZXNpemUoKTogdm9pZCB7XG4gICAgdGhpcy5fcmVzaXplZEJ5ID0gMDtcbiAgICB0aGlzLmlzV2l0aGluTWF4UmVzaXplUmFuZ2UgPSB0cnVlO1xuICAgIHRoaXMud2lkdGhCZWZvcmVSZXNpemUgPSB0aGlzLmRvbUFkYXB0ZXIuY2xpZW50UmVjdCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpLndpZHRoO1xuICB9XG5cbiAgZW5kUmVzaXplKCk6IHZvaWQge1xuICAgIHRoaXMub3JnYW5pemVyLnJlc2l6ZSgpO1xuICB9XG5cbiAgY2FsY3VsYXRlUmVzaXplKHJlc2l6ZWRCeTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gY2FsY3VsYXRlcyB0aGUgcmVzaXplIGFtb3VudCB3aXRoaW4gdGhlIGFsbG93ZWQgcmFuZ2VcbiAgICBpZiAocmVzaXplZEJ5IDwgLXRoaXMubWF4UmVzaXplUmFuZ2UpIHtcbiAgICAgIHRoaXMuX3Jlc2l6ZWRCeSA9IC10aGlzLm1heFJlc2l6ZVJhbmdlO1xuICAgICAgdGhpcy5pc1dpdGhpbk1heFJlc2l6ZVJhbmdlID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3Jlc2l6ZWRCeSA9IHJlc2l6ZWRCeTtcbiAgICAgIHRoaXMuaXNXaXRoaW5NYXhSZXNpemVSYW5nZSA9IHRydWU7XG4gICAgfVxuICB9XG59XG4iXX0=