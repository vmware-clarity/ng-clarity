# Clarity contributor guide for AI agents

This file is for agents working on this repository. The guidance for apps that use Clarity ships in the
packages, in `projects/angular/ai/AGENTS.md` and `projects/addons/ai/AGENTS.md`.

## Project layout

| Folder             | Contents                                                |
| ------------------ | ------------------------------------------------------- |
| `projects/angular` | `@clr/angular`: Clarity Angular components              |
| `projects/addons`  | `@clr/addons`: addons for Clarity (`appfx-` components) |
| `projects/ui`      | `@clr/ui`: standalone Clarity CSS                       |
| `projects/demo`    | Demo Angular app (`clr-demo`)                           |
| `projects/website` | Clarity website (`clr-website`)                         |

## Commands

The scripts are defined in `package.json`.

- `npm run lint:changed`: lint, formatting, and style checks for new and modified files
- `npm test`: unit tests for `@clr/angular`, `@clr/addons`, the schematics, and tree shaking
- `npm start`: Storybook for `@clr/angular`
- `npm run start:demo`, `npm run start:website`: the demo app and the website
- `npm run public-api:check`: checks that the public API matches the `*.api.md` reports
- `npm run public-api:update`: rewrites the `*.api.md` reports after a public API change

## Conventions and commits

- Coding conventions: [docs/CODING_GUIDELINES.md](docs/CODING_GUIDELINES.md)
- Public API changes and commit message format: [docs/CONTRIBUTING_DEVELOPMENT.md](docs/CONTRIBUTING_DEVELOPMENT.md),
  sections "Public API Changes" and "Commits"

## Component documentation in code

These files live next to the component's source in `projects/<lib>/`.

- New components, in `@clr/angular` and `@clr/addons`: create a `STYLES.md` next to the component's source
  (for example `projects/angular/button/STYLES.md`) that lists its CSS classes and CSS custom properties.
  Follow the existing files:
  - A `# <Component>` heading.
  - A `## CSS Custom Properties` table with the columns `CSS Custom Property | Description`.
  - A `## CSS Classes` table with the columns `Class name | Description`. Keep this exact heading: the
    website adds its CSS-class warning after it.
- Changed components: when CSS classes or custom properties are added, renamed, or removed, update the
  component's `STYLES.md` in the same change.

## Website API documentation

The website's component API docs are written by hand. Nothing generates them from the code or the
`*.api.md` reports. When you add a component or change its public API, update its docs in the same change:

- Inputs and outputs: the API tab (`<app-doc-tab tab="api">`) of the component's page in
  `projects/website/src/app/documentation/demos/<component>/`, as an HTML table (for example
  `accordion/api-accordion.demo.html`) or an `apis` list in the demo's TypeScript (for example
  `datagrid/datagrid.demo.ts`).
- CSS classes and custom properties: show the component's `STYLES.md` on its API tab with
  `<app-style-docs styleDocsKey="<Component>">`. The key must match the `# <Component>` heading of the
  `STYLES.md`. `scripts/compile-style-docs.js` collects every `projects/**/STYLES.md` for the website.

Before finishing, confirm that every public input, output, and selector added or changed in the `*.api.md`
diff appears on the component's API tab, and that removed or renamed ones are gone.

## Maintainer skills

Read the skill when its task comes up:

- [.agents/skills/update-ai-skills/SKILL.md](.agents/skills/update-ai-skills/SKILL.md): keep the component `SKILL.md`
  files and `projects/*/ai/AGENTS.md` in sync with the public API and the design guidance. Use it when a `*.api.md`
  report changes.
- [.agents/skills/rebase-metropolis-font/SKILL.md](.agents/skills/rebase-metropolis-font/SKILL.md): rebase and
  customize the Metropolis font.
