/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/wizard-navigation.service";
import * as i2 from "./providers/button-hub.service";
export const DEFAULT_BUTTON_TYPES = {
    cancel: 'cancel',
    previous: 'previous',
    next: 'next',
    finish: 'finish',
    danger: 'danger',
};
export const CUSTOM_BUTTON_TYPES = {
    cancel: 'custom-cancel',
    previous: 'custom-previous',
    next: 'custom-next',
    finish: 'custom-finish',
    danger: 'custom-danger',
};
export class ClrWizardButton {
    constructor(navService, buttonService) {
        this.navService = navService;
        this.buttonService = buttonService;
        this.type = '';
        this.disabled = false;
        this.hidden = false;
        // EventEmitter which is emitted when a button is clicked.
        this.wasClicked = new EventEmitter(false);
    }
    get isCancel() {
        return this.checkDefaultAndCustomType(this.type, 'cancel');
    }
    get isNext() {
        return this.checkDefaultAndCustomType(this.type, 'next');
    }
    get isPrevious() {
        return this.checkDefaultAndCustomType(this.type, 'previous');
    }
    get isFinish() {
        return this.checkDefaultAndCustomType(this.type, 'finish');
    }
    get isDanger() {
        return this.checkDefaultAndCustomType(this.type, 'danger');
    }
    get isPrimaryAction() {
        return this.isNext || this.isDanger || this.isFinish;
    }
    get _disabledAttribute() {
        if (this.isDisabled) {
            return '';
        }
        return null;
    }
    get isDisabled() {
        // dealing with negatives here. cognitively easier to think of it like this...
        const disabled = true;
        const nav = this.navService;
        const page = this.navService.currentPage;
        // Ensure we don't change the response until buttons are ready to avoid chocolate
        if (!this.buttonService.buttonsReady) {
            return !disabled;
        }
        if (this.disabled || nav.wizardStopNavigation || !page) {
            return true;
        }
        if (this.isCancel) {
            return !disabled;
        }
        if (this.isPrevious && (nav.currentPageIsFirst || page.previousStepDisabled)) {
            return disabled;
        }
        if (this.isDanger && !page.readyToComplete) {
            return disabled;
        }
        if (this.isNext && (nav.currentPageIsLast || !page.readyToComplete)) {
            return disabled;
        }
        if (this.isFinish && (!nav.currentPageIsLast || !page.readyToComplete)) {
            return disabled;
        }
        return !disabled;
    }
    get isHidden() {
        // dealing with negatives here. cognitively easier to think of it like this...
        const hidden = true;
        const nav = this.navService;
        // Ensure we don't change the response until buttons are ready to avoid chocolate
        if (!this.buttonService.buttonsReady) {
            return !hidden;
        }
        if (this.hidden) {
            return true;
        }
        if (this.isCancel) {
            return !hidden;
        }
        if (this.isPrevious && nav.currentPageIsFirst) {
            return hidden;
        }
        if (this.isNext && nav.currentPageIsLast) {
            return hidden;
        }
        if (this.isFinish && !nav.currentPageIsLast) {
            return hidden;
        }
        return !hidden;
    }
    click() {
        if (this.isDisabled) {
            return;
        }
        this.wasClicked.emit(this.type);
        this.buttonService.buttonClicked(this.type);
    }
    checkDefaultAndCustomType(valueToCheck = '', typeToLookUp) {
        if (DEFAULT_BUTTON_TYPES[typeToLookUp] === valueToCheck) {
            return true;
        }
        if (CUSTOM_BUTTON_TYPES[typeToLookUp] === valueToCheck) {
            return true;
        }
        return false;
    }
}
ClrWizardButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardButton, deps: [{ token: i1.WizardNavigationService }, { token: i2.ButtonHubService }], target: i0.ɵɵFactoryTarget.Component });
ClrWizardButton.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrWizardButton, selector: "clr-wizard-button", inputs: { type: "type", disabled: ["clrWizardButtonDisabled", "disabled"], hidden: ["clrWizardButtonHidden", "hidden"] }, outputs: { wasClicked: "clrWizardButtonClicked" }, host: { properties: { "attr.aria-hidden": "isHidden" }, classAttribute: "clr-wizard-btn-wrapper" }, ngImport: i0, template: `
    <button
      type="button"
      class="btn clr-wizard-btn"
      [class.btn-link]="isCancel"
      [class.clr-wizard-btn--tertiary]="isCancel"
      [class.btn-outline]="isPrevious"
      [class.clr-wizard-btn--secondary]="isPrevious"
      [class.btn-primary]="isPrimaryAction"
      [class.clr-wizard-btn--primary]="isPrimaryAction"
      [class.btn-success]="isFinish"
      [class.btn-danger]="isDanger"
      [class.disabled]="isDisabled"
      [attr.disabled]="_disabledAttribute"
      (click)="click()"
    >
      <ng-content></ng-content>
    </button>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardButton, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-wizard-button',
                    template: `
    <button
      type="button"
      class="btn clr-wizard-btn"
      [class.btn-link]="isCancel"
      [class.clr-wizard-btn--tertiary]="isCancel"
      [class.btn-outline]="isPrevious"
      [class.clr-wizard-btn--secondary]="isPrevious"
      [class.btn-primary]="isPrimaryAction"
      [class.clr-wizard-btn--primary]="isPrimaryAction"
      [class.btn-success]="isFinish"
      [class.btn-danger]="isDanger"
      [class.disabled]="isDisabled"
      [attr.disabled]="_disabledAttribute"
      (click)="click()"
    >
      <ng-content></ng-content>
    </button>
  `,
                    host: { class: 'clr-wizard-btn-wrapper', '[attr.aria-hidden]': 'isHidden' },
                }]
        }], ctorParameters: function () { return [{ type: i1.WizardNavigationService }, { type: i2.ButtonHubService }]; }, propDecorators: { type: [{
                type: Input,
                args: ['type']
            }], disabled: [{
                type: Input,
                args: ['clrWizardButtonDisabled']
            }], hidden: [{
                type: Input,
                args: ['clrWizardButtonHidden']
            }], wasClicked: [{
                type: Output,
                args: ['clrWizardButtonClicked']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLWJ1dHRvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3dpemFyZC93aXphcmQtYnV0dG9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQUt2RSxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBUTtJQUN2QyxNQUFNLEVBQUUsUUFBUTtJQUNoQixRQUFRLEVBQUUsVUFBVTtJQUNwQixJQUFJLEVBQUUsTUFBTTtJQUNaLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLE1BQU0sRUFBRSxRQUFRO0NBQ2pCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBUTtJQUN0QyxNQUFNLEVBQUUsZUFBZTtJQUN2QixRQUFRLEVBQUUsaUJBQWlCO0lBQzNCLElBQUksRUFBRSxhQUFhO0lBQ25CLE1BQU0sRUFBRSxlQUFlO0lBQ3ZCLE1BQU0sRUFBRSxlQUFlO0NBQ3hCLENBQUM7QUF5QkYsTUFBTSxPQUFPLGVBQWU7SUFVMUIsWUFBbUIsVUFBbUMsRUFBUyxhQUErQjtRQUEzRSxlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUFTLGtCQUFhLEdBQWIsYUFBYSxDQUFrQjtRQVQvRSxTQUFJLEdBQUcsRUFBRSxDQUFDO1FBRVMsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUVuQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBRS9DLDBEQUEwRDtRQUN4QixlQUFVLEdBQUcsSUFBSSxZQUFZLENBQVMsS0FBSyxDQUFDLENBQUM7SUFFa0IsQ0FBQztJQUVsRyxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixP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QU07c0JBQXJDLEtBQUs7dUJBQUMsdUJBQXVCO2dCQUdJLFVBQVU7c0JBQTNDLE1BQU07dUJBQUMsd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBCdXR0b25IdWJTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvYnV0dG9uLWh1Yi5zZXJ2aWNlJztcbmltcG9ydCB7IFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvd2l6YXJkLW5hdmlnYXRpb24uc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0JVVFRPTl9UWVBFUzogYW55ID0ge1xuICBjYW5jZWw6ICdjYW5jZWwnLFxuICBwcmV2aW91czogJ3ByZXZpb3VzJyxcbiAgbmV4dDogJ25leHQnLFxuICBmaW5pc2g6ICdmaW5pc2gnLFxuICBkYW5nZXI6ICdkYW5nZXInLFxufTtcblxuZXhwb3J0IGNvbnN0IENVU1RPTV9CVVRUT05fVFlQRVM6IGFueSA9IHtcbiAgY2FuY2VsOiAnY3VzdG9tLWNhbmNlbCcsXG4gIHByZXZpb3VzOiAnY3VzdG9tLXByZXZpb3VzJyxcbiAgbmV4dDogJ2N1c3RvbS1uZXh0JyxcbiAgZmluaXNoOiAnY3VzdG9tLWZpbmlzaCcsXG4gIGRhbmdlcjogJ2N1c3RvbS1kYW5nZXInLFxufTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLXdpemFyZC1idXR0b24nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxidXR0b25cbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgY2xhc3M9XCJidG4gY2xyLXdpemFyZC1idG5cIlxuICAgICAgW2NsYXNzLmJ0bi1saW5rXT1cImlzQ2FuY2VsXCJcbiAgICAgIFtjbGFzcy5jbHItd2l6YXJkLWJ0bi0tdGVydGlhcnldPVwiaXNDYW5jZWxcIlxuICAgICAgW2NsYXNzLmJ0bi1vdXRsaW5lXT1cImlzUHJldmlvdXNcIlxuICAgICAgW2NsYXNzLmNsci13aXphcmQtYnRuLS1zZWNvbmRhcnldPVwiaXNQcmV2aW91c1wiXG4gICAgICBbY2xhc3MuYnRuLXByaW1hcnldPVwiaXNQcmltYXJ5QWN0aW9uXCJcbiAgICAgIFtjbGFzcy5jbHItd2l6YXJkLWJ0bi0tcHJpbWFyeV09XCJpc1ByaW1hcnlBY3Rpb25cIlxuICAgICAgW2NsYXNzLmJ0bi1zdWNjZXNzXT1cImlzRmluaXNoXCJcbiAgICAgIFtjbGFzcy5idG4tZGFuZ2VyXT1cImlzRGFuZ2VyXCJcbiAgICAgIFtjbGFzcy5kaXNhYmxlZF09XCJpc0Rpc2FibGVkXCJcbiAgICAgIFthdHRyLmRpc2FibGVkXT1cIl9kaXNhYmxlZEF0dHJpYnV0ZVwiXG4gICAgICAoY2xpY2spPVwiY2xpY2soKVwiXG4gICAgPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvYnV0dG9uPlxuICBgLFxuICBob3N0OiB7IGNsYXNzOiAnY2xyLXdpemFyZC1idG4td3JhcHBlcicsICdbYXR0ci5hcmlhLWhpZGRlbl0nOiAnaXNIaWRkZW4nIH0sXG59KVxuZXhwb3J0IGNsYXNzIENscldpemFyZEJ1dHRvbiB7XG4gIEBJbnB1dCgndHlwZScpIHR5cGUgPSAnJztcblxuICBASW5wdXQoJ2NscldpemFyZEJ1dHRvbkRpc2FibGVkJykgZGlzYWJsZWQgPSBmYWxzZTtcblxuICBASW5wdXQoJ2NscldpemFyZEJ1dHRvbkhpZGRlbicpIGhpZGRlbiA9IGZhbHNlO1xuXG4gIC8vIEV2ZW50RW1pdHRlciB3aGljaCBpcyBlbWl0dGVkIHdoZW4gYSBidXR0b24gaXMgY2xpY2tlZC5cbiAgQE91dHB1dCgnY2xyV2l6YXJkQnV0dG9uQ2xpY2tlZCcpIHdhc0NsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oZmFsc2UpO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYXZTZXJ2aWNlOiBXaXphcmROYXZpZ2F0aW9uU2VydmljZSwgcHVibGljIGJ1dHRvblNlcnZpY2U6IEJ1dHRvbkh1YlNlcnZpY2UpIHt9XG5cbiAgZ2V0IGlzQ2FuY2VsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNoZWNrRGVmYXVsdEFuZEN1c3RvbVR5cGUodGhpcy50eXBlLCAnY2FuY2VsJyk7XG4gIH1cblxuICBnZXQgaXNOZXh0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNoZWNrRGVmYXVsdEFuZEN1c3RvbVR5cGUodGhpcy50eXBlLCAnbmV4dCcpO1xuICB9XG5cbiAgZ2V0IGlzUHJldmlvdXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2hlY2tEZWZhdWx0QW5kQ3VzdG9tVHlwZSh0aGlzLnR5cGUsICdwcmV2aW91cycpO1xuICB9XG5cbiAgZ2V0IGlzRmluaXNoKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNoZWNrRGVmYXVsdEFuZEN1c3RvbVR5cGUodGhpcy50eXBlLCAnZmluaXNoJyk7XG4gIH1cblxuICBnZXQgaXNEYW5nZXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2hlY2tEZWZhdWx0QW5kQ3VzdG9tVHlwZSh0aGlzLnR5cGUsICdkYW5nZXInKTtcbiAgfVxuXG4gIGdldCBpc1ByaW1hcnlBY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNOZXh0IHx8IHRoaXMuaXNEYW5nZXIgfHwgdGhpcy5pc0ZpbmlzaDtcbiAgfVxuXG4gIGdldCBfZGlzYWJsZWRBdHRyaWJ1dGUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuaXNEaXNhYmxlZCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldCBpc0Rpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIC8vIGRlYWxpbmcgd2l0aCBuZWdhdGl2ZXMgaGVyZS4gY29nbml0aXZlbHkgZWFzaWVyIHRvIHRoaW5rIG9mIGl0IGxpa2UgdGhpcy4uLlxuICAgIGNvbnN0IGRpc2FibGVkID0gdHJ1ZTtcbiAgICBjb25zdCBuYXYgPSB0aGlzLm5hdlNlcnZpY2U7XG4gICAgY29uc3QgcGFnZSA9IHRoaXMubmF2U2VydmljZS5jdXJyZW50UGFnZTtcblxuICAgIC8vIEVuc3VyZSB3ZSBkb24ndCBjaGFuZ2UgdGhlIHJlc3BvbnNlIHVudGlsIGJ1dHRvbnMgYXJlIHJlYWR5IHRvIGF2b2lkIGNob2NvbGF0ZVxuICAgIGlmICghdGhpcy5idXR0b25TZXJ2aWNlLmJ1dHRvbnNSZWFkeSkge1xuICAgICAgcmV0dXJuICFkaXNhYmxlZDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCBuYXYud2l6YXJkU3RvcE5hdmlnYXRpb24gfHwgIXBhZ2UpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzQ2FuY2VsKSB7XG4gICAgICByZXR1cm4gIWRpc2FibGVkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzUHJldmlvdXMgJiYgKG5hdi5jdXJyZW50UGFnZUlzRmlyc3QgfHwgcGFnZS5wcmV2aW91c1N0ZXBEaXNhYmxlZCkpIHtcbiAgICAgIHJldHVybiBkaXNhYmxlZDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0RhbmdlciAmJiAhcGFnZS5yZWFkeVRvQ29tcGxldGUpIHtcbiAgICAgIHJldHVybiBkaXNhYmxlZDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc05leHQgJiYgKG5hdi5jdXJyZW50UGFnZUlzTGFzdCB8fCAhcGFnZS5yZWFkeVRvQ29tcGxldGUpKSB7XG4gICAgICByZXR1cm4gZGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNGaW5pc2ggJiYgKCFuYXYuY3VycmVudFBhZ2VJc0xhc3QgfHwgIXBhZ2UucmVhZHlUb0NvbXBsZXRlKSkge1xuICAgICAgcmV0dXJuIGRpc2FibGVkO1xuICAgIH1cblxuICAgIHJldHVybiAhZGlzYWJsZWQ7XG4gIH1cblxuICBnZXQgaXNIaWRkZW4oKTogYm9vbGVhbiB7XG4gICAgLy8gZGVhbGluZyB3aXRoIG5lZ2F0aXZlcyBoZXJlLiBjb2duaXRpdmVseSBlYXNpZXIgdG8gdGhpbmsgb2YgaXQgbGlrZSB0aGlzLi4uXG4gICAgY29uc3QgaGlkZGVuID0gdHJ1ZTtcbiAgICBjb25zdCBuYXYgPSB0aGlzLm5hdlNlcnZpY2U7XG5cbiAgICAvLyBFbnN1cmUgd2UgZG9uJ3QgY2hhbmdlIHRoZSByZXNwb25zZSB1bnRpbCBidXR0b25zIGFyZSByZWFkeSB0byBhdm9pZCBjaG9jb2xhdGVcbiAgICBpZiAoIXRoaXMuYnV0dG9uU2VydmljZS5idXR0b25zUmVhZHkpIHtcbiAgICAgIHJldHVybiAhaGlkZGVuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmhpZGRlbikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNDYW5jZWwpIHtcbiAgICAgIHJldHVybiAhaGlkZGVuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzUHJldmlvdXMgJiYgbmF2LmN1cnJlbnRQYWdlSXNGaXJzdCkge1xuICAgICAgcmV0dXJuIGhpZGRlbjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc05leHQgJiYgbmF2LmN1cnJlbnRQYWdlSXNMYXN0KSB7XG4gICAgICByZXR1cm4gaGlkZGVuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRmluaXNoICYmICFuYXYuY3VycmVudFBhZ2VJc0xhc3QpIHtcbiAgICAgIHJldHVybiBoaWRkZW47XG4gICAgfVxuXG4gICAgcmV0dXJuICFoaWRkZW47XG4gIH1cblxuICBjbGljaygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0Rpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy53YXNDbGlja2VkLmVtaXQodGhpcy50eXBlKTtcbiAgICB0aGlzLmJ1dHRvblNlcnZpY2UuYnV0dG9uQ2xpY2tlZCh0aGlzLnR5cGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0RlZmF1bHRBbmRDdXN0b21UeXBlKHZhbHVlVG9DaGVjayA9ICcnLCB0eXBlVG9Mb29rVXA6IHN0cmluZykge1xuICAgIGlmIChERUZBVUxUX0JVVFRPTl9UWVBFU1t0eXBlVG9Mb29rVXBdID09PSB2YWx1ZVRvQ2hlY2spIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoQ1VTVE9NX0JVVFRPTl9UWVBFU1t0eXBlVG9Mb29rVXBdID09PSB2YWx1ZVRvQ2hlY2spIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==