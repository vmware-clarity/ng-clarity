/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityIcons, infoCircleIcon, windowCloseIcon } from '@cds/core/icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrConditionalModule } from '../../utils/conditional/conditional.module';
import { ClrFocusOnViewInitModule } from '../../utils/focus/focus-on-view-init/focus-on-view-init.module';
import { ClrSignpost } from './signpost';
import { ClrSignpostContent } from './signpost-content';
import { ClrSignpostTitle } from './signpost-title';
import { ClrSignpostTrigger } from './signpost-trigger';
import * as i0 from "@angular/core";
export const CLR_SIGNPOST_DIRECTIVES = [
    ClrSignpost,
    ClrSignpostContent,
    ClrSignpostTrigger,
    ClrSignpostTitle,
];
export class ClrSignpostModule {
    constructor() {
        ClarityIcons.addIcons(windowCloseIcon, infoCircleIcon);
    }
}
ClrSignpostModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSignpostModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrSignpostModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrSignpostModule, declarations: [ClrSignpost,
        ClrSignpostContent,
        ClrSignpostTrigger,
        ClrSignpostTitle], imports: [CommonModule, ClrIconModule, ClrFocusOnViewInitModule], exports: [ClrSignpost,
        ClrSignpostContent,
        ClrSignpostTrigger,
        ClrSignpostTitle, ClrConditionalModule] });
ClrSignpostModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSignpostModule, imports: [CommonModule, ClrIconModule, ClrFocusOnViewInitModule, ClrConditionalModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSignpostModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIconModule, ClrFocusOnViewInitModule],
                    declarations: [CLR_SIGNPOST_DIRECTIVES],
                    exports: [CLR_SIGNPOST_DIRECTIVES, ClrConditionalModule],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnBvc3QubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvcG9wb3Zlci9zaWducG9zdC9zaWducG9zdC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBUSxNQUFNLGVBQWUsQ0FBQztBQUMvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUvRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbEYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sZ0VBQWdFLENBQUM7QUFDMUcsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN6QyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQzs7QUFFeEQsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQWdCO0lBQ2xELFdBQVc7SUFDWCxrQkFBa0I7SUFDbEIsa0JBQWtCO0lBQ2xCLGdCQUFnQjtDQUNqQixDQUFDO0FBT0YsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QjtRQUNFLFlBQVksQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7OzhHQUhVLGlCQUFpQjsrR0FBakIsaUJBQWlCLGlCQVg1QixXQUFXO1FBQ1gsa0JBQWtCO1FBQ2xCLGtCQUFrQjtRQUNsQixnQkFBZ0IsYUFJTixZQUFZLEVBQUUsYUFBYSxFQUFFLHdCQUF3QixhQVAvRCxXQUFXO1FBQ1gsa0JBQWtCO1FBQ2xCLGtCQUFrQjtRQUNsQixnQkFBZ0IsRUFNbUIsb0JBQW9COytHQUU1QyxpQkFBaUIsWUFKbEIsWUFBWSxFQUFFLGFBQWEsRUFBRSx3QkFBd0IsRUFFNUIsb0JBQW9COzJGQUU1QyxpQkFBaUI7a0JBTDdCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSx3QkFBd0IsQ0FBQztvQkFDaEUsWUFBWSxFQUFFLENBQUMsdUJBQXVCLENBQUM7b0JBQ3ZDLE9BQU8sRUFBRSxDQUFDLHVCQUF1QixFQUFFLG9CQUFvQixDQUFDO2lCQUN6RCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDbGFyaXR5SWNvbnMsIGluZm9DaXJjbGVJY29uLCB3aW5kb3dDbG9zZUljb24gfSBmcm9tICdAY2RzL2NvcmUvaWNvbic7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi8uLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENsckNvbmRpdGlvbmFsTW9kdWxlIH0gZnJvbSAnLi4vLi4vdXRpbHMvY29uZGl0aW9uYWwvY29uZGl0aW9uYWwubW9kdWxlJztcbmltcG9ydCB7IENsckZvY3VzT25WaWV3SW5pdE1vZHVsZSB9IGZyb20gJy4uLy4uL3V0aWxzL2ZvY3VzL2ZvY3VzLW9uLXZpZXctaW5pdC9mb2N1cy1vbi12aWV3LWluaXQubW9kdWxlJztcbmltcG9ydCB7IENsclNpZ25wb3N0IH0gZnJvbSAnLi9zaWducG9zdCc7XG5pbXBvcnQgeyBDbHJTaWducG9zdENvbnRlbnQgfSBmcm9tICcuL3NpZ25wb3N0LWNvbnRlbnQnO1xuaW1wb3J0IHsgQ2xyU2lnbnBvc3RUaXRsZSB9IGZyb20gJy4vc2lnbnBvc3QtdGl0bGUnO1xuaW1wb3J0IHsgQ2xyU2lnbnBvc3RUcmlnZ2VyIH0gZnJvbSAnLi9zaWducG9zdC10cmlnZ2VyJztcblxuZXhwb3J0IGNvbnN0IENMUl9TSUdOUE9TVF9ESVJFQ1RJVkVTOiBUeXBlPGFueT5bXSA9IFtcbiAgQ2xyU2lnbnBvc3QsXG4gIENsclNpZ25wb3N0Q29udGVudCxcbiAgQ2xyU2lnbnBvc3RUcmlnZ2VyLFxuICBDbHJTaWducG9zdFRpdGxlLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQ2xySWNvbk1vZHVsZSwgQ2xyRm9jdXNPblZpZXdJbml0TW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbQ0xSX1NJR05QT1NUX0RJUkVDVElWRVNdLFxuICBleHBvcnRzOiBbQ0xSX1NJR05QT1NUX0RJUkVDVElWRVMsIENsckNvbmRpdGlvbmFsTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyU2lnbnBvc3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBDbGFyaXR5SWNvbnMuYWRkSWNvbnMod2luZG93Q2xvc2VJY29uLCBpbmZvQ2lyY2xlSWNvbik7XG4gIH1cbn1cbiJdfQ==