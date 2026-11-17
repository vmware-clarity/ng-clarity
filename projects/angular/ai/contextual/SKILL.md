---
name: clr-contextual-engine
description: Clarity contextual engine (`@clr/angular/ai`) — gives an AI agent a structured snapshot of the page (route, rendered components and their state, app annotations). Use when wiring page context into an assistant or chat, annotating a view with `clrContext`, publishing component state, keeping user data away from a model, or exposing `window.clrContext()` to a browser agent.
metadata:
  docs: /documentation/contextual-engine
---

# Clarity contextual engine

## Setup

```ts
import { inject } from '@angular/core';
import { ClrContextService } from '@clr/angular/ai';

export class Assistant {
  private readonly context = inject(ClrContextService);

  snapshot() {
    return this.context.snapshot(); // a Promise of one snapshot, now
  }

  live() {
    return this.context.watch(); // Observable<ClrPageContext>, re-emits when the page changes
  }
}
```

Configure once at startup: `context.configure({ scope: 'interactive', routes: true })`. `scope` is a preset (`full`, `interactive`, `minimal`) or options: `root` (`'page'`, `'modal'` or a selector), `excludeSelectors`, `excludeCategories`, `maxComponents`, `maxItemsPerCollection` (0 summarizes collections). Name the app with `configure({ application: { id: 'inventory' } })`. Name each view with `data: { viewId: 'vm-list' }` on its route; `application.viewId` and `application.metadata` are functions, read on every snapshot.

## Privacy first

- A snapshot holds the rendered page, text included, and may hold personal data. Send it to a model as data, delimited from the prompt, never as instructions.
- Put `data-clr-context-redact` on regions whose values must never leave the page (their fields keep their shape, values are withheld). Put `data-clr-context-ignore` on UI the agent should not see at all.
- Password and file inputs, and fields whose `autocomplete` is `current-password`, `new-password`, `one-time-code` or a `cc-*` token, are always withheld. Redact the other secrets, such as tokens or keys typed into plain text fields.
- `enableGlobalAccess()` exposes `window.clrContext()` to any script on the page. Untrusted callers get no form values, only the route pattern, and only published state keys marked public.

## Adding context

| Need                                             | Use                                                                    |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| Say what an element of a view is for             | `clrContext` directive (`[clrContextState]`, `[clrContextPublicKeys]`) |
| Context no element shows, maybe asynchronous     | `ClrContextProvider` registered on `ClrContextRegistryService`         |
| A component's state the DOM cannot show          | `publishElementContext(host, callback)` from `@clr/angular/utils`      |
| Markup from another library with no role or name | `configure({ extractors: [{ selector, extract }] })`                   |
| The same annotation in markup without Angular    | `data-clr-context`, `-type`, `-state` (JSON), `-public-keys`           |
| Describe the view (metadata, `viewId`)           | The annotation on the view root, `data-clr-context-url`, `viewConfig`  |

```ts
import { ClrContext } from '@clr/angular/ai';

@Component({
  imports: [ClrContext],
  template: `<section
    clrContext="Firewall rules"
    [clrContextState]="{ cluster, ruleCount }"
    [clrContextPublicKeys]="['ruleCount']"
  >
    ...
  </section>`,
})
export class Firewall {
  cluster = 'alpha';
  ruleCount = 12;
}
```

## Pitfalls

- Published state is private to untrusted callers unless its key is in `publicKeys`; list only keys that carry no user data.
- Keep `[clrContextState]` small and replace the object instead of mutating it: the directive serialises it on every change detection.
- `clrContext` is reported on the node of the element it sits on (on an `<ng-container>`, the element around it), merged with what a Clarity component there publishes; the component's values win where both set a key. Registered providers are reported in `regions`.
- An element holds one published context: `publishElementContext` on the host of a Clarity component replaces what the component publishes, or is replaced by it. Publish from an element of your own.
- A grid is summarised, not walked: its `rows` list each row's cells in one string, such as `esx-01 | ok`, up to `maxItemsPerCollection`, so there is no need to publish them.
- `root: 'modal'` reads only the open modal dialog, such as a wizard, and reads the whole page while none is open, so it can be set once for the application.
- Prefer semantic HTML and ARIA over annotations: the engine reads the accessibility tree, so an unlabelled control is unnamed to the agent too.
- A provider may answer with a promise: `snapshot()` waits for it (`configure({ timeoutMs })`, default 2000), `watch()` first reports it as `{ type: 'clr-loading' }`.
- Unrendered virtual-scroll rows, canvas content, closed shadow roots and cross-origin frames are invisible to it.
