/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ApplicationRef, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { ClrContextTrackerService } from './context-tracker.service';
import { ClrPageContext } from '../interfaces/context.interface';

@Component({ template: '' })
class RoutedComponent {}

describe('ClrContextTrackerService', () => {
  let tracker: ClrContextTrackerService;
  let emitted: ClrPageContext[];

  /** Forces a render so afterNextRender fires, then lets the stability pass settle. */
  async function renderAndSettle(): Promise<void> {
    TestBed.inject(ApplicationRef).tick();
    await new Promise(resolve => setTimeout(resolve, 30));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'inventory', component: RoutedComponent },
          { path: 'settings', component: RoutedComponent },
        ]),
      ],
    });
    tracker = TestBed.inject(ClrContextTrackerService);
    emitted = [];
    tracker.context$.subscribe(context => emitted.push(context));
  });

  afterEach(() => {
    tracker.stop();
  });

  it('has no context before tracking starts', () => {
    expect(tracker.currentContext).toBeNull();
    expect(emitted.length).toBe(0);
  });

  it('emits an initial snapshot when tracking starts', () => {
    tracker.start();

    expect(emitted.length).toBe(1);
    expect(emitted[0].title).toBe(document.title);
    expect(tracker.currentContext).toBe(emitted[0]);
  });

  it('replays the latest snapshot to late subscribers', () => {
    tracker.start();

    const late: ClrPageContext[] = [];
    tracker.context$.subscribe(context => late.push(context));

    expect(late).toEqual([emitted[0]]);
  });

  it('scrapes the page again after each completed navigation, once it has rendered', async () => {
    tracker.start();

    await TestBed.inject(Router).navigateByUrl('/inventory');
    await renderAndSettle();

    expect(tracker.currentContext?.route?.url).toBe('/inventory');

    await TestBed.inject(Router).navigateByUrl('/settings');
    await renderAndSettle();

    expect(tracker.currentContext?.route?.url).toBe('/settings');
  });

  it('does not emit duplicate context from the stability pass when nothing changed', async () => {
    tracker.start();

    await TestBed.inject(Router).navigateByUrl('/inventory');
    await renderAndSettle();
    const countAfterNavigation = emitted.length;
    await renderAndSettle();

    expect(emitted.length).toBe(countAfterNavigation);
    const routes = emitted.filter(context => context.route?.url === '/inventory');
    expect(routes.length).toBe(1);
  });

  it('applies the configured snapshot budgets', () => {
    tracker.start({ snapshot: { includeDomComponents: false, includeActions: false } });

    expect(emitted[0].components).toEqual([]);
    expect(emitted[0].actions).toBeUndefined();
  });

  it('stops emitting once stopped', async () => {
    tracker.start();
    tracker.stop();
    const countWhenStopped = emitted.length;

    await TestBed.inject(Router).navigateByUrl('/inventory');
    await renderAndSettle();

    expect(emitted.length).toBe(countWhenStopped);
    expect(tracker.currentContext?.route?.url).not.toBe('/inventory');
  });

  it('restarts with new options when started again', async () => {
    tracker.start();
    tracker.start({ snapshot: { includeDomComponents: false } });

    await TestBed.inject(Router).navigateByUrl('/inventory');
    await renderAndSettle();

    expect(tracker.currentContext?.route?.url).toBe('/inventory');
    expect(tracker.currentContext?.components).toEqual([]);
  });

  it('emits fresh snapshots on manual refresh', () => {
    tracker.start();
    tracker.refresh();

    expect(emitted.length).toBe(2);
    expect(emitted[1]).not.toBe(emitted[0]);
  });

  it('can skip the stability pass entirely', async () => {
    tracker.start({ awaitStability: false });

    await TestBed.inject(Router).navigateByUrl('/inventory');
    await renderAndSettle();

    expect(tracker.currentContext?.route?.url).toBe('/inventory');
  });
});
