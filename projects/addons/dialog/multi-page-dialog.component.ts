/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/member-ordering */

import {
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
} from '@angular/core';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { Tabs } from '@clr/addons/tabs';
import {
  CloseHandler,
  formatError,
  modalServiceToken,
  ModelChange,
  Step,
  StepValidationState,
  TabLayout,
  WorkflowConfigurationService,
  WorkflowModel,
  WorkflowModelMonitor,
} from '@clr/addons/var';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { isObservable, Observable, of, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { DefaultButton, ModalSize } from './multi-page-dialog.model';

/**
 * A multi page dialog implemented as a single modal dialog with clarity tabs where
 * each step(page) is in a separate tab.
 * A custom component can be added in the dialog header (appfx-dialog-header) if it is
 * needed. See the example below:
 *
 * @example
 * <appfx-dialog
 *             [loading]="loading"
 *             [steps]="steps"
 *             [model]="dialogModel"
 *             [title]="options.title"
 *             [subTitle]="subTitle"
 *             [defaultButton]="submit"
 *             [okButtonLabel]="okButtonLabel"
 *             [disableTabsContent]="!toggleStateEnabled"
 *             [closeHandler]="closeHandler">
 *       <appfx-dialog-header>
 *          <appfx-toggle
 *                [label]="label"
 *                [toggleId]="'myToggleControlId'"
 *                [(toggleState)]="toggleStateEnabled">
 *          </appfx-toggle>
 *       </appfx-dialog-header>
 * </appfx-dialog>
 */
@Component({
  selector: 'appfx-dialog',
  standalone: false,
  templateUrl: 'multi-page-dialog.component.html',
  styleUrls: ['multi-page-dialog.component.scss', 'multi-page-dialog.a11y.scss'],
})
export class DialogComponent implements OnInit, OnDestroy {
  /** The title of the dialog. */
  @Input() title: string;

  /**
   * The sub title of the dialog.
   */
  @Input()
  set subTitle(subTitle: string | Observable<string>) {
    if (typeof subTitle === 'string') {
      this.#subTitle$ = of(subTitle);
    } else if (isObservable(subTitle)) {
      this.#subTitle$ = subTitle;
    }
  }

  /** Dialog's clarity size ("xl" | "lg" | "md" | "sm" | "full-screen"). */
  @Input() size: ModalSize;

  /** Specifies the height of the dialog. */
  @Input() height: string;

  /** Set default button - submit or close. The default value is close if it is not specified. */
  @Input() defaultButton: DefaultButton;

  /** The cancel button label. */
  @Input() cancelButtonLabel: string;

  /** The ok button label. */
  @Input() okButtonLabel: string;

  /** The tabs layout. The default value is horizontal if it is not specified. */
  @Input() tabLayout: TabLayout = TabLayout.horizontal;

  /** Disable the content of the tabs. */
  @Input() disableTabsContent: boolean;

  /** Display loading indicator. */
  @Input() loading = false;

  @Input() steps: Step[];

  /**
   * You can supply here any structure you like. As long as it has the needed properties
   * to inject to the step models and eject back from the step models.
   */
  @Input() model: WorkflowModel;

  /**
   * Object containing callback methods that will be invoked when the Dialog is Submitted or Cancelled.
   * onSubmit is invoked when the user clicks Ok button.
   * onCancel is invoked when the user clicks Cancel button.
   */
  @Input() closeHandler: CloseHandler;

  /** Show Tab Links (true by default). Set to false if you have only one step. */
  @Input() showTabLinks = true;

  /** Controls dialog open/close state. */
  @Input()
  get opened(): boolean {
    return this.#opened;
  }

  set opened(value: boolean) {
    this.#opened = value;
    this.openedChange.emit(value);
    if (!value) {
      this.onClose.emit();
    }
  }

  /** Dispatches when any of the workflow state's variables changes. */
  @Output() readonly onModelChange: EventEmitter<ModelChange[]> = new EventEmitter<ModelChange[]>();

  /** Dispatched when the dialog is closed. */
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  /** Emits when opened input is changed. */
  @Output() openedChange = new EventEmitter<boolean>();

  @ViewChild(Tabs, { static: true }) tabs: Tabs;

  errorIconVisibleList: boolean[] = [];
  closeHandlerValidationState = new StepValidationState();
  currentZoomLevel = ZoomLevel.none;
  ZoomLevel = ZoomLevel;
  tabLinksOpened = false;

  @ViewChild(WorkflowModelMonitor, { static: false }) private debugPopup: WorkflowModelMonitor;

  private subscriptions = new Subscription();
  private readonly defaultMinHeight = '545px';

  #opened = true;
  #subTitle$: Observable<string>;

  constructor(
    private cdr: ChangeDetectorRef,
    readonly workflowStrings: WorkflowStrings,
    readonly configService: WorkflowConfigurationService,
    /**
     * openModalComponent = undefined - Dialog used without ModalService
     * openModalComponent = true  - opened using ModalService.openModalComponent API
     * openModalComponent = false - opened using ModalService.openModal API
     */
    @Inject(modalServiceToken) @Optional() openModalComponent?: boolean,
    @Optional() private zoomLevelService?: ZoomLevelService
  ) {
    if (openModalComponent === false) {
      throw new Error('AppFx Dialog must be opened using ModalService.openModalComponent method.');
    }
    this.cancelButtonLabel = workflowStrings.defaultCancelButtonLabel ?? '';
    this.okButtonLabel = workflowStrings.defaultOkButtonLabel ?? '';
  }

  get subTitle$(): Observable<string> {
    return this.#subTitle$;
  }

  get isVerticalLayout(): boolean {
    return this.tabLayout === TabLayout.vertical;
  }

  get showAppfxTabLinks(): boolean {
    return this.showTabLinks && this.isVerticalLayout && this.currentZoomLevel !== ZoomLevel.none;
  }

  get showTabLinksInAppfxTabs(): boolean {
    return this.showAppfxTabLinks ? this.tabLinksOpened : this.showTabLinks;
  }

  get heightStyle(): any {
    if (this.currentZoomLevel !== ZoomLevel.none) {
      return {};
    }
    if (this.height) {
      return { height: `${this.height}` };
    }
    return { 'min-height': `${this.defaultMinHeight}` };
  }

  get isLoading(): boolean {
    return this.loading || this.tabs.isLoading;
  }

  get isOkButtonDisabled(): boolean {
    return this.isLoading || !this.tabs.isReady;
  }

  get isSignPostOpen(): boolean {
    return !!(this.debugPopup && this.debugPopup.isOpen);
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onOkButtonClick(): void {
    this.tabs
      .validate$()
      .pipe(
        take(1),
        filter(isValid => isValid)
      )
      .subscribe(() => this.submitDialog());
  }

  onCancelButtonClick(): void {
    const close$ = this.closeHandler && this.closeHandler.onCancel ? this.closeHandler.onCancel() : of(false);
    this.subscribeForCloseHandler(close$);
  }

  onModalOpenChange(opened: boolean) {
    if (opened) {
      this.opened = true;
    } else {
      this.onCancelButtonClick();
    }
  }

  private submitDialog() {
    const close$ = this.closeHandler && this.closeHandler.onSubmit ? this.closeHandler.onSubmit() : of(true);
    this.subscribeForCloseHandler(close$);
  }

  private subscribeForCloseHandler(close$: Observable<any>) {
    this.loading = true;
    close$.pipe(take(1)).subscribe({
      error: (error: unknown) => {
        this.loading = false;
        if (error !== notDisplayedError) {
          this.closeHandlerValidationState.errors = [
            formatError(error).data.message || this.workflowStrings.defaultDialogSubmitError,
          ];
        }
      },
      complete: () => {
        this.loading = false;
        this.closeHandlerValidationState.errors = [];
        this.closeModal();
      },
    });
  }

  private closeModal(): void {
    this.opened = false;
  }
}

export const notDisplayedError = new Object();
