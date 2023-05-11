/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * This version of the DomAdapter is for use on non-browser platforms, where there are no
 * nativeElements to use for calculations.
 */

import { Injectable } from '@angular/core';

import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';

@Injectable()
export class NoopDomAdapter implements DomAdapter {
  userDefinedWidth(_element: any): number {
    return 0;
  }

  scrollBarWidth(_element: any) {
    return 0;
  }

  scrollWidth(_element: any) {
    return 0;
  }

  computedHeight(_element: any): number {
    return 0;
  }

  clientRect(_element: any): DOMRect {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
    } as DOMRect;
  }

  minWidth(_element: any): number {
    return 0;
  }

  focus(_element: any): void {
    // Do nothing
  }
}
