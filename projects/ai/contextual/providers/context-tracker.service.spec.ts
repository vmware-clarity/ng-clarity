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
import { CLR_CONTEXT_IGNORE_ATTRIBUTE } from '../dom/dom-context-collector';
import { ClrPageContext } from '../interfaces/context.interface';

@Component({ template: '' })
class RoutedComponent {}

describe('ClrContextTrackerService', () => {
  let tracker: ClrContextTrackerService;
  let emitted: ClrPageContext[];
  let addedElements: Element[];

  function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function addWidget(label: string, parent: Element = document.body): Element {
    const widget = document.createElement('clr-fake-widget');
    widget.setAttribute('aria-label', label);
    widget.textContent = label;
    parent.appendChild(widget);
    addedElements.push(widget);
    return widget;
  }

  function widgetLabels(context: ClrPageContext | null): (string | undefined)[] {
    return (context?.components ?? []).filter(component => component.type === 'fake-widget').map(c => c.label);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    tracker = TestBed.inject(ClrContextTrackerService);
    emitted = [];
    addedElements = [];
    tracker.context$.subscribe(context => emitted.push(context));
  });

  afterEach(() => {
    tracker.stop();
    for (const element of addedElements) {
      element.remove();
    }
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

  it('scrapes and emits after the DOM changes', async () => {
    tracker.start({ debounceMs: 20 });

    addWidget('Chat widget');
    await wait(120);

    expect(widgetLabels(tracker.currentContext)).toContain('Chat widget');
  });

  it('coalesces a burst of changes into a single emission', async () => {
    tracker.start({ debounceMs: 60 });
    const countAfterStart = emitted.length;

    addWidget('First');
    await wait(15);
    addWidget('Second');
    await wait(200);

    expect(emitted.length).toBe(countAfterStart + 1);
    expect(widgetLabels(tracker.currentContext)).toEqual(['First', 'Second']);
  });

  it('does not emit when the page context did not meaningfully change', async () => {
    tracker.start({ debounceMs: 20 });
    const countAfterStart = emitted.length;

    // A plain div is a DOM change but contributes nothing to the context.
    const div = document.createElement('div');
    document.body.appendChild(div);
    addedElements.push(div);
    await wait(120);

    expect(emitted.length).toBe(countAfterStart);
  });

  it('ignores mutations inside ignore-marked regions', async () => {
    const ignored = document.createElement('div');
    ignored.setAttribute(CLR_CONTEXT_IGNORE_ATTRIBUTE, '');
    document.body.appendChild(ignored);
    addedElements.push(ignored);
    tracker.start({ debounceMs: 20 });
    const countAfterStart = emitted.length;

    addWidget('Panel internals', ignored);
    await wait(120);

    expect(emitted.length).toBe(countAfterStart);
    expect(widgetLabels(tracker.currentContext)).toEqual([]);
  });

  it('still scrapes at the max-wait bound when the page never goes quiet', async () => {
    tracker.start({ debounceMs: 80, maxWaitMs: 200 });

    const noise = document.createElement('div');
    document.body.appendChild(noise);
    addedElements.push(noise);
    addWidget('Appears despite noise');
    const interval = setInterval(() => noise.setAttribute('data-tick', String(Date.now())), 30);

    try {
      await wait(350);
      expect(widgetLabels(tracker.currentContext)).toContain('Appears despite noise');
    } finally {
      clearInterval(interval);
    }
  });

  it('stops reacting to DOM changes once stopped', async () => {
    tracker.start({ debounceMs: 20 });
    tracker.stop();
    const countWhenStopped = emitted.length;

    addWidget('Too late');
    await wait(120);

    expect(emitted.length).toBe(countWhenStopped);
  });

  it('applies the configured snapshot budgets to tracked scrapes', async () => {
    tracker.start({ debounceMs: 20, snapshot: { includeDomComponents: false, includeActions: false } });

    addWidget('Never collected');
    await wait(120);

    expect(tracker.currentContext?.components).toEqual([]);
    expect(tracker.currentContext?.actions).toBeUndefined();
  });

  it('restarts with new options when started again', async () => {
    tracker.start({ debounceMs: 20 });
    tracker.start({ debounceMs: 20, snapshot: { includeDomComponents: false } });

    addWidget('Ignored by new budget');
    await wait(120);

    expect(tracker.currentContext?.components).toEqual([]);
  });

  it('emits fresh snapshots on manual refresh', () => {
    tracker.start();
    tracker.refresh();

    expect(emitted.length).toBe(2);
    expect(emitted[1]).not.toBe(emitted[0]);
  });

  describe('with a router', () => {
    it('reads the current route at scrape time, so navigations are tracked through their DOM changes', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [provideRouter([{ path: 'inventory', component: RoutedComponent }])],
      });
      const routedTracker = TestBed.inject(ClrContextTrackerService);
      routedTracker.start({ debounceMs: 20 });

      try {
        await TestBed.inject(Router).navigateByUrl('/inventory');
        // In a real app the navigation itself mutates the DOM; simulate that render.
        addWidget('Rendered by the new page');
        await wait(120);

        expect(routedTracker.currentContext?.route?.url).toBe('/inventory');
      } finally {
        routedTracker.stop();
      }
    });
  });
});
