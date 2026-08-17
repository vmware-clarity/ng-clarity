import * as i9 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Injectable, EventEmitter, ViewChild, ViewChildren, Input, Output, Component, NgModule } from '@angular/core';
import * as i4 from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as i7 from '@clr/addons/a11y';
import { AppfxA11yModule } from '@clr/addons/a11y';
import * as i6 from '@clr/addons/property-view';
import { PropertyViewBuilder, AppfxPropertyViewModule } from '@clr/addons/property-view';
import * as i3 from '@clr/addons/var';
import { StepContainer, RelevanceService, WorkflowModelManager, AppfxWorkflowCoreModule } from '@clr/addons/var';
import * as i8 from '@clr/angular/stepper';
import { StepperPanelStatus, ClrStepper, ClrStepperPanel, ClrStepButton, ClrStepperModule } from '@clr/angular/stepper';
import { BehaviorSubject, ReplaySubject, Subject, Subscription, combineLatest, of } from 'rxjs';
import { debounceTime, map, filter, take, switchMap, tap, first } from 'rxjs/operators';
import * as i2 from '@clr/addons/workflow/strings';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * SummaryService provides methods to build data required to display Step summary using appfx-property-view.
 */
class SummaryService {
    /**
     * Builds {@link PropertyViewModel} for the Step passed using Step#description field.
     */
    getDescription(step) {
        if (step.description) {
            return this.getPropertyViewModelFromMessage(step.description);
        }
        return undefined;
    }
    /**
     * Builds {@link PropertyViewModel} for the Step passed using Step#summary method.
     */
    getSummary(step) {
        if (step.summary) {
            const stepSummary = step.summary(this.getPropertyViewSectionBuilder(), step.modelInstance);
            return this.getPropertyViewModelFromPropertyViewSectionModel(stepSummary);
        }
        return undefined;
    }
    getPropertyViewModelFromMessage(data) {
        const builder = this.getPropertyViewBuilder();
        const categoryBuilder = builder.generateAllCategory('');
        categoryBuilder.section('defaultSection').message(data).renderAsHtml(true);
        return builder.build();
    }
    getPropertyViewModelFromPropertyViewSectionModel(data) {
        const categoryBuilder = this.getPropertyViewCategoryBuilder();
        const category = categoryBuilder.build();
        category.content = [data];
        return {
            categories: [category],
        };
    }
    getPropertyViewSectionBuilder() {
        return this.getPropertyViewCategoryBuilder().section('defaultSection');
    }
    getPropertyViewCategoryBuilder() {
        return this.getPropertyViewBuilder().generateAllCategory('');
    }
    getPropertyViewBuilder() {
        return new PropertyViewBuilder();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SummaryService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SummaryService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SummaryService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * ClrStepper component has very limited API. It does not provide public information
 * about the expanded state of the step panels. Also it does not provide straight forward
 * API for notification when a panel get expanded.
 * This class is responsible for exposing the state of Clarity stepper component.
 * It monitors the current state of all panels. When a panel is expanded,
 * {@link onStepActivated$} observable emits.
 */
class StepperStateService {
    constructor(summaryService) {
        this.summaryService = summaryService;
        /**
         * Current state of all panels.
         */
        this.panelState$ = new BehaviorSubject([]);
        /**
         * Panel state on the previous user interaction.
         */
        this.lastExpandedState = [];
        this.onStepActivated$ = this.initOnStepActivated$();
    }
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
    stepActivated(step, expanded, index) {
        const expandedState = this.panelState$.value;
        if (expandedState[index] && expandedState[index].expanded === expanded) {
            // Current and previous expanded state is the same. Do nothing.
            return;
        }
        const isStepValid = expandedState[index] ? expandedState[index].valid : false;
        // console.log(`Step ${name} expanded: ${expanded} index: ${index}`);
        expandedState[index] = {
            step: step,
            expanded: expanded,
            index: index,
            valid: isStepValid,
        };
        this.panelState$.next(expandedState);
    }
    /**
     * Marks a step as valid or not depending on the passed state.
     * @param {Step} step Step, which has be marked as valid
     * @param {boolean} isValid The valid state of the step
     */
    markStepValid(step, isValid) {
        const stepState = this.panelState$.value.find((panelState) => panelState && panelState.step === step);
        if (stepState) {
            stepState.valid = isValid;
        }
    }
    /**
     * Reset the valid states of the next steps
     * @param {Step} step Step after which all next steps to be reset
     */
    resetNextStepsValidStates(step) {
        const stepStateIndex = this.panelState$.value.findIndex(currentStepState => currentStepState && currentStepState.step === step);
        this.panelState$.value.forEach(currentStepState => {
            if (currentStepState && currentStepState.index > stepStateIndex) {
                currentStepState.valid = false;
                currentStepState.step.initialDescription = this.summaryService.getDescription(currentStepState.step);
            }
        });
    }
    /**
     * Finds the index of the first step in the list which is not skipped and not-valid/incomplete.
     * This method always considers the last not skipped step in the stepper as incomplete.
     * @returns {number} The index of the first incomplete step or the index of the last step if all are completed.
     */
    getIndexOfFirstIncompleteStep() {
        const notValidStep = this.panelState$.value.find(stepState => stepState && !stepState.step.isSkipped && !stepState.valid);
        if (notValidStep) {
            return notValidStep.index;
        }
        else {
            // If all steps are valid then return the last valid step as incomplete.
            const validSteps = this.panelState$.value.filter(stepState => stepState && !stepState.step.isSkipped && stepState.valid);
            return validSteps.length ? validSteps[validSteps.length - 1].index : 0;
        }
    }
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
    getFirstIncompleteStepContainerIndex() {
        // filter out all skipped steps as they are not rendered.
        const visibleSteps = this.panelState$.value.filter(stepState => stepState && !stepState.step.isSkipped);
        const firstInvalidStepIndex = visibleSteps.findIndex(stepState => !stepState.valid);
        if (firstInvalidStepIndex >= 0) {
            return firstInvalidStepIndex;
        }
        return visibleSteps.length ? visibleSteps.length - 1 : 0;
    }
    /**
     * Checks if all steps are in completed state.
     * @returns {boolean} True if all steps are completed, False otherwise.
     */
    areAllStepsCompleted() {
        return this.panelState$.value.every(stepState => stepState && (stepState.step.isSkipped || stepState.valid));
    }
    /**
     * Method to find out if the step at a given index is expanded or not.
     * List of step states are retrieved and based on the index; 'expanded'
     * property lets us know if the step is currently open or not.
     * @param {number} index of the step
     * @returns {boolean}
     */
    isStepActivated(index) {
        const panelState = this.panelState$.value;
        if (panelState[index]) {
            return panelState[index].expanded;
        }
        else {
            return true;
        }
    }
    /**
     * Determines if a step at a specific index is the first visible step in the provided list.
     * @param index The index to check.
     * @param steps The list of internal steps to evaluate for skipped status.
     * @returns True if the index is the first non-skipped step, false otherwise.
     */
    isFirstVisibleStep(index, steps) {
        const firstVisible = steps.findIndex(s => !s.isSkipped);
        return index === firstVisible;
    }
    initOnStepActivated$() {
        return this.panelState$.pipe(debounceTime(50), map((currentState) => {
            // Find a step that is now expanded and was previously collapsed.
            const expandedStep = currentState.find((currExpanded, index) => 
            // current state is expanded
            currExpanded &&
                currExpanded.expanded &&
                // AND previous state was collapsed or it is a newly added panel
                (!this.lastExpandedState[index] || !this.lastExpandedState[index].expanded));
            this.lastExpandedState = currentState.concat();
            return expandedStep;
        }), filter((stepState) => !!stepState));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: StepperStateService, deps: [{ token: SummaryService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: StepperStateService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: StepperStateService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: SummaryService }] });

/**
 * Component used to render the composition of step components as inline wizard
 * (using Clarity stepper component). Workflow of the steps is handled by the
 * {@link WorkflowModelManager} - the same responsible for the {@link AppfxWizardComponent} workflow.
 * This guarantees the same API and UX for the inline and dialog wizards.
 */
class StepperComponent {
    #steps;
    #wizardModel;
    constructor(stateService, workflowStrings, modelMgr, relevanceService, formBuilder, cdr, summaryService) {
        this.stateService = stateService;
        this.workflowStrings = workflowStrings;
        this.modelMgr = modelMgr;
        this.relevanceService = relevanceService;
        this.formBuilder = formBuilder;
        this.cdr = cdr;
        this.summaryService = summaryService;
        /**
         * Display loading indicator.
         */
        this.loading = false;
        /**
         * If set to true, the Next button will use the primary (solid) button style.
         * Defaults to false to maintain backward compatibility for existing consumers.
         */
        this.usePrimaryNextButton = false;
        /**
         * If set to true, a "Back" button is displayed in every step except the first visible one.
         * This allows users to navigate to the previous non-skipped step.
         */
        this.showBackButton = false;
        /**
         * If set to true, a "Cancel" button is displayed in all steps.
         * This allows users to terminate the workflow before completion.
         */
        this.showCancelButton = false;
        /**
         * Dispatches when any of the workflow state's variables changes.
         */
        this.onModelChange = new EventEmitter();
        /**
         * Dispatched when the workflow is finished via the Finish button.
         * You can perform the actions you want there (i.e modify or create something)
         */
        this.onFinish = new EventEmitter();
        /**
         * Dispatched when the user clicks the "Cancel" button.
         * Use this to handle navigation away from the stepper or closing the containing view.
         */
        this.onCancel = new EventEmitter();
        this.awaitingWizardPageOnLoad$ = new ReplaySubject(Infinity);
        this.componentAfterViewInit$ = new Subject();
        this.subscriptions = new Subscription();
        this.errorActivatingStep = false;
        this.form = formBuilder.group({});
        this.subscriptions.add(modelMgr.onModelChange$.subscribe((changes) => {
            this.onModelChange.emit(changes);
            this.invalidateNextSteps();
        }));
        this.subscriptions.add(modelMgr.loading$.subscribe(loading => (this.loading = loading)));
        this.subscriptions.add(stateService.onStepActivated$.subscribe((stepState) => {
            // When navigated back to a previous step and user clicks next without doing any changes
            // all future steps are invalidated and their completion step is reset.
            // To workaround this and to preserve the state of the future steps as completed when there are no changes
            // the Stepper#completePreviousSteps function is invoked, which marks all previous steps as complete.
            // It has to be invoked with the index of the step which is right after
            // the last step known as complete in the list as this method marks all previous steps as completed, along
            // with the index of the step that is currently being expanded, so as not to be marked as closed (open=false).
            // After this the initialStep value has to be set to name of the step currently being activated to open it
            // in the stepper.
            // e.g. if step 6 is the first incomplete step in the list meaning the previous steps are all completed and
            // it is navigated back to step 2, after clicking next when step 3 is being activated
            // invoking Stepper#completePreviousSteps with the index of step 6 as the source and index of step 3 as the target,
            // it will mark all steps up to and including 5 as completed. After this the initialStep value has to be set
            // to the form group name of step 3 to open it in the stepper.
            // Caveat: when all steps are completed and it is navigated back, stateService#getIndexOfFirstIncompleteStep
            // returns the index of the last not skipped step in the stepper as if it returns 0 the valid states
            // of the steps that come after the current step will be lost and there is no public method in the stepper API
            // which to mark all steps as complete.
            const indexOfFirstIncompleteStep = stateService.getIndexOfFirstIncompleteStep();
            if (stepState.index !== indexOfFirstIncompleteStep) {
                this.completePreviousSteps(indexOfFirstIncompleteStep, stepState.index);
            }
            this.initialStep = this.getFormGroupNameForStep(stepState.index);
            this.onStepActivated(stepState.step);
            // On step activation reset the dynamic description with step's description.
            stepState.step.initialDescription = summaryService.getDescription(stepState.step);
        }));
        this.stepPanelOverriddenStrings = {
            success: workflowStrings.step.completed,
            danger: workflowStrings.step.error,
        };
    }
    /**
     * The descriptions of the pages that are visualized.
     */
    get steps() {
        return this.#steps;
    }
    set steps(value) {
        this.relevanceService.steps = value;
        this.relevanceService
            .checkComplete$()
            .pipe(take(1))
            .subscribe((steps) => {
            this.#steps = steps;
            this.modelMgr.steps = steps;
            this.initForm(steps);
            this.#steps.forEach(step => (step.initialDescription = this.summaryService.getDescription(step)));
        });
    }
    get stepsInternal() {
        return this.#steps;
    }
    /**
     * You can supply here any structure you like. As long as it has the
     * needed properties to inject to the page models and eject back from
     * the page models.
     */
    get wizardModel() {
        return this.#wizardModel;
    }
    set wizardModel(value) {
        this.#wizardModel = value;
        this.modelMgr.model = value;
    }
    set clrStepButtons(clrStepButtons) {
        clrStepButtons.forEach((button) => {
            // Check if button's navigateToNextPanel has already been patched with the additional validation logic.
            if (!button['navigatePatched']) {
                const clrStepButtonNavigateToNextPanelFn = button.navigateToNextPanel.bind(button);
                button.navigateToNextPanel = this.onClrStepButtonClickedWrapperFn(clrStepButtonNavigateToNextPanelFn);
                button['navigatePatched'] = true;
            }
        });
    }
    set stepper(value) {
        this.stepperService = value['stepperService'];
        this.patchStepperService();
        this.subscribeForPanelChanges();
    }
    // Maps to Wizard.isLoading
    get isLoading() {
        return (this.loading || // explicitly set as busy
            this.relevanceService.loading || // check if relevanceCheck computation in progress
            // additionally inspect pages containers and see if any one is loading
            (!!this.pagesContainers &&
                this.pagesContainers.some((value) => !!value.step.modelInstance && !!value.step.modelInstance.loading)));
    }
    get pageProgressDetails() {
        return this.activePage?.step?.modelInstance?.progressStatus || '';
    }
    get showProgressCancelButton() {
        return typeof this.activePage?.step?.modelInstance?.cancelableValidation?.cancelValidation === 'function';
    }
    get cancelValidationButtonLabel() {
        return this.activePage?.step?.modelInstance?.cancelableValidation?.cancelButtonLabel || '';
    }
    cancelPageValidation() {
        if (typeof this.activePage?.step?.modelInstance?.cancelableValidation?.cancelValidation === 'function') {
            this.activePage?.step?.modelInstance?.cancelableValidation.cancelValidation();
        }
    }
    isNextButtonDisabled(step) {
        const activeContainer = this.pagesContainers && this.pagesContainers.find(item => item.step === step);
        return this.isLoading || this.errorActivatingStep || (activeContainer ? !activeContainer.readyToComplete : false);
    }
    ngOnDestroy() {
        this.#steps = [];
        this.activeStep = undefined;
        this.subscriptions.unsubscribe();
        this.unsubscribeRetry();
        this.modelMgr.destroy();
    }
    ngAfterViewInit() {
        if (this.pagesContainers.length) {
            // If relevance checks are fast enough (or there are no relevance checks), _pagesContainers will be initialized.
            this.componentAfterViewInit$.next();
        }
        else {
            // Relevance checks may take some time, wait for _pagesContainers to initialize
            this.pagesContainers.changes.pipe(take(1)).subscribe(() => this.componentAfterViewInit$.next());
        }
    }
    ngAfterContentInit() {
        // upon getting a wizard page onLoad signal and safely ensuring component has instantiated itself with `AppfxWizardPage`
        // elements in the template, only then activate the pending container
        this.subscriptions.add(combineLatest([this.componentAfterViewInit$, this.awaitingWizardPageOnLoad$])
            .pipe(filter(() => !!this.pagesContainers), switchMap(([, pendingStep]) => this.modelMgr.injectPropertiesToPendingStep(pendingStep)))
            .subscribe(result => {
            this.errorActivatingStep = !!result.error;
            this.activatePendingContainer(result);
        }));
    }
    // Maps to Wizard.onWizardPageActivated
    onStepActivated(step) {
        this.awaitingWizardPageOnLoad$.next(step);
    }
    /**
     * Wrapper function which to wrap the handler of the "Next/Finish" button of every step and
     * to add additional validation and data extraction logic.
     */
    onClrStepButtonClickedWrapperFn(callbackFn) {
        return () => {
            this.commitActiveStep()
                .pipe(take(1))
                .subscribe(() => {
                callbackFn();
            });
        };
    }
    /**
     * Handler invoked when the form is submitted. This happens when
     * all steps are in completed state.
     */
    onFormSubmit() {
        if (this.stateService.areAllStepsCompleted()) {
            this.onFinish.emit();
        }
    }
    /**
     * Checks if the given step index corresponds to the first visible (non-skipped) step in the workflow.
     * Used to conditionally hide the Back button on the initial page.
     * @param stepIndex The index of the step in the stepsInternal array.
     */
    isFirstVisibleStep(stepIndex) {
        return this.stateService.isFirstVisibleStep(stepIndex, this.stepsInternal);
    }
    /**
     * When user clicks on already completed steps, Stepper should call validate method of current step before navigation.
     * Patches stepperService.togglePanel method which calls this.commitActiveStep before calling the original togglePanel method.
     */
    patchStepperService() {
        const originalTogglePanelFunc = this.stepperService.togglePanel;
        if (!this.stepperService['togglePanelPatched']) {
            this.stepperService.togglePanel = (...args) => {
                const firstIncompleteContainerIndex = this.stateService.getFirstIncompleteStepContainerIndex();
                const activeContainerIndex = this.pagesContainers.toArray().findIndex(item => item === this.activePage);
                if (firstIncompleteContainerIndex === activeContainerIndex) {
                    // When moving from incomplete step to previous steps, do not call commit
                    originalTogglePanelFunc.apply(this.stepperService, args);
                }
                else {
                    this.commitActiveStep()
                        .pipe(take(1), filter(isValid => isValid))
                        .subscribe(() => {
                        originalTogglePanelFunc.apply(this.stepperService, args);
                    });
                }
            };
            this.stepperService['togglePanelPatched'] = true;
        }
    }
    commitActiveStep() {
        if (!this.activePage) {
            return of(false);
        }
        this.loading = true;
        return this.activePage.onCommit().pipe(tap(isValid => {
            const activeStep = this.activePage.step;
            // Mark the current step as valid/invalid.
            this.stateService.markStepValid(activeStep, isValid);
            // If not valid, mark the next steps as invalid too.
            if (!isValid) {
                this.stateService.resetNextStepsValidStates(activeStep);
            }
            else if (activeStep.summary) {
                // retrieve step summary on successful validation of step.
                activeStep.initialDescription = this.summaryService.getSummary(activeStep);
            }
            else {
                // no action
            }
            this.form.controls[this.initialStep].setErrors(isValid ? null : { formInvalid: true });
            this.form.controls[this.initialStep].markAsDirty();
        }), switchMap((isValid) => {
            if (isValid) {
                this.modelMgr.ejectPropertiesFromCurrentStep(this.activeStep);
                return this.relevanceService.checkComplete$().pipe(switchMap(() => of(isValid)));
            }
            return of(isValid);
        }), tap(() => {
            this.loading = false;
            this.cdr.detectChanges();
        }));
    }
    activatePendingContainer(result) {
        this.unsubscribeRetry();
        const pendingPage = this.pagesContainers.find((item) => item.step === result.pendingStep);
        if (pendingPage) {
            if (result.error) {
                this.retrySubscription = pendingPage.onRetry
                    .pipe(take(1))
                    .subscribe((step) => this.retryStepTransition(step));
            }
            else {
                this.activeStep = result.pendingStep;
                this.activePage = this.pagesContainers.find(item => item.step === this.activeStep);
            }
            // Finally activate the container
            pendingPage.onActivate(result.error, result.stepModelChanges, result.recreateComponent);
            // Force digest as activation trigger changes Clarity wizard. template conditionals must re-evaluate
            this.cdr.detectChanges();
        }
    }
    retryStepTransition(step) {
        this.onStepActivated(step);
    }
    invalidateNextSteps() {
        if (!this.activeStep) {
            return;
        }
        this.stateService.resetNextStepsValidStates(this.activeStep);
        this.stepperService.resetPanels();
        this.stepperService.overrideInitialPanel(this.initialStep);
    }
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
    completePreviousSteps(sourceIndex, openPanelIndex) {
        const clrStepperPanels = this.stepperPanels.toArray();
        const sourcePanelId = this.getFormGroupNameForStep(sourceIndex);
        for (let stepIndex = 0; stepIndex < clrStepperPanels.length; stepIndex++) {
            const stepperPanel = clrStepperPanels[stepIndex];
            if (stepperPanel.id === sourcePanelId) {
                break;
            }
            stepperPanel.panel.pipe(first()).subscribe(panel => {
                panel.disabled = false;
                panel.status = StepperPanelStatus.Complete;
                if (stepIndex !== openPanelIndex) {
                    panel.open = false;
                }
            });
        }
    }
    unsubscribeRetry() {
        if (this.retrySubscription && !this.retrySubscription.closed) {
            this.retrySubscription.unsubscribe();
        }
    }
    /**
     * ClrStepper requires a child FormGroup for every step. This method creates one dummy
     * FormGroup for every step. In future these form groups must be used to indicate
     * the error state of each step.
     */
    initForm(steps) {
        if (steps && steps.length) {
            const childFormGroups = {};
            steps.forEach((step, index) => {
                childFormGroups[this.getFormGroupNameForStep(index)] = this.formBuilder.group({});
            });
            this.form = this.formBuilder.group(childFormGroups);
            this.initialStep = this.getFormGroupNameForStep(0);
        }
    }
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
    subscribeForPanelChanges() {
        const panelsChanges = this.stepperService['_panelsChanges'];
        this.subscriptions.add(panelsChanges.subscribe((panels) => {
            panels.forEach((panelModel) => {
                const panelId = panelModel.id;
                const stepIndex = +panelId.replace('step', '');
                const step = this.#steps[stepIndex];
                this.stateService.stepActivated(step, panelModel.open, stepIndex);
            });
        }));
    }
    getFormGroupNameForStep(stepIndex) {
        return 'step' + stepIndex;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: StepperComponent, deps: [{ token: StepperStateService }, { token: i2.WorkflowStrings }, { token: i3.WorkflowModelManager }, { token: i3.RelevanceService }, { token: i4.UntypedFormBuilder }, { token: i0.ChangeDetectorRef }, { token: SummaryService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: StepperComponent, isStandalone: false, selector: "appfx-stepper", inputs: { loading: "loading", usePrimaryNextButton: "usePrimaryNextButton", showBackButton: "showBackButton", showCancelButton: "showCancelButton", steps: "steps", wizardModel: "wizardModel" }, outputs: { onModelChange: "onModelChange", onFinish: "onFinish", onCancel: "onCancel" }, providers: [RelevanceService, StepperStateService, SummaryService, WorkflowModelManager], viewQueries: [{ propertyName: "stepper", first: true, predicate: ClrStepper, descendants: true }, { propertyName: "pagesContainers", predicate: StepContainer, descendants: true }, { propertyName: "stepperPanels", predicate: ClrStepperPanel, descendants: true }, { propertyName: "clrStepButtons", predicate: ClrStepButton, descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<form\n  clrStepper\n  [formGroup]=\"form\"\n  (ngSubmit)=\"onFormSubmit()\"\n  [clrInitialStep]=\"initialStep\"\n  [ngClass]=\"{ 'disable-form': isLoading }\"\n>\n  <ng-container *ngFor=\"let step of stepsInternal; let i = index; let last = last\">\n    <clr-stepper-panel\n      *ngIf=\"!step.isSkipped\"\n      formGroupName=\"step{{ i }}\"\n      [appfxOverrideClrStrings]=\"stepPanelOverriddenStrings\"\n    >\n      <clr-step-title>{{ step.title }}</clr-step-title>\n      <clr-step-description>\n        <appfx-property-view\n          *ngIf=\"step.initialDescription\"\n          [data]=\"step.initialDescription\"\n          [attr.aria-label]=\"step.description\"\n        ></appfx-property-view>\n      </clr-step-description>\n\n      <clr-step-content>\n        <appfx-step-container [step]=\"step\"> </appfx-step-container>\n\n        <button\n          *ngIf=\"!last\"\n          [disabled]=\"isNextButtonDisabled(step)\"\n          clrStepButton=\"next\"\n          [ngClass]=\"{ 'btn-primary': usePrimaryNextButton }\"\n        >\n          {{ workflowStrings.next }}\n        </button>\n        <button *ngIf=\"last\" [disabled]=\"isNextButtonDisabled(step)\" clrStepButton=\"submit\">\n          {{ workflowStrings.finish }}\n        </button>\n        <button *ngIf=\"showBackButton && !isFirstVisibleStep(i)\" clrStepButton=\"previous\">\n          {{ workflowStrings.back }}\n        </button>\n        <button *ngIf=\"showCancelButton\" (click)=\"onCancel.emit()\" type=\"button\" class=\"clr-step-button btn btn-link\">\n          {{ workflowStrings.cancel }}\n        </button>\n      </clr-step-content>\n    </clr-stepper-panel>\n  </ng-container>\n</form>\n\n<appfx-spinner\n  *ngIf=\"isLoading\"\n  [message]=\"workflowStrings.loading\"\n  [progressDetails]=\"pageProgressDetails\"\n  [showActionButton]=\"showProgressCancelButton\"\n  [actionButtonLabel]=\"cancelValidationButtonLabel\"\n  (actionClick)=\"cancelPageValidation()\"\n>\n</appfx-spinner>\n", styles: [".disable-form{left:0;top:0;z-index:10;pointer-events:none;opacity:.5}form appfx-spinner{position:absolute;top:50%;left:50%;z-index:999}clr-step-description ::ng-deep appfx-property-view-category{padding:0}clr-step-description ::ng-deep td.pv-message-container{padding:0!important}clr-step-description ::ng-deep .pv-message-text{line-height:1.2rem}clr-step-description ::ng-deep .table td,clr-step-description ::ng-deep .table th{background:none}:host button[clrStepButton=previous]{border:1px solid var(--clr-btn-primary-outline-color)}\n"], dependencies: [{ kind: "component", type: i6.PropertyViewComponent, selector: "appfx-property-view", inputs: ["data", "config"] }, { kind: "directive", type: i7.OverrideClrStringsDirective, selector: "clr-stepper-panel [appfxOverrideClrStrings]", inputs: ["appfxOverrideClrStrings"] }, { kind: "component", type: i3.StepContainerComponent, selector: "appfx-step-container", inputs: ["step", "description"], outputs: ["onRetry"] }, { kind: "component", type: i3.SpinnerComponent, selector: "appfx-spinner", inputs: ["message", "politeness", "isModal", "progressDetails", "showActionButton", "actionButtonLabel"], outputs: ["actionClick"] }, { kind: "component", type: i8.ClrStepper, selector: "form[clrStepper]", inputs: ["clrInitialStep"] }, { kind: "directive", type: i8.ClrStepButton, selector: "[clrStepButton]", inputs: ["clrStepButton"] }, { kind: "component", type: i8.ClrStepTitle, selector: "clr-step-title" }, { kind: "component", type: i8.ClrStepDescription, selector: "clr-step-description" }, { kind: "component", type: i8.ClrStepContent, selector: "clr-step-content" }, { kind: "component", type: i8.ClrStepperPanel, selector: "clr-stepper-panel" }, { kind: "directive", type: i8.StepperOompaLoompa, selector: "clr-stepper-panel, [clrStepButton]" }, { kind: "directive", type: i8.StepperWillyWonka, selector: "form[clrStepper]" }, { kind: "directive", type: i9.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i9.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i9.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i4.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i4.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i4.FormGroupName, selector: "[formGroupName]", inputs: ["formGroupName"] }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: StepperComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-stepper', standalone: false, providers: [RelevanceService, StepperStateService, SummaryService, WorkflowModelManager], template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<form\n  clrStepper\n  [formGroup]=\"form\"\n  (ngSubmit)=\"onFormSubmit()\"\n  [clrInitialStep]=\"initialStep\"\n  [ngClass]=\"{ 'disable-form': isLoading }\"\n>\n  <ng-container *ngFor=\"let step of stepsInternal; let i = index; let last = last\">\n    <clr-stepper-panel\n      *ngIf=\"!step.isSkipped\"\n      formGroupName=\"step{{ i }}\"\n      [appfxOverrideClrStrings]=\"stepPanelOverriddenStrings\"\n    >\n      <clr-step-title>{{ step.title }}</clr-step-title>\n      <clr-step-description>\n        <appfx-property-view\n          *ngIf=\"step.initialDescription\"\n          [data]=\"step.initialDescription\"\n          [attr.aria-label]=\"step.description\"\n        ></appfx-property-view>\n      </clr-step-description>\n\n      <clr-step-content>\n        <appfx-step-container [step]=\"step\"> </appfx-step-container>\n\n        <button\n          *ngIf=\"!last\"\n          [disabled]=\"isNextButtonDisabled(step)\"\n          clrStepButton=\"next\"\n          [ngClass]=\"{ 'btn-primary': usePrimaryNextButton }\"\n        >\n          {{ workflowStrings.next }}\n        </button>\n        <button *ngIf=\"last\" [disabled]=\"isNextButtonDisabled(step)\" clrStepButton=\"submit\">\n          {{ workflowStrings.finish }}\n        </button>\n        <button *ngIf=\"showBackButton && !isFirstVisibleStep(i)\" clrStepButton=\"previous\">\n          {{ workflowStrings.back }}\n        </button>\n        <button *ngIf=\"showCancelButton\" (click)=\"onCancel.emit()\" type=\"button\" class=\"clr-step-button btn btn-link\">\n          {{ workflowStrings.cancel }}\n        </button>\n      </clr-step-content>\n    </clr-stepper-panel>\n  </ng-container>\n</form>\n\n<appfx-spinner\n  *ngIf=\"isLoading\"\n  [message]=\"workflowStrings.loading\"\n  [progressDetails]=\"pageProgressDetails\"\n  [showActionButton]=\"showProgressCancelButton\"\n  [actionButtonLabel]=\"cancelValidationButtonLabel\"\n  (actionClick)=\"cancelPageValidation()\"\n>\n</appfx-spinner>\n", styles: [".disable-form{left:0;top:0;z-index:10;pointer-events:none;opacity:.5}form appfx-spinner{position:absolute;top:50%;left:50%;z-index:999}clr-step-description ::ng-deep appfx-property-view-category{padding:0}clr-step-description ::ng-deep td.pv-message-container{padding:0!important}clr-step-description ::ng-deep .pv-message-text{line-height:1.2rem}clr-step-description ::ng-deep .table td,clr-step-description ::ng-deep .table th{background:none}:host button[clrStepButton=previous]{border:1px solid var(--clr-btn-primary-outline-color)}\n"] }]
        }], ctorParameters: () => [{ type: StepperStateService }, { type: i2.WorkflowStrings }, { type: i3.WorkflowModelManager }, { type: i3.RelevanceService }, { type: i4.UntypedFormBuilder }, { type: i0.ChangeDetectorRef }, { type: SummaryService }], propDecorators: { loading: [{
                type: Input
            }], usePrimaryNextButton: [{
                type: Input
            }], showBackButton: [{
                type: Input
            }], showCancelButton: [{
                type: Input
            }], onModelChange: [{
                type: Output
            }], onFinish: [{
                type: Output
            }], onCancel: [{
                type: Output
            }], pagesContainers: [{
                type: ViewChildren,
                args: [StepContainer]
            }], stepperPanels: [{
                type: ViewChildren,
                args: [ClrStepperPanel]
            }], steps: [{
                type: Input
            }], wizardModel: [{
                type: Input
            }], clrStepButtons: [{
                type: ViewChildren,
                args: [ClrStepButton]
            }], stepper: [{
                type: ViewChild,
                args: [ClrStepper, { static: false }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const clarityDependencies = [ClrStepperModule];
const appfxDependencies = [AppfxPropertyViewModule, AppfxA11yModule, AppfxWorkflowCoreModule];
class AppfxStepperModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxStepperModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: AppfxStepperModule, declarations: [StepperComponent], imports: [AppfxPropertyViewModule, AppfxA11yModule, AppfxWorkflowCoreModule, ClrStepperModule, CommonModule, FormsModule, ReactiveFormsModule], exports: [StepperComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxStepperModule, providers: [StepperStateService, SummaryService], imports: [appfxDependencies, clarityDependencies, CommonModule, FormsModule, ReactiveFormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxStepperModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [...appfxDependencies, ...clarityDependencies, CommonModule, FormsModule, ReactiveFormsModule],
                    declarations: [StepperComponent],
                    providers: [StepperStateService, SummaryService],
                    exports: [StepperComponent],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AppfxStepperModule, StepperComponent as Stepper, StepperComponent, StepperStateService, SummaryService };
//# sourceMappingURL=clr-addons-stepper.mjs.map
