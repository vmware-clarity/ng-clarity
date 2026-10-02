<!-- clarity:start — managed by Clarity; edits inside this block are overwritten -->

## Clarity Design System (`@clr/angular`)

This app uses Clarity for UI. Follow these rules whenever you add or change Clarity UI.

### Always

- Clarity components are **NgModule-based**. Import the module, never the component class:
  `imports: [ClrDatagridModule]`, `imports: [ClrButtonModule]`.
- App components may be standalone, OnPush, and use Signals. Clarity bindings stay as template
  inputs and outputs (`[clrDgLoading]`, `(clrDgRefresh)`), not signal inputs.
- Icons: `<cds-icon shape="...">`. Icon-only buttons need `aria-label`.
- Native `<button>` defaults to `type="submit"`. Set `type="button"` unless it submits a form.
- Use `@for (...; track ...)` and `@if`, not `*ngFor` / `*ngIf`.
- Never invent `clr*` inputs. If you are unsure an input exists, read the matching guide below
  before writing code.

### Component guides — read before using the component

| Use for                                                                                                                                     | Guide                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Tables with full template control: `<clr-datagrid>`, `clr-dg-*`, `*clrDgItems`, server-driven grids, selection, row details, virtual scroll | `node_modules/@clr/angular/ai/skills/clr-datagrid/SKILL.md` |
| Buttons, icon buttons, loading buttons (`[clrLoading]`), button groups and overflow menus                                                   | `node_modules/@clr/angular/ai/skills/clr-button/SKILL.md`   |

<!-- clarity:end -->
