/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class NgControlService {
    constructor() {
        this._additionalControls = [];
        // Observable to subscribe to the control, since its not available immediately for projected content
        this._controlChanges = new Subject();
        this._additionalControlsChanges = new Subject();
        this._helpers = new Subject();
    }
    get control() {
        return this._control;
    }
    get controlChanges() {
        return this._controlChanges.asObservable();
    }
    get additionalControls() {
        return this._additionalControls;
    }
    get additionalControlsChanges() {
        return this._additionalControlsChanges.asObservable();
    }
    get hasAdditionalControls() {
        return !!this._additionalControls?.length;
    }
    get helpersChange() {
        return this._helpers.asObservable();
    }
    setControl(control) {
        this._control = control;
        this._controlChanges.next(control);
    }
    addAdditionalControl(control) {
        this._additionalControls.push(control);
        this._additionalControlsChanges.next(this._additionalControls);
    }
    setHelpers(state) {
        this._helpers.next(state);
    }
}
NgControlService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: NgControlService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgControlService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: NgControlService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: NgControlService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctY29udHJvbC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tbW9uL3Byb3ZpZGVycy9uZy1jb250cm9sLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBVTNDLE1BQU0sT0FBTyxnQkFBZ0I7SUFEN0I7UUFHVSx3QkFBbUIsR0FBZ0IsRUFBRSxDQUFDO1FBRTlDLG9HQUFvRztRQUM1RixvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFhLENBQUM7UUFDM0MsK0JBQTBCLEdBQUcsSUFBSSxPQUFPLEVBQWUsQ0FBQztRQUV4RCxhQUFRLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztLQXVDM0M7SUFyQ0MsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCxJQUFJLGtCQUFrQjtRQUNwQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztJQUNsQyxDQUFDO0lBRUQsSUFBSSx5QkFBeUI7UUFDM0IsT0FBTyxJQUFJLENBQUMsMEJBQTBCLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDeEQsQ0FBQztJQUVELElBQUkscUJBQXFCO1FBQ3ZCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUM7SUFDNUMsQ0FBQztJQUVELElBQUksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRUQsVUFBVSxDQUFDLE9BQWtCO1FBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxPQUFrQjtRQUNyQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFjO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7OzZHQTlDVSxnQkFBZ0I7aUhBQWhCLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQUQ1QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ0NvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGVscGVycyB7XG4gIHNob3c/OiBib29sZWFuO1xuICBzaG93SW52YWxpZD86IGJvb2xlYW47XG4gIHNob3dWYWxpZD86IGJvb2xlYW47XG4gIHNob3dIZWxwZXI/OiBib29sZWFuO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdDb250cm9sU2VydmljZSB7XG4gIHByaXZhdGUgX2NvbnRyb2w6IE5nQ29udHJvbDtcbiAgcHJpdmF0ZSBfYWRkaXRpb25hbENvbnRyb2xzOiBOZ0NvbnRyb2xbXSA9IFtdO1xuXG4gIC8vIE9ic2VydmFibGUgdG8gc3Vic2NyaWJlIHRvIHRoZSBjb250cm9sLCBzaW5jZSBpdHMgbm90IGF2YWlsYWJsZSBpbW1lZGlhdGVseSBmb3IgcHJvamVjdGVkIGNvbnRlbnRcbiAgcHJpdmF0ZSBfY29udHJvbENoYW5nZXMgPSBuZXcgU3ViamVjdDxOZ0NvbnRyb2w+KCk7XG4gIHByaXZhdGUgX2FkZGl0aW9uYWxDb250cm9sc0NoYW5nZXMgPSBuZXcgU3ViamVjdDxOZ0NvbnRyb2xbXT4oKTtcblxuICBwcml2YXRlIF9oZWxwZXJzID0gbmV3IFN1YmplY3Q8SGVscGVycz4oKTtcblxuICBnZXQgY29udHJvbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29udHJvbDtcbiAgfVxuXG4gIGdldCBjb250cm9sQ2hhbmdlcygpOiBPYnNlcnZhYmxlPE5nQ29udHJvbD4ge1xuICAgIHJldHVybiB0aGlzLl9jb250cm9sQ2hhbmdlcy5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldCBhZGRpdGlvbmFsQ29udHJvbHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FkZGl0aW9uYWxDb250cm9scztcbiAgfVxuXG4gIGdldCBhZGRpdGlvbmFsQ29udHJvbHNDaGFuZ2VzKCk6IE9ic2VydmFibGU8TmdDb250cm9sW10+IHtcbiAgICByZXR1cm4gdGhpcy5fYWRkaXRpb25hbENvbnRyb2xzQ2hhbmdlcy5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldCBoYXNBZGRpdGlvbmFsQ29udHJvbHMoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fYWRkaXRpb25hbENvbnRyb2xzPy5sZW5ndGg7XG4gIH1cblxuICBnZXQgaGVscGVyc0NoYW5nZSgpOiBPYnNlcnZhYmxlPEhlbHBlcnM+IHtcbiAgICByZXR1cm4gdGhpcy5faGVscGVycy5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIHNldENvbnRyb2woY29udHJvbDogTmdDb250cm9sKSB7XG4gICAgdGhpcy5fY29udHJvbCA9IGNvbnRyb2w7XG4gICAgdGhpcy5fY29udHJvbENoYW5nZXMubmV4dChjb250cm9sKTtcbiAgfVxuXG4gIGFkZEFkZGl0aW9uYWxDb250cm9sKGNvbnRyb2w6IE5nQ29udHJvbCkge1xuICAgIHRoaXMuX2FkZGl0aW9uYWxDb250cm9scy5wdXNoKGNvbnRyb2wpO1xuICAgIHRoaXMuX2FkZGl0aW9uYWxDb250cm9sc0NoYW5nZXMubmV4dCh0aGlzLl9hZGRpdGlvbmFsQ29udHJvbHMpO1xuICB9XG5cbiAgc2V0SGVscGVycyhzdGF0ZTogSGVscGVycykge1xuICAgIHRoaXMuX2hlbHBlcnMubmV4dChzdGF0ZSk7XG4gIH1cbn1cbiJdfQ==