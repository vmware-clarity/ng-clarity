# @clr/contextual

A contextual engine that gives AI agents structured, up-to-date context about the page an
application is currently showing: the active route, the components rendered right now and their
state, the actions currently available, and any semantic annotations the application provides.

`@clr/contextual` is a standalone package with **no dependency on `@clr/angular`**: it describes
components by reading the rendered DOM, so it works alongside any Clarity version — and, through
custom extractors and a framework-agnostic `postMessage` protocol, with other UI libraries and with
UI embedded in iframes (such as chat components).

See [docs/CONTEXTUAL_ENGINE.md](../../docs/CONTEXTUAL_ENGINE.md) for the full guide.
