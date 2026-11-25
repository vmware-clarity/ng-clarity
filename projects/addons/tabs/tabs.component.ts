/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  Signal,
  signal,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import {
  InjectPropertiesResult,
  ModelChange,
  RelevanceService,
  Step,
  StepContainer,
  StepInternal,
  TabLayout,
  WorkflowConfigurationService,
  WorkflowModel,
  WorkflowModelManager,
} from '@clr/addons/var';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { ClrTabLink } from '@clr/angular/layout/tabs';
import { combineLatest, Observable, of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { debounceTime, filter, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';

/**
 * Component used to render the composition of step components as tabs
 * (using Clarity tabs component). Workflow of the steps is handled by the
 * {@link WorkflowModelManager} - the same responsible for the {@link Wizard} workflow.
 * This guarantees the same API and UX for the inline and dialog wizards.
 *
 * @example
 * <appfx-tabs
 *             [loading]="loading"
 *             [tabs]="tabs"
 *             [disableTabsContent]="false"
 *             [tabLayout]="TabLayout.horizontal"
 *             [model]="tabsModel">
 * </appfx-tabs>
 */
@Component({
  selector: 'appfx-tabs',
  // Eager: the tabs host consumer step components and read their step models, which consumers change directly.
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
  templateUrl: 'tabs.component.html',
  styleUrls: ['tabs.component.scss', 'tabs.a11y.scss'],
  providers: [RelevanceService, WorkflowModelManager],
})
export class TabsComponent implements OnChanges, AfterViewInit, AfterContentInit, OnDestroy {
  /** Disable the content of the tabs. */
  @Input() disableTabsContent = false;

  /** Display loading indicator. */
  @Input() loading = false;

  /** The tabs layout. Defaults to horizontal. */
  @Input() tabLayout: TabLayout = TabLayout.horizontal;

  /** Set to false to suppress the loading indicator; check {@link isLoading} instead. */
  @Input() showLoadingIndicator = true;

  /** Set to false to disable auto-collapsible tab links. */
  @Input() autoCollapseTabLinks = true;

  /** Set to false to hide the tab links (useful when there is only one step). */
  @Input() showTabLinks = true;

  /** Emits when the workflow model changes. */
  @Output() readonly onModelChange: EventEmitter<ModelChange[]> = new EventEmitter<ModelChange[]>();

  @Output() tabLinksOpenedChange = new EventEmitter<boolean>();

  /** Emits with the activated step when the active tab changes. */
  @Output() activeTabChange = new EventEmitter<Step>();

  clrTabsLayout!: TabLayout;
  TabLayout = TabLayout;
  ZoomLevel = ZoomLevel;
  tabLinksOpened = false;
  isVerticalLayout!: boolean;
  isSecondaryLayout!: boolean;

  @ViewChildren(StepContainer) private pagesContainers!: QueryList<StepContainer>;
  @ViewChildren(ClrTabLink) private tabLinks!: QueryList<ClrTabLink>;

  private tabsModel!: WorkflowModel;
  private awaitingActivePageOnLoad$: ReplaySubject<StepInternal> = new ReplaySubject(1);
  private componentAfterViewInit$: Subject<void> = new Subject();
  private subscriptions = new Subscription();
  private retrySubscription?: Subscription;
  private stepsValidationMap = new Map<Step, Observable<boolean>>();
  private readonly managerLoading: Signal<boolean>;

  readonly #steps = signal<StepInternal[] | undefined>(undefined);
  readonly #activeTabStep = signal<Step>(<Step>{});
  readonly #errorIconVisibleList = signal<boolean[]>([]);
  readonly #errorActivatingStep = signal(false);
  readonly #validating = signal(false);

  constructor(
    public modelMgr: WorkflowModelManager,
    private relevanceService: RelevanceService,
    private cdr: ChangeDetectorRef,
    public workflowStrings: WorkflowStrings,
    public configService: WorkflowConfigurationService,
    @Optional() private zoomLevelService?: ZoomLevelService
  ) {
    this.managerLoading = toSignal(modelMgr.loading$.pipe(debounceTime(10)), { initialValue: false });
    this.subscriptions.add(
      modelMgr.onModelChange$.subscribe((changes: ModelChange[]) => {
        this.onModelChange.emit(changes);
      })
    );
  }

  get tabs(): Step[] {
    return this.#steps() as Step[];
  }

  @Input()
  set tabs(steps: Step[]) {
    this.relevanceService.steps = steps;
    this.relevanceService
      .checkComplete$()
      .pipe(take(1))
      .subscribe((checkedSteps: Step[]) => {
        this.#steps.set(checkedSteps);
        this.activateFirstTab();
        this.modelMgr.steps = checkedSteps;
        this.onStepsOrModelChange();
      });
  }

  /**
   * Supply any structure that has the needed properties to inject to / eject from step models.
   * If not specified the steps will stay disconnected from each other.
   */
  get model(): WorkflowModel {
    return this.tabsModel;
  }

  @Input()
  set model(tabsModel: WorkflowModel) {
    this.tabsModel = tabsModel;
    this.modelMgr.model = tabsModel;
    this.onStepsOrModelChange();
  }

  get tabsInternal(): StepInternal[] {
    return this.#steps() as StepInternal[];
  }

  /** The step of the active tab. */
  get activeTabStep(): Step {
    return this.#activeTabStep();
  }

  /** Per tab: true when its last validation failed. */
  get errorIconVisibleList(): boolean[] {
    return this.#errorIconVisibleList();
  }

  /** True while the tabs, the workflow model or a tab validation is loading. */
  @HostBinding('class.loading')
  get busy(): boolean {
    return this.loading || this.#validating() || this.managerLoading();
  }

  get isLoading(): boolean {
    return (
      this.busy ||
      this.relevanceService.loading ||
      (!!this.pagesContainers &&
        this.pagesContainers.some(
          (value: StepContainer) => !!value.step.modelInstance && !!value.step.modelInstance.loading
        ))
    );
  }

  get showTabNav(): boolean {
    return this.showTabLinks && (this.showAppfxTabLinks ? this.tabLinksOpened : true);
  }

  get currentZoomLevel(): ZoomLevel {
    return this.zoomLevelService?.level() ?? ZoomLevel.none;
  }

  get showTabContent(): boolean {
    return !this.tabLinksOpened;
  }

  get showAppfxTabLinks(): boolean {
    return (
      this.showTabLinks &&
      this.autoCollapseTabLinks &&
      this.isVerticalLayout &&
      this.currentZoomLevel !== ZoomLevel.none
    );
  }

  get isReady(): boolean {
    let hasIncompletePage = false;
    if (this.pagesContainers) {
      hasIncompletePage = this.pagesContainers.some(p => !p.readyToComplete);
    }
    return !(hasIncompletePage || this.isLoading || this.#errorActivatingStep());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tabLayout) {
      this.isVerticalLayout = this.tabLayout === TabLayout.vertical;
      this.isSecondaryLayout = this.tabLayout === TabLayout.secondary;
      this.clrTabsLayout = this.isVerticalLayout ? TabLayout.vertical : TabLayout.horizontal;
    }
  }

  ngAfterViewInit() {
    if (this.pagesContainers.length) {
      this.componentAfterViewInit$.next();
    } else {
      this.pagesContainers.changes.pipe(take(1)).subscribe(() => {
        this.componentAfterViewInit$.next();
      });
    }
  }

  ngAfterContentInit() {
    this.subscriptions.add(
      combineLatest([this.componentAfterViewInit$, this.awaitingActivePageOnLoad$])
        .pipe(
          filter(() => !!this.pagesContainers),
          switchMap(([, pendingStep]) => this.modelMgr.injectPropertiesToPendingStep(pendingStep))
        )
        .subscribe(result => {
          this.#errorActivatingStep.set(!!result.error);
          this.activateStep(result);
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.stepsValidationMap.clear();
    this.modelMgr.destroy();
    this.relevanceService.destroy();
    this.unsubscribeRetry();
  }

  /** Checks if the tab is currently active. */
  isTabActive(step: StepInternal): boolean {
    return step === this.activeTabStep;
  }

  /** Triggered when the tab page is changed. */
  onStepActiveChange(step: StepInternal, isStepActive: boolean): void {
    this.tabLinksOpened = false;
    this.tabLinksOpenedChange.emit(this.tabLinksOpened);
    if (isStepActive) {
      this.activeTabChange.emit(step);
      const previousStep: StepInternal = this.#activeTabStep();

      this.validateStep(previousStep)
        .pipe(
          tap(() => this.modelMgr.ejectPropertiesFromCurrentStep(previousStep)),
          take(1)
        )
        .subscribe(() => {
          this.#activeTabStep.set(step);
          this.awaitingActivePageOnLoad$.next(step);
        });
    }
  }

  /** Validates only the active tab. */
  validateActiveTab$(): Observable<boolean> {
    return this.validateStep(this.#activeTabStep()).pipe(
      tap(() => this.modelMgr.ejectPropertiesFromCurrentStep(this.#activeTabStep())),
      switchMap((validationResult: boolean) => {
        return this.disableTabsContent ? of(true) : of(validationResult);
      })
    );
  }

  /** Validates all tabs. Navigates to the first invalid tab if any fail. */
  validate$(): Observable<boolean> {
    return this.validateActiveTab$().pipe(
      switchMap(() => {
        const stepsValidate$: Observable<boolean>[] = this.disableTabsContent
          ? [of(true)]
          : Array.from(this.stepsValidationMap.values());

        this.#validating.set(this.showLoadingIndicator);
        return combineLatest(stepsValidate$).pipe(
          map((values: boolean[]) => {
            if (this.disableTabsContent) {
              return true;
            }
            return values.every(value => value);
          }),
          tap(isValid => {
            this.#validating.set(false);
            if (!isValid) {
              this.navigateToTabWithErrors();
            }
          })
        );
      })
    );
  }

  private activateFirstTab(): void {
    const firstTab = this.#steps()?.find(item => !item.isSkipped);
    if (firstTab) {
      firstTab.instantiateLazy = false;
      this.#activeTabStep.set(firstTab);
      this.activeTabChange.emit(firstTab);
    }
  }

  private navigateToTabWithErrors(): void {
    if (!this.pagesContainers) {
      return;
    }
    const activeStepIndex: number = this.tabs.indexOf(this.#activeTabStep());
    const activeStepHasError: boolean = activeStepIndex !== -1 && this.errorIconVisibleList[activeStepIndex];
    if (activeStepHasError) {
      return;
    }
    const firstStepWithErrorsIndex: number = this.errorIconVisibleList.findIndex(value => value);
    if (firstStepWithErrorsIndex === -1) {
      return;
    }
    const firstStepWithErrors: Step = this.tabs[firstStepWithErrorsIndex];
    const firstPageWithErrorsIndex = this.pagesContainers
      .toArray()
      .findIndex((item: StepContainer) => item.step === firstStepWithErrors);
    if (firstPageWithErrorsIndex !== -1) {
      this.tabLinks.toArray()[firstPageWithErrorsIndex].activate();
      this.activeTabChange.emit(firstStepWithErrors);
    }
  }

  private activateStep(result: InjectPropertiesResult): void {
    this.unsubscribeRetry();
    const pendingPage = this.pagesContainers.find((item: StepContainer) => item.step === result.pendingStep);
    if (pendingPage) {
      if (result.error) {
        this.retrySubscription = pendingPage.onRetry
          .pipe(take(1))
          .subscribe((step: StepInternal) => this.retryStepTransition(step));
      }
      pendingPage.onActivate(result.error, result.stepModelChanges, result.recreateComponent);
      // Render the activated step now, so it is in the DOM as soon as the activation returns.
      this.cdr.detectChanges();
    }
  }

  private validateStep(step: Step): Observable<boolean> {
    if (this.disableTabsContent || !step) {
      return of(true);
    }
    const pageToValidate: StepContainer | undefined = this.pagesContainers.find(
      (item: StepContainer) => item.step === step
    );
    if (pageToValidate) {
      const pageIndex: number = this.tabs.indexOf(step);
      const validate$ = pageToValidate.onCommit().pipe(shareReplay(1));
      this.stepsValidationMap.set(step, validate$);
      this.#validating.set(true);
      return validate$.pipe(
        tap(success => {
          this.#errorIconVisibleList.update(list => Object.assign([...list], { [pageIndex]: !success }));
          this.#validating.set(false);
        })
      );
    }
    return of(true);
  }

  private onStepsOrModelChange(): void {
    if (!this.#activeTabStep() || !this.model) {
      return;
    }
    this.awaitingActivePageOnLoad$.next(this.#activeTabStep());
  }

  private unsubscribeRetry() {
    if (this.retrySubscription && !this.retrySubscription.closed) {
      this.retrySubscription.unsubscribe();
    }
  }

  private retryStepTransition(step: StepInternal): void {
    this.awaitingActivePageOnLoad$.next(step);
  }
}
