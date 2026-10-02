# Datagrid — high-complexity exception rules (Rule C)

Path-scoped guidance: auto-loaded ONLY when working with files under `**/datagrid/**`. These rules
override nothing in Rule A; they add datagrid-specific caution because this is the most complex and
highest-regression-risk component in the library (~79 cooperating `datagrid-*.ts` files plus a
provider/service graph).

## Respect the architecture

- The datagrid is a graph of cooperating providers/services (state, selection, pagination, filters,
  sort, the smart iterator). **Do not inline state or bypass these services** — wire through them.
- **Data binding modes are distinct:** server-driven data uses `(clrDgRefresh)` + `[clrDgLoading]`;
  client-side data uses `*clrDgItems` with a `trackBy`. Don't mix them.
- **Change-detection sensitivity:** virtual scroll (`clrVirtualScroll`) and the smart iterator are
  CD-hot paths. Avoid work that triggers re-render storms; benchmark before/after any change here.

## Testing this area

- Run the **full** suite, not a narrow spec — datagrid changes ripple:
  ```
  ng test clr-angular --configuration=ci
  ```
- Check `projects/angular/data/data.api.md` for unintended public-API drift
  (`node scripts/api-extractor.js`).
- Addons datagrid extensions live at `projects/addons/datagrid/` and `projects/addons/datagrid-filters/`;
  keep the public contract between them and core stable.
