---
name: clr-modal
description: Clarity modal dialogs (`clr-modal`) from `@clr/angular` — open state binding (`[(clrModalOpen)]`), sizes, static backdrop, closable, preventing close, stacked modals. Use when adding a dialog or confirmation. For a slide-in panel anchored to an edge, use `clr-side-panel`.
metadata:
  docs: /documentation/modal
  guidance: ['1018:2024-10-30']
---

# Clarity modal

## When to use

- Critical messages that need immediate action (errors, irreversible actions), or a short task broken into steps, without leaving the page. See [modal guidance](https://guidance.clarity.design/1018).
- Supplementary content or a sub-process that needs more room while the page stays visible is a side panel instead — guide `clr-side-panel`.
- Short plain-text hint on an icon: tooltip. Rich contextual help next to an element: signpost. List of actions: dropdown.
- Avoid stacked modals; expand content inline in the first one instead.

## Setup

```ts
import { ClrModalModule } from '@clr/angular';

@Component({ imports: [ClrModalModule] /* ... */ })
export class Hosts {
  deleteOpen = false;
  editOpen = false;
  confirmOpen = false;
  delete(): void {}
}
```

This is an NgModule (not standalone) — import the module, not the component class.

## Usage

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
<clr-modal [(clrModalOpen)]="editOpen" [clrModalPreventClose]="true" (clrModalAlternateClose)="confirmOpen = true">
  <h3 class="modal-title">Edit</h3>
  <div class="modal-body">...</div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" (click)="editOpen = false">Close</button>
  </div>
</clr-modal>
```

- With `clrModalPreventClose`, `close()` does nothing but emit `(clrModalAlternateClose)`. Close the modal by setting the bound field (`editOpen = false`) — that is the only way out once the user confirms.
- Pick the size by testing the content at narrow widths; `md` is the default.
- Always give the user a way to dismiss: a Cancel and a primary action button in `.modal-footer`.
- Keep `clrModalStaticBackdrop` at its default so a stray click does not lose form data.
- Render the modal in a container with `clrModalHost` to scope it to that element instead of the viewport.

## Rules

- Open and close via `[(clrModalOpen)]` or the `open()` / `close()` methods — never toggle CSS classes or `*ngIf` the component.
- Use a heading element for `.modal-title` so the dialog gets an accessible name.
- Localize the close button label when the app is translated.
- Put footer buttons in order secondary (outline) then primary; each has `type="button"` unless it submits a form.

## References

- Design guidance: https://guidance.clarity.design/1018
- API: `projects/angular/modal/modal.api.md`
- Styles: `projects/angular/modal/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/modal/`
