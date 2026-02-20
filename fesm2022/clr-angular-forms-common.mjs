import * as i0 from '@angular/core';
import { Injectable, Optional, Directive, Component, ElementRef, HostListener, ContentChild, Input, HostBinding, KeyValueDiffers, Self, ContentChildren, NgModule } from '@angular/core';
import { BehaviorSubject, Subject, tap, merge, of } from 'rxjs';
import { ClrSignpost } from '@clr/angular/popover/signpost';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i2 from '@clr/angular/icon';
import { ClarityIcons, exclamationCircleIcon, checkCircleIcon, ClrIcon } from '@clr/angular/icon';
import { HostWrapper } from '@clr/angular/utils';
import * as i1$1 from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, startWith } from 'rxjs/operators';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let counter$1 = 0;
class ControlIdService {
    constructor() {
        this._id = 'clr-form-control-' + ++counter$1;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ControlIdService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ControlIdService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ControlIdService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let counter = 0;
/**
 * @TODO No idea why I need to use provideIn .. without I'm getting error that
 * ContainerIdService is not defined - But this must be optional service!?
 *
 * There is something wrong - will come back to investigate it when I have more time
 *
 */
class ContainerIdService {
    constructor() {
        this._id = `clr-form-container-${++counter}`;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ContainerIdService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ContainerIdService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ContainerIdService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CONTROL_SUFFIX = {
    HELPER: 'helper',
    ERROR: 'error',
    SUCCESS: 'success',
    NONE: null,
};
class ClrAbstractControl {
    constructor(controlIdService, containerIdService) {
        this.controlIdService = controlIdService;
        this.containerIdService = containerIdService;
        /**
         * Hold the suffix for the ID
         */
        this.controlIdSuffix = 'abstract';
    }
    get id() {
        /**
         * The order of witch the id will be pick is:
         *   - Container ID  (Wrapper arround multiple Controls like, Checkbox, Radio, ...)
         *   - Control ID (Single Control wrapper like Input, Textarea, Password, ...)
         *   - None
         */
        if (this.containerIdService) {
            return `${this.containerIdService.id}-${this.controlIdSuffix}`;
        }
        if (this.controlIdService) {
            return `${this.controlIdService.id}-${this.controlIdSuffix}`;
        }
        return null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAbstractControl, deps: [{ token: ControlIdService, optional: true }, { token: ContainerIdService, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrAbstractControl, isStandalone: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAbstractControl, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: ControlIdService, decorators: [{
                    type: Optional
                }] }, { type: ContainerIdService, decorators: [{
                    type: Optional
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrControlError extends ClrAbstractControl {
    constructor(controlIdService, containerIdService) {
        super(controlIdService, containerIdService);
        this.controlIdService = controlIdService;
        this.containerIdService = containerIdService;
        this.controlIdSuffix = CONTROL_SUFFIX.ERROR;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrControlError, deps: [{ token: ControlIdService, optional: true }, { token: ContainerIdService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrControlError, isStandalone: false, selector: "clr-control-error", host: { properties: { "class.clr-subtext": "true", "class.error": "true", "attr.id": "id" } }, usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrControlError, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-control-error',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.clr-subtext]': 'true',
                        '[class.error]': 'true',
                        '[attr.id]': 'id',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ControlIdService, decorators: [{
                    type: Optional
                }] }, { type: ContainerIdService, decorators: [{
                    type: Optional
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrControlHelper extends ClrAbstractControl {
    constructor(controlIdService, containerIdService) {
        super(controlIdService, containerIdService);
        this.controlIdService = controlIdService;
        this.containerIdService = containerIdService;
        this.controlIdSuffix = CONTROL_SUFFIX.HELPER;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrControlHelper, deps: [{ token: ControlIdService, optional: true }, { token: ContainerIdService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrControlHelper, isStandalone: false, selector: "clr-control-helper", host: { properties: { "class.clr-subtext": "true", "attr.id": "id" } }, usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrControlHelper, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-control-helper',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.clr-subtext]': 'true',
                        '[attr.id]': 'id',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ControlIdService, decorators: [{
                    type: Optional
                }] }, { type: ContainerIdService, decorators: [{
                    type: Optional
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var CONTROL_STATE;
(function (CONTROL_STATE) {
    CONTROL_STATE["VALID"] = "VALID";
    CONTROL_STATE["INVALID"] = "INVALID";
})(CONTROL_STATE || (CONTROL_STATE = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrFormLayout;
(function (ClrFormLayout) {
    ClrFormLayout["VERTICAL"] = "vertical";
    ClrFormLayout["HORIZONTAL"] = "horizontal";
    ClrFormLayout["COMPACT"] = "compact";
})(ClrFormLayout || (ClrFormLayout = {}));
class LayoutService {
    constructor() {
        this.minLabelSize = 1;
        this.maxLabelSize = 12;
        this.layout = ClrFormLayout.HORIZONTAL;
        // This is basically a replacement for Object.values(), which IE11 and Node <9 don't support :(
        // String enums cannot be reverse-mapped, meaning ClrFormLayout['COMPACT'] does not return 'compact' so
        // this exists to deal with this little caveat to get the list of the values as an array.
        this.layoutValues = Object.keys(ClrFormLayout).map(key => ClrFormLayout[key]);
        this._labelSize = 2;
    }
    get labelSize() {
        return this._labelSize;
    }
    set labelSize(size) {
        if (this.labelSizeIsValid(size)) {
            this._labelSize = size;
        }
    }
    get layoutClass() {
        return `clr-form-${this.layout}`;
    }
    isVertical() {
        return this.layout === ClrFormLayout.VERTICAL;
    }
    isHorizontal() {
        return this.layout === ClrFormLayout.HORIZONTAL;
    }
    isCompact() {
        return this.layout === ClrFormLayout.COMPACT;
    }
    isValid(layout) {
        return this.layoutValues.indexOf(layout) > -1;
    }
    labelSizeIsValid(labelSize) {
        return Number.isInteger(labelSize) && labelSize >= this.minLabelSize && labelSize <= this.maxLabelSize;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: LayoutService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: LayoutService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: LayoutService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class NgControlService {
    constructor() {
        this._controls = [];
        // Observable to subscribe to the control, since its not available immediately for projected content
        this._controlsChanges = new Subject();
    }
    get controls() {
        return this._controls;
    }
    get controlsChanges() {
        return this._controlsChanges.asObservable();
    }
    get hasMultipleControls() {
        return this._controls?.length > 1;
    }
    addControl(control) {
        this._controls.push(control);
        this.emitControlsChange(this._controls);
    }
    emitControlsChange(controls) {
        this._controlsChanges.next(controls);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: NgControlService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: NgControlService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: NgControlService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrControlLabel {
    constructor(controlIdService, layoutService, ngControlService, renderer, el) {
        this.controlIdService = controlIdService;
        this.layoutService = layoutService;
        this.ngControlService = ngControlService;
        this.renderer = renderer;
        this.el = el;
        this.enableGrid = true;
        this.subscriptions = [];
    }
    get labelText() {
        return this.el.nativeElement && this.el.nativeElement.textContent;
    }
    ngOnInit() {
        // Prevent id attributes from being removed by the `undefined` host binding.
        // This happens when a `label` is used outside of a control container and other use cases.
        this.idAttr = this.idInput;
        // Only add the clr-control-label if it is inside a control container
        if (this.controlIdService || this.ngControlService) {
            this.renderer.addClass(this.el.nativeElement, 'clr-control-label');
        }
        // Only set the grid column classes if we are in the right context and if they aren't already set
        if (this.enableGrid &&
            this.layoutService &&
            !this.layoutService.isVertical() &&
            this.el.nativeElement &&
            this.el.nativeElement.className.indexOf('clr-col') < 0) {
            this.renderer.addClass(this.el.nativeElement, 'clr-col-12');
            this.renderer.addClass(this.el.nativeElement, `clr-col-md-${this.layoutService.labelSize}`);
        }
        if (this.controlIdService && !this.forAttr) {
            this.subscriptions.push(this.controlIdService.idChange.subscribe(id => {
                this.forAttr = id;
                this.idAttr = this.idInput || `${id}-label`;
            }));
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    disableGrid() {
        this.enableGrid = false;
    }
    /**
     * Allowing signposts inside labels to work without disabling default behavior. <label> is spreading a click event to its children so signposts get
     * automatically closed once clicked inside a <label>.
     * @param event
     */
    onClick(event) {
        this.preventDefaultOnSignpostTarget(event);
    }
    preventDefaultOnSignpostTarget(event) {
        if (this.signpost && this.signpost.nativeElement && this.signpost.nativeElement.contains(event.target)) {
            event.preventDefault();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrControlLabel, deps: [{ token: ControlIdService, optional: true }, { token: LayoutService, optional: true }, { token: NgControlService, optional: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrControlLabel, isStandalone: false, selector: "label", inputs: { idInput: ["id", "idInput"], forAttr: ["for", "forAttr"] }, host: { listeners: { "click": "onClick($event)" }, properties: { "attr.id": "this.idAttr", "attr.for": "this.forAttr" } }, queries: [{ propertyName: "signpost", first: true, predicate: ClrSignpost, descendants: true, read: ElementRef }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrControlLabel, decorators: [{
            type: Directive,
            args: [{
                    selector: 'label',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ControlIdService, decorators: [{
                    type: Optional
                }] }, { type: LayoutService, decorators: [{
                    type: Optional
                }] }, { type: NgControlService, decorators: [{
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }], propDecorators: { idInput: [{
                type: Input,
                args: ['id']
            }], idAttr: [{
                type: HostBinding,
                args: ['attr.id']
            }], forAttr: [{
                type: Input,
                args: ['for']
            }, {
                type: HostBinding,
                args: ['attr.for']
            }], signpost: [{
                type: ContentChild,
                args: [ClrSignpost, { read: ElementRef }]
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrControlSuccess extends ClrAbstractControl {
    constructor(controlIdService, containerIdService) {
        super(controlIdService, containerIdService);
        this.controlIdService = controlIdService;
        this.containerIdService = containerIdService;
        this.controlIdSuffix = CONTROL_SUFFIX.SUCCESS;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrControlSuccess, deps: [{ token: ControlIdService, optional: true }, { token: ContainerIdService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrControlSuccess, isStandalone: false, selector: "clr-control-success", host: { properties: { "class.clr-subtext": "true", "class.success": "true", "attr.id": "id" } }, usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrControlSuccess, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-control-success',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.clr-subtext]': 'true',
                        '[class.success]': 'true',
                        '[attr.id]': 'id',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ControlIdService, decorators: [{
                    type: Optional
                }] }, { type: ContainerIdService, decorators: [{
                    type: Optional
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLASS_ERROR = 'clr-error';
const CLASS_SUCCESS = 'clr-success';
class ControlClassService {
    constructor(layoutService) {
        this.layoutService = layoutService;
        this.className = '';
    }
    controlClass(state, grid = false, additional = '') {
        const controlClasses = [this.className, additional];
        switch (state) {
            case CONTROL_STATE.VALID:
                controlClasses.push(CLASS_SUCCESS);
                break;
            case CONTROL_STATE.INVALID:
                controlClasses.push(CLASS_ERROR);
                break;
        }
        if (grid && this.layoutService && this.className.indexOf('clr-col') === -1) {
            controlClasses.push(`clr-col-md-${this.layoutService.maxLabelSize - this.layoutService.labelSize} clr-col-12`);
        }
        return controlClasses.join(' ').trim();
    }
    // We want to remove the column classes from the input up to the container
    initControlClass(renderer, element) {
        if (element && element.className) {
            const klasses = element.className.split(' ');
            const controlKlasses = [];
            klasses.forEach(klass => {
                if (klass.startsWith('clr-')) {
                    controlKlasses.push(klass);
                }
                if (klass.startsWith('clr-col')) {
                    renderer.removeClass(element, klass);
                }
            });
            this.className = controlKlasses.join(' ').trim();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ControlClassService, deps: [{ token: LayoutService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ControlClassService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ControlClassService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: LayoutService, decorators: [{
                    type: Optional
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrAbstractContainer {
    constructor(layoutService, controlClassService, ngControlService) {
        this.layoutService = layoutService;
        this.controlClassService = controlClassService;
        this.ngControlService = ngControlService;
        this.controls = [];
        this.subscriptions = [];
        this.subscriptions.push(ngControlService.controlsChanges.subscribe(controls => {
            this.controls = controls;
        }));
        ngControlService.container = this;
    }
    get control() {
        return this.controls[0];
    }
    /**
     * @NOTE
     * Helper control is a bit different than the others, it must be always visible:
     *   -  Labels and instructions must always accompany forms and are persistent.
     *   -  The recommendation here is to always have helper text or anything instructions visible.
     *   -  The expectation is to have error text + helper text in the errored state. this way all users will have the helper text information always available.
     */
    get showHelper() {
        /**
         * @NOTE
         * Saving the previous version in case something is changed. We'll return always true so we can be flexible
         * and keep the condition per components.
         *
         * return (
         * Helper Component exist and the state of the form is NONE (not touched)
         * (!!this.controlHelperComponent && (!this.touched || this.state === CONTROL_STATE.NONE)) ||
         * or there is no success component but the state of the form is VALID - show helper information
         * (!!this.controlSuccessComponent === false && this.state === CONTROL_STATE.VALID) ||
         * or there is no error component but the state of the form is INVALID - show helper information
         * (!!this.controlErrorComponent === false && this.state === CONTROL_STATE.INVALID)
         * );
         */
        return Boolean(this.controlHelperComponent);
    }
    /**
     * We gonna set the helper control state, after all or most of the components
     * are ready - also this will trigger some initial flows into wrappers and controls,
     * like locating IDs  and setting  attributes.
     */
    get helpers() {
        return {
            show: this.showInvalid || this.showHelper || this.showValid,
            showInvalid: this.showInvalid,
            showHelper: this.showHelper,
            showValid: this.showValid,
        };
    }
    get showValid() {
        return this.touched && this.state === CONTROL_STATE.VALID && this.successMessagePresent;
    }
    get showInvalid() {
        return this.touched && this.state === CONTROL_STATE.INVALID && this.errorMessagePresent;
    }
    get successMessagePresent() {
        return !!this.controlSuccessComponent;
    }
    get errorMessagePresent() {
        return !!this.controlErrorComponent;
    }
    get touched() {
        return !!this.controls?.some(control => control.touched);
    }
    get state() {
        const controlStatuses = this.controls.map((control) => {
            return control.status;
        });
        // These status values are mutually exclusive, so a control
        // cannot be both valid AND invalid or invalid AND disabled.
        // if else order is important!
        if (controlStatuses.includes(CONTROL_STATE.INVALID)) {
            return CONTROL_STATE.INVALID;
        }
        else if (controlStatuses.includes(CONTROL_STATE.VALID)) {
            return CONTROL_STATE.VALID;
        }
        else {
            return null;
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
    controlClass() {
        /**
         * Decide what subtext to display:
         *   - container is valid but no success component is implemented - use helper class
         *   - container is valid and success component is implemented - use success class
         *   - Pass form control state and return string of classes to be applied to the container.
         */
        const currentState = this.touched ? this.state : null;
        return this.controlClassService.controlClass(currentState, this.addGrid());
    }
    addGrid() {
        return this.layoutService && !this.layoutService.isVertical();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAbstractContainer, deps: [{ token: LayoutService, optional: true }, { token: ControlClassService }, { token: NgControlService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrAbstractContainer, isStandalone: true, queries: [{ propertyName: "label", first: true, predicate: ClrControlLabel, descendants: true }, { propertyName: "controlSuccessComponent", first: true, predicate: ClrControlSuccess, descendants: true }, { propertyName: "controlErrorComponent", first: true, predicate: ClrControlError, descendants: true }, { propertyName: "controlHelperComponent", first: true, predicate: ClrControlHelper, descendants: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrAbstractContainer, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: LayoutService, decorators: [{
                    type: Optional
                }] }, { type: ControlClassService }, { type: NgControlService }], propDecorators: { label: [{
                type: ContentChild,
                args: [ClrControlLabel, { static: false }]
            }], controlSuccessComponent: [{
                type: ContentChild,
                args: [ClrControlSuccess]
            }], controlErrorComponent: [{
                type: ContentChild,
                args: [ClrControlError]
            }], controlHelperComponent: [{
                type: ContentChild,
                args: [ClrControlHelper]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrControlContainer extends ClrAbstractContainer {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrControlContainer, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrControlContainer, isStandalone: false, selector: "clr-control-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService, ControlIdService, ControlClassService], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <ng-content></ng-content>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i2.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrControlContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-control-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <ng-content></ng-content>
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
                    providers: [NgControlService, ControlIdService, ControlClassService],
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MarkControlService {
    constructor() {
        this._touched = new Subject();
    }
    get touchedChange() {
        return this._touched.asObservable();
    }
    markAsTouched() {
        this._touched.next();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MarkControlService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MarkControlService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MarkControlService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var CHANGE_KEYS;
(function (CHANGE_KEYS) {
    CHANGE_KEYS["FORM"] = "form";
    CHANGE_KEYS["MODEL"] = "model";
})(CHANGE_KEYS || (CHANGE_KEYS = {}));
class WrappedFormControl {
    // I lost way too much time trying to make this work without injecting the ViewContainerRef and the Injector,
    // I'm giving up. So we have to inject these two manually for now.
    constructor(vcr, wrapperType, injector, ngControl, renderer, el) {
        this.vcr = vcr;
        this.wrapperType = wrapperType;
        this.ngControl = ngControl;
        this.renderer = renderer;
        this.el = el;
        this.index = 0;
        this.subscriptions = [];
        if (injector) {
            this.ngControlService = injector.get(NgControlService, null);
            this.markControlService = injector.get(MarkControlService, null);
            this.differs = injector.get(KeyValueDiffers, null);
        }
        if (this.markControlService) {
            this.subscriptions.push(this.markControlService.touchedChange.subscribe(() => {
                this.markAsTouched();
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
    get ariaDescribedById() {
        const helpers = this.ngControlService?.container?.helpers;
        if (!helpers?.show) {
            return null;
        }
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
    ngOnInit() {
        this._containerInjector = new HostWrapper(this.wrapperType, this.vcr, this.index);
        this.controlIdService = this._containerInjector.get(ControlIdService);
        this.injectControlClassService(this._containerInjector);
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
        // 4 possible variations
        // 1. NO  ngControlService and NO  ngControl
        // 2. NO  ngControlService and YES ngControl
        // 3. YES ngControlService and NO  ngControl
        // 4. YES ngControlService and YES ngControl
        if (this.ngControl) {
            this.differ = this.differs.find(this.ngControl).create();
        }
        if (this.ngControlService && this.ngControl) {
            this.ngControlService.addControl(this.ngControl);
        }
    }
    ngDoCheck() {
        if (this.ngControl) {
            this.triggerDoCheck(this.differ, this.ngControl);
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub?.unsubscribe());
    }
    // blur HostListener decorator MUST be 1 and on the parent.
    // overrides MUST NOT have HostListener decorator.
    triggerValidation() {
        if (this.ngControl?.control?.markAsTouched) {
            this.ngControl.control.markAsTouched();
        }
    }
    // @TODO This method has a try/catch due to an unknown issue that came when building the clrToggle feature
    // We need to figure out why this fails for the ClrToggle scenario but works for Date picker...
    // To see the error, remove the try/catch here and run the ClrToggle suite to see issues getting the container
    // injector in time, and this ONLY HAPPENS in tests and not in dev/prod mode.
    getProviderFromContainer(token, notFoundValue) {
        try {
            return this._containerInjector.get(token, notFoundValue);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (e) {
            return notFoundValue;
        }
    }
    injectControlClassService(injector) {
        if (!this.controlClassService) {
            this.controlClassService = injector.get(ControlClassService, null);
            if (this.controlClassService) {
                this.controlClassService.initControlClass(this.renderer, this.el.nativeElement);
            }
        }
    }
    triggerDoCheck(differ, ngControl) {
        if (differ) {
            const changes = differ.diff(ngControl);
            if (changes) {
                changes.forEachChangedItem(change => {
                    if ((change.key === CHANGE_KEYS.FORM || change.key === CHANGE_KEYS.MODEL) &&
                        change.currentValue !== change.previousValue) {
                        if (this.ngControlService) {
                            this.ngControlService.emitControlsChange(this.ngControlService.controls);
                        }
                        this.triggerValidation();
                    }
                });
            }
        }
    }
    markAsTouched() {
        if (this.ngControlService && this.ngControlService.hasMultipleControls) {
            this.ngControlService.controls.forEach((ngControl) => {
                ngControl.control.markAsTouched();
                ngControl.control.updateValueAndValidity();
            });
            return;
        }
        if (this.ngControl) {
            this.ngControl.control.markAsTouched();
            this.ngControl.control.updateValueAndValidity();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: WrappedFormControl, deps: [{ token: i0.ViewContainerRef }, { token: i0.Type }, { token: i0.Injector }, { token: i1$1.NgControl }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: WrappedFormControl, isStandalone: true, inputs: { id: "id" }, host: { listeners: { "blur": "triggerValidation()" }, properties: { "id": "this.id", "attr.aria-describedby": "this.ariaDescribedById" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: WrappedFormControl, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.Type }, { type: i0.Injector }, { type: i1$1.NgControl }, { type: i0.Renderer2 }, { type: i0.ElementRef }], propDecorators: { id: [{
                type: Input
            }, {
                type: HostBinding
            }], ariaDescribedById: [{
                type: HostBinding,
                args: ['attr.aria-describedby']
            }], triggerValidation: [{
                type: HostListener,
                args: ['blur']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrControl extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrControlContainer, injector, control, renderer, el);
        this.index = 1;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrControl, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrControl, isStandalone: false, selector: "[clrControl]", host: { properties: { "class.clr-input": "true" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrControl, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrControl]',
                    host: { '[class.clr-input]': 'true' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1$1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrForm {
    constructor(layoutService, markControlService) {
        this.layoutService = layoutService;
        this.markControlService = markControlService;
    }
    set labelSize(size) {
        const sizeNumber = parseInt(size, 10) || 2;
        this.layoutService.labelSize = sizeNumber;
    }
    onFormSubmit() {
        this.markAsTouched();
    }
    // Trying to avoid adding an input and keep this backwards compatible at the same time
    markAsTouched() {
        this.markControlService.markAsTouched();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrForm, deps: [{ token: LayoutService }, { token: MarkControlService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrForm, isStandalone: false, selector: "[clrForm]", inputs: { labelSize: ["clrLabelSize", "labelSize"] }, host: { listeners: { "submit": "onFormSubmit()" }, properties: { "class.clr-form": "true", "class.clr-form-horizontal": "layoutService.isHorizontal()", "class.clr-form-compact": "layoutService.isCompact()" } }, providers: [LayoutService, MarkControlService], queries: [{ propertyName: "labels", predicate: ClrControlLabel, descendants: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrForm, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrForm]',
                    providers: [LayoutService, MarkControlService],
                    host: {
                        '[class.clr-form]': 'true',
                        '[class.clr-form-horizontal]': 'layoutService.isHorizontal()',
                        '[class.clr-form-compact]': 'layoutService.isCompact()',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: LayoutService }, { type: MarkControlService }], propDecorators: { labels: [{
                type: ContentChildren,
                args: [ClrControlLabel, { descendants: true }]
            }], labelSize: [{
                type: Input,
                args: ['clrLabelSize']
            }], onFormSubmit: [{
                type: HostListener,
                args: ['submit']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class AbstractIfState {
    constructor(ngControlService) {
        this.ngControlService = ngControlService;
        this.displayedContent = false;
        if (ngControlService) {
            ngControlService.controlsChanges
                .pipe(tap(controls => {
                this.controls = controls;
            }), switchMap(controls => {
                if (!controls || controls.length === 0) {
                    return [];
                }
                const statusStreams = controls.map(c => this.getControlStatusChangesObservable(c));
                return merge(...statusStreams);
            }), takeUntilDestroyed())
                .subscribe(status => {
                this.handleState(status);
            });
        }
    }
    handleState(_state) {
        /* overwrite in implementation to handle status change */
    }
    getControlStatusChangesObservable(control) {
        if (!control.statusChanges) {
            return of(null);
        }
        return control.statusChanges.pipe(startWith(control.status));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AbstractIfState, deps: [{ token: NgControlService, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: AbstractIfState, isStandalone: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AbstractIfState, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: NgControlService, decorators: [{
                    type: Optional
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrIfError extends AbstractIfState {
    constructor(ngControlService, template, container) {
        super(ngControlService);
        this.template = template;
        this.container = container;
        if (!ngControlService) {
            throw new Error('clrIfError can only be used within a form control container element like clr-input-container');
        }
    }
    /**
     * @param state CONTROL_STATE
     */
    handleState(state) {
        if (this.error && !!this.controls?.length) {
            const invalidControl = this.controls?.filter(control => control.hasError(this.error))[0];
            this.displayError(!!invalidControl, invalidControl);
        }
        else {
            this.displayError(CONTROL_STATE.INVALID === state);
        }
    }
    displayError(invalid, control = this.controls[0]) {
        /* if no container do nothing */
        if (!this.container) {
            return;
        }
        if (invalid) {
            if (this.displayedContent === false) {
                this.embeddedViewRef = this.container.createEmbeddedView(this.template, {
                    error: control.getError(this.error),
                });
                this.displayedContent = true;
            }
            else if (this.embeddedViewRef && this.embeddedViewRef.context) {
                // if view is already rendered, update the error object to keep it in sync
                this.embeddedViewRef.context.error = control.getError(this.error);
            }
        }
        else {
            this.container.clear();
            this.displayedContent = false;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrIfError, deps: [{ token: NgControlService, optional: true }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrIfError, isStandalone: false, selector: "[clrIfError]", inputs: { error: ["clrIfError", "error"] }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrIfError, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfError]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: NgControlService, decorators: [{
                    type: Optional
                }] }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }], propDecorators: { error: [{
                type: Input,
                args: ['clrIfError']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrIfSuccess extends AbstractIfState {
    constructor(ngControlService, template, container) {
        super(ngControlService);
        this.template = template;
        this.container = container;
        if (!ngControlService) {
            throw new Error('ClrIfSuccess can only be used within a form control container element like clr-input-container');
        }
    }
    /**
     * @param state CONTROL_STATE
     */
    handleState(state) {
        const isValid = CONTROL_STATE.VALID === state;
        if (isValid && !this.displayedContent) {
            this.container.createEmbeddedView(this.template);
        }
        else if (!isValid && this.container) {
            this.container.clear();
        }
        this.displayedContent = isValid;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrIfSuccess, deps: [{ token: NgControlService, optional: true }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrIfSuccess, isStandalone: false, selector: "[clrIfSuccess]", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrIfSuccess, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfSuccess]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: NgControlService, decorators: [{
                    type: Optional
                }] }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrLayout {
    constructor(layoutService) {
        this.layoutService = layoutService;
    }
    ngOnInit() {
        // Only set the layout if it is a valid option
        if (this.layout && this.layoutService.isValid(this.layout)) {
            this.layoutService.layout = this.layout;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrLayout, deps: [{ token: LayoutService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrLayout, isStandalone: false, selector: "[clrForm][clrLayout]", inputs: { layout: ["clrLayout", "layout"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrLayout, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrForm][clrLayout]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: LayoutService }], propDecorators: { layout: [{
                type: Input,
                args: ['clrLayout']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCommonFormsModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrCommonFormsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrCommonFormsModule, declarations: [ClrControlLabel,
            ClrControlError,
            ClrControlSuccess,
            ClrControlHelper,
            ClrIfError,
            ClrIfSuccess,
            ClrForm,
            ClrLayout,
            ClrControlContainer,
            ClrControl], imports: [CommonModule, ClrIcon], exports: [ClrControlLabel,
            ClrControlError,
            ClrControlSuccess,
            ClrControlHelper,
            ClrIfError,
            ClrIfSuccess,
            ClrForm,
            ClrLayout,
            ClrControlContainer,
            ClrControl,
            ClrIcon] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrCommonFormsModule, imports: [CommonModule, ClrIcon] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrCommonFormsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon],
                    declarations: [
                        ClrControlLabel,
                        ClrControlError,
                        ClrControlSuccess,
                        ClrControlHelper,
                        ClrIfError,
                        ClrIfSuccess,
                        ClrForm,
                        ClrLayout,
                        ClrControlContainer,
                        ClrControl,
                    ],
                    exports: [
                        ClrControlLabel,
                        ClrControlError,
                        ClrControlSuccess,
                        ClrControlHelper,
                        ClrIfError,
                        ClrIfSuccess,
                        ClrForm,
                        ClrLayout,
                        ClrControlContainer,
                        ClrControl,
                        ClrIcon,
                    ],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class FormsFocusService {
    constructor() {
        this._focused = new BehaviorSubject(false);
    }
    get focusChange() {
        return this._focused.asObservable();
    }
    set focused(state) {
        this._focused.next(state);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: FormsFocusService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: FormsFocusService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: FormsFocusService, decorators: [{
            type: Injectable
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

export { AbstractIfState, CHANGE_KEYS, ClrAbstractContainer, ClrCommonFormsModule, ClrControl, ClrControlContainer, ClrControlError, ClrControlHelper, ClrControlLabel, ClrControlSuccess, ClrForm, ClrFormLayout, ClrIfError, ClrIfSuccess, ClrLayout, ContainerIdService, ControlClassService, ControlIdService, FormsFocusService, LayoutService, MarkControlService, NgControlService, WrappedFormControl };
//# sourceMappingURL=clr-angular-forms-common.mjs.map
