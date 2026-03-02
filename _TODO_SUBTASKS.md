# CDE-2969 - TODO Leftovers Subtask Breakdown

## Subtask 1: [Wizard] - Clean up TODO comments (CSS property renames/removals for v18)

**Files:**

- `projects/angular/wizard/_properties.wizard.scss` (5 TODOs)
  - L31: `@TODO v18 rename to --clr-wizard-stepnav-text-selected`
  - L36: `@TODO v18 rename to --clr-wizard-stepnav-item-complete-border-color`
  - L39: `@TODO v18 remove in favor of --clr-wizard-stepnav-selected-bgcolor`
  - L48: `@TODO v18 rename to --clr-wizard-stepnav-hover-bgcolor`
  - L50: `@TODO v18 rename to --clr-wizard-stepnav-active-bgcolor`

**Action:** Rename/remove the CSS custom properties as described. These are v18 renames/removals that should be addressed.

---

## Subtask 2: [Accordion] - Clean up TODO comments (CSS property renames for v18)

**Files:**

- `projects/angular/accordion/_properties.accordion.scss` (2 TODOs)
  - L25: `@TODO (v18) remove in favor of clr-accordion-header-open-background-color`
  - L33: `@TODO (v18) set to $cds-alias-object-interaction-background-selected when clr-accordion-active-background-color is removed`

**Action:** Remove deprecated CSS properties and update references as described.

---

## Subtask 3: [Header/Nav] - Clean up deprecated CSS selectors, naming conventions, and TODOs

**Files:**

- `projects/angular/layout/nav/_mixins.header.scss` (3 TODOs)
  - L100: `TODO: deprecated .settings selector. Remove when clarity CSS naming convention is implemented`
  - L210: `TODO: dropdown-menu inside header without clrIfOpen directive (legacy). Re-evaluate.`
  - L323: `TODO: Waiting for UX to finish search designs. CDE-1626` (display: none)
- `projects/angular/layout/nav/_header.clarity.scss` (1 TODO)
  - L17: `TODO: rename to follow clr naming convention` (header/.header)
- `projects/angular/layout/nav/_responsive-nav.clarity.scss` (4 TODOs)
  - L94: `TODO: Use border radius token?`
  - L134: `TODO: replace hamburger and dots to use CDS-ICON bars and ellipsis-vertical`
  - L185: `TODO: more specificity in classname is preferable to nesting`
  - L244: `TODO: deprecate .clr-icon, .logo`
- `projects/angular/layout/nav/_properties.nav.scss` (1 TODO)
  - L19: `@TODO update to SASS token once core is updated`
- `projects/angular/layout/nav/_nav.clarity.scss` (1 TODO)
  - L67: `TODO - separate :active and .active, currently .active is being used for selected state`
- `projects/angular/layout/nav/_subnav.clarity.scss` (1 TODO)
  - L16: `TODO: deprecated. Remove when the clarity css naming convention is implemented` (.sub-nav)
- `projects/angular/layout/nav/_variables.subnav.scss` (1 TODO)
  - L13: `TODO: would be nice to key text color in subnav off of the bgColor`

**Action:** Investigate and resolve each TODO. Remove deprecated selectors (.settings, .sub-nav), apply naming conventions, replace hamburger/dots icons, deprecate .clr-icon/.logo, and update SASS tokens.

---

## Subtask 4: [Modal] - Clean up TODO comments (CSS class merge, font token removal)

**Files:**

- `projects/angular/modal/_modal.clarity.scss` (3 TODOs)
  - L181: `TODO: .modal-header-wrapper class used only in clr-modal template. Merge with .modal-header in major version`
  - L199: `TODO: remove font-family line and PI tokens in GA 17+`
  - L200: `TODO: remove API tokens overrides in GA 17+`
- `projects/angular/modal/modal.ts` (1 TODO)
  - L154: `TODO: Investigate if we can decouple from animation events`

**Action:** Merge `.modal-header-wrapper` with `.modal-header`, remove deprecated font tokens, and investigate animation event decoupling.

---

## Subtask 5: [Forms] - Clean up TODO comments (old forms removal, selector fixes)

**Files:**

- `projects/angular/forms/styles/_textarea.clarity.scss` (3 TODOs)
  - L15: `@TODO Fix selectors when old forms are removed to allow better defaults`
  - L38: `TODO(CDE-863) - Remove outline mixin, convert to border-color for focus`
  - L66: `@TODO remove width: auto when removing old forms`
- `projects/angular/forms/styles/_radio.clarity.scss` (1 TODO)
  - L20: `@TODO un-nest the radio inputs when old forms are removed`
- `projects/angular/forms/styles/_checkbox.clarity.scss` (1 TODO)
  - L24: `@TODO un-nest the checkbox from the wrapper, after old forms are removed`
- `projects/angular/forms/common/wrapped-control.ts` (1 TODO)
  - L175: `@TODO has a try/catch due to an unknown issue with ClrToggle`
- `projects/angular/forms/common/providers/container-id.service.ts` (1 TODO)
  - L14: `@TODO No idea why provideIn is needed - without it ContainerIdService is not defined`

**Action:** Since old forms have been removed, fix selectors, un-nest radio/checkbox, remove outline mixin (CDE-863), investigate the try/catch and provideIn issues.

---

## Subtask 6: [Combobox] - Clean up TODO comments (trackBy support, filter-highlight directive)

**Files:**

- `projects/angular/forms/combobox/providers/option-selection.service.ts` (1 TODO)
  - L95: `TODO: Add support for trackBy and compareFn`
- `projects/angular/forms/combobox/filter-highlight.directive.ts` (1 TODO)
  - L14: `TODO: Check if this directive is properly sanitized and return to module/dev-app examples`

**Action:** Investigate and address trackBy/compareFn support and verify filter-highlight directive sanitization.

---

## Subtask 7: [Datepicker] - Clean up TODO comment (date range configuration)

**Files:**

- `projects/angular/forms/datepicker/providers/date-io.service.ts` (1 TODO)
  - L33: `TODO: turn this into an Array of min/max ranges that allow configuration of multiple ranges`
- `projects/angular/forms/datepicker/date-input.spec.ts` (1 TODO)
  - L84: `@TODO Figure out how to make these tests conform to the rest of the forms tests`

**Action:** Evaluate if multi-range configuration is needed and align test structure with forms test conventions.

---

## Subtask 8: [Datagrid] - Clean up TODO comments (CSS properties, rendering, selection)

**Files:**

- `projects/angular/data/datagrid/_datagrid.clarity.scss` (3 TODOs)
  - L576: `TODO: CSS property here?` (.exceeded-max border-right)
  - L609: `TODO: can width/column classes be combined?`
  - L1383: `TODO: Fix figma font sizes in next GA 17+`
- `projects/angular/data/datagrid/render/main-renderer.ts` (1 TODO)
  - L125: `TODO: only re-stabilize if a column was added or removed. Reordering is fine.`
- `projects/angular/data/datagrid/render/constants.ts` (1 TODO)
  - L8: `@TODO The top two constants are not used now, probably a performance drag`
- `projects/angular/data/datagrid/providers/selection.ts` (2 TODOs)
  - L128: `TODO: revisit when we work on clarity/issues/2342 - selection cleared on filter`
  - L213: `@TODO move the identifyBy from items to selection`
- `projects/angular/data/datagrid/datagrid.ts` (2 TODOs)
  - L347: `TODO: determine if we can get rid of provider wiring in view init`
  - L498: `TODO: use resizeObserver for all datagrid variants`
- `projects/angular/data/datagrid/datagrid-items.ts` (1 TODO)
  - L78: `TODO: not very efficient right now`
- `projects/angular/data/datagrid/datagrid-column.ts` (1 TODO)
  - L186: `TODO: We might want to make this an enum in the future`
- `projects/angular/data/datagrid/datagrid-column-toggle.spec.ts` (2 TODOs)
  - L57: `TODO(matt): figure out why its not getting removed from the dom when fixture is destroyed`
  - L65: `TODO(matt): update for the new ClrPopover toggle service here`

**Action:** Address CSS property extraction, remove unused constants, fix font sizes, evaluate rendering optimizations, and update specs.

---

## Subtask 9: [Tree View] - Clean up TODO comments (NgIterable support, enum rename)

**Files:**

- `projects/angular/data/tree-view/recursive-for-of.ts` (2 TODOs)
  - L27: `TODO: accept NgIterable<T>` (nodes input)
  - L30: `TODO: accept NgIterable<T> return type` (getChildren input)
- `projects/angular/data/tree-view/models/selected-state.enum.ts` (1 TODO)
  - L8: `TODO: I'd like this to be a CheckedState enum for the checkboxes in the future`

**Action:** Evaluate NgIterable support for ClrRecursiveForOf inputs and investigate CheckedState enum rename.

---

## Subtask 10: [Button] - Clean up TODO comments (CSS class refactoring, animation)

**Files:**

- `projects/angular/button/_buttons.clarity.scss` (3 TODOs)
  - L41: `TODO: Refactor classnames when the standard clarity naming convention is set` (btn-outline)
  - L278: `TODO: support both old and new naming, deprecate old ones`
  - L340: `TODO: Refactor classnames when the standard clarity naming convention is set` (flat buttons)
- `projects/angular/button/button-loading/loading-button.ts` (1 TODO)
  - L47: `TODO: see if we can get leave animation to work before spinner's enter animation`

**Action:** Refactor button CSS class naming conventions and investigate loading button animation ordering.

---

## Subtask 11: [Login] - Investigate and remove unused CSS classes

**Files:**

- `projects/angular/layout/_login.clarity.scss` (3 TODOs)
  - L117: `@TODO Are these used? (.auth-source, .username, ...) Some documented on website but not used`
  - L161: `@TODO Is this used? (.tooltip-validation) Not documented or used in demo app`
  - L166: `@TODO Is this used? (.tooltip-validation .username/.password) Not documented or used`

**Action:** Investigate if .auth-source, .username, .tooltip-validation and related classes are used. Remove if unused.

---

## Subtask 12: [Card] - Clean up TODO comments (nesting reduction, Edge fix)

**Files:**

- `projects/angular/layout/_card.clarity.scss` (3 TODOs)
  - L52: `TODO: Try to reduce the nesting in .card`
  - L115: `TODO: Figure out why caret sign is not aligned in dropdowns only in cards` (Edge fix)
  - L207: `TODO: remove the nesting in a separate PR`

**Action:** Reduce CSS nesting in `.card`, evaluate if Edge-specific fix is still needed, remove nested `.btn-group .btn` rules.

---

## Subtask 13: [Global Styles/Mixins] - Clean up TODO comments (normalize, mixins, typography, reboot)

**Files:**

- `projects/angular/styles/_components.clarity.scss` (1 TODO)
  - L10: `TODO: upgrade to latest normalize, once updated clr-ui can import core as is`
- `projects/angular/styles/_mixins.scss` (2 TODOs)
  - L28: `TODO: Should these mixins be moved into their own separate file?` (outline styles)
  - L176: `@TODO experimental functions to improve property declaration` (commented-out code)
- `projects/angular/styles/_reboot.clarity.scss` (1 TODO)
  - L381: `TODO: Review below items for removal before 2.0`
- `projects/angular/styles/variables/_variables.global.scss` (1 TODO)
  - L47: `TODO: Can any of this be grouped in a 'Layout' section?`
- `projects/angular/styles/variables/_variables.typography.scss` (1 TODO)
  - L17: `TODO: TBD. Alternative font for Clarity` ($clr-altFont)
- `projects/angular/styles/core/typography/_typography.scss` (2 TODOs)
  - L29: `TODO(CDE-821): Remove heading in v7` (cds-text heading)
  - L64: `TODO(CDE-821): Remove heading in v7` (cds-text heading)

**Action:** Upgrade normalize, move outline mixins, clean up reboot overrides, remove $clr-altFont if unused, remove deprecated `heading` cds-text attribute (CDE-821).

---

## Subtask 14: [Utils] - Clean up TODO comments (breakpoints, animations, host-wrapper, if-expanded)

**Files:**

- `projects/angular/utils/breakpoints/breakpoints.ts` (1 TODO)
  - L9: `TODO: Using core functions like pluckPixelValue...` (incomplete comment about core functions)
- `projects/angular/utils/animations/_animations.clarity.scss` (1 TODO)
  - L14: `TODO: figure out if we want to include animate.css or stick to few controlled animations`
- `projects/angular/utils/host-wrapping/host-wrapper.ts` (1 TODO)
  - L15: `TODO - make sure these comment annotations do not break ng-packgr`
- `projects/angular/utils/conditional/if-expanded.directive.ts` (1 TODO)
  - L86: `TODO: Move when we move the animation logic to Datagrid Row Expand`

**Action:** Evaluate breakpoints core function usage, decide on animation library approach, verify host-wrapper annotations, and assess if-expanded animation logic move.

---

## Subtask 15: [Signpost] - Create a general popover-pointer mixin

**Files:**

- `projects/angular/popover/signpost/_signposts.clarity.scss` (1 TODO)
  - L397: `TODO: Create a general mix-in for the popover-pointer (12 positions, unified nomenclature)`

**Action:** Evaluate creating a shared popover-pointer mixin that handles all 12 positions with unified naming.

---

## Subtask 16: [Spinner] - Get UX input on inverse spinner color direction

**Files:**

- `projects/angular/progress/spinner/_spinner.clarity.scss` (1 TODO)
  - L81: `TODO: get ux input on direction here` (spinner-inverse)

**Action:** Consult UX team about spinner-inverse color direction and apply their guidance.

---

## Subtask 17: [Vertical Nav] - Move animation to component

**Files:**

- `projects/angular/layout/vertical-nav/vertical-nav-group.html` (1 TODO)
  - L18: `TODO: This animation needs to be added to the clr-vertical-nav-group-children component`

**Action:** Move the expand animation from the template to the `clr-vertical-nav-group-children` component.

---

## Subtask 18: [Nav Level] - Investigate best approach for responsive nav

**Files:**

- `projects/angular/layout/nav/nav-level.ts` (1 TODO)
  - L164: `TODO: Figure out best way to do this - HostListener vs Directives on .nav-link class`

**Action:** Evaluate HostListener vs directive-based approach for responsive navigation behavior.

---

## Subtask 19: [Badge] - Fix badge vertical alignment

**Files:**

- `projects/angular/emphasis/badge/_badges.clarity.scss` (1 TODO)
  - L21: `TODO: unable to align badges center of the baseline, aligned to bottom instead`

**Action:** Investigate and fix the badge vertical alignment issue within inline-blocks.

---

## Subtask 20: [Alert] - Convert ALERT_TYPES to enum

**Files:**

- `projects/angular/emphasis/alert/utils/alert-types.ts` (1 TODO)
  - L8: `@TODO Make this an enum`

**Action:** Convert ALERT_TYPES string array to a proper TypeScript enum.

---

## Subtask 21: [Wizard] - Clean up spec TODO comments

**Files:**

- `projects/angular/wizard/wizard-page.spec.ts` (1 TODO)
  - L860: `TODO: HAVE TO TEST ONCOMMIT AS PART OF PAGE-COLLECTION`
- `projects/angular/wizard/providers/wizard-navigation.service.ts` (1 TODO)
  - L249: `TODO: MAKE SURE EXTERNAL OUTPUTS SAY 'CHANGE' NOT 'CHANGED'`
- `projects/angular/wizard/providers/wizard-navigation.service.spec.ts` (1 TODO)
  - L82: `TODO: repetition in finish() and next() tests, investigate stripping down`

**Action:** Add missing onCommit tests, verify output naming conventions, and reduce test duplication.

---

## Subtask 22: [Range] - Clean up TODO comments (IE custom rules)

**Files:**

- `projects/angular/forms/styles/_range.clarity.scss` (2 TODOs)
  - L142: `TODO: Thumb?`
  - L146: `TODO: Delete when getting rid of IE custom rules` (::-ms-track)

**Action:** Remove IE-specific CSS rules (::-ms-track, ::-ms-thumb, etc.) since IE is no longer supported. Investigate thumb styling.
