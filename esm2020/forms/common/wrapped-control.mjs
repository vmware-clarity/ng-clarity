/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostBinding, HostListener, Input, KeyValueDiffers, } from '@angular/core';
import { HostWrapper } from '../../utils/host-wrapping/host-wrapper';
import { CONTROL_SUFFIX } from './abstract-control';
import { IfControlStateService } from './if-control-state/if-control-state.service';
import { ContainerIdService } from './providers/container-id.service';
import { ControlClassService } from './providers/control-class.service';
import { ControlIdService } from './providers/control-id.service';
import { MarkControlService } from './providers/mark-control.service';
import { NgControlService } from './providers/ng-control.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export var CHANGE_KEYS;
(function (CHANGE_KEYS) {
    CHANGE_KEYS["FORM"] = "form";
    CHANGE_KEYS["MODEL"] = "model";
})(CHANGE_KEYS || (CHANGE_KEYS = {}));
export class WrappedFormControl {
    // I lost way too much time trying to make this work without injecting the ViewContainerRef and the Injector,
    // I'm giving up. So we have to inject these two manually for now.
    constructor(vcr, wrapperType, injector, _ngControl, renderer, el) {
        this.vcr = vcr;
        this.wrapperType = wrapperType;
        this._ngControl = _ngControl;
        this.renderer = renderer;
        this.el = el;
        this.index = 0;
        this.subscriptions = [];
        this.additionalDiffer = new Map();
        if (injector) {
            this.ngControlService = injector.get(NgControlService, null);
            this.ifControlStateService = injector.get(IfControlStateService, null);
            this.controlClassService = injector.get(ControlClassService, null);
            this.markControlService = injector.get(MarkControlService, null);
            this.differs = injector.get(KeyValueDiffers, null);
        }
        if (this.controlClassService) {
            this.controlClassService.initControlClass(renderer, el.nativeElement);
        }
        if (this.markControlService) {
            this.subscriptions.push(this.markControlService.touchedChange.subscribe(() => {
                this.markAsTouched();
            }));
        }
        if (this.ngControlService) {
            this.subscriptions.push(this.ngControlService.helpersChange.subscribe((state) => {
                this.setAriaDescribedBy(state);
            }));
        }
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
        if (this.controlIdService) {
            this.controlIdService.id = value;
        }
    }
    get hasAdditionalControls() {
        return this.additionalDiffer.size > 0;
    }
    ngOnInit() {
        this._containerInjector = new HostWrapper(this.wrapperType, this.vcr, this.index);
        this.controlIdService = this._containerInjector.get(ControlIdService);
        /**
         * not all containers will provide `ContainerIdService`
         */
        this.containerIdService = this._containerInjector.get(ContainerIdService, null);
        if (this._id) {
            this.controlIdService.id = this._id;
        }
        else {
            this._id = this.controlIdService.id;
        }
        if (this.ngControlService && this._ngControl) {
            if (!this.ngControlService.control) {
                this.ngControl = this._ngControl;
                this.ngControlService.setControl(this.ngControl);
                this.differ = this.differs.find(this._ngControl).create();
            }
            else {
                this.ngControl = this.ngControlService.control;
                this.ngControlService.addAdditionalControl(this._ngControl);
                this.additionalDiffer.set(this._ngControl, this.differs.find(this._ngControl).create());
            }
        }
    }
    ngDoCheck() {
        this.triggerDoCheck(this.differ, this.ngControl);
        if (this.hasAdditionalControls) {
            for (const [ngControl, differ] of this.additionalDiffer) {
                this.triggerDoCheck(differ, ngControl);
            }
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub?.unsubscribe());
    }
    triggerValidation() {
        if (this.ifControlStateService) {
            this.ifControlStateService.triggerStatusChange();
        }
    }
    // @TODO This method has a try/catch due to an unknown issue that came when building the clrToggle feature
    // We need to figure out why this fails for the ClrToggle scenario but works for Date picker...
    // To see the error, remove the try/catch here and run the ClrToggle suite to see issues getting the container
    // injector in time, and this ONLY HAPPENS in tests and not in dev/prod mode.
    getProviderFromContainer(token, notFoundValue) {
        try {
            return this._containerInjector.get(token, notFoundValue);
        }
        catch (e) {
            return notFoundValue;
        }
    }
    triggerDoCheck(differ, ngControl) {
        if (differ) {
            const changes = differ.diff(ngControl);
            if (changes) {
                changes.forEachChangedItem(change => {
                    if ((change.key === CHANGE_KEYS.FORM || change.key === CHANGE_KEYS.MODEL) &&
                        change.currentValue !== change.previousValue) {
                        this.triggerValidation();
                    }
                });
            }
        }
    }
    markAsTouched() {
        if (this.ngControl) {
            this.ngControl.control.markAsTouched();
            this.ngControl.control.updateValueAndValidity();
        }
        if (this.ngControlService && this.ngControlService.hasAdditionalControls) {
            this.ngControlService.additionalControls?.forEach((ngControl) => {
                ngControl.control.markAsTouched();
                ngControl.control.updateValueAndValidity();
            });
        }
    }
    setAriaDescribedBy(helpers) {
        if (helpers.show) {
            const ariaDescribedBy = this.getAriaDescribedById(helpers);
            if (ariaDescribedBy !== null) {
                this.renderer.setAttribute(this.el.nativeElement, 'aria-describedby', ariaDescribedBy);
                return;
            }
        }
        this.renderer.removeAttribute(this.el.nativeElement, 'aria-describedby');
    }
    getAriaDescribedById(helpers) {
        const elementId = this.containerIdService?.id || this.controlIdService?.id;
        /**
         * If ContainerIdService or ControlIdService are missing don't try to guess
         * Don't set anything.
         */
        if (!elementId) {
            return null;
        }
        /**
         * As the helper text is now always visible. If we have error/success then we should use both ids.
         */
        const describedByIds = [`${elementId}-${CONTROL_SUFFIX.HELPER}`];
        if (helpers.showInvalid) {
            describedByIds.push(`${elementId}-${CONTROL_SUFFIX.ERROR}`);
        }
        else if (helpers.showValid) {
            describedByIds.push(`${elementId}-${CONTROL_SUFFIX.SUCCESS}`);
        }
        return describedByIds.join(' ');
    }
}
WrappedFormControl.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: WrappedFormControl, deps: [{ token: i0.ViewContainerRef }, { token: i0.Type }, { token: i0.Injector }, { token: i1.NgControl }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
WrappedFormControl.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: WrappedFormControl, inputs: { id: "id" }, host: { listeners: { "blur": "triggerValidation()" }, properties: { "id": "this.id" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: WrappedFormControl, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.Type }, { type: i0.Injector }, { type: i1.NgControl }, { type: i0.Renderer2 }, { type: i0.ElementRef }]; }, propDecorators: { id: [{
                type: Input
            }, {
                type: HostBinding
            }], triggerValidation: [{
                type: HostListener,
                args: ['blur']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcHBlZC1jb250cm9sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tbW9uL3dyYXBwZWQtY29udHJvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBR1QsV0FBVyxFQUNYLFlBQVksRUFHWixLQUFLLEVBRUwsZUFBZSxHQU1oQixNQUFNLGVBQWUsQ0FBQztBQUl2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDckUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3RFLE9BQU8sRUFBVyxnQkFBZ0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDOzs7QUFFM0UsTUFBTSxDQUFOLElBQVksV0FHWDtBQUhELFdBQVksV0FBVztJQUNyQiw0QkFBYSxDQUFBO0lBQ2IsOEJBQWUsQ0FBQTtBQUNqQixDQUFDLEVBSFcsV0FBVyxLQUFYLFdBQVcsUUFHdEI7QUFHRCxNQUFNLE9BQU8sa0JBQWtCO0lBa0I3Qiw2R0FBNkc7SUFDN0csa0VBQWtFO0lBQ2xFLFlBQ1ksR0FBcUIsRUFDckIsV0FBb0IsRUFDOUIsUUFBa0IsRUFDVixVQUE0QixFQUMxQixRQUFtQixFQUNuQixFQUEyQjtRQUwzQixRQUFHLEdBQUgsR0FBRyxDQUFrQjtRQUNyQixnQkFBVyxHQUFYLFdBQVcs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UyxJQUFJLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ2pFLElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUN2QixjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxJQUFJLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQzdEO2FBQU0sSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO1lBQzVCLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLElBQUksY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDL0Q7UUFDRCxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7K0dBak1VLGtCQUFrQjttR0FBbEIsa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBRDlCLFNBQVM7ME5BMkRKLEVBQUU7c0JBRkwsS0FBSzs7c0JBQ0wsV0FBVztnQkF5RFosaUJBQWlCO3NCQURoQixZQUFZO3VCQUFDLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgS2V5VmFsdWVEaWZmZXIsXG4gIEtleVZhbHVlRGlmZmVycyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFJlbmRlcmVyMixcbiAgVHlwZSxcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ0NvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSG9zdFdyYXBwZXIgfSBmcm9tICcuLi8uLi91dGlscy9ob3N0LXdyYXBwaW5nL2hvc3Qtd3JhcHBlcic7XG5pbXBvcnQgeyBDT05UUk9MX1NVRkZJWCB9IGZyb20gJy4vYWJzdHJhY3QtY29udHJvbCc7XG5pbXBvcnQgeyBJZkNvbnRyb2xTdGF0ZVNlcnZpY2UgfSBmcm9tICcuL2lmLWNvbnRyb2wtc3RhdGUvaWYtY29udHJvbC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnRhaW5lcklkU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2NvbnRhaW5lci1pZC5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnRyb2xDbGFzc1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9jb250cm9sLWNsYXNzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udHJvbElkU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2NvbnRyb2wtaWQuc2VydmljZSc7XG5pbXBvcnQgeyBNYXJrQ29udHJvbFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9tYXJrLWNvbnRyb2wuc2VydmljZSc7XG5pbXBvcnQgeyBIZWxwZXJzLCBOZ0NvbnRyb2xTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvbmctY29udHJvbC5zZXJ2aWNlJztcblxuZXhwb3J0IGVudW0gQ0hBTkdFX0tFWVMge1xuICBGT1JNID0gJ2Zvcm0nLFxuICBNT0RFTCA9ICdtb2RlbCcsXG59XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIFdyYXBwZWRGb3JtQ29udHJvbDxXPiBpbXBsZW1lbnRzIE9uSW5pdCwgRG9DaGVjaywgT25EZXN0cm95IHtcbiAgX2lkOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIGNvbnRyb2xJZFNlcnZpY2U6IENvbnRyb2xJZFNlcnZpY2U7XG4gIHByb3RlY3RlZCBuZ0NvbnRyb2xTZXJ2aWNlOiBOZ0NvbnRyb2xTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgaW5kZXggPSAwO1xuICBwcm90ZWN0ZWQgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBwcml2YXRlIGlmQ29udHJvbFN0YXRlU2VydmljZTogSWZDb250cm9sU3RhdGVTZXJ2aWNlO1xuICBwcml2YXRlIGNvbnRyb2xDbGFzc1NlcnZpY2U6IENvbnRyb2xDbGFzc1NlcnZpY2U7XG4gIHByaXZhdGUgbWFya0NvbnRyb2xTZXJ2aWNlOiBNYXJrQ29udHJvbFNlcnZpY2U7XG4gIHByaXZhdGUgY29udGFpbmVySWRTZXJ2aWNlOiBDb250YWluZXJJZFNlcnZpY2U7XG4gIHByaXZhdGUgX2NvbnRhaW5lckluamVjdG9yOiBJbmplY3RvcjtcbiAgcHJpdmF0ZSBkaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnM7XG4gIHByaXZhdGUgZGlmZmVyOiBLZXlWYWx1ZURpZmZlcjxhbnksIGFueT47XG4gIHByaXZhdGUgYWRkaXRpb25hbERpZmZlciA9IG5ldyBNYXA8TmdDb250cm9sLCBLZXlWYWx1ZURpZmZlcjxhbnksIGFueT4+KCk7XG4gIHByaXZhdGUgbmdDb250cm9sOiBOZ0NvbnRyb2wgfCBudWxsO1xuXG4gIC8vIEkgbG9zdCB3YXkgdG9vIG11Y2ggdGltZSB0cnlpbmcgdG8gbWFrZSB0aGlzIHdvcmsgd2l0aG91dCBpbmplY3RpbmcgdGhlIFZpZXdDb250YWluZXJSZWYgYW5kIHRoZSBJbmplY3RvcixcbiAgLy8gSSdtIGdpdmluZyB1cC4gU28gd2UgaGF2ZSB0byBpbmplY3QgdGhlc2UgdHdvIG1hbnVhbGx5IGZvciBub3cuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCB2Y3I6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJvdGVjdGVkIHdyYXBwZXJUeXBlOiBUeXBlPFc+LFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIF9uZ0NvbnRyb2w6IE5nQ29udHJvbCB8IG51bGwsXG4gICAgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJvdGVjdGVkIGVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PlxuICApIHtcbiAgICBpZiAoaW5qZWN0b3IpIHtcbiAgICAgIHRoaXMubmdDb250cm9sU2VydmljZSA9IGluamVjdG9yLmdldChOZ0NvbnRyb2xTZXJ2aWNlLCBudWxsKTtcbiAgICAgIHRoaXMuaWZDb250cm9sU3RhdGVTZXJ2aWNlID0gaW5qZWN0b3IuZ2V0KElmQ29udHJvbFN0YXRlU2VydmljZSwgbnVsbCk7XG4gICAgICB0aGlzLmNvbnRyb2xDbGFzc1NlcnZpY2UgPSBpbmplY3Rvci5nZXQoQ29udHJvbENsYXNzU2VydmljZSwgbnVsbCk7XG4gICAgICB0aGlzLm1hcmtDb250cm9sU2VydmljZSA9IGluamVjdG9yLmdldChNYXJrQ29udHJvbFNlcnZpY2UsIG51bGwpO1xuICAgICAgdGhpcy5kaWZmZXJzID0gaW5qZWN0b3IuZ2V0KEtleVZhbHVlRGlmZmVycywgbnVsbCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29udHJvbENsYXNzU2VydmljZSkge1xuICAgICAgdGhpcy5jb250cm9sQ2xhc3NTZXJ2aWNlLmluaXRDb250cm9sQ2xhc3MocmVuZGVyZXIsIGVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXJrQ29udHJvbFNlcnZpY2UpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICB0aGlzLm1hcmtDb250cm9sU2VydmljZS50b3VjaGVkQ2hhbmdlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5tYXJrQXNUb3VjaGVkKCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm5nQ29udHJvbFNlcnZpY2UpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICB0aGlzLm5nQ29udHJvbFNlcnZpY2UuaGVscGVyc0NoYW5nZS5zdWJzY3JpYmUoKHN0YXRlOiBIZWxwZXJzKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRBcmlhRGVzY3JpYmVkQnkoc3RhdGUpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoKVxuICBASG9zdEJpbmRpbmcoKVxuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG4gIHNldCBpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5faWQgPSB2YWx1ZTtcbiAgICBpZiAodGhpcy5jb250cm9sSWRTZXJ2aWNlKSB7XG4gICAgICB0aGlzLmNvbnRyb2xJZFNlcnZpY2UuaWQgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldCBoYXNBZGRpdGlvbmFsQ29udHJvbHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkaXRpb25hbERpZmZlci5zaXplID4gMDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2NvbnRhaW5lckluamVjdG9yID0gbmV3IEhvc3RXcmFwcGVyKHRoaXMud3JhcHBlclR5cGUsIHRoaXMudmNyLCB0aGlzLmluZGV4KTtcbiAgICB0aGlzLmNvbnRyb2xJZFNlcnZpY2UgPSB0aGlzLl9jb250YWluZXJJbmplY3Rvci5nZXQoQ29udHJvbElkU2VydmljZSk7XG5cbiAgICAvKipcbiAgICAgKiBub3QgYWxsIGNvbnRhaW5lcnMgd2lsbCBwcm92aWRlIGBDb250YWluZXJJZFNlcnZpY2VgXG4gICAgICovXG4gICAgdGhpcy5jb250YWluZXJJZFNlcnZpY2UgPSB0aGlzLl9jb250YWluZXJJbmplY3Rvci5nZXQoQ29udGFpbmVySWRTZXJ2aWNlLCBudWxsKTtcblxuICAgIGlmICh0aGlzLl9pZCkge1xuICAgICAgdGhpcy5jb250cm9sSWRTZXJ2aWNlLmlkID0gdGhpcy5faWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2lkID0gdGhpcy5jb250cm9sSWRTZXJ2aWNlLmlkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm5nQ29udHJvbFNlcnZpY2UgJiYgdGhpcy5fbmdDb250cm9sKSB7XG4gICAgICBpZiAoIXRoaXMubmdDb250cm9sU2VydmljZS5jb250cm9sKSB7XG4gICAgICAgIHRoaXMubmdDb250cm9sID0gdGhpcy5fbmdDb250cm9sO1xuICAgICAgICB0aGlzLm5nQ29udHJvbFNlcnZpY2Uuc2V0Q29udHJvbCh0aGlzLm5nQ29udHJvbCk7XG4gICAgICAgIHRoaXMuZGlmZmVyID0gdGhpcy5kaWZmZXJzLmZpbmQodGhpcy5fbmdDb250cm9sKS5jcmVhdGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubmdDb250cm9sID0gdGhpcy5uZ0NvbnRyb2xTZXJ2aWNlLmNvbnRyb2w7XG4gICAgICAgIHRoaXMubmdDb250cm9sU2VydmljZS5hZGRBZGRpdGlvbmFsQ29udHJvbCh0aGlzLl9uZ0NvbnRyb2wpO1xuICAgICAgICB0aGlzLmFkZGl0aW9uYWxEaWZmZXIuc2V0KHRoaXMuX25nQ29udHJvbCwgdGhpcy5kaWZmZXJzLmZpbmQodGhpcy5fbmdDb250cm9sKS5jcmVhdGUoKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIHRoaXMudHJpZ2dlckRvQ2hlY2sodGhpcy5kaWZmZXIsIHRoaXMubmdDb250cm9sKTtcbiAgICBpZiAodGhpcy5oYXNBZGRpdGlvbmFsQ29udHJvbHMpIHtcbiAgICAgIGZvciAoY29uc3QgW25nQ29udHJvbCwgZGlmZmVyXSBvZiB0aGlzLmFkZGl0aW9uYWxEaWZmZXIpIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyRG9DaGVjayhkaWZmZXIsIG5nQ29udHJvbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2goc3ViID0+IHN1Yj8udW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdibHVyJylcbiAgdHJpZ2dlclZhbGlkYXRpb24oKSB7XG4gICAgaWYgKHRoaXMuaWZDb250cm9sU3RhdGVTZXJ2aWNlKSB7XG4gICAgICB0aGlzLmlmQ29udHJvbFN0YXRlU2VydmljZS50cmlnZ2VyU3RhdHVzQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQFRPRE8gVGhpcyBtZXRob2QgaGFzIGEgdHJ5L2NhdGNoIGR1ZSB0byBhbiB1bmtub3duIGlzc3VlIHRoYXQgY2FtZSB3aGVuIGJ1aWxkaW5nIHRoZSBjbHJUb2dnbGUgZmVhdHVyZVxuICAvLyBXZSBuZWVkIHRvIGZpZ3VyZSBvdXQgd2h5IHRoaXMgZmFpbHMgZm9yIHRoZSBDbHJUb2dnbGUgc2NlbmFyaW8gYnV0IHdvcmtzIGZvciBEYXRlIHBpY2tlci4uLlxuICAvLyBUbyBzZWUgdGhlIGVycm9yLCByZW1vdmUgdGhlIHRyeS9jYXRjaCBoZXJlIGFuZCBydW4gdGhlIENsclRvZ2dsZSBzdWl0ZSB0byBzZWUgaXNzdWVzIGdldHRpbmcgdGhlIGNvbnRhaW5lclxuICAvLyBpbmplY3RvciBpbiB0aW1lLCBhbmQgdGhpcyBPTkxZIEhBUFBFTlMgaW4gdGVzdHMgYW5kIG5vdCBpbiBkZXYvcHJvZCBtb2RlLlxuICBwcm90ZWN0ZWQgZ2V0UHJvdmlkZXJGcm9tQ29udGFpbmVyPFQ+KHRva2VuOiBUeXBlPFQ+IHwgSW5qZWN0aW9uVG9rZW48VD4sIG5vdEZvdW5kVmFsdWU/OiBUKTogVCB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLl9jb250YWluZXJJbmplY3Rvci5nZXQodG9rZW4sIG5vdEZvdW5kVmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBub3RGb3VuZFZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJpZ2dlckRvQ2hlY2soZGlmZmVyLCBuZ0NvbnRyb2wpIHtcbiAgICBpZiAoZGlmZmVyKSB7XG4gICAgICBjb25zdCBjaGFuZ2VzID0gZGlmZmVyLmRpZmYobmdDb250cm9sKTtcbiAgICAgIGlmIChjaGFuZ2VzKSB7XG4gICAgICAgIGNoYW5nZXMuZm9yRWFjaENoYW5nZWRJdGVtKGNoYW5nZSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgKGNoYW5nZS5rZXkgPT09IENIQU5HRV9LRVlTLkZPUk0gfHwgY2hhbmdlLmtleSA9PT0gQ0hBTkdFX0tFWVMuTU9ERUwpICYmXG4gICAgICAgICAgICBjaGFuZ2UuY3VycmVudFZhbHVlICE9PSBjaGFuZ2UucHJldmlvdXNWYWx1ZVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyVmFsaWRhdGlvbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtYXJrQXNUb3VjaGVkKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgdGhpcy5uZ0NvbnRyb2wuY29udHJvbC5tYXJrQXNUb3VjaGVkKCk7XG4gICAgICB0aGlzLm5nQ29udHJvbC5jb250cm9sLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubmdDb250cm9sU2VydmljZSAmJiB0aGlzLm5nQ29udHJvbFNlcnZpY2UuaGFzQWRkaXRpb25hbENvbnRyb2xzKSB7XG4gICAgICB0aGlzLm5nQ29udHJvbFNlcnZpY2UuYWRkaXRpb25hbENvbnRyb2xzPy5mb3JFYWNoKChuZ0NvbnRyb2w6IE5nQ29udHJvbCkgPT4ge1xuICAgICAgICBuZ0NvbnRyb2wuY29udHJvbC5tYXJrQXNUb3VjaGVkKCk7XG4gICAgICAgIG5nQ29udHJvbC5jb250cm9sLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0QXJpYURlc2NyaWJlZEJ5KGhlbHBlcnM6IEhlbHBlcnMpIHtcbiAgICBpZiAoaGVscGVycy5zaG93KSB7XG4gICAgICBjb25zdCBhcmlhRGVzY3JpYmVkQnkgPSB0aGlzLmdldEFyaWFEZXNjcmliZWRCeUlkKGhlbHBlcnMpO1xuICAgICAgaWYgKGFyaWFEZXNjcmliZWRCeSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdhcmlhLWRlc2NyaWJlZGJ5JywgYXJpYURlc2NyaWJlZEJ5KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQXR0cmlidXRlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QXJpYURlc2NyaWJlZEJ5SWQoaGVscGVyczogSGVscGVycyk6IHN0cmluZyB8IG51bGwge1xuICAgIGNvbnN0IGVsZW1lbnRJZCA9IHRoaXMuY29udGFpbmVySWRTZXJ2aWNlPy5pZCB8fCB0aGlzLmNvbnRyb2xJZFNlcnZpY2U/LmlkO1xuICAgIC8qKlxuICAgICAqIElmIENvbnRhaW5lcklkU2VydmljZSBvciBDb250cm9sSWRTZXJ2aWNlIGFyZSBtaXNzaW5nIGRvbid0IHRyeSB0byBndWVzc1xuICAgICAqIERvbid0IHNldCBhbnl0aGluZy5cbiAgICAgKi9cbiAgICBpZiAoIWVsZW1lbnRJZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXMgdGhlIGhlbHBlciB0ZXh0IGlzIG5vdyBhbHdheXMgdmlzaWJsZS4gSWYgd2UgaGF2ZSBlcnJvci9zdWNjZXNzIHRoZW4gd2Ugc2hvdWxkIHVzZSBib3RoIGlkcy5cbiAgICAgKi9cbiAgICBjb25zdCBkZXNjcmliZWRCeUlkcyA9IFtgJHtlbGVtZW50SWR9LSR7Q09OVFJPTF9TVUZGSVguSEVMUEVSfWBdO1xuICAgIGlmIChoZWxwZXJzLnNob3dJbnZhbGlkKSB7XG4gICAgICBkZXNjcmliZWRCeUlkcy5wdXNoKGAke2VsZW1lbnRJZH0tJHtDT05UUk9MX1NVRkZJWC5FUlJPUn1gKTtcbiAgICB9IGVsc2UgaWYgKGhlbHBlcnMuc2hvd1ZhbGlkKSB7XG4gICAgICBkZXNjcmliZWRCeUlkcy5wdXNoKGAke2VsZW1lbnRJZH0tJHtDT05UUk9MX1NVRkZJWC5TVUNDRVNTfWApO1xuICAgIH1cbiAgICByZXR1cm4gZGVzY3JpYmVkQnlJZHMuam9pbignICcpO1xuICB9XG59XG4iXX0=