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
  AGENTS.md                                       short pointer to the skill
  skills/clarity-angular/SKILL.md                 rules for all Clarity UI, plus an index of the guides
  skills/clarity-angular/references/<guide>.md    detailed guide for one component
node_modules/@clr/addons/ai/
  AGENTS.md
  skills/clarity-addons/SKILL.md
  skills/clarity-addons/references/<guide>.md
```

- **One skill per package.** Agents keep only each skill's name and description in context, so two skills
  cost a few lines on every request. The rules and the guide index load when a task involves Clarity.
- **Component guides** are read only when a task needs that component. Each covers one component: which
  mode to pick, working examples, and common mistakes.
- **AGENTS.md** is a few lines that tell agents without skill support where to find the skill.

## Set up your project

### Any agent that can read local files

Add the `AGENTS.md` sections for the packages you use to the `AGENTS.md` file at the root of your project.
Copy them from `node_modules/@clr/*/ai/AGENTS.md`, or download them below. They point the agent to the skill
in `node_modules`, which always matches the installed version, so there is nothing to copy again after an
update.

### Agents with native skills

To have the agent load the skill on its own, copy the skill folders into your agent's project skills folder,
as its documentation describes. The skill locations that these agents document do not include `node_modules`.

```bash
cp -r node_modules/@clr/angular/ai/skills/clarity-angular <your-agent-skills-folder>/
cp -r node_modules/@clr/addons/ai/skills/clarity-addons <your-agent-skills-folder>/
```

Repeat the copy after you update Clarity, so the skill matches the new version.

| Agent          | Project instructions                                    | Skills                                                                                          |
| -------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Claude Code    | Reads `AGENTS.md`, or imports it from `CLAUDE.md`       | [Claude Code skills](https://code.claude.com/docs/en/skills)                                    |
| Codex          | Reads `AGENTS.md`                                       | [Codex skills](https://learn.chatgpt.com/docs/build-skills)                                     |
| Cursor         | Reads `AGENTS.md`                                       | [Cursor skills](https://cursor.com/docs/skills)                                                 |
| GitHub Copilot | Reads `AGENTS.md`, or `.github/copilot-instructions.md` | [Copilot customization](https://docs.github.com/en/copilot/reference/customization-cheat-sheet) |

Skill support differs between agents, and between the surfaces of one agent, so check your agent's
documentation.

## AGENTS.md and SKILL.md

<!-- ai:agents -->

## Component guides

### @clr/angular

<!-- ai:guides:angular -->

### @clr/addons

<!-- ai:guides:addons -->

Each component page also shows its guide in the **AI** tab.

## For agents that read the web

- [llms.txt](/llms.txt) lists all files on this page.
- [llms-full.txt](/llms-full.txt) contains all of them in one file.

The website always shows the latest release. For older versions, use the files in `node_modules`.
