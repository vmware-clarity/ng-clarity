/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
export class Linkers {
    /**
     * Links a set of focusable items to a parent along one direction
     */
    static linkParent(items, parent, direction) {
        items.forEach(item => (item[direction] = parent));
    }
    /**
     * Double-links a set of focusable items vertically, possibly looping
     */
    static linkVertical(items, loop = true) {
        items.forEach((item, index) => {
            if (index > 0) {
                item.up = items[index - 1];
            }
            if (index < items.length - 1) {
                item.down = items[index + 1];
            }
        });
        if (loop && items.length > 1) {
            items[0].up = items[items.length - 1];
            items[items.length - 1].down = items[0];
        }
    }
}
// Right now I only need the two linkers above, but we can easily add more linkers. A couple examples:
// export function linkHorizontal(items: FocusableItem[], loop = true);
// export function linkTable(items: FocusableItem[][]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlua2Vycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL2ZvY3VzL2ZvY3VzYWJsZS1pdGVtL2xpbmtlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFPSCxNQUFNLE9BQU8sT0FBTztJQUNsQjs7T0FFRztJQUNILE1BQU0sQ0FBQyxVQUFVLENBQ2YsS0FBc0IsRUFDdEIsTUFBaUQsRUFDakQsU0FBNEI7UUFFNUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFzQixFQUFFLElBQUksR0FBRyxJQUFJO1FBQ3JELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDNUIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO2dCQUNiLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzthQUM1QjtZQUNELElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDOUI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzVCLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN6QztJQUNILENBQUM7Q0FDRjtBQUVELHNHQUFzRztBQUN0Ryx1RUFBdUU7QUFDdkUsdURBQXVEIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEFycm93S2V5RGlyZWN0aW9uIH0gZnJvbSAnLi4vYXJyb3cta2V5LWRpcmVjdGlvbi5lbnVtJztcbmltcG9ydCB7IEZvY3VzYWJsZUl0ZW0gfSBmcm9tICcuL2ZvY3VzYWJsZS1pdGVtJztcblxuZXhwb3J0IGNsYXNzIExpbmtlcnMge1xuICAvKipcbiAgICogTGlua3MgYSBzZXQgb2YgZm9jdXNhYmxlIGl0ZW1zIHRvIGEgcGFyZW50IGFsb25nIG9uZSBkaXJlY3Rpb25cbiAgICovXG4gIHN0YXRpYyBsaW5rUGFyZW50KFxuICAgIGl0ZW1zOiBGb2N1c2FibGVJdGVtW10sXG4gICAgcGFyZW50OiBGb2N1c2FibGVJdGVtIHwgT2JzZXJ2YWJsZTxGb2N1c2FibGVJdGVtPixcbiAgICBkaXJlY3Rpb246IEFycm93S2V5RGlyZWN0aW9uXG4gICkge1xuICAgIGl0ZW1zLmZvckVhY2goaXRlbSA9PiAoaXRlbVtkaXJlY3Rpb25dID0gcGFyZW50KSk7XG4gIH1cblxuICAvKipcbiAgICogRG91YmxlLWxpbmtzIGEgc2V0IG9mIGZvY3VzYWJsZSBpdGVtcyB2ZXJ0aWNhbGx5LCBwb3NzaWJseSBsb29waW5nXG4gICAqL1xuICBzdGF0aWMgbGlua1ZlcnRpY2FsKGl0ZW1zOiBGb2N1c2FibGVJdGVtW10sIGxvb3AgPSB0cnVlKSB7XG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgaXRlbS51cCA9IGl0ZW1zW2luZGV4IC0gMV07XG4gICAgICB9XG4gICAgICBpZiAoaW5kZXggPCBpdGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGl0ZW0uZG93biA9IGl0ZW1zW2luZGV4ICsgMV07XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGxvb3AgJiYgaXRlbXMubGVuZ3RoID4gMSkge1xuICAgICAgaXRlbXNbMF0udXAgPSBpdGVtc1tpdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgIGl0ZW1zW2l0ZW1zLmxlbmd0aCAtIDFdLmRvd24gPSBpdGVtc1swXTtcbiAgICB9XG4gIH1cbn1cblxuLy8gUmlnaHQgbm93IEkgb25seSBuZWVkIHRoZSB0d28gbGlua2VycyBhYm92ZSwgYnV0IHdlIGNhbiBlYXNpbHkgYWRkIG1vcmUgbGlua2Vycy4gQSBjb3VwbGUgZXhhbXBsZXM6XG4vLyBleHBvcnQgZnVuY3Rpb24gbGlua0hvcml6b250YWwoaXRlbXM6IEZvY3VzYWJsZUl0ZW1bXSwgbG9vcCA9IHRydWUpO1xuLy8gZXhwb3J0IGZ1bmN0aW9uIGxpbmtUYWJsZShpdGVtczogRm9jdXNhYmxlSXRlbVtdW10pO1xuIl19