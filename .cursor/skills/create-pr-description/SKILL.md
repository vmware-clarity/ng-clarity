---
name: create-pr-description
description: Generate or update a PR description following the project template. Use when the user asks for a PR description, PR summary, or wants to update an existing PR description.
---

# Create PR Description

## Step 1: Resolve PR context

Use `AskQuestion` to gather what's needed in a single prompt — never plain text questions.

**If the user provides a PR link or number**, fetch the existing description.
**Check `gh` CLI availability first**: run `gh auth status`. If not authenticated, use `WebFetch` to load the PR page and extract the description. If `gh` is available:

```bash
gh pr view <number> --json body,title,baseRefName,headRefName
```

**If no PR link is provided**, ask using `AskQuestion`:

- "Is there an existing PR you want to update, or should I create a new description from scratch?"
- Options: "Update existing PR (I'll provide the link)", "Create new description from current branch"

If "Update existing PR" is selected, ask for the PR link/number via `AskQuestion`, then fetch its description.

## Step 2: Gather inputs

Resolve these inputs. Use values from the user's message first, then auto-detect, then ask via `AskQuestion`.

| Input           | Auto-detect                                              | Fallback                                                                            |
| --------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Base branch** | From PR metadata (`baseRefName`) if fetched, otherwise — | Ask using AskQuestion with options: `next`, `main`, `other`                         |
| **Jira ticket** | —                                                        | Ask: "What's the Jira/issue ticket number?" with options: free text input, or `N/A` |

## Step 3: Gather branch information

Run these in parallel:

```bash
git branch --show-current
git log --oneline <base>..HEAD
git diff <base>...HEAD --stat
git diff <base>...HEAD
```

- Identify the PR type from the changes (bugfix, feature, refactoring, etc.).

## Step 4: Detect breaking changes

- Scan for removed/renamed public API symbols: exported classes, inputs, outputs, selectors.
- Check if any `*.api.md` golden files were modified.
- Check commit messages for `BREAKING CHANGE:` blocks.

## Step 5: Generate or update the description

### If updating an existing PR description

1. Compare the existing description against the actual branch changes.
2. Identify sections that are **stale, incomplete, or missing**:
   - Migration tables with wrong symbol names
   - "New behavior" that doesn't reflect recent fixes
   - Missing breaking changes or removed ones
   - Unchecked checklist items that should be checked (or vice versa)
3. Output **only the updated sections** with clear markers showing what changed, plus the full updated description at the end.

### If creating from scratch

Use this template (from `.github/pull_request_template.md`):

```markdown
## PR Checklist

- [ ] Tests for the changes have been added (for bug fixes / features)
- [ ] Docs have been added / updated (for bug fixes / features)
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

## Step 6: Output

- Print the full PR description as a markdown code block so the user can copy-paste it directly into the PR.
- Do NOT create a file. Output only to the chat.

## Important Notes

- **Minimize chat turns**: Always use `AskQuestion` for any user input instead of plain text replies.
- If `gh` CLI is not authenticated, use `WebFetch` to load the PR page as fallback. For "create from scratch" mode, proceed using git diff only.
