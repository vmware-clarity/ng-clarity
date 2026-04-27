import * as i0 from '@angular/core';
import { InjectionToken, Input, Optional, Inject, Component, HostListener, Self, Directive, NgModule } from '@angular/core';
import * as i1 from '@clr/angular/forms/common';
import { ClrAbstractContainer, NgControlService, ControlIdService, ControlClassService, FormsFocusService, WrappedFormControl, ClrCommonFormsModule } from '@clr/angular/forms/common';
import * as i5 from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import * as i2 from '@clr/angular/utils';
import * as i3 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i4 from '@clr/angular/icon';
import { ClarityIcons, eyeHideIcon, eyeIcon, successStandardIcon, errorStandardIcon, ClrIcon } from '@clr/angular/icon';
import * as i1$1 from '@angular/forms';
import { FormsModule } from '@angular/forms';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const TOGGLE_SERVICE = new InjectionToken(undefined);
function ToggleServiceFactory() {
    return new BehaviorSubject(false);
}
const TOGGLE_SERVICE_PROVIDER = { provide: TOGGLE_SERVICE, useFactory: ToggleServiceFactory };
class ClrPasswordContainer extends ClrAbstractContainer {
    constructor(layoutService, controlClassService, ngControlService, focusService, toggleService, commonStrings) {
        super(layoutService, controlClassService, ngControlService);
        this.focusService = focusService;
        this.toggleService = toggleService;
        this.commonStrings = commonStrings;
        this.show = false;
        this.focus = false;
        this._toggle = true;
        /* The unsubscribe is handle inside the ClrAbstractContainer */
        this.subscriptions.push(focusService.focusChange.subscribe(state => {
            this.focus = state;
        }));
    }
    get clrToggle() {
        return this._toggle;
    }
    set clrToggle(state) {
        this._toggle = state;
        if (!state) {
            this.show = false;
        }
    }
    toggle() {
        this.show = !this.show;
        this.toggleService.next(this.show);
    }
    showPasswordText(label) {
        return this.commonStrings.parse(this.commonStrings.keys.passwordShow, { LABEL: label });
    }
    hidePasswordText(label) {
        return this.commonStrings.parse(this.commonStrings.keys.passwordHide, { LABEL: label });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPasswordContainer, deps: [{ token: i1.LayoutService, optional: true }, { token: i1.ControlClassService }, { token: i1.NgControlService }, { token: i1.FormsFocusService }, { token: TOGGLE_SERVICE }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrPasswordContainer, isStandalone: false, selector: "clr-password-container", inputs: { clrToggle: "clrToggle" }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService, ControlIdService, ControlClassService, FormsFocusService, TOGGLE_SERVICE_PROVIDER], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus">
          <ng-content select="[clrPassword]"></ng-content>
          @if (clrToggle) {
            <button (click)="toggle()" [disabled]="control?.disabled" class="clr-input-group-icon-action" type="button">
              <cds-icon class="clr-password-eye-icon" [shape]="show ? 'eye-hide' : 'eye'"></cds-icon>
              <span class="clr-sr-only">
                {{ show ? hidePasswordText(label?.labelText) : showPasswordText(label?.labelText) }}
              </span>
            </button>
          }
        </div>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i4.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i1.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPasswordContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-password-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus">
          <ng-content select="[clrPassword]"></ng-content>
          @if (clrToggle) {
            <button (click)="toggle()" [disabled]="control?.disabled" class="clr-input-group-icon-action" type="button">
              <cds-icon class="clr-password-eye-icon" [shape]="show ? 'eye-hide' : 'eye'"></cds-icon>
              <span class="clr-sr-only">
                {{ show ? hidePasswordText(label?.labelText) : showPasswordText(label?.labelText) }}
              </span>
            </button>
          }
        </div>
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
                        '[class.clr-row]': 'addGrid()',
                    },
                    providers: [NgControlService, ControlIdService, ControlClassService, FormsFocusService, TOGGLE_SERVICE_PROVIDER],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1.ControlClassService }, { type: i1.NgControlService }, { type: i1.FormsFocusService }, { type: i5.BehaviorSubject, decorators: [{
                    type: Inject,
                    args: [TOGGLE_SERVICE]
                }] }, { type: i2.ClrCommonStringsService }], propDecorators: { clrToggle: [{
                type: Input,
                args: ['clrToggle']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPassword extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el, focusService, toggleService) {
        super(vcr, ClrPasswordContainer, injector, control, renderer, el);
        this.focusService = focusService;
        this.index = 1;
        if (!focusService) {
            throw new Error('clrPassword requires being wrapped in <clr-password-container>');
        }
        this.subscriptions.push(toggleService.subscribe(toggle => {
            renderer.setProperty(el.nativeElement, 'type', toggle ? 'text' : 'password');
        }));
    }
    triggerFocus() {
        if (this.focusService) {
            this.focusService.focused = true;
        }
    }
    triggerValidation() {
        super.triggerValidation();
        if (this.focusService) {
            this.focusService.focused = false;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPassword, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i1.FormsFocusService, optional: true }, { token: TOGGLE_SERVICE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrPassword, isStandalone: false, selector: "[clrPassword]", host: { listeners: { "focus": "triggerFocus()" }, properties: { "class.clr-input": "true" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPassword, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPassword]',
                    host: { '[class.clr-input]': 'true' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1$1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i1.FormsFocusService, decorators: [{
                    type: Optional
                }] }, { type: i5.BehaviorSubject, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [TOGGLE_SERVICE]
                }] }], propDecorators: { triggerFocus: [{
                type: HostListener,
                args: ['focus']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPasswordModule {
    constructor() {
        ClarityIcons.addIcons(eyeHideIcon, eyeIcon, successStandardIcon, errorStandardIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPasswordModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrPasswordModule, declarations: [ClrPassword, ClrPasswordContainer], imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule], exports: [ClrCommonFormsModule, ClrPassword, ClrPasswordContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPasswordModule, imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule, ClrCommonFormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPasswordModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule],
                    declarations: [ClrPassword, ClrPasswordContainer],
                    exports: [ClrCommonFormsModule, ClrPassword, ClrPasswordContainer],
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

export { ClrPassword, ClrPasswordContainer, ClrPasswordModule, TOGGLE_SERVICE, TOGGLE_SERVICE_PROVIDER, ToggleServiceFactory };
//# sourceMappingURL=clr-angular-forms-password.mjs.map
