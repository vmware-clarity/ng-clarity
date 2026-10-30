/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { attempt } from '../attempt';
import { ClrContextSnapshotOptions, ClrPageContext } from '../interfaces/context.interface';
import { capSnapshotOptions, resolveSnapshotOptions } from '../snapshot-options';
import { contextForUntrustedCaller, sanitizeUntrustedSnapshotOptions } from '../untrusted-options';
import { warnNoHostOrigin } from './host-origin-warning';

/** Identifier of the framework-agnostic `postMessage` context protocol. A discriminator, never a secret. */
export const CLR_CONTEXT_PROTOCOL = 'ui-context/v1';

const MAX_REQUEST_ID_LENGTH = 128;

const DEFAULT_MIN_REQUEST_INTERVAL_MS = 200;

/** Most snapshots served to all frames together per interval, so nesting frames cannot multiply the limit. */
const MAX_REQUESTS_PER_INTERVAL = 5;

const DEFAULT_REQUEST_TIMEOUT_MS = 2000;

/** A longer browser timer delay overflows and fires at once. */
const MAX_TIMER_DELAY_MS = 2 ** 31 - 1;

/** Message an embedded frame posts to its parent to ask for the page context. */
export interface ClrContextFrameRequest {
  /** Names the protocol, so unrelated messages are ignored. */
  protocol: typeof CLR_CONTEXT_PROTOCOL;
  /** What the message is. */
  kind: 'context-request';
  /** Correlates a response with its request. */
  requestId: string;
  /** Snapshot options to apply; only `CLR_CONTEXT_UNTRUSTED_OPTION_KEYS`, and only to ask for less. */
  options?: ClrContextSnapshotOptions;
}

/** Message the hosting page posts back with a freshly computed snapshot. */
export interface ClrContextFrameResponse {
  /** Names the protocol, so unrelated messages are ignored. */
  protocol: typeof CLR_CONTEXT_PROTOCOL;
  /** What the message is. */
  kind: 'context-response';
  /** The `requestId` of the request this answers. */
  requestId: string;
  /** The host page's context, as the frame is allowed to see it. */
  context: ClrPageContext;
}

/** How a host page serves context to the frames it embeds; see `enableFrameBridge`. */
export interface ClrContextFrameHostOptions {
  /** Origins allowed to request context. Defaults to the page's own; `'*'` entries are ignored. */
  allowedOrigins?: string[];

  /** Serve any origin that asks, only when snapshots hold nothing an arbitrary frame should not see. */
  allowAnyOrigin?: boolean;

  /** Share the full URL and route parameters and data. Off by default. */
  shareFullUrl?: boolean;

  /** Share what the user has typed. Off by default. */
  shareFormValues?: boolean;

  /** The most a frame may ask for; it can request less, never more. */
  snapshot?: ClrContextSnapshotOptions;

  /** Shortest gap in milliseconds between snapshots served to one frame. Default `200`; `0` turns off throttling. */
  minRequestIntervalMs?: number;
}

/** How an embedded page asks its host for context; see `requestHostContext`. */
export interface ClrContextFrameRequestOptions {
  /** Window to ask for context. Defaults to `window.parent`. */
  targetWindow?: Window;
  /**
   * The host's origin, and the only one an answer is accepted from. Set it for UI embeddable by
   * more than one site, or any embedding page can answer with made-up context.
   */
  hostOrigin?: string;
  /** Milliseconds to wait before resolving with `null`. Default `2000`. */
  timeoutMs?: number;
  /** Snapshot budgets the host should apply. */
  options?: ClrContextSnapshotOptions;
}

/**
 * Serves page context to embedded frames, which get no form values, no full URL and no more than the host allows.
 * Not exported: only the engine constructs one, so the application-wide options apply.
 */
export class ClrContextFrameHost {
  private readonly allowedOrigins: string[];
  private readonly allowAnyOrigin: boolean;
  private readonly shareFullUrl: boolean;
  private readonly shareFormValues: boolean;
  private readonly snapshotCeiling: ClrContextSnapshotOptions;
  private readonly minRequestIntervalMs: number;
  private readonly lastServedAt = new WeakMap<object, number>();
  private readonly messageListener = this.onMessage.bind(this);
  private intervalStartedAt = Number.NEGATIVE_INFINITY;
  private serving = false;
  private servedInInterval = 0;

  constructor(
    private readonly getSnapshot: (options?: ClrContextSnapshotOptions) => ClrPageContext | Promise<ClrPageContext>,
    private readonly hostWindow: Window,
    options: ClrContextFrameHostOptions = {},
    private readonly routePattern?: (url: URL) => string | null
  ) {
    this.allowAnyOrigin = options.allowAnyOrigin === true;
    this.allowedOrigins = allowedOriginsFrom(options, hostWindow.location.origin, this.allowAnyOrigin);
    this.shareFullUrl = options.shareFullUrl === true;
    this.shareFormValues = options.shareFormValues === true;
    // Resolved, so an unset budget is the default rather than whatever a frame asks for.
    this.snapshotCeiling = resolveSnapshotOptions(options.snapshot);
    const interval = options.minRequestIntervalMs;
    this.minRequestIntervalMs =
      typeof interval === 'number' && Number.isFinite(interval) && interval >= 0
        ? interval
        : DEFAULT_MIN_REQUEST_INTERVAL_MS;
  }

  start(): void {
    this.serving = true;
    this.hostWindow.addEventListener('message', this.messageListener);
  }

  /** Stops serving, including answers to requests still waiting for a snapshot. */
  stop(): void {
    this.serving = false;
    this.hostWindow.removeEventListener('message', this.messageListener);
  }

  private onMessage(event: MessageEvent): void {
    if (!isContextRequest(event.data) || !this.isServableOrigin(event.origin)) {
      return;
    }
    const source = event.source as Window | null;
    const frame = source ? this.embeddedFrameOf(source) : null;
    if (!source || !frame || !this.admit(frame)) {
      return;
    }

    // A failing snapshot or uncloneable response is that request's problem; the host keeps serving.
    const answer = (snapshot: ClrPageContext) => {
      if (!this.serving) {
        return;
      }
      const response: ClrContextFrameResponse = {
        protocol: CLR_CONTEXT_PROTOCOL,
        kind: 'context-response',
        requestId: event.data.requestId,
        context: this.contextForFrame(snapshot),
      };
      // Never '*': the frame can navigate between request and answer.
      source.postMessage(response, { targetOrigin: event.origin });
    };
    try {
      const requested = capSnapshotOptions(sanitizeUntrustedSnapshotOptions(event.data.options), this.snapshotCeiling);
      const snapshot = this.getSnapshot(requested);
      if (snapshot instanceof Promise) {
        snapshot.then(answer).catch(() => undefined);
      } else {
        answer(snapshot);
      }
    } catch {
      // Deliberately swallowed: see above.
    }
  }

  private isServableOrigin(origin: string): boolean {
    // An opaque origin reports "null", which cannot be a postMessage target; answering would need '*'.
    if (!origin || origin === 'null') {
      return false;
    }
    return this.allowAnyOrigin || this.allowedOrigins.includes(origin);
  }

  /** The child frame `source` sits in, or `null`: a popup or tab sharing an allowed origin is not served. */
  private embeddedFrameOf(source: Window): Window | null {
    // A top-level window is its own parent.
    if (source === this.hostWindow) {
      return null;
    }
    let frame = source;
    try {
      while (frame.parent !== this.hostWindow) {
        if (!frame.parent || frame.parent === frame) {
          return null;
        }
        frame = frame.parent;
      }
    } catch {
      return null;
    }
    return frame;
  }

  private admit(frame: Window): boolean {
    if (this.minRequestIntervalMs <= 0) {
      return true;
    }
    // A monotonic clock: a wall clock set back would throttle every frame until it caught up.
    const now = performance.now();
    // Nested frames share their top-level frame's allowance.
    const previous = this.lastServedAt.get(frame);
    if (previous !== undefined && now - previous < this.minRequestIntervalMs) {
      return false;
    }
    if (now - this.intervalStartedAt >= this.minRequestIntervalMs) {
      this.intervalStartedAt = now;
      this.servedInInterval = 0;
    }
    if (this.servedInInterval >= MAX_REQUESTS_PER_INTERVAL) {
      return false;
    }
    this.servedInInterval++;
    this.lastServedAt.set(frame, now);
    return true;
  }

  private contextForFrame(snapshot: ClrPageContext): ClrPageContext {
    const share = { shareFormValues: this.shareFormValues, shareFullUrl: this.shareFullUrl };
    return contextForUntrustedCaller(snapshot, share, this.routePattern, this.hostWindow.document.baseURI);
  }
}

/**
 * Requests the host page's context from inside a frame. Resolves `null` when the host does not answer;
 * rejects when the request cannot be made. Answers are accepted only from the asked window and origin.
 */
export async function clrRequestHostContext(
  options: ClrContextFrameRequestOptions = {}
): Promise<ClrPageContext | null> {
  const targetWindow = options.targetWindow || window.parent;
  if (!targetWindow || targetWindow === window) {
    return null;
  }
  const targetOrigin = targetOriginFor(options, targetWindow);
  const expectedOrigin = targetOrigin !== '*' ? targetOrigin : undefined;
  const requestId = newRequestId();
  const request: ClrContextFrameRequest = {
    protocol: CLR_CONTEXT_PROTOCOL,
    kind: 'context-request',
    requestId,
    options: options.options,
  };

  return new Promise((resolve, reject) => {
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
    }, requestTimeout(options.timeoutMs));

    window.addEventListener('message', responseListener);
    // An uncloneable request is never answered, so don't wait for the timeout.
    try {
      targetWindow.postMessage(request, { targetOrigin });
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
}

/** Where the request is addressed, and the only origin an answer is accepted from. */
function targetOriginFor(options: ClrContextFrameRequestOptions, targetWindow: Window): string {
  if (options.hostOrigin) {
    // Normalised like the host's allow-list, or a trailing `/` would make every request time out.
    const hostOrigin = originOf(options.hostOrigin);
    if (!hostOrigin) {
      throw new Error(`clrRequestHostContext: "${options.hostOrigin}" is not an origin, such as https://app.example.`);
    }
    return hostOrigin;
  }
  if (targetWindow !== window.parent) {
    // The embedder's origin says nothing about another window.
    const origin = readableOrigin(targetWindow);
    if (!origin) {
      throw new Error('clrRequestHostContext: a targetWindow other than the parent needs a hostOrigin to be asked.');
    }
    return origin;
  }
  warnNoHostOrigin();
  return embedderOrigin() ?? ownOrigin();
}

/** A non-positive, non-finite or too-long delay fires at once, so fall back to the default or the maximum. */
function requestTimeout(timeoutMs: number | undefined): number {
  if (typeof timeoutMs !== 'number' || !Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return DEFAULT_REQUEST_TIMEOUT_MS;
  }
  return Math.min(timeoutMs, MAX_TIMER_DELAY_MS);
}

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

/** Unguessable, so a sibling frame cannot answer a request it cannot see. `randomUUID` needs a secure context. */
function newRequestId(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
}

/** The embedder's origin from `ancestorOrigins` or the referrer, or `null`. */
function embedderOrigin(): string | null {
  return originOf(window.location.ancestorOrigins?.[0] ?? '') ?? originOf(document.referrer);
}

/** A same-origin window's origin, or `null`; an `about:blank` or `srcdoc` frame shares this document's. */
function readableOrigin(target: Window): string | null {
  try {
    const origin = target.location.origin;
    if (origin && origin !== 'null') {
      return origin;
    }
    return target.location.protocol === 'about:' ? ownOrigin() : null;
  } catch {
    return null;
  }
}

/** A sandboxed or `data:` document has no origin; the request carries only budgets, so `'*'` is fine there. */
function ownOrigin(): string {
  const origin = window.location.origin;
  return origin && origin !== 'null' ? origin : '*';
}

/** Wildcards are dropped so a copied permissive config cannot open the page; an empty result is refused. */
function allowedOriginsFrom(options: ClrContextFrameHostOptions, ownOrigin: string, allowAnyOrigin: boolean): string[] {
  const allowed = (options.allowedOrigins || (ownOrigin === 'null' ? [] : [ownOrigin]))
    .filter(origin => origin !== '*')
    .map(normalizedOrigin);
  if (!allowAnyOrigin && !allowed.length) {
    throw new Error(
      options.allowedOrigins
        ? 'enableFrameBridge: allowedOrigins names no origin to serve. List the embedding origins, or set allowAnyOrigin to serve every origin deliberately.'
        : 'enableFrameBridge: this page has no origin of its own (a file:// or sandboxed page) to serve frames from. List the origins to serve in allowedOrigins.'
    );
  }
  return allowed;
}

/** Normalised so `https://Chat.Example/` matches the origin a message carries; a non-origin is refused. */
function normalizedOrigin(entry: string): string {
  const origin = originOf(entry);
  if (!origin) {
    throw new Error(`enableFrameBridge: "${entry}" in allowedOrigins is not an origin, such as https://chat.example.`);
  }
  return origin;
}

function originOf(entry: string): string | null {
  const origin = attempt(() => new URL(entry).origin, null);
  return origin === 'null' ? null : origin;
}
