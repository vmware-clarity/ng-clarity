/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ChangeDetectionStrategy, Component, ContentChildren, Input, Optional, } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { AccordionService } from '../providers/accordion.service';
import { StepperService } from './providers/stepper.service';
import { ClrStepperPanel } from './stepper-panel';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "./providers/stepper.service";
export class ClrStepper {
    constructor(formGroup, ngForm, stepperService) {
        this.formGroup = formGroup;
        this.ngForm = ngForm;
        this.stepperService = stepperService;
        this.subscriptions = [];
    }
    ngOnInit() {
        if (!this.formGroup && !this.ngForm) {
            throw new Error('To use stepper a Reactive or Template Form is required.');
        }
        this.form = this.formGroup ? this.formGroup : this.ngForm;
        this.subscriptions.push(this.listenForPanelsCompleted());
        this.subscriptions.push(this.listenForFormResetChanges());
    }
    ngOnChanges(changes) {
        if (changes.initialPanel.currentValue !== changes.initialPanel.previousValue) {
            this.stepperService.overrideInitialPanel(this.initialPanel);
        }
    }
    ngAfterViewInit() {
        this.subscriptions.push(this.listenForDOMChanges());
    }
    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
    listenForFormResetChanges() {
        return fromControlReset(this.form.form).subscribe(() => this.stepperService.resetPanels());
    }
    listenForPanelsCompleted() {
        return this.stepperService.panelsCompleted.subscribe(panelsCompleted => {
            if (panelsCompleted && this.form.valid) {
                this.form.ngSubmit.emit();
            }
            else if (!this.form.valid && this.form.touched) {
                this.setPanelsWithFormErrors();
            }
        });
    }
    setPanelsWithFormErrors() {
        const panelsWithErrors = this.panels.reduce((panels, p) => (p.formGroup.invalid ? [...panels, p.id] : panels), []);
        this.stepperService.setPanelsWithErrors(panelsWithErrors);
    }
    listenForDOMChanges() {
        return this.panels.changes.pipe(startWith(this.panels)).subscribe((panels) => {
            this.stepperService.updatePanelOrder(panels.toArray().map(p => p.id));
            if (this.initialPanel) {
                this.stepperService.overrideInitialPanel(this.initialPanel);
            }
        });
    }
}
ClrStepper.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStepper, deps: [{ token: i1.FormGroupDirective, optional: true }, { token: i1.NgForm, optional: true }, { token: i2.StepperService }], target: i0.ɵɵFactoryTarget.Component });
ClrStepper.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrStepper, selector: "form[clrStepper]", inputs: { initialPanel: ["clrInitialStep", "initialPanel"] }, host: { properties: { "class.clr-accordion": "true", "class.clr-stepper-forms": "true" } }, providers: [StepperService, { provide: AccordionService, useExisting: StepperService }], queries: [{ propertyName: "panels", predicate: ClrStepperPanel, descendants: true }], usesOnChanges: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStepper, decorators: [{
            type: Component,
            args: [{
                    selector: 'form[clrStepper]',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.clr-accordion]': 'true',
                        '[class.clr-stepper-forms]': 'true',
                    },
                    providers: [StepperService, { provide: AccordionService, useExisting: StepperService }],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i1.FormGroupDirective, decorators: [{
                    type: Optional
                }] }, { type: i1.NgForm, decorators: [{
                    type: Optional
                }] }, { type: i2.StepperService }]; }, propDecorators: { initialPanel: [{
                type: Input,
                args: ['clrInitialStep']
            }], panels: [{
                type: ContentChildren,
                args: [ClrStepperPanel, { descendants: true }]
            }] } });
function fromControlReset(control) {
    return new Observable(observer => {
        const unpatchedControlReset = control.reset;
        control.reset = () => {
            observer.next();
            unpatchedControlReset.apply(control);
        };
        return () => {
            control.reset = unpatchedControlReset;
        };
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2FjY29yZGlvbi9zdGVwcGVyL3N0ZXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsS0FBSyxFQUlMLFFBQVEsR0FHVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsVUFBVSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUNoRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDbEUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQVlsRCxNQUFNLE9BQU8sVUFBVTtJQU1yQixZQUNzQixTQUE2QixFQUM3QixNQUFjLEVBQzFCLGNBQThCO1FBRmxCLGNBQVMsR0FBVCxTQUFTLENBQW9CO1FBQzdCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDMUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBTnhDLGtCQUFhLEdBQW1CLEVBQUUsQ0FBQztJQU9oQyxDQUFDO0lBRUosUUFBUTtRQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7U0FDNUU7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJ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O29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLElBQUksRUFBRTt3QkFDSix1QkFBdUIsRUFBRSxNQUFNO3dCQUMvQiwyQkFBMkIsRUFBRSxNQUFNO3FCQUNwQztvQkFDRCxTQUFTLEVBQUUsQ0FBQyxjQUFjLEVBQUUsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxDQUFDO29CQUN2RixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtpQkFDaEQ7OzBCQVFJLFFBQVE7OzBCQUNSLFFBQVE7eUVBUGMsWUFBWTtzQkFBcEMsS0FBSzt1QkFBQyxnQkFBZ0I7Z0JBQ2tDLE1BQU07c0JBQTlELGVBQWU7dUJBQUMsZUFBZSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRTs7QUFnRXpELFNBQVMsZ0JBQWdCLENBQUMsT0FBd0I7SUFDaEQsT0FBTyxJQUFJLFVBQVUsQ0FBTyxRQUFRLENBQUMsRUFBRTtRQUNyQyxNQUFNLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFFNUMsT0FBTyxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUU7WUFDbkIsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hCLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUM7UUFFRixPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sQ0FBQyxLQUFLLEdBQUcscUJBQXFCLENBQUM7UUFDeEMsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBTaW1wbGVDaGFuZ2VzLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCwgRm9ybUdyb3VwRGlyZWN0aXZlLCBOZ0Zvcm0gfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHN0YXJ0V2l0aCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQWNjb3JkaW9uU2VydmljZSB9IGZyb20gJy4uL3Byb3ZpZGVycy9hY2NvcmRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBTdGVwcGVyU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3N0ZXBwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJTdGVwcGVyUGFuZWwgfSBmcm9tICcuL3N0ZXBwZXItcGFuZWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdmb3JtW2NsclN0ZXBwZXJdJyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGVudD48L25nLWNvbnRlbnQ+YCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLWFjY29yZGlvbl0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5jbHItc3RlcHBlci1mb3Jtc10nOiAndHJ1ZScsXG4gIH0sXG4gIHByb3ZpZGVyczogW1N0ZXBwZXJTZXJ2aWNlLCB7IHByb3ZpZGU6IEFjY29yZGlvblNlcnZpY2UsIHVzZUV4aXN0aW5nOiBTdGVwcGVyU2VydmljZSB9XSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIENsclN0ZXBwZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCdjbHJJbml0aWFsU3RlcCcpIGluaXRpYWxQYW5lbDogc3RyaW5nO1xuICBAQ29udGVudENoaWxkcmVuKENsclN0ZXBwZXJQYW5lbCwgeyBkZXNjZW5kYW50czogdHJ1ZSB9KSBwYW5lbHM6IFF1ZXJ5TGlzdDxDbHJTdGVwcGVyUGFuZWw+O1xuICBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICBmb3JtOiBGb3JtR3JvdXBEaXJlY3RpdmUgfCBOZ0Zvcm07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBmb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIG5nRm9ybTogTmdGb3JtLFxuICAgIHByaXZhdGUgc3RlcHBlclNlcnZpY2U6IFN0ZXBwZXJTZXJ2aWNlXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuZm9ybUdyb3VwICYmICF0aGlzLm5nRm9ybSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUbyB1c2Ugc3RlcHBlciBhIFJlYWN0aXZlIG9yIFRlbXBsYXRlIEZvcm0gaXMgcmVxdWlyZWQuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5mb3JtID0gdGhpcy5mb3JtR3JvdXAgPyB0aGlzLmZvcm1Hcm91cCA6IHRoaXMubmdGb3JtO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMubGlzdGVuRm9yUGFuZWxzQ29tcGxldGVkKCkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMubGlzdGVuRm9yRm9ybVJlc2V0Q2hhbmdlcygpKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5pbml0aWFsUGFuZWwuY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzLmluaXRpYWxQYW5lbC5wcmV2aW91c1ZhbHVlKSB7XG4gICAgICB0aGlzLnN0ZXBwZXJTZXJ2aWNlLm92ZXJyaWRlSW5pdGlhbFBhbmVsKHRoaXMuaW5pdGlhbFBhbmVsKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2godGhpcy5saXN0ZW5Gb3JET01DaGFuZ2VzKCkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2gocyA9PiBzLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JGb3JtUmVzZXRDaGFuZ2VzKCkge1xuICAgIHJldHVybiBmcm9tQ29udHJvbFJlc2V0KHRoaXMuZm9ybS5mb3JtKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5zdGVwcGVyU2VydmljZS5yZXNldFBhbmVscygpKTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yUGFuZWxzQ29tcGxldGVkKCkge1xuICAgIHJldHVybiB0aGlzLnN0ZXBwZXJTZXJ2aWNlLnBhbmVsc0NvbXBsZXRlZC5zdWJzY3JpYmUocGFuZWxzQ29tcGxldGVkID0+IHtcbiAgICAgIGlmIChwYW5lbHNDb21wbGV0ZWQgJiYgdGhpcy5mb3JtLnZhbGlkKSB7XG4gICAgICAgIHRoaXMuZm9ybS5uZ1N1Ym1pdC5lbWl0KCk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLmZvcm0udmFsaWQgJiYgdGhpcy5mb3JtLnRvdWNoZWQpIHtcbiAgICAgICAgdGhpcy5zZXRQYW5lbHNXaXRoRm9ybUVycm9ycygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRQYW5lbHNXaXRoRm9ybUVycm9ycygpIHtcbiAgICBjb25zdCBwYW5lbHNXaXRoRXJyb3JzID0gdGhpcy5wYW5lbHMucmVkdWNlKChwYW5lbHMsIHApID0+IChwLmZvcm1Hcm91cC5pbnZhbGlkID8gWy4uLnBhbmVscywgcC5pZF0gOiBwYW5lbHMpLCBbXSk7XG4gICAgdGhpcy5zdGVwcGVyU2VydmljZS5zZXRQYW5lbHNXaXRoRXJyb3JzKHBhbmVsc1dpdGhFcnJvcnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JET01DaGFuZ2VzKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVscy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKHRoaXMucGFuZWxzKSkuc3Vic2NyaWJlKChwYW5lbHM6IFF1ZXJ5TGlzdDxDbHJTdGVwcGVyUGFuZWw+KSA9PiB7XG4gICAgICB0aGlzLnN0ZXBwZXJTZXJ2aWNlLnVwZGF0ZVBhbmVsT3JkZXIocGFuZWxzLnRvQXJyYXkoKS5tYXAocCA9PiBwLmlkKSk7XG5cbiAgICAgIGlmICh0aGlzLmluaXRpYWxQYW5lbCkge1xuICAgICAgICB0aGlzLnN0ZXBwZXJTZXJ2aWNlLm92ZXJyaWRlSW5pdGlhbFBhbmVsKHRoaXMuaW5pdGlhbFBhbmVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmcm9tQ29udHJvbFJlc2V0KGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkge1xuICByZXR1cm4gbmV3IE9ic2VydmFibGU8dm9pZD4ob2JzZXJ2ZXIgPT4ge1xuICAgIGNvbnN0IHVucGF0Y2hlZENvbnRyb2xSZXNldCA9IGNvbnRyb2wucmVzZXQ7XG5cbiAgICBjb250cm9sLnJlc2V0ID0gKCkgPT4ge1xuICAgICAgb2JzZXJ2ZXIubmV4dCgpO1xuICAgICAgdW5wYXRjaGVkQ29udHJvbFJlc2V0LmFwcGx5KGNvbnRyb2wpO1xuICAgIH07XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29udHJvbC5yZXNldCA9IHVucGF0Y2hlZENvbnRyb2xSZXNldDtcbiAgICB9O1xuICB9KTtcbn1cbiJdfQ==