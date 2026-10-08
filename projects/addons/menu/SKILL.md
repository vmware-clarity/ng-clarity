---
name: appfx-menu
description: Build context menus with the AppFX menu (`<appfx-menu>` from `@clr/addons/menu`) — a declarative menu over `clr-dropdown` shown at x/y coordinates, with headers, separators, nested submenus, icons, shortcuts, viewport-aware positioning, and zoom support. Use when adding a right-click/context menu or changing `appfx-menu`, `appfx-menu-action`, `appfx-menu-header`, `appfx-menu-separator`, or `menu-outlet`.
metadata:
  docs: /documentation/menu
---

# AppFX menu (`appfx-menu`)

## When to use it vs `clr-dropdown`

`appfx-menu` is built on `clr-dropdown` and opens through its `openAtPoint()`. Use `clr-dropdown` for menus by default, including nested menus and context menus at a point.

Use `appfx-menu` when the app already uses `@clr/addons` and needs one of:

- menu items declared as components (`appfx-menu-action`, `appfx-menu-header`, nested `appfx-menu`),
- menus created in code (`MenuOutletService.showMenu`),
- focus returned to the trigger on close (a `clr-dropdown` opened at a point doesn't do this),
- the 400% zoom behaviour (full-screen menu, submenu back header) via `ZoomLevelService`.

Do not migrate existing `clr-dropdown` usage unless asked.

## Setup

```ts
import { AppfxMenuModule, MenuComponent } from '@clr/addons/menu';
import { ClrIcon } from '@clr/angular';

@Component({ imports: [AppfxMenuModule, ClrIcon] })
```

NgModule-declared, no `forRoot()`. A template-declared `appfx-menu` needs no outlet; add one `<menu-outlet>` only when opening dynamically created menus.

## Context menu

```html
<clr-datagrid>
  <clr-dg-column>Name</clr-dg-column>
  @for (vm of vms; track vm.id) {
  <clr-dg-row (contextmenu)="openMenu($event, vm)">
    <clr-dg-cell>{{ vm.name }}</clr-dg-cell>
  </clr-dg-row>
  }
</clr-datagrid>

<appfx-menu #vmMenu>
  <appfx-menu-header text="Actions"></appfx-menu-header>
  <appfx-menu-action text="Power on" (handle)="powerOn()"></appfx-menu-action>
  <appfx-menu-action text="Delete" shortcut="Del" [enabled]="canDelete" (handle)="remove()"></appfx-menu-action>
  <appfx-menu-separator></appfx-menu-separator>
  <appfx-menu text="Snapshots">
    <appfx-menu-action text="Take snapshot" (handle)="snapshot()"></appfx-menu-action>
  </appfx-menu>
</appfx-menu>
```

```ts
@ViewChild('vmMenu') vmMenu!: MenuComponent;
vms: Vm[] = [];
current?: Vm;
canDelete = true;
powerOn(): void {}
remove(): void {}
snapshot(): void {}

openMenu(event: MouseEvent, vm: Vm) {
  event.preventDefault();
  this.current = vm;
  this.vmMenu.close(event);
  this.vmMenu.show(event, event.clientX, event.clientY);
}
```

## Button-triggered

```html
<button type="button" class="btn btn-sm btn-link" aria-haspopup="menu" (click)="openFromButton($event)">
  <clr-icon shape="ellipsis-vertical"></clr-icon> Actions
</button>
```

```ts
openFromButton(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  this.vmMenu.close(event);
  this.vmMenu.show(event, rect.left, rect.bottom, event.currentTarget as HTMLElement);
}
```

Pass the trigger element as the 4th argument so focus returns to it on close. For an icon-only trigger, add `aria-label`.

## API

- `appfx-menu-action`: `text`, `iconClass` (CSS class on an icon span), `shortcut` (display only), `enabled`, `(handle)`.
- `appfx-menu-header`: `text`, `iconClass`. `appfx-menu-separator`: no inputs.
- Nested `appfx-menu [text]` creates a submenu. All items extend `MenuItem` (`id`, plus a `hidden` class field).
- `MenuComponent`: `show(event, x, y, trigger?)`, `close(event)`, outputs `opened` / `closed`.
- `MenuOutletService.showMenu(componentRef, event, x, y)` / `closeMenu()` open a dynamically created menu.

## Rules

- Menu content is static: toggle `[enabled]` on `appfx-menu-action`; `MenuItem.hidden` is not a template input.
- Call `event.preventDefault()` on `contextmenu` to suppress the browser menu.
- Call `close(event)` before `show(...)` when reopening at a new position.
- `shortcut` is a label only; bind the keyboard shortcut yourself.
- Pass translated `text` values.

## References

- API: `projects/addons/menu/menu.api.md`
- Demos: `projects/website/src/app/documentation/demos/menu/ng/` (basic, button, datagrid, tree), `projects/demo/src/app/addons/menu/`
