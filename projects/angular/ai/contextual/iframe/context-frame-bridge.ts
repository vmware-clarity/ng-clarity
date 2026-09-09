/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions, ClrPageContext } from '../interfaces/context.interface';
import { capSnapshotOptions } from '../snapshot-options';
import { sanitizeUntrustedSnapshotOptions, withoutFormValues } from '../untrusted-options';

/**
 * Identifier of the cross-frame context protocol. The protocol is plain,
 * framework-agnostic JSON over `postMessage`, so UI running inside an iframe — a chat
 * widget, another UI library, anything — can request context from the hosting page
 * without depending on Angular or Clarity. Implementations in other languages or
 * frameworks only need to reproduce the two message shapes below.
 *
 * This is a discriminator, never a secret: it ships in the client bundle, so any script
 * can read it. Nothing here relies on it being unknown.
 */
export const CLR_CONTEXT_PROTOCOL = 'ui-context/v1';

/** Longest request id a frame may send. Ids are only correlators, never payloads. */
const MAX_REQUEST_ID_LENGTH = 128;

/** Shortest gap between two snapshots served to the same frame. */
const DEFAULT_MIN_REQUEST_INTERVAL_MS = 200;

/**
 * Most snapshots served to all frames together within one interval. The per-frame
 * throttle bounds each frame; this bounds their sum, so a document nesting many frames
 * cannot multiply its way past the per-frame floor.
 */
const MAX_REQUESTS_PER_INTERVAL = 10;

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
   *
   * A `'*'` entry is ignored: serving every origin is a decision that has to be made
   * deliberately through {@link allowAnyOrigin}, not by a string in a list. A list that
   * names no usable origin at all is a configuration error and is refused outright,
   * rather than quietly serving nobody.
   */
  allowedOrigins?: string[];

  /**
   * Serve any origin that asks. Only set this when snapshots are known to contain
   * nothing an arbitrary embedded document should not see — the whole page context,
   * including every visible label, is handed over.
   */
  allowAnyOrigin?: boolean;

  /**
   * Share the full URL, including its query string and fragment, and the route's query
   * parameters. Off by default: these routinely carry tenant identifiers, record
   * identifiers and occasionally credentials, and an embedded document has no need for
   * them to know which page it is on.
   */
  shareFullUrl?: boolean;

  /**
   * Share what the user has typed. Off by default: the application sees its own form
   * contents as a matter of course, but an embedded document has no claim to them.
   *
   * Fields are described either way — label, type, permitted values, validation state —
   * so a frame still learns the shape of a form without learning its contents.
   */
  shareFormValues?: boolean;

  /**
   * The most a frame may ask for. A frame's own budgets are honoured only up to these:
   * it can request a smaller snapshot than the host allows, never a larger one, so the
   * cost of serving a frame stays the host's decision.
   */
  snapshot?: ClrContextSnapshotOptions;

  /**
   * Shortest gap between two snapshots served to the same frame, in milliseconds.
   * Defaults to 200.
   *
   * Every request walks the document, which is not free. Without a floor, a frame in a
   * loop — buggy or hostile — can keep the host's main thread busy indefinitely.
   */
  minRequestIntervalMs?: number;
}

export interface ClrContextFrameRequestOptions {
  /** Window to ask for context. Defaults to `window.parent`. */
  targetWindow?: Window;
  /**
   * Origin to address the request to. Defaults to {@link hostOrigin}, then to the origin
   * of the document that embedded this one (its referrer), then to this document's own
   * origin.
   */
  targetOrigin?: string;
  /**
   * Origin the answer must come from. Defaults to the origin the request was addressed
   * to; a response from any other origin is ignored even if it arrives from the right
   * window.
   */
  hostOrigin?: string;
  /** How long to wait for an answer before resolving with `null`. Defaults to `2000`. */
  timeoutMs?: number;
  /** Snapshot budgets the host should apply. */
  options?: ClrContextSnapshotOptions;
}

/**
 * Serves page context to embedded frames. The hosting page creates one of these around
 * its snapshot function; every embedded frame can then pull a fresh snapshot whenever it
 * needs one. Context is computed per request and never cached or broadcast, so an
 * embedded agent always sees the page as it currently is.
 *
 * A frame is trusted less than the application that embeds it: it does not receive what
 * the user has typed, nor the URL's query string, it cannot ask for a larger snapshot
 * than the host allows, and it cannot ask faster than
 * {@link ClrContextFrameHostOptions.minRequestIntervalMs}.
 */
export class ClrContextFrameHost {
  private readonly allowedOrigins: string[];
  private readonly allowAnyOrigin: boolean;
  private readonly shareFullUrl: boolean;
  private readonly shareFormValues: boolean;
  private readonly snapshotCeiling: ClrContextSnapshotOptions | undefined;
  private readonly minRequestIntervalMs: number;
  private readonly lastServedAt = new WeakMap<object, number>();
  private readonly messageListener = this.onMessage.bind(this);
  private intervalStartedAt = 0;
  private servedInInterval = 0;
  private listening = false;

  constructor(
    private readonly getSnapshot: (options?: ClrContextSnapshotOptions) => ClrPageContext,
    private readonly hostWindow: Window,
    options: ClrContextFrameHostOptions = {}
  ) {
    // A wildcard in the list is dropped rather than honoured, so a configuration copied
    // from somewhere permissive cannot quietly open the page up.
    this.allowedOrigins = (options.allowedOrigins || [hostWindow.location.origin]).filter(origin => origin !== '*');
    this.allowAnyOrigin = options.allowAnyOrigin === true;
    if (!this.allowAnyOrigin && !this.allowedOrigins.length) {
      throw new Error(
        'ClrContextFrameHost: allowedOrigins names no origin to serve. List the embedding origins, or set allowAnyOrigin to serve every origin deliberately.'
      );
    }
    this.shareFullUrl = options.shareFullUrl === true;
    this.shareFormValues = options.shareFormValues === true;
    this.snapshotCeiling = options.snapshot;
    const interval = options.minRequestIntervalMs;
    this.minRequestIntervalMs =
      typeof interval === 'number' && Number.isFinite(interval) && interval >= 0
        ? interval
        : DEFAULT_MIN_REQUEST_INTERVAL_MS;
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
    if (!isContextRequest(event.data)) {
      return;
    }
    if (!this.isServableOrigin(event.origin)) {
      return;
    }
    const source = event.source as Window | null;
    if (!source) {
      return;
    }
    if (this.isThrottled(source)) {
      return;
    }

    // Nothing a frame sends may take the host's listener down with it: a snapshot that
    // fails to build, or a response the browser refuses to clone, is that one request's
    // problem. The frame times out; the host keeps serving.
    try {
      const requested = capSnapshotOptions(sanitizeUntrustedSnapshotOptions(event.data.options), this.snapshotCeiling);
      const response: ClrContextFrameResponse = {
        protocol: CLR_CONTEXT_PROTOCOL,
        kind: 'context-response',
        requestId: event.data.requestId,
        context: this.contextForFrame(requested),
      };
      // Addressed to the origin that asked. Never '*': between the request and the answer
      // a frame can navigate, and '*' would deliver the page context wherever it went.
      source.postMessage(response, { targetOrigin: event.origin });
    } catch {
      // Deliberately swallowed: see above.
    }
  }

  private isServableOrigin(origin: string): boolean {
    // An opaque origin — a sandboxed frame without `allow-same-origin`, a `data:`
    // document — reports itself as "null", which cannot be named as a postMessage
    // target. Answering one would mean posting to '*', so it is refused instead.
    if (!origin || origin === 'null') {
      return false;
    }
    return this.allowAnyOrigin || this.allowedOrigins.includes(origin);
  }

  private isThrottled(source: Window): boolean {
    if (this.minRequestIntervalMs <= 0) {
      return false;
    }
    const now = Date.now();
    const previous = this.lastServedAt.get(source);
    if (previous !== undefined && now - previous < this.minRequestIntervalMs) {
      return true;
    }
    if (now - this.intervalStartedAt >= this.minRequestIntervalMs) {
      this.intervalStartedAt = now;
      this.servedInInterval = 0;
    }
    if (this.servedInInterval >= MAX_REQUESTS_PER_INTERVAL) {
      return true;
    }
    this.servedInInterval++;
    this.lastServedAt.set(source, now);
    return false;
  }

  /** The snapshot as a frame is allowed to see it, leaving the original untouched. */
  private contextForFrame(options?: ClrContextSnapshotOptions): ClrPageContext {
    const context = this.getSnapshot(options);
    const shared: ClrPageContext = this.shareFormValues ? { ...context } : withoutFormValues(context);
    if (this.shareFullUrl) {
      return shared;
    }
    if (typeof shared.url === 'string') {
      shared.url = stripQueryAndFragment(shared.url);
    }
    if (shared.route) {
      const route = { ...shared.route };
      delete route.queryParams;
      if (typeof route.url === 'string') {
        route.url = stripQueryAndFragment(route.url);
      }
      shared.route = route;
    }
    return shared;
  }
}

/**
 * Requests the hosting page's context from inside an embedded frame. Resolves with
 * `null` when the host does not answer (e.g. it does not run a {@link ClrContextFrameHost},
 * this frame's origin is not allowed, or it asked again too soon), so embedded UI can
 * degrade gracefully.
 *
 * The answer is only accepted from the window that was asked, and from the origin the
 * request was addressed to. A browser sets `event.source` and a page cannot forge it,
 * which is what stops a sibling frame from answering in the host's place — sibling
 * frames can reach each other through `parent.frames`, so without this a fabricated page
 * context could be fed to whatever consumes it. The origin check covers the other way
 * round: the right window having navigated somewhere else in between.
 */
export function requestClrContextFromHost(options: ClrContextFrameRequestOptions = {}): Promise<ClrPageContext | null> {
  const targetWindow = options.targetWindow || window.parent;
  if (!targetWindow || targetWindow === window) {
    return Promise.resolve(null);
  }
  const targetOrigin = options.targetOrigin || options.hostOrigin || embedderOrigin() || ownOrigin();
  const expectedOrigin = options.hostOrigin || (targetOrigin !== '*' ? targetOrigin : undefined);
  const requestId = newRequestId();
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
      if (event.source !== targetWindow) {
        return;
      }
      if (expectedOrigin && event.origin !== expectedOrigin) {
        return;
      }
      if (!isContextResponse(event.data, requestId)) {
        return;
      }
      cleanup();
      resolve(event.data.context);
    };
    const timeout = setTimeout(() => {
      cleanup();
      resolve(null);
    }, options.timeoutMs ?? 2000);

    window.addEventListener('message', responseListener);
    targetWindow.postMessage(request, { targetOrigin });
  });
}

/** Whether an inbound message is a context request this host should answer. */
function isContextRequest(value: unknown): value is ClrContextFrameRequest {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Partial<ClrContextFrameRequest>;
  return (
    candidate.protocol === CLR_CONTEXT_PROTOCOL &&
    candidate.kind === 'context-request' &&
    typeof candidate.requestId === 'string' &&
    candidate.requestId.length > 0 &&
    candidate.requestId.length <= MAX_REQUEST_ID_LENGTH
  );
}

/** Whether an inbound message is the answer to this particular request. */
function isContextResponse(value: unknown, requestId: string): value is ClrContextFrameResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Partial<ClrContextFrameResponse>;
  return (
    candidate.protocol === CLR_CONTEXT_PROTOCOL &&
    candidate.kind === 'context-response' &&
    candidate.requestId === requestId &&
    !!candidate.context &&
    typeof candidate.context === 'object'
  );
}

/**
 * An unguessable correlator. The previous scheme — a counter plus a millisecond
 * timestamp — could be guessed in a few thousand attempts, which is all a frame needs to
 * answer a request it cannot see.
 */
function newRequestId(): string {
  const webCrypto = (globalThis as { crypto?: Crypto }).crypto;
  if (webCrypto && typeof webCrypto.randomUUID === 'function') {
    return webCrypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (webCrypto && typeof webCrypto.getRandomValues === 'function') {
    webCrypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index++) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * The origin of the document that embedded this one, when the browser disclosed it. An
 * embedded document's referrer is its embedder; the default referrer policy discloses at
 * least the origin across sites, which is exactly what addressing the host needs. Empty
 * when the embedder withheld it or the document was not embedded.
 */
function embedderOrigin(): string {
  const referrer = document.referrer;
  if (!referrer) {
    return '';
  }
  try {
    const origin = new URL(referrer).origin;
    return origin && origin !== 'null' ? origin : '';
  } catch {
    return '';
  }
}

/**
 * This document's origin, used to address the request. A sandboxed or `data:` document
 * has no origin to name; the request carries only budgets, so a wildcard is acceptable
 * there and is the only thing a browser will deliver.
 */
function ownOrigin(): string {
  const origin = window.location.origin;
  return origin && origin !== 'null' ? origin : '*';
}

/** Everything up to the first `?` or `#`, for both absolute and relative URLs. */
function stripQueryAndFragment(url: string): string {
  return url.split(/[?#]/)[0];
}
