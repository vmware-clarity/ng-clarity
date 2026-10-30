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

CDE-3270 owns this rollout and the library test configuration. Runtime regression
fixes remain independently reviewed in CDE-3360 (datepicker), CDE-3361 (modal and
side panel) and CDE-3362 (popover consumers). Switching the applications does not
complete the separate all-component OnPush conversion (CDE-3272).
