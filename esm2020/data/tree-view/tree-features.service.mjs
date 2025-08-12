/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class TreeFeaturesService {
    constructor() {
        this.selectable = false;
        this.eager = true;
        this.childrenFetched = new Subject();
    }
}
TreeFeaturesService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TreeFeaturesService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
TreeFeaturesService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TreeFeaturesService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TreeFeaturesService, decorators: [{
            type: Injectable
        }] });
export function treeFeaturesFactory(existing) {
    return existing || new TreeFeaturesService();
}
export const TREE_FEATURES_PROVIDER = {
    provide: TreeFeaturesService,
    useFactory: treeFeaturesFactory,
    /*
     * The Optional + SkipSelf pattern ensures that in case of nested components, only the root one will
     * instantiate a new service and all its children will reuse the root's instance.
     * If there are several roots (in this case, several independent trees on a page), each root will instantiate
     * its own service so they won't interfere with one another.
     *
     * TL;DR - Optional + SkipSelf = 1 instance of TreeFeaturesService per tree.
     */
    deps: [[new Optional(), new SkipSelf(), TreeFeaturesService]],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1mZWF0dXJlcy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS90cmVlLXZpZXcvdHJlZS1mZWF0dXJlcy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFlLE1BQU0sZUFBZSxDQUFDO0FBQzVFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBTS9CLE1BQU0sT0FBTyxtQkFBbUI7SUFEaEM7UUFFRSxlQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ25CLFVBQUssR0FBRyxJQUFJLENBQUM7UUFLYixvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7S0FDdkM7O2dIQVJZLG1CQUFtQjtvSEFBbkIsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBRC9CLFVBQVU7O0FBV1gsTUFBTSxVQUFVLG1CQUFtQixDQUFJLFFBQWdDO0lBQ3JFLE9BQU8sUUFBUSxJQUFJLElBQUksbUJBQW1CLEVBQUUsQ0FBQztBQUMvQyxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUc7SUFDcEMsT0FBTyxFQUFFLG1CQUFtQjtJQUM1QixVQUFVLEVBQUUsbUJBQW1CO0lBQy9COzs7Ozs7O09BT0c7SUFDSCxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFLEVBQUUsSUFBSSxRQUFRLEVBQUUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0NBQzlELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsLCBTa2lwU2VsZiwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgUmVjdXJzaXZlVHJlZU5vZGVNb2RlbCB9IGZyb20gJy4vbW9kZWxzL3JlY3Vyc2l2ZS10cmVlLW5vZGUubW9kZWwnO1xuaW1wb3J0IHsgQ2xyUmVjdXJzaXZlRm9yT2ZDb250ZXh0IH0gZnJvbSAnLi9yZWN1cnNpdmUtZm9yLW9mJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRyZWVGZWF0dXJlc1NlcnZpY2U8VD4ge1xuICBzZWxlY3RhYmxlID0gZmFsc2U7XG4gIGVhZ2VyID0gdHJ1ZTtcbiAgcmVjdXJzaW9uOiB7XG4gICAgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPENsclJlY3Vyc2l2ZUZvck9mQ29udGV4dDxUPj47XG4gICAgcm9vdDogUmVjdXJzaXZlVHJlZU5vZGVNb2RlbDxUPltdO1xuICB9O1xuICBjaGlsZHJlbkZldGNoZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJlZUZlYXR1cmVzRmFjdG9yeTxUPihleGlzdGluZzogVHJlZUZlYXR1cmVzU2VydmljZTxUPikge1xuICByZXR1cm4gZXhpc3RpbmcgfHwgbmV3IFRyZWVGZWF0dXJlc1NlcnZpY2UoKTtcbn1cblxuZXhwb3J0IGNvbnN0IFRSRUVfRkVBVFVSRVNfUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IFRyZWVGZWF0dXJlc1NlcnZpY2UsXG4gIHVzZUZhY3Rvcnk6IHRyZWVGZWF0dXJlc0ZhY3RvcnksXG4gIC8qXG4gICAqIFRoZSBPcHRpb25hbCArIFNraXBTZWxmIHBhdHRlcm4gZW5zdXJlcyB0aGF0IGluIGNhc2Ugb2YgbmVzdGVkIGNvbXBvbmVudHMsIG9ubHkgdGhlIHJvb3Qgb25lIHdpbGxcbiAgICogaW5zdGFudGlhdGUgYSBuZXcgc2VydmljZSBhbmQgYWxsIGl0cyBjaGlsZHJlbiB3aWxsIHJldXNlIHRoZSByb290J3MgaW5zdGFuY2UuXG4gICAqIElmIHRoZXJlIGFyZSBzZXZlcmFsIHJvb3RzIChpbiB0aGlzIGNhc2UsIHNldmVyYWwgaW5kZXBlbmRlbnQgdHJlZXMgb24gYSBwYWdlKSwgZWFjaCByb290IHdpbGwgaW5zdGFudGlhdGVcbiAgICogaXRzIG93biBzZXJ2aWNlIHNvIHRoZXkgd29uJ3QgaW50ZXJmZXJlIHdpdGggb25lIGFub3RoZXIuXG4gICAqXG4gICAqIFRMO0RSIC0gT3B0aW9uYWwgKyBTa2lwU2VsZiA9IDEgaW5zdGFuY2Ugb2YgVHJlZUZlYXR1cmVzU2VydmljZSBwZXIgdHJlZS5cbiAgICovXG4gIGRlcHM6IFtbbmV3IE9wdGlvbmFsKCksIG5ldyBTa2lwU2VsZigpLCBUcmVlRmVhdHVyZXNTZXJ2aWNlXV0sXG59O1xuIl19