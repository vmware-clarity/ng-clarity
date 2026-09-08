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

describe('Context frame bridge', () => {
  const pageContext: ClrPageContext = {
    title: 'Host page',
    regions: [],
    components: [],
    collectedAt: '2026-01-01T00:00:00.000Z',
  };

  function frameRequest(requestId: string, options?: unknown): ClrContextFrameRequest {
    return {
      protocol: CLR_CONTEXT_PROTOCOL,
      kind: 'context-request',
      requestId,
      options: options as ClrContextFrameRequest['options'],
    };
  }

  describe('ClrContextFrameHost', () => {
    let host: ClrContextFrameHost;
    let getSnapshot: jasmine.Spy;
    let postMessage: jasmine.Spy;

    function dispatchRequest(request: unknown, origin: string = window.location.origin) {
      window.dispatchEvent(new MessageEvent('message', { data: request, origin, source: window }));
    }

    beforeEach(() => {
      getSnapshot = jasmine.createSpy('getSnapshot').and.returnValue(pageContext);
      postMessage = spyOn(window, 'postMessage');
      host = new ClrContextFrameHost(getSnapshot, window);
      host.start();
    });

    afterEach(() => {
      host.stop();
    });

    it('answers requests from an allowed origin with a fresh snapshot', () => {
      dispatchRequest(frameRequest('request-1'));

      expect(getSnapshot).toHaveBeenCalledTimes(1);
      expect(postMessage).toHaveBeenCalledWith(
        jasmine.objectContaining({
          protocol: CLR_CONTEXT_PROTOCOL,
          kind: 'context-response',
          requestId: 'request-1',
          context: pageContext,
        }),
        jasmine.anything()
      );
    });

    it('only forwards known snapshot options from the embedded frame', () => {
      dispatchRequest(frameRequest('request-2', { maxComponents: 5, includeActions: false, injected: 'nope' }));

      expect(getSnapshot).toHaveBeenCalledWith({ maxComponents: 5, includeActions: false });
    });

    it('ignores requests from origins that are not allowed', () => {
      dispatchRequest(frameRequest('request-3'), 'https://evil.example');

      expect(postMessage).not.toHaveBeenCalled();
    });

    it('serves any origin when configured with a wildcard', () => {
      host.stop();
      host = new ClrContextFrameHost(getSnapshot, window, { allowedOrigins: ['*'] });
      host.start();

      dispatchRequest(frameRequest('request-4'), 'https://trusted.example');

      expect(postMessage).toHaveBeenCalled();
    });

    it('ignores requests that do not carry a source window to answer to', () => {
      window.dispatchEvent(
        new MessageEvent('message', { data: frameRequest('request-no-source'), origin: window.location.origin })
      );

      expect(getSnapshot).not.toHaveBeenCalled();
      expect(postMessage).not.toHaveBeenCalled();
    });

    it('ignores unrelated messages', () => {
      dispatchRequest({ some: 'other message' });
      dispatchRequest('plain text');

      expect(postMessage).not.toHaveBeenCalled();
    });

    it('stops answering after stop()', () => {
      host.stop();

      dispatchRequest(frameRequest('request-5'));

      expect(postMessage).not.toHaveBeenCalled();
    });
  });

  describe('requestClrContextFromHost', () => {
    it('resolves with the host context', async () => {
      const answeringHost = {
        postMessage: (message: ClrContextFrameRequest) => {
          const response: ClrContextFrameResponse = {
            protocol: CLR_CONTEXT_PROTOCOL,
            kind: 'context-response',
            requestId: message.requestId,
            context: pageContext,
          };
          setTimeout(() => window.dispatchEvent(new MessageEvent('message', { data: response })));
        },
      } as unknown as Window;

      const context = await requestClrContextFromHost({ targetWindow: answeringHost });

      expect(context).toEqual(pageContext);
    });

    it('ignores responses for other requests until the right one arrives', async () => {
      const answeringHost = {
        postMessage: (message: ClrContextFrameRequest) => {
          setTimeout(() => {
            const unrelated: ClrContextFrameResponse = {
              protocol: CLR_CONTEXT_PROTOCOL,
              kind: 'context-response',
              requestId: 'some-other-request',
              context: { ...pageContext, title: 'Wrong response' },
            };
            window.dispatchEvent(new MessageEvent('message', { data: unrelated }));
            const expected: ClrContextFrameResponse = {
              protocol: CLR_CONTEXT_PROTOCOL,
              kind: 'context-response',
              requestId: message.requestId,
              context: pageContext,
            };
            window.dispatchEvent(new MessageEvent('message', { data: expected }));
          });
        },
      } as unknown as Window;

      const context = await requestClrContextFromHost({ targetWindow: answeringHost });

      expect(context?.title).toBe('Host page');
    });

    it('resolves with null when the host never answers', async () => {
      const silentHost = { postMessage: () => undefined } as unknown as Window;

      const context = await requestClrContextFromHost({ targetWindow: silentHost, timeoutMs: 10 });

      expect(context).toBeNull();
    });

    it('resolves with null when there is no separate host window', async () => {
      expect(await requestClrContextFromHost({ targetWindow: window })).toBeNull();
    });
  });
});
