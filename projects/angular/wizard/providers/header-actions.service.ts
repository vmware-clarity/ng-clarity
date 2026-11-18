/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, QueryList, signal } from '@angular/core';

import { ClrWizardHeaderAction } from '../wizard-header-action';
import { WizardNavigationService } from './wizard-navigation.service';

@Injectable()
export class HeaderActionService {
  // this service communicates information about the presence/display of header actions
  // across the wizard

  private _wizardHeaderActions: QueryList<ClrWizardHeaderAction>;
  private readonly headerActionCount = signal(0);

  constructor(public navService: WizardNavigationService) {}

  // The wizard assigns the list again each time it changes, so the header refreshes.
  get wizardHeaderActions(): QueryList<ClrWizardHeaderAction> {
    return this._wizardHeaderActions;
  }
  set wizardHeaderActions(headerActions: QueryList<ClrWizardHeaderAction>) {
    this._wizardHeaderActions = headerActions;
    this.headerActionCount.set(headerActions ? headerActions.length : 0);
  }

  get wizardHasHeaderActions(): boolean {
    return this.headerActionCount() > 0;
  }

  get currentPageHasHeaderActions(): boolean {
    return this.navService.currentPage ? this.navService.currentPage.hasHeaderActions : false;
  }

  get showWizardHeaderActions(): boolean {
    return !this.currentPageHasHeaderActions && this.wizardHasHeaderActions;
  }

  get displayHeaderActionsWrapper(): boolean {
    return this.currentPageHasHeaderActions || this.wizardHasHeaderActions;
  }
}
