import * as i0 from '@angular/core';
import { ContentChild, Component, Self, Optional, Directive, ElementRef, Input, ContentChildren, NgModule } from '@angular/core';
import * as i1 from '@clr/angular/forms/common';
import { ClrControlLabel, ControlIdService, WrappedFormControl, ClrAbstractContainer, NgControlService, ControlClassService, ContainerIdService, ClrCommonFormsModule } from '@clr/angular/forms/common';
import * as i1$1 from '@angular/forms';
import { uniqueIdFactory, ClrHostWrappingModule } from '@clr/angular/utils';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i3 from '@clr/angular/icon';
import { ClarityIcons, exclamationCircleIcon, checkCircleIcon, ClrIcon } from '@clr/angular/icon';

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrRadioWrapper {
    ngOnInit() {
        if (this.label) {
            this.label.disableGrid();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRadioWrapper, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrRadioWrapper, isStandalone: false, selector: "clr-radio-wrapper", host: { properties: { "class.clr-radio-wrapper": "true" } }, providers: [ControlIdService], queries: [{ propertyName: "label", first: true, predicate: ClrControlLabel, descendants: true, static: true }], ngImport: i0, template: `
    <ng-content select="[clrRadio]"></ng-content>
    <ng-content select="label"></ng-content>
    @if (!label) {
      <label></label>
    }
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRadioWrapper, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-radio-wrapper',
                    template: `
    <ng-content select="[clrRadio]"></ng-content>
    <ng-content select="label"></ng-content>
    @if (!label) {
      <label></label>
    }
  `,
                    host: {
                        '[class.clr-radio-wrapper]': 'true',
                    },
                    providers: [ControlIdService],
                    standalone: false,
                }]
        }], propDecorators: { label: [{
                type: ContentChild,
                args: [ClrControlLabel, { static: true }]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrRadio extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrRadioWrapper, injector, control, renderer, el);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRadio, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrRadio, isStandalone: false, selector: "[clrRadio]", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRadio, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrRadio]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1$1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrRadioContainer extends ClrAbstractContainer {
    constructor(layoutService, controlClassService, ngControlService) {
        super(layoutService, controlClassService, ngControlService);
        this.layoutService = layoutService;
        this.controlClassService = controlClassService;
        this.ngControlService = ngControlService;
        this.inline = false;
        this._generatedId = uniqueIdFactory();
    }
    /*
     * Here we want to support the following cases
     * clrInline - true by presence
     * clrInline="true|false" - unless it is explicitly false, strings are considered true
     * [clrInline]="true|false" - expect a boolean
     */
    get clrInline() {
        return this.inline;
    }
    set clrInline(value) {
        if (typeof value === 'string') {
            this.inline = value === 'false' ? false : true;
        }
        else {
            this.inline = !!value;
        }
    }
    ngAfterContentInit() {
        this.setAriaRoles();
        this.setAriaLabelledBy();
    }
    setAriaRoles() {
        this.role = this.radios.length ? 'radiogroup' : null;
    }
    setAriaLabelledBy() {
        const _id = this.groupLabel?.nativeElement.getAttribute('id');
        if (!_id) {
            this.groupLabel?.nativeElement.setAttribute('id', this._generatedId);
            this.ariaLabelledBy = this.radios.length ? this._generatedId : null;
        }
        else {
            this.ariaLabelledBy = this.radios.length ? _id : null;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRadioContainer, deps: [{ token: i1.LayoutService, optional: true }, { token: i1.ControlClassService }, { token: i1.NgControlService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrRadioContainer, isStandalone: false, selector: "clr-radio-container", inputs: { clrInline: "clrInline" }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()", "attr.role": "role", "attr.aria-labelledby": "ariaLabelledBy" } }, providers: [NgControlService, ControlClassService, ContainerIdService], queries: [{ propertyName: "groupLabel", first: true, predicate: ClrControlLabel, descendants: true, read: ElementRef, static: true }, { propertyName: "radios", predicate: ClrRadio, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [class.clr-control-inline]="clrInline" [ngClass]="controlClass()">
      <ng-content select="clr-radio-wrapper"></ng-content>
      @if (showHelper) {
        <div class="clr-subtext-wrapper">
          <ng-content select="clr-control-helper"></ng-content>
        </div>
      }
      @if (showValid || showInvalid) {
        <div class="clr-subtext-wrapper">
          @if (showInvalid) {
            <cds-icon
              class="clr-validate-icon"
              shape="exclamation-circle"
              status="danger"
              aria-hidden="true"
            ></cds-icon>
          }
          @if (showValid) {
            <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
          }
          @if (showInvalid) {
            <ng-content select="clr-control-error"></ng-content>
          }
          @if (showValid) {
            <ng-content select="clr-control-success"></ng-content>
          }
        </div>
      }
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRadioContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-radio-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [class.clr-control-inline]="clrInline" [ngClass]="controlClass()">
      <ng-content select="clr-radio-wrapper"></ng-content>
      @if (showHelper) {
        <div class="clr-subtext-wrapper">
          <ng-content select="clr-control-helper"></ng-content>
        </div>
      }
      @if (showValid || showInvalid) {
        <div class="clr-subtext-wrapper">
          @if (showInvalid) {
            <cds-icon
              class="clr-validate-icon"
              shape="exclamation-circle"
              status="danger"
              aria-hidden="true"
            ></cds-icon>
          }
          @if (showValid) {
            <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
          }
          @if (showInvalid) {
            <ng-content select="clr-control-error"></ng-content>
          }
          @if (showValid) {
            <ng-content select="clr-control-success"></ng-content>
          }
        </div>
      }
    </div>
  `,
                    host: {
                        '[class.clr-form-control]': 'true',
                        '[class.clr-form-control-disabled]': 'control?.disabled',
                        '[class.clr-row]': 'addGrid()',
                        '[attr.role]': 'role',
                        '[attr.aria-labelledby]': 'ariaLabelledBy',
                    },
                    providers: [NgControlService, ControlClassService, ContainerIdService],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1.ControlClassService }, { type: i1.NgControlService }], propDecorators: { radios: [{
                type: ContentChildren,
                args: [ClrRadio, { descendants: true }]
            }], groupLabel: [{
                type: ContentChild,
                args: [ClrControlLabel, { read: ElementRef, static: true }]
            }], clrInline: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrRadioModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRadioModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrRadioModule, declarations: [ClrRadio, ClrRadioContainer, ClrRadioWrapper], imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIcon], exports: [ClrCommonFormsModule, ClrRadio, ClrRadioContainer, ClrRadioWrapper] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRadioModule, imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIcon, ClrCommonFormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRadioModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIcon],
                    declarations: [ClrRadio, ClrRadioContainer, ClrRadioWrapper],
                    exports: [ClrCommonFormsModule, ClrRadio, ClrRadioContainer, ClrRadioWrapper],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ClrRadio, ClrRadioContainer, ClrRadioModule, ClrRadioWrapper };
//# sourceMappingURL=clr-angular-forms-radio.mjs.map
