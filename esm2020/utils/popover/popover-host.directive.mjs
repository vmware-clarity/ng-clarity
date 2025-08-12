/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, ElementRef } from '@angular/core';
import { POPOVER_HOST_ANCHOR } from '../../popover/common/popover-host-anchor.token';
import { ClrPopoverEventsService } from './providers/popover-events.service';
import { ClrPopoverPositionService } from './providers/popover-position.service';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';
import { ClrStopEscapePropagationDirective } from './stop-escape-propagation.directive';
import * as i0 from "@angular/core";
import * as i1 from "./stop-escape-propagation.directive";
export class ClrPopoverHostDirective {
}
ClrPopoverHostDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverHostDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
ClrPopoverHostDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrPopoverHostDirective, isStandalone: true, providers: [
        ClrPopoverToggleService,
        ClrPopoverEventsService,
        ClrPopoverPositionService,
        { provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef },
    ], hostDirectives: [{ directive: i1.ClrStopEscapePropagationDirective }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverHostDirective, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                    providers: [
                        ClrPopoverToggleService,
                        ClrPopoverEventsService,
                        ClrPopoverPositionService,
                        { provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef },
                    ],
                    hostDirectives: [ClrStopEscapePropagationDirective],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1ob3N0LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL3BvcG92ZXIvcG9wb3Zlci1ob3N0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXRELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxpQ0FBaUMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDOzs7QUFZeEYsTUFBTSxPQUFPLHVCQUF1Qjs7b0hBQXZCLHVCQUF1Qjt3R0FBdkIsdUJBQXVCLGlDQVJ2QjtRQUNULHVCQUF1QjtRQUN2Qix1QkFBdUI7UUFDdkIseUJBQXlCO1FBQ3pCLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUU7S0FDMUQ7MkZBR1UsdUJBQXVCO2tCQVZuQyxTQUFTO21CQUFDO29CQUNULFVBQVUsRUFBRSxJQUFJO29CQUNoQixTQUFTLEVBQUU7d0JBQ1QsdUJBQXVCO3dCQUN2Qix1QkFBdUI7d0JBQ3ZCLHlCQUF5Qjt3QkFDekIsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRTtxQkFDMUQ7b0JBQ0QsY0FBYyxFQUFFLENBQUMsaUNBQWlDLENBQUM7aUJBQ3BEIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgUE9QT1ZFUl9IT1NUX0FOQ0hPUiB9IGZyb20gJy4uLy4uL3BvcG92ZXIvY29tbW9uL3BvcG92ZXItaG9zdC1hbmNob3IudG9rZW4nO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlckV2ZW50c1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9wb3BvdmVyLWV2ZW50cy5zZXJ2aWNlJztcbmltcG9ydCB7IENsclBvcG92ZXJQb3NpdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9wb3BvdmVyLXBvc2l0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9wb3BvdmVyLXRvZ2dsZS5zZXJ2aWNlJztcbmltcG9ydCB7IENsclN0b3BFc2NhcGVQcm9wYWdhdGlvbkRpcmVjdGl2ZSB9IGZyb20gJy4vc3RvcC1lc2NhcGUtcHJvcGFnYXRpb24uZGlyZWN0aXZlJztcblxuQERpcmVjdGl2ZSh7XG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIHByb3ZpZGVyczogW1xuICAgIENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlLFxuICAgIENsclBvcG92ZXJFdmVudHNTZXJ2aWNlLFxuICAgIENsclBvcG92ZXJQb3NpdGlvblNlcnZpY2UsXG4gICAgeyBwcm92aWRlOiBQT1BPVkVSX0hPU1RfQU5DSE9SLCB1c2VFeGlzdGluZzogRWxlbWVudFJlZiB9LFxuICBdLFxuICBob3N0RGlyZWN0aXZlczogW0NsclN0b3BFc2NhcGVQcm9wYWdhdGlvbkRpcmVjdGl2ZV0sXG59KVxuZXhwb3J0IGNsYXNzIENsclBvcG92ZXJIb3N0RGlyZWN0aXZlIHt9XG4iXX0=