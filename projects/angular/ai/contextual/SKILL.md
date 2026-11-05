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
import { ClrContextEngineService, ClrContextTrackerService } from '@clr/angular/ai';

export class Assistant {
  private readonly engine = inject(ClrContextEngineService);
  private readonly tracker = inject(ClrContextTrackerService);

  snapshot() {
    return this.engine.getSnapshot(); // one snapshot, now
  }

  live() {
    return this.tracker.track(); // Observable<ClrPageContext>, re-emits when the page changes
  }
}
```

Options for the whole app: `provideClrContextOptions('interactive')` (a preset, or `ClrContextSnapshotOptions`). Name the app with `provideClrContextApplication({ id: 'inventory' })`. Name each view with `data: { viewId: 'vm-list' }` on its route; `viewId` and `metadata` given to `provideClrContextApplication` are functions, read on every snapshot.

## Privacy first

- A snapshot holds the rendered page, text included, and may hold personal data. Send it to a model as data, delimited from the prompt, never as instructions.
- Put `data-clr-context-redact` on regions whose values must never leave the page (their fields keep their shape, values are withheld). Put `data-clr-context-ignore` on UI the agent should not see at all.
- Password and file inputs, and fields whose `autocomplete` is `current-password`, `new-password`, `one-time-code` or a `cc-*` token, are always withheld. Redact the other secrets, such as tokens or keys typed into plain text fields.
- `enableGlobalAccess()` exposes `window.clrContext()` to any script on the page. Untrusted callers get no form values, only the route pattern, and only published state keys marked public.

## Adding context

| Need                                             | Use                                                                    |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| Say what a section of a view is for              | `clrContext` directive (`[clrContextState]`, `[clrContextPublicKeys]`) |
| Context from a service, maybe asynchronous       | `ClrContextProvider` registered on `ClrContextRegistryService`         |
| A component's state the DOM cannot show          | `publishElementContext(host, callback)` from `@clr/angular/utils`      |
| Markup from another library with no role or name | `engine.registerDomExtractor({ selector, extract })`                   |

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
- An element holds one published context: `publishElementContext` on the host of a Clarity component replaces what the component publishes, or is replaced by it. Publish from an element of your own.
- A grid is summarised, not walked: its `rows` list each row's cells joined with ` | `, up to `maxItemsPerCollection`, so there is no need to publish them.
- `focus: 'modal'` reads only the open modal dialog, such as a wizard, and reads the whole page while none is open, so it can be set once for the application.
- Prefer semantic HTML and ARIA over annotations: the engine reads the accessibility tree, so an unlabelled control is unnamed to the agent too.
- `getSnapshotAsync({ timeoutMs })` waits for asynchronous providers; `getSnapshot()` reports a pending one as `{ type: 'clr-loading' }`.
- Unrendered virtual-scroll rows, canvas content, closed shadow roots and cross-origin frames are invisible to it.

## Writing back

- Nothing is written until the application provides `provideClrMutationPolicy({ classify })`; `confirm` is asked before a `consequential` operation.
- `mutationEngine.apply(operations)` resolves with a result per operation; a refusal carries `refused` and a `detail`, so show it to the user. `announce` on the policy hears the same report.
- The combobox, the date input and the datagrid's row selection can be written as they are. A custom control whose value is not what the agent sees is refused as `unsupported` until it publishes `publishElementMutator(host, { coerce, write, read })`.
- Password and other always-withheld fields, and controls without an Angular form binding, are never written (`redacted`, `unbound`).
