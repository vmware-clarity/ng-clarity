/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClrModalConfigurationService {
  private readonly fadeMoveState = signal('fadeDown');
  private readonly backdropState = signal(true);

  get fadeMove(): string {
    return this.fadeMoveState();
  }
  set fadeMove(fadeMove: string) {
    this.fadeMoveState.set(fadeMove);
  }

  get backdrop(): boolean {
    return this.backdropState();
  }
  set backdrop(backdrop: boolean) {
    this.backdropState.set(backdrop);
  }
}
