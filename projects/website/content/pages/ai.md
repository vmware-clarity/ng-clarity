---
title: AI Agents
---

# AI Agents

<p class="component-summary">
  Clarity ships guidance for AI coding agents, such as Claude Code, Codex, Cursor, and GitHub Copilot.
  It helps an agent use Clarity components the way they are designed: correct imports, real inputs, and
  accessible markup.
</p>

## What ships

Both packages include an `ai/` folder that matches the installed version:

```text
node_modules/@clr/angular/ai/
  AGENTS.md                       rules for all Clarity UI
  skills/<skill-name>/SKILL.md    detailed guide for one component
node_modules/@clr/addons/ai/
  AGENTS.md
  skills/<skill-name>/SKILL.md
```

- **AGENTS.md** is short and always loaded by the agent. It holds rules that apply to all Clarity UI,
  plus an index of the skills.
- **SKILL.md** files are detailed and loaded only when a task needs them. Each covers one component:
  which mode to pick, working examples, and common mistakes.

## Set up your project

When you add Clarity, choose an AI option at the prompt:

```bash
ng add @clr/angular
```

To set up or refresh the files later, for example after you update Clarity:

```bash
ng generate @clr/angular:ai-skills            # AGENTS.md only
ng generate @clr/angular:ai-skills --claude   # also Claude Code skills
```

The schematic:

- adds a section for `@clr/angular`, and for `@clr/addons` if it is installed, to the `AGENTS.md` at the
  root of your project. It only changes its own sections, so your own content stays as it is.
- with `--claude`, copies the skills to `.claude/skills/` and adds `@AGENTS.md` to `CLAUDE.md`.

Agents without skill support still find the guides: the `AGENTS.md` index points them at the files in
`node_modules`.

To set up by hand instead, add the `AGENTS.md` files below to your `AGENTS.md`, and for Claude
Code copy `node_modules/@clr/*/ai/skills/*` into `.claude/skills/`.

## AGENTS.md

<!-- ai:agents -->

## Skills

### @clr/angular

<!-- ai:skills:angular -->

### @clr/addons

<!-- ai:skills:addons -->

Each component page also shows its skill in the **AI** tab.

## For agents that read the web

- [llms.txt](/llms.txt) lists all files on this page.
- [llms-full.txt](/llms-full.txt) contains all of them in one file.

The website always shows the latest release. For older versions, use the files in `node_modules`.
