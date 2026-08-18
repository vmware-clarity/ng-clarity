# Contextual Engine

`@clr/angular/contextual` gives AI agents structured, up-to-date context about the page a Clarity
application is currently showing: the active route, the components rendered right now and their
state, the actions currently available, and any semantic annotations the application provides.

## Design principles

- **Pull, never push.** A snapshot is computed at the moment it is requested, from the live DOM and
  live registrations. Nothing is cached, so a snapshot can never describe UI that has been closed,
  destroyed or navigated away from.
- **Budgeted output.** Text is truncated, lists are capped and hidden elements are skipped
  (see `ClrContextSnapshotOptions`), so snapshots stay small enough for an agent's context window.
- **No user data by default.** Form fields are described by label, type and validation state —
  their values are never collected.
- **UI-library agnostic core.** The context model, the DOM extraction and the cross-frame protocol
  are plain TypeScript and plain JSON. Clarity's component extractors are just the built-in set;
  any other UI library can plug in its own.

## Taking a snapshot

```ts
import { ClrContextualEngineService } from '@clr/angular/contextual';

constructor(private contextEngine: ClrContextualEngineService) {}

const snapshot = this.contextEngine.getSnapshot();
// {
//   title: 'Cluster overview',
//   url: 'https://app.example/clusters/42',
//   route: { url: '/clusters/42', path: 'clusters/:id', params: { id: '42' } },
//   regions: [{ type: 'section', label: 'Firewall rules for cluster 42' }],
//   components: [{ type: 'datagrid', state: { columns: [...], visibleRows: 20, selectedRows: 2 } }],
//   actions: [{ label: 'Add rule', kind: 'button' }],
//   collectedAt: '2026-08-18T10:00:00.000Z'
// }
```

For browser-driving agents that have no application API, the engine can expose a global accessor:

```ts
this.contextEngine.enableGlobalAccess(); // window.clrContext() now returns a fresh snapshot
```

## Annotating the application

The DOM only knows _what_ is on the page. The `clrContext` directive lets the application add the
_why_ — knowledge only it has. Annotations register when the element appears and unregister when it
is destroyed, and their inputs are read at snapshot time, so they are never stale:

```html
<section clrContext="Firewall rules for the selected cluster" [clrContextState]="{ cluster: clusterName }">...</section>
```

Anything can also implement `ClrContextProvider` and register with `ClrContextRegistryService` for
fully dynamic context.

## Teaching the engine about other UI libraries

Components that are not Clarity components can be described by registering a DOM extractor:

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
(see `CLR_CONTEXT_PROTOCOL` in `@clr/angular/contextual`):

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
