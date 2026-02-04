import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Input, HostBinding, Component, NgModule } from '@angular/core';
import { isBooleanAttributeSet } from '@clr/angular/utils';

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrSpinner {
    /**
     * Default class for all spinners. This class is always true
     */
    get spinnerClass() {
        return true;
    }
    get inlineClass() {
        return this._inline;
    }
    set clrInline(value) {
        this._inline = isBooleanAttributeSet(value);
    }
    get inverseClass() {
        return this._inverse;
    }
    set clrInverse(value) {
        this._inverse = isBooleanAttributeSet(value);
    }
    get smallClass() {
        return this._small;
    }
    set clrSmall(value) {
        this._small = isBooleanAttributeSet(value);
    }
    /**
     * When clrSmall & clrMedium are set both to true.
     * The CSS with high priority will be small - so medium size will be ignored.
     *
     * For this reason if clrSmall is set we won't add clrMedium class.
     *
     * NOTE: This is dictated by the CSS rules.
     * DON'T USE clrSmall & clrMedium to toggle classes. This could change without notice.
     *
     * Also there is no logical need to have both of them set to TRUE or FALSE.
     */
    get mediumClass() {
        if (this._small) {
            return false;
        }
        return this._medium;
    }
    set clrMedium(value) {
        this._medium = isBooleanAttributeSet(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrSpinner, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrSpinner, isStandalone: false, selector: "clr-spinner", inputs: { clrInline: "clrInline", clrInverse: "clrInverse", clrSmall: "clrSmall", clrMedium: "clrMedium" }, host: { properties: { "attr.aria-busy": "true", "class.spinner": "this.spinnerClass", "class.spinner-inline": "this.inlineClass", "class.spinner-inverse": "this.inverseClass", "class.spinner-sm": "this.smallClass", "class.spinner-md": "this.mediumClass" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrSpinner, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-spinner',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[attr.aria-busy]': 'true',
                    },
                    standalone: false,
                }]
        }], propDecorators: { spinnerClass: [{
                type: HostBinding,
                args: ['class.spinner']
            }], inlineClass: [{
                type: HostBinding,
                args: ['class.spinner-inline']
            }], clrInline: [{
                type: Input,
                args: ['clrInline']
            }], inverseClass: [{
                type: HostBinding,
                args: ['class.spinner-inverse']
            }], clrInverse: [{
                type: Input,
                args: ['clrInverse']
            }], smallClass: [{
                type: HostBinding,
                args: ['class.spinner-sm']
            }], clrSmall: [{
                type: Input,
                args: ['clrSmall']
            }], mediumClass: [{
                type: HostBinding,
                args: ['class.spinner-md']
            }], clrMedium: [{
                type: Input,
                args: ['clrMedium']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_SPINNER_DIRECTIVES = [ClrSpinner];
class ClrSpinnerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrSpinnerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrSpinnerModule, declarations: [ClrSpinner], imports: [CommonModule], exports: [ClrSpinner] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrSpinnerModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrSpinnerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [CLR_SPINNER_DIRECTIVES],
                    exports: [CLR_SPINNER_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_SPINNER_DIRECTIVES, ClrSpinner, ClrSpinnerModule };
//# sourceMappingURL=clr-angular-progress-spinner.mjs.map
