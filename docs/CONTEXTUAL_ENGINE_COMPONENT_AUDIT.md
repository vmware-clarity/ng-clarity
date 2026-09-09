# Component audit: what each Clarity component must publish

The contextual engine describes UI from the accessibility tree — an ARIA role, an accessible name,
ARIA state — so a component needs to publish nothing for that to work. A component only publishes
through `publishElementContext` when there is state a consumer would need that **cannot be read
back from the rendered page**.

This is the full audit. Every component family has a verdict, including the ones with no gap, so the
audit is complete rather than partial.

## Verdict summary

| Publishes | Family              | What, and why nothing else can carry it                                                                                                                                                                                                                                                                                                                                                                             |
| --------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| yes       | `clr-combobox`      | The options, which render in a popover that is absent while closed, and the current selection.                                                                                                                                                                                                                                                                                                                      |
| yes       | `clr-datagrid`      | The total row count while paginated (the DOM holds one page); which columns are **filtered** (a CSS class on the toggle, with the value inside a closed popover); which columns are **hidden** (not rendered at all, so nothing says they exist or could be shown).                                                                                                                                                 |
| yes       | `clr-alert`         | The exact severity. `role="alert"` versus `role="status"` distinguishes important from informational, which is all ARIA offers; danger from warning is a CSS class.                                                                                                                                                                                                                                                 |
| yes       | `clr-wizard`        | Per-step completion, error and navigability, plus step count and current index. Completion and error live in CSS classes on the stepnav item; its icon does carry an accessible label for them, but the icon sits inside a `<button>`, and a button is described as a leaf, so nothing reaches it. Navigability ("this step is reachable because the one before it is complete") has no ARIA representation at all. |
| yes       | `clr-tree-node`     | Whether a collapsed node has children, and whether they are loading. `aria-expanded="false"` says collapsed; it cannot say whether anything is underneath. A lazily loaded subtree is absent from the DOM until it arrives, and the loading indicator is a bare `<span>` with no `aria-busy`.                                                                                                                       |
| yes       | `clr-stepper-panel` | The panel status. It is otherwise announced only as a transient live-region message beside the step, and only when complete or in error — a step that is merely not started says nothing about itself. Captured through the panel's existing pipe rather than a subscription of its own: an extra subscriber renders the template before `ngAfterContentInit`, when the content children it reads do not yet exist. |
| yes       | `clr-timeline-step` | The step outcome. The icon's accessible name carries it, but a timeline is `role="list"` and its steps are `role="listitem"`, so the list is summarised by item name and the icon is never reached.                                                                                                                                                                                                                 |
| ARIA fix  | `clr-side-panel`    | Pinned state was conveyed only by swapping the pin icon's shape. That **is** expressible in ARIA, so the fix is `aria-pressed` on the pin button rather than a publisher — which also makes the state perceivable to a screen reader, where it previously was not.                                                                                                                                                  |

## No gap, family by family

### Modal

| Component        | Verdict                                                                                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clr-modal`      | No gap. `role="dialog"`, `aria-modal` and `aria-labelledby` give the type, modality and title; footer buttons are described in place. Size is presentational, and whether it can be dismissed follows from whether a close button is rendered. |
| `clr-side-panel` | No publishing gap once the pin button reports `aria-pressed` (above). Otherwise as `clr-modal`.                                                                                                                                                |

### Alert

| Component          | Verdict                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| `clr-alert`        | Publishes severity (above).                                                                        |
| `clr-alert-item`   | No gap. A wrapper; its text is in the DOM.                                                         |
| `clr-alerts`       | No gap. Only the visible alert is in the DOM, which is exactly what "currently showing" means.     |
| `clr-alerts-pager` | No gap. Renders `{{current + 1}} / {{count}}` as visible text, so position and total are readable. |

### Datagrid

| Component                                            | Verdict                                                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `clr-datagrid`                                       | Publishes row count, filtered columns and hidden columns (above).                                             |
| `clr-dg-row`                                         | No gap. `aria-selected` on the row (added alongside this work) and `aria-expanded` for its detail.            |
| `clr-dg-cell`                                        | No gap. `role="gridcell"`; content is text.                                                                   |
| `clr-dg-column`                                      | No gap. `role="columnheader"` with `aria-sort`.                                                               |
| `clr-dg-column-separator`                            | No gap. A resize handle with an accessible label; carries no state a consumer needs.                          |
| `clr-dg-column-toggle`, `-button`                    | No gap. `aria-expanded` on the trigger; the hidden-column list itself is covered by the datagrid's publisher. |
| `clr-dg-filter`, `-string-filter`, `-numeric-filter` | No gap. `aria-expanded` on the toggle; which columns are filtered is covered by the datagrid's publisher.     |
| `clr-dg-detail`, `-body`, `-header`                  | No gap. Rendered only while open, and the row's detail button reports `aria-expanded`.                        |
| `clr-dg-footer`                                      | No gap. Text in the DOM.                                                                                      |
| `clr-dg-pagination`, `-page-size`                    | No gap. The range and total render as text; the page input and size select report their value and options.    |
| `clr-dg-placeholder`                                 | No gap. Text in the DOM.                                                                                      |
| `clr-dg-action-bar`, `-action-overflow`              | No gap. `aria-expanded` on the overflow trigger; its actions are in the DOM while open.                       |
| `clr-dg-row-detail`                                  | No gap. Content is in the DOM while open.                                                                     |

### Forms

Every form container is already described generically by role, accessible name, `required`,
`disabled`, `invalid`, the options it permits, its `min`/`max`/`step`/`pattern`/`maxLength`, its
`aria-describedby` text, and its value. None of them has a gap.

| Component                                                                                                                                                                                                                                         | Verdict                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clr-input-container`, `clr-number-input-container`, `clr-select-container`, `clr-textarea-container`, `clr-range-container`, `clr-datalist-container`, `clr-date-container`, `clr-radio-container`, `clr-radio-wrapper`, `clr-control-container` | No gap.                                                                                                                                                                                      |
| `clr-password-container`                                                                                                                                                                                                                          | No gap. The reveal toggle's own label switches between "Show password" and "Hide password", so the state is readable from the button's accessible name. The value stays redacted regardless. |
| `clr-file-input-container`, `clr-file-list`, `clr-file-info`, `-error`, `-success`                                                                                                                                                                | No gap. Selected file names render in the list; the input's value is redacted.                                                                                                               |
| `clr-control-error`, `-helper`, `-success`                                                                                                                                                                                                        | No gap. Their text reaches the field as its `description`, resolved from `aria-describedby`.                                                                                                 |
| `clr-label`                                                                                                                                                                                                                                       | No gap. It _is_ the accessible name.                                                                                                                                                         |
| `clr-combobox`                                                                                                                                                                                                                                    | Publishes options and selection (above).                                                                                                                                                     |
| `clr-combobox-container`, `clr-options`, `clr-option`, `clr-option-group`                                                                                                                                                                         | No gap. Covered by the combobox publisher while closed, and by the `combobox` summariser while open.                                                                                         |
| `clr-calendar`, `clr-day`, `clr-daypicker`, `clr-monthpicker`, `clr-yearpicker`, `clr-datepicker-view-manager`, `clr-datepicker-actions`                                                                                                          | No gap. Present only while the picker is open; the chosen date is the input's value.                                                                                                         |

### Layout and navigation

| Component                                       | Verdict                                                                                                                                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `clr-main-container`, `clr-header`              | No gap. Landmarks.                                                                                                                                                             |
| `clr-vertical-nav`, `-group`, `-group-children` | No gap. `ariaExpanded` returns `'true'` when not collapsed and `'false'` when collapsed, so the collapsed state is in `aria-expanded` on the toggle; group expansion likewise. |
| `clr-breadcrumbs`, `-item`                      | No gap. A navigation landmark of links.                                                                                                                                        |
| `clr-tabs`, `clr-tab`, `clr-tab-content`        | No gap. `role="tablist"`, `role="tab"` with `aria-selected`, `role="tabpanel"`.                                                                                                |
| `clr-tab-overflow-content`, `clr-tabs-actions`  | No gap. `aria-expanded` on the overflow trigger; overflowed tabs are in the DOM while it is open.                                                                              |

### Popovers

| Component                            | Verdict                                                                                                        |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `clr-dropdown`, `-menu`              | No gap. `aria-expanded` on the trigger; the menu is in the DOM while open.                                     |
| `clr-signpost`, `-content`, `-title` | No gap. `aria-expanded` on the trigger; content is in the DOM while open.                                      |
| `clr-tooltip`, `-content`            | No gap. The content is in the DOM and the engine's own visibility check decides whether it is currently shown. |

### Structure and emphasis

| Component                                                       | Verdict                                                                                                                                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `clr-accordion`, `-panel`, `-title`, `-description`, `-content` | No gap. `aria-expanded`, `role="region"` and `aria-disabled`. Whether collapsed content is rendered adds nothing beyond "collapsed", which `aria-expanded` already says. |
| `clr-stepper-panel`                                             | Publishes status (above).                                                                                                                                                |
| `clr-step-title`, `-description`, `-content`                    | No gap. Text and content.                                                                                                                                                |
| `clr-timeline`                                                  | No gap. `role="list"`.                                                                                                                                                   |
| `clr-timeline-step`                                             | Publishes outcome (above).                                                                                                                                               |
| `clr-timeline-step-title`, `-description`, `-header`            | No gap. Text.                                                                                                                                                            |
| `clr-tree`                                                      | No gap. A tree of `treeitem`s with `aria-expanded` and `aria-selected`.                                                                                                  |
| `clr-tree-node`                                                 | Publishes expandability and loading (above).                                                                                                                             |
| `clr-recursive-children`                                        | No gap. Structural.                                                                                                                                                      |
| `clr-stack-view`, `-block`, `-header`, `-content`, `-label`     | No gap. Expandable blocks report `aria-expanded`; labels and values are text.                                                                                            |
| `clr-badge`, `clr-label`                                        | No gap. Text.                                                                                                                                                            |
| `clr-icon`                                                      | No gap. Presentational, or named for a consumer when it carries meaning.                                                                                                 |
| `clr-spinner`                                                   | No gap. Reports `aria-busy`.                                                                                                                                             |
| `clr-progress-bar`                                              | No gap. `role="progressbar"` with `aria-valuenow`/`min`/`max`.                                                                                                           |
| `clr-expandable-animation`                                      | No gap. An animation wrapper.                                                                                                                                            |
| `clr-button`, `clr-button-group`                                | No gap. Buttons are described in place; an overflow trigger reports `aria-expanded` and its contents are in the DOM while open.                                          |

### Wizard

| Component                                                            | Verdict                                                                                                          |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `clr-wizard`                                                         | Publishes step state (above).                                                                                    |
| `clr-wizard-page`, `-title`, `-stepnav`, `-button`, `-header-action` | No gap. Titles and buttons are in the DOM; the per-step facts they cannot express are published by `clr-wizard`. |

## Observations worth acting on separately

Two findings came out of the audit that are accessibility issues in their own right, not context gaps.
They are recorded here rather than fixed, because both change what a screen reader announces and that
is a UX decision:

- **A wizard step's completion and error are not announced.** The stepnav icon has an accessible
  label for them, but its `<button>` uses `aria-labelledby` pointing at the step number and title
  only, so the icon's label is excluded from the button's name. A user tabbing through the steps
  hears "Step 2, Networking" whether that step is complete, errored or untouched. Including the icon
  in the button's `aria-labelledby` would fix it, and would make the wizard's publisher redundant.
- **A timeline step's outcome is announced, but only as a separate node inside a list item.** How
  usefully that reads depends on the screen reader's list handling.
