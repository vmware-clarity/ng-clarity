# Clarity badge

## When to use

From the [badge guidance](https://guidance.clarity.design/1002):

- Badges show **counts**. Use a label (`clr-label`) for text metadata. A label may contain a badge.
- Always pair a badge with text or a label that gives the count meaning.
- Show counts above 99 as `99+`.

## Component

```ts
import { ClrBadge, ClrBadgeColors } from '@clr/angular';

@Component({ imports: [ClrBadge] /* ... */ })
export class Counts {
  count = 0;
}
```

`ClrBadge` is standalone; `ClrEmphasisModule` is the alternative import.

```html
<clr-badge>{{ count > 99 ? '99+' : count }}</clr-badge>
<clr-badge clrColor="danger">3</clr-badge>
<clr-badge clrColor="info" clrType="outlined">12</clr-badge>
```

- `clrColor`: `ClrBadgeColors` value: `info`, `success`, `warning`, `danger`, `gray`, `blue`, `light-blue`, `orange`, `purple` (empty = default).
- `clrType`: `solid` (default) or `outlined`.
- Use the status colours (`warning`, `danger`, `success`, `info`) for status meaning, not colour names (e.g. `orange`).

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
- API: `@clr/angular/types/clr-angular-emphasis-badge.d.ts`
- Styles: `@clr/ui/emphasis/badge/_badges.clarity.scss`
