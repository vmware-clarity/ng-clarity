/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Optional } from '@angular/core';

import { ContainerIdService } from './providers/container-id.service';
import { ControlIdService } from './providers/control-id.service';

export const CONTROL_SUFFIX: { [key: string]: string | null } = {
  HELPER: 'helper',
  ERROR: 'error',
  SUCCESS: 'success',
  NONE: null,
};

@Directive()
export abstract class ClrAbstractControl {
  /**
   * Hold the suffix for the ID
   */
  controlIdSuffix = 'abstract';

  protected constructor(
    @Optional() protected controlIdService: ControlIdService,
    @Optional() protected containerIdService: ContainerIdService
  ) {}

  get id(): string {
    /**
     * The order of witch the id will be pick is:
     *   - Container ID  (Wrapper arround multiple Controls like, Checkbox, Radio, ...)
     *   - Control ID (Single Control wrapper like Input, Textarea, Password, ...)
     *   - None
     */
    if (this.containerIdService) {
      return `${this.containerIdService.id}-${this.controlIdSuffix}`;
    }

    if (this.controlIdService) {
      return `${this.controlIdService.id}-${this.controlIdSuffix}`;
    }

    return null;
  }
}
