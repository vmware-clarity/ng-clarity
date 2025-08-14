/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { ClrTimelineStepState } from '../enums/timeline-step-state.enum';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/i18n/common-strings.service";
export class TimelineIconAttributeService {
    constructor(commonStrings) {
        this.attributeMap = new Map();
        this.attributeMap.set(ClrTimelineStepState.NOT_STARTED, {
            iconShape: 'circle',
            iconStatus: null,
            ariaLabel: commonStrings.keys.timelineStepNotStarted,
        });
        this.attributeMap.set(ClrTimelineStepState.CURRENT, {
            iconShape: 'dot-circle',
            iconStatus: 'info',
            ariaLabel: commonStrings.keys.timelineStepCurrent,
        });
        this.attributeMap.set(ClrTimelineStepState.PROCESSING, {
            iconShape: undefined,
            iconStatus: null,
            ariaLabel: commonStrings.keys.timelineStepProcessing,
        });
        this.attributeMap.set(ClrTimelineStepState.SUCCESS, {
            iconShape: 'success-standard',
            iconStatus: 'success',
            ariaLabel: commonStrings.keys.timelineStepSuccess,
        });
        this.attributeMap.set(ClrTimelineStepState.ERROR, {
            iconShape: 'error-standard',
            iconStatus: 'danger',
            ariaLabel: commonStrings.keys.timelineStepError,
        });
    }
    getAriaLabel(step) {
        return this.attributeMap.get(step).ariaLabel;
    }
    getIconShape(step) {
        return this.attributeMap.get(step).iconShape;
    }
    getIconStatus(step) {
        return this.attributeMap.get(step).iconStatus;
    }
}
TimelineIconAttributeService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TimelineIconAttributeService, deps: [{ token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Injectable });
TimelineIconAttributeService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TimelineIconAttributeService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TimelineIconAttributeService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.ClrCommonStringsService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZWxpbmUtaWNvbi1hdHRyaWJ1dGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3RpbWVsaW5lL3Byb3ZpZGVycy90aW1lbGluZS1pY29uLWF0dHJpYnV0ZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQzs7O0FBSXpFLE1BQU0sT0FBTyw0QkFBNEI7SUFHdkMsWUFBWSxhQUFzQztRQUYxQyxpQkFBWSxHQUE4QyxJQUFJLEdBQUcsRUFBd0MsQ0FBQztRQUdoSCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUU7WUFDdEQsU0FBUyxFQUFFLFFBQVE7WUFDbkIsVUFBVSxFQUFFLElBQUk7WUFDaEIsU0FBUyxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsc0JBQXNCO1NBQ3JELENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sRUFBRTtZQUNsRCxTQUFTLEVBQUUsWUFBWTtZQUN2QixVQUFVLEVBQUUsTUFBTTtZQUNsQixTQUFTLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxtQkFBbUI7U0FDbEQsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsVUFBVSxFQUFFO1lBQ3JELFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFNBQVMsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLHNCQUFzQjtTQUNyRCxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUU7WUFDbEQsU0FBUyxFQUFFLGtCQUFrQjtZQUM3QixVQUFVLEVBQUUsU0FBUztZQUNyQixTQUFTLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxtQkFBbUI7U0FDbEQsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFO1lBQ2hELFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLFFBQVE7WUFDcEIsU0FBUyxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCO1NBQ2hELENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxZQUFZLENBQUMsSUFBMEI7UUFDckMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDL0MsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUEwQjtRQUNyQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsYUFBYSxDQUFDLElBQTBCO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQ2hELENBQUM7O3lIQXpDVSw0QkFBNEI7NkhBQTVCLDRCQUE0QjsyRkFBNUIsNEJBQTRCO2tCQUR4QyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IENsclRpbWVsaW5lU3RlcFN0YXRlIH0gZnJvbSAnLi4vZW51bXMvdGltZWxpbmUtc3RlcC1zdGF0ZS5lbnVtJztcbmltcG9ydCB7IEljb25BdHRyaWJ1dGVzIH0gZnJvbSAnLi4vaW50ZXJmYWNlL2ljb24tYXR0cmlidXRlLmludGVyZmFjZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUaW1lbGluZUljb25BdHRyaWJ1dGVTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBhdHRyaWJ1dGVNYXA6IE1hcDxDbHJUaW1lbGluZVN0ZXBTdGF0ZSwgSWNvbkF0dHJpYnV0ZXM+ID0gbmV3IE1hcDxDbHJUaW1lbGluZVN0ZXBTdGF0ZSwgSWNvbkF0dHJpYnV0ZXM+KCk7XG5cbiAgY29uc3RydWN0b3IoY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UpIHtcbiAgICB0aGlzLmF0dHJpYnV0ZU1hcC5zZXQoQ2xyVGltZWxpbmVTdGVwU3RhdGUuTk9UX1NUQVJURUQsIHtcbiAgICAgIGljb25TaGFwZTogJ2NpcmNsZScsXG4gICAgICBpY29uU3RhdHVzOiBudWxsLFxuICAgICAgYXJpYUxhYmVsOiBjb21tb25TdHJpbmdzLmtleXMudGltZWxpbmVTdGVwTm90U3RhcnRlZCxcbiAgICB9KTtcbiAgICB0aGlzLmF0dHJpYnV0ZU1hcC5zZXQoQ2xyVGltZWxpbmVTdGVwU3RhdGUuQ1VSUkVOVCwge1xuICAgICAgaWNvblNoYXBlOiAnZG90LWNpcmNsZScsXG4gICAgICBpY29uU3RhdHVzOiAnaW5mbycsXG4gICAgICBhcmlhTGFiZWw6IGNvbW1vblN0cmluZ3Mua2V5cy50aW1lbGluZVN0ZXBDdXJyZW50LFxuICAgIH0pO1xuICAgIHRoaXMuYXR0cmlidXRlTWFwLnNldChDbHJUaW1lbGluZVN0ZXBTdGF0ZS5QUk9DRVNTSU5HLCB7XG4gICAgICBpY29uU2hhcGU6IHVuZGVmaW5lZCxcbiAgICAgIGljb25TdGF0dXM6IG51bGwsXG4gICAgICBhcmlhTGFiZWw6IGNvbW1vblN0cmluZ3Mua2V5cy50aW1lbGluZVN0ZXBQcm9jZXNzaW5nLFxuICAgIH0pO1xuICAgIHRoaXMuYXR0cmlidXRlTWFwLnNldChDbHJUaW1lbGluZVN0ZXBTdGF0ZS5TVUNDRVNTLCB7XG4gICAgICBpY29uU2hhcGU6ICdzdWNjZXNzLXN0YW5kYXJkJyxcbiAgICAgIGljb25TdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgIGFyaWFMYWJlbDogY29tbW9uU3RyaW5ncy5rZXlzLnRpbWVsaW5lU3RlcFN1Y2Nlc3MsXG4gICAgfSk7XG4gICAgdGhpcy5hdHRyaWJ1dGVNYXAuc2V0KENsclRpbWVsaW5lU3RlcFN0YXRlLkVSUk9SLCB7XG4gICAgICBpY29uU2hhcGU6ICdlcnJvci1zdGFuZGFyZCcsXG4gICAgICBpY29uU3RhdHVzOiAnZGFuZ2VyJyxcbiAgICAgIGFyaWFMYWJlbDogY29tbW9uU3RyaW5ncy5rZXlzLnRpbWVsaW5lU3RlcEVycm9yLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0QXJpYUxhYmVsKHN0ZXA6IENsclRpbWVsaW5lU3RlcFN0YXRlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVNYXAuZ2V0KHN0ZXApLmFyaWFMYWJlbDtcbiAgfVxuXG4gIGdldEljb25TaGFwZShzdGVwOiBDbHJUaW1lbGluZVN0ZXBTdGF0ZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlTWFwLmdldChzdGVwKS5pY29uU2hhcGU7XG4gIH1cblxuICBnZXRJY29uU3RhdHVzKHN0ZXA6IENsclRpbWVsaW5lU3RlcFN0YXRlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVNYXAuZ2V0KHN0ZXApLmljb25TdGF0dXM7XG4gIH1cbn1cbiJdfQ==