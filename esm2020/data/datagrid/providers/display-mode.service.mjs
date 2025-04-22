/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatagridDisplayMode } from '../enums/display-mode.enum';
import { DatagridRenderStep } from '../enums/render-step.enum';
import * as i0 from "@angular/core";
import * as i1 from "../render/render-organizer";
export class DisplayModeService {
    constructor(renderOrganizer) {
        this._view = new BehaviorSubject(DatagridDisplayMode.DISPLAY);
        this.subscriptions = [];
        this.subscriptions.push(renderOrganizer
            .filterRenderSteps(DatagridRenderStep.CALCULATE_MODE_ON)
            .subscribe(() => this._view.next(DatagridDisplayMode.CALCULATE)));
        this.subscriptions.push(renderOrganizer
            .filterRenderSteps(DatagridRenderStep.CALCULATE_MODE_OFF)
            .subscribe(() => this._view.next(DatagridDisplayMode.DISPLAY)));
    }
    get view() {
        return this._view.asObservable();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
DisplayModeService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DisplayModeService, deps: [{ token: i1.DatagridRenderOrganizer }], target: i0.ɵɵFactoryTarget.Injectable });
DisplayModeService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DisplayModeService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DisplayModeService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.DatagridRenderOrganizer }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzcGxheS1tb2RlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL3Byb3ZpZGVycy9kaXNwbGF5LW1vZGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDdEQsT0FBTyxFQUFFLGVBQWUsRUFBNEIsTUFBTSxNQUFNLENBQUM7QUFFakUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDakUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7OztBQUkvRCxNQUFNLE9BQU8sa0JBQWtCO0lBSzdCLFlBQVksZUFBd0M7UUFKMUMsVUFBSyxHQUFHLElBQUksZUFBZSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTNELGtCQUFhLEdBQW1CLEVBQUUsQ0FBQztRQUd6QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsZUFBZTthQUNaLGlCQUFpQixDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDO2FBQ3ZELFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUNuRSxDQUFDO1FBRUYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ3JCLGVBQWU7YUFDWixpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQzthQUN4RCxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FDakUsQ0FBQztJQUNKLENBQUM7SUFFRCxJQUFJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7OytHQXpCVSxrQkFBa0I7bUhBQWxCLGtCQUFrQjsyRkFBbEIsa0JBQWtCO2tCQUQ5QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IERhdGFncmlkRGlzcGxheU1vZGUgfSBmcm9tICcuLi9lbnVtcy9kaXNwbGF5LW1vZGUuZW51bSc7XG5pbXBvcnQgeyBEYXRhZ3JpZFJlbmRlclN0ZXAgfSBmcm9tICcuLi9lbnVtcy9yZW5kZXItc3RlcC5lbnVtJztcbmltcG9ydCB7IERhdGFncmlkUmVuZGVyT3JnYW5pemVyIH0gZnJvbSAnLi4vcmVuZGVyL3JlbmRlci1vcmdhbml6ZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGlzcGxheU1vZGVTZXJ2aWNlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJvdGVjdGVkIF92aWV3ID0gbmV3IEJlaGF2aW9yU3ViamVjdChEYXRhZ3JpZERpc3BsYXlNb2RlLkRJU1BMQVkpO1xuXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihyZW5kZXJPcmdhbml6ZXI6IERhdGFncmlkUmVuZGVyT3JnYW5pemVyKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICByZW5kZXJPcmdhbml6ZXJcbiAgICAgICAgLmZpbHRlclJlbmRlclN0ZXBzKERhdGFncmlkUmVuZGVyU3RlcC5DQUxDVUxBVEVfTU9ERV9PTilcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl92aWV3Lm5leHQoRGF0YWdyaWREaXNwbGF5TW9kZS5DQUxDVUxBVEUpKVxuICAgICk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHJlbmRlck9yZ2FuaXplclxuICAgICAgICAuZmlsdGVyUmVuZGVyU3RlcHMoRGF0YWdyaWRSZW5kZXJTdGVwLkNBTENVTEFURV9NT0RFX09GRilcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl92aWV3Lm5leHQoRGF0YWdyaWREaXNwbGF5TW9kZS5ESVNQTEFZKSlcbiAgICApO1xuICB9XG5cbiAgZ2V0IHZpZXcoKTogT2JzZXJ2YWJsZTxEYXRhZ3JpZERpc3BsYXlNb2RlPiB7XG4gICAgcmV0dXJuIHRoaXMuX3ZpZXcuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG59XG4iXX0=