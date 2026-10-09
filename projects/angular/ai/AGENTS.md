<!-- clarity:start — managed by Clarity; edits inside this block are overwritten -->

## Clarity Design System (`@clr/angular`)

This app uses Clarity for UI. Follow these rules whenever you add or change Clarity UI.

### Always

- Import what `@clr/angular` exports. Most components ship in NgModules: import the module, not the
  component class (`imports: [ClrDatagridModule]`). These are standalone and imported directly:
  `ClrIcon`, `ClrBadge`, `ClrLabel`, `ClrIfExpanded`, `ClrIfActive`, `ClrIfOpen`.
- Provide animations: `provideAnimationsAsync()` from `@angular/platform-browser/animations/async`
  in `app.config.ts` (or `BrowserAnimationsModule`). Required while Clarity uses `@angular/animations`
  (datagrid, modal, tree view, loading buttons, and more); without it components throw at runtime.
- App components may be standalone, OnPush, and use Signals. Clarity bindings stay as template
  inputs and outputs (`[clrDgLoading]`, `(clrDgRefresh)`), not signal inputs.
- Icons: `<clr-icon shape="...">`; register the shapes you use. Icon-only buttons need `aria-label`.
- Use Clarity design tokens (CSS custom properties) for color, spacing, and typography. Never
  hard-code hex colors ([tokens guidance](https://guidance.clarity.design/109)). Use only token
  names that exist in `@clr/ui` (`node_modules/@clr/ui/clr-ui.css`); never invent `--cds-global-*`
  or `--cds-alias-*` tokens. Font size and weight come from `cds-text` modifiers.
- Themes: light is the default, set `cds-theme` or `cds-theme="light"` on `<body>`. Set `cds-theme="dark"` for dark; never style colors per
  theme yourself (tokens follow the attribute).
- Name your own components with your app's prefix (`app-`). Never use `clr-`, `cds-` or `appfx-`
  for your own selectors, classes or tokens.
- Native `<button>` defaults to `type="submit"`. Set `type="button"` unless it submits a form.
- Use `@for (...; track ...)` and `@if`, not `*ngFor` / `*ngIf`.
- Never invent `clr*` inputs. If unsure, read the matching guide below before writing code.

### Component guides — read before using the component

Path: `node_modules/@clr/angular/ai/skills/<guide>/SKILL.md`. Design rules: https://guidance.clarity.design.

| Guide                   | Use for                                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `clr-accordion`         | Collapsible stacked panels (`clr-accordion`), single or multi-open, lazy content                                                         |
| `clr-alert`             | Alert banners: standard, small, lightweight, app-level, paged `clr-alerts`                                                               |
| `clr-app-layout`        | App shell: `clr-main-container`, `clr-header`, header actions, subnav, responsive nav, `cds-theme` switching                             |
| `clr-badge`             | Count badges (`clr-badge`, `.badge-*`); use labels for status text                                                                       |
| `clr-breadcrumbs`       | Hierarchy trail (`clr-breadcrumbs`, `BreadcrumbItem`)                                                                                    |
| `clr-button`            | Buttons, icon buttons, loading buttons (`[clrLoading]`), button groups and overflow menus                                                |
| `clr-card`              | Cards (`clr-card` parts, media, collapsible, clickable cards)                                                                            |
| `clr-collapsible-panel` | Custom collapsible panel groups (`CollapsiblePanel` base, service, models)                                                               |
| `clr-combobox`          | Filterable single/multi-select (`clr-combobox`, `clrMulti`, `*clrOptionItems`), async options                                            |
| `clr-datagrid`          | Data tables: `clr-datagrid`, client/server-driven, selection, row details, custom filters, virtual scroll (`ClrVirtualScroll`)           |
| `clr-datepicker`        | Date and date range pickers (`clrDate`, `clrStartDate`/`clrEndDate`)                                                                     |
| `clr-dropdown`          | Action menus (`clr-dropdown`, `clrDropdownTrigger`, `clrDropdownItem`), nested and context menus                                         |
| `clr-forms`             | Forms (`clrForm`, layouts, validation), input/select/checkbox/radio/toggle/textarea/password/range/number/datalist/file (`clrFileInput`) |
| `clr-icons`             | Icons (`clr-icon`), registering shapes, size/status/badge, icon a11y                                                                     |
| `clr-label`             | Colored tag/status labels (`clr-label`, `.label-*`), not form labels                                                                     |
| `clr-modal`             | Modal dialogs (`[(clrModalOpen)]`, sizes, static backdrop) and side panels (`clr-side-panel`)                                            |
| `clr-popover`           | Custom anchored overlays (`ClrPopoverModuleNext`, `ClrPopoverService`), open at a point                                                  |
| `clr-progress`          | Progress bars (`clr-progress-bar`) and spinners (`clr-spinner`)                                                                          |
| `clr-signpost`          | Click-triggered contextual help popovers (`clr-signpost`)                                                                                |
| `clr-stack-view`        | Key/value detail views with expandable blocks (`clr-stack-view`)                                                                         |
| `clr-stepper`           | Inline multi-step forms (`form[clrStepper]`); stepper vs wizard                                                                          |
| `clr-tabs`              | Tabbed panes (`clr-tabs`, `*clrIfActive`), vertical, overflow, dynamic tabs; two-way active tab via `appfxIfTabActive` (addons)          |
| `clr-timeline`          | Workflow progress or chronological events (`clr-timeline`)                                                                               |
| `clr-tooltip`           | Short hover/focus text for icon-only controls (`clr-tooltip`)                                                                            |
| `clr-tree-view`         | Hierarchical trees: static, recursive (`*clrRecursiveFor`), lazy (`clrLazy`), checkbox selection                                         |
| `clr-vertical-nav`      | Side navigation (`clr-vertical-nav`, `clrVerticalNavLink`), groups, collapsible, active state                                            |
| `clr-wizard`            | Modal or in-page guided multi-step flows (`clr-wizard`); wizard vs stepper                                                               |

<!-- clarity:end -->
