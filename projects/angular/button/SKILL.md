---
name: clr-button
description: Use Clarity buttons correctly — `.btn` CSS classes and variants, icon buttons, loading buttons (`[clrLoading]`) from `@clr/angular`. Use when adding or styling buttons or toolbar actions in a Clarity app. For a row of related actions with an overflow menu, use `clr-button-group`.
metadata:
  docs: /documentation/button
  guidance-1003: '2024-10-30'
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

## Imports

- All from `@clr/angular`: `ClrLoadingButtonModule` plus `ClrLoadingModule` for `[clrLoading]` (both are re-exported by `ClrButtonModule`). Or use `ClarityModule`.
- These are NgModules (not standalone) — import the modules, not the component classes.
- Plain `.btn` buttons need no Angular import, only Clarity styles.

## References

- Design guidance: https://guidance.clarity.design/1003
- Styles: `projects/angular/button/_buttons.clarity.scss`, `projects/angular/button/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/buttons/`
- For a group of related actions with an overflow menu, see the `clr-button-group` guide.
