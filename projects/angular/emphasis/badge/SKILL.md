---
name: clr-badge
description: Show item counts with Clarity badges — the `clr-badge` component (`clrColor`, `clrType`) or the `.badge` / `.badge-{color}` CSS classes from `@clr/angular`. Use when adding a count next to a label, button, tab, or nav item, or choosing badge colors and outlined vs solid style.
metadata:
  docs: /documentation/badge
  guidance: ['1002:2024-10-30']
---

# Clarity badge

## When to use

From the [badge guidance](https://guidance.clarity.design/1002):

- Badges show **counts**. Use a label (`clr-label`) for text metadata. A label may contain a badge.
- Always pair a badge with text or a label that gives the count meaning.
- Show counts above 99 as `99+`.

## Component

```ts
import { ClrBadge, ClrBadgeColors } from '@clr/angular'; // standalone; also in ClrEmphasisModule
```

```html
<clr-badge>{{ count > 99 ? '99+' : count }}</clr-badge>
<clr-badge clrColor="danger">3</clr-badge>
<clr-badge clrColor="info" clrType="outlined">12</clr-badge>
```

- `clrColor`: `ClrBadgeColors` value: `info`, `success`, `warning`, `danger`, `gray`, `blue`, `light-blue`, `orange`, `purple` (empty = default).
- `clrType`: `solid` (default) or `outlined`.

## CSS only

```html
<span class="badge badge-danger">3</span> <span class="badge badge-info outlined">12</span>
```

Classes: `badge` plus `badge-{info,success,warning,danger,gray,blue,light-blue,orange,purple}` and optional `outlined`. Numeric aliases `badge-1` to `badge-5` also exist; prefer the named colors.

## Rules

- In a button, put the badge after the label: `<button type="button" class="btn">Alerts <clr-badge>4</clr-badge></button>`.
- Color alone must not carry meaning. Reserve `danger`/`warning`/`success` for status.
- If the count changes and matters, give screen-reader users context, for example `aria-label` on the parent control ("Alerts, 4 new").

## References

- Design guidance: https://guidance.clarity.design/1002
- API: `projects/angular/emphasis/emphasis.api.md`
- Styles: `projects/angular/emphasis/badge/_badges.clarity.scss`, `projects/angular/emphasis/badge/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/badges/`
