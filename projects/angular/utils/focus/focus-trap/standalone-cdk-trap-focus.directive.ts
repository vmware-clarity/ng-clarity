/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Directive } from '@angular/core';

@Directive({
  standalone: true,
})
export class ClrStandaloneCdkTrapFocus extends CdkTrapFocus {
  /**
   * The base class resolves its dependencies with `inject()`, so it takes no constructor arguments
   * (`@angular/cdk` 22 declares it that way). The explicit constructor stays as a workaround for the
   * Angular "ɵɵinvalidFactoryDep" error in storybook: https://github.com/storybookjs/storybook/issues/23534
   */
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }
}
