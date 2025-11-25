/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
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

  override userDefinedWidth(_element: any): number {
    return this._userDefinedWidth;
  }

  override scrollBarWidth(_element: any) {
    return this._scrollBarWidth;
  }

  override scrollWidth(_element: any) {
    return this._scrollWidth;
  }

  override computedHeight(_element: any) {
    return this._computedHeight;
  }
}

export const MOCK_DOM_ADAPTER_PROVIDER = {
  provide: DomAdapter,
  useClass: MockDomAdapter,
};
