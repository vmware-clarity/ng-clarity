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

The same application runs with `?mode=zone` or `?mode=zoneless`. Zone.js is imported
only for the first mode. Every scenario checks the actual presence or absence of the
browser `Zone` global and fails on browser errors. No test forces Angular rendering.

The smoke covers tabs, accordion, datagrid sorting and asynchronous signal updates,
forms and validation, modal and dropdown actions, and the property-view addon. Tests
use ordinary UI actions and public package exports; detailed native callback, Escape,
observer and destruction regressions remain in the component suites.
