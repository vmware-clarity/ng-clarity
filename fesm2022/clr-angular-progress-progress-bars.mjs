import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { HostBinding, Input, Component, NgModule } from '@angular/core';
import { isBooleanAttributeSet } from '@clr/angular/utils';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrProgressBar {
    constructor() {
        this.max = 100;
        /*
         * No need to convert to `number` cause we could have
         * floating point and parseInt will round the numbers
         *
         * working with string won't have any side-effects,
         * we don't do any math so string will do the job.
         */
        this.value = 0;
        this.externalId = '';
    }
    get id() {
        return this._ID;
    }
    set id(value) {
        this._ID = value;
        this.externalId = null;
    }
    get progressClass() {
        return true;
    }
    set clrCompact(value) {
        this._compact = isBooleanAttributeSet(value);
    }
    get compactClass() {
        return this._compact;
    }
    set clrLabeled(value) {
        this._labeled = isBooleanAttributeSet(value);
    }
    get labeledClass() {
        return this._labeled;
    }
    set clrFade(value) {
        this._fade = isBooleanAttributeSet(value);
    }
    get fadeClass() {
        return this._fade;
    }
    set clrLoop(value) {
        this._loop = isBooleanAttributeSet(value);
    }
    get loopClass() {
        return this._loop;
    }
    get warningClass() {
        return this.color === 'warning';
    }
    get successClass() {
        return this.color === 'success';
    }
    get dangerClass() {
        return this.color === 'danger';
    }
    set clrFlash(value) {
        this._flash = isBooleanAttributeSet(value);
    }
    get flashClass() {
        return this._flash;
    }
    /** @deprecated since 2.0, remove in 4.0 */
    set clrFlashDanger(value) {
        this._flashDanger = isBooleanAttributeSet(value);
    }
    get flashDangerClass() {
        return this._flashDanger;
    }
    /**
     * Make sure that we always will have something that is readable
     * for the screen reader
     */
    get displayValue() {
        if (this.displayval) {
            return this.displayval;
        }
        return `${this.value || 0}%`;
    }
    /**
     * Display optional text only when labeled is eneabled
     */
    displayStringValue() {
        return this._labeled;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrProgressBar, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrProgressBar, isStandalone: false, selector: "clr-progress-bar", inputs: { max: ["clrMax", "max"], displayval: ["clrDisplayval", "displayval"], color: ["clrColor", "color"], value: ["clrValue", "value"], id: "id", clrCompact: "clrCompact", clrLabeled: "clrLabeled", clrFade: "clrFade", clrLoop: "clrLoop", clrFlash: "clrFlash", clrFlashDanger: "clrFlashDanger" }, host: { properties: { "attr.id": "this.externalId", "class.progress": "this.progressClass", "class.compact": "this.compactClass", "class.labeled": "this.labeledClass", "class.progress-fade": "this.fadeClass", "class.loop": "this.loopClass", "class.warning": "this.warningClass", "class.success": "this.successClass", "class.danger": "this.dangerClass", "class.flash": "this.flashClass", "class.flash-danger": "this.flashDangerClass" } }, ngImport: i0, template: `
    <progress [id]="id" [attr.max]="max" [attr.value]="value" [attr.data-displayval]="displayValue"></progress>
    @if (displayStringValue()) {
      <span>{{ displayValue }}</span>
    }
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrProgressBar, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-progress-bar',
                    template: `
    <progress [id]="id" [attr.max]="max" [attr.value]="value" [attr.data-displayval]="displayValue"></progress>
    @if (displayStringValue()) {
      <span>{{ displayValue }}</span>
    }
  `,
                    standalone: false,
                }]
        }], propDecorators: { max: [{
                type: Input,
                args: ['clrMax']
            }], displayval: [{
                type: Input,
                args: ['clrDisplayval']
            }], color: [{
                type: Input,
                args: ['clrColor']
            }], value: [{
                type: Input,
                args: ['clrValue']
            }], externalId: [{
                type: HostBinding,
                args: ['attr.id']
            }], id: [{
                type: Input
            }], progressClass: [{
                type: HostBinding,
                args: ['class.progress']
            }], clrCompact: [{
                type: Input,
                args: ['clrCompact']
            }], compactClass: [{
                type: HostBinding,
                args: ['class.compact']
            }], clrLabeled: [{
                type: Input,
                args: ['clrLabeled']
            }], labeledClass: [{
                type: HostBinding,
                args: ['class.labeled']
            }], clrFade: [{
                type: Input,
                args: ['clrFade']
            }], fadeClass: [{
                type: HostBinding,
                args: ['class.progress-fade']
            }], clrLoop: [{
                type: Input,
                args: ['clrLoop']
            }], loopClass: [{
                type: HostBinding,
                args: ['class.loop']
            }], warningClass: [{
                type: HostBinding,
                args: ['class.warning']
            }], successClass: [{
                type: HostBinding,
                args: ['class.success']
            }], dangerClass: [{
                type: HostBinding,
                args: ['class.danger']
            }], clrFlash: [{
                type: Input,
                args: ['clrFlash']
            }], flashClass: [{
                type: HostBinding,
                args: ['class.flash']
            }], clrFlashDanger: [{
                type: Input,
                args: ['clrFlashDanger']
            }], flashDangerClass: [{
                type: HostBinding,
                args: ['class.flash-danger']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_PROGRESS_BAR_DIRECTIVES = [ClrProgressBar];
class ClrProgressBarModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrProgressBarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrProgressBarModule, declarations: [ClrProgressBar], imports: [CommonModule], exports: [ClrProgressBar] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrProgressBarModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrProgressBarModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [CLR_PROGRESS_BAR_DIRECTIVES],
                    exports: [CLR_PROGRESS_BAR_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_PROGRESS_BAR_DIRECTIVES, ClrProgressBar, ClrProgressBarModule };
//# sourceMappingURL=clr-angular-progress-progress-bars.mjs.map
