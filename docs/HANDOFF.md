# Handoff — contextual engine work on `dtsanevmw/ai-assist-poc`

Working note, kept in the repo so a fresh session (e.g. a new terminal in the web UI) has
verified state to continue from. Rewritten 2026-09-09 after committing everything described
below. Everything here is verified against the repo, not recalled.

---

## 1. Hard rules — read before touching anything

1. **Never run `git commit` without explicit user approval.** Use `AskUserQuestion` to show what
   would be committed and wait. This is in the user's global `CLAUDE.md`.
2. **`TOTAL: N of N SUCCESS` from karma can be a crash, not a pass.** A browser disconnect prints a
   full-looking summary. Always compare the executed count against the expected total:
   **the suite is 3819 tests** as of this commit. If you see a smaller number, something hung —
   grep the log for `Disconnected` and `Executed .* of`.
3. **Don't touch `.worktrees/`.** It holds unrelated worktrees for other in-flight work (PR
   reviews, backports, other features) and is untracked on purpose. It has nothing to do with
   this engine.
4. Two working notes are deliberately **not** tracked in git — `docs/CONTEXTUAL_ENGINE_GAP_ANALYSIS.md`
   and `docs/CONTEXTUAL_ENGINE_CONFLUENCE_DRAFT.md` (a scratch analysis and a Confluence-posting
   draft). Leave them as local scratch files unless the user says otherwise.

---

## 2. Where things stand

Branch `dtsanevmw/ai-assist-poc`, session started at `a884b88b1`. Everything through the most
recent commit on this branch is **committed** — check `git log --oneline -15` for the exact list;
nothing described in this file is pending. Last full verification, all green: `3819 of 3819` tests
(executed count matched), `eslint` and `prettier` clean, all affected API reports regenerated
(`ai.api.md`, `clarity.api.md`, `data.api.md`, `timeline.api.md`, `utils.api.md` — the `clr-addons`
entry points fail `public-api:update` locally because `dist/clr-addons` isn't built; that's
pre-existing and unrelated).

---

## 3. What the engine is now

`@clr/angular/ai` — a secondary entry point of `@clr/angular` (the standalone `@clr/ai` package was
dropped). It describes the page from the **accessibility tree**, not from Clarity selectors, so one
implementation covers Clarity Angular, `@clr/ui` CSS-only markup, other libraries and plain HTML.
The load-bearing test asserts all three produce identical context.

**Do not add Clarity selectors or class names to the engine.** That is the whole point of the design.
The only `clr-` strings in it are doc comments and its own opt-out/redact attribute names.

Modules under `projects/angular/ai/contextual/`:

| File                                     | Role                                                                                                                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dom/roles.ts`                           | explicit + implicit ARIA roles (HTML-AAM table); `isLeafRole` vs `isNameFromContents` vs `mayContainControls` — **three different questions**, kept apart deliberately |
| `dom/accessible-name.ts`                 | accname subset; container roles never take their name from subtree text                                                                                                |
| `dom/aria-state.ts`                      | ARIA + native attributes → state; owns **redaction**                                                                                                                   |
| `dom/summarizers.ts`                     | 6 role summarizers (grid/table/treegrid, tablist, list, listbox/menu, radiogroup, combobox); a summarized role terminates the walk                                     |
| `dom/walk.ts`                            | single depth-first pass, O(N); owner attribution for `element`; nests a component's several reportable parts instead of flattening them (see §4 below)                 |
| `dom/text.ts`                            | budgets; excludes visually-hidden text from names                                                                                                                      |
| `dom/dom-context-collector.ts`           | thin public surface, delegates to the walk                                                                                                                             |
| `providers/contextual-engine.service.ts` | `getSnapshot`, frame bridge, global accessor                                                                                                                           |
| `providers/context-tracker.service.ts`   | `context$`, MutationObserver + input/change                                                                                                                            |
| `iframe/context-frame-bridge.ts`         | the `ui-context/v1` postMessage protocol                                                                                                                               |
| `untrusted-options.ts`                   | internal: `sanitizeUntrustedSnapshotOptions`                                                                                                                           |

The publish contract lives in **`projects/angular/utils/context/`**, deliberately _not_ in the engine:
if a component imported it from `@clr/angular/ai`, then `@clr/angular/forms/combobox` would depend on
the DOM collector, the MutationObserver and the router. Components import `publishElementContext`
from `@clr/angular/utils`.

### Key contracts

- `ClrComponentContext.type` is the **ARIA role** (`grid`, `dialog`, `tablist`), not a Clarity name.
  `element` carries the tag when it adds information (`clr-side-panel` vs `clr-modal`, both dialogs).
- Tag names are **not** stripped of `clr-`; knowing about that prefix was itself Clarity knowledge.
- **There is no flat `actions` list.** `ClrContextAction`, `ClrPageContext.actions`,
  `ClrComponentContext.actions` and `ClrContextSnapshotOptions.includeActions` were removed entirely.
  A button or link is reported exactly where it is in the DOM — inside the dialog, the heading, the
  alert that owns it — never pulled into a separate flattened list. Nesting is the only
  representation of "this belongs to that": to find what a dialog offers, read that dialog's own
  `children`.
- **A component that renders more than one reportable part is wrapped, not flattened.** An anonymous
  custom element (no ARIA role of its own — `<clr-datagrid>`, `<clr-tabs>`) that renders exactly one
  reportable descendant is transparent: that descendant is reported directly, attributed back via
  `element`. If it renders more than one (a datagrid's grid _and_ its sibling `<clr-dg-footer>`; a
  tabs' tablist _and_ its active `<clr-tab-content>`), those parts are nested together under one
  wrapper node (`type`/`element` = the host's tag name) instead of scattering them as unrelated
  top-level siblings. This is purely structural — keyed on "how many reportable branches does this
  anonymous wrapper render," never on tag identity — so it applies to any component with this shape,
  not just the two above. See `walk.ts`'s anonymous-custom-element branch and the generic
  `<my-widget>`/`<my-widget-footer>` tests in `walk.spec.ts`.
- **`mayContainControls` (`roles.ts`) vs `isLeafRole`.** Widget leaf roles (button, link, checkbox —
  nothing inside has independent semantics) still terminate the walk. Content leaf roles (heading,
  status, alert, term, caption, definition, tooltip) may legitimately wrap a genuinely separate
  control — e.g. `<h2>Combobox <button>Toggle Disabled</button></h2>` — so those descend one level
  further before terminating, instead of swallowing the button into the heading's label invisibly.
- **`includeFormValues` no longer exists.** Values are always collected, subject to redaction. Two
  trust boundaries withhold them unless the host opts in: embedded frames (`shareFormValues` on
  `enableFrameBridge`) and `window.clrContext()` (`shareFormValues` on `enableGlobalAccess`).
- **Redaction** (`aria-state.ts`): `password`/`file` inputs, credential/payment `autocomplete` tokens,
  and anything under `data-clr-context-redact`. Reported as `redacted: true`. Re-applied _after_
  publisher merging so a component cannot reinstate a withheld value.
- **The engine is read-only.** Form write-back (`applyClrFormValues`, `applyFormValues`,
  `form-value-applier.ts`) was removed as out of scope — applying an agent's answer needs a human
  review gate, which belongs to a review surface, not a context engine.

---

## 4. The seven publishers

Components publish only what the accessibility tree cannot carry. Full audit of every component
family, including ~100 with no gap, is in `docs/CONTEXTUAL_ENGINE_COMPONENT_AUDIT.md`; the
justification table in `docs/superpowers/specs/2026-09-08-clarity-ai-context-engine-design.md` matches it.

| Component           | Publishes                                                                | Why                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `clr-combobox`      | options while closed, selection                                          | options are not rendered while closed                                                                                      |
| `clr-datagrid`      | `rowCount` while paginated, `filteredColumns`, `hiddenColumns`           | DOM holds one page; filter state is a CSS class with its value in a closed popover; a hidden column is not rendered at all |
| `clr-alert`         | exact severity                                                           | `role="alert"` vs `role="status"` only distinguishes important from informational                                          |
| `clr-wizard`        | per-step `complete`/`error`/`navigable`, `stepCount`, `currentStepIndex` | CSS classes; the stepnav icon labelling them is inside a `<button>`, a leaf role                                           |
| `clr-tree-node`     | `expandable`, `loading`                                                  | `aria-expanded="false"` cannot say what is underneath; the spinner is a bare span with no `aria-busy`                      |
| `clr-stepper-panel` | `status`                                                                 | otherwise only a transient live-region message, and only for complete/error                                                |
| `clr-timeline-step` | `status`                                                                 | icon label carries it, but the timeline is `role="list"` so summarization stops first                                      |

Pattern: `publishElementContext(host, callback)` → store the teardown → call it in `ngOnDestroy`.
The teardown removes only the callback it published.

**`clr-stepper-panel` has a trap.** Its status is captured inside the component's _existing_ `tap`
pipe, not a new subscription. An extra subscriber in `ngOnInit` renders the template before
`ngAfterContentInit`, hits an undefined `@ContentChildren`, and **kills the browser**.

**`clr-timeline-step` takes `ElementRef` as a constructor parameter,** not `inject()`. Its existing
spec constructs the component with `new`, where `inject()` throws NG0203.

---

## 5. The demo app's global context inspector

`projects/demo/src/app/context-inspector/` is a global side panel mounted once in the demo app
shell (`app.component.html`/`app.module.ts`), triggered from the header-actions bar (the `cds-icon
shape="code"` button, left of the settings cog). It lets you browse to any demo page and see that
page's live context tree without needing per-component example content — the demo pages already
have enough CSS-only/native-HTML markup scattered through them for this to be useful as-is.

- Subscribes to `ClrContextTrackerService.context$` only while open; calls `.start()` on every open
  so it self-heals regardless of what other pages did to the shared singleton tracker.
- Uses one-way `[clrSidePanelOpen]` + `(clrSidePanelOpenChange)` into a single `setOpen()` method —
  do **not** go back to two-way `[(clrSidePanelOpen)]` plus a separate `(clrSidePanelOpenChange)`
  handler, they fight and double-toggle.
- `[clrSidePanelBackdrop]="false"` + `[clrSidePanelPinnable]="true"`: the default backdrop blocks
  clicking the header nav to change pages while the panel is open, which defeats the point.
- `data-clr-context-ignore` on the host, so the panel doesn't describe itself into its own context.

`projects/demo/src/app/contextual/contextual.demo.*` is a separate, unrelated piece of work-in-
progress (a demo form exercising every control type) that happened to be touched in the same
commit — it is not part of the context-inspector feature.

---

## 6. How to verify

```bash
# Full suite — ~25-60s depending on cache. ALWAYS check the executed count.
npx ng test clr-angular --configuration=ci > /tmp/t.log 2>&1
grep -E "TOTAL|Executed .* of|Disconnected" /tmp/t.log   # expect 3744 of 3744

# One spec (much faster)
npx ng test clr-angular --configuration=ci --include='**/path/to/x.spec.ts'
# A filtered run always fails the global coverage thresholds — that's an artifact of
# partial runs, not a real failure.

# Specs registered via `export default function` (alert, datagrid-row, …) only run
# through their all.spec.ts — `--include` on the file itself yields "0 of 0".

npx eslint projects/angular
npx prettier -l projects/angular docs

# API reports need a build first; regenerate after any public API change.
npx ng build clr-angular --configuration production
npm run public-api:update      # exits 1 if dist/clr-addons is absent — expected, ignore

npx ng build clr-website --configuration production   # NG8113 warnings are pre-existing
```

---

## 7. Outstanding

Not done, in rough priority order:

1. **Performance test** on a large grid (design spec step 6). The walk is O(N), down from
   O(N × C × depth), but unmeasured.
2. **VRT not run.** All a11y changes are attribute-only and no stylesheet targets any removed
   class (verified by reasoning, not a VRT run).
3. **`CLR_CONTEXT_PROTOCOL` channel separation** — deliberately not configurable (it ships in the
   bundle, so it is a discriminator not a secret), but two nested Clarity apps cannot distinguish
   each other's traffic. An `audience` field would fix it if the user wants.
4. Declare `@angular/router` as an optional peer dependency of `@clr/angular` (pre-existing gap the
   engine inherits).
5. `projects/demo/src/app/contextual/contextual.demo.*` is the original demo page for the engine
   (form, modal, embedded frame, global accessor) — extend it rather than replacing it.

### Recorded but deliberately unfixed

Two a11y findings in the audit doc, left alone because both change announced text and that is a UX
call: a wizard step's completion/error is effectively unannounced (the icon's label is excluded by the
button's `aria-labelledby`), and a timeline step's outcome reads only as a separate node inside a
list item. Fixing the first would make `clr-wizard`'s publisher redundant.

---

## 8. Post-audit fixes (2026-09-09)

An audit of the commits above (three independent reviews plus a live check against the demo)
found the following, all fixed in the commit that also updates this file. The behaviours are
the contract now; the specs named enforce them.

**Engine (`walk.spec.ts`, `summarizers.spec.ts`, `aria-state.spec.ts`, `roles.spec.ts`,
`accessible-name.spec.ts`, `snapshot-options.spec.ts`):**

- A summarizer that finds nothing no longer terminates the walk: the element is walked
  instead. This is what made every Clarity dropdown menu (`menuitem`s are not `option`s) and
  every breadcrumb trail (`role="list"` around custom elements) disappear. Menus now have a
  summarizer of their own (`options`, `selected`, `disabledOptions`).
- A `list` is summarised _and_ walked: its links are reported as children. A plain list item
  is not repeated as a node; one with state to add (a timeline step's status) is kept.
- `input[type=password]` is a `textbox` and `input[type=file]` a `button`, so an unlabeled
  password field is still described (`redacted: true`) rather than dropped.
- Extractor results go through the same owner merge and redaction scrub as everything else.
- What a multi-part component publishes lands on the component's wrapper node, not on each
  part. Wrapper nodes count against `maxComponents`.
- Budgets are held to finite ranges everywhere (`snapshot-options.ts`): a `NaN`/`Infinity`
  from a frame or the global accessor no longer disables the stop condition, and the host's
  own budgets act as a ceiling on what a frame or the accessor may ask for.
- `th[scope=row]` is a `rowheader`; `header`/`footer` are landmarks only at page level;
  `aria-describedby` targets that hold controls are walked, and targets referenced from an
  ignored region are not hidden; `visibility:hidden`, `opacity:0` and `inert` are skipped;
  names fall back to `placeholder`, exclude a wrapped control's own options, come from
  `element.labels` (no per-field document query), and ignore `display:none` text.
- Native checked state is `checked` (not `value`), buttons carry no `value`, a `<select>`
  reports the chosen option's text (not an `[ngValue]` key), `aria-valuetext` wins over
  `aria-valuenow`.

**Bridge / tracker / directive (`context-frame-bridge.spec.ts`, `context-tracker.service.spec.ts`,
`context.directive.spec.ts`, `contextual-engine.service.spec.ts`):**

- `requestClrContextFromHost` addresses the request to `hostOrigin`, else the embedder's
  origin from `document.referrer`, else its own origin — and accepts an answer only from the
  origin it addressed. Previously a cross-origin embedding silently failed unless
  `hostOrigin` was passed.
- The host caps frame budgets (`snapshot` option), throttles all frames together (ten per
  interval) as well as per frame, survives a request that throws, refuses a configuration
  that names no origin (`allowedOrigins: ['*']` or `[]`), and treats a non-finite
  `minRequestIntervalMs` as the default.
- `enableGlobalAccess` refuses a name that is not an identifier or already exists on
  `window`.
- `ClrContextRegistryService.changes` emits on register/unregister and when a `clrContext`
  annotation's state changes (replaced or edited in place — `ngDoCheck` compares the
  serialised form); the tracker re-scrapes on it. The tracker completes its subject on
  destroy and treats an unserialisable snapshot as changed.

**Components (`radio-group-aria.spec.ts`, `combobox-aria.spec.ts`, `validation.spec.ts`):**

- `hasRequiredValidator` (in `@clr/angular/utils`) recognises `[required]="expr"` bindings,
  which register `RequiredValidator.validate` rather than `Validators.required`; used by
  `WrappedFormControl`, the combobox and the radio container.
- `aria-required`/`aria-invalid` are reported once on the `radiogroup`, not on every radio;
  `aria-required` is not put on a range (`slider` does not support it).
- The combobox's `aria-invalid` is gated on `touched` like every other control.
- `ClrTimelineStep`'s public constructor signature is restored (`inject(ElementRef)`).
- The datagrid reads hidden columns from each column (`isHidden`) instead of pairing two
  lists by index; the stepper panel reads its status from the service at snapshot time; the
  tree node publishes a real boolean; the wizard omits `currentStepIndex` when no step is
  current; the combobox's element-context callback tolerates being called without options.

Still open: a VRT run for the attribute-only a11y changes, and the alert's `role` being
swapped on a live element when `clrAlertType` changes (left as is; the old template had no
role at all).

## 9. Mistakes made in earlier sessions — do not repeat

- Reported a browser disconnect as `3090 of 3090 SUCCESS`. Check executed count vs the real total.
- `git restore` on the user's demo files after misreading their in-progress work as corruption.
- `inject(ElementRef)` in a component whose spec uses `new`.
- Private fields inserted before public ones → `member-ordering` errors.
- A regex meant to extend one import matched across four statements and collapsed them
  (`combobox.ts`); rebuilt from `git show HEAD:<path>`.
- Answered the user's iframe question twice from the _request_ path without reading the _render_ path
  five lines below; the real cause was the demo rendering a reduced projection. Read the whole loop.
- Committed a11y changes without regenerating affected API reports, so `public-api:check` would have
  failed.
- Fixed a nesting bug (datagrid + its footer reported as separate top-level siblings) by first
  reaching for the specific fixture instead of the general shape. Corrected: the fix is keyed only
  on "does this anonymous wrapper render more than one reportable branch," verified against
  `<clr-tabs>` (tablist + active panel) before writing any code, and tested with synthetic
  `<my-widget>` markup precisely so it can't be tag-specific by accident. Any future fix in this
  engine should clear the same bar: prove it's structural, not case-by-case, before implementing.
