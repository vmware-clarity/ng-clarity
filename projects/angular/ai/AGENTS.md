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
  hard-code hex colors ([tokens guidance](https://guidance.clarity.design/109)).
- Native `<button>` defaults to `type="submit"`. Set `type="button"` unless it submits a form.
- Use `@for (...; track ...)` and `@if`, not `*ngFor` / `*ngIf`.
- Never invent `clr*` inputs. If unsure, read the matching guide below before writing code.

### Component guides — read before using the component

Path: `node_modules/@clr/angular/ai/skills/<guide>/SKILL.md`. Design rules: https://guidance.clarity.design.

- `clr-accordion`: collapsible stacked panels
- `clr-alert`: alerts, app-level banners
- `clr-app-layout`: app shell, header, subnav
- `clr-badge`: counts (use labels for status text)
- `clr-breadcrumbs`: breadcrumb trail
- `clr-button`: buttons, button groups, loading buttons
- `clr-card`: cards
- `clr-collapsible-panel`: custom collapsible components
- `clr-combobox`: filterable select, multi-select
- `clr-datagrid`: data tables, selection, server paging
- `clr-datepicker`: date and date range inputs
- `clr-dropdown`: action menus, context menus
- `clr-forms`: forms, inputs, validation
- `clr-icons`: icons
- `clr-label`: status/tag labels (not form labels)
- `clr-modal`: modals, side panels
- `clr-popover`: custom anchored overlays
- `clr-progress`: progress bars, spinners
- `clr-signpost`: click-to-open help popovers
- `clr-stack-view`: key/value details
- `clr-stepper`: inline multi-step forms
- `clr-tabs`: tabs
- `clr-timeline`: timelines, step progress
- `clr-tooltip`: hover/focus tooltips
- `clr-tree-view`: trees, lazy and checkbox trees
- `clr-vertical-nav`: side navigation
- `clr-wizard`: modal multi-step wizards

<!-- clarity:end -->
