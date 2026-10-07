---
name: clr-label
description: Show colored tag/status labels with Clarity — the `clr-label` component (`clrText`, `clrColor`, `clrType`, `clrBadgeText`, `clrClickable`) or `.label` / `.label-{color}` CSS classes from `@clr/angular`. This is the emphasis tag, not a form `<label>`. Use when adding tags, metadata chips, status labels, clickable labels, or labels with a count badge.
metadata:
  docs: /documentation/label
  guidance: ['1015:2024-10-30']
---

# Clarity label (tag)

A small colored tag for metadata or status. Labels are for status/metadata text; for counts use a badge (`clr-badge`). For form field labels, use the form components (`clr-input-container` etc.) and a plain `<label>`.

## When to use

From the [label guidance](https://guidance.clarity.design/1015):

- Keep the text short, on one line, in sentence case (never all caps). Put extra metadata in parentheses.
- If the label relates to a number, show it with a badge (`clrBadgeText`).
- Use clickable labels for related actions, like filtering by that tag.
- Use few colors in one context. Reserve red/yellow/green (`danger`/`warning`/`success`) for status, and never use color as the only signal.

## Component

```ts
import { ClrLabel, ClrLabelColors } from '@clr/angular';

@Component({ imports: [ClrLabel] /* ... */ })
export class Tags {
  canFilter = true;
  filterBy(tag: string): void {}
}
```

`ClrLabel` is standalone; `ClrEmphasisModule` is the alternative import.

```html
<clr-label clrText="Production" clrColor="blue"></clr-label>
<clr-label clrText="Failed" clrColor="danger" clrType="solid"></clr-label>
<clr-label clrText="Hosts" clrColor="purple" clrBadgeText="12"></clr-label>
<clr-label clrText="Seattle" [clrClickable]="true" [clrDisabled]="!canFilter" (click)="filterBy('Seattle')"></clr-label>
```

| Input            | Purpose                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| `clrText`        | Label text (or project content)                                                                            |
| `clrColor`       | `ClrLabelColors`: `info`, `success`, `warning`, `danger`, `gray`, `blue`, `light-blue`, `orange`, `purple` |
| `clrType`        | `outlined` (default) or `solid`                                                                            |
| `clrBadgeText`   | Adds a badge with this count                                                                               |
| `[clrClickable]` | Hover/active styling for interactive labels                                                                |
| `[clrDisabled]`  | Disabled styling                                                                                           |

Use the status colours (`warning`, `danger`, `success`, `info`) for status meaning, not colour names (e.g. `orange`).

## CSS only

Use a real `<a>` or `<button>` for a clickable label so it is keyboard accessible:

```html
<span class="label label-success">Healthy</span>
<button type="button" class="label label-blue clickable" (click)="filterBy('Austin')">
  <span class="text">Austin</span>
  <span class="badge">3</span>
</button>
```

Classes: `label`, `label-{color}`, `solid`, `clickable`, `disabled`. Inside, use `.text` and `.badge`.

## Rules

- `clrClickable` only adds styling. `clr-label` is not focusable, so when keyboard users must activate it, use the CSS form on a `<button>` or `<a>`.
- A dismissible label's only action is dismiss. Put the close icon at the right and give it an `aria-label`.

## References

- Design guidance: https://guidance.clarity.design/1015
- API: `projects/angular/emphasis/emphasis.api.md`
- Styles: `projects/angular/emphasis/label/_labels.clarity.scss`, `projects/angular/emphasis/label/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/labels/`
