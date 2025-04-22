/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityIcons, errorStandardIcon, helpIcon, infoStandardIcon, noteIcon, successStandardIcon, warningStandardIcon, windowCloseIcon, } from '@cds/core/icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrDropdownModule } from '../../popover/dropdown/dropdown.module';
import { ClrSpinnerModule } from '../../progress/spinner';
import { ClrAlert } from './alert';
import { ClrAlertItem } from './alert-item';
import { ClrAlertText } from './alert-text';
import { ClrAlerts } from './alerts';
import { ClrAlertsPager } from './alerts-pager';
import * as i0 from "@angular/core";
export const CLR_ALERT_DIRECTIVES = [ClrAlert, ClrAlertItem, ClrAlerts, ClrAlertsPager, ClrAlertText];
export class ClrAlertModule {
    constructor() {
        ClarityIcons.addIcons(errorStandardIcon, helpIcon, infoStandardIcon, noteIcon, successStandardIcon, warningStandardIcon, windowCloseIcon);
    }
}
ClrAlertModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAlertModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrAlertModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrAlertModule, declarations: [ClrAlert, ClrAlertItem, ClrAlerts, ClrAlertsPager, ClrAlertText], imports: [CommonModule, ClrIconModule, ClrDropdownModule, ClrSpinnerModule], exports: [ClrAlert, ClrAlertItem, ClrAlerts, ClrAlertsPager, ClrAlertText] });
ClrAlertModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAlertModule, imports: [CommonModule, ClrIconModule, ClrDropdownModule, ClrSpinnerModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAlertModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIconModule, ClrDropdownModule, ClrSpinnerModule],
                    declarations: [CLR_ALERT_DIRECTIVES],
                    exports: [CLR_ALERT_DIRECTIVES],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxlcnQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZW1waGFzaXMvYWxlcnQvYWxlcnQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFDL0MsT0FBTyxFQUNMLFlBQVksRUFDWixpQkFBaUIsRUFDakIsUUFBUSxFQUNSLGdCQUFnQixFQUNoQixRQUFRLEVBQ1IsbUJBQW1CLEVBQ25CLG1CQUFtQixFQUNuQixlQUFlLEdBQ2hCLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzFELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbkMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM1QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzVDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDckMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQUVoRCxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFPbkgsTUFBTSxPQUFPLGNBQWM7SUFDekI7UUFDRSxZQUFZLENBQUMsUUFBUSxDQUNuQixpQkFBaUIsRUFDakIsUUFBUSxFQUNSLGdCQUFnQixFQUNoQixRQUFRLEVBQ1IsbUJBQW1CLEVBQ25CLG1CQUFtQixFQUNuQixlQUFlLENBQ2hCLENBQUM7SUFDSixDQUFDOzsyR0FYVSxjQUFjOzRHQUFkLGNBQWMsaUJBUHVCLFFBQVEsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxZQUFZLGFBR3JHLFlBQVksRUFBRSxhQUFhLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLGFBSDFCLFFBQVEsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxZQUFZOzRHQU9wRyxjQUFjLFlBSmYsWUFBWSxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0I7MkZBSS9ELGNBQWM7a0JBTDFCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsQ0FBQztvQkFDM0UsWUFBWSxFQUFFLENBQUMsb0JBQW9CLENBQUM7b0JBQ3BDLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixDQUFDO2lCQUNoQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDbGFyaXR5SWNvbnMsXG4gIGVycm9yU3RhbmRhcmRJY29uLFxuICBoZWxwSWNvbixcbiAgaW5mb1N0YW5kYXJkSWNvbixcbiAgbm90ZUljb24sXG4gIHN1Y2Nlc3NTdGFuZGFyZEljb24sXG4gIHdhcm5pbmdTdGFuZGFyZEljb24sXG4gIHdpbmRvd0Nsb3NlSWNvbixcbn0gZnJvbSAnQGNkcy9jb3JlL2ljb24nO1xuXG5pbXBvcnQgeyBDbHJJY29uTW9kdWxlIH0gZnJvbSAnLi4vLi4vaWNvbi9pY29uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJEcm9wZG93bk1vZHVsZSB9IGZyb20gJy4uLy4uL3BvcG92ZXIvZHJvcGRvd24vZHJvcGRvd24ubW9kdWxlJztcbmltcG9ydCB7IENsclNwaW5uZXJNb2R1bGUgfSBmcm9tICcuLi8uLi9wcm9ncmVzcy9zcGlubmVyJztcbmltcG9ydCB7IENsckFsZXJ0IH0gZnJvbSAnLi9hbGVydCc7XG5pbXBvcnQgeyBDbHJBbGVydEl0ZW0gfSBmcm9tICcuL2FsZXJ0LWl0ZW0nO1xuaW1wb3J0IHsgQ2xyQWxlcnRUZXh0IH0gZnJvbSAnLi9hbGVydC10ZXh0JztcbmltcG9ydCB7IENsckFsZXJ0cyB9IGZyb20gJy4vYWxlcnRzJztcbmltcG9ydCB7IENsckFsZXJ0c1BhZ2VyIH0gZnJvbSAnLi9hbGVydHMtcGFnZXInO1xuXG5leHBvcnQgY29uc3QgQ0xSX0FMRVJUX0RJUkVDVElWRVM6IFR5cGU8YW55PltdID0gW0NsckFsZXJ0LCBDbHJBbGVydEl0ZW0sIENsckFsZXJ0cywgQ2xyQWxlcnRzUGFnZXIsIENsckFsZXJ0VGV4dF07XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIENsckljb25Nb2R1bGUsIENsckRyb3Bkb3duTW9kdWxlLCBDbHJTcGlubmVyTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbQ0xSX0FMRVJUX0RJUkVDVElWRVNdLFxuICBleHBvcnRzOiBbQ0xSX0FMRVJUX0RJUkVDVElWRVNdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJBbGVydE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIENsYXJpdHlJY29ucy5hZGRJY29ucyhcbiAgICAgIGVycm9yU3RhbmRhcmRJY29uLFxuICAgICAgaGVscEljb24sXG4gICAgICBpbmZvU3RhbmRhcmRJY29uLFxuICAgICAgbm90ZUljb24sXG4gICAgICBzdWNjZXNzU3RhbmRhcmRJY29uLFxuICAgICAgd2FybmluZ1N0YW5kYXJkSWNvbixcbiAgICAgIHdpbmRvd0Nsb3NlSWNvblxuICAgICk7XG4gIH1cbn1cbiJdfQ==