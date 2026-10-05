<!-- clarity:start — managed by Clarity; edits inside this block are overwritten -->

## Clarity Design System (`@clr/angular`)

This app uses Clarity for UI. Follow these rules whenever you add or change Clarity UI.

### Always

- Clarity components are **NgModule-based**. Import the module, never the component class:
  `imports: [ClrDatagridModule]`, `imports: [ClrButtonModule]`.
- App components may be standalone, OnPush, and use Signals. Clarity bindings stay as template
  inputs and outputs (`[clrDgLoading]`, `(clrDgRefresh)`), not signal inputs.
- Icons: `<cds-icon shape="...">` from the Clarity icon library. Icon-only buttons need `aria-label`.
- Use Clarity design tokens (CSS custom properties) for color, spacing, and typography in your own
  styles. Never hard-code hex colors or pixel spacing that a token covers
  ([tokens guidance](https://guidance.clarity.design/109)).
- Design guidance for each Clarity component ("which variant, when, where") is at
  https://guidance.clarity.design. The component guides below include the relevant rules.
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
