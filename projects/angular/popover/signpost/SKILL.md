---
name: clr-signpost
description: Clarity signposts (`clr-signpost`, `clr-signpost-content`, `clr-signpost-title`, `clrSignpostTrigger`) from `@clr/angular` — click-triggered popovers with rich contextual help, custom triggers, positions, and `openAtPoint()`. Use when adding inline help, an info icon popover, or contextual details that stay open until dismissed.
metadata:
  docs: /documentation/signpost
  guidance: ['1027:2024-10-30']
---

# Clarity signpost

## When to use

From the [signpost guidance](https://guidance.clarity.design/1027):

- Use a signpost instead of a tooltip when the content needs a title, links, images, or more than a short phrase, or must stay visible until the user clicks elsewhere.
- Tooltip: short plain-text label on hover/focus. Dropdown: a list of actions. Modal: a blocking task.
- Put only text, links, and images inside — no buttons or form controls.
- Keep it small (about 216x84px min, 360x504px max); long content scrolls vertically.
- Show one signpost at a time.

## Setup

```ts
import { ClrSignpostModule } from '@clr/angular'; // also exports *clrIfOpen

@Component({ imports: [ClrSignpostModule] /* ... */ })
```

NgModule, not standalone.

## Default trigger

```html
<span>Storage policy</span>
<clr-signpost clrSignpostTriggerAriaLabel="Storage policy help">
  <clr-signpost-content *clrIfOpen [clrPosition]="'right-middle'">
    <clr-signpost-title>Storage policy</clr-signpost-title>
    <p>Defines placement and redundancy for VM disks.</p>
    <a href="/docs/storage" class="label-link">Learn more</a>
  </clr-signpost-content>
</clr-signpost>
```

- With no custom trigger, `clr-signpost` renders an info icon button. Set `clrSignpostTriggerAriaLabel` to a localized, specific label.
- `clr-signpost-content` includes a close button; set `clrSignpostCloseAriaLabel` to localize it.
- `*clrIfOpen` renders the content only while open.

## Custom trigger

```html
<clr-signpost>
  <button type="button" class="btn btn-link btn-icon" clrSignpostTrigger aria-label="User details">
    <clr-icon shape="user"></clr-icon>
  </button>
  <clr-signpost-content *clrIfOpen [clrPosition]="'bottom-middle'">
    <clr-signpost-title>{{ user.name }}</clr-signpost-title>
    <p>{{ user.email }}</p>
  </clr-signpost-content>
</clr-signpost>
```

- `clrSignpostTrigger` goes on a `<button>`; icon-only triggers need an `aria-label`.

## Positions

`[clrPosition]` on `clr-signpost-content`: `right-middle` (default), `right-top`, `right-bottom`, `top-right`, `top-left`, `top-middle`, `bottom-right`, `bottom-middle`, `bottom-left`, `left-bottom`, `left-middle`, `left-top`. Unknown values fall back to `right-middle`. Pick one that keeps the content on screen and off important data.

## Open at a point

```ts
@ViewChild('help') help: ClrSignpost;

onContextMenu(event: MouseEvent) {
  event.preventDefault();
  this.help.openAtPoint({ x: event.clientX, y: event.clientY }, event.target as HTMLElement);
}
```

```html
<clr-signpost #help [clrSignpostHideTrigger]="true">
  <clr-signpost-content [clrPosition]="'bottom-middle'">
    <clr-signpost-title>Details</clr-signpost-title>
    <p>...</p>
  </clr-signpost-content>
</clr-signpost>
```

`[clrSignpostHideTrigger]="true"` hides the default icon button when the signpost is opened programmatically.

## Rules

- One trigger per signpost: either the default one or a single `clrSignpostTrigger`.
- Keep actions out of signposts; use links for navigation, or a modal/dropdown for actions.
- Place the signpost right after the text it explains so screen reader order makes sense.
- Use `[(clrIfOpen)]` on the content to control or read the open state.

## References

- Design guidance: https://guidance.clarity.design/1027
- API: `projects/angular/popover/popover.api.md`
- Styles: `projects/angular/popover/signpost/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/signposts/`
