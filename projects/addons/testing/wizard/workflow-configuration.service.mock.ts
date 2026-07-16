/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export class MockWorkflowConfigurationService {
  private debugValue = false;

  get debug(): boolean {
    return this.debugValue;
  }

  set debug(newValue: boolean) {
    this.debugValue = newValue;
  }
}
