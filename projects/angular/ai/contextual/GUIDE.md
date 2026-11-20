---
name: clr-contextual-engine
description: Clarity contextual engine (`@clr/angular/ai`) — gives an AI agent a structured snapshot of the page (route, rendered components and their state, app annotations). Use when wiring page context into an assistant or chat, annotating a view with `clrContext`, publishing component state, or keeping user data away from a model.
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
}
```

Configure once at startup: `context.configure({ scope: 'interactive', routes: true })`. `scope` is a preset (`full`, `interactive`, `minimal`) or options: `root` (`'page'`, `'modal'` or a selector), `excludeSelectors`, `excludeCategories`, `maxComponents`, `maxItemsPerCollection` (0 summarizes collections). Name the app with `configure({ application: { id: 'inventory' } })`. Name each view with `data: { viewId: 'vm-list' }` on its route; `application.viewId` and `application.metadata` are functions, read on every snapshot.

## Privacy first

- A snapshot holds the rendered page, text included, and may hold personal data. Send it to a model as data, delimited from the prompt, never as instructions.
- Put `data-clr-context-redact` on regions whose values must never leave the page (their fields keep their shape, values are withheld). Put `data-clr-context-ignore` on UI the agent should not see at all.
- Password and file inputs, and fields whose `autocomplete` is `current-password`, `new-password`, `one-time-code` or a `cc-*` token, are always withheld. Redact the other secrets, such as tokens or keys typed into plain text fields.

## Adding context

| Need                                             | Use                                                               |
| ------------------------------------------------ | ----------------------------------------------------------------- |
| Say what an element of a view is for             | `[clrContext]` directive, bound to a value from the class         |
| Context no element shows, maybe asynchronous     | `ClrContextProvider` registered on `ClrContextRegistryService`    |
| A component's state the DOM cannot show          | `publishElementContext(host, callback)` from `@clr/angular/utils` |
| Markup from another library with no role or name | `configure({ extractors: [{ selector, extract }] })`              |
| Describe the view (metadata, `viewId`)           | `[clrContext]` on the view root, or `viewConfig`                  |

```ts
import { ClrContext } from '@clr/angular/ai';

@Component({
  imports: [ClrContext],
  template: `<section [clrContext]="rules">...</section>`,
})
export class Firewall {
  cluster = 'alpha';
  ruleCount = 12;
  // A constant works too; a function is read each time a snapshot is taken.
  rules = () => ({ label: 'Firewall rules', state: { cluster: this.cluster, ruleCount: this.ruleCount } });
}
```

## Pitfalls

- `[clrContext]` takes a property binding only. Static text (`clrContext="..."`) would be readable in the DOM, so it is a type error and throws in dev mode. The annotation is kept off the element, so other scripts on the page can neither read nor plant it.
- Keep the annotation's `state` small: it is serialised into every snapshot.
- `[clrContext]` is reported on the node of the element it sits on (on an `<ng-container>`, the element around it), merged with what a Clarity component there publishes; the component's values win where both set a key. Registered providers are reported in `regions`.
- An element holds one published context: `publishElementContext` on the host of a Clarity component replaces what the component publishes, or is replaced by it. Publish from an element of your own.
- A grid is summarised, not walked: its `rows` list each row's cells in one string, such as `esx-01 | ok`, up to `maxItemsPerCollection`, so there is no need to publish them.
- `root: 'modal'` reads only the open modal dialog, such as a wizard, and reads the whole page while none is open, so it can be set once for the application.
- Prefer semantic HTML and ARIA over annotations: the engine reads the accessibility tree, so an unlabelled control is unnamed to the agent too.
- A provider may answer with a promise: `snapshot()` waits for it (`configure({ timeoutMs })`, default 2000).
- Unrendered virtual-scroll rows, canvas content, closed shadow roots and cross-origin frames are invisible to it.
