<!-- appfx:start — managed by Clarity; edits inside this block are overwritten -->

## AppFX (`@clr/addons`)

AppFX builds on `@clr/angular`; the Clarity rules apply here too.

### Always

- AppFX components are **NgModule-based**. Import the module, never the component class:
  `imports: [AppfxDatagridModule]`.
- AppFX components use OnPush. Pass new array/object references to inputs; in-place mutation
  does not refresh the view.
- Never invent `appfx*` inputs. If you are unsure an input exists, read the matching guide below
  before writing code.

### Component guides — read before using the component

| Use for                                                                                                                      | Guide                                                        |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Column-definition tables: `<appfx-datagrid>`, `ColumnDefinition`, quick/advanced filters, export, action bar, saved settings | `node_modules/@clr/addons/ai/skills/appfx-datagrid/SKILL.md` |

**Choosing a datagrid:** prefer `appfx-datagrid` for standard list views. Use `clr-datagrid`
(`@clr/angular`) when each cell needs custom markup or the column model can't express the layout.

<!-- appfx:end -->
