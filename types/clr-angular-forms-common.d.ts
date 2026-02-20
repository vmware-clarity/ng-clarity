import * as i0 from '@angular/core';
import { OnInit, OnDestroy, Renderer2, ElementRef, TemplateRef, ViewContainerRef, QueryList, DoCheck, Type, Injector, InjectionToken } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import * as i11 from '@angular/common';
import * as i12 from '@clr/angular/icon';

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
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrCommonFormsModule, [typeof ClrControlLabel, typeof ClrControlError, typeof ClrControlSuccess, typeof ClrControlHelper, typeof ClrIfError, typeof ClrIfSuccess, typeof ClrForm, typeof ClrLayout, typeof ClrControlContainer, typeof ClrControl], [typeof i11.CommonModule, typeof i12.ClrIcon], [typeof ClrControlLabel, typeof ClrControlError, typeof ClrControlSuccess, typeof ClrControlHelper, typeof ClrIfError, typeof ClrIfSuccess, typeof ClrForm, typeof ClrLayout, typeof ClrControlContainer, typeof ClrControl, typeof i12.ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrCommonFormsModule>;
}

declare class FormsFocusService {
    private _focused;
    get focusChange(): Observable<boolean>;
    set focused(state: boolean);
    static ɵfac: i0.ɵɵFactoryDeclaration<FormsFocusService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FormsFocusService>;
}

export { AbstractIfState, CHANGE_KEYS, ClrAbstractContainer, ClrCommonFormsModule, ClrControl, ClrControlContainer, ClrControlError, ClrControlHelper, ClrControlLabel, ClrControlSuccess, ClrForm, ClrFormLayout, ClrIfError, ClrIfSuccess, ClrLayout, ContainerIdService, ControlClassService, ControlIdService, FormsFocusService, LayoutService, MarkControlService, NgControlService, WrappedFormControl };
export type { Helpers };
