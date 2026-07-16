import * as i0 from '@angular/core';
import { Type, OnInit, OnDestroy, EventEmitter, InjectionToken } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import * as i6 from '@clr/addons/property-view';
import { PropertyViewSectionBuilder, PropertyViewSectionModel, PropertyViewModel } from '@clr/addons/property-view';
import { ClrPopoverContent } from '@clr/angular/popover/common';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import * as i7 from '@clr/addons/a11y';
import * as i8 from '@clr/angular/emphasis/alert';
import * as i9 from '@clr/angular/icon';
import * as i10 from '@clr/angular/progress/spinner';
import * as i11 from '@clr/angular/data/stack-view';
import * as i12 from '@clr/angular/popover/signpost';
import * as i13 from '@angular/common';
import * as i14 from '@angular/forms';

declare class WorkflowConfigurationService {
    private readonly debugLocalStorageKey;
    private readonly localStorage;
    private debugValue;
    constructor();
    get debug(): boolean;
    set debug(newValue: boolean);
    private getData;
    private getLocalStorage;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkflowConfigurationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WorkflowConfigurationService>;
}

declare class StepValidationState {
    #private;
    constructor(errors?: string[], warnings?: string[], infos?: string[]);
    get errors(): string[];
    set errors(messages: string[]);
    get warnings(): string[];
    set warnings(messages: string[]);
    get infos(): string[];
    set infos(messages: string[]);
    isEmpty(): boolean;
    isValid(): boolean;
}

declare class ValidationBannerInternalComponent {
    #private;
    type: string;
    closable: boolean;
    closed: boolean;
    get items(): string[];
    set items(value: string[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<ValidationBannerInternalComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ValidationBannerInternalComponent, "appfx-validation-banner-internal", never, { "type": { "alias": "type"; "required": false; }; "closable": { "alias": "closable"; "required": false; }; "closed": { "alias": "closed"; "required": false; }; "items": { "alias": "items"; "required": false; }; }, {}, never, never, false, never>;
}
declare class ValidationBannerComponent {
    state?: StepValidationState;
    closable: boolean;
    get closed(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ValidationBannerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ValidationBannerComponent, "appfx-validation-banner", never, { "state": { "alias": "state"; "required": false; }; "closable": { "alias": "closable"; "required": false; }; }, {}, never, never, false, never>;
}

interface ActivationError {
    data: ErrorData;
}
interface ErrorData {
    message?: string;
    stackTrace?: string;
}

/**
 *  A basic wizard page model. Every page is expected to have a model derived
 *  from this one and expose it.
 */
interface StepModel {
    /**
     *  Indicating when the page is loading its data and when not. Set it to
     * 'true' when the page is in the process of loading its data and 'false'
     * when done with it.
     *
     * Used by the wizard framework to know when to show the loading indicator
     * and when not.
     *
     * If not provided - you won't be able to get loading indicator during your
     * data retrieval.
     */
    loading?: boolean;
    /**
     * Optional progress status text to be displayed below the loading spinner during
     * the data retrieval or the page validation.
     */
    progressStatus?: string;
    /**
     * Indicating whether the page validation can be canceled by the user.
     * If provided, the wizard framework will render a 'cancel' button below
     * the loading spinner
     */
    cancelableValidation?: CancelableStepValidation;
    /**
     * Used by the wizard framework to display errors/warnings/infos.
     */
    validationState?: StepValidationState;
    /**
     * Used by the wizard framework to disable the 'Next' button.
     * By default the 'Next' button is always enabled.
     * If this property is set to false, disable the Next button.
     */
    readyToComplete?: boolean;
}
/**
 * Interface representing cancelable step validation.
 */
interface CancelableStepValidation {
    /**
     * Label to be used for the cancel validation button.
     */
    cancelButtonLabel: string;
    /**
     * Handler function that will be invoked by the wizard framework
     * when the cancel validation button is clicked. The page component
     * should take care to cancel any ongoing validate API calls and
     * to emit false value by the current OnStepValidate.validate() observable.
     */
    cancelValidation: () => void;
}

/**
 * Type used for Wizard/Dialog/Stepper model.
 * This is defined to avoid developers from assigning primitive types.
 *
 * Note: This doesn't restrict from assigning function/array, since function/array is also treated as object.
 * We have a runtime check to validate that it is not a function/array.
 */
type WorkflowModel = object;

declare class ModelChange {
    propertyName: string;
    oldValue: any;
    newValue: any;
    constructor(propertyName: string, oldValue: any, newValue: any);
}
interface StepWithChanges {
    step?: StepInternal;
    changes: ModelChange[];
}
declare class WorkflowModelManager {
    #private;
    /**
     * Emit when {@link injectPropertiesToPendingStep} method completes.
     * Emitted value contains the pending step and calculated properties for it.
     */
    onStepChange$: Subject<StepWithChanges>;
    /**
     * Emit when one or more workflow properties are changed.
     */
    onModelChange$: Subject<ModelChange[]>;
    /**
     * Emit "true" before start of computed properties evaluation.
     * Emit "false" when computed properties are evaluated.
     */
    loading$: BehaviorSubject<boolean>;
    private stepModelBindings;
    private workflowModelSubs;
    private wizardModel;
    private wizardModelOldValues;
    private stepModelLastValuesIn;
    /**
     * Workflow steps.
     */
    set steps(value: StepInternal[]);
    /**
     * Workflow model.
     */
    get model(): WorkflowModel;
    set model(value: WorkflowModel);
    destroy(): void;
    /**
     * Ejects properties from provided step model to wizard model.
     */
    ejectPropertiesFromCurrentStep(currentStep: StepInternal | undefined): void;
    /**
     * Calculate the {@link ComputedVar} properties, if any.
     * Then inject properties to the provided step model.
     */
    injectPropertiesToPendingStep(pendingStep: StepInternal | undefined): Observable<InjectPropertiesResult>;
    private onStepsOrModelChange;
    private initStepModels;
    private initStepModel;
    private bindStepModelListeners;
    private bindStepModelListener;
    private unbindStepModelListeners;
    private unbindStepModelListener;
    private processWorkflowModel;
    private unbindWorkflowModelListeners;
    private updateWizardModel;
    private injectPropertiesToPendingStepInternal;
    private injectWizardPropertiesToStepModel;
    private wrapWorkflowPropertyInObservable;
    private wrapOptionalWorkflowPropertyInObservable;
    private wrapComputedWorkflowPropertyInObservable;
    private wrapSimpleWorkflowPropertyInObservable;
    private updateStepModel;
    private diffPropertyValues;
    /**
     * Return the input step model values, that were cached during the last invocation of
     * {@link ejectPropertiesFromCurrentStep} method.
     */
    private extractLastStepInputValues;
    /**
     * Return stringified values of {@link propNames} of the {@link model}.
     */
    private extractModelProperties;
    /**
     * Remove null elements from the "changes" array and emit on {@link onModelChange$}
     * if there are changes.
     */
    private emitModelChange;
    private cacheStepModelInputProps;
    private getInputMappings;
    private getOutputMappings;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkflowModelManager, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WorkflowModelManager>;
}
interface InjectPropertiesResult {
    pendingStep?: StepInternal;
    error?: ActivationError;
    stepModelChanges?: ModelChanges;
    recreateComponent?: boolean;
}

/**
 * Interface which has to be implemented by each component (controller) which will
 * serve as a page in the wizard
 *
 * @deprecated Use finer-grained interfaces like {@link StepModelHolder},
 *    {@link OnStepActivate}, {@link OnStepValidate}
 */
interface StepComponent extends StepModelHolder, OnStepActivate, OnStepValidate {
}
/**
 * Interface that should be implemented by step component that has a model.
 */
interface StepModelHolder {
    model: StepModel;
}
/**
 * Step life cycle hook invoked every time a page is activated.
 */
interface OnStepActivate {
    /**
     * Called every time when a page is visited by the user.
     * Use this to check whether the input parameters of the page
     * have changed and if so - you may need to re-initialize page with
     * new data matching the input parameters.
     *
     * @param {ModelChanges} stepModelChanges A hashtable of changes:
     * - key - the name of StepModel property, decorated with @In()
     * - value - {@link ModelChange} object that contains previous and current property values
     * When a step component is activated for the very first time, all properties decorated with @In will be present in the object.
     * In other cases e.g. when the user navigates back and forth through the steps,
     * only properties that have changed after previous activation, will be present.
     * If there are no changes, it will be empty object.
     */
    activate(stepModelChanges: ModelChanges): void;
}
/**
 * Step life cycle hook invoked every time is about to be deactivated (on Next or Finish).
 */
interface OnStepValidate {
    /**
     * Called when a Next(or Finish if the last page) button is clicked. Use this to
     * validate page data.
     */
    validate(): Observable<boolean>;
}
/**
 * A hashtable of changes:
 * - key - the name of StepModel property, decorated with @In()
 * - value - {@link ModelChange} object that contains previous and current property values
 */
interface ModelChanges {
    [propName: string]: ModelChange;
}

/**
 * Evaluation strategy.
 */
interface EvalStrategy<R> {
    withEagerEval: () => R;
    withLazyEval: () => R;
}
/**
 * Result of {@link Var.from} when invoked without parameters.
 */
interface From0DepReturnSchema extends ByFunctionWithoutArgs, EvalStrategy<ByFunctionWithoutArgs> {
}
interface ByFunctionWithoutArgs {
    /**
     * Create {@link Var} by applying a transition function.
     * @param fn Transition function.
     */
    by: <R>(fn: () => Observable<R>) => Var<R>;
}
interface From1DepReturnSchema<D1> extends SingleDepOperators<D1>, EvalStrategy<SingleDepOperators<D1>> {
}
/**
 * Result of {@link Var.from} when invoked with exactly one dependent var.
 *
 * D1 - the type of the Var passed to Var.from(dep: Var<D>) function.
 */
interface SingleDepOperators<D1> {
    /**
     * Create {@link Var} by applying a transition function on the specified dependent Var.
     * @param fn Transition function. It receives dependency {@link Var.value} as
     *    input parameter.
     */
    by: <R>(fn: (depValue: D1) => Observable<R>) => Var<R>;
    /**
     * Extract single property from another {@link Var.value} result.
     * There is a compile-time check for the specified property name.
     *
     * @example
     * const v3 = Var.of({ name: "dummy", value: true });
     *
     * const p1: Var<string> = Var.from(v3).pluck("name");
     * const p2: Var<boolean> = Var.from(v3).pluck("value");
     *
     * Var.from(v3).pluck("non_existing_property_name");     // compile time error
     */
    pluck: <K extends keyof D1>(propName: K) => Var<D1[K]>;
}
/**
 * Result of {@link Var.from} when invoked with two dependent vars:
 * <code>Var.from(dep1, dep2)</code>
 */
interface From2DepReturnSchema<D1, D2> extends ByFunctionWith2Types<D1, D2>, EvalStrategy<ByFunctionWith2Types<D1, D2>> {
}
interface ByFunctionWith2Types<D1, D2> {
    /**
     * Create {@link Var} by applying a transition function on the specified dependent vars.
     * @param fn Transition function. It receives dependency {@link Var.value} as
     *    input parameter.
     *
     * @example
     *    const dep1: Var<D1> = ...;
     *    const dep2: Var<D2> = ...;
     *    const newVar = Var.from(dep1, dep2).by(
     *       (v1: D1, v2: D2) => { ... }
     *    );
     */
    by: <R>(fn: (v1: D1, v2: D2) => Observable<R>) => Var<R>;
}
/**
 * Result of {@link Var.from} when invoked with three dependent vars:
 * <code>Var.from(dep1, dep2, dep3)</code>
 */
interface From3DepReturnSchema<D1, D2, D3> extends ByFunctionWith3Types<D1, D2, D3>, EvalStrategy<ByFunctionWith3Types<D1, D2, D3>> {
}
interface ByFunctionWith3Types<D1, D2, D3> {
    /**
     * Create {@link Var} by applying a transition function on the specified dependent vars.
     * @param fn Transition function. It receives dependency {@link Var.value} as
     *    input parameter.
     *
     * @example
     *    const dep1: Var<D1> = ...;
     *    const dep2: Var<D2> = ...;
     *    const dep3: Var<D3> = ...;
     *    const newVar = Var.from(dep1, dep2, dep3).by(
     *       (v1: D1, v2: D2, v3: D3) => { ... }
     *    );
     */
    by: <R>(fn: (v1: D1, v2: D2, v3: D3) => Observable<R>) => Var<R>;
}
interface From4DepReturnSchema<D1, D2, D3, D4> extends ByFunctionWith4Types<D1, D2, D3, D4>, EvalStrategy<ByFunctionWith4Types<D1, D2, D3, D4>> {
}
/**
 * Result of {@link Var.from} when invoked with four dependent vars:
 * <code>Var.from(dep1, dep2, dep3, dep4)</code>
 */
interface ByFunctionWith4Types<D1, D2, D3, D4> {
    /**
     * Create {@link Var} by applying a transition function on the specified dependent vars.
     * @param fn Transition function. It receives dependency {@link Var.value} as
     *    input parameter.
     *
     * @example
     *    const dep1: Var<D1> = ...;
     *    const dep2: Var<D2> = ...;
     *    const dep3: Var<D3> = ...;
     *    const dep4: Var<D4> = ...;
     *    const newVar = Var.from(dep1, dep2, dep3, dep4).by(
     *       (v1: D1, v2: D2, v3: D3, v4: D4) => { ... }
     *    );
     */
    by: <R>(fn: (v1: D1, v2: D2, v3: D3, v4: D4) => Observable<R>) => Var<R>;
}
interface From5DepReturnSchema<D1, D2, D3, D4, D5> extends ByFunctionWith5Types<D1, D2, D3, D4, D5>, EvalStrategy<ByFunctionWith5Types<D1, D2, D3, D4, D5>> {
}
/**
 * Result of {@link Var.from} when invoked with five dependent vars:
 * <code>Var.from(dep1, dep2, dep3, dep4, dep5)</code>
 */
interface ByFunctionWith5Types<D1, D2, D3, D4, D5> {
    /**
     * Create {@link Var} by applying a transition function on the specified dependent vars.
     * @param fn Transition function. It receives dependency {@link Var.value} as
     *    input parameter.
     *
     * @example
     *    const dep1: Var<D1> = ...;
     *    const dep2: Var<D2> = ...;
     *    const dep3: Var<D3> = ...;
     *    const dep4: Var<D4> = ...;
     *    const dep5: Var<D5> = ...;
     *    const newVar = Var.from(dep1, dep2, dep3, dep4, dep5).by(
     *       (v1: D1, v2: D2, v3: D3, v4: D4, v5: D5) => { ... }
     *    );
     */
    by: <R>(fn: (v1: D1, v2: D2, v3: D3, v4: D4, v5: D5) => Observable<R>) => Var<R>;
}
/**
 * Result of {@link Var.from} when invoked with more than five dependent vars:
 */
interface FromMultiDepReturnSchema {
    /**
     * Create {@link Var} by applying a transition function on the specified dependent vars.
     * @param fn Transition function. It receives dependency {@link Var.value|values} as
     *    input parameters.
     */
    by: <R>(fn: (...depValues: any[]) => Observable<R>) => Var<R>;
}

/**
 * Workflow variable used to define properties in the workflow model.
 *
 * <h2>Use Cases</h2>
 * This class is designed for the following use cases:
 * <ol>
 * <li>Create variable, that wraps generic data type. Use cases:
 *    <ul>
 *       <li>Pass a value as dependency to other workflow variables. When a new value is
 *           set, the dependent variable will be reevaluated.
 *       <li>[Future] Define mapping between workflow and step model variables.
 *       <li>[Future] Output step model values in a reactive manner.
 *    </ul>
 * @see {@link Var.of}
 *
 * <li>Create variable, that can depend on other {@link Var}s. Use cases:
 *    <ul>
 *       <li>Invoke async function to retrieve data.
 *       <li>Transform the result of another {@link Var}.
 *       <li>Extract a property of another {@link Var}.
 *       <li>[Future] Use the result of one {@link Var} as initial value of another.
 *    </ul>
 * @see {@link Var.from}
 * </ol>
 *
 * <h2>Using Var for Data Retrieval</h2>
 *
 * The main use case of this class is to move the data request outside of the step component.
 * This gives the following benefits:
 * - Component will not deal with asynchronous data; it will be pre-computed and injected
 * - Increased re-usability of steps
 * - Loading indicator comes for free.
 * - Default error handling
 * - Caching of calculated values and re-calculating when necessary
 *
 * <h2>Step Model Mapping</h2>
 *
 * <b>Step model property</b> can reference workflow {@link Var} property using
 * <code>@InputMapping</code> and <code>@OutputMapping</code> decorators.
 * Mapped step model property should be of type "T".
 *
 * <h2>Examples:</h2>
 *
 * @example Create new variable without initial value
 * const v1: Var<string> = Var.of();
 *
 *
 * @example Create new variable with initial value
 * const v2: Var<string> = Var.of("hello");
 *
 *
 * @example Data Retrieval
 * // "portGroupInfo" depends on "hostId"
 * this.model.portGroupInfo = Var.from(this.model.hostId).by(
 *    (hostId: string) => {
 *       // Note that "hostId" is "this.model.hostId.value", pre-calculated if it is ComputedVar.
 *       return <Observable<HostStandardSwitchData>>this.dataService.getData$(hostId, PG_INFO_PROP);
 *    }
 * );
 *
 *
 * @example Created computed property without any dependencies
 * const c1: Var<number> = Var.from().by(() => of(42));
 *
 *
 * @example Create computed property with dependencies
 * const c2: Var<string> = Var.from(c1, v2).by(
 *    (c1Val, c2Val) => of(`Result: ${c1Val} ${c2Val}`));
 *
 *
 * @example Transform another Var value
 * // Invoke transformation function on "c2" result.
 * const c3: Var<number> = Var.from(c2).by((c2Val: string) => of(c2Val.length + 3));
 *
 *
 * @example Extract single property from another var
 * const v3 = Var.of({ name: "dummy", value: true });
 *
 * const p1: Var<string> = Var.from(v3).pluck("name");
 * const p2: Var<boolean> = Var.from(v3).pluck("value");
 *
 * // There is a compile-time check for the specified property name.
 * Var.from(v3).pluck("non_existing_property_name");     // compile time error
 *
 *
 * @example Mapping step model property to workflow model Var
 * class MyWizardModel {
 *    readonly vlanIds: Var<number[]> = Var.of();
 * }
 *
 * // First step outputs selected vLANs
 * class Step1Model {
 *    @OutputMapping({propertyName="vlanIds"})
 *    vlanIds: number[];
 * }
 *
 * // Second step uses the selected vLANs form the first step
 * class Step2Model {
 *    @InputMapping({propertyName="vlanIds"})
 *    vlanIds: number[];
 * }
 */
declare abstract class Var<T> {
    #private;
    protected constructor();
    /**
     * Value of the variable. It can be undefined
     */
    get value(): T;
    set value(newValue: T);
    /**
     * Create a variable, that wraps generic data type.
     * @param initialValue Initial value of the {@link value} property.
     */
    static of<U>(initialValue?: U): Var<U>;
    /**
     * Create a variable by applying a transition function simultaneously on zero or more
     * {@link Var} results. Created Var maintains a dependency chain with the Vars, it is
     * built from. If any of the dependent variables is changed, the transition function
     * will be re-evaluated. The orchestration of when this happens is done in
     * WorkflowModelManager.
     */
    static from(): From0DepReturnSchema;
    static from<D1>(dep: Var<D1>): From1DepReturnSchema<D1>;
    static from<D1, D2>(dep1: Var<D1>, dep2: Var<D2>): From2DepReturnSchema<D1, D2>;
    static from<D1, D2, D3>(dep1: Var<D1>, dep2: Var<D2>, dep3: Var<D3>): From3DepReturnSchema<D1, D2, D3>;
    static from<D1, D2, D3, D4>(dep1: Var<D1>, dep2: Var<D2>, dep3: Var<D3>, dep4: Var<D4>): From4DepReturnSchema<D1, D2, D3, D4>;
    static from<D1, D2, D3, D4, D5>(dep1: Var<D1>, dep2: Var<D2>, dep3: Var<D3>, dep4: Var<D4>, dep5: Var<D5>): From5DepReturnSchema<D1, D2, D3, D4, D5>;
    static from(...deps: Var<any>[]): FromMultiDepReturnSchema;
    /**
     * Hook that is invoked when {@link value} setter is invoked. This is necessary, because
     * of TS issue with overriding property setters - setting the protected "this._value"
     * in a descendant class is breaking the {@link value} getter - it will always return
     * undefined. The TS issue is fixed in newer versions.
     */
    protected abstract onSetValue(newValue: T): void;
}

/**
 * Class to define property mappings between step model and wizard model.
 *
 * Note: If property name of both Step model and Wizard model is the same, no need to define this external mappings.
 * @template S any object that has @In/@Out decorators
 * @template W Wizard Model
 */
declare class Mappings<S, W> {
    private mappings;
    /**
     * step model property name to which wizard model {@link wizardModelPropertyName} to be mapped
     * @param stepModelPropertyName Step model property name to map
     */
    mapStepProp(stepModelPropertyName: keyof S): {
        /**
         * wizard model property name to which step model {@link stepModelPropertyName} to be mapped
         * @param wizardModelPropertyName Wizard model property name to map
         */
        to(wizardModelPropertyName: keyof W): Mappings<S, W>;
    };
    /**
     * Validates input and output mappings property names with the mappings defined by {@link mapStepProp} method.
     * @param model Step model
     */
    validate(model: any): void;
    /**
     * Returns property mappings defined.
     */
    getPropertyMappings(): PropertyMappings;
    private validateMappings;
}
/**
 * Interface which represents property Mappings
 */
interface PropertyMappings {
    /**
     * @param {string} propertyName Step model property name
     */
    [propertyName: string]: string;
}

/**
 * Describe a wizard step.
 */
interface Step {
    /**
     * Step title
     */
    title: string;
    /**
     * Step description.
     * In case of Wizard - the description is rendered as subtitle (below the step title)
     * In case of Stepper - the description is rendered on the right of the step title.
     */
    description?: string;
    /**
     * In case of Wizard - title of the Navigation link displayed on the left. If not provided, {@link title} is used.
     * In case of Stepper - this field is not used.
     */
    navTitle?: string;
    /**
     * Step component class to render.
     */
    componentClass: Type<any>;
    /**
     * StepModel is the data model of the step injected to {@link componentClass.model}. It contains step input and output properties.
     * Needed properties from wizard model can be injected or ejected by decorating the properties with @In or @Out respectively.
     * If property names doesn't match with Wizard Model, define the external property name mappings using {@link mappings}
     *
     * If {@link recreateOnModelChange} is defined, model should be factory method which return {@link StepModel} instance
     */
    model?: StepModel | StepModelFactory;
    /**
     * If set to true, the {@link componentClass} will be instantiated when the step gets
     * activated for the very first time.
     * If set to false, the {@link componentClass} will be instantiated immediately when
     * the wizard is opened.
     */
    instantiateLazy?: boolean;
    /**
     * Use this property to conditionally include a step in the workflow.
     * Use Var.of() API to define a boolean relevance property.
     * Use Var.from() API to define a relevance check function.
     *
     * @example set isRelevant for step1 using Var.from() which depends on wizard model var connectionType
     * const step1.isRelevant = Var.from(this.model.connectionType).by((connectionType) => of(connectionType === ConnectionType.VMKERNEL))
     * step1 will be visible only if connectionType === ConnectionType.VMKERNEL
     *
     */
    isRelevant?: Var<boolean>;
    /**
     * Property name mappings from step model to wizard model if property names are different.
     * use {@link Mappings}
     * @example new Mappings<StepModel, WizardModel>()
     *             .mapStepProp("stepProp1").to("wizardProp1")
     *             .mapStepProp("stepProp2").to("wizardProp2")
     *             ...
     *             ...
     */
    mappings?: Mappings<any, any>;
    /**
     * Function that is invoked after the step is successfully validated.
     * In case of Wizard - the result will be displayed in "Ready to Complete" page.
     * In case of Stepper - this result will be displayed on the right of the step
     * title (after the user navigates to the next step).
     * @returns {PropertyViewSectionModel}
     */
    summary?: (builder: PropertyViewSectionBuilder, stepModel?: StepModel) => PropertyViewSectionModel;
    /**
     * Recreates the step component if the function returns true
     * If defined, {@link model} should be factory function.
     */
    recreateComponent?: (stepModelChanges?: ModelChanges) => boolean;
}
/**
 * Wizard Step description used internally
 */
interface StepInternal extends Step {
    /**
     * Indicates whether the step is hidden in the wizard
     */
    isSkipped?: boolean;
    /**
     * StepModel instance which will be created from {@link StepModelFactory} or equal to {@link model}.
     */
    modelInstance?: StepModel;
    /**
     * Internal description field that will be used to display the actual description.
     * This field will be set with the appropriate value that needs to be displayed in
     * the wizard component depending on the current state of the step.
     * This field will be set with a simple text when step is incomplete or,
     * a formatted summary value when complete.
     * Note: This is currenlty used only in Stepper.
     */
    initialDescription?: PropertyViewModel;
}
/**
 * Step model factory method which returns new StepModel object.
 */
type StepModelFactory = () => StepModel;

/**
 * Dynamically renders a step component specified by the step descriptor.
 */
declare class StepContainerComponent implements OnInit, OnDestroy {
    step: StepInternal;
    description?: string;
    onRetry: EventEmitter<StepInternal>;
    private componentContainer;
    private pageComponent?;
    private retrySubscription;
    get readyToComplete(): boolean;
    private get isValid();
    private get isPageStateValid();
    ngOnInit(): void;
    ngOnDestroy(): void;
    onActivate(error?: ActivationError, stepModelChanges?: ModelChanges, recreateComponent?: boolean, resetValidationState?: boolean): void;
    onCommit(): Observable<boolean>;
    private loadComponent;
    private loadErrorComponent;
    private unsubscribeRetry;
    private resetValidationState;
    static ɵfac: i0.ɵɵFactoryDeclaration<StepContainerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<StepContainerComponent, "appfx-step-container", never, { "step": { "alias": "step"; "required": false; }; "description": { "alias": "description"; "required": false; }; }, { "onRetry": "onRetry"; }, never, never, false, never>;
}

/**
 * Render given workflow model in a Clarity signpost.
 * Values, changed in the current step are marked in different color.
 * On next step, changed properties are reset.
 */
declare class WorkflowModelMonitorComponent implements OnInit, OnDestroy {
    modelMgr: WorkflowModelManager;
    isOpen: boolean;
    debugModel: NameValue[];
    private subscriptions;
    set popoverContent(popoverContent: ClrPopoverContent);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private bindModelChangeListeners;
    private bindStepChangeListeners;
    private updateDebugModel;
    private initDebugModel;
    private resetDebugModel;
    private getPropertyNameValue;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkflowModelMonitorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WorkflowModelMonitorComponent, "appfx-model-popup", never, { "modelMgr": { "alias": "modelMgr"; "required": false; }; }, {}, never, never, false, never>;
}
interface NameValue {
    name: string;
    value: string;
    computedVar: boolean;
    simpleVar: boolean;
    changed: boolean;
}

declare class ErrorComponent {
    workflowStrings: WorkflowStrings;
    error?: ActivationError;
    onRetry: EventEmitter<any>;
    constructor(workflowStrings: WorkflowStrings);
    retry(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ErrorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ErrorComponent, "appfx-error", never, { "error": { "alias": "error"; "required": false; }; }, { "onRetry": "onRetry"; }, never, never, false, never>;
}

declare class SpinnerComponent {
    /**
     * String that should be announced
     */
    message: string;
    /**
     * Politeness when announcing, This could be 'polite', 'assertive' or 'off'
     * @default 'assertive'
     */
    politeness: 'assertive' | 'polite' | 'off';
    /**
     * Modal content has its own container (the modal), so that overlay spinner is already within its scope.
     * Specify "false" for non-modal cases to contain the overlay spinner within desired scope and not whole page.
     * @default 'true'
     */
    isModal: boolean;
    /**
     * Optional message to be shown below the spinner. It can be used to
     * report progress details.
     */
    progressDetails: string;
    /**
     * Optional flag, when set to true an Action button will be rendered below the spinner and
     * the progress details text. For example, this can be used to render a "cancel" button
     * below the spinner.
     */
    showActionButton: boolean;
    /**
     * The label of the action button. Applicable only when showActionButton is set to True.
     */
    actionButtonLabel: string;
    /**
     * Emits when the action button is clicked.
     */
    actionClick: EventEmitter<void>;
    invokeAction(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SpinnerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SpinnerComponent, "appfx-spinner", never, { "message": { "alias": "message"; "required": false; }; "politeness": { "alias": "politeness"; "required": false; }; "isModal": { "alias": "isModal"; "required": false; }; "progressDetails": { "alias": "progressDetails"; "required": false; }; "showActionButton": { "alias": "showActionButton"; "required": false; }; "actionButtonLabel": { "alias": "actionButtonLabel"; "required": false; }; }, { "actionClick": "actionClick"; }, never, never, false, never>;
}

/**
 * This token is used to determine if the Wizard/Dialog is opened through ModalService.
 * If it is not injected (value is null), this means the the component is used directly,
 * without ModalService.
 * If the value is true, this means that the component is opened using
 * ModalService.openModalComponent API.
 * If the value is false, this means that the component is opened using
 * ModalService.openModal API (which is not correct).
 */
declare const modalServiceToken: InjectionToken<unknown>;
declare class AppfxWorkflowCoreModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxWorkflowCoreModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AppfxWorkflowCoreModule, [typeof ValidationBannerComponent, typeof ValidationBannerInternalComponent, typeof StepContainerComponent, typeof WorkflowModelMonitorComponent, typeof ErrorComponent, typeof SpinnerComponent], [typeof i6.AppfxPropertyViewModule, typeof i7.AppfxA11yModule, typeof i8.ClrAlertModule, typeof i9.ClrIcon, typeof i10.ClrSpinnerModule, typeof i11.ClrStackViewModule, typeof i12.ClrSignpostModule, typeof i13.CommonModule, typeof i14.FormsModule, typeof i14.ReactiveFormsModule], [typeof ValidationBannerComponent, typeof ValidationBannerInternalComponent, typeof StepContainerComponent, typeof WorkflowModelMonitorComponent, typeof ErrorComponent, typeof SpinnerComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AppfxWorkflowCoreModule>;
}

interface InDecoratorSchema {
    /**
     * If the property does not need to be always provided set optional to true
     */
    optional?: boolean;
}
/**
 * Decorates property with input mapping information
 * which is used for injecting property value from another object.
 */
declare function In(inputMapping?: InDecoratorSchema): (prototype: any, srcPropName: string) => void;

/**
 * Decorates property with output mapping information
 * which is used for ejecting/outputting property value into another object.
 */
declare function Out(): (prototype: any, srcPropName: string) => void;

/**
 * Close handler for Dialog and Wizard.
 */
interface CloseHandler {
    /**
     * Invoked when Dialog/Wizard is closed by clicking OK/Finish button
     * Dialog/Wizard will wait for the result of the Observable, then the dialog will be closed.
     */
    onSubmit: () => Observable<any>;
    /**
     * Invoked when Dialog/Wizard is closed by clicking Cancel button
     */
    onCancel?: () => Observable<any>;
}

declare class RelevanceService {
    #private;
    loading: boolean;
    private isRelevantSubs;
    private stepRelevanceChange$;
    /**
     * Workflow steps.
     */
    set steps(steps: Step[]);
    /**
     * Checks for relevance check to complete.
     */
    checkComplete$(): Observable<Step[]>;
    destroy(): void;
    /**
     * Emits step which relevance has been changed
     */
    onStepRelevanceChange$(): Observable<StepInternal>;
    private bindIsRelevantListeners;
    private unbindIsRelevantListeners;
    static ɵfac: i0.ɵɵFactoryDeclaration<RelevanceService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RelevanceService>;
}

/**
 * Options:
 * - `horizontal`: Default layout with horizontal alignment.
 * - `vertical`: Tabs aligned vertically, typically for sidebar navigation.
 * - `secondary`: Tabs styled horizontally as Clarity buttons for a secondary level of navigation.
 */
declare enum TabLayout {
    horizontal = "horizontal",
    vertical = "vertical",
    secondary = "horizontal-secondary"
}

/**
 * Interface that must be implemented by components passed via {@link WizardFooterConfig.componentClass}.
 * The wizard injects the current step, all steps, and the workflow model whenever the active step changes.
 */
interface WizardFooter {
    currentStep: Step;
    steps: Step[];
    workflowModel: WorkflowModel;
}
/**
 * Configuration for the optional wizard footer component.
 */
interface WizardFooterConfig {
    componentClass: Type<WizardFooter>;
}

declare const stringify: (value: any, propertyName?: string) => string | undefined;
declare const formatError: (error: any) => ActivationError;

export { AppfxWorkflowCoreModule, TabLayout as DialogLayout, ErrorComponent, In, Mappings, ModelChange, Out, RelevanceService, SpinnerComponent as Spinner, SpinnerComponent, StepContainerComponent as StepContainer, StepContainerComponent, StepValidationState, TabLayout, ValidationBannerComponent as ValidationBanner, ValidationBannerComponent, ValidationBannerInternalComponent as ValidationBannerInternal, ValidationBannerInternalComponent, Var, WorkflowConfigurationService, WorkflowModelManager, WorkflowModelMonitorComponent as WorkflowModelMonitor, WorkflowModelMonitorComponent, formatError, modalServiceToken, stringify };
export type { CancelableStepValidation, CloseHandler, InjectPropertiesResult, ModelChanges, OnStepActivate, OnStepValidate, Step, StepComponent, StepInternal, StepModel, StepModelFactory, StepModelHolder, WizardFooter, WizardFooterConfig, WorkflowModel };
