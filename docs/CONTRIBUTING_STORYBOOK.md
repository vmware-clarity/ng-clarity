# Contributing Storybook stories

Storybook is the working surface for every Clarity component: it is where a component is demonstrated,
where its API table is rendered, and where our visual regression tests (VRT) get their input. Nothing in
`.storybook/` is a scratch pad. Every story you export is built into `dist/docs`, rendered by Playwright in
eight browser/theme/density combinations, and committed to this repository as PNG baselines that CI will
compare against on every future pull request.

Treat a story file as production code, and follow this guide when you write one. The rest of the
contribution process — forking, signing, commit messages — is in
[Contribution process for developers](CONTRIBUTING_DEVELOPMENT.md).

## Where stories live

All stories live under `.storybook/stories/`. `.storybook/main.js` picks up `./**/*.stories.ts` and
`./**/*.mdx` from that configuration directory, so a story is registered by being placed there — there is no
index to update.

The directory structure **is** the sidebar. There are four roots plus the `Home` page:

```
.storybook/stories/
├── home.mdx                      # Home
├── auto-docs.mdx                 # the shared docs page template (not a story)
├── foundations/                  # Foundations — styles and primitives, not components
│   ├── typography/
│   ├── spacing/
│   └── icons/
├── components/                   # Components — one directory per public component
│   ├── accordion/  alert/  badge/  button/  card/  collapsible-panel/  label/  link/
│   ├── list/  progress-bar/  signpost/  spinner/  timeline/  tooltip/
│   ├── data/                     # datagrid, stack-view, table, tree
│   ├── forms/                    # checkbox-toggle, combobox, datalist, datepicker, file-input,
│   │                             # form-bindings, input, radio, range, select
│   ├── navigation/               # breadcrumbs, header, tabs, vertical-nav
│   ├── overlays/                 # dropdown, modal, popover, side-panel
│   └── flows/                    # login, stepper, wizard
├── addons/                       # Addons — one directory per addon from @clr/addons
│   └── <addon-name>/
└── patterns/                     # Patterns — genuine cross-component combinations
    ├── application-layout/
    ├── datagrid-in-modal/
    ├── nested-detail/
    ├── nested-popovers/
    └── dropdown-combinations/
```

### `Components/` or `Patterns/`?

Ask one question: **does this story demonstrate one component's own states, or two components interacting?**

- A story about a single component — its inputs, its variants, its empty/disabled/error states, its
  responsive behaviour, one component nested inside itself — belongs under `components/<that-component>/`,
  no matter how elaborate the template is.
- A story only belongs under `patterns/` when the thing being demonstrated **is** the combination: a datagrid
  detail pane opened inside a modal, a popover opened from inside another popover, a dropdown item that opens
  a modal, the full application layout. Remove one of the two components and the story loses its point.

If you are unsure, it is a component story. `Patterns/` is deliberately small; it is not a home for stories
that are merely complicated.

### File naming

- **The directory's main file:** name it after the directory — `components/badge/badge.stories.ts`,
  `components/data/datagrid/datagrid.stories.ts`. That makes it the directory's primary file, which takes the
  directory's own title (see [Titles are derived, never typed](#titles-are-derived-never-typed)).
- **Every other file:** name it after the _variant_ it covers. Prefixing it with the directory name is
  optional: the `<directory>-` prefix is stripped from the title, so `datagrid-detail.stories.ts` and
  `detail.stories.ts` both produce `Components/Data/Datagrid/Detail`. Follow whichever the directory already
  uses.
- **Story component:** a `@Component` used by a story lives beside it in a file with the same base name and
  the `.storybook.component.ts` suffix — `badge.stories.ts` → `badge.storybook.component.ts`.
- **Supporting data and models:** `<name>.data.ts` and `<name>.model.ts`. These are not components; do not
  give them the `.storybook.component.ts` suffix.

## The canonical story file

This is the shape every story file converges on. Copy it as a starting point.

```ts
/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAccordion, ClrAccordionModule, ClrAccordionPanel } from '@clr/angular';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

import { AccordionStorybookComponent } from './accordion.storybook.component';

/**
 * Base the args type on the class the args are actually bound to. Here that is the story
 * wrapper, because Clarity aliases its inputs: `ClrAccordion` declares
 * `@Input('clrAccordionMultiPanel') multiPanel`, so `clrAccordionMultiPanel` is not a property
 * of `ClrAccordion` and `ClrAccordion & { ... }` would reject every `args` entry as an excess
 * property. Where a component's property name equals its alias -- `ClrSpinner` declares
 * `@Input('clrInline') set clrInline` -- `ClrX & { ...story-only props... }` is correct.
 */
type AccordionArgs = AccordionStorybookComponent;

const meta: Meta<AccordionArgs> = {
  title: 'Components/Accordion',
  component: ClrAccordion,
  subcomponents: [ClrAccordionPanel],
  decorators: [moduleMetadata({ imports: [...CommonModules, ClrAccordionModule, AccordionStorybookComponent] })],
  argTypes: {
    ...hideControls('openIndices'),
    panelCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    clrAccordionMultiPanel: false,
    openIndices: [],
    panelCount: 4,
    title: 'Title',
    content: 'Hello World!',
  },
  render: args => ({
    props: args,
    template: `<storybook-accordion ${argsToTemplate(args)}></storybook-accordion>`,
  }),
};

export default meta;

type Story = StoryObj<AccordionArgs>;

export const Default: Story = {};

export const FirstPanelOpened: Story = {
  args: { openIndices: [true, false, false, false] },
};
```

Part by part:

- **The license header** is mandatory on every `.ts` and `.js` file in the repository. `license-header/header`
  is an `error`; `npx eslint --fix` inserts it.
- **`title`** is the one line in this template you never write by hand. It is derived from the file's path,
  and `npx eslint --fix` inserts and corrects it — see
  [Titles are derived, never typed](#titles-are-derived-never-typed).
- **`type AccordionArgs`** is the single declaration of what this file's stories can be configured with. It is
  the component class intersected with the story-only props the template needs. Writing it out is what makes
  every `args: { … }` below type-checked: a typo in an arg name becomes a compile error instead of a silently
  ignored property.
- **`Meta<AccordionArgs>`**, assigned to a `const meta` and then `export default meta`. Never
  `export default { … }` — an anonymous object literal is inferred as `Meta<unknown>`, which switches off arg
  checking for the whole file.
- **`component`** drives the autodocs `<Controls />` table. `.storybook/preview.js` feeds compodoc output
  (`documentation.json`) into Storybook, so the input descriptions and types in that table come from the
  doc comments on the real component source — you do not need to restate them in `argTypes`. Use
  `subcomponents` for the satellites (panels, columns, options) that belong to the same entry.
- **One `render`, in `meta`.** Every story in the file then differs only by `args`, which is what makes the
  stories readable as a matrix of states instead of a pile of near-identical templates. `argsToTemplate(args)`
  expands the args into template bindings, so the template does not need editing when an arg is added.
- **`hideControls(...)`** hides story-only args from the controls panel and the docs table. See
  [Args vs. story-only props](#args-vs-story-only-props).
- **`type Story = StoryObj<AccordionArgs>`**, declared once, and every export annotated `: Story`. Bare
  `StoryObj` is the untyped form and is banned for the same reason as an untyped meta.
- **Story export names** are `PascalCase` and describe the _state_, not the component: `Disabled`, not
  `DisabledAccordion`. The first export is what autodocs renders as the primary example, so make it the
  plain default case.

### The rules, in one list

- **R1** — Meta is `const meta: Meta<TArgs> = {…}; export default meta;`. Never `export default {`.
- **R2** — `type Story = StoryObj<TArgs>;` declared once per file; every story export annotated `: Story`.
- **R3** — Exactly one `render` per file, in `meta`. A story-level `render` requires a
  `// render-override: <reason>` comment on the line above.
- **R4** — `StoryFn` is banned. No `const XTemplate: StoryFn = …`.
- **R5** — No `@Component` inside a `.stories.ts`. Story components live in `*.storybook.component.ts`.
- **R6** — Story-only args are hidden with `hideControls(...)`, never with a hand-written
  `{ control: { disable: true }, table: { disable: true } }` block.
- **R7** — `title` equals the title derived from the file path. You do not type it; `eslint --fix` writes it.
- **R8** — No inline `<style>` blocks in story templates.
- **R9** — Helper imports use the `@storybook-helpers/*` alias, never `../../helpers/*`. `@storybook-helpers/*`
  classifies as an **external** import, so it belongs in the first import group alongside `@clr/angular` and
  `@storybook/angular` — not in the relative group below the blank line. Within that group, paths sort
  alphabetically and named members sort alphabetically too, so `{ argsToTemplate, type Meta, moduleMetadata, type StoryObj }`
  is the correct member order (`Meta` before `moduleMetadata`). `import/order` and `sort-imports` are both
  `error`; run `npx eslint --fix` and let it place them rather than ordering by hand.
- **R10** — Story export names are `PascalCase` and name the state.
- **R11** — One component per file's `component:` field. A file with no `component:` should carry a
  `parameters.docs.description.component` string instead, so the docs page is not blank. Write one when you
  author a new story file. Do **not** retrofit descriptions onto the 28 existing files that lack one as part of
  an unrelated refactor: that is documentation work needing an author who knows the component, not a mechanical
  conversion, and it is tracked separately.

### The four mistakes worth calling out

**Untyped meta and bare `StoryObj`**

❌

```ts
export default {
  title: 'Badge/Badge',
  component: BadgeStorybookComponent,
};

export const Initial: StoryObj = {};
```

✅

```ts
type BadgeArgs = BadgeStorybookComponent & { badgeTypes: string[] };

const meta: Meta<BadgeArgs> = {
  component: BadgeStorybookComponent,
};

export default meta;

type Story = StoryObj<BadgeArgs>;

export const Initial: Story = {};
```

**A template per story**

❌

```ts
const DetailTemplate: StoryFn = args => ({ props: args, template: `<clr-datagrid>…</clr-datagrid>` });

export const Default: StoryObj = { render: DetailTemplate };
export const Expandable: StoryObj = { render: DetailTemplate, args: { expandable: true } };
```

✅

```ts
const meta: Meta<DetailArgs> = {
  render: args => ({ props: args, template: `<clr-datagrid>…</clr-datagrid>` }),
};

export const Default: Story = {};
export const Expandable: Story = { args: { expandable: true } };
```

If a single story genuinely needs a different template — a different host element, another component wrapped
around it — override it and say why:

```ts
export const InModal: Story = {
  // render-override: this story places the datagrid inside a modal, which the meta template cannot express
  render: args => ({ props: args, template: `<clr-modal [clrModalOpen]="true">…</clr-modal>` }),
};
```

The comment must sit on the line directly above the `render` property, **inside** the story object — not
above the `export const`. The lint rule resolves it with `getCommentsBefore(renderProperty)` and requires
`comment.loc.end.line === render.loc.start.line - 1`, so a comment placed above the export is not attached
to the property and the rule still reports.

Do not instead grow the meta template into a mega-template with `*ngIf` branches for every story. That changes
the DOM of stories that were previously fine, and therefore changes their snapshots.

**Hand-written hidden controls**

❌

```ts
argTypes: {
  openIndices: { control: { disable: true }, table: { disable: true } },
  createArray: { control: { disable: true }, table: { disable: true } },
},
```

✅

```ts
argTypes: {
  ...hideControls('openIndices', 'createArray'),
},
```

**Inline `<style>` in a template**

❌

```ts
template: `
  <style>
    .highlight {
      border: 1px solid var(--cds-alias-status-danger) !important;
    }
  </style>
  <clr-datagrid>…</clr-datagrid>
`,
```

✅

```ts
decorators: [withStyles(HIGHLIGHT_STYLES)],
// …
template: `<clr-datagrid>…</clr-datagrid>`,
```

`withStyles(css)` injects the same unencapsulated CSS as the inline block did, so selector matching and
therefore snapshots are unchanged — but the CSS is now shared instead of copy-pasted into a dozen templates.
Where the styles belong to one story component, put them in that component's `styles:` instead. Note that
component `styles:` are view-encapsulated: they will not reach content projected into a Clarity component, so
they are not a drop-in replacement for an inline `<style>` block that was styling projected markup.

## Titles are derived, never typed

**Do not invent a `title:`.** It is computed from the file's path:

```
directory title = the path segments of dirname(file), relative to .storybook/stories/,
                  each segment Title-Cased from kebab-case, joined with '/'

title = directory title                          if the file is the directory's primary file
      = directory title + '/' + Title-Cased leaf  otherwise
```

A file is the directory's **primary** file when its base name equals the directory name. Every other file adds
its own leaf: its base name, with a redundant `<directory>-` prefix stripped. Title-Casing splits on `-` and
capitalises each word, except `and, or, in, on, of, with, to, a, an, the`, which stay lowercase unless they are
the first word. So:

- `components/badge/badge.stories.ts` → `Components/Badge` (named after its directory)
- `components/accordion/accordion-panel.stories.ts` → `Components/Accordion/Panel` (prefix stripped)
- `foundations/spacing/gaps.stories.ts` → `Foundations/Spacing/Gaps` (no primary file in that directory)

A file's title depends only on its own path, never on its siblings, so adding, removing or renaming one story
file never retitles another.

Every story file gets its own title. That matters: two files sharing a title would share one story-id
namespace, and Storybook refuses to index a duplicate story id, so the build would fail. The rule reports two
files resolving to the same title before Storybook gets that far. Splitting a story file into two therefore
adds a sidebar entry; it is not a sidebar-neutral change.

When Title-Casing genuinely cannot produce the right label, the exception goes in
`eslint-rules/storybook-title-overrides.js`, which is the _single_ place a non-derivable label may be declared.
It holds one entry today: `checkbox-toggle` reads `Checkbox or Toggle`. Do not work around a bad title by
hand-editing `title:`; the lint rule will just rewrite it.

In practice: write the file, run `npx eslint --fix <your file>`, and the correct `title:` appears. If it
appears wrong, the file is in the wrong directory.

Sidebar ordering is alphabetical below the four roots, which are ordered explicitly in `.storybook/preview.js`
(`parameters.options.storySort`). Nothing else orders stories, so do not add ordering parameters to a story
file.

## Args vs. story-only props

Storybook makes no distinction between the two, but the docs page does, and readers do.

- A **component arg** is a real `@Input()` on the component named in `component:`. It gets a control and a row
  in the `<Controls />` table, with its description and type supplied by compodoc from the source. Leave it
  visible — that table _is_ the component's API documentation.
- A **story-only prop** exists to make the demo work: an array of rows, a count of panels to render, a flag
  that swaps the demo content, a form instance. It is not part of the component's API. Showing it in the
  `<Controls />` table tells the reader that Clarity has an input it does not have.

Hide the second kind:

```ts
import { hideControls } from '@storybook-helpers/arg-types';

argTypes: {
  ...hideControls('elements', 'openIndices', 'detailContentType'),
},
```

Use `hideFromDocs(...)` in the rarer case where you want the knob to stay usable in the controls panel but
want it out of the documented API table.

Hand-writing `{ control: { disable: true }, table: { disable: true } }` is banned for three reasons: it is
four lines of noise per arg in a file that may hide a dozen; it is trivially got half-right (disabling the
control but leaving the row in the table, or the reverse); and having the intent expressed as a named helper
means a future change to how we hide args is one edit rather than several hundred.

Keep the comment convention already used in the repo when it aids reading:

```ts
args: {
  // inputs
  clrAccordionMultiPanel: false,
  // story helpers
  panelCount: 4,
},
```

If you find yourself hiding an arg because its control is unusable rather than because it is story-only,
prefer fixing the control: `{ control: { type: 'select' }, options: […] }` for enums,
`{ control: { type: 'number', min: 0, max: 100 } }` for bounded numbers.

## A new story, or a new arg?

This is the decision that determines how fast this repository stays.

- **A new arg is a knob.** It lets a reader explore a dimension interactively. It costs one row in the
  controls table and nothing else.
- **A new story is a snapshot.** It pins one specific state as something we will detect regressions in
  forever.

The VRT matrix in `.github/workflows/pr-build.yml` is `browser × theme × density` —
`chromium, firefox` × `light, dark` × `default, compact`. **Every story you export costs 8 PNGs.** (The
`shard` axis in the same matrix splits the work across runners; it does not multiply the snapshots.) Today
`tests/snapshots/` holds **6,368 PNGs, 894 MB**, checked into git.

So:

- Add a **story** when the state is worth guarding: a visual variant (outlined, compact, error), a layout
  edge case (long uninterrupted content, collapsed header), a state a user can reach that has broken before.
- Add an **arg** when you want to let people try something: a colour, a label, a count, a position. If the
  only reason to pin a specific value is "so the reader can see it", that is what the controls panel is for.
- Do **not** add a story that differs from an existing one only by a value a control already exposes.
- Do **not** add a story per enum value when the component renders them all in one story. Rendering the whole
  set in a single story (as the badge stories do) costs 8 PNGs instead of 8 × n.

If a story must exist for documentation but is not worth snapshotting — it is animated, it is
non-deterministic, it duplicates another story's pixels — exclude it in `tests/screenshot-options.ts`. Keys
there are derived from the story file's path, in two forms: `<group>` (the file's directory, applying to every
story in it) and `<group>/<file>--<story-name>` (one story):

```ts
'components/data/datagrid': { fullPageScreenshot: true },
'components/data/datagrid/datagrid-row--live-updating': { exclude: true },
```

A key can be read straight off a snapshot path and back again, since the snapshot lands at
`tests/snapshots/<browser>/<key>-<theme>-<density>.png`.

Be sparing: an excluded story is an undefended story.

## The `highlight` convention

`tests/visual-snapshots.spec.ts` opens every story with `args: 'highlight:false'` in the iframe URL. That
exists so a story can point at the part of itself that matters _for humans browsing Storybook_, without that
marker leaking into the snapshot baselines.

Use the shared helpers rather than re-deriving the convention:

```ts
import { withStyles } from '@storybook-helpers/decorators';
import { HIGHLIGHT_STYLES, highlightArgs, highlightArgTypes } from '@storybook-helpers/highlight';

const meta: Meta<RowArgs> = {
  decorators: [withStyles(HIGHLIGHT_STYLES)],
  argTypes: { ...highlightArgTypes },
  args: { ...highlightArgs },
};
```

```html
<clr-dg-row [ngClass]="{ highlight: highlight && index === 0 }">...</clr-dg-row>
```

Rules for using it:

- The arg must be named exactly `highlight` and default to `true`. The default is what a person sees; the
  screenshot gets `false`. Any other name will not be switched off, and the marker will be baked into 8 PNGs.
- Leave `highlight` as a visible control — being able to switch the outline off is the point of the arg for
  anyone reading the docs. Do not pass it to `hideControls(...)`, and do not declare an explicit
  `argType.type` for it: Storybook infers `boolean` from the default, and that inference is what turns the
  `highlight:false` string in the test URL into an actual `false`.
- Use it when the story is about one region of a larger surface — the row, the column, the detail pane inside
  a full datagrid — and a reader would otherwise have to guess where to look.
- Do not use it as decoration on a story whose whole point is already the whole rendered output.
- The URL parameter is sent to every story; only stories that declare a `highlight` arg respond to it, so
  there is nothing to add to a story that does not use the convention.

## Visual regression testing

The flow, end to end:

1. `PR Build` builds Storybook once and runs `npx playwright test --update-snapshots` across the full
   matrix. `tests/visual-snapshots.spec.ts` reads `dist/docs/index.json`, skips `--docs` entries and excluded
   stories, opens each story's `iframe.html` against a static server on port 8080 with the matrix theme and
   density as globals, and screenshots the `body` element (or the full page, per
   `tests/screenshot-options.ts`). Snapshot paths are derived from each story's `importPath` — its directory
   and file name — never from its `title`, so retitling a story does not orphan its baselines, and two
   stories can never quietly share a snapshot path (the spec throws if they would).
2. Each matrix job uploads its changes as a binary diff artifact.
3. `PR Visual Snapshot Update Bot` applies all of those diffs, then runs
   `scripts/delete-unused-screenshots.ts`, which deletes every PNG not listed in the
   `used-screenshot-paths-*.txt` files the spec wrote. Renaming or removing a story therefore prunes its
   orphaned baselines automatically.
4. If anything changed, the bot commits it, pushes it to `visual-snapshot-update/pr-<N>`, comments the commit
   SHA on your PR with a ready-made `git cherry-pick` command, and **fails the job**. A visual change is never
   applied silently.

**Never add, edit, rename, or delete a file under `tests/snapshots/` by hand.** CI owns that directory
entirely. A pull request that hand-touches a PNG will be rejected, and a hand-written baseline is worse than
no baseline: it asserts that whatever you generated locally, on your fonts and your GPU, is correct.

### Reading a snapshot diff on a PR

When the bot comments "This PR introduces visual changes":

1. Open the linked commit on GitHub. It renders each changed PNG with GitHub's image diff views (2-up,
   swipe, onion skin) — use swipe; at `threshold: 0.01` the differences are usually a few pixels.
2. Check the _shape_ of the change set first. Did only the stories you touched change? A change in an
   unrelated component's snapshots means your change was not as local as you thought.
3. Check that the change appears in all four theme/density variants when it should, and in only one when it
   should not. A change that shows up in `light-default` but not `dark-default` is usually a hardcoded
   colour.
4. If the change is intended, cherry-pick the commit as the comment instructs and push. If it is not, fix the
   code — do not cherry-pick.

New stories show up as brand-new PNGs in the same commit. That is expected; say so in the PR description and
say how many, so a reviewer can tell an intended addition from a runaway parameterisation.

### Running the VRT locally

You rarely need to, but when you do:

```shell
npm run _build:storybook
CLARITY_VRT_BROWSER=chromium CLARITY_VRT_THEME=light CLARITY_VRT_DENSITY=default npx playwright test --grep badge
```

All three environment variables are required — they select the matrix cell and are part of the snapshot path.
Run _without_ `--update-snapshots` to check your change against the committed baselines. If you update
snapshots locally to look at something, `git checkout -- tests/snapshots` before you commit. Your local
rendering will not match CI's pinned `ubuntu-24.04` image.

## `play` functions

A `play` function runs after the story renders and before the screenshot is taken.

**Use `play` only to reach a state that cannot be expressed declaratively through args**: opening an overlay,
advancing a wizard to a later page, focusing an element, triggering an async load. Example, from the wizard
stories:

```ts
export const StatusIndicators: Story = {
  args: { clrWizardPageHasError: true },
  play: async ({ canvasElement, userEvent }) => {
    // navigate to the last page
    const nextButton = canvasElement.querySelector<HTMLButtonElement>('clr-wizard-button[type="next"] button');
    await userEvent.click(nextButton);
    await userEvent.click(nextButton);
  },
};
```

**Do not use `play` for assertions.** A story is a fixture, not a test. Behavioural assertions belong in the
component's Karma spec under `projects/angular/`, where they run in the test suite, report failures usefully,
and do not cost 8 PNGs.

**A `play` function that runs before a screenshot must leave the UI deterministic.** This is the part that
bites: the screenshot is taken whenever `play` resolves, so anything still in flight at that moment — an
animation, a debounce, a pending HTTP-ish timeout, a focus ring that appears on the next frame — produces a
flaky baseline that will fail on somebody else's unrelated PR. Before adding one, check that:

- it settles into a single stable state, and does not leave a spinner, a transition, or a caret mid-flight
  (`animations: 'disabled'` and `caret: 'hide'` cover CSS animations and the text caret, nothing else);
- it does not depend on timing you cannot control — wait for an element via
  `waitForSelectors` in `tests/screenshot-options.ts` rather than sleeping;
- it is idempotent under the theme and density globals; the same `play` runs in all 8 matrix cells.

If you only need a hover, focus, or active _style_, do not write a `play` function: use
`storybook-addon-pseudo-states`, which is already registered in `.storybook/main.js` and forces those states
deterministically.

## Accessibility

`@storybook/addon-a11y` is enabled globally in `.storybook/main.js`, so every story is scanned by axe and the
results appear in the **Accessibility** panel. Today no story configures it — the addon is running with its
defaults everywhere.

The expectation for anything you add:

- **Open the Accessibility panel on your new story before you open the PR.** A component library's own
  examples failing an axe check is a bug report, whether it is in the component or in the demo markup around
  it.
- If the violation is in the **component**, fix the component, or file an issue and link it from the PR. Do
  not paper over it in the story.
- If the violation is in the **story's own demo scaffolding** — placeholder links with no destination, a
  contrived contrast in a swatch grid, a heading order that only makes sense in the demo — fix the
  scaffolding first. It is your markup and it is cheap to correct.
- Only when a violation is genuinely inherent to what the story demonstrates, disable that one rule on that
  one story, with a comment saying why:

  ```ts
  export const ColorTokens: Story = {
    parameters: {
      // The swatch grid deliberately shows low-contrast tokens next to their names.
      a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
    },
  };
  ```

  Scope the exception to the narrowest place it is true — one rule, one story. Never disable the addon for a
  whole component, and never disable it globally.

## Local workflow

### Prerequisites

This repository requires **Node.js >= 24** and **npm >= 11** (`package.json` `engines`); `.nvmrc` pins Node 24. Use it before installing:

```shell
nvm use
npm ci
```

On an older Node, `npm ci` fails with `EBADENGINE` before it installs anything. If you see that error, you are
on the wrong Node version — switch versions rather than passing `--force`.

### Commands

- `npm start` — cleans `dist` and serves Storybook at `http://localhost:6006`. This is the Storybook dev
  server, not the demo application; the demo is `npm run start:demo`.
- `npm run _build:storybook` — builds Storybook to `dist/docs`, including the `index.json` that the VRT suite
  enumerates. Run it before running Playwright locally, and whenever you want to confirm your story compiles
  the way CI will compile it.
- `npm run _lint:format-stories` — checks that inline templates inside `.stories.ts` are Prettier-formatted.
  Template literals are invisible to Prettier itself, so `scripts/format-story-templates.js` extracts every
  `template:` (and any `…Template` variable) and formats it with the Angular parser.
  `npm run _lint:format-stories:fix` rewrites them.
- `npm run _lint:code` (`eslint .`) and `npm run _lint:code:fix`. `npx eslint --fix <file>` is also what
  writes your `title:`.
- `npm run lint` runs all of the above plus Prettier and Stylelint; `npm run lint:changed:fix` does the same
  for your modified files only, which is much faster.

### What the tooling enforces

Story files are checked by, in addition to the repository-wide Prettier, Stylelint and license-header rules:

- `eslint-plugin-storybook`, at its recommended configuration;
- `storybook-typed-meta` (R1, R2), `storybook-single-render` (R3),
  `storybook-no-component-decorator` (R5), `storybook-no-inline-hidden-control` (R6, autofixable),
  `storybook-no-inline-style` (R8) and `storybook-title` (R7, autofixable), all from the repository's local
  `eslint-rules/` plugin;
- `no-restricted-imports`, which bans the `StoryFn` import (R4) and relative `../**/helpers/*` paths (R9).

The story rules are **errors**: every story file conforms, and a violation fails `npm run lint`.

If one of these rules fires on something you believe is correct, say so in the PR and leave the rule alone.
Do not add an inline `eslint-disable`, and do not downgrade a rule to make a build pass.

### Before you open a pull request

1. `npm run lint:changed:fix`, then `npm run lint:changed` cleanly.
2. `npm run _build:storybook` succeeds.
3. Your new stories look right in all four theme/density combinations (the toolbar has both switchers).
4. The Accessibility panel is clean, or the exception is scoped and justified.
5. You know how many new stories you added, and therefore how many new PNGs the bot will produce, and the PR
   description says so.
6. You have not touched `tests/snapshots/`.
