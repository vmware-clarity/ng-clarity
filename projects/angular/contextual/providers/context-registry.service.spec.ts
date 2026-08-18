/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextRegistryService } from './context-registry.service';
import { ClrComponentContext, ClrContextProvider } from '../interfaces/context.interface';

describe('ClrContextRegistryService', () => {
  let registry: ClrContextRegistryService;

  function provider(context: ClrComponentContext | null): ClrContextProvider {
    return { getClrContext: () => context };
  }

  beforeEach(() => {
    registry = new ClrContextRegistryService();
  });

  it('collects context from registered providers', () => {
    registry.register(provider({ type: 'region', label: 'users' }));
    registry.register(provider({ type: 'region', label: 'details' }));

    expect(registry.collect().map(context => context.label)).toEqual(['users', 'details']);
  });

  it('does not register the same provider twice', () => {
    const singleProvider = provider({ type: 'region', label: 'users' });
    registry.register(singleProvider);
    registry.register(singleProvider);

    expect(registry.collect().length).toBe(1);
  });

  it('stops collecting from a provider once unregistered', () => {
    const removable = provider({ type: 'region', label: 'gone' });
    registry.register(provider({ type: 'region', label: 'kept' }));
    const unregister = registry.register(removable);

    unregister();

    expect(registry.collect().map(context => context.label)).toEqual(['kept']);
  });

  it('skips providers that currently have nothing to report', () => {
    registry.register(provider(null));

    expect(registry.collect()).toEqual([]);
  });

  it('skips providers that throw instead of breaking the snapshot', () => {
    registry.register({
      getClrContext: () => {
        throw new Error('broken provider');
      },
    });
    registry.register(provider({ type: 'region', label: 'healthy' }));

    expect(registry.collect().map(context => context.label)).toEqual(['healthy']);
  });
});
