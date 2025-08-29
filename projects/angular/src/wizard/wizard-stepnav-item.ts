/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { startWith, Subscription, tap } from 'rxjs';

import { ClrCommonStringsService } from '../utils';
import { PageCollectionService } from './providers/page-collection.service';
import { WizardNavigationService } from './providers/wizard-navigation.service';
import { ClrWizardPage } from './wizard-page';

@Component({
  selector: '[clr-wizard-stepnav-item]',
  template: `
    <button
      type="button"
      class="btn btn-link clr-wizard-stepnav-link"
      (click)="click()"
      [attr.disabled]="isDisabled ? '' : null"
      [attr.aria-labelledby]="labelledby"
    >
      <div class="clr-wizard-stepnav-link-icon">
        @if (icon; as icon) {
        <cds-icon
          [id]="stepIconId"
          role="img"
          class="clr-wizard-stepnav-link-icon"
          [attr.shape]="icon.shape"
          [attr.aria-label]="icon.label"
        ></cds-icon>
        }
      </div>

      <span [id]="stepTextId" class="clr-sr-only">{{ commonStrings.keys.wizardStep }}</span>
      <div [id]="stepNumberId" class="clr-wizard-stepnav-link-page-number">
        <ng-content></ng-content>
      </div>
      <span [id]="stepTitleId" class="clr-wizard-stepnav-link-title">
        <ng-template [ngTemplateOutlet]="page.navTitle"></ng-template>
      </span>
    </button>
  `,
  host: {
    '[id]': 'id',
    '[attr.aria-current]': 'stepAriaCurrent',
    '[attr.aria-controls]': 'page.id',
    '[class.clr-nav-link]': 'true',
    '[class.nav-item]': 'true',
    '[class.active]': 'isCurrent',
    '[class.disabled]': 'isDisabled',
    '[class.no-click]': '!canNavigate',
    '[class.complete]': 'isComplete',
    '[class.error]': 'hasError',
  },
  standalone: false,
})
export class ClrWizardStepnavItem implements OnInit, OnDestroy {
  @Input('page') page: ClrWizardPage;

  private subscription: Subscription;

  /**
   * This is used to prevent the steps from scrolling as the user clicks on the steps.
   */
  private skipNextScroll = false;

  constructor(
    public navService: WizardNavigationService,
    public pageCollection: PageCollectionService,
    public commonStrings: ClrCommonStringsService,
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}

  get id(): string {
    this.pageGuard();
    return this.pageCollection.getStepItemIdForPage(this.page);
  }

  get stepAriaCurrent(): string {
    return this.isCurrent && 'step';
  }

  get isDisabled(): boolean {
    this.pageGuard();
    return this.page.disabled || this.navService.wizardStopNavigation || this.navService.wizardDisableStepnav;
  }

  get isCurrent(): boolean {
    this.pageGuard();
    return this.page.current;
  }

  get isComplete(): boolean {
    this.pageGuard();
    return this.page.completed;
  }

  get hasError(): boolean {
    this.pageGuard();
    return this.page.hasError && this.isComplete;
  }

  get canNavigate(): boolean {
    this.pageGuard();
    return this.pageCollection.previousPageIsCompleted(this.page);
  }

  protected get stepIconId() {
    return `${this.id}-step-icon`;
  }

  protected get stepTextId() {
    return `${this.id}-step-text`;
  }

  protected get stepNumberId() {
    return `${this.id}-step-number`;
  }

  protected get stepTitleId() {
    return `${this.id}-step-title`;
  }

  protected get labelledby() {
    const textIds = [this.stepTextId, this.stepNumberId, this.stepTitleId];
    const allIds = this.isComplete ? [this.stepIconId, ...textIds] : textIds;

    return allIds.join(' ');
  }

  protected get icon(): { shape: string; label: string } | null {
    if (this.isCurrent) {
      return {
        shape: 'dot-circle',
        label: this.commonStrings.keys.wizardStepCurrent || this.commonStrings.keys.timelineStepCurrent,
      };
    } else if (this.hasError) {
      return {
        shape: 'error-standard',
        label: this.commonStrings.keys.wizardStepError || this.commonStrings.keys.timelineStepError,
      };
    } else if (this.isComplete) {
      return {
        shape: 'success-standard',
        label: this.commonStrings.keys.wizardStepSuccess || this.commonStrings.keys.timelineStepSuccess,
      };
    } else {
      return null;
    }
  }

  ngOnInit() {
    this.subscription = this.ensureCurrentStepIsScrolledIntoView().subscribe();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  click(): void {
    this.pageGuard();

    // if we click on our own stepnav or a disabled stepnav, we don't want to do anything
    if (this.isDisabled || this.isCurrent) {
      return;
    }

    this.skipNextScroll = true;
    this.navService.goTo(this.page);
  }

  private pageGuard(): void {
    if (!this.page) {
      throw new Error('Wizard stepnav item is not associated with a wizard page.');
    }
  }

  private ensureCurrentStepIsScrolledIntoView() {
    // Don't use "smooth" scrolling when the wizard is first opened to avoid a delay in scrolling the current step into view.
    // The current step when the wizard is opened might not be the first step. For example, the wizard can be closed and re-opened.
    let scrollBehavior: ScrollBehavior = 'auto';

    return this.navService.currentPageChanged.pipe(
      startWith(this.navService.currentPage),
      tap(currentPage => {
        if (!this.skipNextScroll && currentPage === this.page) {
          this.elementRef.nativeElement.scrollIntoView({ behavior: scrollBehavior, block: 'center', inline: 'center' });
        }

        scrollBehavior = 'smooth';
        this.skipNextScroll = false;
      })
    );
  }
}
