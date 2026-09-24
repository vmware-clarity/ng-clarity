/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrContextEngineService } from '@clr/angular/ai';

@Component({
  selector: 'clr-contextual-demo',
  styleUrls: ['./contextual.demo.scss'],
  templateUrl: './contextual.demo.html',
  standalone: false,
})
export class ContextualDemo implements OnInit, OnDestroy {
  constructor(private contextEngine: ClrContextEngineService) {}

  ngOnInit(): void {
    // Let browser-driving agents query any of these pages through window.clrContext().
    this.contextEngine.enableGlobalAccess();
  }

  ngOnDestroy(): void {
    this.contextEngine.disableGlobalAccess();
  }
}
