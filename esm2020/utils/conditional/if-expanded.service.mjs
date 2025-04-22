/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ClrLoadingState } from '../loading/loading';
import * as i0 from "@angular/core";
export class IfExpandService {
    constructor() {
        this.expandable = 0;
        this.hasExpandTemplate = false;
        this._loading = false;
        this._expanded = false;
        this._expandChange = new Subject();
    }
    get loading() {
        return this._loading;
    }
    set loading(value) {
        value = !!value;
        if (value !== this._loading) {
            this._loading = value;
        }
    }
    get expanded() {
        return this._expanded;
    }
    set expanded(value) {
        value = !!value;
        if (value !== this._expanded) {
            this._expanded = value;
            this._expandChange.next(value);
        }
    }
    get expandChange() {
        return this._expandChange.asObservable();
    }
    toggle() {
        this.expanded = !this._expanded;
    }
    loadingStateChange(state) {
        switch (state) {
            case ClrLoadingState.LOADING:
                this.loading = true;
                break;
            default:
                this.loading = false;
                break;
        }
    }
}
IfExpandService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: IfExpandService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
IfExpandService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: IfExpandService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: IfExpandService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWYtZXhwYW5kZWQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL2NvbmRpdGlvbmFsL2lmLWV4cGFuZGVkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDOztBQUlyRCxNQUFNLE9BQU8sZUFBZTtJQUQ1QjtRQUVFLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFDZixzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFFaEIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztLQXlDbEQ7SUF2Q0MsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFjO1FBQ3hCLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2hCLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFjO1FBQ3pCLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2hCLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDaEM7SUFDSCxDQUFDO0lBRUQsSUFBSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDbEMsQ0FBQztJQUVELGtCQUFrQixDQUFDLEtBQXNCO1FBQ3ZDLFFBQVEsS0FBSyxFQUFFO1lBQ2IsS0FBSyxlQUFlLENBQUMsT0FBTztnQkFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLE1BQU07WUFDUjtnQkFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztnQkFDckIsTUFBTTtTQUNUO0lBQ0gsQ0FBQzs7NEdBOUNVLGVBQWU7Z0hBQWYsZUFBZTsyRkFBZixlQUFlO2tCQUQzQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsckxvYWRpbmdTdGF0ZSB9IGZyb20gJy4uL2xvYWRpbmcvbG9hZGluZyc7XG5pbXBvcnQgeyBMb2FkaW5nTGlzdGVuZXIgfSBmcm9tICcuLi9sb2FkaW5nL2xvYWRpbmctbGlzdGVuZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSWZFeHBhbmRTZXJ2aWNlIGltcGxlbWVudHMgTG9hZGluZ0xpc3RlbmVyIHtcbiAgZXhwYW5kYWJsZSA9IDA7XG4gIGhhc0V4cGFuZFRlbXBsYXRlID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIF9sb2FkaW5nID0gZmFsc2U7XG4gIHByb3RlY3RlZCBfZXhwYW5kZWQgPSBmYWxzZTtcbiAgcHJvdGVjdGVkIF9leHBhbmRDaGFuZ2UgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIGdldCBsb2FkaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9sb2FkaW5nO1xuICB9XG4gIHNldCBsb2FkaW5nKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdmFsdWUgPSAhIXZhbHVlO1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fbG9hZGluZykge1xuICAgICAgdGhpcy5fbG9hZGluZyA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGdldCBleHBhbmRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZXhwYW5kZWQ7XG4gIH1cbiAgc2V0IGV4cGFuZGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdmFsdWUgPSAhIXZhbHVlO1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fZXhwYW5kZWQpIHtcbiAgICAgIHRoaXMuX2V4cGFuZGVkID0gdmFsdWU7XG4gICAgICB0aGlzLl9leHBhbmRDaGFuZ2UubmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGV4cGFuZENoYW5nZSgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5fZXhwYW5kQ2hhbmdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgdG9nZ2xlKCkge1xuICAgIHRoaXMuZXhwYW5kZWQgPSAhdGhpcy5fZXhwYW5kZWQ7XG4gIH1cblxuICBsb2FkaW5nU3RhdGVDaGFuZ2Uoc3RhdGU6IENsckxvYWRpbmdTdGF0ZSk6IHZvaWQge1xuICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgIGNhc2UgQ2xyTG9hZGluZ1N0YXRlLkxPQURJTkc6XG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuIl19