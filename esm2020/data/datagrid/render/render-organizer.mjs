/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DatagridRenderStep } from '../enums/render-step.enum';
import * as i0 from "@angular/core";
export class DatagridRenderOrganizer {
    constructor() {
        this._renderStep = new Subject();
        this.alreadySized = false;
    }
    get renderStep() {
        return this._renderStep.asObservable();
    }
    filterRenderSteps(step) {
        return this.renderStep.pipe(filter(testStep => step === testStep));
    }
    resize() {
        this._renderStep.next(DatagridRenderStep.CALCULATE_MODE_ON);
        if (this.alreadySized) {
            this._renderStep.next(DatagridRenderStep.CLEAR_WIDTHS);
        }
        this._renderStep.next(DatagridRenderStep.COMPUTE_COLUMN_WIDTHS);
        this._renderStep.next(DatagridRenderStep.ALIGN_COLUMNS); // NOT USED
        this.alreadySized = true;
        this._renderStep.next(DatagridRenderStep.CALCULATE_MODE_OFF);
    }
}
DatagridRenderOrganizer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridRenderOrganizer, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
DatagridRenderOrganizer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridRenderOrganizer });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridRenderOrganizer, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLW9yZ2FuaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvcmVuZGVyL3JlbmRlci1vcmdhbml6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXhDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDOztBQUcvRCxNQUFNLE9BQU8sdUJBQXVCO0lBRHBDO1FBRVksZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBc0IsQ0FBQztRQUVsRCxpQkFBWSxHQUFHLEtBQUssQ0FBQztLQW9COUI7SUFsQkMsSUFBSSxVQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxJQUF3QjtRQUN4QyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM1RCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDeEQ7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsV0FBVztRQUNwRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQy9ELENBQUM7O29IQXRCVSx1QkFBdUI7d0hBQXZCLHVCQUF1QjsyRkFBdkIsdUJBQXVCO2tCQURuQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IERhdGFncmlkUmVuZGVyU3RlcCB9IGZyb20gJy4uL2VudW1zL3JlbmRlci1zdGVwLmVudW0nO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGF0YWdyaWRSZW5kZXJPcmdhbml6ZXIge1xuICBwcm90ZWN0ZWQgX3JlbmRlclN0ZXAgPSBuZXcgU3ViamVjdDxEYXRhZ3JpZFJlbmRlclN0ZXA+KCk7XG5cbiAgcHJpdmF0ZSBhbHJlYWR5U2l6ZWQgPSBmYWxzZTtcblxuICBnZXQgcmVuZGVyU3RlcCgpOiBPYnNlcnZhYmxlPERhdGFncmlkUmVuZGVyU3RlcD4ge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJTdGVwLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZmlsdGVyUmVuZGVyU3RlcHMoc3RlcDogRGF0YWdyaWRSZW5kZXJTdGVwKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyU3RlcC5waXBlKGZpbHRlcih0ZXN0U3RlcCA9PiBzdGVwID09PSB0ZXN0U3RlcCkpO1xuICB9XG5cbiAgcmVzaXplKCkge1xuICAgIHRoaXMuX3JlbmRlclN0ZXAubmV4dChEYXRhZ3JpZFJlbmRlclN0ZXAuQ0FMQ1VMQVRFX01PREVfT04pO1xuICAgIGlmICh0aGlzLmFscmVhZHlTaXplZCkge1xuICAgICAgdGhpcy5fcmVuZGVyU3RlcC5uZXh0KERhdGFncmlkUmVuZGVyU3RlcC5DTEVBUl9XSURUSFMpO1xuICAgIH1cbiAgICB0aGlzLl9yZW5kZXJTdGVwLm5leHQoRGF0YWdyaWRSZW5kZXJTdGVwLkNPTVBVVEVfQ09MVU1OX1dJRFRIUyk7XG4gICAgdGhpcy5fcmVuZGVyU3RlcC5uZXh0KERhdGFncmlkUmVuZGVyU3RlcC5BTElHTl9DT0xVTU5TKTsgLy8gTk9UIFVTRURcbiAgICB0aGlzLmFscmVhZHlTaXplZCA9IHRydWU7XG4gICAgdGhpcy5fcmVuZGVyU3RlcC5uZXh0KERhdGFncmlkUmVuZGVyU3RlcC5DQUxDVUxBVEVfTU9ERV9PRkYpO1xuICB9XG59XG4iXX0=