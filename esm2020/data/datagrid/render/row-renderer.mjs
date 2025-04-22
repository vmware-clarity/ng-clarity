/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ContentChild, ContentChildren, Directive, forwardRef, } from '@angular/core';
import { DatagridCellRenderer } from './cell-renderer';
import * as i0 from "@angular/core";
import * as i1 from "../providers/columns.service";
export class DatagridRowRenderer {
    constructor(columnsService) {
        this.columnsService = columnsService;
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
DatagridRowRenderer.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: DatagridRowRenderer, selector: "clr-dg-row, clr-dg-row-detail", queries: [{ propertyName: "expandableRow", first: true, predicate: i0.forwardRef(function () { return DatagridRowRenderer; }), descendants: true }, { propertyName: "cells", predicate: DatagridCellRenderer }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridRowRenderer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-dg-row, clr-dg-row-detail',
                }]
        }], ctorParameters: function () { return [{ type: i1.ColumnsService }]; }, propDecorators: { cells: [{
                type: ContentChildren,
                args: [DatagridCellRenderer]
            }], expandableRow: [{
                type: ContentChild,
                args: [forwardRef(() => DatagridRowRenderer)]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9yZW5kZXIvcm93LXJlbmRlcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUVMLFlBQVksRUFDWixlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsR0FHWCxNQUFNLGVBQWUsQ0FBQztBQUl2QixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBS3ZELE1BQU0sT0FBTyxtQkFBbUI7SUFNOUIsWUFBb0IsY0FBOEI7UUFBOUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBRjFDLGtCQUFhLEdBQW1CLEVBQUUsQ0FBQztJQUVVLENBQUM7SUFFdEQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQjtRQUN2QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNoQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxVQUFVO1lBQ2hDLHdHQUF3RztZQUN4RywyRkFBMkY7WUFDM0Ysa0dBQWtHO1lBQ2xHLHFHQUFxRztZQUNyRyw0R0FBNEc7WUFDNUcsK0JBQStCO1FBQ2pDLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELGFBQWE7UUFDWCxrQ0FBa0M7UUFDbEMscURBQXFEO1FBQ3JELHNFQUFzRTtRQUN0RSxzRUFBc0U7UUFDdEUsMEdBQTBHO1FBQzFHLG9DQUFvQztRQUNwQyw0REFBNEQ7UUFDNUQsMkNBQTJDO1FBQzNDLDRGQUE0RjtRQUM1RixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUM1RCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDakMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDdEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDM0Q7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQzs7Z0hBNUNVLG1CQUFtQjtvR0FBbkIsbUJBQW1CLG1KQUVDLG1CQUFtQiwrREFEakMsb0JBQW9COzJGQUQxQixtQkFBbUI7a0JBSC9CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLCtCQUErQjtpQkFDMUM7cUdBRXdDLEtBQUs7c0JBQTNDLGVBQWU7dUJBQUMsb0JBQW9CO2dCQUNnQixhQUFhO3NCQUFqRSxZQUFZO3VCQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgZm9yd2FyZFJlZixcbiAgT25EZXN0cm95LFxuICBRdWVyeUxpc3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENvbHVtbnNTZXJ2aWNlIH0gZnJvbSAnLi4vcHJvdmlkZXJzL2NvbHVtbnMuc2VydmljZSc7XG5pbXBvcnQgeyBEYXRhZ3JpZENlbGxSZW5kZXJlciB9IGZyb20gJy4vY2VsbC1yZW5kZXJlcic7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2Nsci1kZy1yb3csIGNsci1kZy1yb3ctZGV0YWlsJyxcbn0pXG5leHBvcnQgY2xhc3MgRGF0YWdyaWRSb3dSZW5kZXJlciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oRGF0YWdyaWRDZWxsUmVuZGVyZXIpIGNlbGxzOiBRdWVyeUxpc3Q8RGF0YWdyaWRDZWxsUmVuZGVyZXI+O1xuICBAQ29udGVudENoaWxkKGZvcndhcmRSZWYoKCkgPT4gRGF0YWdyaWRSb3dSZW5kZXJlcikpIGV4cGFuZGFibGVSb3c6IERhdGFncmlkUm93UmVuZGVyZXI7XG5cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29sdW1uc1NlcnZpY2U6IENvbHVtbnNTZXJ2aWNlKSB7fVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLnNldENlbGxzU3RhdGUoKTsgLy8gY2FzZSAjMyBhbmQgIzRcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMuY2VsbHMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLnNldENlbGxzU3RhdGUoKTsgLy8gY2FzZSAjMlxuICAgICAgICAvLyBOb3RlIG9uIGNhc2UgIzI6IEluIHRoZSBjYXNlIG9mIGR5bmFtaWMgY29sdW1ucywgd2hlbiBvbmUgY29sdW1uIChoZWFkZXIvY2VsbCB0b2dldGhlcikgZ2V0cyBkZWxldGVkLFxuICAgICAgICAvLyB0aGlzLmNlbGxzLmNoYW5nZXMgZW1pdHMgYmVmb3JlIHRoaXMuY29sdW1uc1NlcnZpY2UuY29sdW1ucyBnZXRzIHVwZGF0ZWQgaW4gTWFpblJlbmRlcmVyXG4gICAgICAgIC8vIHdoZW4gdGhpcy5oZWFkZXJzLmNoYW5nZXMgZW1pdHMgYXMgd2VsbC4gU28gdGhhdCBtZWFucyB0aGVyZSB3aWxsIGJlIG4rMSBjb2x1bW4gc3RhdGUgcHJvdmlkZXJzXG4gICAgICAgIC8vIHdoZW4gdGhpcy5jZWxscy5jaGFuZ2VzIGVtaXRzLiBIZW5jZSwgd2Ugc2hvdWxkIHF1aXQgZWFybGllciB0aGVyZS4gQnV0IHRoaXMgbWV0aG9kIHdpbGwgYmUgY2FsbGVkXG4gICAgICAgIC8vIHJpZ2h0IGFmdGVyIGFnYWluIHdoZW4gdGhpcy5oZWFkZXJzLmNoYW5nZXMgZW1pdHMuIEJ5IHRoZW4sIHRoZXJlIHdpbGwgYmUgdGhlIHNhbWUgbnVtYmVyIG9mIGNvbHVtbiBzdGF0ZVxuICAgICAgICAvLyBwcm92aWRlcnMgYXMgY29sdW1uIGhlYWRlcnMuXG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgc2V0Q2VsbHNTdGF0ZSgpIHtcbiAgICAvLyBUaGlzIG1ldGhvZCBydW5zIGluIGZvdXIgY2FzZXM6XG4gICAgLy8gMS4gV2hlbiB0aGUgaW5pdGlhbCByb3dzIGFwcGVhciBvbiB0aGUgZmlyc3QgcGFnZS5cbiAgICAvLyAgICBJbiB0aGlzIGNhc2UsIHRoZSBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgaW4gRGF0YWdyaWRNYWluUmVuZGVyZXIuXG4gICAgLy8gMi4gV2hlbiBjb2x1bW5zIChjb3JyZXNwb25kaW5nIGhlYWRlci9jZWxscykgZ2V0IGFkZGVkIGFuZCBkZWxldGVkLlxuICAgIC8vICAgIEluIHRoaXMgY2FzZSwgdGhlIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBpbiBEYXRhZ3JpZE1haW5SZW5kZXJlci4gKFJlYWQgdGhlIG5vdGUgb24gdGhpcyBjYXNlIGFib3ZlKS5cbiAgICAvLyAzLiBXaGVuIHJvd3MgbG9hZCBhc3luY2hyb25vdXNseS5cbiAgICAvLyAgICBJbiB0aGlzIGNhc2UsIHRoZSBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgaW4gdGhpcyBjbGFzcy5cbiAgICAvLyA0LiBXaGVuIHJvd3MgbG9hZCBhZnRlciBzd2l0Y2hpbmcgcGFnZXMuXG4gICAgLy8gICAgSW4gdGhpcyBjYXNlLCB0aGUgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIGluIHRoaXMgY2xhc3MgKEJhc2ljYWxseSwgc2FtZSBhcyB0aGUgY2FzZSAzKS5cbiAgICBpZiAodGhpcy5jZWxscy5sZW5ndGggPT09IHRoaXMuY29sdW1uc1NlcnZpY2UuY29sdW1ucy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY2VsbHMuZm9yRWFjaCgoY2VsbCwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY29sdW1uc1NlcnZpY2UuY29sdW1uc1tpbmRleF0pIHtcbiAgICAgICAgICBjZWxsLnJlc2V0U3RhdGUodGhpcy5jb2x1bW5zU2VydmljZS5jb2x1bW5zW2luZGV4XS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl19