---
name: update-ai-skills
description: Keep the consumer AI files (component SKILL.md files and projects/*/ai/AGENTS.md) in sync with the public API and the Clarity design guidance. Use when a *.api.md report changed (after `npm run public-api:update`, or in a branch/PR that changes public API), when adding, renaming, removing, or deprecating a public input, output, selector, class, or module, when the Clarity design guidance (guidance.clarity.design / clarity-guidance repo) changed, or when asked to check or update the AI skills or AGENTS.md.
---

# Update AI skills after public API changes

The consumer AI files ship in the npm packages and on the website:

| File                                     | Role                                                                                   |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| `projects/<lib>/**/<component>/SKILL.md` | Detailed guide for one component (name prefix `clr-` for angular, `appfx-` for addons) |
| `projects/<lib>/ai/AGENTS.md`            | Short rules for all components of a package, plus an index of its skills               |

The public API reports (`projects/**/*.api.md`) are the source of truth for names. A skill must never use a name that is not in a report, and must not recommend a deprecated one.

The Clarity design guidance (CIPs, https://guidance.clarity.design/<id>, source in the [clarity-guidance](https://github.com/vmware-clarity/clarity-guidance) repo) is the source of truth for "which variant, when, where". It covers `@clr/angular` components only, not AppFX. Each `clr-` skill lists the CIPs it follows in `metadata.guidance` as `'<id>:<updated date>'`.

## 1. Find what changed and what is affected

From the repo root:

```bash
node .claude/skills/update-ai-skills/check-ai-skills.js --changed origin/main
```

The guidance check needs a local, up-to-date clone of clarity-guidance. It looks in `../clarity-guidance` next to this repo by default; pass `--guidance <dir>` otherwise. If it is missing, the check is skipped — ask the user for the path instead of guessing.

- **missing** — a name used in a skill no longer exists in any report (removed or renamed).
- **deprecated** — a name used in a skill is marked `@deprecated` (input aliases are resolved to their property).
- **guidance … updated** — a cited CIP changed after the date in `metadata.guidance`. Read the CIP's changelog and diff (`git -C ../clarity-guidance log -p -- <id>-*.md`).
- **guidance … no longer exists / does not exist / not listed** — a CIP was renumbered or removed, or a skill links to a CIP its metadata doesn't track.
- **API reports changed** — each changed report with the skill files that cover it. `(no skill covers this API yet)` means no skill needs editing for it; only consider whether the change is relevant to `AGENTS.md`.

Lines that warn against a name ("there is no `clrFoo`", "do not use `clrBar`") are skipped on purpose.

Then read the actual change for each affected report:

```bash
git diff origin/main -- projects/angular/data/data.api.md
```

## 2. Decide what to update

For each change in the report diff:

| API change                                         | Update                                                                                                                                                                                 |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Removed or renamed name                            | Replace it in every skill and `AGENTS.md` that uses it. If agents are likely to keep guessing the old name, add one line to the skill's rules: "there is no `oldName`; use `newName`". |
| Newly deprecated                                   | Stop recommending it. Add a "do not use `x` (deprecated)" line with the replacement.                                                                                                   |
| New user-facing input, output, selector, or module | Add it to the skill section it belongs to, with a short example if it changes how the component is used. Skip internal or rarely used additions.                                       |
| Changed type or default                            | Update examples and rules that depend on it (e.g. a default selection type).                                                                                                           |
| New component with no skill                        | Do not create a skill unless asked; mention it in the report.                                                                                                                          |

Update `AGENTS.md` only for rules that apply to every component in the package (imports, module style, OnPush, a11y, tokens), and keep its skills index in sync when a skill is added, renamed, or removed.

For each changed CIP:

- Bring the skill's design rules in line with it, keep the link to `https://guidance.clarity.design/<id>`, and set the date in `metadata.guidance` to the CIP's new `updated:` date. Update the date even when no text change was needed.
- Only take rules that change the code an agent writes (which class, component, or variant to use, ordering, a11y). Skip Figma-only and visual-only rules, and rules the CSS already applies.
- Translate design terms to code names, e.g. "flat button" → `btn-link`.
- If a CIP contradicts the shipped API (it recommends something deprecated or missing), keep the skill aligned with the API and report the conflict to the user.

## 3. Rules for edits

- Verify every name against the report before writing it. Do not rely on memory.
- Keep skills short and pattern-focused: when to use what, minimal examples, pitfalls. Do not paste API tables.
- Do not change a skill's `name` (it is its install folder and website URL) unless the user asks. Keep `metadata.docs` pointing at the component's website page.
- Examples use the app style from the skills: NgModule imports, `@for`/`@if`, `clr-icon` (the `cds-icon` alias is deprecated), `type="button"`, `aria-label` on icon-only buttons.
- Do not run `npm run public-api:update`, builds, or `eslint:fix`. If the reports look stale, ask the user to update them.

## 4. Verify

```bash
node .claude/skills/update-ai-skills/check-ai-skills.js
node scripts/copy-ai-files.js angular "$TEMP/ai-check/clr-angular"
node scripts/copy-ai-files.js addons "$TEMP/ai-check/clr-addons"
npx prettier --check <changed SKILL.md / AGENTS.md files>
```

The first command must report no problems. The copy commands validate names, prefixes, and duplicates the same way the package build does.

## 5. Report

List each changed file with one line per change, the API change that caused it, and anything left for the user (stale reports, components without a skill, changes you were unsure about). Do not commit.
