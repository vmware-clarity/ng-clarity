# button-group — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/button-group`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrButtonGroupModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-button`, `clr-button-group`, `clr-icon`
- Directives / inputs: `clrInMenu`, `clrMenuPosition`
- CSS classes: `btn`, `btn-danger`, `btn-group`, `btn-group-overflow`, `btn-icon`, `btn-link`, `btn-outline`, `btn-outline-primary`, `btn-primary`, `btn-primary-outline`, `btn-sm`, `btn-success`, `clr-icon-title`, `dropdown-menu`, `dropdown-toggle`

## Examples

### angular-basic-structure

```html
<div class="clr-example">
  <clr-button-group class="btn-primary">
    <clr-button>Create</clr-button>
    <clr-button>Favorite</clr-button>
    <clr-button [clrInMenu]="true">Assign</clr-button>
    <clr-button [clrInMenu]="true">Download</clr-button>
    <clr-button [clrInMenu]="true">Delete</clr-button>
  </clr-button-group>
</div>
```

_source: projects/website/src/app/documentation/demos/button-group/angular-basic-structure.html_

### angular-directions

```html
<div class="clr-example space-below">
  <clr-button-group [clrMenuPosition]="'bottom-right'">
    <clr-button>Add</clr-button>
    <clr-button>Edit</clr-button>
    <clr-button>Download</clr-button>
    <clr-button [clrInMenu]="true">Assign</clr-button>
    <clr-button [clrInMenu]="true">Move</clr-button>
    <clr-button [clrInMenu]="true">Delete</clr-button>
  </clr-button-group>
</div>
```

_source: projects/website/src/app/documentation/demos/button-group/angular-directions.html_

### basic-structure

```html
<div class="clr-example">
  <div class="btn-group btn-primary">
    <button class="btn" aria-label="primary add">Add</button>
    <button class="btn" aria-label="primary edit">Edit</button>
    <button class="btn" aria-label="primary download">Download</button>
    <button class="btn" aria-label="primary delete">Delete</button>
  </div>
</div>

<h3 data-toc-item id="overflow" cds-text="section" class="clr-mt-32px">Overflow</h3>

<div class="clr-example" style="min-height: 144px">
  <div class="btn-group btn-primary">
    <button class="btn" aria-label="overflow add">Add</button>
    <button class="btn" aria-label="overflow edit">Edit</button>
    <div class="btn-group-overflow open">
      <button class="btn dropdown-toggle" aria-label="overflow toggle">
        <clr-icon shape="ellipsis-horizontal"></clr-icon>
      </button>
      <div class="dropdown-menu" role="menu">
        <button class="btn" role="menuitem">Download</button>
        <button class="btn" role="menuitem">Delete</button>
      </div>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/button-group/basic-structure.html_

### checkbox

```html
<div class="clr-example">
  <div class="btn-group">
    <div class="checkbox btn">
      <input type="checkbox" id="btn-demo-check-1" />
      <label for="btn-demo-check-1">Apples</label>
    </div>
    <div class="checkbox btn">
      <input type="checkbox" id="btn-demo-check-2" checked />
      <label for="btn-demo-check-2">Oranges</label>
    </div>
    <div class="checkbox btn">
      <input type="checkbox" id="btn-demo-check-3" />
      <label for="btn-demo-check-3">Kiwis</label>
    </div>
    <div class="checkbox btn">
      <input type="checkbox" id="btn-demo-check-4" checked />
      <label for="btn-demo-check-4">Pears</label>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/button-group/checkbox.html_

### icons

```html
<div class="clr-example" style="min-height: 144px">
  <div class="btn-group btn-primary btn-icon">
    <button class="btn" aria-label="home icon">
      <clr-icon shape="home"></clr-icon>
      <span class="clr-icon-title">Home</span>
    </button>
    <button class="btn" aria-label="settings icon">
      <clr-icon shape="cog"></clr-icon>
      <span class="clr-icon-title">Settings</span>
    </button>
    <div class="btn-group-overflow open">
      <button class="btn dropdown-toggle" aria-label="dropdown toggle">
        <clr-icon shape="ellipsis-horizontal"></clr-icon>
      </button>
      <div class="dropdown-menu" role="menu">
        <button class="btn" role="menuitem" aria-label="user icon">
          <clr-icon shape="user"></clr-icon>
          <span class="clr-icon-title">User</span>
        </button>
        <button class="btn" role="menuitem" aria-label="cloud icon">
          <clr-icon shape="cloud"></clr-icon>
          <span class="clr-icon-title">Cloud</span>
        </button>
      </div>
    </div>
  </div>
</div>

<h4 cds-text="subsection" class="clr-mt-32px">With Text</h4>

<div class="clr-example" style="min-height: 144px">
  <div class="btn-group btn-primary">
    <button class="btn">
      <clr-icon shape="home"></clr-icon>
      Home
    </button>
    <button class="btn">
      <clr-icon shape="cog"></clr-icon>
      Settings
    </button>
    <div class=
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/button-group/icons.html_

### mixed

```html
<div class="clr-example">
  <div class="btn-group btn-primary">
    <button class="btn">Favorite</button>
    <button class="btn btn-success">Add</button>
    <button class="btn btn-danger">Delete</button>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/button-group/mixed.html_

## More

- All documented examples: `angular-basic-structure`, `angular-directions`, `basic-structure`, `checkbox`, `icons`, `mixed`, `radio`, `types`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "button-group", features: [...] }`
