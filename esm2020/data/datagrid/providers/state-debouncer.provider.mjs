/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/*
 * This provider implements some form of synchronous debouncing through a lock pattern
 * to avoid emitting multiple state changes for a single user action.
 */
export class StateDebouncer {
    constructor() {
        /*
         * This is the lock, to only emit once all the changes have finished processing
         */
        this.nbChanges = 0;
        /**
         * The Observable that lets other classes subscribe to global state changes
         */
        this._change = new Subject();
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
    get change() {
        return this._change.asObservable();
    }
    changeStart() {
        this.nbChanges++;
    }
    changeDone() {
        if (--this.nbChanges === 0) {
            this._change.next();
        }
    }
}
StateDebouncer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: StateDebouncer, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
StateDebouncer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: StateDebouncer });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: StateDebouncer, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtZGVib3VuY2VyLnByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9wcm92aWRlcnMvc3RhdGUtZGVib3VuY2VyLnByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUUvQjs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sY0FBYztJQUQzQjtRQUVFOztXQUVHO1FBQ0ssY0FBUyxHQUFHLENBQUMsQ0FBQztRQUV0Qjs7V0FFRztRQUNLLFlBQU8sR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO0tBZ0J2QztJQWRDLHFGQUFxRjtJQUNyRixJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsS0FBSyxDQUFDLEVBQUU7WUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNyQjtJQUNILENBQUM7OzJHQXhCVSxjQUFjOytHQUFkLGNBQWM7MkZBQWQsY0FBYztrQkFEMUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG4vKlxuICogVGhpcyBwcm92aWRlciBpbXBsZW1lbnRzIHNvbWUgZm9ybSBvZiBzeW5jaHJvbm91cyBkZWJvdW5jaW5nIHRocm91Z2ggYSBsb2NrIHBhdHRlcm5cbiAqIHRvIGF2b2lkIGVtaXR0aW5nIG11bHRpcGxlIHN0YXRlIGNoYW5nZXMgZm9yIGEgc2luZ2xlIHVzZXIgYWN0aW9uLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RhdGVEZWJvdW5jZXIge1xuICAvKlxuICAgKiBUaGlzIGlzIHRoZSBsb2NrLCB0byBvbmx5IGVtaXQgb25jZSBhbGwgdGhlIGNoYW5nZXMgaGF2ZSBmaW5pc2hlZCBwcm9jZXNzaW5nXG4gICAqL1xuICBwcml2YXRlIG5iQ2hhbmdlcyA9IDA7XG5cbiAgLyoqXG4gICAqIFRoZSBPYnNlcnZhYmxlIHRoYXQgbGV0cyBvdGhlciBjbGFzc2VzIHN1YnNjcmliZSB0byBnbG9iYWwgc3RhdGUgY2hhbmdlc1xuICAgKi9cbiAgcHJpdmF0ZSBfY2hhbmdlID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvLyBXZSBkbyBub3Qgd2FudCB0byBleHBvc2UgdGhlIFN1YmplY3QgaXRzZWxmLCBidXQgdGhlIE9ic2VydmFibGUgd2hpY2ggaXMgcmVhZC1vbmx5XG4gIGdldCBjaGFuZ2UoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2NoYW5nZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGNoYW5nZVN0YXJ0KCkge1xuICAgIHRoaXMubmJDaGFuZ2VzKys7XG4gIH1cblxuICBjaGFuZ2VEb25lKCkge1xuICAgIGlmICgtLXRoaXMubmJDaGFuZ2VzID09PSAwKSB7XG4gICAgICB0aGlzLl9jaGFuZ2UubmV4dCgpO1xuICAgIH1cbiAgfVxufVxuIl19