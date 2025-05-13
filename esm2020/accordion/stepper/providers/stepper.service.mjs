/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AccordionService } from '../../providers/accordion.service';
import { StepperModel } from '../models/stepper.model';
import * as i0 from "@angular/core";
export class StepperService extends AccordionService {
    constructor() {
        super();
        this.panelsCompleted = this.getAllCompletedPanelChanges();
        this.accordion = new StepperModel();
        this._activeStepChanges = new Subject();
        this.activeStep = this._activeStepChanges.asObservable();
    }
    resetPanels() {
        this.accordion.resetPanels();
        this.emitUpdatedPanels();
    }
    setPanelValid(panelId) {
        this.accordion.setPanelValid(panelId);
        this.emitUpdatedPanels();
    }
    setPanelInvalid(panelId) {
        this.accordion.setPanelInvalid(panelId);
        this.emitUpdatedPanels();
    }
    setPanelsWithErrors(ids) {
        this.accordion.setPanelsWithErrors(ids);
        this.emitUpdatedPanels();
    }
    navigateToPreviousPanel(currentPanelId) {
        this.accordion.navigateToPreviousPanel(currentPanelId);
        this.updatePreviousStep(currentPanelId);
        this.emitUpdatedPanels();
    }
    navigateToNextPanel(currentPanelId, currentPanelValid = true) {
        this.accordion.navigateToNextPanel(currentPanelId, currentPanelValid);
        this.updateNextStep(currentPanelId, currentPanelValid);
        this.emitUpdatedPanels();
    }
    overrideInitialPanel(panelId) {
        this.accordion.overrideInitialPanel(panelId);
        this.emitUpdatedPanels();
    }
    updateNextStep(currentPanelId, currentPanelValid) {
        const nextPanel = this.accordion.getNextPanel(currentPanelId);
        if (currentPanelValid && nextPanel) {
            this._activeStepChanges.next(nextPanel.id);
        }
        else if (currentPanelValid) {
            this._activeStepChanges.next(currentPanelId);
        }
    }
    updatePreviousStep(currentPanelId) {
        const prevPanel = this.accordion.getPreviousPanel(currentPanelId);
        if (prevPanel) {
            this._activeStepChanges.next(prevPanel.id);
        }
    }
    getAllCompletedPanelChanges() {
        return this._panelsChanges.pipe(map(() => this.accordion.allPanelsCompleted), distinctUntilChanged());
    }
}
StepperService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: StepperService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
StepperService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: StepperService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: StepperService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvYWNjb3JkaW9uL3N0ZXBwZXIvcHJvdmlkZXJzL3N0ZXBwZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0QsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDckUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlCQUF5QixDQUFDOztBQUd2RCxNQUFNLE9BQU8sY0FBZSxTQUFRLGdCQUFnQjtJQVFsRDtRQUNFLEtBQUssRUFBRSxDQUFDO1FBUEQsb0JBQWUsR0FBRyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztRQUUzQyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUUxQyx1QkFBa0IsR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBS2pELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzNELENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsYUFBYSxDQUFDLE9BQWU7UUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELGVBQWUsQ0FBQyxPQUFlO1FBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxHQUFhO1FBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELHVCQUF1QixDQUFDLGNBQXNCO1FBQzVDLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxjQUFzQixFQUFFLGlCQUFpQixHQUFHLElBQUk7UUFDbEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxPQUFlO1FBQ2xDLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVPLGNBQWMsQ0FBQyxjQUFzQixFQUFFLGlCQUEwQjtRQUN2RSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUU5RCxJQUFJLGlCQUFpQixJQUFJLFNBQVMsRUFBRTtZQUNsQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM1QzthQUFNLElBQUksaUJBQWlCLEVBQUU7WUFDNUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUM7SUFFTyxrQkFBa0IsQ0FBQyxjQUFzQjtRQUMvQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRWxFLElBQUksU0FBUyxFQUFFO1lBQ2IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDNUM7SUFDSCxDQUFDO0lBRU8sMkJBQTJCO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQzdCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEVBQzVDLG9CQUFvQixFQUFFLENBQ3ZCLENBQUM7SUFDSixDQUFDOzsyR0ExRVUsY0FBYzsrR0FBZCxjQUFjOzJGQUFkLGNBQWM7a0JBRDFCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEFjY29yZGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9wcm92aWRlcnMvYWNjb3JkaW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RlcHBlck1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL3N0ZXBwZXIubW9kZWwnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RlcHBlclNlcnZpY2UgZXh0ZW5kcyBBY2NvcmRpb25TZXJ2aWNlIHtcbiAgcmVhZG9ubHkgYWN0aXZlU3RlcDogT2JzZXJ2YWJsZTxzdHJpbmc+O1xuICByZWFkb25seSBwYW5lbHNDb21wbGV0ZWQgPSB0aGlzLmdldEFsbENvbXBsZXRlZFBhbmVsQ2hhbmdlcygpO1xuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBhY2NvcmRpb24gPSBuZXcgU3RlcHBlck1vZGVsKCk7XG5cbiAgcHJpdmF0ZSBfYWN0aXZlU3RlcENoYW5nZXMgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuYWN0aXZlU3RlcCA9IHRoaXMuX2FjdGl2ZVN0ZXBDaGFuZ2VzLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgcmVzZXRQYW5lbHMoKSB7XG4gICAgdGhpcy5hY2NvcmRpb24ucmVzZXRQYW5lbHMoKTtcbiAgICB0aGlzLmVtaXRVcGRhdGVkUGFuZWxzKCk7XG4gIH1cblxuICBzZXRQYW5lbFZhbGlkKHBhbmVsSWQ6IHN0cmluZykge1xuICAgIHRoaXMuYWNjb3JkaW9uLnNldFBhbmVsVmFsaWQocGFuZWxJZCk7XG4gICAgdGhpcy5lbWl0VXBkYXRlZFBhbmVscygpO1xuICB9XG5cbiAgc2V0UGFuZWxJbnZhbGlkKHBhbmVsSWQ6IHN0cmluZykge1xuICAgIHRoaXMuYWNjb3JkaW9uLnNldFBhbmVsSW52YWxpZChwYW5lbElkKTtcbiAgICB0aGlzLmVtaXRVcGRhdGVkUGFuZWxzKCk7XG4gIH1cblxuICBzZXRQYW5lbHNXaXRoRXJyb3JzKGlkczogc3RyaW5nW10pIHtcbiAgICB0aGlzLmFjY29yZGlvbi5zZXRQYW5lbHNXaXRoRXJyb3JzKGlkcyk7XG4gICAgdGhpcy5lbWl0VXBkYXRlZFBhbmVscygpO1xuICB9XG5cbiAgbmF2aWdhdGVUb1ByZXZpb3VzUGFuZWwoY3VycmVudFBhbmVsSWQ6IHN0cmluZykge1xuICAgIHRoaXMuYWNjb3JkaW9uLm5hdmlnYXRlVG9QcmV2aW91c1BhbmVsKGN1cnJlbnRQYW5lbElkKTtcbiAgICB0aGlzLnVwZGF0ZVByZXZpb3VzU3RlcChjdXJyZW50UGFuZWxJZCk7XG4gICAgdGhpcy5lbWl0VXBkYXRlZFBhbmVscygpO1xuICB9XG5cbiAgbmF2aWdhdGVUb05leHRQYW5lbChjdXJyZW50UGFuZWxJZDogc3RyaW5nLCBjdXJyZW50UGFuZWxWYWxpZCA9IHRydWUpIHtcbiAgICB0aGlzLmFjY29yZGlvbi5uYXZpZ2F0ZVRvTmV4dFBhbmVsKGN1cnJlbnRQYW5lbElkLCBjdXJyZW50UGFuZWxWYWxpZCk7XG4gICAgdGhpcy51cGRhdGVOZXh0U3RlcChjdXJyZW50UGFuZWxJZCwgY3VycmVudFBhbmVsVmFsaWQpO1xuICAgIHRoaXMuZW1pdFVwZGF0ZWRQYW5lbHMoKTtcbiAgfVxuXG4gIG92ZXJyaWRlSW5pdGlhbFBhbmVsKHBhbmVsSWQ6IHN0cmluZykge1xuICAgIHRoaXMuYWNjb3JkaW9uLm92ZXJyaWRlSW5pdGlhbFBhbmVsKHBhbmVsSWQpO1xuICAgIHRoaXMuZW1pdFVwZGF0ZWRQYW5lbHMoKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlTmV4dFN0ZXAoY3VycmVudFBhbmVsSWQ6IHN0cmluZywgY3VycmVudFBhbmVsVmFsaWQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXh0UGFuZWwgPSB0aGlzLmFjY29yZGlvbi5nZXROZXh0UGFuZWwoY3VycmVudFBhbmVsSWQpO1xuXG4gICAgaWYgKGN1cnJlbnRQYW5lbFZhbGlkICYmIG5leHRQYW5lbCkge1xuICAgICAgdGhpcy5fYWN0aXZlU3RlcENoYW5nZXMubmV4dChuZXh0UGFuZWwuaWQpO1xuICAgIH0gZWxzZSBpZiAoY3VycmVudFBhbmVsVmFsaWQpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZVN0ZXBDaGFuZ2VzLm5leHQoY3VycmVudFBhbmVsSWQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUHJldmlvdXNTdGVwKGN1cnJlbnRQYW5lbElkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwcmV2UGFuZWwgPSB0aGlzLmFjY29yZGlvbi5nZXRQcmV2aW91c1BhbmVsKGN1cnJlbnRQYW5lbElkKTtcblxuICAgIGlmIChwcmV2UGFuZWwpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZVN0ZXBDaGFuZ2VzLm5leHQocHJldlBhbmVsLmlkKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEFsbENvbXBsZXRlZFBhbmVsQ2hhbmdlcygpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5fcGFuZWxzQ2hhbmdlcy5waXBlKFxuICAgICAgbWFwKCgpID0+IHRoaXMuYWNjb3JkaW9uLmFsbFBhbmVsc0NvbXBsZXRlZCksXG4gICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpXG4gICAgKTtcbiAgfVxufVxuIl19