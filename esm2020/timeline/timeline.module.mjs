/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { circleIcon, ClarityIcons, dotCircleIcon, errorStandardIcon, successStandardIcon } from '@cds/core/icon';
import { ClrIconModule } from '../icon/icon.module';
import { ClrSpinnerModule } from '../progress/spinner/spinner.module';
import { ClrTimeline } from './timeline';
import { ClrTimelineStep } from './timeline-step';
import { ClrTimelineStepDescription } from './timeline-step-description';
import { ClrTimelineStepHeader } from './timeline-step-header';
import { ClrTimelineStepTitle } from './timeline-step-title';
import * as i0 from "@angular/core";
const CLR_TIMELINE_DIRECTIVES = [
    ClrTimeline,
    ClrTimelineStep,
    ClrTimelineStepDescription,
    ClrTimelineStepHeader,
    ClrTimelineStepTitle,
];
export class ClrTimelineModule {
    constructor() {
        ClarityIcons.addIcons(circleIcon, dotCircleIcon, errorStandardIcon, successStandardIcon);
    }
}
ClrTimelineModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTimelineModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrTimelineModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrTimelineModule, declarations: [ClrTimeline,
        ClrTimelineStep,
        ClrTimelineStepDescription,
        ClrTimelineStepHeader,
        ClrTimelineStepTitle], imports: [CommonModule, ClrIconModule, ClrSpinnerModule], exports: [ClrTimeline,
        ClrTimelineStep,
        ClrTimelineStepDescription,
        ClrTimelineStepHeader,
        ClrTimelineStepTitle, ClrIconModule, ClrSpinnerModule] });
ClrTimelineModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTimelineModule, imports: [CommonModule, ClrIconModule, ClrSpinnerModule, ClrIconModule, ClrSpinnerModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTimelineModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIconModule, ClrSpinnerModule],
                    exports: [...CLR_TIMELINE_DIRECTIVES, ClrIconModule, ClrSpinnerModule],
                    declarations: [CLR_TIMELINE_DIRECTIVES],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZWxpbmUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdGltZWxpbmUvdGltZWxpbmUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFakgsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDOztBQUU3RCxNQUFNLHVCQUF1QixHQUFnQjtJQUMzQyxXQUFXO0lBQ1gsZUFBZTtJQUNmLDBCQUEwQjtJQUMxQixxQkFBcUI7SUFDckIsb0JBQW9CO0NBQ3JCLENBQUM7QUFPRixNQUFNLE9BQU8saUJBQWlCO0lBQzVCO1FBQ0UsWUFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDM0YsQ0FBQzs7OEdBSFUsaUJBQWlCOytHQUFqQixpQkFBaUIsaUJBWjVCLFdBQVc7UUFDWCxlQUFlO1FBQ2YsMEJBQTBCO1FBQzFCLHFCQUFxQjtRQUNyQixvQkFBb0IsYUFJVixZQUFZLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixhQVJ2RCxXQUFXO1FBQ1gsZUFBZTtRQUNmLDBCQUEwQjtRQUMxQixxQkFBcUI7UUFDckIsb0JBQW9CLEVBS2tCLGFBQWEsRUFBRSxnQkFBZ0I7K0dBRzFELGlCQUFpQixZQUpsQixZQUFZLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUNqQixhQUFhLEVBQUUsZ0JBQWdCOzJGQUcxRCxpQkFBaUI7a0JBTDdCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQztvQkFDeEQsT0FBTyxFQUFFLENBQUMsR0FBRyx1QkFBdUIsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLENBQUM7b0JBQ3RFLFlBQVksRUFBRSxDQUFDLHVCQUF1QixDQUFDO2lCQUN4QyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjaXJjbGVJY29uLCBDbGFyaXR5SWNvbnMsIGRvdENpcmNsZUljb24sIGVycm9yU3RhbmRhcmRJY29uLCBzdWNjZXNzU3RhbmRhcmRJY29uIH0gZnJvbSAnQGNkcy9jb3JlL2ljb24nO1xuXG5pbXBvcnQgeyBDbHJJY29uTW9kdWxlIH0gZnJvbSAnLi4vaWNvbi9pY29uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJTcGlubmVyTW9kdWxlIH0gZnJvbSAnLi4vcHJvZ3Jlc3Mvc3Bpbm5lci9zcGlubmVyLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJUaW1lbGluZSB9IGZyb20gJy4vdGltZWxpbmUnO1xuaW1wb3J0IHsgQ2xyVGltZWxpbmVTdGVwIH0gZnJvbSAnLi90aW1lbGluZS1zdGVwJztcbmltcG9ydCB7IENsclRpbWVsaW5lU3RlcERlc2NyaXB0aW9uIH0gZnJvbSAnLi90aW1lbGluZS1zdGVwLWRlc2NyaXB0aW9uJztcbmltcG9ydCB7IENsclRpbWVsaW5lU3RlcEhlYWRlciB9IGZyb20gJy4vdGltZWxpbmUtc3RlcC1oZWFkZXInO1xuaW1wb3J0IHsgQ2xyVGltZWxpbmVTdGVwVGl0bGUgfSBmcm9tICcuL3RpbWVsaW5lLXN0ZXAtdGl0bGUnO1xuXG5jb25zdCBDTFJfVElNRUxJTkVfRElSRUNUSVZFUzogVHlwZTxhbnk+W10gPSBbXG4gIENsclRpbWVsaW5lLFxuICBDbHJUaW1lbGluZVN0ZXAsXG4gIENsclRpbWVsaW5lU3RlcERlc2NyaXB0aW9uLFxuICBDbHJUaW1lbGluZVN0ZXBIZWFkZXIsXG4gIENsclRpbWVsaW5lU3RlcFRpdGxlLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQ2xySWNvbk1vZHVsZSwgQ2xyU3Bpbm5lck1vZHVsZV0sXG4gIGV4cG9ydHM6IFsuLi5DTFJfVElNRUxJTkVfRElSRUNUSVZFUywgQ2xySWNvbk1vZHVsZSwgQ2xyU3Bpbm5lck1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0NMUl9USU1FTElORV9ESVJFQ1RJVkVTXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyVGltZWxpbmVNb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBDbGFyaXR5SWNvbnMuYWRkSWNvbnMoY2lyY2xlSWNvbiwgZG90Q2lyY2xlSWNvbiwgZXJyb3JTdGFuZGFyZEljb24sIHN1Y2Nlc3NTdGFuZGFyZEljb24pO1xuICB9XG59XG4iXX0=