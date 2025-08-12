/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { NestedProperty } from '../nested-property';
export class DatagridPropertyComparator {
    constructor(prop) {
        this.prop = prop;
        this.nestedProp = new NestedProperty(prop);
    }
    compare(a, b) {
        let propA = this.nestedProp.getPropValue(a);
        let propB = this.nestedProp.getPropValue(b);
        if (typeof propA === 'string') {
            propA = propA.toLowerCase();
        }
        if (typeof propB === 'string') {
            propB = propB.toLowerCase();
        }
        if (typeof propA === 'undefined' || propA === null) {
            if (typeof propB === 'undefined' || propB === null) {
                return 0;
            }
            else {
                return 1;
            }
        }
        else {
            if (typeof propB === 'undefined' || propB === null) {
                return -1;
            }
            else if (propA < propB) {
                return -1;
            }
            else if (propA > propB) {
                return 1;
            }
            else {
                return 0;
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtcHJvcGVydHktY29tcGFyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvYnVpbHQtaW4vY29tcGFyYXRvcnMvZGF0YWdyaWQtcHJvcGVydHktY29tcGFyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUdILE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVwRCxNQUFNLE9BQU8sMEJBQTBCO0lBR3JDLFlBQW1CLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELE9BQU8sQ0FBQyxDQUFJLEVBQUUsQ0FBSTtRQUNoQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU1QyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQzdCO1FBRUQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUM3QjtRQUVELElBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDbEQsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtnQkFDbEQsT0FBTyxDQUFDLENBQUM7YUFDVjtpQkFBTTtnQkFDTCxPQUFPLENBQUMsQ0FBQzthQUNWO1NBQ0Y7YUFBTTtZQUNMLElBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7Z0JBQ2xELE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDWDtpQkFBTSxJQUFJLEtBQUssR0FBRyxLQUFLLEVBQUU7Z0JBQ3hCLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDWDtpQkFBTSxJQUFJLEtBQUssR0FBRyxLQUFLLEVBQUU7Z0JBQ3hCLE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLENBQUM7YUFDVjtTQUNGO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDbHJEYXRhZ3JpZENvbXBhcmF0b3JJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2NvbXBhcmF0b3IuaW50ZXJmYWNlJztcbmltcG9ydCB7IE5lc3RlZFByb3BlcnR5IH0gZnJvbSAnLi4vbmVzdGVkLXByb3BlcnR5JztcblxuZXhwb3J0IGNsYXNzIERhdGFncmlkUHJvcGVydHlDb21wYXJhdG9yPFQgPSBhbnk+IGltcGxlbWVudHMgQ2xyRGF0YWdyaWRDb21wYXJhdG9ySW50ZXJmYWNlPFQ+IHtcbiAgcHJpdmF0ZSBuZXN0ZWRQcm9wOiBOZXN0ZWRQcm9wZXJ0eTxUPjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcDogc3RyaW5nKSB7XG4gICAgdGhpcy5uZXN0ZWRQcm9wID0gbmV3IE5lc3RlZFByb3BlcnR5KHByb3ApO1xuICB9XG5cbiAgY29tcGFyZShhOiBULCBiOiBUKTogbnVtYmVyIHtcbiAgICBsZXQgcHJvcEEgPSB0aGlzLm5lc3RlZFByb3AuZ2V0UHJvcFZhbHVlKGEpO1xuICAgIGxldCBwcm9wQiA9IHRoaXMubmVzdGVkUHJvcC5nZXRQcm9wVmFsdWUoYik7XG5cbiAgICBpZiAodHlwZW9mIHByb3BBID09PSAnc3RyaW5nJykge1xuICAgICAgcHJvcEEgPSBwcm9wQS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcHJvcEIgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwcm9wQiA9IHByb3BCLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwcm9wQSA9PT0gJ3VuZGVmaW5lZCcgfHwgcHJvcEEgPT09IG51bGwpIHtcbiAgICAgIGlmICh0eXBlb2YgcHJvcEIgPT09ICd1bmRlZmluZWQnIHx8IHByb3BCID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgcHJvcEIgPT09ICd1bmRlZmluZWQnIHx8IHByb3BCID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH0gZWxzZSBpZiAocHJvcEEgPCBwcm9wQikge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9IGVsc2UgaWYgKHByb3BBID4gcHJvcEIpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==