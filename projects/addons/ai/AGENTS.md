<!-- appfx:start — managed by Clarity; edits inside this block are overwritten -->

## AppFX (`@clr/addons`)

AppFX builds on `@clr/angular`; the Clarity rules apply here too.

### Always

- AppFX components are **NgModule-based**. Import the module from its entry point, never the
  component class: `imports: [AppfxDatagridModule]` from `@clr/addons/datagrid`.
- AppFX components use OnPush. Pass new array/object references to inputs; in-place mutation
  does not refresh the view.
- Plain Clarity (`@clr/angular`) is the default. Use an AppFX component when you need what it adds
  (see each guide). Don't switch existing Clarity usage to AppFX unless asked.
- Never invent `appfx*` inputs. If you are unsure an input exists, read the matching guide below
  before writing code.

### Component guides — read before using the component

Each guide is at `node_modules/@clr/addons/ai/skills/<guide>/SKILL.md`.

| Guide                      | Use for                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| `appfx-a11y`               | Tab overflow, stepper string overrides, required-field legend, zoom/reflow detection              |
| `appfx-card-container`     | Dashboards of cards users can reorder, show/hide, and keep the layout of (`appfx-card-container`) |
| `appfx-certificate-viewer` | X.509 / PEM certificate chains (`appfx-certificate-viewer`)                                       |
| `appfx-datagrid`           | Configuration-driven tables (`appfx-datagrid`, `ColumnDefinition`), advanced filters, export      |
| `appfx-dialog`             | Multi-page tabbed modals (`appfx-dialog`, `Step[]`, async OK/Cancel `CloseHandler`)               |
| `appfx-drag-and-drop`      | Connecting CDK drop lists across components by group (`DragAndDropGroupService`)                  |
| `appfx-menu`               | Context menus at x/y (`appfx-menu`, actions, submenus, `MenuOutletService`)                       |
| `appfx-property-view`      | Read-only key/value details in categories and sections (`appfx-property-view`)                    |
| `appfx-stepper`            | Workflow-driven inline steppers (`appfx-stepper`, `Step[]`, per-step validation)                  |
| `appfx-tabs`               | Model-driven tabs (`appfx-tabs`, `TabLayout`, `validate$()`)                                      |
| `appfx-translate`          | AppFX locale and translations, `translate`/`dateTime` pipes (`AppfxTranslateService`)             |
| `appfx-wizard`             | Workflow-driven modal wizards (`appfx-wizard`, `Step[]`, `Var` models, summary page)              |

**Choosing a datagrid:** use `clr-datagrid` (`@clr/angular`) by default. Use `appfx-datagrid` for
complex, configuration-driven grids: columns defined as data (`ColumnDefinition[]`), plus several of
advanced filters, export, action bar, persisted settings, or column ordering. Don't switch an
existing `clr-datagrid` to `appfx-datagrid` unless asked.

<!-- appfx:end -->
