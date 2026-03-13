# Karma → Vitest Migration Plan

## Overview

Migrate `@clr/angular` (304 specs, ~2,714 tests) and `@clr/addons` (48 specs, ~468 tests) from Karma + Jasmine to the Angular CLI's official `@angular/build:unit-test` builder with Vitest.

**Total: 352 spec files, 3,182 test cases.**

---

## Phase 0 — Prerequisites & Dependencies (0.5 day)

### Install

```bash
npm install --save-dev vitest jsdom
```

`jsdom` is already a devDependency. `vitest` was added for schematics tests.

### Uninstall (deferred to Phase 4)

```
karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter karma-mocha-reporter jasmine-core jasmine-expect
```

---

## Phase 1 — Infrastructure Setup (0.5 day)

### 1a. Update `angular.json` test targets

Replace **both** `clr-angular` and `clr-addons` test targets:

**Before:**

```json
"test": {
  "builder": "@angular/build:karma",
  "options": {
    "styles": ["projects/ui/src/clr-ui.scss"],
    "main": "projects/angular/test.ts",
    "tsConfig": "projects/angular/tsconfig.spec.json",
    "karmaConfig": "karma.conf.js",
    "codeCoverage": true,
    "watch": true,
    "sourceMap": true
  }
}
```

**After:**

```json
"test": {
  "builder": "@angular/build:unit-test",
  "options": {
    "tsConfig": "projects/angular/tsconfig.spec.json",
    "buildTarget": "clr-angular:build:development"
  }
}
```

Note: `styles`, `main`, `karmaConfig`, `codeCoverage`, `sourceMap`, and `watch` options are no longer needed. The builder uses `buildTarget` to inherit build config. Coverage is enabled via `ng test --coverage`.

### 1b. Update `tsconfig.spec.json`

Remove `"files": ["test.ts"]` — Vitest discovers specs automatically. Keep `"include": ["**/*.spec.ts", "**/*.d.ts"]` and `"exclude": ["schematics/**"]`.

### 1c. Handle Zone.js configuration

**Critical**: `@angular/build:unit-test` does **NOT** apply Zone.js patches. This means:

- `fakeAsync()`, `tick()`, `flush()` will not work.
- The `ZoneConfigModule` in `test.ts` is no longer needed.
- Tests relying on zone-based change detection need `provideZoneChangeDetection()` added to their `TestBed` config, OR migrate to `fixture.autoDetectChanges()`.

### 1d. Update CI scripts

In `package.json`:

```diff
-"_test:angular": "ng test clr-angular --configuration=ci",
-"_test:addons": "ng test clr-addons --configuration=ci",
+"_test:angular": "ng test clr-angular",
+"_test:addons": "ng test clr-addons",
```

The `--configuration=ci` is no longer needed — Vitest auto-detects CI via the `CI` env variable.

---

## Phase 2 — Automated Jasmine → Vitest Refactoring (0.5 day)

Angular CLI provides a schematic that handles the mechanical conversion:

```bash
ng g @schematics/angular:refactor-jasmine-vitest --project=clr-angular
ng g @schematics/angular:refactor-jasmine-vitest --project=clr-addons
```

### What the schematic does automatically

| Jasmine                      | Vitest                          | Files affected |
| ---------------------------- | ------------------------------- | -------------- |
| `jasmine.createSpy()`        | `vi.fn()`                       | ~12            |
| `jasmine.createSpyObj()`     | Manual — see Phase 3            | ~12            |
| `jasmine.any(X)`             | `expect.any(X)`                 | 2              |
| `jasmine.objectContaining()` | `expect.objectContaining()`     | 2              |
| `spyOn(obj, 'method')`       | `vi.spyOn(obj, 'method')`       | 73             |
| `fail()`                     | `vi.fail()`                     | varies         |
| `xit()` / `xdescribe()`      | `it.skip()` / `describe.skip()` | varies         |
| `fit()` / `fdescribe()`      | `it.only()` / `describe.only()` | varies         |

### What the schematic does NOT do (handled in Phase 3)

- `.and.returnValue(x)` → `.mockReturnValue(x)`
- `.and.callFake(fn)` → `.mockImplementation(fn)`
- `.and.callThrough()` → (keep, Vitest supports this)
- `jasmine-expect` custom matchers
- `fakeAsync` / `tick` / `flush` conversions

---

## Phase 3 — Manual Fixes (3–5 days)

### 3a. Spy API translation (~130 occurrences across ~33 files)

| Jasmine                   | Vitest                                           |
| ------------------------- | ------------------------------------------------ |
| `.and.returnValue(x)`     | `.mockReturnValue(x)`                            |
| `.and.returnValues(a, b)` | `.mockReturnValueOnce(a).mockReturnValueOnce(b)` |
| `.and.callFake(fn)`       | `.mockImplementation(fn)`                        |
| `.and.callThrough()`      | `.mockRestore()` or just don't mock              |
| `.and.throwError(e)`      | `.mockImplementation(() => { throw e; })`        |
| `.calls.count()`          | `.mock.calls.length`                             |
| `.calls.reset()`          | `.mockClear()`                                   |
| `.calls.mostRecent()`     | `.mock.calls[spy.mock.calls.length - 1]`         |
| `.calls.argsFor(i)`       | `.mock.calls[i]`                                 |

**Can be automated** with regex find-and-replace across all spec files.

### 3b. `jasmine-expect` custom matchers (~250 occurrences across ~46 files)

| jasmine-expect                 | Vitest replacement                    |
| ------------------------------ | ------------------------------------- |
| `expect(x).toBeTrue()`         | `expect(x).toBe(true)`                |
| `expect(x).toBeFalse()`        | `expect(x).toBe(false)`               |
| `expect(x).toBeEmpty()`        | `expect(x).toHaveLength(0)`           |
| `expect(x).toBeArrayOfSize(n)` | `expect(x).toHaveLength(n)`           |
| `expect(x).toBeArray()`        | `expect(Array.isArray(x)).toBe(true)` |

**Can be automated** with regex find-and-replace.

### 3c. `fakeAsync` / `tick` / `flush` migration (16 files)

Files using `fakeAsync`:

**`@clr/angular` (5 files):**

- `popover-content.spec.ts`
- `selection.spec.ts`
- `helpers.spec.ts`
- `datagrid-virtual-scroll.directive.spec.ts`

**`@clr/addons` (12 files):**

- `users-filter.component.spec.ts`
- `enum-filter.component.spec.ts`
- `datagrid.component.spec.ts`
- `override-clr-strings.directive.spec.ts`
- `datagrid-preserve-selection.directive.client-side.spec.ts`
- `datagrid-persist-settings.directive.spec.ts`
- `datagrid-page.directive.spec.ts`
- `datagrid-action-bar.component.spec.ts`
- `datagrid-filter.component.spec.ts`
- `overflow-clr-tabs.directive.spec.ts`
- `datagrid-preserve-selection.directive.server-side.spec.ts`
- `datagrid-filters.component.spec.ts`

**Migration strategy:**

```typescript
// Before (Jasmine + Zone.js)
it('should debounce', fakeAsync(() => {
  component.search('test');
  tick(300);
  expect(service.results).toHaveLength(1);
}));

// After (Vitest fake timers)
it('should debounce', () => {
  vi.useFakeTimers();
  component.search('test');
  vi.advanceTimersByTime(300);
  expect(service.results).toHaveLength(1);
  vi.useRealTimers();
});
```

### 3d. Zone.js change detection

Since Vitest doesn't load Zone.js, tests that relied on the global `ZoneConfigModule` (all of them) need either:

1. **Option A (recommended)**: Add `provideZoneChangeDetection()` to each test's `TestBed.configureTestingModule()` providers.
2. **Option B**: Use a Vitest setup file that configures this globally.

Option B is cleaner — create a `vitest-setup.ts`:

```typescript
import { getTestBed } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';

// This is handled automatically by @angular/build:unit-test
// but we document it here for clarity.
```

Actually, the `@angular/build:unit-test` builder handles TestBed initialization internally — no setup file needed. But `fakeAsync` tests MUST be rewritten (see 3c).

---

## Phase 4 — Cleanup (0.5 day)

### Delete files

- `karma.conf.js`
- `projects/angular/test.ts`
- `projects/addons/test.ts`
- `scripts/clean-progress-reporter.js`

### Uninstall packages

```bash
npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter karma-mocha-reporter jasmine-core jasmine-expect
```

### Update `.gitignore` / CI

- Remove any Karma-specific entries
- Remove `browsers: "ChromeHeadless"` from CI config (Vitest auto-detects)

---

## Phase 5 — Verification (1–2 days)

1. `ng test clr-angular` — all 2,714 tests pass
2. `ng test clr-addons` — all 468 tests pass
3. `ng test clr-angular --coverage` — meets thresholds (89/80/90/89)
4. CI workflow passes end-to-end
5. Watch mode works for local development

---

## Execution Order (Recommended)

Each step can be a separate commit for easy review and bisection:

| #   | Commit                                                                  | Risk                            |
| --- | ----------------------------------------------------------------------- | ------------------------------- |
| 1   | Install vitest + jsdom                                                  | None                            |
| 2   | Update angular.json test targets to `@angular/build:unit-test`          | **High** — tests won't pass yet |
| 3   | Run `ng g @schematics/angular:refactor-jasmine-vitest` on both projects | Medium                          |
| 4   | Find-and-replace `.and.returnValue` → `.mockReturnValue` etc.           | Low                             |
| 5   | Find-and-replace `jasmine-expect` matchers                              | Low                             |
| 6   | Rewrite 16 `fakeAsync` tests to use `vi.useFakeTimers()`                | Medium                          |
| 7   | Fix remaining failures (change detection timing, DOM quirks)            | **High**                        |
| 8   | Delete Karma files + uninstall packages                                 | Low                             |
| 9   | Verify coverage thresholds                                              | Low                             |

---

## Risks & Mitigations

| Risk                                       | Impact                      | Mitigation                                                      |
| ------------------------------------------ | --------------------------- | --------------------------------------------------------------- |
| `jsdom` doesn't match real Chrome behavior | Some DOM tests fail         | Use `@vitest/browser-playwright` for browser mode if needed     |
| Zone.js removal breaks change detection    | Timing-sensitive tests fail | Add `provideZoneChangeDetection()` or use `autoDetectChanges()` |
| `@angular/build:unit-test` is experimental | API may change              | Pin vitest version; the builder is stable enough for Angular 21 |
| Coverage numbers drop                      | CI gate fails               | Adjust thresholds temporarily, fix uncovered paths              |

---

## Estimated Effort

| Phase                          | Time         |
| ------------------------------ | ------------ |
| Phase 0 + 1: Setup             | 1 day        |
| Phase 2: Automated refactoring | 0.5 day      |
| Phase 3: Manual fixes          | 3–5 days     |
| Phase 4: Cleanup               | 0.5 day      |
| Phase 5: Verification          | 1–2 days     |
| **Total**                      | **6–9 days** |
