# @clr/angular — core library conventions (Rule A)

Path-scoped guidance: auto-loaded when working with files under `projects/angular/**`.

## Match the existing patterns — do NOT modernize unprompted

This is an Angular **21** library that has only partially modernized. Verified conventions in use:

- **NgModules, not standalone.** Components ship in `Clr*Module` NgModules with `standalone: false`
  (205 files) — do not author standalone core components.
- **No Signals.** Use classic `@Input()` / `@Output()` / `@ContentChild()` decorators and getter/setter
  accessors. There is zero `signal()` / signal `input()` usage in the core lib.
- **Constructor DI.** Inject via the constructor (use `@Inject(TOKEN)` for tokens); `inject()` is rare.
- **Default change detection.** Zone-based CD is the norm; add `ChangeDetectionStrategy.OnPush` only
  for genuinely perf-critical components (currently ~12 of ~129).
- **Typing:** root `strict: false`, but `strictTemplates: true` + `strictInjectionParameters: true`
  (and `noImplicitOverride: true` in the lib tsconfig). Templates must type-check.
- **License header** (Broadcom MIT) is mandatory on every `.ts`/`.scss` and enforced by
  eslint/stylelint. Selector prefix is `clr-`. Member ordering is enforced (`.eslintrc-member-ordering.js`).
- Modern template control flow (`@if` / `@else`) and `cds-*` (Clarity Core web components, e.g. `cds-icon`)
  are already adopted — prefer these over legacy equivalents in new templates.

## Gate before you call it done

```
eslint .
ng test clr-angular --configuration=ci
node scripts/api-extractor.js   # public API snapshot must not drift unexpectedly
```

## Consumer-generation note (for /clarity output — the app that USES this component)

Generated example code targets a modern consumer app: standalone components, `OnPush`, and Signals
are fine **there**. Always import Clarity as an NgModule (`imports: [ClrXxxModule]`) and use `cds-icon`
for icons. This split is deliberate — library internals stay legacy-consistent; the generated usage
snippet follows modern app best-practice.
