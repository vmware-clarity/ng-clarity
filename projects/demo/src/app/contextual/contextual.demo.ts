/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ClrContextService } from '@clr/angular/ai';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'clr-contextual-demo',
  styleUrls: ['./contextual.demo.scss'],
  templateUrl: './contextual.demo.html',
  standalone: false,
})
export class ContextualDemo implements OnInit, OnDestroy {
  constructor(private context: ClrContextService) {}

  ngOnInit(): void {
    // The engine won't replace a global it does not own, e.g. an element with that id.
    try {
      this.context.enableGlobalAccess();
    } catch (error) {
      console.warn(error);
    }
  }

  ngOnDestroy(): void {
    this.context.disableGlobalAccess();
  }
}
