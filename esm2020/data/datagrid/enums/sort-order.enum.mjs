/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Enumeration representing the sorting order of a datagrid column. It is a constant Enum,
 * i.e. each value needs to be treated as a `number`, starting at index 0.
 *
 * @export
 * @enum {number}
 */
export var ClrDatagridSortOrder;
(function (ClrDatagridSortOrder) {
    ClrDatagridSortOrder[ClrDatagridSortOrder["UNSORTED"] = 0] = "UNSORTED";
    ClrDatagridSortOrder[ClrDatagridSortOrder["ASC"] = 1] = "ASC";
    ClrDatagridSortOrder[ClrDatagridSortOrder["DESC"] = -1] = "DESC";
})(ClrDatagridSortOrder || (ClrDatagridSortOrder = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1vcmRlci5lbnVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9lbnVtcy9zb3J0LW9yZGVyLmVudW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSDs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQU4sSUFBWSxvQkFJWDtBQUpELFdBQVksb0JBQW9CO0lBQzlCLHVFQUFZLENBQUE7SUFDWiw2REFBTyxDQUFBO0lBQ1AsZ0VBQVMsQ0FBQTtBQUNYLENBQUMsRUFKVyxvQkFBb0IsS0FBcEIsb0JBQW9CLFFBSS9CIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG4vKipcbiAqIEVudW1lcmF0aW9uIHJlcHJlc2VudGluZyB0aGUgc29ydGluZyBvcmRlciBvZiBhIGRhdGFncmlkIGNvbHVtbi4gSXQgaXMgYSBjb25zdGFudCBFbnVtLFxuICogaS5lLiBlYWNoIHZhbHVlIG5lZWRzIHRvIGJlIHRyZWF0ZWQgYXMgYSBgbnVtYmVyYCwgc3RhcnRpbmcgYXQgaW5kZXggMC5cbiAqXG4gKiBAZXhwb3J0XG4gKiBAZW51bSB7bnVtYmVyfVxuICovXG5leHBvcnQgZW51bSBDbHJEYXRhZ3JpZFNvcnRPcmRlciB7XG4gIFVOU09SVEVEID0gMCxcbiAgQVNDID0gMSxcbiAgREVTQyA9IC0xLFxufVxuIl19