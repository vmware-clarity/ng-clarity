/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, EventEmitter, Input, Output, } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/detail.service";
export class ClrIfDetail {
    constructor(templateRef, viewContainer, detailService) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.detailService = detailService;
        this.stateChange = new EventEmitter(null);
        this.subscriptions = [];
        this.skip = false; // This keeps us from resetting the input and calling the toggle twice
        detailService.enabled = true;
    }
    set state(model) {
        if (!this.skip) {
            this.detailService.toggle(model);
        }
        this.skip = false;
    }
    get viewContext() {
        return { $implicit: this.detailService.state };
    }
    ngOnInit() {
        this.subscriptions.push(this.detailService.stateChange.subscribe(state => {
            if (state === true) {
                this.togglePanel(true);
            }
            else {
                this.togglePanel(false);
            }
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    togglePanel(showPanel) {
        let stateChangeParams = null;
        if (showPanel === true) {
            if (!this.embeddedViewRef) {
                // Create a context forward `Proxy` that will always bind to the user-specified context,
                // without having to re-assign it whenever changes.
                const viewContext = this._createContextForwardProxy();
                this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, viewContext);
            }
            this.skip = true;
            stateChangeParams = this.detailService.state;
        }
        else {
            this.viewContainer.clear();
            this.embeddedViewRef = null;
        }
        this.stateChange.emit(stateChangeParams);
    }
    /**
     * For a given outlet instance, we create a proxy object that delegates
     * to the user-specified context. This allows changing, or swapping out
     * the context object completely without having to destroy/re-create the view.
     */
    _createContextForwardProxy() {
        return new Proxy({}, {
            set: (_target, prop, newValue) => {
                if (!this.viewContext) {
                    return false;
                }
                return Reflect.set(this.viewContext, prop, newValue);
            },
            get: (_target, prop, receiver) => {
                if (!this.viewContext) {
                    return undefined;
                }
                return Reflect.get(this.viewContext, prop, receiver);
            },
        });
    }
}
ClrIfDetail.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrIfDetail, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: i1.DetailService }], target: i0.ɵɵFactoryTarget.Directive });
ClrIfDetail.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrIfDetail, selector: "[clrIfDetail]", inputs: { state: ["clrIfDetail", "state"] }, outputs: { stateChange: "clrIfDetailChange" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrIfDetail, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfDetail]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: i1.DetailService }]; }, propDecorators: { stateChange: [{
                type: Output,
                args: ['clrIfDetailChange']
            }], state: [{
                type: Input,
                args: ['clrIfDetail']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtaWYtZGV0YWlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1pZi1kZXRhaWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUVULFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxHQUdQLE1BQU0sZUFBZSxDQUFDOzs7QUFRdkIsTUFBTSxPQUFPLFdBQVc7SUFPdEIsWUFDVSxXQUE2QixFQUM3QixhQUErQixFQUMvQixhQUE0QjtRQUY1QixnQkFBVyxHQUFYLFdBQVcsQ0FBa0I7UUFDN0Isa0JBQWEsR0FBYixhQUFhLENBQWtCO1FBQy9CLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBVFQsZ0JBQVcsR0FBRyxJQUFJLFlBQVksQ0FBTSxJQUFJLENBQUMsQ0FBQztRQUUvRCxrQkFBYSxHQUFtQixFQUFFLENBQUM7UUFDbkMsU0FBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLHNFQUFzRTtRQVExRixhQUFhLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUMvQixDQUFDO0lBRUQsSUFDSSxLQUFLLENBQUMsS0FBVTtRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNkLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2xDO1FBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELElBQUksV0FBVztRQUNiLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDL0MsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO2dCQUNsQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3hCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDekI7UUFDSCxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFTyxXQUFXLENBQUMsU0FBa0I7UUFDcEMsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFFN0IsSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUN6Qix3RkFBd0Y7Z0JBQ3hGLG1EQUFtRDtnQkFDbkQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2FBQzdGO1lBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7U0FDOUM7YUFBTTtZQUNMLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7U0FDN0I7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssMEJBQTBCO1FBQ2hDLE9BQU8sSUFBSSxLQUFLLENBQ2QsRUFBRSxFQUNGO1lBQ0UsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQ3JCLE9BQU8sS0FBSyxDQUFDO2lCQUNkO2dCQUNELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN2RCxDQUFDO1lBQ0QsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQ3JCLE9BQU8sU0FBUyxDQUFDO2lCQUNsQjtnQkFDRCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdkQsQ0FBQztTQUNGLENBQ0YsQ0FBQztJQUNKLENBQUM7O3dHQXZGVSxXQUFXOzRGQUFYLFdBQVc7MkZBQVgsV0FBVztrQkFIdkIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtpQkFDMUI7NkpBRThCLFdBQVc7c0JBQXZDLE1BQU07dUJBQUMsbUJBQW1CO2dCQWV2QixLQUFLO3NCQURSLEtBQUs7dUJBQUMsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbWJlZGRlZFZpZXdSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBEZXRhaWxTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGV0YWlsLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xySWZEZXRhaWxdJyxcbn0pXG5leHBvcnQgY2xhc3MgQ2xySWZEZXRhaWwgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBPdXRwdXQoJ2NscklmRGV0YWlsQ2hhbmdlJykgc3RhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4obnVsbCk7XG5cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICBwcml2YXRlIHNraXAgPSBmYWxzZTsgLy8gVGhpcyBrZWVwcyB1cyBmcm9tIHJlc2V0dGluZyB0aGUgaW5wdXQgYW5kIGNhbGxpbmcgdGhlIHRvZ2dsZSB0d2ljZVxuICBwcml2YXRlIGVtYmVkZGVkVmlld1JlZjogRW1iZWRkZWRWaWV3UmVmPGFueT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PixcbiAgICBwcml2YXRlIHZpZXdDb250YWluZXI6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBkZXRhaWxTZXJ2aWNlOiBEZXRhaWxTZXJ2aWNlXG4gICkge1xuICAgIGRldGFpbFNlcnZpY2UuZW5hYmxlZCA9IHRydWU7XG4gIH1cblxuICBASW5wdXQoJ2NscklmRGV0YWlsJylcbiAgc2V0IHN0YXRlKG1vZGVsOiBhbnkpIHtcbiAgICBpZiAoIXRoaXMuc2tpcCkge1xuICAgICAgdGhpcy5kZXRhaWxTZXJ2aWNlLnRvZ2dsZShtb2RlbCk7XG4gICAgfVxuICAgIHRoaXMuc2tpcCA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0IHZpZXdDb250ZXh0KCkge1xuICAgIHJldHVybiB7ICRpbXBsaWNpdDogdGhpcy5kZXRhaWxTZXJ2aWNlLnN0YXRlIH07XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMuZGV0YWlsU2VydmljZS5zdGF0ZUNoYW5nZS5zdWJzY3JpYmUoc3RhdGUgPT4ge1xuICAgICAgICBpZiAoc3RhdGUgPT09IHRydWUpIHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZVBhbmVsKHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudG9nZ2xlUGFuZWwoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2dnbGVQYW5lbChzaG93UGFuZWw6IGJvb2xlYW4pIHtcbiAgICBsZXQgc3RhdGVDaGFuZ2VQYXJhbXMgPSBudWxsO1xuXG4gICAgaWYgKHNob3dQYW5lbCA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKCF0aGlzLmVtYmVkZGVkVmlld1JlZikge1xuICAgICAgICAvLyBDcmVhdGUgYSBjb250ZXh0IGZvcndhcmQgYFByb3h5YCB0aGF0IHdpbGwgYWx3YXlzIGJpbmQgdG8gdGhlIHVzZXItc3BlY2lmaWVkIGNvbnRleHQsXG4gICAgICAgIC8vIHdpdGhvdXQgaGF2aW5nIHRvIHJlLWFzc2lnbiBpdCB3aGVuZXZlciBjaGFuZ2VzLlxuICAgICAgICBjb25zdCB2aWV3Q29udGV4dCA9IHRoaXMuX2NyZWF0ZUNvbnRleHRGb3J3YXJkUHJveHkoKTtcbiAgICAgICAgdGhpcy5lbWJlZGRlZFZpZXdSZWYgPSB0aGlzLnZpZXdDb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGVSZWYsIHZpZXdDb250ZXh0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5za2lwID0gdHJ1ZTtcbiAgICAgIHN0YXRlQ2hhbmdlUGFyYW1zID0gdGhpcy5kZXRhaWxTZXJ2aWNlLnN0YXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZXdDb250YWluZXIuY2xlYXIoKTtcbiAgICAgIHRoaXMuZW1iZWRkZWRWaWV3UmVmID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlQ2hhbmdlLmVtaXQoc3RhdGVDaGFuZ2VQYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBhIGdpdmVuIG91dGxldCBpbnN0YW5jZSwgd2UgY3JlYXRlIGEgcHJveHkgb2JqZWN0IHRoYXQgZGVsZWdhdGVzXG4gICAqIHRvIHRoZSB1c2VyLXNwZWNpZmllZCBjb250ZXh0LiBUaGlzIGFsbG93cyBjaGFuZ2luZywgb3Igc3dhcHBpbmcgb3V0XG4gICAqIHRoZSBjb250ZXh0IG9iamVjdCBjb21wbGV0ZWx5IHdpdGhvdXQgaGF2aW5nIHRvIGRlc3Ryb3kvcmUtY3JlYXRlIHRoZSB2aWV3LlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlQ29udGV4dEZvcndhcmRQcm94eSgpIHtcbiAgICByZXR1cm4gbmV3IFByb3h5KFxuICAgICAge30sXG4gICAgICB7XG4gICAgICAgIHNldDogKF90YXJnZXQsIHByb3AsIG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnZpZXdDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBSZWZsZWN0LnNldCh0aGlzLnZpZXdDb250ZXh0LCBwcm9wLCBuZXdWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldDogKF90YXJnZXQsIHByb3AsIHJlY2VpdmVyKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnZpZXdDb250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGhpcy52aWV3Q29udGV4dCwgcHJvcCwgcmVjZWl2ZXIpO1xuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG4gIH1cbn1cbiJdfQ==