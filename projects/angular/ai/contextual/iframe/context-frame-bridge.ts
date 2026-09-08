/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions, ClrPageContext } from '../interfaces/context.interface';

/**
 * Identifier of the cross-frame context protocol. The protocol is plain,
 * framework-agnostic JSON over `postMessage`, so UI running inside an iframe — a chat
 * widget, another UI library, anything — can request context from the hosting page
 * without depending on Angular or Clarity. Implementations in other languages or
 * frameworks only need to reproduce the two message shapes below.
 */
export const CLR_CONTEXT_PROTOCOL = 'ui-context/v1';

/** Message an embedded frame posts to its parent to ask for the page context. */
export interface ClrContextFrameRequest {
  protocol: typeof CLR_CONTEXT_PROTOCOL;
  kind: 'context-request';
  /** Correlates a response with its request. */
  requestId: string;
  /** Optional snapshot budgets the requester wants applied. */
  options?: ClrContextSnapshotOptions;
}

/** Message the hosting page posts back with a freshly computed snapshot. */
export interface ClrContextFrameResponse {
  protocol: typeof CLR_CONTEXT_PROTOCOL;
  kind: 'context-response';
  requestId: string;
  context: ClrPageContext;
}

export interface ClrContextFrameHostOptions {
  /**
   * Origins allowed to request context. Defaults to the host page's own origin.
   * Pass `['*']` to serve any embedded origin — only do this when snapshots contain
   * nothing sensitive, since the page context is handed to the embedded document.
   */
  allowedOrigins?: string[];
}

export interface ClrContextFrameRequestOptions {
  /** Window to ask for context. Defaults to `window.parent`. */
  targetWindow?: Window;
  /** Origin of the hosting page. Defaults to `'*'`. */
  targetOrigin?: string;
  /** How long to wait for an answer before resolving with `null`. Defaults to `2000`. */
  timeoutMs?: number;
  /** Snapshot budgets the host should apply. */
  options?: ClrContextSnapshotOptions;
}

/**
 * Snapshot option keys an embedded frame is allowed to set on the host.
 * `includeFormValues` is deliberately absent: an embedded frame must never be able to
 * pull user-typed form data out of the hosting page — only the host application can
 * opt into that for snapshots it takes itself.
 */
const SAFE_OPTION_KEYS: (keyof ClrContextSnapshotOptions)[] = [
  'maxTextLength',
  'maxItemsPerCollection',
  'maxComponents',
  'includeDomComponents',
  'includeActions',
];

/**
 * Serves page context to embedded frames. The hosting page creates one of these around
 * its snapshot function; every embedded frame can then pull a fresh snapshot whenever it
 * needs one. Context is computed per request and never cached or broadcast, so an
 * embedded agent always sees the page as it currently is.
 */
export class ClrContextFrameHost {
  private readonly allowedOrigins: string[];
  private readonly messageListener = this.onMessage.bind(this);
  private listening = false;

  constructor(
    private readonly getSnapshot: (options?: ClrContextSnapshotOptions) => ClrPageContext,
    private readonly hostWindow: Window,
    options: ClrContextFrameHostOptions = {}
  ) {
    this.allowedOrigins = options.allowedOrigins || [hostWindow.location.origin];
  }

  start(): void {
    if (!this.listening) {
      this.hostWindow.addEventListener('message', this.messageListener);
      this.listening = true;
    }
  }

  stop(): void {
    if (this.listening) {
      this.hostWindow.removeEventListener('message', this.messageListener);
      this.listening = false;
    }
  }

  private onMessage(event: MessageEvent): void {
    const request = event.data as ClrContextFrameRequest;
    if (!request || request.protocol !== CLR_CONTEXT_PROTOCOL || request.kind !== 'context-request') {
      return;
    }
    if (!this.isOriginAllowed(event.origin)) {
      return;
    }
    const source = event.source as Window | null;
    if (!source) {
      return;
    }
    const response: ClrContextFrameResponse = {
      protocol: CLR_CONTEXT_PROTOCOL,
      kind: 'context-response',
      requestId: request.requestId,
      context: this.getSnapshot(sanitizeOptions(request.options)),
    };
    source.postMessage(response, { targetOrigin: event.origin === 'null' ? '*' : event.origin });
  }

  private isOriginAllowed(origin: string): boolean {
    return this.allowedOrigins.includes('*') || this.allowedOrigins.includes(origin);
  }
}

let requestCounter = 0;

/**
 * Requests the hosting page's context from inside an embedded frame. Resolves with
 * `null` when the host does not answer (e.g. it does not run a {@link ClrContextFrameHost}
 * or this frame's origin is not allowed), so embedded UI can degrade gracefully.
 */
export function requestClrContextFromHost(options: ClrContextFrameRequestOptions = {}): Promise<ClrPageContext | null> {
  const targetWindow = options.targetWindow || window.parent;
  if (!targetWindow || targetWindow === window) {
    return Promise.resolve(null);
  }
  const requestId = `clr-context-${++requestCounter}-${Date.now()}`;
  const request: ClrContextFrameRequest = {
    protocol: CLR_CONTEXT_PROTOCOL,
    kind: 'context-request',
    requestId,
    options: options.options,
  };

  return new Promise(resolve => {
    const cleanup = () => {
      window.removeEventListener('message', responseListener);
      clearTimeout(timeout);
    };
    const responseListener = (event: MessageEvent) => {
      const response = event.data as ClrContextFrameResponse;
      if (
        response &&
        response.protocol === CLR_CONTEXT_PROTOCOL &&
        response.kind === 'context-response' &&
        response.requestId === requestId
      ) {
        cleanup();
        resolve(response.context);
      }
    };
    const timeout = setTimeout(() => {
      cleanup();
      resolve(null);
    }, options.timeoutMs ?? 2000);

    window.addEventListener('message', responseListener);
    targetWindow.postMessage(request, { targetOrigin: options.targetOrigin || '*' });
  });
}

/** Only forwards known snapshot budgets from an embedded frame to the host's engine. */
function sanitizeOptions(options?: ClrContextSnapshotOptions): ClrContextSnapshotOptions | undefined {
  if (!options || typeof options !== 'object') {
    return undefined;
  }
  const sanitized: ClrContextSnapshotOptions = {};
  for (const key of SAFE_OPTION_KEYS) {
    const value = options[key];
    if (typeof value === 'number' || typeof value === 'boolean') {
      (sanitized as Record<string, unknown>)[key] = value;
    }
  }
  return sanitized;
}
