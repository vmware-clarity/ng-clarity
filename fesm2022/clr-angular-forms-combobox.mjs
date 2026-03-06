import * as i3 from '@angular/common';
import { isPlatformBrowser, NgForOf, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Injectable, ViewChild, Optional, Component, Input, Directive, PLATFORM_ID, Inject, HostListener, HostBinding, DOCUMENT, ContentChildren, EventEmitter, ContentChild, Output, Self, NgModule } from '@angular/core';
import * as i1$1 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import * as i1 from '@clr/angular/forms/common';
import { ClrAbstractContainer, NgControlService, ControlIdService, ControlClassService, WrappedFormControl, ClrCommonFormsModule } from '@clr/angular/forms/common';
import * as i4 from '@clr/angular/icon';
import { ClarityIcons, exclamationCircleIcon, checkCircleIcon, angleIcon, windowCloseIcon, ClrIcon } from '@clr/angular/icon';
import * as i4$1 from '@clr/angular/popover/common';
import { POPOVER_HOST_ANCHOR, ClrPopoverPosition, ClrPopoverType, ClrPopoverHostDirective, ÇlrClrPopoverModuleNext as _lrClrPopoverModuleNext } from '@clr/angular/popover/common';
import * as i5 from '@clr/angular/progress/spinner';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';
import * as i3$1 from '@clr/angular/utils';
import { ArrowKeyDirection, Keys, customFocusableItemProvider, uniqueIdFactory, ClrLoadingState, IF_ACTIVE_ID, LoadingListener, IF_ACTIVE_ID_PROVIDER, FOCUS_SERVICE_PROVIDER, ClrConditionalModule, ClrKeyFocusModule } from '@clr/angular/utils';
import { take } from 'rxjs/operators';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ComboboxContainerService {
    constructor() {
        this.labelOffset = 0;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ComboboxContainerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ComboboxContainerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ComboboxContainerService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrComboboxContainer extends ClrAbstractContainer {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrComboboxContainer, deps: [{ token: i1.LayoutService, optional: true }, { token: i1.ControlClassService }, { token: i1.NgControlService }, { token: ComboboxContainerService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrComboboxContainer, isStandalone: false, selector: "clr-combobox-container", host: { properties: { "class.clr-form-control": "true", "class.clr-combobox-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()" } }, providers: [NgControlService, ControlIdService, ControlClassService, ComboboxContainerService], viewQueries: [{ propertyName: "controlContainer", first: true, predicate: ["controlContainer"], descendants: true }], usesInheritance: true, ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i4.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i1.ClrControlLabel, selector: "label", inputs: ["id", "for"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrComboboxContainer, decorators: [{
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
                    providers: [NgControlService, ControlIdService, ControlClassService, ComboboxContainerService],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i1.ControlClassService }, { type: i1.NgControlService }, { type: ComboboxContainerService }, { type: i0.ElementRef }], propDecorators: { controlContainer: [{
                type: ViewChild,
                args: ['controlContainer']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrOptionSelected {
    constructor(template) {
        this.template = template;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrOptionSelected, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrOptionSelected, isStandalone: false, selector: "[clrOptionSelected]", inputs: { selected: ["clrOptionSelected", "selected"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrOptionSelected, decorators: [{
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: OptionSelectionService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: OptionSelectionService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: OptionSelectionService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
        const key = event.key;
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
                }
            });
        }
    }
    focusOutOfComponent(event) {
        const target = event.relatedTarget;
        return !(this.textInput.contains(target) || this.trigger.contains(target) || this.listbox.contains(target));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ComboboxFocusHandler, deps: [{ token: i0.RendererFactory2 }, { token: i4$1.ClrPopoverService }, { token: OptionSelectionService }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ComboboxFocusHandler }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ComboboxFocusHandler, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.RendererFactory2 }, { type: i4$1.ClrPopoverService }, { type: OptionSelectionService }, { type: undefined, decorators: [{
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrOption, deps: [{ token: i0.ElementRef }, { token: i3$1.ClrCommonStringsService }, { token: ComboboxFocusHandler }, { token: OptionSelectionService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrOption, isStandalone: false, selector: "clr-option", inputs: { optionId: ["id", "optionId"], value: ["clrValue", "value"] }, host: { listeners: { "click": "onClick($event)" }, properties: { "class.clr-combobox-option": "true", "attr.role": "\"option\"", "attr.tabindex": "-1", "attr.id": "optionId", "class.active": "this.selected", "class.clr-focus": "this.focusClass" } }, ngImport: i0, template: `
    <ng-content></ng-content>
    @if (selected) {
      <span class="clr-sr-only">{{ commonStrings.keys.comboboxSelected }}</span>
    }
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrOption, decorators: [{
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
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i3$1.ClrCommonStringsService }, { type: ComboboxFocusHandler }, { type: OptionSelectionService }], propDecorators: { optionId: [{
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrOptions, deps: [{ token: OptionSelectionService }, { token: IF_ACTIVE_ID }, { token: i0.ElementRef }, { token: i3$1.ClrCommonStringsService }, { token: ComboboxFocusHandler }, { token: i4$1.ClrPopoverService }, { token: POPOVER_HOST_ANCHOR, optional: true }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrOptions, isStandalone: false, selector: "clr-options", inputs: { optionsId: ["id", "optionsId"] }, host: { properties: { "class.clr-combobox-options": "true", "class.clr-combobox-options-hidden": "emptyOptions && editable", "attr.role": "\"listbox\"", "id": "optionsId" } }, providers: [{ provide: LoadingListener, useExisting: ClrOptions }], queries: [{ propertyName: "items", predicate: ClrOption, descendants: true }], ngImport: i0, template: `
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrOptions, decorators: [{
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
                }] }, { type: i0.ElementRef }, { type: i3$1.ClrCommonStringsService }, { type: ComboboxFocusHandler }, { type: i4$1.ClrPopoverService }, { type: i0.ElementRef, decorators: [{
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCombobox extends WrappedFormControl {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrCombobox, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1$1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: OptionSelectionService }, { token: i3$1.ClrCommonStringsService }, { token: i4$1.ClrPopoverService }, { token: ComboboxContainerService, optional: true }, { token: PLATFORM_ID }, { token: ComboboxFocusHandler }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrCombobox, isStandalone: false, selector: "clr-combobox", inputs: { placeholder: "placeholder", editable: ["clrEditable", "editable"], multiSelect: ["clrMulti", "multiSelect"] }, outputs: { clrInputChange: "clrInputChange", clrOpenChange: "clrOpenChange", clrSelectionChange: "clrSelectionChange" }, host: { listeners: { "keydown": "onKeyUp($event)" }, properties: { "class.aria-required": "true", "class.clr-combobox": "true", "class.clr-combobox-disabled": "control?.disabled" } }, providers: [
            OptionSelectionService,
            { provide: LoadingListener, useExisting: ClrCombobox },
            IF_ACTIVE_ID_PROVIDER,
            FOCUS_SERVICE_PROVIDER,
            COMBOBOX_FOCUS_HANDLER_PROVIDER,
        ], queries: [{ propertyName: "optionSelected", first: true, predicate: ClrOptionSelected, descendants: true }, { propertyName: "options", first: true, predicate: ClrOptions, descendants: true }], viewQueries: [{ propertyName: "textbox", first: true, predicate: ["textboxInput"], descendants: true }, { propertyName: "trigger", first: true, predicate: ["trigger"], descendants: true }], usesInheritance: true, hostDirectives: [{ directive: i4$1.ClrPopoverHostDirective }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<!-- The (click) handler is needed to auto-focus on input field which can not currently occupy the whole\nwidth of the component, after being wrapped to a new line -->\n<div\n  class=\"clr-combobox-wrapper\"\n  clrPopoverAnchor\n  (click)=\"onWrapperClick($event)\"\n  [class.multi]=\"multiSelect\"\n  [class.invalid]=\"(control?.control.touched && control?.invalid)\"\n  [class.disabled]=\"control?.disabled\"\n>\n  @if (multiSelect && optionSelectionService.selectionModel.model && multiSelectModel.length > 0) {\n  <span\n    role=\"grid\"\n    clrRovingTabindex\n    [clrRovingTabindexDisabled]=\"control?.disabled\"\n    clrDirection=\"both\"\n    [attr.aria-label]=\"getSelectionAriaLabel()\"\n    [attr.aria-disabled]=\"control?.disabled? true: null\"\n    class=\"clr-combobox-pills\"\n  >\n    @for (item of multiSelectModel; track item; let i = $index) {\n    <span class=\"label label-combobox-pill\" role=\"row\">\n      <span role=\"gridcell\">\n        <span class=\"clr-combobox-pill-content\" clrKeyFocusItem>\n          @if (optionSelected) {\n          <ng-container\n            [ngTemplateOutlet]=\"optionSelected.template\"\n            [ngTemplateOutletContext]=\"{$implicit: optionSelectionService.selectionModel.model[i]}\"\n          ></ng-container>\n          }\n        </span>\n      </span>\n      <span role=\"gridcell\">\n        <button\n          clrKeyFocusItem\n          type=\"button\"\n          class=\"clr-combobox-remove-btn\"\n          [disabled]=\"control?.disabled? true: null\"\n          [attr.aria-label]=\"commonStrings.keys.comboboxDelete + ' ' + optionSelectionService.selectionModel.toString(displayField, i)\"\n          (click)=\"unselect(item)\"\n        >\n          <cds-icon shape=\"window-close\" size=\"12\"></cds-icon>\n        </button>\n      </span>\n    </span>\n    }\n  </span>\n  }\n\n  <input\n    #textboxInput\n    type=\"text\"\n    role=\"combobox\"\n    [id]=\"inputId()\"\n    class=\"clr-input clr-combobox-input\"\n    [(ngModel)]=\"searchText\"\n    (blur)=\"onBlur($event)\"\n    (focus)=\"onFocus()\"\n    (change)=\"onChange()\"\n    [attr.aria-expanded]=\"openState\"\n    [attr.aria-owns]=\"ariaOwns\"\n    aria-haspopup=\"listbox\"\n    aria-autocomplete=\"list\"\n    autocomplete=\"off\"\n    [attr.aria-invalid]=\"control?.invalid? true: null\"\n    [disabled]=\"control?.disabled? true: null\"\n    [attr.aria-activedescendant]=\"getActiveDescendant()\"\n    [attr.placeholder]=\"placeholder\"\n  />\n\n  <!-- No click handler, as it uses the handler on the .clr-combobox-wrapper -->\n  <button\n    #trigger\n    type=\"button\"\n    class=\"clr-combobox-trigger\"\n    tabindex=\"-1\"\n    [disabled]=\"control?.disabled || null\"\n    [attr.aria-label]=\"commonStrings.keys.comboboxOpen\"\n  >\n    <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n  </button>\n\n  <div class=\"clr-focus-indicator\" [class.clr-focus]=\"focused\"></div>\n</div>\n\n<!-- Both close handlers are handled manually.\n'outsideClickToClose' has complex handling that's necessary\nto be manual due to the component architecture -->\n<div role=\"dialog\" *clrPopoverContent=\"openState; at popoverPosition; type: popoverType;\">\n  <ng-content></ng-content>\n</div>\n", dependencies: [{ kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1$1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i4.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: i3$1.ClrRovingTabindex, selector: "[clrRovingTabindex]", inputs: ["clrRovingTabindex", "clrRovingTabindexDisabled"] }, { kind: "directive", type: i3$1.ClrKeyFocusItem, selector: "[clrKeyFocusItem]" }, { kind: "directive", type: i4$1.ClrPopoverAnchor, selector: "[clrPopoverAnchor]" }, { kind: "directive", type: i4$1.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentAvailablePositions", "clrPopoverContentType", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrCombobox, decorators: [{
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
                    }, standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<!-- The (click) handler is needed to auto-focus on input field which can not currently occupy the whole\nwidth of the component, after being wrapped to a new line -->\n<div\n  class=\"clr-combobox-wrapper\"\n  clrPopoverAnchor\n  (click)=\"onWrapperClick($event)\"\n  [class.multi]=\"multiSelect\"\n  [class.invalid]=\"(control?.control.touched && control?.invalid)\"\n  [class.disabled]=\"control?.disabled\"\n>\n  @if (multiSelect && optionSelectionService.selectionModel.model && multiSelectModel.length > 0) {\n  <span\n    role=\"grid\"\n    clrRovingTabindex\n    [clrRovingTabindexDisabled]=\"control?.disabled\"\n    clrDirection=\"both\"\n    [attr.aria-label]=\"getSelectionAriaLabel()\"\n    [attr.aria-disabled]=\"control?.disabled? true: null\"\n    class=\"clr-combobox-pills\"\n  >\n    @for (item of multiSelectModel; track item; let i = $index) {\n    <span class=\"label label-combobox-pill\" role=\"row\">\n      <span role=\"gridcell\">\n        <span class=\"clr-combobox-pill-content\" clrKeyFocusItem>\n          @if (optionSelected) {\n          <ng-container\n            [ngTemplateOutlet]=\"optionSelected.template\"\n            [ngTemplateOutletContext]=\"{$implicit: optionSelectionService.selectionModel.model[i]}\"\n          ></ng-container>\n          }\n        </span>\n      </span>\n      <span role=\"gridcell\">\n        <button\n          clrKeyFocusItem\n          type=\"button\"\n          class=\"clr-combobox-remove-btn\"\n          [disabled]=\"control?.disabled? true: null\"\n          [attr.aria-label]=\"commonStrings.keys.comboboxDelete + ' ' + optionSelectionService.selectionModel.toString(displayField, i)\"\n          (click)=\"unselect(item)\"\n        >\n          <cds-icon shape=\"window-close\" size=\"12\"></cds-icon>\n        </button>\n      </span>\n    </span>\n    }\n  </span>\n  }\n\n  <input\n    #textboxInput\n    type=\"text\"\n    role=\"combobox\"\n    [id]=\"inputId()\"\n    class=\"clr-input clr-combobox-input\"\n    [(ngModel)]=\"searchText\"\n    (blur)=\"onBlur($event)\"\n    (focus)=\"onFocus()\"\n    (change)=\"onChange()\"\n    [attr.aria-expanded]=\"openState\"\n    [attr.aria-owns]=\"ariaOwns\"\n    aria-haspopup=\"listbox\"\n    aria-autocomplete=\"list\"\n    autocomplete=\"off\"\n    [attr.aria-invalid]=\"control?.invalid? true: null\"\n    [disabled]=\"control?.disabled? true: null\"\n    [attr.aria-activedescendant]=\"getActiveDescendant()\"\n    [attr.placeholder]=\"placeholder\"\n  />\n\n  <!-- No click handler, as it uses the handler on the .clr-combobox-wrapper -->\n  <button\n    #trigger\n    type=\"button\"\n    class=\"clr-combobox-trigger\"\n    tabindex=\"-1\"\n    [disabled]=\"control?.disabled || null\"\n    [attr.aria-label]=\"commonStrings.keys.comboboxOpen\"\n  >\n    <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n  </button>\n\n  <div class=\"clr-focus-indicator\" [class.clr-focus]=\"focused\"></div>\n</div>\n\n<!-- Both close handlers are handled manually.\n'outsideClickToClose' has complex handling that's necessary\nto be manual due to the component architecture -->\n<div role=\"dialog\" *clrPopoverContent=\"openState; at popoverPosition; type: popoverType;\">\n  <ng-content></ng-content>\n</div>\n" }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1$1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: OptionSelectionService }, { type: i3$1.ClrCommonStringsService }, { type: i4$1.ClrPopoverService }, { type: ComboboxContainerService, decorators: [{
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrOptionItems, deps: [{ token: i0.TemplateRef }, { token: i0.IterableDiffers }, { token: OptionSelectionService }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrOptionItems, isStandalone: false, selector: "[clrOptionItems][clrOptionItemsOf]", inputs: { rawItems: ["clrOptionItemsOf", "rawItems"], trackBy: ["clrOptionItemsTrackBy", "trackBy"], field: ["clrOptionItemsField", "field"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrOptionItems, decorators: [{
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrOptionGroup {
    constructor() {
        this.labelId = uniqueIdFactory();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrOptionGroup, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrOptionGroup, isStandalone: false, selector: "clr-option-group", inputs: { label: ["clrOptionGroupLabel", "label"] }, host: { properties: { "attr.role": "\"group\"", "attr.aria-labelledby": "labelId", "style.display": "clrOptionItems.hasResults ? undefined : \"none\"" } }, queries: [{ propertyName: "clrOptionItems", first: true, predicate: ClrOptionItems, descendants: true }], ngImport: i0, template: `
    <span [id]="labelId" class="clr-option-group-label" role="presentation">{{ label }}</span>
    <ng-content></ng-content>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrOptionGroup, decorators: [{
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrComboboxModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon, angleIcon, windowCloseIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrComboboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrComboboxModule, declarations: [ClrCombobox,
            ClrComboboxContainer,
            ClrOptions,
            ClrOption,
            ClrOptionGroup,
            ClrOptionSelected,
            ClrOptionItems], imports: [CommonModule,
            FormsModule,
            ClrIcon,
            ClrKeyFocusModule,
            ClrCommonFormsModule,
            ClrConditionalModule,
            _lrClrPopoverModuleNext,
            ClrSpinnerModule], exports: [ClrCommonFormsModule,
            ClrCombobox,
            ClrComboboxContainer,
            ClrOptions,
            ClrOption,
            ClrOptionGroup,
            ClrOptionSelected,
            ClrConditionalModule,
            ClrOptionItems] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrComboboxModule, imports: [CommonModule,
            FormsModule,
            ClrIcon,
            ClrKeyFocusModule,
            ClrCommonFormsModule,
            ClrConditionalModule,
            _lrClrPopoverModuleNext,
            ClrSpinnerModule, ClrCommonFormsModule,
            ClrConditionalModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrComboboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ClrIcon,
                        ClrKeyFocusModule,
                        ClrCommonFormsModule,
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
                        ClrCommonFormsModule,
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ClrCombobox, ClrComboboxContainer, ClrComboboxModule, ClrOption, ClrOptionGroup, ClrOptionItems, ClrOptionSelected, ClrOptions };
//# sourceMappingURL=clr-angular-forms-combobox.mjs.map
