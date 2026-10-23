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

| Guide                      | Use for                                                                                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `appfx-a11y`               | Tab overflow, stepper string overrides, required-field legend (`appfx-required-field-legend`), zoom/reflow detection          |
| `appfx-card-container`     | Dashboards of cards users can reorder, show/hide, and keep the layout of (`appfx-card-container`, `persistenceStore`)         |
| `appfx-certificate-viewer` | X.509 / PEM certificate chains (`appfx-certificate-viewer`)                                                                   |
| `appfx-datagrid`           | Configuration-driven tables (`appfx-datagrid`, `ColumnDefinition`), advanced filters, server-driven paging, export            |
| `appfx-dialog`             | Multi-page tabbed modals (`appfx-dialog`, `Step[]` with `StepModel` pages, async OK/Cancel `CloseHandler`)                    |
| `appfx-drag-and-drop`      | Connecting CDK drop lists across components by group (`DragAndDropGroupService`, live `cdkDropListConnectedTo` array)         |
| `appfx-menu`               | Declarative or code-created context menus at a point (`appfx-menu`, actions, submenus, `MenuOutletService`), 400%-zoom reflow |
| `appfx-property-view`      | Read-only key/value details in categories and sections (`appfx-property-view`, `PropertyViewBuilder`)                         |
| `appfx-stepper`            | Workflow-driven inline steppers (`appfx-stepper`, `Step[]`, `StepModel`, `readyToComplete`, per-step validation)              |
| `appfx-tabs`               | Model-driven tabs (`appfx-tabs`, `TabLayout`, `validate$()`); `appfxIfTabActive` for two-way active state on plain `clr-tab`  |
| `appfx-translate`          | AppFX locale and translations: `translate`/`dateTime` pipes in templates, `AppfxTranslateService` in code                     |
| `appfx-wizard`             | Workflow-driven modal wizards (`appfx-wizard`, `Step[]`, `StepModel`, `Var` models, summary page)                             |

<!-- appfx:end -->
