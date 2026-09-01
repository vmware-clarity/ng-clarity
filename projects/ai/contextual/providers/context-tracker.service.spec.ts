/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { ClrContextTrackerService } from './context-tracker.service';
import { ClrPageContext } from '../interfaces/context.interface';

@Component({ template: '' })
class RoutedComponent {}

describe('ClrContextTrackerService', () => {
  let tracker: ClrContextTrackerService;
  let emitted: ClrPageContext[];

  function waitForScrape(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 30));
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

  it('scrapes the page again after each completed navigation', async () => {
    tracker.start({ settleMs: 1 });

    await TestBed.inject(Router).navigateByUrl('/inventory');
    await waitForScrape();
    await TestBed.inject(Router).navigateByUrl('/settings');
    await waitForScrape();

    expect(emitted.length).toBe(3);
    expect(emitted[1].route?.url).toBe('/inventory');
    expect(emitted[2].route?.url).toBe('/settings');
    expect(tracker.currentContext?.route?.url).toBe('/settings');
  });

  it('waits for the page to settle before scraping', async () => {
    tracker.start({ settleMs: 1000 });

    await TestBed.inject(Router).navigateByUrl('/inventory');

    expect(emitted.length).toBe(1);
  });

  it('applies the configured snapshot budgets', () => {
    tracker.start({ snapshot: { includeDomComponents: false, includeActions: false } });

    expect(emitted[0].components).toEqual([]);
    expect(emitted[0].actions).toBeUndefined();
  });

  it('stops emitting once stopped', async () => {
    tracker.start({ settleMs: 1 });
    tracker.stop();

    await TestBed.inject(Router).navigateByUrl('/inventory');
    await waitForScrape();

    expect(emitted.length).toBe(1);
  });

  it('restarts with new options when started again', async () => {
    tracker.start({ settleMs: 1 });
    tracker.start({ settleMs: 1, snapshot: { includeDomComponents: false } });

    await TestBed.inject(Router).navigateByUrl('/inventory');
    await waitForScrape();

    expect(emitted.length).toBe(3);
    expect(emitted[2].components).toEqual([]);
  });

  it('emits fresh snapshots on manual refresh', () => {
    tracker.start();
    tracker.refresh();

    expect(emitted.length).toBe(2);
    expect(emitted[1]).not.toBe(emitted[0]);
  });
});
