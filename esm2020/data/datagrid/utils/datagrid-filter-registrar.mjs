/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive } from '@angular/core';
import { RegisteredFilter } from '../providers/filters';
import * as i0 from "@angular/core";
import * as i1 from "../providers/filters";
export class DatagridFilterRegistrar {
    constructor(filters) {
        this.filters = filters;
    }
    get filter() {
        return this.registered && this.registered.filter;
    }
    ngOnDestroy() {
        this.deleteFilter();
    }
    setFilter(filter) {
        // If we previously had another filter, we unregister it
        this.deleteFilter();
        if (filter instanceof RegisteredFilter) {
            this.registered = filter;
        }
        else if (filter) {
            this.registered = this.filters.add(filter);
        }
    }
    deleteFilter() {
        if (this.registered) {
            this.registered.unregister();
            delete this.registered;
        }
    }
}
DatagridFilterRegistrar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridFilterRegistrar, deps: [{ token: i1.FiltersProvider }], target: i0.ɵɵFactoryTarget.Directive });
DatagridFilterRegistrar.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: DatagridFilterRegistrar, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridFilterRegistrar, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.FiltersProvider }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtZmlsdGVyLXJlZ2lzdHJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvdXRpbHMvZGF0YWdyaWQtZmlsdGVyLXJlZ2lzdHJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFHckQsT0FBTyxFQUFtQixnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7QUFHekUsTUFBTSxPQUFnQix1QkFBdUI7SUFNM0MsWUFBb0IsT0FBMkI7UUFBM0IsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7SUFBRyxDQUFDO0lBRW5ELElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUNuRCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsU0FBUyxDQUFDLE1BQWtDO1FBQzFDLHdEQUF3RDtRQUN4RCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsSUFBSSxNQUFNLFlBQVksZ0JBQWdCLEVBQUU7WUFDdEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7U0FDMUI7YUFBTSxJQUFJLE1BQU0sRUFBRTtZQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVDO0lBQ0gsQ0FBQztJQUVELFlBQVk7UUFDVixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUM3QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDeEI7SUFDSCxDQUFDOztvSEEvQm1CLHVCQUF1Qjt3R0FBdkIsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBRDVDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckRhdGFncmlkRmlsdGVySW50ZXJmYWNlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9maWx0ZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7IEZpbHRlcnNQcm92aWRlciwgUmVnaXN0ZXJlZEZpbHRlciB9IGZyb20gJy4uL3Byb3ZpZGVycy9maWx0ZXJzJztcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRGF0YWdyaWRGaWx0ZXJSZWdpc3RyYXI8VCwgRiBleHRlbmRzIENsckRhdGFncmlkRmlsdGVySW50ZXJmYWNlPFQ+PiBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBATk9URWUgVHlwZSBgYW55YCBpcyBzZXQgaGVyZSB0byBiZSBhYmxlIHRvIHBhc3MgdGVtcGxhdGVTdHJpY3RNb2RlXG4gICAqL1xuICByZWdpc3RlcmVkOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBmaWx0ZXJzOiBGaWx0ZXJzUHJvdmlkZXI8VD4pIHt9XG5cbiAgZ2V0IGZpbHRlcigpOiBGIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RlcmVkICYmIHRoaXMucmVnaXN0ZXJlZC5maWx0ZXI7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlbGV0ZUZpbHRlcigpO1xuICB9XG5cbiAgc2V0RmlsdGVyKGZpbHRlcjogRiB8IFJlZ2lzdGVyZWRGaWx0ZXI8VCwgRj4pIHtcbiAgICAvLyBJZiB3ZSBwcmV2aW91c2x5IGhhZCBhbm90aGVyIGZpbHRlciwgd2UgdW5yZWdpc3RlciBpdFxuICAgIHRoaXMuZGVsZXRlRmlsdGVyKCk7XG4gICAgaWYgKGZpbHRlciBpbnN0YW5jZW9mIFJlZ2lzdGVyZWRGaWx0ZXIpIHtcbiAgICAgIHRoaXMucmVnaXN0ZXJlZCA9IGZpbHRlcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlcikge1xuICAgICAgdGhpcy5yZWdpc3RlcmVkID0gdGhpcy5maWx0ZXJzLmFkZChmaWx0ZXIpO1xuICAgIH1cbiAgfVxuXG4gIGRlbGV0ZUZpbHRlcigpIHtcbiAgICBpZiAodGhpcy5yZWdpc3RlcmVkKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyZWQudW5yZWdpc3RlcigpO1xuICAgICAgZGVsZXRlIHRoaXMucmVnaXN0ZXJlZDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==