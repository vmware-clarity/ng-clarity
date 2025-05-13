/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
let counter = 0;
/**
 * @TODO No idea why I need to use provideIn .. without I'm getting error that
 * ContainerIdService is not defined - But this must be optional service!?
 *
 * There is something wrong - will come back to investigate it when I have more time
 *
 */
export class ContainerIdService {
    constructor() {
        this._id = `clr-form-container-${++counter}`;
        this._idChange = new BehaviorSubject(this._id);
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
        this._idChange.next(value);
    }
    get idChange() {
        return this._idChange.asObservable();
    }
}
ContainerIdService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ContainerIdService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ContainerIdService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ContainerIdService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ContainerIdService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLWlkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9jb21tb24vcHJvdmlkZXJzL2NvbnRhaW5lci1pZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE1BQU0sTUFBTSxDQUFDOztBQUVuRCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFFaEI7Ozs7OztHQU1HO0FBRUgsTUFBTSxPQUFPLGtCQUFrQjtJQUQvQjtRQUVVLFFBQUcsR0FBRyxzQkFBc0IsRUFBRSxPQUFPLEVBQUUsQ0FBQztRQUN4QyxjQUFTLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBYW5EO0lBWEMsSUFBSSxFQUFFO1FBQ0osT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7SUFDRCxJQUFJLEVBQUUsQ0FBQyxLQUFhO1FBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdkMsQ0FBQzs7K0dBZFUsa0JBQWtCO21IQUFsQixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFEOUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmxldCBjb3VudGVyID0gMDtcblxuLyoqXG4gKiBAVE9ETyBObyBpZGVhIHdoeSBJIG5lZWQgdG8gdXNlIHByb3ZpZGVJbiAuLiB3aXRob3V0IEknbSBnZXR0aW5nIGVycm9yIHRoYXRcbiAqIENvbnRhaW5lcklkU2VydmljZSBpcyBub3QgZGVmaW5lZCAtIEJ1dCB0aGlzIG11c3QgYmUgb3B0aW9uYWwgc2VydmljZSE/XG4gKlxuICogVGhlcmUgaXMgc29tZXRoaW5nIHdyb25nIC0gd2lsbCBjb21lIGJhY2sgdG8gaW52ZXN0aWdhdGUgaXQgd2hlbiBJIGhhdmUgbW9yZSB0aW1lXG4gKlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29udGFpbmVySWRTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfaWQgPSBgY2xyLWZvcm0tY29udGFpbmVyLSR7Kytjb3VudGVyfWA7XG4gIHByaXZhdGUgX2lkQ2hhbmdlID0gbmV3IEJlaGF2aW9yU3ViamVjdCh0aGlzLl9pZCk7XG5cbiAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG4gIHNldCBpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5faWQgPSB2YWx1ZTtcbiAgICB0aGlzLl9pZENoYW5nZS5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIGdldCBpZENoYW5nZSgpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLl9pZENoYW5nZS5hc09ic2VydmFibGUoKTtcbiAgfVxufVxuIl19