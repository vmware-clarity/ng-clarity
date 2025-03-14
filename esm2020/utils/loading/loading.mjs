/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Input, Optional } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./loading-listener";
export var ClrLoadingState;
(function (ClrLoadingState) {
    ClrLoadingState[ClrLoadingState["DEFAULT"] = 0] = "DEFAULT";
    ClrLoadingState[ClrLoadingState["LOADING"] = 1] = "LOADING";
    ClrLoadingState[ClrLoadingState["SUCCESS"] = 2] = "SUCCESS";
    ClrLoadingState[ClrLoadingState["ERROR"] = 3] = "ERROR";
})(ClrLoadingState || (ClrLoadingState = {}));
export class ClrLoading {
    // We find the first parent that handles something loading
    constructor(listener) {
        this.listener = listener;
        this._loadingState = ClrLoadingState.DEFAULT;
    }
    get loadingState() {
        return this._loadingState;
    }
    set loadingState(value) {
        if (value === true) {
            value = ClrLoadingState.LOADING;
        }
        else if (!value) {
            value = ClrLoadingState.DEFAULT;
        }
        if (value === this._loadingState) {
            return;
        }
        this._loadingState = value;
        if (this.listener) {
            this.listener.loadingStateChange(value);
        }
    }
    ngOnDestroy() {
        this.loadingState = ClrLoadingState.DEFAULT;
    }
}
ClrLoading.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrLoading, deps: [{ token: i1.LoadingListener, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
ClrLoading.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrLoading, selector: "[clrLoading]", inputs: { loadingState: ["clrLoading", "loadingState"] }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrLoading, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrLoading]',
                }]
        }], ctorParameters: function () { return [{ type: i1.LoadingListener, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { loadingState: [{
                type: Input,
                args: ['clrLoading']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL2xvYWRpbmcvbG9hZGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFhLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBSXRFLE1BQU0sQ0FBTixJQUFZLGVBS1g7QUFMRCxXQUFZLGVBQWU7SUFDekIsMkRBQU8sQ0FBQTtJQUNQLDJEQUFPLENBQUE7SUFDUCwyREFBTyxDQUFBO0lBQ1AsdURBQUssQ0FBQTtBQUNQLENBQUMsRUFMVyxlQUFlLEtBQWYsZUFBZSxRQUsxQjtBQUtELE1BQU0sT0FBTyxVQUFVO0lBS3JCLDBEQUEwRDtJQUMxRCxZQUFnQyxRQUF5QjtRQUF6QixhQUFRLEdBQVIsUUFBUSxDQUFpQjtRQUhqRCxrQkFBYSxHQUE2QixlQUFlLENBQUMsT0FBTyxDQUFDO0lBR2QsQ0FBQztJQUU3RCxJQUNJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDNUIsQ0FBQztJQUNELElBQUksWUFBWSxDQUFDLEtBQXlDO1FBQ3hELElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtZQUNsQixLQUFLLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQztTQUNqQzthQUFNLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDakIsS0FBSyxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUM7U0FDakM7UUFFRCxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2hDLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsWUFBWSxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUM7SUFDOUMsQ0FBQzs7dUdBL0JVLFVBQVU7MkZBQVYsVUFBVTsyRkFBVixVQUFVO2tCQUh0QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxjQUFjO2lCQUN6Qjs7MEJBT2MsUUFBUTs0Q0FHakIsWUFBWTtzQkFEZixLQUFLO3VCQUFDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIE9uRGVzdHJveSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgTG9hZGluZ0xpc3RlbmVyIH0gZnJvbSAnLi9sb2FkaW5nLWxpc3RlbmVyJztcblxuZXhwb3J0IGVudW0gQ2xyTG9hZGluZ1N0YXRlIHtcbiAgREVGQVVMVCxcbiAgTE9BRElORyxcbiAgU1VDQ0VTUyxcbiAgRVJST1IsXG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbHJMb2FkaW5nXScsXG59KVxuZXhwb3J0IGNsYXNzIENsckxvYWRpbmcgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbG9hZGluZ1N0YXRlOiBib29sZWFuIHwgQ2xyTG9hZGluZ1N0YXRlIHwgbnVsbCB8IHN0cmluZztcblxuICBwcml2YXRlIF9sb2FkaW5nU3RhdGU6IENsckxvYWRpbmdTdGF0ZSB8IHN0cmluZyA9IENsckxvYWRpbmdTdGF0ZS5ERUZBVUxUO1xuXG4gIC8vIFdlIGZpbmQgdGhlIGZpcnN0IHBhcmVudCB0aGF0IGhhbmRsZXMgc29tZXRoaW5nIGxvYWRpbmdcbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgcHJpdmF0ZSBsaXN0ZW5lcjogTG9hZGluZ0xpc3RlbmVyKSB7fVxuXG4gIEBJbnB1dCgnY2xyTG9hZGluZycpXG4gIGdldCBsb2FkaW5nU3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvYWRpbmdTdGF0ZTtcbiAgfVxuICBzZXQgbG9hZGluZ1N0YXRlKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nIHwgQ2xyTG9hZGluZ1N0YXRlKSB7XG4gICAgaWYgKHZhbHVlID09PSB0cnVlKSB7XG4gICAgICB2YWx1ZSA9IENsckxvYWRpbmdTdGF0ZS5MT0FESU5HO1xuICAgIH0gZWxzZSBpZiAoIXZhbHVlKSB7XG4gICAgICB2YWx1ZSA9IENsckxvYWRpbmdTdGF0ZS5ERUZBVUxUO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5fbG9hZGluZ1N0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fbG9hZGluZ1N0YXRlID0gdmFsdWU7XG4gICAgaWYgKHRoaXMubGlzdGVuZXIpIHtcbiAgICAgIHRoaXMubGlzdGVuZXIubG9hZGluZ1N0YXRlQ2hhbmdlKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmxvYWRpbmdTdGF0ZSA9IENsckxvYWRpbmdTdGF0ZS5ERUZBVUxUO1xuICB9XG59XG4iXX0=