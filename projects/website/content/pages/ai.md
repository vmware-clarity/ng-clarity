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

1. Add the `AGENTS.md` sections for the packages you use to the `AGENTS.md` file at the root of your
   project. Copy them from `node_modules/@clr/*/ai/AGENTS.md`, or download them below.
2. If you use Claude Code, also add a `CLAUDE.md` at the root that contains `@AGENTS.md`, and copy the
   skill folders into `.claude/skills/`:

```bash
mkdir -p .claude/skills
cp -r node_modules/@clr/angular/ai/skills/* .claude/skills/
cp -r node_modules/@clr/addons/ai/skills/* .claude/skills/
```

3. Repeat these steps after you update Clarity, so the files match the new version.

Agents without skill support still find the guides: the `AGENTS.md` index points them at the files in
`node_modules`.

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
