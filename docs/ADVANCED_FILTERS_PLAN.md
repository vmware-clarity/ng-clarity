# `clr-advanced-filters` — Proposal & Implementation Plan

JIRA: [CDE-2630](https://vmw-jira.broadcom.net/browse/CDE-2630) · Branch: `vmladenov/advanced-filters_cde-2630` · Status: **draft for review (rev. 8, phase 1c (pills) built, in review)**

Structure follows the proposal template in [CONTRIBUTING_DEV_FEATURES.md](./CONTRIBUTING_DEV_FEATURES.md).

> ## Status
>
> **Current state (2026-10-26):** phase 1a (model) and phase 1b (the tree UI with its popovers) are built and
> committed. Phase 1c, the **pills** layout (4.9), is built and uncommitted; the demo page at `/demo/advanced-filters`
> has a Layout select. 359 unit specs pass, the production build of `clr-angular` passes, every file has its own spec, and every file is at 100%
> statement, branch, function and line coverage. Questions that belong to later phases are parked in section 8 and
> raised when that phase starts.
>
> **Open for the current phase (1c):** the owner's review of the build, and of the choices listed at the end of 4.9
> ("Choices made while building 1c"). Not checked in a browser yet.
>
> Follow-ups from 1b, not part of 1c unless the owner says so, are parked in section 8 ("Follow-ups from 1b").
>
> **Decided 2026-10-26:**
>
> - **Removed option:** a filter whose value is no longer among its field's `options` keeps the value and is marked
>   invalid, with the new code `UNKNOWN_OPTION`. The same code is R6.1's.
> - **No copies of field definitions:** the component sets the built-in validator on the consumer's definition when it
>   has none. This reverses "the consumer's field definitions are never changed" (4.1). Not implemented yet.
>
> R6 was decided on 2026-10-22:
>
> - R6.2: blank strings in a set are accepted, because a set is picked by the user, not typed.
> - R6.3: a value listed twice in a set is rejected with the new code `DUPLICATE_VALUE`. Implemented.
> - R6.1 (checking values against `options`) is parked in section 8.
>
> **Choices made during the restructure, NOT yet confirmed by the owner. Parked for a later stage (owner,
> 2026-10-22).** Raise them again then. My recommendations: keep C1, C2, C3, C6, C7, C11, C12, C13 and C14; decide C9
> in 1b. C4, C5, C8 and C10 were replaced by the decisions of 2026-10-21/22 below.
>
> | #   | Choice                                                                                                                                                                                                             |
> | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
> | C1  | Exported abstract base `ClrAdvancedFilterNode` (tree-view precedent). Consumers narrow with two `instanceof` checks.                                                                                               |
> | C2  | Every node has `changes: Observable<ClrAdvancedFilterChange>` (`{ node }`). Synchronous, root last, one change per changed node, queued when a subscriber changes the tree, nothing for calls that change nothing. |
> | C3  | Misuse throws before anything changes: invalid operator or value (a `ClrAdvancedFilterValidationException` with the code), unknown logic, foreign node, cycle, missing field definition.                           |
> | C6  | Empty nested groups are allowed in the model. The UI will never create or leave one.                                                                                                                               |
> | C7  | Public `ClrAdvancedFilterCondition` (field key, operator, value): the validator's input and an editor draft. `ClrAdvancedFilterValue` type.                                                                        |
> | C9  | The REQUIRED code still covers both missing and wrong-kind values. Decide with the phase-1b messages.                                                                                                              |
> | C11 | No public find / level / depth helpers.                                                                                                                                                                            |
> | C12 | `isClrAdvancedFilterGroup` removed; use `instanceof`.                                                                                                                                                              |
> | C13 | The operator catalogue lives in the validator: public `getOperators()`, `getOperatorLabelKey()` and `getOperatorTextKey()`, arity protected.                                                                       |
> | C14 | Folders `enums/`, `interfaces/`, `models/`, `validators/`, the components' `group/`, `filter/`, `editor/`, `value/`, plus the parked `ip-address/` and `date-time/`.                                               |
> | C15 | (Phase 1b) `clrFilterChange` fires for user edits only; `root.changes` for every change.                                                                                                                           |
>
> **Noted for phase 1b, now done:**
>
> - The component gives built-in fields their validator when the definition brings none: a new instance per field,
>   from the internal `AdvancedFilterValidatorBuilder`.
> - The operator select reads `field.validator.getOperators()` and `getOperatorLabelKey()`.
> - Changing a filter's field in the editor replaces the filter with a new one (new id): the field never changes.
> - Filters with an `error` (left incomplete by an operator change) show a danger icon and a placeholder.
> - The root echoed back through `[(clrFilter)]` is the same instance, so it changes nothing.
>
> **Still open from that list:** error messages per code (C9: wrong type vs. missing; invalid date text shows "A value
> is required" today). Numeric symbols on pills: settled by the pill text (4.9).
>
> **Decided 2026-10-22/23 (UI, phase 1b):**
>
> - A read-only tree with `<clr-tree>`; groups start expanded. Group nodes have And/Or, Add filter, Add group
>   (disabled at `clrMaxDepth`), and × or, on the root, Clear all. Filters are added and edited in a popover, and
>   **Apply** commits that one filter. Cancel, Escape and clicking outside discard the edit.
> - The filter text reads `Field: operator value`, for example `Budget: greater than 60`; only the empty state keeps
>   "is" (`Country: is empty`). The format can change later.
> - Filters are shown before groups, in the view only; the model keeps its order.
> - × and Clear all are solid danger buttons.
> - Every control in the popover spans its width. The popover is at least 330px wide, with
>   `--cds-alias-object-shadow-200`. (Changed 2026-10-27: the width comes from the popover's styles, not from
>   `clr-col-12` on each control; see 4.8.)
> - Focus: a closing popover returns it to its trigger; after a removal it moves to the next sibling, then the
>   previous one, then the group; after a field change it moves to the new filter.
> - R1: a filter whose field key is no longer among `clrFields` is removed; another object with the same key is not
>   "gone".
> - No component uses `OnPush`: the combobox and the datepicker change their state from listeners that do not mark
>   `OnPush` views, so the active option was not shown.
>
> **Decided 2026-10-21/22 (model):**
>
> - **Filter.** `new ClrAdvancedFilter(field, operator, value?)` takes the field **definition** and is the only way to
>   create a filter; it only builds complete, correct filters.
>   - The field never changes after that.
>   - The `operator` setter accepts any operator the field allows and keeps a value that still fits. Otherwise it
>     clears the value silently, so the filter can be incomplete until a valid value is set (`error`).
>   - The `value` setter and `set(operator, value)` throw and change nothing for a value that doesn't fit.
>   - `update()` is gone.
> - **Validators.** The filter's validator is `field.validator`, else the base `ClrAdvancedFilterValidator` (shape
>   only). It is resolved once, in the constructor. There is no lookup by type; the component fills in built-in
>   validators (phase 1b). Validators are instance classes, never static: the base plus one subclass per type, with
>   the common rules in the base.
> - **Exceptions.** Validation exceptions carry the code: `ClrAdvancedFilterValidationException.code`.
> - **Groups.** `ClrAdvancedFilterGroup` has no constructor arguments: AND logic and an empty, frozen children array.
>   `add()` is renamed `addChild()`.
> - **Moves.** A move out of another group is two actions, removal then addition, and two changes. The two groups are
>   seen as separate subtrees.
> - **Changes.** A change is `{ node }`: one node per change.
> - **No static methods and no free functions;** everything lives in a class. The change queue is one shared
>   singleton (`AdvancedFilterChangeQueue.instance`), kept to deliver re-entrant changes in order.
> - **Booleans** use EQUALS with `true` / `false` (reverses P15). IS_EMPTY is the only operator without a value; any
>   value with it, `null` and `''` included, is invalid. Switching to IS_EMPTY clears the value.
> - **IP** is out of phase 1: isolated, internal and parked in `ip-address/` as a future custom type.
> - **DATE values are ISO dates without a time of day** (decided 2026-10-23), such as `"2026-10-20"`: a day, the same
>   in every time zone. A range is `["2026-10-01", "2026-10-20"]`, both days included. This replaces P8 and O1
>   (epoch-millisecond timestamps, local midnight, end of the last day).
> - **A future DATE_TIME field type** will store **epoch-millisecond timestamps** (an instant). Its validator exists,
>   internal and parked in `date-time/` (`ClrDateTimeFilterValidator`: its own operators, before / after / between /
>   is empty, and inclusive ranges); it is not a `ClrAdvancedFilterFieldType` member and has no editor yet.
> - **Date editors use Clarity's form control:** `ngModel` holds the text in the locale's display format, built and
>   parsed with the datepicker's `DateIOService` and `LocaleHelperService`, which `@clr/angular/forms/datepicker` now
>   exports. So the date inputs show Clarity's own error state.
> - **`toJSON()`** is meant to become the **saved format** at a later stage.
> - The owner runs `public-api:update` when they decide to, and commits.
>
> **Agreed 2026-10-21 (earlier):** P1 entry point · P2 names · P3 ids emitted · P4 empty root, never `null` ·
> P5 root `and` · P6 unknown field kept as removable chip (expand later) · P7 `[from, to]` · P8 timestamps (replaced 2026-10-23: ISO dates) ·
> P16 date-range picker with consumer-provided options · P17 camelCase ids · P18 IPv6 forms as proposed (parked with IP)
> · O1 (replaced 2026-10-23: ISO dates) dates = epoch **ms**, a picked day = **local midnight** (may switch to UTC midnight later), ranges **inclusive**:
> `to` = end of the last picked day (23:59:59.999 local) · O2 range presets **replace** `inLast` / `inLastMinutes`; no
> minutes/hours support for now; a preset is stored as **fixed** timestamps (revisit after seeing the result); presets
> live on the date field as `rangeOptions` · O3 field definition `{ key, label, type, options?, rangeOptions?,
validator? }` · D1 mutable class tree, the root announces every change · D3 classes `ClrAdvancedFilterGroup` and
> `ClrAdvancedFilter` · D5 string enums, UPPER_CASE keys, camelCase values, one per file in `enums/` · every interface
> in its own file · JSON shape/interfaces and fromJSON deferred (phase 2/3) · no store service (may return for corner
> cases) · this doc stays local.
>
> D2 ("incomplete filters never enter the tree") now reads: the constructor never builds an incomplete filter; only
> the `operator` setter can leave one incomplete. D6 (static validators) is replaced by the instance validators above.

---

## 1. Summary

A new core Clarity Angular component, `clr-advanced-filters`. It **builds a nested filter structure**: groups of
conditions joined by AND / OR. It receives that structure as input and emits it whenever the user changes it.

**It never interprets the structure.** Whether and how the structure filters data (client side, server side, a
`clr-datagrid`, anything else) is the consumer's concern. The component knows nothing about the data being filtered.

| Decision                    | Agreed value                                                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Responsibility              | Build / edit / emit the filter structure only. **No evaluation**, no data access                                                 |
| Package                     | Core `@clr/angular` (Clr prefix, global Clarity SCSS, `ClrCommonStringsService`)                                                 |
| Relation to existing add-on | New and separate. No coupling to `@clr/addons/datagrid-filters`; migration/deprecation decided later                             |
| Phase 1 scope               | Filter structure + UI. **No** datagrid / `FiltersProvider` wiring                                                                |
| Logic per level             | One logic per group. AND and OR **never mix** at the same level                                                                  |
| Nesting depth               | Default `3`, **including the root** (root + 2 nested levels), configurable                                                       |
| Public surface              | One component: filter structure in, filter structure out. Builder and its parts are internal                                     |
| Update mode                 | **Immediate**: Apply, And/Or, add group, remove and Clear all update and emit the structure right away                           |
| Display and editing         | A read-only tree (`clr-tree`); filters are added and edited in a popover, committed with Apply                                   |
| Empty values                | Clarity **error** state on the empty editor; the condition is not committed, and the popover's Apply button is disabled          |
| Dates                       | Date and date range (no time of day), stored as ISO dates (`"2026-10-20"`); relative ranges via consumer-provided picker presets |
| IP                          | Parked: a future custom field type (section 8)                                                                                   |
| Visual baseline             | `appfx-datagrid-filters` and the newer chip pattern (screenshot 4). Screenshot 2 shows structure only                            |
| Delivery                    | One PR, with a commit per phase (may be split later)                                                                             |

### Why not extend the add-on

`@clr/addons/datagrid-filters` models filters as `PropertyFilter { criteria: PropertyPredicate[]; operator }`, one per property,
max two criteria, implicitly ANDed across properties
([datagrid-filters.interfaces.ts:227-253](../projects/addons/datagrid-filters/model/datagrid-filters.interfaces.ts)).
It cannot express `A OR (B AND C)`, and each predicate embeds the full `FilterablePropertyDefinition` object, so it does not
serialize cleanly.

---

## 2. Reference UI

| #   | Source                     | What we take from it                                                                                                        |
| --- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | appfx-datagrid-filters bar | Bar layout: Add new, chips, Hide/Show, Clear all; editing in popovers                                                       |
| 2   | Third-party tree builder   | **Structure only**: group header (And/Or, Add filter, Add group), indented children, connector lines, one row per condition |
| 3   | Operator matrix            | The operator set per data type (3.5)                                                                                        |
| 4   | New chip pattern           | `Field \| Value (+N) ˅` pill chips, each opening its own dropdown editor (checkbox list + CLEAR for sets); `+ ADD FILTER`   |

`✓ Backed-up` in screenshot 4 is a **quick predefined filter**, which is deferred (section 7).

All visuals use Clarity controls and tokens only:

- `btn-group` radios for And/Or;
- `clr-select`, `clrInput` and `clr-number-input`;
- `clr-date-container` and `clr-date-range-container` (`clrStartDate` / `clrEndDate`);
- `clr-combobox` and checkbox lists;
- `btn-link` and icon buttons.

---

## 3. Filter structure (the core of phase 1)

The structure is a **mutable class tree**, given to consumers as it is (D1). The code is the reference; this section
summarizes it. `docs/ADVANCED_FILTERS_ARCHITECTURE.html` (local) draws it.

### 3.1 Public API (`@clr/angular/data/advanced-filters`)

| Kind       | Symbols                                                                                                                                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enums      | `ClrAdvancedFilterLogic`, `ClrAdvancedFilterOperator`, `ClrAdvancedFilterFieldType`, `ClrAdvancedFilterValidationError`, `ClrAdvancedFilterLayout` (1c)                                                       |
| Interfaces | `ClrAdvancedFilterField`, `ClrAdvancedFilterOption`, `ClrAdvancedFilterCondition` (+ `ClrAdvancedFilterValue` type), `ClrAdvancedFilterChange`                                                                |
| Models     | `ClrAdvancedFilterNode` (abstract), `ClrAdvancedFilterGroup`, `ClrAdvancedFilter`                                                                                                                             |
| Validators | `ClrAdvancedFilterValidator`, `ClrStringFilterValidator`, `ClrNumberFilterValidator`, `ClrBooleanFilterValidator`, `ClrDateFilterValidator`, `ClrEnumFilterValidator`, `ClrAdvancedFilterValidationException` |
| Component  | `ClrAdvancedFilters` (`clr-advanced-filters`, section 4.1)                                                                                                                                                    |
| Module     | `ClrAdvancedFiltersModule`                                                                                                                                                                                    |

The internal parts of the component (group, add filter, filter, editor, value editor, the error directive and the
text formatter) are exported too, because the module declares them; they are not meant for consumers.

`@clr/angular/forms/datepicker` now also exports `DateIOService` and `LocaleHelperService`, which the value editor uses
to show and read dates in the locale's format.

```ts
const owner: ClrAdvancedFilterField = {
  key: 'owner',
  label: 'Owner',
  type: ClrAdvancedFilterFieldType.STRING,
  validator: new ClrStringFilterValidator(),
};
const status: ClrAdvancedFilterField = {
  key: 'status',
  label: 'Status',
  type: ClrAdvancedFilterFieldType.ENUM,
  validator: new ClrEnumFilterValidator(),
  options: [{ value: 'pending', label: 'Pending' }],
};

const root = new ClrAdvancedFilterGroup(); // AND, no children
root.addChild(new ClrAdvancedFilter(owner, ClrAdvancedFilterOperator.NOT_EQUALS, 'alice'));
const any = root.addChild(new ClrAdvancedFilterGroup());
any.logic = ClrAdvancedFilterLogic.OR;
any.addChild(new ClrAdvancedFilter(status, ClrAdvancedFilterOperator.IN, ['pending']));

root.changes.subscribe(({ node }) => reload()); // every change of the tree
JSON.stringify(root); // { id, logic, children: [{ id, field: 'owner', operator, value }, ...] }
```

### 3.2 Who owns what

- **`ClrAdvancedFilterNode`** (abstract base):
  - `id` (from `uniqueIdFactory()`, never changes), `parent`, `changes` (a Subject created on first access);
  - `remove()`;
  - internal: `linkChild()` / `unlinkChild()` (the parent link, written only by groups), `detachChild()` hook,
    `emitChange()`;
  - abstract `toJSON()`.
- **`ClrAdvancedFilterGroup`**:
  - `logic` (the setter emits);
  - `children` (frozen, replaced exactly when the list changes);
  - `addChild(node, index?)` (also moves);
  - `clear()` ("Clear all": the empty AND group, same id).
- **`ClrAdvancedFilter`**:
  - `field` (the definition, readonly), `operator` and `value` (setters), `set(operator, value?)`;
  - `error` (why the filter is incomplete, or `null`);
  - `toJSON()` writes the field's `key`.
- **Validators** (instances): the base checks the shape every filter needs whatever its type (non-empty field key,
  known operator, value of the operator's shape). One subclass per type adds the type's operators and rules. The
  validator also owns the operator catalogue: `getOperators()`, `getOperatorLabelKey()`, `getOperatorTextKey()` (the
  filter text template), and the arity (protected). A set that lists a value twice is rejected (`DUPLICATE_VALUE`).
- **Field definitions** are consumer configuration. A filter keeps a reference to its definition and resolves its
  validator from it once, when it is built.

### 3.3 Communication

- Every public mutating call checks everything first, changes the tree completely, then emits.
- A change is `{ node }`: the node whose own state changed (a filter's operator or value; a group's logic or list of
  children). It is emitted on that node, then on each ancestor, **root last**.
- One change per changed node. A move out of another group is a removal and an addition: two changes, removal
  first, both delivered after the move is complete. The ancestors of both are taken before the first is delivered.
- Delivery is synchronous through one shared FIFO queue (the singleton `AdvancedFilterChangeQueue.instance`): a change made by a subscriber is delivered
  after the current one has reached every subscriber, still before the outer call returns. A throwing delivery doesn't
  stop the others; the first error is rethrown at the end.
- Calls that change nothing emit nothing.

### 3.4 Completeness

- **Constructor:** `new ClrAdvancedFilter(field, operator, value?)` throws unless the field's validator accepts the
  operator and the value. A new filter is always complete and correct.
- **`operator` setter:** throws (`unsupportedOperator`) for an operator the field doesn't allow. Otherwise it keeps a
  value that still fits, or clears it silently. A cleared filter can be incomplete (for example BETWEEN without a
  value) until a valid value is set; `error` tells why.
- **`value` setter and `set()`:** throw and change nothing for a value that doesn't fit, so they always leave the
  filter complete.
- **Exceptions:** validation failures throw `ClrAdvancedFilterValidationException` with `code`; a missing field
  definition throws a plain `Error`.
- **Consumers** that apply filters skip those with an `error`.
- **For later:** `toJSON()` of an incomplete filter has no value, so a future `fromJSON` can't rebuild it with the
  constructor. Decide then: skip incomplete filters on save, or relax the constructor.

### 3.5 Values and operators

Unchanged from the agreed decisions (P7, P16–P17, O2–O3), apart from booleans, which use EQUALS with
`true` / `false`, and dates, which are ISO dates without a time of day (`"2026-10-20"`; replaces P8 and O1). See `ClrAdvancedFilterValue` and `ClrAdvancedFilterOperator` (17 members) in the code. The operators
per type, their label keys and their text keys live in `validators/advanced-filter-validator.ts`. `ClrCommonStrings`
has 95 `advancedFilter*` keys: the 23 operator and value labels of phase 1a, 59 for the tree UI (section 4.7) and 13
for the pills (1c, 4.9 P11). DATE
values are checked by the internal `AdvancedFilterIsoDate`, which also converts them to and from `Date`s.

### 3.6 Depth

Not a model rule: the model accepts any nesting and rejects only cycles. `clrMaxDepth` (default 3, root included) is
applied by the components, which take levels from their rendering recursion.

## 4. Components & interaction

Decided 2026-10-22:

- The filter structure is shown as a **tree**, built with `<clr-tree>` inside `<clr-advanced-filters>`. The tree
  is a **visualization only**: nothing is edited inline.
- Filters are added and edited in a **popover**. **Apply** commits that one filter and applies it right away.
- Group actions are **buttons in the group node**.
- Groups start **expanded**.
- The pills layout comes later, in phase 1c (4.9).

The images given for the UI are guidance, not an exact specification. The owner reviewed this section on 2026-10-22.

### 4.1 Public API

```html
<clr-advanced-filters [clrFields]="fields" [(clrFilter)]="filter" [clrMaxDepth]="3"></clr-advanced-filters>
```

| Member            | Kind   | Type                       | Notes                                                                |
| ----------------- | ------ | -------------------------- | -------------------------------------------------------------------- |
| `clrFields`       | input  | `ClrAdvancedFilterField[]` | Required                                                             |
| `clrFilter`       | input  | `ClrAdvancedFilterGroup`   | The root of the tree, used as it is (`null` → a new empty AND root)  |
| `clrFilterChange` | output | `ClrAdvancedFilterGroup`   | The same root instance, after each user edit (C15)                   |
| `clrMaxDepth`     | input  | `number` (default `3`)     | `numberAttribute`. The tree only; pills always have two levels       |
| `clrLayout`       | input  | `ClrAdvancedFilterLayout`  | `'tree'` (default) or `'pills'`; any other value shows the tree (1c) |

Exports: `ClrAdvancedFiltersModule`, `ClrAdvancedFilters`, and the model API of section 3.1.

Follows repo conventions: NgModule with `standalone: false`, decorator `@Input` / `@Output`, `@if` / `@for`. The
components use the default change detection, not `OnPush` (see the Status block).

On receiving `clrFields`, the component:

- gives each built-in field without a `validator` the built-in validator of its type (decided: V2 (b)). Today it
  does so on a copy; decided 2026-10-26: no copies, the validator is set on the consumer's definition (not built yet);
- removes the filters whose field definition is no longer in `clrFields` (decided: R1). A definition counts as gone
  when no definition has its `key` any more; another object with the same key does not remove filters. Nothing is
  removed while `clrFields` has not been given.

### 4.2 Component breakdown

| Part                                             | Public? | Responsibility                                                                                                   |
| ------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `clr-advanced-filters`                           | yes     | Hosts the `clr-tree`, renders the root group, owns the popovers                                                  |
| group node (`clr-advanced-filters-group`)        | no      | Recursive. Header: And/Or, Add filter, Add group, × (or Clear all on the root); then the children, filters first |
| add filter (`clr-advanced-filters-add-filter`)   | no      | The Add filter button and its popover                                                                            |
| filter node (`clr-advanced-filters-filter`)      | no      | One filter as text, opening the edit popover; × to remove                                                        |
| filter editor (`clr-advanced-filters-editor`)    | no      | Popover body: field combobox, operator select, value editor, Cancel, Apply                                       |
| value editor (`clr-advanced-filters-value`)      | no      | Chosen by field type × the operator's kind of value                                                              |
| `[clrAdvancedFiltersError]` directive            | no      | Gives a value control the validator's code, so Clarity shows its error state                                     |
| `AdvancedFilterText`                             | no      | Writes a filter as text from the operator's text template; the pill condition and joined texts (1c)              |
| pills (`clr-advanced-filters-pills`)             | no      | (1c) One pill per child of the root, `+ ADD FILTER`, Clear all                                                   |
| pill (`clr-advanced-filters-pill`)               | no      | (1c) A `clr-label` with an edit button and ×; opens the pill popover                                             |
| pill add (`clr-advanced-filters-pill-add`)       | no      | (1c) `+ ADD FILTER` and its popover                                                                              |
| pill editor (`clr-advanced-filters-pill-editor`) | no      | (1c) The popover body: field with the AND / OR switch, rows, ADD, Apply                                          |
| `AdvancedFilterPills`                            | no      | (1c) The pills a tree gives, and writing an edit to the tree                                                     |

There is no store service (rejected). The components bind directly to the model classes and subscribe to the
`changes` of the node they render (see 3.3).

### 4.3 The tree

**Structure**

- The root group is the tree's top node, and its children are nested below it. Groups are expandable `clr-tree-node`s
  that start **expanded**. Filters are leaf nodes.
- The tree is rendered from the model by recursive components. Each group and filter component renders its own
  `clr-tree-node`, and the group projects its children with `ngProjectAs="clr-tree-node"`, which `clr-tree-node`
  needs to nest them.
- A group shows its filters first, then its groups, each in the model's order. This is view only: `children` and
  `toJSON()` keep the model's order.
- Nothing in a node is edited inline.

**Group node**

- The header shows `[And|Or]` (a `btn-group`), **Add filter** and **Add group** buttons.
- A nested group also has **×**, which removes the group with its subtree.
- The root has no ×. It has **Clear all** instead (a trash icon button), as decided in Q4. × and Clear all are solid
  danger buttons.
- Switching And/Or sets `group.logic` right away.
- **Add group** adds an empty `ClrAdvancedFilterGroup` as the last child (C6). It is disabled when the new group would
  exceed `clrMaxDepth`, with a reason.

**Filter node**

- The filter is shown as text, for example `Budget: greater than 60`: the field label, the operator label and the
  formatted value (4.5). The format can change later.
- The text sits in a `.clr-treenode-link` button. Clicking it, or pressing Enter or Space on the focused node, opens
  the edit popover. `clr-tree` already clicks a leaf's link for Enter and Space.
- **×** removes the filter.
- A filter never enters the structure incomplete from the UI: the popover's Apply is disabled until the condition is
  complete and correct.
- A filter that code left incomplete with the `operator` setter (its `error` is not `null`) is shown with a
  placeholder for the missing value, `Budget: between (missing value)`, and a danger error icon. The placeholder is
  an i18n string. Clicking the filter opens the editor, where Apply stays disabled until the filter is complete.

### 4.4 The filter popover (add and edit)

**Opening**

- **Add filter** on a group opens the popover anchored to that button, with an empty editor. On Apply, the filter is
  added as the group's last child.
- Clicking a filter node opens the popover anchored to that node, with the editor filled in from the filter.
- Built with the `ClrPopover` utilities (`clrPopoverOrigin`, `*clrPopoverContent`, as dropdowns and signposts are),
  with focus trapped inside and `role="dialog"`.
- **Cancel**, Escape, clicking outside or closing discards the edit.
- When the popover closes, focus returns to its trigger (the Add filter button, or the filter node), as with every
  other popover.

**Contents, top to bottom**

1. **Field:** a searchable `clr-combobox` with every field of `clrFields` (image 2). Its `Field` label is for screen
   readers only (owner, 2026-10-27), as in the pill popover.
2. **Operator:** a `clr-select` with `validator.getOperators()` and their labels. It is hidden when the type has a
   single operator, as for enum and boolean (decided, settles P13).
3. **Value:** the editor for the field type and the operator's kind of value (4.5). There is none for IS_EMPTY.
4. **Apply** and **Cancel**.

**Rules**

- Picking a field fills in the rest of the popover for that field. The operator starts as the type's first operator.
- Changing the operator clears the value when the value no longer fits.
- **Apply** is enabled only when the editor's condition passes the field's validator. Invalid input shows the
  Clarity error state on its control.
- Apply commits that one filter right away:
  - adding: `group.addChild(new ClrAdvancedFilter(field, operator, value))`;
  - editing, same field: the current filter is edited (`filter.set(operator, value)`, one change, same id);
  - editing, another field: only then is it replaced, by a new filter at the same position (a new id), because a
    filter's field never changes.
- Until Apply, the condition exists only in the editor. The model never sees an incomplete condition from the UI.

**Later (not now):** an "Apply all" mode, where Apply only changes the tree and an Apply all button emits the built
tree (Q-C, section 8).

### 4.5 Value editors and filter text

| Type    | Operator kind          | Editor                                                      | Filter text                                        |
| ------- | ---------------------- | ----------------------------------------------------------- | -------------------------------------------------- |
| string  | single                 | `clrInput` text                                             | `Country: contains dfsd`                           |
| number  | single                 | `clrNumberInput`                                            | `Budget: greater than 60`                          |
| number  | BETWEEN                | Two `clrNumberInput`s, from and to                          | `Budget: between 10 and 60`                        |
| boolean | EQUALS (select hidden) | Radio buttons, True / False                                 | `Discontinued: True`                               |
| date    | single                 | `clr-date-container`                                        | `Ordered on: after Oct 20, 2026`                   |
| date    | BETWEEN                | `clr-date-range-container`, with the field's `rangeOptions` | `Ordered on: between Oct 1, 2026 and Oct 20, 2026` |
| enum    | IN (select hidden)     | A checkbox list of the field's options (image 3)            | `Region: in US West, EU Central`                   |
| any     | IS_EMPTY               | None                                                        | `Country: is empty`                                |

Dates are ISO dates without a time of day (`"2026-10-20"`); a range includes both of its days. The date inputs show
them in the locale's input format (`10/20/2026`), and the filter text in the locale's medium date (`Oct 20, 2026`).

How the date inputs work: their `ngModel` holds the text in the locale's display format, the only form Clarity's
date input pre-fills from. The value editor builds that text and reads it back with the datepicker's `DateIOService`
and `LocaleHelperService`. Typing and calendar picks both arrive as text. Text that is not a date yet gives no value,
and is not wiped while the user types. With range presets (`rangeOptions`), Clarity's range calendar has its own Apply
button; picked days reach the inputs only after it.

Every control spans the popover through the popover's styles (4.8), not through `clr-col-12`.

### 4.6 Accessibility

- Tree semantics come from `clr-tree`: `role="tree"` and `treeitem`, arrow keys, Home/End, type-ahead, expand and
  collapse.
- **Buttons inside group and filter nodes** (And/Or, Add filter, Add group, ×, Clear all) stop the tree's key handling
  for their own keys, so Space and Enter press the button instead of toggling the node. `clr-tree` itself is not
  changed. They are reached with Tab from the focused node.
- Each filter's link has the full filter text as its label. Remove buttons have specific labels, for example "Remove
  filter Budget: greater than 60".
- Disabled buttons carry an `aria-describedby` reason, for example "Maximum nesting depth reached".
- **No HTML `title` attributes** (owner's rule, 2026-10-27): hints are `clr-tooltip`s. Icon buttons (×, Clear all,
  remove group, a row's ×) and the error icon of an incomplete filter are tooltip triggers, and keep their
  `aria-label`. A tooltip brings its own popover, so it never wraps a button that opens a filter popover: in the tree,
  the error icon sits before the filter's link, not inside it.
- Applying, removing and clearing are announced through CDK `LiveAnnouncer`.
- A closing popover returns focus to its trigger (4.4). After a removal with ×, focus moves to the next sibling,
  then the previous one, then the parent group. After a field change replaced a filter, focus moves to the new one.
- Positions for focus are the positions as shown (filters first), not the model's.

### 4.7 i18n

59 new `ClrCommonStrings` keys besides the 23 operator and value labels from phase 1a:

- 25 for the filter text: one template per operator and type (tokens `{FIELD}`, `{VALUE}`), the range value
  (`{FROM} and {TO}`), the list separator and the missing-value placeholder;
- 34 for the UI: `And` / `Or`, Add filter, Add group, Clear all, Apply, Cancel, remove and edit labels, the editor's
  labels and the field placeholder ("Select field..."), the group and tree labels, the max-depth reason, a message per
  validation code, and the announcements.

Date-range preset labels are not included, because the consumer provides them.

### 4.8 Styling

- One file, `_advanced-filters.clarity.scss`, forwarded from `styles/_components.clarity.scss`. Variables and
  properties files can follow when theming needs them.
- Tokens only, no hard-coded colours. The tree keeps its own styles.
- The popover: at least 330px wide, padding `--clr-base-vertical-offset-l` / `--clr-base-horizontal-offset-l`, shadow
  `--cds-alias-object-shadow-200`. The field's container has no top margin. The wrappers inside the controls fill
  their container.
- The tree popover's controls are `--clr-base-vertical-offset-l` apart (owner, 2026-10-27), like the rows of the pill
  popover, instead of Clarity's `--clr-base-vertical-offset-2xl`. The field keeps no top margin.
- Every `.clr-control-container` in the popover is 100% wide (decided 2026-10-27). No control carries `clr-col-12`:
  Clarity moves `clr-col-*` classes from a control to its `.clr-control-container`, where `clr-col-12` adds the grid's
  column padding on both sides. That pushed the controls in, away from the labels and the buttons.
- A separator line between the field and the rest of the popover, in both popovers (owner, 2026-10-27): the field's
  section (`clr-advanced-filters-field-section`) has a bottom border (`--cds-alias-object-border-width-100`,
  `--cds-alias-object-border-color`) and `--clr-base-vertical-offset-l` padding below the field. The line spans the
  content width, inside the popover's padding. In the pill popover the section is the field with its AND / OR
  switch. The line is shown only once a field is picked (owner, 2026-10-27).

### 4.9 The pills layout (phase 1c)

Decided 2026-10-26, from the owner's two images (the add/edit popover and the pill). "Pills", not "chips".

**Switching.** `clr-advanced-filters` gets `clrLayout`: `"pills" | "tree"`, a `ClrAdvancedFilterLayout` enum (D5).
The tree is the default (decided 2026-10-26); pills only appear with `[clrLayout]="'pills'"`.

**Rules of the pills layout** (more restrictive than the tree):

- Exactly 2 levels, not configurable: the root and one level below it. `clrMaxDepth` does not apply.
- The root is always AND and is not shown.
- One pill per field. A pill is a child of the root: a filter when the field has one condition, a group of that
  field's filters when it has more.
- **One logic per pill:** the group's AND / OR.
- `+ ADD FILTER` sits at the end of the row and always adds to the root: a filter or a group.
- A tree that breaks these rules (root OR, deeper nesting, a group with several fields, two root nodes for one
  field), built in the tree layout or in code, is **shown as it is, as best it can be**.

**The pill** is a `clr-label`: the field label, a separator, the first filter's operator and value, and a badge with
`+N` for the other filters, then ×. Single: `Name | Contains Alice`. Merged: `Name | Contains Alice +2`. Clicking it
opens the popover, filled in; × removes the field's pill.

**The popover** (image 1) reuses the tree's popover shell, the field combobox and the value editors, with a new body:

1. The field combobox. It leaves out fields that already have a pill, and is disabled for an edited pill. Next to it,
   the AND / OR switch of the pill (one logic per pill). There is no separate label of the field (owner, 2026-10-27:
   the disabled combobox already shows it). A separator line follows (4.8).
2. One row per condition: the operator select, the value editor inline (the bigger editors too), and × to remove the
   row.
3. After the last row, an ADD button adds a row. After every other row, a disabled button shows the logic of the
   pill (`And` / `Or`). Owner, 2026-10-27; this replaced the AND / OR toggle between rows and the `+ AND` / `+ OR`
   buttons. The switch and ADD are only offered for DATE, NUMBER and STRING fields.
4. Apply, disabled until every row is complete. Closing works as in the current popover (Escape, outside click).

**Not now (remember):** the screenshot-4 style editing (a checkbox list with CLEAR, applied right away) is a
separate feature for a later phase. Hide/Show (n) is not built now; its open question (what `n` counts) stays open.

**Decided 2026-10-26 (1c):**

1. The × next to `+ ADD FILTER` is **Clear all**: it removes every pill.
2. Revised by the owner: adding a filter for a field with AND / OR (DATE, NUMBER, STRING) **always saves a group**,
   even with one condition. Editing a pill then edits its conditions in place: changed rows, added rows, removed rows
   and the logic; the nodes keep their ids. ENUM and BOOLEAN: see 8.
3. The field is **locked** while a pill is edited.
4. Trees that break the rules:
   - every child of the root is a pill;
   - a group on one field, without nested groups, is a merged pill;
   - anything else (several fields, deeper nesting) is a pill such as `3 filters` that can only be removed;
   - a root OR is not shown;
   - two root nodes on the same field are two pills, and the second is marked invalid (for removal).
5. The invalid mark of a second pill on the same field is **view only**: the danger icon, only × works, the filter
   stays valid in the model.
6. A pill that is a plain filter (built in the tree or in code) on an AND / OR field: when rows are added, a new group
   takes the filter's place, the filter moves into it (keeping its id), and the new rows are added (decided
   2026-10-26).

7. Every row has ×. With several rows, × removes its row. The last row's × does not remove the row: it is
   disabled while the row is empty, enabled once an operator or a value is given, and a click clears them and
   disables it again. So the popover always has at least one row; the pill's × removes the whole pill.

   "Empty" means the field's first operator and no value; clearing goes back to that (confirmed 2026-10-26).

8. ENUM and BOOLEAN (no AND / OR, one row) save a plain filter, not a group (confirmed 2026-10-26).

**Open (1c):** none.

**Choices made while building 1c, NOT yet confirmed by the owner:**

- P1 A pill of a single-operator type (enum, boolean) shows only the value: `Region | US West, EU Central`,
  `Active | True`, as its popover hides the operator. Other types show `Operator value`: `Name | Contains Alice`.
- P2 Colours: `info` for a pill and its badge (decided by the owner, 2026-10-27), `danger` for a second pill on the
  same field (with the error icon), no colour for a SUMMARY pill. An incomplete filter shows the error icon, as in the
  tree.
- P3 A pill is a `clr-label` holding two buttons, edit and ×, so no button sits inside another. A pill that can only be
  removed shows its text in a focusable `span` (a `clr-tooltip` trigger) whose tooltip gives the reason.
- P4 `+ ADD FILTER` is disabled when every field has a pill.
- P5 The fields inside a SUMMARY pill still count as free for `+ ADD FILTER`.
- P6 The pill popover has no Cancel button (image 1); Escape and clicking outside discard the edit.
- P7 Clear all (×) is always shown, as in the tree.
- P8 The labels of a row (operator, value, from / to) are for screen readers only; the value editor got an internal
  `inline` input for it.
- P9 The operator select takes 40% of a row. (The field's label above the rows was removed, 2026-10-27.)
- P10 A plain-filter pill of an AND / OR field applied with one row stays a filter (`set()`).
- P11 13 new `ClrCommonStrings` keys (95 `advancedFilter*` keys in all): the pill condition (`{OPERATOR} {VALUE}`), the
  badge (`+{COUNT}`), `{COUNT} filters` / `1 filter`, the two reasons, joined texts (`{LEFT} and {RIGHT}`,
  `{LEFT} or {RIGHT}`), `Condition {INDEX}`, ADD (`Add`, labelled `Add a condition`), Remove / Clear condition.

---

## 5. Implementation plan

### 5.1 Location & file layout

New secondary entry point `@clr/angular/data/advanced-filters`, a sibling of `datagrid`.

```
projects/angular/data/advanced-filters/
  ng-package.json · index.ts · advanced-filters.module.ts
  advanced-filters.ts · _advanced-filters.clarity.scss        the public component and its styles
  enums/          one enum per file (public, except the arity and value-editor enums)
  interfaces/     one interface per file (public, except the operator definition, the edit and the tree item)
  models/
    advanced-filter-node.model.ts          public abstract base
    advanced-filter-group.model.ts         public
    advanced-filter.model.ts               public
    change-queue.ts                        internal: the AdvancedFilterChangeQueue singleton
  validators/
    advanced-filter-validator.ts           public base: shape rules, operator tables, operators / labels / texts / arity
    advanced-filter-validation-exception.ts  public: the exception with the validation code
    string- / number- / boolean- / date- / enum-filter-validator.ts   public, one per type
    advanced-filter-validator-builder.ts   internal: a new built-in validator per field type
    advanced-filter-iso-date.ts            internal: ISO dates to and from Dates
  group/          internal: the group node (.ts, .html) and the Add filter button with its popover
  filter/         internal: the filter node and the filter text formatter
  editor/         internal: the popover body (.ts, .html) and the error directive
  value/          internal: the value editors (.ts, .html)
  ip-address/     internal, parked: ClrIpAddressFilterValidator (IPv4 / IPv6 / CIDR), its operators and codes
  date-time/      internal, parked: ClrDateTimeFilterValidator (epoch-ms timestamps) and its operators
  pills/          internal (1c): the pills row, pill, Add filter, the pill popover (.ts, .html) and AdvancedFilterPills
```

Wiring edits:

- `data/index.ts` and `data/data.module.ts`
- `styles/_components.clarity.scss`
- `utils/i18n/common-strings.interface.ts` and `common-strings.default.ts`
- `forms/datepicker/index.ts`: exports `DateIOService` and `LocaleHelperService`
- Storybook: `.storybook/stories/components/advanced-filters/` (phase 1d)
- Demo app: `projects/demo/src/app/advanced-filters/` (done in 1b: the tree with sample filters, a field-removal
  toggle, Reset, a Clarity number input for the max depth, and the live `toJSON()`)
- API reports: `*.api.md`, regenerated by `npm run public-api:update`, when the owner decides to.

### 5.2 Information flow

```
clrFilter (in: the root ClrAdvancedFilterGroup) ──▶ components bind to the nodes ──▶ tree or pills
user edits ──▶ model calls (addChild, remove, clear, logic, operator, value, set) ──▶ root.changes ──▶ clrFilterChange (C15)
```

Phase 1 has no async flows; those arrive with the dynamic entity list. No existing Clarity code is refactored.

### 5.3 Phases (one PR, a commit per phase)

| #      | Deliverable                                                                                                                                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1a** | **Done.** Entry point skeleton, model classes, enums, interfaces, validators (operators, labels, arity), i18n operator keys, unit specs (no UI)                                                                                             |
| **1b** | **Done.** The tree (`clr-tree`): group nodes with And/Or, Add filter, Add group, ×, Clear all; filter nodes; the add/edit popover with field combobox, operator select, value editors, Apply; depth limit, focus, a11y, styles; a demo page |
| **1c** | **Built, in review.** The pills layout (4.9): `clrLayout`, pills, the multi-row popover, `+ ADD FILTER`, Clear all                                                                                                                          |
| **1d** | Storybook stories (+ visual snapshots via CI), demo page, API report                                                                                                                                                                        |
| 2      | Datagrid integration. The **datagrid** (not this component) interprets the structure                                                                                                                                                        |
| 2 or 3 | Dynamic (entity) list field: `clr-combobox` multi, `searchOptions` / `resolveOptions`, `notIn`. JSON interfaces and `fromJSON` on the component; `toJSON()` becomes the saved format                                                        |
| 3      | **Custom filters** (section 8), optional Apply mode, quick predefined filters, JIRA modes, quick search, saved presets                                                                                                                      |
| later  | Add-on migration or deprecation, website docs                                                                                                                                                                                               |

### 5.4 Testing

- **Unit (done for 1a and 1b):** a spec next to every file; 264 specs; 100% statements, branches, functions and
  lines for every file of the entry point (TypeScript only; templates are covered through the DOM specs).
  - model: tree structure, moves, changes and their order, completeness, exceptions with codes;
  - validators: operators, labels, texts and arity per type, every type's rules (ISO dates included), the base shape
    rules, and that every built-in validator only accepts what the base accepts; the builder;
  - the parked IP and DATE_TIME validators;
  - components: each against its own small test host (the module's internal parts are exported for the test only,
    with `TestBed.overrideModule`): group actions and focus, filter text, remove and replace, the Add filter popover,
    the editor's rules, every value editor, the error directive, the text formatter;
  - popover flows through the real DOM: add, edit, Cancel, Escape, per value editor.
- **Browser (done for 1b, in Chrome against the demo):** the tree, And/Or, adding, editing and removing, field
  removal, combobox keyboard navigation, every editor's width, and the date and date-range editors with their error
  states.
- **Unit (1c, done):** every rule in 4.9, the pill text, the multi-row popover, and the pill flows through the real DOM
  (adding, editing in place, a filter moving into a group, Escape, a duplicate pill). 348 specs, 100% per file.
- **Visual:** Storybook stories for the builder at depths 1–3, every value editor, pill variants, and compact density.

---

## 6. Resolved questions

| #   | Answer                                                                                                              |
| --- | ------------------------------------------------------------------------------------------------------------------- |
| Q1  | Depth 3 includes the root. Can be adjusted later                                                                    |
| Q2  | Rules OK; chip visuals per screenshot 4                                                                             |
| Q3  | Popover, as the add-on does                                                                                         |
| Q4  | No × on the root: Clear all (trash icon)                                                                            |
| Q5  | Empty value → Clarity error state, not committed, Add disabled                                                      |
| Q6  | Date and date range; IPv6 included (IP itself is now parked, section 8)                                             |
| Q7  | Component receives and emits the structure; builder stays internal                                                  |
| Q8  | No dedicated Figma; base on add-on visuals and screenshot 4                                                         |
| Q9  | One PR for now                                                                                                      |
| Q-A | Not applicable. The component never interprets the structure; filtering semantics belong to the consumer            |
| Q-B | Bar "Clear all" is a text button, as in the add-on                                                                  |
| Q-C | **Immediate** updates. An optional "Apply all" mode (based on user preference) is planned for later, not this phase |

Inconsistencies and advanced behaviours are refined later; phase 1 focuses on the basics.

## 7. Out of scope for phase 1

- Interpreting or evaluating the structure, in any form
- Datagrid wiring
- Apply mode
- Dynamic (entity) list field
- Custom field types, operators and validators (section 8), IP included
- `fromJSON` and the saved format
- Quick predefined filters and the four JIRA modes
- Quick search
- Saved presets
- Time of day in dates (the DATE_TIME type is parked, section 8)
- Drag-and-drop reordering
- Changes to `@clr/addons/datagrid-filters`

## 8. Parked for later phases

Recorded here instead of being asked now. Raise each one when its phase starts, with concrete examples.

**Components (phase 1b).**

- R1, **decided 2026-10-22, implement in 1b:** when a filter's field definition is removed from the component's
  `clrFields`, the filter is removed too ("if the field definition is gone, the filter is gone too"). The model is
  not affected: the filter keeps a reference to its own definition, and nothing compares it with `clrFields` today.
  - The component removes the filter from the consumer's tree without a user action, so the tree emits a change.
  - This replaces P6 ("unknown field kept as a removable chip") for removed definitions.
  - Decided and implemented: a definition counts as gone only when its key is gone; another object with the same
    key keeps the filters.
  - Still open for phase 2/3: P6 for saved JSON whose key has no definition.
- R6.1, **direction agreed, code `UNKNOWN_OPTION` (2026-10-26), timing open (1c?):** check `in` values against the field's `options` through
  `validate(condition, field?)`; the filter passes its own definition, and so do the editors. The owner wants to try
  it with the UI first.
  - Related, decided 2026-10-26: an option removed from the definition after a filter was built keeps its value,
    and the filter is marked invalid with `UNKNOWN_OPTION`.

**Follow-ups from 1b (phase not set).** Raise them when they are scheduled.

- Source of truth for field definitions. A filter is linked to its field only by `key`: the model uses the definition
  the filter was built with, the UI the current `clrFields` entry. Example: after a NUMBER field is replaced by a
  STRING field with the same key, the editor offers "contains" and Apply throws in `filter.set()`. Options: A current
  `clrFields` by key; B the filter's own definition; C A plus a model method that swaps a definition with the same key.
  Recommended: A + C. `UNKNOWN_OPTION` for a new object with the same key needs A or C.
- C9: messages in the UI only (invalid date or number text shows "A value is required"), or also a public
  `INVALID_VALUE` code. Recommended: UI only.
- R6.1 and the removed option (decided: `UNKNOWN_OPTION`): when to build them. Proposals to confirm then: the enum
  member `UNKNOWN_OPTION = 'unknownOption'`; the message "Pick one of the available options"; the constructor and the
  `value` setter throw it; the tree and the pill show the danger icon; the editor shows unknown values as extra checked
  checkboxes so they can be unticked.
- No copies of field definitions (decided): when to build it. Questions then: frozen definitions (throw / copy only
  those / shape checks only); a filter built before its definition got a validator keeps the base one (read the
  validator on every check, or document it). Also fix the demo's `fields` getter (new array per change detection,
  probably NG0100).

**Custom filters (phase 3).** Custom field types bring their own validators, written as subclasses of
`ClrAdvancedFilterValidator`, with the common rules in the base. Open:

1. **The extension contract.** Which protected members are supported API. Proposed: `fieldType`,
   `supportsOperator`, `validateSingle` / `validateRange` / `validateSet`, and the shared helpers (`isMissing`,
   `isFiniteNumber`, `isSingleValue`, `isRange`). (`isTimestamp` moved to the parked DATE_TIME validator.) `getOperatorArity` becomes private. Note: `@internal`
   is not stripped by this repo's api-extractor setup, so protected members are visible in the `.d.ts` and the API
   report either way.
2. **When to commit to it.** Now (docs plus a private arity), or when custom fields are designed; new hooks may be
   needed for custom operators.
3. **Whether built-in type validators are extendable,** e.g. a 0–100 field extending `ClrNumberFilterValidator`.
   Proposed: yes.
4. **Custom operators** such as IP `inSubnet`, which aren't `ClrAdvancedFilterOperator` members, and their labels.
5. **IP as the first custom type** (parked in `ip-address/`):
   - R5: values are stored exactly as typed; convert to a canonical form? Proposed: store as typed.
   - R7: "Starts with" / "Contains" accept any text; restrict to IP characters? Proposed: restrict.
   - R8: a range mixing IPv4 and IPv6 (also IPv4 vs. IPv4-mapped) is invalid. Proposed: invalid.

**Apply all (future phase).** Apply in the popover would then only change the tree; an "Apply all" button emits the
built tree (Q-C). Don't design it now.

**DATE_TIME field type (later phase).** A date and time field stores epoch-millisecond timestamps. The validator and
its operators exist, internal, in `date-time/`. Still to do: a `ClrAdvancedFilterFieldType` member, an editor (Clarity
has no time picker today), the filter text with a time of day, and the built-in validator builder entry.

**JSON (phase 2/3).**

- R2: malformed input to `[clrFilter]` (not a `ClrAdvancedFilterGroup`) and to `fromJSON`: repair, reset, or throw?
- `toJSON()` is the future saved format. How to save and restore filters left incomplete by an operator change (3.4).
- Unknown fields from saved data (expand P6).

**Future phase, raise with examples:** P9 (one `date` type), P10 (`enum` name), P11 (per-type field interfaces), P12
(`operators` restriction), P13 (hide single-operator select), P14 (numeric units).
