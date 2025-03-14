/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { ALERT_TYPES } from '../utils/alert-types';
import * as i0 from "@angular/core";
import * as i1 from "../../../utils/i18n/common-strings.service";
export class AlertIconAndTypesService {
    constructor(commonStrings) {
        this.commonStrings = commonStrings;
        this.defaultIconShape = 'info-standard';
        this._alertIconShape = '';
        this._alertType = 'info';
    }
    get alertType() {
        return this._alertType;
    }
    set alertType(val) {
        if (ALERT_TYPES.indexOf(val) > -1) {
            this._alertType = val;
        }
    }
    get alertIconShape() {
        if ('' === this._alertIconShape) {
            return this.iconInfoFromType(this._alertType).shape;
        }
        return this._alertIconShape;
    }
    set alertIconShape(val) {
        if (!val) {
            this._alertIconShape = '';
        }
        else if (val !== this._alertIconShape) {
            this._alertIconShape = val;
        }
    }
    get alertIconTitle() {
        return this.iconInfoFromType(this._alertType).title;
    }
    iconInfoFromType(type) {
        const returnObj = { shape: '', cssClass: '', title: '' };
        switch (type) {
            case 'warning':
                returnObj.shape = 'warning-standard';
                returnObj.cssClass = 'alert-warning';
                returnObj.title = this.commonStrings.keys.warning;
                break;
            case 'danger':
                returnObj.shape = 'error-standard';
                returnObj.cssClass = 'alert-danger';
                returnObj.title = this.commonStrings.keys.danger;
                break;
            case 'success':
                returnObj.shape = 'success-standard';
                returnObj.cssClass = 'alert-success';
                returnObj.title = this.commonStrings.keys.success;
                break;
            case 'neutral':
                returnObj.shape = 'note';
                returnObj.cssClass = 'alert-neutral';
                returnObj.title = this.commonStrings.keys.neutral;
                break;
            case 'unknown':
                returnObj.shape = 'help';
                returnObj.cssClass = 'alert-neutral';
                returnObj.title = this.commonStrings.keys.unknown;
                break;
            case 'loading':
                returnObj.shape = 'loading';
                returnObj.cssClass = 'alert-neutral';
                returnObj.title = this.commonStrings.keys.unknown;
                break;
            default:
                returnObj.shape = this.defaultIconShape;
                returnObj.cssClass = 'alert-info';
                returnObj.title = this.commonStrings.keys.info;
                break;
        }
        return returnObj;
    }
}
AlertIconAndTypesService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: AlertIconAndTypesService, deps: [{ token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Injectable });
AlertIconAndTypesService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: AlertIconAndTypesService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: AlertIconAndTypesService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.ClrCommonStringsService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1hbmQtdHlwZXMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2VtcGhhc2lzL2FsZXJ0L3Byb3ZpZGVycy9pY29uLWFuZC10eXBlcy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUkzQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7OztBQUduRCxNQUFNLE9BQU8sd0JBQXdCO0lBS25DLFlBQW9CLGFBQXNDO1FBQXRDLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUpsRCxxQkFBZ0IsR0FBRyxlQUFlLENBQUM7UUFDbkMsb0JBQWUsR0FBRyxFQUFFLENBQUM7UUFDckIsZUFBVSxHQUFHLE1BQU0sQ0FBQztJQUVpQyxDQUFDO0lBRTlELElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBQ0QsSUFBSSxTQUFTLENBQUMsR0FBVztRQUN2QixJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDakMsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQsSUFBSSxjQUFjO1FBQ2hCLElBQUksRUFBRSxLQUFLLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDL0IsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUNyRDtRQUNELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUM5QixDQUFDO0lBQ0QsSUFBSSxjQUFjLENBQUMsR0FBVztRQUM1QixJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1IsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7U0FDM0I7YUFBTSxJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDO1NBQzVCO0lBQ0gsQ0FBQztJQUVELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3RELENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxJQUFZO1FBQzNCLE1BQU0sU0FBUyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUV6RCxRQUFRLElBQUksRUFBRTtZQUNaLEtBQUssU0FBUztnQkFDWixTQUFTLENBQUMsS0FBSyxHQUFHLGtCQUFrQixDQUFDO2dCQUNyQyxTQUFTLENBQUMsUUFBUSxHQUFHLGVBQWUsQ0FBQztnQkFDckMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ2xELE1BQU07WUFDUixLQUFLLFFBQVE7Z0JBQ1gsU0FBUyxDQUFDLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQztnQkFDbkMsU0FBUyxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUM7Z0JBQ3BDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNqRCxNQUFNO1lBQ1IsS0FBSyxTQUFTO2dCQUNaLFNBQVMsQ0FBQyxLQUFLLEdBQUcsa0JBQWtCLENBQUM7Z0JBQ3JDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDO2dCQUNyQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDbEQsTUFBTTtZQUNSLEtBQUssU0FBUztnQkFDWixTQUFTLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztnQkFDekIsU0FBUyxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUM7Z0JBQ3JDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNsRCxNQUFNO1lBQ1IsS0FBSyxTQUFTO2dCQUNaLFNBQVMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO2dCQUN6QixTQUFTLENBQUMsUUFBUSxHQUFHLGVBQWUsQ0FBQztnQkFDckMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ2xELE1BQU07WUFDUixLQUFLLFNBQVM7Z0JBQ1osU0FBUyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7Z0JBQzVCLFNBQVMsQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDO2dCQUNyQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDbEQsTUFBTTtZQUNSO2dCQUNFLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2dCQUN4QyxTQUFTLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztnQkFDbEMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQy9DLE1BQU07U0FDVDtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7O3FIQTVFVSx3QkFBd0I7eUhBQXhCLHdCQUF3QjsyRkFBeEIsd0JBQXdCO2tCQURwQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IEFsZXJ0SW5mb09iamVjdCB9IGZyb20gJy4uL3V0aWxzL2FsZXJ0LWluZm8tb2JqZWN0JztcbmltcG9ydCB7IEFMRVJUX1RZUEVTIH0gZnJvbSAnLi4vdXRpbHMvYWxlcnQtdHlwZXMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQWxlcnRJY29uQW5kVHlwZXNTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBkZWZhdWx0SWNvblNoYXBlID0gJ2luZm8tc3RhbmRhcmQnO1xuICBwcml2YXRlIF9hbGVydEljb25TaGFwZSA9ICcnO1xuICBwcml2YXRlIF9hbGVydFR5cGUgPSAnaW5mbyc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSkge31cblxuICBnZXQgYWxlcnRUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2FsZXJ0VHlwZTtcbiAgfVxuICBzZXQgYWxlcnRUeXBlKHZhbDogc3RyaW5nKSB7XG4gICAgaWYgKEFMRVJUX1RZUEVTLmluZGV4T2YodmFsKSA+IC0xKSB7XG4gICAgICB0aGlzLl9hbGVydFR5cGUgPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGFsZXJ0SWNvblNoYXBlKCk6IHN0cmluZyB7XG4gICAgaWYgKCcnID09PSB0aGlzLl9hbGVydEljb25TaGFwZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaWNvbkluZm9Gcm9tVHlwZSh0aGlzLl9hbGVydFR5cGUpLnNoYXBlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fYWxlcnRJY29uU2hhcGU7XG4gIH1cbiAgc2V0IGFsZXJ0SWNvblNoYXBlKHZhbDogc3RyaW5nKSB7XG4gICAgaWYgKCF2YWwpIHtcbiAgICAgIHRoaXMuX2FsZXJ0SWNvblNoYXBlID0gJyc7XG4gICAgfSBlbHNlIGlmICh2YWwgIT09IHRoaXMuX2FsZXJ0SWNvblNoYXBlKSB7XG4gICAgICB0aGlzLl9hbGVydEljb25TaGFwZSA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBnZXQgYWxlcnRJY29uVGl0bGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pY29uSW5mb0Zyb21UeXBlKHRoaXMuX2FsZXJ0VHlwZSkudGl0bGU7XG4gIH1cblxuICBpY29uSW5mb0Zyb21UeXBlKHR5cGU6IHN0cmluZyk6IEFsZXJ0SW5mb09iamVjdCB7XG4gICAgY29uc3QgcmV0dXJuT2JqID0geyBzaGFwZTogJycsIGNzc0NsYXNzOiAnJywgdGl0bGU6ICcnIH07XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3dhcm5pbmcnOlxuICAgICAgICByZXR1cm5PYmouc2hhcGUgPSAnd2FybmluZy1zdGFuZGFyZCc7XG4gICAgICAgIHJldHVybk9iai5jc3NDbGFzcyA9ICdhbGVydC13YXJuaW5nJztcbiAgICAgICAgcmV0dXJuT2JqLnRpdGxlID0gdGhpcy5jb21tb25TdHJpbmdzLmtleXMud2FybmluZztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkYW5nZXInOlxuICAgICAgICByZXR1cm5PYmouc2hhcGUgPSAnZXJyb3Itc3RhbmRhcmQnO1xuICAgICAgICByZXR1cm5PYmouY3NzQ2xhc3MgPSAnYWxlcnQtZGFuZ2VyJztcbiAgICAgICAgcmV0dXJuT2JqLnRpdGxlID0gdGhpcy5jb21tb25TdHJpbmdzLmtleXMuZGFuZ2VyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N1Y2Nlc3MnOlxuICAgICAgICByZXR1cm5PYmouc2hhcGUgPSAnc3VjY2Vzcy1zdGFuZGFyZCc7XG4gICAgICAgIHJldHVybk9iai5jc3NDbGFzcyA9ICdhbGVydC1zdWNjZXNzJztcbiAgICAgICAgcmV0dXJuT2JqLnRpdGxlID0gdGhpcy5jb21tb25TdHJpbmdzLmtleXMuc3VjY2VzcztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICduZXV0cmFsJzpcbiAgICAgICAgcmV0dXJuT2JqLnNoYXBlID0gJ25vdGUnO1xuICAgICAgICByZXR1cm5PYmouY3NzQ2xhc3MgPSAnYWxlcnQtbmV1dHJhbCc7XG4gICAgICAgIHJldHVybk9iai50aXRsZSA9IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLm5ldXRyYWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndW5rbm93bic6XG4gICAgICAgIHJldHVybk9iai5zaGFwZSA9ICdoZWxwJztcbiAgICAgICAgcmV0dXJuT2JqLmNzc0NsYXNzID0gJ2FsZXJ0LW5ldXRyYWwnO1xuICAgICAgICByZXR1cm5PYmoudGl0bGUgPSB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy51bmtub3duO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xvYWRpbmcnOlxuICAgICAgICByZXR1cm5PYmouc2hhcGUgPSAnbG9hZGluZyc7XG4gICAgICAgIHJldHVybk9iai5jc3NDbGFzcyA9ICdhbGVydC1uZXV0cmFsJztcbiAgICAgICAgcmV0dXJuT2JqLnRpdGxlID0gdGhpcy5jb21tb25TdHJpbmdzLmtleXMudW5rbm93bjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm5PYmouc2hhcGUgPSB0aGlzLmRlZmF1bHRJY29uU2hhcGU7XG4gICAgICAgIHJldHVybk9iai5jc3NDbGFzcyA9ICdhbGVydC1pbmZvJztcbiAgICAgICAgcmV0dXJuT2JqLnRpdGxlID0gdGhpcy5jb21tb25TdHJpbmdzLmtleXMuaW5mbztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldHVybk9iajtcbiAgfVxufVxuIl19