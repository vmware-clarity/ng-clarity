/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, QueryList } from '@angular/core';

import { ClrWizardHeaderAction } from '../wizard-header-action';
import { WizardNavigationService } from './wizard-navigation.service';

@Injectable()
export class HeaderActionService {
  // this service communicates information about the presence/display of header actions
  // across the wizard

  wizardHeaderActions: QueryList<ClrWizardHeaderAction>;

  constructor(public navService: WizardNavigationService) {}

  get wizardHasHeaderActions(): boolean {
    const wizardHdrActions = this.wizardHeaderActions;
    if (!wizardHdrActions) {
      return false;
    }
    return wizardHdrActions.toArray().length > 0;
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
