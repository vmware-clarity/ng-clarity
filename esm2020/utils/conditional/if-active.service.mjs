/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable, InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
let activeCounter = 0;
export const IF_ACTIVE_ID = new InjectionToken('IF_ACTIVE_ID');
export function tokenFactory() {
    return ++activeCounter;
}
export const IF_ACTIVE_ID_PROVIDER = {
    provide: IF_ACTIVE_ID,
    useFactory: tokenFactory,
};
/*********
 * @class IfActiveService
 *
 * @description
 * An injectable service used by IfActive structural directives and the components that implement IfActive in their
 * templates. It holds the value of the current state and provides an Observable that both the directive and the
 * implementing component can subscribe to in order to take action on current value changes.
 *
 */
export class IfActiveService {
    constructor() {
        /********
         * @property _currentChange
         *
         * @description
         * A RXJS Subject that updates and provides subscriptions to for the current current state of a component template
         * implemting the IfActive structural directive.
         *
         */
        this._currentChange = new Subject();
    }
    /*********
     *
     * @description
     * A getter function that provides an observable for the _current Subject.
     *
     */
    get currentChange() {
        return this._currentChange.asObservable();
    }
    /*********
     *
     * @description
     * A property that gets/sets the current state of _current for this instance of IfActive structural directive.
     * And, broadcasts the new value to all subscribers.
     *
     */
    get current() {
        return this._current;
    }
    set current(value) {
        if (this._current !== value) {
            this._current = value;
            this._currentChange.next(value);
        }
    }
}
IfActiveService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: IfActiveService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
IfActiveService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: IfActiveService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: IfActiveService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWYtYWN0aXZlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy91dGlscy9jb25kaXRpb25hbC9pZi1hY3RpdmUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBRS9CLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztBQUV0QixNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxjQUFjLENBQVMsY0FBYyxDQUFDLENBQUM7QUFFdkUsTUFBTSxVQUFVLFlBQVk7SUFDMUIsT0FBTyxFQUFFLGFBQWEsQ0FBQztBQUN6QixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUc7SUFDbkMsT0FBTyxFQUFFLFlBQVk7SUFDckIsVUFBVSxFQUFFLFlBQVk7Q0FDekIsQ0FBQztBQUlGOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxPQUFPLGVBQWU7SUFYNUI7UUFZRTs7Ozs7OztXQU9HO1FBQ0ssbUJBQWMsR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDO0tBb0NoRDtJQTFCQzs7Ozs7T0FLRztJQUNILElBQUksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFhO1FBQ3ZCLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxLQUFLLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDakM7SUFDSCxDQUFDOzs0R0E1Q1UsZUFBZTtnSEFBZixlQUFlOzJGQUFmLGVBQWU7a0JBWDNCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmxldCBhY3RpdmVDb3VudGVyID0gMDtcblxuZXhwb3J0IGNvbnN0IElGX0FDVElWRV9JRCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxudW1iZXI+KCdJRl9BQ1RJVkVfSUQnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRva2VuRmFjdG9yeSgpIHtcbiAgcmV0dXJuICsrYWN0aXZlQ291bnRlcjtcbn1cblxuZXhwb3J0IGNvbnN0IElGX0FDVElWRV9JRF9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogSUZfQUNUSVZFX0lELFxuICB1c2VGYWN0b3J5OiB0b2tlbkZhY3RvcnksXG59O1xuXG5ASW5qZWN0YWJsZSgpXG5cbi8qKioqKioqKipcbiAqIEBjbGFzcyBJZkFjdGl2ZVNlcnZpY2VcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIGluamVjdGFibGUgc2VydmljZSB1c2VkIGJ5IElmQWN0aXZlIHN0cnVjdHVyYWwgZGlyZWN0aXZlcyBhbmQgdGhlIGNvbXBvbmVudHMgdGhhdCBpbXBsZW1lbnQgSWZBY3RpdmUgaW4gdGhlaXJcbiAqIHRlbXBsYXRlcy4gSXQgaG9sZHMgdGhlIHZhbHVlIG9mIHRoZSBjdXJyZW50IHN0YXRlIGFuZCBwcm92aWRlcyBhbiBPYnNlcnZhYmxlIHRoYXQgYm90aCB0aGUgZGlyZWN0aXZlIGFuZCB0aGVcbiAqIGltcGxlbWVudGluZyBjb21wb25lbnQgY2FuIHN1YnNjcmliZSB0byBpbiBvcmRlciB0byB0YWtlIGFjdGlvbiBvbiBjdXJyZW50IHZhbHVlIGNoYW5nZXMuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgSWZBY3RpdmVTZXJ2aWNlIHtcbiAgLyoqKioqKioqXG4gICAqIEBwcm9wZXJ0eSBfY3VycmVudENoYW5nZVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQSBSWEpTIFN1YmplY3QgdGhhdCB1cGRhdGVzIGFuZCBwcm92aWRlcyBzdWJzY3JpcHRpb25zIHRvIGZvciB0aGUgY3VycmVudCBjdXJyZW50IHN0YXRlIG9mIGEgY29tcG9uZW50IHRlbXBsYXRlXG4gICAqIGltcGxlbXRpbmcgdGhlIElmQWN0aXZlIHN0cnVjdHVyYWwgZGlyZWN0aXZlLlxuICAgKlxuICAgKi9cbiAgcHJpdmF0ZSBfY3VycmVudENoYW5nZSA9IG5ldyBTdWJqZWN0PG51bWJlcj4oKTtcblxuICAvKioqKioqKioqXG4gICAqIEBwcm9wZXJ0eSBfY3VycmVudFxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQSBwcm9wZXJ0eSBob2xkaW5nIHRoZSBjdXJyZW50IHZhbHVlIGZvciBjdXJyZW50L2Nsb3NlZCBzdGF0ZSBvZiBhbiBJZkFjdGl2ZSBzdHJ1Y3R1cmFsIGRpcmVjdGl2ZS5cbiAgICovXG4gIHByaXZhdGUgX2N1cnJlbnQ6IG51bWJlcjtcblxuICAvKioqKioqKioqXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBIGdldHRlciBmdW5jdGlvbiB0aGF0IHByb3ZpZGVzIGFuIG9ic2VydmFibGUgZm9yIHRoZSBfY3VycmVudCBTdWJqZWN0LlxuICAgKlxuICAgKi9cbiAgZ2V0IGN1cnJlbnRDaGFuZ2UoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudENoYW5nZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKioqKioqKipcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEEgcHJvcGVydHkgdGhhdCBnZXRzL3NldHMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgX2N1cnJlbnQgZm9yIHRoaXMgaW5zdGFuY2Ugb2YgSWZBY3RpdmUgc3RydWN0dXJhbCBkaXJlY3RpdmUuXG4gICAqIEFuZCwgYnJvYWRjYXN0cyB0aGUgbmV3IHZhbHVlIHRvIGFsbCBzdWJzY3JpYmVycy5cbiAgICpcbiAgICovXG4gIGdldCBjdXJyZW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnQ7XG4gIH1cbiAgc2V0IGN1cnJlbnQodmFsdWU6IG51bWJlcikge1xuICAgIGlmICh0aGlzLl9jdXJyZW50ICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy5fY3VycmVudCA9IHZhbHVlO1xuICAgICAgdGhpcy5fY3VycmVudENoYW5nZS5uZXh0KHZhbHVlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==