/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { ClrLoadingState } from '../../utils/loading/loading';
import * as i0 from "@angular/core";
let nbRow = 0;
export class DatagridIfExpandService extends IfExpandService {
    constructor() {
        super();
        this.expandableId = '';
        this._replace = new BehaviorSubject(false);
        this._animate = new Subject();
        nbRow++;
        this.expandableId = 'clr-dg-expandable-row-' + nbRow;
    }
    // due to the es5 spec if the set is overridden on base class the getter must also be overridden
    get expanded() {
        return this._expanded;
    }
    set expanded(value) {
        value = !!value;
        if (value !== this._expanded) {
            this._expanded = value;
            this._animate.next();
            this._expandChange.next(value);
        }
    }
    get replace() {
        return this._replace.asObservable();
    }
    get animate() {
        return this._animate.asObservable();
    }
    loadingStateChange(state) {
        super.loadingStateChange(state);
        if (state !== ClrLoadingState.LOADING) {
            this._animate.next();
        }
    }
    setReplace(replaceValue) {
        this._replace.next(replaceValue);
    }
}
DatagridIfExpandService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridIfExpandService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
DatagridIfExpandService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridIfExpandService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridIfExpandService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtaWYtZXhwYW5kZWQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvZGF0YWdyaWQtaWYtZXhwYW5kZWQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFNUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7QUFFOUQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBR2QsTUFBTSxPQUFPLHVCQUF3QixTQUFRLGVBQWU7SUFNMUQ7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQU5WLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBRVYsYUFBUSxHQUFHLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBSXJDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFlBQVksR0FBRyx3QkFBd0IsR0FBRyxLQUFLLENBQUM7SUFDdkQsQ0FBQztJQUNELGdHQUFnRztJQUNoRyxJQUFhLFFBQVE7UUFDbkIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxJQUFhLFFBQVEsQ0FBQyxLQUFjO1FBQ2xDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2hCLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNoQztJQUNILENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRVEsa0JBQWtCLENBQUMsS0FBc0I7UUFDaEQsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLElBQUksS0FBSyxLQUFLLGVBQWUsQ0FBQyxPQUFPLEVBQUU7WUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN0QjtJQUNILENBQUM7SUFFRCxVQUFVLENBQUMsWUFBcUI7UUFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbkMsQ0FBQzs7b0hBekNVLHVCQUF1Qjt3SEFBdkIsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBRG5DLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJZkV4cGFuZFNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9jb25kaXRpb25hbC9pZi1leHBhbmRlZC5zZXJ2aWNlJztcbmltcG9ydCB7IENsckxvYWRpbmdTdGF0ZSB9IGZyb20gJy4uLy4uL3V0aWxzL2xvYWRpbmcvbG9hZGluZyc7XG5cbmxldCBuYlJvdyA9IDA7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEYXRhZ3JpZElmRXhwYW5kU2VydmljZSBleHRlbmRzIElmRXhwYW5kU2VydmljZSB7XG4gIGV4cGFuZGFibGVJZCA9ICcnO1xuXG4gIHByaXZhdGUgX3JlcGxhY2UgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcbiAgcHJpdmF0ZSBfYW5pbWF0ZSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICBuYlJvdysrO1xuICAgIHRoaXMuZXhwYW5kYWJsZUlkID0gJ2Nsci1kZy1leHBhbmRhYmxlLXJvdy0nICsgbmJSb3c7XG4gIH1cbiAgLy8gZHVlIHRvIHRoZSBlczUgc3BlYyBpZiB0aGUgc2V0IGlzIG92ZXJyaWRkZW4gb24gYmFzZSBjbGFzcyB0aGUgZ2V0dGVyIG11c3QgYWxzbyBiZSBvdmVycmlkZGVuXG4gIG92ZXJyaWRlIGdldCBleHBhbmRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZXhwYW5kZWQ7XG4gIH1cbiAgb3ZlcnJpZGUgc2V0IGV4cGFuZGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdmFsdWUgPSAhIXZhbHVlO1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fZXhwYW5kZWQpIHtcbiAgICAgIHRoaXMuX2V4cGFuZGVkID0gdmFsdWU7XG4gICAgICB0aGlzLl9hbmltYXRlLm5leHQoKTtcbiAgICAgIHRoaXMuX2V4cGFuZENoYW5nZS5uZXh0KHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgcmVwbGFjZSgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5fcmVwbGFjZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldCBhbmltYXRlKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9hbmltYXRlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbG9hZGluZ1N0YXRlQ2hhbmdlKHN0YXRlOiBDbHJMb2FkaW5nU3RhdGUpIHtcbiAgICBzdXBlci5sb2FkaW5nU3RhdGVDaGFuZ2Uoc3RhdGUpO1xuICAgIGlmIChzdGF0ZSAhPT0gQ2xyTG9hZGluZ1N0YXRlLkxPQURJTkcpIHtcbiAgICAgIHRoaXMuX2FuaW1hdGUubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIHNldFJlcGxhY2UocmVwbGFjZVZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVwbGFjZS5uZXh0KHJlcGxhY2VWYWx1ZSk7XG4gIH1cbn1cbiJdfQ==