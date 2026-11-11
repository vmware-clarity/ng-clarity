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
  users: { name: string }[] = [];
}
```

## Usage

```html
@if (loading) {
<clr-spinner>Loading users</clr-spinner>
} @else {
<ul>
  @for (user of users; track user.name) {
  <li>{{ user.name }}</li>
  }
</ul>
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
- API: `@clr/angular/types/clr-angular-progress-spinner.d.ts` (`ClrSpinner`)
- Styles: `@clr/ui/progress/spinner/_spinner.clarity.scss`
