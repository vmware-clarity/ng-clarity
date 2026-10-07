---
name: clr-button
description: Use Clarity buttons correctly — `.btn` CSS classes and variants, icon buttons, loading buttons (`[clrLoading]`), and button groups with overflow menus (`clr-button-group` / `clr-button`) from `@clr/angular`. Use when adding or styling buttons, toolbars, or action groups in a Clarity app.
metadata:
  docs: /documentation/button
  guidance: ['1003:2024-10-30', '1004:2024-10-30']
---

# Clarity buttons

## Plain buttons (CSS only)

```html
<button type="button" class="btn btn-primary">Save</button>
<button type="button" class="btn btn-outline">Cancel</button>
<button type="button" class="btn btn-link">Learn more</button>
<button type="button" class="btn btn-danger btn-sm" disabled>Delete</button>
```

| Purpose         | Classes                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| Base (required) | `btn`                                                                                                              |
| Solid           | `btn-primary`, `btn-secondary`, `btn-info`, `btn-success`, `btn-warning`, `btn-danger`, `btn-neutral`              |
| Outline         | `btn-outline`, `btn-outline-{primary,secondary,info,success,warning,danger,neutral}` (alias `btn-{color}-outline`) |
| Link            | `btn-link`, `btn-link-{primary,info,success,warning,danger,neutral}`                                               |
| Modifiers       | `btn-sm`, `btn-block`, `btn-icon`, `btn-inverse` (on dark backgrounds)                                             |

- Always use a real `<button>` (or `<a class="btn">` for navigation) — never a `div`.
- Set `type="button"` unless it really submits a form (native default is `submit`).
- Use one primary button per view/section. Use `disabled`, not just a class.
- Pick one outline spelling and use it consistently.

## Choosing a button

From the [button design guidance](https://guidance.clarity.design/1003):

- Solid (`btn-primary`) for the primary action, outline (`btn-outline`) for secondary actions, and flat (`btn-link`) for tertiary or in-page actions. Use outline for several actions of equal importance.
- Navigation to another page is a link (`<a>`), not a button.
- Labels: three words or fewer, describing the action ("Save changes", not "OK").
- `btn-sm` de-emphasizes actions, e.g. several actions of equal importance.
- Badges go to the right of the label and show a count of related items.

## Icon buttons

```html
<button type="button" class="btn btn-icon btn-outline" aria-label="Settings">
  <clr-icon shape="cog"></clr-icon>
</button>

<button type="button" class="btn btn-primary">
  <clr-icon shape="plus"></clr-icon>
  Add
</button>
```

- Documented icon-only button: `btn btn-icon`, optionally with a solid colour class (`btn-primary`, `btn-danger`, ...).
- `ClrIcon` is standalone; import it whenever a template contains `<clr-icon>`.
- Icon-only buttons **must** have an `aria-label`. Prefer icon plus text when there is room.
- At most one icon per button. Put it before the label for actions on the current page, and after the label for actions that take the user elsewhere.

## Loading button

```ts
import { ClrLoadingButtonModule, ClrLoadingModule, ClrLoadingState } from '@clr/angular';

@Component({ imports: [ClrLoadingButtonModule, ClrLoadingModule] /* ... */ })
export class SaveForm {
  saveState = ClrLoadingState.DEFAULT;

  save() {
    this.saveState = ClrLoadingState.LOADING;
    this.api.save().subscribe({
      next: () => (this.saveState = ClrLoadingState.SUCCESS),
      error: () => (this.saveState = ClrLoadingState.ERROR),
    });
  }
}
```

```html
<button
  type="submit"
  class="btn btn-primary"
  [clrLoading]="saveState"
  (clrLoadingChange)="saveState = $event"
  (click)="save()"
>
  Save
</button>
```

- `ClrLoadingState`: `DEFAULT`, `LOADING` (spinner, button disabled), `SUCCESS` (check mark, then auto-returns to `DEFAULT`), `ERROR` (no visual; the button returns to `DEFAULT` at once, so show the error elsewhere, for example a `clr-alert` under the form).
- `ClrLoadingModule` provides the `[clrLoading]` input, `ClrLoadingButtonModule` the button behaviour; both are required.
- `[clrLoading]` also accepts a boolean. It only works on `<button>` elements.
- `(clrLoadingChange)` emits state changes; bind it back so your field follows the button's own reset after `SUCCESS`.
- Show `LOADING` while the request runs, then `SUCCESS` or `ERROR`. Don't start the same action again while it is loading.

## Button group (with overflow menu)

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
- Design rules: [button group guidance](https://guidance.clarity.design/1004).
- Static, CSS-only group: `<div class="btn-group">` with `.btn` children.
- Checkbox and radio button groups (`div.checkbox.btn` / `div.radio.btn` inside `.btn-group`) are a CSS-only pattern (see the button-group demos). Their styling is marked legacy in `_button-group.clarity.scss` and may change when buttons are revamped.

## Imports

- All from `@clr/angular`: `ClrButtonModule` (re-exports `ClrButtonGroupModule`, `ClrLoadingButtonModule`), plus `ClrLoadingModule` for `[clrLoading]`. Or use `ClarityModule`.
- These are NgModules (not standalone) — import the modules, not the component classes.
- Plain `.btn` buttons need no Angular import, only Clarity styles.

## References

- Design guidance: https://guidance.clarity.design/1003, https://guidance.clarity.design/1004
- Styles: `projects/angular/button/_buttons.clarity.scss`, `projects/angular/button/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/buttons/`, `.../demos/button-group/`
