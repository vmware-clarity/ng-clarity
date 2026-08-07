import * as i0 from '@angular/core';
import { AfterContentInit, AfterViewInit, ElementRef, TemplateRef, RendererFactory2, Renderer2, EventEmitter, QueryList, ViewContainerRef, Injector, ChangeDetectorRef, NgZone, OnInit, OnDestroy, DoCheck, IterableDiffers, TrackByFunction } from '@angular/core';
import * as rxjs from 'rxjs';
import { Observable } from 'rxjs';
import * as i9 from '@angular/forms';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import * as i12 from '@clr/angular/forms/common';
import { ClrAbstractContainer, LayoutService, ControlClassService, NgControlService, WrappedFormControl } from '@clr/angular/forms/common';
import * as i1 from '@clr/angular/popover/common';
import { ClrPopoverService, ClrPopoverPosition, ClrPopoverType } from '@clr/angular/popover/common';
import * as i11 from '@clr/angular/utils';
import { LoadingListener, ClrCommonStringsService, ClrLoadingState } from '@clr/angular/utils';
import * as i8 from '@angular/common';
import { NgForOfContext } from '@angular/common';
import * as i10 from '@clr/angular/icon';
import * as i14 from '@clr/angular/progress/spinner';

declare class ComboboxContainerService {
    labelOffset: number;
    labelText: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ComboboxContainerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ComboboxContainerService>;
}

declare class ClrComboboxContainer extends ClrAbstractContainer implements AfterContentInit, AfterViewInit {
    private containerService;
    el: ElementRef<HTMLElement>;
    controlContainer: ElementRef<HTMLElement>;
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, containerService: ComboboxContainerService, el: ElementRef<HTMLElement>);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrComboboxContainer, [{ optional: true; }, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrComboboxContainer, "clr-combobox-container", never, {}, {}, never, ["label", "clr-combobox", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

type ClrComboboxIdentityFunction<T> = (item: T) => any;
type ClrComboboxResolverFunction<T> = (input: string) => T;
declare abstract class ComboboxModel<T> {
    model: T | T[];
    displayField?: string;
    identityFn: ClrComboboxIdentityFunction<T>;
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
    showSelectAll: boolean;
    selectionModel: ComboboxModel<T>;
    inputChanged: Observable<string>;
    showAllOptions: boolean;
    private _currentInput;
    private _displayField;
    private _inputChanged;
    private _selectionChanged;
    private _selectAllRequested;
    constructor();
    get displayField(): string;
    set displayField(value: string);
    get currentInput(): string;
    set currentInput(input: string);
    get selectionChanged(): Observable<ComboboxModel<T>>;
    get multiselectable(): boolean;
    get identityFn(): ClrComboboxIdentityFunction<T>;
    set identityFn(value: ClrComboboxIdentityFunction<T>);
    get selectAllRequested(): Observable<void>;
    requestSelectAll(): void;
    editableResolver: ClrComboboxResolverFunction<T>;
    select(item: T): void;
    toggle(item: T): void;
    selectMany(items: T[]): void;
    unselectMany(items: T[]): void;
    unselect(item: T): void;
    /**
     * Checks whether all given items are currently selected, using identityFn for comparison.
     */
    containsAll(items: T[]): boolean;
    setSelectionValue(value: T | T[]): void;
    private _identityFn;
    private valuesEqualByIdentity;
    static ɵfac: i0.ɵɵFactoryDeclaration<OptionSelectionService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OptionSelectionService<any>>;
}

declare class SingleSelectComboboxModel<T> extends ComboboxModel<T> {
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
    focusOption(option: OptionData<T>): void;
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

declare class ClrCombobox<T> extends WrappedFormControl<ClrComboboxContainer> implements ControlValueAccessor, LoadingListener, AfterContentInit {
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
    private zone;
    private container;
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
    truncationButton: ElementRef;
    wrapper: ElementRef;
    calculationPills: QueryList<ElementRef<HTMLElement>>;
    focused: boolean;
    popoverPosition: ClrPopoverPosition;
    protected index: number;
    protected popoverType: ClrPopoverType;
    protected containerWidth: any;
    protected selectionExpanded: boolean;
    protected calculatedLimit: number | undefined;
    protected shouldCalculate: boolean;
    protected isTotalSelection: boolean;
    private resizeObserver;
    private containerWidthChange;
    private options;
    private _searchText;
    private onTouchedCallback;
    private onChangeCallback;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLElement>, optionSelectionService: OptionSelectionService<T>, commonStrings: ClrCommonStringsService, popoverService: ClrPopoverService, containerService: ComboboxContainerService, platformId: any, focusHandler: ComboboxFocusHandler<T>, cdr: ChangeDetectorRef, zone: NgZone, container: ClrComboboxContainer);
    get showSelectAll(): boolean;
    set showSelectAll(value: boolean);
    get editable(): boolean;
    set editable(value: boolean);
    set editableResolver(value: ClrComboboxResolverFunction<T> | undefined);
    set identityFn(value: ClrComboboxIdentityFunction<T>);
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
    get showAllText(): string;
    get allSelectedText(): string;
    get showIndividualPills(): boolean;
    get showTruncationToggle(): boolean;
    private get disabled();
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    clearSelection(): void;
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
    toggleSelectionExpand(): void;
    private initialiseObserver;
    private calculateLimit;
    private applyLimit;
    private updateTotalSelection;
    private initializeSubscriptions;
    private updateInputValue;
    private updateControlValue;
    private getDisplayNames;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCombobox<any>, [null, null, { optional: true; self: true; }, null, null, null, null, null, { optional: true; }, null, null, null, null, { optional: true; host: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCombobox<any>, "clr-combobox", never, { "placeholder": { "alias": "placeholder"; "required": false; }; "showSelectAll": { "alias": "showSelectAll"; "required": false; }; "editable": { "alias": "clrEditable"; "required": false; }; "editableResolver": { "alias": "clrEditableResolverFn"; "required": false; }; "identityFn": { "alias": "clrComboboxIdentityFn"; "required": false; }; "multiSelect": { "alias": "clrMulti"; "required": false; }; }, { "clrInputChange": "clrInputChange"; "clrOpenChange": "clrOpenChange"; "clrSelectionChange": "clrSelectionChange"; }, ["optionSelected", "options"], ["*"], false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
    static ngAcceptInputType_showSelectAll: unknown;
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

declare const SELECT_ALL_ID = "select-all-id";
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
    private _selectAllOption;
    constructor(optionSelectionService: OptionSelectionService<T>, id: number, el: ElementRef<HTMLElement>, commonStrings: ClrCommonStringsService, focusHandler: ComboboxFocusHandler<T>, popoverService: ClrPopoverService, parentHost: ElementRef<HTMLElement>, document: any);
    set selectAllBtn(value: ElementRef);
    get items(): QueryList<ClrOption<T>>;
    set items(items: QueryList<ClrOption<T>>);
    /**
     * Tests if the list of options is empty, meaning it doesn't contain any items
     */
    get emptyOptions(): boolean;
    get editable(): boolean;
    get noResultsElementId(): string;
    get showSelectAll(): boolean;
    get allVisibleSelected(): boolean;
    get isSelectAllFocused(): boolean;
    toggleSelectAll(event?: Event): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    searchText(input: string): string;
    loadingStateChange(state: ClrLoadingState): void;
    private updateFocusableItems;
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
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrComboboxModule, [typeof ClrCombobox, typeof ClrComboboxContainer, typeof ClrOptions, typeof ClrOption, typeof ClrOptionGroup, typeof ClrOptionSelected, typeof ClrOptionItems], [typeof i8.CommonModule, typeof i9.FormsModule, typeof i10.ClrIcon, typeof i11.ClrKeyFocusModule, typeof i12.ClrCommonFormsModule, typeof i11.ClrConditionalModule, typeof i1.ClrPopoverModuleNext, typeof i14.ClrSpinnerModule], [typeof i12.ClrCommonFormsModule, typeof ClrCombobox, typeof ClrComboboxContainer, typeof ClrOptions, typeof ClrOption, typeof ClrOptionGroup, typeof ClrOptionSelected, typeof i11.ClrConditionalModule, typeof ClrOptionItems]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrComboboxModule>;
}

export { ClrCombobox, ClrComboboxContainer, ClrComboboxModule, ClrOption, ClrOptionGroup, ClrOptionItems, ClrOptionSelected, ClrOptions, SELECT_ALL_ID };
export type { ClrComboboxIdentityFunction, ClrComboboxResolverFunction };
