/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { addHelpers } from '@clr/angular/testing';

import ButtonHubSpecs from './providers/button-hub.service.spec';
import HeaderActionsSpecs from './providers/header-actions.service.spec';
import PageCollectionSpecs from './providers/page-collection.service.spec';
import WizardNavigationSpecs from './providers/wizard-navigation.service.spec';
import WizardButtonSpecs from './wizard-button.spec';
import WizardHeaderActionSpecs from './wizard-header-action.spec';
import WizardPageSpecs from './wizard-page.spec';
import WizardStepnavItemSpecs from './wizard-stepnav-item.spec';
import WizardStepnavSpecs from './wizard-stepnav.spec';
import WizardSpecs from './wizard.spec';

describe('New Wizard Tests', () => {
  addHelpers();

  WizardSpecs();
  WizardStepnavSpecs();
  WizardStepnavItemSpecs();
  WizardButtonSpecs();
  WizardHeaderActionSpecs();
  WizardPageSpecs();

  ButtonHubSpecs();
  WizardNavigationSpecs();
  PageCollectionSpecs();
  HeaderActionsSpecs();
});
