/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { WorkflowStrings } from '@clr/addons/workflow/strings';
import {
  angleIcon,
  barsIcon,
  ClarityIcons,
  exclamationCircleIcon,
  pencilIcon,
  refreshIcon,
  successStandardIcon,
} from '@clr/angular/icon';

import {
  AppfxWorkflowCoreModule,
  workflowConfigurationServiceFactory,
  workflowStringsServiceFactory,
} from './appfx-workfow-core.module';
import { WorkflowConfigurationService } from './config/workflow-configuration.service';

describe('#workflowConfigurationServiceFactory()', () => {
  it('returns the existing service', () => {
    const existingConfigService = new WorkflowConfigurationService();
    expect(workflowConfigurationServiceFactory(existingConfigService)).toBe(existingConfigService);
    expect(workflowConfigurationServiceFactory(undefined as unknown as WorkflowConfigurationService)).not.toBe(
      existingConfigService
    );
  });
});

describe('#workflowStringsServiceFactory()', () => {
  it('returns the existing service', () => {
    const existingWorkflowStrings = new WorkflowStrings();
    expect(workflowStringsServiceFactory(existingWorkflowStrings)).toBe(existingWorkflowStrings);
    expect(workflowStringsServiceFactory(undefined as unknown as WorkflowStrings)).not.toBe(existingWorkflowStrings);
  });
});

describe('AppfxWorkflowCoreModule', () => {
  it('registers clarity icons on initialization', () => {
    spyOn(ClarityIcons, 'addIcons').and.returnValue();
    new AppfxWorkflowCoreModule();
    expect(ClarityIcons.addIcons).toHaveBeenCalledOnceWith(
      angleIcon,
      barsIcon,
      exclamationCircleIcon,
      pencilIcon,
      refreshIcon,
      successStandardIcon
    );
  });
});
