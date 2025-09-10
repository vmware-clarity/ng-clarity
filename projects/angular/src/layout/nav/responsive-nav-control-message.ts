/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export class ResponsiveNavControlMessage {
  constructor(
    private _controlCode: string,
    private _navLevel: number
  ) {}

  get controlCode(): string {
    return this._controlCode;
  }

  get navLevel(): number {
    return this._navLevel;
  }
}
