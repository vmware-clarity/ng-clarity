/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkTrapFocus, FocusTrapFactory } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, NgModule, Optional } from '@angular/core';

/**
 * This is just a copy of CdkTrapFocus so it can be used independent of the rest of the A11yModule.
 */
@Directive({
  selector: '[cdkTrapFocus]',
  standalone: false,
})
export class CdkTrapFocusModule_CdkTrapFocus extends CdkTrapFocus {
  /**
   * Include the constructor to forward all the dependencies to the base class
   * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
   * https://github.com/storybookjs/storybook/issues/23534
   */
  constructor(
    elementRef: ElementRef<HTMLElement>,
    focusTrapFactory: FocusTrapFactory,
    @Optional() @Inject(DOCUMENT) document: any
  ) {
    super(elementRef, focusTrapFactory, document);
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
