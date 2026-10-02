# @clr/addons — micro-bundle utility layer (Rule B)

Path-scoped guidance: auto-loaded when working with files under `projects/addons/**`.

## Keep it thin and tree-shakable

`@clr/addons` is an **optional** layer on top of `@clr/angular` (a peer dependency). The whole point
is that consumers pull in only the one addon they need, so bundle discipline is the priority.

- **One small module per feature.** Each addon lives in its own folder/module (e.g. `datagrid/`,
  `datagrid-filters/`). Do not create a barrel that forces consumers to import the whole package.
- **Depend on the public `@clr/angular` API only.** Do not reach into core internals or relative-import
  across into `projects/angular/**`; do not add heavy transitive dependencies.
- **No new hard dependency on heavy core UI.** An addon should enhance, not silently drag in, large
  core components.
- Same conventions as core: NgModule-based, Broadcom license header, `clr-` selector prefix.
- Update the public API snapshot `projects/addons/clr-addons.api.md` when the public surface changes.

## Gate before you call it done

```
eslint .
ng test clr-addons --configuration=ci
node scripts/api-extractor.js
```
