/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import { Component, ContentChild, EventEmitter, HostListener, Inject, Input, Optional, Output, PLATFORM_ID, Self, ViewChild, } from '@angular/core';
import { IF_ACTIVE_ID_PROVIDER } from '../../utils/conditional/if-active.service';
import { Keys } from '../../utils/enums/keys.enum';
import { FOCUS_SERVICE_PROVIDER } from '../../utils/focus/focus.service';
import { ClrLoadingState } from '../../utils/loading/loading';
import { LoadingListener } from '../../utils/loading/loading-listener';
import { ClrAlignment } from '../../utils/popover/enums/alignment.enum';
import { ClrAxis } from '../../utils/popover/enums/axis.enum';
import { ClrSide } from '../../utils/popover/enums/side.enum';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { CONTROL_STATE } from '../common/if-control-state/if-control-state.service';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrComboboxContainer } from './combobox-container';
import { MultiSelectComboboxModel } from './model/multi-select-combobox.model';
import { SingleSelectComboboxModel } from './model/single-select-combobox.model';
import { ClrOptionSelected } from './option-selected.directive';
import { ClrOptions } from './options';
import { COMBOBOX_FOCUS_HANDLER_PROVIDER } from './providers/combobox-focus-handler.service';
import { OptionSelectionService } from './providers/option-selection.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "./providers/option-selection.service";
import * as i3 from "../../utils/i18n/common-strings.service";
import * as i4 from "../../utils/popover/providers/popover-toggle.service";
import * as i5 from "../../utils/popover/providers/popover-position.service";
import * as i6 from "../common/if-control-state/if-control-state.service";
import * as i7 from "./providers/combobox-container.service";
import * as i8 from "./providers/combobox-focus-handler.service";
import * as i9 from "../../utils/popover/popover-host.directive";
import * as i10 from "@angular/common";
import * as i11 from "../../icon/icon";
import * as i12 from "../../utils/focus/key-focus/roving-tabindex";
import * as i13 from "../../utils/focus/key-focus/key-focus-item";
import * as i14 from "../../utils/popover/popover-anchor";
import * as i15 from "../../utils/popover/popover-open-close-button";
import * as i16 from "../../utils/popover/popover-content";
export class ClrCombobox extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el, optionSelectionService, commonStrings, toggleService, positionService, controlStateService, containerService, platformId, focusHandler, cdr) {
        super(vcr, ClrComboboxContainer, injector, control, renderer, el);
        this.control = control;
        this.renderer = renderer;
        this.el = el;
        this.optionSelectionService = optionSelectionService;
        this.commonStrings = commonStrings;
        this.toggleService = toggleService;
        this.positionService = positionService;
        this.controlStateService = controlStateService;
        this.containerService = containerService;
        this.platformId = platformId;
        this.focusHandler = focusHandler;
        this.cdr = cdr;
        this.placeholder = '';
        this.clrInputChange = new EventEmitter(false);
        this.clrOpenChange = this.toggleService.openChange;
        /**
         * This output should be used to set up a live region using aria-live and populate it with updates that reflect each combobox change.
         */
        this.clrSelectionChange = this.optionSelectionService.selectionChanged;
        this.invalid = false;
        this.focused = false;
        this.smartPosition = {
            axis: ClrAxis.VERTICAL,
            side: ClrSide.AFTER,
            anchor: ClrAlignment.START,
            content: ClrAlignment.START,
        };
        this.index = 1;
        this._searchText = '';
        if (control) {
            control.valueAccessor = this;
        }
        // default to SingleSelectComboboxModel, in case the optional input [ClrMulti] isn't used
        optionSelectionService.selectionModel = new SingleSelectComboboxModel();
        this.updateControlValue();
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
    // Otherwise the label/component connection does not work and screen readers do not read the label.
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
            if (this.toggleService.open) {
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
        return this.toggleService.open;
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
        if (event.key === Keys.Backspace && this.multiSelect && this._searchText.length === 0) {
            const multiModel = this.optionSelectionService.selectionModel.model;
            if (multiModel && multiModel.length > 0) {
                const lastItem = multiModel[multiModel.length - 1];
                this.control?.control.markAsTouched();
                this.optionSelectionService.unselect(lastItem);
            }
        }
    }
    inputId() {
        return this.controlIdService.id;
    }
    loadingStateChange(state) {
        this.optionSelectionService.loading = state === ClrLoadingState.LOADING;
        this.positionService.realign();
        if (state !== ClrLoadingState.LOADING && isPlatformBrowser(this.platformId)) {
            this.focusFirstActive();
        }
    }
    unselect(item) {
        if (!this.disabled) {
            this.optionSelectionService.unselect(item);
        }
    }
    onBlur() {
        this.onTouchedCallback?.();
        if (this.control?.control.updateOn === 'change' && this.control.control.errors?.required) {
            this.updateControlValue();
        }
        if (this.control?.control.updateOn === 'blur') {
            this.control.control.updateValueAndValidity();
        }
        this.focused = false;
    }
    onFocus() {
        this.focused = true;
        // fix for "expression changed" error when focus is returned to a combobox after a modal is closed
        // https://github.com/vmware-clarity/ng-clarity/issues/663
        this.cdr.detectChanges();
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
    focusInput() {
        this.focusHandler.focusInput();
    }
    initializeSubscriptions() {
        this.subscriptions.push(this.optionSelectionService.selectionChanged.subscribe((newSelection) => {
            this.updateInputValue(newSelection);
            if (this.multiSelect) {
                this.positionService.realign();
            }
            if (!this.multiSelect && newSelection && !newSelection.isEmpty()) {
                this.toggleService.open = false;
            }
            this.updateControlValue();
        }));
        this.subscriptions.push(this.toggleService.openChange.subscribe(open => {
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
        this.subscriptions.push(this.toggleService.popoverAligned.subscribe(popoverNode => {
            // When used outside a combobox container
            if (!this.containerService) {
                return;
            }
            const popover = popoverNode;
            // Update position if popover hides the label
            if (popover.getBoundingClientRect().top < this.el.nativeElement.getBoundingClientRect().top) {
                this.renderer.setStyle(popoverNode, 'top', `${popover.offsetTop + this.containerService.labelOffset}px`);
            }
        }));
        if (this.controlStateService) {
            this.subscriptions.push(this.controlStateService.statusChanges.subscribe(invalid => {
                this.invalid = this.control?.control.touched && invalid === CONTROL_STATE.INVALID;
            }));
        }
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
}
ClrCombobox.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCombobox, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i2.OptionSelectionService }, { token: i3.ClrCommonStringsService }, { token: i4.ClrPopoverToggleService }, { token: i5.ClrPopoverPositionService }, { token: i6.IfControlStateService, optional: true }, { token: i7.ComboboxContainerService, optional: true }, { token: PLATFORM_ID }, { token: i8.ComboboxFocusHandler }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
ClrCombobox.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrCombobox, selector: "clr-combobox", inputs: { placeholder: "placeholder", multiSelect: ["clrMulti", "multiSelect"] }, outputs: { clrInputChange: "clrInputChange", clrOpenChange: "clrOpenChange", clrSelectionChange: "clrSelectionChange" }, host: { listeners: { "keydown": "onKeyUp($event)" }, properties: { "class.aria-required": "true", "class.clr-combobox": "true", "class.clr-combobox-disabled": "control?.disabled" } }, providers: [
        OptionSelectionService,
        { provide: LoadingListener, useExisting: ClrCombobox },
        IF_ACTIVE_ID_PROVIDER,
        FOCUS_SERVICE_PROVIDER,
        COMBOBOX_FOCUS_HANDLER_PROVIDER,
    ], queries: [{ propertyName: "optionSelected", first: true, predicate: ClrOptionSelected, descendants: true }, { propertyName: "options", first: true, predicate: ClrOptions, descendants: true }], viewQueries: [{ propertyName: "textbox", first: true, predicate: ["textboxInput"], descendants: true }, { propertyName: "trigger", first: true, predicate: ["trigger"], descendants: true }], usesInheritance: true, hostDirectives: [{ directive: i9.ClrPopoverHostDirective }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n-->\n\n<!-- The (click) handler is needed to auto-focus on input field which can not currently occupy the whole\n     width of the component, after being wrapped to a new line -->\n<div\n  class=\"clr-combobox-wrapper\"\n  clrPopoverAnchor\n  (click)=\"focusInput()\"\n  [class.multi]=\"multiSelect\"\n  [class.invalid]=\"invalid\"\n  [class.disabled]=\"control?.disabled? true: null\"\n>\n  <span\n    *ngIf=\"multiSelect && optionSelectionService.selectionModel.model\"\n    role=\"grid\"\n    clrRovingTabindex\n    [clrRovingTabindexDisabled]=\"control?.disabled\"\n    clrDirection=\"both\"\n    [attr.aria-label]=\"getSelectionAriaLabel()\"\n    [attr.aria-disabled]=\"control?.disabled? true: null\"\n  >\n    <span *ngFor=\"let item of multiSelectModel; let i = index\" class=\"label label-combobox-pill\" role=\"row\">\n      <span role=\"gridcell\">\n        <span class=\"clr-combobox-pill-content\" clrKeyFocusItem>\n          <ng-container\n            *ngIf=\"optionSelected\"\n            [ngTemplateOutlet]=\"optionSelected.template\"\n            [ngTemplateOutletContext]=\"{$implicit: optionSelectionService.selectionModel.model[i]}\"\n          ></ng-container>\n        </span>\n      </span>\n      <span role=\"gridcell\">\n        <button\n          clrKeyFocusItem\n          type=\"button\"\n          class=\"clr-combobox-remove-btn\"\n          [disabled]=\"control?.disabled? true: null\"\n          [attr.aria-label]=\"commonStrings.keys.comboboxDelete + ' ' + optionSelectionService.selectionModel.toString(displayField, i)\"\n          (click)=\"unselect(item)\"\n        >\n          <cds-icon shape=\"window-close\" size=\"12\"></cds-icon>\n        </button>\n      </span>\n    </span>\n  </span>\n\n  <span class=\"clr-combobox-input-wrapper\">\n    <input\n      #textboxInput\n      type=\"text\"\n      role=\"combobox\"\n      [id]=\"inputId()\"\n      class=\"clr-input clr-combobox-input\"\n      [(ngModel)]=\"searchText\"\n      (blur)=\"onBlur()\"\n      (focus)=\"onFocus()\"\n      [attr.aria-expanded]=\"openState\"\n      [attr.aria-owns]=\"ariaOwns\"\n      aria-haspopup=\"listbox\"\n      aria-autocomplete=\"list\"\n      autocomplete=\"off\"\n      [attr.aria-invalid]=\"control?.invalid? true: null\"\n      [disabled]=\"control?.disabled? true: null\"\n      [attr.aria-activedescendant]=\"getActiveDescendant()\"\n      [attr.placeholder]=\"placeholder\"\n    />\n  </span>\n\n  <!-- No click handler, as it uses the handler on the .clr-combobox-wrapper -->\n  <button\n    clrPopoverOpenCloseButton\n    #trigger\n    type=\"button\"\n    class=\"clr-combobox-trigger\"\n    tabindex=\"-1\"\n    [disabled]=\"control?.disabled || null\"\n    [attr.aria-label]=\"commonStrings.keys.comboboxOpen\"\n  >\n    <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n  </button>\n\n  <div class=\"clr-focus-indicator\" [class.clr-focus]=\"focused\"></div>\n</div>\n\n<!-- Both close handlers are handled manually due to issues in Edge browser.\n     Additionally 'outsideClickToClose' has complex handling that's necessary\n     to be manual due to the component architecture -->\n<div role=\"dialog\" *clrPopoverContent=\"openState at smartPosition; outsideClickToClose: false; scrollToClose: false\">\n  <ng-content></ng-content>\n</div>\n", dependencies: [{ kind: "directive", type: i10.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i10.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i10.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i11.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i12.ClrRovingTabindex, selector: "[clrRovingTabindex]", inputs: ["clrRovingTabindex", "clrRovingTabindexDisabled"] }, { kind: "directive", type: i13.ClrKeyFocusItem, selector: "[clrKeyFocusItem]" }, { kind: "directive", type: i14.ClrPopoverAnchor, selector: "[clrPopoverAnchor]" }, { kind: "directive", type: i15.ClrPopoverOpenCloseButton, selector: "[clrPopoverOpenCloseButton]", outputs: ["clrPopoverOpenCloseChange"] }, { kind: "directive", type: i16.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCombobox, decorators: [{
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
                    }, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n-->\n\n<!-- The (click) handler is needed to auto-focus on input field which can not currently occupy the whole\n     width of the component, after being wrapped to a new line -->\n<div\n  class=\"clr-combobox-wrapper\"\n  clrPopoverAnchor\n  (click)=\"focusInput()\"\n  [class.multi]=\"multiSelect\"\n  [class.invalid]=\"invalid\"\n  [class.disabled]=\"control?.disabled? true: null\"\n>\n  <span\n    *ngIf=\"multiSelect && optionSelectionService.selectionModel.model\"\n    role=\"grid\"\n    clrRovingTabindex\n    [clrRovingTabindexDisabled]=\"control?.disabled\"\n    clrDirection=\"both\"\n    [attr.aria-label]=\"getSelectionAriaLabel()\"\n    [attr.aria-disabled]=\"control?.disabled? true: null\"\n  >\n    <span *ngFor=\"let item of multiSelectModel; let i = index\" class=\"label label-combobox-pill\" role=\"row\">\n      <span role=\"gridcell\">\n        <span class=\"clr-combobox-pill-content\" clrKeyFocusItem>\n          <ng-container\n            *ngIf=\"optionSelected\"\n            [ngTemplateOutlet]=\"optionSelected.template\"\n            [ngTemplateOutletContext]=\"{$implicit: optionSelectionService.selectionModel.model[i]}\"\n          ></ng-container>\n        </span>\n      </span>\n      <span role=\"gridcell\">\n        <button\n          clrKeyFocusItem\n          type=\"button\"\n          class=\"clr-combobox-remove-btn\"\n          [disabled]=\"control?.disabled? true: null\"\n          [attr.aria-label]=\"commonStrings.keys.comboboxDelete + ' ' + optionSelectionService.selectionModel.toString(displayField, i)\"\n          (click)=\"unselect(item)\"\n        >\n          <cds-icon shape=\"window-close\" size=\"12\"></cds-icon>\n        </button>\n      </span>\n    </span>\n  </span>\n\n  <span class=\"clr-combobox-input-wrapper\">\n    <input\n      #textboxInput\n      type=\"text\"\n      role=\"combobox\"\n      [id]=\"inputId()\"\n      class=\"clr-input clr-combobox-input\"\n      [(ngModel)]=\"searchText\"\n      (blur)=\"onBlur()\"\n      (focus)=\"onFocus()\"\n      [attr.aria-expanded]=\"openState\"\n      [attr.aria-owns]=\"ariaOwns\"\n      aria-haspopup=\"listbox\"\n      aria-autocomplete=\"list\"\n      autocomplete=\"off\"\n      [attr.aria-invalid]=\"control?.invalid? true: null\"\n      [disabled]=\"control?.disabled? true: null\"\n      [attr.aria-activedescendant]=\"getActiveDescendant()\"\n      [attr.placeholder]=\"placeholder\"\n    />\n  </span>\n\n  <!-- No click handler, as it uses the handler on the .clr-combobox-wrapper -->\n  <button\n    clrPopoverOpenCloseButton\n    #trigger\n    type=\"button\"\n    class=\"clr-combobox-trigger\"\n    tabindex=\"-1\"\n    [disabled]=\"control?.disabled || null\"\n    [attr.aria-label]=\"commonStrings.keys.comboboxOpen\"\n  >\n    <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n  </button>\n\n  <div class=\"clr-focus-indicator\" [class.clr-focus]=\"focused\"></div>\n</div>\n\n<!-- Both close handlers are handled manually due to issues in Edge browser.\n     Additionally 'outsideClickToClose' has complex handling that's necessary\n     to be manual due to the component architecture -->\n<div role=\"dialog\" *clrPopoverContent=\"openState at smartPosition; outsideClickToClose: false; scrollToClose: false\">\n  <ng-content></ng-content>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i2.OptionSelectionService }, { type: i3.ClrCommonStringsService }, { type: i4.ClrPopoverToggleService }, { type: i5.ClrPopoverPositionService }, { type: i6.IfControlStateService, decorators: [{
                    type: Optional
                }] }, { type: i7.ComboboxContainerService, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i8.ComboboxFocusHandler }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { placeholder: [{
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
            }], multiSelect: [{
                type: Input,
                args: ['clrMulti']
            }], onKeyUp: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYm9ib3guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9jb21ib2JveC9jb21ib2JveC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2NvbWJvYm94L2NvbWJvYm94Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBR0wsU0FBUyxFQUNULFlBQVksRUFFWixZQUFZLEVBQ1osWUFBWSxFQUNaLE1BQU0sRUFFTixLQUFLLEVBQ0wsUUFBUSxFQUNSLE1BQU0sRUFDTixXQUFXLEVBRVgsSUFBSSxFQUNKLFNBQVMsR0FFVixNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNsRixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDbkQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFekUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzlELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDeEUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQzlELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUU5RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUdyRixPQUFPLEVBQUUsYUFBYSxFQUF5QixNQUFNLHFEQUFxRCxDQUFDO0FBQzNHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FB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QWM7c0JBQTlDLFlBQVk7dUJBQUMsaUJBQWlCO2dCQWVHLE9BQU87c0JBQXhDLFlBQVk7dUJBQUMsVUFBVTtnQkFrQ3BCLFdBQVc7c0JBRGQsS0FBSzt1QkFBQyxVQUFVO2dCQTZGakIsT0FBTztzQkFETixZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjIsXG4gIFNlbGYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTmdDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBJRl9BQ1RJVkVfSURfUFJPVklERVIgfSBmcm9tICcuLi8uLi91dGlscy9jb25kaXRpb25hbC9pZi1hY3RpdmUuc2VydmljZSc7XG5pbXBvcnQgeyBLZXlzIH0gZnJvbSAnLi4vLi4vdXRpbHMvZW51bXMva2V5cy5lbnVtJztcbmltcG9ydCB7IEZPQ1VTX1NFUlZJQ0VfUFJPVklERVIgfSBmcm9tICcuLi8uLi91dGlscy9mb2N1cy9mb2N1cy5zZXJ2aWNlJztcbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IENsckxvYWRpbmdTdGF0ZSB9IGZyb20gJy4uLy4uL3V0aWxzL2xvYWRpbmcvbG9hZGluZyc7XG5pbXBvcnQgeyBMb2FkaW5nTGlzdGVuZXIgfSBmcm9tICcuLi8uLi91dGlscy9sb2FkaW5nL2xvYWRpbmctbGlzdGVuZXInO1xuaW1wb3J0IHsgQ2xyQWxpZ25tZW50IH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9lbnVtcy9hbGlnbm1lbnQuZW51bSc7XG5pbXBvcnQgeyBDbHJBeGlzIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9lbnVtcy9heGlzLmVudW0nO1xuaW1wb3J0IHsgQ2xyU2lkZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvZW51bXMvc2lkZS5lbnVtJztcbmltcG9ydCB7IENsclBvcG92ZXJQb3NpdGlvbiB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvaW50ZXJmYWNlcy9wb3BvdmVyLXBvc2l0aW9uLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVySG9zdERpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcG9wb3Zlci1ob3N0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyUG9zaXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci1wb3NpdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5pbXBvcnQgeyBDT05UUk9MX1NUQVRFLCBJZkNvbnRyb2xTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vaWYtY29udHJvbC1zdGF0ZS9pZi1jb250cm9sLXN0YXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgV3JhcHBlZEZvcm1Db250cm9sIH0gZnJvbSAnLi4vY29tbW9uL3dyYXBwZWQtY29udHJvbCc7XG5pbXBvcnQgeyBDbHJDb21ib2JveENvbnRhaW5lciB9IGZyb20gJy4vY29tYm9ib3gtY29udGFpbmVyJztcbmltcG9ydCB7IENvbWJvYm94TW9kZWwgfSBmcm9tICcuL21vZGVsL2NvbWJvYm94Lm1vZGVsJztcbmltcG9ydCB7IE11bHRpU2VsZWN0Q29tYm9ib3hNb2RlbCB9IGZyb20gJy4vbW9kZWwvbXVsdGktc2VsZWN0LWNvbWJvYm94Lm1vZGVsJztcbmltcG9ydCB7IFNpbmdsZVNlbGVjdENvbWJvYm94TW9kZWwgfSBmcm9tICcuL21vZGVsL3NpbmdsZS1zZWxlY3QtY29tYm9ib3gubW9kZWwnO1xuaW1wb3J0IHsgQ2xyT3B0aW9uU2VsZWN0ZWQgfSBmcm9tICcuL29wdGlvbi1zZWxlY3RlZC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2xyT3B0aW9ucyB9IGZyb20gJy4vb3B0aW9ucyc7XG5pbXBvcnQgeyBDb21ib2JveENvbnRhaW5lclNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9jb21ib2JveC1jb250YWluZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDT01CT0JPWF9GT0NVU19IQU5ETEVSX1BST1ZJREVSLCBDb21ib2JveEZvY3VzSGFuZGxlciB9IGZyb20gJy4vcHJvdmlkZXJzL2NvbWJvYm94LWZvY3VzLWhhbmRsZXIuc2VydmljZSc7XG5pbXBvcnQgeyBPcHRpb25TZWxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvb3B0aW9uLXNlbGVjdGlvbi5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWNvbWJvYm94JyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbWJvYm94Lmh0bWwnLFxuICBwcm92aWRlcnM6IFtcbiAgICBPcHRpb25TZWxlY3Rpb25TZXJ2aWNlLFxuICAgIHsgcHJvdmlkZTogTG9hZGluZ0xpc3RlbmVyLCB1c2VFeGlzdGluZzogQ2xyQ29tYm9ib3ggfSxcbiAgICBJRl9BQ1RJVkVfSURfUFJPVklERVIsXG4gICAgRk9DVVNfU0VSVklDRV9QUk9WSURFUixcbiAgICBDT01CT0JPWF9GT0NVU19IQU5ETEVSX1BST1ZJREVSLFxuICBdLFxuICBob3N0RGlyZWN0aXZlczogW0NsclBvcG92ZXJIb3N0RGlyZWN0aXZlXSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuYXJpYS1yZXF1aXJlZF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5jbHItY29tYm9ib3hdJzogJ3RydWUnLFxuICAgICdbY2xhc3MuY2xyLWNvbWJvYm94LWRpc2FibGVkXSc6ICdjb250cm9sPy5kaXNhYmxlZCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsckNvbWJvYm94PFQ+XG4gIGV4dGVuZHMgV3JhcHBlZEZvcm1Db250cm9sPENsckNvbWJvYm94Q29udGFpbmVyPlxuICBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBMb2FkaW5nTGlzdGVuZXIsIEFmdGVyQ29udGVudEluaXRcbntcbiAgQElucHV0KCdwbGFjZWhvbGRlcicpIHBsYWNlaG9sZGVyID0gJyc7XG5cbiAgQE91dHB1dCgnY2xySW5wdXRDaGFuZ2UnKSBjbHJJbnB1dENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPihmYWxzZSk7XG4gIEBPdXRwdXQoJ2Nsck9wZW5DaGFuZ2UnKSBjbHJPcGVuQ2hhbmdlID0gdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW5DaGFuZ2U7XG5cbiAgLyoqXG4gICAqIFRoaXMgb3V0cHV0IHNob3VsZCBiZSB1c2VkIHRvIHNldCB1cCBhIGxpdmUgcmVnaW9uIHVzaW5nIGFyaWEtbGl2ZSBhbmQgcG9wdWxhdGUgaXQgd2l0aCB1cGRhdGVzIHRoYXQgcmVmbGVjdCBlYWNoIGNvbWJvYm94IGNoYW5nZS5cbiAgICovXG4gIEBPdXRwdXQoJ2NsclNlbGVjdGlvbkNoYW5nZScpIGNsclNlbGVjdGlvbkNoYW5nZSA9IHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25DaGFuZ2VkO1xuXG4gIEBWaWV3Q2hpbGQoJ3RleHRib3hJbnB1dCcpIHRleHRib3g6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3RyaWdnZXInKSB0cmlnZ2VyOiBFbGVtZW50UmVmPEhUTUxCdXR0b25FbGVtZW50PjtcbiAgQENvbnRlbnRDaGlsZChDbHJPcHRpb25TZWxlY3RlZCkgb3B0aW9uU2VsZWN0ZWQ6IENsck9wdGlvblNlbGVjdGVkPFQ+O1xuXG4gIGludmFsaWQgPSBmYWxzZTtcbiAgZm9jdXNlZCA9IGZhbHNlO1xuICBmb2N1c2VkUGlsbDogYW55O1xuXG4gIHNtYXJ0UG9zaXRpb246IENsclBvcG92ZXJQb3NpdGlvbiA9IHtcbiAgICBheGlzOiBDbHJBeGlzLlZFUlRJQ0FMLFxuICAgIHNpZGU6IENsclNpZGUuQUZURVIsXG4gICAgYW5jaG9yOiBDbHJBbGlnbm1lbnQuU1RBUlQsXG4gICAgY29udGVudDogQ2xyQWxpZ25tZW50LlNUQVJULFxuICB9O1xuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBpbmRleCA9IDE7XG5cbiAgQENvbnRlbnRDaGlsZChDbHJPcHRpb25zKSBwcml2YXRlIG9wdGlvbnM6IENsck9wdGlvbnM8VD47XG5cbiAgcHJpdmF0ZSBfc2VhcmNoVGV4dCA9ICcnO1xuICBwcml2YXRlIG9uVG91Y2hlZENhbGxiYWNrOiAoKSA9PiBhbnk7XG4gIHByaXZhdGUgb25DaGFuZ2VDYWxsYmFjazogKG1vZGVsOiBUIHwgVFtdKSA9PiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgdmNyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAU2VsZigpXG4gICAgQE9wdGlvbmFsKClcbiAgICBwdWJsaWMgY29udHJvbDogTmdDb250cm9sLFxuICAgIHByb3RlY3RlZCBvdmVycmlkZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHVibGljIG9wdGlvblNlbGVjdGlvblNlcnZpY2U6IE9wdGlvblNlbGVjdGlvblNlcnZpY2U8VD4sXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlLFxuICAgIHByaXZhdGUgdG9nZ2xlU2VydmljZTogQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwb3NpdGlvblNlcnZpY2U6IENsclBvcG92ZXJQb3NpdGlvblNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBjb250cm9sU3RhdGVTZXJ2aWNlOiBJZkNvbnRyb2xTdGF0ZVNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBjb250YWluZXJTZXJ2aWNlOiBDb21ib2JveENvbnRhaW5lclNlcnZpY2UsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksXG4gICAgcHJpdmF0ZSBmb2N1c0hhbmRsZXI6IENvbWJvYm94Rm9jdXNIYW5kbGVyPFQ+LFxuICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZlxuICApIHtcbiAgICBzdXBlcih2Y3IsIENsckNvbWJvYm94Q29udGFpbmVyLCBpbmplY3RvciwgY29udHJvbCwgcmVuZGVyZXIsIGVsKTtcbiAgICBpZiAoY29udHJvbCkge1xuICAgICAgY29udHJvbC52YWx1ZUFjY2Vzc29yID0gdGhpcztcbiAgICB9XG4gICAgLy8gZGVmYXVsdCB0byBTaW5nbGVTZWxlY3RDb21ib2JveE1vZGVsLCBpbiBjYXNlIHRoZSBvcHRpb25hbCBpbnB1dCBbQ2xyTXVsdGldIGlzbid0IHVzZWRcbiAgICBvcHRpb25TZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdGlvbk1vZGVsID0gbmV3IFNpbmdsZVNlbGVjdENvbWJvYm94TW9kZWw8VD4oKTtcbiAgICB0aGlzLnVwZGF0ZUNvbnRyb2xWYWx1ZSgpO1xuICB9XG5cbiAgQElucHV0KCdjbHJNdWx0aScpXG4gIGdldCBtdWx0aVNlbGVjdCgpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLm11bHRpc2VsZWN0YWJsZTtcbiAgfVxuICBzZXQgbXVsdGlTZWxlY3QodmFsdWU6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbCA9IG5ldyBNdWx0aVNlbGVjdENvbWJvYm94TW9kZWw8VD4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaW4gdGhlb3J5LCBzZXR0aW5nIHRoaXMgYWdhaW4gc2hvdWxkIG5vdCBjYXVzZSBlcnJvcnMgZXZlbiB0aG91Z2ggd2UgYWxyZWFkeSBzZXQgaXQgaW4gY29uc3RydWN0b3IsXG4gICAgICAvLyBzaW5jZSB0aGUgaW5pdGlhbCBjYWxsIHRvIHdyaXRlVmFsdWUgKGNhdXNlZCBieSBbbmdNb2RlbF0gaW5wdXQpIHNob3VsZCBoYXBwZW4gYWZ0ZXIgdGhpc1xuICAgICAgdGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdGlvbk1vZGVsID0gbmV3IFNpbmdsZVNlbGVjdENvbWJvYm94TW9kZWw8VD4oKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVDb250cm9sVmFsdWUoKTtcbiAgfVxuXG4gIC8vIE92ZXJyaWRlIHRoZSBpZCBvZiBXcmFwcGVkRm9ybUNvbnRyb2wsIGFzIHdlIHdhbnQgdG8gbW92ZSBpdCB0byB0aGUgZW1iZWRkZWQgaW5wdXQuXG4gIC8vIE90aGVyd2lzZSB0aGUgbGFiZWwvY29tcG9uZW50IGNvbm5lY3Rpb24gZG9lcyBub3Qgd29yayBhbmQgc2NyZWVuIHJlYWRlcnMgZG8gbm90IHJlYWQgdGhlIGxhYmVsLlxuICBvdmVycmlkZSBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbElkU2VydmljZS5pZCArICctY29tYm9ib3gnO1xuICB9XG4gIG92ZXJyaWRlIHNldCBpZChpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIuaWQgPSBpZDtcbiAgfVxuXG4gIGdldCBzZWFyY2hUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3NlYXJjaFRleHQ7XG4gIH1cbiAgc2V0IHNlYXJjaFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgLy8gaWYgaW5wdXQgdGV4dCBoYXMgY2hhbmdlZCBzaW5jZSBsYXN0IHRpbWUsIGZpcmUgYSBjaGFuZ2UgZXZlbnQgc28gYXBwbGljYXRpb24gY2FuIHJlYWN0IHRvIGl0XG4gICAgaWYgKHRleHQgIT09IHRoaXMuX3NlYXJjaFRleHQpIHtcbiAgICAgIGlmICh0aGlzLnRvZ2dsZVNlcnZpY2Uub3Blbikge1xuICAgICAgICB0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2Uuc2hvd0FsbE9wdGlvbnMgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3NlYXJjaFRleHQgPSB0ZXh0O1xuICAgICAgdGhpcy5jbHJJbnB1dENoYW5nZS5lbWl0KHRoaXMuc2VhcmNoVGV4dCk7XG4gICAgfVxuICAgIC8vIFdlIG5lZWQgdG8gdHJpZ2dlciB0aGlzIGV2ZW4gaWYgdW5jaGFuZ2VkLCBzbyB0aGUgb3B0aW9uLWl0ZW1zIGRpcmVjdGl2ZSB3aWxsIHVwZGF0ZSBpdHMgbGlzdFxuICAgIC8vIGJhc2VkIG9uIHRoZSBcInNob3dBbGxPcHRpb25zXCIgdmFyaWFibGUgd2hpY2ggbWF5IGhhdmUgY2hhbmdlZCBpbiB0aGUgb3BlbkNoYW5nZSBzdWJzY3JpcHRpb24gYmVsb3cuXG4gICAgLy8gVGhlIG9wdGlvbi1pdGVtcyBkaXJlY3RpdmUgZG9lcyBub3QgbGlzdGVuIHRvIG9wZW5DaGFuZ2UsIGJ1dCBpdCBsaXN0ZW5zIHRvIGN1cnJlbnRJbnB1dCBjaGFuZ2VzLlxuICAgIHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5jdXJyZW50SW5wdXQgPSB0aGlzLnNlYXJjaFRleHQ7XG4gIH1cblxuICBnZXQgb3BlblN0YXRlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbjtcbiAgfVxuXG4gIGdldCBtdWx0aVNlbGVjdE1vZGVsKCk6IFRbXSB7XG4gICAgaWYgKCF0aGlzLm11bHRpU2VsZWN0KSB7XG4gICAgICB0aHJvdyBFcnJvcignbXVsdGlTZWxlY3RNb2RlbCBpcyBub3QgYXZhaWxhYmxlIGluIHNpbmdsZSBzZWxlY3Rpb24gY29udGV4dCcpO1xuICAgIH1cbiAgICByZXR1cm4gKHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbCBhcyBNdWx0aVNlbGVjdENvbWJvYm94TW9kZWw8VD4pLm1vZGVsO1xuICB9XG5cbiAgZ2V0IGFyaWFDb250cm9scygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnM/Lm9wdGlvbnNJZDtcbiAgfVxuXG4gIGdldCBhcmlhT3ducygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnM/Lm9wdGlvbnNJZDtcbiAgfVxuXG4gIGdldCBhcmlhRGVzY3JpYmVkQnlTZWxlY3Rpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ3NlbGVjdGlvbi0nICsgdGhpcy5pZDtcbiAgfVxuXG4gIGdldCBkaXNwbGF5RmllbGQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLmRpc3BsYXlGaWVsZDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGRpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2w/LmRpc2FibGVkO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZVN1YnNjcmlwdGlvbnMoKTtcblxuICAgIC8vIEluaXRpYWxpemUgd2l0aCBwcmVzZWxlY3RlZCB2YWx1ZVxuICAgIGlmICghdGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdGlvbk1vZGVsLmlzRW1wdHkoKSkge1xuICAgICAgdGhpcy51cGRhdGVJbnB1dFZhbHVlKHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZm9jdXNIYW5kbGVyLmNvbXBvbmVudENkUmVmID0gdGhpcy5jZHI7XG4gICAgdGhpcy5mb2N1c0hhbmRsZXIudGV4dElucHV0ID0gdGhpcy50ZXh0Ym94Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5mb2N1c0hhbmRsZXIudHJpZ2dlciA9IHRoaXMudHJpZ2dlci5uYXRpdmVFbGVtZW50O1xuICAgIC8vIFRoZSB0ZXh0IGlucHV0IGlzIHRoZSBhY3R1YWwgZWxlbWVudCB3ZSBhcmUgd3JhcHBpbmdcbiAgICAvLyBUaGlzIGFzc2lnbm1lbnQgaXMgbmVlZGVkIGJ5IHRoZSB3cmFwcGVyLCBzbyBpdCBjYW4gc2V0XG4gICAgLy8gdGhlIGFyaWEgcHJvcGVydGllcyBvbiB0aGUgaW5wdXQgZWxlbWVudCwgbm90IG9uIHRoZSBjb21wb25lbnQuXG4gICAgdGhpcy5lbCA9IHRoaXMudGV4dGJveDtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICBvbktleVVwKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgLy8gaWYgQkFDS1NQQUNFIGluIG11bHRpc2VsZWN0IG1vZGUsIGRlbGV0ZSB0aGUgbGFzdCBwaWxsIGlmIHRleHQgaXMgZW1wdHlcbiAgICBpZiAoZXZlbnQua2V5ID09PSBLZXlzLkJhY2tzcGFjZSAmJiB0aGlzLm11bHRpU2VsZWN0ICYmIHRoaXMuX3NlYXJjaFRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBtdWx0aU1vZGVsOiBUW10gPSB0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uTW9kZWwubW9kZWwgYXMgVFtdO1xuICAgICAgaWYgKG11bHRpTW9kZWwgJiYgbXVsdGlNb2RlbC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGxhc3RJdGVtOiBUID0gbXVsdGlNb2RlbFttdWx0aU1vZGVsLmxlbmd0aCAtIDFdO1xuICAgICAgICB0aGlzLmNvbnRyb2w/LmNvbnRyb2wubWFya0FzVG91Y2hlZCgpO1xuICAgICAgICB0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2UudW5zZWxlY3QobGFzdEl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlucHV0SWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sSWRTZXJ2aWNlLmlkO1xuICB9XG5cbiAgbG9hZGluZ1N0YXRlQ2hhbmdlKHN0YXRlOiBDbHJMb2FkaW5nU3RhdGUpOiB2b2lkIHtcbiAgICB0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2UubG9hZGluZyA9IHN0YXRlID09PSBDbHJMb2FkaW5nU3RhdGUuTE9BRElORztcbiAgICB0aGlzLnBvc2l0aW9uU2VydmljZS5yZWFsaWduKCk7XG4gICAgaWYgKHN0YXRlICE9PSBDbHJMb2FkaW5nU3RhdGUuTE9BRElORyAmJiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICB0aGlzLmZvY3VzRmlyc3RBY3RpdmUoKTtcbiAgICB9XG4gIH1cblxuICB1bnNlbGVjdChpdGVtOiBUKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2UudW5zZWxlY3QoaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgb25CbHVyKCkge1xuICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2s/LigpO1xuICAgIGlmICh0aGlzLmNvbnRyb2w/LmNvbnRyb2wudXBkYXRlT24gPT09ICdjaGFuZ2UnICYmIHRoaXMuY29udHJvbC5jb250cm9sLmVycm9ycz8ucmVxdWlyZWQpIHtcbiAgICAgIHRoaXMudXBkYXRlQ29udHJvbFZhbHVlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbnRyb2w/LmNvbnRyb2wudXBkYXRlT24gPT09ICdibHVyJykge1xuICAgICAgdGhpcy5jb250cm9sLmNvbnRyb2wudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuICAgIH1cbiAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcbiAgfVxuXG4gIG9uRm9jdXMoKSB7XG4gICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcblxuICAgIC8vIGZpeCBmb3IgXCJleHByZXNzaW9uIGNoYW5nZWRcIiBlcnJvciB3aGVuIGZvY3VzIGlzIHJldHVybmVkIHRvIGEgY29tYm9ib3ggYWZ0ZXIgYSBtb2RhbCBpcyBjbG9zZWRcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdm13YXJlLWNsYXJpdHkvbmctY2xhcml0eS9pc3N1ZXMvNjYzXG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9uQXJpYUxhYmVsKCkge1xuICAgIGlmICh0aGlzLmNvbnRhaW5lclNlcnZpY2UgJiYgdGhpcy5jb250YWluZXJTZXJ2aWNlLmxhYmVsVGV4dCkge1xuICAgICAgcmV0dXJuIGAke3RoaXMuY29udGFpbmVyU2VydmljZS5sYWJlbFRleHR9ICR7dGhpcy5jb21tb25TdHJpbmdzLmtleXMuY29tYm9ib3hTZWxlY3Rpb259YDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmNvbWJvYm94U2VsZWN0aW9uO1xuICB9XG5cbiAgZm9jdXNGaXJzdEFjdGl2ZSgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuZm9jdXNIYW5kbGVyLmZvY3VzRmlyc3RBY3RpdmUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IFQgfCBUW10pOiB2b2lkIHtcbiAgICB0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uTW9kZWwubW9kZWwgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZUlucHV0VmFsdWUodGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdGlvbk1vZGVsKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKG9uVG91Y2hlZDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjayA9IG9uVG91Y2hlZDtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2Uob25DaGFuZ2U6IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayA9IG9uQ2hhbmdlO1xuICB9XG5cbiAgZ2V0QWN0aXZlRGVzY2VuZGFudCgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHRoaXMuZm9jdXNIYW5kbGVyLnBzZXVkb0ZvY3VzLm1vZGVsO1xuICAgIHJldHVybiBtb2RlbCA/IG1vZGVsLmlkIDogdGhpcy5vcHRpb25zPy5ub1Jlc3VsdHNFbGVtZW50SWQ7XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKCk6IHZvaWQge1xuICAgIC8vIGRvIG5vdGhpbmdcbiAgfVxuXG4gIGZvY3VzSW5wdXQoKSB7XG4gICAgdGhpcy5mb2N1c0hhbmRsZXIuZm9jdXNJbnB1dCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplU3Vic2NyaXB0aW9ucygpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25DaGFuZ2VkLnN1YnNjcmliZSgobmV3U2VsZWN0aW9uOiBDb21ib2JveE1vZGVsPFQ+KSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlSW5wdXRWYWx1ZShuZXdTZWxlY3Rpb24pO1xuICAgICAgICBpZiAodGhpcy5tdWx0aVNlbGVjdCkge1xuICAgICAgICAgIHRoaXMucG9zaXRpb25TZXJ2aWNlLnJlYWxpZ24oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMubXVsdGlTZWxlY3QgJiYgbmV3U2VsZWN0aW9uICYmICFuZXdTZWxlY3Rpb24uaXNFbXB0eSgpKSB7XG4gICAgICAgICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xWYWx1ZSgpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbkNoYW5nZS5zdWJzY3JpYmUob3BlbiA9PiB7XG4gICAgICAgIGlmIChvcGVuKSB7XG4gICAgICAgICAgdGhpcy5mb2N1c0ZpcnN0QWN0aXZlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLnNob3dBbGxPcHRpb25zID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tdWx0aVNlbGVjdCkge1xuICAgICAgICAgIHRoaXMuc2VhcmNoVGV4dCA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2VhcmNoVGV4dCA9IHRoaXMuZ2V0RGlzcGxheU5hbWVzKHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbC5tb2RlbClbMF0gfHwgJyc7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy50b2dnbGVTZXJ2aWNlLnBvcG92ZXJBbGlnbmVkLnN1YnNjcmliZShwb3BvdmVyTm9kZSA9PiB7XG4gICAgICAgIC8vIFdoZW4gdXNlZCBvdXRzaWRlIGEgY29tYm9ib3ggY29udGFpbmVyXG4gICAgICAgIGlmICghdGhpcy5jb250YWluZXJTZXJ2aWNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvcG92ZXI6IEhUTUxFbGVtZW50ID0gcG9wb3Zlck5vZGUgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIC8vIFVwZGF0ZSBwb3NpdGlvbiBpZiBwb3BvdmVyIGhpZGVzIHRoZSBsYWJlbFxuICAgICAgICBpZiAocG9wb3Zlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgPCB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShwb3BvdmVyTm9kZSwgJ3RvcCcsIGAke3BvcG92ZXIub2Zmc2V0VG9wICsgdGhpcy5jb250YWluZXJTZXJ2aWNlLmxhYmVsT2Zmc2V0fXB4YCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGlmICh0aGlzLmNvbnRyb2xTdGF0ZVNlcnZpY2UpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICB0aGlzLmNvbnRyb2xTdGF0ZVNlcnZpY2Uuc3RhdHVzQ2hhbmdlcy5zdWJzY3JpYmUoaW52YWxpZCA9PiB7XG4gICAgICAgICAgdGhpcy5pbnZhbGlkID0gdGhpcy5jb250cm9sPy5jb250cm9sLnRvdWNoZWQgJiYgaW52YWxpZCA9PT0gQ09OVFJPTF9TVEFURS5JTlZBTElEO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUlucHV0VmFsdWUobW9kZWw6IENvbWJvYm94TW9kZWw8VD4pIHtcbiAgICBpZiAoIXRoaXMubXVsdGlTZWxlY3QpIHtcbiAgICAgIHRoaXMuc2VhcmNoVGV4dCA9IG1vZGVsLm1vZGVsID8gdGhpcy5nZXREaXNwbGF5TmFtZXMobW9kZWwubW9kZWwpWzBdIDogJyc7XG4gICAgICBpZiAodGhpcy5zZWFyY2hUZXh0KSB7XG4gICAgICAgIHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5jdXJyZW50SW5wdXQgPSB0aGlzLnNlYXJjaFRleHQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVDb250cm9sVmFsdWUoKSB7XG4gICAgaWYgKHRoaXMub25DaGFuZ2VDYWxsYmFjaykge1xuICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbC5tb2RlbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXREaXNwbGF5TmFtZXMobW9kZWw6IFQgfCBUW10pIHtcbiAgICBpZiAodGhpcy5kaXNwbGF5RmllbGQpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShtb2RlbCkpIHtcbiAgICAgICAgbW9kZWwgPSBbbW9kZWxdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1vZGVsLm1hcChpdGVtID0+IChpdGVtID8gKGl0ZW0gYXMgYW55KVt0aGlzLmRpc3BsYXlGaWVsZF0gOiBudWxsKSk7XG4gICAgfVxuICAgIHJldHVybiBbdGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdGlvbk1vZGVsLm1vZGVsXTtcbiAgfVxufVxuIiwiPCEtLVxuICB+IENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICB+IFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAgfiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICB+IFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbi0tPlxuXG48IS0tIFRoZSAoY2xpY2spIGhhbmRsZXIgaXMgbmVlZGVkIHRvIGF1dG8tZm9jdXMgb24gaW5wdXQgZmllbGQgd2hpY2ggY2FuIG5vdCBjdXJyZW50bHkgb2NjdXB5IHRoZSB3aG9sZVxuICAgICB3aWR0aCBvZiB0aGUgY29tcG9uZW50LCBhZnRlciBiZWluZyB3cmFwcGVkIHRvIGEgbmV3IGxpbmUgLS0+XG48ZGl2XG4gIGNsYXNzPVwiY2xyLWNvbWJvYm94LXdyYXBwZXJcIlxuICBjbHJQb3BvdmVyQW5jaG9yXG4gIChjbGljayk9XCJmb2N1c0lucHV0KClcIlxuICBbY2xhc3MubXVsdGldPVwibXVsdGlTZWxlY3RcIlxuICBbY2xhc3MuaW52YWxpZF09XCJpbnZhbGlkXCJcbiAgW2NsYXNzLmRpc2FibGVkXT1cImNvbnRyb2w/LmRpc2FibGVkPyB0cnVlOiBudWxsXCJcbj5cbiAgPHNwYW5cbiAgICAqbmdJZj1cIm11bHRpU2VsZWN0ICYmIG9wdGlvblNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uTW9kZWwubW9kZWxcIlxuICAgIHJvbGU9XCJncmlkXCJcbiAgICBjbHJSb3ZpbmdUYWJpbmRleFxuICAgIFtjbHJSb3ZpbmdUYWJpbmRleERpc2FibGVkXT1cImNvbnRyb2w/LmRpc2FibGVkXCJcbiAgICBjbHJEaXJlY3Rpb249XCJib3RoXCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImdldFNlbGVjdGlvbkFyaWFMYWJlbCgpXCJcbiAgICBbYXR0ci5hcmlhLWRpc2FibGVkXT1cImNvbnRyb2w/LmRpc2FibGVkPyB0cnVlOiBudWxsXCJcbiAgPlxuICAgIDxzcGFuICpuZ0Zvcj1cImxldCBpdGVtIG9mIG11bHRpU2VsZWN0TW9kZWw7IGxldCBpID0gaW5kZXhcIiBjbGFzcz1cImxhYmVsIGxhYmVsLWNvbWJvYm94LXBpbGxcIiByb2xlPVwicm93XCI+XG4gICAgICA8c3BhbiByb2xlPVwiZ3JpZGNlbGxcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItY29tYm9ib3gtcGlsbC1jb250ZW50XCIgY2xyS2V5Rm9jdXNJdGVtPlxuICAgICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICpuZ0lmPVwib3B0aW9uU2VsZWN0ZWRcIlxuICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwib3B0aW9uU2VsZWN0ZWQudGVtcGxhdGVcIlxuICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG9wdGlvblNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uTW9kZWwubW9kZWxbaV19XCJcbiAgICAgICAgICA+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxzcGFuIHJvbGU9XCJncmlkY2VsbFwiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xyS2V5Rm9jdXNJdGVtXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3M9XCJjbHItY29tYm9ib3gtcmVtb3ZlLWJ0blwiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cImNvbnRyb2w/LmRpc2FibGVkPyB0cnVlOiBudWxsXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5jb21ib2JveERlbGV0ZSArICcgJyArIG9wdGlvblNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uTW9kZWwudG9TdHJpbmcoZGlzcGxheUZpZWxkLCBpKVwiXG4gICAgICAgICAgKGNsaWNrKT1cInVuc2VsZWN0KGl0ZW0pXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxjZHMtaWNvbiBzaGFwZT1cIndpbmRvdy1jbG9zZVwiIHNpemU9XCIxMlwiPjwvY2RzLWljb24+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9zcGFuPlxuICAgIDwvc3Bhbj5cbiAgPC9zcGFuPlxuXG4gIDxzcGFuIGNsYXNzPVwiY2xyLWNvbWJvYm94LWlucHV0LXdyYXBwZXJcIj5cbiAgICA8aW5wdXRcbiAgICAgICN0ZXh0Ym94SW5wdXRcbiAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgIHJvbGU9XCJjb21ib2JveFwiXG4gICAgICBbaWRdPVwiaW5wdXRJZCgpXCJcbiAgICAgIGNsYXNzPVwiY2xyLWlucHV0IGNsci1jb21ib2JveC1pbnB1dFwiXG4gICAgICBbKG5nTW9kZWwpXT1cInNlYXJjaFRleHRcIlxuICAgICAgKGJsdXIpPVwib25CbHVyKClcIlxuICAgICAgKGZvY3VzKT1cIm9uRm9jdXMoKVwiXG4gICAgICBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cIm9wZW5TdGF0ZVwiXG4gICAgICBbYXR0ci5hcmlhLW93bnNdPVwiYXJpYU93bnNcIlxuICAgICAgYXJpYS1oYXNwb3B1cD1cImxpc3Rib3hcIlxuICAgICAgYXJpYS1hdXRvY29tcGxldGU9XCJsaXN0XCJcbiAgICAgIGF1dG9jb21wbGV0ZT1cIm9mZlwiXG4gICAgICBbYXR0ci5hcmlhLWludmFsaWRdPVwiY29udHJvbD8uaW52YWxpZD8gdHJ1ZTogbnVsbFwiXG4gICAgICBbZGlzYWJsZWRdPVwiY29udHJvbD8uZGlzYWJsZWQ/IHRydWU6IG51bGxcIlxuICAgICAgW2F0dHIuYXJpYS1hY3RpdmVkZXNjZW5kYW50XT1cImdldEFjdGl2ZURlc2NlbmRhbnQoKVwiXG4gICAgICBbYXR0ci5wbGFjZWhvbGRlcl09XCJwbGFjZWhvbGRlclwiXG4gICAgLz5cbiAgPC9zcGFuPlxuXG4gIDwhLS0gTm8gY2xpY2sgaGFuZGxlciwgYXMgaXQgdXNlcyB0aGUgaGFuZGxlciBvbiB0aGUgLmNsci1jb21ib2JveC13cmFwcGVyIC0tPlxuICA8YnV0dG9uXG4gICAgY2xyUG9wb3Zlck9wZW5DbG9zZUJ1dHRvblxuICAgICN0cmlnZ2VyXG4gICAgdHlwZT1cImJ1dHRvblwiXG4gICAgY2xhc3M9XCJjbHItY29tYm9ib3gtdHJpZ2dlclwiXG4gICAgdGFiaW5kZXg9XCItMVwiXG4gICAgW2Rpc2FibGVkXT1cImNvbnRyb2w/LmRpc2FibGVkIHx8IG51bGxcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiY29tbW9uU3RyaW5ncy5rZXlzLmNvbWJvYm94T3BlblwiXG4gID5cbiAgICA8Y2RzLWljb24gc2hhcGU9XCJhbmdsZVwiIGRpcmVjdGlvbj1cImRvd25cIj48L2Nkcy1pY29uPlxuICA8L2J1dHRvbj5cblxuICA8ZGl2IGNsYXNzPVwiY2xyLWZvY3VzLWluZGljYXRvclwiIFtjbGFzcy5jbHItZm9jdXNdPVwiZm9jdXNlZFwiPjwvZGl2PlxuPC9kaXY+XG5cbjwhLS0gQm90aCBjbG9zZSBoYW5kbGVycyBhcmUgaGFuZGxlZCBtYW51YWxseSBkdWUgdG8gaXNzdWVzIGluIEVkZ2UgYnJvd3Nlci5cbiAgICAgQWRkaXRpb25hbGx5ICdvdXRzaWRlQ2xpY2tUb0Nsb3NlJyBoYXMgY29tcGxleCBoYW5kbGluZyB0aGF0J3MgbmVjZXNzYXJ5XG4gICAgIHRvIGJlIG1hbnVhbCBkdWUgdG8gdGhlIGNvbXBvbmVudCBhcmNoaXRlY3R1cmUgLS0+XG48ZGl2IHJvbGU9XCJkaWFsb2dcIiAqY2xyUG9wb3ZlckNvbnRlbnQ9XCJvcGVuU3RhdGUgYXQgc21hcnRQb3NpdGlvbjsgb3V0c2lkZUNsaWNrVG9DbG9zZTogZmFsc2U7IHNjcm9sbFRvQ2xvc2U6IGZhbHNlXCI+XG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvZGl2PlxuIl19