/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class RootDropdownService {
    constructor() {
        this._changes = new Subject();
    }
    get changes() {
        return this._changes.asObservable();
    }
    closeMenus() {
        this._changes.next(false);
    }
}
RootDropdownService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: RootDropdownService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
RootDropdownService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: RootDropdownService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: RootDropdownService, decorators: [{
            type: Injectable
        }] });
export function clrRootDropdownFactory(existing) {
    return existing || new RootDropdownService();
}
export const ROOT_DROPDOWN_PROVIDER = {
    provide: RootDropdownService,
    useFactory: clrRootDropdownFactory,
    deps: [[new Optional(), new SkipSelf(), RootDropdownService]],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3BvcG92ZXIvZHJvcGRvd24vcHJvdmlkZXJzL2Ryb3Bkb3duLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFL0QsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFHL0IsTUFBTSxPQUFPLG1CQUFtQjtJQURoQztRQUVVLGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO0tBUzNDO0lBUEMsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQzs7Z0hBVFUsbUJBQW1CO29IQUFuQixtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFEL0IsVUFBVTs7QUFhWCxNQUFNLFVBQVUsc0JBQXNCLENBQUMsUUFBNkI7SUFDbEUsT0FBTyxRQUFRLElBQUksSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0FBQy9DLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRztJQUNwQyxPQUFPLEVBQUUsbUJBQW1CO0lBQzVCLFVBQVUsRUFBRSxzQkFBc0I7SUFDbEMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztDQUM5RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCwgU2tpcFNlbGYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJvb3REcm9wZG93blNlcnZpY2Uge1xuICBwcml2YXRlIF9jaGFuZ2VzID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICBnZXQgY2hhbmdlcygpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5fY2hhbmdlcy5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGNsb3NlTWVudXMoKTogdm9pZCB7XG4gICAgdGhpcy5fY2hhbmdlcy5uZXh0KGZhbHNlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xyUm9vdERyb3Bkb3duRmFjdG9yeShleGlzdGluZzogUm9vdERyb3Bkb3duU2VydmljZSkge1xuICByZXR1cm4gZXhpc3RpbmcgfHwgbmV3IFJvb3REcm9wZG93blNlcnZpY2UoKTtcbn1cblxuZXhwb3J0IGNvbnN0IFJPT1RfRFJPUERPV05fUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IFJvb3REcm9wZG93blNlcnZpY2UsXG4gIHVzZUZhY3Rvcnk6IGNsclJvb3REcm9wZG93bkZhY3RvcnksXG4gIGRlcHM6IFtbbmV3IE9wdGlvbmFsKCksIG5ldyBTa2lwU2VsZigpLCBSb290RHJvcGRvd25TZXJ2aWNlXV0sXG59O1xuIl19