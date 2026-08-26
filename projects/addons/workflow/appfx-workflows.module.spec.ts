/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { WorkflowConfigurationService } from '@clr/addons/var';

import { workflowConfigurationServiceFactory } from './appfx-workflows.module';

describe('#workflowConfigurationServiceFactory()', () => {
  it('returns the existing service', () => {
    const existingConfigService = new WorkflowConfigurationService();
    expect(workflowConfigurationServiceFactory(existingConfigService)).toBe(existingConfigService);
    expect(workflowConfigurationServiceFactory(undefined as any)).not.toBe(existingConfigService);
  });
});
