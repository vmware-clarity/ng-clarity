---
title: Update v13 to v15
addLevel3HeadingsToToc: true
---

# Update v13 to v15

We've split up to separate prep work that can be done _before_ updating to Clarity v15 and work that must be done _with_
the update to Clarity v15. (Note that there is no Clarity v14.)

## Prerequisites

- Update to the latest v13 version of the `@clr/ui` and `@clr/angular` packages.

## Prep work

You can complete the steps in this section independently and in any order.

### Remove Unnecessary Code

- Remove any bindings for `clrStackViewSetsize` and `clrStackViewPosinset`. These inputs had no effect. The
  functionality was previously removed. (You can just search your code for those input names and remove the bindings and
  any related code.)

### Migrate Away from Deprecated Features

- Replace any instances of the [sidenav](https://v13.clarity.design/documentation/sidenav) with the
  [vertical nav](https://clarity.design/documentation/vertical-nav).
- Replace any inline wizards in your application. To find inline wizards, search for the `clr-wizard—inline` CSS class.
  Consider the stepper component and the modal wizard as possible replacements. (The inline wizard was restored in
  v15.13.0.)
- Update to the new datagrid sorting API if needed. Find any usages of the following and make the given replacements.
  Refer to the datagrid documentation if needed.
  - `sortIcon`: Use `sortDirection` instead.
  - `clrDgSorted`: Use `clrDgSortOrder` instead.
  - `clrDgSortedChange`: Use `clrDgSortOrderChange` instead.
- Update datagrid column toggle translations to use the `showColumns` and `selectAll` common strings.
  The `clr-dg-column-toggle-title` and `clr-dg-column-toggle-button`  components were deprecated and now can no longer
  be used in ng-clarity v15.
- Update your code to use `[clrDisabled]` instead of disabled to disable `clrDropdownItem`s. (Search your code for
  `clrDropdownItem` and check for any bindings for the `disabled` attribute. Change those bindings to the
  `[clrDisabled]` input.)

### Migrate Away from Deprecated Common Strings

- Rename any `dategrid*` common strings to `datagrid*`
- The `datepickerToggle` common string property was removed. Use `datepickerToggleChooseDateLabel` and
  `datepickerToggleChangeDateLabel` instead.

### Migrate Shim (if needed)

- The shim has been added to the `@clr/ui` package (and removed from the `@cds/core` package) to allow the shim and
  ng-clarity to be evolved together without version synchronization issues. If you use the shim in your application,
  change the `@cds/core/styles/shim.clr-ui.min.css` file path to `@clr/ui/shim.cds-core.min.css`. There are CSS custom
  property renames in ng-clarity v15 that require this change.

### Migrate to the Angular CDK (if needed)

- Replace any usage of `ClrAriaLiveService` with
  [Angular CDK `LiveAnnouncer`](https://material.angular.io/cdk/a11y/overview#liveannouncer).
- Replace any usage of `ClrDragAndDropModule` with
  [Angular CDK `DragDropModule`](https://material.angular.io/cdk/drag-drop/overview).
- Replace any usage of `clrFocusTrap` with
  [Angular CDK `cdkTrapFocus`](https://material.angular.io/cdk/a11y/overview#focustrap).

### Update to Angular 15

- Follow the steps at [https://update.angular.io/](https://update.angular.io/). (Note: ng-clarity v13.14.0 or later is
  required in order to update to Angular 15 independently of updating to ng-clarity 15.

## Update to ng-clarity v15

You must do all of the steps in this section together.

### Update Packages

- Update to the latest v15 version of the  `@clr/ui` and `@clr/angular` packages.

### Remove Code That is No Longer Necessary

- Remove any page size label workarounds in your datagrids. You no longer need an explicit label element
  for `clr-dg-page-size`.
- Remove any imports of the `ClrForTypeAheadModule` and test that type ahead works on your tree views if you have any.

### Remove Vertical Nav Group Labels

- Remove any bindings for `clrVerticalNavGroupLabel`. The vertical nav group button does not need an `aria-label` since
  it has visible text. (You can just search your code for that input name and remove the bindings and any related code.)
- Remove the `verticalNavGroupToggle` common string. It is no longer needed.

### Migrate CSS Custom Properties

- Make the following renames:

| Month                                       | Savings                                          |
| ------------------------------------------- | ------------------------------------------------ |
| `--clr-datagrid-row-hover`                  | `--clr-datagrid-row-hover-color`                 |
| `--clr-datagrid-action-toggle`              | `--clr-datagrid-action-toggle-color`             |
| `--clr-wizard-main-textColor`               | `--clr-wizard-main-text-color`                   |
| `--clr-wizard-stepnav-border-color`         | `--clr-wizard-stepnav-item-border-color`         |
| `--clr-wizard-stepnav-border-color--active` | `--clr-wizard-stepnav-item-border-color--active` |
| `--clr-wizard-step-nav-border-color`        | `--clr-wizard-stepnav-border-color`              |
| `--clr-wizard-sidenav-bgcolor`              | `--clr-wizard-stepnav-bgcolor`                   |
| `--clr-wizard-sidenav-text`                 | `--clr-wizard-stepnav-text`                      |
| `--clr-wizard-sidenav-text--active`         | `--clr-wizard-stepnav-text--active`              |

### Migrate SCSS Variables

- Make the same renames as above for the corresponding SCSS variables (prefixed with `$` instead of `--`).
- The `$clr-monoFont`  SCSS variable was removed since it is not used in the ng-clarity code. If your application uses
  this variable, you should simply declare it in your application’s styles. See
  [https://github.com/vmware-clarity/ng-clarity/commit/3498379bba07c773bafc5757dbf39dc5357d8be2](https://github.com/vmware-clarity/ng-clarity/commit/3498379bba07c773bafc5757dbf39dc5357d8be2)
  for the value.

### Other Changes

- If your application relies on the stepper component announcing error states via `aria-live`, you will need to update
  your application code to make any needed announcements.
- The `ModalModule` no longer exports `ClrFocusOnViewInitModule`. If you use the `clrFocusOnViewInit` directive, test
  that it still works. You may need to explicitly import `ClrFocusOnViewInitModule` now.
- If your application handles a bubbled escape keyup event from a nested popover, that event will not reach your event
  handler anymore because the nested popover escape key fix involved stopping propagation of such events.

## Next Steps

While not required to use ng-clarity v15, these steps will help align with the future of Clarity. (You can actually do
these steps before or after updating to ng-clarity v15.)

- Work toward adopting the `@cds/core` shim in your application. This is the first step to bringing Clarity Core’s
  design tokens to ng-clarity. It also fixes many color contrast violations.
  [https://v15.storybook.clarity.design/?path=/story/cds-core-shim--page](https://v15.storybook.clarity.design/?path=/story/cds-core-shim--page)
- Migrate from the `clr-icon`  component to the `cds-icon`  component if needed. The `clr-icon` component is no longer
  supported. No new version of the `@clr/icons`  package will be released.
