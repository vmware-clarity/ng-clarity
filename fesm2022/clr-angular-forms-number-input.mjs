import * as i0 from '@angular/core';
import { ContentChild, forwardRef, Optional, Component, HostListener, Self, Directive, NgModule } from '@angular/core';
import * as i1 from '@clr/angular/forms/common';
import { ClrAbstractContainer, FormsFocusService, NgControlService, ControlIdService, ControlClassService, WrappedFormControl, ClrCommonFormsModule } from '@clr/angular/forms/common';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i3 from '@clr/angular/icon';
import { ClarityIcons, exclamationCircleIcon, checkCircleIcon, minusIcon, plusIcon, ClrIcon } from '@clr/angular/icon';
import * as i2$1 from '@angular/forms';
import { FormsModule } from '@angular/forms';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrNumberInputContainer extends ClrAbstractContainer {
    constructor(controlClassService, layoutService, ngControlService, focusService) {
        super(layoutService, controlClassService, ngControlService);
        this.focus = false;
        this.subscriptions.push(focusService.focusChange.subscribe(state => (this.focus = state)));
    }
    focusOut() {
        this.input.dispatchBlur();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrNumberInputContainer, deps: [{ token: i1.ControlClassService }, { token: i1.LayoutService, optional: true }, { token: i1.NgControlService }, { token: i1.FormsFocusService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrNumberInputContainer, isStandalone: false, selector: "clr-number-input-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-form-control-readonly": "input.readonly", "class.clr-row": "addGrid()" } }, providers: [FormsFocusService, NgControlService, ControlIdService, ControlClassService], queries: [{ propertyName: "input", first: true, predicate: i0.forwardRef(() => ClrNumberInput), descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-number-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus">
          <ng-content select="[clrNumberInput]"></ng-content>
          <div class="clr-input-group-actions" (focusout)="focusOut()">
            <button
              type="button"
              class="clr-input-group-icon-action"
              (click)="input.stepDown()"
              [disabled]="control?.disabled"
            >
              <cds-icon shape="minus" size="sm"></cds-icon>
            </button>
            <div class="clr-number-input-separator"></div>
            <button
              type="button"
              class="clr-input-group-icon-action"
              (click)="input.stepUp()"
              [disabled]="control?.disabled"
            >
              <cds-icon shape="plus" size="sm"></cds-icon>
            </button>
          </div>
        </div>
        @if (showInvalid) {
          <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger" aria-hidden="true"></cds-icon>
        }
        @if (showValid) {
          <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
        }
      </div>
      @if (showHelper) {
        <ng-content select="clr-control-helper"></ng-content>
      }
      @if (showInvalid) {
        <ng-content select="clr-control-error"></ng-content>
      }
      @if (showValid) {
        <ng-content select="clr-control-success"></ng-content>
      }
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i1.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrNumberInputContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-number-input-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-number-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus">
          <ng-content select="[clrNumberInput]"></ng-content>
          <div class="clr-input-group-actions" (focusout)="focusOut()">
            <button
              type="button"
              class="clr-input-group-icon-action"
              (click)="input.stepDown()"
              [disabled]="control?.disabled"
            >
              <cds-icon shape="minus" size="sm"></cds-icon>
            </button>
            <div class="clr-number-input-separator"></div>
            <button
              type="button"
              class="clr-input-group-icon-action"
              (click)="input.stepUp()"
              [disabled]="control?.disabled"
            >
              <cds-icon shape="plus" size="sm"></cds-icon>
            </button>
          </div>
        </div>
        @if (showInvalid) {
          <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger" aria-hidden="true"></cds-icon>
        }
        @if (showValid) {
          <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
        }
      </div>
      @if (showHelper) {
        <ng-content select="clr-control-helper"></ng-content>
      }
      @if (showInvalid) {
        <ng-content select="clr-control-error"></ng-content>
      }
      @if (showValid) {
        <ng-content select="clr-control-success"></ng-content>
      }
    </div>
  `,
                    host: {
                        '[class.clr-form-control]': 'true',
                        '[class.clr-form-control-disabled]': 'control?.disabled',
                        '[class.clr-form-control-readonly]': 'input.readonly',
                        '[class.clr-row]': 'addGrid()',
                    },
                    providers: [FormsFocusService, NgControlService, ControlIdService, ControlClassService],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.ControlClassService }, { type: i1.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1.NgControlService }, { type: i1.FormsFocusService }], propDecorators: { input: [{
                type: ContentChild,
                args: [forwardRef(() => ClrNumberInput)]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrNumberInput extends WrappedFormControl {
    constructor(focusService, vcr, injector, control, renderer, el) {
        super(vcr, ClrNumberInputContainer, injector, control, renderer, el);
        this.focusService = focusService;
        this.control = control;
        this.el = el;
        this.index = 1;
        if (!focusService) {
            throw new Error('clrNumberInput requires being wrapped in <clr-number-input-container>');
        }
    }
    get readonly() {
        return this.el.nativeElement.getAttribute('readonly') !== null;
    }
    triggerFocus() {
        if (!this.readonly && this.focusService) {
            this.focusService.focused = true;
        }
    }
    triggerValidation() {
        if (!this.readonly) {
            super.triggerValidation();
            if (this.focusService) {
                this.focusService.focused = false;
            }
        }
    }
    stepUp() {
        this.el.nativeElement.stepUp();
        this.dispatchStepChangeEvents();
        this.control.control.markAllAsTouched();
    }
    stepDown() {
        this.el.nativeElement.stepDown();
        this.dispatchStepChangeEvents();
        this.control.control.markAllAsTouched();
    }
    dispatchBlur() {
        this.el.nativeElement.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
    }
    dispatchStepChangeEvents() {
        this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        this.el.nativeElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrNumberInput, deps: [{ token: i1.FormsFocusService, optional: true }, { token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i2$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrNumberInput, isStandalone: false, selector: "input[type=\"number\"][clrNumberInput]", host: { listeners: { "focus": "triggerFocus()" }, properties: { "class.clr-input": "true", "class.clr-number-input": "true" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrNumberInput, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="number"][clrNumberInput]',
                    host: { '[class.clr-input]': 'true', '[class.clr-number-input]': 'true' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.FormsFocusService, decorators: [{
                    type: Optional
                }] }, { type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i2$1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }], propDecorators: { triggerFocus: [{
                type: HostListener,
                args: ['focus']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrNumberInputModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon, minusIcon, plusIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrNumberInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrNumberInputModule, declarations: [ClrNumberInput, ClrNumberInputContainer], imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule], exports: [ClrCommonFormsModule, ClrNumberInput, ClrNumberInputContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrNumberInputModule, imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule, ClrCommonFormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrNumberInputModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule],
                    declarations: [ClrNumberInput, ClrNumberInputContainer],
                    exports: [ClrCommonFormsModule, ClrNumberInput, ClrNumberInputContainer],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ClrNumberInput, ClrNumberInputContainer, ClrNumberInputModule };
//# sourceMappingURL=clr-angular-forms-number-input.mjs.map
