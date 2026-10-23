---
title: Update v18 to v19
addLevel3HeadingsToToc: true
---

# Update v18 to v19

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
