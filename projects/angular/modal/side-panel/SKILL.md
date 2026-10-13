---
name: clr-side-panel
description: Clarity side panels (`clr-side-panel`) from `@clr/angular` — open state binding (`[(clrSidePanelOpen)]`), sizes, pinnable and bottom panels, static backdrop. Use when adding a slide-in panel for details or settings next to the page content. For a centered dialog, use `clr-modal`.
metadata:
  docs: /documentation/side-panel
  guidance-1026: '2024-10-30'
---

# Clarity side panel

## When to use

- Supplementary content or a sub-process that needs more room than a modal, while the page stays visible. See [side panel guidance](https://guidance.clarity.design/1026).
- A critical message that needs immediate action, or a short task that should block the page, is a modal instead — guide `clr-modal`.
- Short plain-text hint on an icon: tooltip. Rich contextual help next to an element: signpost. List of actions: dropdown.
- Avoid stacked side panels; expand content inline in the first one instead.

## Setup

```ts
import { ClrSidePanelModule } from '@clr/angular'; // re-exports ClrModalModule

@Component({ imports: [ClrSidePanelModule] /* ... */ })
export class Hosts {
  detailsOpen = false;
}
```

This is an NgModule (not standalone) — import the module, not the component class.

## Usage

```html
<button type="button" class="btn btn-outline" (click)="detailsOpen = true">Details</button>

<clr-side-panel [(clrSidePanelOpen)]="detailsOpen" [clrSidePanelPinnable]="true" clrSidePanelSize="md">
  <h3 class="side-panel-title">Host details</h3>
  <div class="side-panel-body">...</div>
  <div class="side-panel-footer">
    <button type="button" class="btn btn-outline" (click)="detailsOpen = false">Close</button>
  </div>
</clr-side-panel>
```

| Input / output                     | Default   | Notes                                                                   |
| ---------------------------------- | --------- | ----------------------------------------------------------------------- |
| `[(clrSidePanelOpen)]`             | `false`   | Two-way open state (`clrSidePanelOpenChange`).                          |
| `clrSidePanelSize`                 | `'md'`    | `'sm'`, `'md'`, `'lg'`, `'xl'`, `'full-screen'`.                        |
| `clrSidePanelPosition`             | `'right'` | `'right'` or `'bottom'`.                                                |
| `[clrSidePanelPinnable]`           | `false`   | Shows a pin button; when pinned the page reflows beside the panel.      |
| `[clrSidePanelPinned]`             | `false`   | Pinned state. A pinned panel ignores X, backdrop and `close()`.         |
| `[clrSidePanelBackdrop]`           | `true`    | Set `false` for a panel without backdrop.                               |
| `[clrSidePanelStaticBackdrop]`     | `false`   | Set `true` to ignore backdrop clicks.                                   |
| `[clrSidePanelClosable]`           | `true`    | Close (X) button and Escape.                                            |
| `[clrSidePanelPreventClose]`       | `false`   | Emits `(clrSidePanelAlternateClose)` for X / Escape / backdrop instead. |
| `clrSidePanelCloseButtonAriaLabel` |           | Localized label for the X button.                                       |
| `clrSidePanelLabelledById`         |           | Id of the labelling element.                                            |

Content slots: `.side-panel-title`, `.side-panel-body`, `.side-panel-footer`.

- Setting `clrSidePanelOpen` to `false` closes the panel even when pinned; `close()` respects the pin.
- Keep side panel content simple (text, links, cards, images); put tables or accordions on a page.
- Use `clrModalHost` on a container to open the panel inline in that container.

## Rules

- Open and close via `[(clrSidePanelOpen)]` or the `open()` / `close()` methods — never toggle CSS classes or `*ngIf` the component.
- Use a heading element for `.side-panel-title` so the dialog gets an accessible name.
- Localize the close button label when the app is translated.
- Put footer buttons in order secondary (outline) then primary; each has `type="button"` unless it submits a form.

## References

- Design guidance: https://guidance.clarity.design/1026
- API: `projects/angular/modal/modal.api.md`
- Styles: `projects/angular/modal/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/side-panel/`
