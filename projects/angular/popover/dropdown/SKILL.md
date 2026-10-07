---
name: clr-dropdown
description: Clarity dropdown menus (`clr-dropdown`, `clr-dropdown-menu`, `clrDropdownTrigger`, `clrDropdownItem`) from `@clr/angular` — action menus, nested menus, positioning, and context menus via `openAtPoint()`. Use when adding an actions menu, kebab/overflow menu, or right-click menu in a Clarity app.
metadata:
  docs: /documentation/dropdown
  guidance: ['1011:2024-10-30']
---

# Clarity dropdown

## When to use

From the [dropdown guidance](https://guidance.clarity.design/1011):

- Use a dropdown for immediate actions or navigation out of the current context.
- Keep primary actions visible as buttons; only secondary actions go in the menu.
- For choosing a form value, use a select (`clr-select-container`) or combobox — a dropdown is a menu of actions, not a form control.
- Nest at most three levels; keep item labels short and action-oriented.
- Short plain-text hint: tooltip. Rich help content: signpost. Blocking task or confirmation: modal.

## Setup

```ts
import { ClrDropdownModule } from '@clr/angular'; // also exports *clrIfOpen and ClrIcon

@Component({ imports: [ClrDropdownModule] /* ... */ })
export class HostActions {
  canMigrate = true;
  actions: { id: string; label: string; run(): void }[] = [];
  restart(): void {}
  migrate(): void {}
  remove(): void {}
}
```

NgModule, not standalone. `ClrPopoverModule` bundles dropdown, signpost and tooltip.

## Basic menu

```html
<clr-dropdown>
  <button type="button" class="btn btn-outline-primary" clrDropdownTrigger>
    Actions
    <clr-icon shape="angle" direction="down"></clr-icon>
  </button>
  <clr-dropdown-menu clrPosition="bottom-left" *clrIfOpen>
    <label class="dropdown-header" aria-hidden="true">Host</label>
    <button type="button" clrDropdownItem (click)="restart()">Restart</button>
    <button type="button" clrDropdownItem [clrDisabled]="!canMigrate" (click)="migrate()">Migrate</button>
    <div class="dropdown-divider" role="separator" aria-hidden="true"></div>
    <button type="button" clrDropdownItem (click)="remove()">Delete</button>
  </clr-dropdown-menu>
</clr-dropdown>
```

Icon-only trigger:

```html
<clr-dropdown>
  <button type="button" class="btn btn-icon btn-link" clrDropdownTrigger aria-label="More actions">
    <clr-icon shape="ellipsis-vertical"></clr-icon>
  </button>
  <clr-dropdown-menu clrPosition="bottom-right" *clrIfOpen>
    @for (action of actions; track action.id) {
    <button type="button" clrDropdownItem (click)="action.run()">{{ action.label }}</button>
    }
  </clr-dropdown-menu>
</clr-dropdown>
```

- `*clrIfOpen` on `clr-dropdown-menu` renders the menu only while open.
- `clrPosition`: `bottom-left`, `bottom-right`, `top-left`, `top-right`, `right-top`, `right-bottom`, `left-top`, `left-bottom`. Default is `bottom-left` for top-level menus and `right-top` for nested ones; an unknown value is ignored and the menu keeps its current position.
- `[clrDisabled]="true"` on an item disables it (sets `aria-disabled`); use it rather than the `disabled` attribute.
- `[clrCloseMenuOnItemClick]="false"` on `clr-dropdown` keeps the menu open after an item click (default `true`).
- Headers: `<label class="dropdown-header">`; separators: `<div class="dropdown-divider" role="separator">`.

## Nested menus

```html
<clr-dropdown-menu *clrIfOpen>
  <button type="button" clrDropdownItem>Copy</button>
  <clr-dropdown>
    <button type="button" clrDropdownTrigger>Share</button>
    <clr-dropdown-menu clrPosition="right-top">
      <button type="button" clrDropdownItem>Email</button>
      <button type="button" clrDropdownItem>Slack</button>
    </clr-dropdown-menu>
  </clr-dropdown>
</clr-dropdown-menu>
```

## Context menu

```ts
@ViewChild('contextMenu') contextMenu: ClrDropdown;

onContextMenu(event: MouseEvent) {
  event.preventDefault();
  this.contextMenu.openAtPoint({ x: event.clientX, y: event.clientY }, event.target as HTMLElement);
}
```

```html
<clr-dropdown #contextMenu>
  <div (contextmenu)="onContextMenu($event)">Right-click here</div>
  <clr-dropdown-menu>
    <button type="button" clrDropdownItem>Cut</button>
    <button type="button" clrDropdownItem>Paste</button>
  </clr-dropdown-menu>
</clr-dropdown>
```

## Rules

- Exactly one `clrDropdownTrigger` per `clr-dropdown`; use a real `<button>` for the trigger and items. `clrDropdownToggle` is an alias — prefer `clrDropdownTrigger`.
- Icon-only triggers need an `aria-label`.
- Items are `clrDropdownItem` elements directly inside `clr-dropdown-menu`; nested menus are a `clr-dropdown` inside the menu.
- Keyboard navigation and focus handling are built in — no custom keydown handlers needed.
- For a row of buttons with an overflow menu, use `clr-button-group` with `[clrInMenu]` (see clr-button skill).

## References

- Design guidance: https://guidance.clarity.design/1011
- API: `projects/angular/popover/popover.api.md`
- Styles: `projects/angular/popover/dropdown/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/dropdown/`
