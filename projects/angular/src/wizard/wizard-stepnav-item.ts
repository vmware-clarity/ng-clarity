/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';
import { ClarityIcons } from '@cds/core/icon';
import { IconShapeTuple } from '@cds/core/icon/interfaces/icon.interfaces';

import { ClrCommonStringsService } from '../utils';
import { PageCollectionService } from './providers/page-collection.service';
import { WizardNavigationService } from './providers/wizard-navigation.service';
import { ClrWizardPage } from './wizard-page';

// Custom icons because:
// - check-circle and exclamation-circle are too small
// - error-standard works, but there is no matching check-standard
const wizardStepnavIcons: IconShapeTuple[] = [
  [
    'wizard-stepnav-success',
    `
<svg width="24" height="24" viewBox="4 4 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 14.667a6.667 6.667 0 1 1 0-13.334 6.667 6.667 0 0 1 0 13.334Zm-4.44-6.174 3.333 3.334 5.46-5.46a.667.667 0 0 0-.94-.94l-4.52 4.52L8.5 11.553a.667.667 0 0 0-.94.94Z"/>
</svg>
    `,
  ],
  [
    'wizard-stepnav-error',
    `
<svg width="24" height="24" viewBox="4 4 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm7.133.513a.867.867 0 0 0 1.734 0v-4a.867.867 0 0 0-1.734 0v4ZM12 18.667a6.667 6.667 0 1 1 0-13.334 6.667 6.667 0 0 1 0 13.334Zm.967-3.32a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
</svg>
    `,
  ],
];

@Component({
  selector: '[clr-wizard-stepnav-item]',
  template: `
    <button
      type="button"
      class="btn btn-link clr-wizard-stepnav-link"
      (click)="click()"
      [attr.disabled]="isDisabled ? '' : null"
    >
      <div class="clr-wizard-stepnav-link-icon">
        <cds-icon *ngIf="hasError" shape="wizard-stepnav-error" aria-label="error"></cds-icon>
        <cds-icon *ngIf="!hasError && isComplete" shape="wizard-stepnav-success" aria-label="complete"></cds-icon>
      </div>

      <div class="clr-wizard-stepnav-link-page-number"><ng-content></ng-content></div>
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
  ) {
    ClarityIcons.addIcons(...wizardStepnavIcons);
  }

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
