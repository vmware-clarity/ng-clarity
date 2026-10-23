# `@clr/angular/ai`

AI building blocks for Clarity applications, shipped as a secondary entry point of
`@clr/angular` — available to any application already on a Clarity version that includes it,
with nothing extra to install.

The entry point currently ships the **contextual engine**: it gives AI agents structured,
up-to-date context about the page an application is currently showing — the active route, the
components rendered right now and their state, as a tree in which every control sits where it is
on the page, and any semantic annotations the application provides. UI building blocks for AI chat
surfaces are planned under the same entry point.

## Quickstart

```ts
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClrContextEngineService, ClrContextTrackerService } from '@clr/angular/ai';

@Component({
  selector: 'app-assistant',
  template: '...',
})
export class AssistantComponent {
  private readonly engine = inject(ClrContextEngineService);
  private readonly tracker = inject(ClrContextTrackerService);

  constructor() {
    // The current page, kept up to date: emits whenever what is on screen changes.
    this.tracker
      .track()
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(context => console.log(context.components));
  }

  ask(question: string) {
    // Or one snapshot, taken now. Send it to your model as data, delimited from your prompt.
    return { question, page: this.engine.getSnapshot() };
  }
}
```

### Annotating the application

The `clrContext` directive adds what only the application knows, such as what a section is for. It
is standalone: a standalone component imports `ClrContext` directly, and an NgModule application can
keep importing `ClrContextModule`.

```ts
import { Component } from '@angular/core';
import { ClrContext } from '@clr/angular/ai';

@Component({
  selector: 'app-firewall',
  imports: [ClrContext],
  template: `<section clrContext="Firewall rules for the selected cluster" [clrContextState]="{ cluster }">
    ...
  </section>`,
})
export class FirewallComponent {
  cluster = 'alpha';
}
```

## How it works

The engine describes UI by reading the **accessibility tree** rather than Clarity-specific
selectors, so it covers Clarity Angular components, `@clr/ui` CSS-only markup, other component
libraries and plain semantic HTML with one implementation. Components publish only the state ARIA
cannot express, through `publishElementContext` from `@clr/angular/utils` — which is why a
component that publishes context does not depend on this entry point.

Through custom extractors and a framework-agnostic `postMessage` protocol it also reaches other UI
libraries and UI embedded in iframes, such as chat components. Callers the application does not
control — embedded frames and the optional `window.clrContext()` accessor — are held to the
application's budgets and the defaults, and see neither what the user entered nor the page's full
address (only its route pattern) unless the application shares them.

A snapshot carries the page's text as shown, including what users wrote, so it is data for a
model, never instructions: delimit it in prompts.

The full guide, option reference and a live playground are on the Clarity website under "Contextual Engine"
(`/documentation/contextual-engine`).
