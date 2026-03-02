---
title: Update v15 to v16
addLevel3HeadingsToToc: true
---

# Update v15 to v16

## Token Migration

The Clarity v16 release is the first step towards consolidating the design systems that have existed in Clarity
libraries for a few years. During this process, the Angular library components (`@clr/angular` and `@clr/ui` ) have been
updated to allow certain aspects of the components to be configurable via a CSS variable. This has allowed the team to
build a "shim" file that maps the existing angular tokens to the design system tokens (for example,
`--clr-accordion-title-text-color: var(--cds-alias-object-interaction-color)`).

## Token Migration Opt-Out

By default, this shim file will be included in the v16 release. If you wish to opt out of these changes, you must update
your styles import from `clr-ui.min.css` (and `clr-ui-dark.min.css` ) to `legacy-clr-ui.min.css`  (and
`legacy-clr-ui-dark.min.css`)  on your own. If you have already been taking advantage of the "shim" file, please remove
your shim imports, as these are now included by default (Remove `@cds/core/global.min.css` and `shim.cds-core.css`  from
your imports).

## Breaking Changes

- Remove imports of `@cds/core/global.min.css` (or `module.tokens.min.css`) this file is included in the
  `clr-ui.min.css` file.
- Add `cds-theme="light"` to the body tag of your application.
- Datagrid: Rename the `clrDgRowAriaLabel` property to `clrDgRowSelectionLabel`
  ([PR #910](https://github.com/vmware-clarity/ng-clarity/pull/910)).
- `ClrCommonStrings` changes ([PR #769](https://github.com/vmware-clarity/ng-clarity/pull/769)) Some optional properties
  have been marked as required. Some unused properties have been removed.

| Property Name                      | Disposition             |
| ---------------------------------- | ----------------------- |
| `datagridFilterAriaLabel`          | Required (was optional) |
| `columnSeparatorAriaLabel`         | Required (was optional) |
| `columnSeparatorDescription`       | Required (was optional) |
| `datagridExpandableRowsHelperText` | Required (was optional) |
| `datagridExpandableRowContent`     | Required (was optional) |
| `datagridExpandableEndOf`          | Required (was optional) |
| `datagridExpandableBeginningOf`    | Required (was optional) |
| `datagridFilterDialogAriaLabel`    | Required (was optional) |
| `delete`                           | Removed                 |
| `selection`                        | Removed                 |

- Button active state modified from `box-shadow` to `background-color`
  ([PR #914](https://github.com/vmware-clarity/ng-clarity/pull/914)).
  - CSS variables beginning with `--clr-btn` prefix that contain `box-shadow` will have `box-shadow` changed to
    `active-bg`.
  - The `box-shadow` on buttons has been removed.
- The text contained within a clickable label has to be encapsulated in `span` element with `text` class.<br/>

```html
<a href="..." class="label label-purple clickable">
  <span class="text">Austin</span>
  <span class="badge">1</span>
</a>
```

- Rename `btn-small` CSS class to `btn-sm`.
- Button color changes:
  - The `btn-info` class now aligns with the filled primary button.
  - The "warning" button has been updated from matching the danger style to using the warning alias.
