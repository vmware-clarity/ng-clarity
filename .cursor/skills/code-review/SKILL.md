---
name: code-review
description: Perform a strict code review of the current branch against a base branch, checking for architecture leaks, API regressions, DRY violations, and Clarity design compliance. Use when the user asks for a code review, branch diff review, or PR review.
---

# Code Review

## Inputs

Before starting, gather these inputs using AskQuestion. Use values from the user's message first; only ask for what's missing.

| Input            | Question                                             | Options                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Base branch**  | What is the base branch to compare against?          | `next`, `main`, Other (specify in chat)                                                                                                                                        |
| **PR context**   | Brief description of what this PR does and its goal? | Free text (specify in chat)                                                                                                                                                    |
| **Review focus** | Any specific areas you want extra attention on?      | Architecture / separation of concerns, Public API / breaking changes, Test coverage, Code quality / DRY, Performance / change detection, No specific focus — review everything |

The PR context helps the reviewer understand intent — without it, the review can only judge the code, not whether it achieves its goal.

## Workflow

1. **Determine scope**
   - Run `git log --oneline <base>..HEAD` to list all commits in scope.
   - Run `git diff <base>...HEAD --stat` to see affected files.
   - If the user provides a specific scope boundary (e.g., "only accordion and stepper"), restrict the review to those paths.

2. **Gather context**
   - Read the changed files (full content, not just diffs) to understand the new code in context.
   - Read the base branch versions of heavily modified files: `git show <base>:<path>`.
   - Check if any `.cursor/rules/*.mdc` files match the changed paths — read them for component-specific conventions.
   - If the user provides design spec URLs (e.g., clarity.design/documentation/...), fetch them for API/behavior reference.

3. **Review criteria**

   Apply these checks in order (weight the user's focus areas more heavily if specified):

   | Category                   | What to check                                                                                                                                        |
   | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Separation of concerns** | No leaked logic between components. Base abstractions must be agnostic of child implementations.                                                     |
   | **Public API compliance**  | No unintentional breaking changes. Inputs/outputs/selectors match design specs. Two-way binding patterns are correct.                                |
   | **TypeScript conventions** | `Clr` prefix on public classes, no `Component`/`Directive` suffix, correct host binding patterns, modern control flow (`@if`/`@for`). See AGENTS.md. |
   | **SCSS conventions**       | Token-based theming, flat selectors, `rem`/`%` units, proper mixin wrapping. See `.cursor/rules/scss.mdc`.                                           |
   | **DRY / efficiency**       | Duplicated code that should be shared. Unnecessary abstractions that add complexity without value.                                                   |
   | **Test coverage**          | Changed logic has corresponding spec updates. No `fit`/`fdescribe` left in committed code.                                                           |
   | **License headers**        | New files have the Broadcom copyright header (JS/TS/SCSS and HTML formats).                                                                          |
   | **Edge cases**             | Null/undefined handling, empty arrays, boundary conditions, change detection (OnPush).                                                               |

4. **Output format**

   Structure the review with these sections:

   ```
   ## Summary
   One paragraph: what the branch does, overall assessment.

   ## 🔴 Blocking Issues
   Architecture leaks, broken APIs, bugs that must be fixed before merge.
   Each item: file path, line range, description, suggested fix.

   ## 🟡 Suggestions
   Code quality, DRY improvements, typing, naming, minor refactors.
   Each item: file path, line range, description, suggested fix.

   ## 🟢 What Was Done Well
   Good patterns, clean abstractions, thorough tests worth calling out.

   ## Questions
   Anything ambiguous that needs clarification from the author.
   ```

5. **After the review**
   - If the user says "fix" or "apply" to any items, apply all changes in one shot.
   - Run `npm run lint:changed:fix` after applying fixes.
   - Do NOT apply fixes unless explicitly asked.

## Scope Boundaries

- Only review files changed in the branch diff. Do not suggest changes to unrelated files.
- If you notice out-of-scope issues, mention them briefly under a separate "Out of Scope" heading but do not block on them.
- When reviewing breaking changes, flag them clearly so the author can add migration guidance and a `BREAKING CHANGE:` block in the PR description.
