/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { commonStringsDefault } from '../../utils/i18n/common-strings.default';
import * as i0 from "@angular/core";
export class ClrCommonStringsService {
    constructor() {
        this._strings = commonStringsDefault;
    }
    /**
     * Access to all of the keys as strings
     */
    get keys() {
        return this._strings;
    }
    /**
     * Allows you to pass in new overrides for localization
     */
    localize(overrides) {
        this._strings = { ...this._strings, ...overrides };
    }
    /**
     * Parse a string with a set of tokens to replace
     */
    parse(source, tokens = {}) {
        const names = Object.keys(tokens);
        let output = source;
        if (names.length) {
            names.forEach(name => {
                output = output.replace(`{${name}}`, tokens[name]);
            });
        }
        return output;
    }
}
ClrCommonStringsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCommonStringsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ClrCommonStringsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCommonStringsService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCommonStringsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLXN0cmluZ3Muc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL2kxOG4vY29tbW9uLXN0cmluZ3Muc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUNBQXlDLENBQUM7O0FBTS9FLE1BQU0sT0FBTyx1QkFBdUI7SUFIcEM7UUFJVSxhQUFRLEdBQUcsb0JBQW9CLENBQUM7S0E2QnpDO0lBM0JDOztPQUVHO0lBQ0gsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7T0FFRztJQUNILFFBQVEsQ0FBQyxTQUFvQztRQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsU0FBUyxFQUFFLENBQUM7SUFDckQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLE1BQWMsRUFBRSxTQUFvQyxFQUFFO1FBQzFELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3BCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNoQixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNuQixNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDOztvSEE3QlUsdUJBQXVCO3dIQUF2Qix1QkFBdUIsY0FGdEIsTUFBTTsyRkFFUCx1QkFBdUI7a0JBSG5DLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGNvbW1vblN0cmluZ3NEZWZhdWx0IH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5kZWZhdWx0JztcbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3MgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLmludGVyZmFjZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB7XG4gIHByaXZhdGUgX3N0cmluZ3MgPSBjb21tb25TdHJpbmdzRGVmYXVsdDtcblxuICAvKipcbiAgICogQWNjZXNzIHRvIGFsbCBvZiB0aGUga2V5cyBhcyBzdHJpbmdzXG4gICAqL1xuICBnZXQga2V5cygpOiBSZWFkb25seTxDbHJDb21tb25TdHJpbmdzPiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0cmluZ3M7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIHlvdSB0byBwYXNzIGluIG5ldyBvdmVycmlkZXMgZm9yIGxvY2FsaXphdGlvblxuICAgKi9cbiAgbG9jYWxpemUob3ZlcnJpZGVzOiBQYXJ0aWFsPENsckNvbW1vblN0cmluZ3M+KSB7XG4gICAgdGhpcy5fc3RyaW5ncyA9IHsgLi4udGhpcy5fc3RyaW5ncywgLi4ub3ZlcnJpZGVzIH07XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgYSBzdHJpbmcgd2l0aCBhIHNldCBvZiB0b2tlbnMgdG8gcmVwbGFjZVxuICAgKi9cbiAgcGFyc2Uoc291cmNlOiBzdHJpbmcsIHRva2VuczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9KSB7XG4gICAgY29uc3QgbmFtZXMgPSBPYmplY3Qua2V5cyh0b2tlbnMpO1xuICAgIGxldCBvdXRwdXQgPSBzb3VyY2U7XG4gICAgaWYgKG5hbWVzLmxlbmd0aCkge1xuICAgICAgbmFtZXMuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoYHske25hbWV9fWAsIHRva2Vuc1tuYW1lXSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxufVxuIl19