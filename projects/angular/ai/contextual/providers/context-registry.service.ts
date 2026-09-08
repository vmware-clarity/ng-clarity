/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { ClrComponentContext, ClrContextProvider } from '../interfaces/context.interface';

/**
 * Root registry of everything currently able to contribute context to a page snapshot.
 *
 * Providers register when they enter the page and unregister when they are destroyed,
 * so the registry only ever knows about UI that exists right now. Context itself is
 * never stored here — providers are polled at snapshot time — which prevents stale
 * information from accumulating.
 */
@Injectable({ providedIn: 'root' })
export class ClrContextRegistryService {
  private readonly providers: ClrContextProvider[] = [];

  /**
   * Registers a context provider. Call the returned function (or `unregister`) when the
   * provider leaves the page, typically from `ngOnDestroy`.
   */
  register(provider: ClrContextProvider): () => void {
    if (!this.providers.includes(provider)) {
      this.providers.push(provider);
    }
    return () => this.unregister(provider);
  }

  unregister(provider: ClrContextProvider): void {
    const index = this.providers.indexOf(provider);
    if (index > -1) {
      this.providers.splice(index, 1);
    }
  }

  /**
   * Polls all live providers for their current context. Providers that return `null`
   * or throw are skipped so a single faulty provider cannot break a snapshot.
   */
  collect(): ClrComponentContext[] {
    const contexts: ClrComponentContext[] = [];
    for (const provider of this.providers) {
      try {
        const context = provider.getClrContext();
        if (context) {
          contexts.push(context);
        }
      } catch {
        // A provider that fails to describe itself should not break the whole snapshot.
      }
    }
    return contexts;
  }
}
