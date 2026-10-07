---
name: clr-modal
description: Clarity modal dialogs (`clr-modal`) and side panels (`clr-side-panel`) from `@clr/angular` — open state binding, sizes, static backdrop, closable, preventing close, pinnable and bottom side panels. Use when adding a dialog, confirmation, or slide-in panel with `clrModalOpen`, `clrModalSize`, `clrSidePanelOpen`, or `clrSidePanelPinnable`.
metadata:
  docs: /documentation/modal
  guidance: ['1018:2024-10-30', '1026:2024-10-30']
---

# Clarity modal and side panel

## When to use

- Modal: critical messages that need immediate action (errors, irreversible actions), or a short task broken into steps, without leaving the page. See [modal guidance](https://guidance.clarity.design/1018).
- Side panel: supplementary content or a sub-process that needs more room than a modal, while the page stays visible. See [side panel guidance](https://guidance.clarity.design/1026).
- Short plain-text hint on an icon: tooltip. Rich contextual help next to an element: signpost. List of actions: dropdown.
- Avoid stacked modals or side panels; expand content inline in the first one instead.

## Setup

```ts
import { ClrModalModule, ClrSidePanelModule } from '@clr/angular'; // ClrSidePanelModule re-exports ClrModalModule

@Component({ imports: [ClrModalModule, ClrSidePanelModule] /* ... */ })
export class Hosts {
  deleteOpen = false;
  editOpen = false;
  confirmOpen = false;
  detailsOpen = false;
  delete(): void {}
}
```

These are NgModules (not standalone) — import the modules, not component classes.

## Modal

```html
<button type="button" class="btn btn-primary" (click)="deleteOpen = true">Delete</button>

<clr-modal [(clrModalOpen)]="deleteOpen" [clrModalSize]="'sm'">
  <h3 class="modal-title">Delete host?</h3>
  <div class="modal-body">
    <p>This action is permanent.</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline" (click)="deleteOpen = false">Cancel</button>
    <button type="button" class="btn btn-danger" (click)="delete(); deleteOpen = false">Delete</button>
  </div>
</clr-modal>
```

| Input / output                    | Default | Notes                                                              |
| --------------------------------- | ------- | ------------------------------------------------------------------ |
| `[(clrModalOpen)]`                | `false` | Two-way open state (`clrModalOpenChange`).                         |
| `[clrModalSize]`                  | `'md'`  | `'sm'`, `'md'`, `'lg'`, `'xl'`, `'full-screen'`.                   |
| `[clrModalStaticBackdrop]`        | `true`  | Backdrop click is ignored. Set `false` to close on backdrop click. |
| `[clrModalClosable]`              | `true`  | Shows the close (X) button and allows Escape.                      |
| `[clrModalPreventClose]`          | `false` | X / Escape / backdrop emit `(clrModalAlternateClose)` only.        |
| `clrModalCloseButtonAriaLabel`    |         | Localized label for the X button.                                  |
| `clrModalLabelledById`            |         | Id of the element that labels the dialog (defaults to the title).  |
| `[clrModalSkipAnimation]`         | `false` | Disables open/close animation.                                     |
| `[clrModalOverrideScrollService]` | `false` | Keeps body scrolling enabled while open.                           |

Content slots: `.modal-title`, `.modal-body`, `.modal-footer` (and `.leading-button` in the footer).

Confirm before closing:

```html
<clr-modal
  #editModal
  [(clrModalOpen)]="editOpen"
  [clrModalPreventClose]="true"
  (clrModalAlternateClose)="confirmOpen = true"
>
  <h3 class="modal-title">Edit</h3>
  <div class="modal-body">...</div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" (click)="editModal.close()">Close</button>
  </div>
</clr-modal>
```

- Pick the size by testing the content at narrow widths; `md` is the default.
- Always give the user a way to dismiss: a Cancel and a primary action button in `.modal-footer`.
- Keep `clrModalStaticBackdrop` at its default so a stray click does not lose form data.
- Render the modal in a container with `clrModalHost` to scope it to that element instead of the viewport.

## Side panel

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
| `clrSidePanelSize`                 | `'md'`    | Same values as `clrModalSize`.                                          |
| `clrSidePanelPosition`             | `'right'` | `'right'` or `'bottom'`.                                                |
| `[clrSidePanelPinnable]`           | `false`   | Shows a pin button; when pinned the page reflows beside the panel.      |
| `[clrSidePanelPinned]`             | `false`   | Pinned state. A pinned panel ignores X, backdrop and `close()`.         |
| `[clrSidePanelBackdrop]`           | `true`    | Set `false` for a panel without backdrop.                               |
| `[clrSidePanelStaticBackdrop]`     | `false`   | Set `true` to ignore backdrop clicks.                                   |
| `[clrSidePanelClosable]`           | `true`    | Close (X) button and Escape.                                            |
| `[clrSidePanelPreventClose]`       | `false`   | Emits `(clrSidePanelAlternateClose)` for X / Escape / backdrop instead. |
| `clrSidePanelCloseButtonAriaLabel` |           | Localized label for the X button.                                       |
| `clrSidePanelLabelledById`         |           | Id of the labelling element.                                            |

- Setting `clrSidePanelOpen` to `false` closes the panel even when pinned; `close()` respects the pin.
- Keep side panel content simple (text, links, cards, images); put tables or accordions on a page.
- Use `clrModalHost` on a container to open the panel inline in that container.

## Rules

- Open and close via `[(clrModalOpen)]` / `[(clrSidePanelOpen)]` or the `open()` / `close()` methods — never toggle CSS classes or `*ngIf` the component.
- Use a heading element for `.modal-title` / `.side-panel-title` so the dialog gets an accessible name.
- Localize the close button labels when the app is translated.
- Put footer buttons in order secondary (outline) then primary; each has `type="button"` unless it submits a form.

## References

- Design guidance: https://guidance.clarity.design/1018, https://guidance.clarity.design/1026
- API: `projects/angular/modal/modal.api.md`
- Styles: `projects/angular/modal/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/modal/`, `.../demos/side-panel/`
