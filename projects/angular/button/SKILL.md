---
name: clr-button
description: Use Clarity buttons correctly — `.btn` CSS classes and variants, icon buttons, loading buttons (`[clrLoading]`), and button groups with overflow menus (`clr-button-group` / `clr-button`) from `@clr/angular`. Use when adding or styling buttons, toolbars, or action groups in a Clarity app.
metadata:
  docs: /documentation/button
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

## Icon buttons

```html
<button type="button" class="btn btn-icon btn-outline" aria-label="Settings">
  <cds-icon shape="cog"></cds-icon>
</button>

<button type="button" class="btn btn-primary">
  <cds-icon shape="plus"></cds-icon>
  Add
</button>
```

Icon-only buttons **must** have an `aria-label`.

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
<button type="submit" class="btn btn-primary" [clrLoading]="saveState" (click)="save()">Save</button>
```

- `ClrLoadingState`: `DEFAULT`, `LOADING` (spinner, button disabled), `SUCCESS` (check mark, then auto-returns to `DEFAULT`), `ERROR`.
- `[clrLoading]` also accepts a boolean. It only works on `<button>` elements.
- `(clrLoadingChange)` emits state changes.

## Button group (with overflow menu)

```ts
import { ClrButtonModule } from '@clr/angular'; // includes button group + loading button
```

```html
<clr-button-group class="btn-primary btn-sm" [clrMenuPosition]="'bottom-right'" clrToggleButtonAriaLabel="More actions">
  <clr-button (click)="create()">Create</clr-button>
  <clr-button (click)="edit()" [disabled]="!selected">Edit</clr-button>
  <clr-button [clrInMenu]="true" (click)="assign()">Assign</clr-button>
  <clr-button [clrInMenu]="true" (click)="remove()">Delete</clr-button>
</clr-button-group>
```

- Color/size classes go on `clr-button-group`, not on each `clr-button`.
- `[clrInMenu]="true"` moves a button into the overflow menu. There is **no** `clrIfOverflow` input.
- `clrMenuPosition`: `bottom-left` (default), `bottom-right`, `top-left`, `top-right`, `left-top`, `left-bottom`, `right-top`, `right-bottom`. Invalid values are silently ignored.
- Localize `clrToggleButtonAriaLabel`.
- Static, CSS-only group: `<div class="btn-group">` with `.btn` children. The checkbox/radio toggle styling inside `.btn-group` is deprecated — use form controls instead.

## Imports

- All from `@clr/angular`: `ClrButtonModule` (re-exports `ClrButtonGroupModule`, `ClrLoadingButtonModule`), plus `ClrLoadingModule` for `[clrLoading]`. Or use `ClarityModule`.
- These are NgModules (not standalone) — import the modules, not the component classes.
- Plain `.btn` buttons need no Angular import, only Clarity styles.

## References

- Styles: `projects/angular/button/_buttons.clarity.scss`, `projects/angular/button/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/buttons/`, `.../demos/button-group/`
