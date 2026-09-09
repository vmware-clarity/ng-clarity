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
  requestClrContextFromHost,
} from './context-frame-bridge';
import { ClrPageContext } from '../interfaces/context.interface';

/** A stand-in for a frame's window: enough surface for the bridge, and a spy to assert on. */
interface FakeWindow {
  postMessage: jasmine.Spy;
}

function fakeWindow(): FakeWindow {
  return { postMessage: jasmine.createSpy('postMessage') };
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
      expect(servedContext(frame).title).toBe('Host page');
    });

    it('answers only the origin that asked, never every origin', () => {
      dispatchRequest(frameRequest('request-1'));

      expect(frame.postMessage.calls.mostRecent().args[1]).toEqual({ targetOrigin: window.location.origin });
    });

    it('only forwards known snapshot options from the embedded frame', () => {
      dispatchRequest(frameRequest('request-2', { maxComponents: 5, includeDomComponents: false, injected: 'nope' }));

      expect(getSnapshot).toHaveBeenCalledWith({ maxComponents: 5, includeDomComponents: false });
    });

    it('discards anything in the request that is not a budget', () => {
      dispatchRequest(frameRequest('request-2b', { shareFormValues: true, shareFullUrl: true }));

      expect(getSnapshot).toHaveBeenCalledWith({});
    });

    it('ignores requests from origins that are not allowed', () => {
      dispatchRequest(frameRequest('request-3'), 'https://evil.example');

      expect(frame.postMessage).not.toHaveBeenCalled();
    });

    it('refuses an opaque origin, which cannot be answered safely, even when it is listed', () => {
      host.stop();
      host = new ClrContextFrameHost(getSnapshot, window, { allowedOrigins: ['null'], minRequestIntervalMs: 0 });
      host.start();

      dispatchRequest(frameRequest('request-opaque'), 'null');

      expect(frame.postMessage).not.toHaveBeenCalled();
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
      it('withholds the query string and fragment, which routinely carry tenant and session data', () => {
        dispatchRequest(frameRequest('request-url'));

        expect(servedContext(frame).url).toBe('https://app.example/clusters/42');
      });

      it('withholds query parameters from the route', () => {
        dispatchRequest(frameRequest('request-route'));

        const route = servedContext(frame).route;
        expect(route?.queryParams).toBeUndefined();
        expect(route?.url).toBe('/clusters/42');
        expect(route?.params).toEqual({ id: '42' });
      });

      it('withholds what the user typed, which the application sees but a frame has no claim to', () => {
        dispatchRequest(frameRequest('request-values'));

        const json = JSON.stringify(servedContext(frame));
        expect(json).not.toContain('esx-prod-04');
        expect(json).not.toContain('"value"');
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

  describe('requestClrContextFromHost', () => {
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

      expect(await requestClrContextFromHost({ targetWindow: target as unknown as Window })).toEqual(pageContext);
    });

    it('asks only the host origin, rather than announcing itself to any origin', async () => {
      const target = answering(pageContext);

      await requestClrContextFromHost({ targetWindow: target as unknown as Window });

      expect(target.postMessage.calls.mostRecent().args[1]).toEqual({ targetOrigin: window.location.origin });
    });

    it('uses an unguessable request id, so a response cannot be forged by guessing it', async () => {
      const target = answering(pageContext);

      await requestClrContextFromHost({ targetWindow: target as unknown as Window });
      const first = (target.postMessage.calls.mostRecent().args[0] as ClrContextFrameRequest).requestId;
      await requestClrContextFromHost({ targetWindow: target as unknown as Window });
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

      const context = await requestClrContextFromHost({ targetWindow: target as unknown as Window, timeoutMs: 40 });

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

      const context = await requestClrContextFromHost({
        targetWindow: target as unknown as Window,
        hostOrigin: window.location.origin,
        timeoutMs: 40,
      });

      expect(context).toBeNull();
    });

    it('ignores a response that carries no context', async () => {
      const target = answering(pageContext, { context: undefined as unknown as ClrPageContext });

      const context = await requestClrContextFromHost({ targetWindow: target as unknown as Window, timeoutMs: 40 });

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

      const context = await requestClrContextFromHost({ targetWindow: target as unknown as Window });

      expect(context?.title).toBe('Host page');
    });

    it('resolves with null when the host never answers', async () => {
      const context = await requestClrContextFromHost({
        targetWindow: fakeWindow() as unknown as Window,
        timeoutMs: 10,
      });

      expect(context).toBeNull();
    });

    it('resolves with null when there is no separate host window', async () => {
      expect(await requestClrContextFromHost({ targetWindow: window })).toBeNull();
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

    dispatchRequest(frameRequest('big', { maxComponents: 5000 }), { postMessage: jasmine.createSpy() });
    expect(getSnapshot).toHaveBeenCalledWith({ maxComponents: 20 });

    dispatchRequest(frameRequest('small', { maxComponents: 3 }), { postMessage: jasmine.createSpy() });
    expect(getSnapshot).toHaveBeenCalledWith({ maxComponents: 3 });
  });

  it('drops a budget that is not a finite number rather than walking without bound', () => {
    host = new ClrContextFrameHost(getSnapshot, window, { minRequestIntervalMs: 0 });
    host.start();

    dispatchRequest(frameRequest('nan', { maxComponents: Number.NaN }), { postMessage: jasmine.createSpy() });

    expect(getSnapshot).toHaveBeenCalledWith({});
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
    const frame = { postMessage: jasmine.createSpy() };

    dispatchRequest(frameRequest('first'), frame);
    dispatchRequest(frameRequest('second'), frame);

    expect(getSnapshot).toHaveBeenCalledTimes(1);
  });

  it('bounds the requests served to all frames together, so nesting frames cannot multiply past the floor', () => {
    host = new ClrContextFrameHost(getSnapshot, window, { minRequestIntervalMs: 10_000 });
    host.start();

    for (let index = 0; index < 25; index++) {
      dispatchRequest(frameRequest(`frame-${index}`), { postMessage: jasmine.createSpy() });
    }

    expect(getSnapshot.calls.count()).toBe(10);
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
    const frame = { postMessage: jasmine.createSpy() };

    expect(() => dispatchRequest(frameRequest('first'), frame)).not.toThrow();
    dispatchRequest(frameRequest('second'), frame);

    expect(frame.postMessage).toHaveBeenCalledTimes(1);
  });

  it('ignores an answer from the right window but an origin other than the one it asked', async () => {
    const target = { postMessage: jasmine.createSpy() };
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
    expect(await requestClrContextFromHost({ targetWindow: target as unknown as Window, timeoutMs: 50 })).toBeNull();
  });
});
