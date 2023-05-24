/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

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
    >
      <span class="clr-wizard-stepnav-link-suffix">
        <cds-icon
          shape="error-standard"
          status="danger"
          class="clr-wizard-stepnav-item-error-icon"
          *ngIf="hasError"
        ></cds-icon>
        <ng-content *ngIf="!hasError"></ng-content>
      </span>
      <span class="clr-wizard-stepnav-link-title">
        <ng-template [ngTemplateOutlet]="page.navTitle"></ng-template>
      </span>
      <span *ngIf="hasError" class="clr-sr-only">{{ commonStrings.keys.wizardStepError }}</span>
      <span *ngIf="!hasError && isComplete" class="clr-sr-only">{{ commonStrings.keys.wizardStepSuccess }}</span>
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
})
export class ClrWizardStepnavItem {
  @Input('page') page: ClrWizardPage;

  constructor(
    public navService: WizardNavigationService,
    public pageCollection: PageCollectionService,
    public commonStrings: ClrCommonStringsService
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

  click(): void {
    this.pageGuard();

    // if we click on our own stepnav or a disabled stepnav, we don't want to do anything
    if (this.isDisabled || this.isCurrent) {
      return;
    }

    this.navService.goTo(this.page);
  }

  private pageGuard(): void {
    if (!this.page) {
      throw new Error('Wizard stepnav item is not associated with a wizard page.');
    }
  }
}
