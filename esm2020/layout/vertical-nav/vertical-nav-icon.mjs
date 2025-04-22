/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/vertical-nav-icon.service";
export class ClrVerticalNavIcon {
    constructor(_verticalNavIconService) {
        this._verticalNavIconService = _verticalNavIconService;
        _verticalNavIconService.registerIcon();
    }
    ngOnDestroy() {
        this._verticalNavIconService.unregisterIcon();
    }
}
ClrVerticalNavIcon.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrVerticalNavIcon, deps: [{ token: i1.VerticalNavIconService }], target: i0.ɵɵFactoryTarget.Directive });
ClrVerticalNavIcon.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrVerticalNavIcon, selector: "[clrVerticalNavIcon]", host: { classAttribute: "nav-icon" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrVerticalNavIcon, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrVerticalNavIcon]',
                    host: { class: 'nav-icon' },
                }]
        }], ctorParameters: function () { return [{ type: i1.VerticalNavIconService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVydGljYWwtbmF2LWljb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9sYXlvdXQvdmVydGljYWwtbmF2L3ZlcnRpY2FsLW5hdi1pY29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBYSxNQUFNLGVBQWUsQ0FBQzs7O0FBUXJELE1BQU0sT0FBTyxrQkFBa0I7SUFDN0IsWUFBb0IsdUJBQStDO1FBQS9DLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBd0I7UUFDakUsdUJBQXVCLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsdUJBQXVCLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDaEQsQ0FBQzs7K0dBUFUsa0JBQWtCO21HQUFsQixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFKOUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFO2lCQUM1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVmVydGljYWxOYXZJY29uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3ZlcnRpY2FsLW5hdi1pY29uLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xyVmVydGljYWxOYXZJY29uXScsXG4gIGhvc3Q6IHsgY2xhc3M6ICduYXYtaWNvbicgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyVmVydGljYWxOYXZJY29uIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdmVydGljYWxOYXZJY29uU2VydmljZTogVmVydGljYWxOYXZJY29uU2VydmljZSkge1xuICAgIF92ZXJ0aWNhbE5hdkljb25TZXJ2aWNlLnJlZ2lzdGVySWNvbigpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fdmVydGljYWxOYXZJY29uU2VydmljZS51bnJlZ2lzdGVySWNvbigpO1xuICB9XG59XG4iXX0=