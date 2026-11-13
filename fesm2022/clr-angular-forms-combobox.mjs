import * as i3 from "@angular/common";
import { CommonModule, NgForOf, isPlatformBrowser } from "@angular/common";
import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, DOCUMENT, Directive, EventEmitter, Host, HostBinding, HostListener, Inject, Injectable, Injector, Input, NgModule, Optional, Output, PLATFORM_ID, Self, ViewChild, ViewChildren, afterNextRender, booleanAttribute, inject } from "@angular/core";
import * as i1 from "@angular/forms";
import { FormsModule } from "@angular/forms";
import * as i1$3 from "@clr/angular/forms/common";
import { ClrAbstractContainer, ClrCommonFormsModule, ControlClassService, ControlIdService, NgControlService, WrappedFormControl } from "@clr/angular/forms/common";
import * as i9 from "@clr/angular/icon";
import { ClarityIcons, ClrIcon, angleIcon, errorStandardIcon, successStandardIcon, windowCloseIcon } from "@clr/angular/icon";
import * as i1$2 from "@clr/angular/popover/common";
import { ClrPopoverHostDirective, ClrPopoverModuleNext, ClrPopoverPosition, ClrPopoverType, POPOVER_HOST_ORIGIN } from "@clr/angular/popover/common";
import * as i5 from "@clr/angular/progress/spinner";
import { ClrSpinnerModule } from "@clr/angular/progress/spinner";
import * as i1$1 from "@clr/angular/utils";
import { ArrowKeyDirection, ClrConditionalModule, ClrKeyFocusModule, ClrLoadingState, FOCUS_SERVICE_PROVIDER, IF_ACTIVE_ID, IF_ACTIVE_ID_PROVIDER, Keys, LoadingListener, customFocusableItemProvider, uniqueIdFactory } from "@clr/angular/utils";
import { BehaviorSubject, EMPTY, ReplaySubject, Subject, Subscription, debounceTime, merge, timer } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
var ComboboxContainerService = class ComboboxContainerService {
	constructor() {
		this.labelOffset = 0;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ComboboxContainerService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ComboboxContainerService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ComboboxContainerService,
	decorators: [{ type: Injectable }]
});
var ClrComboboxContainer = class ClrComboboxContainer extends ClrAbstractContainer {
	constructor(layoutService, controlClassService, ngControlService, containerService, el) {
		super(layoutService, controlClassService, ngControlService);
		this.containerService = containerService;
		this.el = el;
	}
	ngAfterContentInit() {
		if (this.label) this.containerService.labelText = this.label.labelText;
	}
	ngAfterViewInit() {
		this.containerService.labelOffset = this.controlContainer.nativeElement.offsetHeight - this.el.nativeElement.offsetHeight;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrComboboxContainer,
			deps: [
				{
					token: i1$3.LayoutService,
					optional: true
				},
				{ token: i1$3.ControlClassService },
				{ token: i1$3.NgControlService },
				{ token: ComboboxContainerService },
				{ token: i0.ElementRef }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrComboboxContainer,
			isStandalone: false,
			selector: "clr-combobox-container",
			host: { properties: {
				"class.clr-form-control": "true",
				"class.clr-combobox-form-control": "true",
				"class.clr-form-control-disabled": "control?.disabled",
				"class.clr-row": "addGrid()"
			} },
			providers: [
				NgControlService,
				ControlIdService,
				ControlClassService,
				ComboboxContainerService
			],
			viewQueries: [{
				propertyName: "controlContainer",
				first: true,
				predicate: ["controlContainer"],
				descendants: true
			}],
			usesInheritance: true,
			ngImport: i0,
			template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()" #controlContainer>
      <ng-content select="clr-combobox"></ng-content>
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
			isInline: true,
			dependencies: [{
				kind: "directive",
				type: i3.NgClass,
				selector: "[ngClass]",
				inputs: ["class", "ngClass"]
			}, {
				kind: "directive",
				type: i1$3.ClrControlLabel,
				selector: "label",
				inputs: ["id", "for"]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrComboboxContainer,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-combobox-container",
			template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()" #controlContainer>
      <ng-content select="clr-combobox"></ng-content>
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
				"[class.clr-form-control]": "true",
				"[class.clr-combobox-form-control]": "true",
				"[class.clr-form-control-disabled]": "control?.disabled",
				"[class.clr-row]": "addGrid()"
			},
			providers: [
				NgControlService,
				ControlIdService,
				ControlClassService,
				ComboboxContainerService
			],
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{
			type: i1$3.LayoutService,
			decorators: [{ type: Optional }]
		},
		{ type: i1$3.ControlClassService },
		{ type: i1$3.NgControlService },
		{ type: ComboboxContainerService },
		{ type: i0.ElementRef }
	],
	propDecorators: { controlContainer: [{
		type: ViewChild,
		args: ["controlContainer"]
	}] }
});
var ComboboxModel = class {
	constructor() {
		this.identityFn = (item) => item;
	}
};
var MultiSelectComboboxModel = class extends ComboboxModel {
	containsItem(item) {
		if (this.model === null || this.model === void 0) return false;
		return this.model.some((m) => this.identityFn(m) === this.identityFn(item));
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
		let displayString = "";
		if (this.model) {
			if (index > -1) {
				if (this.model[index]) {
					if (displayField && this.model[index][displayField]) displayString += this.model[index][displayField];
					else displayString += this.model[index].toString();
				}
			} else this.model.forEach((model) => {
				if (displayField && model[displayField]) displayString += model[displayField];
				else displayString += model.toString();
				displayString += " ";
			});
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
		if (this.model === null || this.model === void 0) return;
		const index = this.model.findIndex((m) => this.identityFn(m) === this.identityFn(item));
		if (index > -1) this.model.splice(index, 1);
		if (this.model.length === 0) this.model = null;
	}
};
var SingleSelectComboboxModel = class extends ComboboxModel {
	containsItem(item) {
		if (this.model === null || this.model === void 0) return false;
		return this.identityFn(this.model) === this.identityFn(item);
	}
	select(item) {
		this.model = item;
	}
	unselect(item) {
		if (this.containsItem(item)) this.model = null;
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
		if (!this.model) return "";
		if (displayField && this.model[displayField]) return this.model[displayField];
		else return this.model.toString();
	}
};
var ClrOptionSelected = class ClrOptionSelected {
	constructor(template) {
		this.template = template;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrOptionSelected,
			deps: [{ token: i0.TemplateRef }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrOptionSelected,
			isStandalone: false,
			selector: "[clrOptionSelected]",
			inputs: { selected: ["clrOptionSelected", "selected"] },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrOptionSelected,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrOptionSelected]",
			standalone: false
		}]
	}],
	ctorParameters: () => [{ type: i0.TemplateRef }],
	propDecorators: { selected: [{
		type: Input,
		args: ["clrOptionSelected"]
	}] }
});
var PseudoFocusModel = class extends SingleSelectComboboxModel {
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
};
var OptionSelectionService = class OptionSelectionService {
	constructor() {
		this.loading = false;
		this.editable = false;
		this.showSelectAll = false;
		this.showAllOptions = true;
		this._currentInput = "";
		this._inputChanged = new BehaviorSubject("");
		this._selectionChanged = new ReplaySubject(1);
		this._selectAllRequested = new Subject();
		this.editableResolver = (input) => input;
		this._identityFn = (item) => item;
		this.inputChanged = this._inputChanged.asObservable();
	}
	get displayField() {
		return this._displayField;
	}
	set displayField(value) {
		this._displayField = value;
		if (this.selectionModel) this.selectionModel.displayField = value;
	}
	get currentInput() {
		return this._currentInput;
	}
	set currentInput(input) {
		if (input === "" && !this.multiselectable) this.setSelectionValue(null);
		this._currentInput = input;
		this._inputChanged.next(input);
	}
	get selectionChanged() {
		return this._selectionChanged.asObservable();
	}
	get multiselectable() {
		return this.selectionModel instanceof MultiSelectComboboxModel;
	}
	get identityFn() {
		return this._identityFn;
	}
	set identityFn(value) {
		this._identityFn = value || ((item) => item);
		if (this.selectionModel) this.selectionModel.identityFn = this._identityFn;
	}
	get selectAllRequested() {
		return this._selectAllRequested.asObservable();
	}
	requestSelectAll() {
		this._selectAllRequested.next();
	}
	select(item) {
		if (item === null || item === void 0 || this.selectionModel.containsItem(item)) return;
		this.selectionModel.select(item);
		this._selectionChanged.next(this.selectionModel);
	}
	toggle(item) {
		if (item === null || item === void 0) return;
		if (this.selectionModel.containsItem(item)) this.selectionModel.unselect(item);
		else this.selectionModel.select(item);
		this._selectionChanged.next(this.selectionModel);
	}
	selectMany(items) {
		let changed = false;
		for (const item of items) if (!this.selectionModel.containsItem(item)) {
			this.selectionModel.select(item);
			changed = true;
		}
		if (changed) this._selectionChanged.next(this.selectionModel);
	}
	unselectMany(items) {
		if (!this.selectionModel || this.selectionModel.isEmpty()) return;
		let changed = false;
		for (const item of items) if (this.selectionModel.containsItem(item)) {
			this.selectionModel.unselect(item);
			changed = true;
		}
		if (changed) this._selectionChanged.next(this.selectionModel);
	}
	unselect(item) {
		if (item === null || item === void 0 || !this.selectionModel.containsItem(item)) return;
		this.selectionModel.unselect(item);
		this._selectionChanged.next(this.selectionModel);
	}
	containsAll(items) {
		if (!items.length || this.selectionModel.isEmpty()) return false;
		return items.every((item) => this.selectionModel.containsItem(item));
	}
	setSelectionValue(value) {
		if (!this.selectionModel) return;
		const current = this.selectionModel.model;
		if (this.valuesEqualByIdentity(current, value)) return;
		this.selectionModel.model = value;
		this._selectionChanged.next(this.selectionModel);
	}
	valuesEqualByIdentity(current, value) {
		if (current === value) return true;
		if ((current === null || current === void 0 || current === "") && (value === null || value === void 0 || value === "")) return true;
		if (current === null || current === void 0 || current === "" || value === null || value === void 0 || value === "") return false;
		if (this.multiselectable) {
			const cur = current;
			const val = value;
			if (cur.length !== val.length) return false;
			const curIds = cur.map(this._identityFn);
			const valIds = val.map(this._identityFn);
			return curIds.every((id, i) => id === valIds[i]);
		} else return this._identityFn(current) === this._identityFn(value);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: OptionSelectionService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: OptionSelectionService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: OptionSelectionService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => []
});
var ComboboxFocusHandler = class ComboboxFocusHandler {
	constructor(rendererFactory, popoverService, selectionService, platformId) {
		this.popoverService = popoverService;
		this.selectionService = selectionService;
		this.platformId = platformId;
		this.pseudoFocus = new PseudoFocusModel();
		this.subscriptions = new Subscription();
		this.focusRequests = new Subject();
		this.unlisteners = [];
		this.optionData = [];
		this.handleFocusSubscription();
		this.subscriptions.add(merge(this.focusRequests.pipe(map(() => true)), popoverService.openChange.pipe(map(() => false))).pipe(switchMap((requested) => requested ? timer(0) : EMPTY)).subscribe(() => this.focusFirstActive()));
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
		this.unlisteners.push(this.renderer.listen(el, "keydown", (event) => !this.handleTextInput(event)));
		this.addFocusOnBlurListener(el);
	}
	ngOnDestroy() {
		this.subscriptions.unsubscribe();
		this.unlisteners.forEach((unlisten) => unlisten());
	}
	focusInput() {
		if (this.textInput && isPlatformBrowser(this.platformId)) this.textInput.focus({ preventScroll: true });
	}
	scheduleFocusFirstActive() {
		this.focusRequests.next();
	}
	focusFirstActive() {
		if (this.optionData.length > 0) {
			if (this.selectionService.selectionModel.isEmpty()) this.pseudoFocus.select(this.optionData[0]);
			else {
				let firstActive;
				if (this.selectionService.multiselectable) firstActive = this.selectionService.selectionModel.model[0];
				else firstActive = this.selectionService.selectionModel.model;
				const activeProxy = this.optionData.find((option) => option.value === firstActive);
				if (activeProxy) this.pseudoFocus.select(activeProxy);
				else this.pseudoFocus.select(this.optionData[0]);
				this.scrollIntoSelectedModel("auto");
			}
		}
	}
	addOptionValues(options) {
		this.optionData = options;
	}
	focusOption(option) {
		this.pseudoFocus.select(option);
	}
	handleFocusSubscription() {
		this.subscriptions.add(this.popoverService.openChange.subscribe((open) => {
			if (!open) this.pseudoFocus.model = null;
		}));
	}
	moveFocusTo(direction) {
		let index = this.optionData.findIndex((option) => option.equals(this.pseudoFocus.model));
		if (direction === ArrowKeyDirection.UP) {
			if (index === -1 || index === 0) index = this.optionData.length - 1;
			else index--;
		} else if (direction === ArrowKeyDirection.DOWN) {
			if (index === -1 || index === this.optionData.length - 1) index = 0;
			else index++;
		}
		this.pseudoFocus.select(this.optionData[index]);
		this.scrollIntoSelectedModel();
	}
	openAndMoveTo(direction) {
		if (!this.popoverService.open) {
			this.subscriptions.add(this.popoverService.openChange.pipe(take(1)).subscribe((open) => {
				if (open) this.moveFocusTo(direction);
			}));
			this.popoverService.open = true;
		} else this.moveFocusTo(direction);
	}
	handleTextInput(event) {
		let preventDefault = false;
		const key = event.key;
		if (event) switch (key) {
			case Keys.Enter:
				if (this.popoverService.open && this.pseudoFocus.model) {
					if (this.selectionService.multiselectable) {
						if (this.pseudoFocus.model.id === "select-all-id") this.selectionService.requestSelectAll();
						else this.selectionService.toggle(this.pseudoFocus.model.value);
					} else this.selectionService.select(this.pseudoFocus.model.value);
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
			default: if (event.key !== Keys.Tab && !(this.selectionService.multiselectable && event.key === Keys.Backspace) && !(event.key === Keys.Escape) && !this.popoverService.open) this.popoverService.open = true;
		}
		return preventDefault;
	}
	scrollIntoSelectedModel(behavior = "smooth") {
		if (this.pseudoFocus.model && this.pseudoFocus.model.el) this.pseudoFocus.model.el.scrollIntoView({
			behavior,
			block: "center",
			inline: "nearest"
		});
	}
	preventViewportScrolling(event) {
		event.preventDefault();
		event.stopImmediatePropagation();
	}
	addFocusOnBlurListener(el) {
		if (isPlatformBrowser(this.platformId)) this.unlisteners.push(this.renderer.listen(el, "blur", (event) => {
			if (this.focusOutOfComponent(event)) this.popoverService.open = false;
		}));
	}
	focusOutOfComponent(event) {
		const target = event.relatedTarget;
		return !(this.textInput?.contains(target) || this.trigger?.contains(target) || this.listbox?.contains(target));
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ComboboxFocusHandler,
			deps: [
				{ token: i0.RendererFactory2 },
				{ token: i1$2.ClrPopoverService },
				{ token: OptionSelectionService },
				{ token: PLATFORM_ID }
			],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ComboboxFocusHandler
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ComboboxFocusHandler,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [
		{ type: i0.RendererFactory2 },
		{ type: i1$2.ClrPopoverService },
		{ type: OptionSelectionService },
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [PLATFORM_ID]
			}]
		}
	]
});
const COMBOBOX_FOCUS_HANDLER_PROVIDER = customFocusableItemProvider(ComboboxFocusHandler);
var OptionData = class {
	constructor(id, value) {
		this.id = id;
		this.value = value;
	}
	equals(other) {
		if (!other) return false;
		return this.id === other.id && this.value === other.value;
	}
};
var ClrOption = class ClrOption {
	constructor(elRef, commonStrings, focusHandler, optionSelectionService) {
		this.elRef = elRef;
		this.commonStrings = commonStrings;
		this.focusHandler = focusHandler;
		this.optionSelectionService = optionSelectionService;
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
		return this.optionSelectionService.selectionModel && this.optionSelectionService.selectionModel.containsItem(this.value);
	}
	get focusClass() {
		return this.focusHandler.pseudoFocus.containsItem(this.optionProxy);
	}
	ngOnInit() {
		if (!this._id) {
			this._id = "clr-option-" + uniqueIdFactory();
			this.optionProxy.id = this._id;
		}
	}
	onClick(event) {
		event.stopPropagation();
		if (this.optionSelectionService.multiselectable) this.optionSelectionService.toggle(this.value);
		else this.optionSelectionService.select(this.value);
		this.focusHandler.focusOption(this.optionProxy);
		this.focusHandler.focusInput();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrOption,
			deps: [
				{ token: i0.ElementRef },
				{ token: i1$1.ClrCommonStringsService },
				{ token: ComboboxFocusHandler },
				{ token: OptionSelectionService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrOption,
			isStandalone: false,
			selector: "clr-option",
			inputs: {
				optionId: ["id", "optionId"],
				value: ["clrValue", "value"]
			},
			host: {
				listeners: { "click": "onClick($event)" },
				properties: {
					"class.clr-combobox-option": "true",
					"attr.role": "\"option\"",
					"attr.tabindex": "-1",
					"attr.id": "optionId",
					"class.active": "this.selected",
					"class.clr-focus": "this.focusClass"
				}
			},
			ngImport: i0,
			template: `
    <ng-content></ng-content>
    @if (selected) {
      <span class="clr-sr-only">{{ commonStrings.keys.comboboxSelected }}</span>
    }
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrOption,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-option",
			template: `
    <ng-content></ng-content>
    @if (selected) {
      <span class="clr-sr-only">{{ commonStrings.keys.comboboxSelected }}</span>
    }
  `,
			host: {
				"[class.clr-combobox-option]": "true",
				"[attr.role]": "\"option\"",
				"[attr.tabindex]": "-1",
				"[attr.id]": "optionId"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: i0.ElementRef },
		{ type: i1$1.ClrCommonStringsService },
		{ type: ComboboxFocusHandler },
		{ type: OptionSelectionService }
	],
	propDecorators: {
		optionId: [{
			type: Input,
			args: ["id"]
		}],
		value: [{
			type: Input,
			args: ["clrValue"]
		}],
		selected: [{
			type: HostBinding,
			args: ["class.active"]
		}],
		focusClass: [{
			type: HostBinding,
			args: ["class.clr-focus"]
		}],
		onClick: [{
			type: HostListener,
			args: ["click", ["$event"]]
		}]
	}
});
let nbOptionsComponents = 0;
const SELECT_ALL_ID = "select-all-id";
var ClrOptions = class ClrOptions {
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
		if (!parentHost) throw new Error("clr-options should only be used inside of a clr-combobox");
		if (!this.optionsId) this.optionsId = "clr-options-" + nbOptionsComponents++;
	}
	set selectAllBtn(value) {
		if (value) {
			this._selectAllOption = new OptionData(SELECT_ALL_ID, null);
			this._selectAllOption.el = value.nativeElement;
		} else this._selectAllOption = null;
		this.updateFocusableItems();
	}
	get items() {
		return this._items;
	}
	set items(items) {
		this._items = items;
		this.updateFocusableItems();
	}
	get emptyOptions() {
		return !this.optionSelectionService.loading && this.items.length === 0;
	}
	get editable() {
		return this.optionSelectionService.editable;
	}
	get noResultsElementId() {
		return `${this.optionsId}-no-results`;
	}
	get showSelectAll() {
		return this.optionSelectionService.showSelectAll && this.optionSelectionService.multiselectable && !this.optionSelectionService.loading && this.items.length > 0;
	}
	get allVisibleSelected() {
		if (!this.items || this.items.length === 0) return false;
		return this.optionSelectionService.containsAll(this.items.map((option) => option.value));
	}
	get isSelectAllFocused() {
		return this.focusHandler.pseudoFocus.model?.id === SELECT_ALL_ID;
	}
	toggleSelectAll(event = null) {
		if (event) {
			event.stopPropagation();
			this.focusHandler.focusInput();
		}
		const visibleValues = this.items.map((option) => option.value);
		if (this.allVisibleSelected) this.optionSelectionService.unselectMany(visibleValues);
		else this.optionSelectionService.selectMany(visibleValues);
	}
	ngAfterViewInit() {
		this.focusHandler.listbox = this.el.nativeElement;
		this.subscriptions.push(this.items.changes.subscribe((items) => {
			if (items.length) this.focusHandler.scheduleFocusFirstActive();
			else this.focusHandler.pseudoFocus.pop();
		}), this.optionSelectionService.selectAllRequested.subscribe(() => {
			this.toggleSelectAll();
		}));
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	searchText(input) {
		return this.commonStrings.parse(this.commonStrings.keys.comboboxSearching, { INPUT: input });
	}
	loadingStateChange(state) {
		this.loading = state === ClrLoadingState.LOADING;
	}
	updateFocusableItems() {
		const focusList = [];
		if (this._selectAllOption) focusList.push(this._selectAllOption);
		if (this._items) {
			const itemOptions = this._items.map((option) => option.optionProxy);
			focusList.push(...itemOptions);
		}
		this.focusHandler.addOptionValues(focusList);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrOptions,
			deps: [
				{ token: OptionSelectionService },
				{ token: IF_ACTIVE_ID },
				{ token: i0.ElementRef },
				{ token: i1$1.ClrCommonStringsService },
				{ token: ComboboxFocusHandler },
				{ token: i1$2.ClrPopoverService },
				{
					token: POPOVER_HOST_ORIGIN,
					optional: true
				},
				{ token: DOCUMENT }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrOptions,
			isStandalone: false,
			selector: "clr-options",
			inputs: { optionsId: ["id", "optionsId"] },
			host: { properties: {
				"class.clr-combobox-options": "true",
				"class.clr-combobox-options-multi": "optionSelectionService.multiselectable",
				"class.clr-combobox-options-hidden": "emptyOptions && editable",
				"attr.role": "\"listbox\"",
				"id": "optionsId"
			} },
			providers: [{
				provide: LoadingListener,
				useExisting: ClrOptions
			}],
			queries: [{
				propertyName: "items",
				predicate: ClrOption,
				descendants: true
			}],
			viewQueries: [{
				propertyName: "selectAllBtn",
				first: true,
				predicate: ["selectAllBtn"],
				descendants: true
			}],
			ngImport: i0,
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

    @if (showSelectAll) {
      <div class="clr-combobox-select-all">
        <button
          #selectAllBtn
          type="button"
          tabindex="-1"
          class="btn btn-link clr-combobox-select-all-btn clr-combobox-option"
          [class.clr-focus]="isSelectAllFocused"
          (click)="toggleSelectAll($event)"
        >
          {{ allVisibleSelected ? commonStrings.keys.comboboxUnselectAll : commonStrings.keys.comboboxSelectAll }}
        </button>
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
			isInline: true,
			dependencies: [{
				kind: "component",
				type: i5.ClrSpinner,
				selector: "clr-spinner",
				inputs: [
					"clrInline",
					"clrInverse",
					"clrSmall",
					"clrMedium"
				]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrOptions,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-options",
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

    @if (showSelectAll) {
      <div class="clr-combobox-select-all">
        <button
          #selectAllBtn
          type="button"
          tabindex="-1"
          class="btn btn-link clr-combobox-select-all-btn clr-combobox-option"
          [class.clr-focus]="isSelectAllFocused"
          (click)="toggleSelectAll($event)"
        >
          {{ allVisibleSelected ? commonStrings.keys.comboboxUnselectAll : commonStrings.keys.comboboxSelectAll }}
        </button>
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
			providers: [{
				provide: LoadingListener,
				useExisting: ClrOptions
			}],
			host: {
				"[class.clr-combobox-options]": "true",
				"[class.clr-combobox-options-multi]": "optionSelectionService.multiselectable",
				"[class.clr-combobox-options-hidden]": "emptyOptions && editable",
				"[attr.role]": "\"listbox\"",
				"[id]": "optionsId"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: OptionSelectionService },
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [IF_ACTIVE_ID]
			}]
		},
		{ type: i0.ElementRef },
		{ type: i1$1.ClrCommonStringsService },
		{ type: ComboboxFocusHandler },
		{ type: i1$2.ClrPopoverService },
		{
			type: i0.ElementRef,
			decorators: [{ type: Optional }, {
				type: Inject,
				args: [POPOVER_HOST_ORIGIN]
			}]
		},
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [DOCUMENT]
			}]
		}
	],
	propDecorators: {
		optionsId: [{
			type: Input,
			args: ["id"]
		}],
		selectAllBtn: [{
			type: ViewChild,
			args: ["selectAllBtn"]
		}],
		items: [{
			type: ContentChildren,
			args: [ClrOption, { descendants: true }]
		}]
	}
});
var ClrCombobox = class ClrCombobox extends WrappedFormControl {
	constructor(vcr, injector, control, renderer, el, optionSelectionService, commonStrings, popoverService, containerService, platformId, focusHandler, cdr, zone, container) {
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
		this.zone = zone;
		this.container = container;
		this.placeholder = "";
		this.clrInputChange = new EventEmitter(false);
		this.clrOpenChange = this.popoverService.openChange;
		this.clrSelectionChange = this.optionSelectionService.selectionChanged;
		this.focused = false;
		this.popoverPosition = ClrPopoverPosition.BOTTOM_LEFT;
		this.index = 1;
		this.popoverType = ClrPopoverType.DROPDOWN;
		this.containerWidth = null;
		this.selectionExpanded = false;
		this.shouldCalculate = true;
		this.isTotalSelection = false;
		this.renderInjector = inject(Injector);
		this.containerWidthChange = new Subject();
		this._searchText = "";
		if (control) control.valueAccessor = this;
		this.multiSelect = false;
	}
	get showSelectAll() {
		return this.optionSelectionService.showSelectAll;
	}
	set showSelectAll(value) {
		this.optionSelectionService.showSelectAll = value;
	}
	get editable() {
		return this.optionSelectionService.editable;
	}
	set editable(value) {
		this.optionSelectionService.editable = value;
	}
	set editableResolver(value) {
		this.optionSelectionService.editableResolver = value;
	}
	set identityFn(value) {
		this.optionSelectionService.identityFn = value;
	}
	get multiSelect() {
		return this.optionSelectionService.multiselectable;
	}
	set multiSelect(value) {
		if (value) this.optionSelectionService.selectionModel = new MultiSelectComboboxModel();
		else this.optionSelectionService.selectionModel = new SingleSelectComboboxModel();
		this.optionSelectionService.selectionModel.identityFn = this.optionSelectionService.identityFn;
		this.updateControlValue();
	}
	get id() {
		return this.controlIdService.id + "-combobox";
	}
	set id(id) {
		super.id = id;
	}
	get searchText() {
		return this._searchText;
	}
	set searchText(text) {
		if (text !== this._searchText) {
			if (this.popoverService.open) this.optionSelectionService.showAllOptions = false;
			this._searchText = text;
			this.clrInputChange.emit(this.searchText);
		}
		this.optionSelectionService.currentInput = this.searchText;
	}
	get openState() {
		return this.popoverService.open;
	}
	get multiSelectModel() {
		if (!this.multiSelect) throw Error("multiSelectModel is not available in single selection context");
		return this.optionSelectionService.selectionModel.model;
	}
	get ariaControls() {
		return this.options?.optionsId;
	}
	get ariaOwns() {
		return this.options?.optionsId;
	}
	get ariaDescribedBySelection() {
		return "selection-" + this.id;
	}
	get displayField() {
		return this.optionSelectionService.displayField;
	}
	get showAllText() {
		return this.commonStrings.parse(this.commonStrings.keys.comboboxShowAll, { ITEMS: this.multiSelectModel?.length.toString() });
	}
	get allSelectedText() {
		return this.commonStrings.parse(this.commonStrings.keys.comboboxAllSelected, { ITEMS: this.multiSelectModel?.length.toString() });
	}
	get showIndividualPills() {
		return !this.isTotalSelection || this.selectionExpanded;
	}
	get showTruncationToggle() {
		return this.selectionExpanded || this.isTotalSelection || this.calculatedLimit !== null && this.calculatedLimit < this.multiSelectModel.length;
	}
	get disabled() {
		return this.control?.disabled;
	}
	ngAfterContentInit() {
		this.initializeSubscriptions();
		if (!this.optionSelectionService.selectionModel.isEmpty()) this.updateInputValue(this.optionSelectionService.selectionModel);
	}
	ngAfterViewInit() {
		this.focusHandler.textInput = this.textbox.nativeElement;
		this.focusHandler.trigger = this.trigger.nativeElement;
		this.el = this.textbox;
		if (this.showSelectAll) {
			if (this.multiSelect && this.multiSelectModel?.length > 0) this.calculateLimit();
			this.initialiseObserver();
		}
	}
	ngOnDestroy() {
		super.ngOnDestroy();
		if (this.resizeObserver) this.resizeObserver.disconnect();
	}
	clearSelection() {
		this.focusHandler.focusInput();
		this.optionSelectionService.setSelectionValue([]);
	}
	onKeyUp(event) {
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
				case Keys.Enter: if (this.editable && this._searchText.length > 0 && this.options.emptyOptions) {
					const parsedInput = this.optionSelectionService.editableResolver(this._searchText);
					this.control?.control.markAsTouched();
					this.optionSelectionService.select(parsedInput);
					this.searchText = "";
				}
			}
		}
	}
	inputId() {
		return this.controlIdService.id;
	}
	loadingStateChange(state) {
		this.optionSelectionService.loading = state === ClrLoadingState.LOADING;
		if (state !== ClrLoadingState.LOADING && isPlatformBrowser(this.platformId)) {
			afterNextRender(() => this.popoverService?.resetPositions(), { injector: this.renderInjector });
			this.focusFirstActive();
		}
	}
	unselect(item) {
		if (!this.disabled) this.optionSelectionService.unselect(item);
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
		this.cdr.detectChanges();
	}
	onChange() {
		if (this.editable && !this.multiSelect && this.options.emptyOptions) {
			const parsedInput = this.optionSelectionService.editableResolver(this._searchText);
			this.optionSelectionService.setSelectionValue(parsedInput);
		}
	}
	getSelectionAriaLabel() {
		if (this.containerService && this.containerService.labelText) return `${this.containerService.labelText} ${this.commonStrings.keys.comboboxSelection}`;
		return this.commonStrings.keys.comboboxSelection;
	}
	focusFirstActive() {
		this.focusHandler.scheduleFocusFirstActive();
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
	setDisabledState() {}
	onWrapperClick(event) {
		if (this.disabled) return;
		this.focusHandler.focusInput();
		if (this.editable || !this.editable && this.trigger.nativeElement.contains(event.target)) this.popoverService.toggleWithEvent(event);
	}
	toggleSelectionExpand() {
		this.selectionExpanded = !this.selectionExpanded;
		if (this.selectionExpanded) this.applyLimit(this.multiSelectModel.length);
		else this.containerWidthChange.next(this.containerWidth);
	}
	initialiseObserver() {
		const container = this.container ? this.container.el.nativeElement : this.el.nativeElement.parentElement;
		this.containerWidth = container.offsetWidth;
		this.resizeObserver = new ResizeObserver((entries) => {
			this.zone.runOutsideAngular(() => {
				entries.forEach((entry) => {
					const entryWidth = entry.contentRect.width;
					switch (entry.target) {
						case container:
							if (this.containerWidth !== entryWidth) {
								this.containerWidth = entryWidth;
								this.containerWidthChange.next(entryWidth);
							}
							break;
						case this.wrapper.nativeElement: this.containerWidthChange.next(null);
					}
				});
			});
		});
		this.resizeObserver.observe(container);
		this.resizeObserver.observe(this.wrapper.nativeElement);
	}
	calculateLimit() {
		this.shouldCalculate = true;
		this.cdr.detectChanges();
		if (!this.calculationPills || this.calculationPills.length === 0) {
			this.applyLimit();
			return;
		}
		const pillDimensions = this.calculationPills.map((p) => ({
			top: p.nativeElement.offsetTop,
			width: p.nativeElement.offsetWidth,
			left: p.nativeElement.offsetLeft
		}));
		const firstPill = pillDimensions[0];
		const buttonWidth = this.truncationButton?.nativeElement?.offsetWidth || 100;
		const textboxWidth = this.textbox.nativeElement.offsetWidth;
		const expectedWidth = this.containerWidth - textboxWidth - buttonWidth;
		let fitCount = 0;
		for (const pill of pillDimensions) {
			if (pill.top > firstPill.top || pill.left + pill.width > expectedWidth) break;
			fitCount++;
		}
		this.applyLimit(fitCount);
	}
	applyLimit(limit = void 0) {
		this.zone.run(() => {
			this.calculatedLimit = limit === 0 ? 1 : limit;
			this.shouldCalculate = false;
			this.cdr.markForCheck();
		});
	}
	updateTotalSelection() {
		if (!this.multiSelect || !this.multiSelectModel?.length) {
			this.isTotalSelection = false;
			return;
		}
		if (!this.options?.items?.length) return;
		this.isTotalSelection = this.optionSelectionService.containsAll(this.options.items.map((option) => option.value));
	}
	initializeSubscriptions() {
		this.subscriptions.push(this.focusHandler.pseudoFocus.focusChanged.subscribe(() => this.cdr.markForCheck()));
		this.subscriptions.push(this.optionSelectionService.selectionChanged.subscribe((newSelection) => {
			this.updateInputValue(newSelection);
			if (newSelection.isEmpty()) {
				this.selectionExpanded = false;
				this.isTotalSelection = false;
			} else {
				if (!this.multiSelect) this.popoverService.open = false;
				this.updateTotalSelection();
			}
			this.updateControlValue();
			if (this.selectionExpanded) this.applyLimit(this.multiSelectModel.length);
			else this.calculateLimit();
			if (this.multiSelect) afterNextRender(() => this.popoverService?.updatePosition(), { injector: this.renderInjector });
		}));
		this.subscriptions.push(this.popoverService.openChange.subscribe((open) => {
			this.cdr.markForCheck();
			if (this.editable && !this.multiSelect) {
				if (this.searchText) {
					this.optionSelectionService.showAllOptions = false;
					this.optionSelectionService.currentInput = this.searchText;
				}
				return;
			}
			if (open) this.focusFirstActive();
			else this.optionSelectionService.showAllOptions = true;
			if (this.multiSelect) this.searchText = "";
			else this.searchText = this.getDisplayNames(this.optionSelectionService.selectionModel.model)[0] || "";
		}), this.containerWidthChange.pipe(debounceTime(0)).subscribe(() => {
			if (!this.selectionExpanded && !this.isTotalSelection) this.calculateLimit();
		}));
	}
	updateInputValue(model) {
		if (!this.multiSelect) {
			this.searchText = model.model ? this.getDisplayNames(model.model)[0] : "";
			if (this.searchText) this.optionSelectionService.currentInput = this.searchText;
		}
	}
	updateControlValue() {
		if (this.onChangeCallback) this.onChangeCallback(this.optionSelectionService.selectionModel.model);
	}
	getDisplayNames(model) {
		if (this.displayField) {
			if (!Array.isArray(model)) model = [model];
			return model.map((item) => item ? item[this.displayField] : null);
		}
		return [this.optionSelectionService.selectionModel.model];
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrCombobox,
			deps: [
				{ token: i0.ViewContainerRef },
				{ token: i0.Injector },
				{
					token: i1.NgControl,
					optional: true,
					self: true
				},
				{ token: i0.Renderer2 },
				{ token: i0.ElementRef },
				{ token: OptionSelectionService },
				{ token: i1$1.ClrCommonStringsService },
				{ token: i1$2.ClrPopoverService },
				{
					token: ComboboxContainerService,
					optional: true
				},
				{ token: PLATFORM_ID },
				{ token: ComboboxFocusHandler },
				{ token: i0.ChangeDetectorRef },
				{ token: i0.NgZone },
				{
					token: ClrComboboxContainer,
					host: true,
					optional: true
				}
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrCombobox,
			isStandalone: false,
			selector: "clr-combobox",
			inputs: {
				placeholder: "placeholder",
				showSelectAll: [
					"showSelectAll",
					"showSelectAll",
					booleanAttribute
				],
				editable: ["clrEditable", "editable"],
				editableResolver: ["clrEditableResolverFn", "editableResolver"],
				identityFn: ["clrComboboxIdentityFn", "identityFn"],
				multiSelect: ["clrMulti", "multiSelect"]
			},
			outputs: {
				clrInputChange: "clrInputChange",
				clrOpenChange: "clrOpenChange",
				clrSelectionChange: "clrSelectionChange"
			},
			host: {
				listeners: { "keydown": "onKeyUp($event)" },
				properties: {
					"class.aria-required": "true",
					"class.clr-combobox": "true",
					"class.clr-combobox-disabled": "control?.disabled"
				}
			},
			providers: [
				OptionSelectionService,
				{
					provide: LoadingListener,
					useExisting: ClrCombobox
				},
				IF_ACTIVE_ID_PROVIDER,
				FOCUS_SERVICE_PROVIDER,
				COMBOBOX_FOCUS_HANDLER_PROVIDER
			],
			queries: [{
				propertyName: "optionSelected",
				first: true,
				predicate: ClrOptionSelected,
				descendants: true
			}, {
				propertyName: "options",
				first: true,
				predicate: ClrOptions,
				descendants: true
			}],
			viewQueries: [
				{
					propertyName: "textbox",
					first: true,
					predicate: ["textboxInput"],
					descendants: true
				},
				{
					propertyName: "trigger",
					first: true,
					predicate: ["trigger"],
					descendants: true
				},
				{
					propertyName: "truncationButton",
					first: true,
					predicate: ["truncationButton"],
					descendants: true
				},
				{
					propertyName: "wrapper",
					first: true,
					predicate: ["wrapper"],
					descendants: true,
					static: true
				},
				{
					propertyName: "calculationPills",
					predicate: ["pill"],
					descendants: true
				}
			],
			usesInheritance: true,
			hostDirectives: [{ directive: i1$2.ClrPopoverHostDirective }],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<!-- The (click) handler is needed to auto-focus on input field which can not currently occupy the whole\nwidth of the component, after being wrapped to a new line -->\n<div\n  #wrapper\n  class=\"clr-combobox-wrapper\"\n  clrPopoverOrigin\n  (click)=\"onWrapperClick($event)\"\n  [class.multi]=\"multiSelect\"\n  [class.invalid]=\"(control?.control.touched && control?.invalid)\"\n  [class.disabled]=\"control?.disabled\"\n>\n  @if (multiSelect && multiSelectModel && multiSelectModel.length > 0) {\n  <span\n    role=\"grid\"\n    clrRovingTabindex\n    [clrRovingTabindexDisabled]=\"(control?.disabled ?? null)\"\n    clrDirection=\"both\"\n    [attr.aria-label]=\"getSelectionAriaLabel()\"\n    [attr.aria-disabled]=\"control?.disabled? true: null\"\n    class=\"clr-combobox-pills\"\n  >\n    <ng-template #pillTemplate let-item let-i=\"index\">\n      <span class=\"label label-combobox-pill\" role=\"row\">\n        <span role=\"gridcell\">\n          <span class=\"clr-combobox-pill-content\" clrKeyFocusItem>\n            @if (optionSelected) {\n            <ng-container\n              [ngTemplateOutlet]=\"optionSelected.template\"\n              [ngTemplateOutletContext]=\"{$implicit: item}\"\n            ></ng-container>\n            }\n          </span>\n        </span>\n        <span role=\"gridcell\">\n          <button\n            clrKeyFocusItem\n            type=\"button\"\n            class=\"clr-combobox-remove-btn\"\n            [disabled]=\"control?.disabled ? true : null\"\n            [attr.aria-label]=\"commonStrings.keys.comboboxDelete + ' ' + optionSelectionService.selectionModel.toString(displayField, i)\"\n            (click)=\"unselect(item)\"\n          >\n            <cds-icon shape=\"window-close\" size=\"12\"></cds-icon>\n          </button>\n        </span>\n      </span>\n    </ng-template>\n\n    @if (showSelectAll) { @if (isTotalSelection && !selectionExpanded) {\n    <span class=\"label label-combobox-pill\" role=\"row\">\n      <span role=\"gridcell\">\n        <span class=\"clr-combobox-pill-content\" clrKeyFocusItem>{{ allSelectedText }}</span>\n      </span>\n      <span role=\"gridcell\">\n        <button\n          clrKeyFocusItem\n          type=\"button\"\n          class=\"clr-combobox-remove-btn\"\n          (click)=\"clearSelection()\"\n          [attr.aria-label]=\"commonStrings.keys.comboboxUnselectAll\"\n        >\n          <cds-icon shape=\"window-close\" size=\"12\"></cds-icon>\n        </button>\n      </span>\n    </span>\n    } @if (showIndividualPills) { @for (item of multiSelectModel | slice:0:calculatedLimit; track item; let i = $index)\n    {\n    <ng-container\n      [ngTemplateOutlet]=\"pillTemplate\"\n      [ngTemplateOutletContext]=\"{$implicit: item, index: i}\"\n    ></ng-container>\n    } } @if (showTruncationToggle) {\n    <span role=\"row\" class=\"label label-combobox-pill clr-combobox-truncation-row\">\n      <span role=\"gridcell\" class=\"clr-combobox-truncation-cell\">\n        <span class=\"clr-combobox-pill-content\">\n          <button\n            #truncationButton\n            clrKeyFocusItem\n            type=\"button\"\n            class=\"btn btn-link clr-combobox-show-more-btn\"\n            (click)=\"toggleSelectionExpand()\"\n            [attr.aria-expanded]=\"selectionExpanded\"\n            [attr.aria-controls]=\"'expanded-selection-' + id\"\n          >\n            @if (!selectionExpanded) { {{ showAllText }} } @else { {{ commonStrings.keys.comboboxShowLess }} }\n          </button>\n        </span>\n      </span>\n    </span>\n    } } @else { @for (item of multiSelectModel; track item; let i = $index) {\n    <ng-container\n      [ngTemplateOutlet]=\"pillTemplate\"\n      [ngTemplateOutletContext]=\"{$implicit: item, index: i}\"\n    ></ng-container>\n    } }\n  </span>\n\n  @if (showSelectAll && shouldCalculate) {\n  <span class=\"clr-combobox-pills-calculation\" aria-hidden=\"true\">\n    @for (item of multiSelectModel; track item) {\n    <span class=\"label label-combobox-pill\" #pill>\n      <span class=\"clr-combobox-pill-content\">\n        @if (optionSelected) {\n        <ng-container\n          [ngTemplateOutlet]=\"optionSelected.template\"\n          [ngTemplateOutletContext]=\"{$implicit: item}\"\n        ></ng-container>\n        }\n      </span>\n      <button type=\"button\" class=\"clr-combobox-remove-btn\" tabindex=\"-1\">\n        <cds-icon shape=\"window-close\" size=\"12\"></cds-icon>\n      </button>\n    </span>\n    }\n  </span>\n  } }\n\n  <input\n    #textboxInput\n    type=\"text\"\n    role=\"combobox\"\n    [id]=\"inputId()\"\n    class=\"clr-input clr-combobox-input\"\n    [(ngModel)]=\"searchText\"\n    (blur)=\"onBlur($event)\"\n    (focus)=\"onFocus()\"\n    (change)=\"onChange()\"\n    [attr.aria-expanded]=\"openState\"\n    [attr.aria-owns]=\"ariaOwns\"\n    aria-haspopup=\"listbox\"\n    aria-autocomplete=\"list\"\n    autocomplete=\"off\"\n    [attr.aria-invalid]=\"control?.invalid? true: null\"\n    [disabled]=\"control?.disabled? true: null\"\n    [attr.aria-activedescendant]=\"getActiveDescendant()\"\n    [attr.placeholder]=\"placeholder\"\n  />\n\n  <!-- No click handler, as it uses the handler on the .clr-combobox-wrapper -->\n  <button\n    #trigger\n    type=\"button\"\n    class=\"clr-combobox-trigger\"\n    tabindex=\"-1\"\n    [disabled]=\"control?.disabled || null\"\n    [attr.aria-label]=\"commonStrings.keys.comboboxOpen\"\n  >\n    <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n  </button>\n\n  <div class=\"clr-focus-indicator\" [class.clr-focus]=\"focused\"></div>\n</div>\n\n<!-- Both close handlers are handled manually.\n'outsideClickToClose' has complex handling that's necessary\nto be manual due to the component architecture -->\n<div role=\"dialog\" *clrPopoverContent=\"openState; at popoverPosition; type: popoverType;\">\n  <ng-content></ng-content>\n</div>\n",
			dependencies: [
				{
					kind: "directive",
					type: i3.NgTemplateOutlet,
					selector: "[ngTemplateOutlet]",
					inputs: [
						"ngTemplateOutletContext",
						"ngTemplateOutlet",
						"ngTemplateOutletInjector"
					]
				},
				{
					kind: "directive",
					type: i1.DefaultValueAccessor,
					selector: "input:not([type=checkbox]):not([ngNoCva])[formControlName],textarea:not([ngNoCva])[formControlName],input:not([type=checkbox]):not([ngNoCva])[formControl],textarea:not([ngNoCva])[formControl],input:not([type=checkbox]):not([ngNoCva])[ngModel],textarea:not([ngNoCva])[ngModel],[ngDefaultControl]"
				},
				{
					kind: "directive",
					type: i1.NgControlStatus,
					selector: "[formControlName],[ngModel],[formControl]"
				},
				{
					kind: "directive",
					type: i1.NgModel,
					selector: "[ngModel]:not([formControlName]):not([formControl])",
					inputs: [
						"name",
						"disabled",
						"ngModel",
						"ngModelOptions"
					],
					outputs: ["ngModelChange"],
					exportAs: ["ngModel"]
				},
				{
					kind: "component",
					type: i9.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "component",
					type: i1$1.ClrRovingTabindex,
					selector: "[clrRovingTabindex]",
					inputs: ["clrRovingTabindex", "clrRovingTabindexDisabled"]
				},
				{
					kind: "directive",
					type: i1$1.ClrKeyFocusItem,
					selector: "[clrKeyFocusItem]"
				},
				{
					kind: "directive",
					type: i1$2.ClrPopoverOrigin,
					selector: "[clrPopoverOrigin]"
				},
				{
					kind: "directive",
					type: i1$2.ClrPopoverContent,
					selector: "[clrPopoverContent]",
					inputs: [
						"clrPopoverContent",
						"clrPopoverContentAt",
						"clrPopoverContentAvailablePositions",
						"clrPopoverContentType",
						"clrPopoverContentOutsideClickToClose",
						"clrPopoverContentScrollToClose",
						"clrPopoverContentOrigin"
					]
				},
				{
					kind: "pipe",
					type: i3.SlicePipe,
					name: "slice"
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrCombobox,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-combobox",
			providers: [
				OptionSelectionService,
				{
					provide: LoadingListener,
					useExisting: ClrCombobox
				},
				IF_ACTIVE_ID_PROVIDER,
				FOCUS_SERVICE_PROVIDER,
				COMBOBOX_FOCUS_HANDLER_PROVIDER
			],
			hostDirectives: [ClrPopoverHostDirective],
			host: {
				"[class.aria-required]": "true",
				"[class.clr-combobox]": "true",
				"[class.clr-combobox-disabled]": "control?.disabled"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<!-- The (click) handler is needed to auto-focus on input field which can not currently occupy the whole\nwidth of the component, after being wrapped to a new line -->\n<div\n  #wrapper\n  class=\"clr-combobox-wrapper\"\n  clrPopoverOrigin\n  (click)=\"onWrapperClick($event)\"\n  [class.multi]=\"multiSelect\"\n  [class.invalid]=\"(control?.control.touched && control?.invalid)\"\n  [class.disabled]=\"control?.disabled\"\n>\n  @if (multiSelect && multiSelectModel && multiSelectModel.length > 0) {\n  <span\n    role=\"grid\"\n    clrRovingTabindex\n    [clrRovingTabindexDisabled]=\"(control?.disabled ?? null)\"\n    clrDirection=\"both\"\n    [attr.aria-label]=\"getSelectionAriaLabel()\"\n    [attr.aria-disabled]=\"control?.disabled? true: null\"\n    class=\"clr-combobox-pills\"\n  >\n    <ng-template #pillTemplate let-item let-i=\"index\">\n      <span class=\"label label-combobox-pill\" role=\"row\">\n        <span role=\"gridcell\">\n          <span class=\"clr-combobox-pill-content\" clrKeyFocusItem>\n            @if (optionSelected) {\n            <ng-container\n              [ngTemplateOutlet]=\"optionSelected.template\"\n              [ngTemplateOutletContext]=\"{$implicit: item}\"\n            ></ng-container>\n            }\n          </span>\n        </span>\n        <span role=\"gridcell\">\n          <button\n            clrKeyFocusItem\n            type=\"button\"\n            class=\"clr-combobox-remove-btn\"\n            [disabled]=\"control?.disabled ? true : null\"\n            [attr.aria-label]=\"commonStrings.keys.comboboxDelete + ' ' + optionSelectionService.selectionModel.toString(displayField, i)\"\n            (click)=\"unselect(item)\"\n          >\n            <cds-icon shape=\"window-close\" size=\"12\"></cds-icon>\n          </button>\n        </span>\n      </span>\n    </ng-template>\n\n    @if (showSelectAll) { @if (isTotalSelection && !selectionExpanded) {\n    <span class=\"label label-combobox-pill\" role=\"row\">\n      <span role=\"gridcell\">\n        <span class=\"clr-combobox-pill-content\" clrKeyFocusItem>{{ allSelectedText }}</span>\n      </span>\n      <span role=\"gridcell\">\n        <button\n          clrKeyFocusItem\n          type=\"button\"\n          class=\"clr-combobox-remove-btn\"\n          (click)=\"clearSelection()\"\n          [attr.aria-label]=\"commonStrings.keys.comboboxUnselectAll\"\n        >\n          <cds-icon shape=\"window-close\" size=\"12\"></cds-icon>\n        </button>\n      </span>\n    </span>\n    } @if (showIndividualPills) { @for (item of multiSelectModel | slice:0:calculatedLimit; track item; let i = $index)\n    {\n    <ng-container\n      [ngTemplateOutlet]=\"pillTemplate\"\n      [ngTemplateOutletContext]=\"{$implicit: item, index: i}\"\n    ></ng-container>\n    } } @if (showTruncationToggle) {\n    <span role=\"row\" class=\"label label-combobox-pill clr-combobox-truncation-row\">\n      <span role=\"gridcell\" class=\"clr-combobox-truncation-cell\">\n        <span class=\"clr-combobox-pill-content\">\n          <button\n            #truncationButton\n            clrKeyFocusItem\n            type=\"button\"\n            class=\"btn btn-link clr-combobox-show-more-btn\"\n            (click)=\"toggleSelectionExpand()\"\n            [attr.aria-expanded]=\"selectionExpanded\"\n            [attr.aria-controls]=\"'expanded-selection-' + id\"\n          >\n            @if (!selectionExpanded) { {{ showAllText }} } @else { {{ commonStrings.keys.comboboxShowLess }} }\n          </button>\n        </span>\n      </span>\n    </span>\n    } } @else { @for (item of multiSelectModel; track item; let i = $index) {\n    <ng-container\n      [ngTemplateOutlet]=\"pillTemplate\"\n      [ngTemplateOutletContext]=\"{$implicit: item, index: i}\"\n    ></ng-container>\n    } }\n  </span>\n\n  @if (showSelectAll && shouldCalculate) {\n  <span class=\"clr-combobox-pills-calculation\" aria-hidden=\"true\">\n    @for (item of multiSelectModel; track item) {\n    <span class=\"label label-combobox-pill\" #pill>\n      <span class=\"clr-combobox-pill-content\">\n        @if (optionSelected) {\n        <ng-container\n          [ngTemplateOutlet]=\"optionSelected.template\"\n          [ngTemplateOutletContext]=\"{$implicit: item}\"\n        ></ng-container>\n        }\n      </span>\n      <button type=\"button\" class=\"clr-combobox-remove-btn\" tabindex=\"-1\">\n        <cds-icon shape=\"window-close\" size=\"12\"></cds-icon>\n      </button>\n    </span>\n    }\n  </span>\n  } }\n\n  <input\n    #textboxInput\n    type=\"text\"\n    role=\"combobox\"\n    [id]=\"inputId()\"\n    class=\"clr-input clr-combobox-input\"\n    [(ngModel)]=\"searchText\"\n    (blur)=\"onBlur($event)\"\n    (focus)=\"onFocus()\"\n    (change)=\"onChange()\"\n    [attr.aria-expanded]=\"openState\"\n    [attr.aria-owns]=\"ariaOwns\"\n    aria-haspopup=\"listbox\"\n    aria-autocomplete=\"list\"\n    autocomplete=\"off\"\n    [attr.aria-invalid]=\"control?.invalid? true: null\"\n    [disabled]=\"control?.disabled? true: null\"\n    [attr.aria-activedescendant]=\"getActiveDescendant()\"\n    [attr.placeholder]=\"placeholder\"\n  />\n\n  <!-- No click handler, as it uses the handler on the .clr-combobox-wrapper -->\n  <button\n    #trigger\n    type=\"button\"\n    class=\"clr-combobox-trigger\"\n    tabindex=\"-1\"\n    [disabled]=\"control?.disabled || null\"\n    [attr.aria-label]=\"commonStrings.keys.comboboxOpen\"\n  >\n    <cds-icon shape=\"angle\" direction=\"down\"></cds-icon>\n  </button>\n\n  <div class=\"clr-focus-indicator\" [class.clr-focus]=\"focused\"></div>\n</div>\n\n<!-- Both close handlers are handled manually.\n'outsideClickToClose' has complex handling that's necessary\nto be manual due to the component architecture -->\n<div role=\"dialog\" *clrPopoverContent=\"openState; at popoverPosition; type: popoverType;\">\n  <ng-content></ng-content>\n</div>\n"
		}]
	}],
	ctorParameters: () => [
		{ type: i0.ViewContainerRef },
		{ type: i0.Injector },
		{
			type: i1.NgControl,
			decorators: [{ type: Self }, { type: Optional }]
		},
		{ type: i0.Renderer2 },
		{ type: i0.ElementRef },
		{ type: OptionSelectionService },
		{ type: i1$1.ClrCommonStringsService },
		{ type: i1$2.ClrPopoverService },
		{
			type: ComboboxContainerService,
			decorators: [{ type: Optional }]
		},
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [PLATFORM_ID]
			}]
		},
		{ type: ComboboxFocusHandler },
		{ type: i0.ChangeDetectorRef },
		{ type: i0.NgZone },
		{
			type: ClrComboboxContainer,
			decorators: [{ type: Optional }, { type: Host }]
		}
	],
	propDecorators: {
		placeholder: [{
			type: Input,
			args: ["placeholder"]
		}],
		clrInputChange: [{
			type: Output,
			args: ["clrInputChange"]
		}],
		clrOpenChange: [{
			type: Output,
			args: ["clrOpenChange"]
		}],
		clrSelectionChange: [{
			type: Output,
			args: ["clrSelectionChange"]
		}],
		textbox: [{
			type: ViewChild,
			args: ["textboxInput"]
		}],
		trigger: [{
			type: ViewChild,
			args: ["trigger"]
		}],
		optionSelected: [{
			type: ContentChild,
			args: [ClrOptionSelected]
		}],
		truncationButton: [{
			type: ViewChild,
			args: ["truncationButton"]
		}],
		wrapper: [{
			type: ViewChild,
			args: ["wrapper", { static: true }]
		}],
		calculationPills: [{
			type: ViewChildren,
			args: ["pill"]
		}],
		options: [{
			type: ContentChild,
			args: [ClrOptions]
		}],
		showSelectAll: [{
			type: Input,
			args: [{
				alias: "showSelectAll",
				transform: booleanAttribute
			}]
		}],
		editable: [{
			type: Input,
			args: ["clrEditable"]
		}],
		editableResolver: [{
			type: Input,
			args: ["clrEditableResolverFn"]
		}],
		identityFn: [{
			type: Input,
			args: ["clrComboboxIdentityFn"]
		}],
		multiSelect: [{
			type: Input,
			args: ["clrMulti"]
		}],
		onKeyUp: [{
			type: HostListener,
			args: ["keydown", ["$event"]]
		}]
	}
});
var ClrOptionItems = class ClrOptionItems {
	constructor(template, differs, optionService, vcr) {
		this.template = template;
		this.differs = differs;
		this.optionService = optionService;
		this.subscriptions = [];
		this.filter = "";
		this.differ = null;
		this.iterableProxy = new NgForOf(vcr, template, differs);
		this.subscriptions.push(optionService.inputChanged.subscribe((filter) => {
			this.filter = filter;
			this.updateItems();
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
		return this.filteredItems ? this.filteredItems.length : void 0;
	}
	ngDoCheck() {
		if (!this.differ) this.differ = this.differs.find(this.filteredItems).create(this.iterableProxy.ngForTrackBy);
		if (this.differ) {
			if (this.differ.diff(this.filteredItems)) this.iterableProxy.ngDoCheck();
		}
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	updateItems() {
		if (!this._rawItems || this.filter === void 0 || this.filter === null) return;
		const normalizedFilterValue = normalizeValue(this.filter);
		if (this.optionService.showAllOptions) this.filteredItems = this._rawItems;
		else if (this._filterField) this.filteredItems = this._rawItems.filter((item) => {
			const objValue = item[this._filterField];
			return objValue ? normalizeValue(objValue).includes(normalizedFilterValue) : false;
		});
		else this.filteredItems = this._rawItems.filter((item) => {
			if (typeof item !== "object") return normalizeValue(item).includes(normalizedFilterValue);
			return Object.values(item).filter((value) => {
				return value !== null && value !== void 0 ? normalizeValue(value).includes(normalizedFilterValue) : false;
			}).length > 0;
		});
		this.iterableProxy.ngForOf = this.filteredItems;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrOptionItems,
			deps: [
				{ token: i0.TemplateRef },
				{ token: i0.IterableDiffers },
				{ token: OptionSelectionService },
				{ token: i0.ViewContainerRef }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrOptionItems,
			isStandalone: false,
			selector: "[clrOptionItems][clrOptionItemsOf]",
			inputs: {
				rawItems: ["clrOptionItemsOf", "rawItems"],
				trackBy: ["clrOptionItemsTrackBy", "trackBy"],
				field: ["clrOptionItemsField", "field"]
			},
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrOptionItems,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrOptionItems][clrOptionItemsOf]",
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: i0.TemplateRef },
		{ type: i0.IterableDiffers },
		{ type: OptionSelectionService },
		{ type: i0.ViewContainerRef }
	],
	propDecorators: {
		rawItems: [{
			type: Input,
			args: ["clrOptionItemsOf"]
		}],
		trackBy: [{
			type: Input,
			args: ["clrOptionItemsTrackBy"]
		}],
		field: [{
			type: Input,
			args: ["clrOptionItemsField"]
		}]
	}
});
function normalizeValue(value) {
	return value.toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}
var ClrOptionGroup = class ClrOptionGroup {
	constructor() {
		this.labelId = uniqueIdFactory();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrOptionGroup,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrOptionGroup,
			isStandalone: false,
			selector: "clr-option-group",
			inputs: { label: ["clrOptionGroupLabel", "label"] },
			host: { properties: {
				"attr.role": "\"group\"",
				"attr.aria-labelledby": "labelId",
				"style.display": "clrOptionItems.hasResults ? undefined : \"none\""
			} },
			queries: [{
				propertyName: "clrOptionItems",
				first: true,
				predicate: ClrOptionItems,
				descendants: true
			}],
			ngImport: i0,
			template: `
    <span [id]="labelId" class="clr-option-group-label" role="presentation">{{ label }}</span>
    <ng-content></ng-content>
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrOptionGroup,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-option-group",
			host: {
				"[attr.role]": "\"group\"",
				"[attr.aria-labelledby]": "labelId",
				"[style.display]": "clrOptionItems.hasResults ? undefined : \"none\""
			},
			template: `
    <span [id]="labelId" class="clr-option-group-label" role="presentation">{{ label }}</span>
    <ng-content></ng-content>
  `,
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	propDecorators: {
		label: [{
			type: Input,
			args: ["clrOptionGroupLabel"]
		}],
		clrOptionItems: [{
			type: ContentChild,
			args: [ClrOptionItems]
		}]
	}
});
var ClrComboboxModule = class ClrComboboxModule {
	constructor() {
		ClarityIcons.addIcons(successStandardIcon, errorStandardIcon, angleIcon, windowCloseIcon);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrComboboxModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrComboboxModule,
			declarations: [
				ClrCombobox,
				ClrComboboxContainer,
				ClrOptions,
				ClrOption,
				ClrOptionGroup,
				ClrOptionSelected,
				ClrOptionItems
			],
			imports: [
				CommonModule,
				FormsModule,
				ClrIcon,
				ClrKeyFocusModule,
				ClrCommonFormsModule,
				ClrConditionalModule,
				ClrPopoverModuleNext,
				ClrSpinnerModule
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
				ClrOptionItems
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrComboboxModule,
			imports: [
				CommonModule,
				FormsModule,
				ClrIcon,
				ClrKeyFocusModule,
				ClrCommonFormsModule,
				ClrConditionalModule,
				ClrPopoverModuleNext,
				ClrSpinnerModule,
				ClrCommonFormsModule,
				ClrConditionalModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrComboboxModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				CommonModule,
				FormsModule,
				ClrIcon,
				ClrKeyFocusModule,
				ClrCommonFormsModule,
				ClrConditionalModule,
				ClrPopoverModuleNext,
				ClrSpinnerModule
			],
			declarations: [
				ClrCombobox,
				ClrComboboxContainer,
				ClrOptions,
				ClrOption,
				ClrOptionGroup,
				ClrOptionSelected,
				ClrOptionItems
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
				ClrOptionItems
			]
		}]
	}],
	ctorParameters: () => []
});
export { ClrCombobox, ClrComboboxContainer, ClrComboboxModule, ClrOption, ClrOptionGroup, ClrOptionItems, ClrOptionSelected, ClrOptions, SELECT_ALL_ID };

//# sourceMappingURL=clr-angular-forms-combobox.mjs.map