# `@clr/angular/ai`

AI building blocks for Clarity applications, shipped as a secondary entry point of
`@clr/angular` — available to any application already on a Clarity version that includes it,
with nothing extra to install.

The entry point currently ships the **contextual engine**: it gives AI agents structured,
up-to-date context about the page an application is currently showing — the active route, the
components rendered right now and their state, as a tree in which every control sits where it is
on the page, and any semantic annotations the application provides. UI building blocks for AI chat surfaces are planned under
the same entry point.

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

The engine's write half, the **mutation engine** (`ClrMutationEngineService`), lets an agent act
on what it read: fill Angular-bound form controls (reactive and template-driven) and navigate to
routes the snapshot listed, addressing controls by the `ref` each snapshot node carries — random,
and stable for an element while it is on the page. It never submits, clicks or invokes; never
writes what a snapshot would not show; and does nothing at all until the application provides a `ClrMutationPolicy` classifying what each operation would do.
Components whose value is not what an agent sees — the combobox, the date input, the datagrid's row
selection — say how they are written to through `publishElementMutator` from `@clr/angular/utils`.

The full guide, option reference and a live playground are on the Clarity website under "Contextual Engine"
(`projects/website/src/app/documentation/demos/contextual-engine`).
