---
name: clr-tooltip
description: Clarity tooltips (`clr-tooltip`, `clrTooltipTrigger`, `clr-tooltip-content`) from `@clr/angular` — short plain-text labels shown on hover and focus, with `clrPosition` and `clrSize`. Use when labelling icon-only buttons or toolbar icons, or when choosing between a tooltip and a signpost.
metadata:
  docs: /documentation/tooltip
  guidance: ['1035:2024-10-30']
---

# Clarity tooltip

## When to use

From the [tooltip guidance](https://guidance.clarity.design/1035):

- Use tooltips for actionable icons with no visible text, e.g. toolbar icon buttons.
- Plain text only: a short verb phrase in sentence case, no ending punctuation ("Edit settings").
- Skip tooltips on form components, static images (use `alt`), and text links (write a descriptive link).
- Need a title, links, images, or content that stays open: signpost. Actions list: dropdown. Blocking task: modal.

## Setup

```ts
import { ClrTooltipModule } from '@clr/angular';

@Component({ imports: [ClrTooltipModule] /* ... */ })
```

NgModule, not standalone.

## Usage

```html
<clr-tooltip>
  <button type="button" class="btn btn-icon btn-link" clrTooltipTrigger aria-label="Edit settings">
    <clr-icon shape="pencil"></clr-icon>
  </button>
  <clr-tooltip-content clrPosition="top-right" clrSize="sm">Edit settings</clr-tooltip-content>
</clr-tooltip>
```

Toolbar:

```html
@for (tool of tools; track tool.id) {
<clr-tooltip>
  <button
    type="button"
    class="btn btn-icon btn-link"
    clrTooltipTrigger
    [attr.aria-label]="tool.label"
    (click)="tool.run()"
  >
    <clr-icon [attr.shape]="tool.icon"></clr-icon>
  </button>
  <clr-tooltip-content clrPosition="bottom-right">{{ tool.label }}</clr-tooltip-content>
</clr-tooltip>
}
```

- `clrTooltipTrigger` makes the trigger focusable and links it to the content with `aria-describedby`. The tooltip opens on hover and keyboard focus.
- `clrPosition`: `right` (default), `left`, `bottom-right`, `bottom-left`, `top-right`, `top-left`. Unknown values fall back to `right`.
- `clrSize`: `xs`, `sm` (default), `md`, `lg` — pick the width that fits the text.
- `id` on `clr-tooltip-content` overrides the generated id.

## Rules

- Icon-only triggers still need their own `aria-label`; the tooltip is a description, not the accessible name.
- Use one `clrTooltipTrigger` and one `clr-tooltip-content` per `clr-tooltip`.
- Keep links, buttons, and other interactive content out of tooltips; use `clr-signpost` instead.
- Choose a position that keeps the tooltip fully on screen and off important content.
- CSS-only tooltips (`.tooltip` / `.tooltip-content` classes) exist for static markup; in Angular use `clr-tooltip`.

## References

- Design guidance: https://guidance.clarity.design/1035
- API: `projects/angular/popover/popover.api.md`
- Styles: `projects/angular/popover/tooltip/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/tooltips/`
