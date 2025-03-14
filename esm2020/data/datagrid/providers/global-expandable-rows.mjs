/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./detail.service";
export class ExpandableRowsCount {
    constructor(detailService) {
        this.detailService = detailService;
        this.expandableCount = 0;
    }
    /**
     * false means no rows with action
     * check if details are on, and disable rows entirely
     */
    get hasExpandableRow() {
        return !this.detailService.enabled && this.expandableCount > 0;
    }
    register() {
        this.expandableCount++;
    }
    unregister() {
        this.expandableCount--;
    }
}
ExpandableRowsCount.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ExpandableRowsCount, deps: [{ token: i1.DetailService }], target: i0.ɵɵFactoryTarget.Injectable });
ExpandableRowsCount.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ExpandableRowsCount });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ExpandableRowsCount, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.DetailService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLWV4cGFuZGFibGUtcm93cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvcHJvdmlkZXJzL2dsb2JhbC1leHBhbmRhYmxlLXJvd3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFLM0MsTUFBTSxPQUFPLG1CQUFtQjtJQUc5QixZQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUZ4QyxvQkFBZSxHQUFHLENBQUMsQ0FBQztJQUV1QixDQUFDO0lBRXBEOzs7T0FHRztJQUNILElBQUksZ0JBQWdCO1FBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsVUFBVTtRQUNSLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDOztnSEFuQlUsbUJBQW1CO29IQUFuQixtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFEL0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEZXRhaWxTZXJ2aWNlIH0gZnJvbSAnLi9kZXRhaWwuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBFeHBhbmRhYmxlUm93c0NvdW50IHtcbiAgcHJpdmF0ZSBleHBhbmRhYmxlQ291bnQgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGV0YWlsU2VydmljZTogRGV0YWlsU2VydmljZSkge31cblxuICAvKipcbiAgICogZmFsc2UgbWVhbnMgbm8gcm93cyB3aXRoIGFjdGlvblxuICAgKiBjaGVjayBpZiBkZXRhaWxzIGFyZSBvbiwgYW5kIGRpc2FibGUgcm93cyBlbnRpcmVseVxuICAgKi9cbiAgZ2V0IGhhc0V4cGFuZGFibGVSb3coKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmRldGFpbFNlcnZpY2UuZW5hYmxlZCAmJiB0aGlzLmV4cGFuZGFibGVDb3VudCA+IDA7XG4gIH1cblxuICByZWdpc3RlcigpIHtcbiAgICB0aGlzLmV4cGFuZGFibGVDb3VudCsrO1xuICB9XG5cbiAgdW5yZWdpc3RlcigpIHtcbiAgICB0aGlzLmV4cGFuZGFibGVDb3VudC0tO1xuICB9XG59XG4iXX0=