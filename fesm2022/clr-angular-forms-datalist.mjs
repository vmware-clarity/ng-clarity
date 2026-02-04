import * as i0 from '@angular/core';
import { Injectable, Input, Optional, Directive, Component, HostListener, Self, NgModule } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i1 from '@clr/angular/forms/common';
import { ClrAbstractContainer, ControlClassService, ControlIdService, FormsFocusService, NgControlService, WrappedFormControl } from '@clr/angular/forms/common';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i3 from '@clr/angular/icon';
import { ClarityIcons, exclamationCircleIcon, checkCircleIcon, ClrIcon } from '@clr/angular/icon';
import * as i2$1 from '@angular/forms';
import { ClrInputModule } from '@clr/angular/forms/input';

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let counter = 0;
class DatalistIdService {
    constructor() {
        this._id = 'clr-datalist-' + ++counter;
        this._idChange = new BehaviorSubject(this._id);
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
        this._idChange.next(value);
    }
    get idChange() {
        return this._idChange.asObservable();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatalistIdService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatalistIdService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatalistIdService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatalist {
    constructor(datalistIdService) {
        this.datalistIdService = datalistIdService;
        this.subscriptions = [];
    }
    set id(idValue) {
        if (!!idValue && this.datalistIdService) {
            this.datalistId = idValue;
            this.datalistIdService.id = idValue;
        }
        else if (idValue) {
            this.datalistId = idValue;
        }
    }
    ngAfterContentInit() {
        if (!this.datalistIdService) {
            return;
        }
        this.subscriptions.push(this.datalistIdService.idChange.subscribe(id => (this.datalistId = id)));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalist, deps: [{ token: DatalistIdService, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatalist, isStandalone: false, selector: "datalist", inputs: { id: "id" }, host: { properties: { "id": "datalistId" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalist, decorators: [{
            type: Directive,
            args: [{
                    selector: 'datalist',
                    host: {
                        '[id]': 'datalistId',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DatalistIdService, decorators: [{
                    type: Optional
                }] }], propDecorators: { id: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatalistContainer extends ClrAbstractContainer {
    constructor(controlClassService, layoutService, ngControlService, focusService) {
        super(layoutService, controlClassService, ngControlService);
        this.focus = false;
        this.subscriptions.push(focusService.focusChange.subscribe(state => (this.focus = state)));
    }
    showPicker(datalist) {
        const datalistInput = datalist.querySelector('input[clrDatalistInput]');
        if (datalistInput) {
            datalistInput.focus();
            datalistInput.showPicker();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalistContainer, deps: [{ token: i1.ControlClassService }, { token: i1.LayoutService, optional: true }, { token: i1.NgControlService }, { token: i1.FormsFocusService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrDatalistContainer, isStandalone: false, selector: "clr-datalist-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [ControlClassService, ControlIdService, FormsFocusService, NgControlService, DatalistIdService], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus" #datalist>
          <ng-content select="[clrDatalistInput]"></ng-content>
          <ng-content select="datalist"></ng-content>
          <cds-icon shape="angle" class="clr-datalist-caret" direction="down" (click)="showPicker(datalist)"></cds-icon>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalistContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-datalist-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group" [class.clr-focus]="focus" #datalist>
          <ng-content select="[clrDatalistInput]"></ng-content>
          <ng-content select="datalist"></ng-content>
          <cds-icon shape="angle" class="clr-datalist-caret" direction="down" (click)="showPicker(datalist)"></cds-icon>
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
                        '[class.clr-row]': 'addGrid()',
                    },
                    providers: [ControlClassService, ControlIdService, FormsFocusService, NgControlService, DatalistIdService],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.ControlClassService }, { type: i1.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1.NgControlService }, { type: i1.FormsFocusService }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatalistInput extends WrappedFormControl {
    constructor(focusService, vcr, injector, control, renderer, el, datalistIdService) {
        super(vcr, ClrDatalistContainer, injector, control, renderer, el);
        this.focusService = focusService;
        this.datalistIdService = datalistIdService;
        if (!focusService) {
            throw new Error('clrDatalist requires being wrapped in <clr-datalist-container>');
        }
    }
    ngAfterContentInit() {
        // Subscriptions is inherited from WrappedFormControl, unsubscribe is handled there
        this.subscriptions.push(this.datalistIdService.idChange.subscribe(id => (this.listValue = id)));
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalistInput, deps: [{ token: i1.FormsFocusService, optional: true }, { token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i2$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: DatalistIdService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatalistInput, isStandalone: false, selector: "[clrDatalistInput]", host: { listeners: { "focus": "triggerFocus()" }, properties: { "class.clr-input": "true", "attr.list": "listValue" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalistInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDatalistInput]',
                    host: {
                        '[class.clr-input]': 'true',
                        '[attr.list]': 'listValue',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.FormsFocusService, decorators: [{
                    type: Optional
                }] }, { type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i2$1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: DatalistIdService }], propDecorators: { triggerFocus: [{
                type: HostListener,
                args: ['focus']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatalistModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalistModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalistModule, declarations: [ClrDatalist, ClrDatalistInput, ClrDatalistContainer], imports: [CommonModule, ClrInputModule, ClrIcon], exports: [ClrDatalist, ClrDatalistInput, ClrDatalistContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalistModule, imports: [CommonModule, ClrInputModule, ClrIcon] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalistModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrInputModule, ClrIcon],
                    declarations: [ClrDatalist, ClrDatalistInput, ClrDatalistContainer],
                    exports: [ClrDatalist, ClrDatalistInput, ClrDatalistContainer],
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

export { ClrDatalist, ClrDatalistContainer, ClrDatalistInput, ClrDatalistModule, DatalistIdService };
//# sourceMappingURL=clr-angular-forms-datalist.mjs.map
