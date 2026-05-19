/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { NestedProperty } from '../nested-property';
export class DatagridPropertyStringFilter {
    constructor(prop, exact = false) {
        this.prop = prop;
        this.exact = exact;
        this.nestedProp = new NestedProperty(prop);
    }
    accepts(item, search) {
        const propValue = this.nestedProp.getPropValue(item);
        if (typeof propValue === 'undefined') {
            return false;
        }
        else if (this.exact) {
            return ('' + propValue).toLowerCase() === search;
        }
        else {
            return ('' + propValue).toLowerCase().indexOf(search) >= 0;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtcHJvcGVydHktc3RyaW5nLWZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvYnVpbHQtaW4vZmlsdGVycy9kYXRhZ3JpZC1wcm9wZXJ0eS1zdHJpbmctZmlsdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBR0gsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXBELE1BQU0sT0FBTyw0QkFBNEI7SUFHdkMsWUFBbUIsSUFBWSxFQUFTLFFBQVEsS0FBSztRQUFsQyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUNuRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxPQUFPLENBQUMsSUFBTyxFQUFFLE1BQWM7UUFDN0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsSUFBSSxPQUFPLFNBQVMsS0FBSyxXQUFXLEVBQUU7WUFDcEMsT0FBTyxLQUFLLENBQUM7U0FDZDthQUFNLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNyQixPQUFPLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLE1BQU0sQ0FBQztTQUNsRDthQUFNO1lBQ0wsT0FBTyxDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVEO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDbHJEYXRhZ3JpZFN0cmluZ0ZpbHRlckludGVyZmFjZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvc3RyaW5nLWZpbHRlci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgTmVzdGVkUHJvcGVydHkgfSBmcm9tICcuLi9uZXN0ZWQtcHJvcGVydHknO1xuXG5leHBvcnQgY2xhc3MgRGF0YWdyaWRQcm9wZXJ0eVN0cmluZ0ZpbHRlcjxUID0gYW55PiBpbXBsZW1lbnRzIENsckRhdGFncmlkU3RyaW5nRmlsdGVySW50ZXJmYWNlPFQ+IHtcbiAgcHJpdmF0ZSBuZXN0ZWRQcm9wOiBOZXN0ZWRQcm9wZXJ0eTxUPjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcDogc3RyaW5nLCBwdWJsaWMgZXhhY3QgPSBmYWxzZSkge1xuICAgIHRoaXMubmVzdGVkUHJvcCA9IG5ldyBOZXN0ZWRQcm9wZXJ0eShwcm9wKTtcbiAgfVxuXG4gIGFjY2VwdHMoaXRlbTogVCwgc2VhcmNoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBwcm9wVmFsdWUgPSB0aGlzLm5lc3RlZFByb3AuZ2V0UHJvcFZhbHVlKGl0ZW0pO1xuICAgIGlmICh0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5leGFjdCkge1xuICAgICAgcmV0dXJuICgnJyArIHByb3BWYWx1ZSkudG9Mb3dlckNhc2UoKSA9PT0gc2VhcmNoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKCcnICsgcHJvcFZhbHVlKS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoKSA+PSAwO1xuICAgIH1cbiAgfVxufVxuIl19