/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { signal } from '@angular/core';

export class ButtonHubMock {
  private readonly _buttonsReady = signal(false);

  get buttonsReady(): boolean {
    return this._buttonsReady();
  }
  set buttonsReady(value: boolean) {
    this._buttonsReady.set(value);
  }

  buttonClicked(type: string): string {
    return type;
  }
}
