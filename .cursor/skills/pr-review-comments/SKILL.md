---
name: pr-review-comments
description: Fetch and address unresolved PR review comments from GitHub. Use when the user provides a pull request URL or number and asks to review, address, or respond to PR comments, feedback, or review threads.
---

# PR Review Comments

Fetch all comments from a GitHub pull request, cross-reference them with the current code, and walk through each unresolved comment with the user — providing analysis, suggestions, and optionally applying fixes.

## Workflow

### Step 1: Extract PR info

Parse the PR identifier from the user's input. Supported formats:

- Full URL: `https://github.com/owner/repo/pull/123`
- Short form: `#123` or `123` (uses current repo)

**If no PR identifier is provided**, use the `AskQuestion` tool immediately to ask for it instead of sending a text reply and waiting for another chat turn. This avoids wasting a request.

```
AskQuestion prompt: "Which pull request should I review?"
Options:
- Let the user type/paste the PR URL or number
```

Use a free-text question if `AskQuestion` doesn't support it; otherwise list recent PRs from `gh pr list --limit 10 --json number,title` as selectable options.

### Step 2: Fetch PR data

**Check `gh` CLI availability first**: run `gh auth status`. If not authenticated, use `WebFetch` to load the PR page (`https://github.com/<owner>/<repo>/pull/<number>`) and extract metadata, comments, and reviews from the rendered page.

If `gh` is available, run these commands in parallel to gather context:

```bash
# Get PR metadata
gh pr view <number> --json title,body,baseRefName,headRefName,state

# Get all review comments (threaded code comments)
gh api repos/<owner>/<repo>/pulls/<number>/comments --paginate

# Get top-level PR comments (conversation comments)
gh api repos/<owner>/<repo>/issues/<number>/comments --paginate

# Get reviews (approval/request-changes metadata)
gh api repos/<owner>/<repo>/pulls/<number>/reviews --paginate
```

### Step 3: Filter to unresolved comments

From the fetched data, build a list of **unresolved** comments:

1. **Review comments** (`pulls/{id}/comments`): Group by `in_reply_to_id` to form threads. A thread is "resolved" if its last reply contains keywords like "done", "fixed", "resolved", "addressed", or if GitHub's `resolved` field is true. **Exclude bot comments** (e.g., from `github-actions[bot]`, `codecov[bot]`).
2. **Issue comments** (`issues/{id}/comments`): Include only substantive ones (skip CI bot output, auto-generated messages).

For each unresolved comment, capture:

- `id` — GitHub comment ID
- `author` — who wrote it
- `body` — the comment text
- `path` — file path (for review comments)
- `line` / `original_line` — line reference
- `diff_hunk` — the diff context
- `created_at` — timestamp
- `thread` — full thread if it has replies

### Step 4: Present summary

Show the user a numbered summary table:

```
## Unresolved PR Comments (X total)

| # | File | Line | Author | Comment (truncated) |
|---|------|------|--------|---------------------|
| 1 | src/foo.ts | 42 | reviewer1 | "Consider using..." |
| 2 | src/bar.scss | 15 | reviewer2 | "This breaks..." |
| 3 | (general) | — | reviewer1 | "Overall, the..." |
```

### Step 5: Walk through each comment

For each unresolved comment, in order:

1. **Show the full comment** with author and context.
2. **Read the current file** at the referenced location (the code may have changed since the review).
3. **Analyze**: Does the comment still apply to the current code? Was it already addressed?
4. **Provide a recommendation** using these categories:
   - **Already addressed** — the code already reflects the requested change
   - **Agree — suggest fix** — show the concrete code change
   - **Partially addressed** — explain what's done and what remains
   - **Disagree — explain why** — provide reasoning for keeping the current approach
   - **Needs discussion** — flag for the user to decide
5. **Ask the user** what to do using the `AskQuestion` tool (never plain text — avoids wasting a request turn):
   - Options: "Apply fix", "Skip", "Mark as already addressed", "Needs discussion"
   - Batch multiple comments into a single `AskQuestion` call when possible (e.g., present all comments with per-comment dropdowns in one question set)

### Step 6: PR Description Review

After addressing all comments, compare the **current PR description** (fetched in Step 2 via `gh pr view --json body`) against the actual changes now on the branch:

1. **Check accuracy**: Does the description still match the code after the fixes applied in this session? Look for outdated migration tables, renamed symbols, removed/added files, or behavior changes that the description doesn't reflect.
2. **If updates are needed**: List specific sections of the description that are now stale and suggest concrete edits.
3. **If the description is empty or minimal**: Suggest the user run the `create-pr-description` skill to generate a comprehensive PR description from scratch.

### Step 7: Summary

After processing all comments, output a final summary:

```
## Review Summary

- X comments addressed (fixes applied)
- Y comments skipped
- Z comments already resolved in current code
- W comments flagged for discussion

### Applied Changes
- [file:line] — description of change
- ...

### Remaining (need manual attention)
- [file:line] — reason
- ...

### PR Description
- [Up to date / Needs updates / Missing — run create-pr-description skill]
```

## Important Notes

- **Minimize chat turns**: Always use `AskQuestion` tool for any user input instead of sending a text message and waiting for a reply. Every plain-text question wastes a request from the user's monthly budget.
- Always read the **current** file content before suggesting changes — the diff hunk from the PR may be outdated.
- Never auto-apply fixes without asking the user first (use `AskQuestion` to confirm).
- When a comment references code that no longer exists (file deleted, lines removed), note it as "no longer applicable".
- Group related comments on the same file/area together when presenting, to avoid redundant file reads.
- Run `npm run lint:changed:fix` after applying any code changes.
