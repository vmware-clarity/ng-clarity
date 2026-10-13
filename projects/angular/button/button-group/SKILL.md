---
name: clr-button-group
description: Group related actions with the Clarity button group (`clr-button-group` / `clr-button` with `clrInMenu`, overflow menu, `clrMenuPosition`) from `@clr/angular`. Use when adding a toolbar of related actions, split or overflow menus, or batch actions above a datagrid. For single buttons use `clr-button`.
metadata:
  docs: /documentation/button-group
  guidance-1004: '2024-10-30'
---

# Clarity button group

## When to use

From the [button group guidance](https://guidance.clarity.design/1004):

- A row of related actions that act on the same object or selection — toolbars, card actions, batch actions above a datagrid.
- A single action, or several unrelated actions, is a plain button instead — guide `clr-button`.
- A list of actions behind one trigger, with no always-visible buttons, is a dropdown — guide `clr-dropdown`.

## Setup

```ts
import { ClrButtonModule, ClrIcon } from '@clr/angular'; // ClrButtonModule includes button group + loading button

@Component({ imports: [ClrButtonModule, ClrIcon] /* ... */ })
export class Toolbar {
  selected: User | undefined;
  create(): void {}
  edit(): void {}
  assign(): void {}
  remove(): void {}
}
```

These are NgModules (not standalone) — import the modules, not the component classes.

## Usage

```html
<clr-button-group class="btn-primary btn-sm" [clrMenuPosition]="'bottom-right'" clrToggleButtonAriaLabel="More actions">
  <clr-button (click)="create()">Create</clr-button>
  <clr-button (click)="edit()" [disabled]="!selected">Edit</clr-button>
  <clr-button [clrInMenu]="true" (click)="assign()">Assign</clr-button>
  <clr-button [clrInMenu]="true" (click)="remove()">Delete</clr-button>
</clr-button-group>
```

- Put the group's style on `clr-button-group`. A single `clr-button` may add a same-style colour class (for example `btn-danger` on the destructive last action). Never mix solid and outline in one group.
- `[clrInMenu]="true"` moves a button into the overflow menu. There is **no** `clrIfOverflow` input.
- `clrMenuPosition`: `bottom-left` (default), `bottom-right`, `top-left`, `top-right`, `left-top`, `left-bottom`, `right-top`, `right-bottom`. Invalid values are silently ignored.
- Localize `clrToggleButtonAriaLabel`.
- Order: primary actions first, then secondary, with a destructive action last. The overflow menu sits at the far right, and its items always show text, even when the group shows icons only.
- Use a flat group (`btn-link`) for tertiary actions, in cards, and above datagrids.
- Icon-only button groups use the default size, not `btn-sm`.
- Static, CSS-only group: `<div class="btn-group">` with `.btn` children.
- Checkbox and radio button groups (`div.checkbox.btn` / `div.radio.btn` inside `.btn-group`) are a CSS-only pattern (see the button-group demos). Their styling is marked legacy in `_button-group.clarity.scss` and may change when buttons are revamped.

## Imports

- All from `@clr/angular`: `ClrButtonModule` (re-exports `ClrButtonGroupModule`, `ClrLoadingButtonModule`). Or use `ClarityModule`.
- A CSS-only `.btn-group` needs no Angular import, only Clarity styles.

## References

- Design guidance: https://guidance.clarity.design/1004
- Styles: `projects/angular/button/button-group/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/button-group/`
