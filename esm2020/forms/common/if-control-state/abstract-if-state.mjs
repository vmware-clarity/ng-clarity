/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./if-control-state.service";
import * as i2 from "../providers/ng-control.service";
export class AbstractIfState {
    constructor(ifControlStateService, ngControlService) {
        this.ifControlStateService = ifControlStateService;
        this.ngControlService = ngControlService;
        this.subscriptions = [];
        this.displayedContent = false;
        if (ngControlService) {
            this.subscriptions.push(ngControlService.controlChanges.subscribe(control => {
                this.control = control;
            }), ngControlService.additionalControlsChanges.subscribe(controls => {
                this.additionalControls = controls;
            }));
        }
        if (ifControlStateService) {
            this.subscriptions.push(ifControlStateService.statusChanges.subscribe((state) => {
                this.handleState(state);
            }));
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    handleState(_state) {
        /* overwrite in implementation to handle status change */
    }
}
AbstractIfState.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: AbstractIfState, deps: [{ token: i1.IfControlStateService, optional: true }, { token: i2.NgControlService, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
AbstractIfState.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: AbstractIfState, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: AbstractIfState, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.IfControlStateService, decorators: [{
                    type: Optional
                }] }, { type: i2.NgControlService, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QtaWYtc3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9jb21tb24vaWYtY29udHJvbC1zdGF0ZS9hYnN0cmFjdC1pZi1zdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBUXBELE1BQU0sT0FBZ0IsZUFBZTtJQU1uQyxZQUN3QixxQkFBNEMsRUFDNUMsZ0JBQWtDO1FBRGxDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQVBoRCxrQkFBYSxHQUFtQixFQUFFLENBQUM7UUFDbkMscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBUWpDLElBQUksZ0JBQWdCLEVBQUU7WUFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ3JCLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ2xELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxFQUNGLGdCQUFnQixDQUFDLHlCQUF5QixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDOUQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFFBQVEsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FDSCxDQUFDO1NBQ0g7UUFFRCxJQUFJLHFCQUFxQixFQUFFO1lBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixxQkFBcUIsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBb0IsRUFBRSxFQUFFO2dCQUNyRSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUNILENBQUM7U0FDSDtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRVMsV0FBVyxDQUFDLE1BQXFCO1FBQ3pDLHlEQUF5RDtJQUMzRCxDQUFDOzs0R0FwQ21CLGVBQWU7Z0dBQWYsZUFBZTsyRkFBZixlQUFlO2tCQURwQyxTQUFTOzswQkFRTCxRQUFROzswQkFDUixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ0NvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgTmdDb250cm9sU2VydmljZSB9IGZyb20gJy4uL3Byb3ZpZGVycy9uZy1jb250cm9sLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ09OVFJPTF9TVEFURSwgSWZDb250cm9sU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi9pZi1jb250cm9sLXN0YXRlLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBYnN0cmFjdElmU3RhdGUge1xuICBwcm90ZWN0ZWQgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcbiAgcHJvdGVjdGVkIGRpc3BsYXllZENvbnRlbnQgPSBmYWxzZTtcbiAgcHJvdGVjdGVkIGNvbnRyb2w6IE5nQ29udHJvbDtcbiAgcHJvdGVjdGVkIGFkZGl0aW9uYWxDb250cm9sczogTmdDb250cm9sW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIGlmQ29udHJvbFN0YXRlU2VydmljZTogSWZDb250cm9sU3RhdGVTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIHByb3RlY3RlZCBuZ0NvbnRyb2xTZXJ2aWNlOiBOZ0NvbnRyb2xTZXJ2aWNlXG4gICkge1xuICAgIGlmIChuZ0NvbnRyb2xTZXJ2aWNlKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgbmdDb250cm9sU2VydmljZS5jb250cm9sQ2hhbmdlcy5zdWJzY3JpYmUoY29udHJvbCA9PiB7XG4gICAgICAgICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcbiAgICAgICAgfSksXG4gICAgICAgIG5nQ29udHJvbFNlcnZpY2UuYWRkaXRpb25hbENvbnRyb2xzQ2hhbmdlcy5zdWJzY3JpYmUoY29udHJvbHMgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkaXRpb25hbENvbnRyb2xzID0gY29udHJvbHM7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChpZkNvbnRyb2xTdGF0ZVNlcnZpY2UpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICBpZkNvbnRyb2xTdGF0ZVNlcnZpY2Uuc3RhdHVzQ2hhbmdlcy5zdWJzY3JpYmUoKHN0YXRlOiBDT05UUk9MX1NUQVRFKSA9PiB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVTdGF0ZShzdGF0ZSk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaGFuZGxlU3RhdGUoX3N0YXRlOiBDT05UUk9MX1NUQVRFKTogdm9pZCB7XG4gICAgLyogb3ZlcndyaXRlIGluIGltcGxlbWVudGF0aW9uIHRvIGhhbmRsZSBzdGF0dXMgY2hhbmdlICovXG4gIH1cbn1cbiJdfQ==