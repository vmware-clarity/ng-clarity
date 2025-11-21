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
    ], queries: [{ propertyName: "optionSelected", first: true, predicate: ClrOptionSelected, descendants: true }, { propertyName: "options", first: true, predicate: ClrOptions, descendants: true }], viewQueries: [{ propertyName: "textbox", first: true, predicate: ["textboxInput"], descendants: true }, { propertyName: "trigger", first: true, predicate: ["trigger"], descendants: true }], usesInheritance: true, hostDirectives: [{ directive: i9.ClrPopoverHostDirective }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n-->\n\n<!-- The (click) handler is needed to auto-focus on input field which can not currently occupy the whole\n     width of the component, after being wrapped to a new line -->\n<div\n  class=\"clr-combobox-wrapper\"\n  clrPopoverAnchor\n  (click)=\"focusInput()\"\n  [class.multi]=\"multiSelect\"\n  [class.invalid]=\"invalid\"\n  [class.disabled]=\"control?.disabled? true: null\"\n>\n  <span\n    *ngIf=\"multiSelect && optionSelectionService.selectionModel.model && multiSelectModel.length > 0\"\n    role=\"grid\"\n    clrRovingTabindex\n    [clrRovingTabindexDisabled]=\"control?.disabled\"\n    clrDirection=\"both\"\n    [attr.aria-label]=\"getSelectionAriaLabel()\"\n    [attr.aria-disabled]=\"control?.disabled? true: null\"\n    class=\"clr-combobox-pills\"\n  >\n    <span *ngFor=\"let item of multiSelectModel; let i = index\" class=\"label label-combobox-pill\" role=\"row\">\n      <span role=\"gridcell\">\n        <span class=\"clr-combobox-pill-content\" clrKeyFocusItem>\n          <ng-container\n            *ngIf=\"optionSelected\"\n            [ngTemplateOutlet]=\"optionSelected.template\"\n            [ngTemplateOutletContext]=\"{$implicit: optionSelectionService.selectionModel.model[i]}\"\n          ></ng-container>\n        </span>\n      </span>\n      <span role=\"gridcell\">\n        <button\n          clrKeyFocusItem\n          type=\"button\"\n          class=\"clr-combobox-remove-btn\"\n          [disabled]=\"control?.disabled? true: null\"\n          [attr.aria-label]=\"commonStrings.keys.comboboxDelete + ' ' + optionSelectionService.selectionModel.toString(displayField, i)\"\n          (click)=\"unselect(item)\"\n        >\n          <cds-icon shape=\"window-close\" size=\"12\"></cds-icon>\n        </button>\n      </span>\n    </span>\n  </span>\n\n  <input\n    #textboxInput\n    type=\"text\"\n    role=\"combobox\"\n    [id]=\"inputId()\"\n    class=\"clr-input clr-combobox-input\"\n    [(ngModel)]=\"searchText\"\n    (blur)=\"onBlur($event)\"\n    (focus)=\"onFocus()\"\n    [attr.aria-expanded]=\"openState\"\n    [attr.aria-owns]=\"ariaOwns\"\n    aria-haspopup=\"listbox\"\n    aria-autocomplete=\"list\"\n    autocomplete=\"off\"\n    [attr.aria-invalid]=\"control?.invalid? true: null\"\n    [disabled]=\"control?.disabled? true: null\"\n    [attr.aria-activedescendant]=\"getActiveDescendant()\"\n    [attr.placeholder]=\"placeholder\"\n  />\n\n  <!-- No click handler, as it uses the handler on the .clr-combobox-wrapper -->\n  <button\n    clrPopoverOpenCloseButton\n    #trigger\n    type=\"button\"\n    class=\"clr-combobox-trigger\"\n    tabindex=\"-1\"\n    [disabled]=\"control?.disabled || null\"\n    [attr.aria-label]=\"commonStrings.keys.comboboxOpen\"\n  >\n    <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n  </button>\n\n  <div class=\"clr-focus-indicator\" [class.clr-focus]=\"focused\"></div>\n</div>\n\n<!-- Both close handlers are handled manually due to issues in Edge browser.\n     Additionally 'outsideClickToClose' has complex handling that's necessary\n     to be manual due to the component architecture -->\n<div role=\"dialog\" *clrPopoverContent=\"openState at smartPosition; outsideClickToClose: false; scrollToClose: false\">\n  <ng-content></ng-content>\n</div>\n", dependencies: [{ kind: "directive", type: i10.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i10.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i10.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i11.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i12.ClrRovingTabindex, selector: "[clrRovingTabindex]", inputs: ["clrRovingTabindex", "clrRovingTabindexDisabled"] }, { kind: "directive", type: i13.ClrKeyFocusItem, selector: "[clrKeyFocusItem]" }, { kind: "directive", type: i14.ClrPopoverAnchor, selector: "[clrPopoverAnchor]" }, { kind: "directive", type: i15.ClrPopoverOpenCloseButton, selector: "[clrPopoverOpenCloseButton]", outputs: ["clrPopoverOpenCloseChange"] }, { kind: "directive", type: i16.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose"] }] });
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
                    }, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n-->\n\n<!-- The (click) handler is needed to auto-focus on input field which can not currently occupy the whole\n     width of the component, after being wrapped to a new line -->\n<div\n  class=\"clr-combobox-wrapper\"\n  clrPopoverAnchor\n  (click)=\"focusInput()\"\n  [class.multi]=\"multiSelect\"\n  [class.invalid]=\"invalid\"\n  [class.disabled]=\"control?.disabled? true: null\"\n>\n  <span\n    *ngIf=\"multiSelect && optionSelectionService.selectionModel.model && multiSelectModel.length > 0\"\n    role=\"grid\"\n    clrRovingTabindex\n    [clrRovingTabindexDisabled]=\"control?.disabled\"\n    clrDirection=\"both\"\n    [attr.aria-label]=\"getSelectionAriaLabel()\"\n    [attr.aria-disabled]=\"control?.disabled? true: null\"\n    class=\"clr-combobox-pills\"\n  >\n    <span *ngFor=\"let item of multiSelectModel; let i = index\" class=\"label label-combobox-pill\" role=\"row\">\n      <span role=\"gridcell\">\n        <span class=\"clr-combobox-pill-content\" clrKeyFocusItem>\n          <ng-container\n            *ngIf=\"optionSelected\"\n            [ngTemplateOutlet]=\"optionSelected.template\"\n            [ngTemplateOutletContext]=\"{$implicit: optionSelectionService.selectionModel.model[i]}\"\n          ></ng-container>\n        </span>\n      </span>\n      <span role=\"gridcell\">\n        <button\n          clrKeyFocusItem\n          type=\"button\"\n          class=\"clr-combobox-remove-btn\"\n          [disabled]=\"control?.disabled? true: null\"\n          [attr.aria-label]=\"commonStrings.keys.comboboxDelete + ' ' + optionSelectionService.selectionModel.toString(displayField, i)\"\n          (click)=\"unselect(item)\"\n        >\n          <cds-icon shape=\"window-close\" size=\"12\"></cds-icon>\n        </button>\n      </span>\n    </span>\n  </span>\n\n  <input\n    #textboxInput\n    type=\"text\"\n    role=\"combobox\"\n    [id]=\"inputId()\"\n    class=\"clr-input clr-combobox-input\"\n    [(ngModel)]=\"searchText\"\n    (blur)=\"onBlur($event)\"\n    (focus)=\"onFocus()\"\n    [attr.aria-expanded]=\"openState\"\n    [attr.aria-owns]=\"ariaOwns\"\n    aria-haspopup=\"listbox\"\n    aria-autocomplete=\"list\"\n    autocomplete=\"off\"\n    [attr.aria-invalid]=\"control?.invalid? true: null\"\n    [disabled]=\"control?.disabled? true: null\"\n    [attr.aria-activedescendant]=\"getActiveDescendant()\"\n    [attr.placeholder]=\"placeholder\"\n  />\n\n  <!-- No click handler, as it uses the handler on the .clr-combobox-wrapper -->\n  <button\n    clrPopoverOpenCloseButton\n    #trigger\n    type=\"button\"\n    class=\"clr-combobox-trigger\"\n    tabindex=\"-1\"\n    [disabled]=\"control?.disabled || null\"\n    [attr.aria-label]=\"commonStrings.keys.comboboxOpen\"\n  >\n    <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n  </button>\n\n  <div class=\"clr-focus-indicator\" [class.clr-focus]=\"focused\"></div>\n</div>\n\n<!-- Both close handlers are handled manually due to issues in Edge browser.\n     Additionally 'outsideClickToClose' has complex handling that's necessary\n     to be manual due to the component architecture -->\n<div role=\"dialog\" *clrPopoverContent=\"openState at smartPosition; outsideClickToClose: false; scrollToClose: false\">\n  <ng-content></ng-content>\n</div>\n" }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYm9ib3guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9jb21ib2JveC9jb21ib2JveC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2NvbWJvYm94L2NvbWJvYm94Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBR0wsU0FBUyxFQUNULFlBQVksRUFFWixZQUFZLEVBQ1osWUFBWSxFQUNaLE1BQU0sRUFFTixLQUFLLEVBQ0wsUUFBUSxFQUNSLE1BQU0sRUFDTixXQUFXLEVBRVgsSUFBSSxFQUNKLFNBQVMsR0FFVixNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNsRixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDbkQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFekUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzlELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDeEUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQzlELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUU5RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUdyRixPQUFPLEVBQUUsYUFBYSxFQUF5QixNQUFNLHFEQUFxRCxDQUFDO0FBQzNHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRTVELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQy9FLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFdkMsT0FBTyxFQUFFLCtCQUErQixFQUF3QixNQUFNLDRDQUE0QyxDQUFDO0FBQ25ILE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQjlFLE1BQU0sT0FBTyxXQUNYLFNBQVEsa0JBQXdDO0lBb0NoRCxZQUNFLEdBQXFCLEVBQ3JCLFFBQWtCLEVBR1gsT0FBa0IsRUFDTixRQUFtQixFQUNuQixFQUEyQixFQUN2QyxzQkFBaUQsRUFDakQsYUFBc0MsRUFDckMsYUFBc0MsRUFDdEMsZUFBMEMsRUFDOUIsbUJBQTBDLEVBQzFDLGdCQUEwQyxFQUNqQyxVQUFlLEVBQ3BDLFlBQXFDLEVBQ3JDLEdBQXNCO1FBRTlCLEtBQUssQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFiM0QsWUFBTyxHQUFQLE9BQU8sQ0FBVztRQUNOLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsT0FBRSxHQUFGLEVBQUUsQ0FBeUI7UUFDdkMsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUEyQjtRQUNqRCxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFDckMsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQ3RDLG9CQUFlLEdBQWYsZUFBZSxDQUEyQjtRQUM5Qix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXVCO1FBQzFDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBMEI7UUFDakMsZUFBVSxHQUFWLFVBQVUsQ0FBSztRQUNwQyxpQkFBWSxHQUFaLFlBQVksQ0FBeUI7UUFDckMsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFqRFYsZ0JBQVcsR0FBRyxFQUFFLENBQUM7UUFFYixtQkFBYyxHQUFHLElBQUksWUFBWSxDQUFTLEtBQUssQ0FBQyxDQUFDO1FBQ2xELGtCQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7UUFFdkU7O1dBRUc7UUFDMkIsdUJBQWtCLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDO1FBTWhHLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUdoQixrQkFBYSxHQUF1QjtZQUNsQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFFBQVE7WUFDdEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLO1lBQ25CLE1BQU0sRUFBRSxZQUFZLENBQUMsS0FBSztZQUMxQixPQUFPLEVBQUUsWUFBWSxDQUFDLEtBQUs7U0FDNUIsQ0FBQztRQUVpQixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBSXJCLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBdUJ2QixJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1NBQzlCO1FBQ0QseUZBQXlGO1FBQ3pGLHNCQUFzQixDQUFDLGNBQWMsR0FBRyxJQUFJLHlCQUF5QixFQUFLLENBQUM7UUFDM0UsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQ0ksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLGVBQWUsQ0FBQztJQUNyRCxDQUFDO0lBQ0QsSUFBSSxXQUFXLENBQUMsS0FBdUI7UUFDckMsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsc0JBQXNCLENBQUMsY0FBYyxHQUFHLElBQUksd0JBQXdCLEVBQUssQ0FBQztTQUNoRjthQUFNO1lBQ0wsc0dBQXNHO1lBQ3RHLDRGQUE0RjtZQUM1RixJQUFJLENBQUMsc0JBQXNCLENBQUMsY0FBYyxHQUFHLElBQUkseUJBQXlCLEVBQUssQ0FBQztTQUNqRjtRQUNELElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCxzRkFBc0Y7SUFDdEYsbUdBQW1HO0lBQ25HLElBQWEsRUFBRTtRQUNiLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsR0FBRyxXQUFXLENBQUM7SUFDaEQsQ0FBQztJQUNELElBQWEsRUFBRSxDQUFDLEVBQVU7UUFDeEIsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBQ0QsSUFBSSxVQUFVLENBQUMsSUFBWTtRQUN6QixnR0FBZ0c7UUFDaEcsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUM3QixJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFO2dCQUMzQixJQUFJLENBQUMsc0JBQXNCLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQzthQUNwRDtZQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMzQztRQUNELGdHQUFnRztRQUNoRyxzR0FBc0c7UUFDdEcsb0dBQW9HO1FBQ3BHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUM3RCxDQUFDO0lBRUQsSUFBSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFBSSxnQkFBZ0I7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsTUFBTSxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztTQUM5RTtRQUNELE9BQVEsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGNBQThDLENBQUMsS0FBSyxDQUFDO0lBQzNGLENBQUM7SUFFRCxJQUFJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxJQUFJLHdCQUF3QjtRQUMxQixPQUFPLFlBQVksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUM7SUFDbEQsQ0FBQztJQUVELElBQVksUUFBUTtRQUNsQixPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFFL0Isb0NBQW9DO1FBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ3pELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDbkU7SUFDSCxDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDNUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFDekQsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFDdkQsdURBQXVEO1FBQ3ZELDBEQUEwRDtRQUMxRCxrRUFBa0U7UUFDbEUsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFHRCxPQUFPLENBQUMsS0FBb0I7UUFDMUIsMEVBQTBFO1FBQzFFLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3JGLE1BQU0sVUFBVSxHQUFRLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxjQUFjLENBQUMsS0FBWSxDQUFDO1lBQ2hGLElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN2QyxNQUFNLFFBQVEsR0FBTSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDaEQ7U0FDRjtJQUNILENBQUM7SUFFRCxPQUFPO1FBQ0wsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxLQUFzQjtRQUN2QyxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxHQUFHLEtBQUssS0FBSyxlQUFlLENBQUMsT0FBTyxDQUFDO1FBQ3hFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDL0IsSUFBSSxLQUFLLEtBQUssZUFBZSxDQUFDLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDM0UsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLElBQU87UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNsQixJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLO1FBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUN6RixJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1NBQ3RCO0lBQ0gsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUVwQixrR0FBa0c7UUFDbEcsMERBQTBEO1FBQzFELElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELHFCQUFxQjtRQUNuQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFO1lBQzVELE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7U0FDMUY7UUFDRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ25ELENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFjO1FBQ3ZCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxjQUFjLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUN6RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxTQUFjO1FBQzlCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLENBQUM7SUFDckMsQ0FBQztJQUVELGdCQUFnQixDQUFDLFFBQWE7UUFDNUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQztJQUNuQyxDQUFDO0lBRUQsbUJBQW1CO1FBQ2pCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztRQUNsRCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsQ0FBQztJQUM3RCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsYUFBYTtJQUNmLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRU8sdUJBQXVCO1FBQzdCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixJQUFJLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsWUFBOEIsRUFBRSxFQUFFO1lBQ3hGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNwQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDaEM7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ2hFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQzthQUNqQztZQUNELElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUNILENBQUM7UUFFRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzdDLElBQUksSUFBSSxFQUFFO2dCQUNSLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2FBQ3pCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2FBQ25EO1lBQ0QsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQzthQUN0QjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDbkc7UUFDSCxDQUFDLENBQUMsQ0FDSCxDQUFDO1FBRUYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUN4RCx5Q0FBeUM7WUFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDMUIsT0FBTzthQUNSO1lBQ0QsTUFBTSxPQUFPLEdBQWdCLFdBQTBCLENBQUM7WUFDeEQsNkNBQTZDO1lBQzdDLElBQUksT0FBTyxDQUFDLHFCQUFxQixFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsR0FBRyxFQUFFO2dCQUMzRixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQzthQUMxRztRQUNILENBQUMsQ0FBQyxDQUNILENBQUM7UUFFRixJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3pELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sS0FBSyxhQUFhLENBQUMsT0FBTyxDQUFDO1lBQ3BGLENBQUMsQ0FBQyxDQUNILENBQUM7U0FDSDtJQUNILENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxLQUF1QjtRQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDMUUsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNuQixJQUFJLENBQUMsc0JBQXNCLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7YUFDNUQ7U0FDRjtJQUNILENBQUM7SUFFTyxrQkFBa0I7UUFDeEIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDekU7SUFDSCxDQUFDO0lBRU8sZUFBZSxDQUFDLEtBQWM7UUFDcEMsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN6QixLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNqQjtZQUNELE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRSxJQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQzVFO1FBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUQsQ0FBQzs7d0dBN1RVLFdBQVcsNGJBbURaLFdBQVc7NEZBbkRWLFdBQVcsMGFBZFg7UUFDVCxzQkFBc0I7UUFDdEIsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUU7UUFDdEQscUJBQXFCO1FBQ3JCLHNCQUFzQjtRQUN0QiwrQkFBK0I7S0FDaEMsc0VBd0JhLGlCQUFpQiwwRUFlakIsVUFBVSxrVUN0RzFCLDArR0E4RkE7MkZEdkJhLFdBQVc7a0JBakJ2QixTQUFTOytCQUNFLGNBQWMsYUFFYjt3QkFDVCxzQkFBc0I7d0JBQ3RCLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLGFBQWEsRUFBRTt3QkFDdEQscUJBQXFCO3dCQUNyQixzQkFBc0I7d0JBQ3RCLCtCQUErQjtxQkFDaEMsa0JBQ2UsQ0FBQyx1QkFBdUIsQ0FBQyxRQUNuQzt3QkFDSix1QkFBdUIsRUFBRSxNQUFNO3dCQUMvQixzQkFBc0IsRUFBRSxNQUFNO3dCQUM5QiwrQkFBK0IsRUFBRSxtQkFBbUI7cUJBQ3JEOzswQkEwQ0UsSUFBSTs7MEJBQ0osUUFBUTs7MEJBUVIsUUFBUTs7MEJBQ1IsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyxXQUFXOytHQS9DQyxXQUFXO3NCQUFoQyxLQUFLO3VCQUFDLGFBQWE7Z0JBRU0sY0FBYztzQkFBdkMsTUFBTTt1QkFBQyxnQkFBZ0I7Z0JBQ0MsYUFBYTtzQkFBckMsTUFBTTt1QkFBQyxlQUFlO2dCQUtPLGtCQUFrQjtzQkFBL0MsTUFBTTt1QkFBQyxvQkFBb0I7Z0JBRUQsT0FBTztzQkFBakMsU0FBUzt1QkFBQyxjQUFjO2dCQUNILE9BQU87c0JBQTVCLFNBQVM7dUJBQUMsU0FBUztnQkFDYSxjQUFjO3NCQUE5QyxZQUFZO3VCQUFDLGlCQUFpQjtnQkFlRyxPQUFPO3NCQUF4QyxZQUFZO3VCQUFDLFVBQVU7Z0JBa0NwQixXQUFXO3NCQURkLEtBQUs7dUJBQUMsVUFBVTtnQkE2RmpCLE9BQU87c0JBRE4sWUFBWTt1QkFBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBQTEFURk9STV9JRCxcbiAgUmVuZGVyZXIyLFxuICBTZWxmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5nQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgSUZfQUNUSVZFX0lEX1BST1ZJREVSIH0gZnJvbSAnLi4vLi4vdXRpbHMvY29uZGl0aW9uYWwvaWYtYWN0aXZlLnNlcnZpY2UnO1xuaW1wb3J0IHsgS2V5cyB9IGZyb20gJy4uLy4uL3V0aWxzL2VudW1zL2tleXMuZW51bSc7XG5pbXBvcnQgeyBGT0NVU19TRVJWSUNFX1BST1ZJREVSIH0gZnJvbSAnLi4vLi4vdXRpbHMvZm9jdXMvZm9jdXMuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL2kxOG4vY29tbW9uLXN0cmluZ3Muc2VydmljZSc7XG5pbXBvcnQgeyBDbHJMb2FkaW5nU3RhdGUgfSBmcm9tICcuLi8uLi91dGlscy9sb2FkaW5nL2xvYWRpbmcnO1xuaW1wb3J0IHsgTG9hZGluZ0xpc3RlbmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvbG9hZGluZy9sb2FkaW5nLWxpc3RlbmVyJztcbmltcG9ydCB7IENsckFsaWdubWVudCB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvZW51bXMvYWxpZ25tZW50LmVudW0nO1xuaW1wb3J0IHsgQ2xyQXhpcyB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvZW51bXMvYXhpcy5lbnVtJztcbmltcG9ydCB7IENsclNpZGUgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL2VudW1zL3NpZGUuZW51bSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyUG9zaXRpb24gfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL2ludGVyZmFjZXMvcG9wb3Zlci1wb3NpdGlvbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ2xyUG9wb3Zlckhvc3REaXJlY3RpdmUgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL3BvcG92ZXItaG9zdC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclBvc2l0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcHJvdmlkZXJzL3BvcG92ZXItcG9zaXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcHJvdmlkZXJzL3BvcG92ZXItdG9nZ2xlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ09OVFJPTF9TVEFURSwgSWZDb250cm9sU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL2lmLWNvbnRyb2wtc3RhdGUvaWYtY29udHJvbC1zdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IFdyYXBwZWRGb3JtQ29udHJvbCB9IGZyb20gJy4uL2NvbW1vbi93cmFwcGVkLWNvbnRyb2wnO1xuaW1wb3J0IHsgQ2xyQ29tYm9ib3hDb250YWluZXIgfSBmcm9tICcuL2NvbWJvYm94LWNvbnRhaW5lcic7XG5pbXBvcnQgeyBDb21ib2JveE1vZGVsIH0gZnJvbSAnLi9tb2RlbC9jb21ib2JveC5tb2RlbCc7XG5pbXBvcnQgeyBNdWx0aVNlbGVjdENvbWJvYm94TW9kZWwgfSBmcm9tICcuL21vZGVsL211bHRpLXNlbGVjdC1jb21ib2JveC5tb2RlbCc7XG5pbXBvcnQgeyBTaW5nbGVTZWxlY3RDb21ib2JveE1vZGVsIH0gZnJvbSAnLi9tb2RlbC9zaW5nbGUtc2VsZWN0LWNvbWJvYm94Lm1vZGVsJztcbmltcG9ydCB7IENsck9wdGlvblNlbGVjdGVkIH0gZnJvbSAnLi9vcHRpb24tc2VsZWN0ZWQuZGlyZWN0aXZlJztcbmltcG9ydCB7IENsck9wdGlvbnMgfSBmcm9tICcuL29wdGlvbnMnO1xuaW1wb3J0IHsgQ29tYm9ib3hDb250YWluZXJTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvY29tYm9ib3gtY29udGFpbmVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ09NQk9CT1hfRk9DVVNfSEFORExFUl9QUk9WSURFUiwgQ29tYm9ib3hGb2N1c0hhbmRsZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9jb21ib2JveC1mb2N1cy1oYW5kbGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgT3B0aW9uU2VsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL29wdGlvbi1zZWxlY3Rpb24uc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1jb21ib2JveCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb21ib2JveC5odG1sJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgT3B0aW9uU2VsZWN0aW9uU2VydmljZSxcbiAgICB7IHByb3ZpZGU6IExvYWRpbmdMaXN0ZW5lciwgdXNlRXhpc3Rpbmc6IENsckNvbWJvYm94IH0sXG4gICAgSUZfQUNUSVZFX0lEX1BST1ZJREVSLFxuICAgIEZPQ1VTX1NFUlZJQ0VfUFJPVklERVIsXG4gICAgQ09NQk9CT1hfRk9DVVNfSEFORExFUl9QUk9WSURFUixcbiAgXSxcbiAgaG9zdERpcmVjdGl2ZXM6IFtDbHJQb3BvdmVySG9zdERpcmVjdGl2ZV0sXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmFyaWEtcmVxdWlyZWRdJzogJ3RydWUnLFxuICAgICdbY2xhc3MuY2xyLWNvbWJvYm94XSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmNsci1jb21ib2JveC1kaXNhYmxlZF0nOiAnY29udHJvbD8uZGlzYWJsZWQnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJDb21ib2JveDxUPlxuICBleHRlbmRzIFdyYXBwZWRGb3JtQ29udHJvbDxDbHJDb21ib2JveENvbnRhaW5lcj5cbiAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTG9hZGluZ0xpc3RlbmVyLCBBZnRlckNvbnRlbnRJbml0XG57XG4gIEBJbnB1dCgncGxhY2Vob2xkZXInKSBwbGFjZWhvbGRlciA9ICcnO1xuXG4gIEBPdXRwdXQoJ2NscklucHV0Q2hhbmdlJykgY2xySW5wdXRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oZmFsc2UpO1xuICBAT3V0cHV0KCdjbHJPcGVuQ2hhbmdlJykgY2xyT3BlbkNoYW5nZSA9IHRoaXMudG9nZ2xlU2VydmljZS5vcGVuQ2hhbmdlO1xuXG4gIC8qKlxuICAgKiBUaGlzIG91dHB1dCBzaG91bGQgYmUgdXNlZCB0byBzZXQgdXAgYSBsaXZlIHJlZ2lvbiB1c2luZyBhcmlhLWxpdmUgYW5kIHBvcHVsYXRlIGl0IHdpdGggdXBkYXRlcyB0aGF0IHJlZmxlY3QgZWFjaCBjb21ib2JveCBjaGFuZ2UuXG4gICAqL1xuICBAT3V0cHV0KCdjbHJTZWxlY3Rpb25DaGFuZ2UnKSBjbHJTZWxlY3Rpb25DaGFuZ2UgPSB0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uQ2hhbmdlZDtcblxuICBAVmlld0NoaWxkKCd0ZXh0Ym94SW5wdXQnKSB0ZXh0Ym94OiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCd0cmlnZ2VyJykgdHJpZ2dlcjogRWxlbWVudFJlZjxIVE1MQnV0dG9uRWxlbWVudD47XG4gIEBDb250ZW50Q2hpbGQoQ2xyT3B0aW9uU2VsZWN0ZWQpIG9wdGlvblNlbGVjdGVkOiBDbHJPcHRpb25TZWxlY3RlZDxUPjtcblxuICBpbnZhbGlkID0gZmFsc2U7XG4gIGZvY3VzZWQgPSBmYWxzZTtcbiAgZm9jdXNlZFBpbGw6IGFueTtcblxuICBzbWFydFBvc2l0aW9uOiBDbHJQb3BvdmVyUG9zaXRpb24gPSB7XG4gICAgYXhpczogQ2xyQXhpcy5WRVJUSUNBTCxcbiAgICBzaWRlOiBDbHJTaWRlLkFGVEVSLFxuICAgIGFuY2hvcjogQ2xyQWxpZ25tZW50LlNUQVJULFxuICAgIGNvbnRlbnQ6IENsckFsaWdubWVudC5TVEFSVCxcbiAgfTtcblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgaW5kZXggPSAxO1xuXG4gIEBDb250ZW50Q2hpbGQoQ2xyT3B0aW9ucykgcHJpdmF0ZSBvcHRpb25zOiBDbHJPcHRpb25zPFQ+O1xuXG4gIHByaXZhdGUgX3NlYXJjaFRleHQgPSAnJztcbiAgcHJpdmF0ZSBvblRvdWNoZWRDYWxsYmFjazogKCkgPT4gYW55O1xuICBwcml2YXRlIG9uQ2hhbmdlQ2FsbGJhY2s6IChtb2RlbDogVCB8IFRbXSkgPT4gYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHZjcjogVmlld0NvbnRhaW5lclJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQFNlbGYoKVxuICAgIEBPcHRpb25hbCgpXG4gICAgcHVibGljIGNvbnRyb2w6IE5nQ29udHJvbCxcbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHB1YmxpYyBvcHRpb25TZWxlY3Rpb25TZXJ2aWNlOiBPcHRpb25TZWxlY3Rpb25TZXJ2aWNlPFQ+LFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIHRvZ2dsZVNlcnZpY2U6IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgcG9zaXRpb25TZXJ2aWNlOiBDbHJQb3BvdmVyUG9zaXRpb25TZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgY29udHJvbFN0YXRlU2VydmljZTogSWZDb250cm9sU3RhdGVTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgY29udGFpbmVyU2VydmljZTogQ29tYm9ib3hDb250YWluZXJTZXJ2aWNlLFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogYW55LFxuICAgIHByaXZhdGUgZm9jdXNIYW5kbGVyOiBDb21ib2JveEZvY3VzSGFuZGxlcjxUPixcbiAgICBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgKSB7XG4gICAgc3VwZXIodmNyLCBDbHJDb21ib2JveENvbnRhaW5lciwgaW5qZWN0b3IsIGNvbnRyb2wsIHJlbmRlcmVyLCBlbCk7XG4gICAgaWYgKGNvbnRyb2wpIHtcbiAgICAgIGNvbnRyb2wudmFsdWVBY2Nlc3NvciA9IHRoaXM7XG4gICAgfVxuICAgIC8vIGRlZmF1bHQgdG8gU2luZ2xlU2VsZWN0Q29tYm9ib3hNb2RlbCwgaW4gY2FzZSB0aGUgb3B0aW9uYWwgaW5wdXQgW0Nsck11bHRpXSBpc24ndCB1c2VkXG4gICAgb3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbCA9IG5ldyBTaW5nbGVTZWxlY3RDb21ib2JveE1vZGVsPFQ+KCk7XG4gICAgdGhpcy51cGRhdGVDb250cm9sVmFsdWUoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyTXVsdGknKVxuICBnZXQgbXVsdGlTZWxlY3QoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5tdWx0aXNlbGVjdGFibGU7XG4gIH1cbiAgc2V0IG11bHRpU2VsZWN0KHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uTW9kZWwgPSBuZXcgTXVsdGlTZWxlY3RDb21ib2JveE1vZGVsPFQ+KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGluIHRoZW9yeSwgc2V0dGluZyB0aGlzIGFnYWluIHNob3VsZCBub3QgY2F1c2UgZXJyb3JzIGV2ZW4gdGhvdWdoIHdlIGFscmVhZHkgc2V0IGl0IGluIGNvbnN0cnVjdG9yLFxuICAgICAgLy8gc2luY2UgdGhlIGluaXRpYWwgY2FsbCB0byB3cml0ZVZhbHVlIChjYXVzZWQgYnkgW25nTW9kZWxdIGlucHV0KSBzaG91bGQgaGFwcGVuIGFmdGVyIHRoaXNcbiAgICAgIHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbCA9IG5ldyBTaW5nbGVTZWxlY3RDb21ib2JveE1vZGVsPFQ+KCk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlQ29udHJvbFZhbHVlKCk7XG4gIH1cblxuICAvLyBPdmVycmlkZSB0aGUgaWQgb2YgV3JhcHBlZEZvcm1Db250cm9sLCBhcyB3ZSB3YW50IHRvIG1vdmUgaXQgdG8gdGhlIGVtYmVkZGVkIGlucHV0LlxuICAvLyBPdGhlcndpc2UgdGhlIGxhYmVsL2NvbXBvbmVudCBjb25uZWN0aW9uIGRvZXMgbm90IHdvcmsgYW5kIHNjcmVlbiByZWFkZXJzIGRvIG5vdCByZWFkIHRoZSBsYWJlbC5cbiAgb3ZlcnJpZGUgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xJZFNlcnZpY2UuaWQgKyAnLWNvbWJvYm94JztcbiAgfVxuICBvdmVycmlkZSBzZXQgaWQoaWQ6IHN0cmluZykge1xuICAgIHN1cGVyLmlkID0gaWQ7XG4gIH1cblxuICBnZXQgc2VhcmNoVGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9zZWFyY2hUZXh0O1xuICB9XG4gIHNldCBzZWFyY2hUZXh0KHRleHQ6IHN0cmluZykge1xuICAgIC8vIGlmIGlucHV0IHRleHQgaGFzIGNoYW5nZWQgc2luY2UgbGFzdCB0aW1lLCBmaXJlIGEgY2hhbmdlIGV2ZW50IHNvIGFwcGxpY2F0aW9uIGNhbiByZWFjdCB0byBpdFxuICAgIGlmICh0ZXh0ICE9PSB0aGlzLl9zZWFyY2hUZXh0KSB7XG4gICAgICBpZiAodGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4pIHtcbiAgICAgICAgdGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLnNob3dBbGxPcHRpb25zID0gZmFsc2U7XG4gICAgICB9XG4gICAgICB0aGlzLl9zZWFyY2hUZXh0ID0gdGV4dDtcbiAgICAgIHRoaXMuY2xySW5wdXRDaGFuZ2UuZW1pdCh0aGlzLnNlYXJjaFRleHQpO1xuICAgIH1cbiAgICAvLyBXZSBuZWVkIHRvIHRyaWdnZXIgdGhpcyBldmVuIGlmIHVuY2hhbmdlZCwgc28gdGhlIG9wdGlvbi1pdGVtcyBkaXJlY3RpdmUgd2lsbCB1cGRhdGUgaXRzIGxpc3RcbiAgICAvLyBiYXNlZCBvbiB0aGUgXCJzaG93QWxsT3B0aW9uc1wiIHZhcmlhYmxlIHdoaWNoIG1heSBoYXZlIGNoYW5nZWQgaW4gdGhlIG9wZW5DaGFuZ2Ugc3Vic2NyaXB0aW9uIGJlbG93LlxuICAgIC8vIFRoZSBvcHRpb24taXRlbXMgZGlyZWN0aXZlIGRvZXMgbm90IGxpc3RlbiB0byBvcGVuQ2hhbmdlLCBidXQgaXQgbGlzdGVucyB0byBjdXJyZW50SW5wdXQgY2hhbmdlcy5cbiAgICB0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2UuY3VycmVudElucHV0ID0gdGhpcy5zZWFyY2hUZXh0O1xuICB9XG5cbiAgZ2V0IG9wZW5TdGF0ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW47XG4gIH1cblxuICBnZXQgbXVsdGlTZWxlY3RNb2RlbCgpOiBUW10ge1xuICAgIGlmICghdGhpcy5tdWx0aVNlbGVjdCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ211bHRpU2VsZWN0TW9kZWwgaXMgbm90IGF2YWlsYWJsZSBpbiBzaW5nbGUgc2VsZWN0aW9uIGNvbnRleHQnKTtcbiAgICB9XG4gICAgcmV0dXJuICh0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uTW9kZWwgYXMgTXVsdGlTZWxlY3RDb21ib2JveE1vZGVsPFQ+KS5tb2RlbDtcbiAgfVxuXG4gIGdldCBhcmlhQ29udHJvbHMoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zPy5vcHRpb25zSWQ7XG4gIH1cblxuICBnZXQgYXJpYU93bnMoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zPy5vcHRpb25zSWQ7XG4gIH1cblxuICBnZXQgYXJpYURlc2NyaWJlZEJ5U2VsZWN0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdzZWxlY3Rpb24tJyArIHRoaXMuaWQ7XG4gIH1cblxuICBnZXQgZGlzcGxheUZpZWxkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5kaXNwbGF5RmllbGQ7XG4gIH1cblxuICBwcml2YXRlIGdldCBkaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sPy5kaXNhYmxlZDtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemVTdWJzY3JpcHRpb25zKCk7XG5cbiAgICAvLyBJbml0aWFsaXplIHdpdGggcHJlc2VsZWN0ZWQgdmFsdWVcbiAgICBpZiAoIXRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbC5pc0VtcHR5KCkpIHtcbiAgICAgIHRoaXMudXBkYXRlSW5wdXRWYWx1ZSh0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uTW9kZWwpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmZvY3VzSGFuZGxlci5jb21wb25lbnRDZFJlZiA9IHRoaXMuY2RyO1xuICAgIHRoaXMuZm9jdXNIYW5kbGVyLnRleHRJbnB1dCA9IHRoaXMudGV4dGJveC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuZm9jdXNIYW5kbGVyLnRyaWdnZXIgPSB0aGlzLnRyaWdnZXIubmF0aXZlRWxlbWVudDtcbiAgICAvLyBUaGUgdGV4dCBpbnB1dCBpcyB0aGUgYWN0dWFsIGVsZW1lbnQgd2UgYXJlIHdyYXBwaW5nXG4gICAgLy8gVGhpcyBhc3NpZ25tZW50IGlzIG5lZWRlZCBieSB0aGUgd3JhcHBlciwgc28gaXQgY2FuIHNldFxuICAgIC8vIHRoZSBhcmlhIHByb3BlcnRpZXMgb24gdGhlIGlucHV0IGVsZW1lbnQsIG5vdCBvbiB0aGUgY29tcG9uZW50LlxuICAgIHRoaXMuZWwgPSB0aGlzLnRleHRib3g7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgb25LZXlVcChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIC8vIGlmIEJBQ0tTUEFDRSBpbiBtdWx0aXNlbGVjdCBtb2RlLCBkZWxldGUgdGhlIGxhc3QgcGlsbCBpZiB0ZXh0IGlzIGVtcHR5XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gS2V5cy5CYWNrc3BhY2UgJiYgdGhpcy5tdWx0aVNlbGVjdCAmJiB0aGlzLl9zZWFyY2hUZXh0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgbXVsdGlNb2RlbDogVFtdID0gdGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdGlvbk1vZGVsLm1vZGVsIGFzIFRbXTtcbiAgICAgIGlmIChtdWx0aU1vZGVsICYmIG11bHRpTW9kZWwubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBsYXN0SXRlbTogVCA9IG11bHRpTW9kZWxbbXVsdGlNb2RlbC5sZW5ndGggLSAxXTtcbiAgICAgICAgdGhpcy5jb250cm9sPy5jb250cm9sLm1hcmtBc1RvdWNoZWQoKTtcbiAgICAgICAgdGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLnVuc2VsZWN0KGxhc3RJdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbnB1dElkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbElkU2VydmljZS5pZDtcbiAgfVxuXG4gIGxvYWRpbmdTdGF0ZUNoYW5nZShzdGF0ZTogQ2xyTG9hZGluZ1N0YXRlKTogdm9pZCB7XG4gICAgdGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLmxvYWRpbmcgPSBzdGF0ZSA9PT0gQ2xyTG9hZGluZ1N0YXRlLkxPQURJTkc7XG4gICAgdGhpcy5wb3NpdGlvblNlcnZpY2UucmVhbGlnbigpO1xuICAgIGlmIChzdGF0ZSAhPT0gQ2xyTG9hZGluZ1N0YXRlLkxPQURJTkcgJiYgaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgdGhpcy5mb2N1c0ZpcnN0QWN0aXZlKCk7XG4gICAgfVxuICB9XG5cbiAgdW5zZWxlY3QoaXRlbTogVCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLnVuc2VsZWN0KGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIG9uQmx1cihldmVudCkge1xuICAgIGlmICghZXZlbnQucmVsYXRlZFRhcmdldCB8fCAhdGhpcy5vcHRpb25zLmVsPy5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSB7XG4gICAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrPy4oKTtcbiAgICAgIHRoaXMudHJpZ2dlclZhbGlkYXRpb24oKTtcbiAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIG9uRm9jdXMoKSB7XG4gICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcblxuICAgIC8vIGZpeCBmb3IgXCJleHByZXNzaW9uIGNoYW5nZWRcIiBlcnJvciB3aGVuIGZvY3VzIGlzIHJldHVybmVkIHRvIGEgY29tYm9ib3ggYWZ0ZXIgYSBtb2RhbCBpcyBjbG9zZWRcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdm13YXJlLWNsYXJpdHkvbmctY2xhcml0eS9pc3N1ZXMvNjYzXG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgZ2V0U2VsZWN0aW9uQXJpYUxhYmVsKCkge1xuICAgIGlmICh0aGlzLmNvbnRhaW5lclNlcnZpY2UgJiYgdGhpcy5jb250YWluZXJTZXJ2aWNlLmxhYmVsVGV4dCkge1xuICAgICAgcmV0dXJuIGAke3RoaXMuY29udGFpbmVyU2VydmljZS5sYWJlbFRleHR9ICR7dGhpcy5jb21tb25TdHJpbmdzLmtleXMuY29tYm9ib3hTZWxlY3Rpb259YDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmNvbWJvYm94U2VsZWN0aW9uO1xuICB9XG5cbiAgZm9jdXNGaXJzdEFjdGl2ZSgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuZm9jdXNIYW5kbGVyLmZvY3VzRmlyc3RBY3RpdmUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IFQgfCBUW10pOiB2b2lkIHtcbiAgICB0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uTW9kZWwubW9kZWwgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZUlucHV0VmFsdWUodGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdGlvbk1vZGVsKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKG9uVG91Y2hlZDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjayA9IG9uVG91Y2hlZDtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2Uob25DaGFuZ2U6IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayA9IG9uQ2hhbmdlO1xuICB9XG5cbiAgZ2V0QWN0aXZlRGVzY2VuZGFudCgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHRoaXMuZm9jdXNIYW5kbGVyLnBzZXVkb0ZvY3VzLm1vZGVsO1xuICAgIHJldHVybiBtb2RlbCA/IG1vZGVsLmlkIDogdGhpcy5vcHRpb25zPy5ub1Jlc3VsdHNFbGVtZW50SWQ7XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKCk6IHZvaWQge1xuICAgIC8vIGRvIG5vdGhpbmdcbiAgfVxuXG4gIGZvY3VzSW5wdXQoKSB7XG4gICAgdGhpcy5mb2N1c0hhbmRsZXIuZm9jdXNJbnB1dCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplU3Vic2NyaXB0aW9ucygpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25DaGFuZ2VkLnN1YnNjcmliZSgobmV3U2VsZWN0aW9uOiBDb21ib2JveE1vZGVsPFQ+KSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlSW5wdXRWYWx1ZShuZXdTZWxlY3Rpb24pO1xuICAgICAgICBpZiAodGhpcy5tdWx0aVNlbGVjdCkge1xuICAgICAgICAgIHRoaXMucG9zaXRpb25TZXJ2aWNlLnJlYWxpZ24oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMubXVsdGlTZWxlY3QgJiYgbmV3U2VsZWN0aW9uICYmICFuZXdTZWxlY3Rpb24uaXNFbXB0eSgpKSB7XG4gICAgICAgICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRyb2xWYWx1ZSgpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbkNoYW5nZS5zdWJzY3JpYmUob3BlbiA9PiB7XG4gICAgICAgIGlmIChvcGVuKSB7XG4gICAgICAgICAgdGhpcy5mb2N1c0ZpcnN0QWN0aXZlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLnNob3dBbGxPcHRpb25zID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tdWx0aVNlbGVjdCkge1xuICAgICAgICAgIHRoaXMuc2VhcmNoVGV4dCA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2VhcmNoVGV4dCA9IHRoaXMuZ2V0RGlzcGxheU5hbWVzKHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbC5tb2RlbClbMF0gfHwgJyc7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy50b2dnbGVTZXJ2aWNlLnBvcG92ZXJBbGlnbmVkLnN1YnNjcmliZShwb3BvdmVyTm9kZSA9PiB7XG4gICAgICAgIC8vIFdoZW4gdXNlZCBvdXRzaWRlIGEgY29tYm9ib3ggY29udGFpbmVyXG4gICAgICAgIGlmICghdGhpcy5jb250YWluZXJTZXJ2aWNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvcG92ZXI6IEhUTUxFbGVtZW50ID0gcG9wb3Zlck5vZGUgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIC8vIFVwZGF0ZSBwb3NpdGlvbiBpZiBwb3BvdmVyIGhpZGVzIHRoZSBsYWJlbFxuICAgICAgICBpZiAocG9wb3Zlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgPCB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShwb3BvdmVyTm9kZSwgJ3RvcCcsIGAke3BvcG92ZXIub2Zmc2V0VG9wICsgdGhpcy5jb250YWluZXJTZXJ2aWNlLmxhYmVsT2Zmc2V0fXB4YCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGlmICh0aGlzLmNvbnRyb2xTdGF0ZVNlcnZpY2UpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICB0aGlzLmNvbnRyb2xTdGF0ZVNlcnZpY2Uuc3RhdHVzQ2hhbmdlcy5zdWJzY3JpYmUoaW52YWxpZCA9PiB7XG4gICAgICAgICAgdGhpcy5pbnZhbGlkID0gdGhpcy5jb250cm9sPy5jb250cm9sLnRvdWNoZWQgJiYgaW52YWxpZCA9PT0gQ09OVFJPTF9TVEFURS5JTlZBTElEO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUlucHV0VmFsdWUobW9kZWw6IENvbWJvYm94TW9kZWw8VD4pIHtcbiAgICBpZiAoIXRoaXMubXVsdGlTZWxlY3QpIHtcbiAgICAgIHRoaXMuc2VhcmNoVGV4dCA9IG1vZGVsLm1vZGVsID8gdGhpcy5nZXREaXNwbGF5TmFtZXMobW9kZWwubW9kZWwpWzBdIDogJyc7XG4gICAgICBpZiAodGhpcy5zZWFyY2hUZXh0KSB7XG4gICAgICAgIHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5jdXJyZW50SW5wdXQgPSB0aGlzLnNlYXJjaFRleHQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVDb250cm9sVmFsdWUoKSB7XG4gICAgaWYgKHRoaXMub25DaGFuZ2VDYWxsYmFjaykge1xuICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbC5tb2RlbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXREaXNwbGF5TmFtZXMobW9kZWw6IFQgfCBUW10pIHtcbiAgICBpZiAodGhpcy5kaXNwbGF5RmllbGQpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShtb2RlbCkpIHtcbiAgICAgICAgbW9kZWwgPSBbbW9kZWxdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1vZGVsLm1hcChpdGVtID0+IChpdGVtID8gKGl0ZW0gYXMgYW55KVt0aGlzLmRpc3BsYXlGaWVsZF0gOiBudWxsKSk7XG4gICAgfVxuICAgIHJldHVybiBbdGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLnNlbGVjdGlvbk1vZGVsLm1vZGVsXTtcbiAgfVxufVxuIiwiPCEtLVxuICB+IENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICB+IFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAgfiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICB+IFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbi0tPlxuXG48IS0tIFRoZSAoY2xpY2spIGhhbmRsZXIgaXMgbmVlZGVkIHRvIGF1dG8tZm9jdXMgb24gaW5wdXQgZmllbGQgd2hpY2ggY2FuIG5vdCBjdXJyZW50bHkgb2NjdXB5IHRoZSB3aG9sZVxuICAgICB3aWR0aCBvZiB0aGUgY29tcG9uZW50LCBhZnRlciBiZWluZyB3cmFwcGVkIHRvIGEgbmV3IGxpbmUgLS0+XG48ZGl2XG4gIGNsYXNzPVwiY2xyLWNvbWJvYm94LXdyYXBwZXJcIlxuICBjbHJQb3BvdmVyQW5jaG9yXG4gIChjbGljayk9XCJmb2N1c0lucHV0KClcIlxuICBbY2xhc3MubXVsdGldPVwibXVsdGlTZWxlY3RcIlxuICBbY2xhc3MuaW52YWxpZF09XCJpbnZhbGlkXCJcbiAgW2NsYXNzLmRpc2FibGVkXT1cImNvbnRyb2w/LmRpc2FibGVkPyB0cnVlOiBudWxsXCJcbj5cbiAgPHNwYW5cbiAgICAqbmdJZj1cIm11bHRpU2VsZWN0ICYmIG9wdGlvblNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uTW9kZWwubW9kZWwgJiYgbXVsdGlTZWxlY3RNb2RlbC5sZW5ndGggPiAwXCJcbiAgICByb2xlPVwiZ3JpZFwiXG4gICAgY2xyUm92aW5nVGFiaW5kZXhcbiAgICBbY2xyUm92aW5nVGFiaW5kZXhEaXNhYmxlZF09XCJjb250cm9sPy5kaXNhYmxlZFwiXG4gICAgY2xyRGlyZWN0aW9uPVwiYm90aFwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbF09XCJnZXRTZWxlY3Rpb25BcmlhTGFiZWwoKVwiXG4gICAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCJjb250cm9sPy5kaXNhYmxlZD8gdHJ1ZTogbnVsbFwiXG4gICAgY2xhc3M9XCJjbHItY29tYm9ib3gtcGlsbHNcIlxuICA+XG4gICAgPHNwYW4gKm5nRm9yPVwibGV0IGl0ZW0gb2YgbXVsdGlTZWxlY3RNb2RlbDsgbGV0IGkgPSBpbmRleFwiIGNsYXNzPVwibGFiZWwgbGFiZWwtY29tYm9ib3gtcGlsbFwiIHJvbGU9XCJyb3dcIj5cbiAgICAgIDxzcGFuIHJvbGU9XCJncmlkY2VsbFwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImNsci1jb21ib2JveC1waWxsLWNvbnRlbnRcIiBjbHJLZXlGb2N1c0l0ZW0+XG4gICAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICAgKm5nSWY9XCJvcHRpb25TZWxlY3RlZFwiXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJvcHRpb25TZWxlY3RlZC50ZW1wbGF0ZVwiXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogb3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbC5tb2RlbFtpXX1cIlxuICAgICAgICAgID48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9zcGFuPlxuICAgICAgPHNwYW4gcm9sZT1cImdyaWRjZWxsXCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbHJLZXlGb2N1c0l0ZW1cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzcz1cImNsci1jb21ib2JveC1yZW1vdmUtYnRuXCJcbiAgICAgICAgICBbZGlzYWJsZWRdPVwiY29udHJvbD8uZGlzYWJsZWQ/IHRydWU6IG51bGxcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiY29tbW9uU3RyaW5ncy5rZXlzLmNvbWJvYm94RGVsZXRlICsgJyAnICsgb3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbC50b1N0cmluZyhkaXNwbGF5RmllbGQsIGkpXCJcbiAgICAgICAgICAoY2xpY2spPVwidW5zZWxlY3QoaXRlbSlcIlxuICAgICAgICA+XG4gICAgICAgICAgPGNkcy1pY29uIHNoYXBlPVwid2luZG93LWNsb3NlXCIgc2l6ZT1cIjEyXCI+PC9jZHMtaWNvbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L3NwYW4+XG4gICAgPC9zcGFuPlxuICA8L3NwYW4+XG5cbiAgPGlucHV0XG4gICAgI3RleHRib3hJbnB1dFxuICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICByb2xlPVwiY29tYm9ib3hcIlxuICAgIFtpZF09XCJpbnB1dElkKClcIlxuICAgIGNsYXNzPVwiY2xyLWlucHV0IGNsci1jb21ib2JveC1pbnB1dFwiXG4gICAgWyhuZ01vZGVsKV09XCJzZWFyY2hUZXh0XCJcbiAgICAoYmx1cik9XCJvbkJsdXIoJGV2ZW50KVwiXG4gICAgKGZvY3VzKT1cIm9uRm9jdXMoKVwiXG4gICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJvcGVuU3RhdGVcIlxuICAgIFthdHRyLmFyaWEtb3duc109XCJhcmlhT3duc1wiXG4gICAgYXJpYS1oYXNwb3B1cD1cImxpc3Rib3hcIlxuICAgIGFyaWEtYXV0b2NvbXBsZXRlPVwibGlzdFwiXG4gICAgYXV0b2NvbXBsZXRlPVwib2ZmXCJcbiAgICBbYXR0ci5hcmlhLWludmFsaWRdPVwiY29udHJvbD8uaW52YWxpZD8gdHJ1ZTogbnVsbFwiXG4gICAgW2Rpc2FibGVkXT1cImNvbnRyb2w/LmRpc2FibGVkPyB0cnVlOiBudWxsXCJcbiAgICBbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdPVwiZ2V0QWN0aXZlRGVzY2VuZGFudCgpXCJcbiAgICBbYXR0ci5wbGFjZWhvbGRlcl09XCJwbGFjZWhvbGRlclwiXG4gIC8+XG5cbiAgPCEtLSBObyBjbGljayBoYW5kbGVyLCBhcyBpdCB1c2VzIHRoZSBoYW5kbGVyIG9uIHRoZSAuY2xyLWNvbWJvYm94LXdyYXBwZXIgLS0+XG4gIDxidXR0b25cbiAgICBjbHJQb3BvdmVyT3BlbkNsb3NlQnV0dG9uXG4gICAgI3RyaWdnZXJcbiAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICBjbGFzcz1cImNsci1jb21ib2JveC10cmlnZ2VyXCJcbiAgICB0YWJpbmRleD1cIi0xXCJcbiAgICBbZGlzYWJsZWRdPVwiY29udHJvbD8uZGlzYWJsZWQgfHwgbnVsbFwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMuY29tYm9ib3hPcGVuXCJcbiAgPlxuICAgIDxjZHMtaWNvbiBzaGFwZT1cImFuZ2xlXCIgZGlyZWN0aW9uPVwiZG93blwiPjwvY2RzLWljb24+XG4gIDwvYnV0dG9uPlxuXG4gIDxkaXYgY2xhc3M9XCJjbHItZm9jdXMtaW5kaWNhdG9yXCIgW2NsYXNzLmNsci1mb2N1c109XCJmb2N1c2VkXCI+PC9kaXY+XG48L2Rpdj5cblxuPCEtLSBCb3RoIGNsb3NlIGhhbmRsZXJzIGFyZSBoYW5kbGVkIG1hbnVhbGx5IGR1ZSB0byBpc3N1ZXMgaW4gRWRnZSBicm93c2VyLlxuICAgICBBZGRpdGlvbmFsbHkgJ291dHNpZGVDbGlja1RvQ2xvc2UnIGhhcyBjb21wbGV4IGhhbmRsaW5nIHRoYXQncyBuZWNlc3NhcnlcbiAgICAgdG8gYmUgbWFudWFsIGR1ZSB0byB0aGUgY29tcG9uZW50IGFyY2hpdGVjdHVyZSAtLT5cbjxkaXYgcm9sZT1cImRpYWxvZ1wiICpjbHJQb3BvdmVyQ29udGVudD1cIm9wZW5TdGF0ZSBhdCBzbWFydFBvc2l0aW9uOyBvdXRzaWRlQ2xpY2tUb0Nsb3NlOiBmYWxzZTsgc2Nyb2xsVG9DbG9zZTogZmFsc2VcIj5cbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuPC9kaXY+XG4iXX0=