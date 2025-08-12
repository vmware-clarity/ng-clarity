/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { NestedProperty } from '../nested-property';
export class DatagridPropertyNumericFilter {
    constructor(prop, exact = false) {
        this.prop = prop;
        this.exact = exact;
        this.nestedProp = new NestedProperty(prop);
    }
    accepts(item, low, high) {
        const propValue = this.nestedProp.getPropValue(item);
        if (propValue === undefined) {
            return false;
        }
        if (low !== null && (typeof propValue !== 'number' || propValue < low)) {
            return false;
        }
        if (high !== null && (typeof propValue !== 'number' || propValue > high)) {
            return false;
        }
        return true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtcHJvcGVydHktbnVtZXJpYy1maWx0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2J1aWx0LWluL2ZpbHRlcnMvZGF0YWdyaWQtcHJvcGVydHktbnVtZXJpYy1maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFHSCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFcEQsTUFBTSxPQUFPLDZCQUE2QjtJQUd4QyxZQUFtQixJQUFZLEVBQVMsUUFBUSxLQUFLO1FBQWxDLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ25ELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFPLEVBQUUsR0FBVyxFQUFFLElBQVk7UUFDeEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO1lBQzNCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLFNBQVMsS0FBSyxRQUFRLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxFQUFFO1lBQ3RFLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLFNBQVMsS0FBSyxRQUFRLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQ3hFLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ2xyRGF0YWdyaWROdW1lcmljRmlsdGVySW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9udW1lcmljLWZpbHRlci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgTmVzdGVkUHJvcGVydHkgfSBmcm9tICcuLi9uZXN0ZWQtcHJvcGVydHknO1xuXG5leHBvcnQgY2xhc3MgRGF0YWdyaWRQcm9wZXJ0eU51bWVyaWNGaWx0ZXI8VCA9IGFueT4gaW1wbGVtZW50cyBDbHJEYXRhZ3JpZE51bWVyaWNGaWx0ZXJJbnRlcmZhY2U8VD4ge1xuICBwcml2YXRlIG5lc3RlZFByb3A6IE5lc3RlZFByb3BlcnR5PFQ+O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wOiBzdHJpbmcsIHB1YmxpYyBleGFjdCA9IGZhbHNlKSB7XG4gICAgdGhpcy5uZXN0ZWRQcm9wID0gbmV3IE5lc3RlZFByb3BlcnR5KHByb3ApO1xuICB9XG5cbiAgYWNjZXB0cyhpdGVtOiBULCBsb3c6IG51bWJlciwgaGlnaDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcHJvcFZhbHVlID0gdGhpcy5uZXN0ZWRQcm9wLmdldFByb3BWYWx1ZShpdGVtKTtcbiAgICBpZiAocHJvcFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGxvdyAhPT0gbnVsbCAmJiAodHlwZW9mIHByb3BWYWx1ZSAhPT0gJ251bWJlcicgfHwgcHJvcFZhbHVlIDwgbG93KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaGlnaCAhPT0gbnVsbCAmJiAodHlwZW9mIHByb3BWYWx1ZSAhPT0gJ251bWJlcicgfHwgcHJvcFZhbHVlID4gaGlnaCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiJdfQ==