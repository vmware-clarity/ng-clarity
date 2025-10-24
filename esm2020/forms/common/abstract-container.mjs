/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ContentChild, Directive, Optional } from '@angular/core';
import { ClrControlError } from './error';
import { ClrControlHelper } from './helper';
import { CONTROL_STATE } from './if-control-state/if-control-state.service';
import { ClrLabel } from './label';
import { ClrControlSuccess } from './success';
import * as i0 from "@angular/core";
import * as i1 from "./if-control-state/if-control-state.service";
import * as i2 from "./providers/layout.service";
import * as i3 from "./providers/control-class.service";
import * as i4 from "./providers/ng-control.service";
export class ClrAbstractContainer {
    constructor(ifControlStateService, layoutService, controlClassService, ngControlService) {
        this.ifControlStateService = ifControlStateService;
        this.layoutService = layoutService;
        this.controlClassService = controlClassService;
        this.ngControlService = ngControlService;
        this.subscriptions = [];
        this.subscriptions.push(ifControlStateService.statusChanges.subscribe((state) => {
            this.state = state;
            // Make sure everything is updated before dispatching the values for helpers
            setTimeout(() => {
                this.updateHelpers();
            });
        }));
        this.subscriptions.push(ngControlService.controlChanges.subscribe(control => {
            this.control = control;
        }), ngControlService.additionalControlsChanges.subscribe(controls => {
            this.additionalControls = controls;
        }));
    }
    /**
     * @NOTE
     * Helper control is a bit different than the others, it must be always visible:
     *   -  Labels and instructions must always accompany forms and are persistent.
     *   -  The recommendation here is to always have helper text or anything instructions visible.
     *   -  The expectation is to have error text + helper text in the errored state. this way all users will have the helper text information always available.
     */
    get showHelper() {
        /**
         * @NOTE
         * Saving the previous version in case something is changed. We'll return always true so we can be flexible
         * and keep the condition per components.
         *
         * return (
         * Helper Component exist and the state of the form is NONE (not touched)
         * (!!this.controlHelperComponent && (!this.touched || this.state === CONTROL_STATE.NONE)) ||
         * or there is no success component but the state of the form is VALID - show helper information
         * (!!this.controlSuccessComponent === false && this.state === CONTROL_STATE.VALID) ||
         * or there is no error component but the state of the form is INVALID - show helper information
         * (!!this.controlErrorComponent === false && this.state === CONTROL_STATE.INVALID)
         * );
         */
        return Boolean(this.controlHelperComponent);
    }
    get showValid() {
        return this.touched && this.state === CONTROL_STATE.VALID && this.successMessagePresent;
    }
    get showInvalid() {
        return this.touched && this.state === CONTROL_STATE.INVALID && this.errorMessagePresent;
    }
    get successMessagePresent() {
        return !!this.controlSuccessComponent;
    }
    get errorMessagePresent() {
        return !!this.controlErrorComponent;
    }
    get touched() {
        return !!(this.control?.touched || this.additionalControls?.some(control => control.touched));
    }
    ngAfterContentInit() {
        /**
         * We gonna set the helper control state, after all or most of the components
         * are ready - also this will trigger some initial flows into wrappers and controls,
         * like locating IDs  and setting  attributes.
         */
        this.updateHelpers();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
    controlClass() {
        /**
         * Decide what subtext to display:
         *   - container is valid but no success component is implemented - use helper class
         *   - container is valid and success component is implemented - use success class
         */
        if ((!this.controlSuccessComponent && this.state === CONTROL_STATE.VALID) || !this.touched) {
            return this.controlClassService.controlClass(CONTROL_STATE.NONE, this.addGrid());
        }
        /**
         * Pass form control state and return string of classes to be applied to the container.
         */
        return this.controlClassService.controlClass(this.state, this.addGrid());
    }
    addGrid() {
        return this.layoutService && !this.layoutService.isVertical();
    }
    updateHelpers() {
        if (this.ngControlService) {
            this.ngControlService.setHelpers({
                show: this.showInvalid || this.showHelper || this.showValid,
                showInvalid: this.showInvalid,
                showHelper: this.showHelper,
                showValid: this.showValid,
            });
        }
    }
}
ClrAbstractContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAbstractContainer, deps: [{ token: i1.IfControlStateService }, { token: i2.LayoutService, optional: true }, { token: i3.ControlClassService }, { token: i4.NgControlService }], target: i0.ɵɵFactoryTarget.Directive });
ClrAbstractContainer.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrAbstractContainer, queries: [{ propertyName: "label", first: true, predicate: ClrLabel, descendants: true }, { propertyName: "controlSuccessComponent", first: true, predicate: ClrControlSuccess, descendants: true }, { propertyName: "controlErrorComponent", first: true, predicate: ClrControlError, descendants: true }, { propertyName: "controlHelperComponent", first: true, predicate: ClrControlHelper, descendants: true }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAbstractContainer, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.IfControlStateService }, { type: i2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i3.ControlClassService }, { type: i4.NgControlService }]; }, propDecorators: { label: [{
                type: ContentChild,
                args: [ClrLabel, { static: false }]
            }], controlSuccessComponent: [{
                type: ContentChild,
                args: [ClrControlSuccess]
            }], controlErrorComponent: [{
                type: ContentChild,
                args: [ClrControlError]
            }], controlHelperComponent: [{
                type: ContentChild,
                args: [ClrControlHelper]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QtY29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tbW9uL2Fic3RyYWN0LWNvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBb0IsWUFBWSxFQUFFLFNBQVMsRUFBYSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJL0YsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUMxQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDNUMsT0FBTyxFQUFFLGFBQWEsRUFBeUIsTUFBTSw2Q0FBNkMsQ0FBQztBQUNuRyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBSW5DLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFdBQVcsQ0FBQzs7Ozs7O0FBRzlDLE1BQU0sT0FBZ0Isb0JBQW9CO0lBYXhDLFlBQ1kscUJBQTRDLEVBQ2hDLGFBQTRCLEVBQ3hDLG1CQUF3QyxFQUN4QyxnQkFBa0M7UUFIbEMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUNoQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUN4Qyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFScEMsa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBVTNDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixxQkFBcUIsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBb0IsRUFBRSxFQUFFO1lBQ3JFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLDRFQUE0RTtZQUM1RSxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN2QixDQUFDLENB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QUFDLFNBQVM7YUFDMUIsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDOztpSEE3SG1CLG9CQUFvQjtxR0FBcEIsb0JBQW9CLDZEQUMxQixRQUFRLDBGQUNSLGlCQUFpQix3RkFDakIsZUFBZSx5RkFDZixnQkFBZ0I7MkZBSlYsb0JBQW9CO2tCQUR6QyxTQUFTOzswQkFnQkwsUUFBUTs2R0FkZ0MsS0FBSztzQkFBL0MsWUFBWTt1QkFBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dCQUNSLHVCQUF1QjtzQkFBdkQsWUFBWTt1QkFBQyxpQkFBaUI7Z0JBQ0EscUJBQXFCO3NCQUFuRCxZQUFZO3VCQUFDLGVBQWU7Z0JBQ0csc0JBQXNCO3NCQUFyRCxZQUFZO3VCQUFDLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQ29udGVudENoaWxkLCBEaXJlY3RpdmUsIE9uRGVzdHJveSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJDb250cm9sRXJyb3IgfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCB7IENsckNvbnRyb2xIZWxwZXIgfSBmcm9tICcuL2hlbHBlcic7XG5pbXBvcnQgeyBDT05UUk9MX1NUQVRFLCBJZkNvbnRyb2xTdGF0ZVNlcnZpY2UgfSBmcm9tICcuL2lmLWNvbnRyb2wtc3RhdGUvaWYtY29udHJvbC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IENsckxhYmVsIH0gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQgeyBDb250cm9sQ2xhc3NTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvY29udHJvbC1jbGFzcy5zZXJ2aWNlJztcbmltcG9ydCB7IExheW91dFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9sYXlvdXQuc2VydmljZSc7XG5pbXBvcnQgeyBOZ0NvbnRyb2xTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvbmctY29udHJvbC5zZXJ2aWNlJztcbmltcG9ydCB7IENsckNvbnRyb2xTdWNjZXNzIH0gZnJvbSAnLi9zdWNjZXNzJztcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2xyQWJzdHJhY3RDb250YWluZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIEFmdGVyQ29udGVudEluaXQge1xuICBAQ29udGVudENoaWxkKENsckxhYmVsLCB7IHN0YXRpYzogZmFsc2UgfSkgbGFiZWw6IENsckxhYmVsO1xuICBAQ29udGVudENoaWxkKENsckNvbnRyb2xTdWNjZXNzKSBjb250cm9sU3VjY2Vzc0NvbXBvbmVudDogQ2xyQ29udHJvbFN1Y2Nlc3M7XG4gIEBDb250ZW50Q2hpbGQoQ2xyQ29udHJvbEVycm9yKSBjb250cm9sRXJyb3JDb21wb25lbnQ6IENsckNvbnRyb2xFcnJvcjtcbiAgQENvbnRlbnRDaGlsZChDbHJDb250cm9sSGVscGVyKSBjb250cm9sSGVscGVyQ29tcG9uZW50OiBDbHJDb250cm9sSGVscGVyO1xuXG4gIGNvbnRyb2w6IE5nQ29udHJvbDtcbiAgYWRkaXRpb25hbENvbnRyb2xzOiBOZ0NvbnRyb2xbXTtcblxuICBwcm90ZWN0ZWQgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBwcml2YXRlIHN0YXRlOiBDT05UUk9MX1NUQVRFO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpZkNvbnRyb2xTdGF0ZVNlcnZpY2U6IElmQ29udHJvbFN0YXRlU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgbGF5b3V0U2VydmljZTogTGF5b3V0U2VydmljZSxcbiAgICBwcm90ZWN0ZWQgY29udHJvbENsYXNzU2VydmljZTogQ29udHJvbENsYXNzU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgbmdDb250cm9sU2VydmljZTogTmdDb250cm9sU2VydmljZVxuICApIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIGlmQ29udHJvbFN0YXRlU2VydmljZS5zdGF0dXNDaGFuZ2VzLnN1YnNjcmliZSgoc3RhdGU6IENPTlRST0xfU1RBVEUpID0+IHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAvLyBNYWtlIHN1cmUgZXZlcnl0aGluZyBpcyB1cGRhdGVkIGJlZm9yZSBkaXNwYXRjaGluZyB0aGUgdmFsdWVzIGZvciBoZWxwZXJzXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudXBkYXRlSGVscGVycygpO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgbmdDb250cm9sU2VydmljZS5jb250cm9sQ2hhbmdlcy5zdWJzY3JpYmUoY29udHJvbCA9PiB7XG4gICAgICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XG4gICAgICB9KSxcbiAgICAgIG5nQ29udHJvbFNlcnZpY2UuYWRkaXRpb25hbENvbnRyb2xzQ2hhbmdlcy5zdWJzY3JpYmUoY29udHJvbHMgPT4ge1xuICAgICAgICB0aGlzLmFkZGl0aW9uYWxDb250cm9scyA9IGNvbnRyb2xzO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBOT1RFXG4gICAqIEhlbHBlciBjb250cm9sIGlzIGEgYml0IGRpZmZlcmVudCB0aGFuIHRoZSBvdGhlcnMsIGl0IG11c3QgYmUgYWx3YXlzIHZpc2libGU6XG4gICAqICAgLSAgTGFiZWxzIGFuZCBpbnN0cnVjdGlvbnMgbXVzdCBhbHdheXMgYWNjb21wYW55IGZvcm1zIGFuZCBhcmUgcGVyc2lzdGVudC5cbiAgICogICAtICBUaGUgcmVjb21tZW5kYXRpb24gaGVyZSBpcyB0byBhbHdheXMgaGF2ZSBoZWxwZXIgdGV4dCBvciBhbnl0aGluZyBpbnN0cnVjdGlvbnMgdmlzaWJsZS5cbiAgICogICAtICBUaGUgZXhwZWN0YXRpb24gaXMgdG8gaGF2ZSBlcnJvciB0ZXh0ICsgaGVscGVyIHRleHQgaW4gdGhlIGVycm9yZWQgc3RhdGUuIHRoaXMgd2F5IGFsbCB1c2VycyB3aWxsIGhhdmUgdGhlIGhlbHBlciB0ZXh0IGluZm9ybWF0aW9uIGFsd2F5cyBhdmFpbGFibGUuXG4gICAqL1xuICBnZXQgc2hvd0hlbHBlcigpOiBib29sZWFuIHtcbiAgICAvKipcbiAgICAgKiBATk9URVxuICAgICAqIFNhdmluZyB0aGUgcHJldmlvdXMgdmVyc2lvbiBpbiBjYXNlIHNvbWV0aGluZyBpcyBjaGFuZ2VkLiBXZSdsbCByZXR1cm4gYWx3YXlzIHRydWUgc28gd2UgY2FuIGJlIGZsZXhpYmxlXG4gICAgICogYW5kIGtlZXAgdGhlIGNvbmRpdGlvbiBwZXIgY29tcG9uZW50cy5cbiAgICAgKlxuICAgICAqIHJldHVybiAoXG4gICAgICogSGVscGVyIENvbXBvbmVudCBleGlzdCBhbmQgdGhlIHN0YXRlIG9mIHRoZSBmb3JtIGlzIE5PTkUgKG5vdCB0b3VjaGVkKVxuICAgICAqICghIXRoaXMuY29udHJvbEhlbHBlckNvbXBvbmVudCAmJiAoIXRoaXMudG91Y2hlZCB8fCB0aGlzLnN0YXRlID09PSBDT05UUk9MX1NUQVRFLk5PTkUpKSB8fFxuICAgICAqIG9yIHRoZXJlIGlzIG5vIHN1Y2Nlc3MgY29tcG9uZW50IGJ1dCB0aGUgc3RhdGUgb2YgdGhlIGZvcm0gaXMgVkFMSUQgLSBzaG93IGhlbHBlciBpbmZvcm1hdGlvblxuICAgICAqICghIXRoaXMuY29udHJvbFN1Y2Nlc3NDb21wb25lbnQgPT09IGZhbHNlICYmIHRoaXMuc3RhdGUgPT09IENPTlRST0xfU1RBVEUuVkFMSUQpIHx8XG4gICAgICogb3IgdGhlcmUgaXMgbm8gZXJyb3IgY29tcG9uZW50IGJ1dCB0aGUgc3RhdGUgb2YgdGhlIGZvcm0gaXMgSU5WQUxJRCAtIHNob3cgaGVscGVyIGluZm9ybWF0aW9uXG4gICAgICogKCEhdGhpcy5jb250cm9sRXJyb3JDb21wb25lbnQgPT09IGZhbHNlICYmIHRoaXMuc3RhdGUgPT09IENPTlRST0xfU1RBVEUuSU5WQUxJRClcbiAgICAgKiApO1xuICAgICAqL1xuICAgIHJldHVybiBCb29sZWFuKHRoaXMuY29udHJvbEhlbHBlckNvbXBvbmVudCk7XG4gIH1cblxuICBnZXQgc2hvd1ZhbGlkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnRvdWNoZWQgJiYgdGhpcy5zdGF0ZSA9PT0gQ09OVFJPTF9TVEFURS5WQUxJRCAmJiB0aGlzLnN1Y2Nlc3NNZXNzYWdlUHJlc2VudDtcbiAgfVxuXG4gIGdldCBzaG93SW52YWxpZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50b3VjaGVkICYmIHRoaXMuc3RhdGUgPT09IENPTlRST0xfU1RBVEUuSU5WQUxJRCAmJiB0aGlzLmVycm9yTWVzc2FnZVByZXNlbnQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IHN1Y2Nlc3NNZXNzYWdlUHJlc2VudCgpIHtcbiAgICByZXR1cm4gISF0aGlzLmNvbnRyb2xTdWNjZXNzQ29tcG9uZW50O1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBlcnJvck1lc3NhZ2VQcmVzZW50KCkge1xuICAgIHJldHVybiAhIXRoaXMuY29udHJvbEVycm9yQ29tcG9uZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgdG91Y2hlZCgpIHtcbiAgICByZXR1cm4gISEodGhpcy5jb250cm9sPy50b3VjaGVkIHx8IHRoaXMuYWRkaXRpb25hbENvbnRyb2xzPy5zb21lKGNvbnRyb2wgPT4gY29udHJvbC50b3VjaGVkKSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgLyoqXG4gICAgICogV2UgZ29ubmEgc2V0IHRoZSBoZWxwZXIgY29udHJvbCBzdGF0ZSwgYWZ0ZXIgYWxsIG9yIG1vc3Qgb2YgdGhlIGNvbXBvbmVudHNcbiAgICAgKiBhcmUgcmVhZHkgLSBhbHNvIHRoaXMgd2lsbCB0cmlnZ2VyIHNvbWUgaW5pdGlhbCBmbG93cyBpbnRvIHdyYXBwZXJzIGFuZCBjb250cm9scyxcbiAgICAgKiBsaWtlIGxvY2F0aW5nIElEcyAgYW5kIHNldHRpbmcgIGF0dHJpYnV0ZXMuXG4gICAgICovXG4gICAgdGhpcy51cGRhdGVIZWxwZXJzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWJzY3JpcHRpb24gPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgY29udHJvbENsYXNzKCkge1xuICAgIC8qKlxuICAgICAqIERlY2lkZSB3aGF0IHN1YnRleHQgdG8gZGlzcGxheTpcbiAgICAgKiAgIC0gY29udGFpbmVyIGlzIHZhbGlkIGJ1dCBubyBzdWNjZXNzIGNvbXBvbmVudCBpcyBpbXBsZW1lbnRlZCAtIHVzZSBoZWxwZXIgY2xhc3NcbiAgICAgKiAgIC0gY29udGFpbmVyIGlzIHZhbGlkIGFuZCBzdWNjZXNzIGNvbXBvbmVudCBpcyBpbXBsZW1lbnRlZCAtIHVzZSBzdWNjZXNzIGNsYXNzXG4gICAgICovXG4gICAgaWYgKCghdGhpcy5jb250cm9sU3VjY2Vzc0NvbXBvbmVudCAmJiB0aGlzLnN0YXRlID09PSBDT05UUk9MX1NUQVRFLlZBTElEKSB8fCAhdGhpcy50b3VjaGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sQ2xhc3NTZXJ2aWNlLmNvbnRyb2xDbGFzcyhDT05UUk9MX1NUQVRFLk5PTkUsIHRoaXMuYWRkR3JpZCgpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGFzcyBmb3JtIGNvbnRyb2wgc3RhdGUgYW5kIHJldHVybiBzdHJpbmcgb2YgY2xhc3NlcyB0byBiZSBhcHBsaWVkIHRvIHRoZSBjb250YWluZXIuXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMuY29udHJvbENsYXNzU2VydmljZS5jb250cm9sQ2xhc3ModGhpcy5zdGF0ZSwgdGhpcy5hZGRHcmlkKCkpO1xuICB9XG5cbiAgYWRkR3JpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5sYXlvdXRTZXJ2aWNlICYmICF0aGlzLmxheW91dFNlcnZpY2UuaXNWZXJ0aWNhbCgpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVIZWxwZXJzKCkge1xuICAgIGlmICh0aGlzLm5nQ29udHJvbFNlcnZpY2UpIHtcbiAgICAgIHRoaXMubmdDb250cm9sU2VydmljZS5zZXRIZWxwZXJzKHtcbiAgICAgICAgc2hvdzogdGhpcy5zaG93SW52YWxpZCB8fCB0aGlzLnNob3dIZWxwZXIgfHwgdGhpcy5zaG93VmFsaWQsXG4gICAgICAgIHNob3dJbnZhbGlkOiB0aGlzLnNob3dJbnZhbGlkLFxuICAgICAgICBzaG93SGVscGVyOiB0aGlzLnNob3dIZWxwZXIsXG4gICAgICAgIHNob3dWYWxpZDogdGhpcy5zaG93VmFsaWQsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==