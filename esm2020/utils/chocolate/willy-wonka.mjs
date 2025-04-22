/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/*
 * After a conversation with the Angular core team, it turns out we don't have much of a choice for our
 * declarative API, we need to fight against change detection and its one-way flow. This is
 * currently the least dirty solution to do what we want.
 *
 * Do not modify or even use this class unless you know exactly what you're doing.
 * It has the potential to trigger change detection loops or kill app performances.
 */
export class WillyWonka {
    constructor() {
        this.disableChocolateCheck = false;
        this._chocolate = new Subject();
    }
    get chocolate() {
        return this._chocolate.asObservable();
    }
    ngAfterViewChecked() {
        if (!this.disableChocolateCheck) {
            this._chocolate.next();
        }
    }
}
WillyWonka.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: WillyWonka, deps: [], target: i0.ɵɵFactoryTarget.Directive });
WillyWonka.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: WillyWonka, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: WillyWonka, decorators: [{
            type: Directive
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lsbHktd29ua2EuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy91dGlscy9jaG9jb2xhdGUvd2lsbHktd29ua2EudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQW9CLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU1RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUUvQjs7Ozs7OztHQU9HO0FBRUgsTUFBTSxPQUFPLFVBQVU7SUFEdkI7UUFFRSwwQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFFdEIsZUFBVSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7S0FXMUM7SUFUQyxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQy9CLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDeEI7SUFDSCxDQUFDOzt1R0FiVSxVQUFVOzJGQUFWLFVBQVU7MkZBQVYsVUFBVTtrQkFEdEIsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQWZ0ZXJWaWV3Q2hlY2tlZCwgRGlyZWN0aXZlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbi8qXG4gKiBBZnRlciBhIGNvbnZlcnNhdGlvbiB3aXRoIHRoZSBBbmd1bGFyIGNvcmUgdGVhbSwgaXQgdHVybnMgb3V0IHdlIGRvbid0IGhhdmUgbXVjaCBvZiBhIGNob2ljZSBmb3Igb3VyXG4gKiBkZWNsYXJhdGl2ZSBBUEksIHdlIG5lZWQgdG8gZmlnaHQgYWdhaW5zdCBjaGFuZ2UgZGV0ZWN0aW9uIGFuZCBpdHMgb25lLXdheSBmbG93LiBUaGlzIGlzXG4gKiBjdXJyZW50bHkgdGhlIGxlYXN0IGRpcnR5IHNvbHV0aW9uIHRvIGRvIHdoYXQgd2Ugd2FudC5cbiAqXG4gKiBEbyBub3QgbW9kaWZ5IG9yIGV2ZW4gdXNlIHRoaXMgY2xhc3MgdW5sZXNzIHlvdSBrbm93IGV4YWN0bHkgd2hhdCB5b3UncmUgZG9pbmcuXG4gKiBJdCBoYXMgdGhlIHBvdGVudGlhbCB0byB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24gbG9vcHMgb3Iga2lsbCBhcHAgcGVyZm9ybWFuY2VzLlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBXaWxseVdvbmthIGltcGxlbWVudHMgQWZ0ZXJWaWV3Q2hlY2tlZCB7XG4gIGRpc2FibGVDaG9jb2xhdGVDaGVjayA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2Nob2NvbGF0ZSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgZ2V0IGNob2NvbGF0ZSgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fY2hvY29sYXRlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlQ2hvY29sYXRlQ2hlY2spIHtcbiAgICAgIHRoaXMuX2Nob2NvbGF0ZS5uZXh0KCk7XG4gICAgfVxuICB9XG59XG4iXX0=