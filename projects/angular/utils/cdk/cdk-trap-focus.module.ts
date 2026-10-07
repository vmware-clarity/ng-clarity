/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Directive, NgModule } from '@angular/core';

/**
 * This is just a copy of CdkTrapFocus so it can be used independent of the rest of the A11yModule.
 */
@Directive({
  selector: '[cdkTrapFocus]',
  standalone: false,
})
export class CdkTrapFocusModule_CdkTrapFocus extends CdkTrapFocus {
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

/**
 * This module allows us to avoid importing all of A11yModule which results in a smaller application bundle.
 */
@NgModule({
  declarations: [CdkTrapFocusModule_CdkTrapFocus],
  exports: [CdkTrapFocusModule_CdkTrapFocus],
})
export class CdkTrapFocusModule {}
