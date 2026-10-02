---
name: clarity
description: >-
  Authoritative usage knowledge for Clarity (@clr/angular, @clr/addons) components. Use whenever
  building or editing UI with Clarity — adding buttons, datagrids, forms, modals, alerts, wizards,
  icons, etc., or when asked how to import / use / wire any clr-* component. Loads a distilled,
  per-component reference (correct module import, selectors/classes, copy-paste examples) instead of
  guessing or searching the demos every time.
---

# clarity — Clarity component usage

Per-component knowledge lives in `docs/clarity-ai/components/<name>.md` — one distilled file per
component, generated from the live demos (index: `docs/clarity-ai/components/index.md`). Load the file
for the component(s) in the request; do not re-derive usage or read raw demo files into context.

## How to use

1. **Identify** the Clarity component(s) the request implies (e.g. "add a save button" → `button`;
   "show a table with paging" → `datagrid`; "confirmation dialog" → `modal`). Use
   `docs/clarity-ai/components/index.md` to map intent to a component name.
2. **Read** `docs/clarity-ai/components/<name>.md`. It gives the module to import, the real
   selectors / CSS classes / directives, and copy-paste example snippets from the official demos.
3. **Apply** it: import the Clarity NgModule (`ClrXxxModule`), use `clr-*` selectors / `.btn*` classes,
   and `cds-icon` for icons. The consumer's own component may be standalone + OnPush + Signals; the
   Clarity bindings stay decorator-based.
4. **Deep / edge cases** — a feature not covered by the reference, or a full runnable example — call the
   `scaffold_clarity_component` MCP tool, or dispatch the `clarity-research` + `clarity-developer`
   subagents so the heavy reads stay out of this conversation's context.

## Keeping it current

References are generated, not hand-maintained:

```
cd tools/clarity-mcp && npm install && npm run build && npm run generate:references
```

Regenerate when the website demos change; a CI check can diff the output to flag drift.
