/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { NgModule } from '@angular/core';
import { ClrDropdownModule } from './dropdown/dropdown.module';
import { ClrSignpostModule } from './signpost/signpost.module';
import { ClrTooltipModule } from './tooltip/tooltip.module';
import * as i0 from "@angular/core";
export class ClrPopoverModule {
}
ClrPopoverModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrPopoverModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverModule, exports: [ClrDropdownModule, ClrSignpostModule, ClrTooltipModule] });
ClrPopoverModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverModule, imports: [ClrDropdownModule, ClrSignpostModule, ClrTooltipModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [ClrDropdownModule, ClrSignpostModule, ClrTooltipModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9wb3BvdmVyL3BvcG92ZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7QUFLNUQsTUFBTSxPQUFPLGdCQUFnQjs7NkdBQWhCLGdCQUFnQjs4R0FBaEIsZ0JBQWdCLFlBRmpCLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLGdCQUFnQjs4R0FFckQsZ0JBQWdCLFlBRmpCLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLGdCQUFnQjsyRkFFckQsZ0JBQWdCO2tCQUg1QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixDQUFDO2lCQUNsRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyRHJvcGRvd25Nb2R1bGUgfSBmcm9tICcuL2Ryb3Bkb3duL2Ryb3Bkb3duLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJTaWducG9zdE1vZHVsZSB9IGZyb20gJy4vc2lnbnBvc3Qvc2lnbnBvc3QubW9kdWxlJztcbmltcG9ydCB7IENsclRvb2x0aXBNb2R1bGUgfSBmcm9tICcuL3Rvb2x0aXAvdG9vbHRpcC5tb2R1bGUnO1xuXG5ATmdNb2R1bGUoe1xuICBleHBvcnRzOiBbQ2xyRHJvcGRvd25Nb2R1bGUsIENsclNpZ25wb3N0TW9kdWxlLCBDbHJUb29sdGlwTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyUG9wb3Zlck1vZHVsZSB7fVxuIl19