/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkTrapFocus, FocusTrapFactory } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Optional } from '@angular/core';

@Directive({
  standalone: true,
})
export class ClrStandaloneCdkTrapFocus extends CdkTrapFocus {
  /**
   * Include the constructor to forward all the dependencies to the base class
   * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
   * https://github.com/storybookjs/storybook/issues/23534
   */
  constructor(elementRef: ElementRef, focusTrapFactory: FocusTrapFactory, @Optional() @Inject(DOCUMENT) document: any) {
    super(elementRef, focusTrapFactory, document);
  }
}
