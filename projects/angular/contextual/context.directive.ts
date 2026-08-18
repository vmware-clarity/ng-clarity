/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Input, OnDestroy, OnInit } from '@angular/core';

import { ClrComponentContext, ClrContextProvider } from './interfaces/context.interface';
import { ClrContextRegistryService } from './providers/context-registry.service';

/**
 * Annotates a piece of UI with semantic context for AI agents — the knowledge only the
 * application has, such as what a section is for:
 *
 * ```html
 * <section clrContext="Firewall rules for the selected cluster" [clrContextState]="{ cluster: clusterName }">
 * ```
 *
 * The annotation is part of snapshots only while this element exists: it registers when
 * the directive initializes and unregisters when it is destroyed, and its inputs are
 * read at snapshot time, so snapshots never contain outdated annotations.
 */
@Directive({
  selector: '[clrContext]',
  standalone: false,
})
export class ClrContext implements OnInit, OnDestroy, ClrContextProvider {
  /** Human-readable description of what this piece of UI is about. */
  @Input('clrContext') label = '';
  /** Kind of UI this annotation describes. Defaults to `'region'`. */
  @Input('clrContextType') type = 'region';
  /** Current application state an agent should know about, as a small serializable object. */
  @Input('clrContextState') state: Record<string, unknown> | null = null;

  constructor(private readonly contextRegistry: ClrContextRegistryService) {}

  ngOnInit(): void {
    this.contextRegistry.register(this);
  }

  ngOnDestroy(): void {
    this.contextRegistry.unregister(this);
  }

  getClrContext(): ClrComponentContext | null {
    if (!this.label && !this.state) {
      return null;
    }
    const context: ClrComponentContext = { type: this.type };
    if (this.label) {
      context.label = this.label;
    }
    if (this.state && Object.keys(this.state).length) {
      context.state = this.state;
    }
    return context;
  }
}
