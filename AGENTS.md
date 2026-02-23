# AGENTS.md

## Learned User Preferences

- Do not use conversational filler ("Sure", "Let me think", "Here is the code"). Output only the result.
- Provide full, copy-pasteable code blocks — no diffs, no `// ... existing code` placeholders — unless explicitly asked.
- Keep comments to a minimum; only explain non-obvious "why", never narrate "what".
- Proactively fix missing imports, syntax errors, and lint issues before presenting code.
- When asked to fix or review, apply all changes in one shot rather than listing them and waiting for approval.
- When the user says "yes" to a list of suggestions, apply all of them immediately without re-confirming.
- Prefer simple, direct solutions over clever/over-engineered ones.
- When the user corrects an approach, adopt the correction immediately without debating alternatives.
- Always run `npm run lint:changed:fix` after making changes to auto-fix linting/formatting issues, then verify correctness before reporting done.
- Revert test-only side effects (e.g., auto-fixed files during lint testing) so only infrastructure changes remain.
- When creating plans, ask clarifying scope questions (e.g., full replacement vs. dual mode) before proceeding.
- Do not make changes outside the scope of the current PR/task unless explicitly asked. Flag out-of-scope issues for separate work.
- When user asks for a PR description, generate a temporary `PR_DESCRIPTION.md` at the repo root following the template in `.github/pull_request_template.md`.

## Project Overview

This is **ng-clarity** — the [Clarity Design System](https://angular.clarity.design) Angular component library monorepo. It contains:

| Project       | Path               | Published Package | Description                           |
| ------------- | ------------------ | ----------------- | ------------------------------------- |
| `clr-angular` | `projects/angular` | `@clr/angular`    | Angular components + SCSS styles      |
| `clr-addons`  | `projects/addons`  | `@clr/addons`     | Community/enterprise addon components |
| `clr-ui`      | `projects/ui`      | `@clr/ui`         | Standalone compiled CSS               |
| `clr-demo`    | `projects/demo`    | (not published)   | Demo app for manual testing           |

## Tech Stack & Versions

- **Angular 21+** with standalone components and modern control flow (`@if`, `@for`, `@switch`).
- **Node.js >=24** (enforced by `engines` in `package.json`).
- **Storybook 10** for component stories (CSF 3.0 format).
- **Playwright** for visual regression testing.
- **Karma** (`@angular/build:karma`) for unit tests — not Jest.

## Key Commands

| Task                     | Command                                                    |
| ------------------------ | ---------------------------------------------------------- |
| Full CI build            | `npm run build:ci`                                         |
| Build Angular library    | `npm run _build:angular` (or `npx ng build clr-angular`)   |
| Build demo app           | `npm run _build:demo`                                      |
| Run all tests            | `npm run test`                                             |
| Run Angular tests only   | `npm run _test:angular`                                    |
| Filter unit tests        | `npx ng test clr-angular --include="**/path/**/*.spec.ts"` |
| Watch tests              | `npm run test:watch`                                       |
| Storybook dev server     | `npm start`                                                |
| Demo app dev server      | `npm run start:demo`                                       |
| Full lint                | `npm run lint`                                             |
| Lint changed files only  | `npm run lint:changed`                                     |
| Auto-fix lint            | `npm run lint:fix` or `npm run lint:changed:fix`           |
| Check public API         | `npm run public-api:check`                                 |
| Update public API golden | `npm run public-api:update`                                |
| Clean build artifacts    | `npm run clean`                                            |

## Angular Library Structure

Each component module in `projects/angular/` follows this file layout:

```
component-name/
├── component-name.ts               # Component/directive class
├── component-name.html             # Template (if not inline)
├── component-name.spec.ts          # Unit tests
├── _component-name.clarity.scss    # Styles mixin, wrapped in @include exports('...')
├── _properties.component-name.scss # CSS custom properties (token-based theming)
├── _variables.component-name.scss  # SCSS variables mapping to CSS custom properties
├── index.ts                        # Public API barrel exports
├── ng-package.json                 # Secondary entry point config
├── STYLES.md                       # CSS custom properties + classes documentation
├── component-name.api.md           # Auto-generated API surface report
├── providers/                      # Services (if multiple)
├── models/                         # Model classes (if multiple)
├── enums/                          # Enums (if multiple)
└── chocolate/                      # Willy Wonka / Oompa Loompa cross-component pattern
```

### SCSS Conventions

- Styles mixin file: `_component.clarity.scss` — always wrapped in `@include mixins.exports('component.clarity') { ... }`.
- Properties file: `_properties.component.scss` — defines CSS custom properties using design tokens, wrapped in `@include mixins.exports('component.properties')`.
- Variables file: `_variables.component.scss` — maps SCSS `$clr-*` variables to `var(--clr-*, fallback)` with `!default`.
- Use `@if`/`@else` control flow blocks, not the Sass `if()` function (IDE language servers don't support the modern `if(sass(...))` syntax).
- Only use `rem` and `%` sizes; the only exception is `1px` borders.
- Do not hardcode colors — use SCSS variables from the token system.
- Keep CSS selectors flat — try not to exceed 2 levels (`.parent .child`).
- Style components via CSS class names, not element tag selectors. Use `host: { '[class.clr-component]': 'true' }` and target `.clr-component` in SCSS.

### TypeScript Conventions

- Public API classes are prefixed with `Clr` (e.g., `ClrAccordion`, `ClrStepperPanel`).
- Internal services are suffixed with `Service` but not prefixed. Exported services get the `Clr` prefix.
- No `Component`/`Directive` suffix on class names — allows switching between component/directive without breaking changes.
- Use `@if`/`@for`/`@switch` Angular control flow syntax, not `*ngIf`/`*ngFor`/`[ngSwitch]` structural directives.
- Private properties are NOT prefixed with `_` unless hidden behind a getter/setter of the same name.
- Host bindings that are always true go in `host: {}` metadata. Dynamic bindings use `@HostBinding`.
- Event handler methods describe **what** they do, not **when** — use `toggleSelection()` not `onClick()`.
- Buttons in templates must have `type="button"` to prevent implicit form submission.

### License Headers

Every new file must include the Broadcom copyright header. Two formats:

**JS/TS/SCSS** (validated by `eslint-plugin-license-header`):

```
/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
```

**HTML** (validated by custom `html-license-header` ESLint rule with `@html-eslint/parser`):

```
<!--
  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
  ~ The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
  ~ This software is released under MIT license.
  ~ The full license information can be found in LICENSE in the root directory of this project.
  -->
```

## Storybook

- Stories live in `.storybook/stories/<component>/`.
- Story format: CSF 3.0 (`StoryObj` / `StoryFn`).
- Shared helpers in `.storybook/helpers/common.ts` (`CommonModules`, `createArray`).
- Theme helper in `.storybook/helpers/theme.helper.ts`.
- Storybook globals (`theme`, `density`) are read from query params by the preview decorator.

## Visual Regression Testing (VRT)

- Playwright config: `playwright.config.ts`.
- Test spec: `tests/visual-snapshots.spec.ts`.
- Screenshots stored in `tests/snapshots/{browser}/{component}/{story-name}-{theme}-{density}.png`.
- CI matrix: `browser` (chromium/firefox) × `theme` (light/dark) × `density` (default/compact).
- Environment variables: `CLARITY_VRT_BROWSER`, `CLARITY_VRT_THEME`, `CLARITY_VRT_DENSITY`.

## Public API Management

- The `scripts/api-extractor.js` script validates public API surfaces for `@clr/angular` and `@clr/addons`.
- Golden files: `*.api.md` in each module directory (e.g., `projects/angular/accordion/accordion.api.md`).
- After any public API change: `npm run build` then `npm run public-api:update`.
- `ae-forgotten-export` warnings in `.api.md` files are common for internal types used in public signatures. Only re-export if the symbol is genuinely needed by consumers; avoid re-exports that create TS2308 conflicts in the main entry point.

## Commits & Pull Requests

### Commit Format

Follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(scope): <description>

[optional body]

[BREAKING CHANGE: description]

Signed-off-by: Name <email>
```

- **Types**: `feat`, `fix`, `chore`.
- **Scopes**: match component names — `accordion`, `stepper`, `datagrid`, `modal`, `wizard`, `dropdown`, `form`, `tabs`, etc. Full list in `docs/CONTRIBUTING_DEVELOPMENT.md`.
- Semantic-release (`.releaserc.base.js`) parses `BREAKING CHANGE` / `BREAKING CHANGES` in commit body to trigger major releases.

### PR Description

Follow `.github/pull_request_template.md`. For breaking changes, include:

1. A migration table (old symbol → new symbol → new entry point).
2. A `BREAKING CHANGE:` block in "Other information" that semantic-release will parse from the squash-merge commit.

### CI Pipeline

PRs automatically trigger the `build` workflow which verifies: lint → build → test → public API check. Manual `preview` and `release` workflows exist for staging and publishing.

### Commit Hooks

- `pre-commit`: Lint-staged runs ESLint on `*.{js,json,ts,html}`, Stylelint on `*.{css,scss,sass}`, Prettier on all files (`.lintstagedrc.js`).
- `commit-msg`: Validates conventional commit format.

## Architecture Patterns

- **Chocolate Factory (Willy Wonka / Oompa Loompa)**: Cross-component change detection pattern used by accordion, stepper, and others. A `WillyWonka` directive on the parent emits changes; `OompaLoompa` directives on children trigger `ChangeDetectorRef.markForCheck()`.
- **CollapsiblePanel base**: `CollapsiblePanel` (abstract directive in `projects/angular/collapsible-panel/`) is the shared agnostic base for both `ClrAccordionPanel` and `ClrStepperPanel`. Stepper-specific logic (status tracking, box-shadows) lives only in the stepper module.
- **IfExpandService**: Used for lazy content rendering in accordion/stepper panels. The `*clrIfExpanded` directive structurally adds/removes DOM — component state inside it is destroyed on collapse.
- **Secondary entry points**: Each module in `projects/angular/` is a separate secondary entry point (e.g., `@clr/angular/accordion`, `@clr/angular/stepper`, `@clr/angular/collapsible-panel`, `@clr/angular/utils`).

## Workspace Quirks

- `npm install` may fail due to engine constraints or SSL issues; add dependencies directly to `package.json` when install fails and note that the user needs to run `npm install` separately.
- The `tsconfig.json` has `typeCheckHostBindings: false` as a workaround for pre-existing host binding type issues — do not remove without fixing all violations first.
- Custom ESLint rules live in `eslint-rules/` and are registered as the `ng-clarity-eslint-rules` plugin.
