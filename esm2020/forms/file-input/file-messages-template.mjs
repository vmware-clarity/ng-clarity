/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { inject, TemplateRef } from '@angular/core';
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
export class ClrFileMessagesTemplate {
    constructor() {
        this.templateRef = inject(TemplateRef);
    }
    static ngTemplateContextGuard(directive, context) {
        return true;
    }
}
ClrFileMessagesTemplate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileMessagesTemplate, deps: [], target: i0.ɵɵFactoryTarget.Directive });
ClrFileMessagesTemplate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrFileMessagesTemplate, selector: "ng-template[clr-file-messages]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileMessagesTemplate, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[clr-file-messages]',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1tZXNzYWdlcy10ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2ZpbGUtaW5wdXQvZmlsZS1tZXNzYWdlcy10ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBbUIxQyxNQUFNLE9BQU8sdUJBQXVCO0lBSHBDO1FBSVcsZ0JBQVcsR0FBZ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBUXpGO0lBTkMsTUFBTSxDQUFDLHNCQUFzQixDQUMzQixTQUFrQyxFQUNsQyxPQUFnQjtRQUVoQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7O29IQVJVLHVCQUF1Qjt3R0FBdkIsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBSG5DLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGdDQUFnQztpQkFDM0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IGluamVjdCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERpcmVjdGl2ZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJGaWxlQWNjZXB0RXJyb3IsIENsckZpbGVNYXhGaWxlU2l6ZUVycm9yLCBDbHJGaWxlTWluRmlsZVNpemVFcnJvciB9IGZyb20gJy4vZmlsZS1pbnB1dC12YWxpZGF0b3ItZXJyb3JzJztcblxuZXhwb3J0IGludGVyZmFjZSBDbHJTaW5nbGVGaWxlVmFsaWRhdGlvbkVycm9ycyB7XG4gIGFjY2VwdD86IENsckZpbGVBY2NlcHRFcnJvcjtcbiAgbWluRmlsZVNpemU/OiBDbHJGaWxlTWluRmlsZVNpemVFcnJvcjtcbiAgbWF4RmlsZVNpemU/OiBDbHJGaWxlTWF4RmlsZVNpemVFcnJvcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbHJGaWxlTWVzc2FnZXNUZW1wbGF0ZUNvbnRleHQge1xuICAkaW1wbGljaXQ6IEZpbGU7XG4gIHN1Y2Nlc3M6IGJvb2xlYW47XG4gIGVycm9yczogQ2xyU2luZ2xlRmlsZVZhbGlkYXRpb25FcnJvcnM7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ25nLXRlbXBsYXRlW2Nsci1maWxlLW1lc3NhZ2VzXScsXG59KVxuZXhwb3J0IGNsYXNzIENsckZpbGVNZXNzYWdlc1RlbXBsYXRlIHtcbiAgcmVhZG9ubHkgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPENsckZpbGVNZXNzYWdlc1RlbXBsYXRlQ29udGV4dD4gPSBpbmplY3QoVGVtcGxhdGVSZWYpO1xuXG4gIHN0YXRpYyBuZ1RlbXBsYXRlQ29udGV4dEd1YXJkKFxuICAgIGRpcmVjdGl2ZTogQ2xyRmlsZU1lc3NhZ2VzVGVtcGxhdGUsXG4gICAgY29udGV4dDogdW5rbm93blxuICApOiBjb250ZXh0IGlzIENsckZpbGVNZXNzYWdlc1RlbXBsYXRlQ29udGV4dCB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiJdfQ==