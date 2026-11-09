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

  it('hands out a copy of what a provider returned, never the provider’s own objects', () => {
    const cluster = { name: 'Production', hosts: ['esx-01'] };
    const own: ClrComponentContext = { type: 'region', label: 'Cluster', state: { cluster } };
    registry.register(provider(own));

    const [collected] = registry.collect();
    (collected.state?.['cluster'] as typeof cluster).hosts.push('injected');
    collected.label = 'Changed';

    expect(collected).not.toBe(own);
    expect(collected.state?.['cluster']).not.toBe(cluster);
    expect(cluster.hosts).toEqual(['esx-01']);
    expect(own.label).toBe('Cluster');
  });

  it('copies only the plain, serialisable part of what a provider returned', () => {
    class Model {
      readonly name = 'Production';
    }
    registry.register(
      provider({ type: 'region', label: 'Cluster', state: { model: new Model(), load: () => 1, empty: [] } as never })
    );

    expect(registry.collect()).toEqual([{ type: 'region', label: 'Cluster', state: { empty: [] } }]);
  });
});
