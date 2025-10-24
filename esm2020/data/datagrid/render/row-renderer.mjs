/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ContentChildren, Directive } from '@angular/core';
import { DatagridCellRenderer } from './cell-renderer';
import * as i0 from "@angular/core";
import * as i1 from "../providers/columns.service";
export class DatagridRowRenderer {
    constructor(columnsService) {
        this.columnsService = columnsService;
        this.expandableRows = [];
        this.subscriptions = [];
    }
    ngAfterContentInit() {
        this.setCellsState(); // case #3 and #4
        this.subscriptions.push(this.cells.changes.subscribe(() => {
            this.setCellsState(); // case #2
            // Note on case #2: In the case of dynamic columns, when one column (header/cell together) gets deleted,
            // this.cells.changes emits before this.columnsService.columns gets updated in MainRenderer
            // when this.headers.changes emits as well. So that means there will be n+1 column state providers
            // when this.cells.changes emits. Hence, we should quit earlier there. But this method will be called
            // right after again when this.headers.changes emits. By then, there will be the same number of column state
            // providers as column headers.
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    setCellsState() {
        // This method runs in four cases:
        // 1. When the initial rows appear on the first page.
        //    In this case, the method will be called in DatagridMainRenderer.
        // 2. When columns (corresponding header/cells) get added and deleted.
        //    In this case, the method will be called in DatagridMainRenderer. (Read the note on this case above).
        // 3. When rows load asynchronously.
        //    In this case, the method will be called in this class.
        // 4. When rows load after switching pages.
        //    In this case, the method will be called in this class (Basically, same as the case 3).
        if (this.cells.length === this.columnsService.columns.length) {
            this.cells.forEach((cell, index) => {
                if (this.columnsService.columns[index]) {
                    cell.resetState(this.columnsService.columns[index].value);
                }
            });
        }
    }
}
DatagridRowRenderer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridRowRenderer, deps: [{ token: i1.ColumnsService }], target: i0.ɵɵFactoryTarget.Directive });
DatagridRowRenderer.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: DatagridRowRenderer, selector: "clr-dg-row", queries: [{ propertyName: "cells", predicate: DatagridCellRenderer }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridRowRenderer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-dg-row',
                }]
        }], ctorParameters: function () { return [{ type: i1.ColumnsService }]; }, propDecorators: { cells: [{
                type: ContentChildren,
                args: [DatagridCellRenderer]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9yZW5kZXIvcm93LXJlbmRlcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFvQixlQUFlLEVBQUUsU0FBUyxFQUF3QixNQUFNLGVBQWUsQ0FBQztBQUluRyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBTXZELE1BQU0sT0FBTyxtQkFBbUI7SUFNOUIsWUFBb0IsY0FBOEI7UUFBOUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBSmxELG1CQUFjLEdBQWdDLEVBQUUsQ0FBQztRQUV6QyxrQkFBYSxHQUFtQixFQUFFLENBQUM7SUFFVSxDQUFDO0lBRXRELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxpQkFBaUI7UUFDdkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDaEMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsVUFBVTtZQUNoQyx3R0FBd0c7WUFDeEcsMkZBQTJGO1lBQzNGLGtHQUFrRztZQUNsRyxxR0FBcUc7WUFDckcsNEdBQTRHO1lBQzVHLCtCQUErQjtRQUNqQyxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxhQUFhO1FBQ1gsa0NBQWtDO1FBQ2xDLHFEQUFxRDtRQUNyRCxzRUFBc0U7UUFDdEUsc0VBQXNFO1FBQ3RFLDBHQUEwRztRQUMxRyxvQ0FBb0M7UUFDcEMsNERBQTREO1FBQzVELDJDQUEyQztRQUMzQyw0RkFBNEY7UUFDNUYsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDNUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ2pDLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ3RDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQzNEO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7O2dIQTVDVSxtQkFBbUI7b0dBQW5CLG1CQUFtQix3RUFDYixvQkFBb0I7MkZBRDFCLG1CQUFtQjtrQkFIL0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsWUFBWTtpQkFDdkI7cUdBRXdDLEtBQUs7c0JBQTNDLGVBQWU7dUJBQUMsb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBBZnRlckNvbnRlbnRJbml0LCBDb250ZW50Q2hpbGRyZW4sIERpcmVjdGl2ZSwgT25EZXN0cm95LCBRdWVyeUxpc3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDb2x1bW5zU2VydmljZSB9IGZyb20gJy4uL3Byb3ZpZGVycy9jb2x1bW5zLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGF0YWdyaWRDZWxsUmVuZGVyZXIgfSBmcm9tICcuL2NlbGwtcmVuZGVyZXInO1xuaW1wb3J0IHsgRGF0YWdyaWRSb3dEZXRhaWxSZW5kZXJlciB9IGZyb20gJy4vcm93LWRldGFpbC1yZW5kZXJlcic7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2Nsci1kZy1yb3cnLFxufSlcbmV4cG9ydCBjbGFzcyBEYXRhZ3JpZFJvd1JlbmRlcmVyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgQENvbnRlbnRDaGlsZHJlbihEYXRhZ3JpZENlbGxSZW5kZXJlcikgY2VsbHM6IFF1ZXJ5TGlzdDxEYXRhZ3JpZENlbGxSZW5kZXJlcj47XG4gIGV4cGFuZGFibGVSb3dzOiBEYXRhZ3JpZFJvd0RldGFpbFJlbmRlcmVyW10gPSBbXTtcblxuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb2x1bW5zU2VydmljZTogQ29sdW1uc1NlcnZpY2UpIHt9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuc2V0Q2VsbHNTdGF0ZSgpOyAvLyBjYXNlICMzIGFuZCAjNFxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5jZWxscy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0Q2VsbHNTdGF0ZSgpOyAvLyBjYXNlICMyXG4gICAgICAgIC8vIE5vdGUgb24gY2FzZSAjMjogSW4gdGhlIGNhc2Ugb2YgZHluYW1pYyBjb2x1bW5zLCB3aGVuIG9uZSBjb2x1bW4gKGhlYWRlci9jZWxsIHRvZ2V0aGVyKSBnZXRzIGRlbGV0ZWQsXG4gICAgICAgIC8vIHRoaXMuY2VsbHMuY2hhbmdlcyBlbWl0cyBiZWZvcmUgdGhpcy5jb2x1bW5zU2VydmljZS5jb2x1bW5zIGdldHMgdXBkYXRlZCBpbiBNYWluUmVuZGVyZXJcbiAgICAgICAgLy8gd2hlbiB0aGlzLmhlYWRlcnMuY2hhbmdlcyBlbWl0cyBhcyB3ZWxsLiBTbyB0aGF0IG1lYW5zIHRoZXJlIHdpbGwgYmUgbisxIGNvbHVtbiBzdGF0ZSBwcm92aWRlcnNcbiAgICAgICAgLy8gd2hlbiB0aGlzLmNlbGxzLmNoYW5nZXMgZW1pdHMuIEhlbmNlLCB3ZSBzaG91bGQgcXVpdCBlYXJsaWVyIHRoZXJlLiBCdXQgdGhpcyBtZXRob2Qgd2lsbCBiZSBjYWxsZWRcbiAgICAgICAgLy8gcmlnaHQgYWZ0ZXIgYWdhaW4gd2hlbiB0aGlzLmhlYWRlcnMuY2hhbmdlcyBlbWl0cy4gQnkgdGhlbiwgdGhlcmUgd2lsbCBiZSB0aGUgc2FtZSBudW1iZXIgb2YgY29sdW1uIHN0YXRlXG4gICAgICAgIC8vIHByb3ZpZGVycyBhcyBjb2x1bW4gaGVhZGVycy5cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICBzZXRDZWxsc1N0YXRlKCkge1xuICAgIC8vIFRoaXMgbWV0aG9kIHJ1bnMgaW4gZm91ciBjYXNlczpcbiAgICAvLyAxLiBXaGVuIHRoZSBpbml0aWFsIHJvd3MgYXBwZWFyIG9uIHRoZSBmaXJzdCBwYWdlLlxuICAgIC8vICAgIEluIHRoaXMgY2FzZSwgdGhlIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBpbiBEYXRhZ3JpZE1haW5SZW5kZXJlci5cbiAgICAvLyAyLiBXaGVuIGNvbHVtbnMgKGNvcnJlc3BvbmRpbmcgaGVhZGVyL2NlbGxzKSBnZXQgYWRkZWQgYW5kIGRlbGV0ZWQuXG4gICAgLy8gICAgSW4gdGhpcyBjYXNlLCB0aGUgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIGluIERhdGFncmlkTWFpblJlbmRlcmVyLiAoUmVhZCB0aGUgbm90ZSBvbiB0aGlzIGNhc2UgYWJvdmUpLlxuICAgIC8vIDMuIFdoZW4gcm93cyBsb2FkIGFzeW5jaHJvbm91c2x5LlxuICAgIC8vICAgIEluIHRoaXMgY2FzZSwgdGhlIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBpbiB0aGlzIGNsYXNzLlxuICAgIC8vIDQuIFdoZW4gcm93cyBsb2FkIGFmdGVyIHN3aXRjaGluZyBwYWdlcy5cbiAgICAvLyAgICBJbiB0aGlzIGNhc2UsIHRoZSBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgaW4gdGhpcyBjbGFzcyAoQmFzaWNhbGx5LCBzYW1lIGFzIHRoZSBjYXNlIDMpLlxuICAgIGlmICh0aGlzLmNlbGxzLmxlbmd0aCA9PT0gdGhpcy5jb2x1bW5zU2VydmljZS5jb2x1bW5zLmxlbmd0aCkge1xuICAgICAgdGhpcy5jZWxscy5mb3JFYWNoKChjZWxsLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jb2x1bW5zU2VydmljZS5jb2x1bW5zW2luZGV4XSkge1xuICAgICAgICAgIGNlbGwucmVzZXRTdGF0ZSh0aGlzLmNvbHVtbnNTZXJ2aWNlLmNvbHVtbnNbaW5kZXhdLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=