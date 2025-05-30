/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityIcons, windowCloseIcon } from '@cds/core/icon';
import { ClrIconModule } from '../icon/icon.module';
import { CdkTrapFocusModule } from '../utils/cdk/cdk-trap-focus.module';
import { ClrModal } from './modal';
import { ClrModalBody } from './modal-body';
import { ClrModalHostComponent } from './modal-host.component';
import * as i0 from "@angular/core";
export const CLR_MODAL_DIRECTIVES = [ClrModal, ClrModalBody, ClrModalHostComponent];
export class ClrModalModule {
    constructor() {
        ClarityIcons.addIcons(windowCloseIcon);
    }
}
ClrModalModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrModalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrModalModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrModalModule, declarations: [ClrModal, ClrModalBody, ClrModalHostComponent], imports: [CommonModule, CdkTrapFocusModule, ClrIconModule], exports: [ClrModal, ClrModalBody, ClrModalHostComponent, ClrIconModule] });
ClrModalModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrModalModule, imports: [CommonModule, CdkTrapFocusModule, ClrIconModule, ClrIconModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrModalModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, CdkTrapFocusModule, ClrIconModule],
                    declarations: [CLR_MODAL_DIRECTIVES],
                    exports: [CLR_MODAL_DIRECTIVES, ClrIconModule],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvbW9kYWwvbW9kYWwubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFDL0MsT0FBTyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUvRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDcEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDeEUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNuQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzVDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDOztBQUUvRCxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixDQUFDLENBQUM7QUFPakcsTUFBTSxPQUFPLGNBQWM7SUFDekI7UUFDRSxZQUFZLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7OzJHQUhVLGNBQWM7NEdBQWQsY0FBYyxpQkFQdUIsUUFBUSxFQUFFLFlBQVksRUFBRSxxQkFBcUIsYUFHbkYsWUFBWSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsYUFIVCxRQUFRLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixFQUs3RCxhQUFhOzRHQUVsQyxjQUFjLFlBSmYsWUFBWSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsRUFFekIsYUFBYTsyRkFFbEMsY0FBYztrQkFMMUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxDQUFDO29CQUMxRCxZQUFZLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDcEMsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsYUFBYSxDQUFDO2lCQUMvQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDbGFyaXR5SWNvbnMsIHdpbmRvd0Nsb3NlSWNvbiB9IGZyb20gJ0BjZHMvY29yZS9pY29uJztcblxuaW1wb3J0IHsgQ2xySWNvbk1vZHVsZSB9IGZyb20gJy4uL2ljb24vaWNvbi5tb2R1bGUnO1xuaW1wb3J0IHsgQ2RrVHJhcEZvY3VzTW9kdWxlIH0gZnJvbSAnLi4vdXRpbHMvY2RrL2Nkay10cmFwLWZvY3VzLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJNb2RhbCB9IGZyb20gJy4vbW9kYWwnO1xuaW1wb3J0IHsgQ2xyTW9kYWxCb2R5IH0gZnJvbSAnLi9tb2RhbC1ib2R5JztcbmltcG9ydCB7IENsck1vZGFsSG9zdENvbXBvbmVudCB9IGZyb20gJy4vbW9kYWwtaG9zdC5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgQ0xSX01PREFMX0RJUkVDVElWRVM6IFR5cGU8YW55PltdID0gW0Nsck1vZGFsLCBDbHJNb2RhbEJvZHksIENsck1vZGFsSG9zdENvbXBvbmVudF07XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIENka1RyYXBGb2N1c01vZHVsZSwgQ2xySWNvbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0NMUl9NT0RBTF9ESVJFQ1RJVkVTXSxcbiAgZXhwb3J0czogW0NMUl9NT0RBTF9ESVJFQ1RJVkVTLCBDbHJJY29uTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyTW9kYWxNb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBDbGFyaXR5SWNvbnMuYWRkSWNvbnMod2luZG93Q2xvc2VJY29uKTtcbiAgfVxufVxuIl19