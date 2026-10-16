/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { createTestHelpers, TestContext } from '@clr/angular/testing';

import { HeaderActionsTestComponent } from '../test-components/header-action-wizard.mock';
import { ClrWizard } from '../wizard';
import { HeaderActionService } from './header-actions.service';
import { WizardNavigationService } from './wizard-navigation.service';

export default function (): void {
  describe('Header Actions Service', () => {
    const helpers = createTestHelpers();

    let context: TestContext<ClrWizard, HeaderActionsTestComponent>;
    let headerActionService: HeaderActionService;
    let wizardNavigationService: WizardNavigationService;

    beforeEach(() => {
      context = helpers.create(ClrWizard, HeaderActionsTestComponent);
      headerActionService = context.getClarityProvider(HeaderActionService);
      wizardNavigationService = context.getClarityProvider(WizardNavigationService);
      context.detectChanges();
    });

    it('.wizardHasHeaderActions indicates if wizard has header actions', () => {
      expect(headerActionService.wizardHasHeaderActions).toBe(true);
    });

    it('.currentPageHasHeaderActions indicates if the current page has header actions', () => {
      const lastPage = wizardNavigationService.pageCollection.lastPage;

      expect(headerActionService.currentPageHasHeaderActions).toBe(true);
      wizardNavigationService.currentPage = lastPage;
      expect(headerActionService.currentPageHasHeaderActions).toBe(false);
    });

    it('.showWizardHeaderActions indicates if other pages have the header actions', () => {
      const lastPage = wizardNavigationService.pageCollection.lastPage;
      expect(headerActionService.showWizardHeaderActions).toBe(false);

      wizardNavigationService.currentPage = lastPage;
      expect(headerActionService.showWizardHeaderActions).toBe(true);
    });
  });
}
