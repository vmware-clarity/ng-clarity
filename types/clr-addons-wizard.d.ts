import * as i4 from '@clr/addons/var';
import { StepModel, StepModelHolder, WorkflowModelManager, WorkflowConfigurationService, CloseHandler, WizardFooterConfig, ModelChange, StepValidationState, RelevanceService, Step, StepInternal, WorkflowModel } from '@clr/addons/var';
export { WizardFooter, WizardFooterConfig } from '@clr/addons/var';
import * as i0 from '@angular/core';
import { OnInit, OnDestroy, AfterViewInit, AfterContentInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as i3 from '@clr/addons/property-view';
import { PropertyViewModel } from '@clr/addons/property-view';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import * as i5 from '@clr/angular/wizard';
import * as i6 from '@clr/angular/icon';
import * as i7 from '@angular/common';
import * as i8 from '@angular/forms';

declare class SummaryModel implements StepModel {
    loading: boolean;
    data: PropertyViewModel;
}

/**
 * This is re-usable summary component that can be used as last step of the Wizard.
 * The data required by this component comes from the PropertyViewSectionModel returned by Step#summary
 */
declare class SummaryComponent implements StepModelHolder {
    model: SummaryModel;
    static ɵfac: i0.ɵɵFactoryDeclaration<SummaryComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SummaryComponent, "appfx-summary", never, {}, {}, never, never, false, never>;
}

/**
 * Component used to render the composition of wizard page components and apply the base
 * wizard workflow provided by the clarity wizard component.
 */
declare class WizardComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
    #private;
    private cdr;
    modelMgr: WorkflowModelManager;
    private relevanceService;
    configService: WorkflowConfigurationService;
    workflowStrings: WorkflowStrings;
    private zoomLevelService?;
    /**
     * The wizard title. It's mandatory.
     */
    title: string;
    loading: boolean;
    /**
     * Object containing callback methods that will be invoked when the Wizard is Finished or Cancelled.
     * onSubmit is invoked when the user clicks the Finish button.
     * onCancel is invoked when the user clicks Cancel or X (close) button.
     * You can perform the actions you want there (i.e. modify something).
     * Wizard will wait for the successful result and then will close.
     * If there is an error, it will be displayed in the wizard that will remain open.
     */
    closeHandler: CloseHandler;
    /**
     * Optional footer configuration. The component specified in {@link WizardFooterConfig.componentClass}
     * is rendered in the wizard footer before the action buttons.
     * The wizard injects the current step, all steps, and the {@link WorkflowModel} whenever the active step changes.
     */
    footer: WizardFooterConfig;
    /**
     * Clarity Wizard size - 'md', 'lg', 'xl' and 'full-screen'.
     * Default is 'lg'.
     */
    size: string;
    /**
     * Emits when {@link opened} input is changed.
     */
    openedChange: EventEmitter<boolean>;
    /**
     * Dispatches when any of the workflow state's variables changes.
     */
    onModelChange: EventEmitter<ModelChange[]>;
    /**
     * Dispatched when the wizard is finishing via the Finish button.
     * You can perform the actions you want there (i.e modify or create something)
     */
    onFinish: EventEmitter<void>;
    /**
     * Dispatched when the wizard is closed (in all three cases: via the close button
     * or the cancel button or the finish button)
     */
    onClose: EventEmitter<Reason>;
    footerComponentInputs: Record<string, unknown>;
    currentZoomLevel: ZoomLevel;
    ZoomLevel: typeof ZoomLevel;
    showNav: boolean;
    activeStepIndex: number;
    protected closeHandlerValidationState: StepValidationState;
    private wizard;
    private debugPopup;
    private pagesContainers;
    private activeStep;
    private activePage;
    private awaitingWizardPageOnLoad$;
    private componentAfterViewInit$;
    private subscriptions;
    private retrySubscription;
    private errorActivatingStep;
    private summaryStep;
    constructor(cdr: ChangeDetectorRef, modelMgr: WorkflowModelManager, relevanceService: RelevanceService, configService: WorkflowConfigurationService, workflowStrings: WorkflowStrings, zoomLevelService?: ZoomLevelService, 
    /**
     * openModalComponent = undefined - Wizard is used without ModalService
     * openModalComponent = true  - opened using ModalService.openModalComponent API
     * openModalComponent = false - opened using ModalService.openModal API
     */
    openModalComponent?: boolean);
    /**
     * The descriptions of the pages that are visualized.
     */
    get pages(): Step[];
    set pages(value: Step[]);
    get pagesInternal(): StepInternal[];
    /**
     * You can supply here any structure you like. As long as it has the
     * needed properties to inject to the page models and eject back from
     * the page models.
     *
     * If not specified, the pages will simply stay disconnected from each other,
     * so you would need other means of communication between them.
     */
    get wizardModel(): WorkflowModel;
    set wizardModel(value: WorkflowModel);
    /**
     * Open/close the wizard. Default value is `true`.
     * If the wizard is closed and then re-opened again, the wizard is reset.
     *
     * This input should not be set when the wizard is opened through the ModalService.
     * Its primary use case is when the wizard is used outside vSphere UI.
     */
    get opened(): boolean;
    set opened(value: boolean);
    get isLoading(): boolean;
    get pageProgressDetails(): string;
    get showProgressCancelButton(): boolean;
    get cancelValidationButtonLabel(): string;
    get isSignPostOpen(): boolean;
    get isNextButtonDisabled(): boolean;
    cancelPageValidation(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
    ngAfterContentInit(): void;
    onWizardPageActivated(page: StepInternal): void;
    onWizardCommit(): void;
    onWizardCancel(): void;
    onWizardBack(): void;
    openStepNavPanel(): void;
    private subscribeForFinishHandler;
    private subscribeForCloseHandler;
    private closeWizard;
    private appendSummaryPage;
    private commitActiveStep;
    private activatePendingContainer;
    private updateFooterComponent;
    private retryStepTransition;
    private invalidateNextSteps;
    private unsubscribeRetry;
    private patchWizardNavigationService;
    private setActiveStepIndex;
    /**
     * Reset the wizard. This means:
     * - recreate the page components
     * - reset page states (all pages are marked incomplete)
     * - first page is activated
     *
     * NOTE: Wizard and step models remain unchanged.
     */
    private reset;
    private recalculateSummaryPageSkipState;
    static ɵfac: i0.ɵɵFactoryDeclaration<WizardComponent, [null, null, null, null, null, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WizardComponent, "appfx-wizard", never, { "title": { "alias": "title"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "closeHandler": { "alias": "closeHandler"; "required": false; }; "footer": { "alias": "footer"; "required": false; }; "size": { "alias": "size"; "required": false; }; "pages": { "alias": "pages"; "required": false; }; "wizardModel": { "alias": "wizardModel"; "required": false; }; "opened": { "alias": "opened"; "required": false; }; }, { "openedChange": "openedChange"; "onModelChange": "onModelChange"; "onFinish": "onFinish"; "onClose": "onClose"; }, never, never, false, never>;
}
/**
 * Reason for Wizard close.
 */
declare const enum Reason {
    /**
     * Wizard closed by clicking finish button.
     */
    finish = "finish",
    /**
     * Wizard closed by clicking cancel button.
     */
    cancel = "cancel"
}
/**
 * Result of Wizard Action passed to ModalRef.afterFinish()
 */
interface WizardResult {
    /**
     * Reason for wizard close.
     * "finish" indicates wizard closed by clicking finish button.
     * "cancel" indicates wizard closed by clicking cancel button.
     */
    close: Reason;
}
/**
 * If this error is thrown from the closeHandler function, no error message will be displayed.
 * The wizard will remain open, and will be responsibility of the consumers to handle the error path.
 */
declare const preventDisplayingWizardError: Error;

declare class AppfxWizardModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxWizardModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AppfxWizardModule, [typeof SummaryComponent, typeof WizardComponent], [typeof i3.AppfxPropertyViewModule, typeof i4.AppfxWorkflowCoreModule, typeof i5.ClrWizardModule, typeof i6.ClrIcon, typeof i7.CommonModule, typeof i8.FormsModule, typeof i8.ReactiveFormsModule], [typeof WizardComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AppfxWizardModule>;
}

/**
 * Class that holds data about the steps in the wizard and the flows (combinations of pages).
 */
declare abstract class WorkflowService {
    private currentFlow;
    private stepsByFlowId;
    /**
     * Return the flow, selected by {@link switchToWorkflow}.
     */
    get flow(): Step[];
    /**
     * Define a workflow (sequence of steps).
     * When the first flow is added, it is selected as current.
     *
     * @param flowId Unique flow id.
     * @param steps  Steps to include in the flow.
     * @throws Error In case of duplicate flowId.
     */
    addWorkflow(flowId: string, steps: Step[]): void;
    /**
     * Switches the current workflow.
     *
     * @throws Error
     *    If flow with the given id does not exist.
     */
    switchToWorkflow(newFlowId: string): void;
}

export { AppfxWizardModule, Reason, SummaryComponent, SummaryModel, WizardComponent as Wizard, WizardComponent, WorkflowService, preventDisplayingWizardError };
export type { WizardResult };
