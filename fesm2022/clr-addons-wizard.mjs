import * as i2$1 from "@angular/common";
import { CommonModule } from "@angular/common";
import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, NgModule, Optional, Output, ViewChild, ViewChildren } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import * as i1$1 from "@clr/addons/property-view";
import { PropertyViewBuilder, PropertyViewModule } from "@clr/addons/property-view";
import * as i1 from "@clr/addons/var";
import { AppfxWorkflowCoreModule, RelevanceService, StepContainer, StepValidationState, WorkflowModelManager, WorkflowModelMonitor, formatError, modalServiceToken } from "@clr/addons/var";
import * as i5 from "@clr/angular/icon";
import { ClarityIcons, ClrIcon, dotCircleIcon } from "@clr/angular/icon";
import * as i4 from "@clr/angular/wizard";
import { ClrWizardModule } from "@clr/angular/wizard";
import * as i3 from "@clr/addons/a11y";
import { ZoomLevel } from "@clr/addons/a11y";
import * as i2 from "@clr/addons/workflow/strings";
import { ReplaySubject, Subject, Subscription, combineLatest, of } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
var SummaryComponent = class SummaryComponent {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: SummaryComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: SummaryComponent,
			isStandalone: false,
			selector: "appfx-summary",
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-property-view *ngIf=\"model?.data\" [data]=\"model.data\"></appfx-property-view>\n",
			styles: ["appfx-property-view{height:unset}appfx-property-view ::ng-deep appfx-property-view-category{padding-left:unset}appfx-property-view ::ng-deep .table td,appfx-property-view ::ng-deep .table th{font-size:unset!important;background:none}\n"],
			dependencies: [{
				kind: "component",
				type: i1$1.PropertyViewComponent,
				selector: "appfx-property-view",
				inputs: ["data", "config"]
			}, {
				kind: "directive",
				type: i2$1.NgIf,
				selector: "[ngIf]",
				inputs: [
					"ngIf",
					"ngIfThen",
					"ngIfElse"
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
	type: SummaryComponent,
	decorators: [{
		type: Component,
		args: [{
			changeDetection: ChangeDetectionStrategy.Eager,
			selector: "appfx-summary",
			standalone: false,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-property-view *ngIf=\"model?.data\" [data]=\"model.data\"></appfx-property-view>\n",
			styles: ["appfx-property-view{height:unset}appfx-property-view ::ng-deep appfx-property-view-category{padding-left:unset}appfx-property-view ::ng-deep .table td,appfx-property-view ::ng-deep .table th{font-size:unset!important;background:none}\n"]
		}]
	}]
});
var SummaryModel = class {
	constructor() {
		this.loading = false;
	}
};
var WizardComponent = class WizardComponent {
	#pages;
	#opened;
	#wizardModel;
	constructor(cdr, modelMgr, relevanceService, configService, workflowStrings, zoomLevelService, openModalComponent) {
		this.cdr = cdr;
		this.modelMgr = modelMgr;
		this.relevanceService = relevanceService;
		this.configService = configService;
		this.workflowStrings = workflowStrings;
		this.zoomLevelService = zoomLevelService;
		this.loading = false;
		this.size = "lg";
		this.openedChange = new EventEmitter();
		this.onModelChange = new EventEmitter();
		this.onFinish = new EventEmitter();
		this.onClose = new EventEmitter();
		this.ZoomLevel = ZoomLevel;
		this.showNav = false;
		this.activeStepIndex = 1;
		this.closeHandlerValidationState = new StepValidationState();
		this.awaitingWizardPageOnLoad$ = new ReplaySubject(Infinity);
		this.componentAfterViewInit$ = new Subject();
		this.subscriptions = new Subscription();
		this.errorActivatingStep = false;
		this.#opened = true;
		if (openModalComponent === false) throw new Error("AppFx Wizard must be opened using ModalService.openModalComponent method.");
		ClarityIcons.addIcons(dotCircleIcon);
	}
	get pages() {
		return this.#pages;
	}
	set pages(value) {
		if (value && value.some((step) => !!step.summary)) {
			this.appendSummaryPage(value);
			this.subscriptions.add(this.relevanceService.onStepRelevanceChange$().subscribe(() => {
				this.recalculateSummaryPageSkipState();
			}));
		}
		this.relevanceService.steps = value;
		this.subscriptions.add(this.relevanceService.checkComplete$().pipe(take(1)).subscribe((steps) => {
			this.#pages = steps;
			this.modelMgr.steps = steps;
			this.recalculateSummaryPageSkipState();
		}));
	}
	get pagesInternal() {
		return this.#pages;
	}
	get wizardModel() {
		return this.#wizardModel;
	}
	set wizardModel(value) {
		this.#wizardModel = value;
		this.modelMgr.model = value;
	}
	get opened() {
		return this.#opened;
	}
	set opened(value) {
		if (!this.#opened && value) this.reset();
		this.#opened = value;
		this.openedChange.next(value);
	}
	get isLoading() {
		return this.loading || this.relevanceService.loading || !!this.pagesContainers && this.pagesContainers.some((value) => !!value.step.modelInstance && !!value.step.modelInstance.loading);
	}
	get pageProgressDetails() {
		return this.activeStep?.modelInstance?.progressStatus || "";
	}
	get showProgressCancelButton() {
		return typeof this.activeStep?.modelInstance?.cancelableValidation?.cancelValidation === "function";
	}
	get cancelValidationButtonLabel() {
		return this.activeStep?.modelInstance?.cancelableValidation?.cancelButtonLabel || "";
	}
	get isSignPostOpen() {
		return !!(this.debugPopup && this.debugPopup.isOpen);
	}
	get isNextButtonDisabled() {
		return this.isLoading || this.errorActivatingStep || (this.activePage ? !this.activePage.readyToComplete : false);
	}
	cancelPageValidation() {
		if (typeof this.activeStep?.modelInstance?.cancelableValidation?.cancelValidation === "function") this.activeStep?.modelInstance?.cancelableValidation.cancelValidation();
	}
	ngOnInit() {
		this.subscriptions.add(this.modelMgr.onModelChange$.subscribe((changes) => {
			this.onModelChange.emit(changes);
			this.invalidateNextSteps();
		}));
		this.subscriptions.add(this.modelMgr.loading$.subscribe((loading) => {
			this.loading = loading;
			this.cdr.detectChanges();
		}));
		if (this.zoomLevelService) this.subscriptions.add(this.zoomLevelService.onChange.subscribe((level) => {
			this.currentZoomLevel = level;
			this.cdr.detectChanges();
		}));
	}
	ngOnDestroy() {
		this.pages = [];
		this.activeStep = void 0;
		this.subscriptions.unsubscribe();
		this.unsubscribeRetry();
		this.relevanceService.destroy();
		this.modelMgr.destroy();
	}
	ngAfterViewInit() {
		this.patchWizardNavigationService();
		if (this.pagesContainers.length) this.componentAfterViewInit$.next();
		else this.pagesContainers.changes.pipe(take(1)).subscribe(() => this.componentAfterViewInit$.next());
	}
	ngAfterContentInit() {
		this.subscriptions.add(combineLatest([this.componentAfterViewInit$, this.awaitingWizardPageOnLoad$]).pipe(filter(() => !!this.pagesContainers), switchMap(([, pendingStep]) => this.modelMgr.injectPropertiesToPendingStep(pendingStep))).subscribe((result) => {
			this.errorActivatingStep = !!result.error;
			this.activatePendingContainer(result);
		}));
	}
	onWizardPageActivated(page) {
		this.showNav = false;
		this.awaitingWizardPageOnLoad$.next(page);
	}
	onWizardCommit() {
		this.commitActiveStep().pipe(take(1), filter((isValid) => isValid)).subscribe(() => {
			if (this.wizard.navService.currentPageIsLast) {
				const close$ = this.closeHandler?.onSubmit?.() || of(Reason.finish);
				this.subscribeForFinishHandler(close$);
			} else this.wizard.forceNext();
		});
	}
	onWizardCancel() {
		if (!this.wizard) return;
		this.subscribeForCloseHandler(this.closeHandler?.onCancel?.() || of(Reason.cancel));
	}
	onWizardBack() {
		if (!this.wizard) return;
		if (this.activeStep && this.activeStep.modelInstance) this.activeStep.modelInstance.loading = false;
		this.wizard.navService.previous();
	}
	openStepNavPanel() {
		this.showNav = true;
	}
	subscribeForFinishHandler(finish$) {
		this.loading = true;
		finish$.subscribe({
			error: (error) => {
				this.loading = false;
				if (error !== preventDisplayingWizardError) this.closeHandlerValidationState.errors = [formatError(error).data.message || this.workflowStrings.defaultWizardSubmitError];
				this.cdr.markForCheck();
			},
			complete: () => {
				this.loading = false;
				this.closeHandlerValidationState.errors = [];
				this.onFinish.emit();
				this.wizard.forceFinish();
				this.closeWizard(Reason.finish);
				this.cdr.markForCheck();
			}
		});
	}
	subscribeForCloseHandler(close$) {
		this.loading = true;
		close$.subscribe({
			error: (error) => {
				this.loading = false;
				if (error !== preventDisplayingWizardError) this.closeHandlerValidationState.errors = [formatError(error).data.message || this.workflowStrings.defaultWizardSubmitError];
				this.cdr.markForCheck();
			},
			complete: () => {
				this.loading = false;
				this.closeHandlerValidationState.errors = [];
				this.wizard.close();
				this.closeWizard(Reason.cancel);
				this.cdr.markForCheck();
			}
		});
	}
	closeWizard(reason) {
		this.onClose.emit(reason);
	}
	appendSummaryPage(steps) {
		const summaryModel = new SummaryModel();
		this.summaryStep = {
			title: this.workflowStrings.summary.title,
			description: this.workflowStrings.summary.description,
			componentClass: SummaryComponent,
			model: () => {
				const propertyViewModelBuilder = new PropertyViewBuilder();
				const propertyViewModel = propertyViewModelBuilder.build();
				const categoryBuilder = propertyViewModelBuilder.generateAllCategory("");
				const category = categoryBuilder.build();
				category.content = this.#pages.filter((step) => !step.isSkipped && !!step.summary).map((step) => step.summary?.(categoryBuilder.section(step.title).title(step.navTitle || step.title), step.modelInstance));
				propertyViewModel.categories = [category];
				summaryModel.data = propertyViewModel;
				return summaryModel;
			},
			instantiateLazy: true,
			recreateComponent: () => true
		};
		steps.push(this.summaryStep);
	}
	commitActiveStep() {
		if (!this.activePage) return of(false);
		this.loading = true;
		return this.activePage.onCommit().pipe(switchMap((isValid) => {
			if (isValid) {
				this.modelMgr.ejectPropertiesFromCurrentStep(this.activeStep);
				return this.relevanceService.checkComplete$().pipe(map(() => {
					return isValid;
				}));
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
				this.setActiveStepIndex();
				this.activePage = this.pagesContainers.find((item) => item.step === this.activeStep);
				this.updateFooterComponent();
			}
			pendingPage.onActivate(result.error, result.stepModelChanges, result.recreateComponent);
			this.cdr.detectChanges();
		}
	}
	updateFooterComponent() {
		if (!this.footer?.componentClass) return;
		this.footerComponentInputs = {
			currentStep: this.activeStep,
			steps: this.#pages,
			workflowModel: this.wizardModel
		};
	}
	retryStepTransition(step) {
		this.onWizardPageActivated(step);
	}
	invalidateNextSteps() {
		if (this.wizard.currentPage) {
			this.wizard.currentPage.completed = false;
			let nextPage = this.wizard.pageCollection.getNextPage(this.wizard.currentPage);
			while (nextPage) {
				nextPage.completed = false;
				nextPage = this.wizard.pageCollection.getNextPage(nextPage);
			}
		}
	}
	unsubscribeRetry() {
		if (this.retrySubscription && !this.retrySubscription.closed) this.retrySubscription.unsubscribe();
	}
	patchWizardNavigationService() {
		const navService = this.wizard.navService;
		const originalGoToFunction = navService.goTo;
		navService.goTo = (...args) => {
			const pages = this.wizard.pages.toArray();
			let firstIncompletePageIndex = pages.findIndex((p) => !p.enabled) - 1;
			firstIncompletePageIndex = firstIncompletePageIndex < 0 ? pages.length - 1 : firstIncompletePageIndex;
			const activeContainerIndex = this.pagesContainers.toArray().findIndex((item) => item === this.activePage);
			if (firstIncompletePageIndex === activeContainerIndex) originalGoToFunction.apply(navService, args);
			else this.commitActiveStep().pipe(take(1), filter((isValid) => isValid)).subscribe(() => {
				originalGoToFunction.apply(navService, args);
			});
		};
	}
	setActiveStepIndex() {
		this.activeStepIndex = this.#pages.filter((page) => {
			return !page.isSkipped;
		}).indexOf(this.activeStep) + 1;
	}
	reset() {
		if (this.wizard) {
			this.wizard.reset();
			if (this.pages) this.pages = this.pages.map((step) => Object.assign({}, step));
		}
	}
	recalculateSummaryPageSkipState() {
		if (!this.summaryStep) return;
		const showDefaultPage = this.#pages && this.#pages.some((step) => {
			return !step.isSkipped && step.summary;
		});
		this.summaryStep.isSkipped = !showDefaultPage;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: WizardComponent,
			deps: [
				{ token: i0.ChangeDetectorRef },
				{ token: i1.WorkflowModelManager },
				{ token: i1.RelevanceService },
				{ token: i1.WorkflowConfigurationService },
				{ token: i2.WorkflowStrings },
				{
					token: i3.ZoomLevelService,
					optional: true
				},
				{
					token: modalServiceToken,
					optional: true
				}
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: WizardComponent,
			isStandalone: false,
			selector: "appfx-wizard",
			inputs: {
				title: "title",
				loading: "loading",
				closeHandler: "closeHandler",
				footer: "footer",
				size: "size",
				pages: "pages",
				wizardModel: "wizardModel",
				opened: "opened"
			},
			outputs: {
				openedChange: "openedChange",
				onModelChange: "onModelChange",
				onFinish: "onFinish",
				onClose: "onClose"
			},
			providers: [RelevanceService, WorkflowModelManager],
			viewQueries: [
				{
					propertyName: "wizard",
					first: true,
					predicate: ["wizard"],
					descendants: true,
					static: true
				},
				{
					propertyName: "debugPopup",
					first: true,
					predicate: WorkflowModelMonitor,
					descendants: true
				},
				{
					propertyName: "pagesContainers",
					predicate: StepContainer,
					descendants: true
				}
			],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-wizard\n  #wizard\n  [(clrWizardOpen)]=\"opened\"\n  [clrWizardSize]=\"size\"\n  class=\"app-wizard\"\n  [class.zoom2x]=\"currentZoomLevel === ZoomLevel.x2\"\n  [class.zoom4x]=\"currentZoomLevel === ZoomLevel.x4\"\n  [class.showNav]=\"showNav\"\n  [class.debug-popup]=\"isSignPostOpen\"\n>\n  <clr-wizard-title *ngIf=\"!configService.debug\" [attr.data-test-id]=\"'appfx-wizard-title'\">\n    <button\n      class=\"btn-close-stepnav\"\n      [attr.aria-label]=\"workflowStrings.closeStepNavAriaLabel\"\n      (click)=\"showNav = false\"\n    >\n      <cds-icon direction=\"left\" shape=\"angle\" class=\"stepnav-close\"></cds-icon>\n    </button>\n    {{ title }}\n  </clr-wizard-title>\n  <clr-wizard-title *ngIf=\"configService.debug\" [attr.data-test-id]=\"'appfx-wizard-title'\">\n    <appfx-model-popup [modelMgr]=\"modelMgr\"></appfx-model-popup>\n    <button\n      class=\"btn-close-stepnav\"\n      [attr.aria-label]=\"workflowStrings.closeStepNavAriaLabel\"\n      (click)=\"showNav = false\"\n    >\n      <cds-icon direction=\"left\" shape=\"angle\" class=\"stepnav-close\"></cds-icon>\n    </button>\n    {{ title }}\n  </clr-wizard-title>\n\n  <div *ngIf=\"footer?.componentClass\" ngProjectAs=\"clr-wizard-button\" class=\"appfx-wizard-footer\">\n    <ng-container\n      [ngComponentOutlet]=\"footer.componentClass\"\n      [ngComponentOutletInputs]=\"footerComponentInputs\"\n    ></ng-container>\n  </div>\n\n  <clr-wizard-button [type]=\"'cancel'\">{{ workflowStrings.cancel }}</clr-wizard-button>\n  <clr-wizard-button [type]=\"'previous'\">{{ workflowStrings.back }}</clr-wizard-button>\n  <clr-wizard-button [type]=\"'next'\">{{ workflowStrings.next }}</clr-wizard-button>\n  <clr-wizard-button [type]=\"'finish'\">{{ workflowStrings.finish }}</clr-wizard-button>\n\n  <!-- A wizard with empty pages cannot be opened with latest Clarity 15 and above. -->\n  <!-- We need an empty placeholder page, in order to be able to use wizards with asynchronous page loading. -->\n  <!-- More details: https://github.com/vmware-clarity/ng-clarity/issues/1108 -->\n  <ng-container *ngIf=\"!pages?.length\">\n    <clr-wizard-page>\n      <ng-template clrPageTitle> </ng-template>\n    </clr-wizard-page>\n  </ng-container>\n\n  <appfx-validation-banner\n    *ngIf=\"closeHandlerValidationState.errors?.length\"\n    cds-layout=\"m-b:sm\"\n    [state]=\"closeHandlerValidationState\"\n  >\n  </appfx-validation-banner>\n  <ng-container *ngFor=\"let page of pagesInternal; let pageIndex = index\">\n    <clr-wizard-page\n      #clrWizardPage\n      *ngIf=\"!page.isSkipped\"\n      class=\"pb-0\"\n      [class.pt-0]=\"page.description\"\n      [clrWizardPageNextDisabled]=\"isNextButtonDisabled\"\n      [class.is-loading]=\"isLoading\"\n      clrWizardPagePreventDefault=\"true\"\n      (clrWizardPageOnCommit)=\"onWizardCommit()\"\n      (clrWizardPageOnCancel)=\"onWizardCancel()\"\n      (clrWizardPagePrevious)=\"onWizardBack()\"\n      (clrWizardPageOnLoad)=\"onWizardPageActivated(page)\"\n      [attr.data-test-id]=\"'appfx-wizard-step-content'\"\n    >\n      <ng-template clrPageTitle>\n        <button\n          class=\"btn-show-stepnav\"\n          [attr.aria-label]=\"workflowStrings.openStepNavAriaLabel\"\n          (click)=\"openStepNavPanel()\"\n        >\n          <cds-icon shape=\"bars\"></cds-icon>\n        </button>\n        <span class=\"page-index\">{{ activeStepIndex }}.&nbsp;</span>{{ page.title }}\n      </ng-template>\n\n      <ng-template clrPageNavTitle>\n        <!-- TODO: Should remove these cds-icon tags when clarity fixes https://github.com/vmware/clarity/issues/3976 -->\n        <cds-icon\n          shape=\"success-standard\"\n          class=\"clr-sr-only\"\n          status=\"success\"\n          *ngIf=\"clrWizardPage.completed\"\n          [class.is-inverse]=\"clrWizardPage.current\"\n          [attr.title]=\"workflowStrings.step.completed\"\n        ></cds-icon>\n        <cds-icon\n          shape=\"pencil\"\n          class=\"clr-sr-only\"\n          *ngIf=\"clrWizardPage.enabled && !clrWizardPage.completed\"\n          [class.is-inverse]=\"clrWizardPage.current\"\n          [attr.title]=\"workflowStrings.step.inProgress\"\n        ></cds-icon>\n        {{ page.navTitle || page.title }}\n      </ng-template>\n      <appfx-step-container [step]=\"page\" [description]=\"page.description\" class=\"content-container clr-flex-column\">\n      </appfx-step-container>\n    </clr-wizard-page>\n  </ng-container>\n\n  <appfx-spinner\n    *ngIf=\"isLoading\"\n    [message]=\"workflowStrings.loading\"\n    [progressDetails]=\"pageProgressDetails\"\n    [showActionButton]=\"showProgressCancelButton\"\n    [actionButtonLabel]=\"cancelValidationButtonLabel\"\n    (actionClick)=\"cancelPageValidation()\"\n  ></appfx-spinner>\n</clr-wizard>\n",
			styles: [".app-wizard .btn-close-stepnav{display:none;border:0;background:transparent;padding:0}.app-wizard .btn-close-stepnav cds-icon{cursor:pointer}.app-wizard .btn-show-stepnav{display:none;border:0;background:transparent}.app-wizard .btn-show-stepnav cds-icon{cursor:pointer}.app-wizard .page-index{display:none}.app-wizard .appfx-wizard-footer{flex:1 1 auto;overflow:hidden;margin-right:auto}.app-wizard.zoom2x.showNav ::ng-deep .clr-wizard-stepnav{overflow:auto}.app-wizard ::ng-deep appfx-spinner{left:27%;width:73%}.app-wizard ::ng-deep clr-spinner{position:static!important}.app-wizard ::ng-deep div.clr-wizard-body-wrapper{display:flex;flex:1 1 auto;width:100%}.app-wizard ::ng-deep main.clr-wizard-content{height:100%;display:flex;flex-direction:column}.app-wizard ::ng-deep .btn.btn-link.clr-wizard-stepnav-link{height:unset;max-width:unset}.app-wizard ::ng-deep .clr-wizard-stepnav-link-title{overflow-wrap:break-word;white-space:normal;line-height:1.2rem}.app-wizard.zoom2x ::ng-deep appfx-spinner,.app-wizard.zoom4x ::ng-deep appfx-spinner{left:0;width:100%}.app-wizard.zoom2x ::ng-deep .clr-wizard-stepnav-wrapper,.app-wizard.zoom4x ::ng-deep .clr-wizard-stepnav-wrapper{display:none}.app-wizard.zoom2x ::ng-deep .modal,.app-wizard.zoom4x ::ng-deep .modal{overflow:visible}.app-wizard.zoom2x clr-wizard-page appfx-step-container.content-container,.app-wizard.zoom4x clr-wizard-page appfx-step-container.content-container{height:auto}.app-wizard.zoom2x .btn-show-stepnav,.app-wizard.zoom2x .page-index,.app-wizard.zoom4x .btn-show-stepnav,.app-wizard.zoom4x .page-index{display:inline-flex;padding-left:0}.app-wizard.zoom2x .btn-show-stepnav cds-icon,.app-wizard.zoom4x .btn-show-stepnav cds-icon{fill:var(--clr-wizard-main-text-color)}.app-wizard.zoom2x.showNav ::ng-deep .modal-dialog>.clr-wizard-content-wrapper>.clr-wizard-stepnav-wrapper,.app-wizard.zoom4x.showNav ::ng-deep .modal-dialog>.clr-wizard-content-wrapper>.clr-wizard-stepnav-wrapper{display:inherit;position:absolute;width:100%;height:100%;max-width:unset;padding:0;z-index:1001}.app-wizard.zoom2x.showNav .btn-close-stepnav,.app-wizard.zoom4x.showNav .btn-close-stepnav{display:inherit}.app-wizard.zoom2x.showNav .btn-close-stepnav cds-icon,.app-wizard.zoom4x.showNav .btn-close-stepnav cds-icon{vertical-align:baseline;fill:var(--clr-wizard-main-text-color)}.app-wizard.zoom4x ::ng-deep .modal{padding:0}.app-wizard.zoom4x ::ng-deep .modal .modal-dialog{width:100%;height:100%;margin:0;min-height:unset}.app-wizard.zoom4x ::ng-deep .clr-wizard-main-content{display:block;overflow-y:auto}.app-wizard.zoom4x ::ng-deep .clr-wizard-main-content .clr-wizard-body{overflow-y:hidden;max-height:unset;height:unset}.app-wizard.zoom4x ::ng-deep .modal-footer{position:sticky;bottom:0;background-color:inherit;min-height:3.2rem;height:3.2rem;padding-top:.7rem;z-index:1000}.app-wizard clr-wizard-page{height:100%;padding-bottom:0}.app-wizard clr-wizard-page.is-loading{pointer-events:none;cursor:not-allowed;opacity:.6}.app-wizard clr-wizard-page.is-loading .div-disabled{opacity:1}.app-wizard clr-wizard-page .first-row{line-height:1.2rem;padding-top:.39996rem;font-size:.650004rem;margin-bottom:.84rem;margin-top:.3rem}.app-wizard clr-wizard-page appfx-validation-banner~form .form-group{margin-bottom:3px;margin-top:2px}.app-wizard clr-wizard-page appfx-validation-banner~*{padding-top:.3rem}.app-wizard clr-wizard-page appfx-validation-banner~*>span{line-height:1.2rem;padding-top:.39996rem;font-size:.650004rem;margin-bottom:9px}.app-wizard clr-wizard-page appfx-validation-banner~*~*{padding-top:0}.app-wizard clr-wizard-page .alert-item{align-items:center}.app-wizard clr-wizard-page appfx-step-container{height:100%;flex-flow:column;display:flex}.debug-popup ::ng-deep clr-modal>div>div.modal-dialog.modal-xl{margin-left:350px}\n"],
			dependencies: [
				{
					kind: "component",
					type: i1.ValidationBannerComponent,
					selector: "appfx-validation-banner",
					inputs: ["state", "closable"]
				},
				{
					kind: "component",
					type: i1.StepContainerComponent,
					selector: "appfx-step-container",
					inputs: ["step", "description"],
					outputs: ["onRetry"]
				},
				{
					kind: "component",
					type: i1.WorkflowModelMonitorComponent,
					selector: "appfx-model-popup",
					inputs: ["modelMgr"]
				},
				{
					kind: "component",
					type: i1.SpinnerComponent,
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
					type: i4.ClrWizard,
					selector: "clr-wizard",
					inputs: [
						"clrWizardStepnavAriaLabel",
						"clrWizardStepnavLayout",
						"clrWizardSize",
						"clrWizardInPage",
						"clrWizardInPageFillContentArea",
						"clrWizardHideFooter",
						"clrWizardFooterAlign",
						"clrWizardClosable",
						"clrWizardPreventModalAnimation",
						"clrWizardForceForwardNavigation",
						"clrWizardOpen",
						"clrWizardPreventDefaultNext",
						"clrWizardPreventDefaultCancel",
						"clrWizardPreventNavigation",
						"clrWizardDisableStepnav"
					],
					outputs: [
						"clrWizardOpenChange",
						"clrWizardOnCancel",
						"clrWizardOnFinish",
						"clrWizardOnReset",
						"clrWizardCurrentPageChange",
						"clrWizardOnNext",
						"clrWizardOnPrevious"
					]
				},
				{
					kind: "component",
					type: i4.ClrWizardPage,
					selector: "clr-wizard-page",
					inputs: [
						"id",
						"clrWizardPagePreventDefault",
						"clrWizardPageNextDisabled",
						"clrWizardPagePreviousDisabled",
						"clrWizardPageHasError",
						"clrWizardPagePreventDefaultCancel",
						"clrWizardPagePreventDefaultNext"
					],
					outputs: [
						"clrWizardPageNextDisabledChange",
						"clrWizardPagePreviousDisabledChange",
						"clrWizardPagePreventDefaultCancelChange",
						"clrWizardPageOnCommit",
						"clrWizardPageOnLoad",
						"clrWizardPageOnCancel",
						"clrWizardPageFinish",
						"clrWizardPagePrevious",
						"clrWizardPageNext",
						"clrWizardPageDanger",
						"clrWizardPagePrimary",
						"clrWizardPageCustomButton"
					]
				},
				{
					kind: "component",
					type: i4.ClrWizardButton,
					selector: "clr-wizard-button",
					inputs: [
						"type",
						"clrWizardButtonDisabled",
						"clrWizardButtonHidden"
					],
					outputs: ["clrWizardButtonClicked"]
				},
				{
					kind: "directive",
					type: i4.ClrWizardTitle,
					selector: "clr-wizard-title",
					inputs: ["clrHeadingLevel"]
				},
				{
					kind: "directive",
					type: i4.ClrWizardPageTitle,
					selector: "[clrPageTitle]",
					inputs: ["clrHeadingLevel"]
				},
				{
					kind: "directive",
					type: i4.ClrWizardPageNavTitle,
					selector: "[clrPageNavTitle]"
				},
				{
					kind: "component",
					type: i5.ClrIcon,
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
					kind: "directive",
					type: i2$1.NgComponentOutlet,
					selector: "[ngComponentOutlet]",
					inputs: [
						"ngComponentOutlet",
						"ngComponentOutletInputs",
						"ngComponentOutletInjector",
						"ngComponentOutletEnvironmentInjector",
						"ngComponentOutletContent",
						"ngComponentOutletNgModule"
					],
					exportAs: ["ngComponentOutlet"]
				},
				{
					kind: "directive",
					type: i2$1.NgForOf,
					selector: "[ngFor][ngForOf]",
					inputs: [
						"ngForOf",
						"ngForTrackBy",
						"ngForTemplate"
					]
				},
				{
					kind: "directive",
					type: i2$1.NgIf,
					selector: "[ngIf]",
					inputs: [
						"ngIf",
						"ngIfThen",
						"ngIfElse"
					]
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
	type: WizardComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-wizard",
			changeDetection: ChangeDetectionStrategy.Eager,
			standalone: false,
			providers: [RelevanceService, WorkflowModelManager],
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-wizard\n  #wizard\n  [(clrWizardOpen)]=\"opened\"\n  [clrWizardSize]=\"size\"\n  class=\"app-wizard\"\n  [class.zoom2x]=\"currentZoomLevel === ZoomLevel.x2\"\n  [class.zoom4x]=\"currentZoomLevel === ZoomLevel.x4\"\n  [class.showNav]=\"showNav\"\n  [class.debug-popup]=\"isSignPostOpen\"\n>\n  <clr-wizard-title *ngIf=\"!configService.debug\" [attr.data-test-id]=\"'appfx-wizard-title'\">\n    <button\n      class=\"btn-close-stepnav\"\n      [attr.aria-label]=\"workflowStrings.closeStepNavAriaLabel\"\n      (click)=\"showNav = false\"\n    >\n      <cds-icon direction=\"left\" shape=\"angle\" class=\"stepnav-close\"></cds-icon>\n    </button>\n    {{ title }}\n  </clr-wizard-title>\n  <clr-wizard-title *ngIf=\"configService.debug\" [attr.data-test-id]=\"'appfx-wizard-title'\">\n    <appfx-model-popup [modelMgr]=\"modelMgr\"></appfx-model-popup>\n    <button\n      class=\"btn-close-stepnav\"\n      [attr.aria-label]=\"workflowStrings.closeStepNavAriaLabel\"\n      (click)=\"showNav = false\"\n    >\n      <cds-icon direction=\"left\" shape=\"angle\" class=\"stepnav-close\"></cds-icon>\n    </button>\n    {{ title }}\n  </clr-wizard-title>\n\n  <div *ngIf=\"footer?.componentClass\" ngProjectAs=\"clr-wizard-button\" class=\"appfx-wizard-footer\">\n    <ng-container\n      [ngComponentOutlet]=\"footer.componentClass\"\n      [ngComponentOutletInputs]=\"footerComponentInputs\"\n    ></ng-container>\n  </div>\n\n  <clr-wizard-button [type]=\"'cancel'\">{{ workflowStrings.cancel }}</clr-wizard-button>\n  <clr-wizard-button [type]=\"'previous'\">{{ workflowStrings.back }}</clr-wizard-button>\n  <clr-wizard-button [type]=\"'next'\">{{ workflowStrings.next }}</clr-wizard-button>\n  <clr-wizard-button [type]=\"'finish'\">{{ workflowStrings.finish }}</clr-wizard-button>\n\n  <!-- A wizard with empty pages cannot be opened with latest Clarity 15 and above. -->\n  <!-- We need an empty placeholder page, in order to be able to use wizards with asynchronous page loading. -->\n  <!-- More details: https://github.com/vmware-clarity/ng-clarity/issues/1108 -->\n  <ng-container *ngIf=\"!pages?.length\">\n    <clr-wizard-page>\n      <ng-template clrPageTitle> </ng-template>\n    </clr-wizard-page>\n  </ng-container>\n\n  <appfx-validation-banner\n    *ngIf=\"closeHandlerValidationState.errors?.length\"\n    cds-layout=\"m-b:sm\"\n    [state]=\"closeHandlerValidationState\"\n  >\n  </appfx-validation-banner>\n  <ng-container *ngFor=\"let page of pagesInternal; let pageIndex = index\">\n    <clr-wizard-page\n      #clrWizardPage\n      *ngIf=\"!page.isSkipped\"\n      class=\"pb-0\"\n      [class.pt-0]=\"page.description\"\n      [clrWizardPageNextDisabled]=\"isNextButtonDisabled\"\n      [class.is-loading]=\"isLoading\"\n      clrWizardPagePreventDefault=\"true\"\n      (clrWizardPageOnCommit)=\"onWizardCommit()\"\n      (clrWizardPageOnCancel)=\"onWizardCancel()\"\n      (clrWizardPagePrevious)=\"onWizardBack()\"\n      (clrWizardPageOnLoad)=\"onWizardPageActivated(page)\"\n      [attr.data-test-id]=\"'appfx-wizard-step-content'\"\n    >\n      <ng-template clrPageTitle>\n        <button\n          class=\"btn-show-stepnav\"\n          [attr.aria-label]=\"workflowStrings.openStepNavAriaLabel\"\n          (click)=\"openStepNavPanel()\"\n        >\n          <cds-icon shape=\"bars\"></cds-icon>\n        </button>\n        <span class=\"page-index\">{{ activeStepIndex }}.&nbsp;</span>{{ page.title }}\n      </ng-template>\n\n      <ng-template clrPageNavTitle>\n        <!-- TODO: Should remove these cds-icon tags when clarity fixes https://github.com/vmware/clarity/issues/3976 -->\n        <cds-icon\n          shape=\"success-standard\"\n          class=\"clr-sr-only\"\n          status=\"success\"\n          *ngIf=\"clrWizardPage.completed\"\n          [class.is-inverse]=\"clrWizardPage.current\"\n          [attr.title]=\"workflowStrings.step.completed\"\n        ></cds-icon>\n        <cds-icon\n          shape=\"pencil\"\n          class=\"clr-sr-only\"\n          *ngIf=\"clrWizardPage.enabled && !clrWizardPage.completed\"\n          [class.is-inverse]=\"clrWizardPage.current\"\n          [attr.title]=\"workflowStrings.step.inProgress\"\n        ></cds-icon>\n        {{ page.navTitle || page.title }}\n      </ng-template>\n      <appfx-step-container [step]=\"page\" [description]=\"page.description\" class=\"content-container clr-flex-column\">\n      </appfx-step-container>\n    </clr-wizard-page>\n  </ng-container>\n\n  <appfx-spinner\n    *ngIf=\"isLoading\"\n    [message]=\"workflowStrings.loading\"\n    [progressDetails]=\"pageProgressDetails\"\n    [showActionButton]=\"showProgressCancelButton\"\n    [actionButtonLabel]=\"cancelValidationButtonLabel\"\n    (actionClick)=\"cancelPageValidation()\"\n  ></appfx-spinner>\n</clr-wizard>\n",
			styles: [".app-wizard .btn-close-stepnav{display:none;border:0;background:transparent;padding:0}.app-wizard .btn-close-stepnav cds-icon{cursor:pointer}.app-wizard .btn-show-stepnav{display:none;border:0;background:transparent}.app-wizard .btn-show-stepnav cds-icon{cursor:pointer}.app-wizard .page-index{display:none}.app-wizard .appfx-wizard-footer{flex:1 1 auto;overflow:hidden;margin-right:auto}.app-wizard.zoom2x.showNav ::ng-deep .clr-wizard-stepnav{overflow:auto}.app-wizard ::ng-deep appfx-spinner{left:27%;width:73%}.app-wizard ::ng-deep clr-spinner{position:static!important}.app-wizard ::ng-deep div.clr-wizard-body-wrapper{display:flex;flex:1 1 auto;width:100%}.app-wizard ::ng-deep main.clr-wizard-content{height:100%;display:flex;flex-direction:column}.app-wizard ::ng-deep .btn.btn-link.clr-wizard-stepnav-link{height:unset;max-width:unset}.app-wizard ::ng-deep .clr-wizard-stepnav-link-title{overflow-wrap:break-word;white-space:normal;line-height:1.2rem}.app-wizard.zoom2x ::ng-deep appfx-spinner,.app-wizard.zoom4x ::ng-deep appfx-spinner{left:0;width:100%}.app-wizard.zoom2x ::ng-deep .clr-wizard-stepnav-wrapper,.app-wizard.zoom4x ::ng-deep .clr-wizard-stepnav-wrapper{display:none}.app-wizard.zoom2x ::ng-deep .modal,.app-wizard.zoom4x ::ng-deep .modal{overflow:visible}.app-wizard.zoom2x clr-wizard-page appfx-step-container.content-container,.app-wizard.zoom4x clr-wizard-page appfx-step-container.content-container{height:auto}.app-wizard.zoom2x .btn-show-stepnav,.app-wizard.zoom2x .page-index,.app-wizard.zoom4x .btn-show-stepnav,.app-wizard.zoom4x .page-index{display:inline-flex;padding-left:0}.app-wizard.zoom2x .btn-show-stepnav cds-icon,.app-wizard.zoom4x .btn-show-stepnav cds-icon{fill:var(--clr-wizard-main-text-color)}.app-wizard.zoom2x.showNav ::ng-deep .modal-dialog>.clr-wizard-content-wrapper>.clr-wizard-stepnav-wrapper,.app-wizard.zoom4x.showNav ::ng-deep .modal-dialog>.clr-wizard-content-wrapper>.clr-wizard-stepnav-wrapper{display:inherit;position:absolute;width:100%;height:100%;max-width:unset;padding:0;z-index:1001}.app-wizard.zoom2x.showNav .btn-close-stepnav,.app-wizard.zoom4x.showNav .btn-close-stepnav{display:inherit}.app-wizard.zoom2x.showNav .btn-close-stepnav cds-icon,.app-wizard.zoom4x.showNav .btn-close-stepnav cds-icon{vertical-align:baseline;fill:var(--clr-wizard-main-text-color)}.app-wizard.zoom4x ::ng-deep .modal{padding:0}.app-wizard.zoom4x ::ng-deep .modal .modal-dialog{width:100%;height:100%;margin:0;min-height:unset}.app-wizard.zoom4x ::ng-deep .clr-wizard-main-content{display:block;overflow-y:auto}.app-wizard.zoom4x ::ng-deep .clr-wizard-main-content .clr-wizard-body{overflow-y:hidden;max-height:unset;height:unset}.app-wizard.zoom4x ::ng-deep .modal-footer{position:sticky;bottom:0;background-color:inherit;min-height:3.2rem;height:3.2rem;padding-top:.7rem;z-index:1000}.app-wizard clr-wizard-page{height:100%;padding-bottom:0}.app-wizard clr-wizard-page.is-loading{pointer-events:none;cursor:not-allowed;opacity:.6}.app-wizard clr-wizard-page.is-loading .div-disabled{opacity:1}.app-wizard clr-wizard-page .first-row{line-height:1.2rem;padding-top:.39996rem;font-size:.650004rem;margin-bottom:.84rem;margin-top:.3rem}.app-wizard clr-wizard-page appfx-validation-banner~form .form-group{margin-bottom:3px;margin-top:2px}.app-wizard clr-wizard-page appfx-validation-banner~*{padding-top:.3rem}.app-wizard clr-wizard-page appfx-validation-banner~*>span{line-height:1.2rem;padding-top:.39996rem;font-size:.650004rem;margin-bottom:9px}.app-wizard clr-wizard-page appfx-validation-banner~*~*{padding-top:0}.app-wizard clr-wizard-page .alert-item{align-items:center}.app-wizard clr-wizard-page appfx-step-container{height:100%;flex-flow:column;display:flex}.debug-popup ::ng-deep clr-modal>div>div.modal-dialog.modal-xl{margin-left:350px}\n"]
		}]
	}],
	ctorParameters: () => [
		{ type: i0.ChangeDetectorRef },
		{ type: i1.WorkflowModelManager },
		{ type: i1.RelevanceService },
		{ type: i1.WorkflowConfigurationService },
		{ type: i2.WorkflowStrings },
		{
			type: i3.ZoomLevelService,
			decorators: [{ type: Optional }]
		},
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [modalServiceToken]
			}, { type: Optional }]
		}
	],
	propDecorators: {
		title: [{ type: Input }],
		loading: [{ type: Input }],
		closeHandler: [{ type: Input }],
		footer: [{ type: Input }],
		size: [{ type: Input }],
		openedChange: [{ type: Output }],
		onModelChange: [{ type: Output }],
		onFinish: [{ type: Output }],
		onClose: [{ type: Output }],
		wizard: [{
			type: ViewChild,
			args: ["wizard", { static: true }]
		}],
		debugPopup: [{
			type: ViewChild,
			args: [WorkflowModelMonitor, { static: false }]
		}],
		pagesContainers: [{
			type: ViewChildren,
			args: [StepContainer]
		}],
		pages: [{ type: Input }],
		wizardModel: [{ type: Input }],
		opened: [{ type: Input }]
	}
});
var Reason;
(function(Reason) {
	Reason["finish"] = "finish";
	Reason["cancel"] = "cancel";
})(Reason || (Reason = {}));
const preventDisplayingWizardError = /* @__PURE__ */ new Error("AppfxWizard error is not set.");
const clarityDependencies = [ClrWizardModule, ClrIcon];
const appfxDependencies = [PropertyViewModule, AppfxWorkflowCoreModule];
var AppfxWizardModule = class AppfxWizardModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxWizardModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxWizardModule,
			declarations: [SummaryComponent, WizardComponent],
			imports: [
				PropertyViewModule,
				AppfxWorkflowCoreModule,
				ClrWizardModule,
				ClrIcon,
				CommonModule,
				FormsModule,
				ReactiveFormsModule
			],
			exports: [WizardComponent]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxWizardModule,
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
	type: AppfxWizardModule,
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
			declarations: [SummaryComponent, WizardComponent],
			exports: [WizardComponent]
		}]
	}]
});
var WorkflowService = class {
	constructor() {
		this.currentFlow = [];
		this.stepsByFlowId = {};
	}
	get flow() {
		return this.currentFlow;
	}
	addWorkflow(flowId, steps) {
		if (Object.prototype.hasOwnProperty.call(this.stepsByFlowId, flowId)) throw new Error(`Duplicate workflow id: ${flowId}`);
		this.stepsByFlowId[flowId] = steps;
		if (Object.keys(this.stepsByFlowId).length === 1) this.switchToWorkflow(flowId);
	}
	switchToWorkflow(newFlowId) {
		const flowSteps = this.stepsByFlowId[newFlowId];
		if (!flowSteps) throw new Error(`Flow with id=${newFlowId} does not exist!`);
		this.currentFlow = flowSteps;
	}
};
export { AppfxWizardModule, Reason, SummaryComponent, SummaryModel, WizardComponent as Wizard, WizardComponent, WorkflowService, preventDisplayingWizardError };

//# sourceMappingURL=clr-addons-wizard.mjs.map