---
title: Update v17 to v18
addLevel3HeadingsToToc: true
---

# Update v17 to v18

The Clarity v18 release is a major update that migrates away from `@cds/core`, introduces Angular CDK-based popovers,
upgrades to Angular 21, adds secondary entrypoints for all modules, and decouples the Accordion and Stepper components.

Full list of breaking changes, see the detailed changelogs:
[beta.1](https://github.com/vmware-clarity/ng-clarity/releases/tag/v18.0.0-beta.1),
[beta.2](https://github.com/vmware-clarity/ng-clarity/releases/tag/v18.0.0-beta.2),
[beta.3](https://github.com/vmware-clarity/ng-clarity/releases/tag/v18.0.0-beta.3).

## Angular Support

Clarity v18 upgrades to Angular 21. This is the minimum supported Angular version.

## Dependency Changes

### Drop `@cds/core`

`@clr/angular` no longer depends on `@cds/core`. All supported features have been migrated into `@clr/angular`
directly, including `cds-icon`, CSS tokens, and CSS utilities (`cds-layout`, `cds-list`, `cds-text`, `cds-divider`).

- Remove `@cds/core` from your dependencies.
- Change icon imports from `@cds/core/icon` to `@clr/angular/icon`.
- Remove style imports from `@cds/core`; `@clr/ui` now includes all necessary styles.
- `cds-icon` is now an Angular component. Replace all `[attr.]` bindings with normal Angular bindings:

```html
<!-- Before -->
<cds-icon [attr.shape]="shape" [attr.size]="size"></cds-icon>
<!-- After -->
<cds-icon [shape]="shape" [size]="size"></cds-icon>
```

- `ClrIconModule` is now deprecated; replace with standalone `ClrIcon`.

### Drop `@clr/icons`

The `@clr/icons` package dependency has been fully removed. This package was deprecated and is no longer supported.

## Module Structure Changes

### Secondary Entrypoints

Deep imports using the `/src/` path are no longer supported. Update imports to use the package entrypoint.

```typescript
// Before
import { ClrAccordionModule } from '@clr/angular/src/accordion';
import { ClrStepperModule } from '@clr/angular/src/accordion/stepper';

// After
import { ClrAccordionModule } from '@clr/angular/accordion';
import { ClrStepperModule } from '@clr/angular/stepper';
```

The `ClrIfOpen` directive has been moved from `@clr/angular/utils` to `@clr/angular/popover/common`.

`FocusService` (Forms module) is renamed to `FormsFocusService` and imported through `@clr/angular/forms/common`.

### Smart Popovers Path Change

Smart popovers are moved from `@clr/angular/utils/popover` to `@clr/angular/popover/common`.

### Renamed Exports (Ç prefix removal)

All exports using the `Ç` (C-cedilla) prefix have been renamed. Update any direct references:

| Old symbol                                | New symbol                                | Entry point                   |
| ----------------------------------------- | ----------------------------------------- | ----------------------------- |
| `ÇlrClrPopoverModuleNext`                 | `ClrPopoverModuleNext`                    | `@clr/angular/popover/common` |
| `ÇlrClrPopoverCloseButton`                | `ClrPopoverCloseButton`                   | `@clr/angular/popover/common` |
| `ÇlrClrPopoverOpenCloseButton`            | `ClrPopoverOpenCloseButton`               | `@clr/angular/popover/common` |
| `ÇlrAccordionWillyWonka`                  | `AccordionWillyWonka`                     | `@clr/angular/accordion`      |
| `ÇlrAccordionOompaLoompa`                 | `AccordionOompaLoompa`                    | `@clr/angular/accordion`      |
| `ÇlrStepperWillyWonka`                    | `StepperWillyWonka`                       | `@clr/angular/stepper`        |
| `ÇlrStepperOompaLoompa`                   | `StepperOompaLoompa`                      | `@clr/angular/stepper`        |
| `ÇlrTabsWillyWonka`                       | `TabsWillyWonka`                          | `@clr/angular/layout`         |
| `ÇlrActiveOompaLoompa`                    | `ActiveOompaLoompa`                       | `@clr/angular/layout`         |
| `ÇlrDatagridVirtualScrollDirective`       | `ClrDatagridVirtualScrollDirective`       | `@clr/angular/data`           |
| `ÇlrDatagridSelectionCellDirective`       | `ClrDatagridSelectionCellDirective`       | `@clr/angular/data`           |
| `ÇlrDatagridSingleSelectionValueAccessor` | `ClrDatagridSingleSelectionValueAccessor` | `@clr/angular/data`           |
| `ÇlrDatagridWillyWonka`                   | `DatagridWillyWonka`                      | `@clr/angular/data`           |
| `ÇlrActionableOompaLoompa`                | `ActionableOompaLoompa`                   | `@clr/angular/data`           |
| `ÇlrExpandableOompaLoompa`                | `ExpandableOompaLoompa`                   | `@clr/angular/data`           |
| `ÇlrWrappedCell`                          | `WrappedCell`                             | `@clr/angular/data`           |
| `ÇlrWrappedColumn`                        | `WrappedColumn`                           | `@clr/angular/data`           |
| `ÇlrWrappedRow`                           | `WrappedRow`                              | `@clr/angular/data`           |
| `ÇlrDatagridCellRenderer`                 | `DatagridCellRenderer`                    | `@clr/angular/data`           |
| `ÇlrDatagridHeaderRenderer`               | `DatagridHeaderRenderer`                  | `@clr/angular/data`           |
| `ÇlrDatagridMainRenderer`                 | `DatagridMainRenderer`                    | `@clr/angular/data`           |
| `ÇlrDatagridRowRenderer`                  | `DatagridRowRenderer`                     | `@clr/angular/data`           |
| `ÇlrDatagridRowDetailRenderer`            | `DatagridRowDetailRenderer`               | `@clr/angular/data`           |
| `ÇlrDatagridDetailRegisterer`             | `DatagridDetailRegisterer`                | `@clr/angular/data`           |

## Component API Changes

### Accordion

The Accordion and Stepper components have been decoupled. Both now extend a new `CollapsiblePanel` base abstraction
instead of Stepper extending Accordion.

- `ClrStepperPanel` no longer extends `ClrAccordionPanel`; both now extend `CollapsiblePanel`.
- `AccordionPanelModel`, `AccordionStatus`, and `panelAnimation` are removed from `@clr/angular/accordion`. Use
  `CollapsiblePanelModel`, `StepperPanelStatus`, and `collapsiblePanelAnimation` from `@clr/angular/collapsible-panel`
  and `@clr/angular/stepper`.
- `getAccordionContentId()` and `getAccordionHeaderId()` on `ClrAccordionPanel` are renamed to `getContentId()` and
  `getHeaderId()`.
- The `clrAccordionPanelHeadingEnabled` feature flag is removed. All heading values must have explicit content assigned
  through `clrAccordionPanelHeadingLevel` input.
- `--clr-accordion-active-background-color` and `--clr-collapsible-panel-active-background-color` CSS custom properties
  have been removed. Use `--clr-accordion-header-open-background-color` or
  `--clr-collapsible-panel-header-open-background-color` instead.
- `--clr-accordion-step-title-min-width` CSS custom property is removed.

### Badge

The `clrBadgeColor` input is renamed to `clrColor`.

```html
<!-- Before -->
<clr-badge [clrBadgeColor]="'purple'">5</clr-badge>
<!-- After -->
<clr-badge [clrColor]="'purple'">5</clr-badge>
```

### Datagrid

- `clrDgItemsTrackBy` on `ClrDatagrid` is renamed to `clrDgItemsIdentityFn` to reduce confusion with `clrDgItemsTrackBy` on `ClrDgItems`.
- Columns now have an **unsorted** state which activates on the third click on a sortable column. It can be disabled
  per column through the `clrDgDisableUnsort` input. Unsorted sortable columns display a visible `two-way-arrows` icon.
- The opened row detail anchor has been removed; a background color is now used to identify the open detail row. This is
  a visual style change that may affect visual regression tests.

### Forms

- `ClrLabel` is renamed to `ClrControlLabel`. `ClrLabel` now corresponds to the `<clr-label>` angular component.
- Only `clr-*` classes are propagated to the control container. Other custom classes are no longer propagated.
- `IfControlStateService` has been removed.
- Error and success icons in form controls have been repositioned. Custom CSS overrides targeting icon positioning may
  need adjustment.
- The `range-track-style` SCSS mixin has been removed from `_mixins.forms.scss` (it only targeted legacy Edge
  pseudo-elements).

### Popover (Angular CDK Migration)

All popovers now use **Angular CDK overlay**. This affects: Dropdown, Signpost, Tooltip, Datagrid Filters, Datagrid row
overflow actions, and Datagrid manage columns.

Popovers are now rendered in the `<body>` while triggers stay in their initial position in the DOM. Selectors like
`.clr-dropdown .clr-dropdown-menu` will stop working.

**Removed services:** `ClrPopoverEventsService`, `ClrPopoverPositionService`, `ClrPopoverToggleService` (replaced by
`CdkOverlay` and `ClrPopoverService`).

**Removed enums:** `ClrAlignment`, `ClrAxis`, `ClrPopoverPositions`, `ClrSide`, `ClrViewportViolation`.

**Removed interfaces:** `ClrPopoverContentOffset`, `PopoverOptions`, `ClrPopoverPositionsInterface`,
`ClrPopoverPosition`, `ClrVisibilityCoords`, `Position`.

**Removed classes:** `AbstractPopover`, `Popover` (replaced by `ClrPopoverContent` directive).

**Removed functions:** `nudgeContent`, `flipSidesAndNudgeContent`, `alignHorizontal`, `alignVertical`,
`testVisibility`.

#### Popover Anchor to Origin Rename

The popover "anchor" naming has been replaced with "origin" to align with Angular CDK terminology.

```html
<!-- Before -->
<button clrPopoverAnchor>Trigger</button>
<!-- After -->
<button clrPopoverOrigin>Trigger</button>
```

```typescript
// Before
popoverService.anchorElementRef = elementRef;
popoverService.focusAnchor();
{ provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef }
getAnchorPosition(key);

// After
popoverService.origin = elementRef;
popoverService.origin = { x: 100, y: 200 };
popoverService.focusOrigin();
{ provide: POPOVER_HOST_ORIGIN, useExisting: ElementRef }
getOriginPosition(key);
```

### Combobox

A new `editable` state has been added via `clrEditable` and an identity function via `clrIdentityFn`.

### Stepper

- `AccordionStatus` property on `ClrStepperPanel` is renamed to `PanelStatus`.
- `accordionDescription` is renamed to `stepDescription`.
- Status icons have been updated.

### Wizard

The template output `(clrWizardCurrentPageChanged)` is now `(clrWizardCurrentPageChange)`. The
`WizardNavigationService.currentPageChanged` getter is now `currentPageChange`.

```html
<!-- Before -->
<clr-wizard (clrWizardCurrentPageChanged)="onPageChange($event)">
  <!-- After -->
  <clr-wizard (clrWizardCurrentPageChange)="onPageChange($event)"></clr-wizard
></clr-wizard>
```

### Stack View

Stack block heading now uses `role` and `aria-level` attributes for improved accessibility.

## Style Changes

### Density

The default density theme is now replaced with **Regular**. There are now only two density themes: default and compact.

### Header Styles

The header styles from `header-4` to `header-8` have been removed as obsolete.

| Before     | After                                                                    |
| ---------- | ------------------------------------------------------------------------ |
| `header-4` | `header-3`                                                               |
| `header-5` | `header-3`                                                               |
| `header-6` | `header-1`                                                               |
| `header-7` | `header-2`                                                               |
| `header-8` | Use your own style override, or choose one of the supported styles above |

### Typography

The `[cds-text*='heading']` attribute selector has been removed. Use `[cds-text*='headline']` instead.

```html
<!-- Before -->
<p cds-text="heading">Title</p>
<!-- After -->
<p cds-text="headline">Title</p>
```

The `$clr-altFont` SCSS variable has been removed.

### Wizard CSS Custom Properties

Wizard CSS custom properties have been renamed. Update any custom theme overrides:

| Before                                           | After                                             |
| ------------------------------------------------ | ------------------------------------------------- |
| `--clr-wizard-stepnav-text--active`              | `--clr-wizard-stepnav-text-selected`              |
| `--clr-wizard-stepnav-item-border-color--active` | `--clr-wizard-stepnav-item-complete-border-color` |
| `--clr-wizard-stepnav-active-bgcolor`            | `--clr-wizard-stepnav-selected-bgcolor`           |
| `--clr-wizard-stepnav-link-hover-bg-color`       | `--clr-wizard-stepnav-hover-bgcolor`              |
| `--clr-wizard-stepnav-link-active-bg-color`      | `--clr-wizard-stepnav-active-bgcolor`             |

### Removed CSS and Sass Variables

All deprecated `clr` color-based CSS and Sass properties/variables have been removed in favor of `--cds-*` tokens. This
includes:

- `--clr-color-*`
- `$clr-action-*`, `$clr-green-*`, `$clr-yellow-*`, `$clr-red-*`
- `$clr-global-color-*`, `$clr-danger-*`, `$clr-warning-*`, `$clr-success-*`
- `$clr-blue`, `$clr-white`, `$clr-near-white`, `$clr-light-gray`
- `$clr-lighter-midtone-gray`, `$clr-light-midtone-gray`, `$clr-dark-midtone-gray`
- `$clr-gray`, `$clr-dark-gray`, `$clr-near-black`, `$clr-black`

All deprecated `baselineRem` Sass tokens have been removed.

Deprecated `--cds-global-typography-*` tokens have been removed; replace with `--cds-alias-typography-*`.

### Removed IE11 and Legacy Edge Workarounds

All IE11 and legacy (pre-Chromium) Edge workarounds have been removed. The following public API symbols are removed from
`@clr/angular/utils`:

| Removed                                    | Migration                                              |
| ------------------------------------------ | ------------------------------------------------------ |
| `IEKeys` enum                              | Use standard `KeyboardEvent.key` string values         |
| `normalizeKey()` function                  | Use `event.key` directly                               |
| `$clr-use-custom-properties` SCSS variable | Removed — CSS custom properties are now always emitted |

### Label

Obsolete font-color tokens have been removed from the Label component.

### Links

Static typography styles have been removed from links.

### SCSS

Mixin files have been separated from rule files. Review your custom SCSS imports if you were importing specific internal
SCSS partials.
