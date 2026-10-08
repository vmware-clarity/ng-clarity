<!-- appfx:start — managed by Clarity; edits inside this block are overwritten -->

## AppFX (`@clr/addons`)

AppFX builds on `@clr/angular`; the Clarity rules apply here too.

### Always

- AppFX components are **NgModule-based**. Import the module from its entry point, never the
  component class: `imports: [AppfxDatagridModule]` from `@clr/addons/datagrid`.
- AppFX components use OnPush. Pass new array/object references to inputs; in-place mutation
  does not refresh the view.
- Plain Clarity (`@clr/angular`) is the default. Use an AppFX component only when you need what it
  adds. Don't switch existing Clarity usage to AppFX unless asked. For datagrids: `clr-datagrid` by
  default, `appfx-datagrid` for complex, configuration-driven grids.
- Never invent `appfx*` inputs. If unsure, read the matching guide below before writing code.

### Component guides — read before using the component

Path: `node_modules/@clr/addons/ai/skills/<guide>/SKILL.md`.

- `appfx-a11y`: tab overflow, required-field legend, zoom detection
- `appfx-card-container`: reorderable card dashboards
- `appfx-certificate-viewer`: certificate chains
- `appfx-datagrid`: configuration-driven tables, advanced filters, export
- `appfx-dialog`: multi-page modal dialogs
- `appfx-drag-and-drop`: drag and drop across components
- `appfx-menu`: declarative or code-created context menus at a point, 400%-zoom reflow
- `appfx-property-view`: read-only property categories
- `appfx-stepper`: workflow steppers
- `appfx-tabs`: model-driven tabs
- `appfx-translate`: AppFX locale and translations
- `appfx-wizard`: workflow wizards

<!-- appfx:end -->
