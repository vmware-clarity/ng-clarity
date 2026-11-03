import { ClrComponentContext, ClrPublishedContext, ClrContextSnapshotOptions, ClrContextCategory } from '@clr/angular/utils';
export { CLR_CONTEXT_IGNORE_ATTRIBUTE, CLR_CONTEXT_REDACT_ATTRIBUTE, CLR_ELEMENT_CONTEXT_PROPERTY, CLR_ELEMENT_MUTATOR_PROPERTY, ClrComponentContext, ClrContextCategory, ClrContextSnapshotOptions, ClrElementContextCallback, ClrElementMutation, ClrElementMutator, ClrPublishedContext, publishElementContext, publishElementMutator } from '@clr/angular/utils';
import * as i0 from '@angular/core';
import { InjectionToken, EnvironmentProviders, OnDestroy, OnInit, DoCheck, Type } from '@angular/core';
import { Observable } from 'rxjs';

/** Options for `getSnapshotAsync`: the snapshot's, and how long to wait for each asynchronous provider. */
interface ClrContextAsyncSnapshotOptions extends ClrContextSnapshotOptions {
    /** Milliseconds to wait for each asynchronous provider. Default `2000`. */
    timeoutMs?: number;
}
/** The active route, when the application uses the Angular router. */
interface ClrRouteContext {
    /** The current router URL, e.g. `/users/42?tab=details`. */
    url: string;
    /** The configured route path pattern, e.g. `users/:id`. */
    path?: string;
    /** Route parameters of the active route chain. */
    params?: Record<string, string>;
    /** Query parameters of the current URL. */
    queryParams?: Record<string, string | string[]>;
    /** JSON-serializable subset of the route `data` of the active route chain. */
    data?: Record<string, unknown>;
}
/** A route the application can navigate to, from its router configuration. */
interface ClrAvailableRoute {
    /** The configured path pattern, e.g. `clusters/:id/hosts`. */
    path: string;
    /** The route's title, when the configuration names one. */
    title?: string;
    /** Present when the route's children load lazily and are not listed until visited. */
    lazy?: boolean;
}
/** Identifies the application a snapshot describes. */
interface ClrApplicationContext {
    /** A stable id for the application, e.g. `vcenter-ui`. */
    id: string;
    /** The application's version, when it reports one. */
    version?: string;
}
/** A snapshot of the page context, always computed on demand from the live application. */
interface ClrPageContext {
    /** Version of the snapshot format; it changes when a field changes meaning. */
    schemaVersion: string;
    /** The application, from `provideClrContextApplication`; the page's host name when none is provided. */
    application: ClrApplicationContext;
    /**
     * The view the user is on: `viewId` in the page's `data-ai-metadata`, then the application provider,
     * the route's `data.viewId` and the views configuration.
     */
    viewId?: string;
    /**
     * Metadata about the current view, merged from the views configuration, the application provider,
     * `data-ai-metadata-url` and `data-ai-metadata`, later ones winning.
     */
    metadata?: Record<string, unknown>;
    /** Set while a metadata URL is loading, or when one could not be loaded. */
    metadataState?: 'loading' | 'unavailable';
    /**
     * Whether the engine reads this view: `false` when the views configuration disables it, or the application
     * reads only enabled views and this one has no metadata, and then nothing else is read. It gates this engine
     * only, not what the page renders.
     */
    enabled: boolean;
    /** The document title; empty for an untrusted caller unless it shares the full URL. */
    title: string;
    /** The current URL (browser location, or router URL when available). */
    url?: string;
    /** Route information, present when the application uses the Angular router. */
    route?: ClrRouteContext;
    /** Routable paths, when `includeRoutes` is set; at least 50 entries, without wildcards or redirects. */
    availableRoutes?: ClrAvailableRoute[];
    /** Application-provided contexts from the `clrContext` directive or a {@link ClrContextProvider}. */
    regions: ClrComponentContext[];
    /** Everything rendered with a role, name or text, as a tree; collections are summarised. */
    components: ClrComponentContext[];
    /** `true` when something was left out for size; raise the budget or narrow the scope. */
    truncated?: boolean;
    /** `'modal'` when only the open modal dialog is described. */
    focus?: 'modal';
    /** ISO timestamp of the moment the snapshot was taken. */
    collectedAt: string;
}
/**
 * Contributes context to snapshots. Asked once per snapshot; return `null` when there is nothing to report.
 * A promise is awaited by `getSnapshotAsync` and reported as `{ type: 'clr-loading' }` by `getSnapshot`;
 * while it is pending, later snapshots wait for it instead of asking again. A promise that rejects or
 * outlasts the timeout is reported as `{ type: 'clr-unavailable' }`. Untrusted consumers see only the
 * state keys listed in `publicKeys`.
 */
interface ClrContextProvider {
    /** The provider's context as it is now, or `null` when it has nothing to report. */
    getClrContext(): ClrPublishedContext | null | Promise<ClrPublishedContext | null>;
}

/** Default snapshot budgets, sized for an AI agent's context window. */
declare const CLR_CONTEXT_DEFAULT_OPTIONS: Readonly<Required<ClrContextSnapshotOptions>>;
/** The roles each category stands for. `text` and `frames` map to the `includeText` and `includeFrames` switches. */
declare const CLR_CONTEXT_CATEGORIES: Readonly<Record<ClrContextCategory, readonly string[]>>;
/** The roles a set of categories leaves out, for the categories that are roles. */
declare function clrContextCategoryRoles(categories: readonly ClrContextCategory[]): string[];
/** Named option bundles for common ways of consuming context. */
type ClrContextPreset = 'full' | 'interactive' | 'minimal';
/** Presets from most to least verbose: `full`, `interactive` (no prose or layout) and `minimal`. */
declare const CLR_CONTEXT_PRESETS: Readonly<Record<ClrContextPreset, Readonly<ClrContextSnapshotOptions>>>;
/** A copy of a preset's options with overrides; exclusion lists add up. Throws for an unknown name. */
declare function clrContextPreset(preset: ClrContextPreset, overrides?: ClrContextSnapshotOptions): ClrContextSnapshotOptions;

/** Application-wide snapshot options that every snapshot starts from. */
declare const CLR_CONTEXT_OPTIONS: InjectionToken<ClrContextSnapshotOptions>;
/**
 * Configures snapshot options for the whole application, from a preset, options or both:
 * ```ts
 * provideClrContextOptions('interactive', { excludeSelectors: ['clr-header'] });
 * ```
 * Provide it at application level: the engine is root-provided and reads only the root injector.
 */
declare function provideClrContextOptions(options: ClrContextPreset | ClrContextSnapshotOptions, overrides?: ClrContextSnapshotOptions): EnvironmentProviders;
/** The application's identity, and where its view id and metadata come from. */
interface ClrContextApplicationOptions extends ClrApplicationContext {
    /** The current view's id; checked before the route's `data.viewId`. */
    viewId?: () => string | null | undefined;
    /** Metadata about the current view, as a small serializable object. */
    metadata?: () => Record<string, unknown> | null | undefined;
    /**
     * Which views are read: `'all'` (the default) reads every view; `'enabled'` reads only views
     * with metadata and reports the others as `enabled: false`, with nothing about the page.
     */
    views?: 'all' | 'enabled';
    /**
     * Origins other than the page's own that `data-ai-metadata-url` and a configuration URL may load
     * from, e.g. `['https://help.example.com']`.
     */
    metadataOrigins?: string[];
}
/** The application every snapshot describes. */
declare const CLR_CONTEXT_APPLICATION: InjectionToken<ClrContextApplicationOptions>;
/**
 * Identifies the application in every snapshot:
 * ```ts
 * provideClrContextApplication({ id: 'inventory', version: '2.4.0', viewId: () => currentView() });
 * ```
 */
declare function provideClrContextApplication(application: ClrContextApplicationOptions): EnvironmentProviders;
/** How one view is identified and described, without editing its HTML or code. */
interface ClrContextViewConfig {
    /** The route pattern, as `route.path` reports it, e.g. `'hosts/:id'`. */
    route?: string;
    /** Matches while an element matching this selector is on the page. */
    selector?: string;
    /** The view's id, used when nothing on the page or the route names one. */
    viewId?: string;
    /** Metadata about the view; the page's own metadata wins. */
    metadata?: Record<string, unknown>;
    /** `false` keeps the view from being read; `true` reads it with `views: 'enabled'` even without metadata. */
    enabled?: boolean;
}
/** Views described from outside the application, matched in order; the first match applies. */
interface ClrContextConfig {
    /** The views, most specific first. */
    views: ClrContextViewConfig[];
}
/** The views configuration, or the URL of its JSON. */
declare const CLR_CONTEXT_CONFIG: InjectionToken<string | ClrContextConfig>;
/**
 * Describes views by route or selector, as an object or the URL of an `ai-config.json`:
 * ```ts
 * provideClrContextConfig('/assets/ai-config.json');
 * provideClrContextConfig({ views: [{ route: 'hosts/:id', viewId: 'host-detail', metadata: { purpose: '…' } }] });
 * ```
 */
declare function provideClrContextConfig(config: ClrContextConfig | string): EnvironmentProviders;

/** Decides, from the element an annotation sits on, whether it is kept, dropped or stripped of state. */
type ClrContextRegionFilter = (element: Element | null) => 'keep' | 'drop' | 'redact';
/** Registry of live context providers; they are polled at snapshot time, so nothing goes stale. */
declare class ClrContextRegistryService {
    /** Emits when a provider joins, leaves or reports a change, which may not touch the DOM. */
    readonly changes$: Observable<void>;
    private readonly providers;
    private readonly elements;
    private readonly changesSubject;
    /** Answers still pending, shared by every snapshot taken until they settle. */
    private readonly pending;
    constructor();
    /** Registers a provider and returns its teardown; with `element`, it follows that element's visibility. */
    register(provider: ClrContextProvider, element?: Element): () => void;
    /** Removes a provider, typically from `ngOnDestroy`. */
    unregister(provider: ClrContextProvider): void;
    /** Tells whoever is keeping a snapshot current that a provider's contribution changed. */
    notifyChanged(): void;
    /** Polls live providers, skipping ones that return `null` or throw; a pending one is reported as loading. */
    collect(options?: ClrContextCollectOptions): ClrComponentContext[];
    /**
     * Like {@link collect}, awaiting each pending provider for up to `timeoutMs` (2 seconds by default).
     * One that fails or takes longer is reported as unavailable. The filter is applied again once every
     * provider has answered, as an element may have moved or been redacted meanwhile.
     */
    collectAsync(options?: ClrContextAsyncCollectOptions): Promise<ClrComponentContext[]>;
    private settle;
    private poll;
    /** The provider's answer; while an earlier answer is pending, that one, so a slow provider is not asked again. */
    private ask;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrContextRegistryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrContextRegistryService>;
}
/** How {@link ClrContextRegistryService.collect} collects. */
interface ClrContextCollectOptions {
    /** Decides from each provider's element whether it is kept, dropped or stripped of state. */
    filter?: ClrContextRegionFilter;
    /** Cuts text and lists in what providers report. */
    limits?: ClrContextRegionLimits;
    /** For a caller the application does not control: state is cut to the keys each provider marks public. */
    untrusted?: boolean;
}
/** How {@link ClrContextRegistryService.collectAsync} collects. */
interface ClrContextAsyncCollectOptions extends ClrContextCollectOptions {
    /** How long to wait for each pending provider. Default `2000`. */
    timeoutMs?: number;
}
/** How long text and lists in a provider's report may be. */
type ClrContextRegionLimits = Pick<Required<ClrContextSnapshotOptions>, 'maxTextLength' | 'maxItemsPerCollection'>;
/** Type of the placeholder region reported for a provider whose answer is pending. */
declare const CLR_CONTEXT_LOADING_TYPE = "clr-loading";
/** Type of the placeholder region reported for a provider that failed or did not answer in time. */
declare const CLR_CONTEXT_UNAVAILABLE_TYPE = "clr-unavailable";

/** A node whose own state changed between two snapshots, without its children. */
interface ClrComponentContextChange {
    /** The node as it was in the previous snapshot. */
    before: ClrComponentContext;
    /** The node as it is now. */
    after: ClrComponentContext;
}
/** What changed between two snapshots, so a conversation can send the difference instead of the page. */
interface ClrContextChange {
    /** The previous snapshot, or `null` for the first, where everything is `added`. */
    previous: ClrPageContext | null;
    /** The snapshot the change leads to. */
    current: ClrPageContext;
    /** Nodes that were not there before, with their subtrees. */
    added: ClrComponentContext[];
    /** Nodes that are gone, without their subtrees. */
    removed: ClrComponentContext[];
    /** Nodes present in both whose own state differs. Their children are compared separately. */
    changed: ClrComponentContextChange[];
    /** Whether the route or URL differs. */
    routeChanged: boolean;
    /** Whether the application, view id, view metadata or whether the view is enabled differs. */
    viewChanged: boolean;
    /** Whether the application's annotations differ. */
    regionsChanged: boolean;
    /** Whether the document title differs. */
    titleChanged: boolean;
}
/** Compares two snapshots, matching nodes level by level by role, element and label, since nodes have no ids. */
declare function clrDiffContext(previous: ClrPageContext | null, current: ClrPageContext): ClrContextChange;
/** Whether a change carries anything at all. */
declare function clrIsEmptyContextChange(change: ClrContextChange): boolean;

/** How the tracker paces its snapshots and what each one collects; see `start`. */
interface ClrContextTrackingOptions {
    /** Budgets applied to every snapshot the tracker takes. */
    snapshot?: ClrContextSnapshotOptions;
    /** Milliseconds of quiet after the last DOM change before the page is scraped. Default `300`, at least `10`. */
    debounceMs?: number;
    /** Maximum delay between the first unprocessed change and the scrape. Default `2000`, at least `debounceMs`. */
    maxWaitMs?: number;
}
/**
 * Streams the page context, re-scraping after DOM, value and annotation changes. Each scrape waits for
 * asynchronous providers, as `getSnapshotAsync` does; one runs at a time, and changes made meanwhile
 * lead to one more. A provider whose answer changes the page, such as a loading bar, is asked again
 * after the next quiet period, so it is never asked more often than `debounceMs` allows.
 */
declare class ClrContextTrackerService implements OnDestroy {
    /** Emits the latest page context, replaying the most recent one to new subscribers. */
    readonly context$: Observable<ClrPageContext>;
    /** What changed with each {@link context$} emission. Not replayed: subscribe before `start()` or `track()`. */
    readonly changes$: Observable<ClrContextChange>;
    private readonly errorHandler;
    private readonly contextSubject;
    private readonly changesSubject;
    private trackingOptions;
    private tracking;
    private observer;
    private quietTimer;
    private maxWaitTimer;
    private stopListeningForValues;
    private readonly frames;
    /** Observers do not cross shadow boundaries, so each open shadow root gets its own. */
    private readonly shadowObservers;
    private subscriptions;
    private latest;
    private latestSerialized;
    /** Bumped by each scrape, `refresh` and `stop`, so a slower earlier scrape never overwrites a newer snapshot. */
    private scrapeRun;
    /** One scrape at a time: a change during one marks the page dirty, and one more scrape follows. */
    private scrapeInFlight;
    private scrapeDirty;
    private destroyed;
    private sharedUsers;
    private sharedStarted;
    private readonly platformId;
    private readonly document;
    private readonly contextEngine;
    private readonly contextRegistry;
    private readonly zone;
    private readonly router;
    constructor();
    /** The latest snapshot, or `null` before tracking starts. */
    get currentContext(): ClrPageContext | null;
    /** Whether the tracker is watching the page. */
    get isTracking(): boolean;
    ngOnDestroy(): void;
    /**
     * Starts tracking with an immediate snapshot. Calling it again restarts with the new options. Tracking
     * started here runs until `stop`, even after the last `track()` subscriber leaves. An open shadow root
     * attached to an element already on the page is watched from the next snapshot; `refresh` takes one.
     */
    start(options?: ClrContextTrackingOptions): void;
    /**
     * The page context, tracked while anyone subscribes; the last subscriber to leave stops tracking.
     * Options apply to every consumer, since there is one tracker.
     */
    track(options?: ClrContextTrackingOptions): Observable<ClrPageContext>;
    /** Stops tracking and disconnects the observers. */
    stop(): void;
    /**
     * Takes a new snapshot now instead of waiting for a change; asynchronous providers follow when they
     * answer, even when the tracker is not started.
     */
    refresh(): void;
    private begin;
    private emit;
    private onMutations;
    private onValueChange;
    private scheduleScrape;
    /** Scrapes once at a time; `pending` also runs it untracked, to settle a `refresh`. */
    private scrape;
    private observeDocument;
    private observeTree;
    /** Watches same-origin frames, nested ones too; an unreadable frame is watched for `load` instead. */
    private observeFrames;
    /** Observes the open shadow roots in `root`, its own included, that are not observed yet. */
    private observeShadowRootsIn;
    private forgetDetachedShadowRoots;
    private detachFrame;
    private clearTimers;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrContextTrackerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrContextTrackerService>;
}

/**
 * Describes markup that has neither a role nor an accessible name, such as a bare `<div class="card">`.
 * Untrusted consumers see only the state keys it lists in `publicKeys`.
 */
interface ClrContextDomExtractor {
    /** CSS selector matching the elements this extractor understands. */
    selector: string;
    /** Describes the element's current state, or returns `null` when there is nothing to report. */
    extract(element: HTMLElement, options: Required<ClrContextSnapshotOptions>): ClrPublishedContext | null;
}

/** Identifier of the framework-agnostic `postMessage` context protocol. A discriminator, never a secret. */
declare const CLR_CONTEXT_PROTOCOL = "ui-context/v1";
/** Message an embedded frame posts to its parent to ask for the page context. */
interface ClrContextFrameRequest {
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
interface ClrContextFrameResponse {
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
interface ClrContextFrameHostOptions {
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
interface ClrContextFrameRequestOptions {
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
 * Requests the host page's context from inside a frame. Resolves `null` when the host does not answer;
 * rejects when the request cannot be made. Answers are accepted only from the asked window and origin.
 */
declare function clrRequestHostContext(options?: ClrContextFrameRequestOptions): Promise<ClrPageContext | null>;

/** How the engine should behave when exposed on `window`. */
interface ClrContextGlobalAccessOptions extends ClrContextSnapshotOptions {
    /** Include what the user has typed. Off by default. */
    shareFormValues?: boolean;
    /** Include the full URL, route parameters and data, and the document title. Off by default. */
    shareFullUrl?: boolean;
}
/** Builds on-demand, read-only snapshots of the current page: route, rendered components and registered context. */
declare class ClrContextEngineService implements OnDestroy {
    private readonly customExtractors;
    private readonly applicationOptions;
    private readonly application;
    private readonly mutationPolicy;
    private readonly refs;
    private readonly config;
    private readonly metadataLoader;
    private readonly locationStrategy;
    private readonly platformId;
    private readonly document;
    private readonly contextRegistry;
    private readonly router;
    private readonly zone;
    private frameHost;
    private globalProperty;
    ngOnDestroy(): void;
    /**
     * Takes a fresh snapshot, applying `options` over the application-wide ones; pending sources are reported as loading.
     * With a mutation policy, writable nodes carry a stable `ref`.
     */
    getSnapshot(options?: ClrContextSnapshotOptions): ClrPageContext;
    /**
     * Like {@link getSnapshot}, awaiting asynchronous providers and metadata URLs for up to `timeoutMs` each
     * (2 seconds by default). When the view changes while they answer, the new view is snapshotted instead.
     */
    getSnapshotAsync(asyncOptions?: ClrContextAsyncSnapshotOptions): Promise<ClrPageContext>;
    /** Registers a DOM extractor for other libraries' components. Returns a function that removes it. */
    registerDomExtractor(extractor: ClrContextDomExtractor): () => void;
    /**
     * Exposes the engine on `window` (`window.clrContext()` by default) for agents driving the browser.
     * Any script on the page can call it, so form values and the full URL are withheld unless allowed.
     */
    enableGlobalAccess(propertyName?: string, hostOptions?: ClrContextGlobalAccessOptions): void;
    /** Removes the accessor added by `enableGlobalAccess`. */
    disableGlobalAccess(): void;
    /** Answers context requests from embedded frames over `postMessage`; by default only same-origin frames. */
    enableFrameBridge(options?: ClrContextFrameHostOptions): void;
    /** Stops answering embedded frames. */
    disableFrameBridge(): void;
    /** Requests the hosting page's context from inside an iframe; `null` when there is none or it does not answer. */
    requestHostContext(options?: ClrContextFrameRequestOptions): Promise<ClrPageContext | null>;
    /**
     * The application and view, with nothing about the page yet. A view is not read when its
     * configuration disables it, while a configuration URL has not loaded, or, with `views: 'enabled'`,
     * when nothing gives it metadata. Once `settled`, a metadata URL that has not loaded is reported as unavailable.
     */
    private viewSnapshot;
    /** Metadata from `data-ai-metadata` and `data-ai-metadata-url` on the view's roots and their ancestors, inner winning. */
    private pageMetadata;
    private metadataHosts;
    /** The configuration and metadata URLs the view's description depends on. */
    private metadataUrls;
    /** The first configured view matching the route and the page. */
    private viewConfig;
    /** With `untrusted`, what application code published is cut to the state keys it marks public. */
    private snapshot;
    /** After a navigation, the new view's providers are awaited once more; then it settles for a synchronous snapshot. */
    private snapshotAsync;
    private describePage;
    private applicationContext;
    private providedViewId;
    /** The deepest route's own `data.viewId`: a child route does not inherit its parent's view. */
    private routedViewId;
    /** Annotations follow their element: left out where it would be, stateless inside a redacted region. */
    private regionFilter;
    /** The most an untrusted caller may get: the host can narrow the application's options, never widen them. */
    private untrustedCeiling;
    private browserWindow;
    /** Where the application is, as its router sees it. */
    private address;
    private currentUrl;
    private routePattern;
    private basePath;
    private routeContext;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrContextEngineService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrContextEngineService>;
}

/**
 * Version of the {@link ClrPageContext} format; it changes only when a field changes meaning or is removed.
 * New top-level fields are added without changing it.
 */
declare const CLR_PAGE_CONTEXT_SCHEMA_VERSION = "1";
/**
 * JSON Schema (draft-07) of {@link ClrPageContext} at `schemaVersion` `'1'`, for consumers that validate
 * snapshots outside TypeScript. The top level accepts fields a later release adds, so ignore the ones you do
 * not know; everything below it is strict. Component `state` and the view's `metadata` are
 * application-specific and left open.
 */
declare const CLR_PAGE_CONTEXT_SCHEMA: {
    readonly $schema: "http://json-schema.org/draft-07/schema#";
    readonly $id: "https://clarity.design/schemas/page-context/1.json";
    readonly title: "ClrPageContext";
    readonly type: "object";
    readonly required: readonly ["schemaVersion", "application", "enabled", "title", "regions", "components", "collectedAt"];
    readonly properties: {
        readonly schemaVersion: {
            readonly const: "1";
        };
        readonly application: {
            readonly type: "object";
            readonly required: readonly ["id"];
            readonly additionalProperties: false;
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                };
                readonly version: {
                    readonly type: "string";
                };
            };
        };
        readonly viewId: {
            readonly type: "string";
        };
        readonly metadata: {
            readonly type: "object";
        };
        readonly metadataState: {
            readonly enum: readonly ["loading", "unavailable"];
        };
        readonly enabled: {
            readonly type: "boolean";
        };
        readonly title: {
            readonly type: "string";
        };
        readonly url: {
            readonly type: "string";
        };
        readonly route: {
            readonly type: "object";
            readonly required: readonly ["url"];
            readonly additionalProperties: false;
            readonly properties: {
                readonly url: {
                    readonly type: "string";
                };
                readonly path: {
                    readonly type: "string";
                };
                readonly params: {
                    readonly $ref: "#/definitions/strings";
                };
                readonly queryParams: {
                    readonly $ref: "#/definitions/queryParams";
                };
                readonly data: {
                    readonly type: "object";
                };
            };
        };
        readonly availableRoutes: {
            readonly type: "array";
            readonly items: {
                readonly type: "object";
                readonly required: readonly ["path"];
                readonly additionalProperties: false;
                readonly properties: {
                    readonly path: {
                        readonly type: "string";
                    };
                    readonly title: {
                        readonly type: "string";
                    };
                    readonly lazy: {
                        readonly type: "boolean";
                    };
                };
            };
        };
        readonly regions: {
            readonly type: "array";
            readonly items: {
                readonly $ref: "#/definitions/component";
            };
        };
        readonly components: {
            readonly type: "array";
            readonly items: {
                readonly $ref: "#/definitions/component";
            };
        };
        readonly truncated: {
            readonly type: "boolean";
        };
        readonly focus: {
            readonly const: "modal";
        };
        readonly collectedAt: {
            readonly type: "string";
        };
    };
    readonly definitions: {
        readonly strings: {
            readonly type: "object";
            readonly additionalProperties: {
                readonly type: "string";
            };
        };
        readonly queryParams: {
            readonly type: "object";
            readonly additionalProperties: {
                readonly anyOf: readonly [{
                    readonly type: "string";
                }, {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                }];
            };
        };
        readonly component: {
            readonly type: "object";
            readonly required: readonly ["type"];
            readonly additionalProperties: false;
            readonly properties: {
                readonly type: {
                    readonly type: "string";
                };
                readonly ref: {
                    readonly type: "string";
                };
                readonly element: {
                    readonly type: "string";
                };
                readonly label: {
                    readonly type: "string";
                };
                readonly state: {
                    readonly type: "object";
                };
                readonly children: {
                    readonly type: "array";
                    readonly items: {
                        readonly $ref: "#/definitions/component";
                    };
                };
            };
        };
    };
};

/**
 * A JSON object about the view when it sits on the view's root or an ancestor of it, or about the
 * piece of UI it sits on anywhere else, where it is reported as the node's `state.metadata`.
 */
declare const CLR_AI_METADATA_ATTRIBUTE = "data-ai-metadata";
/** The URL of a JSON object about the view; read on the view's root and its ancestors. */
declare const CLR_AI_METADATA_URL_ATTRIBUTE = "data-ai-metadata-url";
/** What a piece of UI is about, as `[clrContext]` sets it, for pages without Angular. */
declare const CLR_CONTEXT_LABEL_ATTRIBUTE = "data-clr-context";
/** The kind of UI annotated, as `[clrContextType]` sets it. */
declare const CLR_CONTEXT_TYPE_ATTRIBUTE = "data-clr-context-type";
/** The annotated UI's state as a JSON object, as `[clrContextState]` sets it. */
declare const CLR_CONTEXT_STATE_ATTRIBUTE = "data-clr-context-state";

/**
 * Annotates a piece of UI with context for AI agents, such as what a section is for:
 * ```html
 * <section clrContext="Firewall rules for the selected cluster" [clrContextState]="{ cluster: clusterName }">
 * ```
 */
declare class ClrContext implements OnInit, DoCheck, OnDestroy, ClrContextProvider {
    /** Human-readable description of what this piece of UI is about. */
    label: string;
    /** Kind of UI this annotation describes. Defaults to `'region'`. */
    type: string;
    /** Current application state an agent should know about, as a small serializable object. */
    state: Record<string, unknown> | null;
    /** State keys untrusted callers (`window.clrContext()`, frames) may see; every other key is withheld. */
    publicKeys: readonly string[] | null;
    private lastReported;
    private readonly host;
    private readonly contextRegistry;
    ngOnInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    /** The context this element publishes, or `null` when it is ignored. */
    getClrContext(): ClrPublishedContext | null;
    private annotation;
    private serialized;
    /** On an `<ng-container>`, the element it sits in, or the host of the shadow root it sits at the top of. */
    private anchor;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrContext, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrContext, "[clrContext]", never, { "label": { "alias": "clrContext"; "required": false; }; "type": { "alias": "clrContextType"; "required": false; }; "state": { "alias": "clrContextState"; "required": false; }; "publicKeys": { "alias": "clrContextPublicKeys"; "required": false; }; }, {}, never, never, true, never>;
}

/** The standalone directives {@link ClrContextModule} imports and exports. */
declare const CLR_CONTEXT_DIRECTIVES: Type<any>[];
/** Makes the standalone `clrContext` directive available to NgModule applications. */
declare class ClrContextModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrContextModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrContextModule, never, [typeof ClrContext], [typeof ClrContext]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrContextModule>;
}

/** Snapshot budgets a caller the application does not control may set; content rules are not negotiable. */
declare const CLR_CONTEXT_UNTRUSTED_OPTION_KEYS: readonly (keyof ClrContextSnapshotOptions)[];

/** Gives a control a value, named by its snapshot `ref` (never a selector), in the agent's terms. */
interface ClrSetValueOperation {
    /** Gives a control a value. */
    operation: 'setValue';
    /** The `ref` of the node to write to, from the latest snapshot. */
    ref: string;
    /** The node's label in the agent's words, checked against its name so a drifted ref is caught. */
    description: string;
    /** The value, in the agent's terms: text, a number, `true`, an option's label, a date. */
    value: unknown;
}
/** Empties a control, so an agent can say "no value" deliberately. */
interface ClrClearOperation {
    /** Empties a control. */
    operation: 'clear';
    /** The `ref` of the node to clear, from the latest snapshot. */
    ref: string;
    /** What the node is, in the agent's words; checked as for `setValue`. */
    description: string;
}
/** Navigates through the router, so guards run, to a pattern `availableRoutes` would list. */
interface ClrNavigateOperation {
    /** Goes to a route. */
    operation: 'navigate';
    /** The route's path pattern exactly as `availableRoutes` listed it, e.g. `clusters/:id`. */
    path: string;
    /** Values for the pattern's parameters, e.g. `{ id: '42' }`; each fills one segment, and `.`/`..` are refused. */
    params?: Record<string, string>;
    /** Query parameters to add, unconstrained by the route; classify on `ClrMutationTarget.queryParams`. */
    queryParams?: Record<string, string>;
}
/** One operation the mutation engine can apply. It never submits, clicks or invokes anything. */
type ClrMutationOperation = ClrSetValueOperation | ClrClearOperation | ClrNavigateOperation;
/**
 * What an operation would do: `reversible` is applied, `consequential` needs `confirm`, `forbidden` never.
 * Only the application knows which is which; the engine never infers it.
 */
type ClrMutationConsequence = 'reversible' | 'consequential' | 'forbidden';
/** What an operation is about to do, as given to the policy. */
interface ClrMutationTarget {
    /** The operation being judged. */
    operation: ClrMutationOperation['operation'];
    /** The node's `ref`, for element operations. */
    ref?: string;
    /** The node's accessible name, for element operations. */
    label?: string;
    /** The node's role — `textbox`, `combobox`, `grid` — for element operations. */
    type?: string;
    /** The element the operation would write to, for element operations. */
    element?: Element;
    /** The route pattern, for navigation. */
    path?: string;
    /** The URL the navigation would go to, query string included. */
    url?: string;
    /** The query parameters the navigation would add; the agent chose them freely. */
    queryParams?: Record<string, string>;
    /** The value about to be written, in the agent's terms; `null` or `[]` for a clear. Judge and show this one. */
    value?: unknown;
    /** The value the form control will receive, for inspection only; absent where the component translates it. */
    modelValue?: unknown;
}
/** What the engine may change. Without a policy, every operation is refused as `unclassified`. */
interface ClrMutationPolicy {
    /** Milliseconds `confirm` may take before the operation is `declined`. Default 2 minutes; `0` waits forever. */
    confirmTimeoutMs?: number;
    /** Declares what each operation would do. For a navigation, judge the whole `url`: query parameters act on load. */
    classify(target: ClrMutationTarget): ClrMutationConsequence;
    /** Asked before a `consequential` operation; resolving `false` refuses it. */
    confirm?(target: ClrMutationTarget): boolean | Promise<boolean>;
    /** Told what an `apply()` did, so the application can announce it; the engine announces nothing itself. */
    announce?(report: ClrMutationReport): void;
}
/** The application's {@link ClrMutationPolicy}; provide it at application level with `provideClrMutationPolicy`. */
declare const CLR_MUTATION_POLICY: InjectionToken<ClrMutationPolicy>;
/**
 * Enables the mutation engine with the application's policy. Provide it at application level, not in a lazy route.
 * ```ts
 * provideClrMutationPolicy({ classify: t => (t.operation === 'navigate' ? 'consequential' : 'reversible') });
 * ```
 */
declare function provideClrMutationPolicy(policy: ClrMutationPolicy): EnvironmentProviders;
/** Why an operation was not applied; each comes with a `detail` an agent can act on. */
type ClrMutationRefusal = 'unclassified' | 'forbidden' | 'unconfirmed' | 'declined' | 'stale' | 'mismatch' | 'hidden' | 'redacted' | 'disabled' | 'readOnly' | 'unbound' | 'unsupported' | 'invalid' | 'noRoute';
/** What is true after an element operation: the value the control holds and its validity. */
interface ClrElementMutationResult {
    /** The operation this result is for. */
    operation: 'setValue' | 'clear';
    /** The ref the operation named. */
    ref: string;
    /** Whether the control now holds the value. */
    applied: boolean;
    /** The control's value now, in the terms an agent sees. */
    value?: unknown;
    /** The control's value before, so the application can restore it. */
    previous?: unknown;
    /** The form control's status after the write: `VALID`, `INVALID`, `PENDING` or `DISABLED`. */
    status?: string;
    /** The form control's validation errors after the write, when it has any. */
    errors?: Record<string, unknown>;
    /** Why the operation was not applied, when it was not. */
    refused?: ClrMutationRefusal;
    /** What an agent should do about a refusal, or what the control would have accepted. */
    detail?: string;
}
/** What a navigation led to, read from the router's events rather than its promise. */
type ClrNavigationOutcome = 'navigated' | 'redirected' | 'unchanged' | 'rejected' | 'superseded' | 'failed';
/** What a navigate operation led to. */
interface ClrNavigationMutationResult {
    /** The operation this result is for. */
    operation: 'navigate';
    /** The route pattern the operation named. */
    path: string;
    /** Whether the page moved, or was already where it was asked to go. */
    applied: boolean;
    /** What the navigation led to, when it ran. */
    outcome?: ClrNavigationOutcome;
    /** The router URL now. */
    url?: string;
    /** Why the operation was not run, when it was not. */
    refused?: ClrMutationRefusal;
    /** What went wrong, or what to do about a refusal. */
    detail?: string;
}
/** What one operation did: {@link ClrElementMutationResult} or {@link ClrNavigationMutationResult}. */
type ClrMutationResult = ClrElementMutationResult | ClrNavigationMutationResult;
/** What a batch changed, as {@link clrDiffContext} reports it, without the two snapshots. */
type ClrMutationChanges = Omit<ClrContextChange, 'previous' | 'current'>;
/** What applying a plan did: per-operation results, a fresh snapshot and the difference from before. */
interface ClrMutationReport {
    /** What each operation did, in the order given. */
    results: ClrMutationResult[];
    /** The page after the operations, taken with the options given to `apply()`. */
    snapshot: ClrPageContext;
    /** What the operations changed: the difference between the page before and after, taken alike. */
    changes: ClrMutationChanges;
}
/** What applying an operation would do, without doing it. */
interface ClrMutationPlanEntry {
    /** The operation this entry is for. */
    operation: ClrMutationOperation;
    /** How the policy classified it, when it could be resolved. */
    consequence?: ClrMutationConsequence;
    /** What it would write to, and with what, when it could be resolved. */
    target?: ClrMutationTarget;
    /** The refusal it would meet, if any. */
    refused?: ClrMutationRefusal;
    /** What to do about that refusal. */
    detail?: string;
}

/**
 * Fills form controls and navigates for an AI agent, from the refs and routes in snapshots; never submits or clicks.
 * For application code only: results carry unwithheld page values, so no untrusted surface exposes it.
 */
declare class ClrMutationEngineService {
    private readonly contextEngine;
    private readonly refs;
    private readonly policy;
    private readonly router;
    private readonly zone;
    private readonly application;
    private readonly contextOptions;
    private queue;
    /** What applying the operations would do, without doing it. Pass the same `snapshotOptions` as `apply()`. */
    plan(operations: ClrMutationOperation[], snapshotOptions?: ClrContextSnapshotOptions): ClrMutationPlanEntry[];
    /** Applies the operations in order and reports each result, a fresh snapshot and the changes. */
    apply(operations: ClrMutationOperation[], snapshotOptions?: ClrContextSnapshotOptions): Promise<ClrMutationReport>;
    private run;
    /** Asks `confirm` for at most `confirmTimeoutMs`; the timer runs outside the zone so the app can stabilise. */
    private confirm;
    private applyOne;
    /** Re-prepares after confirmation: the operation is written only if it is still exactly what was agreed to. */
    private confirmAndRecheck;
    /** Checks every view (zoneless apps, writes outside the zone) and lets scheduled work run. */
    private catchUp;
    private prepareSafely;
    private scopeOptions;
    private prepare;
    private prepareNavigation;
    private navigate;
    private classify;
    private verdict;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrMutationEngineService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrMutationEngineService>;
}

export { CLR_AI_METADATA_ATTRIBUTE, CLR_AI_METADATA_URL_ATTRIBUTE, CLR_CONTEXT_APPLICATION, CLR_CONTEXT_CATEGORIES, CLR_CONTEXT_CONFIG, CLR_CONTEXT_DEFAULT_OPTIONS, CLR_CONTEXT_DIRECTIVES, CLR_CONTEXT_LABEL_ATTRIBUTE, CLR_CONTEXT_LOADING_TYPE, CLR_CONTEXT_OPTIONS, CLR_CONTEXT_PRESETS, CLR_CONTEXT_PROTOCOL, CLR_CONTEXT_STATE_ATTRIBUTE, CLR_CONTEXT_TYPE_ATTRIBUTE, CLR_CONTEXT_UNAVAILABLE_TYPE, CLR_CONTEXT_UNTRUSTED_OPTION_KEYS, CLR_MUTATION_POLICY, CLR_PAGE_CONTEXT_SCHEMA, CLR_PAGE_CONTEXT_SCHEMA_VERSION, ClrContext, ClrContextEngineService, ClrContextModule, ClrContextRegistryService, ClrContextTrackerService, ClrMutationEngineService, clrContextCategoryRoles, clrContextPreset, clrDiffContext, clrIsEmptyContextChange, clrRequestHostContext, provideClrContextApplication, provideClrContextConfig, provideClrContextOptions, provideClrMutationPolicy };
export type { ClrApplicationContext, ClrAvailableRoute, ClrClearOperation, ClrComponentContextChange, ClrContextApplicationOptions, ClrContextAsyncCollectOptions, ClrContextAsyncSnapshotOptions, ClrContextChange, ClrContextCollectOptions, ClrContextConfig, ClrContextDomExtractor, ClrContextFrameHostOptions, ClrContextFrameRequest, ClrContextFrameRequestOptions, ClrContextFrameResponse, ClrContextGlobalAccessOptions, ClrContextPreset, ClrContextProvider, ClrContextRegionFilter, ClrContextRegionLimits, ClrContextTrackingOptions, ClrContextViewConfig, ClrElementMutationResult, ClrMutationChanges, ClrMutationConsequence, ClrMutationOperation, ClrMutationPlanEntry, ClrMutationPolicy, ClrMutationRefusal, ClrMutationReport, ClrMutationResult, ClrMutationTarget, ClrNavigateOperation, ClrNavigationMutationResult, ClrNavigationOutcome, ClrPageContext, ClrRouteContext, ClrSetValueOperation };
