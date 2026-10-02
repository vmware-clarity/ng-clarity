# tree-view — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/tree-view`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrTreeViewModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-icon`, `clr-tree`, `clr-tree-node`
- Directives / inputs: `clrDemoShowCode`, `clrDemoShowHalf`, `clrDisabled`, `clrExpandable`, `clrExpanded`, `clrIfExpanded`, `clrIfExpandedChange`, `clrLazy`, `clrLoading`, `clrRecursiveFor`, `clrRecursiveForGetChildren`, `clrRecursiveForOf`, `clrSelected`, `clrSelectedChange`
- CSS classes: `alert`, `alert-icon`, `alert-icon-wrapper`, `alert-info`, `alert-item`, `alert-items`, `alert-text`, `btn`, `btn-sm`, `clr-demo`, `clr-treenode-link`

## Examples

### basic-tree

```html
<clr-tree>
  <clr-tree-node [clrExpanded]="true">
    Office Locations
    <clr-tree-node [clrExpanded]="true">
      USA
      <clr-tree-node>Palo Alto, CA (Headquarters)</clr-tree-node>
      <clr-tree-node>Seattle, WA</clr-tree-node>
      <clr-tree-node>Austin, TX</clr-tree-node>
    </clr-tree-node>
    <clr-tree-node>
      UK
      <clr-tree-node>London</clr-tree-node>
    </clr-tree-node>
    <clr-tree-node>
      India
      <clr-tree-node>Bangalore, KA</clr-tree-node>
      <clr-tree-node>Pune, MH</clr-tree-node>
    </clr-tree-node>
  </clr-tree-node>
</clr-tree>
```

_source: projects/website/src/app/documentation/demos/tree-view/basic-tree/tree-basic.html_

### basic-tree-DM

```html
<clr-tree>
  <clr-tree-node [clrExpanded]="true">
    David Wallace (CFO)
    <clr-tree-node [clrExpanded]="true">
      Michael Scott (Regional Manager)

      <clr-tree-node>Dwight K. Schrute (Assistant to the Regional Manager)</clr-tree-node>

      <clr-tree-node>
        Jim Halpert (Head of Sales)
        <clr-tree-node>Andy Bernard</clr-tree-node>
        <clr-tree-node>Stanley Hudson</clr-tree-node>
        <clr-tree-node>Phyllis Vance</clr-tree-node>
        <clr-tree-node>Todd Packer</clr-tree-node>
      </clr-tree-node>

      <clr-tree-node>
        Angela Martin (Head of Accounting)
        <clr-tree-node>Kevin Malone</clr-tree-node>
        <clr-tree-node>Oscar Martinez</clr-tree-node>
      </clr-tree-node>

      <clr-tree-node>
        Kelly Kapoor (Head of Customer Service)
        <clr-tree-node>Ryan Howard (Temp)</clr-tree-node>
      </clr-tree-node>

      <clr-tree-node> Creed Bratton (Quality Assurance) </clr-tree-node>

      <clr-tree-node> Meredith Palmer (Supplier Relations) </clr-tree-node>

      <clr-tree-node> Toby Flenderson (Human Resources) </clr-tree-node>

      <clr-tree-node> Pam Beesly (Reception) </clr-tree-node>

      <clr-tree-node> Darryl Philbin (Warehouse) </clr-tree-node>
    </clr-tree-node>
  </clr-tree-node>
</clr-tree>
```

_source: projects/website/src/app/documentation/demos/tree-view/basic-tree-DM/tree-basic-DM.html_

### boolean-selection-tree

```html
<div class="clr-row">
  <div class="clr-col-12 clr-col-md-4">
    <clr-tree>
      <clr-tree-node [clrExpanded]="true">
        Permissions @for (permission of permissions; track permission) {
        <clr-tree-node [clrExpanded]="true">
          {{ permission.type }} @for (right of permission.rights; track right) {
          <clr-tree-node [clrSelected]="right.enable" (clrSelectedChange)="right.enable = !!$event">
            {{ right.name }}
          </clr-tree-node>
          }
        </clr-tree-node>
        }
      </clr-tree-node>
    </clr-tree>
  </div>
  <div class="clr-col-12 clr-col-md-8">
    <pre class="example-display-json">{{ permissions | json }}</pre>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/tree-view/boolean-selection-tree/boolean-selection-tree.html_

### disabled-nodes

```html
<clr-tree>
  <clr-tree-node [clrExpanded]="true">
    David Wallace (CFO)
    <clr-tree-node [clrExpanded]="true">
      Michael Scott (Regional Manager)

      <clr-tree-node>Dwight K. Schrute (Assistant to the Regional Manager)</clr-tree-node>

      <clr-tree-node>
        Jim Halpert (Head of Sales)
        <clr-tree-node>Andy Bernard</clr-tree-node>
        <clr-tree-node>Stanley Hudson</clr-tree-node>
        <clr-tree-node>Phyllis Vance</clr-tree-node>
        <clr-tree-node>Todd Packer</clr-tree-node>
      </clr-tree-node>

      <clr-tree-node [clrDisabled]="true" [clrExpanded]="true">
        Angela Martin (Head of Accounting)
        <clr-tree-node>Kevin Malone</clr-tree-node>
        <clr-tree-node>Oscar Martinez</clr-tree-node>
      </clr-tree-node>

      <clr-tree-node [clrDisabled]="true">
        Kelly Kapoor (Head of Customer Service)
        <clr-tree-node>Ryan Howard (Temp)</clr-tree-node>
      </clr-tree-node>

      <clr-tree-node> Creed Bratton (Quality Assurance) </clr-tree-node>

      <clr-tree-node [clrDisabled]="true"> Meredith Palmer (Supplier Relations) </clr-tree-node>

      <clr-tree-node> Toby Flenderson (Human Resources) </clr-tree-node>

      <clr-tree-node> Pam Beesly (Reception) </clr-tree-node>

      <clr-tree-node> Darryl Philbin (Warehouse) </clr-tree-node>
    </clr-tree-node>
  </clr-tree-node>
</clr-tree>
```

_source: projects/website/src/app/documentation/demos/tree-view/disabled-nodes/disabled-nodes.html_

### disabled-nodes-overview

```html
<clr-tree>
  <clr-tree-node [clrExpanded]="true">
    <clr-icon [shape]="'folder-open'"></clr-icon>
    Applications
    <clr-tree-node [clrExpanded]="false" [clrDisabled]="true">
      <clr-icon [shape]="'folder-open'"></clr-icon>
      Images
      <clr-tree-node>Sreenshot.png</clr-tree-node>
    </clr-tree-node>
    <clr-tree-node [clrExpanded]="false">
      <clr-icon [shape]="'folder-open'"></clr-icon>
      Files
      <clr-tree-node>Sreenshot.png</clr-tree-node>
      <clr-tree-node>abc.jpeg </clr-tree-node>
      <clr-tree-node [clrDisabled]="true"> again.png </clr-tree-node>
    </clr-tree-node>
  </clr-tree-node>
</clr-tree>
<clr-tree>
  <clr-tree-node [clrExpanded]="true">
    Permissions
    <clr-tree-node [clrExpanded]="false">
      Authenticated Users
      <clr-tree-node>John Doe</clr-tree-node>
    </clr-tree-node>
    <clr-tree-node [clrSelected]="true" [clrExpanded]="false">
      Owners
      <clr-tree-node>Jane Doe</clr-tree-node>
    </clr-tree-node>
    <clr-tree-node [clrSelected]="false" [clrExpanded]="false" [clrDisabled]="true">
      Public
      <clr-tree-node>Mr. Doe</clr-tree-node>
    </clr-tree-node>
  </clr-tree-node>
</clr-tree>
```

_source: projects/website/src/app/documentation/demos/tree-view/disabled-nodes-overview/disabled-nodes-overview.html_

### disabled-nodes-selection

```html
<div class="clr-row">
  <div class="clr-col-12 clr-col-md-4">
    <clr-tree>
      <clr-tree-node
        *clrRecursiveFor="let file of root; getChildren: getChildren"
        [clrSelected]="file.selected"
        [clrDisabled]="file.disabled"
        [clrExpanded]="file.expanded"
      >
        {{ file.name }}
      </clr-tree-node>
    </clr-tree>
  </div>
  <div class="clr-col-12 clr-col-md-8">
    <pre class="example-display-json">{{ root | json }}</pre>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/tree-view/disabled-nodes-selection/disabled-nodes-selection.html_

## More

- All documented examples: `basic-tree`, `basic-tree-DM`, `boolean-selection-tree`, `disabled-nodes`, `disabled-nodes-overview`, `disabled-nodes-selection`, `highlighting-nodes-tree`, `interaction-checkbox-tree`, `label-change-on-expand`, `lazy-loading-recursive-tree`, `lazy-loading-selection-tree`, `lazy-loading-tree`, `recursive-tree`, `selection-tree`, `small-selection-tree`, `tree-data-loading`, `tree-node-routing`, `tree-view-dynamic`
- Full public API report: `projects/angular/data/data.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "tree-view", features: [...] }`
