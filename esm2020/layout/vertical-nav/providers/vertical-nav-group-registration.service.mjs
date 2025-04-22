/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class VerticalNavGroupRegistrationService {
    constructor() {
        this.navGroupCount = 0;
    }
    registerNavGroup() {
        this.navGroupCount++;
    }
    unregisterNavGroup() {
        this.navGroupCount--;
    }
}
VerticalNavGroupRegistrationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: VerticalNavGroupRegistrationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
VerticalNavGroupRegistrationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: VerticalNavGroupRegistrationService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: VerticalNavGroupRegistrationService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVydGljYWwtbmF2LWdyb3VwLXJlZ2lzdHJhdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvbGF5b3V0L3ZlcnRpY2FsLW5hdi9wcm92aWRlcnMvdmVydGljYWwtbmF2LWdyb3VwLXJlZ2lzdHJhdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFHM0MsTUFBTSxPQUFPLG1DQUFtQztJQURoRDtRQUVFLGtCQUFhLEdBQUcsQ0FBQyxDQUFDO0tBU25CO0lBUEMsZ0JBQWdCO1FBQ2QsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7O2dJQVRVLG1DQUFtQztvSUFBbkMsbUNBQW1DOzJGQUFuQyxtQ0FBbUM7a0JBRC9DLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFZlcnRpY2FsTmF2R3JvdXBSZWdpc3RyYXRpb25TZXJ2aWNlIHtcbiAgbmF2R3JvdXBDb3VudCA9IDA7XG5cbiAgcmVnaXN0ZXJOYXZHcm91cCgpIHtcbiAgICB0aGlzLm5hdkdyb3VwQ291bnQrKztcbiAgfVxuXG4gIHVucmVnaXN0ZXJOYXZHcm91cCgpOiB2b2lkIHtcbiAgICB0aGlzLm5hdkdyb3VwQ291bnQtLTtcbiAgfVxufVxuIl19