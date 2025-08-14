/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./stepper-panel";
import * as i2 from "./providers/stepper.service";
export var ClrStepButtonType;
(function (ClrStepButtonType) {
    ClrStepButtonType["Next"] = "next";
    ClrStepButtonType["Previous"] = "previous";
    ClrStepButtonType["Submit"] = "submit";
})(ClrStepButtonType || (ClrStepButtonType = {}));
export class ClrStepButton {
    constructor(clrStep, stepperService) {
        this.clrStep = clrStep;
        this.stepperService = stepperService;
        this.type = ClrStepButtonType.Next;
        this.submitButton = false;
        this.previousButton = false;
    }
    ngOnInit() {
        this.submitButton = this.type === ClrStepButtonType.Submit;
        this.previousButton = this.type === ClrStepButtonType.Previous;
    }
    navigateToNextPanel() {
        if (this.previousButton) {
            this.stepperService.navigateToPreviousPanel(this.clrStep.id);
            return;
        }
        this.stepperService.navigateToNextPanel(this.clrStep.id, this.clrStep.formGroup.valid);
    }
}
ClrStepButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStepButton, deps: [{ token: i1.ClrStepperPanel }, { token: i2.StepperService }], target: i0.ɵɵFactoryTarget.Directive });
ClrStepButton.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrStepButton, selector: "[clrStepButton]", inputs: { type: ["clrStepButton", "type"] }, host: { listeners: { "click": "navigateToNextPanel()" }, properties: { "class.clr-step-button": "true", "class.btn": "true", "type": "'button'", "class.btn-success": "this.submitButton", "class.btn-link": "this.previousButton" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStepButton, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrStepButton]',
                    host: {
                        '[class.clr-step-button]': 'true',
                        '[class.btn]': 'true',
                        '[type]': "'button'",
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.ClrStepperPanel }, { type: i2.StepperService }]; }, propDecorators: { type: [{
                type: Input,
                args: ['clrStepButton']
            }], submitButton: [{
                type: HostBinding,
                args: ['class.btn-success']
            }], previousButton: [{
                type: HostBinding,
                args: ['class.btn-link']
            }], navigateToNextPanel: [{
                type: HostListener,
                args: ['click']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcC1idXR0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9hY2NvcmRpb24vc3RlcHBlci9zdGVwLWJ1dHRvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7Ozs7QUFLcEYsTUFBTSxDQUFOLElBQVksaUJBSVg7QUFKRCxXQUFZLGlCQUFpQjtJQUMzQixrQ0FBYSxDQUFBO0lBQ2IsMENBQXFCLENBQUE7SUFDckIsc0NBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQUpXLGlCQUFpQixLQUFqQixpQkFBaUIsUUFJNUI7QUFVRCxNQUFNLE9BQU8sYUFBYTtJQUt4QixZQUFvQixPQUF3QixFQUFVLGNBQThCO1FBQWhFLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBSjVELFNBQUksR0FBK0IsaUJBQWlCLENBQUMsSUFBSSxDQUFDO1FBQ2hELGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLG1CQUFjLEdBQUcsS0FBSyxDQUFDO0lBRWlDLENBQUM7SUFFeEYsUUFBUTtRQUNOLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7UUFDM0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFLLGlCQUFpQixDQUFDLFFBQVEsQ0FBQztJQUNqRSxDQUFDO0lBR0QsbUJBQW1CO1FBQ2pCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0QsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6RixDQUFDOzswR0FwQlUsYUFBYTs4RkFBYixhQUFhOzJGQUFiLGFBQWE7a0JBUnpCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsSUFBSSxFQUFFO3dCQUNKLHlCQUF5QixFQUFFLE1BQU07d0JBQ2pDLGFBQWEsRUFBRSxNQUFNO3dCQUNyQixRQUFRLEVBQUUsVUFBVTtxQkFDckI7aUJBQ0Y7bUlBRXlCLElBQUk7c0JBQTNCLEtBQUs7dUJBQUMsZUFBZTtnQkFDWSxZQUFZO3NCQUE3QyxXQUFXO3VCQUFDLG1CQUFtQjtnQkFDRCxjQUFjO3NCQUE1QyxXQUFXO3VCQUFDLGdCQUFnQjtnQkFVN0IsbUJBQW1CO3NCQURsQixZQUFZO3VCQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgSG9zdEJpbmRpbmcsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBTdGVwcGVyU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3N0ZXBwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJTdGVwcGVyUGFuZWwgfSBmcm9tICcuL3N0ZXBwZXItcGFuZWwnO1xuXG5leHBvcnQgZW51bSBDbHJTdGVwQnV0dG9uVHlwZSB7XG4gIE5leHQgPSAnbmV4dCcsXG4gIFByZXZpb3VzID0gJ3ByZXZpb3VzJyxcbiAgU3VibWl0ID0gJ3N1Ym1pdCcsXG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbHJTdGVwQnV0dG9uXScsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmNsci1zdGVwLWJ1dHRvbl0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5idG5dJzogJ3RydWUnLFxuICAgICdbdHlwZV0nOiBcIididXR0b24nXCIsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsclN0ZXBCdXR0b24gaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoJ2NsclN0ZXBCdXR0b24nKSB0eXBlOiBDbHJTdGVwQnV0dG9uVHlwZSB8IHN0cmluZyA9IENsclN0ZXBCdXR0b25UeXBlLk5leHQ7XG4gIEBIb3N0QmluZGluZygnY2xhc3MuYnRuLXN1Y2Nlc3MnKSBzdWJtaXRCdXR0b24gPSBmYWxzZTtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5idG4tbGluaycpIHByZXZpb3VzQnV0dG9uID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjbHJTdGVwOiBDbHJTdGVwcGVyUGFuZWwsIHByaXZhdGUgc3RlcHBlclNlcnZpY2U6IFN0ZXBwZXJTZXJ2aWNlKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc3VibWl0QnV0dG9uID0gdGhpcy50eXBlID09PSBDbHJTdGVwQnV0dG9uVHlwZS5TdWJtaXQ7XG4gICAgdGhpcy5wcmV2aW91c0J1dHRvbiA9IHRoaXMudHlwZSA9PT0gQ2xyU3RlcEJ1dHRvblR5cGUuUHJldmlvdXM7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gIG5hdmlnYXRlVG9OZXh0UGFuZWwoKSB7XG4gICAgaWYgKHRoaXMucHJldmlvdXNCdXR0b24pIHtcbiAgICAgIHRoaXMuc3RlcHBlclNlcnZpY2UubmF2aWdhdGVUb1ByZXZpb3VzUGFuZWwodGhpcy5jbHJTdGVwLmlkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN0ZXBwZXJTZXJ2aWNlLm5hdmlnYXRlVG9OZXh0UGFuZWwodGhpcy5jbHJTdGVwLmlkLCB0aGlzLmNsclN0ZXAuZm9ybUdyb3VwLnZhbGlkKTtcbiAgfVxufVxuIl19