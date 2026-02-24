---
name: create-pr-description
description: Generate a PR description following the project template. Use when the user asks for a PR description, PR summary, or to create PR_DESCRIPTION.md.
---

# Create PR Description

## Inputs

Before starting, resolve these inputs. Use values from the user's message first, then auto-detect, then ask.

| Input           | Auto-detect                                                                                                                                                 | Fallback                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Base branch** | —                                                                                                                                                           | Ask using AskQuestion with options: `next`, `main`, `other`                 |
| **Jira ticket** | Extract from branch name: patterns like `cde_234`, `cde-2135`, `CDE-1234` (case-insensitive, `_` or `-` separator). Convert to uppercase `CDE-NNNN` format. | If not found in branch name, ask: "What's the Jira ticket number? (or N/A)" |

Run `git branch --show-current` to get the current branch name for Jira extraction.

## Workflow

1. **Gather branch information**
   - Run these in parallel:
     ```
     git branch --show-current
     git log --oneline <base>..HEAD
     git diff <base>...HEAD --stat
     git diff <base>...HEAD
     ```
   - Identify the PR type from the changes (bugfix, feature, refactoring, etc.).

2. **Detect breaking changes**
   - Scan for removed/renamed public API symbols: exported classes, inputs, outputs, selectors.
   - Check if any `*.api.md` golden files were modified.
   - Check commit messages for `BREAKING CHANGE:` blocks.

3. **Generate the PR description**

   Use this template (from `.github/pull_request_template.md`):

   ```markdown
   ## PR Checklist

   - [x/] Tests for the changes have been added (for bug fixes / features)
   - [x/] Docs have been added / updated (for bug fixes / features)
   - [ ] If applicable, have a visual design approval

   ## PR Type

   - [ ] Bugfix
   - [ ] Feature
   - [ ] Code style update (formatting, local variables)
   - [ ] Refactoring (no functional changes, no api changes)
   - [ ] Build related changes
   - [ ] CI related changes
   - [ ] Documentation content changes
   - [ ] Other... Please describe:

   ## What is the current behavior?

   <describe current behavior or link to issue>

   Issue Number: <Jira ticket or N/A>

   ## What is the new behavior?

   <describe new behavior with specifics>

   ## Does this PR introduce a breaking change?

   - [ ] Yes / No

   ## Other information

   <migration guidance, BREAKING CHANGE block if applicable>
   ```

   **Fill in rules:**
   - Check exactly one PR Type box based on the changes.
   - Check the checklist items that are satisfied (use `[x]`), leave unchecked ones as `[ ]`.
   - "Current behavior" should describe what exists on the base branch.
   - "New behavior" should be specific: list new APIs, changed behavior, removed code.
   - "Issue Number" — use the resolved Jira ticket (e.g., `CDE-2135`). If none, use `N/A`.
   - For breaking changes:
     - Check "Yes" under breaking change.
     - Add a migration table in "Other information":
       ```
       | Old | New | Entry Point |
       |-----|-----|-------------|
       | `ClrOldThing` | `ClrNewThing` | `@clr/angular/module` |
       ```
     - Add a `BREAKING CHANGE:` block that semantic-release will parse from the squash-merge commit:
       ```
       BREAKING CHANGE: <description of what changed and how to migrate>
       ```

4. **Output**
   - Print the full PR description as a markdown code block so the user can copy-paste it directly into the PR.
   - Do NOT create a file. Output only to the chat.
