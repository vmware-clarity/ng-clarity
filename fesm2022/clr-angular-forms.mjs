import * as i0 from '@angular/core';
import { Injectable, Optional, Directive, Component, ElementRef, HostListener, ContentChild, Input, HostBinding, KeyValueDiffers, Self, ContentChildren, NgModule, InjectionToken, forwardRef, Inject, Attribute, ViewChild, PLATFORM_ID, DOCUMENT, EventEmitter, Output, LOCALE_ID, inject, TemplateRef, Injector } from '@angular/core';
import * as i2 from 'rxjs';
import { BehaviorSubject, Subject, tap, merge, of, ReplaySubject } from 'rxjs';
import { ClrSignpost } from '@clr/angular/popover/signpost';
import * as i1 from '@angular/common';
import { CommonModule, isPlatformBrowser, NgForOf, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, getLocaleFirstDayOfWeek, getLocaleDateFormat, FormatWidth } from '@angular/common';
import * as i3 from '@clr/angular/icon';
import { ClarityIcons, exclamationCircleIcon, checkCircleIcon, ClrIcon, angleIcon, windowCloseIcon, eventIcon, calendarIcon, folderOpenIcon, minusIcon, plusIcon, eyeHideIcon, eyeIcon } from '@clr/angular/icon';
import * as i2$1 from '@clr/angular/utils';
import { HostWrapper, ClrHostWrappingModule, ArrowKeyDirection, normalizeKey, Keys, customFocusableItemProvider, uniqueIdFactory, ClrLoadingState, IF_ACTIVE_ID, LoadingListener, IF_ACTIVE_ID_PROVIDER, FOCUS_SERVICE_PROVIDER, ClrConditionalModule, ClrKeyFocusModule, DATEPICKER_ENABLE_BREAKPOINT, isBooleanAttributeSet, CdkTrapFocusModule, ClrCommonStringsService } from '@clr/angular/utils';
import * as i1$1 from '@angular/forms';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, SelectMultipleControlValueAccessor } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, startWith, take, first, filter } from 'rxjs/operators';
import * as i1$2 from '@clr/angular/forms/common';
import { ClrControlLabel as ClrControlLabel$1, ControlIdService as ControlIdService$1, WrappedFormControl as WrappedFormControl$1, ClrAbstractContainer as ClrAbstractContainer$1, NgControlService as NgControlService$1, ControlClassService as ControlClassService$1, ContainerIdService as ContainerIdService$1, ClrCommonFormsModule as ClrCommonFormsModule$1, FormsFocusService as FormsFocusService$1 } from '@clr/angular/forms/common';
import * as i1$3 from '@clr/angular/popover/common';
import { POPOVER_HOST_ANCHOR, ClrPopoverPosition, ClrPopoverType, ClrPopoverHostDirective, ÇlrClrPopoverModuleNext as _lrClrPopoverModuleNext, DROPDOWN_POSITIONS } from '@clr/angular/popover/common';
import * as i5 from '@clr/angular/progress/spinner';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';
import { ClrInputModule as ClrInputModule$1 } from '@clr/angular/forms/input';
import * as i6 from '@clr/angular/layout/vertical-nav';
import { ClrVerticalNavModule } from '@clr/angular/layout/vertical-nav';
import { ClrCheckboxModule as ClrCheckboxModule$1 } from '@clr/angular/forms/checkbox';
import { ClrComboboxModule as ClrComboboxModule$1 } from '@clr/angular/forms/combobox';
import { ClrDatalistModule as ClrDatalistModule$1 } from '@clr/angular/forms/datalist';
import { ClrDatepickerModule as ClrDatepickerModule$1 } from '@clr/angular/forms/datepicker';
import { ClrFileInputModule as ClrFileInputModule$1 } from '@clr/angular/forms/file-input';
import { ClrNumberInputModule as ClrNumberInputModule$1 } from '@clr/angular/forms/number-input';
import { ClrPasswordModule as ClrPasswordModule$1 } from '@clr/angular/forms/password';
import { ClrRadioModule as ClrRadioModule$1 } from '@clr/angular/forms/radio';
import { ClrRangeModule as ClrRangeModule$1 } from '@clr/angular/forms/range';
import { ClrSelectModule as ClrSelectModule$1 } from '@clr/angular/forms/select';
import { ClrTextareaModule as ClrTextareaModule$1 } from '@clr/angular/forms/textarea';

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let counter$2 = 0;
class ControlIdService {
    constructor() {
        this._id = 'clr-form-control-' + ++counter$2;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ControlIdService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ControlIdService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ControlIdService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let counter$1 = 0;
/**
 * @TODO No idea why I need to use provideIn .. without I'm getting error that
 * ContainerIdService is not defined - But this must be optional service!?
 *
 * There is something wrong - will come back to investigate it when I have more time
 *
 */
class ContainerIdService {
    constructor() {
        this._id = `clr-form-container-${++counter$1}`;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ContainerIdService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ContainerIdService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ContainerIdService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrAbstractControl, deps: [{ token: ControlIdService, optional: true }, { token: ContainerIdService, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrAbstractControl, isStandalone: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrAbstractControl, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: ControlIdService, decorators: [{
                    type: Optional
                }] }, { type: ContainerIdService, decorators: [{
                    type: Optional
                }] }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrControlError, deps: [{ token: ControlIdService, optional: true }, { token: ContainerIdService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrControlError, isStandalone: false, selector: "clr-control-error", host: { properties: { "class.clr-subtext": "true", "class.error": "true", "attr.id": "id" } }, usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrControlError, decorators: [{
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
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrControlHelper, deps: [{ token: ControlIdService, optional: true }, { token: ContainerIdService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrControlHelper, isStandalone: false, selector: "clr-control-helper", host: { properties: { "class.clr-subtext": "true", "attr.id": "id" } }, usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrControlHelper, decorators: [{
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
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: LayoutService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: LayoutService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: LayoutService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: NgControlService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: NgControlService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: NgControlService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrControlLabel, deps: [{ token: ControlIdService, optional: true }, { token: LayoutService, optional: true }, { token: NgControlService, optional: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrControlLabel, isStandalone: false, selector: "label", inputs: { idInput: ["id", "idInput"], forAttr: ["for", "forAttr"] }, host: { listeners: { "click": "onClick($event)" }, properties: { "attr.id": "this.idAttr", "attr.for": "this.forAttr" } }, queries: [{ propertyName: "signpost", first: true, predicate: ClrSignpost, descendants: true, read: ElementRef }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrControlLabel, decorators: [{
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
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrControlSuccess, deps: [{ token: ControlIdService, optional: true }, { token: ContainerIdService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrControlSuccess, isStandalone: false, selector: "clr-control-success", host: { properties: { "class.clr-subtext": "true", "class.success": "true", "attr.id": "id" } }, usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrControlSuccess, decorators: [{
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
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ControlClassService, deps: [{ token: LayoutService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ControlClassService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ControlClassService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: LayoutService, decorators: [{
                    type: Optional
                }] }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrAbstractContainer, deps: [{ token: LayoutService, optional: true }, { token: ControlClassService }, { token: NgControlService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrAbstractContainer, isStandalone: true, queries: [{ propertyName: "label", first: true, predicate: ClrControlLabel, descendants: true }, { propertyName: "controlSuccessComponent", first: true, predicate: ClrControlSuccess, descendants: true }, { propertyName: "controlErrorComponent", first: true, predicate: ClrControlError, descendants: true }, { propertyName: "controlHelperComponent", first: true, predicate: ClrControlHelper, descendants: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrAbstractContainer, decorators: [{
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
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrControlContainer extends ClrAbstractContainer {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrControlContainer, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrControlContainer, isStandalone: false, selector: "clr-control-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService, ControlIdService, ControlClassService], usesInheritance: true, ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrControlContainer, decorators: [{
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
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: MarkControlService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: MarkControlService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: MarkControlService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: WrappedFormControl, deps: [{ token: i0.ViewContainerRef }, { token: i0.Type }, { token: i0.Injector }, { token: i1$1.NgControl }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: WrappedFormControl, isStandalone: true, inputs: { id: "id" }, host: { listeners: { "blur": "triggerValidation()" }, properties: { "id": "this.id", "attr.aria-describedby": "this.ariaDescribedById" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: WrappedFormControl, decorators: [{
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
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrControl extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrControlContainer, injector, control, renderer, el);
        this.index = 1;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrControl, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrControl, isStandalone: false, selector: "[clrControl]", host: { properties: { "class.clr-input": "true" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrControl, decorators: [{
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
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrForm, deps: [{ token: LayoutService }, { token: MarkControlService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrForm, isStandalone: false, selector: "[clrForm]", inputs: { labelSize: ["clrLabelSize", "labelSize"] }, host: { listeners: { "submit": "onFormSubmit()" }, properties: { "class.clr-form": "true", "class.clr-form-horizontal": "layoutService.isHorizontal()", "class.clr-form-compact": "layoutService.isCompact()" } }, providers: [LayoutService, MarkControlService], queries: [{ propertyName: "labels", predicate: ClrControlLabel, descendants: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrForm, decorators: [{
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
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: AbstractIfState, deps: [{ token: NgControlService, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: AbstractIfState, isStandalone: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: AbstractIfState, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: NgControlService, decorators: [{
                    type: Optional
                }] }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrIfError, deps: [{ token: NgControlService, optional: true }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrIfError, isStandalone: false, selector: "[clrIfError]", inputs: { error: ["clrIfError", "error"] }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrIfError, decorators: [{
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
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrIfSuccess, deps: [{ token: NgControlService, optional: true }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrIfSuccess, isStandalone: false, selector: "[clrIfSuccess]", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrIfSuccess, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfSuccess]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: NgControlService, decorators: [{
                    type: Optional
                }] }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLayout, deps: [{ token: LayoutService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrLayout, isStandalone: false, selector: "[clrForm][clrLayout]", inputs: { layout: ["clrLayout", "layout"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLayout, decorators: [{
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
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCommonFormsModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCommonFormsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrCommonFormsModule, declarations: [ClrControlLabel,
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
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCommonFormsModule, imports: [CommonModule, ClrIcon] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCommonFormsModule, decorators: [{
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
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: FormsFocusService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: FormsFocusService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: FormsFocusService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const IS_TOGGLE = new InjectionToken('IS_TOGGLE');
function isToggleFactory() {
    return new BehaviorSubject(false);
}
const IS_TOGGLE_PROVIDER = { provide: IS_TOGGLE, useFactory: isToggleFactory };
class ClrCheckboxWrapper {
    constructor(toggleService) {
        this.toggle = false;
        this.subscriptions = [];
        this.subscriptions.push(toggleService.subscribe(state => {
            this.toggle = state;
        }));
    }
    ngOnInit() {
        if (this.label) {
            this.label.disableGrid();
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCheckboxWrapper, deps: [{ token: IS_TOGGLE }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrCheckboxWrapper, isStandalone: false, selector: "clr-checkbox-wrapper,clr-toggle-wrapper", host: { properties: { "class.clr-checkbox-wrapper": "!toggle", "class.clr-checkbox-wrapper-disabled": "checkbox?.controlDisabled", "class.clr-toggle-wrapper": "toggle" } }, providers: [ControlIdService$1, IS_TOGGLE_PROVIDER], queries: [{ propertyName: "label", first: true, predicate: ClrControlLabel$1, descendants: true, static: true }, { propertyName: "checkbox", first: true, predicate: i0.forwardRef(() => ClrCheckbox), descendants: true, static: true }], ngImport: i0, template: `
    <ng-content select="[clrCheckbox],[clrToggle]"></ng-content>
    <ng-content select="label"></ng-content>
    @if (!label) {
      <label></label>
    }
  `, isInline: true, dependencies: [{ kind: "directive", type: i1$2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCheckboxWrapper, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-checkbox-wrapper,clr-toggle-wrapper',
                    template: `
    <ng-content select="[clrCheckbox],[clrToggle]"></ng-content>
    <ng-content select="label"></ng-content>
    @if (!label) {
      <label></label>
    }
  `,
                    host: {
                        '[class.clr-checkbox-wrapper]': '!toggle',
                        '[class.clr-checkbox-wrapper-disabled]': 'checkbox?.controlDisabled',
                        '[class.clr-toggle-wrapper]': 'toggle',
                    },
                    providers: [ControlIdService$1, IS_TOGGLE_PROVIDER],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i2.BehaviorSubject, decorators: [{
                    type: Inject,
                    args: [IS_TOGGLE]
                }] }], propDecorators: { label: [{
                type: ContentChild,
                args: [ClrControlLabel$1, { static: true }]
            }], checkbox: [{
                type: ContentChild,
                args: [forwardRef(() => ClrCheckbox), { static: true }]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This implements both the clrCheckbox and clrToggle functionality, since they are both just checkboxes with different
 * visual styling. The challenge is that the container needs to know which selector was used, which the @Attribute
 * decorator gets for us to determine if the toggle is used, and emits a value to the wrapper container to tell it
 * there is a toggle switch instead.
 */
class ClrCheckbox extends WrappedFormControl$1 {
    constructor(vcr, injector, control, renderer, el, toggle) {
        super(vcr, ClrCheckboxWrapper, injector, control, renderer, el);
        this.control = control;
        this.toggle = toggle;
    }
    get controlDisabled() {
        return this.control?.disabled;
    }
    ngOnInit() {
        super.ngOnInit();
        const toggleService = this.getProviderFromContainer(IS_TOGGLE, null);
        if (toggleService && this.toggle !== null) {
            toggleService.next(true);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCheckbox, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: 'clrToggle', attribute: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrCheckbox, isStandalone: false, selector: "[clrCheckbox],[clrToggle]", host: { properties: { "attr.role": "toggle !== null ? \"switch\" : null" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCheckbox, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrCheckbox],[clrToggle]',
                    host: {
                        '[attr.role]': 'toggle !== null ? "switch" : null',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1$1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['clrToggle']
                }] }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCheckboxContainer extends ClrAbstractContainer$1 {
    constructor(layoutService, controlClassService, ngControlService) {
        super(layoutService, controlClassService, ngControlService);
        this.layoutService = layoutService;
        this.controlClassService = controlClassService;
        this.ngControlService = ngControlService;
        this.inline = false;
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
    get allCheckboxesDisabled() {
        if (!this.controls?.length) {
            return false;
        }
        return this.controls.every(control => control.disabled);
    }
    ngAfterContentInit() {
        this.setAriaRoles();
    }
    setAriaRoles() {
        this.role = this.checkboxes?.length ? 'group' : null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCheckboxContainer, deps: [{ token: i1$2.LayoutService, optional: true }, { token: i1$2.ControlClassService }, { token: i1$2.NgControlService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrCheckboxContainer, isStandalone: false, selector: "clr-checkbox-container,clr-toggle-container", inputs: { clrInline: "clrInline" }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "allCheckboxesDisabled", "class.clr-row": "addGrid()", "attr.role": "role" } }, providers: [NgControlService$1, ControlClassService$1, ContainerIdService$1], queries: [{ propertyName: "checkboxes", predicate: ClrCheckbox, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [class.clr-control-inline]="clrInline" [ngClass]="controlClass()">
      <ng-content select="clr-checkbox-wrapper,clr-toggle-wrapper"></ng-content>
      @if (showHelper) {
        <div class="clr-subtext-wrapper">
          <ng-content select="clr-control-helper"></ng-content>
        </div>
      }
      @if (showInvalid || showValid) {
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i1$2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCheckboxContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-checkbox-container,clr-toggle-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [class.clr-control-inline]="clrInline" [ngClass]="controlClass()">
      <ng-content select="clr-checkbox-wrapper,clr-toggle-wrapper"></ng-content>
      @if (showHelper) {
        <div class="clr-subtext-wrapper">
          <ng-content select="clr-control-helper"></ng-content>
        </div>
      }
      @if (showInvalid || showValid) {
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
                        '[class.clr-form-control-disabled]': 'allCheckboxesDisabled',
                        '[class.clr-row]': 'addGrid()',
                        '[attr.role]': 'role',
                    },
                    providers: [NgControlService$1, ControlClassService$1, ContainerIdService$1],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1$2.ControlClassService }, { type: i1$2.NgControlService }], propDecorators: { checkboxes: [{
                type: ContentChildren,
                args: [ClrCheckbox, { descendants: true }]
            }], clrInline: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCheckboxModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCheckboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrCheckboxModule, declarations: [ClrCheckbox, ClrCheckboxContainer, ClrCheckboxWrapper], imports: [CommonModule, ClrIcon, ClrCommonFormsModule$1, ClrHostWrappingModule], exports: [ClrCommonFormsModule$1, ClrCheckbox, ClrCheckboxContainer, ClrCheckboxWrapper] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCheckboxModule, imports: [CommonModule, ClrIcon, ClrCommonFormsModule$1, ClrHostWrappingModule, ClrCommonFormsModule$1] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCheckboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrCommonFormsModule$1, ClrHostWrappingModule],
                    declarations: [ClrCheckbox, ClrCheckboxContainer, ClrCheckboxWrapper],
                    exports: [ClrCommonFormsModule$1, ClrCheckbox, ClrCheckboxContainer, ClrCheckboxWrapper],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ComboboxContainerService {
    constructor() {
        this.labelOffset = 0;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ComboboxContainerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ComboboxContainerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ComboboxContainerService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrComboboxContainer extends ClrAbstractContainer$1 {
    constructor(layoutService, controlClassService, ngControlService, containerService, el) {
        super(layoutService, controlClassService, ngControlService);
        this.containerService = containerService;
        this.el = el;
    }
    ngAfterContentInit() {
        if (this.label) {
            this.containerService.labelText = this.label.labelText;
        }
    }
    ngAfterViewInit() {
        this.containerService.labelOffset =
            this.controlContainer.nativeElement.offsetHeight - this.el.nativeElement.offsetHeight;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrComboboxContainer, deps: [{ token: i1$2.LayoutService, optional: true }, { token: i1$2.ControlClassService }, { token: i1$2.NgControlService }, { token: ComboboxContainerService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrComboboxContainer, isStandalone: false, selector: "clr-combobox-container", host: { properties: { "class.clr-form-control": "true", "class.clr-combobox-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService$1, ControlIdService$1, ControlClassService$1, ComboboxContainerService], viewQueries: [{ propertyName: "controlContainer", first: true, predicate: ["controlContainer"], descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()" #controlContainer>
      <ng-content select="clr-combobox"></ng-content>
      @if (showInvalid) {
        <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger" aria-hidden="true"></cds-icon>
      }
      @if (showValid) {
        <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
      }
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i1$2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrComboboxContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-combobox-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()" #controlContainer>
      <ng-content select="clr-combobox"></ng-content>
      @if (showInvalid) {
        <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger" aria-hidden="true"></cds-icon>
      }
      @if (showValid) {
        <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
      }
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
                        '[class.clr-combobox-form-control]': 'true',
                        '[class.clr-form-control-disabled]': 'control?.disabled',
                        '[class.clr-row]': 'addGrid()',
                    },
                    providers: [NgControlService$1, ControlIdService$1, ControlClassService$1, ComboboxContainerService],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1$2.ControlClassService }, { type: i1$2.NgControlService }, { type: ComboboxContainerService }, { type: i0.ElementRef }], propDecorators: { controlContainer: [{
                type: ViewChild,
                args: ['controlContainer']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MultiSelectComboboxModel {
    containsItem(item) {
        if (this.model) {
            if (this.displayField && typeof item === 'object') {
                const includes = this.model.some(modelItem => {
                    return modelItem[this.displayField] === item[this.displayField];
                });
                return includes;
            }
            else {
                return this.model.includes(item);
            }
        }
        return false;
    }
    select(item) {
        this.addItem(item);
    }
    unselect(item) {
        this.removeItem(item);
    }
    isEmpty() {
        return !(this.model && this.model.length > 0);
    }
    pop() {
        let item;
        if (this.model && this.model.length > 0) {
            item = this.model[this.model.length - 1];
            this.removeItem(item);
        }
        return item;
    }
    toString(displayField, index = -1) {
        let displayString = '';
        if (this.model) {
            // If the model is array, we can use a specific item from it, to retrieve the display value.
            if (index > -1) {
                if (this.model[index]) {
                    // If we have a defined display field, we'll use it's value as display value
                    if (displayField && this.model[index][displayField]) {
                        displayString += this.model[index][displayField];
                    }
                    else {
                        // If we don't have a defined display field, we'll use the toString representation of the
                        // item as display value.
                        displayString += this.model[index].toString();
                    }
                }
            }
            else {
                this.model.forEach((model) => {
                    // If we have a defined display field, we'll use it's value as display value
                    if (displayField && model[displayField]) {
                        displayString += model[displayField];
                    }
                    else {
                        // If we don't have a defined display field, we'll use the toString representation of the
                        // model as display value.
                        displayString += model.toString();
                    }
                    displayString += ' ';
                });
            }
        }
        return displayString.trim();
    }
    addItem(item) {
        if (!this.containsItem(item)) {
            this.model = this.model || [];
            this.model.push(item);
        }
    }
    removeItem(item) {
        if (this.model === null || this.model === undefined) {
            return;
        }
        const index = this.model.indexOf(item);
        if (index > -1) {
            this.model.splice(index, 1);
        }
        // we intentionally set the model to null for form validation
        if (this.model.length === 0) {
            this.model = null;
        }
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class SingleSelectComboboxModel {
    containsItem(item) {
        return this.model === item;
    }
    select(item) {
        this.model = item;
    }
    unselect(item) {
        if (this.containsItem(item)) {
            this.model = null;
        }
    }
    isEmpty() {
        return !this.model;
    }
    pop() {
        const item = this.model;
        this.model = null;
        return item;
    }
    toString(displayField) {
        if (!this.model) {
            return '';
        }
        if (displayField && this.model[displayField]) {
            return this.model[displayField];
        }
        else {
            return this.model.toString();
        }
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrOptionSelected {
    constructor(template) {
        this.template = template;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrOptionSelected, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrOptionSelected, isStandalone: false, selector: "[clrOptionSelected]", inputs: { selected: ["clrOptionSelected", "selected"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrOptionSelected, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrOptionSelected]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }], propDecorators: { selected: [{
                type: Input,
                args: ['clrOptionSelected']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class PseudoFocusModel extends SingleSelectComboboxModel {
    constructor() {
        super(...arguments);
        this._focusChanged = new BehaviorSubject(null);
    }
    get focusChanged() {
        return this._focusChanged.asObservable();
    }
    select(item) {
        if (this.model !== item) {
            this.model = item;
            this._focusChanged.next(item);
        }
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class OptionSelectionService {
    constructor() {
        this.loading = false;
        this.editable = false;
        this.filtering = true;
        // Display all options on first open, even if filter text exists.
        // https://github.com/vmware-clarity/ng-clarity/issues/386
        this.showAllOptions = true;
        this._currentInput = '';
        this._inputChanged = new BehaviorSubject('');
        this._selectionChanged = new ReplaySubject(1);
        this.inputChanged = this._inputChanged.asObservable();
    }
    get displayField() {
        return this._displayField;
    }
    set displayField(value) {
        this._displayField = value;
        if (this.selectionModel) {
            this.selectionModel.displayField = value;
        }
    }
    get currentInput() {
        return this._currentInput;
    }
    set currentInput(input) {
        // clear value in single selection model when input is empty
        if (input === '' && !this.multiselectable) {
            this.setSelectionValue(null);
        }
        this._currentInput = input;
        this._inputChanged.next(input);
    }
    // This observable is for notifying the ClrOption to update its
    // selection by comparing the value
    get selectionChanged() {
        return this._selectionChanged.asObservable();
    }
    get multiselectable() {
        return this.selectionModel instanceof MultiSelectComboboxModel;
    }
    select(item) {
        if (item === null || item === undefined || this.selectionModel.containsItem(item)) {
            return;
        }
        this.selectionModel.select(item);
        this._selectionChanged.next(this.selectionModel);
    }
    toggle(item) {
        if (item === null || item === undefined) {
            return;
        }
        if (this.selectionModel.containsItem(item)) {
            this.selectionModel.unselect(item);
        }
        else {
            this.selectionModel.select(item);
        }
        this._selectionChanged.next(this.selectionModel);
    }
    unselect(item) {
        if (item === null || item === undefined || !this.selectionModel.containsItem(item)) {
            return;
        }
        this.selectionModel.unselect(item);
        this._selectionChanged.next(this.selectionModel);
    }
    // TODO: Add support for trackBy and compareFn
    setSelectionValue(value) {
        // NOTE: Currently we assume that no 2 options will have the same value
        // but Eudes and I discussed that this is a possibility but we will handle
        // this later
        // if selection is undefined, or its value hasn't changed, or changing from null <-> undefined, that's not really changing so we return
        if (!this.selectionModel || this.selectionModel.model === value || (!this.selectionModel.model && !value)) {
            return;
        }
        this.selectionModel.model = value;
        this._selectionChanged.next(this.selectionModel);
    }
    parseStringToModel(value) {
        if (this.displayField) {
            return {
                [this.displayField]: value,
            };
        }
        return value;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: OptionSelectionService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: OptionSelectionService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: OptionSelectionService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ComboboxFocusHandler {
    constructor(rendererFactory, popoverService, selectionService, platformId) {
        this.popoverService = popoverService;
        this.selectionService = selectionService;
        this.platformId = platformId;
        this.pseudoFocus = new PseudoFocusModel();
        this.optionData = [];
        this.handleFocusSubscription();
        // Direct renderer injection can be problematic and leads to failing tests at least
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    get trigger() {
        return this._trigger;
    }
    set trigger(el) {
        this._trigger = el;
        this.addFocusOnBlurListener(el);
    }
    get listbox() {
        return this._listbox;
    }
    set listbox(el) {
        this._listbox = el;
        this.addFocusOnBlurListener(el);
    }
    get textInput() {
        return this._textInput;
    }
    set textInput(el) {
        this._textInput = el;
        this.renderer.listen(el, 'keydown', event => !this.handleTextInput(event));
        this.addFocusOnBlurListener(el);
    }
    focusInput() {
        if (this.textInput && isPlatformBrowser(this.platformId)) {
            this.textInput.focus({ preventScroll: true });
        }
    }
    focusFirstActive() {
        if (this.optionData.length > 0) {
            if (this.selectionService.selectionModel.isEmpty()) {
                this.pseudoFocus.select(this.optionData[0]);
            }
            else {
                let firstActive;
                if (this.selectionService.multiselectable) {
                    firstActive = this.selectionService.selectionModel.model[0];
                }
                else {
                    firstActive = this.selectionService.selectionModel.model;
                }
                const activeProxy = this.optionData.find(option => option.value === firstActive);
                if (activeProxy) {
                    // active element is visible
                    this.pseudoFocus.select(activeProxy);
                }
                else {
                    // we have active element, but it's filtered out
                    this.pseudoFocus.select(this.optionData[0]);
                }
                this.scrollIntoSelectedModel('auto');
            }
        }
    }
    addOptionValues(options) {
        this.optionData = options;
    }
    handleFocusSubscription() {
        this.popoverService.openChange.subscribe(open => {
            if (!open) {
                this.pseudoFocus.model = null;
            }
        });
    }
    moveFocusTo(direction) {
        let index = this.optionData.findIndex(option => option.equals(this.pseudoFocus.model));
        if (direction === ArrowKeyDirection.UP) {
            if (index === -1 || index === 0) {
                index = this.optionData.length - 1;
            }
            else {
                index--;
            }
        }
        else if (direction === ArrowKeyDirection.DOWN) {
            if (index === -1 || index === this.optionData.length - 1) {
                index = 0;
            }
            else {
                index++;
            }
        }
        this.pseudoFocus.select(this.optionData[index]);
        this.scrollIntoSelectedModel();
    }
    openAndMoveTo(direction) {
        if (!this.popoverService.open) {
            this.popoverService.openChange.pipe(take(1)).subscribe(open => {
                if (open) {
                    this.moveFocusTo(direction);
                }
            });
            this.popoverService.open = true;
        }
        else {
            this.moveFocusTo(direction);
        }
    }
    // this service is only interested in keys that may move the focus
    handleTextInput(event) {
        let preventDefault = false;
        const key = normalizeKey(event.key);
        if (event) {
            switch (key) {
                case Keys.Enter:
                    if (this.popoverService.open && this.pseudoFocus.model) {
                        if (this.selectionService.multiselectable) {
                            this.selectionService.toggle(this.pseudoFocus.model.value);
                        }
                        else {
                            this.selectionService.select(this.pseudoFocus.model.value);
                        }
                        preventDefault = true;
                    }
                    break;
                case Keys.Space:
                    if (!this.popoverService.open) {
                        this.popoverService.open = true;
                        preventDefault = true;
                    }
                    break;
                case Keys.ArrowUp:
                    this.preventViewportScrolling(event);
                    this.openAndMoveTo(ArrowKeyDirection.UP);
                    preventDefault = true;
                    break;
                case Keys.ArrowDown:
                    this.preventViewportScrolling(event);
                    this.openAndMoveTo(ArrowKeyDirection.DOWN);
                    preventDefault = true;
                    break;
                default:
                    // Any other keypress
                    if (event.key !== Keys.Tab &&
                        !(this.selectionService.multiselectable && event.key === Keys.Backspace) &&
                        !(event.key === Keys.Escape) &&
                        !this.popoverService.open) {
                        this.popoverService.open = true;
                    }
                    break;
            }
        }
        return preventDefault;
    }
    scrollIntoSelectedModel(behavior = 'smooth') {
        if (this.pseudoFocus.model && this.pseudoFocus.model.el) {
            this.pseudoFocus.model.el.scrollIntoView({ behavior, block: 'center', inline: 'nearest' });
        }
    }
    preventViewportScrolling(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }
    addFocusOnBlurListener(el) {
        if (isPlatformBrowser(this.platformId)) {
            this.renderer.listen(el, 'blur', event => {
                if (this.focusOutOfComponent(event)) {
                    this.popoverService.open = false;
                    // Workaround for popover close-on-outside-click timing issues in Edge browser
                    if (this.componentCdRef) {
                        this.componentCdRef.detectChanges();
                    }
                }
            });
        }
    }
    focusOutOfComponent(event) {
        // event.relatedTarget is null in IE11. In that case we use document.activeElement
        // which points to the element that becomes active as the blur event occurs on the input.
        const target = (event.relatedTarget || document.activeElement);
        return !(this.textInput.contains(target) || this.trigger.contains(target) || this.listbox.contains(target));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ComboboxFocusHandler, deps: [{ token: i0.RendererFactory2 }, { token: i1$3.ClrPopoverService }, { token: OptionSelectionService }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ComboboxFocusHandler }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ComboboxFocusHandler, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.RendererFactory2 }, { type: i1$3.ClrPopoverService }, { type: OptionSelectionService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });
const COMBOBOX_FOCUS_HANDLER_PROVIDER = customFocusableItemProvider(ComboboxFocusHandler);
class OptionData {
    constructor(id, value) {
        this.id = id;
        this.value = value;
    }
    equals(other) {
        if (!other) {
            return false;
        }
        return this.id === other.id && this.value === other.value;
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrOption {
    constructor(elRef, commonStrings, focusHandler, optionSelectionService) {
        this.elRef = elRef;
        this.commonStrings = commonStrings;
        this.focusHandler = focusHandler;
        this.optionSelectionService = optionSelectionService;
        // A proxy with only the necessary data to be used for a11y and the focus handler service.
        this.optionProxy = new OptionData(null, null);
        this.optionProxy.el = elRef.nativeElement;
    }
    get optionId() {
        return this._id;
    }
    set optionId(id) {
        this._id = id;
        this.optionProxy.id = this._id;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.optionProxy.value = value;
    }
    get selected() {
        return (this.optionSelectionService.selectionModel && this.optionSelectionService.selectionModel.containsItem(this.value));
    }
    get focusClass() {
        return this.focusHandler.pseudoFocus.containsItem(this.optionProxy);
    }
    ngOnInit() {
        if (!this._id) {
            this._id = 'clr-option-' + uniqueIdFactory();
            this.optionProxy.id = this._id;
        }
    }
    onClick(event) {
        event.stopPropagation();
        if (this.optionSelectionService.multiselectable) {
            this.optionSelectionService.toggle(this.value);
        }
        else {
            this.optionSelectionService.select(this.value);
        }
        // As the popover stays open in multi-select mode now, we have to take focus back to the input
        // This way we achieve two things:
        // - do not lose focus
        // - we're still able to use onBlur for "outside-click" handling
        this.focusHandler.focusInput();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrOption, deps: [{ token: i0.ElementRef }, { token: i2$1.ClrCommonStringsService }, { token: ComboboxFocusHandler }, { token: OptionSelectionService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrOption, isStandalone: false, selector: "clr-option", inputs: { optionId: ["id", "optionId"], value: ["clrValue", "value"] }, host: { listeners: { "click": "onClick($event)" }, properties: { "class.clr-combobox-option": "true", "attr.role": "\"option\"", "attr.tabindex": "-1", "attr.id": "optionId", "class.active": "this.selected", "class.clr-focus": "this.focusClass" } }, ngImport: i0, template: `
    <ng-content></ng-content>
    @if (selected) {
      <span class="clr-sr-only">{{ commonStrings.keys.comboboxSelected }}</span>
    }
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrOption, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-option',
                    template: `
    <ng-content></ng-content>
    @if (selected) {
      <span class="clr-sr-only">{{ commonStrings.keys.comboboxSelected }}</span>
    }
  `,
                    host: {
                        '[class.clr-combobox-option]': 'true',
                        '[attr.role]': '"option"',
                        // Do not remove. Or click-selection will not work.
                        '[attr.tabindex]': '-1',
                        '[attr.id]': 'optionId',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i2$1.ClrCommonStringsService }, { type: ComboboxFocusHandler }, { type: OptionSelectionService }], propDecorators: { optionId: [{
                type: Input,
                args: ['id']
            }], value: [{
                type: Input,
                args: ['clrValue']
            }], selected: [{
                type: HostBinding,
                args: ['class.active']
            }], focusClass: [{
                type: HostBinding,
                args: ['class.clr-focus']
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let nbOptionsComponents = 0;
class ClrOptions {
    constructor(optionSelectionService, id, el, commonStrings, focusHandler, popoverService, parentHost, document) {
        this.optionSelectionService = optionSelectionService;
        this.id = id;
        this.el = el;
        this.commonStrings = commonStrings;
        this.focusHandler = focusHandler;
        this.popoverService = popoverService;
        this.document = document;
        this.loading = false;
        this.subscriptions = [];
        if (!parentHost) {
            throw new Error('clr-options should only be used inside of a clr-combobox');
        }
        if (!this.optionsId) {
            this.optionsId = 'clr-options-' + nbOptionsComponents++;
        }
    }
    get items() {
        return this._items;
    }
    set items(items) {
        this._items = items;
        this.focusHandler.addOptionValues(this._items.map(option => option.optionProxy));
    }
    /**
     * Tests if the list of options is empty, meaning it doesn't contain any items
     */
    get emptyOptions() {
        return !this.optionSelectionService.loading && this.items.length === 0;
    }
    get editable() {
        return this.optionSelectionService.editable;
    }
    get noResultsElementId() {
        return `${this.optionsId}-no-results`;
    }
    ngAfterViewInit() {
        this.focusHandler.listbox = this.el.nativeElement;
        this.subscriptions.push(this.items.changes.subscribe(items => {
            if (items.length) {
                setTimeout(() => {
                    this.focusHandler.focusFirstActive();
                });
            }
            else {
                this.focusHandler.pseudoFocus.pop();
            }
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    searchText(input) {
        return this.commonStrings.parse(this.commonStrings.keys.comboboxSearching, { INPUT: input });
    }
    loadingStateChange(state) {
        this.loading = state === ClrLoadingState.LOADING;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrOptions, deps: [{ token: OptionSelectionService }, { token: IF_ACTIVE_ID }, { token: i0.ElementRef }, { token: i2$1.ClrCommonStringsService }, { token: ComboboxFocusHandler }, { token: i1$3.ClrPopoverService }, { token: POPOVER_HOST_ANCHOR, optional: true }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrOptions, isStandalone: false, selector: "clr-options", inputs: { optionsId: ["id", "optionsId"] }, host: { properties: { "class.clr-combobox-options": "true", "class.clr-combobox-options-hidden": "emptyOptions && editable", "attr.role": "\"listbox\"", "id": "optionsId" } }, providers: [{ provide: LoadingListener, useExisting: ClrOptions }], queries: [{ propertyName: "items", predicate: ClrOption, descendants: true }], ngImport: i0, template: `
    @if (optionSelectionService.loading) {
      <div class="clr-combobox-options-loading">
        <clr-spinner clrInline>
          {{ commonStrings.keys.loading }}
        </clr-spinner>
        <span class="clr-combobox-options-text">
          {{ searchText(optionSelectionService.currentInput) }}
        </span>
      </div>
    }

    <!-- Rendered if data set is empty -->
    @if (emptyOptions) {
      <div [id]="noResultsElementId" role="option">
        <span class="clr-combobox-options-empty-text">
          {{ commonStrings.keys.comboboxNoResults }}
        </span>
      </div>
    }

    <!--Option Groups and Options will be projected here-->
    <ng-content></ng-content>
  `, isInline: true, dependencies: [{ kind: "component", type: i5.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrOptions, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-options',
                    template: `
    @if (optionSelectionService.loading) {
      <div class="clr-combobox-options-loading">
        <clr-spinner clrInline>
          {{ commonStrings.keys.loading }}
        </clr-spinner>
        <span class="clr-combobox-options-text">
          {{ searchText(optionSelectionService.currentInput) }}
        </span>
      </div>
    }

    <!-- Rendered if data set is empty -->
    @if (emptyOptions) {
      <div [id]="noResultsElementId" role="option">
        <span class="clr-combobox-options-empty-text">
          {{ commonStrings.keys.comboboxNoResults }}
        </span>
      </div>
    }

    <!--Option Groups and Options will be projected here-->
    <ng-content></ng-content>
  `,
                    providers: [{ provide: LoadingListener, useExisting: ClrOptions }],
                    host: {
                        '[class.clr-combobox-options]': 'true',
                        '[class.clr-combobox-options-hidden]': 'emptyOptions && editable',
                        '[attr.role]': '"listbox"',
                        '[id]': 'optionsId',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: OptionSelectionService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: i0.ElementRef }, { type: i2$1.ClrCommonStringsService }, { type: ComboboxFocusHandler }, { type: i1$3.ClrPopoverService }, { type: i0.ElementRef, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [POPOVER_HOST_ANCHOR]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }], propDecorators: { optionsId: [{
                type: Input,
                args: ['id']
            }], items: [{
                type: ContentChildren,
                args: [ClrOption, { descendants: true }]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCombobox extends WrappedFormControl$1 {
    constructor(vcr, injector, control, renderer, el, optionSelectionService, commonStrings, popoverService, containerService, platformId, focusHandler, cdr) {
        super(vcr, ClrComboboxContainer, injector, control, renderer, el);
        this.control = control;
        this.renderer = renderer;
        this.el = el;
        this.optionSelectionService = optionSelectionService;
        this.commonStrings = commonStrings;
        this.popoverService = popoverService;
        this.containerService = containerService;
        this.platformId = platformId;
        this.focusHandler = focusHandler;
        this.cdr = cdr;
        this.placeholder = '';
        this.clrInputChange = new EventEmitter(false);
        this.clrOpenChange = this.popoverService.openChange;
        /**
         * This output should be used to set up a live region using aria-live and populate it with updates that reflect each combobox change.
         */
        this.clrSelectionChange = this.optionSelectionService.selectionChanged;
        this.focused = false;
        this.popoverPosition = ClrPopoverPosition.BOTTOM_LEFT;
        this.index = 1;
        this.popoverType = ClrPopoverType.DROPDOWN;
        this._searchText = '';
        if (control) {
            control.valueAccessor = this;
        }
        // default to SingleSelectComboboxModel, in case the optional input [ClrMulti] isn't used
        optionSelectionService.selectionModel = new SingleSelectComboboxModel();
        this.updateControlValue();
    }
    get editable() {
        return this.optionSelectionService.editable;
    }
    set editable(value) {
        this.optionSelectionService.editable = value;
    }
    get multiSelect() {
        return this.optionSelectionService.multiselectable;
    }
    set multiSelect(value) {
        if (value) {
            this.optionSelectionService.selectionModel = new MultiSelectComboboxModel();
        }
        else {
            // in theory, setting this again should not cause errors even though we already set it in constructor,
            // since the initial call to writeValue (caused by [ngModel] input) should happen after this
            this.optionSelectionService.selectionModel = new SingleSelectComboboxModel();
        }
        this.updateControlValue();
    }
    // Override the id of WrappedFormControl, as we want to move it to the embedded input.
    // Otherwise, the label/component connection does not work and screen readers do not read the label.
    get id() {
        return this.controlIdService.id + '-combobox';
    }
    set id(id) {
        super.id = id;
    }
    get searchText() {
        return this._searchText;
    }
    set searchText(text) {
        // if input text has changed since last time, fire a change event so application can react to it
        if (text !== this._searchText) {
            if (this.popoverService.open) {
                this.optionSelectionService.showAllOptions = false;
            }
            this._searchText = text;
            this.clrInputChange.emit(this.searchText);
        }
        // We need to trigger this even if unchanged, so the option-items directive will update its list
        // based on the "showAllOptions" variable which may have changed in the openChange subscription below.
        // The option-items directive does not listen to openChange, but it listens to currentInput changes.
        this.optionSelectionService.currentInput = this.searchText;
    }
    get openState() {
        return this.popoverService.open;
    }
    get multiSelectModel() {
        if (!this.multiSelect) {
            throw Error('multiSelectModel is not available in single selection context');
        }
        return this.optionSelectionService.selectionModel.model;
    }
    get ariaControls() {
        return this.options?.optionsId;
    }
    get ariaOwns() {
        return this.options?.optionsId;
    }
    get ariaDescribedBySelection() {
        return 'selection-' + this.id;
    }
    get displayField() {
        return this.optionSelectionService.displayField;
    }
    get disabled() {
        return this.control?.disabled;
    }
    ngAfterContentInit() {
        this.initializeSubscriptions();
        // Initialize with preselected value
        if (!this.optionSelectionService.selectionModel.isEmpty()) {
            this.updateInputValue(this.optionSelectionService.selectionModel);
        }
    }
    ngAfterViewInit() {
        this.focusHandler.componentCdRef = this.cdr;
        this.focusHandler.textInput = this.textbox.nativeElement;
        this.focusHandler.trigger = this.trigger.nativeElement;
        // The text input is the actual element we are wrapping
        // This assignment is needed by the wrapper, so it can set
        // the aria properties on the input element, not on the component.
        this.el = this.textbox;
    }
    onKeyUp(event) {
        // if BACKSPACE in multiselect mode, delete the last pill if text is empty
        if (this.multiSelect) {
            const multiModel = this.optionSelectionService.selectionModel.model;
            switch (event.key) {
                case Keys.Backspace:
                    if (!this._searchText.length) {
                        if (multiModel && multiModel.length > 0) {
                            const lastItem = multiModel[multiModel.length - 1];
                            this.control?.control.markAsTouched();
                            this.optionSelectionService.unselect(lastItem);
                        }
                    }
                    break;
                case Keys.Enter:
                    if (this.editable && this._searchText.length > 0 && this.options.emptyOptions) {
                        const parsedInput = this.optionSelectionService.parseStringToModel(this._searchText);
                        this.control?.control.markAsTouched();
                        this.optionSelectionService.select(parsedInput);
                        this.searchText = '';
                    }
                    break;
            }
        }
    }
    inputId() {
        return this.controlIdService.id;
    }
    loadingStateChange(state) {
        this.optionSelectionService.loading = state === ClrLoadingState.LOADING;
        if (state !== ClrLoadingState.LOADING && isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                this.popoverService?.resetPositions();
            });
            this.focusFirstActive();
        }
    }
    unselect(item) {
        if (!this.disabled) {
            this.optionSelectionService.unselect(item);
        }
    }
    onBlur(event) {
        if (!event.relatedTarget || !this.options.el?.nativeElement.contains(event.relatedTarget)) {
            this.onTouchedCallback?.();
            this.triggerValidation();
            this.focused = false;
        }
    }
    onFocus() {
        this.focused = true;
        // fix for "expression changed" error when focus is returned to a combobox after a modal is closed
        // https://github.com/vmware-clarity/ng-clarity/issues/663
        this.cdr.detectChanges();
    }
    onChange() {
        if (this.editable && !this.multiSelect && this.options.emptyOptions) {
            const parsedInput = this.optionSelectionService.parseStringToModel(this._searchText);
            this.optionSelectionService.setSelectionValue(parsedInput);
        }
    }
    getSelectionAriaLabel() {
        if (this.containerService && this.containerService.labelText) {
            return `${this.containerService.labelText} ${this.commonStrings.keys.comboboxSelection}`;
        }
        return this.commonStrings.keys.comboboxSelection;
    }
    focusFirstActive() {
        setTimeout(() => {
            this.focusHandler.focusFirstActive();
        });
    }
    writeValue(value) {
        this.optionSelectionService.selectionModel.model = value;
        this.updateInputValue(this.optionSelectionService.selectionModel);
    }
    registerOnTouched(onTouched) {
        this.onTouchedCallback = onTouched;
    }
    registerOnChange(onChange) {
        this.onChangeCallback = onChange;
    }
    getActiveDescendant() {
        const model = this.focusHandler.pseudoFocus.model;
        return model ? model.id : this.options?.noResultsElementId;
    }
    setDisabledState() {
        // do nothing
    }
    onWrapperClick(event) {
        if (this.disabled) {
            return;
        }
        this.focusHandler.focusInput();
        if (this.editable || (!this.editable && this.trigger.nativeElement.contains(event.target))) {
            this.popoverService.toggleWithEvent(event);
        }
    }
    initializeSubscriptions() {
        this.subscriptions.push(this.optionSelectionService.selectionChanged.subscribe((newSelection) => {
            this.updateInputValue(newSelection);
            if (!this.multiSelect && newSelection && !newSelection.isEmpty()) {
                this.popoverService.open = false;
            }
            this.updateControlValue();
            if (this.multiSelect) {
                setTimeout(() => {
                    this.popoverService?.updatePosition();
                });
            }
        }));
        this.subscriptions.push(this.popoverService.openChange.subscribe(open => {
            if (this.editable && !this.multiSelect) {
                if (this.searchText) {
                    this.optionSelectionService.showAllOptions = false;
                    this.optionSelectionService.currentInput = this.searchText;
                }
                return;
            }
            if (open) {
                this.focusFirstActive();
            }
            else {
                this.optionSelectionService.showAllOptions = true;
            }
            if (this.multiSelect) {
                this.searchText = '';
            }
            else {
                this.searchText = this.getDisplayNames(this.optionSelectionService.selectionModel.model)[0] || '';
            }
        }));
    }
    updateInputValue(model) {
        if (!this.multiSelect) {
            this.searchText = model.model ? this.getDisplayNames(model.model)[0] : '';
            if (this.searchText) {
                this.optionSelectionService.currentInput = this.searchText;
            }
        }
    }
    updateControlValue() {
        if (this.onChangeCallback) {
            this.onChangeCallback(this.optionSelectionService.selectionModel.model);
        }
    }
    getDisplayNames(model) {
        if (this.displayField) {
            if (!Array.isArray(model)) {
                model = [model];
            }
            return model.map(item => (item ? item[this.displayField] : null));
        }
        return [this.optionSelectionService.selectionModel.model];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCombobox, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: OptionSelectionService }, { token: i2$1.ClrCommonStringsService }, { token: i1$3.ClrPopoverService }, { token: ComboboxContainerService, optional: true }, { token: PLATFORM_ID }, { token: ComboboxFocusHandler }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrCombobox, isStandalone: false, selector: "clr-combobox", inputs: { placeholder: "placeholder", editable: ["clrEditable", "editable"], multiSelect: ["clrMulti", "multiSelect"] }, outputs: { clrInputChange: "clrInputChange", clrOpenChange: "clrOpenChange", clrSelectionChange: "clrSelectionChange" }, host: { listeners: { "keydown": "onKeyUp($event)" }, properties: { "class.aria-required": "true", "class.clr-combobox": "true", "class.clr-combobox-disabled": "control?.disabled" } }, providers: [
            OptionSelectionService,
            { provide: LoadingListener, useExisting: ClrCombobox },
            IF_ACTIVE_ID_PROVIDER,
            FOCUS_SERVICE_PROVIDER,
            COMBOBOX_FOCUS_HANDLER_PROVIDER,
        ], queries: [{ propertyName: "optionSelected", first: true, predicate: ClrOptionSelected, descendants: true }, { propertyName: "options", first: true, predicate: ClrOptions, descendants: true }], viewQueries: [{ propertyName: "textbox", first: true, predicate: ["textboxInput"], descendants: true }, { propertyName: "trigger", first: true, predicate: ["trigger"], descendants: true }], usesInheritance: true, hostDirectives: [{ directive: i1$3.ClrPopoverHostDirective }], ngImport: i0, template: "<!--\n~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n~ This software is released under MIT license.\n~ The full license information can be found in LICENSE in the root directory of this project.\n-->\n\n<!-- The (click) handler is needed to auto-focus on input field which can not currently occupy the whole\nwidth of the component, after being wrapped to a new line -->\n<div\n  class=\"clr-combobox-wrapper\"\n  clrPopoverAnchor\n  (click)=\"onWrapperClick($event)\"\n  [class.multi]=\"multiSelect\"\n  [class.invalid]=\"(control?.control.touched && control?.invalid)\"\n  [class.disabled]=\"control?.disabled\"\n>\n  @if (multiSelect && optionSelectionService.selectionModel.model && multiSelectModel.length > 0) {\n  <span\n    role=\"grid\"\n    clrRovingTabindex\n    [clrRovingTabindexDisabled]=\"control?.disabled\"\n    clrDirection=\"both\"\n    [attr.aria-label]=\"getSelectionAriaLabel()\"\n    [attr.aria-disabled]=\"control?.disabled? true: null\"\n    class=\"clr-combobox-pills\"\n  >\n    @for (item of multiSelectModel; track item; let i = $index) {\n    <span class=\"label label-combobox-pill\" role=\"row\">\n      <span role=\"gridcell\">\n        <span class=\"clr-combobox-pill-content\" clrKeyFocusItem>\n          @if (optionSelected) {\n          <ng-container\n            [ngTemplateOutlet]=\"optionSelected.template\"\n            [ngTemplateOutletContext]=\"{$implicit: optionSelectionService.selectionModel.model[i]}\"\n          ></ng-container>\n          }\n        </span>\n      </span>\n      <span role=\"gridcell\">\n        <button\n          clrKeyFocusItem\n          type=\"button\"\n          class=\"clr-combobox-remove-btn\"\n          [disabled]=\"control?.disabled? true: null\"\n          [attr.aria-label]=\"commonStrings.keys.comboboxDelete + ' ' + optionSelectionService.selectionModel.toString(displayField, i)\"\n          (click)=\"unselect(item)\"\n        >\n          <cds-icon shape=\"window-close\" size=\"12\"></cds-icon>\n        </button>\n      </span>\n    </span>\n    }\n  </span>\n  }\n\n  <input\n    #textboxInput\n    type=\"text\"\n    role=\"combobox\"\n    [id]=\"inputId()\"\n    class=\"clr-input clr-combobox-input\"\n    [(ngModel)]=\"searchText\"\n    (blur)=\"onBlur($event)\"\n    (focus)=\"onFocus()\"\n    (change)=\"onChange()\"\n    [attr.aria-expanded]=\"openState\"\n    [attr.aria-owns]=\"ariaOwns\"\n    aria-haspopup=\"listbox\"\n    aria-autocomplete=\"list\"\n    autocomplete=\"off\"\n    [attr.aria-invalid]=\"control?.invalid? true: null\"\n    [disabled]=\"control?.disabled? true: null\"\n    [attr.aria-activedescendant]=\"getActiveDescendant()\"\n    [attr.placeholder]=\"placeholder\"\n  />\n\n  <!-- No click handler, as it uses the handler on the .clr-combobox-wrapper -->\n  <button\n    #trigger\n    type=\"button\"\n    class=\"clr-combobox-trigger\"\n    tabindex=\"-1\"\n    [disabled]=\"control?.disabled || null\"\n    [attr.aria-label]=\"commonStrings.keys.comboboxOpen\"\n  >\n    <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n  </button>\n\n  <div class=\"clr-focus-indicator\" [class.clr-focus]=\"focused\"></div>\n</div>\n\n<!-- Both close handlers are handled manually due to issues in Edge browser.\nAdditionally 'outsideClickToClose' has complex handling that's necessary\nto be manual due to the component architecture -->\n<div role=\"dialog\" *clrPopoverContent=\"openState; at popoverPosition; type: popoverType;\">\n  <ng-content></ng-content>\n</div>\n", dependencies: [{ kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1$1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: i2$1.ClrRovingTabindex, selector: "[clrRovingTabindex]", inputs: ["clrRovingTabindex", "clrRovingTabindexDisabled"] }, { kind: "directive", type: i2$1.ClrKeyFocusItem, selector: "[clrKeyFocusItem]" }, { kind: "directive", type: i1$3.ClrPopoverAnchor, selector: "[clrPopoverAnchor]" }, { kind: "directive", type: i1$3.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentAvailablePositions", "clrPopoverContentType", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCombobox, decorators: [{
            type: Component,
            args: [{ selector: 'clr-combobox', providers: [
                        OptionSelectionService,
                        { provide: LoadingListener, useExisting: ClrCombobox },
                        IF_ACTIVE_ID_PROVIDER,
                        FOCUS_SERVICE_PROVIDER,
                        COMBOBOX_FOCUS_HANDLER_PROVIDER,
                    ], hostDirectives: [ClrPopoverHostDirective], host: {
                        '[class.aria-required]': 'true',
                        '[class.clr-combobox]': 'true',
                        '[class.clr-combobox-disabled]': 'control?.disabled',
                    }, standalone: false, template: "<!--\n~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n~ This software is released under MIT license.\n~ The full license information can be found in LICENSE in the root directory of this project.\n-->\n\n<!-- The (click) handler is needed to auto-focus on input field which can not currently occupy the whole\nwidth of the component, after being wrapped to a new line -->\n<div\n  class=\"clr-combobox-wrapper\"\n  clrPopoverAnchor\n  (click)=\"onWrapperClick($event)\"\n  [class.multi]=\"multiSelect\"\n  [class.invalid]=\"(control?.control.touched && control?.invalid)\"\n  [class.disabled]=\"control?.disabled\"\n>\n  @if (multiSelect && optionSelectionService.selectionModel.model && multiSelectModel.length > 0) {\n  <span\n    role=\"grid\"\n    clrRovingTabindex\n    [clrRovingTabindexDisabled]=\"control?.disabled\"\n    clrDirection=\"both\"\n    [attr.aria-label]=\"getSelectionAriaLabel()\"\n    [attr.aria-disabled]=\"control?.disabled? true: null\"\n    class=\"clr-combobox-pills\"\n  >\n    @for (item of multiSelectModel; track item; let i = $index) {\n    <span class=\"label label-combobox-pill\" role=\"row\">\n      <span role=\"gridcell\">\n        <span class=\"clr-combobox-pill-content\" clrKeyFocusItem>\n          @if (optionSelected) {\n          <ng-container\n            [ngTemplateOutlet]=\"optionSelected.template\"\n            [ngTemplateOutletContext]=\"{$implicit: optionSelectionService.selectionModel.model[i]}\"\n          ></ng-container>\n          }\n        </span>\n      </span>\n      <span role=\"gridcell\">\n        <button\n          clrKeyFocusItem\n          type=\"button\"\n          class=\"clr-combobox-remove-btn\"\n          [disabled]=\"control?.disabled? true: null\"\n          [attr.aria-label]=\"commonStrings.keys.comboboxDelete + ' ' + optionSelectionService.selectionModel.toString(displayField, i)\"\n          (click)=\"unselect(item)\"\n        >\n          <cds-icon shape=\"window-close\" size=\"12\"></cds-icon>\n        </button>\n      </span>\n    </span>\n    }\n  </span>\n  }\n\n  <input\n    #textboxInput\n    type=\"text\"\n    role=\"combobox\"\n    [id]=\"inputId()\"\n    class=\"clr-input clr-combobox-input\"\n    [(ngModel)]=\"searchText\"\n    (blur)=\"onBlur($event)\"\n    (focus)=\"onFocus()\"\n    (change)=\"onChange()\"\n    [attr.aria-expanded]=\"openState\"\n    [attr.aria-owns]=\"ariaOwns\"\n    aria-haspopup=\"listbox\"\n    aria-autocomplete=\"list\"\n    autocomplete=\"off\"\n    [attr.aria-invalid]=\"control?.invalid? true: null\"\n    [disabled]=\"control?.disabled? true: null\"\n    [attr.aria-activedescendant]=\"getActiveDescendant()\"\n    [attr.placeholder]=\"placeholder\"\n  />\n\n  <!-- No click handler, as it uses the handler on the .clr-combobox-wrapper -->\n  <button\n    #trigger\n    type=\"button\"\n    class=\"clr-combobox-trigger\"\n    tabindex=\"-1\"\n    [disabled]=\"control?.disabled || null\"\n    [attr.aria-label]=\"commonStrings.keys.comboboxOpen\"\n  >\n    <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n  </button>\n\n  <div class=\"clr-focus-indicator\" [class.clr-focus]=\"focused\"></div>\n</div>\n\n<!-- Both close handlers are handled manually due to issues in Edge browser.\nAdditionally 'outsideClickToClose' has complex handling that's necessary\nto be manual due to the component architecture -->\n<div role=\"dialog\" *clrPopoverContent=\"openState; at popoverPosition; type: popoverType;\">\n  <ng-content></ng-content>\n</div>\n" }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1$1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: OptionSelectionService }, { type: i2$1.ClrCommonStringsService }, { type: i1$3.ClrPopoverService }, { type: ComboboxContainerService, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: ComboboxFocusHandler }, { type: i0.ChangeDetectorRef }], propDecorators: { placeholder: [{
                type: Input,
                args: ['placeholder']
            }], clrInputChange: [{
                type: Output,
                args: ['clrInputChange']
            }], clrOpenChange: [{
                type: Output,
                args: ['clrOpenChange']
            }], clrSelectionChange: [{
                type: Output,
                args: ['clrSelectionChange']
            }], textbox: [{
                type: ViewChild,
                args: ['textboxInput']
            }], trigger: [{
                type: ViewChild,
                args: ['trigger']
            }], optionSelected: [{
                type: ContentChild,
                args: [ClrOptionSelected]
            }], options: [{
                type: ContentChild,
                args: [ClrOptions]
            }], editable: [{
                type: Input,
                args: ['clrEditable']
            }], multiSelect: [{
                type: Input,
                args: ['clrMulti']
            }], onKeyUp: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrOptionItems {
    constructor(template, differs, optionService, vcr) {
        this.template = template;
        this.differs = differs;
        this.optionService = optionService;
        this.subscriptions = [];
        this.filter = '';
        this.differ = null;
        this.iterableProxy = new NgForOf(vcr, template, differs);
        this.subscriptions.push(optionService.inputChanged.subscribe(filter => {
            this.filter = filter;
            if (optionService.filtering) {
                this.updateItems();
            }
        }));
    }
    set rawItems(items) {
        this._rawItems = items ? items : [];
        this.updateItems();
    }
    set trackBy(value) {
        this.iterableProxy.ngForTrackBy = value;
    }
    set field(field) {
        this._filterField = field;
        this.optionService.displayField = field;
    }
    get hasResults() {
        // explicity return `undefined` instead of `false` if the answer is not known
        return this.filteredItems ? this.filteredItems.length : undefined;
    }
    ngDoCheck() {
        if (!this.differ) {
            this.differ = this.differs.find(this.filteredItems).create(this.iterableProxy.ngForTrackBy);
        }
        if (this.differ) {
            const changes = this.differ.diff(this.filteredItems);
            if (changes) {
                this.iterableProxy.ngDoCheck();
            }
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    updateItems() {
        if (!this._rawItems || this.filter === undefined || this.filter === null) {
            return;
        }
        const normalizedFilterValue = normalizeValue(this.filter);
        if (this.optionService.showAllOptions) {
            this.filteredItems = this._rawItems;
        }
        else if (this._filterField) {
            this.filteredItems = this._rawItems.filter(item => {
                const objValue = item[this._filterField];
                return objValue ? normalizeValue(objValue).includes(normalizedFilterValue) : false;
            });
        }
        else {
            // Filter by all item object values
            this.filteredItems = this._rawItems.filter(item => {
                if (typeof item !== 'object') {
                    return normalizeValue(item).includes(normalizedFilterValue);
                }
                const objValues = Object.values(item).filter(value => {
                    return value !== null && value !== undefined ? normalizeValue(value).includes(normalizedFilterValue) : false;
                });
                return objValues.length > 0;
            });
        }
        this.iterableProxy.ngForOf = this.filteredItems;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrOptionItems, deps: [{ token: i0.TemplateRef }, { token: i0.IterableDiffers }, { token: OptionSelectionService }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrOptionItems, isStandalone: false, selector: "[clrOptionItems][clrOptionItemsOf]", inputs: { rawItems: ["clrOptionItemsOf", "rawItems"], trackBy: ["clrOptionItemsTrackBy", "trackBy"], field: ["clrOptionItemsField", "field"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrOptionItems, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrOptionItems][clrOptionItemsOf]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }, { type: i0.IterableDiffers }, { type: OptionSelectionService }, { type: i0.ViewContainerRef }], propDecorators: { rawItems: [{
                type: Input,
                args: ['clrOptionItemsOf']
            }], trackBy: [{
                type: Input,
                args: ['clrOptionItemsTrackBy']
            }], field: [{
                type: Input,
                args: ['clrOptionItemsField']
            }] } });
function normalizeValue(value) {
    return value
        .toString()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrOptionGroup {
    constructor() {
        this.labelId = uniqueIdFactory();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrOptionGroup, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrOptionGroup, isStandalone: false, selector: "clr-option-group", inputs: { label: ["clrOptionGroupLabel", "label"] }, host: { properties: { "attr.role": "\"group\"", "attr.aria-labelledby": "labelId", "style.display": "clrOptionItems.hasResults ? undefined : \"none\"" } }, queries: [{ propertyName: "clrOptionItems", first: true, predicate: ClrOptionItems, descendants: true }], ngImport: i0, template: `
    <span [id]="labelId" class="clr-option-group-label" role="presentation">{{ label }}</span>
    <ng-content></ng-content>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrOptionGroup, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-option-group',
                    host: {
                        '[attr.role]': '"group"',
                        '[attr.aria-labelledby]': 'labelId',
                        '[style.display]': 'clrOptionItems.hasResults ? undefined : "none"',
                    },
                    template: `
    <span [id]="labelId" class="clr-option-group-label" role="presentation">{{ label }}</span>
    <ng-content></ng-content>
  `,
                    standalone: false,
                }]
        }], propDecorators: { label: [{
                type: Input,
                args: ['clrOptionGroupLabel']
            }], clrOptionItems: [{
                type: ContentChild,
                args: [ClrOptionItems]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrComboboxModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon, angleIcon, windowCloseIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrComboboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrComboboxModule, declarations: [ClrCombobox,
            ClrComboboxContainer,
            ClrOptions,
            ClrOption,
            ClrOptionGroup,
            ClrOptionSelected,
            ClrOptionItems], imports: [CommonModule,
            FormsModule,
            ClrIcon,
            ClrKeyFocusModule,
            ClrCommonFormsModule$1,
            ClrConditionalModule,
            _lrClrPopoverModuleNext,
            ClrSpinnerModule], exports: [ClrCommonFormsModule$1,
            ClrCombobox,
            ClrComboboxContainer,
            ClrOptions,
            ClrOption,
            ClrOptionGroup,
            ClrOptionSelected,
            ClrConditionalModule,
            ClrOptionItems] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrComboboxModule, imports: [CommonModule,
            FormsModule,
            ClrIcon,
            ClrKeyFocusModule,
            ClrCommonFormsModule$1,
            ClrConditionalModule,
            _lrClrPopoverModuleNext,
            ClrSpinnerModule, ClrCommonFormsModule$1,
            ClrConditionalModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrComboboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ClrIcon,
                        ClrKeyFocusModule,
                        ClrCommonFormsModule$1,
                        ClrConditionalModule,
                        _lrClrPopoverModuleNext,
                        ClrSpinnerModule,
                    ],
                    declarations: [
                        ClrCombobox,
                        ClrComboboxContainer,
                        ClrOptions,
                        ClrOption,
                        ClrOptionGroup,
                        ClrOptionSelected,
                        ClrOptionItems,
                    ],
                    exports: [
                        ClrCommonFormsModule$1,
                        ClrCombobox,
                        ClrComboboxContainer,
                        ClrOptions,
                        ClrOption,
                        ClrOptionGroup,
                        ClrOptionSelected,
                        ClrConditionalModule,
                        ClrOptionItems,
                    ],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

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
class ClrDatalistContainer extends ClrAbstractContainer$1 {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalistContainer, deps: [{ token: i1$2.ControlClassService }, { token: i1$2.LayoutService, optional: true }, { token: i1$2.NgControlService }, { token: i1$2.FormsFocusService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrDatalistContainer, isStandalone: false, selector: "clr-datalist-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [ControlClassService$1, ControlIdService$1, FormsFocusService$1, NgControlService$1, DatalistIdService], usesInheritance: true, ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1$2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
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
                    providers: [ControlClassService$1, ControlIdService$1, FormsFocusService$1, NgControlService$1, DatalistIdService],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$2.ControlClassService }, { type: i1$2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1$2.NgControlService }, { type: i1$2.FormsFocusService }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatalistInput extends WrappedFormControl$1 {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalistInput, deps: [{ token: i1$2.FormsFocusService, optional: true }, { token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: DatalistIdService }], target: i0.ɵɵFactoryTarget.Directive }); }
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
        }], ctorParameters: () => [{ type: i1$2.FormsFocusService, decorators: [{
                    type: Optional
                }] }, { type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1$1.NgControl, decorators: [{
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
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalistModule, declarations: [ClrDatalist, ClrDatalistInput, ClrDatalistContainer], imports: [CommonModule, ClrInputModule$1, ClrIcon], exports: [ClrDatalist, ClrDatalistInput, ClrDatalistContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalistModule, imports: [CommonModule, ClrInputModule$1, ClrIcon] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatalistModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrInputModule$1, ClrIcon],
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

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DateFormControlService {
    constructor() {
        this._touchedChange = new Subject();
        this._dirtyChange = new Subject();
    }
    get touchedChange() {
        return this._touchedChange.asObservable();
    }
    get dirtyChange() {
        return this._dirtyChange.asObservable();
    }
    markAsTouched() {
        this._touchedChange.next();
    }
    markAsDirty() {
        this._dirtyChange.next();
    }
    // friendly wrapper
    setDisabled(state) {
        this.disabled = state;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DateFormControlService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DateFormControlService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DateFormControlService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DayModel {
    constructor(year, month, date) {
        this.year = year;
        this.month = month;
        this.date = date;
    }
    /**
     * Checks if the passed CalendarDate is equal to itself.
     */
    isEqual(day) {
        if (day) {
            return this.year === day.year && this.month === day.month && this.date === day.date;
        }
        return false;
    }
    toDate() {
        return new Date(this.year, this.month, this.date);
    }
    /**
     * Returns a new DayModel which is incremented based on the value passed.
     */
    incrementBy(value) {
        // Creating new Javascript Date object to increment because
        // it will automatically take care of switching to next or previous
        // months & years without we having to worry about it.
        const date = new Date(this.year, this.month, this.date + value);
        return new DayModel(date.getFullYear(), date.getMonth(), date.getDate());
    }
    /**
     * Clones the current day model.
     */
    clone() {
        return new DayModel(this.year, this.month, this.date);
    }
    toComparisonString() {
        return `${this.year}${this.pad(this.month)}${this.pad(this.date)}`;
    }
    toDateString() {
        return this.toDate().toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    }
    /**
     * Compares the dates and returns boolean value based on the value passed
     */
    isBefore(day, dayInclusive = false) {
        return dayInclusive
            ? this.toDate().getTime() <= day?.toDate().getTime()
            : this.toDate().getTime() < day?.toDate().getTime();
    }
    /**
     * Compares the dates and returns boolean value based on the value passed
     */
    isAfter(day, dayInclusive = false) {
        return dayInclusive
            ? this.toDate().getTime() >= day?.toDate().getTime()
            : this.toDate().getTime() > day?.toDate().getTime();
    }
    pad(num) {
        return num < 10 ? `0${num}` : `${num}`;
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This is the en-001 short locale date format. Setting as default.
 */
const DEFAULT_LOCALE_FORMAT = 'dd/MM/y';
// https://en.wikipedia.org/wiki/Date_format_by_country
const LITTLE_ENDIAN_REGEX = /d+.+m+.+y+/i;
const MIDDLE_ENDIAN_REGEX = /m+.+d+.+y+/i;
// No need for BIG_ENDIAN_REGEX because anything that doesn't satisfy the above 2
// is automatically BIG_ENDIAN
const DELIMITER_REGEX = /d+|m+|y+/i;
const USER_INPUT_REGEX = /\d+/g;
const MOBILE_USERAGENT_REGEX = /Mobi/i;
const RTL_REGEX = /\u200f/g;
const YEAR = 'YYYY';
const MONTH = 'MM';
const DATE = 'DD';
const LITTLE_ENDIAN = {
    name: 'LITTLE_ENDIAN',
    format: [DATE, MONTH, YEAR],
};
const MIDDLE_ENDIAN = {
    name: 'MIDDLE_ENDIAN',
    format: [MONTH, DATE, YEAR],
};
const BIG_ENDIAN = {
    name: 'BIG_ENDIAN',
    format: [YEAR, MONTH, DATE],
};
const NO_OF_DAYS_IN_A_WEEK = 7;
const NO_OF_ROWS_IN_CALENDAR_VIEW = 6;
const TOTAL_DAYS_IN_DAYS_VIEW = NO_OF_DAYS_IN_A_WEEK * NO_OF_ROWS_IN_CALENDAR_VIEW;

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Returns the number of days in a month.
 */
function getNumberOfDaysInTheMonth(year, month) {
    // If we go to the next month, but use a day of 0, it returns the last day from the previous month
    return new Date(year, month + 1, 0).getDate();
}
/**
 * Returns the day for the corresponding date where 0 represents Sunday.
 */
function getDay(year, month, date) {
    return new Date(year, month, date).getDay();
}
/**
 * Takes in a year and if it is a 2 digit year, returns the corresponding 4 digit year.
 * Window of 80 years before and 20 years after the present year.
 * Credit: https://github.com/globalizejs/globalize/blob/e1b31cd6a4f1cff75b185b68b7a32220aac5196f/src/date/parse.js
 */
function parseToFourDigitYear(year) {
    if (year > 9999 || (year > 100 && year < 999) || year < 10) {
        return -1;
    }
    if (year > 999) {
        return year;
    }
    const currYear = new Date().getFullYear();
    const century = Math.floor(currYear / 100) * 100;
    let result = year + century;
    if (result > currYear + 20) {
        result = result - 100;
    }
    return result;
}
function datesAreEqual(date1, date2) {
    if (date1 instanceof Date && date2 instanceof Date) {
        return (date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate());
    }
    else {
        return false;
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This service extracts the Angular CLDR data needed by the datepicker.
 */
class LocaleHelperService {
    constructor(locale) {
        this.locale = locale;
        this._firstDayOfWeek = 0;
        this.initializeLocaleData();
    }
    get firstDayOfWeek() {
        return this._firstDayOfWeek;
    }
    get localeDays() {
        return this._localeDays;
    }
    // leave for backward compatibility
    get localeDaysNarrow() {
        return this._localeDays.map(day => day.narrow);
    }
    get localeMonthsAbbreviated() {
        return this._localeMonthsAbbreviated;
    }
    get localeMonthsWide() {
        return this._localeMonthsWide;
    }
    get localeDateFormat() {
        return this._localeDateFormat;
    }
    /**
     * Initializes the locale data.
     */
    initializeLocaleData() {
        // Order in which these functions is called is very important.
        this.initializeFirstDayOfWeek();
        this.initializeLocaleDateFormat();
        this.initializeLocaleMonthsAbbreviated();
        this.initializeLocaleMonthsWide();
        this.initializeLocaleDays();
    }
    /**
     * Initialize day names based on the locale.
     * eg: [{day: Sunday, narrow: S}, {day: Monday, narrow: M}...] for en-US.
     */
    initializeLocaleDays() {
        // Get locale day names starting with Sunday
        const tempArr = [];
        const tempWideArr = getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide).slice();
        const tempNarrowArr = getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Narrow).slice();
        // Get first day of the week based on the locale
        const firstDayOfWeek = this.firstDayOfWeek;
        for (let i = 0; i < 7; i++) {
            tempArr.push({ day: tempWideArr[i], narrow: tempNarrowArr[i] });
        }
        // Rearrange the tempArr to start with the first day of the week based on the locale.
        if (firstDayOfWeek > 0) {
            const prevDays = tempArr.splice(0, firstDayOfWeek);
            tempArr.push(...prevDays);
        }
        this._localeDays = tempArr;
    }
    /**
     * Initializes the array of month names in the TranslationWidth.Abbreviated format.
     * e.g. `[Jan, Feb, ...]` for en-US
     */
    initializeLocaleMonthsAbbreviated() {
        this._localeMonthsAbbreviated = getLocaleMonthNames(this.locale, FormStyle.Standalone, TranslationWidth.Abbreviated).slice();
    }
    /**
     * Initializes the array of month names in the TranslationWidth.Wide format.
     * e.g. `[January, February, ...]` for en-US
     */
    initializeLocaleMonthsWide() {
        this._localeMonthsWide = getLocaleMonthNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide).slice();
    }
    /**
     * Initializes the first day of the week based on the locale.
     */
    initializeFirstDayOfWeek() {
        this._firstDayOfWeek = getLocaleFirstDayOfWeek(this.locale);
    }
    initializeLocaleDateFormat() {
        this._localeDateFormat = getLocaleDateFormat(this.locale, FormatWidth.Short);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: LocaleHelperService, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: LocaleHelperService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: LocaleHelperService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DateIOService {
    constructor(localeHelperService) {
        this.disabledDates = {
            // This is the default range. It approximates the beginning of time to the end of time.
            // Unless a minDate or maxDate is set with the native HTML5 api the range is all dates
            // TODO: turn this into an Array of min/max ranges that allow configuration of multiple ranges.
            minDate: new DayModel(0, 0, 1),
            maxDate: new DayModel(9999, 11, 31),
        };
        this.cldrLocaleDateFormat = DEFAULT_LOCALE_FORMAT;
        this.minDateChange = new Subject();
        this.maxDateChange = new Subject();
        this.localeDisplayFormat = LITTLE_ENDIAN;
        this.delimiters = ['/', '/'];
        this.cldrLocaleDateFormat = localeHelperService.localeDateFormat;
        this.initializeLocaleDisplayFormat();
    }
    get placeholderText() {
        const format = this.localeDisplayFormat.format;
        return format[0] + this.delimiters[0] + format[1] + this.delimiters[1] + format[2];
    }
    setMinDate(date) {
        // NOTE: I'm expecting consumers to pass one of four things here:
        //       A proper date string(2019-11-11), null, undefined or empty string ('')
        if (!date) {
            // attribute binding was removed, reset back to the beginning of time
            this.disabledDates.minDate = new DayModel(0, 0, 1);
        }
        else {
            const [year, month, day] = date.split('-').map(n => parseInt(n, 10));
            this.disabledDates.minDate = new DayModel(year, month - 1, day);
        }
        this.minDateChange.next(this.disabledDates.minDate);
    }
    setMaxDate(date) {
        // NOTE: I'm expecting consumers to pass one of four things here:
        //       A proper date string(2019-11-11), null, undefined or empty string ('')
        if (!date) {
            // attribute binding was removed, reset forward to the end of time
            this.disabledDates.maxDate = new DayModel(9999, 11, 31);
        }
        else {
            const [year, month, day] = date.split('-').map(n => parseInt(n, 10));
            this.disabledDates.maxDate = new DayModel(year, month - 1, day);
        }
        this.maxDateChange.next(this.disabledDates.maxDate);
    }
    setRangeOptions(rangeOptions) {
        const validatedRangeOption = this.validateDateRangeOptions(rangeOptions);
        this.dateRangeOptions = validatedRangeOption || [];
    }
    getRangeOptions() {
        return this.dateRangeOptions;
    }
    toLocaleDisplayFormatString(date) {
        if (date) {
            if (isNaN(date.getTime())) {
                return '';
            }
            const dateNo = date.getDate();
            const monthNo = date.getMonth() + 1;
            const dateStr = dateNo > 9 ? dateNo.toString() : '0' + dateNo;
            const monthStr = monthNo > 9 ? monthNo.toString() : '0' + monthNo;
            if (this.localeDisplayFormat === LITTLE_ENDIAN) {
                return dateStr + this.delimiters[0] + monthStr + this.delimiters[1] + date.getFullYear();
            }
            else if (this.localeDisplayFormat === MIDDLE_ENDIAN) {
                return monthStr + this.delimiters[0] + dateStr + this.delimiters[1] + date.getFullYear();
            }
            else {
                return date.getFullYear() + this.delimiters[0] + monthStr + this.delimiters[1] + dateStr;
            }
        }
        return '';
    }
    getDateValueFromDateString(date) {
        if (!date || typeof date !== 'string') {
            return null;
        }
        const dateParts = date.match(USER_INPUT_REGEX);
        if (!dateParts || dateParts.length !== 3) {
            return null;
        }
        const [firstPart, secondPart, thirdPart] = dateParts;
        if (this.localeDisplayFormat === LITTLE_ENDIAN) {
            // secondPart is month && firstPart is date
            return this.validateAndGetDate(thirdPart, secondPart, firstPart);
        }
        else if (this.localeDisplayFormat === MIDDLE_ENDIAN) {
            // firstPart is month && secondPart is date
            return this.validateAndGetDate(thirdPart, firstPart, secondPart);
        }
        else {
            // secondPart is month && thirdPart is date
            return this.validateAndGetDate(firstPart, secondPart, thirdPart);
        }
    }
    validateDateRangeOptions(rangeOptions) {
        const validOptions = [];
        rangeOptions?.forEach((rangeOption) => {
            if (rangeOption?.value?.length !== 2 ||
                Object.prototype.toString.call(rangeOption?.value[0]) !== '[object Date]' ||
                Object.prototype.toString.call(rangeOption?.value[1]) !== '[object Date]') {
                return;
            }
            validOptions.push(rangeOption);
        });
        return validOptions;
    }
    initializeLocaleDisplayFormat() {
        const format = this.cldrLocaleDateFormat.toLocaleLowerCase();
        if (LITTLE_ENDIAN_REGEX.test(format)) {
            this.localeDisplayFormat = LITTLE_ENDIAN;
        }
        else if (MIDDLE_ENDIAN_REGEX.test(format)) {
            this.localeDisplayFormat = MIDDLE_ENDIAN;
        }
        else {
            // everything else is set to BIG-ENDIAN FORMAT
            this.localeDisplayFormat = BIG_ENDIAN;
        }
        this.extractDelimiters();
    }
    extractDelimiters() {
        if (this.cldrLocaleDateFormat) {
            // Sanitize Date Format. Remove RTL characters.
            // FIXME: When we support RTL, remove this and handle it correctly.
            const localeFormat = this.cldrLocaleDateFormat.replace(RTL_REGEX, '');
            const delimiters = localeFormat.split(DELIMITER_REGEX);
            // NOTE: The split from the CLDR date format should always result
            // in an arary with 4 elements. The 1st and the 2nd values are the delimiters
            // we will use in order.
            // Eg: "dd/MM/y".split(/d+|m+|y+/i) results in ["", "/", "/", ""]
            if (delimiters && delimiters.length === 4) {
                this.delimiters = [delimiters[1], delimiters[2]];
            }
            else {
                console.error('Unexpected date format received. Delimiters extracted: ', delimiters);
            }
        }
    }
    /**
     * Checks if the month entered by the user is valid or not.
     * Note: Month is 0 based.
     */
    isValidMonth(month) {
        return month > -1 && month < 12;
    }
    /**
     * Checks if the date is valid depending on the year and month provided.
     */
    isValidDate(year, month, date) {
        return date > 0 && date <= getNumberOfDaysInTheMonth(year, month);
    }
    /**
     * Validates the parameters provided and returns the date.
     * If the parameters are not
     * valid then return null.
     * NOTE: (Month here is 1 based since the user has provided that as an input)
     */
    validateAndGetDate(year, month, date) {
        // I don't know whats wrong with the TS compiler. It throws an error if I write
        // the below if statement. The error is:
        // Operator '!==' cannot be applied to types '2' and '4'
        // More info here: https://github.com/Microsoft/TypeScript/issues/12794#issuecomment-270342936
        /*
            if (year.length !== 2 || year.length !== 4) {
                return null;
            }
            */
        // Instead I have to write the logic like this x-(
        const y = +year;
        const m = +month - 1; // month is 0 based
        const d = +date;
        if (!this.isValidMonth(m) || !this.isValidDate(y, m, d)) {
            return null;
        }
        const result = parseToFourDigitYear(y);
        return result !== -1 ? new Date(result, m, d) : null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DateIOService, deps: [{ token: LocaleHelperService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DateIOService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DateIOService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: LocaleHelperService }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class CalendarModel {
    constructor(year, month) {
        this.year = year;
        this.month = month;
        this.initializeDaysInCalendar();
    }
    /**
     * Checks if the calendar passed is equal to the current calendar.
     */
    isEqual(calendar) {
        if (calendar) {
            return this.year === calendar.year && this.month === calendar.month;
        }
        return false;
    }
    /**
     * Checks if a DayModel is in the Calendar
     */
    isDayInCalendar(day) {
        if (day) {
            return this.year === day.year && this.month === day.month;
        }
        return false;
    }
    /**
     * Returns CalendarModel of the previous month.
     */
    previousMonth() {
        if (this.month === 0) {
            return new CalendarModel(this.year - 1, 11);
        }
        else {
            return new CalendarModel(this.year, this.month - 1);
        }
    }
    /**
     * Returns CalendarModel of the next month.
     */
    nextMonth() {
        if (this.month === 11) {
            return new CalendarModel(this.year + 1, 0);
        }
        else {
            return new CalendarModel(this.year, this.month + 1);
        }
    }
    /**
     * Returns CalendarModel of the previous year.
     */
    previousYear() {
        return new CalendarModel(this.year - 1, this.month);
    }
    /**
     * Returns CalendarModel of the next year.
     */
    nextYear() {
        return new CalendarModel(this.year + 1, this.month);
    }
    /**
     * Populates the days array with the DayModels in the current Calendar.
     */
    initializeDaysInCalendar() {
        const noOfDaysInCalendar = getNumberOfDaysInTheMonth(this.year, this.month);
        this.days = Array(noOfDaysInCalendar)
            .fill(null)
            .map((_date, index) => {
            return new DayModel(this.year, this.month, index + 1);
        });
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This service is responsible for:
 * 1. Initializing the displayed calendar.
 * 2. Moving the calendar to the next, previous or current months
 * 3. Managing the focused and selected day models.
 */
class DateNavigationService {
    constructor() {
        this.isRangePicker = false;
        this.hasActionButtons = false;
        this._todaysFullDate = new Date();
        this._selectedDayChange = new Subject();
        this._selectedEndDayChange = new Subject();
        this._displayedCalendarChange = new Subject();
        this._focusOnCalendarChange = new Subject();
        this._refreshCalendarView = new Subject();
        this._focusedDayChange = new Subject();
    }
    get today() {
        return this._today;
    }
    get displayedCalendar() {
        return this._displayedCalendar;
    }
    get selectedDayChange() {
        return this._selectedDayChange.asObservable();
    }
    get selectedEndDayChange() {
        return this._selectedEndDayChange.asObservable();
    }
    /**
     * This observable lets the subscriber know that the displayed calendar has changed.
     */
    get displayedCalendarChange() {
        return this._displayedCalendarChange.asObservable();
    }
    /**
     * This observable lets the subscriber know that the focus should be applied on the calendar.
     */
    get focusOnCalendarChange() {
        return this._focusOnCalendarChange.asObservable();
    }
    /**
     * This observable lets the subscriber know that the focused day in the displayed calendar has changed.
     */
    get focusedDayChange() {
        return this._focusedDayChange.asObservable().pipe(tap((day) => (this.focusedDay = day)));
    }
    /**
     * This observable lets the subscriber know that the displayed calendar has changed.
     */
    get refreshCalendarView() {
        return this._refreshCalendarView.asObservable();
    }
    /**
     * Notifies that the selected day has changed so that the date can be emitted to the user.
     */
    notifySelectedDayChanged(dayObject, { emitEvent } = { emitEvent: true }) {
        if (this.isRangePicker) {
            const { startDate, endDate } = dayObject;
            if (startDate && endDate) {
                this.setSelectedDay(startDate, emitEvent);
                this.setSelectedEndDay(endDate, emitEvent);
            }
            else {
                if (endDate !== null) {
                    this.setSelectedEndDay(endDate, emitEvent);
                }
                if (startDate !== null) {
                    this.setSelectedDay(startDate, emitEvent);
                }
            }
        }
        else {
            const day = dayObject;
            this.setSelectedDay(day, emitEvent);
        }
        this._refreshCalendarView.next();
    }
    /**
     * Initializes the calendar based on the selected day.
     */
    initializeCalendar() {
        this.focusedDay = null; // Can be removed later on the store focus
        this.initializeTodaysDate();
        if (this.selectedDay) {
            this._displayedCalendar = new CalendarModel(this.selectedDay.year, this.selectedDay.month);
        }
        else {
            this._displayedCalendar = new CalendarModel(this.today.year, this.today.month);
        }
    }
    changeMonth(month) {
        this.setDisplayedCalendar(new CalendarModel(this._displayedCalendar.year, month));
    }
    changeYear(year) {
        this.setDisplayedCalendar(new CalendarModel(year, this._displayedCalendar.month));
    }
    /**
     * Moves the displayed calendar to the next month.
     */
    moveToNextMonth() {
        this.setDisplayedCalendar(this._displayedCalendar.nextMonth());
    }
    /**
     * Moves the displayed calendar to the previous month.
     */
    moveToPreviousMonth() {
        this.setDisplayedCalendar(this._displayedCalendar.previousMonth());
    }
    /**
     * Moves the displayed calendar to the next year.
     */
    moveToNextYear() {
        this.setDisplayedCalendar(this._displayedCalendar.nextYear());
    }
    /**
     * Moves the displayed calendar to the previous year.
     */
    moveToPreviousYear() {
        this.setDisplayedCalendar(this._displayedCalendar.previousYear());
    }
    /**
     * Moves the displayed calendar to the current month and year.
     */
    moveToCurrentMonth() {
        if (!this.displayedCalendar.isDayInCalendar(this.today)) {
            this.setDisplayedCalendar(new CalendarModel(this.today.year, this.today.month));
        }
        this._focusOnCalendarChange.next();
    }
    moveToSpecificMonth(day) {
        if (!this.displayedCalendar.isDayInCalendar(day)) {
            this.setDisplayedCalendar(new CalendarModel(day.year, day.month));
        }
    }
    incrementFocusDay(value) {
        this.hoveredDay = this.focusedDay = this.focusedDay.incrementBy(value);
        if (this._displayedCalendar.isDayInCalendar(this.focusedDay)) {
            this._focusedDayChange.next(this.focusedDay);
        }
        else {
            this.setDisplayedCalendar(new CalendarModel(this.focusedDay.year, this.focusedDay.month));
        }
        this._focusOnCalendarChange.next();
    }
    resetSelectedDay() {
        this.selectedDay = this.persistedDate;
        this.selectedEndDay = this.persistedEndDate;
    }
    convertDateToDayModel(date) {
        return new DayModel(date.getFullYear(), date.getMonth(), date.getDate());
    }
    setSelectedDay(dayModel, emitEvent) {
        this.selectedDay = dayModel;
        if (emitEvent) {
            this._selectedDayChange.next(dayModel);
        }
    }
    setSelectedEndDay(dayModel, emitEvent) {
        this.selectedEndDay = dayModel;
        if (emitEvent) {
            this._selectedEndDayChange.next(dayModel);
        }
    }
    // not a setter because i want this to remain private
    setDisplayedCalendar(value) {
        if (!this._displayedCalendar.isEqual(value)) {
            this._displayedCalendar = value;
            this._displayedCalendarChange.next();
        }
    }
    initializeTodaysDate() {
        this._todaysFullDate = new Date();
        this._today = new DayModel(this._todaysFullDate.getFullYear(), this._todaysFullDate.getMonth(), this._todaysFullDate.getDate());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DateNavigationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DateNavigationService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DateNavigationService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatepickerEnabledService {
    constructor(_document) {
        this._document = _document;
        this._isUserAgentMobile = false;
        if (_document) {
            this._isUserAgentMobile = MOBILE_USERAGENT_REGEX.test(_document.defaultView.navigator.userAgent);
            this._innerWidth = _document.defaultView.innerWidth;
        }
    }
    /**
     * Returns if the calendar should be active or not.
     * If the user agent is mobile and the screen width is less than DATEPICKER_ACTIVE_BREAKPOINT
     * then the calendar is inactive.
     */
    get isEnabled() {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
        // What they recommend is:
        //"In summary, we recommend looking for the string 'Mobi'
        // anywhere in the User Agent to detect a mobile device."
        if (this._document) {
            if (this._innerWidth < DATEPICKER_ENABLE_BREAKPOINT && this._isUserAgentMobile) {
                return false;
            }
        }
        return true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatepickerEnabledService, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatepickerEnabledService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatepickerEnabledService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This service manages which view is visible in the datepicker popover.
 */
class ViewManagerService {
    constructor() {
        this.position = ClrPopoverPosition.BOTTOM_LEFT;
        this._currentView = "DAYVIEW" /* DatepickerViewEnum.DAYVIEW */;
    }
    get isDayView() {
        return this._currentView === "DAYVIEW" /* DatepickerViewEnum.DAYVIEW */;
    }
    get isYearView() {
        return this._currentView === "YEARVIEW" /* DatepickerViewEnum.YEARVIEW */;
    }
    get isMonthView() {
        return this._currentView === "MONTHVIEW" /* DatepickerViewEnum.MONTHVIEW */;
    }
    changeToMonthView() {
        this._currentView = "MONTHVIEW" /* DatepickerViewEnum.MONTHVIEW */;
    }
    changeToYearView() {
        this._currentView = "YEARVIEW" /* DatepickerViewEnum.YEARVIEW */;
    }
    changeToDayView() {
        this._currentView = "DAYVIEW" /* DatepickerViewEnum.DAYVIEW */;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ViewManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ViewManagerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ViewManagerService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This service focuses the day that is focusable in the calendar.
 */
class DatepickerFocusService {
    constructor(_ngZone, platformId) {
        this._ngZone = _ngZone;
        this.platformId = platformId;
    }
    focusCell(elRef) {
        this._ngZone.runOutsideAngular(() => {
            this.ngZoneIsStableInBrowser().subscribe(() => {
                const focusEl = elRef.nativeElement.querySelector('[tabindex="0"]');
                if (focusEl) {
                    focusEl.focus();
                }
            });
        });
    }
    focusInput(element) {
        this._ngZone.runOutsideAngular(() => this.ngZoneIsStableInBrowser().subscribe(() => element.focus()));
    }
    elementIsFocused(element) {
        return isPlatformBrowser(this.platformId) && document.activeElement === element;
    }
    ngZoneIsStableInBrowser() {
        // Credit: Material: https://github.com/angular/material2/blob/master/src/lib/datepicker/calendar.ts
        return this._ngZone.onStable.asObservable().pipe(first(), filter(() => isPlatformBrowser(this.platformId)));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatepickerFocusService, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatepickerFocusService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatepickerFocusService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrMonthpicker {
    constructor(_localeHelperService, _dateNavigationService, _datepickerFocusService, _elRef, _viewManagerService, commonStrings) {
        this._localeHelperService = _localeHelperService;
        this._dateNavigationService = _dateNavigationService;
        this._datepickerFocusService = _datepickerFocusService;
        this._elRef = _elRef;
        this._viewManagerService = _viewManagerService;
        this.commonStrings = commonStrings;
        this._focusedMonthIndex = this.calendarMonthIndex;
    }
    /**
     * Gets the months array which is used to rendered the monthpicker view.
     * Months are in the TranslationWidth.Wide format.
     */
    get monthNames() {
        return this._localeHelperService.localeMonthsWide;
    }
    /**
     * Gets the month value of the Calendar.
     */
    get calendarMonthIndex() {
        return this._dateNavigationService.displayedCalendar.month;
    }
    /**
     * Gets the year which the user is currently on.
     */
    get calendarEndMonthIndex() {
        return this._dateNavigationService.selectedEndDay?.month;
    }
    get yearAttrString() {
        return this.commonStrings.parse(this.commonStrings.keys.datepickerSelectYearText, {
            CALENDAR_YEAR: this.calendarYear.toString(),
        });
    }
    /**
     * Returns the year value of the calendar.
     */
    get calendarYear() {
        return this._dateNavigationService.displayedCalendar.year;
    }
    get currentCalendarYear() {
        return new Date().getFullYear();
    }
    get currentCalendarMonth() {
        return new Date().getMonth();
    }
    getIsRangeStartMonth(monthIndex) {
        return (this._dateNavigationService.isRangePicker &&
            this.calendarYear === this._dateNavigationService.selectedDay?.year &&
            monthIndex === this._dateNavigationService.selectedDay?.month);
    }
    getIsRangeEndMonth(monthIndex) {
        return (this._dateNavigationService.isRangePicker &&
            this.calendarYear === this._dateNavigationService.selectedEndDay?.year &&
            monthIndex === this._dateNavigationService.selectedEndDay?.month);
    }
    /**
     * Calls the ViewManagerService to change to the yearpicker view.
     */
    changeToYearView() {
        this._viewManagerService.changeToYearView();
    }
    /**
     * Focuses on the current calendar month when the View is initialized.
     */
    ngAfterViewInit() {
        this._datepickerFocusService.focusCell(this._elRef);
    }
    /**
     * Handles the Keyboard arrow navigation for the monthpicker.
     */
    onKeyDown(event) {
        // NOTE: Didn't move this to the date navigation service because
        // the logic is fairly simple and it didn't make sense for me
        // to create extra observables just to move this logic to the service.
        if (event) {
            const key = normalizeKey(event.key);
            if (key === Keys.ArrowUp && this._focusedMonthIndex > 1) {
                event.preventDefault();
                this._focusedMonthIndex -= 2;
                this._datepickerFocusService.focusCell(this._elRef);
            }
            else if (key === Keys.ArrowDown && this._focusedMonthIndex < 10) {
                event.preventDefault();
                this._focusedMonthIndex += 2;
                this._datepickerFocusService.focusCell(this._elRef);
            }
            else if (key === Keys.ArrowRight && this._focusedMonthIndex < 11) {
                event.preventDefault();
                this._focusedMonthIndex++;
                this._datepickerFocusService.focusCell(this._elRef);
            }
            else if (key === Keys.ArrowLeft && this._focusedMonthIndex > 0) {
                event.preventDefault();
                this._focusedMonthIndex--;
                this._datepickerFocusService.focusCell(this._elRef);
            }
        }
    }
    isSelected(monthIndex) {
        return ((this._dateNavigationService.selectedDay?.year === this.calendarYear &&
            monthIndex === this._dateNavigationService.selectedDay?.month) ||
            (this._dateNavigationService.selectedEndDay?.year === this.calendarYear &&
                monthIndex === this.calendarEndMonthIndex));
    }
    /**
     * Calls the DateNavigationService to update the hovered month value of the calendar
     */
    onHover(monthIndex) {
        this._dateNavigationService.hoveredMonth = monthIndex;
    }
    /**
     * Calls the DateNavigationService to update the month value of the calendar.
     * Also changes the view to the daypicker.
     */
    changeMonth(monthIndex) {
        this._dateNavigationService.changeMonth(monthIndex);
        this._viewManagerService.changeToDayView();
    }
    /**
     * Compares the month passed to the focused month and returns the tab index.
     */
    getTabIndex(monthIndex) {
        return monthIndex === this._focusedMonthIndex ? 0 : -1;
    }
    /**
     * Calls the DateNavigationService to move to the next month.
     */
    nextYear() {
        this._dateNavigationService.moveToNextYear();
    }
    /**
     * Calls the DateNavigationService to move to the previous month.
     */
    previousYear() {
        this._dateNavigationService.moveToPreviousYear();
    }
    /**
     * Calls the DateNavigationService to move to the current month.
     */
    currentYear() {
        this._dateNavigationService.moveToCurrentMonth();
    }
    /**
     * Applicable only to date range picker
     * Compares the month passed is in between the start and end date range
     */
    isInRange(monthIndex) {
        if (!this._dateNavigationService.isRangePicker) {
            return false;
        }
        if (this._dateNavigationService.selectedDay && this._dateNavigationService.selectedEndDay) {
            return ((this.calendarYear === this._dateNavigationService.selectedDay.year &&
                monthIndex > this._dateNavigationService.selectedDay.month &&
                this.calendarYear === this._dateNavigationService.selectedEndDay.year &&
                monthIndex < this._dateNavigationService.selectedEndDay.month) ||
                (this._dateNavigationService.selectedDay.year !== this._dateNavigationService.selectedEndDay.year &&
                    this.calendarYear === this._dateNavigationService.selectedDay.year &&
                    monthIndex > this._dateNavigationService.selectedDay.month) ||
                (this._dateNavigationService.selectedDay.year !== this._dateNavigationService.selectedEndDay.year &&
                    this.calendarYear === this._dateNavigationService.selectedEndDay.year &&
                    monthIndex < this._dateNavigationService.selectedEndDay.month) ||
                (this.calendarYear > this._dateNavigationService.selectedDay.year &&
                    this.calendarYear < this._dateNavigationService.selectedEndDay.year));
        }
        else if (this._dateNavigationService.selectedDay && !this._dateNavigationService.selectedEndDay) {
            return ((this.calendarYear === this._dateNavigationService.selectedDay.year &&
                monthIndex > this._dateNavigationService.selectedDay.month &&
                monthIndex < this._dateNavigationService.hoveredMonth) ||
                (this.calendarYear > this._dateNavigationService.selectedDay.year &&
                    monthIndex < this._dateNavigationService.hoveredMonth));
        }
        else {
            return false;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrMonthpicker, deps: [{ token: LocaleHelperService }, { token: DateNavigationService }, { token: DatepickerFocusService }, { token: i0.ElementRef }, { token: ViewManagerService }, { token: i2$1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrMonthpicker, isStandalone: false, selector: "clr-monthpicker", host: { attributes: { "role": "application" }, listeners: { "keydown": "onKeyDown($event)" }, properties: { "class.monthpicker": "true" } }, ngImport: i0, template: `
    <div class="calendar-header in-monthpicker">
      <div class="year-view-switcher">
        <button
          class="calendar-btn yearpicker-trigger"
          type="button"
          (click)="changeToYearView()"
          [attr.aria-label]="yearAttrString"
          [attr.title]="yearAttrString"
        >
          {{ calendarYear }}
        </button>
      </div>
      <div class="calendar-switchers">
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="previousYear()"
          [attr.aria-label]="commonStrings.keys.datepickerPreviousMonth"
        >
          <cds-icon shape="angle" direction="left" [attr.title]="commonStrings.keys.datepickerPreviousMonth"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="currentYear()"
          [attr.aria-label]="commonStrings.keys.datepickerCurrentMonth"
        >
          <cds-icon shape="event" [attr.title]="commonStrings.keys.datepickerCurrentMonth"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="nextYear()"
          [attr.aria-label]="commonStrings.keys.datepickerNextMonth"
        >
          <cds-icon shape="angle" direction="right" [attr.title]="commonStrings.keys.datepickerNextMonth"></cds-icon>
        </button>
      </div>
    </div>
    <div class="months">
      @for (month of monthNames; track month; let monthIndex = $index) {
        <button
          type="button"
          class="calendar-btn month"
          (click)="changeMonth(monthIndex)"
          [class.is-selected]="isSelected(monthIndex)"
          [class.is-start-range]="getIsRangeStartMonth(monthIndex)"
          [class.is-end-range]="getIsRangeEndMonth(monthIndex)"
          [class.in-range]="isInRange(monthIndex)"
          [attr.tabindex]="getTabIndex(monthIndex)"
          [class.is-today]="calendarYear === currentCalendarYear && monthIndex === currentCalendarMonth"
          (mouseenter)="onHover(monthIndex)"
        >
          {{ month }}
        </button>
      }
    </div>
  `, isInline: true, dependencies: [{ kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrMonthpicker, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-monthpicker',
                    template: `
    <div class="calendar-header in-monthpicker">
      <div class="year-view-switcher">
        <button
          class="calendar-btn yearpicker-trigger"
          type="button"
          (click)="changeToYearView()"
          [attr.aria-label]="yearAttrString"
          [attr.title]="yearAttrString"
        >
          {{ calendarYear }}
        </button>
      </div>
      <div class="calendar-switchers">
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="previousYear()"
          [attr.aria-label]="commonStrings.keys.datepickerPreviousMonth"
        >
          <cds-icon shape="angle" direction="left" [attr.title]="commonStrings.keys.datepickerPreviousMonth"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="currentYear()"
          [attr.aria-label]="commonStrings.keys.datepickerCurrentMonth"
        >
          <cds-icon shape="event" [attr.title]="commonStrings.keys.datepickerCurrentMonth"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="nextYear()"
          [attr.aria-label]="commonStrings.keys.datepickerNextMonth"
        >
          <cds-icon shape="angle" direction="right" [attr.title]="commonStrings.keys.datepickerNextMonth"></cds-icon>
        </button>
      </div>
    </div>
    <div class="months">
      @for (month of monthNames; track month; let monthIndex = $index) {
        <button
          type="button"
          class="calendar-btn month"
          (click)="changeMonth(monthIndex)"
          [class.is-selected]="isSelected(monthIndex)"
          [class.is-start-range]="getIsRangeStartMonth(monthIndex)"
          [class.is-end-range]="getIsRangeEndMonth(monthIndex)"
          [class.in-range]="isInRange(monthIndex)"
          [attr.tabindex]="getTabIndex(monthIndex)"
          [class.is-today]="calendarYear === currentCalendarYear && monthIndex === currentCalendarMonth"
          (mouseenter)="onHover(monthIndex)"
        >
          {{ month }}
        </button>
      }
    </div>
  `,
                    host: {
                        '[class.monthpicker]': 'true',
                        role: 'application',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: LocaleHelperService }, { type: DateNavigationService }, { type: DatepickerFocusService }, { type: i0.ElementRef }, { type: ViewManagerService }, { type: i2$1.ClrCommonStringsService }], propDecorators: { onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const YEARS_TO_DISPLAY = 10;
class YearRangeModel {
    constructor(year) {
        this.year = year;
        this.yearRange = [];
        this.generateYearRange();
    }
    /**
     * Gets the number in the middle of the range.
     */
    get middleYear() {
        return this.yearRange[Math.floor(this.yearRange.length / 2)];
    }
    /**
     * Generates the YearRangeModel for the next decade.
     */
    nextDecade() {
        return new YearRangeModel(this.year + 10);
    }
    /**
     * Generates the YearRangeModel for the previous decade.
     */
    previousDecade() {
        return new YearRangeModel(this.year - 10);
    }
    /**
     * Generates the YearRangeModel for the current decade.
     */
    currentDecade() {
        return new YearRangeModel(new Date().getFullYear());
    }
    /**
     * Checks if the value is in the YearRangeModel.
     */
    inRange(value) {
        return this.yearRange.indexOf(value) > -1;
    }
    /**
     * Generates the year range based on the year parameter.
     * eg: If 2018 is passed the output will be [2010, 2011, ..., 2019]
     */
    generateYearRange() {
        const remainder = this.year % YEARS_TO_DISPLAY;
        const floor = this.year - remainder;
        const ceil = floor + YEARS_TO_DISPLAY;
        this.yearRange = this.generateRange(floor, ceil);
    }
    /**
     * Function which generate a range of numbers from floor to ceil.
     */
    generateRange(floor, ceil) {
        return Array.from({ length: ceil - floor }, (_v, k) => k + floor);
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrYearpicker {
    constructor(_dateNavigationService, _viewManagerService, _datepickerFocusService, _elRef, commonStrings) {
        this._dateNavigationService = _dateNavigationService;
        this._viewManagerService = _viewManagerService;
        this._datepickerFocusService = _datepickerFocusService;
        this._elRef = _elRef;
        this.commonStrings = commonStrings;
        this.yearRangeModel = new YearRangeModel(this.calendarYear);
        this._focusedYear = this.calendarYear;
    }
    get selectedStartYear() {
        return this._dateNavigationService.selectedDay?.year;
    }
    get selectedEndYear() {
        return this._dateNavigationService.selectedEndDay?.year;
    }
    /**
     * Gets the year which the user is currently on.
     */
    get calendarYear() {
        return this._dateNavigationService.displayedCalendar.year;
    }
    isCurrentCalendarYear(year) {
        return year === new Date().getFullYear();
    }
    getIsRangeStartYear(year) {
        return this._dateNavigationService.isRangePicker && year === this._dateNavigationService.selectedDay?.year;
    }
    getIsRangeEndYear(year) {
        return this._dateNavigationService.isRangePicker && year === this._dateNavigationService.selectedEndDay?.year;
    }
    /**
     * Focuses on the current calendar year when the View is initialized.
     */
    ngAfterViewInit() {
        this._datepickerFocusService.focusCell(this._elRef);
    }
    /**
     * Handles the Keyboard arrow navigation for the yearpicker.
     */
    onKeyDown(event) {
        // NOTE: Didn't move this to the date navigation service because
        // the logic is fairly simple and it didn't make sense for me
        // to create extra observables just to move this logic to the service.
        if (event) {
            const key = normalizeKey(event.key);
            if (key === Keys.ArrowUp) {
                event.preventDefault();
                this.incrementFocusYearBy(-2);
            }
            else if (key === Keys.ArrowDown) {
                event.preventDefault();
                this.incrementFocusYearBy(2);
            }
            else if (key === Keys.ArrowRight) {
                event.preventDefault();
                this.incrementFocusYearBy(1);
            }
            else if (key === Keys.ArrowLeft) {
                event.preventDefault();
                this.incrementFocusYearBy(-1);
            }
        }
    }
    /**
     * Calls the DateNavigationService to update the year value of the calendar.
     * Also changes the view to the daypicker.
     */
    changeYear(year) {
        this._dateNavigationService.changeYear(year);
        this._viewManagerService.changeToDayView();
    }
    /**
     * Calls the DateNavigationService to update the hovered year value of the calendar
     */
    onHover(year) {
        this._dateNavigationService.hoveredYear = year;
    }
    /**
     * Updates the YearRangeModel to the previous decade.
     */
    previousDecade() {
        this.yearRangeModel = this.yearRangeModel.previousDecade();
        // Year in the yearpicker is not focused because while navigating to a different decade,
        // you want the focus to remain on the decade switcher arrows.
    }
    /**
     * Updates the YearRangeModel to the current decade.
     */
    currentDecade() {
        if (!this.yearRangeModel.inRange(this._dateNavigationService.today.year)) {
            this.yearRangeModel = this.yearRangeModel.currentDecade();
        }
        this._datepickerFocusService.focusCell(this._elRef);
    }
    /**
     * Updates the YearRangeModel to the next decade.
     */
    nextDecade() {
        this.yearRangeModel = this.yearRangeModel.nextDecade();
        // Year in the yearpicker is not focused because while navigating to a different decade,
        // you want the focus to remain on the decade switcher arrows.
    }
    /**
     * Compares the year passed to the focused year and returns the tab index.
     */
    getTabIndex(year) {
        if (!this.yearRangeModel.inRange(this._focusedYear)) {
            if (this.yearRangeModel.inRange(this.calendarYear)) {
                this._focusedYear = this.calendarYear;
            }
            else if (this.yearRangeModel.inRange(this.selectedEndYear)) {
                this._focusedYear = this.selectedEndYear;
            }
            else {
                this._focusedYear = this.yearRangeModel.middleYear;
            }
        }
        return this._focusedYear === year ? 0 : -1;
    }
    /**
     * Applicable only to date range picker
     * Compares the year passed is in between the start and end date range
     */
    isInRange(year) {
        if (!this._dateNavigationService.isRangePicker) {
            return false;
        }
        if (this._dateNavigationService.selectedDay?.year && this.selectedEndYear) {
            return year > this.selectedStartYear && year < this.selectedEndYear;
        }
        else if (this._dateNavigationService.selectedDay?.year && !this.selectedEndYear) {
            return year > this.selectedStartYear && year < this._dateNavigationService.hoveredYear;
        }
        else {
            return false;
        }
    }
    changeToDayView() {
        this._viewManagerService.changeToDayView();
    }
    /**
     * Increments the focus year by the value passed. Updates the YearRangeModel if the
     * new value is not in the current decade.
     */
    incrementFocusYearBy(value) {
        this._focusedYear = this._focusedYear + value;
        if (!this.yearRangeModel.inRange(this._focusedYear)) {
            if (value > 0) {
                this.yearRangeModel = this.yearRangeModel.nextDecade();
            }
            else {
                this.yearRangeModel = this.yearRangeModel.previousDecade();
            }
        }
        this._datepickerFocusService.focusCell(this._elRef);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrYearpicker, deps: [{ token: DateNavigationService }, { token: ViewManagerService }, { token: DatepickerFocusService }, { token: i0.ElementRef }, { token: i2$1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrYearpicker, isStandalone: false, selector: "clr-yearpicker", host: { attributes: { "role": "application" }, listeners: { "keydown": "onKeyDown($event)" }, properties: { "class.yearpicker": "true" } }, ngImport: i0, template: `
    <div class="calendar-header">
      <div class="calendar-pickers">
        <button class="calendar-btn yearpicker-trigger year-range" type="button" (click)="changeToDayView()">
          {{ yearRangeModel.yearRange[0] }} - {{ yearRangeModel.yearRange[yearRangeModel.yearRange.length - 1] }}
        </button>
      </div>
      <div class="year-switchers">
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="previousDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerPreviousDecade"
        >
          <cds-icon
            shape="angle"
            direction="left"
            [attr.title]="commonStrings.keys.datepickerPreviousDecade"
          ></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="currentDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerCurrentDecade"
        >
          <cds-icon shape="event" [attr.title]="commonStrings.keys.datepickerCurrentDecade"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="nextDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerNextDecade"
        >
          <cds-icon shape="angle" direction="right" [attr.title]="commonStrings.keys.datepickerNextDecade"></cds-icon>
        </button>
      </div>
    </div>

    <div class="years">
      @for (year of yearRangeModel.yearRange; track year) {
        <button
          type="button"
          class="calendar-btn year"
          [attr.tabindex]="getTabIndex(year)"
          [class.is-selected]="year === selectedStartYear || year === selectedEndYear"
          [class.is-start-range]="getIsRangeStartYear(year)"
          [class.is-end-range]="getIsRangeEndYear(year)"
          [class.in-range]="isInRange(year)"
          [class.is-today]="isCurrentCalendarYear(year)"
          (click)="changeYear(year)"
          (mouseenter)="onHover(year)"
        >
          {{ year }}
        </button>
      }
    </div>
  `, isInline: true, dependencies: [{ kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrYearpicker, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-yearpicker',
                    template: `
    <div class="calendar-header">
      <div class="calendar-pickers">
        <button class="calendar-btn yearpicker-trigger year-range" type="button" (click)="changeToDayView()">
          {{ yearRangeModel.yearRange[0] }} - {{ yearRangeModel.yearRange[yearRangeModel.yearRange.length - 1] }}
        </button>
      </div>
      <div class="year-switchers">
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="previousDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerPreviousDecade"
        >
          <cds-icon
            shape="angle"
            direction="left"
            [attr.title]="commonStrings.keys.datepickerPreviousDecade"
          ></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="currentDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerCurrentDecade"
        >
          <cds-icon shape="event" [attr.title]="commonStrings.keys.datepickerCurrentDecade"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="nextDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerNextDecade"
        >
          <cds-icon shape="angle" direction="right" [attr.title]="commonStrings.keys.datepickerNextDecade"></cds-icon>
        </button>
      </div>
    </div>

    <div class="years">
      @for (year of yearRangeModel.yearRange; track year) {
        <button
          type="button"
          class="calendar-btn year"
          [attr.tabindex]="getTabIndex(year)"
          [class.is-selected]="year === selectedStartYear || year === selectedEndYear"
          [class.is-start-range]="getIsRangeStartYear(year)"
          [class.is-end-range]="getIsRangeEndYear(year)"
          [class.in-range]="isInRange(year)"
          [class.is-today]="isCurrentCalendarYear(year)"
          (click)="changeYear(year)"
          (mouseenter)="onHover(year)"
        >
          {{ year }}
        </button>
      }
    </div>
  `,
                    host: {
                        '[class.yearpicker]': 'true',
                        role: 'application',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DateNavigationService }, { type: ViewManagerService }, { type: DatepickerFocusService }, { type: i0.ElementRef }, { type: i2$1.ClrCommonStringsService }], propDecorators: { onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DayViewModel {
    constructor(dayModel, isTodaysDate = false, isExcluded = false, isDisabled = false, isSelected = false, isFocusable = false, isRangeStartDay = false, isRangeEndDay = false) {
        this.dayModel = dayModel;
        this.isTodaysDate = isTodaysDate;
        this.isExcluded = isExcluded;
        this.isDisabled = isDisabled;
        this.isSelected = isSelected;
        this.isFocusable = isFocusable;
        this.isRangeStartDay = isRangeStartDay;
        this.isRangeEndDay = isRangeEndDay;
    }
    /**
     * Gets the tab index based on the isFocusable flag.
     */
    get tabIndex() {
        return this.isFocusable ? 0 : -1;
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class CalendarViewModel {
    constructor(calendar, selectedDay, selectedEndDay, focusableDay, today, firstDayOfWeek, excludedDates) {
        this.calendar = calendar;
        this.selectedDay = selectedDay;
        this.selectedEndDay = selectedEndDay;
        this.focusableDay = focusableDay;
        this.today = today;
        this.firstDayOfWeek = firstDayOfWeek;
        this.excludedDates = excludedDates;
        this.currMonthDayViews = [];
        this.initializeCalendarView();
    }
    /**
     * DayViewModel matrix. Size 6x7
     */
    get calendarView() {
        return this._calendarView;
    }
    /**
     * Updates the focusable day in the calendar.
     */
    updateFocusableDay(day) {
        this.setFocusableFlag(this.focusableDay, false);
        this.setFocusableFlag(day, true);
        this.focusableDay = day;
    }
    /**
     * Updates the selected day in the calendar
     */
    updateSelectedDay(day) {
        this.setSelectedDay(this.selectedDay, false);
        this.selectedDay = day;
        this.setSelectedDay(day, true);
    }
    /**
     * Updates the selected end day in the calendar
     */
    updateSelectedEndDay(day) {
        this.setSelectedDay(this.selectedEndDay, false);
        this.selectedEndDay = day;
        this.setSelectedDay(day, true);
    }
    /**
     * Generates a 6x7 matrix of DayViewModel based on the Calendar.
     * The 6x7 matrix is structured according to the first day of the week.
     * 6 rows to accommodate months which might have dates spanning over 6 weeks.
     * 7 columns because there are 7 days in a week :P :D
     */
    initializeCalendarView() {
        // Generate prev and next month calendar models.
        const prevMonthCalendar = this.calendar.previousMonth();
        const nextMonthCalendar = this.calendar.nextMonth();
        // Get no of days from prev and next months.
        const daysFromPrevMonthInCalView = this.numDaysFromPrevMonthInCalView(this.calendar.year, this.calendar.month);
        const daysFromNextMonthInCalView = TOTAL_DAYS_IN_DAYS_VIEW - (this.calendar.days.length + daysFromPrevMonthInCalView);
        // Generate prev, curr and next day view models
        let prevMonthDayViews = [];
        let nextMonthDayViews = [];
        if (daysFromPrevMonthInCalView > 0) {
            prevMonthDayViews = this.generateDayViewModels(prevMonthCalendar.days.slice(-1 * daysFromPrevMonthInCalView), true, false);
        }
        this.currMonthDayViews = this.generateDayViewModels(this.calendar.days, false, true);
        if (daysFromNextMonthInCalView > 0) {
            nextMonthDayViews = this.generateDayViewModels(nextMonthCalendar.days.slice(0, daysFromNextMonthInCalView), true, false);
        }
        // Generate calendar view and initialize flags
        this._calendarView = this.generateCalendarView(prevMonthDayViews, this.currMonthDayViews, nextMonthDayViews);
        this.initializeSelectedDay();
        this.initializeFocusableDay();
    }
    isDateExcluded(date) {
        const { minDate, maxDate } = this.excludedDates;
        const from = minDate.toComparisonString();
        const to = maxDate.toComparisonString();
        const today = date.toComparisonString();
        return !(today >= from && today <= to);
    }
    /**
     * Generates a DayViewModel array based on the DayModel passed
     */
    generateDayViewModels(days, isExcluded, isCurrentCalendar) {
        const dayViews = days.map(day => {
            return new DayViewModel(day, false, isExcluded, this.isDateExcluded(day), false, false);
        });
        if (isCurrentCalendar && this.calendar.isDayInCalendar(this.today)) {
            dayViews[this.today.date - 1].isTodaysDate = true;
        }
        return dayViews;
    }
    /**
     * Gets the first day of the current month to figure out how many dates of previous month
     * are needed to complete the Calendar View based on the first day of the week.
     * eg: Assuming locale en-US, the first day of the week is Sunday,
     * if first day of the current month lands on Wednesday, then
     * (this.getDay function would return 3 since
     * first day of the week is 0), we need the 3 days from the previous month.
     */
    numDaysFromPrevMonthInCalView(currentYear, currentMonth) {
        const firstDayOfCurrMonth = getDay(currentYear, currentMonth, 1);
        if (firstDayOfCurrMonth >= this.firstDayOfWeek) {
            return firstDayOfCurrMonth - this.firstDayOfWeek;
        }
        else {
            return NO_OF_DAYS_IN_A_WEEK + firstDayOfCurrMonth - this.firstDayOfWeek;
        }
    }
    /**
     * Checks if the Day passed is in the CalendarView.
     */
    isDayInCalendarView(day) {
        if (!this.calendar.isDayInCalendar(day)) {
            return false;
        }
        return true;
    }
    /**
     * Using the DayViewModels from the previous, current and next month, this function
     * generates the CalendarView.
     */
    generateCalendarView(prev, curr, next) {
        const combinationArr = [...prev, ...curr, ...next];
        const calendarView = [];
        for (let i = 0; i < NO_OF_ROWS_IN_CALENDAR_VIEW; i++) {
            calendarView[i] = combinationArr.slice(i * NO_OF_DAYS_IN_A_WEEK, (i + 1) * NO_OF_DAYS_IN_A_WEEK);
        }
        return calendarView;
    }
    /**
     * Initialize the selected day if the day is in the calendar.
     */
    initializeSelectedDay() {
        this.setSelectedDay(this.selectedDay, true);
        this.setSelectedDay(this.selectedEndDay, true);
    }
    /**
     * Initializes the focusable day if the day is in the calendar. If focusable day is not set, then
     * we check for the selected day. If selected day is not set then check if today is in the current
     * calendar. If not then just set the 15th of the current calendar month.
     */
    initializeFocusableDay() {
        if (this.focusableDay && this.isDayInCalendarView(this.focusableDay)) {
            this.setFocusableFlag(this.focusableDay, true);
        }
        else if (this.selectedDay && this.isDayInCalendarView(this.selectedDay)) {
            this.setFocusableFlag(this.selectedDay, true);
            this.focusableDay = this.selectedDay.clone();
        }
        else if (this.selectedEndDay && this.isDayInCalendarView(this.selectedEndDay)) {
            this.setFocusableFlag(this.selectedEndDay, true);
            this.focusableDay = this.selectedEndDay.clone();
        }
        else if (this.isDayInCalendarView(this.today)) {
            this.setFocusableFlag(this.today, true);
            this.focusableDay = this.today.clone();
        }
        else {
            this.focusableDay = new DayModel(this.calendar.year, this.calendar.month, 15);
            this.setFocusableFlag(this.focusableDay, true);
        }
    }
    setFocusableFlag(day, flag) {
        if (day) {
            this.currMonthDayViews[day.date - 1].isFocusable = flag;
        }
    }
    setSelectedDay(day, flag) {
        if (day && this.isDayInCalendarView(day)) {
            this.currMonthDayViews[day?.date - 1].isSelected = flag;
        }
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDay {
    constructor(_dateNavigationService, commonStrings) {
        this._dateNavigationService = _dateNavigationService;
        this.commonStrings = commonStrings;
        this.onSelectDay = new EventEmitter();
    }
    /**
     * DayViewModel input which is used to build the Day View.
     */
    get dayView() {
        return this._dayView;
    }
    set dayView(day) {
        this._dayView = day;
    }
    get dayString() {
        return this.dayView.isSelected
            ? this.commonStrings.parse(this.commonStrings.keys.datepickerSelectedLabel, {
                FULL_DATE: this._dayView.dayModel.toDateString(),
            })
            : this._dayView.dayModel.toDateString();
    }
    get isRangeStartDay() {
        return (this._dateNavigationService.isRangePicker &&
            this.dayView?.dayModel?.toComparisonString() === this._dateNavigationService.selectedDay?.toComparisonString());
    }
    get isRangeEndDay() {
        return (this._dateNavigationService.isRangePicker &&
            this.dayView?.dayModel?.toComparisonString() === this._dateNavigationService.selectedEndDay?.toComparisonString());
    }
    /**
     * Calls the DateNavigationService to update the hovered day value of the calendar
     */
    hoverListener() {
        if (!this.dayView.isDisabled) {
            this._dateNavigationService.hoveredDay = this.dayView.dayModel;
        }
    }
    /**
     * Updates the focusedDay in the DateNavigationService when the ClrDay is focused.
     */
    onDayViewFocus() {
        this._dateNavigationService.focusedDay = this.dayView.dayModel;
    }
    /**
     * Updates the selectedDay when the ClrDay is selected and closes the datepicker popover.
     */
    selectDay() {
        if (this.dayView.isDisabled) {
            return;
        }
        const day = this.dayView.dayModel;
        this.onSelectDay.emit(day);
    }
    /**
     * Applicable only to date range picker
     * Compares whether the day is in between the start and end date range
     */
    isInRange() {
        if (!this._dateNavigationService.isRangePicker) {
            return false;
        }
        if (this._dateNavigationService.selectedDay && this._dateNavigationService.selectedEndDay) {
            return (this._dayView.dayModel?.isAfter(this._dateNavigationService.selectedDay) &&
                this._dayView.dayModel?.isBefore(this._dateNavigationService.selectedEndDay));
        }
        else if (this._dateNavigationService.selectedDay && !this._dateNavigationService.selectedEndDay) {
            return (this._dayView.dayModel?.isAfter(this._dateNavigationService.selectedDay) &&
                this._dayView.dayModel?.isBefore(this._dateNavigationService.hoveredDay, true));
        }
        else {
            return false;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDay, deps: [{ token: DateNavigationService }, { token: i2$1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrDay, isStandalone: false, selector: "clr-day", inputs: { dayView: ["clrDayView", "dayView"] }, outputs: { onSelectDay: "selectDay" }, host: { listeners: { "mouseenter": "hoverListener()" }, properties: { "class.day": "true" } }, ngImport: i0, template: `
    <button
      class="day-btn"
      type="button"
      [class.is-today]="dayView.isTodaysDate"
      [class.is-excluded]="dayView.isExcluded"
      [class.is-disabled]="dayView.isDisabled"
      [class.is-selected]="dayView.isSelected"
      [class.in-range]="isInRange()"
      [class.is-start-range]="isRangeStartDay"
      [class.is-end-range]="isRangeEndDay"
      [attr.tabindex]="dayView.tabIndex"
      (click)="selectDay()"
      (focus)="onDayViewFocus()"
      [attr.aria-current]="dayView.isTodaysDate ? 'date' : 'false'"
      [attr.aria-label]="dayString"
      [attr.aria-selected]="dayView.isSelected"
    >
      {{ dayView.dayModel.date }}
    </button>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDay, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-day',
                    template: `
    <button
      class="day-btn"
      type="button"
      [class.is-today]="dayView.isTodaysDate"
      [class.is-excluded]="dayView.isExcluded"
      [class.is-disabled]="dayView.isDisabled"
      [class.is-selected]="dayView.isSelected"
      [class.in-range]="isInRange()"
      [class.is-start-range]="isRangeStartDay"
      [class.is-end-range]="isRangeEndDay"
      [attr.tabindex]="dayView.tabIndex"
      (click)="selectDay()"
      (focus)="onDayViewFocus()"
      [attr.aria-current]="dayView.isTodaysDate ? 'date' : 'false'"
      [attr.aria-label]="dayString"
      [attr.aria-selected]="dayView.isSelected"
    >
      {{ dayView.dayModel.date }}
    </button>
  `,
                    host: { '[class.day]': 'true' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DateNavigationService }, { type: i2$1.ClrCommonStringsService }], propDecorators: { onSelectDay: [{
                type: Output,
                args: ['selectDay']
            }], dayView: [{
                type: Input,
                args: ['clrDayView']
            }], hoverListener: [{
                type: HostListener,
                args: ['mouseenter']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCalendar {
    constructor(_localeHelperService, _dateNavigationService, _datepickerFocusService, _dateIOService, _elRef, _dateFormControlService, _popoverService) {
        this._localeHelperService = _localeHelperService;
        this._dateNavigationService = _dateNavigationService;
        this._datepickerFocusService = _datepickerFocusService;
        this._dateIOService = _dateIOService;
        this._elRef = _elRef;
        this._dateFormControlService = _dateFormControlService;
        this._popoverService = _popoverService;
        this._subs = [];
        this.generateCalendarView();
        this.initializeSubscriptions();
    }
    /**
     * Gets the locale days according to the TranslationWidth.Narrow format.
     */
    get localeDays() {
        return this._localeHelperService.localeDays;
    }
    get calendar() {
        return this._dateNavigationService.displayedCalendar;
    }
    get selectedDay() {
        return this._dateNavigationService.selectedDay;
    }
    get selectedEndDay() {
        return this._dateNavigationService.selectedEndDay;
    }
    get focusedDay() {
        return this._dateNavigationService.focusedDay;
    }
    get today() {
        return this._dateNavigationService.today;
    }
    /**
     * Focuses on the focusable day when the Calendar View is initialized.
     */
    ngAfterViewInit() {
        this._datepickerFocusService.focusCell(this._elRef);
    }
    /**
     * Unsubscribe from subscriptions.
     */
    ngOnDestroy() {
        this._subs.forEach((sub) => sub.unsubscribe());
    }
    /**
     * Delegates Keyboard arrow navigation to the DateNavigationService.
     */
    onKeyDown(event) {
        if (event && this.focusedDay) {
            switch (normalizeKey(event.key)) {
                case Keys.ArrowUp:
                    event.preventDefault();
                    this._dateNavigationService.incrementFocusDay(-1 * NO_OF_DAYS_IN_A_WEEK);
                    break;
                case Keys.ArrowDown:
                    event.preventDefault();
                    this._dateNavigationService.incrementFocusDay(NO_OF_DAYS_IN_A_WEEK);
                    break;
                case Keys.ArrowLeft:
                    event.preventDefault();
                    this._dateNavigationService.incrementFocusDay(-1);
                    break;
                case Keys.ArrowRight:
                    event.preventDefault();
                    this._dateNavigationService.incrementFocusDay(1);
                    break;
                default:
                    break; // No default case. ESLint x-(
            }
        }
    }
    setSelectedDay(day) {
        const hasActionButtons = this._dateNavigationService.hasActionButtons;
        const selectedDates = this.updateCalendarViewModal(day);
        this._dateNavigationService.notifySelectedDayChanged(selectedDates, { emitEvent: !hasActionButtons });
        if (!hasActionButtons) {
            this._dateFormControlService.markAsDirty();
            this.validateAndCloseDatePicker();
        }
    }
    /**
     * Initialize subscriptions to:
     * 1. update the calendar view model.
     * 2. update the focusable day in the calendar view model.
     * 3. focus on the focusable day in the calendar.
     */
    initializeSubscriptions() {
        this._subs.push(this._dateNavigationService.displayedCalendarChange.subscribe(() => {
            this.generateCalendarView();
        }));
        this._subs.push(this._dateNavigationService.focusedDayChange.subscribe((focusedDay) => {
            this.calendarViewModel.updateFocusableDay(focusedDay);
        }));
        this._subs.push(this._dateNavigationService.focusOnCalendarChange.subscribe(() => {
            this._datepickerFocusService.focusCell(this._elRef);
        }));
        this._subs.push(this._dateNavigationService.refreshCalendarView.subscribe(() => {
            this.refreshCalendarViewModal();
        }));
    }
    validateAndCloseDatePicker() {
        if ((this._dateNavigationService.isRangePicker &&
            this._dateNavigationService.selectedDay &&
            this._dateNavigationService.selectedEndDay) ||
            (!this._dateNavigationService.isRangePicker && this._dateNavigationService.selectedDay)) {
            this._popoverService.open = false;
        }
    }
    updateCalendarViewModal(day) {
        const startDate = this.calendarViewModel.selectedDay || null, isRangePicker = this._dateNavigationService.isRangePicker;
        let endDate = this.calendarViewModel.selectedEndDay || null;
        if (isRangePicker) {
            if (!startDate || (!!startDate && !!endDate) || (!!startDate && day?.isBefore(startDate))) {
                this.calendarViewModel.updateSelectedDay(day);
                if (endDate) {
                    endDate = undefined;
                    this.calendarViewModel.updateSelectedEndDay(endDate);
                }
            }
            else {
                this.calendarViewModel.updateSelectedEndDay(day);
            }
        }
        else {
            this.calendarViewModel.updateSelectedDay(day);
        }
        return isRangePicker
            ? { startDate: this.calendarViewModel.selectedDay, endDate: this.calendarViewModel.selectedEndDay }
            : this.calendarViewModel.selectedDay;
    }
    refreshCalendarViewModal() {
        this.calendarViewModel.updateSelectedDay(this._dateNavigationService.selectedDay);
        if (this._dateNavigationService.isRangePicker) {
            this.calendarViewModel.updateSelectedEndDay(this._dateNavigationService.selectedEndDay);
        }
    }
    /**
     * Generates the Calendar View based on the calendar retrieved from the DateNavigationService.
     */
    generateCalendarView() {
        this.calendarViewModel = new CalendarViewModel(this.calendar, this.selectedDay, this.selectedEndDay, this.focusedDay, this.today, this._localeHelperService.firstDayOfWeek, this._dateIOService.disabledDates);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCalendar, deps: [{ token: LocaleHelperService }, { token: DateNavigationService }, { token: DatepickerFocusService }, { token: DateIOService }, { token: i0.ElementRef }, { token: DateFormControlService }, { token: i1$3.ClrPopoverService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrCalendar, isStandalone: false, selector: "clr-calendar", host: { listeners: { "keydown": "onKeyDown($event)" } }, ngImport: i0, template: "<table class=\"calendar-table\" role=\"presentation\">\n  <tr class=\"calendar-row weekdays\">\n    @for (day of localeDays; track day) {\n    <th class=\"calendar-cell weekday\">\n      <span [attr.aria-label]=\"day.day\">{{day.narrow}}</span>\n    </th>\n    }\n  </tr>\n  @for (row of calendarViewModel.calendarView; track row) {\n  <tr class=\"calendar-row\">\n    @for (dayView of row; track dayView) {\n    <td class=\"calendar-cell\">\n      <clr-day [clrDayView]=\"dayView\" (selectDay)=\"setSelectedDay($event)\"></clr-day>\n    </td>\n    }\n  </tr>\n  }\n</table>\n", dependencies: [{ kind: "component", type: ClrDay, selector: "clr-day", inputs: ["clrDayView"], outputs: ["selectDay"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCalendar, decorators: [{
            type: Component,
            args: [{ selector: 'clr-calendar', standalone: false, template: "<table class=\"calendar-table\" role=\"presentation\">\n  <tr class=\"calendar-row weekdays\">\n    @for (day of localeDays; track day) {\n    <th class=\"calendar-cell weekday\">\n      <span [attr.aria-label]=\"day.day\">{{day.narrow}}</span>\n    </th>\n    }\n  </tr>\n  @for (row of calendarViewModel.calendarView; track row) {\n  <tr class=\"calendar-row\">\n    @for (dayView of row; track dayView) {\n    <td class=\"calendar-cell\">\n      <clr-day [clrDayView]=\"dayView\" (selectDay)=\"setSelectedDay($event)\"></clr-day>\n    </td>\n    }\n  </tr>\n  }\n</table>\n" }]
        }], ctorParameters: () => [{ type: LocaleHelperService }, { type: DateNavigationService }, { type: DatepickerFocusService }, { type: DateIOService }, { type: i0.ElementRef }, { type: DateFormControlService }, { type: i1$3.ClrPopoverService }], propDecorators: { onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDaypicker {
    constructor(_viewManagerService, _dateNavigationService, _localeHelperService, commonStrings) {
        this._viewManagerService = _viewManagerService;
        this._dateNavigationService = _dateNavigationService;
        this._localeHelperService = _localeHelperService;
        this.commonStrings = commonStrings;
    }
    get monthAttrString() {
        return this.commonStrings.parse(this.commonStrings.keys.datepickerSelectMonthText, {
            CALENDAR_MONTH: this.calendarMonth,
        });
    }
    get yearAttrString() {
        return this.commonStrings.parse(this.commonStrings.keys.datepickerSelectYearText, {
            CALENDAR_YEAR: this.calendarYear.toString(),
        });
    }
    /**
     * Returns the month value of the calendar in the TranslationWidth.Abbreviated format.
     */
    get calendarMonth() {
        return this._localeHelperService.localeMonthsAbbreviated[this._dateNavigationService.displayedCalendar.month];
    }
    /**
     * Returns the year value of the calendar.
     */
    get calendarYear() {
        return this._dateNavigationService.displayedCalendar.year;
    }
    /**
     * Calls the ViewManagerService to change to the monthpicker view.
     */
    changeToMonthView() {
        this._viewManagerService.changeToMonthView();
    }
    /**
     * Calls the ViewManagerService to change to the yearpicker view.
     */
    changeToYearView() {
        this._viewManagerService.changeToYearView();
    }
    /**
     * Calls the DateNavigationService to move to the next month.
     */
    nextMonth() {
        this._dateNavigationService.moveToNextMonth();
    }
    /**
     * Calls the DateNavigationService to move to the previous month.
     */
    previousMonth() {
        this._dateNavigationService.moveToPreviousMonth();
    }
    /**
     * Calls the DateNavigationService to move to the current month.
     */
    currentMonth() {
        this._dateNavigationService.moveToCurrentMonth();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDaypicker, deps: [{ token: ViewManagerService }, { token: DateNavigationService }, { token: LocaleHelperService }, { token: i2$1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrDaypicker, isStandalone: false, selector: "clr-daypicker", host: { attributes: { "role": "application" }, properties: { "class.daypicker": "true" } }, ngImport: i0, template: "<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n<div class=\"calendar-header\">\n  <div class=\"calendar-pickers\">\n    <button\n      class=\"calendar-btn monthpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToMonthView()\"\n      [attr.aria-label]=\"monthAttrString\"\n      [attr.title]=\"monthAttrString\"\n    >\n      {{calendarMonth}}\n    </button>\n    <button\n      class=\"calendar-btn yearpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToYearView()\"\n      [attr.aria-label]=\"yearAttrString\"\n      [attr.title]=\"yearAttrString\"\n    >\n      {{calendarYear}}\n    </button>\n  </div>\n  <div class=\"calendar-switchers\">\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"previousMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerPreviousMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"left\" [attr.title]=\"commonStrings.keys.datepickerPreviousMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"currentMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerCurrentMonth\"\n    >\n      <cds-icon shape=\"event\" [attr.title]=\"commonStrings.keys.datepickerCurrentMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"nextMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerNextMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"right\" [attr.title]=\"commonStrings.keys.datepickerNextMonth\"></cds-icon>\n    </button>\n  </div>\n</div>\n<clr-calendar></clr-calendar>\n<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n", dependencies: [{ kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: ClrCalendar, selector: "clr-calendar" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDaypicker, decorators: [{
            type: Component,
            args: [{ selector: 'clr-daypicker', host: { '[class.daypicker]': 'true', role: 'application' }, standalone: false, template: "<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n<div class=\"calendar-header\">\n  <div class=\"calendar-pickers\">\n    <button\n      class=\"calendar-btn monthpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToMonthView()\"\n      [attr.aria-label]=\"monthAttrString\"\n      [attr.title]=\"monthAttrString\"\n    >\n      {{calendarMonth}}\n    </button>\n    <button\n      class=\"calendar-btn yearpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToYearView()\"\n      [attr.aria-label]=\"yearAttrString\"\n      [attr.title]=\"yearAttrString\"\n    >\n      {{calendarYear}}\n    </button>\n  </div>\n  <div class=\"calendar-switchers\">\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"previousMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerPreviousMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"left\" [attr.title]=\"commonStrings.keys.datepickerPreviousMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"currentMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerCurrentMonth\"\n    >\n      <cds-icon shape=\"event\" [attr.title]=\"commonStrings.keys.datepickerCurrentMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"nextMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerNextMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"right\" [attr.title]=\"commonStrings.keys.datepickerNextMonth\"></cds-icon>\n    </button>\n  </div>\n</div>\n<clr-calendar></clr-calendar>\n<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n" }]
        }], ctorParameters: () => [{ type: ViewManagerService }, { type: DateNavigationService }, { type: LocaleHelperService }, { type: i2$1.ClrCommonStringsService }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatepickerActions {
    constructor(commonStrings, popoverService, dateNavigationService, dateFormControlService) {
        this.commonStrings = commonStrings;
        this.popoverService = popoverService;
        this.dateNavigationService = dateNavigationService;
        this.dateFormControlService = dateFormControlService;
    }
    apply() {
        if (this.dateNavigationService.isRangePicker &&
            this.dateNavigationService.selectedDay &&
            this.dateNavigationService.selectedEndDay) {
            this.dateNavigationService.notifySelectedDayChanged({
                startDate: this.dateNavigationService.selectedDay,
                endDate: this.dateNavigationService.selectedEndDay,
            });
            this.dateFormControlService.markAsDirty();
        }
        else if (!this.dateNavigationService.isRangePicker && this.dateNavigationService.selectedDay) {
            this.dateNavigationService.notifySelectedDayChanged(this.dateNavigationService.selectedDay);
            this.dateFormControlService.markAsDirty();
        }
        this.popoverService.open = false;
    }
    cancel() {
        this.dateNavigationService.resetSelectedDay();
        this.popoverService.open = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatepickerActions, deps: [{ token: i2$1.ClrCommonStringsService }, { token: i1$3.ClrPopoverService }, { token: DateNavigationService }, { token: DateFormControlService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatepickerActions, isStandalone: false, selector: "clr-datepicker-actions", host: { properties: { "class.datepicker-actions": "true" } }, ngImport: i0, template: `
    <button class="btn btn-outline" (click)="cancel()">{{ commonStrings.keys.cancel }}</button>
    <button class="btn btn-primary" (click)="apply()">{{ commonStrings.keys.apply }}</button>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatepickerActions, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-datepicker-actions',
                    template: `
    <button class="btn btn-outline" (click)="cancel()">{{ commonStrings.keys.cancel }}</button>
    <button class="btn btn-primary" (click)="apply()">{{ commonStrings.keys.apply }}</button>
  `,
                    host: {
                        '[class.datepicker-actions]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i2$1.ClrCommonStringsService }, { type: i1$3.ClrPopoverService }, { type: DateNavigationService }, { type: DateFormControlService }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatepickerViewManager {
    constructor(commonStrings, viewManagerService, dateNavigationService, dateIOService) {
        this.commonStrings = commonStrings;
        this.viewManagerService = viewManagerService;
        this.dateNavigationService = dateNavigationService;
        this.dateIOService = dateIOService;
    }
    /**
     * Returns if the current view is the monthpicker.
     */
    get isMonthView() {
        return this.viewManagerService.isMonthView;
    }
    /**
     * Returns if the current view is the yearpicker.
     */
    get isYearView() {
        return this.viewManagerService.isYearView;
    }
    /**
     * Returns if the current view is the daypicker.
     */
    get isDayView() {
        return this.viewManagerService.isDayView;
    }
    get hasRangeOptions() {
        return !!this.dateNavigationService?.isRangePicker && !!this.dateRangeOptions?.length;
    }
    get hasActionButtons() {
        return this.dateNavigationService.hasActionButtons;
    }
    get dateRangeOptions() {
        return this.dateIOService.getRangeOptions();
    }
    onRangeOptionSelect(selectedRange) {
        const startDate = this.dateNavigationService.convertDateToDayModel(selectedRange?.value[0]), endDate = this.dateNavigationService.convertDateToDayModel(selectedRange?.value[1]);
        this.dateNavigationService.notifySelectedDayChanged({ startDate, endDate }, { emitEvent: !this.hasActionButtons });
        this.dateNavigationService.moveToSpecificMonth(startDate);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatepickerViewManager, deps: [{ token: i2$1.ClrCommonStringsService }, { token: ViewManagerService }, { token: DateNavigationService }, { token: DateIOService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrDatepickerViewManager, isStandalone: false, selector: "clr-datepicker-view-manager", host: { attributes: { "role": "dialog" }, properties: { "class.datepicker": "true", "class.has-range-option": "hasRangeOptions", "class.has-action-buttons": "hasActionButtons", "attr.aria-modal": "true", "attr.aria-label": "commonStrings.keys.datepickerDialogLabel" } }, providers: [DatepickerFocusService], ngImport: i0, template: "<!--\n~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n~ This software is released under MIT license.\n~ The full license information can be found in LICENSE in the root directory of this project.\n-->\n\n@if (hasRangeOptions) {\n<clr-vertical-nav class=\"clr-date-range-picker-nav\">\n  @for (option of dateRangeOptions; track option) {\n  <a\n    clrVerticalNavLink\n    href=\"javascript:void(0)\"\n    [attr.aria-label]=\"option?.label\"\n    tabindex=\"0\"\n    (keyup.enter)=\"onRangeOptionSelect(option)\"\n    (click)=\"onRangeOptionSelect(option)\"\n  >\n    {{option.label}}\n  </a>\n  }\n</clr-vertical-nav>\n<ng-container *ngTemplateOutlet=\"calendarView\"></ng-container>\n} @else {\n<div class=\"datepicker-view-manager\">\n  @if (isMonthView) {\n  <clr-monthpicker></clr-monthpicker>\n  } @if (isYearView) {\n  <clr-yearpicker></clr-yearpicker>\n  } @if (isDayView) {\n  <clr-daypicker></clr-daypicker>\n  } @if (hasActionButtons) {\n  <clr-datepicker-actions></clr-datepicker-actions>\n  }\n</div>\n}\n\n<ng-template #calendarView>\n  <div class=\"datepicker-view-manager\">\n    @if (isMonthView) {\n    <clr-monthpicker></clr-monthpicker>\n    } @if (isYearView) {\n    <clr-yearpicker></clr-yearpicker>\n    } @if (isDayView) {\n    <clr-daypicker></clr-daypicker>\n    } @if (hasActionButtons) {\n    <clr-datepicker-actions></clr-datepicker-actions>\n    }\n  </div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i6.ClrVerticalNav, selector: "clr-vertical-nav", inputs: ["clrVerticalNavToggleLabel", "clrVerticalNavCollapsible", "clrVerticalNavCollapsed"], outputs: ["clrVerticalNavCollapsedChange"] }, { kind: "component", type: i6.ClrVerticalNavLink, selector: "[clrVerticalNavLink]" }, { kind: "component", type: ClrMonthpicker, selector: "clr-monthpicker" }, { kind: "component", type: ClrYearpicker, selector: "clr-yearpicker" }, { kind: "component", type: ClrDaypicker, selector: "clr-daypicker" }, { kind: "component", type: ClrDatepickerActions, selector: "clr-datepicker-actions" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatepickerViewManager, decorators: [{
            type: Component,
            args: [{ selector: 'clr-datepicker-view-manager', providers: [DatepickerFocusService], host: {
                        '[class.datepicker]': 'true',
                        '[class.has-range-option]': 'hasRangeOptions',
                        '[class.has-action-buttons]': 'hasActionButtons',
                        '[attr.aria-modal]': 'true',
                        '[attr.aria-label]': 'commonStrings.keys.datepickerDialogLabel',
                        role: 'dialog',
                    }, standalone: false, template: "<!--\n~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n~ This software is released under MIT license.\n~ The full license information can be found in LICENSE in the root directory of this project.\n-->\n\n@if (hasRangeOptions) {\n<clr-vertical-nav class=\"clr-date-range-picker-nav\">\n  @for (option of dateRangeOptions; track option) {\n  <a\n    clrVerticalNavLink\n    href=\"javascript:void(0)\"\n    [attr.aria-label]=\"option?.label\"\n    tabindex=\"0\"\n    (keyup.enter)=\"onRangeOptionSelect(option)\"\n    (click)=\"onRangeOptionSelect(option)\"\n  >\n    {{option.label}}\n  </a>\n  }\n</clr-vertical-nav>\n<ng-container *ngTemplateOutlet=\"calendarView\"></ng-container>\n} @else {\n<div class=\"datepicker-view-manager\">\n  @if (isMonthView) {\n  <clr-monthpicker></clr-monthpicker>\n  } @if (isYearView) {\n  <clr-yearpicker></clr-yearpicker>\n  } @if (isDayView) {\n  <clr-daypicker></clr-daypicker>\n  } @if (hasActionButtons) {\n  <clr-datepicker-actions></clr-datepicker-actions>\n  }\n</div>\n}\n\n<ng-template #calendarView>\n  <div class=\"datepicker-view-manager\">\n    @if (isMonthView) {\n    <clr-monthpicker></clr-monthpicker>\n    } @if (isYearView) {\n    <clr-yearpicker></clr-yearpicker>\n    } @if (isDayView) {\n    <clr-daypicker></clr-daypicker>\n    } @if (hasActionButtons) {\n    <clr-datepicker-actions></clr-datepicker-actions>\n    }\n  </div>\n</ng-template>\n" }]
        }], ctorParameters: () => [{ type: i2$1.ClrCommonStringsService }, { type: ViewManagerService }, { type: DateNavigationService }, { type: DateIOService }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDateContainer extends ClrAbstractContainer$1 {
    constructor(renderer, elem, popoverService, dateNavigationService, datepickerEnabledService, dateFormControlService, dateIOService, commonStrings, focusService, viewManagerService, controlClassService, layoutService, ngControlService) {
        super(layoutService, controlClassService, ngControlService);
        this.renderer = renderer;
        this.elem = elem;
        this.popoverService = popoverService;
        this.dateNavigationService = dateNavigationService;
        this.datepickerEnabledService = datepickerEnabledService;
        this.dateFormControlService = dateFormControlService;
        this.dateIOService = dateIOService;
        this.commonStrings = commonStrings;
        this.viewManagerService = viewManagerService;
        this.controlClassService = controlClassService;
        this.layoutService = layoutService;
        this.ngControlService = ngControlService;
        this.focus = false;
        this.popoverType = ClrPopoverType.DROPDOWN;
        this.subscriptions.push(focusService.focusChange.subscribe(state => {
            this.focus = state;
        }));
        this.subscriptions.push(popoverService.openChange.subscribe(() => {
            dateFormControlService.markAsTouched();
        }));
        if (dateNavigationService) {
            const tagName = elem.nativeElement.tagName.toLowerCase();
            dateNavigationService.hasActionButtons = dateNavigationService.isRangePicker =
                tagName === 'clr-date-range-container';
        }
    }
    /**
     * For date range picker actions buttons are shown by default
     */
    set showActionButtons(flag) {
        if (this.dateNavigationService.isRangePicker && !flag) {
            console.error('Error! The date range picker requires action buttons, [showActionButtons] cannot be turned off.');
        }
        else {
            this.dateNavigationService.hasActionButtons = flag;
        }
    }
    set clrPosition(position) {
        if (!position) {
            return;
        }
        const posIndex = DROPDOWN_POSITIONS.indexOf(position);
        if (posIndex === -1) {
            return;
        }
        this.viewManagerService.position = DROPDOWN_POSITIONS[posIndex];
    }
    set rangeOptions(rangeOptions) {
        this.dateIOService.setRangeOptions(rangeOptions);
    }
    set min(dateString) {
        if (this.dateNavigationService.isRangePicker) {
            this.dateIOService.setMinDate(dateString);
        }
        else {
            console.error('Error! The date container [min] input only works for date range pickers. Use the native `min` attribute/property for single-date inputs.');
        }
    }
    set max(dateString) {
        if (this.dateNavigationService.isRangePicker) {
            this.dateIOService.setMaxDate(dateString);
        }
        else {
            console.error('Error! The date container [max] input only works for date range pickers. Use the native `max` attribute/property for single-date inputs.');
        }
    }
    set actionButton(button) {
        this.toggleButton = button;
    }
    get popoverPosition() {
        return this.viewManagerService.position;
    }
    get open() {
        return this.popoverService.open;
    }
    /**
     * Returns if the Datepicker is enabled or not. If disabled, hides the datepicker trigger.
     */
    get isEnabled() {
        return this.datepickerEnabledService.isEnabled;
    }
    /**
     * Return if Datepicker is diabled or not as Form Control
     */
    get isInputDateDisabled() {
        /* clrForm wrapper or without clrForm */
        return ((this.control && this.control.disabled) || (this.dateFormControlService && this.dateFormControlService.disabled));
    }
    get isRangePicker() {
        return this.dateNavigationService.isRangePicker;
    }
    ngAfterViewInit() {
        this.dateRangeStructuralChecks();
        this.subscriptions.push(this.popoverService.openChange.subscribe(open => {
            if (open) {
                this.initializeCalendar();
            }
            else {
                this.toggleButton.nativeElement.focus();
                this.dateNavigationService.resetSelectedDay();
            }
        }));
        this.subscriptions.push(this.listenForDateChanges());
    }
    /**
     * Return the label for the toggle button.
     * If there's a selected date, the date is included in the label.
     */
    getToggleButtonLabel(day) {
        if (day) {
            const formattedDate = this.dateIOService.toLocaleDisplayFormatString(day.toDate());
            return this.commonStrings.parse(this.commonStrings.keys.datepickerToggleChangeDateLabel, {
                SELECTED_DATE: formattedDate,
            });
        }
        return this.commonStrings.keys.datepickerToggleChooseDateLabel;
    }
    listenForDateChanges() {
        // because date-input.ts initializes the input in ngAfterViewInit,
        // using a databound attribute to change the button labels results in ExpressionChangedAfterItHasBeenCheckedError.
        // so instead, update the attribute directly on the element
        return this.dateNavigationService.selectedDayChange
            .pipe(startWith(this.dateNavigationService.selectedDay))
            .subscribe(day => {
            if (this.isEnabled) {
                const label = this.getToggleButtonLabel(day);
                const toggleEl = this.toggleButton.nativeElement;
                this.renderer.setAttribute(toggleEl, 'aria-label', label);
                this.renderer.setAttribute(toggleEl, 'title', label);
            }
        });
    }
    /**
     * Processes the user input and Initializes the Calendar everytime the datepicker popover is open.
     */
    initializeCalendar() {
        this.dateNavigationService.initializeCalendar();
    }
    dateRangeStructuralChecks() {
        if (this.dateNavigationService.isRangePicker) {
            const inputs = Array.from(this.elem.nativeElement.querySelectorAll('input'));
            if (inputs.some(input => input.classList.contains('clr-date-input'))) {
                console.error('Error! clr-date-range-container must contain clrStartDate and clrEndDate inputs');
            }
            if (!inputs.some(input => input.classList.contains('clr-date-start-input'))) {
                console.error('Error! clr-date-range-container must contain clrStartDate input');
            }
            if (!inputs.some(input => input.classList.contains('clr-date-end-input'))) {
                console.error('Error! clr-date-range-container must contain clrEndDate input');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDateContainer, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i1$3.ClrPopoverService }, { token: DateNavigationService }, { token: DatepickerEnabledService }, { token: DateFormControlService }, { token: DateIOService }, { token: i2$1.ClrCommonStringsService }, { token: i1$2.FormsFocusService }, { token: ViewManagerService }, { token: i1$2.ControlClassService }, { token: i1$2.LayoutService, optional: true }, { token: i1$2.NgControlService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrDateContainer, isStandalone: false, selector: "clr-date-container, clr-date-range-container", inputs: { showActionButtons: "showActionButtons", clrPosition: "clrPosition", rangeOptions: "rangeOptions", min: "min", max: "max" }, host: { properties: { "class.clr-date-container": "true", "class.clr-form-control-disabled": "isInputDateDisabled", "class.clr-form-control": "true", "class.clr-row": "addGrid()" } }, providers: [
            ControlIdService$1,
            LocaleHelperService,
            ControlClassService$1,
            FormsFocusService$1,
            NgControlService$1,
            DateIOService,
            DateNavigationService,
            DatepickerEnabledService,
            DateFormControlService,
            ViewManagerService,
        ], viewQueries: [{ propertyName: "actionButton", first: true, predicate: ["actionButton"], descendants: true }], usesInheritance: true, hostDirectives: [{ directive: i1$3.ClrPopoverHostDirective }], ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper" clrPopoverAnchor>
        <div class="clr-input-group" [class.clr-focus]="focus">
          <!-- render range inputs only if using clr-date-range-container -->
          @if (isRangePicker) {
            <ng-content select="[clrStartDate]"></ng-content>
            <span class="date-range-separator">-</span>
            <ng-content select="[clrEndDate]"></ng-content>
          }
          <!-- no *ngIf for the singe-date input because it breaks the "auto-wrapped" date picker -->
          <ng-content select="[clrDate]"></ng-content>
          @if (isEnabled) {
            <button
              #actionButton
              type="button"
              clrPopoverOpenCloseButton
              class="clr-input-group-icon-action"
              [disabled]="isInputDateDisabled"
            >
              <cds-icon status="info" shape="calendar"></cds-icon>
            </button>
          }
          <clr-datepicker-view-manager
            *clrPopoverContent="
              open;
              at: popoverPosition;
              type: popoverType;
              outsideClickToClose: true;
              scrollToClose: true
            "
            cdkTrapFocus
          ></clr-datepicker-view-manager>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2$1.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }, { kind: "directive", type: i1$3.ClrPopoverAnchor, selector: "[clrPopoverAnchor]" }, { kind: "directive", type: i1$3.ÇlrClrPopoverOpenCloseButton, selector: "[clrPopoverOpenCloseButton]", outputs: ["clrPopoverOpenCloseChange"] }, { kind: "directive", type: i1$3.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentAvailablePositions", "clrPopoverContentType", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i1$2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: ClrDatepickerViewManager, selector: "clr-datepicker-view-manager" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDateContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-date-container, clr-date-range-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper" clrPopoverAnchor>
        <div class="clr-input-group" [class.clr-focus]="focus">
          <!-- render range inputs only if using clr-date-range-container -->
          @if (isRangePicker) {
            <ng-content select="[clrStartDate]"></ng-content>
            <span class="date-range-separator">-</span>
            <ng-content select="[clrEndDate]"></ng-content>
          }
          <!-- no *ngIf for the singe-date input because it breaks the "auto-wrapped" date picker -->
          <ng-content select="[clrDate]"></ng-content>
          @if (isEnabled) {
            <button
              #actionButton
              type="button"
              clrPopoverOpenCloseButton
              class="clr-input-group-icon-action"
              [disabled]="isInputDateDisabled"
            >
              <cds-icon status="info" shape="calendar"></cds-icon>
            </button>
          }
          <clr-datepicker-view-manager
            *clrPopoverContent="
              open;
              at: popoverPosition;
              type: popoverType;
              outsideClickToClose: true;
              scrollToClose: true
            "
            cdkTrapFocus
          ></clr-datepicker-view-manager>
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
                    providers: [
                        ControlIdService$1,
                        LocaleHelperService,
                        ControlClassService$1,
                        FormsFocusService$1,
                        NgControlService$1,
                        DateIOService,
                        DateNavigationService,
                        DatepickerEnabledService,
                        DateFormControlService,
                        ViewManagerService,
                    ],
                    hostDirectives: [ClrPopoverHostDirective],
                    host: {
                        '[class.clr-date-container]': 'true',
                        '[class.clr-form-control-disabled]': 'isInputDateDisabled',
                        '[class.clr-form-control]': 'true',
                        '[class.clr-row]': 'addGrid()',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i1$3.ClrPopoverService }, { type: DateNavigationService }, { type: DatepickerEnabledService }, { type: DateFormControlService }, { type: DateIOService }, { type: i2$1.ClrCommonStringsService }, { type: i1$2.FormsFocusService }, { type: ViewManagerService }, { type: i1$2.ControlClassService }, { type: i1$2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1$2.NgControlService }], propDecorators: { showActionButtons: [{
                type: Input,
                args: ['showActionButtons']
            }], clrPosition: [{
                type: Input,
                args: ['clrPosition']
            }], rangeOptions: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], actionButton: [{
                type: ViewChild,
                args: ['actionButton']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// There are four ways the datepicker value is set
// 1. Value set by user typing into text input as a string ex: '01/28/2015'
// 2. Value set explicitly by Angular Forms APIs as a string ex: '01/28/2015'
// 3. Value set by user via datepicker UI as a Date Object
// 4. Value set via `clrDate` input as a Date Object
class ClrDateInputBase extends WrappedFormControl$1 {
    constructor(viewContainerRef, injector, el, renderer, control, container, dateIOService, dateNavigationService, datepickerEnabledService, dateFormControlService, platformId, focusService, datepickerFocusService) {
        super(viewContainerRef, ClrDateContainer, injector, control, renderer, el);
        this.el = el;
        this.renderer = renderer;
        this.control = control;
        this.container = container;
        this.dateIOService = dateIOService;
        this.dateNavigationService = dateNavigationService;
        this.datepickerEnabledService = datepickerEnabledService;
        this.dateFormControlService = dateFormControlService;
        this.platformId = platformId;
        this.focusService = focusService;
        this.datepickerFocusService = datepickerFocusService;
        this.index = 1;
    }
    get disabled() {
        if (this.dateFormControlService) {
            return this.dateFormControlService.disabled || !!this.control?.control?.disabled;
        }
        return null;
    }
    set disabled(value) {
        if (this.dateFormControlService) {
            this.dateFormControlService.setDisabled(isBooleanAttributeSet(value));
        }
    }
    get placeholderText() {
        return this.placeholder ? this.placeholder : this.dateIOService.placeholderText;
    }
    get inputType() {
        return isPlatformBrowser(this.platformId) && this.usingNativeDatepicker() ? 'date' : 'text';
    }
    ngOnInit() {
        super.ngOnInit();
        this.populateServicesFromContainerComponent();
        this.subscriptions.push(this.listenForUserSelectedDayChanges(), this.listenForControlValueChanges(), this.listenForTouchChanges(), this.listenForDirtyChanges(), this.listenForInputRefocus());
    }
    ngAfterViewInit() {
        // I don't know why I have to do this but after using the new HostWrapping Module I have to delay the processing
        // of the initial Input set by the user to here. If I do not 2 issues occur:
        // 1. The Input setter is called before ngOnInit. ngOnInit initializes the services without which the setter fails.
        // 2. The Renderer doesn't work before ngAfterViewInit (It used to before the new HostWrapping Module for some reason).
        // I need the renderer to set the value property on the input to make sure that if the user has supplied a Date
        // input object, we reflect it with the right date on the input field using the IO service. I am not sure if
        // these are major issues or not but just noting them down here.
        this.processInitialInputs();
    }
    setFocusStates() {
        this.setFocus(true);
    }
    triggerValidation() {
        super.triggerValidation();
        this.setFocus(false);
    }
    onValueChange(target) {
        const validDateValue = this.dateIOService.getDateValueFromDateString(target.value);
        if (this.usingClarityDatepicker() && validDateValue) {
            this.updateDate(validDateValue, true);
        }
        else if (this.usingNativeDatepicker()) {
            const [year, month, day] = target.value.split('-');
            this.updateDate(new Date(+year, +month - 1, +day), true);
        }
        else {
            this.emitDateOutput(null);
        }
    }
    datepickerHasFormControl() {
        return !!this.control;
    }
    setDate(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        if (this.previousDateChange !== date) {
            this.updateDate(date);
        }
        if (!this.initialClrDateInputValue) {
            this.initialClrDateInputValue = date;
        }
    }
    triggerControlInputValidation() {
        if (this.datepickerHasFormControl()) {
            this.control.control?.updateValueAndValidity({ emitEvent: false });
            this.control.control?.setErrors(this.control.control.errors);
        }
    }
    usingClarityDatepicker() {
        return this.datepickerEnabledService.isEnabled;
    }
    usingNativeDatepicker() {
        return !this.datepickerEnabledService.isEnabled;
    }
    setFocus(focus) {
        if (this.focusService) {
            this.focusService.focused = focus;
        }
    }
    populateServicesFromContainerComponent() {
        if (!this.container) {
            this.dateIOService = this.getProviderFromContainer(DateIOService);
            this.dateNavigationService = this.getProviderFromContainer(DateNavigationService);
            this.datepickerEnabledService = this.getProviderFromContainer(DatepickerEnabledService);
            this.dateFormControlService = this.getProviderFromContainer(DateFormControlService);
        }
    }
    processInitialInputs() {
        if (this.datepickerHasFormControl()) {
            this.updateDate(this.dateIOService.getDateValueFromDateString(this.control.value));
        }
        else {
            this.updateDate(this.initialClrDateInputValue);
        }
    }
    updateDate(value, setByUserInteraction = false) {
        const date = this.getValidDateValueFromDate(value);
        if (setByUserInteraction) {
            this.emitDateOutput(date);
        }
        else {
            this.previousDateChange = date;
        }
        if (this.dateNavigationService) {
            const dayModel = date ? new DayModel(date.getFullYear(), date.getMonth(), date.getDate()) : null;
            this.updateDayModel(dayModel);
        }
        this.updateInput(date);
    }
    updateInput(date) {
        if (date) {
            const dateString = this.dateIOService.toLocaleDisplayFormatString(date);
            if (this.usingNativeDatepicker()) {
                // valueAsDate expects UTC, date from input is time-zoned
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                this.renderer.setProperty(this.el.nativeElement, 'valueAsDate', date);
            }
            else if (this.datepickerHasFormControl() && dateString !== this.control.value) {
                this.control.control.setValue(dateString);
            }
            else {
                this.renderer.setProperty(this.el.nativeElement, 'value', dateString);
            }
            this.validateDateRange();
        }
        else {
            this.renderer.setProperty(this.el.nativeElement, 'value', '');
        }
    }
    getValidDateValueFromDate(date) {
        if (this.dateIOService) {
            const dateString = this.dateIOService.toLocaleDisplayFormatString(date);
            return this.dateIOService.getDateValueFromDateString(dateString);
        }
        else {
            return null;
        }
    }
    emitDateOutput(date) {
        if (!datesAreEqual(date, this.previousDateChange)) {
            this.dateChange.emit(date);
            this.previousDateChange = date;
        }
        else if (!date && this.previousDateChange) {
            this.dateChange.emit(null);
            this.previousDateChange = null;
        }
    }
    listenForControlValueChanges() {
        if (this.datepickerHasFormControl()) {
            return this.control.valueChanges
                .pipe(
            // only update date value if not being set by user
            filter(() => !this.datepickerFocusService.elementIsFocused(this.el.nativeElement)))
                .subscribe((value) => this.updateDate(this.dateIOService.getDateValueFromDateString(value)));
        }
        else {
            return null;
        }
    }
    listenForUserSelectedDayChanges() {
        return this.userSelectedDayChange.subscribe(dayModel => this.updateDate(dayModel?.toDate(), true));
    }
    listenForTouchChanges() {
        return this.dateFormControlService.touchedChange
            .pipe(filter(() => this.datepickerHasFormControl()))
            .subscribe(() => this.control.control.markAsTouched());
    }
    listenForDirtyChanges() {
        return this.dateFormControlService.dirtyChange
            .pipe(filter(() => this.datepickerHasFormControl()))
            .subscribe(() => this.control.control.markAsDirty());
    }
    listenForInputRefocus() {
        return this.dateNavigationService.selectedDayChange
            .pipe(filter(date => !!date && !this.dateNavigationService.isRangePicker))
            .subscribe(() => this.datepickerFocusService.focusInput(this.el.nativeElement));
    }
    /**
     * In case of date range error, both start & end date field validation has to be triggered
     * if either of the field gets updated
     */
    validateDateRange() {
        if (this.dateNavigationService.isRangePicker) {
            const controls = this.ngControlService?.controls;
            const isValid = this.dateNavigationService.selectedDay?.isBefore(this.dateNavigationService.selectedEndDay, true);
            if (isValid && controls?.some(control => control.hasError('range'))) {
                controls.forEach((ngControl) => {
                    ngControl?.control?.updateValueAndValidity({ emitEvent: false });
                });
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDateInputBase, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1$1.NgControl, optional: true, self: true }, { token: forwardRef(() => ClrDateContainer), optional: true }, { token: DateIOService, optional: true }, { token: DateNavigationService, optional: true }, { token: DatepickerEnabledService, optional: true }, { token: DateFormControlService, optional: true }, { token: PLATFORM_ID }, { token: i1$2.FormsFocusService, optional: true }, { token: DatepickerFocusService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrDateInputBase, isStandalone: true, inputs: { placeholder: "placeholder", disabled: "disabled" }, host: { listeners: { "focus": "setFocusStates()", "change": "onValueChange($event.target)" }, properties: { "disabled": "this.disabled", "attr.placeholder": "this.placeholderText", "attr.type": "this.inputType" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDateInputBase, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1$1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: ClrDateContainer, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [forwardRef(() => ClrDateContainer)]
                }] }, { type: DateIOService, decorators: [{
                    type: Optional
                }] }, { type: DateNavigationService, decorators: [{
                    type: Optional
                }] }, { type: DatepickerEnabledService, decorators: [{
                    type: Optional
                }] }, { type: DateFormControlService, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i1$2.FormsFocusService, decorators: [{
                    type: Optional
                }] }, { type: DatepickerFocusService }], propDecorators: { placeholder: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: ['disabled']
            }, {
                type: HostBinding,
                args: ['disabled']
            }], placeholderText: [{
                type: HostBinding,
                args: ['attr.placeholder']
            }], inputType: [{
                type: HostBinding,
                args: ['attr.type']
            }], setFocusStates: [{
                type: HostListener,
                args: ['focus']
            }], onValueChange: [{
                type: HostListener,
                args: ['change', ['$event.target']]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDateInput extends ClrDateInputBase {
    constructor() {
        super(...arguments);
        this.dateChange = new EventEmitter(false);
    }
    set date(date) {
        this.setDate(date);
    }
    set min(dateString) {
        this.dateIOService.setMinDate(dateString);
    }
    set max(dateString) {
        this.dateIOService.setMaxDate(dateString);
    }
    get userSelectedDayChange() {
        return this.dateNavigationService.selectedDayChange;
    }
    updateDayModel(dayModel) {
        this.dateNavigationService.persistedDate = this.dateNavigationService.selectedDay = dayModel;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDateInput, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrDateInput, isStandalone: false, selector: "[clrDate]", inputs: { date: ["clrDate", "date"], min: "min", max: "max" }, outputs: { dateChange: "clrDateChange" }, host: { properties: { "class.clr-input": "true", "class.clr-date-input": "true" } }, providers: [DatepickerFocusService], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDateInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDate]',
                    host: {
                        '[class.clr-input]': 'true',
                        '[class.clr-date-input]': 'true',
                    },
                    providers: [DatepickerFocusService],
                    standalone: false,
                }]
        }], propDecorators: { dateChange: [{
                type: Output,
                args: ['clrDateChange']
            }], date: [{
                type: Input,
                args: ['clrDate']
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStartDateInput extends ClrDateInputBase {
    constructor() {
        super(...arguments);
        this.dateChange = new EventEmitter(false);
        this.inputWidth = 13;
    }
    set date(date) {
        this.setDate(date);
    }
    get inputSize() {
        return this.inputWidth;
    }
    get userSelectedDayChange() {
        return this.dateNavigationService.selectedDayChange;
    }
    ngOnInit() {
        super.ngOnInit();
        this.subscriptions.push(this.dateIOService.minDateChange.subscribe(() => this.triggerControlInputValidation()));
    }
    updateDayModel(dayModel) {
        this.dateNavigationService.persistedDate = this.dateNavigationService.selectedDay = dayModel;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStartDateInput, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrStartDateInput, isStandalone: false, selector: "[clrStartDate]", inputs: { inputWidth: "inputWidth", date: ["clrStartDate", "date"] }, outputs: { dateChange: "clrStartDateChange" }, host: { properties: { "class.clr-input": "true", "class.clr-date-start-input": "true", "style.text-align": "'right'", "attr.size": "this.inputSize" } }, providers: [DatepickerFocusService], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStartDateInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrStartDate]',
                    host: {
                        '[class.clr-input]': 'true',
                        '[class.clr-date-start-input]': 'true',
                        '[style.text-align]': "'right'",
                    },
                    providers: [DatepickerFocusService],
                    standalone: false,
                }]
        }], propDecorators: { dateChange: [{
                type: Output,
                args: ['clrStartDateChange']
            }], inputWidth: [{
                type: Input,
                args: ['inputWidth']
            }], date: [{
                type: Input,
                args: ['clrStartDate']
            }], inputSize: [{
                type: HostBinding,
                args: ['attr.size']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrEndDateInput extends ClrDateInputBase {
    constructor() {
        super(...arguments);
        this.dateChange = new EventEmitter(false);
        this.inputWidth = 13;
    }
    set date(date) {
        this.setDate(date);
    }
    get inputSize() {
        return this.inputWidth;
    }
    get userSelectedDayChange() {
        return this.dateNavigationService.selectedEndDayChange;
    }
    ngOnInit() {
        super.ngOnInit();
        this.subscriptions.push(this.dateIOService.maxDateChange.subscribe(() => this.triggerControlInputValidation()));
    }
    updateDayModel(dayModel) {
        this.dateNavigationService.persistedEndDate = this.dateNavigationService.selectedEndDay = dayModel;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrEndDateInput, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrEndDateInput, isStandalone: false, selector: "[clrEndDate]", inputs: { inputWidth: "inputWidth", date: ["clrEndDate", "date"] }, outputs: { dateChange: "clrEndDateChange" }, host: { properties: { "class.clr-input": "true", "class.clr-date-end-input": "true", "attr.size": "this.inputSize" } }, providers: [DatepickerFocusService], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrEndDateInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrEndDate]',
                    host: {
                        '[class.clr-input]': 'true',
                        '[class.clr-date-end-input]': 'true',
                    },
                    providers: [DatepickerFocusService],
                    standalone: false,
                }]
        }], propDecorators: { dateChange: [{
                type: Output,
                args: ['clrEndDateChange']
            }], inputWidth: [{
                type: Input,
                args: ['inputWidth']
            }], date: [{
                type: Input,
                args: ['clrEndDate']
            }], inputSize: [{
                type: HostBinding,
                args: ['attr.size']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDateInputValidator {
    constructor(dateIOService) {
        this.dateIOService = dateIOService;
    }
    validate(control) {
        if (this.dateIOService) {
            const value = this.dateIOService.getDateValueFromDateString(control.value);
            const minDate = this.dateIOService.disabledDates.minDate.toDate();
            const maxDate = this.dateIOService.disabledDates.maxDate.toDate();
            if (value && value < minDate) {
                return { min: { min: minDate.toLocaleDateString(), actual: value.toLocaleDateString() } };
            }
            else if (value && value > maxDate) {
                return { max: { max: maxDate.toLocaleDateString(), actual: value.toLocaleDateString() } };
            }
        }
        return null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDateInputValidator, deps: [{ token: DateIOService, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrDateInputValidator, isStandalone: false, selector: "[clrDate], [clrStartDate], [clrEndDate]", providers: [{ provide: NG_VALIDATORS, useExisting: ClrDateInputValidator, multi: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDateInputValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDate], [clrStartDate], [clrEndDate]',
                    providers: [{ provide: NG_VALIDATORS, useExisting: ClrDateInputValidator, multi: true }],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DateIOService, decorators: [{
                    type: Optional
                }] }] });
class ClrStartDateInputValidator {
    constructor(dateIOService, dateNavigationService) {
        this.dateIOService = dateIOService;
        this.dateNavigationService = dateNavigationService;
    }
    validate(control) {
        if (this.dateIOService) {
            const value = this.dateIOService.getDateValueFromDateString(control.value);
            const endDate = this.dateNavigationService?.selectedEndDay?.toDate();
            if (value && endDate && value > endDate) {
                return { range: { startDate: value, endDate } };
            }
        }
        return null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStartDateInputValidator, deps: [{ token: DateIOService, optional: true }, { token: DateNavigationService, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrStartDateInputValidator, isStandalone: false, selector: "[clrStartDate]", providers: [{ provide: NG_VALIDATORS, useExisting: ClrStartDateInputValidator, multi: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStartDateInputValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrStartDate]',
                    providers: [{ provide: NG_VALIDATORS, useExisting: ClrStartDateInputValidator, multi: true }],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DateIOService, decorators: [{
                    type: Optional
                }] }, { type: DateNavigationService, decorators: [{
                    type: Optional
                }] }] });
class ClrEndDateInputValidator {
    constructor(dateIOService, dateNavigationService) {
        this.dateIOService = dateIOService;
        this.dateNavigationService = dateNavigationService;
    }
    validate(control) {
        if (this.dateIOService) {
            const value = this.dateIOService.getDateValueFromDateString(control.value);
            const startDate = this.dateNavigationService?.selectedDay?.toDate();
            if (value && startDate && value < startDate) {
                return { range: { startDate, endDate: value } };
            }
        }
        return null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrEndDateInputValidator, deps: [{ token: DateIOService, optional: true }, { token: DateNavigationService, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrEndDateInputValidator, isStandalone: false, selector: "[clrEndDate]", providers: [{ provide: NG_VALIDATORS, useExisting: ClrEndDateInputValidator, multi: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrEndDateInputValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrEndDate]',
                    providers: [{ provide: NG_VALIDATORS, useExisting: ClrEndDateInputValidator, multi: true }],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DateIOService, decorators: [{
                    type: Optional
                }] }, { type: DateNavigationService, decorators: [{
                    type: Optional
                }] }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_DATEPICKER_DIRECTIVES = [
    ClrDateInput,
    ClrDay,
    ClrDateContainer,
    ClrDateInputValidator,
    ClrStartDateInput,
    ClrEndDateInput,
    ClrStartDateInputValidator,
    ClrEndDateInputValidator,
    ClrDatepickerViewManager,
    ClrMonthpicker,
    ClrYearpicker,
    ClrDaypicker,
    ClrCalendar,
    ClrDatepickerActions,
];
class ClrDatepickerModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon, angleIcon, eventIcon, calendarIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatepickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrDatepickerModule, declarations: [ClrDateInput,
            ClrDay,
            ClrDateContainer,
            ClrDateInputValidator,
            ClrStartDateInput,
            ClrEndDateInput,
            ClrStartDateInputValidator,
            ClrEndDateInputValidator,
            ClrDatepickerViewManager,
            ClrMonthpicker,
            ClrYearpicker,
            ClrDaypicker,
            ClrCalendar,
            ClrDatepickerActions], imports: [CommonModule,
            CdkTrapFocusModule,
            ClrHostWrappingModule,
            ClrConditionalModule,
            _lrClrPopoverModuleNext,
            ClrIcon,
            ClrCommonFormsModule$1,
            ClrVerticalNavModule], exports: [ClrDateInput,
            ClrDay,
            ClrDateContainer,
            ClrDateInputValidator,
            ClrStartDateInput,
            ClrEndDateInput,
            ClrStartDateInputValidator,
            ClrEndDateInputValidator,
            ClrDatepickerViewManager,
            ClrMonthpicker,
            ClrYearpicker,
            ClrDaypicker,
            ClrCalendar,
            ClrDatepickerActions] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatepickerModule, imports: [CommonModule,
            CdkTrapFocusModule,
            ClrHostWrappingModule,
            ClrConditionalModule,
            _lrClrPopoverModuleNext,
            ClrIcon,
            ClrCommonFormsModule$1,
            ClrVerticalNavModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatepickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        CdkTrapFocusModule,
                        ClrHostWrappingModule,
                        ClrConditionalModule,
                        _lrClrPopoverModuleNext,
                        ClrIcon,
                        ClrCommonFormsModule$1,
                        ClrVerticalNavModule,
                    ],
                    declarations: [CLR_DATEPICKER_DIRECTIVES],
                    exports: [CLR_DATEPICKER_DIRECTIVES],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function buildFileList(files) {
    const dataTransfer = new DataTransfer();
    for (const file of files) {
        dataTransfer.items.add(file);
    }
    return dataTransfer.files;
}
function selectFiles(fileInputElement, files) {
    fileInputElement.files = files instanceof FileList ? files : buildFileList(files);
    fileInputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}
function clearFiles(fileInputElement) {
    fileInputElement.value = '';
    fileInputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_FILE_MESSAGES_TEMPLATE_CONTEXT = new InjectionToken('ClrFileMessagesTemplateContext');
class ClrFileInfo {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileInfo, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrFileInfo, isStandalone: false, selector: "clr-file-info", host: { properties: { "class.clr-subtext": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileInfo, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-file-info',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.clr-subtext]': 'true',
                    },
                    standalone: false,
                }]
        }] });
class ClrFileSuccess {
    constructor() {
        this.context = inject(CLR_FILE_MESSAGES_TEMPLATE_CONTEXT);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileSuccess, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrFileSuccess, isStandalone: false, selector: "clr-file-success", host: { properties: { "style.display": "context.success ? \"inline-block\" : \"none\"", "class.clr-subtext": "true", "class.success": "true" } }, ngImport: i0, template: `@if (context.success) {
    <ng-content></ng-content>
  }`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileSuccess, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-file-success',
                    // We check for success here so that consumers don't have to.
                    template: `@if (context.success) {
    <ng-content></ng-content>
  }`,
                    host: {
                        '[style.display]': 'context.success ? "inline-block" : "none"',
                        '[class.clr-subtext]': 'true',
                        '[class.success]': 'true',
                    },
                    standalone: false,
                }]
        }] });
class ClrFileError {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileError, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrFileError, isStandalone: false, selector: "clr-file-error", host: { properties: { "class.clr-subtext": "true", "class.error": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileError, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-file-error',
                    // The host should have an `*ngIf` or `@if` that checks for the relevant error.
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.clr-subtext]': 'true',
                        '[class.error]': 'true',
                    },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFileMessagesTemplate {
    constructor() {
        this.templateRef = inject(TemplateRef);
    }
    static ngTemplateContextGuard(directive, context) {
        return true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileMessagesTemplate, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrFileMessagesTemplate, isStandalone: false, selector: "ng-template[clr-file-messages]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileMessagesTemplate, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[clr-file-messages]',
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFileList {
    constructor() {
        this.injector = inject(Injector);
        this.commonStrings = inject(ClrCommonStringsService);
        this.ngControlService = inject(NgControlService$1, { optional: true });
        this.fileInputContainer = inject(ClrFileInputContainer, { optional: true });
        if (!this.ngControlService || !this.fileInputContainer) {
            throw new Error('The clr-file-list component can only be used within a clr-file-input-container.');
        }
    }
    get files() {
        if (!this.fileInputContainer.fileInput) {
            return [];
        }
        const fileInputElement = this.fileInputContainer.fileInput.elementRef.nativeElement;
        return Array.from(fileInputElement.files).sort((a, b) => a.name.localeCompare(b.name));
    }
    getClearFileLabel(filename) {
        return this.commonStrings.parse(this.commonStrings.keys.clearFile, {
            FILE: filename,
        });
    }
    clearFile(fileToRemove) {
        if (!this.fileInputContainer.fileInput) {
            return;
        }
        const fileInputElement = this.fileInputContainer.fileInput.elementRef.nativeElement;
        const files = Array.from(fileInputElement.files);
        const newFiles = files.filter(file => file !== fileToRemove);
        selectFiles(fileInputElement, newFiles);
        this.fileInputContainer.focusBrowseButton();
    }
    createFileMessagesTemplateContext(file) {
        const fileInputErrors = this.ngControlService.controls[0].errors || {};
        const errors = {
            accept: fileInputErrors.accept?.find(error => error.name === file.name),
            minFileSize: fileInputErrors.minFileSize?.find(error => error.name === file.name),
            maxFileSize: fileInputErrors.maxFileSize?.find(error => error.name === file.name),
        };
        const success = Object.values(errors).every(error => !error);
        return { $implicit: file, success, errors };
    }
    createFileMessagesTemplateInjector(fileMessagesTemplateContext) {
        return Injector.create({
            parent: this.injector,
            providers: [{ provide: CLR_FILE_MESSAGES_TEMPLATE_CONTEXT, useValue: fileMessagesTemplateContext }],
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileList, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrFileList, isStandalone: false, selector: "clr-file-list", host: { properties: { "attr.role": "\"list\"", "class.clr-file-list": "true" } }, queries: [{ propertyName: "fileMessagesTemplate", first: true, predicate: ClrFileMessagesTemplate, descendants: true }], ngImport: i0, template: `
    @for (file of files; track file) {
      @if (createFileMessagesTemplateContext(file); as fileMessagesTemplateContext) {
        <div
          role="listitem"
          class="clr-file-list-item"
          [ngClass]="{
            'clr-error': !fileMessagesTemplateContext.success,
            'clr-success': fileMessagesTemplateContext.success,
          }"
        >
          <div class="clr-file-label-and-status-icon">
            <span class="label clr-file-label">
              {{ file.name }}
              <button
                class="btn btn-sm btn-link-neutral btn-icon clr-file-clear-button"
                [attr.aria-label]="getClearFileLabel(file.name)"
                (click)="clearFile(file)"
              >
                <cds-icon shape="times"></cds-icon>
              </button>
            </span>
            <cds-icon
              class="clr-validate-icon"
              [shape]="fileMessagesTemplateContext.success ? 'check-circle' : 'exclamation-circle'"
              [status]="fileMessagesTemplateContext.success ? 'success' : 'danger'"
              aria-hidden="true"
            ></cds-icon>
          </div>
          @if (fileMessagesTemplate) {
            <ng-container
              [ngTemplateOutlet]="fileMessagesTemplate.templateRef"
              [ngTemplateOutletContext]="fileMessagesTemplateContext"
              [ngTemplateOutletInjector]="createFileMessagesTemplateInjector(fileMessagesTemplateContext)"
            ></ng-container>
          }
        </div>
      }
    }
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileList, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-file-list',
                    template: `
    @for (file of files; track file) {
      @if (createFileMessagesTemplateContext(file); as fileMessagesTemplateContext) {
        <div
          role="listitem"
          class="clr-file-list-item"
          [ngClass]="{
            'clr-error': !fileMessagesTemplateContext.success,
            'clr-success': fileMessagesTemplateContext.success,
          }"
        >
          <div class="clr-file-label-and-status-icon">
            <span class="label clr-file-label">
              {{ file.name }}
              <button
                class="btn btn-sm btn-link-neutral btn-icon clr-file-clear-button"
                [attr.aria-label]="getClearFileLabel(file.name)"
                (click)="clearFile(file)"
              >
                <cds-icon shape="times"></cds-icon>
              </button>
            </span>
            <cds-icon
              class="clr-validate-icon"
              [shape]="fileMessagesTemplateContext.success ? 'check-circle' : 'exclamation-circle'"
              [status]="fileMessagesTemplateContext.success ? 'success' : 'danger'"
              aria-hidden="true"
            ></cds-icon>
          </div>
          @if (fileMessagesTemplate) {
            <ng-container
              [ngTemplateOutlet]="fileMessagesTemplate.templateRef"
              [ngTemplateOutletContext]="fileMessagesTemplateContext"
              [ngTemplateOutletInjector]="createFileMessagesTemplateInjector(fileMessagesTemplateContext)"
            ></ng-container>
          }
        </div>
      }
    }
  `,
                    host: {
                        '[attr.role]': '"list"',
                        '[class.clr-file-list]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [], propDecorators: { fileMessagesTemplate: [{
                type: ContentChild,
                args: [ClrFileMessagesTemplate]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFileInputContainer extends ClrAbstractContainer$1 {
    constructor() {
        super(...arguments);
        this.commonStrings = inject(ClrCommonStringsService);
    }
    get accept() {
        return this.fileInput.elementRef.nativeElement.accept;
    }
    get multiple() {
        return this.fileInput.elementRef.nativeElement.multiple;
    }
    get disabled() {
        return this.fileInput.elementRef.nativeElement.disabled || (this.control && this.control.disabled);
    }
    get browseButtonText() {
        const selectionButtonLabel = this.fileList ? undefined : this.fileInput?.selection?.buttonLabel;
        return selectionButtonLabel || this.customButtonLabel || this.commonStrings.keys.browse;
    }
    get browseButtonDescribedBy() {
        return `${this.label?.forAttr} ${this.fileInput.elementRef.nativeElement.getAttribute('aria-describedby')}`;
    }
    get successMessagePresent() {
        return super.successMessagePresent || !!this.fileSuccessComponent;
    }
    get errorMessagePresent() {
        return super.errorMessagePresent || !!this.fileErrorComponent;
    }
    focusBrowseButton() {
        this.browseButtonElementRef.nativeElement.focus();
    }
    browse() {
        const fileInputElementRef = this.fileList && this.multiple ? this.fileListFileInputElementRef : this.fileInput.elementRef;
        fileInputElementRef.nativeElement.click();
    }
    clearSelectedFiles() {
        this.fileInput.elementRef.nativeElement.value = '';
        this.fileInput.elementRef.nativeElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        this.focusBrowseButton();
    }
    addFilesToSelection(newFiles) {
        if (!newFiles.length) {
            return;
        }
        // start with new files
        const mergedFiles = [...newFiles];
        // add existing files if a new file doesn't have the same name
        for (const existingFile of this.fileInput.elementRef.nativeElement.files) {
            if (!mergedFiles.some(file => file.name === existingFile.name)) {
                mergedFiles.push(existingFile);
            }
        }
        // update file selection
        selectFiles(this.fileInput.elementRef.nativeElement, mergedFiles);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileInputContainer, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrFileInputContainer, isStandalone: false, selector: "clr-file-input-container", inputs: { customButtonLabel: ["clrButtonLabel", "customButtonLabel"] }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService$1, ControlIdService$1, ControlClassService$1], queries: [{ propertyName: "fileInput", first: true, predicate: i0.forwardRef(() => ClrFileInput), descendants: true }, { propertyName: "fileList", first: true, predicate: i0.forwardRef(() => ClrFileList), descendants: true }, { propertyName: "fileSuccessComponent", first: true, predicate: ClrFileSuccess, descendants: true }, { propertyName: "fileErrorComponent", first: true, predicate: ClrFileError, descendants: true }], viewQueries: [{ propertyName: "browseButtonElementRef", first: true, predicate: ["browseButton"], descendants: true }, { propertyName: "fileListFileInputElementRef", first: true, predicate: ["fileListFileInput"], descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-file-input-wrapper">
        <ng-content select="[clrFileInput]"></ng-content>

        <!-- file input to handle adding new files to selection when file list is present (prevent replacing selected files on the main file input) -->
        @if (fileList) {
          <input
            #fileListFileInput
            type="file"
            class="clr-file-input"
            tabindex="-1"
            aria-hidden="true"
            [accept]="accept"
            [multiple]="multiple"
            [disabled]="disabled"
            (change)="addFilesToSelection(fileListFileInput.files)"
          />
        }

        <button
          #browseButton
          type="button"
          class="btn btn-sm clr-file-input-browse-button"
          [attr.aria-describedby]="browseButtonDescribedBy"
          [disabled]="disabled"
          (click)="browse()"
        >
          <cds-icon shape="folder-open"></cds-icon>
          <span class="clr-file-input-browse-button-text">{{ browseButtonText }}</span>
        </button>
        @if (!fileList && fileInput?.selection?.fileCount) {
          <button
            type="button"
            class="btn btn-sm clr-file-input-clear-button"
            [attr.aria-label]="fileInput?.selection?.clearFilesButtonLabel"
            (click)="clearSelectedFiles()"
          >
            <cds-icon shape="times" status="neutral"></cds-icon>
          </button>
        }
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

      <!-- If this is present, this file input becomes an "advanced" file input. -->
      <ng-container>
        <div class="clr-file-list-break"></div>
        <ng-content select="clr-file-list"></ng-content>
      </ng-container>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i1$2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileInputContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-file-input-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-file-input-wrapper">
        <ng-content select="[clrFileInput]"></ng-content>

        <!-- file input to handle adding new files to selection when file list is present (prevent replacing selected files on the main file input) -->
        @if (fileList) {
          <input
            #fileListFileInput
            type="file"
            class="clr-file-input"
            tabindex="-1"
            aria-hidden="true"
            [accept]="accept"
            [multiple]="multiple"
            [disabled]="disabled"
            (change)="addFilesToSelection(fileListFileInput.files)"
          />
        }

        <button
          #browseButton
          type="button"
          class="btn btn-sm clr-file-input-browse-button"
          [attr.aria-describedby]="browseButtonDescribedBy"
          [disabled]="disabled"
          (click)="browse()"
        >
          <cds-icon shape="folder-open"></cds-icon>
          <span class="clr-file-input-browse-button-text">{{ browseButtonText }}</span>
        </button>
        @if (!fileList && fileInput?.selection?.fileCount) {
          <button
            type="button"
            class="btn btn-sm clr-file-input-clear-button"
            [attr.aria-label]="fileInput?.selection?.clearFilesButtonLabel"
            (click)="clearSelectedFiles()"
          >
            <cds-icon shape="times" status="neutral"></cds-icon>
          </button>
        }
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

      <!-- If this is present, this file input becomes an "advanced" file input. -->
      <ng-container>
        <div class="clr-file-list-break"></div>
        <ng-content select="clr-file-list"></ng-content>
      </ng-container>
    </div>
  `,
                    host: {
                        '[class.clr-form-control]': 'true',
                        '[class.clr-form-control-disabled]': 'disabled',
                        '[class.clr-row]': 'addGrid()',
                    },
                    providers: [NgControlService$1, ControlIdService$1, ControlClassService$1],
                    standalone: false,
                }]
        }], propDecorators: { customButtonLabel: [{
                type: Input,
                args: ['clrButtonLabel']
            }], fileInput: [{
                type: ContentChild,
                args: [forwardRef(() => ClrFileInput)]
            }], fileList: [{
                type: ContentChild,
                args: [forwardRef(() => ClrFileList)]
            }], browseButtonElementRef: [{
                type: ViewChild,
                args: ['browseButton']
            }], fileListFileInputElementRef: [{
                type: ViewChild,
                args: ['fileListFileInput']
            }], fileSuccessComponent: [{
                type: ContentChild,
                args: [ClrFileSuccess]
            }], fileErrorComponent: [{
                type: ContentChild,
                args: [ClrFileError]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFileInput extends WrappedFormControl$1 {
    constructor(injector, renderer, viewContainerRef, elementRef, control, commonStrings) {
        super(viewContainerRef, ClrFileInputContainer, injector, control, renderer, elementRef);
        this.elementRef = elementRef;
        this.control = control;
        this.commonStrings = commonStrings;
        this.selection = undefined;
    }
    get disabled() {
        return this.elementRef.nativeElement.disabled || (this.control && this.control.disabled);
    }
    handleChange() {
        this.updateSelection();
    }
    updateSelection() {
        const files = this.elementRef.nativeElement.files;
        let selectionButtonLabel;
        let clearFilesButtonLabel;
        if (files?.length === 1) {
            const filename = files[0].name;
            selectionButtonLabel = filename;
            clearFilesButtonLabel = this.commonStrings.parse(this.commonStrings.keys.clearFile, {
                FILE: filename,
            });
        }
        else if (files?.length > 1) {
            const fileCount = files.length.toString();
            selectionButtonLabel = this.commonStrings.parse(this.commonStrings.keys.fileCount, {
                COUNT: fileCount,
            });
            clearFilesButtonLabel = this.commonStrings.parse(this.commonStrings.keys.clearFiles, {
                COUNT: fileCount,
            });
        }
        this.selection = {
            fileCount: files.length,
            buttonLabel: selectionButtonLabel,
            clearFilesButtonLabel,
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileInput, deps: [{ token: i0.Injector }, { token: i0.Renderer2 }, { token: i0.ViewContainerRef }, { token: i0.ElementRef }, { token: i1$1.NgControl, optional: true, self: true }, { token: i2$1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrFileInput, isStandalone: false, selector: "input[type=\"file\"][clrFileInput]", host: { attributes: { "tabindex": "-1", "aria-hidden": "true" }, listeners: { "change": "handleChange()" }, properties: { "class.clr-file-input": "true", "disabled": "this.disabled" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileInput, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="file"][clrFileInput]',
                    host: {
                        tabindex: '-1', // Remove the hidden file `input` element from the tab order because the browse `button` replaces it.
                        'aria-hidden': 'true', // Remove the hidden file `input` element from the accessibility tree because the browse `button` replaces it.
                        '[class.clr-file-input]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.Injector }, { type: i0.Renderer2 }, { type: i0.ViewContainerRef }, { type: i0.ElementRef }, { type: i1$1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i2$1.ClrCommonStringsService }], propDecorators: { disabled: [{
                type: HostBinding,
                args: ['disabled']
            }], handleChange: [{
                type: HostListener,
                args: ['change']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFileInputValidator {
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    validate(control) {
        const files = control.value;
        const fileInputElement = this.elementRef.nativeElement;
        const errors = {};
        // required validation (native attribute)
        if (fileInputElement.required && files?.length === 0) {
            errors.required = true;
        }
        const accept = fileInputElement.accept ? fileInputElement.accept.split(',').map(type => type.trim()) : null;
        if (files?.length > 0 && (accept || this.minFileSize || this.maxFileSize)) {
            for (let i = 0; i < files.length; i++) {
                const file = files.item(i);
                // accept validation (native attribute)
                if (accept && accept.length) {
                    if (!this.validateAccept(file, accept)) {
                        errors.accept = errors.accept || [];
                        errors.accept.push({
                            name: file.name,
                            accept,
                            type: file.type || '',
                            extension: this.getSuffixByDepth(file.name, 2), // last up to 2 parts for reporting
                        });
                    }
                }
                // min file validation (custom input)
                if (this.minFileSize && file.size < this.minFileSize) {
                    errors.minFileSize = errors.minFileSize || [];
                    errors.minFileSize.push({ name: file.name, minFileSize: this.minFileSize, actualFileSize: file.size });
                }
                // max file validation (custom input)
                if (this.maxFileSize && file.size > this.maxFileSize) {
                    errors.maxFileSize = errors.maxFileSize || [];
                    errors.maxFileSize.push({ name: file.name, maxFileSize: this.maxFileSize, actualFileSize: file.size });
                }
            }
        }
        return Object.keys(errors).length ? errors : null;
    }
    getSuffixByDepth(filename, depth) {
        const match = filename.toLowerCase().match(new RegExp(`(\\.[^.]+){1,${depth}}$`, 'i'));
        return match ? match[0] : '';
    }
    validateAccept(file, acceptList) {
        const name = file.name.toLowerCase();
        const type = (file.type || '').toLowerCase();
        for (const entryRaw of acceptList) {
            const entry = entryRaw.trim().toLowerCase();
            if (!entry) {
                continue;
            }
            // Extension check
            if (entry.startsWith('.')) {
                const depth = (entry.match(/\./g) || []).length;
                if (this.getSuffixByDepth(name, depth) === entry) {
                    return true;
                }
                continue;
            }
            // MIME check
            if (entry.endsWith('/*')) {
                const prefix = entry.slice(0, entry.length - 1); // keep trailing slash
                if (type.startsWith(prefix)) {
                    return true;
                }
            }
            else if (entry.includes('/') && type === entry) {
                return true;
            }
        }
        return false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileInputValidator, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrFileInputValidator, isStandalone: false, selector: "input[type=\"file\"][clrFileInput]", inputs: { minFileSize: ["clrMinFileSize", "minFileSize"], maxFileSize: ["clrMaxFileSize", "maxFileSize"] }, providers: [{ provide: NG_VALIDATORS, useExisting: ClrFileInputValidator, multi: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileInputValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="file"][clrFileInput]',
                    providers: [{ provide: NG_VALIDATORS, useExisting: ClrFileInputValidator, multi: true }],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { minFileSize: [{
                type: Input,
                args: ['clrMinFileSize']
            }], maxFileSize: [{
                type: Input,
                args: ['clrMaxFileSize']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFileInputValueAccessor {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.onChange = (_value) => { };
        this.onTouched = () => { };
    }
    writeValue(value) {
        if (value !== undefined && value !== null && !(value instanceof FileList)) {
            throw new Error('The value of a file input control must be a FileList.');
        }
        if (value) {
            selectFiles(this.elementRef.nativeElement, value);
        }
        else if (this.elementRef.nativeElement.files.length) {
            clearFiles(this.elementRef.nativeElement);
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    handleChange() {
        this.onTouched();
        this.onChange(this.elementRef.nativeElement.files);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileInputValueAccessor, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrFileInputValueAccessor, isStandalone: false, selector: "input[type=\"file\"][clrFileInput]", host: { listeners: { "change": "handleChange()" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: ClrFileInputValueAccessor, multi: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileInputValueAccessor, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="file"][clrFileInput]',
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: ClrFileInputValueAccessor, multi: true }],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { handleChange: [{
                type: HostListener,
                args: ['change']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFileInputModule {
    constructor() {
        ClarityIcons.addIcons(folderOpenIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrFileInputModule, declarations: [ClrFileInput,
            ClrFileInputContainer,
            ClrFileInputValidator,
            ClrFileInputValueAccessor,
            ClrFileList,
            ClrFileMessagesTemplate,
            ClrFileInfo,
            ClrFileSuccess,
            ClrFileError], imports: [CommonModule, ClrIcon, ClrCommonFormsModule$1], exports: [ClrCommonFormsModule$1,
            ClrFileInput,
            ClrFileInputContainer,
            ClrFileInputValidator,
            ClrFileInputValueAccessor,
            ClrFileList,
            ClrFileMessagesTemplate,
            ClrFileInfo,
            ClrFileSuccess,
            ClrFileError] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileInputModule, imports: [CommonModule, ClrIcon, ClrCommonFormsModule$1, ClrCommonFormsModule$1] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFileInputModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrCommonFormsModule$1],
                    declarations: [
                        ClrFileInput,
                        ClrFileInputContainer,
                        ClrFileInputValidator,
                        ClrFileInputValueAccessor,
                        ClrFileList,
                        ClrFileMessagesTemplate,
                        ClrFileInfo,
                        ClrFileSuccess,
                        ClrFileError,
                    ],
                    exports: [
                        ClrCommonFormsModule$1,
                        ClrFileInput,
                        ClrFileInputContainer,
                        ClrFileInputValidator,
                        ClrFileInputValueAccessor,
                        ClrFileList,
                        ClrFileMessagesTemplate,
                        ClrFileInfo,
                        ClrFileSuccess,
                        ClrFileError,
                    ],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrInputContainer extends ClrAbstractContainer$1 {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrInputContainer, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrInputContainer, isStandalone: false, selector: "clr-input-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService$1, ControlIdService$1, ControlClassService$1], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group">
          <ng-content select="[clrInputPrefix]"></ng-content>
          <ng-content select="[clrInput]"></ng-content>
          <ng-content select="[clrInputSuffix]"></ng-content>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i1$2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrInputContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-input-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper">
        <div class="clr-input-group">
          <ng-content select="[clrInputPrefix]"></ng-content>
          <ng-content select="[clrInput]"></ng-content>
          <ng-content select="[clrInputSuffix]"></ng-content>
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
                    providers: [NgControlService$1, ControlIdService$1, ControlClassService$1],
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrInput extends WrappedFormControl$1 {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrInputContainer, injector, control, renderer, el);
        this.index = 1;
        if (this.el.nativeElement.getAttribute('type') === 'number') {
            console.warn(`Warning: Inputs of type "number" should utilize the number-input component for proper handling.\n
  Example usage:
  <clr-number-input-container>
    <label>Number Input</label>
    <input clrNumberInput type="number"/>
  </clr-number-input-container>
      `);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrInput, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrInput, isStandalone: false, selector: "[clrInput]", host: { properties: { "class.clr-input": "true" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrInput]',
                    host: { '[class.clr-input]': 'true' },
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
class ClrInputModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon // caret
        );
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrInputModule, declarations: [ClrInput, ClrInputContainer], imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1], exports: [ClrCommonFormsModule$1, ClrInput, ClrInputContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrInputModule, imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1, ClrCommonFormsModule$1] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrInputModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1],
                    declarations: [ClrInput, ClrInputContainer],
                    exports: [ClrCommonFormsModule$1, ClrInput, ClrInputContainer],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrNumberInputContainer extends ClrAbstractContainer$1 {
    constructor(controlClassService, layoutService, ngControlService, focusService) {
        super(layoutService, controlClassService, ngControlService);
        this.focus = false;
        this.subscriptions.push(focusService.focusChange.subscribe(state => (this.focus = state)));
    }
    focusOut() {
        this.input.dispatchBlur();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrNumberInputContainer, deps: [{ token: i1$2.ControlClassService }, { token: i1$2.LayoutService, optional: true }, { token: i1$2.NgControlService }, { token: i1$2.FormsFocusService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrNumberInputContainer, isStandalone: false, selector: "clr-number-input-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-form-control-readonly": "input.readonly", "class.clr-row": "addGrid()" } }, providers: [FormsFocusService$1, NgControlService$1, ControlIdService$1, ControlClassService$1], queries: [{ propertyName: "input", first: true, predicate: i0.forwardRef(() => ClrNumberInput), descendants: true }], usesInheritance: true, ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i1$2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrNumberInputContainer, decorators: [{
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
                    providers: [FormsFocusService$1, NgControlService$1, ControlIdService$1, ControlClassService$1],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$2.ControlClassService }, { type: i1$2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1$2.NgControlService }, { type: i1$2.FormsFocusService }], propDecorators: { input: [{
                type: ContentChild,
                args: [forwardRef(() => ClrNumberInput)]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrNumberInput extends WrappedFormControl$1 {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrNumberInput, deps: [{ token: i1$2.FormsFocusService, optional: true }, { token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrNumberInput, isStandalone: false, selector: "input[type=\"number\"][clrNumberInput]", host: { listeners: { "focus": "triggerFocus()" }, properties: { "class.clr-input": "true", "class.clr-number-input": "true" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrNumberInput, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="number"][clrNumberInput]',
                    host: { '[class.clr-input]': 'true', '[class.clr-number-input]': 'true' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$2.FormsFocusService, decorators: [{
                    type: Optional
                }] }, { type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1$1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }], propDecorators: { triggerFocus: [{
                type: HostListener,
                args: ['focus']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrNumberInputModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon, minusIcon, plusIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrNumberInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrNumberInputModule, declarations: [ClrNumberInput, ClrNumberInputContainer], imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1], exports: [ClrCommonFormsModule$1, ClrNumberInput, ClrNumberInputContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrNumberInputModule, imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1, ClrCommonFormsModule$1] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrNumberInputModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1],
                    declarations: [ClrNumberInput, ClrNumberInputContainer],
                    exports: [ClrCommonFormsModule$1, ClrNumberInput, ClrNumberInputContainer],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const TOGGLE_SERVICE = new InjectionToken(undefined);
function ToggleServiceFactory() {
    return new BehaviorSubject(false);
}
const TOGGLE_SERVICE_PROVIDER = { provide: TOGGLE_SERVICE, useFactory: ToggleServiceFactory };
class ClrPasswordContainer extends ClrAbstractContainer$1 {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrPasswordContainer, deps: [{ token: i1$2.LayoutService, optional: true }, { token: i1$2.ControlClassService }, { token: i1$2.NgControlService }, { token: i1$2.FormsFocusService }, { token: TOGGLE_SERVICE }, { token: i2$1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrPasswordContainer, isStandalone: false, selector: "clr-password-container", inputs: { clrToggle: "clrToggle" }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService$1, ControlIdService$1, ControlClassService$1, FormsFocusService$1, TOGGLE_SERVICE_PROVIDER], usesInheritance: true, ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i1$2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrPasswordContainer, decorators: [{
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
                    providers: [NgControlService$1, ControlIdService$1, ControlClassService$1, FormsFocusService$1, TOGGLE_SERVICE_PROVIDER],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1$2.ControlClassService }, { type: i1$2.NgControlService }, { type: i1$2.FormsFocusService }, { type: i2.BehaviorSubject, decorators: [{
                    type: Inject,
                    args: [TOGGLE_SERVICE]
                }] }, { type: i2$1.ClrCommonStringsService }], propDecorators: { clrToggle: [{
                type: Input,
                args: ['clrToggle']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPassword extends WrappedFormControl$1 {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrPassword, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i1$2.FormsFocusService, optional: true }, { token: TOGGLE_SERVICE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrPassword, isStandalone: false, selector: "[clrPassword]", host: { listeners: { "focus": "triggerFocus()" }, properties: { "class.clr-input": "true" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrPassword, decorators: [{
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
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i1$2.FormsFocusService, decorators: [{
                    type: Optional
                }] }, { type: i2.BehaviorSubject, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [TOGGLE_SERVICE]
                }] }], propDecorators: { triggerFocus: [{
                type: HostListener,
                args: ['focus']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPasswordModule {
    constructor() {
        ClarityIcons.addIcons(eyeHideIcon, eyeIcon, exclamationCircleIcon, checkCircleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrPasswordModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrPasswordModule, declarations: [ClrPassword, ClrPasswordContainer], imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1], exports: [ClrCommonFormsModule$1, ClrPassword, ClrPasswordContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrPasswordModule, imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1, ClrCommonFormsModule$1] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrPasswordModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1],
                    declarations: [ClrPassword, ClrPasswordContainer],
                    exports: [ClrCommonFormsModule$1, ClrPassword, ClrPasswordContainer],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

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
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrRadioWrapper, isStandalone: false, selector: "clr-radio-wrapper", host: { properties: { "class.clr-radio-wrapper": "true" } }, providers: [ControlIdService$1], queries: [{ propertyName: "label", first: true, predicate: ClrControlLabel$1, descendants: true, static: true }], ngImport: i0, template: `
    <ng-content select="[clrRadio]"></ng-content>
    <ng-content select="label"></ng-content>
    @if (!label) {
      <label></label>
    }
  `, isInline: true, dependencies: [{ kind: "directive", type: i1$2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
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
                    providers: [ControlIdService$1],
                    standalone: false,
                }]
        }], propDecorators: { label: [{
                type: ContentChild,
                args: [ClrControlLabel$1, { static: true }]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrRadio extends WrappedFormControl$1 {
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
class ClrRadioContainer extends ClrAbstractContainer$1 {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRadioContainer, deps: [{ token: i1$2.LayoutService, optional: true }, { token: i1$2.ControlClassService }, { token: i1$2.NgControlService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrRadioContainer, isStandalone: false, selector: "clr-radio-container", inputs: { clrInline: "clrInline" }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()", "attr.role": "role", "attr.aria-labelledby": "ariaLabelledBy" } }, providers: [NgControlService$1, ControlClassService$1, ContainerIdService$1], queries: [{ propertyName: "groupLabel", first: true, predicate: ClrControlLabel$1, descendants: true, read: ElementRef, static: true }, { propertyName: "radios", predicate: ClrRadio, descendants: true }], usesInheritance: true, ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1$2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
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
                    providers: [NgControlService$1, ControlClassService$1, ContainerIdService$1],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1$2.ControlClassService }, { type: i1$2.NgControlService }], propDecorators: { radios: [{
                type: ContentChildren,
                args: [ClrRadio, { descendants: true }]
            }], groupLabel: [{
                type: ContentChild,
                args: [ClrControlLabel$1, { read: ElementRef, static: true }]
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
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrRadioModule, declarations: [ClrRadio, ClrRadioContainer, ClrRadioWrapper], imports: [CommonModule, ClrCommonFormsModule$1, ClrHostWrappingModule, ClrIcon], exports: [ClrCommonFormsModule$1, ClrRadio, ClrRadioContainer, ClrRadioWrapper] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRadioModule, imports: [CommonModule, ClrCommonFormsModule$1, ClrHostWrappingModule, ClrIcon, ClrCommonFormsModule$1] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRadioModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrCommonFormsModule$1, ClrHostWrappingModule, ClrIcon],
                    declarations: [ClrRadio, ClrRadioContainer, ClrRadioWrapper],
                    exports: [ClrCommonFormsModule$1, ClrRadio, ClrRadioContainer, ClrRadioWrapper],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrSelectContainer extends ClrAbstractContainer$1 {
    constructor(layoutService, controlClassService, ngControlService) {
        super(layoutService, controlClassService, ngControlService);
        this.layoutService = layoutService;
        this.controlClassService = controlClassService;
        this.ngControlService = ngControlService;
    }
    get multi() {
        return this.control?.valueAccessor instanceof SelectMultipleControlValueAccessor;
    }
    wrapperClass() {
        return this.multi ? 'clr-multiselect-wrapper' : 'clr-select-wrapper';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrSelectContainer, deps: [{ token: i1$2.LayoutService, optional: true }, { token: i1$2.ControlClassService }, { token: i1$2.NgControlService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrSelectContainer, isStandalone: false, selector: "clr-select-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService$1, ControlIdService$1, ControlClassService$1], queries: [{ propertyName: "multiple", first: true, predicate: SelectMultipleControlValueAccessor, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div [ngClass]="wrapperClass()">
        <ng-content select="[clrSelect]"></ng-content>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i1$2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrSelectContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-select-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div [ngClass]="wrapperClass()">
        <ng-content select="[clrSelect]"></ng-content>
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
                    providers: [NgControlService$1, ControlIdService$1, ControlClassService$1],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1$2.ControlClassService }, { type: i1$2.NgControlService }], propDecorators: { multiple: [{
                type: ContentChild,
                args: [SelectMultipleControlValueAccessor, { static: false }]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrSelect extends WrappedFormControl$1 {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrSelectContainer, injector, control, renderer, el);
        this.index = 1;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrSelect, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrSelect, isStandalone: false, selector: "[clrSelect]", host: { properties: { "class.clr-select": "true" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrSelect, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrSelect]',
                    host: { '[class.clr-select]': 'true' },
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
class ClrSelectModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrSelectModule, declarations: [ClrSelect, ClrSelectContainer], imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1], exports: [ClrCommonFormsModule$1, ClrSelect, ClrSelectContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrSelectModule, imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1, ClrCommonFormsModule$1] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1],
                    declarations: [ClrSelect, ClrSelectContainer],
                    exports: [ClrCommonFormsModule$1, ClrSelect, ClrSelectContainer],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTextareaContainer extends ClrAbstractContainer$1 {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTextareaContainer, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrTextareaContainer, isStandalone: false, selector: "clr-textarea-container", host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService$1, ControlIdService$1, ControlClassService$1], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-textarea-wrapper">
        <ng-content select="[clrTextarea]"></ng-content>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i1$2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTextareaContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-textarea-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-textarea-wrapper">
        <ng-content select="[clrTextarea]"></ng-content>
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
                    providers: [NgControlService$1, ControlIdService$1, ControlClassService$1],
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTextarea extends WrappedFormControl$1 {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrTextareaContainer, injector, control, renderer, el);
        this.index = 1;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTextarea, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrTextarea, isStandalone: false, selector: "[clrTextarea]", host: { properties: { "class.clr-textarea": "true" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTextarea, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrTextarea]',
                    host: { '[class.clr-textarea]': 'true' },
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
class ClrTextareaModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTextareaModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrTextareaModule, declarations: [ClrTextarea, ClrTextareaContainer], imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1], exports: [ClrCommonFormsModule$1, ClrTextarea, ClrTextareaContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTextareaModule, imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1, ClrCommonFormsModule$1] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTextareaModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIcon, ClrCommonFormsModule$1],
                    declarations: [ClrTextarea, ClrTextareaContainer],
                    exports: [ClrCommonFormsModule$1, ClrTextarea, ClrTextareaContainer],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrRangeContainer extends ClrAbstractContainer$1 {
    constructor(layoutService, controlClassService, ngControlService, renderer, idService) {
        super(layoutService, controlClassService, ngControlService);
        this.renderer = renderer;
        this.idService = idService;
        this._hasProgress = false;
    }
    get hasProgress() {
        return this._hasProgress;
    }
    set hasProgress(val) {
        const valBool = !!val;
        if (valBool !== this._hasProgress) {
            this._hasProgress = valBool;
        }
    }
    getRangeProgressFillWidth() {
        const input = this.selectRangeElement();
        if (!input) {
            return this.lastRangeProgressFillWidth;
        }
        const inputWidth = input.offsetWidth;
        const inputMinValue = +input.min;
        let inputMaxValue = +input.max;
        if (inputMinValue === 0 && inputMaxValue === 0) {
            inputMaxValue = 100;
        }
        const inputMiddle = (inputMinValue + inputMaxValue) / 2;
        const inputValue = !!this.control && this.control.value !== undefined ? this.control.value : inputMiddle;
        const valueAsPercent = ((inputValue - inputMinValue) * 100) / (inputMaxValue - inputMinValue);
        this.lastRangeProgressFillWidth = (valueAsPercent * inputWidth) / 100 + 'px';
        return this.lastRangeProgressFillWidth;
    }
    selectRangeElement() {
        try {
            return this.renderer.selectRootElement('[clrRange]#' + this.idService.id);
        }
        catch {
            return undefined;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRangeContainer, deps: [{ token: i1$2.LayoutService, optional: true }, { token: i1$2.ControlClassService }, { token: i1$2.NgControlService }, { token: i0.Renderer2 }, { token: i1$2.ControlIdService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrRangeContainer, isStandalone: false, selector: "clr-range-container", inputs: { hasProgress: ["clrRangeHasProgress", "hasProgress"] }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService$1, ControlIdService$1, ControlClassService$1], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-range-wrapper" [class.progress-fill]="hasProgress">
        <ng-content select="[clrRange]"></ng-content>
        @if (hasProgress) {
          <span class="fill-input" [style.width]="getRangeProgressFillWidth()"></span>
        }
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1$2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRangeContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-range-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-range-wrapper" [class.progress-fill]="hasProgress">
        <ng-content select="[clrRange]"></ng-content>
        @if (hasProgress) {
          <span class="fill-input" [style.width]="getRangeProgressFillWidth()"></span>
        }
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
                    providers: [NgControlService$1, ControlIdService$1, ControlClassService$1],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1$2.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1$2.ControlClassService }, { type: i1$2.NgControlService }, { type: i0.Renderer2 }, { type: i1$2.ControlIdService }], propDecorators: { hasProgress: [{
                type: Input,
                args: ['clrRangeHasProgress']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrRange extends WrappedFormControl$1 {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrRangeContainer, injector, control, renderer, el);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRange, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrRange, isStandalone: false, selector: "[clrRange]", host: { properties: { "class.clr-range": "true" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRange, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrRange]',
                    host: { '[class.clr-range]': 'true' },
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
class ClrRangeModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRangeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrRangeModule, declarations: [ClrRange, ClrRangeContainer], imports: [CommonModule, ClrCommonFormsModule$1, ClrHostWrappingModule, ClrIcon], exports: [ClrCommonFormsModule$1, ClrRange, ClrRangeContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRangeModule, imports: [CommonModule, ClrCommonFormsModule$1, ClrHostWrappingModule, ClrIcon, ClrCommonFormsModule$1] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRangeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrCommonFormsModule$1, ClrHostWrappingModule, ClrIcon],
                    declarations: [ClrRange, ClrRangeContainer],
                    exports: [ClrCommonFormsModule$1, ClrRange, ClrRangeContainer],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrFormsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFormsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrFormsModule, imports: [CommonModule], exports: [ClrCommonFormsModule$1,
            ClrCheckboxModule$1,
            ClrComboboxModule$1,
            ClrDatepickerModule$1,
            ClrFileInputModule$1,
            ClrInputModule$1,
            ClrPasswordModule$1,
            ClrRadioModule$1,
            ClrSelectModule$1,
            ClrTextareaModule$1,
            ClrRangeModule$1,
            ClrDatalistModule$1,
            ClrNumberInputModule$1] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFormsModule, imports: [CommonModule, ClrCommonFormsModule$1,
            ClrCheckboxModule$1,
            ClrComboboxModule$1,
            ClrDatepickerModule$1,
            ClrFileInputModule$1,
            ClrInputModule$1,
            ClrPasswordModule$1,
            ClrRadioModule$1,
            ClrSelectModule$1,
            ClrTextareaModule$1,
            ClrRangeModule$1,
            ClrDatalistModule$1,
            ClrNumberInputModule$1] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFormsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [
                        ClrCommonFormsModule$1,
                        ClrCheckboxModule$1,
                        ClrComboboxModule$1,
                        ClrDatepickerModule$1,
                        ClrFileInputModule$1,
                        ClrInputModule$1,
                        ClrPasswordModule$1,
                        ClrRadioModule$1,
                        ClrSelectModule$1,
                        ClrTextareaModule$1,
                        ClrRangeModule$1,
                        ClrDatalistModule$1,
                        ClrNumberInputModule$1,
                    ],
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

export { AbstractIfState, CHANGE_KEYS, CLR_DATEPICKER_DIRECTIVES, CLR_FILE_MESSAGES_TEMPLATE_CONTEXT, ClrAbstractContainer, ClrCalendar, ClrCheckbox, ClrCheckboxContainer, ClrCheckboxModule, ClrCheckboxWrapper, ClrCombobox, ClrComboboxContainer, ClrComboboxModule, ClrCommonFormsModule, ClrControl, ClrControlContainer, ClrControlError, ClrControlHelper, ClrControlLabel, ClrControlSuccess, ClrDatalist, ClrDatalistContainer, ClrDatalistInput, ClrDatalistModule, ClrDateContainer, ClrDateInput, ClrDateInputBase, ClrDateInputValidator, ClrDatepickerActions, ClrDatepickerModule, ClrDatepickerViewManager, ClrDay, ClrDaypicker, ClrEndDateInput, ClrEndDateInputValidator, ClrFileError, ClrFileInfo, ClrFileInput, ClrFileInputContainer, ClrFileInputModule, ClrFileInputValidator, ClrFileInputValueAccessor, ClrFileList, ClrFileMessagesTemplate, ClrFileSuccess, ClrForm, ClrFormLayout, ClrFormsModule, ClrIfError, ClrIfSuccess, ClrInput, ClrInputContainer, ClrInputModule, ClrLayout, ClrMonthpicker, ClrNumberInput, ClrNumberInputContainer, ClrNumberInputModule, ClrOption, ClrOptionGroup, ClrOptionItems, ClrOptionSelected, ClrOptions, ClrPassword, ClrPasswordContainer, ClrPasswordModule, ClrRadio, ClrRadioContainer, ClrRadioModule, ClrRadioWrapper, ClrRange, ClrRangeContainer, ClrRangeModule, ClrSelect, ClrSelectContainer, ClrSelectModule, ClrStartDateInput, ClrStartDateInputValidator, ClrTextarea, ClrTextareaContainer, ClrTextareaModule, ClrYearpicker, ContainerIdService, ControlClassService, ControlIdService, DatalistIdService, FormsFocusService, IS_TOGGLE, IS_TOGGLE_PROVIDER, LayoutService, MarkControlService, NgControlService, TOGGLE_SERVICE, TOGGLE_SERVICE_PROVIDER, ToggleServiceFactory, WrappedFormControl, buildFileList, clearFiles, isToggleFactory, selectFiles };
//# sourceMappingURL=clr-angular-forms.mjs.map
