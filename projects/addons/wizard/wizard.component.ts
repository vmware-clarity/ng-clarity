/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { QueryList } from '@angular/core';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { PropertyViewBuilder } from '@clr/addons/property-view';
import {
  CloseHandler,
  formatError,
  InjectPropertiesResult,
  modalServiceToken,
  ModelChange,
  RelevanceService,
  Step,
  StepContainer,
  StepInternal,
  StepValidationState,
  WizardFooterConfig,
  WorkflowConfigurationService,
  WorkflowModel,
  WorkflowModelManager,
  WorkflowModelMonitor,
} from '@clr/addons/var';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { ClarityIcons, dotCircleIcon } from '@clr/angular/icon';
import type { ClrWizard } from '@clr/angular/wizard';
import { combineLatest, Observable, of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { SummaryComponent } from './summary/summary.component';
import { SummaryModel } from './summary/summary.model';

/**
 * Component used to render the composition of wizard page components and apply the base
 * wizard workflow provided by the clarity wizard component.
 */
@Component({
  selector: 'appfx-wizard',
  standalone: false,
  templateUrl: 'wizard.component.html',
  styleUrls: ['wizard.component.scss'],
  providers: [RelevanceService, WorkflowModelManager],
})
export class WizardComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
  /**
   * The wizard title. It's mandatory.
   */
  @Input() title: string;

  @Input() loading = false;

  /**
   * Object containing callback methods that will be invoked when the Wizard is Finished or Cancelled.
   * onSubmit is invoked when the user clicks the Finish button.
   * onCancel is invoked when the user clicks Cancel or X (close) button.
   * You can perform the actions you want there (i.e. modify something).
   * Wizard will wait for the successful result and then will close.
   * If there is an error, it will be displayed in the wizard that will remain open.
   */
  @Input() closeHandler: CloseHandler;

  /**
   * Optional footer configuration. The component specified in {@link WizardFooterConfig.componentClass}
   * is rendered in the wizard footer before the action buttons.
   * The wizard injects the current step, all steps, and the {@link WorkflowModel} whenever the active step changes.
   */
  @Input() footer: WizardFooterConfig;

  /**
   * Clarity Wizard size - 'md', 'lg', 'xl' and 'full-screen'.
   * Default is 'lg'.
   */
  @Input() size = 'lg';

  /**
   * Emits when {@link opened} input is changed.
   */
  @Output() openedChange = new EventEmitter<boolean>();

  /**
   * Dispatches when any of the workflow state's variables changes.
   */
  @Output() onModelChange: EventEmitter<ModelChange[]> = new EventEmitter<ModelChange[]>();

  /**
   * Dispatched when the wizard is finishing via the Finish button.
   * You can perform the actions you want there (i.e modify or create something)
   */
  @Output() onFinish: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Dispatched when the wizard is closed (in all three cases: via the close button
   * or the cancel button or the finish button)
   */
  @Output() onClose: EventEmitter<Reason> = new EventEmitter<Reason>();

  footerComponentInputs: Record<string, unknown>;
  currentZoomLevel: ZoomLevel;
  ZoomLevel = ZoomLevel;
  showNav = false;
  activeStepIndex = 1;

  protected closeHandlerValidationState = new StepValidationState();

  @ViewChild('wizard', { static: true }) private wizard: ClrWizard;

  @ViewChild(WorkflowModelMonitor, { static: false }) private debugPopup: WorkflowModelMonitor;

  @ViewChildren(StepContainer) private pagesContainers: QueryList<StepContainer>;

  private activeStep: StepInternal | undefined;
  private activePage: StepContainer | undefined;
  private awaitingWizardPageOnLoad$: ReplaySubject<StepInternal> = new ReplaySubject(Infinity);
  private componentAfterViewInit$: Subject<void> = new Subject();
  private subscriptions = new Subscription();
  private retrySubscription: Subscription;
  private errorActivatingStep = false;
  private summaryStep: StepInternal;

  #pages: StepInternal[];
  #opened: boolean = true;
  #wizardModel: any;

  constructor(
    private cdr: ChangeDetectorRef,
    public modelMgr: WorkflowModelManager,
    private relevanceService: RelevanceService,
    public configService: WorkflowConfigurationService,
    public workflowStrings: WorkflowStrings,
    @Optional() private zoomLevelService?: ZoomLevelService,
    /**
     * openModalComponent = undefined - Wizard is used without ModalService
     * openModalComponent = true  - opened using ModalService.openModalComponent API
     * openModalComponent = false - opened using ModalService.openModal API
     */
    @Inject(modalServiceToken) @Optional() openModalComponent?: boolean
  ) {
    if (openModalComponent === false) {
      // This means that the Wizard was opened using ModalService, but using wrong method.
      throw new Error('AppFx Wizard must be opened using ModalService.openModalComponent method.');
    }

    ClarityIcons.addIcons(dotCircleIcon);
  }

  /**
   * The descriptions of the pages that are visualized.
   */
  get pages(): Step[] {
    return this.#pages;
  }

  @Input()
  set pages(value: Step[]) {
    if (value && value.some(step => !!step.summary)) {
      // if at least one step has summary defined, append summary page.
      this.appendSummaryPage(value);
      this.subscriptions.add(
        this.relevanceService.onStepRelevanceChange$().subscribe(() => {
          this.recalculateSummaryPageSkipState();
        })
      );
    }

    this.relevanceService.steps = value;
    this.subscriptions.add(
      this.relevanceService
        .checkComplete$()
        .pipe(take(1))
        .subscribe((steps: Step[]) => {
          this.#pages = steps;
          this.modelMgr.steps = steps;
          this.recalculateSummaryPageSkipState();
        })
    );
  }

  get pagesInternal(): StepInternal[] {
    return this.#pages;
  }

  /**
   * You can supply here any structure you like. As long as it has the
   * needed properties to inject to the page models and eject back from
   * the page models.
   *
   * If not specified, the pages will simply stay disconnected from each other,
   * so you would need other means of communication between them.
   */
  get wizardModel(): WorkflowModel {
    return this.#wizardModel;
  }

  @Input()
  set wizardModel(value: WorkflowModel) {
    this.#wizardModel = value;
    this.modelMgr.model = value;
  }

  /**
   * Open/close the wizard. Default value is `true`.
   * If the wizard is closed and then re-opened again, the wizard is reset.
   *
   * This input should not be set when the wizard is opened through the ModalService.
   * Its primary use case is when the wizard is used outside vSphere UI.
   */
  get opened(): boolean {
    return this.#opened;
  }

  @Input()
  set opened(value: boolean) {
    if (!this.#opened && value) {
      // The wizard was closed and is re-opened.
      this.reset();
    }
    this.#opened = value;
    this.openedChange.next(value);
  }

  // Accessible from the component HTML
  get isLoading(): boolean {
    return (
      this.loading || // explicitly set as busy
      this.relevanceService.loading || // check if relevanceCheck computation in progress
      // additionally inspect pages containers and see if any one is loading
      (!!this.pagesContainers &&
        this.pagesContainers.some(
          (value: StepContainer) => !!value.step.modelInstance && !!value.step.modelInstance.loading
        ))
    );
  }

  get pageProgressDetails(): string {
    return this.activeStep?.modelInstance?.progressStatus || '';
  }

  get showProgressCancelButton(): boolean {
    return typeof this.activeStep?.modelInstance?.cancelableValidation?.cancelValidation === 'function';
  }

  get cancelValidationButtonLabel(): string {
    return this.activeStep?.modelInstance?.cancelableValidation?.cancelButtonLabel || '';
  }

  get isSignPostOpen(): boolean {
    return !!(this.debugPopup && this.debugPopup.isOpen);
  }

  get isNextButtonDisabled(): boolean {
    return this.isLoading || this.errorActivatingStep || (this.activePage ? !this.activePage.readyToComplete : false);
  }

  cancelPageValidation(): void {
    if (typeof this.activeStep?.modelInstance?.cancelableValidation?.cancelValidation === 'function') {
      this.activeStep?.modelInstance?.cancelableValidation.cancelValidation();
    }
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.modelMgr.onModelChange$.subscribe((changes: ModelChange[]) => {
        this.onModelChange.emit(changes);
        this.invalidateNextSteps();
      })
    );
    this.subscriptions.add(
      this.modelMgr.loading$.subscribe((loading: boolean) => {
        this.loading = loading;
        this.cdr.detectChanges();
      })
    );
    if (this.zoomLevelService) {
      this.subscriptions.add(
        this.zoomLevelService.onChange.subscribe((level: ZoomLevel) => {
          this.currentZoomLevel = level;
          this.cdr.detectChanges();
        })
      );
    }
  }

  ngOnDestroy() {
    this.pages = [];
    this.activeStep = undefined;
    this.subscriptions.unsubscribe();
    this.unsubscribeRetry();
    this.relevanceService.destroy();
    this.modelMgr.destroy();
  }

  ngAfterViewInit() {
    this.patchWizardNavigationService();
    if (this.pagesContainers.length) {
      // If relevance checks are fast enough (or there are no relevance checks), _pagesContainers will be initialized.
      this.componentAfterViewInit$.next();
    } else {
      // Relevance checks may take some time, wait for _pagesContainers to initialize
      this.pagesContainers.changes.pipe(take(1)).subscribe(() => this.componentAfterViewInit$.next());
    }
  }

  ngAfterContentInit() {
    // upon getting a wizard page onLoad signal and safely ensuring component has instantiated itself with `AppfxWizardPage`
    // elements in the template, only then activate the pending container
    this.subscriptions.add(
      combineLatest([this.componentAfterViewInit$, this.awaitingWizardPageOnLoad$])
        .pipe(
          filter(() => !!this.pagesContainers),
          switchMap(([, pendingStep]) => this.modelMgr.injectPropertiesToPendingStep(pendingStep))
        )
        .subscribe(result => {
          this.errorActivatingStep = !!result.error;
          this.activatePendingContainer(result);
        })
    );
  }

  onWizardPageActivated(page: StepInternal) {
    this.showNav = false;
    this.awaitingWizardPageOnLoad$.next(page);
  }

  onWizardCommit(): void {
    this.commitActiveStep()
      .pipe(
        take(1),
        filter(isValid => isValid)
      )
      .subscribe(() => {
        if (this.wizard.navService.currentPageIsLast) {
          const close$ = this.closeHandler?.onSubmit?.() || of(Reason.finish);
          this.subscribeForFinishHandler(close$);
        } else {
          this.wizard.forceNext();
        }
      });
  }

  onWizardCancel() {
    if (!this.wizard) {
      return;
    }

    this.subscribeForCloseHandler(this.closeHandler?.onCancel?.() || of(Reason.cancel));
  }

  onWizardBack() {
    if (!this.wizard) {
      return;
    }

    // Hide the loading indicator of the current page, if any.
    if (this.activeStep && this.activeStep.modelInstance) {
      this.activeStep.modelInstance.loading = false;
    }

    this.wizard.navService.previous();
  }

  openStepNavPanel(): void {
    this.showNav = true;
  }

  private subscribeForFinishHandler(finish$: Observable<any>): void {
    this.loading = true;
    finish$.subscribe({
      error: (error: unknown) => {
        this.loading = false;
        if (error !== preventDisplayingWizardError) {
          this.closeHandlerValidationState.errors = [
            formatError(error).data.message || this.workflowStrings.defaultWizardSubmitError,
          ];
        }
      },
      complete: () => {
        this.loading = false;
        this.closeHandlerValidationState.errors = [];
        this.onFinish.emit();
        this.wizard.forceFinish();
        this.closeWizard(Reason.finish);
      },
    });
  }

  private subscribeForCloseHandler(close$: Observable<any>): void {
    this.loading = true;
    close$.subscribe({
      error: (error: unknown) => {
        this.loading = false;
        if (error !== preventDisplayingWizardError) {
          this.closeHandlerValidationState.errors = [
            formatError(error).data.message || this.workflowStrings.defaultWizardSubmitError,
          ];
        }
      },
      complete: () => {
        this.loading = false;
        this.closeHandlerValidationState.errors = [];
        this.wizard.close();
        this.closeWizard(Reason.cancel);
      },
    });
  }

  private closeWizard(reason: Reason) {
    this.onClose.emit(reason);
  }

  private appendSummaryPage(steps: Step[]) {
    const summaryModel = new SummaryModel();
    this.summaryStep = {
      title: this.workflowStrings.summary.title,
      description: this.workflowStrings.summary.description,
      componentClass: SummaryComponent,
      model: () => {
        const propertyViewModelBuilder = new PropertyViewBuilder();
        const propertyViewModel = propertyViewModelBuilder.build();
        const categoryBuilder = propertyViewModelBuilder.generateAllCategory(''); // No title for category.
        const category = categoryBuilder.build();
        const sections = this.#pages
          .filter(step => !step.isSkipped && !!step.summary)
          .map(step =>
            step.summary?.(categoryBuilder.section(step.title).title(step.navTitle || step.title), step.modelInstance)
          );
        category.content = sections;
        propertyViewModel.categories = [category];
        summaryModel.data = propertyViewModel;
        return summaryModel;
      },
      instantiateLazy: true,
      recreateComponent: () => true,
    };
    steps.push(this.summaryStep);
  }

  private commitActiveStep(): Observable<boolean> {
    if (!this.activePage) {
      return of(false);
    }
    this.loading = true;
    return this.activePage.onCommit().pipe(
      switchMap(isValid => {
        if (isValid) {
          this.modelMgr.ejectPropertiesFromCurrentStep(this.activeStep);
          return this.relevanceService.checkComplete$().pipe(
            map(() => {
              return isValid;
            })
          );
        }
        return of(isValid);
      }),
      tap(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    );
  }

  private activatePendingContainer(result: InjectPropertiesResult): void {
    this.unsubscribeRetry();
    const pendingPage = this.pagesContainers.find((item: StepContainer) => item.step === result.pendingStep);

    if (pendingPage) {
      if (result.error) {
        this.retrySubscription = pendingPage.onRetry
          .pipe(take(1))
          .subscribe((step: StepInternal) => this.retryStepTransition(step));
      } else {
        this.activeStep = result.pendingStep;
        this.setActiveStepIndex();
        this.activePage = this.pagesContainers.find(item => item.step === this.activeStep);
        this.updateFooterComponent();
      }

      // Finally activate the container
      pendingPage.onActivate(result.error, result.stepModelChanges, result.recreateComponent);

      // Force digest as activation trigger changes Clarity wizard. template conditionals must re-evaluate
      this.cdr.detectChanges();
    }
  }

  private updateFooterComponent(): void {
    if (!this.footer?.componentClass) {
      return;
    }

    this.footerComponentInputs = {
      currentStep: this.activeStep,
      steps: this.#pages,
      workflowModel: this.wizardModel,
    };
  }

  private retryStepTransition(step: StepInternal): void {
    this.onWizardPageActivated(step);
  }

  private invalidateNextSteps(): void {
    if (this.wizard.currentPage) {
      this.wizard.currentPage.completed = false;
      let nextPage = this.wizard.pageCollection.getNextPage(this.wizard.currentPage);
      while (nextPage) {
        nextPage.completed = false;
        nextPage = this.wizard.pageCollection.getNextPage(nextPage);
      }
    }
  }

  private unsubscribeRetry() {
    if (this.retrySubscription && !this.retrySubscription.closed) {
      this.retrySubscription.unsubscribe();
    }
  }

  private patchWizardNavigationService() {
    const navService = this.wizard.navService;
    const originalGoToFunction = navService.goTo;
    navService.goTo = (...args: [pageToGoToOrId: any, lazyComplete?: boolean | undefined]) => {
      const pages = this.wizard.pages.toArray();
      let firstIncompletePageIndex = pages.findIndex(p => !p.enabled) - 1;
      // if firstIncompletePageIndex is negative, Currently in last page, set firstIncompletePageIndex = pages.length - 1
      firstIncompletePageIndex = firstIncompletePageIndex < 0 ? pages.length - 1 : firstIncompletePageIndex;
      const activeContainerIndex = this.pagesContainers.toArray().findIndex(item => item === this.activePage);
      if (firstIncompletePageIndex === activeContainerIndex) {
        // When moving from incomplete step to previous steps, do not call commit
        originalGoToFunction.apply(navService, args);
      } else {
        this.commitActiveStep()
          .pipe(
            take(1),
            filter(isValid => isValid)
          )
          .subscribe(() => {
            originalGoToFunction.apply(navService, args);
          });
      }
    };
  }

  private setActiveStepIndex(): void {
    this.activeStepIndex =
      this.#pages
        .filter(page => {
          return !page.isSkipped;
        })
        .indexOf(this.activeStep as StepInternal) + 1;
  }

  /**
   * Reset the wizard. This means:
   * - recreate the page components
   * - reset page states (all pages are marked incomplete)
   * - first page is activated
   *
   * NOTE: Wizard and step models remain unchanged.
   */
  private reset(): void {
    if (this.wizard) {
      this.wizard.reset();
      if (this.pages) {
        // Recreate the pages.
        this.pages = this.pages.map(step => Object.assign({}, step));
      }
    }
  }

  private recalculateSummaryPageSkipState(): void {
    if (!this.summaryStep) {
      return;
    }
    const showDefaultPage =
      this.#pages &&
      this.#pages.some((step: StepInternal) => {
        return !step.isSkipped && step.summary;
      });

    this.summaryStep.isSkipped = !showDefaultPage;
  }
}

/**
 * Reason for Wizard close.
 */
export const enum Reason {
  /**
   * Wizard closed by clicking finish button.
   */
  finish = 'finish',
  /**
   * Wizard closed by clicking cancel button.
   */
  cancel = 'cancel',
}

/**
 * Result of Wizard Action passed to ModalRef.afterFinish()
 */
export interface WizardResult {
  /**
   * Reason for wizard close.
   * "finish" indicates wizard closed by clicking finish button.
   * "close" indicates wizard closed by clicking cancel button.
   */
  close: Reason;
}

/**
 * If this error is thrown from the closeHandler function, no error message will be displayed.
 * The wizard will remain open, and will be responsibility of the consumers to handle the error path.
 */
export const preventDisplayingWizardError = new Error('AppfxWizard error is not set.');
