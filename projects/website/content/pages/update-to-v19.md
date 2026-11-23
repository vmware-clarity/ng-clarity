---
title: Update v18 to v19
addLevel3HeadingsToToc: true
---

# Update v18 to v19

Clarity v19 upgrades its build toolchain to Angular 22 and TypeScript 6.

## Node.js requirements

Before updating to Clarity v19, use a Node.js version supported by Angular 22 (`^22.22.3 || ^24.15.0 || >=26.0.0`).
See the [Angular 22 Node.js requirements](https://angular.dev/reference/versions).

Clarity contributors need Node.js `^24.15.0 || >=26.0.0` and npm 11.0.0 or later to work on the repository. Its
`.nvmrc` file pins Node.js 24.15.0 for local development and CI. Run `nvm install` and `nvm use` from the repository
root to select that version.

## Angular and package requirements

Clarity v19 requires Angular 22. Angular 21 applications must upgrade Angular before installing Clarity v19.
Angular framework and CDK peer dependencies are bounded to `^22.0.0`.

`@clr/angular` declares its Angular CDK, common, core, forms, platform-browser and router peers,
along with RxJS `^7.8.0`.

`@clr/ui`, `@clr/angular` and `@clr/addons` are released together with the same version number. Published releases
pin `@clr/angular`'s `@clr/ui` peer and `@clr/addons`' `@clr/angular` peer to that exact version, including
prereleases. Always update the three packages together to the same version; mixing versions fails peer dependency
resolution.

Both libraries declare `tslib` as a runtime dependency. `@clr/addons` also declares `reflect-metadata`, used by
its workflow input and output mappings. These runtime dependencies are installed with the packages.

The certificate viewer in `@clr/addons` needs `asn1js` `^3.0.6` and `pkijs` `^3.2.5`. They are optional peer
dependencies of `@clr/addons`, so install them only if your application uses the certificate viewer.

## CDK constructor changes

Clarity v19 uses CDK 22 constructor signatures. Since v18.4.0, the exported `CdkDragModule_CdkDrag`,
`CdkTrapFocusModule_CdkTrapFocus` and `ClrStandaloneCdkTrapFocus` wrappers have zero-argument constructors.
Their CDK base classes resolve dependencies through Angular injection. If you subclass these wrappers,
call `super()` without arguments and let Angular create the directive. Tests should create directives
through `TestBed` rather than manually passing dependencies to their constructors.

This is a public TypeScript API change for code that constructs or extends the wrappers. Applications
that use the directives through templates do not need to change those bindings.

Custom CDK focus-trap implementations also need to match CDK 22: `FocusTrap` takes an `Injector` as its
sixth constructor argument, after `deferAnchors`, and `ConfigurableFocusTrap` takes an `Injector` after
its configuration argument. `ConfigurableFocusTrapFactory` has a zero-argument constructor; obtain it
through Angular dependency injection and call `create(element, config)` instead of passing dependencies
to the factory constructor. Clarity's website focus-trap override has been adapted to the new signature.

## Enum declarations

The exported `Reason` enum in `@clr/addons/wizard` is now a regular enum rather than a const enum, so
applications using `isolatedModules` can reference its members. Its `finish` and `cancel` string values
are unchanged. Internal icon size and certificate algorithm enums also use regular enum declarations.

## Removed change detection helpers

The following public symbols have been removed: `WillyWonka`, `OompaLoompa`, `AccordionWillyWonka`,
`AccordionOompaLoompa`, `StepperWillyWonka`, `StepperOompaLoompa`, `TabsWillyWonka`, `ActiveOompaLoompa`,
`MainContainerWillyWonka`, `NavDetectionOompaLoompa`, `DatagridWillyWonka`, `ActionableOompaLoompa` and
`ExpandableOompaLoompa`. They were internal helpers that forced extra change detection cycles. Component
state now flows through signals, so no replacement is needed; remove any imports of these symbols.

`clr-header` can now be used outside `clr-main-container`. The other components retain their parent-placement errors.

Some fields became accessors: `IfExpandService.expandable`, `hasExpandTemplate`, and the protected `_expanded` and `_loading`,
`ResponsiveNavigationService.responsiveNavList`, and `ClrHeader.isNavLevel1OnPage` and
`isNavLevel2OnPage`. This is source compatible unless a subclass redeclares them as fields.

When upgrading through v18, remove any `*WillyWonka` / `*OompaLoompa` imports left by the v18 rename schematic.

## Datagrid Filters (Addons)

Three `DatagridFiltersStrings` keys from `@clr/addons/datagrid-filters` have been removed, because the filter bar no
longer uses them:

- `clearAllButtonLabel` ("Clear all"): Clear all is now an icon button. Its accessible name and tooltip use
  `clearAllButtonAriaLabel`.
- `appliedText` ("applied"): a pill with several conditions now shows the first condition and a `+N` badge instead of
  "N applied".
- `dateFormat` ("YYYY-MM-DD"): the date input's screen reader label is now `dateLabel`, and its placeholder comes from
  the date picker, in the locale's format.

Remove any overrides or translations of these keys.

New keys name the date and time inputs for screen readers: `dateLabel` ("Date"), `timeLabel` ("Time"), `fromTimeLabel`
("From time") and `toTimeLabel` ("To time"). Apps that translate the strings show English for them until they are added.

The defaults of three keys have changed. Apps that provide their own `DatagridFiltersStrings` are not affected, but
tests that look for the old text are:

- `addNew`: "Add new" is now "Add filter".
- `addNewAriaLabel`: "Add new filter" is now "Add filter".
- `removeConditionAriaLabel`: "Remove second condition" is now "Remove condition". The condition number is now added
  after it ("Remove condition 2"), so remove any ordinal from translations.

`appfx-datagrid-filters` and `appfx-datagrid` now accept `[(searchTerm)]` and `[(propertyFilters)]`, e.g. to restore a
saved view. Setting them does not emit `searchTermChange` or `propertyFiltersChange`. Filters restored from JSON are
matched to the filter bar's field definitions by their `property` key. `CompositeFiltersComponent.propertyType` is now
optional (`PropertyType | undefined`), since it is unset until a field is selected.

`presetFilters` can now emit at start-up. If the start-up filters differ from what `propertyFilters` passed in, for
example presets without a `propertyFilters` binding, `propertyFiltersChange` emits them once, after the first change
detection. Hosts that load data on every `propertyFiltersChange` load once more at start-up.

The filter pills have new markup. CSS overrides and e2e selectors that target the old elements need updating:

- A pill is a `button.filter-pill` inside a `clr-label`, instead of a `.label.label-blue` with a `.badge` and an
  `.edit-filter` element.
- A pill's editor opens in a popover (`.filter-popover`) instead of a `clr-signpost`.
- Pills are capped at 280px. Longer text is truncated, and the full filter is shown in a tooltip.
- **Add filter** and **Clear all** are now inside `.manage-filter-container`, after the pills, instead of direct
  children of `.composite-filter-container`. They wrap with the pills on narrow screens.

In the editors, **Cancel** now comes before **Apply** in the DOM and in keyboard order. The buttons no longer use
`btn-right`.

String and numeric filters now accept more than two conditions. The AND/OR choice moved from the radio buttons between
the two conditions to **And** / **Or** buttons next to the field, and applies to all conditions. Between conditions,
`[data-test-id="logical-operator"]` is now a `div` with the operator in uppercase text followed by a line, instead of
the radio buttons (or, when the field fixes the operator, a `span`).

`AppfxDatagridFiltersModule` no longer registers the `filter-grid` icon (`filterGridIcon`), because the filter bar no
longer uses it. Apps that show it with `<clr-icon shape="filter-grid">` need to register it themselves, unless they also
import `ClrDatagridModule`, which registers it.
