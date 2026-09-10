import { ClrComponentContext, ClrContextSnapshotOptions } from '@clr/angular/utils';
export { CLR_ELEMENT_CONTEXT_PROPERTY, ClrComponentContext, ClrContextSnapshotOptions, ClrElementContextCallback, publishElementContext } from '@clr/angular/utils';
import { Observable } from 'rxjs';
import * as i0 from '@angular/core';
import { OnDestroy, NgZone, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import * as i2 from '@angular/common';

/**
 * Information about the currently active route, when the application uses the Angular router.
 */
interface ClrRouteContext {
    /** The current router URL, e.g. `/users/42?tab=details`. */
    url: string;
    /** The configured route path pattern, e.g. `users/:id`. */
    path?: string;
    /** Route parameters of the active route chain. */
    params?: Record<string, string>;
    /** Query parameters of the current URL. */
    queryParams?: Record<string, string>;
    /** JSON-serializable subset of the route `data` of the active route chain. */
    data?: Record<string, unknown>;
}
/**
 * A full snapshot of the page context. This is always computed on demand from the live
 * application state and the rendered DOM — it is never cached, so it cannot contain
 * information about UI that no longer exists.
 */
interface ClrPageContext {
    /** The document title. */
    title: string;
    /** The current URL (browser location, or router URL when available). */
    url?: string;
    /** Route information, present when the application uses the Angular router. */
    route?: ClrRouteContext;
    /**
     * Application-provided contexts, registered through the `clrContext` directive or a
     * custom {@link ClrContextProvider}. These carry the semantic knowledge only the
     * application has, e.g. "this section manages firewall rules".
     */
    regions: ClrComponentContext[];
    /**
     * Clarity components discovered in the rendered DOM, with their current state, as a
     * tree. A button or link is wherever it actually is in the DOM — inside the dialog,
     * the heading, the alert that owns it — there is no separate top-level list of
     * actions, so nesting is never discarded in favor of a flat array.
     */
    components: ClrComponentContext[];
    /**
     * Present and `true` when the component budget (`maxComponents`) ran out before the
     * whole page was described, so whatever comes last in the document is missing. Raise
     * the budget, or narrow what is asked for, rather than treat the tree as complete.
     */
    truncated?: boolean;
    /** ISO timestamp of the moment the snapshot was taken. */
    collectedAt: string;
}
/**
 * Implemented by anything that wants to contribute context to snapshots — Clarity
 * components, application components or the `clrContext` directive.
 *
 * Providers are polled when a snapshot is requested (pull model). They must describe
 * their state as it is at that moment and should return `null` when they currently
 * have nothing useful to report, which keeps snapshots free of noise.
 */
interface ClrContextProvider {
    getClrContext(): ClrComponentContext | null;
}

/**
 * Root registry of everything currently able to contribute context to a page snapshot.
 *
 * Providers register when they enter the page and unregister when they are destroyed,
 * so the registry only ever knows about UI that exists right now. Context itself is
 * never stored here — providers are polled at snapshot time — which prevents stale
 * information from accumulating.
 */
declare class ClrContextRegistryService {
    /**
     * Emits whenever a provider joins, leaves, or reports that what it contributes has
     * changed. Context that lives only in application state changes without touching the
     * DOM, so anything keeping a snapshot current has nothing else to watch for it.
     */
    readonly changes: Observable<void>;
    private readonly providers;
    private readonly changesSubject;
    constructor();
    /**
     * Registers a context provider. Call the returned function (or `unregister`) when the
     * provider leaves the page, typically from `ngOnDestroy`.
     */
    register(provider: ClrContextProvider): () => void;
    unregister(provider: ClrContextProvider): void;
    /** Tells whoever is keeping a snapshot current that a provider's contribution changed. */
    notifyChanged(): void;
    /**
     * Polls all live providers for their current context. Providers that return `null`
     * or throw are skipped so a single faulty provider cannot break a snapshot.
     */
    collect(): ClrComponentContext[];
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrContextRegistryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrContextRegistryService>;
}

/**
 * Elements carrying this attribute — and everything inside them — are invisible to the
 * engine: the collector never describes them and the context tracker ignores their
 * mutations. Put it on UI that consumes context (an AI chat panel, a debug view) so it
 * neither describes itself into the page context nor triggers tracking feedback loops.
 */
declare const CLR_CONTEXT_IGNORE_ATTRIBUTE = "data-clr-context-ignore";
/**
 * Teaches the collector how to describe one kind of element it would otherwise skip.
 *
 * The collector needs no extractors to describe well-formed markup — it reads the
 * accessibility tree, which Clarity components, `@clr/ui` CSS-only markup and plain HTML
 * all expose. Extractors exist for the remainder: markup that carries neither a role nor
 * an accessible name, such as a bare `<div class="card">`.
 */
interface ClrContextDomExtractor {
    /** CSS selector matching the elements this extractor understands. */
    selector: string;
    /** Describes the element's current state, or returns `null` when there is nothing to report. */
    extract(element: HTMLElement, options: Required<ClrContextSnapshotOptions>): ClrComponentContext | null;
}
/** The result of a walk, and whether it ran out of budget before it ran out of page. */
interface ClrContextTreeResult {
    components: ClrComponentContext[];
    truncated: boolean;
}

/**
 * Default budgets applied while building a snapshot, tuned to keep snapshots compact
 * enough for an AI agent's context window.
 */
declare const CLR_CONTEXT_DEFAULT_OPTIONS: Required<ClrContextSnapshotOptions>;

/**
 * Marks a control, or a region containing controls, whose value must never appear in a
 * snapshot. Use it for anything sensitive that the input type alone does not reveal — an
 * account number or an API token in a plain text field.
 *
 * The field itself is still described, so an agent knows it exists and that its value is
 * being withheld rather than being absent.
 */
declare const CLR_CONTEXT_REDACT_ATTRIBUTE = "data-clr-context-redact";

/**
 * Describes everything currently rendered, as a tree, by reading the accessibility tree.
 *
 * Clarity components, `@clr/ui` CSS-only markup, other component libraries and plain
 * semantic HTML are all described by the same code: a role means the same thing wherever
 * it appears. Components contribute only what a role cannot express, by publishing
 * through `publishElementContext`.
 *
 * A button or link is reported wherever it actually is in the tree — inside the dialog,
 * the heading, the alert that owns it — never pulled out into a separate flattened list.
 * Nesting is the only representation of "this belongs to that": an agent looking for
 * what it can invoke inside a specific dialog walks that dialog's own `children`, the
 * same way it would read the rendered page.
 *
 * `customExtractors` cover the remainder — markup carrying neither a role nor an
 * accessible name, such as a bare `<div class="card">`.
 */
declare function collectClrDomContexts(root: ParentNode, options?: ClrContextSnapshotOptions, customExtractors?: ClrContextDomExtractor[]): ClrComponentContext[];
/**
 * {@link collectClrDomContexts}, also reporting whether the component budget ran out
 * before the whole page was described.
 */
declare function collectClrDomContextTree(root: ParentNode, options?: ClrContextSnapshotOptions, customExtractors?: ClrContextDomExtractor[]): ClrContextTreeResult;

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
declare const CLR_CONTEXT_PROTOCOL = "ui-context/v1";
/** Message an embedded frame posts to its parent to ask for the page context. */
interface ClrContextFrameRequest {
    protocol: typeof CLR_CONTEXT_PROTOCOL;
    kind: 'context-request';
    /** Correlates a response with its request. */
    requestId: string;
    /** Optional snapshot budgets the requester wants applied. */
    options?: ClrContextSnapshotOptions;
}
/** Message the hosting page posts back with a freshly computed snapshot. */
interface ClrContextFrameResponse {
    protocol: typeof CLR_CONTEXT_PROTOCOL;
    kind: 'context-response';
    requestId: string;
    context: ClrPageContext;
}
interface ClrContextFrameHostOptions {
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
interface ClrContextFrameRequestOptions {
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
declare class ClrContextFrameHost {
    private readonly getSnapshot;
    private readonly hostWindow;
    private readonly allowedOrigins;
    private readonly allowAnyOrigin;
    private readonly shareFullUrl;
    private readonly shareFormValues;
    private readonly snapshotCeiling;
    private readonly minRequestIntervalMs;
    private readonly lastServedAt;
    private readonly messageListener;
    private intervalStartedAt;
    private servedInInterval;
    private listening;
    constructor(getSnapshot: (options?: ClrContextSnapshotOptions) => ClrPageContext, hostWindow: Window, options?: ClrContextFrameHostOptions);
    start(): void;
    stop(): void;
    private onMessage;
    private isServableOrigin;
    private isThrottled;
    /** The snapshot as a frame is allowed to see it, leaving the original untouched. */
    private contextForFrame;
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
declare function requestClrContextFromHost(options?: ClrContextFrameRequestOptions): Promise<ClrPageContext | null>;

/** How the engine should behave when exposed on `window`. */
interface ClrContextGlobalAccessOptions extends ClrContextSnapshotOptions {
    /**
     * Include what the user has typed. Off by default, because any script on the page can
     * call the global accessor — including one the application did not write.
     */
    shareFormValues?: boolean;
}
/**
 * Builds on-demand snapshots of everything useful an AI agent can know about the current
 * page: the active route, and the components rendered right now with their state, as a
 * tree in which every control sits where it is on the page — plus whatever semantic
 * context the application registered.
 *
 * Snapshots are always computed at call time from the live application — nothing is
 * cached — so they can never contain obsolete information about UI that no longer exists.
 *
 * The engine only ever reads. It describes the page and never changes it.
 *
 * The engine can also serve snapshots across an iframe boundary (see
 * {@link enableFrameBridge} and {@link requestHostContext}), so embedded UI such as a
 * chat surface built with a different UI library can receive the hosting page's context.
 */
declare class ClrContextualEngineService implements OnDestroy {
    private readonly platformId;
    private readonly document;
    private readonly contextRegistry;
    private readonly router;
    private readonly customExtractors;
    private frameHost;
    private globalProperty;
    constructor(platformId: unknown, document: Document, contextRegistry: ClrContextRegistryService, router: Router | null);
    ngOnDestroy(): void;
    /**
     * Takes a fresh snapshot of the page context.
     */
    getSnapshot(options?: ClrContextSnapshotOptions): ClrPageContext;
    /**
     * Registers an additional DOM extractor, letting other UI libraries on the page teach
     * the engine about their own components. Returns a function that removes it again.
     */
    registerDomExtractor(extractor: ClrContextDomExtractor): () => void;
    /**
     * Exposes the engine on `window` (as `window.clrContext()` by default) so AI agents
     * driving the browser can query the page context without an application API.
     *
     * Anything running on the page can call this, including a third-party script, so the
     * caller is treated as untrusted: its options are reduced to budgets, the
     * application's own budgets are applied over the top, and what the user has typed is
     * withheld unless {@link ClrContextGlobalAccessOptions.shareFormValues} says otherwise.
     */
    enableGlobalAccess(propertyName?: string, hostOptions?: ClrContextGlobalAccessOptions): void;
    disableGlobalAccess(): void;
    /**
     * Starts answering context requests from embedded frames, so UI hosted in an iframe
     * (a chat surface, an embedded tool) can pull this page's context through
     * `postMessage`. Each request is answered with a freshly computed snapshot.
     *
     * By default only frames from the page's own origin are served; pass
     * `allowedOrigins` to serve trusted cross-origin frames.
     */
    enableFrameBridge(options?: ClrContextFrameHostOptions): void;
    disableFrameBridge(): void;
    /**
     * Requests the context of the page hosting this application, for applications that
     * themselves run inside an iframe. Resolves with `null` when there is no hosting
     * page or it does not serve context.
     */
    requestHostContext(options?: ClrContextFrameRequestOptions): Promise<ClrPageContext | null>;
    private browserWindow;
    private currentUrl;
    private routeContext;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrContextualEngineService, [null, null, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrContextualEngineService>;
}

interface ClrContextTrackingOptions {
    /** Budgets applied to every snapshot the tracker takes. */
    snapshot?: ClrContextSnapshotOptions;
    /**
     * Quiet window: the page is scraped this many milliseconds after the last observed
     * DOM change, so one user action (which typically produces a short burst of
     * mutations) results in one scrape. Default `300`.
     */
    debounceMs?: number;
    /**
     * Upper bound between the first unprocessed DOM change and the scrape, so pages
     * that never go quiet (animations, tickers) still get tracked. Default `2000`.
     */
    maxWaitMs?: number;
}
/**
 * Maintains the current page context as a stream by watching the DOM itself: a
 * `MutationObserver` sees every change — route navigations, data arriving into a
 * datagrid, a modal opening, rows being selected — and the page is re-scraped after a
 * short quiet window, then emitted only if the context actually changed. Consumers
 * such as an AI chat panel subscribe to {@link context$} and always hold context
 * describing what the user currently sees, without polling and without any coupling to
 * the router or the rendering framework.
 *
 * Mutations inside elements marked with {@link CLR_CONTEXT_IGNORE_ATTRIBUTE} are
 * ignored (and the collector never describes those elements), so UI that renders the
 * context — the chat panel itself — neither triggers feedback loops nor describes
 * itself into the page context.
 *
 * `input` and `change` are watched as well as mutations, because typing changes a
 * property rather than an attribute and is invisible to a `MutationObserver`. So are
 * the application's own `clrContext` annotations, whose state lives outside the DOM.
 *
 * Same-origin frames are watched too — an observer on the page's own document never
 * sees inside them — so a page assembled from embedded plugins is tracked as one page,
 * the same way the engine describes it. Frames are discovered after every scrape, and
 * re-attached when they navigate.
 *
 * Every emission is a freshly computed snapshot of the live DOM at that moment — the
 * tracker stores only the latest emission and never merges or accumulates, so context
 * from a page that was navigated away from can never leak into the current one.
 */
declare class ClrContextTrackerService implements OnDestroy {
    private readonly platformId;
    private readonly document;
    private readonly contextEngine;
    private readonly contextRegistry;
    private readonly zone;
    /** Emits the latest page context; replays the most recent snapshot to new subscribers. */
    readonly context$: Observable<ClrPageContext>;
    private readonly contextSubject;
    private trackingOptions;
    private tracking;
    private observer;
    private quietTimer;
    private maxWaitTimer;
    private valueListener;
    private readonly frames;
    private registrySubscription;
    private latest;
    constructor(platformId: unknown, document: Document, contextEngine: ClrContextualEngineService, contextRegistry: ClrContextRegistryService, zone: NgZone);
    /** The most recent snapshot the tracker has taken, or `null` before tracking starts. */
    get currentContext(): ClrPageContext | null;
    ngOnDestroy(): void;
    /**
     * Starts tracking: takes an initial snapshot immediately, then re-scrapes whenever
     * the DOM changes. Calling it again restarts with the new options.
     */
    start(options?: ClrContextTrackingOptions): void;
    /** Stops tracking. The last emitted context stays available to subscribers. */
    stop(): void;
    /** Takes a fresh snapshot immediately and emits it. */
    refresh(): void;
    private onMutations;
    private onValueChange;
    /**
     * Queues a scrape for after the page goes quiet. Mutations and value changes share one
     * window, so a burst of typing still results in a single scrape.
     */
    private scheduleScrape;
    /** Scrapes the page and emits only if the context actually changed. */
    private scrape;
    private observeDocument;
    /**
     * Watches every same-origin frame currently on the page, including frames inside
     * frames, and drops the ones that have gone. A frame whose document is not readable
     * yet — still loading, or cross-origin — is watched for its `load` event instead, so
     * it is picked up once it is, and again whenever it navigates.
     */
    private observeFrames;
    private detachFrame;
    private clearTimers;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrContextTrackerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrContextTrackerService>;
}

/**
 * Reads an element's published context, if any. A callback that throws is treated as
 * having nothing to say — one broken publisher must not break the snapshot.
 */
declare function readClrElementContext(element: Element, options: Required<ClrContextSnapshotOptions>): Partial<ClrComponentContext> | null;
/**
 * Merges an element's published context over a DOM-extracted one. Published values win
 * — the component knows itself better than the markup does — and states are merged
 * key-wise. Arrays inside the published state are capped to the collection budget.
 */
declare function mergeElementContext(base: ClrComponentContext, element: Element, options: Required<ClrContextSnapshotOptions>): ClrComponentContext;

/**
 * Annotates a piece of UI with semantic context for AI agents — the knowledge only the
 * application has, such as what a section is for:
 *
 * ```html
 * <section clrContext="Firewall rules for the selected cluster" [clrContextState]="{ cluster: clusterName }">
 * ```
 *
 * The annotation is part of snapshots only while this element exists: it registers when
 * the directive initializes and unregisters when it is destroyed, and its inputs are
 * read at snapshot time, so snapshots never contain outdated annotations.
 *
 * Changes to the annotation are also announced to whatever keeps a snapshot current —
 * whether the state object was replaced or edited in place — because they alter no DOM
 * and would otherwise go unnoticed until something else on the page changed.
 */
declare class ClrContext implements OnInit, DoCheck, OnDestroy, ClrContextProvider {
    private readonly contextRegistry;
    /** Human-readable description of what this piece of UI is about. */
    label: string;
    /** Kind of UI this annotation describes. Defaults to `'region'`. */
    type: string;
    /** Current application state an agent should know about, as a small serializable object. */
    state: Record<string, unknown> | null;
    private lastReported;
    constructor(contextRegistry: ClrContextRegistryService);
    ngOnInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    getClrContext(): ClrComponentContext | null;
    /** The annotation as it would appear in a snapshot; what "changed" is measured against. */
    private serialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrContext, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrContext, "[clrContext]", never, { "label": { "alias": "clrContext"; "required": false; }; "type": { "alias": "clrContextType"; "required": false; }; "state": { "alias": "clrContextState"; "required": false; }; }, {}, never, never, false, never>;
}

declare const CLR_CONTEXTUAL_DIRECTIVES: any[];
declare class ClrContextualModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrContextualModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrContextualModule, [typeof ClrContext], [typeof i2.CommonModule], [typeof ClrContext]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrContextualModule>;
}

export { CLR_CONTEXTUAL_DIRECTIVES, CLR_CONTEXT_DEFAULT_OPTIONS, CLR_CONTEXT_IGNORE_ATTRIBUTE, CLR_CONTEXT_PROTOCOL, CLR_CONTEXT_REDACT_ATTRIBUTE, ClrContext, ClrContextFrameHost, ClrContextRegistryService, ClrContextTrackerService, ClrContextualEngineService, ClrContextualModule, collectClrDomContextTree, collectClrDomContexts, mergeElementContext, readClrElementContext, requestClrContextFromHost };
export type { ClrContextDomExtractor, ClrContextFrameHostOptions, ClrContextFrameRequest, ClrContextFrameRequestOptions, ClrContextFrameResponse, ClrContextGlobalAccessOptions, ClrContextProvider, ClrContextTrackingOptions, ClrContextTreeResult, ClrPageContext, ClrRouteContext };
