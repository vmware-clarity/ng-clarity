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
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  InjectPropertiesResult,
  ModelChange,
  RelevanceService,
  Step,
  StepContainer,
  StepInternal,
  WorkflowModel,
  WorkflowModelManager,
} from '@clr/addons/var';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { CollapsiblePanelModel } from '@clr/angular/collapsible-panel';
import { ClrStepButton, ClrStepper, ClrStepperPanel, StepperPanelStatus, StepperService } from '@clr/angular/stepper';
import type { ClrCommonStrings } from '@clr/angular/utils';
import { BehaviorSubject, combineLatest, Observable, of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { filter, first, switchMap, take, tap } from 'rxjs/operators';

import { StepperStateService, StepState } from './state/stepper-state.service';
import { SummaryService } from './summary/summary.service';

/**
 * Component used to render the composition of step components as inline wizard
 * (using Clarity stepper component). Workflow of the steps is handled by the
 * {@link WorkflowModelManager} - the same responsible for the {@link AppfxWizardComponent} workflow.
 * This guarantees the same API and UX for the inline and dialog wizards.
 */
@Component({
  selector: 'appfx-stepper',
  standalone: false,
  templateUrl: 'stepper.component.html',
  styleUrls: ['stepper.component.scss'],
  providers: [RelevanceService, StepperStateService, SummaryService, WorkflowModelManager],
})
export class StepperComponent implements OnDestroy, AfterViewInit, AfterContentInit {
  /**
   * Display loading indicator.
   */
  @Input() loading = false;

  /**
   * If set to true, the Next button will use the primary (solid) button style.
   * Defaults to false to maintain backward compatibility for existing consumers.
   */
  @Input() usePrimaryNextButton = false;

  /**
   * If set to true, a "Back" button is displayed in every step except the first visible one.
   * This allows users to navigate to the previous non-skipped step.
   */
  @Input() showBackButton = false;

  /**
   * If set to true, a "Cancel" button is displayed in all steps.
   * This allows users to terminate the workflow before completion.
   */
  @Input() showCancelButton = false;

  /**
   * Dispatches when any of the workflow state's variables changes.
   */
  @Output() readonly onModelChange: EventEmitter<ModelChange[]> = new EventEmitter<ModelChange[]>();

  /**
   * Dispatched when the workflow is finished via the Finish button.
   * You can perform the actions you want there (i.e modify or create something)
   */
  @Output() readonly onFinish: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Dispatched when the user clicks the "Cancel" button.
   * Use this to handle navigation away from the stepper or closing the containing view.
   */
  @Output() readonly onCancel: EventEmitter<void> = new EventEmitter<void>();

  form: UntypedFormGroup;
  initialStep: string;
  stepPanelOverriddenStrings: Partial<ClrCommonStrings>;

  @ViewChildren(StepContainer) private pagesContainers: QueryList<StepContainer>;

  @ViewChildren(ClrStepperPanel) private stepperPanels: QueryList<ClrStepperPanel>;

  private activeStep: Step | undefined;
  private activePage: StepContainer | undefined;
  private awaitingWizardPageOnLoad$: ReplaySubject<Step> = new ReplaySubject(Infinity);
  private componentAfterViewInit$: Subject<void> = new Subject();
  private readonly subscriptions = new Subscription();
  private retrySubscription: Subscription;
  private stepperService: StepperService;
  private errorActivatingStep = false;

  #steps: StepInternal[];
  #wizardModel: any;

  constructor(
    readonly stateService: StepperStateService,
    readonly workflowStrings: WorkflowStrings,
    private readonly modelMgr: WorkflowModelManager,
    private readonly relevanceService: RelevanceService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly summaryService: SummaryService
  ) {
    this.form = formBuilder.group({});

    this.subscriptions.add(
      modelMgr.onModelChange$.subscribe((changes: ModelChange[]) => {
        this.onModelChange.emit(changes);
        this.invalidateNextSteps();
      })
    );
    this.subscriptions.add(modelMgr.loading$.subscribe(loading => (this.loading = loading)));
    this.subscriptions.add(
      stateService.onStepActivated$.subscribe((stepState: StepState) => {
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
        (<StepInternal>stepState.step).initialDescription = summaryService.getDescription(stepState.step);
      })
    );

    this.stepPanelOverriddenStrings = {
      success: workflowStrings.step.completed,
      danger: workflowStrings.step.error,
    };
  }

  /**
   * The descriptions of the pages that are visualized.
   */
  get steps(): Step[] {
    return this.#steps;
  }

  @Input()
  set steps(value: Step[]) {
    this.relevanceService.steps = value;
    this.relevanceService
      .checkComplete$()
      .pipe(take(1))
      .subscribe((steps: Step[]) => {
        this.#steps = steps;
        this.modelMgr.steps = steps;
        this.initForm(steps);
        this.#steps.forEach(step => (step.initialDescription = this.summaryService.getDescription(step)));
      });
  }

  get stepsInternal(): StepInternal[] {
    return this.#steps;
  }

  /**
   * You can supply here any structure you like. As long as it has the
   * needed properties to inject to the page models and eject back from
   * the page models.
   */
  get wizardModel(): WorkflowModel {
    return this.#wizardModel;
  }

  @Input()
  set wizardModel(value: WorkflowModel) {
    this.#wizardModel = value;
    this.modelMgr.model = value;
  }

  @ViewChildren(ClrStepButton)
  set clrStepButtons(clrStepButtons: QueryList<ClrStepButton>) {
    clrStepButtons.forEach((button: ClrStepButton) => {
      // Check if button's navigateToNextPanel has already been patched with the additional validation logic.
      if (!(button as any)['navigatePatched']) {
        const clrStepButtonNavigateToNextPanelFn = button.navigateToNextPanel.bind(button);
        button.navigateToNextPanel = this.onClrStepButtonClickedWrapperFn(clrStepButtonNavigateToNextPanelFn);
        (button as any)['navigatePatched'] = true;
      }
    });
  }

  @ViewChild(ClrStepper, { static: false })
  set stepper(value: ClrStepper) {
    this.stepperService = value['stepperService'];
    this.patchStepperService();
    this.subscribeForPanelChanges();
  }

  // Maps to Wizard.isLoading
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
    return this.activePage?.step?.modelInstance?.progressStatus || '';
  }

  get showProgressCancelButton(): boolean {
    return typeof this.activePage?.step?.modelInstance?.cancelableValidation?.cancelValidation === 'function';
  }

  get cancelValidationButtonLabel(): string {
    return this.activePage?.step?.modelInstance?.cancelableValidation?.cancelButtonLabel || '';
  }

  cancelPageValidation(): void {
    if (typeof this.activePage?.step?.modelInstance?.cancelableValidation?.cancelValidation === 'function') {
      this.activePage?.step?.modelInstance?.cancelableValidation.cancelValidation();
    }
  }

  isNextButtonDisabled(step: Step) {
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

  // Maps to Wizard.onWizardPageActivated
  onStepActivated(step: Step): void {
    this.awaitingWizardPageOnLoad$.next(step);
  }

  /**
   * Wrapper function which to wrap the handler of the "Next/Finish" button of every step and
   * to add additional validation and data extraction logic.
   */
  onClrStepButtonClickedWrapperFn(callbackFn: () => void): () => void {
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
  onFormSubmit(): void {
    if (this.stateService.areAllStepsCompleted()) {
      this.onFinish.emit();
    }
  }

  /**
   * Checks if the given step index corresponds to the first visible (non-skipped) step in the workflow.
   * Used to conditionally hide the Back button on the initial page.
   * @param stepIndex The index of the step in the stepsInternal array.
   */
  protected isFirstVisibleStep(stepIndex: number): boolean {
    return this.stateService.isFirstVisibleStep(stepIndex, this.stepsInternal);
  }

  /**
   * When user clicks on already completed steps, Stepper should call validate method of current step before navigation.
   * Patches stepperService.togglePanel method which calls this.commitActiveStep before calling the original togglePanel method.
   */
  private patchStepperService() {
    const originalTogglePanelFunc = this.stepperService.togglePanel;
    if (!(this.stepperService as any)['togglePanelPatched']) {
      this.stepperService.togglePanel = (...args: [panelId: string, open?: boolean | undefined]) => {
        const firstIncompleteContainerIndex = this.stateService.getFirstIncompleteStepContainerIndex();
        const activeContainerIndex = this.pagesContainers.toArray().findIndex(item => item === this.activePage);
        if (firstIncompleteContainerIndex === activeContainerIndex) {
          // When moving from incomplete step to previous steps, do not call commit
          originalTogglePanelFunc.apply(this.stepperService, args);
        } else {
          this.commitActiveStep()
            .pipe(
              take(1),
              filter(isValid => isValid)
            )
            .subscribe(() => {
              originalTogglePanelFunc.apply(this.stepperService, args);
            });
        }
      };
      (this.stepperService as any)['togglePanelPatched'] = true;
    }
  }

  private commitActiveStep(): Observable<boolean> {
    if (!this.activePage) {
      return of(false);
    }
    this.loading = true;
    return this.activePage.onCommit().pipe(
      tap(isValid => {
        const activeStep = (this.activePage as StepContainer).step;
        // Mark the current step as valid/invalid.
        this.stateService.markStepValid(activeStep, isValid);
        // If not valid, mark the next steps as invalid too.
        if (!isValid) {
          this.stateService.resetNextStepsValidStates(activeStep);
        } else if (activeStep.summary) {
          // retrieve step summary on successful validation of step.
          activeStep.initialDescription = this.summaryService.getSummary(activeStep);
        } else {
          // no action
        }

        this.form.controls[this.initialStep].setErrors(isValid ? null : { formInvalid: true });
        this.form.controls[this.initialStep].markAsDirty();
      }),
      switchMap((isValid: boolean) => {
        if (isValid) {
          this.modelMgr.ejectPropertiesFromCurrentStep(this.activeStep);
          return this.relevanceService.checkComplete$().pipe(switchMap(() => of(isValid)));
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
        this.activePage = this.pagesContainers.find(item => item.step === this.activeStep);
      }

      // Finally activate the container
      pendingPage.onActivate(result.error, result.stepModelChanges, result.recreateComponent);

      // Force digest as activation trigger changes Clarity wizard. template conditionals must re-evaluate
      this.cdr.detectChanges();
    }
  }

  private retryStepTransition(step: Step): void {
    this.onStepActivated(step);
  }

  private invalidateNextSteps(): void {
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
  private completePreviousSteps(sourceIndex: number, openPanelIndex: number) {
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

  private unsubscribeRetry() {
    if (this.retrySubscription && !this.retrySubscription.closed) {
      this.retrySubscription.unsubscribe();
    }
  }

  /**
   * ClrStepper requires a child FormGroup for every step. This method creates one dummy
   * FormGroup for every step. In future these form groups must be used to indicate
   * the error state of each step.
   */
  private initForm(steps: Step[]): void {
    if (steps && steps.length) {
      const childFormGroups: any = {};
      steps.forEach((step: Step, index: number) => {
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
  private subscribeForPanelChanges(): void {
    const panelsChanges: BehaviorSubject<CollapsiblePanelModel[]> = this.stepperService['_panelsChanges'];
    this.subscriptions.add(
      panelsChanges.subscribe((panels: CollapsiblePanelModel[]) => {
        panels.forEach((panelModel: CollapsiblePanelModel) => {
          const panelId = panelModel.id;
          const stepIndex: number = +panelId.replace('step', '');
          const step: StepInternal = this.#steps[stepIndex];
          this.stateService.stepActivated(step, panelModel.open, stepIndex);
        });
      })
    );
  }

  private getFormGroupNameForStep(stepIndex: number): string {
    return 'step' + stepIndex;
  }
}
