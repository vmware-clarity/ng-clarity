# datagrid — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/datagrid`, `projects/website/src/app/documentation/demos/advanced-datagrid`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrDatagridModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-accordion`, `clr-accordion-content`, `clr-accordion-panel`, `clr-accordion-title`, `clr-alert`, `clr-alert-item`, `clr-checkbox-container`, `clr-checkbox-wrapper`, `clr-datagrid`, `clr-datagrid-color-filter`, `clr-dg-action-bar`, `clr-dg-action-overflow`, `clr-dg-cell`, `clr-dg-column`, `clr-dg-detail`, `clr-dg-detail-body`, `clr-dg-detail-header`, `clr-dg-filter`, `clr-dg-footer`, `clr-dg-numeric-filter`, `clr-dg-page-size`, `clr-dg-pagination`, `clr-dg-placeholder`, `clr-dg-row`, `clr-dg-row-detail`, `clr-dg-string-filter`, `clr-dropdown`, `clr-dropdown-menu`, `clr-icon`, `clr-input-container`, `clr-number-input-container`, `clr-radio-container`, `clr-radio-wrapper`, `clr-range-container`, `clr-select-container`, `clr-toggle-container`, `clr-toggle-wrapper`, `clr-tooltip`, `clr-tooltip-content`
- Directives / inputs: `clrAlertClosable`, `clrAlertType`, `clrCheckbox`, `clrDetailAriaLabel`, `clrDetailAriaLabelledBy`, `clrDetailWidth`, `clrDgActionOverflowOpenChange`, `clrDgActionOverflowOpenChangeFn`, `clrDgColType`, `clrDgCustomSelectAll`, `clrDgCustomSelectAllEnabled`, `clrDgDetailCloseLabel`, `clrDgDetailDisabled`, `clrDgDetailHidden`, `clrDgDetailOpenLabel`, `clrDgField`, `clrDgFilter`, `clrDgHideableColumn`, `clrDgItem`, `clrDgItems`, `clrDgItemsIdentityFn`, `clrDgLastPage`, `clrDgLoading`, `clrDgNumericFilter`, `clrDgPage`, `clrDgPageInputDisabled`, `clrDgPageSize`, `clrDgPreserveSelection`, `clrDgRefresh`, `clrDgReplace`, `clrDgRowSelection`, `clrDgSelectAllDisabled`, `clrDgSelectable`, `clrDgSelected`, `clrDgSelectedChange`, `clrDgSelectionType`, `clrDgSkeletonLoading`, `clrDgSortBy`, `clrDgSortOrder`, `clrDgStringFilter` …(+34 more)
- CSS classes: `alert`, `alert-icon`, `alert-icon-wrapper`, `alert-info`, `alert-item`, `alert-items`, `alert-text`, `alert-warning`, `badge`, `badge-5`, `btn`, `btn-group`, `btn-link-neutral`, `btn-outline-neutral`, `btn-primary`, `btn-secondary`, `btn-sm`, `card`, `card-block`, `card-footer`, `card-header`, `card-text`, `card-title`, `clr-code`

## Examples

### accessibility

```html
<ul class="list" cds-layout="m-t:md m-l:lg" cds-text="body">
  <li>
    By default if the user does not add anything, <code cds-text="code">aria-labelledby</code> will be added by the
    Clarity Library with the id of the modal title.
  </li>
  <li>
    The user can set additional <code cds-text="code">aria-labelledby</code> (using the
    <code cds-text="code">[clrDetailAriaLabelledBy]</code> input) which should have an HTML ID referencing other text on
    the page , it can have multiple space separated ids. In this case, the default title ID will be added along with the
    user-defined IDs.
  </li>
  <li>
    The user can add an <code cds-text="code">aria-label</code> (using the
    <code cds-text="code">[clrDetailAriaLabel]</code> input). In this case, the
    <code cds-text="code">aria-label</code> provided will be used. The <code cds-text="code">aria-label</code>
    provided must be unique for each row in the datagrid.
  </li>
  <li>
    If both <code cds-text="code">aria-label</code> and <code cds-text="code">aria-labelledby</code> is added by the
    user, then only <code cds-text="code">aria-labelledby</code> will be added to the modal.
  </li>
</ul>
```

_source: projects/website/src/app/documentation/demos/datagrid/accessibility/datagrid-detail-accessibility-guidance.component.html_

### basic-structure

```html
<h2 class="clr-mt-48px" cds-text="title">Basic structure</h2>

<p class="clr-mt-16px clr-mb-16px" cds-text="body">
  To use our Datagrid, you do not need to pass an array of data or a JSON configuration to a single element. Instead, we
  leverage a pure declarative API, just like any other Angular component. You write your HTML just as you would for a
  basic table, with a
  <code cds-text="code">&#64;for</code> (or <code cds-text="code">*clrDgItems</code>, see Smart iterator) on the rows to
  iterate over your data.
</p>

<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Creation date</clr-dg-column>
  <clr-dg-column>Favorite color</clr-dg-column>

  @for (user of users; track user) {
  <clr-dg-row>
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
    <clr-dg-cell>{{ user.color }}</clr-dg-cell>
  </clr-dg-row>
  }

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
```

_source: projects/website/src/app/documentation/demos/datagrid/basic-structure/basic-structure.html_

### batch-action

```html
<h2 class="clr-mt-48px" cds-text="title">Selection batch action</h2>

<p class="clr-mt-16px" cds-text="body">
  You can allow batch actions to be performed on selected rows in selectable datagrids. You can make the action choices
  contextual to the selection by showing certain actions only if the selection meets the criteria. Add a
  <code cds-text="code">clr-dg-action-bar</code> inside a <code cds-text="code">clr-datagrid</code>. The content inside
  of it will be projected when one or more items is selected. We recommend that that you use a button bar with small
  buttons as in the example.
</p>

<p class="clr-mt-16px" cds-text="body">
  In the following example, we simply display the names of the selected users, but since we have access to the full
  objects, we could perform any operation we want on them.
</p>

<p class="clr-mt-16px" cds-text="body">
  Depending on the role of certain batch actions, you can choose to break button bars up into separate button groups. To
  increase the visibility of the most important batch actions within each button group, we recommend organizing batch
  actions in priority order from left to right.
</p>

<div class="card card-block">
  <p class="card-text username-list">
    Users to be added to group: @if (toAdd.length == 0) {
    <em>No user selected.</em>
    } @for (user of toAdd; track user) {
    <span class="username">{{ user.name }
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/datagrid/batch-action/batch-action.html_

### binding-properties

```html
<h2 class="clr-mt-48px" cds-text="title">Binding model properties to columns</h2>

<p class="clr-mt-16px" cds-text="body">
  For an easy setup of datagrid column features, you can simply specify the property to bind it to in your model. When
  you do, the column will benefit from all built-in features for this case: sorting based on the natural comparison,
  filtering using either of the built-in filters, and anything else we might add in the future. You can bind to as deep
  a property as you want in your model, using a standard dot-separated syntax:
  <code cds-text="code">[clrDgField]=&quot;'my.deep.property'&quot;</code>
</p>
<p class="clr-mt-16px" cds-text="body">
  You can also see in the following example how every feature we offer is always opt-in: we did not declare any binding
  on the "User ID" column, which means it is not sortable or filterable.
</p>
<p class="clr-mt-16px clr-mb-16px" cds-text="body">
  By default, bound columns are assumed to contain string-like contents and the user is presented with the normal string
  filter. If you know that the contents of the column will be numeric, you can instead use the built-in numeric range
  filter by adding
  <code cds-text="code">[clrDgColType]=&quot;'number'&quot;</code>. You can see an example of this in the "Wins" column.
</p>

<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column [clrDgField]="
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/datagrid/binding-properties/binding-properties.html_

### built-in-filters

```html
<h2 class="clr-mt-48px" cds-text="title">Built-in filters</h2>

<p class="clr-mt-16px" cds-text="body">
  Before reading this, you should make sure you read the previous section on custom filters. Done? Then you might be a
  bit overwhelmed by the complexity of custom filters, understandably. What if you want <em>just a bit more</em> than
  default string value filters, but phenomenal cosmic filter power turns out to be slightly overkill? This is where our
  built-in custom filters come handy. They let you customize specific parts of the filter like the filter matching
  function, without having to rewrite the whole thing yourself from two-way binding inputs to integration in the
  datagrid.
</p>

<h3 cds-text="section" class="clr-mt-32px">String filter</h3>

<p class="clr-mt-16px" cds-text="body">
  The first and default filter is the "string" filter one, meaning the user is offered a text input, and the rows will
  be filtered based on a string-matching function you provide. You should now be familiar with our use of interfaces for
  this, so here is the interface your string matcher should implement:
</p>
<app-code-snippet [code]="examples.stringFilterInterface" language="typescript"></app-code-snippet>
<p class="clr-mt-16px" cds-text="body">
  Once you have it, you simply need to pass it to a
  <code cds-text="code">&lt;clr-dg-string-filter&gt;</code> component:
</p>
<app-c
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/datagrid/built-in-filters/built-in-filters.html_

### compact

```html
<h2 class="clr-mt-48px" cds-text="title">Compact Datagrid</h2>

<p class="clr-mt-16px" cds-text="body">
  One way to increase the information density of your Datagrid or to decrease the amount of space it takes up, add the
  <code cds-text="code">datagrid-compact</code> class to it. This class decreases the amount of whitespace paddings in
  the default Datagrid style.
</p>

<clr-datagrid class="datagrid-compact">
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Pokemon</clr-dg-column>
  @for (user of users; track user; let i = $index) {
  <clr-dg-row>
    <clr-dg-cell>{{ user.id }}</clr-dg-cell>
    <clr-dg-cell>
      <clr-icon shape="user"></clr-icon>
      {{ user.name }}
    </clr-dg-cell>
    <clr-dg-cell>{{ user.pokemon.name }}</clr-dg-cell>
  </clr-dg-row>
  }

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>

<h2 class="clr-mt-48px" cds-text="subtitle">Overflow ellipsis</h2>

<p class="clr-mt-16px" cds-text="body">
  Another way to increase the information density of your Datagrid is to add
  <code class="clr-code">datagrid-overflow-ellipsis</code> class to it. This class will truncate the visible data in the
  default Datagrid style so that you can display more rows in the fixed height.
</p>

<clr-datagrid class="datagrid-overflow-ellipsis">
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-colum
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/datagrid/compact/compact.html_

## More

- All documented examples: `accessibility`, `basic-structure`, `batch-action`, `binding-properties`, `built-in-filters`, `compact`, `custom-rendering`, `custom-select-all`, `detail`, `expandable-rows`, `filtering`, `fixed-height`, `full`, `hide-show-columns`, `pagination`, `placeholder`, `select-all-disabled`, `selection`, `server-driven`, `single-action`, `single-selection`, `smart-iterator`, `sorting`, `usage`, `virtual-scroll`, `ng`
- Full public API report: `projects/angular/data/data.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "datagrid", features: [...] }`
