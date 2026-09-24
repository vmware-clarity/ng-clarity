/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { ClrContextRegistryService } from './context-registry.service';
import { ClrContextTrackerService } from './context-tracker.service';
import { ClrContextChange } from '../diff';
import { CLR_CONTEXT_IGNORE_ATTRIBUTE } from '../dom/dom-context-collector';
import { ClrComponentContext, ClrPageContext } from '../interfaces/context.interface';

@Component({ template: '' })
class RoutedComponent {}

/*
 * The tracker paces its scrapes with `setTimeout` (a debounce and a max-wait bound), so
 * these specs drive time themselves rather than waiting on the wall clock: every count is
 * asserted at an exact point on the tracker's own schedule.
 *
 * `jasmine.clock()` cannot be used here — zone.js replaces the global timers after
 * Jasmine has booted, and the clock refuses to install over them — so a minimal fake
 * stands in for `setTimeout`/`clearTimeout`; Jasmine restores both after every spec.
 *
 * A `MutationObserver` reports on a microtask, not synchronously, so after changing the
 * DOM a spec lets it deliver (`flushMutations`) before advancing time;
 * `input`/`change` events and registry notifications reach the tracker synchronously.
 */

interface FakeTimer {
  at: number;
  callback: () => void;
}

let now = 0;
let nextTimerId = 1;
const pendingTimers = new Map<number, FakeTimer>();

/** Replaces `setTimeout`/`clearTimeout` for the current spec with timers run by `elapse`. */
function useFakeTimers(): void {
  now = 0;
  nextTimerId = 1;
  pendingTimers.clear();
  spyOn(window, 'setTimeout').and.callFake((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
    if (typeof handler !== 'function') {
      throw new Error('the fake timers only take a function');
    }
    const id = nextTimerId++;
    pendingTimers.set(id, { at: now + (timeout ?? 0), callback: () => handler(...args) });
    return id;
  });
  spyOn(window, 'clearTimeout').and.callFake((id?: number) => {
    if (id !== undefined) {
      pendingTimers.delete(id);
    }
  });
}

/** Runs, in order, every fake timer due within the next `ms` milliseconds. */
function advanceTimers(ms: number): void {
  const until = now + ms;
  for (;;) {
    let dueId: number | null = null;
    for (const [id, timer] of pendingTimers) {
      if (timer.at <= until && (dueId === null || timer.at < (pendingTimers.get(dueId)?.at ?? Infinity))) {
        dueId = id;
      }
    }
    const due = dueId === null ? undefined : pendingTimers.get(dueId);
    if (dueId === null || !due) {
      break;
    }
    pendingTimers.delete(dueId);
    now = due.at;
    due.callback();
  }
  now = until;
}

// The real timer, captured before any spec replaces it.
const realSetTimeout = window.setTimeout.bind(window);

/**
 * Lets pending MutationObserver callbacks run. They are delivered on a native microtask,
 * which a zone-aware `await` does not wait for — zone.js drains its own promise queue
 * synchronously — so this yields to the next task instead: the browser always delivers
 * pending mutation records before running another task. This waits on no amount of time.
 */
function flushMutations(): Promise<void> {
  return new Promise(resolve => realSetTimeout(resolve));
}

/** Delivers pending DOM change notifications, then advances the fake timers. */
async function elapse(ms: number): Promise<void> {
  await flushMutations();
  advanceTimers(ms);
  await flushMutations();
}

describe('ClrContextTrackerService', () => {
  let tracker: ClrContextTrackerService;
  let emitted: ClrPageContext[];
  let addedElements: Element[];

  function addWidget(label: string, parent: Element = document.body): Element {
    const widget = document.createElement('clr-fake-widget');
    widget.setAttribute('aria-label', label);
    widget.textContent = label;
    parent.appendChild(widget);
    addedElements.push(widget);
    return widget;
  }

  function widgetLabels(context: ClrPageContext | null): (string | undefined)[] {
    return (context?.components ?? []).filter(component => component.type === 'clr-fake-widget').map(c => c.label);
  }

  beforeEach(() => {
    useFakeTimers();
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
    const countAfterStart = emitted.length;

    addWidget('Chat widget');
    await elapse(19);
    expect(emitted.length).toBe(countAfterStart);

    await elapse(1);
    expect(emitted.length).toBe(countAfterStart + 1);
    expect(widgetLabels(tracker.currentContext)).toContain('Chat widget');
  });

  it('coalesces a burst of changes into a single emission', async () => {
    tracker.start({ debounceMs: 150 });
    const countAfterStart = emitted.length;

    addWidget('First');
    await elapse(40);
    addWidget('Second');
    // The quiet window restarts with the second change.
    await elapse(149);
    expect(emitted.length).toBe(countAfterStart);

    await elapse(1);
    expect(emitted.length).toBe(countAfterStart + 1);
    expect(widgetLabels(tracker.currentContext)).toEqual(['First', 'Second']);

    // Nothing is left pending: the max-wait bound was cleared with the scrape.
    await elapse(5000);
    expect(emitted.length).toBe(countAfterStart + 1);
  });

  it('does not emit when the page context did not meaningfully change', async () => {
    tracker.start({ debounceMs: 20 });
    const countAfterStart = emitted.length;

    // A plain div is a DOM change but contributes nothing to the context.
    const div = document.createElement('div');
    document.body.appendChild(div);
    addedElements.push(div);
    await elapse(5000);

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
    await elapse(5000);

    expect(emitted.length).toBe(countAfterStart);
    expect(widgetLabels(tracker.currentContext)).toEqual([]);
  });

  it('still scrapes at the max-wait bound when the page never goes quiet', async () => {
    tracker.start({ debounceMs: 200, maxWaitMs: 500 });
    const countAfterStart = emitted.length;

    const noise = document.createElement('div');
    document.body.appendChild(noise);
    addedElements.push(noise);
    addWidget('Appears despite noise');

    // A change every 30ms keeps restarting the 200ms quiet window.
    for (let tick = 1; tick <= 16; tick++) {
      await elapse(30);
      noise.setAttribute('data-tick', String(tick));
    }
    // 480ms since the first change: still inside the max-wait bound.
    expect(emitted.length).toBe(countAfterStart);

    await elapse(20);
    expect(emitted.length).toBe(countAfterStart + 1);
    expect(widgetLabels(tracker.currentContext)).toContain('Appears despite noise');
  });

  it('stops reacting to DOM changes once stopped', async () => {
    tracker.start({ debounceMs: 20 });
    tracker.stop();
    const countWhenStopped = emitted.length;

    addWidget('Too late');
    await elapse(5000);

    expect(emitted.length).toBe(countWhenStopped);
  });

  it('applies the configured snapshot budgets to tracked scrapes', async () => {
    tracker.start({ debounceMs: 20, snapshot: { includeDomComponents: false } });

    addWidget('Never collected');
    await elapse(20);

    expect(tracker.currentContext?.components).toEqual([]);
  });

  it('restarts with new options when started again', async () => {
    tracker.start({ debounceMs: 20 });
    tracker.start({ debounceMs: 20, snapshot: { includeDomComponents: false } });

    addWidget('Ignored by new budget');
    await elapse(20);

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
        await elapse(20);

        expect(routedTracker.currentContext?.route?.url).toBe('/inventory');
      } finally {
        routedTracker.stop();
      }
    });
  });

  describe('tracking what a user types', () => {
    function addInput(value: string, parent: Element = document.body): HTMLInputElement {
      const label = document.createElement('label');
      label.setAttribute('for', 'tracked-host');
      label.textContent = 'Host';
      const input = document.createElement('input');
      input.id = 'tracked-host';
      input.value = value;
      parent.appendChild(label);
      parent.appendChild(input);
      addedElements.push(label, input);
      return input;
    }

    function trackedValue(context: ClrPageContext | null): unknown {
      return (context?.components ?? []).find(component => component.type === 'textbox')?.state?.value;
    }

    it('re-emits when a value changes, which mutates no DOM', async () => {
      const input = addInput('original');
      tracker.start({ debounceMs: 20, maxWaitMs: 60 });
      await elapse(60);
      const before = emitted.length;

      // Typing changes the property, never the attribute, so a DOM observer sees nothing.
      input.value = 'typed-by-user';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await elapse(20);

      expect(emitted.length).toBe(before + 1);
      expect(trackedValue(tracker.currentContext)).toBe('typed-by-user');
    });

    it('coalesces a burst of typing into a single scrape', async () => {
      const input = addInput('a');
      tracker.start({ debounceMs: 40, maxWaitMs: 500 });
      await elapse(80);
      const before = emitted.length;

      for (const value of ['ab', 'abc', 'abcd']) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await elapse(39);
      expect(emitted.length).toBe(before);

      await elapse(1);
      expect(emitted.length).toBe(before + 1);
      expect(trackedValue(tracker.currentContext)).toBe('abcd');

      await elapse(5000);
      expect(emitted.length).toBe(before + 1);
    });

    it('ignores typing inside a region the engine is told to skip', async () => {
      const ignored = document.createElement('div');
      ignored.setAttribute(CLR_CONTEXT_IGNORE_ATTRIBUTE, '');
      document.body.appendChild(ignored);
      addedElements.push(ignored);
      const input = addInput('original', ignored);
      tracker.start({ debounceMs: 20, maxWaitMs: 60 });
      await elapse(60);
      const before = emitted.length;

      input.value = 'typed-in-panel';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await elapse(5000);

      expect(emitted.length).toBe(before);
    });
  });
});

describe('ClrContextTrackerService, tracking application context', () => {
  let tracker: ClrContextTrackerService;
  let registry: ClrContextRegistryService;
  let emitted: ClrPageContext[];

  beforeEach(() => {
    useFakeTimers();
    TestBed.configureTestingModule({});
    tracker = TestBed.inject(ClrContextTrackerService);
    registry = TestBed.inject(ClrContextRegistryService);
    emitted = [];
    tracker.context$.subscribe(context => emitted.push(context));
  });

  afterEach(() => {
    tracker.stop();
  });

  it('re-scrapes when an annotation reports a change, which mutates no DOM', async () => {
    const state: Record<string, unknown> = { cluster: 'alpha' };
    const unregister = registry.register({ getClrContext: () => ({ type: 'region', state }) });
    tracker.start({ debounceMs: 10 });
    expect(emitted[emitted.length - 1].regions[0].state).toEqual({ cluster: 'alpha' });

    state.cluster = 'omega';
    registry.notifyChanged();
    await elapse(10);

    expect(emitted[emitted.length - 1].regions[0].state).toEqual({ cluster: 'omega' });
    unregister();
  });

  it('re-scrapes when a provider leaves', async () => {
    const unregister = registry.register({ getClrContext: () => ({ type: 'region', label: 'transient' }) });
    tracker.start({ debounceMs: 10 });
    expect(emitted[emitted.length - 1].regions.length).toBe(1);

    unregister();
    await elapse(10);

    expect(emitted[emitted.length - 1].regions.length).toBe(0);
  });
});

describe('ClrContextTrackerService, tracking embedded frames', () => {
  let tracker: ClrContextTrackerService;
  let emitted: ClrPageContext[];
  let frame: HTMLIFrameElement;

  // Waits for the frame's real `load` event — an explicit signal, not a fixed delay.
  function loadFrame(html: string): Promise<void> {
    return new Promise(resolve => {
      frame.addEventListener('load', () => resolve(), { once: true });
      frame.srcdoc = html;
    });
  }

  function frameBody(): HTMLElement {
    const body = frame.contentDocument?.body;
    if (!body) {
      throw new Error('frame document not available');
    }
    return body;
  }

  function addFrameButton(label: string): void {
    const button = frameBody().ownerDocument.createElement('button');
    button.textContent = label;
    frameBody().appendChild(button);
  }

  function frameButtons(context: ClrPageContext | null): string[] {
    const inFrames = (nodes: ClrComponentContext[]): ClrComponentContext[] =>
      nodes.flatMap(node => (node.type === 'frame' ? (node.children ?? []) : inFrames(node.children ?? [])));
    return inFrames(context?.components ?? [])
      .filter(node => node.type === 'button')
      .map(node => node.label ?? '');
  }

  beforeEach(() => {
    useFakeTimers();
    TestBed.configureTestingModule({});
    tracker = TestBed.inject(ClrContextTrackerService);
    emitted = [];
    tracker.context$.subscribe(context => emitted.push(context));
    frame = document.createElement('iframe');
    frame.title = 'Plugin';
    document.body.appendChild(frame);
  });

  afterEach(() => {
    tracker.stop();
    frame.remove();
  });

  it('re-scrapes when the DOM inside a same-origin frame changes', async () => {
    await loadFrame('<button>Run</button>');
    tracker.start({ debounceMs: 10 });
    expect(frameButtons(tracker.currentContext)).toEqual(['Run']);

    addFrameButton('Stop');
    await elapse(10);

    expect(frameButtons(emitted[emitted.length - 1])).toEqual(['Run', 'Stop']);
  });

  it('picks a frame up once it loads, and again when it navigates', async () => {
    tracker.start({ debounceMs: 10 });
    await loadFrame('<button>First</button>');
    await elapse(10);
    expect(frameButtons(emitted[emitted.length - 1])).toEqual(['First']);

    await loadFrame('<button>Second</button>');
    await elapse(10);
    expect(frameButtons(emitted[emitted.length - 1])).toEqual(['Second']);

    addFrameButton('Third');
    await elapse(10);
    expect(frameButtons(emitted[emitted.length - 1])).toEqual(['Second', 'Third']);
  });

  it('drops a frame that leaves the page and no longer reacts to its detached document', async () => {
    await loadFrame('<button>Run</button>');
    tracker.start({ debounceMs: 20 });
    await elapse(20);
    expect(frameButtons(tracker.currentContext)).toEqual(['Run']);
    const detached = frameBody();

    frame.remove();
    await elapse(20);
    expect(frameButtons(tracker.currentContext)).toEqual([]);
    const emissions = emitted.length;

    const button = detached.ownerDocument.createElement('button');
    button.textContent = 'Ghost';
    detached.appendChild(button);
    await elapse(5000);
    expect(emitted.length).toBe(emissions);
  });

  it('stops watching a frame once tracking stops', async () => {
    await loadFrame('<button>Run</button>');
    tracker.start({ debounceMs: 10 });
    const before = emitted.length;
    tracker.stop();

    addFrameButton('Stop');
    await elapse(5000);

    expect(emitted.length).toBe(before);
  });
});

describe('ClrContextTrackerService, reporting what changed', () => {
  let tracker: ClrContextTrackerService;
  let changes: ClrContextChange[];
  let widget: HTMLElement | null;

  beforeEach(() => {
    useFakeTimers();
    TestBed.configureTestingModule({});
    tracker = TestBed.inject(ClrContextTrackerService);
    changes = [];
    widget = null;
    tracker.changes$.subscribe(change => changes.push(change));
  });

  afterEach(() => {
    tracker.stop();
    widget?.remove();
  });

  it('lists the first snapshot as all added, then only the difference', async () => {
    tracker.start({ debounceMs: 10 });
    expect(changes.length).toBe(1);
    expect(changes[0].previous).toBeNull();
    expect(changes[0].added.length).toBe(changes[0].current.components.length);

    widget = document.createElement('button');
    widget.textContent = 'Provision';
    document.body.appendChild(widget);
    await elapse(10);

    expect(changes.length).toBe(2);
    const latest = changes[changes.length - 1];
    expect(latest.previous).not.toBeNull();
    expect(latest.added).toEqual([{ type: 'button', label: 'Provision' }]);
    expect(latest.removed).toEqual([]);
  });
});
