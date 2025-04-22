/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { angleIcon, calendarIcon, checkCircleIcon, ClarityIcons, eventIcon, exclamationCircleIcon, } from '@cds/core/icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrVerticalNavModule } from '../../layout';
import { CdkTrapFocusModule } from '../../utils/cdk/cdk-trap-focus.module';
import { ClrConditionalModule } from '../../utils/conditional/conditional.module';
import { ClrHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { ClrPopoverModuleNext } from '../../utils/popover/popover.module';
import { ClrCommonFormsModule } from '../common/common.module';
import { ClrCalendar } from './calendar';
import { ClrDateContainer } from './date-container';
import { ClrEndDateInput } from './date-end-input';
import { ClrDateInputValidator, ClrEndDateInputValidator, ClrStartDateInputValidator } from './date-input.validator';
import { ClrDateInput } from './date-single-input';
import { ClrStartDateInput } from './date-start-input';
import { ClrDatepickerActions } from './datepicker-action-buttons';
import { ClrDatepickerViewManager } from './datepicker-view-manager';
import { ClrDay } from './day';
import { ClrDaypicker } from './daypicker';
import { ClrMonthpicker } from './monthpicker';
import { ClrYearpicker } from './yearpicker';
import * as i0 from "@angular/core";
export const CLR_DATEPICKER_DIRECTIVES = [
    ClrDay,
    ClrDateContainer,
    ClrDateInput,
    ClrDateInputValidator,
    ClrStartDateInput,
    ClrEndDateInput,
    ClrStartDateInputValidator,
    ClrEndDateInputValidator,
    ClrDatepickerViewManager,
    ClrMonthpicker,
    ClrYearpicker,
    ClrDaypicker,
    ClrCalendar,
    ClrDatepickerActions,
];
export class ClrDatepickerModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon, angleIcon, eventIcon, calendarIcon);
    }
}
ClrDatepickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatepickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrDatepickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrDatepickerModule, declarations: [ClrDay,
        ClrDateContainer,
        ClrDateInput,
        ClrDateInputValidator,
        ClrStartDateInput,
        ClrEndDateInput,
        ClrStartDateInputValidator,
        ClrEndDateInputValidator,
        ClrDatepickerViewManager,
        ClrMonthpicker,
        ClrYearpicker,
        ClrDaypicker,
        ClrCalendar,
        ClrDatepickerActions], imports: [CommonModule,
        CdkTrapFocusModule,
        ClrHostWrappingModule,
        ClrConditionalModule,
        ClrPopoverModuleNext,
        ClrIconModule,
        ClrCommonFormsModule,
        ClrVerticalNavModule], exports: [ClrDay,
        ClrDateContainer,
        ClrDateInput,
        ClrDateInputValidator,
        ClrStartDateInput,
        ClrEndDateInput,
        ClrStartDateInputValidator,
        ClrEndDateInputValidator,
        ClrDatepickerViewManager,
        ClrMonthpicker,
        ClrYearpicker,
        ClrDaypicker,
        ClrCalendar,
        ClrDatepickerActions] });
ClrDatepickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatepickerModule, imports: [CommonModule,
        CdkTrapFocusModule,
        ClrHostWrappingModule,
        ClrConditionalModule,
        ClrPopoverModuleNext,
        ClrIconModule,
        ClrCommonFormsModule,
        ClrVerticalNavModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatepickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        CdkTrapFocusModule,
                        ClrHostWrappingModule,
                        ClrConditionalModule,
                        ClrPopoverModuleNext,
                        ClrIconModule,
                        ClrCommonFormsModule,
                        ClrVerticalNavModule,
                    ],
                    declarations: [CLR_DATEPICKER_DIRECTIVES],
                    exports: [CLR_DATEPICKER_DIRECTIVES],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRlcGlja2VyL2RhdGVwaWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFDL0MsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFlBQVksRUFDWixTQUFTLEVBQ1QscUJBQXFCLEdBQ3RCLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNwRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNsRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUN2RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsd0JBQXdCLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNySCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDdkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDbkUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDckUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUMvQixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGNBQWMsQ0FBQzs7QUFFN0MsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQWdCO0lBQ3BELE1BQU07SUFDTixnQkFBZ0I7SUFDaEIsWUFBWTtJQUNaLHFCQUFxQjtJQUNyQixpQkFBaUI7SUFDakIsZUFBZTtJQUNmLDBCQUEwQjtJQUMxQix3QkFBd0I7SUFDeEIsd0JBQXdCO0lBQ3hCLGNBQWM7SUFDZCxhQUFhO0lBQ2IsWUFBWTtJQUNaLFdBQVc7SUFDWCxvQkFBb0I7Q0FDckIsQ0FBQztBQWdCRixNQUFNLE9BQU8sbUJBQW1CO0lBQzlCO1FBQ0UsWUFBWSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNwRyxDQUFDOztnSEFIVSxtQkFBbUI7aUhBQW5CLG1CQUFtQixpQkE5QjlCLE1BQU07UUFDTixnQkFBZ0I7UUFDaEIsWUFBWTtRQUNaLHFCQUFxQjtRQUNyQixpQkFBaUI7UUFDakIsZUFBZTtRQUNmLDBCQUEwQjtRQUMxQix3QkFBd0I7UUFDeEIsd0JBQXdCO1FBQ3hCLGNBQWM7UUFDZCxhQUFhO1FBQ2IsWUFBWTtRQUNaLFdBQVc7UUFDWCxvQkFBb0IsYUFLbEIsWUFBWTtRQUNaLGtCQUFrQjtRQUNsQixxQkFBcUI7UUFDckIsb0JBQW9CO1FBQ3BCLG9CQUFvQjtRQUNwQixhQUFhO1FBQ2Isb0JBQW9CO1FBQ3BCLG9CQUFvQixhQXpCdEIsTUFBTTtRQUNOLGdCQUFnQjtRQUNoQixZQUFZO1FBQ1oscUJBQXFCO1FBQ3JCLGlCQUFpQjtRQUNqQixlQUFlO1FBQ2YsMEJBQTBCO1FBQzFCLHdCQUF3QjtRQUN4Qix3QkFBd0I7UUFDeEIsY0FBYztRQUNkLGFBQWE7UUFDYixZQUFZO1FBQ1osV0FBVztRQUNYLG9CQUFvQjtpSEFpQlQsbUJBQW1CLFlBWjVCLFlBQVk7UUFDWixrQkFBa0I7UUFDbEIscUJBQXFCO1FBQ3JCLG9CQUFvQjtRQUNwQixvQkFBb0I7UUFDcEIsYUFBYTtRQUNiLG9CQUFvQjtRQUNwQixvQkFBb0I7MkZBS1gsbUJBQW1CO2tCQWQvQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLGtCQUFrQjt3QkFDbEIscUJBQXFCO3dCQUNyQixvQkFBb0I7d0JBQ3BCLG9CQUFvQjt3QkFDcEIsYUFBYTt3QkFDYixvQkFBb0I7d0JBQ3BCLG9CQUFvQjtxQkFDckI7b0JBQ0QsWUFBWSxFQUFFLENBQUMseUJBQXlCLENBQUM7b0JBQ3pDLE9BQU8sRUFBRSxDQUFDLHlCQUF5QixDQUFDO2lCQUNyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBhbmdsZUljb24sXG4gIGNhbGVuZGFySWNvbixcbiAgY2hlY2tDaXJjbGVJY29uLFxuICBDbGFyaXR5SWNvbnMsXG4gIGV2ZW50SWNvbixcbiAgZXhjbGFtYXRpb25DaXJjbGVJY29uLFxufSBmcm9tICdAY2RzL2NvcmUvaWNvbic7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi8uLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENsclZlcnRpY2FsTmF2TW9kdWxlIH0gZnJvbSAnLi4vLi4vbGF5b3V0JztcbmltcG9ydCB7IENka1RyYXBGb2N1c01vZHVsZSB9IGZyb20gJy4uLy4uL3V0aWxzL2Nkay9jZGstdHJhcC1mb2N1cy5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyQ29uZGl0aW9uYWxNb2R1bGUgfSBmcm9tICcuLi8uLi91dGlscy9jb25kaXRpb25hbC9jb25kaXRpb25hbC5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xySG9zdFdyYXBwaW5nTW9kdWxlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaG9zdC13cmFwcGluZy9ob3N0LXdyYXBwaW5nLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyTW9kdWxlTmV4dCB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcG9wb3Zlci5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyQ29tbW9uRm9ybXNNb2R1bGUgfSBmcm9tICcuLi9jb21tb24vY29tbW9uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJDYWxlbmRhciB9IGZyb20gJy4vY2FsZW5kYXInO1xuaW1wb3J0IHsgQ2xyRGF0ZUNvbnRhaW5lciB9IGZyb20gJy4vZGF0ZS1jb250YWluZXInO1xuaW1wb3J0IHsgQ2xyRW5kRGF0ZUlucHV0IH0gZnJvbSAnLi9kYXRlLWVuZC1pbnB1dCc7XG5pbXBvcnQgeyBDbHJEYXRlSW5wdXRWYWxpZGF0b3IsIENsckVuZERhdGVJbnB1dFZhbGlkYXRvciwgQ2xyU3RhcnREYXRlSW5wdXRWYWxpZGF0b3IgfSBmcm9tICcuL2RhdGUtaW5wdXQudmFsaWRhdG9yJztcbmltcG9ydCB7IENsckRhdGVJbnB1dCB9IGZyb20gJy4vZGF0ZS1zaW5nbGUtaW5wdXQnO1xuaW1wb3J0IHsgQ2xyU3RhcnREYXRlSW5wdXQgfSBmcm9tICcuL2RhdGUtc3RhcnQtaW5wdXQnO1xuaW1wb3J0IHsgQ2xyRGF0ZXBpY2tlckFjdGlvbnMgfSBmcm9tICcuL2RhdGVwaWNrZXItYWN0aW9uLWJ1dHRvbnMnO1xuaW1wb3J0IHsgQ2xyRGF0ZXBpY2tlclZpZXdNYW5hZ2VyIH0gZnJvbSAnLi9kYXRlcGlja2VyLXZpZXctbWFuYWdlcic7XG5pbXBvcnQgeyBDbHJEYXkgfSBmcm9tICcuL2RheSc7XG5pbXBvcnQgeyBDbHJEYXlwaWNrZXIgfSBmcm9tICcuL2RheXBpY2tlcic7XG5pbXBvcnQgeyBDbHJNb250aHBpY2tlciB9IGZyb20gJy4vbW9udGhwaWNrZXInO1xuaW1wb3J0IHsgQ2xyWWVhcnBpY2tlciB9IGZyb20gJy4veWVhcnBpY2tlcic7XG5cbmV4cG9ydCBjb25zdCBDTFJfREFURVBJQ0tFUl9ESVJFQ1RJVkVTOiBUeXBlPGFueT5bXSA9IFtcbiAgQ2xyRGF5LFxuICBDbHJEYXRlQ29udGFpbmVyLFxuICBDbHJEYXRlSW5wdXQsXG4gIENsckRhdGVJbnB1dFZhbGlkYXRvcixcbiAgQ2xyU3RhcnREYXRlSW5wdXQsXG4gIENsckVuZERhdGVJbnB1dCxcbiAgQ2xyU3RhcnREYXRlSW5wdXRWYWxpZGF0b3IsXG4gIENsckVuZERhdGVJbnB1dFZhbGlkYXRvcixcbiAgQ2xyRGF0ZXBpY2tlclZpZXdNYW5hZ2VyLFxuICBDbHJNb250aHBpY2tlcixcbiAgQ2xyWWVhcnBpY2tlcixcbiAgQ2xyRGF5cGlja2VyLFxuICBDbHJDYWxlbmRhcixcbiAgQ2xyRGF0ZXBpY2tlckFjdGlvbnMsXG5dO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIENka1RyYXBGb2N1c01vZHVsZSxcbiAgICBDbHJIb3N0V3JhcHBpbmdNb2R1bGUsXG4gICAgQ2xyQ29uZGl0aW9uYWxNb2R1bGUsXG4gICAgQ2xyUG9wb3Zlck1vZHVsZU5leHQsXG4gICAgQ2xySWNvbk1vZHVsZSxcbiAgICBDbHJDb21tb25Gb3Jtc01vZHVsZSxcbiAgICBDbHJWZXJ0aWNhbE5hdk1vZHVsZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbQ0xSX0RBVEVQSUNLRVJfRElSRUNUSVZFU10sXG4gIGV4cG9ydHM6IFtDTFJfREFURVBJQ0tFUl9ESVJFQ1RJVkVTXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0ZXBpY2tlck1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIENsYXJpdHlJY29ucy5hZGRJY29ucyhleGNsYW1hdGlvbkNpcmNsZUljb24sIGNoZWNrQ2lyY2xlSWNvbiwgYW5nbGVJY29uLCBldmVudEljb24sIGNhbGVuZGFySWNvbik7XG4gIH1cbn1cbiJdfQ==