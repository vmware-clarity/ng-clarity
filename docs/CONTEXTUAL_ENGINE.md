# Contextual Engine

`@clr/angular/ai` gives AI agents structured, up-to-date context about the page a Clarity
application is currently showing: the active route, the components rendered right now and their
state, the actions currently available, and any semantic annotations the application provides.

It ships as a secondary entry point of `@clr/angular`, so it needs nothing extra installed.
Components are described by reading the rendered DOM — specifically the accessibility tree — so
the engine covers Clarity Angular components, `@clr/ui` CSS-only markup, other component libraries
and plain semantic HTML alike.

## Design principles

- **Pull, never push.** A snapshot is computed at the moment it is requested, from the live DOM and
  live registrations. Nothing is cached, so a snapshot can never describe UI that has been closed,
  destroyed or navigated away from.
- **Budgeted output.** Text is truncated, lists are capped and hidden elements are skipped
  (see `ClrContextSnapshotOptions`), so snapshots stay small enough for an agent's context window.
- **No user data by default.** Form fields are described by name, label, type and validation
  state; values and selectable options are collected only on explicit opt-in
  (`includeFormValues`), and passwords are redacted unconditionally.
- **Described by role, not by selector.** The engine reads the accessibility tree: an ARIA role,
  an accessible name and ARIA state mean the same thing on a Clarity Angular component, on
  `@clr/ui` CSS-only markup, in another component library and in plain semantic HTML. There are no
  Clarity selectors or class names in the engine, so nothing has to be taught about a component
  before it can be described.
- **Components add only what a role cannot say.** A combobox's options while its popover is closed,
  a datagrid's total row count while paginated. Everything else already lives in the markup.

## Taking a snapshot

```ts
import { ClrContextualEngineService } from '@clr/angular/ai';

constructor(private contextEngine: ClrContextualEngineService) {}

const snapshot = this.contextEngine.getSnapshot();
// {
//   title: 'Cluster overview',
//   url: 'https://app.example/clusters/42',
//   route: { url: '/clusters/42', path: 'clusters/:id', params: { id: '42' } },
//   regions: [{ type: 'region', label: 'Firewall rules for cluster 42' }],
//   components: [
//     { type: 'grid', element: 'clr-datagrid',
//       state: { columns: ['Name', 'Status'], rowCount: 20, selectedRows: 2 } },
//   ],
//   actions: [{ label: 'Add rule', kind: 'button' }],
//   collectedAt: '2026-08-18T10:00:00.000Z'
// }
```

## Keeping a live "current page" context

For consumers that want to always hold the context of the page the user is currently on — an AI
chat panel, for example — `ClrContextTrackerService` turns the pull-based engine into a stream by
watching the DOM itself. A `MutationObserver` (created outside the Angular zone, so it triggers no
change detection) sees every change — route navigations, data arriving into a datagrid, a modal
opening, rows being selected. The page is re-scraped after a quiet window of `debounceMs`
(default 300, which covers a typical interaction burst in one scrape), bounded by `maxWaitMs`
(default 2000) so pages that never go quiet still get tracked, and an emission happens only when
the context actually changed:

```ts
import { ClrContextTrackerService } from '@clr/angular/ai';

constructor(tracker: ClrContextTrackerService) {
  tracker.start({ snapshot: { maxComponents: 50 } });
  tracker.context$.subscribe(context => this.chatPanel.setPageContext(context));
}
```

Every emission is a freshly computed snapshot — the tracker keeps only the latest one and never
merges, so context from a page the user left can never leak into the current one.

Mark UI that renders the context — the chat panel itself, a debug view — with the
`data-clr-context-ignore` attribute (exported as `CLR_CONTEXT_IGNORE_ATTRIBUTE`). Such regions are
invisible to the engine end to end: the collector never describes them and the tracker ignores
their mutations, so a panel re-rendering the context cannot re-trigger tracking or describe itself
into the page context.

An input's _value_ changes its property, never its attribute, so a `MutationObserver` never sees
typing. When snapshots carry values, the tracker therefore also listens for `input` and `change`,
feeding the same quiet window — a burst of typing still results in one scrape. Those listeners are
attached only when values are collected, so tracking costs nothing extra otherwise.
`tracker.refresh()` remains available for on-demand updates.

For browser-driving agents that have no application API, the engine can expose a global accessor:

```ts
this.contextEngine.enableGlobalAccess(); // window.clrContext() now returns a fresh snapshot
```

## Filling forms with an agent

What a control _permits_ is always reported: the `options` it offers (select options, radio
choices, datalist entries, a combobox's owned listbox) alongside `min`, `max`, `step`, `pattern`
and `maxLength`. These describe the markup, not the user, and without them an agent cannot propose
a legal value at all. Helper text and validation messages arrive as `description`, resolved from
`aria-describedby`, so they are attached to the field they belong to.

What the user _entered_ waits for an explicit opt-in. With `includeFormValues`, each control also
reports its current `value`. Password and file inputs are always redacted, and embedded frames can
never request values through the frame bridge — only the hosting application can opt in.

```ts
const context = engine.getSnapshot({ includeFormValues: true });
// field example: { type: 'combobox', element: 'clr-select-container', label: 'Cluster',
//   state: { value: 'beta', options: ['Alpha', 'Beta'] } }

// The agent answers with JSON keyed by control name...
const answer = { hostName: 'esx-prod-04', cluster: 'beta', tier: 'silver', enabled: true };

// ...which is applied back through real DOM events, so Angular template-driven and
// reactive forms react as if the user had typed. Nothing is submitted automatically.
const result = engine.applyFormValues(answer);
// { applied: ['hostName', 'cluster', 'tier', 'enabled'], skipped: [] }
```

`applyClrFormValues(form, values)` is also exported for applying to a specific form element.
Unknown names, non-matching options and password fields are reported in `skipped` rather than
guessed at.

## Annotating the application

The DOM only knows _what_ is on the page. The `clrContext` directive lets the application add the
_why_ — knowledge only it has. Annotations register when the element appears and unregister when it
is destroyed, and their inputs are read at snapshot time, so they are never stale:

```html
<section clrContext="Firewall rules for the selected cluster" [clrContextState]="{ cluster: clusterName }">...</section>
```

Anything can also implement `ClrContextProvider` and register with `ClrContextRegistryService` for
fully dynamic context.

## Component-published context: state the DOM cannot show

Some state lives only inside component instances — a combobox's options render in a popover, yet
the component always knows them. Any component can publish that truth by assigning a callback to
its own host element under the `clrElementContext` property (exported as
`CLR_ELEMENT_CONTEXT_PROPERTY`, with a `publishElementContext` helper in `@clr/angular/utils`).
The collector calls it
while scraping and merges the result over what the DOM shows — published values win. Because the
contract is a plain element property with plain data, publishing requires no dependency on
this entry point: Clarity components, other UI libraries and application components all use the same
mechanism.

```ts
publishElementContext(hostElement, snapshotOptions => ({
  type: 'combobox',
  state: {
    options: this.choices.map(choice => choice.label),
    // Callbacks receive the snapshot budgets and must honor includeFormValues
    // before exposing anything user-typed.
    value: snapshotOptions.includeFormValues ? this.selection : undefined,
  },
}));
```

`ClrCombobox` ships this integration built in: its options and selection are reported even while
the popover is closed (selection only under `includeFormValues`). A callback that throws is
treated as having nothing to add.

Publishing happens on the component's own host element, while the node the engine describes is
usually the role-bearing element inside it — the `<div role="grid">` within a `<clr-datagrid>`.
Both are merged into one description, and what the host publishes is attributed to it through the
`element` field, so a `clr-side-panel` and a `clr-modal` stay distinguishable even though both are
dialogs.

## Describing markup that carries no semantics

Well-formed markup needs no help: anything with an ARIA role, an accessible name or a custom
element tag is described automatically, whatever library rendered it. What the engine cannot
describe is markup that says nothing about itself — a bare `<div class="card">` with no role and no
name. Register an extractor for those:

```ts
const unregister = this.contextEngine.registerDomExtractor({
  selector: 'chat-message-list',
  extract: element => ({ type: 'chat-log', state: { messages: element.children.length } }),
});
```

## Serving context to embedded frames (e.g. chat UIs in an iframe)

UI embedded in an iframe — such as chat components built with a separate UI library — can receive
the hosting page's context. The hosting application opts in:

```ts
// Host page (the Clarity application)
this.contextEngine.enableFrameBridge(); // same-origin frames only
this.contextEngine.enableFrameBridge({ allowedOrigins: ['https://chat.example'] }); // trusted cross-origin frames
```

Inside the iframe, an Angular application can use the engine directly:

```ts
const hostContext = await this.contextEngine.requestHostContext();
```

Non-Angular UI can speak the protocol directly — it is two plain JSON messages over `postMessage`
(see `CLR_CONTEXT_PROTOCOL` in `@clr/angular/ai`):

```js
// iframe -> parent
parent.postMessage({ protocol: 'ui-context/v1', kind: 'context-request', requestId: 'r1' }, '*');
// parent -> iframe (sent by the host bridge, always a freshly computed snapshot)
// { protocol: 'ui-context/v1', kind: 'context-response', requestId: 'r1', context: { ...ClrPageContext } }
```

Requests are answered per frame and per request — context is never broadcast — and only origins the
host allows are served. Embedded frames can pass snapshot budgets (`options`) with their request;
unknown option keys are discarded by the host.

## Keeping snapshots lean

Everything in a snapshot is bounded. Tune the budgets per call when needed:

```ts
this.contextEngine.getSnapshot({
  maxTextLength: 60, // truncate any text beyond 60 characters
  maxItemsPerCollection: 10, // at most 10 rows/tabs/links/actions per component
  maxComponents: 30, // at most 30 components overall
  includeActions: false, // skip page-level action collection
  includeDomComponents: false, // skip DOM scanning entirely (regions + route only)
});
```
