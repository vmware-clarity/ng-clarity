# Testing

The Angular and addons library suites run in Chromium with Vitest and Playwright.

## Running the tests

Use Node.js 24 and install the browser once after installing dependencies:

```shell
npm ci
npx playwright install chromium
npm run test
```

`npm run test` runs both library suites, schematics tests, and tree-shaking tests. The library suites use Vitest with Playwright Chromium. Their CI configurations run headless; `npm run test:watch` runs the library tests interactively. Schematics and tree-shaking retain their separate Vitest configurations.

For Linux CI, install Chromium's system dependencies too:

```shell
npx playwright install --with-deps chromium
```

## Explicit test state

Test state uses closure variables initialized before each test.

- `spec()` returns an accessor for the current test's `TestContext`. Deferred initialization with `autoInit: false` allows TestBed overrides before creating a fixture.
- `createTestHelpers()` provides suite-owned fixture factories and cleanup.
- Local helper functions receive explicit arguments instead of relying on `.call(this, ...)`.

The native `Date` receiver used by the date formatting spy is independent of the test runner and remains in place.

## Vitest and browser support

Both library test targets use `@angular/build:unit-test`.

Each library has a dedicated application build target for its test-specific styles and polyfills. Tests retain JIT compilation for dynamically configured TestBed modules. The published libraries retain their existing build targets.

Shared configuration:

- `vitest.config.mts`: mock restoration, shuffled execution, seed selection, browser execution, and slow-test reporting.
- `projects/test-setup.ts`: the `cds-theme` body attribute and timer cleanup.
- `projects/test-providers.ts`: zoneless scheduling and exhaustive check-no-changes validation for both library suites.
- `angular.json`: browser viewport, coverage, setup files, and CI targets.

The browser test bundles do not load `zone.js`, its testing support, or its Vitest patch. Use native `async` tests and await every assertion-bearing callback. For scheduled component rendering, use `await fixture.whenStable()` (or `await context.stable()`) after changing signals, setting inputs through `fixture.componentRef.setInput()`, or dispatching DOM events. `context.setInput()` sets a host input and waits for rendering. A direct assignment to an OnPush component's plain field is not a rendering notification; model the application's input or event instead.

Use explicit `detectChanges()` for initial fixture setup or tests specifically exercising change detection. The legacy `TestContext.detectChanges()` and `renderFixture(fixture)` helpers mark their host for checking before the existing render pass, preserving unit tests that explicitly mutate plain host fields. It is an intentional forced check, not proof that application rendering was notified; notification-based integration tests must use `stable()` instead. The policy baseline counts these legacy forced checks per spec file and must shrink as they are removed. Do not add extra forced passes to make a missing notification disappear. Exhaustive validation must stay enabled, and neither suite may opt back into Zone scheduling.

When testing debounce or timeout behavior, use Vitest timers and await advancement:

```typescript
vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
// Trigger the behavior under test.
await vi.advanceTimersByTimeAsync(300);
await fixture.whenStable();
```

Keep `requestAnimationFrame` and microtasks real so Angular can schedule rendering. Prefer advancing the specific timeout to draining all timers, especially when a component has repeating timers. Shared teardown restores real timers after every test. Zone compatibility belongs in the separate consumer smoke tests; the library suites always test the absence of Zone.

Each spec file registers its own suites. The old `all.spec.ts` aggregators are removed, with their suite names retained in the individual files. Support-only modules use ordinary `.ts` filenames. This avoids empty suites and duplicate registration under Vitest and also enables previously unregistered spec factories.

Karma configuration, reporters, bootstraps, and direct Jasmine/Karma dependencies are removed. ESLint recognizes Vitest globals and rejects focused tests.

## Cleanup and randomized order

Angular destroys fixtures after each test (`destroyAfterEach: true`). Vitest shuffles both files and tests. Files run sequentially in a shared browser environment, matching the Angular builder default. Fixture teardown and mock restoration still run for each test.

Tests must create fresh mutable state in `beforeEach`. Component providers that supply mutable objects should use factories. Resize observers, subscriptions, document styles, and manually inserted elements must be cleaned up. The lifecycle tests verify that Angular destroys fixtures between tests without requiring an explicit helper cleanup call.

Vitest prints the shuffle seed. Reproduce a failure by setting it explicitly:

```shell
VITEST_SEED=3219 npm run _test:angular
VITEST_SEED=3219 npm run _test:addons
```

Without `VITEST_SEED`, a local run uses the current timestamp. Explicit seeds must be non-negative safe integers. PR builds use the workflow run ID as their seed and print it in the Test step; reruns keep the same seed. Release and release-preview workflows use seed `3219`. Run multiple seeds when changing shared test infrastructure.

## Coverage and checks

`npm run _test:zoneless-policy` runs first in `npm test`. It rejects Zone imports, Zone test helpers (including aliases), a Zone scheduler override, and removal of either library's shared zoneless provider configuration. Its CI summary reports the number of library spec files checked; the allowed number of Zone-dependent specs is zero. Coverage thresholds and test assertions are preserved during migration.

Both CI targets enforce the original global coverage thresholds with Vitest's V8 provider. Each target measures its own library source; imported code from the other library is measured by that library's suite. Schematics use their separate test target; fixture factories and other test support retain their previous coverage exclusions:

| Statements | Branches | Functions | Lines |
| ---------- | -------- | --------- | ----- |
| 89%        | 80%      | 90%       | 89%   |

Reports are written to `coverage/clr-angular` and `coverage/clr-addons` as HTML, LCOV, and a terminal summary.

In addition to the suites, check TypeScript, ESLint, formatting, and the library builds:

```shell
npx tsc -p projects/angular/tsconfig.spec.json --noEmit
npx tsc -p projects/addons/tsconfig.spec.json --noEmit
npm run lint
npm run _build:angular
npm run _build:addons
```

The implementation follows [Angular's Vitest migration guide](https://angular.dev/guide/testing/migrating-to-vitest) and [Vitest's execution sequence configuration](https://vitest.dev/config/sequence).
