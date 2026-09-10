import * as i0 from '@angular/core';
import { OnDestroy, AfterViewInit, AfterContentInit, EventEmitter, ChangeDetectorRef, QueryList } from '@angular/core';
import * as i7 from '@angular/forms';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import * as i4 from '@clr/addons/var';
import { Step, StepInternal, ModelChange, WorkflowModelManager, RelevanceService, WorkflowModel } from '@clr/addons/var';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import * as i5 from '@clr/angular/stepper';
import { ClrStepButton, ClrStepper } from '@clr/angular/stepper';
import { ClrCommonStrings } from '@clr/angular/utils';
import { Observable } from 'rxjs';
import * as i2 from '@clr/addons/property-view';
import { PropertyViewModel } from '@clr/addons/property-view';
import * as i3 from '@clr/addons/a11y';
import * as i6 from '@angular/common';

/**
 * SummaryService provides methods to build data required to display Step summary using appfx-property-view.
 */
declare class SummaryService {
    /**
     * Builds {@link PropertyViewModel} for the Step passed using Step#description field.
     */
    getDescription(step: Step): PropertyViewModel | undefined;
    /**
     * Builds {@link PropertyViewModel} for the Step passed using Step#summary method.
     */
    getSummary(step: StepInternal): PropertyViewModel | undefined;
    private getPropertyViewModelFromMessage;
    private getPropertyViewModelFromPropertyViewSectionModel;
    private getPropertyViewSectionBuilder;
    private getPropertyViewCategoryBuilder;
    private getPropertyViewBuilder;
    static ɵfac: i0.ɵɵFactoryDeclaration<SummaryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SummaryService>;
}

/**
 * ClrStepper component has very limited API. It does not provide public information
 * about the expanded state of the step panels. Also it does not provide straight forward
 * API for notification when a panel get expanded.
 * This class is responsible for exposing the state of Clarity stepper component.
 * It monitors the current state of all panels. When a panel is expanded,
 * {@link onStepActivated$} observable emits.
 */
declare class StepperStateService {
    private summaryService;
    /**
     * Observable that emits when the user expands a ClrStepper panel.
     */
    onStepActivated$: Observable<StepState>;
    /**
     * Current state of all panels.
     */
    private panelState$;
    /**
     * Panel state on the previous user interaction.
     */
    private lastExpandedState;
    constructor(summaryService: SummaryService);
    /**
     * Must be invoked when {@link ClrAccordionPanel#panelOpenChange} EventEmitter emits.
     * `panelOpenChange` emits when a panel changes its opened state.
     * One would expect this listener to be invoked once per panel transition (current panel
     * is closed and the next is opened). Unfortunately this is not the case. The listener
     * is invoked every time for all panels on every transition and sometimes even multiple times
     * for one and the same panel just for a single transition.
     * The panels states are pushed to {@link panelState$} subject, that is debounced.
     *
     * @param step Step, rendered by the Clarity stepper
     * @param expanded Expanded state of the step
     * @param index Step index (different than the panel index, as some steps might be skipped)
     */
    stepActivated(step: Step, expanded: boolean, index: number): void;
    /**
     * Marks a step as valid or not depending on the passed state.
     * @param {Step} step Step, which has be marked as valid
     * @param {boolean} isValid The valid state of the step
     */
    markStepValid(step: Step, isValid: boolean): void;
    /**
     * Reset the valid states of the next steps
     * @param {Step} step Step after which all next steps to be reset
     */
    resetNextStepsValidStates(step: Step): void;
    /**
     * Finds the index of the first step in the list which is not skipped and not-valid/incomplete.
     * This method always considers the last not skipped step in the stepper as incomplete.
     * @returns {number} The index of the first incomplete step or the index of the last step if all are completed.
     */
    getIndexOfFirstIncompleteStep(): number;
    /**
     * Finds the index of the first visible step container which is not-valid/incomplete.
     * This method always considers the last visible step in the stepper as incomplete.
     *
     * Note that since skipped steps are not rendered there are no step containers for those.
     * E.g if we have the following steps:
     * 0 - step 1, valid
     * 1 - step 2, valid & skipped,
     * 2 - step 3, invalid
     * The method will return 1 because step 2 will not be rendered at all and we will have only
     * two step containers.
     *
     * @returns {number} The index of the first incomplete step container or the index of the
     * last one if all are completed.
     */
    getFirstIncompleteStepContainerIndex(): number;
    /**
     * Checks if all steps are in completed state.
     * @returns {boolean} True if all steps are completed, False otherwise.
     */
    areAllStepsCompleted(): boolean;
    /**
     * Method to find out if the step at a given index is expanded or not.
     * List of step states are retrieved and based on the index; 'expanded'
     * property lets us know if the step is currently open or not.
     * @param {number} index of the step
     * @returns {boolean}
     */
    isStepActivated(index: number): boolean;
    /**
     * Determines if a step at a specific index is the first visible step in the provided list.
     * @param index The index to check.
     * @param steps The list of internal steps to evaluate for skipped status.
     * @returns True if the index is the first non-skipped step, false otherwise.
     */
    isFirstVisibleStep(index: number, steps: StepInternal[]): boolean;
    private initOnStepActivated$;
    static ɵfac: i0.ɵɵFactoryDeclaration<StepperStateService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StepperStateService>;
}
interface StepState {
    step: Step;
    expanded: boolean;
    index: number;
    valid?: boolean;
}

/**
 * Component used to render the composition of step components as inline wizard
 * (using Clarity stepper component). Workflow of the steps is handled by the
 * {@link WorkflowModelManager} - the same responsible for the {@link AppfxWizardComponent} workflow.
 * This guarantees the same API and UX for the inline and dialog wizards.
 */
declare class StepperComponent implements OnDestroy, AfterViewInit, AfterContentInit {
    #private;
    readonly stateService: StepperStateService;
    readonly workflowStrings: WorkflowStrings;
    private readonly modelMgr;
    private readonly relevanceService;
    private readonly formBuilder;
    private readonly cdr;
    private readonly summaryService;
    /**
     * Display loading indicator.
     */
    loading: boolean;
    /**
     * If set to true, the Next button will use the primary (solid) button style.
     * Defaults to false to maintain backward compatibility for existing consumers.
     */
    usePrimaryNextButton: boolean;
    /**
     * If set to true, a "Back" button is displayed in every step except the first visible one.
     * This allows users to navigate to the previous non-skipped step.
     */
    showBackButton: boolean;
    /**
     * If set to true, a "Cancel" button is displayed in all steps.
     * This allows users to terminate the workflow before completion.
     */
    showCancelButton: boolean;
    /**
     * Dispatches when any of the workflow state's variables changes.
     */
    readonly onModelChange: EventEmitter<ModelChange[]>;
    /**
     * Dispatched when the workflow is finished via the Finish button.
     * You can perform the actions you want there (i.e modify or create something)
     */
    readonly onFinish: EventEmitter<void>;
    /**
     * Dispatched when the user clicks the "Cancel" button.
     * Use this to handle navigation away from the stepper or closing the containing view.
     */
    readonly onCancel: EventEmitter<void>;
    form: UntypedFormGroup;
    initialStep: string;
    stepPanelOverriddenStrings: Partial<ClrCommonStrings>;
    private pagesContainers;
    private stepperPanels;
    private activeStep;
    private activePage;
    private awaitingWizardPageOnLoad$;
    private componentAfterViewInit$;
    private readonly subscriptions;
    private retrySubscription;
    private stepperService;
    private errorActivatingStep;
    constructor(stateService: StepperStateService, workflowStrings: WorkflowStrings, modelMgr: WorkflowModelManager, relevanceService: RelevanceService, formBuilder: UntypedFormBuilder, cdr: ChangeDetectorRef, summaryService: SummaryService);
    /**
     * The descriptions of the pages that are visualized.
     */
    get steps(): Step[];
    set steps(value: Step[]);
    get stepsInternal(): StepInternal[];
    /**
     * You can supply here any structure you like. As long as it has the
     * needed properties to inject to the page models and eject back from
     * the page models.
     */
    get wizardModel(): WorkflowModel;
    set wizardModel(value: WorkflowModel);
    set clrStepButtons(clrStepButtons: QueryList<ClrStepButton>);
    set stepper(value: ClrStepper);
    get isLoading(): boolean;
    get pageProgressDetails(): string;
    get showProgressCancelButton(): boolean;
    get cancelValidationButtonLabel(): string;
    cancelPageValidation(): void;
    isNextButtonDisabled(step: Step): boolean;
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
    ngAfterContentInit(): void;
    onStepActivated(step: Step): void;
    /**
     * Wrapper function which to wrap the handler of the "Next/Finish" button of every step and
     * to add additional validation and data extraction logic.
     */
    onClrStepButtonClickedWrapperFn(callbackFn: () => void): () => void;
    /**
     * Handler invoked when the form is submitted. This happens when
     * all steps are in completed state.
     */
    onFormSubmit(): void;
    /**
     * Checks if the given step index corresponds to the first visible (non-skipped) step in the workflow.
     * Used to conditionally hide the Back button on the initial page.
     * @param stepIndex The index of the step in the stepsInternal array.
     */
    protected isFirstVisibleStep(stepIndex: number): boolean;
    /**
     * When user clicks on already completed steps, Stepper should call validate method of current step before navigation.
     * Patches stepperService.togglePanel method which calls this.commitActiveStep before calling the original togglePanel method.
     */
    private patchStepperService;
    private commitActiveStep;
    private activatePendingContainer;
    private retryStepTransition;
    private invalidateNextSteps;
    /**
     * Marks steps that come before the provided source index as complete, internally
     * in the Clarity panel component.
     * It will mark all panels as closed, except the one that is being expanded,
     * passed in as the target index.
     *
     * DOM order of steps is assumed with regard to indices.
     *
     * @param sourceIndex indices that come before this will be marked as complete.
     * @param openPanelIndex index of the panel set to be opened.
     */
    private completePreviousSteps;
    private unsubscribeRetry;
    /**
     * ClrStepper requires a child FormGroup for every step. This method creates one dummy
     * FormGroup for every step. In future these form groups must be used to indicate
     * the error state of each step.
     */
    private initForm;
    /**
     * In Clarity 4.x the implementation was:
     * <code>
     *     <clr-stepper-panel (clrAccordionPanelOpenChange)="stateService.stepActivated(step, $event, i)"
     * </code>
     * In Clarity 5.x "clrAccordionPanelOpenChange" was regressed:
     * https://github.com/vmware/clarity/issues/5957
     * This is temporary fix until the above issue gets fixed.
     *
     * In future this logic can be changed. Instead of listening for all panels states
     * (that triggers too many times), we can use combination of:
     * - StepperService.activeStep (invoked on Next) AND
     * - StepperService.togglePanel (invoked on previous panel click)
     */
    private subscribeForPanelChanges;
    private getFormGroupNameForStep;
    static ɵfac: i0.ɵɵFactoryDeclaration<StepperComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<StepperComponent, "appfx-stepper", never, { "loading": { "alias": "loading"; "required": false; }; "usePrimaryNextButton": { "alias": "usePrimaryNextButton"; "required": false; }; "showBackButton": { "alias": "showBackButton"; "required": false; }; "showCancelButton": { "alias": "showCancelButton"; "required": false; }; "steps": { "alias": "steps"; "required": false; }; "wizardModel": { "alias": "wizardModel"; "required": false; }; }, { "onModelChange": "onModelChange"; "onFinish": "onFinish"; "onCancel": "onCancel"; }, never, never, false, never>;
}

declare class AppfxStepperModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxStepperModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AppfxStepperModule, [typeof StepperComponent], [typeof i2.AppfxPropertyViewModule, typeof i3.AppfxA11yModule, typeof i4.AppfxWorkflowCoreModule, typeof i5.ClrStepperModule, typeof i6.CommonModule, typeof i7.FormsModule, typeof i7.ReactiveFormsModule], [typeof StepperComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AppfxStepperModule>;
}

export { AppfxStepperModule, StepperComponent as Stepper, StepperComponent, StepperStateService, SummaryService };
export type { StepState };
