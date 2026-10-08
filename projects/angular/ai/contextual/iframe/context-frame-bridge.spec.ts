/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  CLR_CONTEXT_PROTOCOL,
  ClrContextFrameHost,
  ClrContextFrameRequest,
  ClrContextFrameResponse,
  clrRequestHostContext,
} from './context-frame-bridge';
import { resetNoHostOriginWarning } from './host-origin-warning';
import { ClrContextSnapshotOptions, ClrPageContext } from '../interfaces/context.interface';

/**
 * A stand-in for a frame's window: enough surface for the bridge, and a spy to assert on.
 * It is a frame of this window, as the bridge requires of anything it serves.
 */
interface FakeWindow {
  postMessage: jasmine.Spy;
  parent: unknown;
  location: { origin: string } | undefined;
}

/** A same-origin window by default, whose origin a request can read; pass `null` for one it cannot. */
function fakeWindow(parent: unknown = window, origin: string | null = window.location.origin): FakeWindow {
  return { postMessage: jasmine.createSpy('postMessage'), parent, location: origin ? { origin } : undefined };
}

/**
 * Dispatches a message the way a browser would. Built from a plain `Event` because
 * `MessageEvent`'s constructor refuses a `source` that is not a real Window, and these
 * tests need to control exactly which window a message claims to come from.
 */
function dispatchMessage(init: { data: unknown; origin?: string; source?: unknown }): void {
  const event = new Event('message') as Event & { data: unknown; origin: string; source: unknown };
  event.data = init.data;
  event.origin = init.origin ?? window.location.origin;
  event.source = 'source' in init ? init.source : window;
  window.dispatchEvent(event);
}

describe('Context frame bridge', () => {
  const pageContext: ClrPageContext = {
    title: 'Host page',
    url: 'https://app.example/clusters/42?tenant=acme&token=secret#details',
    route: {
      url: '/clusters/42?tenant=acme',
      path: 'clusters/:id',
      params: { id: '42' },
      queryParams: { tenant: 'acme', token: 'secret' },
    },
    regions: [],
    components: [
      {
        type: 'form',
        children: [
          { type: 'textbox', label: 'Host name', state: { value: 'esx-prod-04', required: true } },
          { type: 'combobox', label: 'Cluster', state: { value: 'beta', options: ['Alpha', 'Beta'] } },
        ],
      },
    ],
    collectedAt: '2026-01-01T00:00:00.000Z',
  };

  function frameRequest(requestId: unknown, options?: unknown): unknown {
    return {
      protocol: CLR_CONTEXT_PROTOCOL,
      kind: 'context-request',
      requestId,
      options,
    };
  }

  function servedContext(target: FakeWindow): ClrPageContext {
    return (target.postMessage.calls.mostRecent().args[0] as ClrContextFrameResponse).context;
  }

  describe('ClrContextFrameHost', () => {
    let host: ClrContextFrameHost;
    let getSnapshot: jasmine.Spy;
    let frame: FakeWindow;

    function dispatchRequest(request: unknown, origin: string = window.location.origin, source: unknown = frame) {
      dispatchMessage({ data: request, origin, source });
    }

    beforeEach(() => {
      getSnapshot = jasmine.createSpy('getSnapshot').and.callFake(() => JSON.parse(JSON.stringify(pageContext)));
      frame = fakeWindow();
      host = new ClrContextFrameHost(getSnapshot, window, { minRequestIntervalMs: 0 });
      host.start();
    });

    afterEach(() => host.stop());

    it('answers a request from an allowed origin with a fresh snapshot', () => {
      dispatchRequest(frameRequest('request-1'));

      expect(getSnapshot).toHaveBeenCalled();
      expect(servedContext(frame).components[0].type).toBe('form');
      // The title names what is on screen as often as the page: it goes with the address.
      expect(servedContext(frame).title).toBe('');
    });

    it('answers only the origin that asked, never every origin', () => {
      dispatchRequest(frameRequest('request-1'));

      expect(frame.postMessage.calls.mostRecent().args[1]).toEqual({ targetOrigin: window.location.origin });
    });

    it('only forwards known snapshot options from the embedded frame', () => {
      dispatchRequest(frameRequest('request-2', { maxComponents: 5, includeDomComponents: false, injected: 'nope' }));

      const requested = getSnapshot.calls.mostRecent().args[0];
      expect(requested).toEqual(jasmine.objectContaining({ maxComponents: 5, includeDomComponents: false }));
      expect('injected' in requested).toBe(false);
    });

    it('discards anything in the request that is not a budget', () => {
      dispatchRequest(frameRequest('request-2b', { shareFormValues: true, shareFullUrl: true }));

      const requested = getSnapshot.calls.mostRecent().args[0];
      expect('shareFormValues' in requested).toBe(false);
      expect('shareFullUrl' in requested).toBe(false);
    });

    it('holds a frame to the default budgets and switches when the host sets no ceiling', () => {
      dispatchRequest(frameRequest('request-2c', { maxComponents: 100_000, includeRoutes: true }));

      expect(getSnapshot.calls.mostRecent().args[0]).toEqual(
        jasmine.objectContaining({ maxComponents: 300, includeRoutes: false })
      );
    });

    it('ignores requests from origins that are not allowed', () => {
      dispatchRequest(frameRequest('request-3'), 'https://evil.example');

      expect(frame.postMessage).not.toHaveBeenCalled();
    });

    it('answers only frames embedded in the page, not a popup, a tab or an opener from an allowed origin', () => {
      host.stop();
      host = new ClrContextFrameHost(getSnapshot, window, { allowAnyOrigin: true, minRequestIntervalMs: 0 });
      host.start();
      const popup = fakeWindow();
      popup.parent = popup;
      const detached = fakeWindow(null);

      dispatchRequest(frameRequest('popup'), 'https://evil.example', popup);
      dispatchRequest(frameRequest('detached'), window.location.origin, detached);
      dispatchRequest(frameRequest('itself'), window.location.origin, window);

      expect(getSnapshot).not.toHaveBeenCalled();
      expect(popup.postMessage).not.toHaveBeenCalled();
      expect(detached.postMessage).not.toHaveBeenCalled();

      dispatchRequest(frameRequest('embedded'), 'https://plugin.example', frame);
      expect(frame.postMessage).toHaveBeenCalledTimes(1);
    });

    it('says when its ceiling has an exclusion list that is not one', () => {
      const warn = spyOn(console, 'warn');
      new ClrContextFrameHost(getSnapshot, window, {
        snapshot: { excludeSelectors: '.secret' } as unknown as ClrContextSnapshotOptions,
      });

      expect(warn).toHaveBeenCalledOnceWith(
        'Clarity context options: excludeSelectors must be a list, so ".secret" was ignored.'
      );
    });

    it('refuses an opaque origin, which cannot be answered safely: listing one is a configuration error', () => {
      expect(() => new ClrContextFrameHost(getSnapshot, window, { allowedOrigins: ['null'] })).toThrowError(
        /not an origin/
      );

      dispatchRequest(frameRequest('request-opaque'), 'null');

      expect(frame.postMessage).not.toHaveBeenCalled();
    });

    it('serves an origin listed with a trailing slash, a path or capitals, as the browser reports it', () => {
      host.stop();
      host = new ClrContextFrameHost(getSnapshot, window, {
        allowedOrigins: ['HTTPS://Chat.Example/assistant/'],
        minRequestIntervalMs: 0,
      });
      host.start();

      dispatchRequest(frameRequest('request-normalised'), 'https://chat.example');

      expect(frame.postMessage).toHaveBeenCalled();
    });

    it('asks for a list on a page with no origin of its own, rather than defaulting to "null"', () => {
      const originless = { location: { origin: 'null' } } as unknown as Window;

      expect(() => new ClrContextFrameHost(getSnapshot, originless)).toThrowError(/no origin of its own/);
      expect(
        () => new ClrContextFrameHost(getSnapshot, originless, { allowedOrigins: ['https://chat.example'] })
      ).not.toThrow();
    });

    it('refuses an entry that is not an origin at all', () => {
      expect(() => new ClrContextFrameHost(getSnapshot, window, { allowedOrigins: ['/relative'] })).toThrowError(
        /not an origin/
      );
    });

    it('does not honour a wildcard origin on its own', () => {
      // A list that only says '*' names nobody to serve; refused rather than silently
      // serving nobody, or worse, everybody.
      expect(
        () => new ClrContextFrameHost(getSnapshot, window, { allowedOrigins: ['*'], minRequestIntervalMs: 0 })
      ).toThrowError(/allowAnyOrigin/);
    });

    it('serves any origin only when that is acknowledged explicitly', () => {
      host.stop();
      host = new ClrContextFrameHost(getSnapshot, window, { allowAnyOrigin: true, minRequestIntervalMs: 0 });
      host.start();

      dispatchRequest(frameRequest('request-4b'), 'https://trusted.example');

      expect(frame.postMessage).toHaveBeenCalled();
    });

    it('ignores requests that carry no window to answer to', () => {
      dispatchRequest(frameRequest('request-no-source'), window.location.origin, null);

      expect(getSnapshot).not.toHaveBeenCalled();
    });

    it('ignores a request whose id is not a string', () => {
      dispatchRequest(frameRequest({ nested: 'object' }));

      expect(getSnapshot).not.toHaveBeenCalled();
    });

    it('ignores a request whose id is absurdly long, rather than echoing it back', () => {
      dispatchRequest(frameRequest('x'.repeat(5000)));

      expect(getSnapshot).not.toHaveBeenCalled();
    });

    it('ignores unrelated messages', () => {
      dispatchRequest({ some: 'other message' });
      dispatchRequest('plain text');

      expect(frame.postMessage).not.toHaveBeenCalled();
    });

    it('stops answering after stop()', () => {
      host.stop();

      dispatchRequest(frameRequest('request-5'));

      expect(frame.postMessage).not.toHaveBeenCalled();
    });

    describe('what a frame is allowed to see', () => {
      it('serves the route pattern in place of the address, which routinely carries identifiers and tokens', () => {
        dispatchRequest(frameRequest('request-url'));

        expect(servedContext(frame).url).toBe('https://app.example/clusters/:id');
      });

      it('withholds the route parameters, query parameters and data', () => {
        dispatchRequest(frameRequest('request-route'));

        const route = servedContext(frame).route;
        expect(route).toEqual({ url: '/clusters/:id', path: 'clusters/:id' });
      });

      it('withholds what the user typed, which the application sees but a frame has no claim to', () => {
        dispatchRequest(frameRequest('request-values'));

        const json = JSON.stringify(servedContext(frame));
        expect(json).not.toContain('esx-prod-04');
        expect(json).not.toContain('"value"');
      });

      it('withholds the addresses of the page’s links and frames too, for the same reason', () => {
        host.stop();
        host = new ClrContextFrameHost(
          () => ({
            ...pageContext,
            components: [
              { type: 'link', label: 'Download', state: { href: '/files/report.pdf?sig=secret#page=2' } },
              {
                type: 'main',
                children: [
                  { type: 'link', label: 'Profile', state: { href: '/users/42?token=abc' } },
                  { type: 'link', label: 'Partner', state: { href: 'https://partner.example/invite/abc' } },
                  { type: 'link', label: 'Mail', state: { href: 'mailto:someone@example.test' } },
                ],
              },
              { type: 'frame', label: 'Plugin', state: { url: 'https://app.example/plugins/7' } },
            ],
          }),
          window,
          { minRequestIntervalMs: 0 },
          url => (/^\/users\/[^/]+$/.test(url.pathname) ? 'users/:id' : null)
        );
        host.start();

        dispatchRequest(frameRequest('request-links'));

        const [download, main, plugin] = servedContext(frame).components;
        expect(download.state?.['href']).toBeUndefined();
        expect(main.children?.map(link => link.state?.['href'])).toEqual([
          '/users/:id',
          'https://partner.example/',
          'mailto:',
        ]);
        expect(plugin.state?.['url']).toBe('https://app.example/');
        const json = JSON.stringify(servedContext(frame));
        ['secret', '42', 'abc', 'someone', 'plugins/7'].forEach(detail => expect(json).not.toContain(detail));
      });

      it('serves only the origin of a page that matches no route, and resolves relative links against the page', () => {
        host.stop();
        host = new ClrContextFrameHost(
          () => ({
            title: 'Host page',
            url: 'https://app.example/reset/4f9c-token',
            regions: [],
            components: [{ type: 'link', label: 'Edit', state: { href: 'edit' } }],
            collectedAt: new Date(0).toISOString(),
          }),
          window,
          { minRequestIntervalMs: 0 },
          url => (url.pathname === '/reset/edit' ? 'reset/edit' : null)
        );
        host.start();

        dispatchRequest(frameRequest('request-no-route'));

        const served = servedContext(frame);
        expect(served.url).toBe('https://app.example/');
        expect(served.route).toBeUndefined();
        // `edit` on /reset/4f9c-token is /reset/edit, not /edit.
        expect(served.components[0].state?.['href']).toBe('/reset/edit');
        expect(JSON.stringify(served)).not.toContain('4f9c');
      });

      it('still describes the fields and what they permit', () => {
        dispatchRequest(frameRequest('request-fields'));

        const field = servedContext(frame).components[0].children?.[1];
        expect(field?.label).toBe('Cluster');
        expect(field?.state?.options).toEqual(['Alpha', 'Beta']);
      });

      it('shares what the user typed when the host says so explicitly', () => {
        host.stop();
        host = new ClrContextFrameHost(getSnapshot, window, { shareFormValues: true, minRequestIntervalMs: 0 });
        host.start();

        dispatchRequest(frameRequest('request-shared-values'));

        expect(JSON.stringify(servedContext(frame))).toContain('esx-prod-04');
      });

      it('shares the full URL when the host opts in', () => {
        host.stop();
        host = new ClrContextFrameHost(getSnapshot, window, { shareFullUrl: true, minRequestIntervalMs: 0 });
        host.start();

        dispatchRequest(frameRequest('request-full-url'));

        expect(servedContext(frame).url).toBe(pageContext.url);
        expect(servedContext(frame).title).toBe('Host page');
      });

      it('does not alter the snapshot it was given', () => {
        const snapshot = JSON.parse(JSON.stringify(pageContext)) as ClrPageContext;
        getSnapshot.and.returnValue(snapshot);

        dispatchRequest(frameRequest('request-no-mutation'));

        expect(snapshot.url).toBe(pageContext.url);
        expect(snapshot.route?.queryParams).toEqual({ tenant: 'acme', token: 'secret' });
      });
    });

    describe('throttling', () => {
      beforeEach(() => {
        host.stop();
        host = new ClrContextFrameHost(getSnapshot, window, { minRequestIntervalMs: 10_000 });
        host.start();
      });

      it('answers one request per frame per interval, so a loop cannot pin the main thread', () => {
        dispatchRequest(frameRequest('first'));
        dispatchRequest(frameRequest('second'));
        dispatchRequest(frameRequest('third'));

        expect(getSnapshot).toHaveBeenCalledTimes(1);
      });

      it('serves a frame again once the interval has passed', () => {
        const now = spyOn(performance, 'now').and.returnValue(1_000_000);
        dispatchRequest(frameRequest('first'));
        dispatchRequest(frameRequest('too-soon'));
        now.and.returnValue(1_000_000 + 10_001);
        dispatchRequest(frameRequest('later'));

        expect(getSnapshot).toHaveBeenCalledTimes(2);
      });

      it('is not stopped by a wall clock set back', () => {
        spyOn(Date, 'now').and.returnValue(0);
        const now = spyOn(performance, 'now').and.returnValue(1_000_000);
        dispatchRequest(frameRequest('first'));
        now.and.returnValue(1_000_000 + 10_001);
        dispatchRequest(frameRequest('later'));

        expect(getSnapshot).toHaveBeenCalledTimes(2);
      });

      it('lets frames a frame nests share its allowance, so spawning frames buys nothing', () => {
        const nested = fakeWindow(frame);

        dispatchRequest(frameRequest('outer'), window.location.origin, frame);
        dispatchRequest(frameRequest('inner'), window.location.origin, nested);

        expect(getSnapshot).toHaveBeenCalledTimes(1);
        expect(nested.postMessage).not.toHaveBeenCalled();
      });

      it('throttles each frame on its own, so one busy frame cannot starve another', () => {
        const other = fakeWindow();

        dispatchRequest(frameRequest('first'), window.location.origin, frame);
        dispatchRequest(frameRequest('second'), window.location.origin, frame);
        dispatchRequest(frameRequest('other-first'), window.location.origin, other);

        expect(getSnapshot).toHaveBeenCalledTimes(2);
        expect(other.postMessage).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('clrRequestHostContext', () => {
    function answering(context: ClrPageContext, overrides: Partial<ClrContextFrameResponse> = {}): FakeWindow {
      const target = fakeWindow();
      target.postMessage.and.callFake((message: ClrContextFrameRequest) => {
        setTimeout(() =>
          dispatchMessage({
            data: {
              protocol: CLR_CONTEXT_PROTOCOL,
              kind: 'context-response',
              requestId: message.requestId,
              context,
              ...overrides,
            },
            source: target,
          })
        );
      });
      return target;
    }

    it('resolves with the host context', async () => {
      const target = answering(pageContext);

      expect(await clrRequestHostContext({ targetWindow: target as unknown as Window })).toEqual(pageContext);
    });

    it('asks only the host origin, rather than announcing itself to any origin', async () => {
      const target = answering(pageContext);

      await clrRequestHostContext({ targetWindow: target as unknown as Window });

      expect(target.postMessage.calls.mostRecent().args[1]).toEqual({ targetOrigin: window.location.origin });
    });

    it('reaches a same-origin srcdoc frame, which reports no origin of its own but shares this one', async () => {
      const frame = document.createElement('iframe');
      frame.srcdoc = '<p>embedded</p>';
      const loaded = new Promise(resolve => frame.addEventListener('load', resolve, { once: true }));
      document.body.appendChild(frame);
      try {
        await loaded;
        const target = frame.contentWindow as Window;
        const received = new Promise<unknown>(resolve =>
          target.addEventListener('message', event => resolve(event.data), { once: true })
        );

        await clrRequestHostContext({ targetWindow: target, timeoutMs: 20 });

        expect(await received).toEqual(jasmine.objectContaining({ kind: 'context-request' }));
      } finally {
        frame.remove();
      }
    });

    it('uses an unguessable request id, so a response cannot be forged by guessing it', async () => {
      const target = answering(pageContext);

      await clrRequestHostContext({ targetWindow: target as unknown as Window });
      const first = (target.postMessage.calls.mostRecent().args[0] as ClrContextFrameRequest).requestId;
      await clrRequestHostContext({ targetWindow: target as unknown as Window });
      const second = (target.postMessage.calls.mostRecent().args[0] as ClrContextFrameRequest).requestId;

      expect(first).not.toBe(second);
      expect(first.length).toBeGreaterThanOrEqual(32);
      expect(first).not.toContain('clr-context');
    });

    it('ignores a response that did not come from the window it asked', async () => {
      const target = fakeWindow();
      target.postMessage.and.callFake((message: ClrContextFrameRequest) => {
        // A sibling frame that guessed the id correctly, answering in the host's place.
        setTimeout(() =>
          dispatchMessage({
            data: {
              protocol: CLR_CONTEXT_PROTOCOL,
              kind: 'context-response',
              requestId: message.requestId,
              context: { ...pageContext, title: 'Forged by a sibling frame' },
            },
            source: fakeWindow(),
          })
        );
      });

      const context = await clrRequestHostContext({ targetWindow: target as unknown as Window, timeoutMs: 40 });

      expect(context).toBeNull();
    });

    it('ignores a response from the right window but the wrong origin', async () => {
      const target = fakeWindow();
      target.postMessage.and.callFake((message: ClrContextFrameRequest) => {
        setTimeout(() =>
          dispatchMessage({
            data: {
              protocol: CLR_CONTEXT_PROTOCOL,
              kind: 'context-response',
              requestId: message.requestId,
              context: pageContext,
            },
            origin: 'https://evil.example',
            source: target,
          })
        );
      });

      const context = await clrRequestHostContext({
        targetWindow: target as unknown as Window,
        hostOrigin: window.location.origin,
        timeoutMs: 40,
      });

      expect(context).toBeNull();
    });

    it('reads the host origin as an origin, whatever its case or trailing slash', async () => {
      const target = answering(pageContext);
      const hostOrigin = `${window.location.origin.toUpperCase()}/`;

      expect(await clrRequestHostContext({ targetWindow: target as unknown as Window, hostOrigin })).toEqual(
        pageContext
      );
      expect(target.postMessage).toHaveBeenCalledWith(jasmine.anything(), { targetOrigin: window.location.origin });
    });

    it('rejects a host origin that is not an origin', async () => {
      const target = answering(pageContext);

      await expectAsync(
        clrRequestHostContext({ targetWindow: target as unknown as Window, hostOrigin: '/app' })
      ).toBeRejectedWithError(/is not an origin/);
      expect(target.postMessage).not.toHaveBeenCalled();
    });

    it('ignores a response that carries no context', async () => {
      const target = answering(pageContext, { context: undefined as unknown as ClrPageContext });

      const context = await clrRequestHostContext({ targetWindow: target as unknown as Window, timeoutMs: 40 });

      expect(context).toBeNull();
    });

    it('ignores responses for other requests until the right one arrives', async () => {
      const target = fakeWindow();
      target.postMessage.and.callFake((message: ClrContextFrameRequest) => {
        setTimeout(() => {
          dispatchMessage({
            data: {
              protocol: CLR_CONTEXT_PROTOCOL,
              kind: 'context-response',
              requestId: 'some-other-request',
              context: { ...pageContext, title: 'Wrong response' },
            },
            source: target,
          });
          dispatchMessage({
            data: {
              protocol: CLR_CONTEXT_PROTOCOL,
              kind: 'context-response',
              requestId: message.requestId,
              context: pageContext,
            },
            source: target,
          });
        });
      });

      const context = await clrRequestHostContext({ targetWindow: target as unknown as Window });

      expect(context?.title).toBe('Host page');
    });

    it('resolves with null when the host never answers', async () => {
      const context = await clrRequestHostContext({
        targetWindow: fakeWindow() as unknown as Window,
        timeoutMs: 10,
      });

      expect(context).toBeNull();
    });

    it('rejects and stops listening when the request cannot be sent', async () => {
      const target = fakeWindow();
      target.postMessage.and.throwError(new DOMException('could not be cloned', 'DataCloneError'));
      const removeEventListener = spyOn(window, 'removeEventListener').and.callThrough();
      const clearTimer = spyOn(window, 'clearTimeout').and.callThrough();

      await expectAsync(
        clrRequestHostContext({ targetWindow: target as unknown as Window, timeoutMs: 60_000 })
      ).toBeRejectedWithError(/could not be cloned/);

      expect(removeEventListener).toHaveBeenCalledWith('message', jasmine.any(Function));
      expect(clearTimer).toHaveBeenCalled();
    });

    describe('with a timeout that is not a usable delay', () => {
      let delays: unknown[];

      beforeEach(() => {
        delays = [];
        const realSetTimeout = window.setTimeout.bind(window);
        // Recorded, then run at once, so each request settles within its test.
        spyOn(window, 'setTimeout').and.callFake(((handler: () => void, delay?: number) => {
          delays.push(delay);
          return realSetTimeout(handler);
        }) as typeof window.setTimeout);
      });

      for (const timeoutMs of [Number.NaN, -1, 0, Number.POSITIVE_INFINITY]) {
        it(`waits the default time rather than giving up at once, given ${timeoutMs}`, async () => {
          expect(
            await clrRequestHostContext({ targetWindow: fakeWindow() as unknown as Window, timeoutMs })
          ).toBeNull();
          expect(delays).toEqual([2000]);
        });
      }

      it('waits as long as a timer can for a timeout longer than that, rather than firing at once', async () => {
        await clrRequestHostContext({ targetWindow: fakeWindow() as unknown as Window, timeoutMs: 2 ** 31 });

        expect(delays).toEqual([2 ** 31 - 1]);
      });
    });

    it('resolves with null when there is no separate host window', async () => {
      expect(await clrRequestHostContext({ targetWindow: window })).toBeNull();
    });

    it('asks another window at its own origin, not the origin of the page embedding this one', async () => {
      const target = fakeWindow(window, 'https://other.example');

      await clrRequestHostContext({ targetWindow: target as unknown as Window, timeoutMs: 10 });

      expect(target.postMessage.calls.mostRecent().args[1]).toEqual({ targetOrigin: 'https://other.example' });
    });

    it('rejects asking another window whose origin it cannot read without a hostOrigin', async () => {
      const target = fakeWindow(window, null);

      await expectAsync(clrRequestHostContext({ targetWindow: target as unknown as Window })).toBeRejectedWithError(
        /needs a hostOrigin/
      );
      expect(target.postMessage).not.toHaveBeenCalled();
    });

    describe('without a hostOrigin, in development', () => {
      let warn: jasmine.Spy;

      beforeEach(() => {
        resetNoHostOriginWarning();
        warn = spyOn(console, 'warn');
      });

      afterEach(() => resetNoHostOriginWarning());

      it('warns once that whichever page embeds the frame is trusted to answer', async () => {
        const target = fakeWindow();
        spyOnProperty(window, 'parent').and.returnValue(target as unknown as Window);

        await clrRequestHostContext({ timeoutMs: 10 });
        await clrRequestHostContext({ timeoutMs: 10 });

        expect(warn).toHaveBeenCalledTimes(1);
        expect(String(warn.calls.mostRecent().args[0])).toContain('no hostOrigin');
      });

      it('does not warn when a hostOrigin is given', async () => {
        const target = fakeWindow();
        spyOnProperty(window, 'parent').and.returnValue(target as unknown as Window);

        await clrRequestHostContext({ hostOrigin: window.location.origin, timeoutMs: 10 });

        expect(warn).not.toHaveBeenCalled();
      });
    });
  });
});

describe('Context frame bridge, what the host stays in charge of', () => {
  const pageContext: ClrPageContext = {
    title: 'Host page',
    regions: [],
    components: [],
    collectedAt: '2026-01-01T00:00:00.000Z',
  };

  function frameRequest(requestId: string, options?: unknown): unknown {
    return { protocol: CLR_CONTEXT_PROTOCOL, kind: 'context-request', requestId, options };
  }

  function dispatchRequest(request: unknown, source: unknown) {
    const event = new Event('message') as Event & { data: unknown; origin: string; source: unknown };
    event.data = request;
    event.origin = window.location.origin;
    event.source = source;
    window.dispatchEvent(event);
  }

  let host: ClrContextFrameHost | null;
  let getSnapshot: jasmine.Spy;

  beforeEach(() => {
    host = null;
    getSnapshot = jasmine.createSpy('getSnapshot').and.callFake(() => JSON.parse(JSON.stringify(pageContext)));
  });

  afterEach(() => host?.stop());

  it('caps the budgets a frame asks for at what the host allows', () => {
    host = new ClrContextFrameHost(getSnapshot, window, { minRequestIntervalMs: 0, snapshot: { maxComponents: 20 } });
    host.start();

    dispatchRequest(frameRequest('big', { maxComponents: 5000 }), fakeWindow());
    expect(getSnapshot.calls.mostRecent().args[0].maxComponents).toBe(20);

    dispatchRequest(frameRequest('small', { maxComponents: 3 }), fakeWindow());
    expect(getSnapshot.calls.mostRecent().args[0].maxComponents).toBe(3);
  });

  it('drops a budget that is not a finite number rather than walking without bound', () => {
    host = new ClrContextFrameHost(getSnapshot, window, { minRequestIntervalMs: 0 });
    host.start();

    dispatchRequest(frameRequest('nan', { maxComponents: Number.NaN }), fakeWindow());

    // Dropped, so the default ceiling applies.
    expect(getSnapshot.calls.mostRecent().args[0].maxComponents).toBe(300);
  });

  it('refuses a configuration that would serve nobody, rather than doing so silently', () => {
    expect(() => new ClrContextFrameHost(getSnapshot, window, { allowedOrigins: ['*'] })).toThrowError(
      /allowAnyOrigin/
    );
    expect(() => new ClrContextFrameHost(getSnapshot, window, { allowedOrigins: [] })).toThrowError(/allowAnyOrigin/);
  });

  it('keeps the default throttle when given an interval that is not a number', () => {
    host = new ClrContextFrameHost(getSnapshot, window, { minRequestIntervalMs: Number.NaN });
    host.start();
    const frame = fakeWindow();

    dispatchRequest(frameRequest('first'), frame);
    dispatchRequest(frameRequest('second'), frame);

    expect(getSnapshot).toHaveBeenCalledTimes(1);
  });

  it('bounds the requests served to all frames together, so nesting frames cannot multiply past the floor', () => {
    host = new ClrContextFrameHost(getSnapshot, window, { minRequestIntervalMs: 10_000 });
    host.start();

    for (let index = 0; index < 25; index++) {
      dispatchRequest(frameRequest(`frame-${index}`), fakeWindow());
    }

    expect(getSnapshot.calls.count()).toBe(5);
  });

  it('keeps serving after one request blows up', () => {
    getSnapshot.and.callFake(() => {
      if (getSnapshot.calls.count() === 1) {
        throw new Error('broken publisher');
      }
      return JSON.parse(JSON.stringify(pageContext));
    });
    host = new ClrContextFrameHost(getSnapshot, window, { minRequestIntervalMs: 0 });
    host.start();
    const frame = fakeWindow();

    expect(() => dispatchRequest(frameRequest('first'), frame)).not.toThrow();
    dispatchRequest(frameRequest('second'), frame);

    expect(frame.postMessage).toHaveBeenCalledTimes(1);
  });

  it('ignores an answer from the right window but an origin other than the one it asked', async () => {
    const target = fakeWindow();
    target.postMessage.and.callFake((message: ClrContextFrameRequest) => {
      setTimeout(() => {
        const event = new Event('message') as Event & { data: unknown; origin: string; source: unknown };
        event.data = {
          protocol: CLR_CONTEXT_PROTOCOL,
          kind: 'context-response',
          requestId: message.requestId,
          context: pageContext,
        };
        event.origin = 'https://elsewhere.example';
        event.source = target;
        window.dispatchEvent(event);
      });
    });

    // No hostOrigin given: the origin the request was addressed to is still the one required.
    expect(await clrRequestHostContext({ targetWindow: target as unknown as Window, timeoutMs: 50 })).toBeNull();
  });
});

describe('Context frame bridge, with a real embedded frame', () => {
  it('answers a request a same-origin frame posts itself, and only that frame', async () => {
    const getSnapshot = jasmine.createSpy('getSnapshot').and.returnValue({
      title: 'Host page',
      regions: [],
      components: [{ type: 'button', label: 'Save' }],
      collectedAt: '',
    } as ClrPageContext);
    const host = new ClrContextFrameHost(getSnapshot, window, { minRequestIntervalMs: 0 });
    host.start();
    const frame = document.createElement('iframe');
    const request = JSON.stringify({ protocol: CLR_CONTEXT_PROTOCOL, kind: 'context-request', requestId: 'real-1' });
    frame.srcdoc = `<script>
      window.addEventListener('message', event => {
        if (event.source === parent && event.data && event.data.kind === 'context-response') {
          window.served = event.data;
        }
      });
      parent.postMessage(${request}, '*');
    <\/script>`;
    const loaded = new Promise(resolve => frame.addEventListener('load', resolve, { once: true }));
    document.body.appendChild(frame);
    try {
      await loaded;
      const frameWindow = frame.contentWindow as Window & { served?: ClrContextFrameResponse };
      for (let attempt = 0; attempt < 50 && !frameWindow.served; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      expect(frameWindow.served?.requestId).toBe('real-1');
      expect(frameWindow.served?.context.components).toEqual([{ type: 'button', label: 'Save' }]);
      expect(getSnapshot).toHaveBeenCalledTimes(1);
    } finally {
      host.stop();
      frame.remove();
    }
  });
});
