import * as i9 from "@angular/common";
import { CommonModule } from "@angular/common";
import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, EventEmitter, Injectable, Input, NgModule, Output, ViewChild, ViewChildren } from "@angular/core";
import * as i4 from "@angular/forms";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import * as i7 from "@clr/addons/a11y";
import { AppfxA11yModule } from "@clr/addons/a11y";
import * as i6 from "@clr/addons/property-view";
import { AppfxPropertyViewModule, PropertyViewBuilder } from "@clr/addons/property-view";
import * as i3 from "@clr/addons/var";
import { AppfxWorkflowCoreModule, RelevanceService, StepContainer, WorkflowModelManager } from "@clr/addons/var";
import * as i8 from "@clr/angular/stepper";
import { ClrStepButton, ClrStepper, ClrStepperModule, ClrStepperPanel, StepperPanelStatus } from "@clr/angular/stepper";
import { BehaviorSubject, ReplaySubject, Subject, Subscription, combineLatest, of } from "rxjs";
import { debounceTime, filter, first, map, switchMap, take, tap } from "rxjs/operators";
import * as i2 from "@clr/addons/workflow/strings";
var SummaryService = class SummaryService {
	getDescription(step) {
		if (step.description) return this.getPropertyViewModelFromMessage(step.description);
	}
	getSummary(step) {
		if (step.summary) {
			const stepSummary = step.summary(this.getPropertyViewSectionBuilder(), step.modelInstance);
			return this.getPropertyViewModelFromPropertyViewSectionModel(stepSummary);
		}
	}
	getPropertyViewModelFromMessage(data) {
		const builder = this.getPropertyViewBuilder();
		builder.generateAllCategory("").section("defaultSection").message(data).renderAsHtml(true);
		return builder.build();
	}
	getPropertyViewModelFromPropertyViewSectionModel(data) {
		const category = this.getPropertyViewCategoryBuilder().build();
		category.content = [data];
		return { categories: [category] };
	}
	getPropertyViewSectionBuilder() {
		return this.getPropertyViewCategoryBuilder().section("defaultSection");
	}
	getPropertyViewCategoryBuilder() {
		return this.getPropertyViewBuilder().generateAllCategory("");
	}
	getPropertyViewBuilder() {
		return new PropertyViewBuilder();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: SummaryService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: SummaryService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: SummaryService,
	decorators: [{ type: Injectable }]
});
var StepperStateService = class StepperStateService {
	constructor(summaryService) {
		this.summaryService = summaryService;
		this.panelState$ = new BehaviorSubject([]);
		this.lastExpandedState = [];
		this.onStepActivated$ = this.initOnStepActivated$();
	}
	stepActivated(step, expanded, index) {
		const expandedState = this.panelState$.value;
		if (expandedState[index] && expandedState[index].expanded === expanded) return;
		expandedState[index] = {
			step,
			expanded,
			index,
			valid: expandedState[index] ? expandedState[index].valid : false
		};
		this.panelState$.next(expandedState);
	}
	markStepValid(step, isValid) {
		const stepState = this.panelState$.value.find((panelState) => panelState && panelState.step === step);
		if (stepState) stepState.valid = isValid;
	}
	resetNextStepsValidStates(step) {
		const stepStateIndex = this.panelState$.value.findIndex((currentStepState) => currentStepState && currentStepState.step === step);
		this.panelState$.value.forEach((currentStepState) => {
			if (currentStepState && currentStepState.index > stepStateIndex) {
				currentStepState.valid = false;
				currentStepState.step.initialDescription = this.summaryService.getDescription(currentStepState.step);
			}
		});
	}
	getIndexOfFirstIncompleteStep() {
		const notValidStep = this.panelState$.value.find((stepState) => stepState && !stepState.step.isSkipped && !stepState.valid);
		if (notValidStep) return notValidStep.index;
		else {
			const validSteps = this.panelState$.value.filter((stepState) => stepState && !stepState.step.isSkipped && stepState.valid);
			return validSteps.length ? validSteps[validSteps.length - 1].index : 0;
		}
	}
	getFirstIncompleteStepContainerIndex() {
		const visibleSteps = this.panelState$.value.filter((stepState) => stepState && !stepState.step.isSkipped);
		const firstInvalidStepIndex = visibleSteps.findIndex((stepState) => !stepState.valid);
		if (firstInvalidStepIndex >= 0) return firstInvalidStepIndex;
		return visibleSteps.length ? visibleSteps.length - 1 : 0;
	}
	areAllStepsCompleted() {
		return this.panelState$.value.every((stepState) => stepState && (stepState.step.isSkipped || stepState.valid));
	}
	isStepActivated(index) {
		const panelState = this.panelState$.value;
		if (panelState[index]) return panelState[index].expanded;
		else return true;
	}
	isFirstVisibleStep(index, steps) {
		return index === steps.findIndex((s) => !s.isSkipped);
	}
	initOnStepActivated$() {
		return this.panelState$.pipe(debounceTime(50), map((currentState) => {
			const expandedStep = currentState.find((currExpanded, index) => currExpanded && currExpanded.expanded && (!this.lastExpandedState[index] || !this.lastExpandedState[index].expanded));
			this.lastExpandedState = currentState.concat();
			return expandedStep;
		}), filter((stepState) => !!stepState));
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: StepperStateService,
			deps: [{ token: SummaryService }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: StepperStateService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: StepperStateService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: SummaryService }]
});
var StepperComponent = class StepperComponent {
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
		this.loading = false;
		this.usePrimaryNextButton = false;
		this.showBackButton = false;
		this.showCancelButton = false;
		this.onModelChange = new EventEmitter();
		this.onFinish = new EventEmitter();
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
		this.subscriptions.add(modelMgr.loading$.subscribe((loading) => this.loading = loading));
		this.subscriptions.add(stateService.onStepActivated$.subscribe((stepState) => {
			const indexOfFirstIncompleteStep = stateService.getIndexOfFirstIncompleteStep();
			if (stepState.index !== indexOfFirstIncompleteStep) this.completePreviousSteps(indexOfFirstIncompleteStep, stepState.index);
			this.initialStep = this.getFormGroupNameForStep(stepState.index);
			this.onStepActivated(stepState.step);
			stepState.step.initialDescription = summaryService.getDescription(stepState.step);
		}));
		this.stepPanelOverriddenStrings = {
			success: workflowStrings.step.completed,
			danger: workflowStrings.step.error
		};
	}
	get steps() {
		return this.#steps;
	}
	set steps(value) {
		this.relevanceService.steps = value;
		this.relevanceService.checkComplete$().pipe(take(1)).subscribe((steps) => {
			this.#steps = steps;
			this.modelMgr.steps = steps;
			this.initForm(steps);
			this.#steps.forEach((step) => step.initialDescription = this.summaryService.getDescription(step));
		});
	}
	get stepsInternal() {
		return this.#steps;
	}
	get wizardModel() {
		return this.#wizardModel;
	}
	set wizardModel(value) {
		this.#wizardModel = value;
		this.modelMgr.model = value;
	}
	set clrStepButtons(clrStepButtons) {
		clrStepButtons.forEach((button) => {
			if (!button["navigatePatched"]) {
				const clrStepButtonNavigateToNextPanelFn = button.navigateToNextPanel.bind(button);
				button.navigateToNextPanel = this.onClrStepButtonClickedWrapperFn(clrStepButtonNavigateToNextPanelFn);
				button["navigatePatched"] = true;
			}
		});
	}
	set stepper(value) {
		this.stepperService = value["stepperService"];
		this.patchStepperService();
		this.subscribeForPanelChanges();
	}
	get isLoading() {
		return this.loading || this.relevanceService.loading || !!this.pagesContainers && this.pagesContainers.some((value) => !!value.step.modelInstance && !!value.step.modelInstance.loading);
	}
	get pageProgressDetails() {
		return this.activePage?.step?.modelInstance?.progressStatus || "";
	}
	get showProgressCancelButton() {
		return typeof this.activePage?.step?.modelInstance?.cancelableValidation?.cancelValidation === "function";
	}
	get cancelValidationButtonLabel() {
		return this.activePage?.step?.modelInstance?.cancelableValidation?.cancelButtonLabel || "";
	}
	cancelPageValidation() {
		if (typeof this.activePage?.step?.modelInstance?.cancelableValidation?.cancelValidation === "function") this.activePage?.step?.modelInstance?.cancelableValidation.cancelValidation();
	}
	isNextButtonDisabled(step) {
		const activeContainer = this.pagesContainers && this.pagesContainers.find((item) => item.step === step);
		return this.isLoading || this.errorActivatingStep || (activeContainer ? !activeContainer.readyToComplete : false);
	}
	ngOnDestroy() {
		this.#steps = [];
		this.activeStep = void 0;
		this.subscriptions.unsubscribe();
		this.unsubscribeRetry();
		this.modelMgr.destroy();
	}
	ngAfterViewInit() {
		if (this.pagesContainers.length) this.componentAfterViewInit$.next();
		else this.pagesContainers.changes.pipe(take(1)).subscribe(() => this.componentAfterViewInit$.next());
	}
	ngAfterContentInit() {
		this.subscriptions.add(combineLatest([this.componentAfterViewInit$, this.awaitingWizardPageOnLoad$]).pipe(filter(() => !!this.pagesContainers), switchMap(([, pendingStep]) => this.modelMgr.injectPropertiesToPendingStep(pendingStep))).subscribe((result) => {
			this.errorActivatingStep = !!result.error;
			this.activatePendingContainer(result);
		}));
	}
	onStepActivated(step) {
		this.awaitingWizardPageOnLoad$.next(step);
	}
	onClrStepButtonClickedWrapperFn(callbackFn) {
		return () => {
			this.commitActiveStep().pipe(take(1)).subscribe(() => {
				callbackFn();
			});
		};
	}
	onFormSubmit() {
		if (this.stateService.areAllStepsCompleted()) this.onFinish.emit();
	}
	isFirstVisibleStep(stepIndex) {
		return this.stateService.isFirstVisibleStep(stepIndex, this.stepsInternal);
	}
	patchStepperService() {
		const originalTogglePanelFunc = this.stepperService.togglePanel;
		if (!this.stepperService["togglePanelPatched"]) {
			this.stepperService.togglePanel = (...args) => {
				if (this.stateService.getFirstIncompleteStepContainerIndex() === this.pagesContainers.toArray().findIndex((item) => item === this.activePage)) originalTogglePanelFunc.apply(this.stepperService, args);
				else this.commitActiveStep().pipe(take(1), filter((isValid) => isValid)).subscribe(() => {
					originalTogglePanelFunc.apply(this.stepperService, args);
				});
			};
			this.stepperService["togglePanelPatched"] = true;
		}
	}
	commitActiveStep() {
		if (!this.activePage) return of(false);
		this.loading = true;
		return this.activePage.onCommit().pipe(tap((isValid) => {
			const activeStep = this.activePage.step;
			this.stateService.markStepValid(activeStep, isValid);
			if (!isValid) this.stateService.resetNextStepsValidStates(activeStep);
			else if (activeStep.summary) activeStep.initialDescription = this.summaryService.getSummary(activeStep);
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
			if (result.error) this.retrySubscription = pendingPage.onRetry.pipe(take(1)).subscribe((step) => this.retryStepTransition(step));
			else {
				this.activeStep = result.pendingStep;
				this.activePage = this.pagesContainers.find((item) => item.step === this.activeStep);
			}
			pendingPage.onActivate(result.error, result.stepModelChanges, result.recreateComponent);
			this.cdr.detectChanges();
		}
	}
	retryStepTransition(step) {
		this.onStepActivated(step);
	}
	invalidateNextSteps() {
		if (!this.activeStep) return;
		this.stateService.resetNextStepsValidStates(this.activeStep);
		this.stepperService.resetPanels();
		this.stepperService.overrideInitialPanel(this.initialStep);
	}
	completePreviousSteps(sourceIndex, openPanelIndex) {
		const clrStepperPanels = this.stepperPanels.toArray();
		const sourcePanelId = this.getFormGroupNameForStep(sourceIndex);
		for (let stepIndex = 0; stepIndex < clrStepperPanels.length; stepIndex++) {
			const stepperPanel = clrStepperPanels[stepIndex];
			if (stepperPanel.id === sourcePanelId) break;
			stepperPanel.panel.pipe(first()).subscribe((panel) => {
				panel.disabled = false;
				panel.status = StepperPanelStatus.Complete;
				if (stepIndex !== openPanelIndex) panel.open = false;
			});
		}
	}
	unsubscribeRetry() {
		if (this.retrySubscription && !this.retrySubscription.closed) this.retrySubscription.unsubscribe();
	}
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
	subscribeForPanelChanges() {
		const panelsChanges = this.stepperService["_panelsChanges"];
		this.subscriptions.add(panelsChanges.subscribe((panels) => {
			panels.forEach((panelModel) => {
				const stepIndex = +panelModel.id.replace("step", "");
				const step = this.#steps[stepIndex];
				this.stateService.stepActivated(step, panelModel.open, stepIndex);
			});
		}));
	}
	getFormGroupNameForStep(stepIndex) {
		return "step" + stepIndex;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: StepperComponent,
			deps: [
				{ token: StepperStateService },
				{ token: i2.WorkflowStrings },
				{ token: i3.WorkflowModelManager },
				{ token: i3.RelevanceService },
				{ token: i4.UntypedFormBuilder },
				{ token: i0.ChangeDetectorRef },
				{ token: SummaryService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: StepperComponent,
			isStandalone: false,
			selector: "appfx-stepper",
			inputs: {
				loading: "loading",
				usePrimaryNextButton: "usePrimaryNextButton",
				showBackButton: "showBackButton",
				showCancelButton: "showCancelButton",
				steps: "steps",
				wizardModel: "wizardModel"
			},
			outputs: {
				onModelChange: "onModelChange",
				onFinish: "onFinish",
				onCancel: "onCancel"
			},
			providers: [
				RelevanceService,
				StepperStateService,
				SummaryService,
				WorkflowModelManager
			],
			viewQueries: [
				{
					propertyName: "stepper",
					first: true,
					predicate: ClrStepper,
					descendants: true
				},
				{
					propertyName: "pagesContainers",
					predicate: StepContainer,
					descendants: true
				},
				{
					propertyName: "stepperPanels",
					predicate: ClrStepperPanel,
					descendants: true
				},
				{
					propertyName: "clrStepButtons",
					predicate: ClrStepButton,
					descendants: true
				}
			],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<form\n  clrStepper\n  [formGroup]=\"form\"\n  (ngSubmit)=\"onFormSubmit()\"\n  [clrInitialStep]=\"initialStep\"\n  [ngClass]=\"{ 'disable-form': isLoading }\"\n>\n  <ng-container *ngFor=\"let step of stepsInternal; let i = index; let last = last\">\n    <clr-stepper-panel\n      *ngIf=\"!step.isSkipped\"\n      formGroupName=\"step{{ i }}\"\n      [appfxOverrideClrStrings]=\"stepPanelOverriddenStrings\"\n    >\n      <clr-step-title>{{ step.title }}</clr-step-title>\n      <clr-step-description>\n        <appfx-property-view\n          *ngIf=\"step.initialDescription\"\n          [data]=\"step.initialDescription\"\n          [attr.aria-label]=\"step.description\"\n        ></appfx-property-view>\n      </clr-step-description>\n\n      <clr-step-content>\n        <appfx-step-container [step]=\"step\"> </appfx-step-container>\n\n        <button\n          *ngIf=\"!last\"\n          [disabled]=\"isNextButtonDisabled(step)\"\n          clrStepButton=\"next\"\n          [ngClass]=\"{ 'btn-primary': usePrimaryNextButton }\"\n        >\n          {{ workflowStrings.next }}\n        </button>\n        <button *ngIf=\"last\" [disabled]=\"isNextButtonDisabled(step)\" clrStepButton=\"submit\">\n          {{ workflowStrings.finish }}\n        </button>\n        <button *ngIf=\"showBackButton && !isFirstVisibleStep(i)\" clrStepButton=\"previous\">\n          {{ workflowStrings.back }}\n        </button>\n        <button *ngIf=\"showCancelButton\" (click)=\"onCancel.emit()\" type=\"button\" class=\"clr-step-button btn btn-link\">\n          {{ workflowStrings.cancel }}\n        </button>\n      </clr-step-content>\n    </clr-stepper-panel>\n  </ng-container>\n</form>\n\n<appfx-spinner\n  *ngIf=\"isLoading\"\n  [message]=\"workflowStrings.loading\"\n  [progressDetails]=\"pageProgressDetails\"\n  [showActionButton]=\"showProgressCancelButton\"\n  [actionButtonLabel]=\"cancelValidationButtonLabel\"\n  (actionClick)=\"cancelPageValidation()\"\n>\n</appfx-spinner>\n",
			styles: [".disable-form{left:0;top:0;z-index:10;pointer-events:none;opacity:.5}form appfx-spinner{position:absolute;top:50%;left:50%;z-index:999}clr-step-description ::ng-deep appfx-property-view-category{padding:0}clr-step-description ::ng-deep td.pv-message-container{padding:0!important}clr-step-description ::ng-deep .pv-message-text{line-height:1.2rem}clr-step-description ::ng-deep .table td,clr-step-description ::ng-deep .table th{background:none}:host button[clrStepButton=previous]{border:1px solid var(--clr-btn-primary-outline-color)}\n"],
			dependencies: [
				{
					kind: "component",
					type: i6.PropertyViewComponent,
					selector: "appfx-property-view",
					inputs: ["data", "config"]
				},
				{
					kind: "directive",
					type: i7.OverrideClrStringsDirective,
					selector: "clr-stepper-panel [appfxOverrideClrStrings]",
					inputs: ["appfxOverrideClrStrings"]
				},
				{
					kind: "component",
					type: i3.StepContainerComponent,
					selector: "appfx-step-container",
					inputs: ["step", "description"],
					outputs: ["onRetry"]
				},
				{
					kind: "component",
					type: i3.SpinnerComponent,
					selector: "appfx-spinner",
					inputs: [
						"message",
						"politeness",
						"isModal",
						"progressDetails",
						"showActionButton",
						"actionButtonLabel"
					],
					outputs: ["actionClick"]
				},
				{
					kind: "component",
					type: i8.ClrStepper,
					selector: "form[clrStepper]",
					inputs: ["clrInitialStep"]
				},
				{
					kind: "directive",
					type: i8.ClrStepButton,
					selector: "[clrStepButton]",
					inputs: ["clrStepButton"]
				},
				{
					kind: "component",
					type: i8.ClrStepTitle,
					selector: "clr-step-title"
				},
				{
					kind: "component",
					type: i8.ClrStepDescription,
					selector: "clr-step-description"
				},
				{
					kind: "component",
					type: i8.ClrStepContent,
					selector: "clr-step-content"
				},
				{
					kind: "component",
					type: i8.ClrStepperPanel,
					selector: "clr-stepper-panel"
				},
				{
					kind: "directive",
					type: i9.NgClass,
					selector: "[ngClass]",
					inputs: ["class", "ngClass"]
				},
				{
					kind: "directive",
					type: i9.NgForOf,
					selector: "[ngFor][ngForOf]",
					inputs: [
						"ngForOf",
						"ngForTrackBy",
						"ngForTemplate"
					]
				},
				{
					kind: "directive",
					type: i9.NgIf,
					selector: "[ngIf]",
					inputs: [
						"ngIf",
						"ngIfThen",
						"ngIfElse"
					]
				},
				{
					kind: "directive",
					type: i4.ɵNgNoValidate,
					selector: "form:not([ngNoForm]):not([ngNativeValidate])"
				},
				{
					kind: "directive",
					type: i4.NgControlStatusGroup,
					selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]"
				},
				{
					kind: "directive",
					type: i4.FormGroupDirective,
					selector: "[formGroup]",
					inputs: ["formGroup"],
					outputs: ["ngSubmit"],
					exportAs: ["ngForm"]
				},
				{
					kind: "directive",
					type: i4.FormGroupName,
					selector: "[formGroupName]",
					inputs: ["formGroupName"]
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
	type: StepperComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-stepper",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			providers: [
				RelevanceService,
				StepperStateService,
				SummaryService,
				WorkflowModelManager
			],
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<form\n  clrStepper\n  [formGroup]=\"form\"\n  (ngSubmit)=\"onFormSubmit()\"\n  [clrInitialStep]=\"initialStep\"\n  [ngClass]=\"{ 'disable-form': isLoading }\"\n>\n  <ng-container *ngFor=\"let step of stepsInternal; let i = index; let last = last\">\n    <clr-stepper-panel\n      *ngIf=\"!step.isSkipped\"\n      formGroupName=\"step{{ i }}\"\n      [appfxOverrideClrStrings]=\"stepPanelOverriddenStrings\"\n    >\n      <clr-step-title>{{ step.title }}</clr-step-title>\n      <clr-step-description>\n        <appfx-property-view\n          *ngIf=\"step.initialDescription\"\n          [data]=\"step.initialDescription\"\n          [attr.aria-label]=\"step.description\"\n        ></appfx-property-view>\n      </clr-step-description>\n\n      <clr-step-content>\n        <appfx-step-container [step]=\"step\"> </appfx-step-container>\n\n        <button\n          *ngIf=\"!last\"\n          [disabled]=\"isNextButtonDisabled(step)\"\n          clrStepButton=\"next\"\n          [ngClass]=\"{ 'btn-primary': usePrimaryNextButton }\"\n        >\n          {{ workflowStrings.next }}\n        </button>\n        <button *ngIf=\"last\" [disabled]=\"isNextButtonDisabled(step)\" clrStepButton=\"submit\">\n          {{ workflowStrings.finish }}\n        </button>\n        <button *ngIf=\"showBackButton && !isFirstVisibleStep(i)\" clrStepButton=\"previous\">\n          {{ workflowStrings.back }}\n        </button>\n        <button *ngIf=\"showCancelButton\" (click)=\"onCancel.emit()\" type=\"button\" class=\"clr-step-button btn btn-link\">\n          {{ workflowStrings.cancel }}\n        </button>\n      </clr-step-content>\n    </clr-stepper-panel>\n  </ng-container>\n</form>\n\n<appfx-spinner\n  *ngIf=\"isLoading\"\n  [message]=\"workflowStrings.loading\"\n  [progressDetails]=\"pageProgressDetails\"\n  [showActionButton]=\"showProgressCancelButton\"\n  [actionButtonLabel]=\"cancelValidationButtonLabel\"\n  (actionClick)=\"cancelPageValidation()\"\n>\n</appfx-spinner>\n",
			styles: [".disable-form{left:0;top:0;z-index:10;pointer-events:none;opacity:.5}form appfx-spinner{position:absolute;top:50%;left:50%;z-index:999}clr-step-description ::ng-deep appfx-property-view-category{padding:0}clr-step-description ::ng-deep td.pv-message-container{padding:0!important}clr-step-description ::ng-deep .pv-message-text{line-height:1.2rem}clr-step-description ::ng-deep .table td,clr-step-description ::ng-deep .table th{background:none}:host button[clrStepButton=previous]{border:1px solid var(--clr-btn-primary-outline-color)}\n"]
		}]
	}],
	ctorParameters: () => [
		{ type: StepperStateService },
		{ type: i2.WorkflowStrings },
		{ type: i3.WorkflowModelManager },
		{ type: i3.RelevanceService },
		{ type: i4.UntypedFormBuilder },
		{ type: i0.ChangeDetectorRef },
		{ type: SummaryService }
	],
	propDecorators: {
		loading: [{ type: Input }],
		usePrimaryNextButton: [{ type: Input }],
		showBackButton: [{ type: Input }],
		showCancelButton: [{ type: Input }],
		onModelChange: [{ type: Output }],
		onFinish: [{ type: Output }],
		onCancel: [{ type: Output }],
		pagesContainers: [{
			type: ViewChildren,
			args: [StepContainer]
		}],
		stepperPanels: [{
			type: ViewChildren,
			args: [ClrStepperPanel]
		}],
		steps: [{ type: Input }],
		wizardModel: [{ type: Input }],
		clrStepButtons: [{
			type: ViewChildren,
			args: [ClrStepButton]
		}],
		stepper: [{
			type: ViewChild,
			args: [ClrStepper, { static: false }]
		}]
	}
});
const clarityDependencies = [ClrStepperModule];
const appfxDependencies = [
	AppfxPropertyViewModule,
	AppfxA11yModule,
	AppfxWorkflowCoreModule
];
var AppfxStepperModule = class AppfxStepperModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxStepperModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxStepperModule,
			declarations: [StepperComponent],
			imports: [
				AppfxPropertyViewModule,
				AppfxA11yModule,
				AppfxWorkflowCoreModule,
				ClrStepperModule,
				CommonModule,
				FormsModule,
				ReactiveFormsModule
			],
			exports: [StepperComponent]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxStepperModule,
			providers: [StepperStateService, SummaryService],
			imports: [
				appfxDependencies,
				clarityDependencies,
				CommonModule,
				FormsModule,
				ReactiveFormsModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: AppfxStepperModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				...appfxDependencies,
				...clarityDependencies,
				CommonModule,
				FormsModule,
				ReactiveFormsModule
			],
			declarations: [StepperComponent],
			providers: [StepperStateService, SummaryService],
			exports: [StepperComponent]
		}]
	}]
});
export { AppfxStepperModule, StepperComponent as Stepper, StepperComponent, StepperStateService, SummaryService };

//# sourceMappingURL=clr-addons-stepper.mjs.map