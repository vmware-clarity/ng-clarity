/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { createTestHelpers, TestContext } from '@clr/angular/testing';

import { BasicWizardTestComponent } from '../test-components/basic-wizard.mock';
import { ClrWizard } from '../wizard';
import { ButtonHubService } from './button-hub.service';
import { PageCollectionService } from './page-collection.service';
import { WizardNavigationService } from './wizard-navigation.service';

describe('New Wizard Tests', () => {
  describe('Button Hub Service', () => {
    const helpers = createTestHelpers();

    let context: TestContext<ClrWizard, BasicWizardTestComponent>;
    let buttonHubService: ButtonHubService;
    let wizardNavigationService: WizardNavigationService;
    let pageCollectionService: PageCollectionService;

    beforeEach(() => {
      context = helpers.create(ClrWizard, BasicWizardTestComponent);
      buttonHubService = context.getClarityProvider(ButtonHubService);
      wizardNavigationService = context.getClarityProvider(WizardNavigationService);
      pageCollectionService = context.getClarityProvider(PageCollectionService);
      context.detectChanges();
    });

    it("'next' calls wizardNavigationService.checkAndCommitCurrentPage with next", () => {
      vi.spyOn(wizardNavigationService, 'checkAndCommitCurrentPage').mockImplementation(() => undefined);
      buttonHubService.buttonClicked('next');
      expect(wizardNavigationService.checkAndCommitCurrentPage).toHaveBeenCalledWith('next');
    });

    it("'previous' calls wizardNavigationService.previous", () => {
      wizardNavigationService.currentPage = pageCollectionService.lastPage;
      vi.spyOn(wizardNavigationService, 'previous').mockImplementation(() => undefined);
      buttonHubService.buttonClicked('previous');
      expect(wizardNavigationService.previous).toHaveBeenCalled();
    });

    it("'danger' calls wizardNavigationService.next or wizardNavigationService.finish", () => {
      vi.spyOn(wizardNavigationService, 'checkAndCommitCurrentPage').mockImplementation(() => undefined);
      buttonHubService.buttonClicked('danger');
      expect(wizardNavigationService.checkAndCommitCurrentPage).toHaveBeenCalledWith('danger');
    });

    it("'cancel' calls wizardNavigationService.cancel", () => {
      vi.spyOn(wizardNavigationService, 'cancel').mockImplementation(() => undefined);
      buttonHubService.buttonClicked('cancel');
      expect(wizardNavigationService.cancel).toHaveBeenCalled();
    });

    it("'finish' calls wizard.close, emit wizardFinished", () => {
      const wizard = context.clarityDirective;
      const finalPage = wizard.pageCollection.lastPage;

      vi.spyOn(wizard.wizardFinished, 'emit').mockImplementation(() => undefined);
      vi.spyOn(wizard, 'close').mockImplementation(() => undefined);

      // set up for finish
      wizard.navService.currentPage = finalPage;
      finalPage.nextStepDisabled = false;
      context.detectChanges();

      buttonHubService.buttonClicked('finish');

      expect(wizard.wizardFinished.emit).toHaveBeenCalled();
      expect(wizard.close).toHaveBeenCalled();
    });

    it('.custom calls wizardNavigationService.currentPage.customButtonClicked', () => {
      vi.spyOn(wizardNavigationService.currentPage.customButtonClicked, 'emit').mockImplementation(() => undefined);
      buttonHubService.buttonClicked('custom');
      expect(wizardNavigationService.currentPage.customButtonClicked.emit).toHaveBeenCalled();
    });
  });
});
