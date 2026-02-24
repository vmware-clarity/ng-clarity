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
- When user asks for a PR description, print it as a copyable markdown block following the template in `.github/pull_request_template.md`. Do not create a file.
- After completing a task, review AGENTS.md and relevant `.cursor/rules/*.mdc` files, and update them with any meaningful, broadly useful learnings discovered during the work (new patterns, gotchas, conventions). Component-specific learnings go in the matching `.mdc` file; project-wide learnings go in AGENTS.md. Skip trivial or one-off details that wouldn't benefit future sessions.

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

| Task                     | Command                                                  |
| ------------------------ | -------------------------------------------------------- |
| Full CI build            | `npm run build:ci`                                       |
| Build Angular library    | `npm run _build:angular` (or `npx ng build clr-angular`) |
| Build demo app           | `npm run _build:demo`                                    |
| Run all tests            | `npm run test`                                           |
| Run Angular tests only   | `npm run _test:angular`                                  |
| Run Addons tests only    | `npm run _test:addons`                                   |
| Filter unit tests        | Use `fit()` / `fdescribe()` in spec files (see below)    |
| Watch tests              | `npm run test:watch`                                     |
| Storybook dev server     | `npm start`                                              |
| Demo app dev server      | `npm run start:demo`                                     |
| Full lint                | `npm run lint`                                           |
| Lint changed files only  | `npm run lint:changed`                                   |
| Auto-fix lint            | `npm run lint:fix` or `npm run lint:changed:fix`         |
| Check public API         | `npm run public-api:check`                               |
| Update public API golden | `npm run public-api:update`                              |
| Clean build artifacts    | `npm run clean`                                          |

### Focusing / Filtering Unit Tests

The `--include` flag does **not** work with the current `@angular/build:karma` builder. To run a subset of tests:

1. Change `it()` to `fit()` or `describe()` to `fdescribe()` in the spec file(s) you want to focus.
2. Run the normal test command: `npm run _test:angular` (or `_test:addons`).
3. **Always revert `fit`/`fdescribe` back to `it`/`describe` before committing.**

Do **not** modify `karma.conf.js` to add Jasmine `filter` — use `fit`/`fdescribe` instead.

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

- **Secondary entry points**: Each module in `projects/angular/` is a separate secondary entry point (e.g., `@clr/angular/accordion`, `@clr/angular/stepper`, `@clr/angular/collapsible-panel`, `@clr/angular/utils`).

> Component-specific architecture details (accordion/stepper, datagrid, etc.) live in `.cursor/rules/*.mdc` files scoped to their directories.

## Workspace Quirks

- `npm install` may fail due to engine constraints or SSL issues; add dependencies directly to `package.json` when install fails and note that the user needs to run `npm install` separately.
- The `tsconfig.json` has `typeCheckHostBindings: false` as a workaround for pre-existing host binding type issues — do not remove without fixing all violations first.
- Custom ESLint rules live in `eslint-rules/` and are registered as the `ng-clarity-eslint-rules` plugin.
