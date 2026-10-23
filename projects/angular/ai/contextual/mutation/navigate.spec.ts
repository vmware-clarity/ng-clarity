/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DefaultUrlSerializer, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { ClrMutationEngineService } from './mutation-engine.service';
import {
  ClrMutationConsequence,
  ClrMutationTarget,
  ClrNavigationMutationResult,
  provideClrMutationPolicy,
} from './mutation.interface';
import { fillRoutePath, urlTreeFor } from './navigate';

describe('fillRoutePath', () => {
  it('fills parameters into the pattern as path segments', () => {
    expect(fillRoutePath('clusters/:id/hosts', { id: '42' })).toEqual({ segments: ['clusters', '42', 'hosts'] });
  });

  it('keeps a value with a slash or a space in it to one literal segment', () => {
    expect(fillRoutePath('files/:name', { name: 'my file/2' })).toEqual({ segments: ['files', 'my file/2'] });
  });

  it('names the parameter that is missing', () => {
    expect(fillRoutePath('clusters/:id', {})).toEqual({ missing: 'id' });
    expect(fillRoutePath('clusters/:id', { id: '' })).toEqual({ missing: 'id' });
  });

  it('refuses a value that would step up the path', () => {
    expect(fillRoutePath('users/:id/edit', { id: '..' })).toEqual({ invalid: 'id' });
    expect(fillRoutePath('users/:id/edit', { id: '.' })).toEqual({ invalid: 'id' });
  });

  it('treats the root as no segments', () => {
    expect(fillRoutePath('/')).toEqual({ segments: [] });
  });
});

describe('urlTreeFor', () => {
  const serializer = new DefaultUrlSerializer();

  it('encodes each segment once, as the router does', () => {
    expect(serializer.serialize(urlTreeFor(['hosts', 'my host/2']))).toBe('/hosts/my%20host%2F2');
  });

  it('adds query parameters', () => {
    expect(serializer.serialize(urlTreeFor(['hosts'], { tab: 'a b' }))).toBe('/hosts?tab=a%20b');
  });

  it('is the root for no segments', () => {
    expect(serializer.serialize(urlTreeFor([]))).toBe('/');
  });
});

describe('ClrMutationEngineService navigate', () => {
  @Component({ template: 'routed', standalone: true })
  class Routed {}

  let harness: RouterTestingHarness;
  let engine: ClrMutationEngineService;
  let router: Router;
  let classify: jasmine.Spy<(target: ClrMutationTarget) => ClrMutationConsequence>;
  let releaseSlowGuard: (allowed: boolean) => void;
  let slowGuard: Promise<boolean>;

  beforeEach(async () => {
    classify = jasmine.createSpy('classify').and.returnValue('reversible');
    slowGuard = new Promise(resolve => (releaseSlowGuard = resolve));
    TestBed.configureTestingModule({
      providers: [
        provideClrMutationPolicy({ classify: target => classify(target) }),
        provideRouter([
          { path: '', component: Routed },
          { path: 'hosts', component: Routed },
          { path: 'clusters/:id', component: Routed },
          { path: 'billing', loadChildren: () => Promise.resolve([{ path: '', component: Routed }]) },
          { path: 'legacy', component: Routed, canActivate: [() => TestBed.inject(Router).parseUrl('/hosts')] },
          { path: 'admin', component: Routed, canActivate: [() => false] },
          { path: 'slow', component: Routed, canActivate: [() => slowGuard] },
          {
            path: 'broken',
            component: Routed,
            resolve: {
              data: () => {
                throw new Error('resolver broke');
              },
            },
          },
          { path: '**', redirectTo: '' },
        ]),
      ],
    });
    harness = await RouterTestingHarness.create('/');
    engine = TestBed.inject(ClrMutationEngineService);
    router = TestBed.inject(Router);
  });

  async function navigate(path: string, params?: Record<string, string>, queryParams?: Record<string, string>) {
    const report = await engine.apply([{ operation: 'navigate', path, params, queryParams }]);
    await harness.fixture.whenStable();
    return report.results[0] as ClrNavigationMutationResult;
  }

  it('navigates to a listed route with its parameters filled in', async () => {
    const result = await navigate('clusters/:id', { id: '42' }, { tab: 'hosts' });

    expect(result).toEqual(
      jasmine.objectContaining({
        operation: 'navigate',
        path: 'clusters/:id',
        applied: true,
        outcome: 'navigated',
        url: '/clusters/42?tab=hosts',
      })
    );
    expect(router.url).toBe('/clusters/42?tab=hosts');
    expect(classify).toHaveBeenCalledWith(
      jasmine.objectContaining({ operation: 'navigate', path: 'clusters/:id', url: '/clusters/42?tab=hosts' })
    );
  });

  it('refuses a path the snapshot did not list, and a route missing a parameter', async () => {
    expect(await navigate('/clusters/42')).toEqual(jasmine.objectContaining({ applied: false, refused: 'noRoute' }));
    expect(await navigate('nowhere')).toEqual(jasmine.objectContaining({ applied: false, refused: 'noRoute' }));
    const missing = await navigate('clusters/:id');
    expect(missing.refused).toBe('invalid');
    expect(missing.detail).toContain('"id"');
    expect(router.url).toBe('/');
  });

  it('fills a parameter as one literal segment, whatever it contains', async () => {
    const result = await navigate('clusters/:id', { id: 'a/b ?c' });

    expect(result.outcome).toBe('navigated');
    expect(result.url).toBe('/clusters/a%2Fb%20%3Fc');
    expect(router.routerState.snapshot.root.firstChild?.params).toEqual({ id: 'a/b ?c' });
  });

  it('refuses a parameter that would step up the path', async () => {
    const result = await navigate('clusters/:id', { id: '..' });

    expect(result.refused).toBe('invalid');
    expect(router.url).toBe('/');
  });

  it('navigates to a route whose module has not loaded yet', async () => {
    const result = await navigate('billing');

    expect(result).toEqual(jasmine.objectContaining({ applied: true, outcome: 'navigated', url: '/billing' }));
  });

  it('reports where a guard redirect actually went', async () => {
    const result = await navigate('legacy');

    expect(result.outcome).toBe('redirected');
    expect(result.url).toBe('/hosts');
    expect(result.applied).toBeTrue();
  });

  it('reports a guard that refused', async () => {
    const result = await navigate('admin');

    expect(result).toEqual(jasmine.objectContaining({ applied: false, outcome: 'rejected', url: '/' }));
  });

  it('reports a navigation another one overtook', async () => {
    const pending = navigate('slow');
    await new Promise(resolve => setTimeout(resolve));
    await router.navigateByUrl('/hosts');
    releaseSlowGuard(true);

    expect(await pending).toEqual(jasmine.objectContaining({ applied: false, outcome: 'superseded' }));
    expect(router.url).toBe('/hosts');
  });

  it('reports a navigation that failed, with the router’s reason', async () => {
    const result = await navigate('broken');

    expect(result).toEqual(
      jasmine.objectContaining({ applied: false, outcome: 'failed', detail: 'resolver broke', url: '/' })
    );
  });

  it('reports staying put', async () => {
    expect((await navigate('/')).outcome).toBe('unchanged');
  });

  it('is subject to the policy like any other operation', async () => {
    classify.and.returnValue('forbidden');
    expect((await navigate('hosts')).refused).toBe('forbidden');
    expect(router.url).toBe('/');
  });
});
