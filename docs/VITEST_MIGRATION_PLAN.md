# Karma to Vitest migration

[CDE-3219](https://vmw-jira.broadcom.net/browse/CDE-3219) tracks the v19 test infrastructure work. Keep the following steps separate so the context refactor can be verified on the existing Jasmine runner before changing runners.

## E8-01: Replace Jasmine's shared context

[CDE-3289](https://vmw-jira.broadcom.net/browse/CDE-3289): implemented while retaining Karma and Jasmine.

- Replace Jasmine callback receivers with suite-scoped closure variables, initialized before each test.
- Make `spec()` return an accessor for the current test's `TestContext`, including deferred initialization with `autoInit: false`.
- Replace the ambient `addHelpers()` hook with `createTestHelpers()`. Each suite explicitly owns its factory methods and fixture cleanup.
- Pass context objects explicitly to local helpers that previously needed `.call(this, ...)`.
- Keep the native `Date` receiver used by the date formatting spy; it is independent of Jasmine's shared context.

For example:

```typescript
describe('Component', () => {
  const helpers = createTestHelpers();
  let context: TestContext<MyComponent, TestHost>;

  beforeEach(() => {
    context = helpers.create(MyComponent, TestHost);
  });

  it('renders content', () => {
    expect(context.clarityElement.textContent).toContain('content');
  });
});
```

The refactor preserves existing test cases, their registration order, and assertions. Helper lifecycle tests cover fresh contexts, deferred initialization, provider overrides, and fixture destruction. Both existing Karma CI targets must pass before proceeding.

## E8-02: Switch runners

[CDE-3290](https://vmw-jira.broadcom.net/browse/CDE-3290): remaining work.

The current inventory is **320 Angular spec files and 131 addons spec files** (451 total, including the new helper lifecycle tests). Schematics and tree-shaking tests already have separate Vitest configurations and are outside this conversion. Earlier estimates of 352 spec files are obsolete.

1. Configure both library test targets with `@angular/build:unit-test` and Vitest's Playwright browser support. Preserve real browser behavior for layout, focus, popovers, and drag and drop tests.
2. Apply Angular's `refactor-jasmine-vitest` schematic, then review spies, custom matchers, grouped `all.spec.ts` entry points, and test discovery manually.
3. Move shared setup into the new runner's setup files, retaining Clarity's global styles and the `cds-theme` body attribute.
4. Decide and validate the timer strategy for `fakeAsync`, `tick`, and `flush`. Do not remove Zone.js setup until affected tests have an equivalent timer and change detection strategy.
5. Preserve the existing coverage thresholds: statements 89%, branches 80%, functions 90%, and lines 89%.
6. Update CI commands and development documentation, then remove obsolete Karma and Jasmine dependencies after both suites pass on the new runner.

Estimate the remaining work from the current inventory and the browser/timer compatibility results rather than the older migration branch's time estimates.

## E8-03: Test hygiene

[CDE-3291](https://vmw-jira.broadcom.net/browse/CDE-3291): remaining work.

Enable `destroyAfterEach` and randomized test order, then fix fixture leaks and order dependencies. Verify multiple seeds and make failures reproducible by recording the seed. The E8-01 refactor leaves the existing teardown and ordering settings in place to allow an independent behavior comparison.

## Verification

Run from the worktree with Node.js 24:

```shell
npm run _test:angular
npm run _test:addons
npx tsc -p projects/angular/tsconfig.spec.json --noEmit
npx tsc -p projects/addons/tsconfig.spec.json --noEmit
```

Run ESLint and Prettier on the changed files as well. After E8-02, update these commands if the test targets or runner options change.
