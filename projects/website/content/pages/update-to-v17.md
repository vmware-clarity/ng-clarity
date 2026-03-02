---
title: Update v16 to v17
addLevel3HeadingsToToc: true
---

# Update v16 to v17

The Clarity v17 release is the third step towards consolidating the design systems that have existed in Clarity
libraries for a few years. It removes the shim file (which was an optional mapping from legacy CLR theme custom
properties to CDS core custom properties). A light and dark theme is available with the CDS design token system.

Full list of breaking changes, see the
[detailed changelog](https://github.com/vmware-clarity/ng-clarity/releases/tag/v17.0.0).

## Angular Support

Clarity v17 supports Angular v15-v17.

## Component API Changes

### Accordion

The accordion title now contains a `min-width` property to resolve issues with consistent alignment.

### Alerts

The `ClrAlert` `isLight` property was replaced with `isLightweight`.

### Card

The `--clr-card-box-shadow-color` and `--clr-card-clickable-box-shadow-color` tokens were removed.

### Datagrid

The row iterator API `trackBy` function will no longer be used for selection tracking. Update your code to pass the
`clrDgItemsTrackBy` function into the `clr-datagrid` component instead. Note: the `clrDgItemsTrackBy` function signature
does not include the element index.

### Forms

The helper text below form controls will now persist when there is a success or error message. The helper text provides
contextual information about the field above it, and for accessibility reasons, this text should persist even if the
component is in a success or error state. The success or error message will be displayed below the helper text.

### Login Page

The following typography variables were removed in favor of using the alias typography values.

- `clr-login-title-font-weight`
- `clr-login-title-font-family`
- `clr-login-subtitle-color`
- `clr-login-subtitle-font-weight`
- `clr-login-subtitle-font-family`
- `clr-login-trademark-color`
- `clr-login-trademark-font-weight`
- `clr-login-trademark-font-family`

### Progress bar

The progress bar inputs `clrSuccess`, `clrWarning`, and `clrDanger` were removed. Instead, pass the color into
`clrColor` as a string (possible values are `'success'`, `'warning'`, and `'danger'`).

### Stack View

Most variables were updated to be more specific or deprecated because they’re redundant. See
[PR #1071](https://github.com/vmware-clarity/ng-clarity/pull/1071) for more information.

### Stepper

The spacing values in the stepper header were adjusted to align more accurately with the spec. See
[PR #1168](https://github.com/vmware-clarity/ng-clarity/pull/1168) for more information.

### Typography Changes

The typography tokens and values in Clarity have been changed to align with the CDS token values. The `h*` elements have
had their font attributes changed to align with the CDS typography styles (`display`, `headline`, `section`, etc.). You
can see the updated values on the [typography page](/documentation/typography).

| Semantic Element | Update to match CDS text style |
| ---------------- | ------------------------------ |
| h1               | display                        |
| h2               | headline                       |
| h3               | title                          |
| h4               | section                        |
| h5               | subsection                     |
| h6               | message                        |

## Style Changes

### Tokens Must be Imported in Applications

In v16, Clarity packaged the design tokens with each release, but since `@clr/ui` only deploys the CSS, teams were
unable to update the tokens to leverage later versions of `@cds/core` tokens without duplicating all of the tokens. For
this reason, the Clarity team removed the `@cds/core` tokens and the dark theme tokens from the packaged build. The
following two files should be added to your styles build process by either importing them in your top level styles.scss
file, adding them into the styles array in your `angular.json` file, or including them on the page.

- `@cds/core/global.min.css`
- `@cds/core/styles/theme.dark.min.css`

See the [developing page](/pages/developing) for more information.

### Removed Shim

The shim file introduced in v15/v16 that re-mapped the ng-clarity colors to align with the `@cds/core` colors has been
removed. The changes in this file have been separated and absorbed into each component’s stylesheets.

If you’ve been importing your Clarity styles from `clr-ui.scss` in v16, there is no change required.

If you switched to importing the Clarity styles from the `legacy-*` files in v16, these files have been removed as of
v17, and the Clarity components have been updated to directly use the `--cds-*` tokens. The pre-v16 styles are longer
supported in Clarity.

### Removed Variables

The following Sass variables were removed in v17. The majority of these variables were introduced in v16 as a way to
introduce our shim in a backwards-compatible way, allowing us to preserve the existing theme and then remap the
variables to the relevant design token. As part of the update to v17 and aligning to the design system tokens, these
overrides were removed, along with other duplicated variables, in an effort to align on the token system.

#### Global

- `$clr-close-color--hover-opacity`
- `$clr-close-color--normal-opacity`

#### Accordion

- `$clr-accordion-border-left-color`
- `$clr-accordion-border-left-current-color`
- `$clr-accordion-border-left-width`
- `$clr-accordion-description-margin-left`
- `$clr-accordion-padding`
- `$clr-accordion-step-status-margin-left`
- `$clr-accordion-step-title-font-weight`
- `$clr-accordion-step-title-margin-left`
- `$clr-accordion-step-title-min-width`

#### Badge

- `$clr-badge-font-color-dark`
- `$clr-badge-font-color-light`

#### Button

- `$clr-btn-appearance-form-font-size`
- `$clr-btn-appearance-form-font-weight`
- `$clr-btn-appearance-form-letter-spacing`
- `$clr-btn-appearance-form-line-height`
- `$clr-btn-appearance-standard-font-size`
- `$clr-btn-appearance-standard-font-weight`
- `$clr-btn-appearance-standard-letter-spacing`
- `$clr-btn-appearance-standard-line-height`
- `$clr-btn-font-weight`
- `$clr-nav-group-collapsible-focus-outline`

#### Cards

- `$card-children-padding-horizontal`
- `$card-children-padding-vertical`
- `$card-children-space-between`
- `$clr-card-text-font-size`
- `$clr-card-title-font-size`
- `$clr-card-title-letter-spacing`

#### Checkbox

- `$clr-forms-checkbox-checked-shadow`

#### Combobox

- `$clr-combobox-trigger-dimensions`
- `$clr-combobox-trigger-right-padding`
- `$clr-ng-multiselect-min-width`

#### Dropdown

- `$clr-dropdown-border-radius`
- `$clr-dropdown-box-shadow`
- `$clr-dropdown-caret-icon-dimension`
- `$clr-dropdown-caret-icon-size`
- `$clr-dropdown-caret-left-margin`
- `$clr-dropdown-divider-margin`
- `$clr-dropdown-font-size`
- `$clr-dropdown-font-weight`
- `$clr-dropdown-header-font-size`
- `$clr-dropdown-header-letter-spacing`
- `$clr-dropdown-header-line-height`
- `$clr-dropdown-header-padding`
- `$clr-dropdown-header-padding`
- `$clr-dropdown-item-font-size`
- `$clr-dropdown-item-height-sm`
- `$clr-dropdown-item-letter-spacing`
- `$clr-dropdown-item-line-height`
- `$clr-dropdown-item-padding`
- `$clr-dropdown-items-padding`
- `$clr-dropdown-letter-spacing`
- `$clr-dropdown-line-height`
- `$clr-dropdown-subsection-offset`
- `$clr-dropdown-subsection-offset`
- `$clr-dropdown-trigger-caret-icon-size`

#### Forms

- `$clr-forms-block-label-font-size`
- `$clr-forms-block-label-font-weight`
- `$clr-forms-block-label-letter-spacing`
- `$clr-forms-label-font-size`
- `$clr-forms-subtext-font-size`
- `$clr-forms-subtext-line-height`
- `$clr-forms-text-font-size`
- `$clr-forms-text-font-weight`
- `$clr-forms-text-letter-spacing`

#### Header

- `$clr-header-action-caret-gap`
- `$clr-header-action-caret-right`
- `$clr-header-action-caret-size`
- `$clr-header-action-cog-right`
- `$clr-header-action-icon-size`
- `$clr-header-branding-icon-gap`
- `$clr-header-branding-logo-size`
- `$clr-header-branding-min-width`
- `$clr-header-branding-padding`
- `$clr-header-divider-height`
- `$clr-header-divider-opacity`
- `$clr-header-divider-width`
- `$clr-header-nav-hover-opacity`
- `$clr-header-nav-link-font-size`
- `$clr-header-nav-link-line-height`
- `$clr-header-nav-link-padding`
- `$clr-header-nav-link-padding`
- `$clr-header-nav-opacity`
- `$clr-header-search-height`
- `$clr-header-section-divider-height`
- `$clr-header-title-font-size`
- `$clr-header-title-letter-spacing`
- `$clr-header-title-line-height`
- `$clr-nav-icon-size`

#### Label

- `$clr-label-font-size`
- `$clr-label-font-weight`
- `$clr-label-letter-spacing`
- `$clr-label-padding-left-right`
- `$clr-label-padding-top-bottom`

#### Lists

- `$clr-list-style-padding`

#### Login Page

- `$clr-login-subtitle-color`
- `$clr-login-subtitle-font-family`
- `$clr-login-subtitle-font-size`
- `$clr-login-subtitle-font-weight`
- `$clr-login-subtitle-letter-spacing`
- `$clr-login-subtitle-line-height`
- `$clr-login-title-font-family`
- `$clr-login-title-font-size`
- `$clr-login-title-font-weight`
- `$clr-login-title-letter-spacing`
- `$clr-login-title-line-height`
- `$clr-login-trademark-color`
- `$clr-login-trademark-font-family`
- `$clr-login-trademark-font-size`
- `$clr-login-trademark-font-weight`
- `$clr-login-trademark-letter-spacing`
- `$clr-login-width`

#### Modal

- `$clr-modal-content-box-shadow-color` -> replaced by `$clr-modal-content-box-shadow`
- `$clr-modal-content-padding-bottom`
- `$clr-modal-content-padding-left`
- `$clr-modal-content-padding-right`
- `$clr-modal-content-padding-top`

#### Progress bar

- `$clr-progress-user-color`

#### Radio

- `$clr-forms-radio-disabled-shadow`
- `$clr-forms-radio-focused-shadow`

#### Responsive Nav

- `$clr-custom-links-hover-color`
- `$clr-responsive-nav-hover-bg`

#### Stack View

- `$clr-stack-view-border-box-color`
- `$clr-stack-view-font-size`
- `$clr-stack-view-font-weight`
- `$clr-stack-view-letter-spacing`
- `$clr-stack-view-line-height`
- `$clr-stack-view-stack-block-content-text-color`
- `$clr-stack-view-stack-block-label-and-content-bg-color`
- `$clr-stack-view-stack-block-label-text-color`

#### Timeline

- `$clr-timeline-gutter-width`
- `$clr-timeline-icon-inner-padding`
- `$clr-timeline-padding-width`
- `$clr-timeline-spinner-size`
- `$clr-timeline-step-description-button-top-margin`
- `$clr-timeline-step-description-font-size`
- `$clr-timeline-step-description-img-top-margin`
- `$clr-timeline-step-description-line-height`
- `$clr-timeline-step-header-font-size`
- `$clr-timeline-step-header-line-height`
- `$clr-timeline-step-header-padding-bottom`
- `$clr-timeline-step-min-width`
- `$clr-timeline-step-title-font-weight`
- `$clr-timeline-step-title-line-height`
- `$clr-timeline-step-title-padding-bottom`
- `$clr-timeline-step-title-padding-top`
- `$clr-timeline-vertical-gutter-width`
- `$clr-timeline-vertical-min-width`
- `$clr-timeline-vertical-step-body-left-padding`
- `$clr-timeline-vertical-step-body-top-padding`
- `$clr-timeline-vertical-step-header-min-width`
- `$clr-timeline-vertical-step-header-right-padding`
- `$clr-timeline-vertical-step-header-top-padding`
- `$clr-timeline-vertical-step-min-width`

#### Tooltip

- `$arrow-height` -> replaced by `$clr-tooltip-arrow-height`
- `$arrow-width` -> replaced by `$clr-tooltip-arrow-width`
- `$clr-tooltip-default-width`
- `$clr-tooltip-font-size`
- `$clr-tooltip-letter-spacing`

#### Table

- `$clr-table-bottomcellpadding-cmp`
- `$clr-table-lineheightPaddingShim`
- `$clr-table-topcellpadding-cmp`
- `$clr-thead-font-size`
- `$clr-thead-font-weight`
- `$clr-thead-letter-spacing`

#### Tabs

- `$clr-nav-active-border-color`
- `$clr-nav-active-border-width`
- `$clr-nav-active-box-shadow-color`
- `$clr-nav-horizontal-gap-size`
- `$clr-nav-horizontal-link-padding`
- `$clr-nav-link-dropdown-toggle-padding`
- `$clr-nav-vertical-gap-size`
- `$clr-nav-vertical-link-padding`

#### Tree view

- `$clr-tree-caret-padding`
- `$clr-tree-node-font-size`
- `$clr-tree-node-font-weight`
- `$clr-tree-node-letter-spacing`
- `$clr-tree-node-line-height`
- `$clr-tree-node-touch-target-big`
- `$clr-tree-node-touch-target-small`

#### Typography

- `$clr-kerning-bigtext`
- `$clr-kerning-lotsatext`
- `$clr-kerning-smalltext`
- `$clr-kerning-tinytext`
- `$clr-typography-smalltext`
- `$clr-typography-tinytext`
- `$clr-typography-xsmalltext`
- `$clr-typography-xxsmalltext`

#### Vertical Nav

- `$clr-nav-link-active-font-weight`
- `$clr-nav-link-font-size`
- `$clr-nav-link-font-weight`
- `$clr-nav-link-letter-spacing`

#### Wizard

- `$clr-wizard-stepnav-active-border-radius`
- `$clr-wizard-stepnav-error-color`
