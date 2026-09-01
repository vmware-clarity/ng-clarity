# @clr/ai

AI building blocks for Clarity applications.

The package currently ships the **contextual engine** (`@clr/ai/contextual`, re-exported from the
root entry point): it gives AI agents structured, up-to-date context about the page an application
is currently showing — the active route, the components rendered right now and their state, the
actions currently available, and any semantic annotations the application provides. UI building
blocks for AI chat panels are planned as additional entry points (e.g. `@clr/ai/chat`).

`@clr/ai` is a standalone package with **no dependency on `@clr/angular`**: it describes components
by reading the rendered DOM, so it works alongside any Clarity version — and, through custom
extractors and a framework-agnostic `postMessage` protocol, with other UI libraries and with UI
embedded in iframes (such as chat components).

See [docs/CONTEXTUAL_ENGINE.md](../../docs/CONTEXTUAL_ENGINE.md) for the full guide.
