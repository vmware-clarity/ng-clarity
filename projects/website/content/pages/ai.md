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

- **AGENTS.md** is short. It holds rules that apply to all Clarity UI, plus an index of the skills.
  Installing the package does not make an agent load it. Whether and when it is loaded depends on your
  setup and the agent (see below).
- **SKILL.md** files are detailed and meant to be read only when a task needs them. Each covers one
  component: which mode to pick, working examples, and common mistakes. An agent can read them from
  `node_modules` by following the index, or load them as native skills if it supports that.

## Set up your project

### Any agent that can read local files

Add an instruction like this to your agent's project-instruction mechanism, or paste it into a prompt:

```text
This project uses Clarity. Before writing Clarity UI, read
node_modules/@clr/angular/ai/AGENTS.md (and node_modules/@clr/addons/ai/AGENTS.md if the project uses
@clr/addons), then read only the component guides in ai/skills/ that the task needs.
```

This works without native skill support. The files in `node_modules` always match the installed version.

### Agent-specific setup

The skill locations that these agents document do not include `node_modules`, so copy the files into your
project. If your agent is not listed, use the portable instruction above.

| Agent          | Project instructions                                    | Skills                                                                                          |
| -------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Claude Code    | Reads `AGENTS.md`, or imports it from `CLAUDE.md`       | [Claude Code skills](https://code.claude.com/docs/en/skills)                                    |
| Codex          | Reads `AGENTS.md`                                       | [Codex skills](https://learn.chatgpt.com/docs/build-skills)                                     |
| Cursor         | Reads `AGENTS.md`                                       | [Cursor skills](https://cursor.com/docs/skills)                                                 |
| GitHub Copilot | Reads `AGENTS.md`, or `.github/copilot-instructions.md` | [Copilot customization](https://docs.github.com/en/copilot/reference/customization-cheat-sheet) |

1. Add the `AGENTS.md` sections for the packages you use to the `AGENTS.md` file at the root of your
   project. Copy them from `node_modules/@clr/*/ai/AGENTS.md`, or download them below.
2. Copy the skill folders into your agent's project skills folder, as its documentation describes:

```bash
cp -r node_modules/@clr/angular/ai/skills/* <your-agent-skills-folder>/
cp -r node_modules/@clr/addons/ai/skills/* <your-agent-skills-folder>/
```

3. Repeat these steps after you update Clarity, so the files match the new version.

Skill support differs between agents, and between the surfaces of one agent, so check your agent's
documentation.

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
