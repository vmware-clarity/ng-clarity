/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { combineLatest, EMPTY, map, merge, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../providers/ng-control.service";
export var CONTROL_STATE;
(function (CONTROL_STATE) {
    CONTROL_STATE["NONE"] = "NONE";
    CONTROL_STATE["VALID"] = "VALID";
    CONTROL_STATE["INVALID"] = "INVALID";
})(CONTROL_STATE || (CONTROL_STATE = {}));
export class IfControlStateService {
    constructor(ngControlService) {
        this.triggerStatusChangeSubject = new Subject();
        this.statusChanges = this.getStatusChanges(ngControlService).pipe(shareReplay(1));
    }
    triggerStatusChange() {
        this.triggerStatusChangeSubject.next();
    }
    getStatusChanges(ngControlService) {
        return combineLatest([
            ngControlService.controlChanges,
            ngControlService.additionalControlsChanges.pipe(startWith([])),
        ]).pipe(switchMap(([control, additionalControls]) => {
            if (control) {
                const controls = [control, ...additionalControls];
                return merge(combineLatest(controls.map(control => control.statusChanges)), this.triggerStatusChangeSubject.pipe(map(() => controls.map(control => control.status))));
            }
            else {
                return EMPTY;
            }
        }), map(controlStatuses => {
            // These status values are mutually exclusive, so a control
            // cannot be both valid AND invalid or invalid AND disabled.
            if (controlStatuses.includes(CONTROL_STATE.INVALID)) {
                return CONTROL_STATE.INVALID;
            }
            else if (controlStatuses.includes(CONTROL_STATE.VALID)) {
                return CONTROL_STATE.VALID;
            }
            else {
                return CONTROL_STATE.NONE;
            }
        }), startWith(CONTROL_STATE.NONE));
    }
}
IfControlStateService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: IfControlStateService, deps: [{ token: i1.NgControlService }], target: i0.ɵɵFactoryTarget.Injectable });
IfControlStateService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: IfControlStateService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: IfControlStateService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.NgControlService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWYtY29udHJvbC1zdGF0ZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tbW9uL2lmLWNvbnRyb2wtc3RhdGUvaWYtY29udHJvbC1zdGF0ZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFjLFdBQVcsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7O0FBSWhILE1BQU0sQ0FBTixJQUFZLGFBSVg7QUFKRCxXQUFZLGFBQWE7SUFDdkIsOEJBQWEsQ0FBQTtJQUNiLGdDQUFlLENBQUE7SUFDZixvQ0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBSlcsYUFBYSxLQUFiLGFBQWEsUUFJeEI7QUFHRCxNQUFNLE9BQU8scUJBQXFCO0lBS2hDLFlBQVksZ0JBQWtDO1FBRjdCLCtCQUEwQixHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFHaEUsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVELG1CQUFtQjtRQUNqQixJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVPLGdCQUFnQixDQUFDLGdCQUFrQztRQUN6RCxPQUFPLGFBQWEsQ0FBQztZQUNuQixnQkFBZ0IsQ0FBQyxjQUFjO1lBQy9CLGdCQUFnQixDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxTQUFTLENBQWMsRUFBRSxDQUFDLENBQUM7U0FDNUUsQ0FBQyxDQUFDLElBQUksQ0FDTCxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsQ0FBQyxFQUFFLEVBQUU7WUFDMUMsSUFBSSxPQUFPLEVBQUU7Z0JBQ1gsTUFBTSxRQUFRLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUVsRCxPQUFPLEtBQUssQ0FDVixhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUM3RCxJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FDekYsQ0FBQzthQUNIO2lCQUFNO2dCQUNMLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7UUFDSCxDQUFDLENBQUMsRUFDRixHQUFHLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDcEIsMkRBQTJEO1lBQzNELDREQUE0RDtZQUM1RCxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNuRCxPQUFPLGFBQWEsQ0FBQyxPQUFPLENBQUM7YUFDOUI7aUJBQU0sSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDeEQsT0FBTyxhQUFhLENBQUMsS0FBSyxDQUFDO2FBQzVCO2lCQUFNO2dCQUNMLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQzthQUMzQjtRQUNILENBQUMsQ0FBQyxFQUNGLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQzlCLENBQUM7SUFDSixDQUFDOztrSEEzQ1UscUJBQXFCO3NIQUFyQixxQkFBcUI7MkZBQXJCLHFCQUFxQjtrQkFEakMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCwgRU1QVFksIG1hcCwgbWVyZ2UsIE9ic2VydmFibGUsIHNoYXJlUmVwbGF5LCBzdGFydFdpdGgsIFN1YmplY3QsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBOZ0NvbnRyb2xTZXJ2aWNlIH0gZnJvbSAnLi4vcHJvdmlkZXJzL25nLWNvbnRyb2wuc2VydmljZSc7XG5cbmV4cG9ydCBlbnVtIENPTlRST0xfU1RBVEUge1xuICBOT05FID0gJ05PTkUnLFxuICBWQUxJRCA9ICdWQUxJRCcsXG4gIElOVkFMSUQgPSAnSU5WQUxJRCcsXG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBJZkNvbnRyb2xTdGF0ZVNlcnZpY2Uge1xuICByZWFkb25seSBzdGF0dXNDaGFuZ2VzOiBPYnNlcnZhYmxlPENPTlRST0xfU1RBVEU+O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgdHJpZ2dlclN0YXR1c0NoYW5nZVN1YmplY3QgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKG5nQ29udHJvbFNlcnZpY2U6IE5nQ29udHJvbFNlcnZpY2UpIHtcbiAgICB0aGlzLnN0YXR1c0NoYW5nZXMgPSB0aGlzLmdldFN0YXR1c0NoYW5nZXMobmdDb250cm9sU2VydmljZSkucGlwZShzaGFyZVJlcGxheSgxKSk7XG4gIH1cblxuICB0cmlnZ2VyU3RhdHVzQ2hhbmdlKCkge1xuICAgIHRoaXMudHJpZ2dlclN0YXR1c0NoYW5nZVN1YmplY3QubmV4dCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRTdGF0dXNDaGFuZ2VzKG5nQ29udHJvbFNlcnZpY2U6IE5nQ29udHJvbFNlcnZpY2UpIHtcbiAgICByZXR1cm4gY29tYmluZUxhdGVzdChbXG4gICAgICBuZ0NvbnRyb2xTZXJ2aWNlLmNvbnRyb2xDaGFuZ2VzLFxuICAgICAgbmdDb250cm9sU2VydmljZS5hZGRpdGlvbmFsQ29udHJvbHNDaGFuZ2VzLnBpcGUoc3RhcnRXaXRoPE5nQ29udHJvbFtdPihbXSkpLFxuICAgIF0pLnBpcGUoXG4gICAgICBzd2l0Y2hNYXAoKFtjb250cm9sLCBhZGRpdGlvbmFsQ29udHJvbHNdKSA9PiB7XG4gICAgICAgIGlmIChjb250cm9sKSB7XG4gICAgICAgICAgY29uc3QgY29udHJvbHMgPSBbY29udHJvbCwgLi4uYWRkaXRpb25hbENvbnRyb2xzXTtcblxuICAgICAgICAgIHJldHVybiBtZXJnZShcbiAgICAgICAgICAgIGNvbWJpbmVMYXRlc3QoY29udHJvbHMubWFwKGNvbnRyb2wgPT4gY29udHJvbC5zdGF0dXNDaGFuZ2VzKSksXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJTdGF0dXNDaGFuZ2VTdWJqZWN0LnBpcGUobWFwKCgpID0+IGNvbnRyb2xzLm1hcChjb250cm9sID0+IGNvbnRyb2wuc3RhdHVzKSkpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gRU1QVFk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgbWFwKGNvbnRyb2xTdGF0dXNlcyA9PiB7XG4gICAgICAgIC8vIFRoZXNlIHN0YXR1cyB2YWx1ZXMgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZSwgc28gYSBjb250cm9sXG4gICAgICAgIC8vIGNhbm5vdCBiZSBib3RoIHZhbGlkIEFORCBpbnZhbGlkIG9yIGludmFsaWQgQU5EIGRpc2FibGVkLlxuICAgICAgICBpZiAoY29udHJvbFN0YXR1c2VzLmluY2x1ZGVzKENPTlRST0xfU1RBVEUuSU5WQUxJRCkpIHtcbiAgICAgICAgICByZXR1cm4gQ09OVFJPTF9TVEFURS5JTlZBTElEO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnRyb2xTdGF0dXNlcy5pbmNsdWRlcyhDT05UUk9MX1NUQVRFLlZBTElEKSkge1xuICAgICAgICAgIHJldHVybiBDT05UUk9MX1NUQVRFLlZBTElEO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBDT05UUk9MX1NUQVRFLk5PTkU7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgc3RhcnRXaXRoKENPTlRST0xfU1RBVEUuTk9ORSlcbiAgICApO1xuICB9XG59XG4iXX0=