/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccordionModel } from '../models/accordion.model';
import * as i0 from "@angular/core";
export class AccordionService {
    constructor() {
        this.accordion = new AccordionModel();
        this._panelsChanges = new BehaviorSubject(this.accordion.panels);
    }
    getPanelChanges(panelId) {
        return this._panelsChanges.pipe(map(panels => panels.find(s => s.id === panelId)));
    }
    setStrategy(strategy) {
        this.accordion.setStrategy(strategy);
    }
    addPanel(panelId, open = false) {
        this.accordion.addPanel(panelId, open);
        this.emitUpdatedPanels();
    }
    togglePanel(panelId, open) {
        this.accordion.togglePanel(panelId, open);
        this.emitUpdatedPanels();
    }
    disablePanel(panelId, disabled) {
        this.accordion.disablePanel(panelId, disabled);
        this.emitUpdatedPanels();
    }
    updatePanelOrder(ids) {
        this.accordion.updatePanelOrder(ids);
        this.emitUpdatedPanels();
    }
    emitUpdatedPanels() {
        this._panelsChanges.next(this.accordion.panels);
    }
}
AccordionService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: AccordionService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
AccordionService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: AccordionService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: AccordionService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9hY2NvcmRpb24vcHJvdmlkZXJzL2FjY29yZGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUdyQyxPQUFPLEVBQUUsY0FBYyxFQUF1QixNQUFNLDJCQUEyQixDQUFDOztBQUdoRixNQUFNLE9BQU8sZ0JBQWdCO0lBRDdCO1FBRVksY0FBUyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDeEIsbUJBQWMsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBaUNoRjtJQS9CQyxlQUFlLENBQUMsT0FBZTtRQUM3QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBRUQsV0FBVyxDQUFDLFFBQTJCO1FBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxRQUFRLENBQUMsT0FBZSxFQUFFLElBQUksR0FBRyxLQUFLO1FBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQWUsRUFBRSxJQUFjO1FBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsWUFBWSxDQUFDLE9BQWUsRUFBRSxRQUFrQjtRQUM5QyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELGdCQUFnQixDQUFDLEdBQWE7UUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRVMsaUJBQWlCO1FBQ3pCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEQsQ0FBQzs7NkdBbENVLGdCQUFnQjtpSEFBaEIsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBRDVCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBBY2NvcmRpb25TdHJhdGVneSB9IGZyb20gJy4uL2VudW1zL2FjY29yZGlvbi1zdHJhdGVneS5lbnVtJztcbmltcG9ydCB7IEFjY29yZGlvbk1vZGVsLCBBY2NvcmRpb25QYW5lbE1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2FjY29yZGlvbi5tb2RlbCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBBY2NvcmRpb25TZXJ2aWNlIHtcbiAgcHJvdGVjdGVkIGFjY29yZGlvbiA9IG5ldyBBY2NvcmRpb25Nb2RlbCgpO1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgX3BhbmVsc0NoYW5nZXMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KHRoaXMuYWNjb3JkaW9uLnBhbmVscyk7XG5cbiAgZ2V0UGFuZWxDaGFuZ2VzKHBhbmVsSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8QWNjb3JkaW9uUGFuZWxNb2RlbD4ge1xuICAgIHJldHVybiB0aGlzLl9wYW5lbHNDaGFuZ2VzLnBpcGUobWFwKHBhbmVscyA9PiBwYW5lbHMuZmluZChzID0+IHMuaWQgPT09IHBhbmVsSWQpKSk7XG4gIH1cblxuICBzZXRTdHJhdGVneShzdHJhdGVneTogQWNjb3JkaW9uU3RyYXRlZ3kpIHtcbiAgICB0aGlzLmFjY29yZGlvbi5zZXRTdHJhdGVneShzdHJhdGVneSk7XG4gIH1cblxuICBhZGRQYW5lbChwYW5lbElkOiBzdHJpbmcsIG9wZW4gPSBmYWxzZSkge1xuICAgIHRoaXMuYWNjb3JkaW9uLmFkZFBhbmVsKHBhbmVsSWQsIG9wZW4pO1xuICAgIHRoaXMuZW1pdFVwZGF0ZWRQYW5lbHMoKTtcbiAgfVxuXG4gIHRvZ2dsZVBhbmVsKHBhbmVsSWQ6IHN0cmluZywgb3Blbj86IGJvb2xlYW4pIHtcbiAgICB0aGlzLmFjY29yZGlvbi50b2dnbGVQYW5lbChwYW5lbElkLCBvcGVuKTtcbiAgICB0aGlzLmVtaXRVcGRhdGVkUGFuZWxzKCk7XG4gIH1cblxuICBkaXNhYmxlUGFuZWwocGFuZWxJZDogc3RyaW5nLCBkaXNhYmxlZD86IGJvb2xlYW4pIHtcbiAgICB0aGlzLmFjY29yZGlvbi5kaXNhYmxlUGFuZWwocGFuZWxJZCwgZGlzYWJsZWQpO1xuICAgIHRoaXMuZW1pdFVwZGF0ZWRQYW5lbHMoKTtcbiAgfVxuXG4gIHVwZGF0ZVBhbmVsT3JkZXIoaWRzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuYWNjb3JkaW9uLnVwZGF0ZVBhbmVsT3JkZXIoaWRzKTtcbiAgICB0aGlzLmVtaXRVcGRhdGVkUGFuZWxzKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZW1pdFVwZGF0ZWRQYW5lbHMoKSB7XG4gICAgdGhpcy5fcGFuZWxzQ2hhbmdlcy5uZXh0KHRoaXMuYWNjb3JkaW9uLnBhbmVscyk7XG4gIH1cbn1cbiJdfQ==