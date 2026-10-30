# Built package consumer smoke

This standalone OnPush application imports Clarity exclusively from `dist/clr-angular`
and `dist/clr-addons`. Its local TypeScript paths replace the workspace source aliases,
so the test also checks Angular linking and secondary entry point consumption.

Build the libraries and consumer, then run the browser tests:

```sh
npm run _build:angular
npm run _build:addons
npm run _build:consumer-smoke
npm run test:consumer-smoke
```

The application is built twice: `/zone/?mode=zone` includes the Zone.js polyfill
before Angular and uses the builder’s Zone-compatible async transformations;
`/zoneless/?mode=zoneless` has no Zone.js polyfill. Every scenario checks the actual presence or absence of the
browser `Zone` global and fails on browser errors. No test forces Angular rendering.

The smoke covers tabs, accordion, datagrid sorting and asynchronous signal updates,
forms and validation, modal and dropdown actions, and the property-view addon. It also
checks datepicker focus, native overlay callbacks, nested modal/menu focus, rapid close
and destruction, column labels and separators, column-picker ARIA state, theme-builder
initialization and early restoration, direct component pinning, native column-picker Escape,
and Promise/Observable recursive-tree loading. Tests use public package
exports and ordinary UI actions without forcing Angular rendering.
