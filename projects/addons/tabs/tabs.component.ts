/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
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
  standalone: false,
  templateUrl: 'tabs.component.html',
  styleUrls: ['tabs.component.scss', 'tabs.a11y.scss'],
  providers: [RelevanceService, WorkflowModelManager],
})
export class TabsComponent implements OnInit, OnChanges, AfterViewInit, AfterContentInit, OnDestroy {
  /** Disable the content of the tabs. */
  @Input() disableTabsContent: boolean;

  /** Display loading indicator. */
  @Input()
  @HostBinding('class.loading')
  loading = false;

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

  errorIconVisibleList: boolean[] = [];
  clrTabsLayout: TabLayout;
  TabLayout = TabLayout;
  currentZoomLevel = ZoomLevel.none;
  ZoomLevel = ZoomLevel;
  tabLinksOpened = false;
  activeTabStep: Step = <Step>{};
  isVerticalLayout: boolean;
  isSecondaryLayout: boolean;

  @ViewChildren(StepContainer) private pagesContainers: QueryList<StepContainer>;
  @ViewChildren(ClrTabLink) private tabLinks: QueryList<ClrTabLink>;

  private steps: StepInternal[];
  private tabsModel: WorkflowModel;
  private awaitingActivePageOnLoad$: ReplaySubject<StepInternal> = new ReplaySubject(1);
  private componentAfterViewInit$: Subject<void> = new Subject();
  private subscriptions = new Subscription();
  private errorActivatingStep = false;
  private retrySubscription: Subscription;
  private stepsValidationMap = new Map<Step, Observable<boolean>>();

  constructor(
    public modelMgr: WorkflowModelManager,
    private relevanceService: RelevanceService,
    private cdr: ChangeDetectorRef,
    public workflowStrings: WorkflowStrings,
    public configService: WorkflowConfigurationService,
    @Optional() private zoomLevelService?: ZoomLevelService
  ) {
    this.subscriptions.add(modelMgr.loading$.pipe(debounceTime(10)).subscribe(loading => (this.loading = loading)));
    this.subscriptions.add(
      modelMgr.onModelChange$.subscribe((changes: ModelChange[]) => {
        this.onModelChange.emit(changes);
      })
    );
  }

  get tabs(): Step[] {
    return this.steps;
  }

  @Input()
  set tabs(steps: Step[]) {
    this.relevanceService.steps = steps;
    this.relevanceService
      .checkComplete$()
      .pipe(take(1))
      .subscribe((checkedSteps: Step[]) => {
        this.steps = checkedSteps;
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
    return this.steps;
  }

  get isLoading(): boolean {
    return (
      this.loading ||
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
    return !(hasIncompletePage || this.isLoading || this.errorActivatingStep);
  }

  ngOnInit(): void {
    if (this.zoomLevelService) {
      this.subscriptions.add(
        this.zoomLevelService.onChange.subscribe((level: ZoomLevel) => {
          this.currentZoomLevel = level;
          this.cdr.detectChanges();
        })
      );
    }
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
          this.errorActivatingStep = !!result.error;
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
      const previousStep: StepInternal = this.activeTabStep;

      this.validateStep(previousStep)
        .pipe(
          tap(() => this.modelMgr.ejectPropertiesFromCurrentStep(previousStep)),
          take(1)
        )
        .subscribe(() => {
          this.activeTabStep = step;
          this.awaitingActivePageOnLoad$.next(this.activeTabStep);
        });
    }
  }

  /** Validates only the active tab. */
  validateActiveTab$(): Observable<boolean> {
    return this.validateStep(this.activeTabStep).pipe(
      tap(() => this.modelMgr.ejectPropertiesFromCurrentStep(this.activeTabStep)),
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

        this.loading = this.showLoadingIndicator;
        return combineLatest(stepsValidate$).pipe(
          map((values: boolean[]) => {
            if (this.disableTabsContent) {
              return true;
            }
            return values.every(value => value);
          }),
          tap(isValid => {
            this.loading = false;
            if (!isValid) {
              this.navigateToTabWithErrors();
            }
          })
        );
      })
    );
  }

  private activateFirstTab(): void {
    if (this.steps?.length) {
      const firstNotSkippedStepIndex: number = this.steps.findIndex(item => !item.isSkipped);
      if (firstNotSkippedStepIndex !== -1) {
        this.steps[firstNotSkippedStepIndex].instantiateLazy = false;
        this.activeTabStep = this.steps[firstNotSkippedStepIndex];
        this.activeTabChange.emit(this.activeTabStep);
      }
    }
  }

  private navigateToTabWithErrors(): void {
    if (!this.pagesContainers) {
      return;
    }
    const activeStepIndex: number = this.tabs.indexOf(this.activeTabStep);
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
      this.loading = true;
      return validate$.pipe(
        tap(success => {
          this.errorIconVisibleList[pageIndex] = !success;
          this.loading = false;
        })
      );
    }
    return of(true);
  }

  private onStepsOrModelChange(): void {
    if (!this.activeTabStep || !this.model) {
      return;
    }
    this.awaitingActivePageOnLoad$.next(this.activeTabStep);
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
