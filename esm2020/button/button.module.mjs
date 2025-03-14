/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { NgModule } from '@angular/core';
import { ClarityIcons, ellipsisHorizontalIcon } from '@cds/core/icon';
import { ClrButtonGroupModule } from './button-group/button-group.module';
import { ClrLoadingButtonModule } from './button-loading/loading-button.module';
import * as i0 from "@angular/core";
export class ClrButtonModule {
    constructor() {
        ClarityIcons.addIcons(ellipsisHorizontalIcon);
    }
}
ClrButtonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrButtonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrButtonModule, exports: [ClrLoadingButtonModule, ClrButtonGroupModule] });
ClrButtonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrButtonModule, imports: [ClrLoadingButtonModule, ClrButtonGroupModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [ClrLoadingButtonModule, ClrButtonGroupModule],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2J1dHRvbi9idXR0b24ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLHNCQUFzQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdEUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDMUUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7O0FBS2hGLE1BQU0sT0FBTyxlQUFlO0lBQzFCO1FBQ0UsWUFBWSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ2hELENBQUM7OzRHQUhVLGVBQWU7NkdBQWYsZUFBZSxZQUZoQixzQkFBc0IsRUFBRSxvQkFBb0I7NkdBRTNDLGVBQWUsWUFGaEIsc0JBQXNCLEVBQUUsb0JBQW9COzJGQUUzQyxlQUFlO2tCQUgzQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixFQUFFLG9CQUFvQixDQUFDO2lCQUN4RCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENsYXJpdHlJY29ucywgZWxsaXBzaXNIb3Jpem9udGFsSWNvbiB9IGZyb20gJ0BjZHMvY29yZS9pY29uJztcblxuaW1wb3J0IHsgQ2xyQnV0dG9uR3JvdXBNb2R1bGUgfSBmcm9tICcuL2J1dHRvbi1ncm91cC9idXR0b24tZ3JvdXAubW9kdWxlJztcbmltcG9ydCB7IENsckxvYWRpbmdCdXR0b25Nb2R1bGUgfSBmcm9tICcuL2J1dHRvbi1sb2FkaW5nL2xvYWRpbmctYnV0dG9uLm1vZHVsZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGV4cG9ydHM6IFtDbHJMb2FkaW5nQnV0dG9uTW9kdWxlLCBDbHJCdXR0b25Hcm91cE1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIENsckJ1dHRvbk1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIENsYXJpdHlJY29ucy5hZGRJY29ucyhlbGxpcHNpc0hvcml6b250YWxJY29uKTtcbiAgfVxufVxuIl19