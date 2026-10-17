# Vitest test infrastructure

[CDE-3219](https://vmw-jira.broadcom.net/browse/CDE-3219) covers the test infrastructure migration for Clarity v19.

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

## E8-01: Explicit test state

[CDE-3289](https://vmw-jira.broadcom.net/browse/CDE-3289) replaces Jasmine's shared callback receiver with closure variables initialized before each test.

- `spec()` returns an accessor for the current test's `TestContext`. Deferred initialization with `autoInit: false` allows TestBed overrides before creating a fixture.
- `createTestHelpers()` provides suite-owned fixture factories and cleanup.
- Local helper functions receive explicit arguments instead of relying on `.call(this, ...)`.

The native `Date` receiver used by the date formatting spy is independent of the test runner and remains in place.

## E8-02: Vitest and browser support

[CDE-3290](https://vmw-jira.broadcom.net/browse/CDE-3290) switches both library test targets to `@angular/build:unit-test`.

Each library has a dedicated application build target for its test-specific styles and polyfills. Tests retain JIT compilation for dynamically configured TestBed modules. The published libraries retain their existing build targets.

Shared configuration:

- `vitest.config.mts`: mock restoration, shuffled execution, seed selection, file isolation, and slow-test reporting.
- `projects/test-setup.ts`: the `cds-theme` body attribute and timer cleanup.
- `projects/test-providers.ts`: the Zone-based change detection scheduler used by the existing tests.
- `angular.json`: browser viewport, coverage, setup files, and CI targets.

The existing `fakeAsync`, `tick`, `flush`, and `waitForAsync` tests use the documented `zone.js/plugins/vitest-patch` integration. Tests that use native asynchronous callbacks explicitly await their work. New tests can use native async functions and Vitest timers.

Each spec file registers its own suites. The old `all.spec.ts` aggregators are removed, with their suite names retained in the individual files. Support-only modules use ordinary `.ts` filenames. This avoids empty suites and duplicate registration under Vitest and also enables previously unregistered spec factories.

Karma configuration, reporters, bootstraps, and direct Jasmine/Karma dependencies are removed. ESLint recognizes Vitest globals and rejects focused tests.

## E8-03: Cleanup and randomized order

[CDE-3291](https://vmw-jira.broadcom.net/browse/CDE-3291) enables Angular's default fixture teardown (`destroyAfterEach: true`) and shuffles both files and tests.

Tests must create fresh mutable state in `beforeEach`. Component providers that supply mutable objects should use factories. Resize observers, subscriptions, document styles, and manually inserted elements must be cleaned up. The lifecycle tests verify that Angular destroys fixtures between tests without requiring an explicit helper cleanup call.

Vitest prints the shuffle seed. Reproduce a failure by setting it explicitly:

```shell
VITEST_SEED=3219 npm run _test:angular
VITEST_SEED=3219 npm run _test:addons
```

Without `VITEST_SEED`, a run uses the current timestamp. Run multiple seeds when changing shared test infrastructure.

## Coverage and checks

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
