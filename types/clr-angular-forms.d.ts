import * as i0 from '@angular/core';
import { OnInit, OnDestroy, Renderer2, ElementRef, TemplateRef, ViewContainerRef, QueryList, DoCheck, Type, Injector, InjectionToken, AfterContentInit, AfterViewInit, RendererFactory2, EventEmitter, ChangeDetectorRef, IterableDiffers, TrackByFunction, NgZone } from '@angular/core';
import * as i4 from '@angular/forms';
import { NgControl, ControlValueAccessor, Validator, AbstractControl, ValidationErrors, SelectMultipleControlValueAccessor } from '@angular/forms';
import * as rxjs from 'rxjs';
import { Observable, Subscription, BehaviorSubject, Subject } from 'rxjs';
import * as i3 from '@angular/common';
import { NgForOfContext } from '@angular/common';
import * as i5 from '@clr/angular/icon';
import * as i6 from '@clr/angular/forms/common';
import { ClrControlLabel as ClrControlLabel$1, WrappedFormControl as WrappedFormControl$1, ClrAbstractContainer as ClrAbstractContainer$1, LayoutService as LayoutService$1, ControlClassService as ControlClassService$1, NgControlService as NgControlService$1, FormsFocusService as FormsFocusService$1, ControlIdService as ControlIdService$1 } from '@clr/angular/forms/common';
import * as i11 from '@clr/angular/utils';
import { LoadingListener, ClrCommonStringsService, ClrLoadingState } from '@clr/angular/utils';
import * as i1 from '@clr/angular/popover/common';
import { ClrPopoverService, ClrPopoverPosition, ClrPopoverType } from '@clr/angular/popover/common';
import * as i14 from '@clr/angular/progress/spinner';
import * as i5$1 from '@clr/angular/forms/input';
import * as i18 from '@clr/angular/layout/vertical-nav';
import * as i3$1 from '@clr/angular/forms/checkbox';
import * as i4$1 from '@clr/angular/forms/combobox';
import * as i5$2 from '@clr/angular/forms/datepicker';
import * as i6$1 from '@clr/angular/forms/file-input';
import * as i8 from '@clr/angular/forms/password';
import * as i9 from '@clr/angular/forms/radio';
import * as i10 from '@clr/angular/forms/select';
import * as i11$1 from '@clr/angular/forms/textarea';
import * as i12 from '@clr/angular/forms/range';
import * as i13 from '@clr/angular/forms/datalist';
import * as i14$1 from '@clr/angular/forms/number-input';

/**
 * @TODO No idea why I need to use provideIn .. without I'm getting error that
 * ContainerIdService is not defined - But this must be optional service!?
 *
 * There is something wrong - will come back to investigate it when I have more time
 *
 */
declare class ContainerIdService {
    private _id;
    private _idChange;
    get id(): string;
    set id(value: string);
    get idChange(): Observable<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContainerIdService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ContainerIdService>;
}

declare class ControlIdService {
    private _id;
    private _idChange;
    get id(): string;
    set id(value: string);
    get idChange(): Observable<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ControlIdService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ControlIdService>;
}

declare abstract class ClrAbstractControl {
    protected controlIdService: ControlIdService;
    protected containerIdService: ContainerIdService;
    /**
     * Hold the suffix for the ID
     */
    controlIdSuffix: string;
    protected constructor(controlIdService: ControlIdService, containerIdService: ContainerIdService);
    get id(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAbstractControl, [{ optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrAbstractControl, never, never, {}, {}, never, never, true, never>;
}

declare class ClrControlError extends ClrAbstractControl {
    protected controlIdService: ControlIdService;
    protected containerIdService: ContainerIdService;
    controlIdSuffix: string;
    constructor(controlIdService: ControlIdService, containerIdService: ContainerIdService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrControlError, [{ optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrControlError, "clr-control-error", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrControlHelper extends ClrAbstractControl {
    protected controlIdService: ControlIdService;
    protected containerIdService: ContainerIdService;
    controlIdSuffix: string;
    constructor(controlIdService: ControlIdService, containerIdService: ContainerIdService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrControlHelper, [{ optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrControlHelper, "clr-control-helper", never, {}, {}, never, ["*"], false, never>;
}

declare enum ClrFormLayout {
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal",
    COMPACT = "compact"
}
declare class LayoutService {
    readonly minLabelSize = 1;
    readonly maxLabelSize = 12;
    layout: ClrFormLayout | string;
    private layoutValues;
    private _labelSize;
    get labelSize(): number;
    set labelSize(size: number);
    get layoutClass(): string;
    isVertical(): boolean;
    isHorizontal(): boolean;
    isCompact(): boolean;
    isValid(layout: string): boolean;
    labelSizeIsValid(labelSize: number): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<LayoutService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LayoutService>;
}

interface Helpers {
    show?: boolean;
    showInvalid?: boolean;
    showValid?: boolean;
    showHelper?: boolean;
}
declare class NgControlService {
    container: ClrAbstractContainer;
    private _controls;
    private _controlsChanges;
    get controls(): NgControl[];
    get controlsChanges(): Observable<NgControl[]>;
    get hasMultipleControls(): boolean;
    addControl(control: NgControl): void;
    emitControlsChange(controls: NgControl[]): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgControlService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgControlService>;
}

declare class ClrControlLabel implements OnInit, OnDestroy {
    private controlIdService;
    private layoutService;
    private ngControlService;
    private renderer;
    private el;
    idInput: string;
    idAttr: string;
    forAttr: string;
    private signpost;
    private enableGrid;
    private subscriptions;
    constructor(controlIdService: ControlIdService, layoutService: LayoutService, ngControlService: NgControlService, renderer: Renderer2, el: ElementRef<HTMLLabelElement>);
    get labelText(): string;
    ngOnInit(): void;
    ngOnDestroy(): void;
    disableGrid(): void;
    /**
     * Allowing signposts inside labels to work without disabling default behavior. <label> is spreading a click event to its children so signposts get
     * automatically closed once clicked inside a <label>.
     * @param event
     */
    private onClick;
    private preventDefaultOnSignpostTarget;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrControlLabel, [{ optional: true; }, { optional: true; }, { optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrControlLabel, "label", never, { "idInput": { "alias": "id"; "required": false; }; "forAttr": { "alias": "for"; "required": false; }; }, {}, ["signpost"], never, false, never>;
}

declare class ControlClassService {
    private layoutService;
    className: string;
    constructor(layoutService: LayoutService);
    controlClass(state: string, grid?: boolean, additional?: string): string;
    initControlClass(renderer: Renderer2, element: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ControlClassService, [{ optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ControlClassService>;
}

declare class ClrControlSuccess extends ClrAbstractControl {
    protected controlIdService: ControlIdService;
    protected containerIdService: ContainerIdService;
    controlIdSuffix: string;
    constructor(controlIdService: ControlIdService, containerIdService: ContainerIdService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrControlSuccess, [{ optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrControlSuccess, "clr-control-success", never, {}, {}, never, ["*"], false, never>;
}

declare abstract class ClrAbstractContainer implements OnDestroy {
    protected layoutService: LayoutService;
    protected controlClassService: ControlClassService;
    protected ngControlService: NgControlService;
    label: ClrControlLabel;
    controlSuccessComponent: ClrControlSuccess;
    controlErrorComponent: ClrControlError;
    controlHelperComponent: ClrControlHelper;
    controls: NgControl[];
    protected subscriptions: Subscription[];
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService);
    get control(): NgControl;
    /**
     * @NOTE
     * Helper control is a bit different than the others, it must be always visible:
     *   -  Labels and instructions must always accompany forms and are persistent.
     *   -  The recommendation here is to always have helper text or anything instructions visible.
     *   -  The expectation is to have error text + helper text in the errored state. this way all users will have the helper text information always available.
     */
    get showHelper(): boolean;
    /**
     * We gonna set the helper control state, after all or most of the components
     * are ready - also this will trigger some initial flows into wrappers and controls,
     * like locating IDs  and setting  attributes.
     */
    get helpers(): {
        show: boolean;
        showInvalid: boolean;
        showHelper: boolean;
        showValid: boolean;
    };
    get showValid(): boolean;
    get showInvalid(): boolean;
    protected get successMessagePresent(): boolean;
    protected get errorMessagePresent(): boolean;
    private get touched();
    private get state();
    ngOnDestroy(): void;
    controlClass(): string;
    addGrid(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAbstractContainer, [{ optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrAbstractContainer, never, never, {}, {}, ["label", "controlSuccessComponent", "controlErrorComponent", "controlHelperComponent"], never, true, never>;
}

declare abstract class AbstractIfState {
    protected ngControlService: NgControlService;
    protected displayedContent: boolean;
    protected controls: NgControl[];
    protected constructor(ngControlService: NgControlService);
    protected handleState(_state: any): void;
    private getControlStatusChangesObservable;
    static ɵfac: i0.ɵɵFactoryDeclaration<AbstractIfState, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AbstractIfState, never, never, {}, {}, never, never, true, never>;
}

declare enum CONTROL_STATE {
    VALID = "VALID",
    INVALID = "INVALID"
}

declare class ClrIfError extends AbstractIfState {
    private template;
    private container;
    error: string;
    private embeddedViewRef;
    constructor(ngControlService: NgControlService, template: TemplateRef<any>, container: ViewContainerRef);
    /**
     * @param state CONTROL_STATE
     */
    protected handleState(state: CONTROL_STATE): void;
    private displayError;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIfError, [{ optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfError, "[clrIfError]", never, { "error": { "alias": "clrIfError"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrIfSuccess extends AbstractIfState {
    private template;
    private container;
    constructor(ngControlService: NgControlService, template: TemplateRef<any>, container: ViewContainerRef);
    /**
     * @param state CONTROL_STATE
     */
    protected handleState(state: CONTROL_STATE): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIfSuccess, [{ optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfSuccess, "[clrIfSuccess]", never, {}, {}, never, never, false, never>;
}

declare class MarkControlService {
    private _touched;
    get touchedChange(): Observable<void>;
    markAsTouched(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MarkControlService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MarkControlService>;
}

declare class ClrForm {
    layoutService: LayoutService;
    private markControlService;
    labels: QueryList<ClrControlLabel>;
    constructor(layoutService: LayoutService, markControlService: MarkControlService);
    set labelSize(size: number | string);
    onFormSubmit(): void;
    markAsTouched(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrForm, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrForm, "[clrForm]", never, { "labelSize": { "alias": "clrLabelSize"; "required": false; }; }, {}, ["labels"], never, false, never>;
}

declare class ClrLayout implements OnInit {
    layoutService: LayoutService;
    layout: ClrFormLayout | string;
    constructor(layoutService: LayoutService);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLayout, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrLayout, "[clrForm][clrLayout]", never, { "layout": { "alias": "clrLayout"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrControlContainer extends ClrAbstractContainer {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrControlContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrControlContainer, "clr-control-container", never, {}, {}, never, ["label", "*", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare enum CHANGE_KEYS {
    FORM = "form",
    MODEL = "model"
}
declare class WrappedFormControl<W> implements OnInit, DoCheck, OnDestroy {
    protected vcr: ViewContainerRef;
    protected wrapperType: Type<W>;
    private ngControl;
    protected renderer: Renderer2;
    protected el: ElementRef<HTMLElement>;
    _id: string;
    protected controlIdService: ControlIdService;
    protected ngControlService: NgControlService;
    protected index: number;
    protected subscriptions: Subscription[];
    private controlClassService;
    private markControlService;
    private containerIdService;
    private _containerInjector;
    private differs;
    private differ;
    constructor(vcr: ViewContainerRef, wrapperType: Type<W>, injector: Injector, ngControl: NgControl | null, renderer: Renderer2, el: ElementRef<HTMLElement>);
    get id(): string;
    set id(value: string);
    private get ariaDescribedById();
    ngOnInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    triggerValidation(): void;
    protected getProviderFromContainer<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T;
    private injectControlClassService;
    private triggerDoCheck;
    private markAsTouched;
    static ɵfac: i0.ɵɵFactoryDeclaration<WrappedFormControl<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<WrappedFormControl<any>, never, never, { "id": { "alias": "id"; "required": false; }; }, {}, never, never, true, never>;
}

declare class ClrControl extends WrappedFormControl<ClrControlContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrControl, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrControl, "[clrControl]", never, {}, {}, never, never, false, never>;
}

declare class ClrCommonFormsModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCommonFormsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrCommonFormsModule, [typeof ClrControlLabel, typeof ClrControlError, typeof ClrControlSuccess, typeof ClrControlHelper, typeof ClrIfError, typeof ClrIfSuccess, typeof ClrForm, typeof ClrLayout, typeof ClrControlContainer, typeof ClrControl], [typeof i3.CommonModule, typeof i5.ClrIcon], [typeof ClrControlLabel, typeof ClrControlError, typeof ClrControlSuccess, typeof ClrControlHelper, typeof ClrIfError, typeof ClrIfSuccess, typeof ClrForm, typeof ClrLayout, typeof ClrControlContainer, typeof ClrControl, typeof i5.ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrCommonFormsModule>;
}

declare class FormsFocusService {
    private _focused;
    get focusChange(): Observable<boolean>;
    set focused(state: boolean);
    static ɵfac: i0.ɵɵFactoryDeclaration<FormsFocusService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FormsFocusService>;
}

declare const IS_TOGGLE: InjectionToken<BehaviorSubject<boolean>>;
declare function isToggleFactory(): BehaviorSubject<boolean>;
declare const IS_TOGGLE_PROVIDER: {
    provide: InjectionToken<BehaviorSubject<boolean>>;
    useFactory: typeof isToggleFactory;
};
declare class ClrCheckboxWrapper implements OnInit, OnDestroy {
    label: ClrControlLabel$1;
    checkbox: ClrCheckbox;
    toggle: boolean;
    private subscriptions;
    constructor(toggleService: BehaviorSubject<boolean>);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCheckboxWrapper, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCheckboxWrapper, "clr-checkbox-wrapper,clr-toggle-wrapper", never, {}, {}, ["label", "checkbox"], ["[clrCheckbox],[clrToggle]", "label"], false, never>;
}

/**
 * This implements both the clrCheckbox and clrToggle functionality, since they are both just checkboxes with different
 * visual styling. The challenge is that the container needs to know which selector was used, which the @Attribute
 * decorator gets for us to determine if the toggle is used, and emits a value to the wrapper container to tell it
 * there is a toggle switch instead.
 */
declare class ClrCheckbox extends WrappedFormControl$1<ClrCheckboxWrapper> {
    private control;
    protected toggle: string;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>, toggle: string);
    get controlDisabled(): boolean;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCheckbox, [null, null, { optional: true; self: true; }, null, null, { attribute: "clrToggle"; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrCheckbox, "[clrCheckbox],[clrToggle]", never, {}, {}, never, never, false, never>;
}

declare class ClrCheckboxContainer extends ClrAbstractContainer$1 implements AfterContentInit {
    protected layoutService: LayoutService$1;
    protected controlClassService: ControlClassService$1;
    protected ngControlService: NgControlService$1;
    role: string;
    checkboxes: QueryList<ClrCheckbox>;
    private inline;
    constructor(layoutService: LayoutService$1, controlClassService: ControlClassService$1, ngControlService: NgControlService$1);
    get clrInline(): boolean | string;
    set clrInline(value: boolean | string);
    protected get allCheckboxesDisabled(): boolean;
    ngAfterContentInit(): void;
    private setAriaRoles;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCheckboxContainer, [{ optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCheckboxContainer, "clr-checkbox-container,clr-toggle-container", never, { "clrInline": { "alias": "clrInline"; "required": false; }; }, {}, ["checkboxes"], ["label", "clr-checkbox-wrapper,clr-toggle-wrapper", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrCheckboxModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCheckboxModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrCheckboxModule, [typeof ClrCheckbox, typeof ClrCheckboxContainer, typeof ClrCheckboxWrapper], [typeof i3.CommonModule, typeof i5.ClrIcon, typeof i6.ClrCommonFormsModule, typeof i11.ClrHostWrappingModule], [typeof i6.ClrCommonFormsModule, typeof ClrCheckbox, typeof ClrCheckboxContainer, typeof ClrCheckboxWrapper]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrCheckboxModule>;
}

declare class ComboboxContainerService {
    labelOffset: number;
    labelText: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ComboboxContainerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ComboboxContainerService>;
}

declare class ClrComboboxContainer extends ClrAbstractContainer$1 implements AfterContentInit, AfterViewInit {
    private containerService;
    private el;
    controlContainer: ElementRef<HTMLElement>;
    constructor(layoutService: LayoutService$1, controlClassService: ControlClassService$1, ngControlService: NgControlService$1, containerService: ComboboxContainerService, el: ElementRef<HTMLElement>);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrComboboxContainer, [{ optional: true; }, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrComboboxContainer, "clr-combobox-container", never, {}, {}, never, ["label", "clr-combobox", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare abstract class ComboboxModel<T> {
    model: T | T[];
    displayField?: string;
    abstract containsItem(item: T): boolean;
    abstract select(item: T): void;
    abstract unselect(item: T): void;
    abstract toString(displayField?: string, index?: number): string;
    abstract isEmpty(): boolean;
    abstract pop(): T;
}

declare class ClrOptionSelected<T> {
    template: TemplateRef<{
        $implicit: T;
    }>;
    selected: T;
    constructor(template: TemplateRef<{
        $implicit: T;
    }>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOptionSelected<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrOptionSelected<any>, "[clrOptionSelected]", never, { "selected": { "alias": "clrOptionSelected"; "required": false; }; }, {}, never, never, false, never>;
}

declare class OptionSelectionService<T> {
    loading: boolean;
    editable: boolean;
    filtering: boolean;
    selectionModel: ComboboxModel<T>;
    inputChanged: Observable<string>;
    showAllOptions: boolean;
    private _currentInput;
    private _displayField;
    private _inputChanged;
    private _selectionChanged;
    constructor();
    get displayField(): string;
    set displayField(value: string);
    get currentInput(): string;
    set currentInput(input: string);
    get selectionChanged(): Observable<ComboboxModel<T>>;
    get multiselectable(): boolean;
    select(item: T): void;
    toggle(item: T): void;
    unselect(item: T): void;
    setSelectionValue(value: T | T[]): void;
    parseStringToModel(value: string): T;
    static ɵfac: i0.ɵɵFactoryDeclaration<OptionSelectionService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OptionSelectionService<any>>;
}

declare class SingleSelectComboboxModel<T> implements ComboboxModel<T> {
    model: T;
    containsItem(item: T): boolean;
    select(item: T): void;
    unselect(item: T): void;
    isEmpty(): boolean;
    pop(): T;
    toString(displayField?: string): string;
}

declare class PseudoFocusModel<T> extends SingleSelectComboboxModel<T> {
    private _focusChanged;
    get focusChanged(): Observable<T>;
    select(item: T): void;
}

declare class ComboboxFocusHandler<T> {
    private popoverService;
    private selectionService;
    private platformId;
    pseudoFocus: PseudoFocusModel<OptionData<T>>;
    private renderer;
    private _trigger;
    private _listbox;
    private _textInput;
    private optionData;
    constructor(rendererFactory: RendererFactory2, popoverService: ClrPopoverService, selectionService: OptionSelectionService<T>, platformId: any);
    get trigger(): HTMLElement;
    set trigger(el: HTMLElement);
    get listbox(): HTMLElement;
    set listbox(el: HTMLElement);
    get textInput(): HTMLElement;
    set textInput(el: HTMLElement);
    focusInput(): void;
    focusFirstActive(): void;
    addOptionValues(options: OptionData<T>[]): void;
    private handleFocusSubscription;
    private moveFocusTo;
    private openAndMoveTo;
    private handleTextInput;
    private scrollIntoSelectedModel;
    private preventViewportScrolling;
    private addFocusOnBlurListener;
    private focusOutOfComponent;
    static ɵfac: i0.ɵɵFactoryDeclaration<ComboboxFocusHandler<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ComboboxFocusHandler<any>>;
}
declare class OptionData<T> {
    id: string;
    value: T;
    el: HTMLElement;
    constructor(id: string, value: T);
    equals(other: OptionData<T>): boolean;
}

declare class ClrCombobox<T> extends WrappedFormControl$1<ClrComboboxContainer> implements ControlValueAccessor, LoadingListener, AfterContentInit {
    control: NgControl;
    protected renderer: Renderer2;
    protected el: ElementRef<HTMLElement>;
    optionSelectionService: OptionSelectionService<T>;
    commonStrings: ClrCommonStringsService;
    private popoverService;
    private containerService;
    private platformId;
    private focusHandler;
    private cdr;
    placeholder: string;
    clrInputChange: EventEmitter<string>;
    clrOpenChange: rxjs.Observable<boolean>;
    /**
     * This output should be used to set up a live region using aria-live and populate it with updates that reflect each combobox change.
     */
    clrSelectionChange: rxjs.Observable<ComboboxModel<T>>;
    textbox: ElementRef<HTMLInputElement>;
    trigger: ElementRef<HTMLButtonElement>;
    optionSelected: ClrOptionSelected<T>;
    focused: boolean;
    popoverPosition: ClrPopoverPosition;
    protected index: number;
    protected popoverType: ClrPopoverType;
    private options;
    private _searchText;
    private onTouchedCallback;
    private onChangeCallback;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLElement>, optionSelectionService: OptionSelectionService<T>, commonStrings: ClrCommonStringsService, popoverService: ClrPopoverService, containerService: ComboboxContainerService, platformId: any, focusHandler: ComboboxFocusHandler<T>, cdr: ChangeDetectorRef);
    get editable(): boolean;
    set editable(value: boolean);
    get multiSelect(): boolean | string;
    set multiSelect(value: boolean | string);
    get id(): string;
    set id(id: string);
    get searchText(): string;
    set searchText(text: string);
    get openState(): boolean;
    get multiSelectModel(): T[];
    get ariaControls(): string;
    get ariaOwns(): string;
    get ariaDescribedBySelection(): string;
    get displayField(): string;
    private get disabled();
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    onKeyUp(event: KeyboardEvent): void;
    inputId(): string;
    loadingStateChange(state: ClrLoadingState): void;
    unselect(item: T): void;
    onBlur(event: any): void;
    onFocus(): void;
    onChange(): void;
    getSelectionAriaLabel(): string;
    focusFirstActive(): void;
    writeValue(value: T | T[]): void;
    registerOnTouched(onTouched: any): void;
    registerOnChange(onChange: any): void;
    getActiveDescendant(): string;
    setDisabledState(): void;
    onWrapperClick(event: any): void;
    private initializeSubscriptions;
    private updateInputValue;
    private updateControlValue;
    private getDisplayNames;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCombobox<any>, [null, null, { optional: true; self: true; }, null, null, null, null, null, { optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCombobox<any>, "clr-combobox", never, { "placeholder": { "alias": "placeholder"; "required": false; }; "editable": { "alias": "clrEditable"; "required": false; }; "multiSelect": { "alias": "clrMulti"; "required": false; }; }, { "clrInputChange": "clrInputChange"; "clrOpenChange": "clrOpenChange"; "clrSelectionChange": "clrSelectionChange"; }, ["optionSelected", "options"], ["*"], false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare class ClrOption<T> implements OnInit {
    elRef: ElementRef<HTMLElement>;
    commonStrings: ClrCommonStringsService;
    private focusHandler;
    private optionSelectionService;
    optionProxy: OptionData<T>;
    private _id;
    private _value;
    constructor(elRef: ElementRef<HTMLElement>, commonStrings: ClrCommonStringsService, focusHandler: ComboboxFocusHandler<T>, optionSelectionService: OptionSelectionService<T>);
    get optionId(): string;
    set optionId(id: string);
    get value(): T;
    set value(value: T);
    get selected(): boolean;
    get focusClass(): boolean;
    ngOnInit(): void;
    onClick(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOption<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrOption<any>, "clr-option", never, { "optionId": { "alias": "id"; "required": false; }; "value": { "alias": "clrValue"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare class ClrOptions<T> implements AfterViewInit, LoadingListener, OnDestroy {
    optionSelectionService: OptionSelectionService<T>;
    id: number;
    el: ElementRef<HTMLElement>;
    commonStrings: ClrCommonStringsService;
    private focusHandler;
    private popoverService;
    private document;
    optionsId: string;
    loading: boolean;
    _items: QueryList<ClrOption<T>>;
    private subscriptions;
    constructor(optionSelectionService: OptionSelectionService<T>, id: number, el: ElementRef<HTMLElement>, commonStrings: ClrCommonStringsService, focusHandler: ComboboxFocusHandler<T>, popoverService: ClrPopoverService, parentHost: ElementRef<HTMLElement>, document: any);
    get items(): QueryList<ClrOption<T>>;
    set items(items: QueryList<ClrOption<T>>);
    /**
     * Tests if the list of options is empty, meaning it doesn't contain any items
     */
    get emptyOptions(): boolean;
    get editable(): boolean;
    get noResultsElementId(): string;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    searchText(input: string): string;
    loadingStateChange(state: ClrLoadingState): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOptions<any>, [null, null, null, null, null, null, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrOptions<any>, "clr-options", never, { "optionsId": { "alias": "id"; "required": false; }; }, {}, ["items"], ["*"], false, never>;
}

declare class ClrOptionItems<T> implements DoCheck, OnDestroy {
    template: TemplateRef<NgForOfContext<T>>;
    private differs;
    private optionService;
    private iterableProxy;
    private _rawItems;
    private filteredItems;
    private subscriptions;
    private filter;
    private _filterField;
    private differ;
    constructor(template: TemplateRef<NgForOfContext<T>>, differs: IterableDiffers, optionService: OptionSelectionService<T>, vcr: ViewContainerRef);
    set rawItems(items: T[]);
    set trackBy(value: TrackByFunction<T>);
    set field(field: string);
    get hasResults(): number;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    private updateItems;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOptionItems<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrOptionItems<any>, "[clrOptionItems][clrOptionItemsOf]", never, { "rawItems": { "alias": "clrOptionItemsOf"; "required": false; }; "trackBy": { "alias": "clrOptionItemsTrackBy"; "required": false; }; "field": { "alias": "clrOptionItemsField"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrOptionGroup<T> {
    label: string;
    protected clrOptionItems: ClrOptionItems<T>;
    protected labelId: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOptionGroup<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrOptionGroup<any>, "clr-option-group", never, { "label": { "alias": "clrOptionGroupLabel"; "required": false; }; }, {}, ["clrOptionItems"], ["*"], false, never>;
}

declare class ClrComboboxModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrComboboxModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrComboboxModule, [typeof ClrCombobox, typeof ClrComboboxContainer, typeof ClrOptions, typeof ClrOption, typeof ClrOptionGroup, typeof ClrOptionSelected, typeof ClrOptionItems], [typeof i3.CommonModule, typeof i4.FormsModule, typeof i5.ClrIcon, typeof i11.ClrKeyFocusModule, typeof i6.ClrCommonFormsModule, typeof i11.ClrConditionalModule, typeof i1.ÇlrClrPopoverModuleNext, typeof i14.ClrSpinnerModule], [typeof i6.ClrCommonFormsModule, typeof ClrCombobox, typeof ClrComboboxContainer, typeof ClrOptions, typeof ClrOption, typeof ClrOptionGroup, typeof ClrOptionSelected, typeof i11.ClrConditionalModule, typeof ClrOptionItems]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrComboboxModule>;
}

declare class DatalistIdService {
    private _id;
    private _idChange;
    get id(): string;
    set id(value: string);
    get idChange(): Observable<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatalistIdService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatalistIdService>;
}

declare class ClrDatalist implements AfterContentInit {
    private datalistIdService;
    datalistId: string;
    private subscriptions;
    constructor(datalistIdService: DatalistIdService);
    set id(idValue: string);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalist, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatalist, "datalist", never, { "id": { "alias": "id"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrDatalistContainer extends ClrAbstractContainer$1 {
    focus: boolean;
    constructor(controlClassService: ControlClassService$1, layoutService: LayoutService$1, ngControlService: NgControlService$1, focusService: FormsFocusService$1);
    showPicker(datalist: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalistContainer, [null, { optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatalistContainer, "clr-datalist-container", never, {}, {}, never, ["label", "[clrDatalistInput]", "datalist", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrDatalistInput extends WrappedFormControl$1<ClrDatalistContainer> implements AfterContentInit {
    private focusService;
    private datalistIdService;
    listValue: string;
    constructor(focusService: FormsFocusService$1, vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>, datalistIdService: DatalistIdService);
    ngAfterContentInit(): void;
    triggerFocus(): void;
    triggerValidation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalistInput, [{ optional: true; }, null, null, { optional: true; self: true; }, null, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatalistInput, "[clrDatalistInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrDatalistModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalistModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrDatalistModule, [typeof ClrDatalist, typeof ClrDatalistInput, typeof ClrDatalistContainer], [typeof i3.CommonModule, typeof i5$1.ClrInputModule, typeof i5.ClrIcon], [typeof ClrDatalist, typeof ClrDatalistInput, typeof ClrDatalistContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrDatalistModule>;
}

declare class DateFormControlService {
    disabled: boolean;
    private _touchedChange;
    private _dirtyChange;
    get touchedChange(): Observable<void>;
    get dirtyChange(): Observable<void>;
    markAsTouched(): void;
    markAsDirty(): void;
    setDisabled(state: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateFormControlService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DateFormControlService>;
}

interface ClrDayOfWeek {
    readonly day: string;
    readonly narrow: string;
}

/**
 * This service extracts the Angular CLDR data needed by the datepicker.
 */
declare class LocaleHelperService {
    locale: string;
    private _firstDayOfWeek;
    private _localeDays;
    private _localeMonthsAbbreviated;
    private _localeMonthsWide;
    private _localeDateFormat;
    constructor(locale: string);
    get firstDayOfWeek(): number;
    get localeDays(): ReadonlyArray<ClrDayOfWeek>;
    get localeDaysNarrow(): ReadonlyArray<string>;
    get localeMonthsAbbreviated(): ReadonlyArray<string>;
    get localeMonthsWide(): ReadonlyArray<string>;
    get localeDateFormat(): string;
    /**
     * Initializes the locale data.
     */
    private initializeLocaleData;
    /**
     * Initialize day names based on the locale.
     * eg: [{day: Sunday, narrow: S}, {day: Monday, narrow: M}...] for en-US.
     */
    private initializeLocaleDays;
    /**
     * Initializes the array of month names in the TranslationWidth.Abbreviated format.
     * e.g. `[Jan, Feb, ...]` for en-US
     */
    private initializeLocaleMonthsAbbreviated;
    /**
     * Initializes the array of month names in the TranslationWidth.Wide format.
     * e.g. `[January, February, ...]` for en-US
     */
    private initializeLocaleMonthsWide;
    /**
     * Initializes the first day of the week based on the locale.
     */
    private initializeFirstDayOfWeek;
    private initializeLocaleDateFormat;
    static ɵfac: i0.ɵɵFactoryDeclaration<LocaleHelperService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LocaleHelperService>;
}

declare class DayModel {
    readonly year: number;
    readonly month: number;
    readonly date: number;
    constructor(year: number, month: number, date: number);
    /**
     * Checks if the passed CalendarDate is equal to itself.
     */
    isEqual(day: DayModel): boolean;
    toDate(): Date;
    /**
     * Returns a new DayModel which is incremented based on the value passed.
     */
    incrementBy(value: number): DayModel;
    /**
     * Clones the current day model.
     */
    clone(): DayModel;
    toComparisonString(): string;
    toDateString(): string;
    /**
     * Compares the dates and returns boolean value based on the value passed
     */
    isBefore(day: DayModel, dayInclusive?: boolean): boolean;
    /**
     * Compares the dates and returns boolean value based on the value passed
     */
    isAfter(day: DayModel, dayInclusive?: boolean): boolean;
    private pad;
}

interface DateRange {
    minDate?: DayModel;
    maxDate?: DayModel;
}
interface DateRangeInput {
    startDate: DayModel;
    endDate?: DayModel;
}
interface DateRangeOption {
    label: string;
    value: Date[];
}

declare class DateIOService {
    disabledDates: DateRange;
    cldrLocaleDateFormat: string;
    minDateChange: Subject<DayModel>;
    maxDateChange: Subject<DayModel>;
    private dateRangeOptions;
    private localeDisplayFormat;
    private delimiters;
    constructor(localeHelperService: LocaleHelperService);
    get placeholderText(): string;
    setMinDate(date: string): void;
    setMaxDate(date: string): void;
    setRangeOptions(rangeOptions: DateRangeOption[]): void;
    getRangeOptions(): any;
    toLocaleDisplayFormatString(date: Date): string;
    getDateValueFromDateString(date: string): Date;
    private validateDateRangeOptions;
    private initializeLocaleDisplayFormat;
    private extractDelimiters;
    /**
     * Checks if the month entered by the user is valid or not.
     * Note: Month is 0 based.
     */
    private isValidMonth;
    /**
     * Checks if the date is valid depending on the year and month provided.
     */
    private isValidDate;
    /**
     * Validates the parameters provided and returns the date.
     * If the parameters are not
     * valid then return null.
     * NOTE: (Month here is 1 based since the user has provided that as an input)
     */
    private validateAndGetDate;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateIOService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DateIOService>;
}

declare class CalendarModel {
    readonly year: number;
    readonly month: number;
    days: DayModel[];
    constructor(year: number, month: number);
    /**
     * Checks if the calendar passed is equal to the current calendar.
     */
    isEqual(calendar: CalendarModel): boolean;
    /**
     * Checks if a DayModel is in the Calendar
     */
    isDayInCalendar(day: DayModel): boolean;
    /**
     * Returns CalendarModel of the previous month.
     */
    previousMonth(): CalendarModel;
    /**
     * Returns CalendarModel of the next month.
     */
    nextMonth(): CalendarModel;
    /**
     * Returns CalendarModel of the previous year.
     */
    previousYear(): CalendarModel;
    /**
     * Returns CalendarModel of the next year.
     */
    nextYear(): CalendarModel;
    /**
     * Populates the days array with the DayModels in the current Calendar.
     */
    private initializeDaysInCalendar;
}

/**
 * This service is responsible for:
 * 1. Initializing the displayed calendar.
 * 2. Moving the calendar to the next, previous or current months
 * 3. Managing the focused and selected day models.
 */
declare class DateNavigationService {
    persistedDate: DayModel;
    persistedEndDate: DayModel;
    selectedDay: DayModel;
    selectedEndDay: DayModel;
    focusedDay: DayModel;
    hoveredDay: DayModel;
    hoveredMonth: number;
    hoveredYear: number;
    isRangePicker: boolean;
    hasActionButtons: boolean;
    private _displayedCalendar;
    private _todaysFullDate;
    private _today;
    private _selectedDayChange;
    private _selectedEndDayChange;
    private _displayedCalendarChange;
    private _focusOnCalendarChange;
    private _refreshCalendarView;
    private _focusedDayChange;
    get today(): DayModel;
    get displayedCalendar(): CalendarModel;
    get selectedDayChange(): Observable<DayModel>;
    get selectedEndDayChange(): Observable<DayModel>;
    /**
     * This observable lets the subscriber know that the displayed calendar has changed.
     */
    get displayedCalendarChange(): Observable<void>;
    /**
     * This observable lets the subscriber know that the focus should be applied on the calendar.
     */
    get focusOnCalendarChange(): Observable<void>;
    /**
     * This observable lets the subscriber know that the focused day in the displayed calendar has changed.
     */
    get focusedDayChange(): Observable<DayModel>;
    /**
     * This observable lets the subscriber know that the displayed calendar has changed.
     */
    get refreshCalendarView(): Observable<void>;
    /**
     * Notifies that the selected day has changed so that the date can be emitted to the user.
     */
    notifySelectedDayChanged(dayObject: DayModel | DateRangeInput, { emitEvent }?: {
        emitEvent: boolean;
    }): void;
    /**
     * Initializes the calendar based on the selected day.
     */
    initializeCalendar(): void;
    changeMonth(month: number): void;
    changeYear(year: number): void;
    /**
     * Moves the displayed calendar to the next month.
     */
    moveToNextMonth(): void;
    /**
     * Moves the displayed calendar to the previous month.
     */
    moveToPreviousMonth(): void;
    /**
     * Moves the displayed calendar to the next year.
     */
    moveToNextYear(): void;
    /**
     * Moves the displayed calendar to the previous year.
     */
    moveToPreviousYear(): void;
    /**
     * Moves the displayed calendar to the current month and year.
     */
    moveToCurrentMonth(): void;
    moveToSpecificMonth(day: DayModel): void;
    incrementFocusDay(value: number): void;
    resetSelectedDay(): void;
    convertDateToDayModel(date: Date): DayModel;
    private setSelectedDay;
    private setSelectedEndDay;
    private setDisplayedCalendar;
    private initializeTodaysDate;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateNavigationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DateNavigationService>;
}

declare class DatepickerEnabledService {
    private _document;
    private _isUserAgentMobile;
    private _innerWidth;
    constructor(_document: any);
    /**
     * Returns if the calendar should be active or not.
     * If the user agent is mobile and the screen width is less than DATEPICKER_ACTIVE_BREAKPOINT
     * then the calendar is inactive.
     */
    get isEnabled(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatepickerEnabledService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatepickerEnabledService>;
}

/**
 * This service manages which view is visible in the datepicker popover.
 */
declare class ViewManagerService {
    position: ClrPopoverPosition;
    private _currentView;
    get isDayView(): boolean;
    get isYearView(): boolean;
    get isMonthView(): boolean;
    changeToMonthView(): void;
    changeToYearView(): void;
    changeToDayView(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ViewManagerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ViewManagerService>;
}

declare class ClrDateContainer extends ClrAbstractContainer$1 implements AfterViewInit {
    protected renderer: Renderer2;
    protected elem: ElementRef;
    private popoverService;
    private dateNavigationService;
    private datepickerEnabledService;
    private dateFormControlService;
    private dateIOService;
    commonStrings: ClrCommonStringsService;
    private viewManagerService;
    protected controlClassService: ControlClassService$1;
    protected layoutService: LayoutService$1;
    protected ngControlService: NgControlService$1;
    focus: boolean;
    protected popoverType: ClrPopoverType;
    private toggleButton;
    constructor(renderer: Renderer2, elem: ElementRef, popoverService: ClrPopoverService, dateNavigationService: DateNavigationService, datepickerEnabledService: DatepickerEnabledService, dateFormControlService: DateFormControlService, dateIOService: DateIOService, commonStrings: ClrCommonStringsService, focusService: FormsFocusService$1, viewManagerService: ViewManagerService, controlClassService: ControlClassService$1, layoutService: LayoutService$1, ngControlService: NgControlService$1);
    /**
     * For date range picker actions buttons are shown by default
     */
    set showActionButtons(flag: boolean);
    set clrPosition(position: string | ClrPopoverPosition);
    set rangeOptions(rangeOptions: any);
    set min(dateString: string);
    set max(dateString: string);
    set actionButton(button: ElementRef<HTMLButtonElement>);
    get popoverPosition(): ClrPopoverPosition;
    get open(): boolean;
    /**
     * Returns if the Datepicker is enabled or not. If disabled, hides the datepicker trigger.
     */
    get isEnabled(): boolean;
    /**
     * Return if Datepicker is diabled or not as Form Control
     */
    get isInputDateDisabled(): boolean;
    protected get isRangePicker(): boolean;
    ngAfterViewInit(): void;
    /**
     * Return the label for the toggle button.
     * If there's a selected date, the date is included in the label.
     */
    private getToggleButtonLabel;
    private listenForDateChanges;
    /**
     * Processes the user input and Initializes the Calendar everytime the datepicker popover is open.
     */
    private initializeCalendar;
    private dateRangeStructuralChecks;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateContainer, [null, null, null, null, null, null, null, null, null, null, null, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDateContainer, "clr-date-container, clr-date-range-container", never, { "showActionButtons": { "alias": "showActionButtons"; "required": false; }; "clrPosition": { "alias": "clrPosition"; "required": false; }; "rangeOptions": { "alias": "rangeOptions"; "required": false; }; "min": { "alias": "min"; "required": false; }; "max": { "alias": "max"; "required": false; }; }, {}, never, ["label", "[clrStartDate]", "[clrEndDate]", "[clrDate]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

/**
 * This service focuses the day that is focusable in the calendar.
 */
declare class DatepickerFocusService {
    private _ngZone;
    private platformId;
    constructor(_ngZone: NgZone, platformId: any);
    focusCell(elRef: ElementRef<HTMLElement>): void;
    focusInput(element: HTMLInputElement): void;
    elementIsFocused(element: HTMLInputElement): boolean;
    private ngZoneIsStableInBrowser;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatepickerFocusService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatepickerFocusService>;
}

declare abstract class ClrDateInputBase extends WrappedFormControl$1<ClrDateContainer> implements OnInit, AfterViewInit, OnDestroy {
    protected el: ElementRef<HTMLInputElement>;
    protected renderer: Renderer2;
    protected control: NgControl;
    private container;
    protected dateIOService: DateIOService;
    protected dateNavigationService: DateNavigationService;
    private datepickerEnabledService;
    private dateFormControlService;
    private platformId;
    private focusService;
    protected datepickerFocusService: DatepickerFocusService;
    static ngAcceptInputType_date: Date | null | string;
    placeholder: string;
    protected index: number;
    private initialClrDateInputValue;
    private previousDateChange;
    protected abstract dateChange: EventEmitter<Date>;
    constructor(viewContainerRef: ViewContainerRef, injector: Injector, el: ElementRef<HTMLInputElement>, renderer: Renderer2, control: NgControl, container: ClrDateContainer, dateIOService: DateIOService, dateNavigationService: DateNavigationService, datepickerEnabledService: DatepickerEnabledService, dateFormControlService: DateFormControlService, platformId: any, focusService: FormsFocusService$1, datepickerFocusService: DatepickerFocusService);
    get disabled(): boolean | string;
    set disabled(value: boolean | string);
    get placeholderText(): string;
    get inputType(): string;
    protected abstract get userSelectedDayChange(): Observable<DayModel>;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    setFocusStates(): void;
    triggerValidation(): void;
    onValueChange(target: HTMLInputElement): void;
    protected datepickerHasFormControl(): boolean;
    protected setDate(date: Date | string): void;
    protected triggerControlInputValidation(): void;
    private usingClarityDatepicker;
    private usingNativeDatepicker;
    private setFocus;
    private populateServicesFromContainerComponent;
    private processInitialInputs;
    private updateDate;
    private updateInput;
    private getValidDateValueFromDate;
    private emitDateOutput;
    private listenForControlValueChanges;
    private listenForUserSelectedDayChanges;
    private listenForTouchChanges;
    private listenForDirtyChanges;
    private listenForInputRefocus;
    /**
     * In case of date range error, both start & end date field validation has to be triggered
     * if either of the field gets updated
     */
    private validateDateRange;
    protected abstract updateDayModel(dayModel: DayModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateInputBase, [null, null, null, null, { optional: true; self: true; }, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }, null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDateInputBase, never, never, { "placeholder": { "alias": "placeholder"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, {}, never, never, true, never>;
}

declare class ClrDateInput extends ClrDateInputBase {
    dateChange: EventEmitter<Date>;
    set date(date: Date | string);
    set min(dateString: string);
    set max(dateString: string);
    protected get userSelectedDayChange(): rxjs.Observable<DayModel>;
    protected updateDayModel(dayModel: DayModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDateInput, "[clrDate]", never, { "date": { "alias": "clrDate"; "required": false; }; "min": { "alias": "min"; "required": false; }; "max": { "alias": "max"; "required": false; }; }, { "dateChange": "clrDateChange"; }, never, never, false, never>;
}

declare class ClrStartDateInput extends ClrDateInputBase {
    dateChange: EventEmitter<Date>;
    inputWidth: number;
    set date(date: Date | string);
    get inputSize(): number;
    protected get userSelectedDayChange(): rxjs.Observable<DayModel>;
    ngOnInit(): void;
    protected updateDayModel(dayModel: DayModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStartDateInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStartDateInput, "[clrStartDate]", never, { "inputWidth": { "alias": "inputWidth"; "required": false; }; "date": { "alias": "clrStartDate"; "required": false; }; }, { "dateChange": "clrStartDateChange"; }, never, never, false, never>;
}

declare class ClrEndDateInput extends ClrDateInputBase {
    dateChange: EventEmitter<Date>;
    inputWidth: number;
    set date(date: Date | string);
    get inputSize(): number;
    protected get userSelectedDayChange(): rxjs.Observable<DayModel>;
    ngOnInit(): void;
    protected updateDayModel(dayModel: DayModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrEndDateInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrEndDateInput, "[clrEndDate]", never, { "inputWidth": { "alias": "inputWidth"; "required": false; }; "date": { "alias": "clrEndDate"; "required": false; }; }, { "dateChange": "clrEndDateChange"; }, never, never, false, never>;
}

declare class ClrDateInputValidator implements Validator {
    private dateIOService;
    constructor(dateIOService: DateIOService);
    validate(control: AbstractControl): ValidationErrors;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateInputValidator, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDateInputValidator, "[clrDate], [clrStartDate], [clrEndDate]", never, {}, {}, never, never, false, never>;
}
declare class ClrStartDateInputValidator implements Validator {
    private dateIOService;
    private dateNavigationService;
    constructor(dateIOService: DateIOService, dateNavigationService: DateNavigationService);
    validate(control: AbstractControl): ValidationErrors;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStartDateInputValidator, [{ optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStartDateInputValidator, "[clrStartDate]", never, {}, {}, never, never, false, never>;
}
declare class ClrEndDateInputValidator implements Validator {
    private dateIOService;
    private dateNavigationService;
    constructor(dateIOService: DateIOService, dateNavigationService: DateNavigationService);
    validate(control: AbstractControl): ValidationErrors;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrEndDateInputValidator, [{ optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrEndDateInputValidator, "[clrEndDate]", never, {}, {}, never, never, false, never>;
}

declare class ClrDatepickerViewManager {
    commonStrings: ClrCommonStringsService;
    private viewManagerService;
    private dateNavigationService;
    private dateIOService;
    constructor(commonStrings: ClrCommonStringsService, viewManagerService: ViewManagerService, dateNavigationService: DateNavigationService, dateIOService: DateIOService);
    /**
     * Returns if the current view is the monthpicker.
     */
    get isMonthView(): boolean;
    /**
     * Returns if the current view is the yearpicker.
     */
    get isYearView(): boolean;
    /**
     * Returns if the current view is the daypicker.
     */
    get isDayView(): boolean;
    get hasRangeOptions(): boolean;
    protected get hasActionButtons(): boolean;
    protected get dateRangeOptions(): any;
    onRangeOptionSelect(selectedRange: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatepickerViewManager, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatepickerViewManager, "clr-datepicker-view-manager", never, {}, {}, never, never, false, never>;
}

declare class ClrDaypicker {
    private _viewManagerService;
    private _dateNavigationService;
    private _localeHelperService;
    commonStrings: ClrCommonStringsService;
    constructor(_viewManagerService: ViewManagerService, _dateNavigationService: DateNavigationService, _localeHelperService: LocaleHelperService, commonStrings: ClrCommonStringsService);
    get monthAttrString(): string;
    get yearAttrString(): string;
    /**
     * Returns the month value of the calendar in the TranslationWidth.Abbreviated format.
     */
    get calendarMonth(): string;
    /**
     * Returns the year value of the calendar.
     */
    get calendarYear(): number;
    /**
     * Calls the ViewManagerService to change to the monthpicker view.
     */
    changeToMonthView(): void;
    /**
     * Calls the ViewManagerService to change to the yearpicker view.
     */
    changeToYearView(): void;
    /**
     * Calls the DateNavigationService to move to the next month.
     */
    nextMonth(): void;
    /**
     * Calls the DateNavigationService to move to the previous month.
     */
    previousMonth(): void;
    /**
     * Calls the DateNavigationService to move to the current month.
     */
    currentMonth(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDaypicker, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDaypicker, "clr-daypicker", never, {}, {}, never, never, false, never>;
}

declare class ClrMonthpicker implements AfterViewInit {
    private _localeHelperService;
    private _dateNavigationService;
    private _datepickerFocusService;
    private _elRef;
    private _viewManagerService;
    commonStrings: ClrCommonStringsService;
    /**
     * Keeps track of the current focused month.
     */
    private _focusedMonthIndex;
    constructor(_localeHelperService: LocaleHelperService, _dateNavigationService: DateNavigationService, _datepickerFocusService: DatepickerFocusService, _elRef: ElementRef, _viewManagerService: ViewManagerService, commonStrings: ClrCommonStringsService);
    /**
     * Gets the months array which is used to rendered the monthpicker view.
     * Months are in the TranslationWidth.Wide format.
     */
    get monthNames(): ReadonlyArray<string>;
    /**
     * Gets the month value of the Calendar.
     */
    get calendarMonthIndex(): number;
    /**
     * Gets the year which the user is currently on.
     */
    get calendarEndMonthIndex(): number;
    get yearAttrString(): string;
    /**
     * Returns the year value of the calendar.
     */
    get calendarYear(): number;
    get currentCalendarYear(): number;
    get currentCalendarMonth(): number;
    getIsRangeStartMonth(monthIndex: number): boolean;
    getIsRangeEndMonth(monthIndex: number): boolean;
    /**
     * Calls the ViewManagerService to change to the yearpicker view.
     */
    changeToYearView(): void;
    /**
     * Focuses on the current calendar month when the View is initialized.
     */
    ngAfterViewInit(): void;
    /**
     * Handles the Keyboard arrow navigation for the monthpicker.
     */
    onKeyDown(event: KeyboardEvent): void;
    isSelected(monthIndex: number): boolean;
    /**
     * Calls the DateNavigationService to update the hovered month value of the calendar
     */
    onHover(monthIndex: number): void;
    /**
     * Calls the DateNavigationService to update the month value of the calendar.
     * Also changes the view to the daypicker.
     */
    changeMonth(monthIndex: number): void;
    /**
     * Compares the month passed to the focused month and returns the tab index.
     */
    getTabIndex(monthIndex: number): number;
    /**
     * Calls the DateNavigationService to move to the next month.
     */
    nextYear(): void;
    /**
     * Calls the DateNavigationService to move to the previous month.
     */
    previousYear(): void;
    /**
     * Calls the DateNavigationService to move to the current month.
     */
    currentYear(): void;
    /**
     * Applicable only to date range picker
     * Compares the month passed is in between the start and end date range
     */
    isInRange(monthIndex: number): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrMonthpicker, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrMonthpicker, "clr-monthpicker", never, {}, {}, never, never, false, never>;
}

declare class YearRangeModel {
    private readonly year;
    yearRange: number[];
    constructor(year: number);
    /**
     * Gets the number in the middle of the range.
     */
    get middleYear(): number;
    /**
     * Generates the YearRangeModel for the next decade.
     */
    nextDecade(): YearRangeModel;
    /**
     * Generates the YearRangeModel for the previous decade.
     */
    previousDecade(): YearRangeModel;
    /**
     * Generates the YearRangeModel for the current decade.
     */
    currentDecade(): YearRangeModel;
    /**
     * Checks if the value is in the YearRangeModel.
     */
    inRange(value: number): boolean;
    /**
     * Generates the year range based on the year parameter.
     * eg: If 2018 is passed the output will be [2010, 2011, ..., 2019]
     */
    private generateYearRange;
    /**
     * Function which generate a range of numbers from floor to ceil.
     */
    private generateRange;
}

declare class ClrYearpicker implements AfterViewInit {
    private _dateNavigationService;
    private _viewManagerService;
    private _datepickerFocusService;
    private _elRef;
    commonStrings: ClrCommonStringsService;
    /**
     * YearRangeModel which is used to build the YearPicker view.
     */
    yearRangeModel: YearRangeModel;
    /**
     * Keeps track of the current focused year.
     */
    private _focusedYear;
    constructor(_dateNavigationService: DateNavigationService, _viewManagerService: ViewManagerService, _datepickerFocusService: DatepickerFocusService, _elRef: ElementRef<HTMLElement>, commonStrings: ClrCommonStringsService);
    get selectedStartYear(): number;
    get selectedEndYear(): number;
    /**
     * Gets the year which the user is currently on.
     */
    get calendarYear(): number;
    isCurrentCalendarYear(year: number): boolean;
    getIsRangeStartYear(year: number): boolean;
    getIsRangeEndYear(year: number): boolean;
    /**
     * Focuses on the current calendar year when the View is initialized.
     */
    ngAfterViewInit(): void;
    /**
     * Handles the Keyboard arrow navigation for the yearpicker.
     */
    onKeyDown(event: KeyboardEvent): void;
    /**
     * Calls the DateNavigationService to update the year value of the calendar.
     * Also changes the view to the daypicker.
     */
    changeYear(year: number): void;
    /**
     * Calls the DateNavigationService to update the hovered year value of the calendar
     */
    onHover(year: number): void;
    /**
     * Updates the YearRangeModel to the previous decade.
     */
    previousDecade(): void;
    /**
     * Updates the YearRangeModel to the current decade.
     */
    currentDecade(): void;
    /**
     * Updates the YearRangeModel to the next decade.
     */
    nextDecade(): void;
    /**
     * Compares the year passed to the focused year and returns the tab index.
     */
    getTabIndex(year: number): number;
    /**
     * Applicable only to date range picker
     * Compares the year passed is in between the start and end date range
     */
    isInRange(year: number): boolean;
    changeToDayView(): void;
    /**
     * Increments the focus year by the value passed. Updates the YearRangeModel if the
     * new value is not in the current decade.
     */
    private incrementFocusYearBy;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrYearpicker, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrYearpicker, "clr-yearpicker", never, {}, {}, never, never, false, never>;
}

declare class DayViewModel {
    dayModel: DayModel;
    isTodaysDate: boolean;
    isExcluded: boolean;
    isDisabled: boolean;
    isSelected: boolean;
    isFocusable: boolean;
    isRangeStartDay: boolean;
    isRangeEndDay: boolean;
    constructor(dayModel: DayModel, isTodaysDate?: boolean, isExcluded?: boolean, isDisabled?: boolean, isSelected?: boolean, isFocusable?: boolean, isRangeStartDay?: boolean, isRangeEndDay?: boolean);
    /**
     * Gets the tab index based on the isFocusable flag.
     */
    get tabIndex(): number;
}

declare class CalendarViewModel {
    calendar: CalendarModel;
    selectedDay: DayModel;
    selectedEndDay: DayModel;
    private focusableDay;
    private today;
    firstDayOfWeek: number;
    private excludedDates;
    private currMonthDayViews;
    private _calendarView;
    constructor(calendar: CalendarModel, selectedDay: DayModel, selectedEndDay: DayModel, focusableDay: DayModel, today: DayModel, firstDayOfWeek: number, excludedDates: DateRange);
    /**
     * DayViewModel matrix. Size 6x7
     */
    get calendarView(): DayViewModel[][];
    /**
     * Updates the focusable day in the calendar.
     */
    updateFocusableDay(day: DayModel): void;
    /**
     * Updates the selected day in the calendar
     */
    updateSelectedDay(day: DayModel | undefined): void;
    /**
     * Updates the selected end day in the calendar
     */
    updateSelectedEndDay(day: DayModel | undefined): void;
    /**
     * Generates a 6x7 matrix of DayViewModel based on the Calendar.
     * The 6x7 matrix is structured according to the first day of the week.
     * 6 rows to accommodate months which might have dates spanning over 6 weeks.
     * 7 columns because there are 7 days in a week :P :D
     */
    private initializeCalendarView;
    private isDateExcluded;
    /**
     * Generates a DayViewModel array based on the DayModel passed
     */
    private generateDayViewModels;
    /**
     * Gets the first day of the current month to figure out how many dates of previous month
     * are needed to complete the Calendar View based on the first day of the week.
     * eg: Assuming locale en-US, the first day of the week is Sunday,
     * if first day of the current month lands on Wednesday, then
     * (this.getDay function would return 3 since
     * first day of the week is 0), we need the 3 days from the previous month.
     */
    private numDaysFromPrevMonthInCalView;
    /**
     * Checks if the Day passed is in the CalendarView.
     */
    private isDayInCalendarView;
    /**
     * Using the DayViewModels from the previous, current and next month, this function
     * generates the CalendarView.
     */
    private generateCalendarView;
    /**
     * Initialize the selected day if the day is in the calendar.
     */
    private initializeSelectedDay;
    /**
     * Initializes the focusable day if the day is in the calendar. If focusable day is not set, then
     * we check for the selected day. If selected day is not set then check if today is in the current
     * calendar. If not then just set the 15th of the current calendar month.
     */
    private initializeFocusableDay;
    private setFocusableFlag;
    private setSelectedDay;
}

declare class ClrCalendar implements OnDestroy {
    private _localeHelperService;
    private _dateNavigationService;
    private _datepickerFocusService;
    private _dateIOService;
    private _elRef;
    private _dateFormControlService;
    private _popoverService;
    /**
     * Calendar View Model to generate the Calendar.
     */
    calendarViewModel: CalendarViewModel;
    private _subs;
    constructor(_localeHelperService: LocaleHelperService, _dateNavigationService: DateNavigationService, _datepickerFocusService: DatepickerFocusService, _dateIOService: DateIOService, _elRef: ElementRef<HTMLElement>, _dateFormControlService: DateFormControlService, _popoverService: ClrPopoverService);
    /**
     * Gets the locale days according to the TranslationWidth.Narrow format.
     */
    get localeDays(): ReadonlyArray<ClrDayOfWeek>;
    get calendar(): CalendarModel;
    get selectedDay(): DayModel;
    get selectedEndDay(): DayModel;
    get focusedDay(): DayModel;
    get today(): DayModel;
    /**
     * Focuses on the focusable day when the Calendar View is initialized.
     */
    ngAfterViewInit(): void;
    /**
     * Unsubscribe from subscriptions.
     */
    ngOnDestroy(): void;
    /**
     * Delegates Keyboard arrow navigation to the DateNavigationService.
     */
    onKeyDown(event: KeyboardEvent): void;
    setSelectedDay(day: DayModel): void;
    /**
     * Initialize subscriptions to:
     * 1. update the calendar view model.
     * 2. update the focusable day in the calendar view model.
     * 3. focus on the focusable day in the calendar.
     */
    private initializeSubscriptions;
    private validateAndCloseDatePicker;
    private updateCalendarViewModal;
    private refreshCalendarViewModal;
    /**
     * Generates the Calendar View based on the calendar retrieved from the DateNavigationService.
     */
    private generateCalendarView;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCalendar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCalendar, "clr-calendar", never, {}, {}, never, never, false, never>;
}

declare class ClrDay {
    private _dateNavigationService;
    private commonStrings;
    onSelectDay: EventEmitter<DayModel>;
    private _dayView;
    constructor(_dateNavigationService: DateNavigationService, commonStrings: ClrCommonStringsService);
    /**
     * DayViewModel input which is used to build the Day View.
     */
    get dayView(): DayViewModel;
    set dayView(day: DayViewModel);
    get dayString(): string;
    get isRangeStartDay(): boolean;
    get isRangeEndDay(): boolean;
    /**
     * Calls the DateNavigationService to update the hovered day value of the calendar
     */
    hoverListener(): void;
    /**
     * Updates the focusedDay in the DateNavigationService when the ClrDay is focused.
     */
    onDayViewFocus(): void;
    /**
     * Updates the selectedDay when the ClrDay is selected and closes the datepicker popover.
     */
    selectDay(): void;
    /**
     * Applicable only to date range picker
     * Compares whether the day is in between the start and end date range
     */
    isInRange(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDay, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDay, "clr-day", never, { "dayView": { "alias": "clrDayView"; "required": false; }; }, { "onSelectDay": "selectDay"; }, never, never, false, never>;
}

declare class ClrDatepickerActions {
    protected commonStrings: ClrCommonStringsService;
    private popoverService;
    private dateNavigationService;
    private dateFormControlService;
    constructor(commonStrings: ClrCommonStringsService, popoverService: ClrPopoverService, dateNavigationService: DateNavigationService, dateFormControlService: DateFormControlService);
    protected apply(): void;
    protected cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatepickerActions, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatepickerActions, "clr-datepicker-actions", never, {}, {}, never, never, false, never>;
}

declare const CLR_DATEPICKER_DIRECTIVES: Type<any>[];
declare class ClrDatepickerModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatepickerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrDatepickerModule, [typeof ClrDateInput, typeof ClrDay, typeof ClrDateContainer, typeof ClrDateInputValidator, typeof ClrStartDateInput, typeof ClrEndDateInput, typeof ClrStartDateInputValidator, typeof ClrEndDateInputValidator, typeof ClrDatepickerViewManager, typeof ClrMonthpicker, typeof ClrYearpicker, typeof ClrDaypicker, typeof ClrCalendar, typeof ClrDatepickerActions], [typeof i3.CommonModule, typeof i11.CdkTrapFocusModule, typeof i11.ClrHostWrappingModule, typeof i11.ClrConditionalModule, typeof i1.ÇlrClrPopoverModuleNext, typeof i5.ClrIcon, typeof i6.ClrCommonFormsModule, typeof i18.ClrVerticalNavModule], [typeof ClrDateInput, typeof ClrDay, typeof ClrDateContainer, typeof ClrDateInputValidator, typeof ClrStartDateInput, typeof ClrEndDateInput, typeof ClrStartDateInputValidator, typeof ClrEndDateInputValidator, typeof ClrDatepickerViewManager, typeof ClrMonthpicker, typeof ClrYearpicker, typeof ClrDaypicker, typeof ClrCalendar, typeof ClrDatepickerActions]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrDatepickerModule>;
}

interface ClrFileListValidationErrors {
    required?: boolean;
    accept?: ClrFileAcceptError[];
    minFileSize?: ClrFileMinFileSizeError[];
    maxFileSize?: ClrFileMaxFileSizeError[];
}
interface ClrFileAcceptError {
    /**
     * The name of the selected file.
     */
    name: string;
    /**
     * The file types that are accepted by the file input.
     */
    accept: string[];
    /**
     * The actual MIME type of the selected file.
     */
    type: string;
    /**
     * The actual extension of the selected file.
     */
    extension: string;
}
interface ClrFileMinFileSizeError {
    /**
     * The name of the selected file.
     */
    name: string;
    /**
     * The minimum file size that is accepted by the file input.
     */
    minFileSize: number;
    /**
     * The actual size of the selected file.
     */
    actualFileSize: number;
}
interface ClrFileMaxFileSizeError {
    /**
     * The name of the selected file.
     */
    name: string;
    /**
     * The maximum file size that is accepted by the file input.
     */
    maxFileSize: number;
    /**
     * The actual size of the selected file.
     */
    actualFileSize: number;
}

interface ClrSingleFileValidationErrors {
    accept?: ClrFileAcceptError;
    minFileSize?: ClrFileMinFileSizeError;
    maxFileSize?: ClrFileMaxFileSizeError;
}
interface ClrFileMessagesTemplateContext {
    $implicit: File;
    success: boolean;
    errors: ClrSingleFileValidationErrors;
}
declare class ClrFileMessagesTemplate {
    readonly templateRef: TemplateRef<ClrFileMessagesTemplateContext>;
    static ngTemplateContextGuard(directive: ClrFileMessagesTemplate, context: unknown): context is ClrFileMessagesTemplateContext;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileMessagesTemplate, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileMessagesTemplate, "ng-template[clr-file-messages]", never, {}, {}, never, never, false, never>;
}

declare class ClrFileList {
    protected readonly fileMessagesTemplate: ClrFileMessagesTemplate;
    private readonly injector;
    private readonly commonStrings;
    private readonly ngControlService;
    private readonly fileInputContainer;
    constructor();
    protected get files(): File[];
    protected getClearFileLabel(filename: string): string;
    protected clearFile(fileToRemove: File): void;
    protected createFileMessagesTemplateContext(file: File): ClrFileMessagesTemplateContext;
    protected createFileMessagesTemplateInjector(fileMessagesTemplateContext: ClrFileMessagesTemplateContext): i0.DestroyableInjector;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileList, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileList, "clr-file-list", never, {}, {}, ["fileMessagesTemplate"], never, false, never>;
}

declare class ClrFileInputContainer extends ClrAbstractContainer$1 {
    customButtonLabel: string;
    readonly fileInput: ClrFileInput;
    protected readonly fileList: ClrFileList;
    private browseButtonElementRef;
    private fileListFileInputElementRef;
    private readonly fileSuccessComponent;
    private readonly fileErrorComponent;
    private readonly commonStrings;
    protected get accept(): string;
    protected get multiple(): boolean;
    protected get disabled(): boolean;
    protected get browseButtonText(): string;
    protected get browseButtonDescribedBy(): string;
    protected get successMessagePresent(): boolean;
    protected get errorMessagePresent(): boolean;
    focusBrowseButton(): void;
    protected browse(): void;
    protected clearSelectedFiles(): void;
    protected addFilesToSelection(newFiles: FileList): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInputContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileInputContainer, "clr-file-input-container", never, { "customButtonLabel": { "alias": "clrButtonLabel"; "required": false; }; }, {}, ["fileInput", "fileList", "fileSuccessComponent", "fileErrorComponent"], ["label", "[clrFileInput]", "clr-control-helper", "clr-control-error", "clr-control-success", "clr-file-list"], false, never>;
}

interface ClrFileInputSelection {
    fileCount: number;
    buttonLabel: string;
    clearFilesButtonLabel: string;
}
declare class ClrFileInput extends WrappedFormControl$1<ClrFileInputContainer> {
    readonly elementRef: ElementRef<HTMLInputElement>;
    private readonly control;
    private readonly commonStrings;
    selection: ClrFileInputSelection;
    constructor(injector: Injector, renderer: Renderer2, viewContainerRef: ViewContainerRef, elementRef: ElementRef<HTMLInputElement>, control: NgControl, commonStrings: ClrCommonStringsService);
    protected get disabled(): boolean;
    private handleChange;
    private updateSelection;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInput, [null, null, null, null, { optional: true; self: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileInput, "input[type=\"file\"][clrFileInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrFileInputValidator implements Validator {
    private readonly elementRef;
    minFileSize: number;
    maxFileSize: number;
    constructor(elementRef: ElementRef<HTMLInputElement>);
    validate(control: AbstractControl<FileList>): ValidationErrors;
    private getSuffixByDepth;
    private validateAccept;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInputValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileInputValidator, "input[type=\"file\"][clrFileInput]", never, { "minFileSize": { "alias": "clrMinFileSize"; "required": false; }; "maxFileSize": { "alias": "clrMaxFileSize"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrFileInputValueAccessor implements ControlValueAccessor {
    private readonly elementRef;
    constructor(elementRef: ElementRef<HTMLInputElement>);
    writeValue(value: FileList): void;
    registerOnChange(fn: (value: FileList) => void): void;
    registerOnTouched(fn: () => void): void;
    private handleChange;
    private onChange;
    private onTouched;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInputValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileInputValueAccessor, "input[type=\"file\"][clrFileInput]", never, {}, {}, never, never, false, never>;
}

declare const CLR_FILE_MESSAGES_TEMPLATE_CONTEXT: InjectionToken<ClrFileMessagesTemplateContext>;
declare class ClrFileInfo {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInfo, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileInfo, "clr-file-info", never, {}, {}, never, ["*"], false, never>;
}
declare class ClrFileSuccess {
    protected readonly context: ClrFileMessagesTemplateContext;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileSuccess, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileSuccess, "clr-file-success", never, {}, {}, never, ["*"], false, never>;
}
declare class ClrFileError {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileError, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileError, "clr-file-error", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrFileInputModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInputModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrFileInputModule, [typeof ClrFileInput, typeof ClrFileInputContainer, typeof ClrFileInputValidator, typeof ClrFileInputValueAccessor, typeof ClrFileList, typeof ClrFileMessagesTemplate, typeof ClrFileInfo, typeof ClrFileSuccess, typeof ClrFileError], [typeof i3.CommonModule, typeof i5.ClrIcon, typeof i6.ClrCommonFormsModule], [typeof i6.ClrCommonFormsModule, typeof ClrFileInput, typeof ClrFileInputContainer, typeof ClrFileInputValidator, typeof ClrFileInputValueAccessor, typeof ClrFileList, typeof ClrFileMessagesTemplate, typeof ClrFileInfo, typeof ClrFileSuccess, typeof ClrFileError]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrFileInputModule>;
}

declare function buildFileList(files: File[]): FileList;
declare function selectFiles(fileInputElement: HTMLInputElement, files: File[] | FileList): void;
declare function clearFiles(fileInputElement: HTMLInputElement): void;

declare class ClrInputContainer extends ClrAbstractContainer$1 {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrInputContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrInputContainer, "clr-input-container", never, {}, {}, never, ["label", "[clrInputPrefix]", "[clrInput]", "[clrInputSuffix]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrInput extends WrappedFormControl$1<ClrInputContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrInput, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrInput, "[clrInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrInputModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrInputModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrInputModule, [typeof ClrInput, typeof ClrInputContainer], [typeof i3.CommonModule, typeof i4.FormsModule, typeof i5.ClrIcon, typeof i6.ClrCommonFormsModule], [typeof i6.ClrCommonFormsModule, typeof ClrInput, typeof ClrInputContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrInputModule>;
}

declare class ClrNumberInputContainer extends ClrAbstractContainer$1 {
    focus: boolean;
    protected readonly input: ClrNumberInput;
    constructor(controlClassService: ControlClassService$1, layoutService: LayoutService$1, ngControlService: NgControlService$1, focusService: FormsFocusService$1);
    focusOut(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNumberInputContainer, [null, { optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrNumberInputContainer, "clr-number-input-container", never, {}, {}, ["input"], ["label", "[clrNumberInput]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrNumberInput extends WrappedFormControl$1<ClrNumberInputContainer> {
    private focusService;
    private control;
    protected el: ElementRef<HTMLInputElement>;
    protected index: number;
    constructor(focusService: FormsFocusService$1, vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    get readonly(): boolean;
    triggerFocus(): void;
    triggerValidation(): void;
    stepUp(): void;
    stepDown(): void;
    dispatchBlur(): void;
    private dispatchStepChangeEvents;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNumberInput, [{ optional: true; }, null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrNumberInput, "input[type=\"number\"][clrNumberInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrNumberInputModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNumberInputModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrNumberInputModule, [typeof ClrNumberInput, typeof ClrNumberInputContainer], [typeof i3.CommonModule, typeof i4.FormsModule, typeof i5.ClrIcon, typeof i6.ClrCommonFormsModule], [typeof i6.ClrCommonFormsModule, typeof ClrNumberInput, typeof ClrNumberInputContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrNumberInputModule>;
}

declare const TOGGLE_SERVICE: InjectionToken<BehaviorSubject<boolean>>;
declare function ToggleServiceFactory(): BehaviorSubject<boolean>;
declare const TOGGLE_SERVICE_PROVIDER: {
    provide: InjectionToken<BehaviorSubject<boolean>>;
    useFactory: typeof ToggleServiceFactory;
};
declare class ClrPasswordContainer extends ClrAbstractContainer$1 {
    focusService: FormsFocusService$1;
    private toggleService;
    commonStrings: ClrCommonStringsService;
    show: boolean;
    focus: boolean;
    private _toggle;
    constructor(layoutService: LayoutService$1, controlClassService: ControlClassService$1, ngControlService: NgControlService$1, focusService: FormsFocusService$1, toggleService: BehaviorSubject<boolean>, commonStrings: ClrCommonStringsService);
    get clrToggle(): boolean;
    set clrToggle(state: boolean);
    toggle(): void;
    showPasswordText(label: string): string;
    hidePasswordText(label: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPasswordContainer, [{ optional: true; }, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrPasswordContainer, "clr-password-container", never, { "clrToggle": { "alias": "clrToggle"; "required": false; }; }, {}, never, ["label", "[clrPassword]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrPassword extends WrappedFormControl$1<ClrPasswordContainer> implements OnInit, OnDestroy {
    private focusService;
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>, focusService: FormsFocusService$1, toggleService: BehaviorSubject<boolean>);
    triggerFocus(): void;
    triggerValidation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPassword, [null, null, { optional: true; self: true; }, null, null, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrPassword, "[clrPassword]", never, {}, {}, never, never, false, never>;
}

declare class ClrPasswordModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPasswordModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrPasswordModule, [typeof ClrPassword, typeof ClrPasswordContainer], [typeof i3.CommonModule, typeof i4.FormsModule, typeof i5.ClrIcon, typeof i6.ClrCommonFormsModule], [typeof i6.ClrCommonFormsModule, typeof ClrPassword, typeof ClrPasswordContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrPasswordModule>;
}

declare class ClrRadioWrapper implements OnInit {
    label: ClrControlLabel$1;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRadioWrapper, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrRadioWrapper, "clr-radio-wrapper", never, {}, {}, ["label"], ["[clrRadio]", "label"], false, never>;
}

declare class ClrRadio extends WrappedFormControl$1<ClrRadioWrapper> {
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRadio, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrRadio, "[clrRadio]", never, {}, {}, never, never, false, never>;
}

declare class ClrRadioContainer extends ClrAbstractContainer$1 implements AfterContentInit {
    protected layoutService: LayoutService$1;
    protected controlClassService: ControlClassService$1;
    protected ngControlService: NgControlService$1;
    role: string;
    ariaLabelledBy: string;
    radios: QueryList<ClrRadio>;
    groupLabel: ElementRef<HTMLElement>;
    private inline;
    private _generatedId;
    constructor(layoutService: LayoutService$1, controlClassService: ControlClassService$1, ngControlService: NgControlService$1);
    get clrInline(): boolean | string;
    set clrInline(value: boolean | string);
    ngAfterContentInit(): void;
    private setAriaRoles;
    private setAriaLabelledBy;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRadioContainer, [{ optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrRadioContainer, "clr-radio-container", never, { "clrInline": { "alias": "clrInline"; "required": false; }; }, {}, ["groupLabel", "radios"], ["label", "clr-radio-wrapper", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrRadioModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRadioModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrRadioModule, [typeof ClrRadio, typeof ClrRadioContainer, typeof ClrRadioWrapper], [typeof i3.CommonModule, typeof i6.ClrCommonFormsModule, typeof i11.ClrHostWrappingModule, typeof i5.ClrIcon], [typeof i6.ClrCommonFormsModule, typeof ClrRadio, typeof ClrRadioContainer, typeof ClrRadioWrapper]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrRadioModule>;
}

declare class ClrSelectContainer extends ClrAbstractContainer$1 {
    protected layoutService: LayoutService$1;
    protected controlClassService: ControlClassService$1;
    protected ngControlService: NgControlService$1;
    multiple: SelectMultipleControlValueAccessor;
    constructor(layoutService: LayoutService$1, controlClassService: ControlClassService$1, ngControlService: NgControlService$1);
    private get multi();
    wrapperClass(): "clr-multiselect-wrapper" | "clr-select-wrapper";
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSelectContainer, [{ optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSelectContainer, "clr-select-container", never, {}, {}, ["multiple"], ["label", "[clrSelect]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrSelect extends WrappedFormControl$1<ClrSelectContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLSelectElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSelect, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrSelect, "[clrSelect]", never, {}, {}, never, never, false, never>;
}

declare class ClrSelectModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSelectModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrSelectModule, [typeof ClrSelect, typeof ClrSelectContainer], [typeof i3.CommonModule, typeof i4.FormsModule, typeof i5.ClrIcon, typeof i6.ClrCommonFormsModule], [typeof i6.ClrCommonFormsModule, typeof ClrSelect, typeof ClrSelectContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrSelectModule>;
}

declare class ClrTextareaContainer extends ClrAbstractContainer$1 {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTextareaContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTextareaContainer, "clr-textarea-container", never, {}, {}, never, ["label", "[clrTextarea]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrTextarea extends WrappedFormControl$1<ClrTextareaContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLTextAreaElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTextarea, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrTextarea, "[clrTextarea]", never, {}, {}, never, never, false, never>;
}

declare class ClrTextareaModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTextareaModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTextareaModule, [typeof ClrTextarea, typeof ClrTextareaContainer], [typeof i3.CommonModule, typeof i4.FormsModule, typeof i5.ClrIcon, typeof i6.ClrCommonFormsModule], [typeof i6.ClrCommonFormsModule, typeof ClrTextarea, typeof ClrTextareaContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTextareaModule>;
}

declare class ClrRangeContainer extends ClrAbstractContainer$1 {
    private renderer;
    private idService;
    private _hasProgress;
    private lastRangeProgressFillWidth;
    constructor(layoutService: LayoutService$1, controlClassService: ControlClassService$1, ngControlService: NgControlService$1, renderer: Renderer2, idService: ControlIdService$1);
    get hasProgress(): boolean;
    set hasProgress(val: boolean);
    getRangeProgressFillWidth(): string;
    private selectRangeElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRangeContainer, [{ optional: true; }, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrRangeContainer, "clr-range-container", never, { "hasProgress": { "alias": "clrRangeHasProgress"; "required": false; }; }, {}, never, ["label", "[clrRange]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrRange extends WrappedFormControl$1<ClrRangeContainer> {
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRange, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrRange, "[clrRange]", never, {}, {}, never, never, false, never>;
}

declare class ClrRangeModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRangeModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrRangeModule, [typeof ClrRange, typeof ClrRangeContainer], [typeof i3.CommonModule, typeof i6.ClrCommonFormsModule, typeof i11.ClrHostWrappingModule, typeof i5.ClrIcon], [typeof i6.ClrCommonFormsModule, typeof ClrRange, typeof ClrRangeContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrRangeModule>;
}

declare class ClrFormsModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFormsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrFormsModule, never, [typeof i3.CommonModule], [typeof i6.ClrCommonFormsModule, typeof i3$1.ClrCheckboxModule, typeof i4$1.ClrComboboxModule, typeof i5$2.ClrDatepickerModule, typeof i6$1.ClrFileInputModule, typeof i5$1.ClrInputModule, typeof i8.ClrPasswordModule, typeof i9.ClrRadioModule, typeof i10.ClrSelectModule, typeof i11$1.ClrTextareaModule, typeof i12.ClrRangeModule, typeof i13.ClrDatalistModule, typeof i14$1.ClrNumberInputModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrFormsModule>;
}

export { AbstractIfState, CHANGE_KEYS, CLR_DATEPICKER_DIRECTIVES, CLR_FILE_MESSAGES_TEMPLATE_CONTEXT, ClrAbstractContainer, ClrCalendar, ClrCheckbox, ClrCheckboxContainer, ClrCheckboxModule, ClrCheckboxWrapper, ClrCombobox, ClrComboboxContainer, ClrComboboxModule, ClrCommonFormsModule, ClrControl, ClrControlContainer, ClrControlError, ClrControlHelper, ClrControlLabel, ClrControlSuccess, ClrDatalist, ClrDatalistContainer, ClrDatalistInput, ClrDatalistModule, ClrDateContainer, ClrDateInput, ClrDateInputBase, ClrDateInputValidator, ClrDatepickerActions, ClrDatepickerModule, ClrDatepickerViewManager, ClrDay, ClrDaypicker, ClrEndDateInput, ClrEndDateInputValidator, ClrFileError, ClrFileInfo, ClrFileInput, ClrFileInputContainer, ClrFileInputModule, ClrFileInputValidator, ClrFileInputValueAccessor, ClrFileList, ClrFileMessagesTemplate, ClrFileSuccess, ClrForm, ClrFormLayout, ClrFormsModule, ClrIfError, ClrIfSuccess, ClrInput, ClrInputContainer, ClrInputModule, ClrLayout, ClrMonthpicker, ClrNumberInput, ClrNumberInputContainer, ClrNumberInputModule, ClrOption, ClrOptionGroup, ClrOptionItems, ClrOptionSelected, ClrOptions, ClrPassword, ClrPasswordContainer, ClrPasswordModule, ClrRadio, ClrRadioContainer, ClrRadioModule, ClrRadioWrapper, ClrRange, ClrRangeContainer, ClrRangeModule, ClrSelect, ClrSelectContainer, ClrSelectModule, ClrStartDateInput, ClrStartDateInputValidator, ClrTextarea, ClrTextareaContainer, ClrTextareaModule, ClrYearpicker, ContainerIdService, ControlClassService, ControlIdService, DatalistIdService, FormsFocusService, IS_TOGGLE, IS_TOGGLE_PROVIDER, LayoutService, MarkControlService, NgControlService, TOGGLE_SERVICE, TOGGLE_SERVICE_PROVIDER, ToggleServiceFactory, WrappedFormControl, buildFileList, clearFiles, isToggleFactory, selectFiles };
export type { ClrFileAcceptError, ClrFileInputSelection, ClrFileListValidationErrors, ClrFileMaxFileSizeError, ClrFileMessagesTemplateContext, ClrFileMinFileSizeError, ClrSingleFileValidationErrors, Helpers };
