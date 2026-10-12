---
name: clr-spinner
description: Show a loading indicator with the Clarity spinner (`clr-spinner` with `clrInline`, `clrSmall`, `clrMedium`, `clrInverse`, or the `.spinner` CSS classes) from `@clr/angular`. Use when adding or changing a spinner for page, section, inline, or button loading states. For measurable progress, use `clr-progress-bar`.
metadata:
  docs: /documentation/spinner
  guidance: ['1028:2024-10-30']
---

# Clarity spinner

## When to use

From the [spinner guidance](https://guidance.clarity.design/1028):

- A **page spinner** for whole-page operations, an **inline spinner** for one component. Place it where the result will appear, with a short status text ("Loading…").
- Use a spinner when there is no estimated end, or when space is too tight for a progress bar. When the duration or amount is known, show a progress bar instead — guide `clr-progress-bar`.
- Colour must not carry meaning. Report failure with a text label or an alert, not with colour.

## Setup

```ts
import { ClrSpinnerModule } from '@clr/angular';

@Component({ imports: [ClrSpinnerModule] /* ... */ })
```

```ts
export class UserList {
  loading = false;
  users: User[];
}
```

## Usage

```html
@if (loading) {
<clr-spinner>Loading users</clr-spinner>
} @else {
<app-user-list [users]="users" />
}

<span>
  <clr-spinner clrInline>Saving</clr-spinner>
  Saving…
</span>
```

- Projected text is visually hidden but read by screen readers. Always provide it. The host sets `aria-busy`.
- Sizes: default (large), `clrMedium`, `clrSmall`. Use `clrInline` next to text, and `clrInverse` on dark backgrounds.
- For a busy button, use `[clrLoading]` on the button (guide `clr-button`) rather than putting a spinner inside it.
- CSS only: `<span class="spinner spinner-inline">Loading…</span>`, plus modifiers `spinner-sm`, `spinner-md`, `spinner-inverse`.

## References

- Design guidance: https://guidance.clarity.design/1028
- API: `projects/angular/clarity.api.md` (`ClrSpinner`)
- Styles: `projects/angular/progress/spinner/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/spinners/` (page: /documentation/spinner)
