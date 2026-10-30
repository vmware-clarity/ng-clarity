# Zoneless application smoke

The demo, Storybook and website bootstrap with `provideZonelessChangeDetection()` and
load no Zone.js polyfill. Their asynchronous examples notify Angular explicitly:
state read from signals schedules rendering, while plain fields updated by timers,
promises or subscriptions use `ChangeDetectorRef.markForCheck()`.

Build Storybook first because its builder clears `dist/docs`, which also contains
the demo build:

```sh
npm run _build:storybook
npm run _build:demo
npm run _build:website
npm run test:applications-smoke
```

The browser tests assert that `window.Zone` is absent, exercise delayed state changes
without an extra click or forced render, and fail on browser errors. The separate
[consumer smoke](../consumer/README.md) verifies compatibility with existing Zone.js
applications using the built library packages. Both run in the PR build workflow.

Application bootstrapping and asynchronous examples are covered here; component-level
change detection strategies are verified by the library regression suites.
