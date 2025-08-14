/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// TODO: I'd like this to be a CheckedState enum for the checkboxes in the future.
export var ClrSelectedState;
(function (ClrSelectedState) {
    // WARNING! Unselected has the value 0,
    // so it's actually the only one that will evaluate to false if cast to a boolean.
    // Don't mess with the order!
    ClrSelectedState[ClrSelectedState["UNSELECTED"] = 0] = "UNSELECTED";
    ClrSelectedState[ClrSelectedState["SELECTED"] = 1] = "SELECTED";
    ClrSelectedState[ClrSelectedState["INDETERMINATE"] = 2] = "INDETERMINATE";
})(ClrSelectedState || (ClrSelectedState = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0ZWQtc3RhdGUuZW51bS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvdHJlZS12aWV3L21vZGVscy9zZWxlY3RlZC1zdGF0ZS5lbnVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsa0ZBQWtGO0FBQ2xGLE1BQU0sQ0FBTixJQUFZLGdCQU9YO0FBUEQsV0FBWSxnQkFBZ0I7SUFDMUIsdUNBQXVDO0lBQ3ZDLGtGQUFrRjtJQUNsRiw2QkFBNkI7SUFDN0IsbUVBQWMsQ0FBQTtJQUNkLCtEQUFRLENBQUE7SUFDUix5RUFBYSxDQUFBO0FBQ2YsQ0FBQyxFQVBXLGdCQUFnQixLQUFoQixnQkFBZ0IsUUFPM0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbi8vIFRPRE86IEknZCBsaWtlIHRoaXMgdG8gYmUgYSBDaGVja2VkU3RhdGUgZW51bSBmb3IgdGhlIGNoZWNrYm94ZXMgaW4gdGhlIGZ1dHVyZS5cbmV4cG9ydCBlbnVtIENsclNlbGVjdGVkU3RhdGUge1xuICAvLyBXQVJOSU5HISBVbnNlbGVjdGVkIGhhcyB0aGUgdmFsdWUgMCxcbiAgLy8gc28gaXQncyBhY3R1YWxseSB0aGUgb25seSBvbmUgdGhhdCB3aWxsIGV2YWx1YXRlIHRvIGZhbHNlIGlmIGNhc3QgdG8gYSBib29sZWFuLlxuICAvLyBEb24ndCBtZXNzIHdpdGggdGhlIG9yZGVyIVxuICBVTlNFTEVDVEVEID0gMCxcbiAgU0VMRUNURUQsXG4gIElOREVURVJNSU5BVEUsXG59XG4iXX0=