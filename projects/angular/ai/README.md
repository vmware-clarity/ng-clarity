# `@clr/angular/ai`

AI building blocks for Clarity applications, shipped as a secondary entry point of
`@clr/angular` — available to any application already on a Clarity version that includes it,
with nothing extra to install.

The entry point currently ships the **contextual engine**: it gives AI agents structured,
up-to-date context about the page an application is currently showing — the active route, the
components rendered right now and their state, as a tree in which every control sits where it is
on the page, and any semantic annotations the application provides. Collections are summarised
rather than listed: a table or grid reports its columns, its row count and the form controls in
its cells, and no other cell content, buttons and links included. UI building blocks for AI chat surfaces are planned under
the same entry point.

## Quickstart

### Reading the page

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

### Writing back

Nothing is written until the application provides a policy. Provide one that allows what you name
and forbids the rest:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideClrMutationPolicy } from '@clr/angular/ai';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClrMutationPolicy({
      classify: target => {
        if (target.operation === 'navigate') {
          // The agent chooses the query parameters; the route does not constrain them.
          return target.path === 'vms' && !Object.keys(target.queryParams ?? {}).length ? 'reversible' : 'forbidden';
        }
        // Fields are opted in, in the template, with data-agent-fill.
        return target.element?.closest('[data-agent-fill]') ? 'reversible' : 'forbidden';
      },
    }),
  ],
};
```

Then, in the same component that reads the page, plan and apply the operations the agent proposes:

```ts
import { ClrMutationEngineService, ClrMutationOperation } from '@clr/angular/ai';

export class AssistantComponent {
  // ...the engine and tracker above.
  private readonly mutationEngine = inject(ClrMutationEngineService);

  async act(operations: ClrMutationOperation[]) {
    // Refs and labels copied verbatim from the latest snapshot, such as
    // { operation: 'setValue', ref: 'e7mq2k4xa', description: 'VM name', value: 'web-01' }.
    const plan = this.mutationEngine.plan(operations); // what each would do, nothing written
    const report = await this.mutationEngine.apply(operations); // results, a fresh snapshot, what changed
    return { plan, report };
  }
}
```

Never classify everything as reversible (`classify: () => 'reversible'`): anyone who can put words
in front of the model could then fill any bound field on the page, including one moved off-screen.

## How it works

The engine describes UI by reading the **accessibility tree** rather than Clarity-specific
selectors, so it covers Clarity Angular components, `@clr/ui` CSS-only markup, other component
libraries and plain semantic HTML with one implementation. Components publish only the state ARIA
cannot express, through `clrPublishElementContext` from `@clr/angular/utils` — which is why a
component that publishes context does not depend on this entry point.

Through custom extractors it also reaches other UI libraries. Callers the application does not
control, such as the optional `window.clrContext()` accessor, are held to the application's budgets
and the defaults, and see neither what the user entered nor the page's full address (only its route
pattern) unless the application shares them.

The engine's write half, the **mutation engine** (`ClrMutationEngineService`), lets an agent act on
what it read: fill Angular-bound form controls (reactive and template-driven) and navigate to any
route of the application's router configuration (as `availableRoutes` lists them), addressing
controls by the `ref` each snapshot node carries — random, and stable for an element while it is on
the page. It never submits, clicks or invokes; never writes what a snapshot would not show (an
excluded or redacted control, option, radio or row; size budgets and summary mode shorten what a
snapshot lists, not what can be written); and does nothing at all until the application provides a
`ClrMutationPolicy` classifying what each operation would do. Components whose value is not what an
agent sees — the combobox, the date input, the datagrid's row selection — say how they are written
to through `clrPublishElementMutator` from `@clr/angular/utils`.

A snapshot carries the page's text as shown, including what users wrote, so it is data for a
model, never instructions: delimit it in prompts, and let the policy judge each operation's target
rather than the agent's stated reason. The website guide has a section on this.

The full guide, option reference and a live playground are on the Clarity website under "Contextual Engine"
(`/documentation/contextual-engine`).
