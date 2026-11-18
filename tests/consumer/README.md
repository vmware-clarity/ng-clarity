# Built package consumer smoke

This standalone OnPush application imports Clarity exclusively from `dist/clr-angular`,
`dist/clr-addons` and `dist/clr-ui`. Its local TypeScript paths replace the workspace source aliases,
so the test also checks Angular linking and secondary entry point consumption.

Build the libraries and consumer, then run the browser tests:

```sh
npm run _build:angular
npm run _build:addons
npm run _build:ui
npm run _build:consumer-smoke
npm run test:consumer-smoke
```

The tests serve the application with the strict Content-Security-Policy of `scripts/start-static-server.ts`;
`index.html` gives Angular the nonce placeholder through `ngCspNonce`.

The application is built twice: `/zone/?mode=zone` includes the Zone.js polyfill
before Angular and uses the builder’s Zone-compatible async transformations;
`/zoneless/?mode=zoneless` has no Zone.js polyfill. Every scenario checks the actual presence or absence of the
browser `Zone` global and fails on browser errors. No test forces Angular rendering.

The smoke covers tabs, accordion, datagrid sorting and asynchronous signal updates,
forms and validation, modal and dropdown actions, and the property-view addon. It also
checks datepicker focus, native overlay callbacks, nested modal/menu focus, rapid close
and destruction, column labels and separators, column-picker ARIA state, theme-builder
initialization and early restoration, direct component pinning, native column-picker Escape,
and Promise/Observable recursive-tree loading.
With `&suite=zone-datagrid`, the Zone.js build also bootstraps an Eager root with plain fields that change in
timers, the way most Zone.js applications are written, and checks that the OnPush datagrid follows them: items,
loading, pages, an in-place selection, a custom filter, the detail pane and tree children.
Tests use the packages' exported API (the retained-tree check also reads `ClrTreeNode._model`) and ordinary UI actions without forcing Angular rendering.
