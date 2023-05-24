/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { DomAdapter } from './dom-adapter';

@Injectable()
export class MockDomAdapter extends DomAdapter {
  _userDefinedWidth = 0;
  _scrollBarWidth = 0;
  _scrollWidth = 0;
  _computedHeight = 0;

  userDefinedWidth(_element: any): number {
    return this._userDefinedWidth;
  }

  scrollBarWidth(_element: any) {
    return this._scrollBarWidth;
  }

  scrollWidth(_element: any) {
    return this._scrollWidth;
  }

  computedHeight(_element: any) {
    return this._computedHeight;
  }
}

export const MOCK_DOM_ADAPTER_PROVIDER = {
  provide: DomAdapter,
  useClass: MockDomAdapter,
};
