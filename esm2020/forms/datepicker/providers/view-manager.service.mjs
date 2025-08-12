/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { ClrPopoverPositions } from '../../../utils/popover/enums/positions.enum';
import * as i0 from "@angular/core";
/**
 * This service manages which view is visible in the datepicker popover.
 */
export class ViewManagerService {
    constructor() {
        this.position = ClrPopoverPositions['bottom-left'];
        this._currentView = "DAYVIEW" /* DatepickerViewEnum.DAYVIEW */;
    }
    get isDayView() {
        return this._currentView === "DAYVIEW" /* DatepickerViewEnum.DAYVIEW */;
    }
    get isYearView() {
        return this._currentView === "YEARVIEW" /* DatepickerViewEnum.YEARVIEW */;
    }
    get isMonthView() {
        return this._currentView === "MONTHVIEW" /* DatepickerViewEnum.MONTHVIEW */;
    }
    changeToMonthView() {
        this._currentView = "MONTHVIEW" /* DatepickerViewEnum.MONTHVIEW */;
    }
    changeToYearView() {
        this._currentView = "YEARVIEW" /* DatepickerViewEnum.YEARVIEW */;
    }
    changeToDayView() {
        this._currentView = "DAYVIEW" /* DatepickerViewEnum.DAYVIEW */;
    }
}
ViewManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ViewManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ViewManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ViewManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ViewManagerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRlcGlja2VyL3Byb3ZpZGVycy92aWV3LW1hbmFnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7O0FBU2xGOztHQUVHO0FBRUgsTUFBTSxPQUFPLGtCQUFrQjtJQUQvQjtRQUVFLGFBQVEsR0FBdUIsbUJBQW1CLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFMUQsaUJBQVksOENBQWtEO0tBeUJ2RTtJQXZCQyxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxZQUFZLCtDQUErQixDQUFDO0lBQzFELENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxZQUFZLGlEQUFnQyxDQUFDO0lBQzNELENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxZQUFZLG1EQUFpQyxDQUFDO0lBQzVELENBQUM7SUFFRCxpQkFBaUI7UUFDZixJQUFJLENBQUMsWUFBWSxpREFBK0IsQ0FBQztJQUNuRCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsSUFBSSxDQUFDLFlBQVksK0NBQThCLENBQUM7SUFDbEQsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsWUFBWSw2Q0FBNkIsQ0FBQztJQUNqRCxDQUFDOzsrR0EzQlUsa0JBQWtCO21IQUFsQixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFEOUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJQb3BvdmVyUG9zaXRpb25zIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvcG9wb3Zlci9lbnVtcy9wb3NpdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyUG9zaXRpb24gfSBmcm9tICcuLi8uLi8uLi91dGlscy9wb3BvdmVyL2ludGVyZmFjZXMvcG9wb3Zlci1wb3NpdGlvbi5pbnRlcmZhY2UnO1xuXG5jb25zdCBlbnVtIERhdGVwaWNrZXJWaWV3RW51bSB7XG4gIE1PTlRIVklFVyA9ICdNT05USFZJRVcnLFxuICBZRUFSVklFVyA9ICdZRUFSVklFVycsXG4gIERBWVZJRVcgPSAnREFZVklFVycsXG59XG5cbi8qKlxuICogVGhpcyBzZXJ2aWNlIG1hbmFnZXMgd2hpY2ggdmlldyBpcyB2aXNpYmxlIGluIHRoZSBkYXRlcGlja2VyIHBvcG92ZXIuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBWaWV3TWFuYWdlclNlcnZpY2Uge1xuICBwb3NpdGlvbjogQ2xyUG9wb3ZlclBvc2l0aW9uID0gQ2xyUG9wb3ZlclBvc2l0aW9uc1snYm90dG9tLWxlZnQnXTtcblxuICBwcml2YXRlIF9jdXJyZW50VmlldzogRGF0ZXBpY2tlclZpZXdFbnVtID0gRGF0ZXBpY2tlclZpZXdFbnVtLkRBWVZJRVc7XG5cbiAgZ2V0IGlzRGF5VmlldygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFZpZXcgPT09IERhdGVwaWNrZXJWaWV3RW51bS5EQVlWSUVXO1xuICB9XG5cbiAgZ2V0IGlzWWVhclZpZXcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRWaWV3ID09PSBEYXRlcGlja2VyVmlld0VudW0uWUVBUlZJRVc7XG4gIH1cblxuICBnZXQgaXNNb250aFZpZXcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRWaWV3ID09PSBEYXRlcGlja2VyVmlld0VudW0uTU9OVEhWSUVXO1xuICB9XG5cbiAgY2hhbmdlVG9Nb250aFZpZXcoKTogdm9pZCB7XG4gICAgdGhpcy5fY3VycmVudFZpZXcgPSBEYXRlcGlja2VyVmlld0VudW0uTU9OVEhWSUVXO1xuICB9XG5cbiAgY2hhbmdlVG9ZZWFyVmlldygpOiB2b2lkIHtcbiAgICB0aGlzLl9jdXJyZW50VmlldyA9IERhdGVwaWNrZXJWaWV3RW51bS5ZRUFSVklFVztcbiAgfVxuXG4gIGNoYW5nZVRvRGF5VmlldygpOiB2b2lkIHtcbiAgICB0aGlzLl9jdXJyZW50VmlldyA9IERhdGVwaWNrZXJWaWV3RW51bS5EQVlWSUVXO1xuICB9XG59XG4iXX0=