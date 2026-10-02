# card — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/card`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrCardModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-icon`
- Directives / inputs: _(none observed)_
- CSS classes: `alert`, `alert-icon`, `alert-icon-wrapper`, `alert-item`, `alert-items`, `alert-sm`, `alert-text`, `alert-warning`, `btn`, `btn-link`, `btn-primary`, `btn-sm`, `card`, `card-block`, `card-columns`, `card-footer`, `card-header`, `card-img`, `card-link`, `card-media-block`, `card-media-description`, `card-media-image`, `card-media-text`, `card-media-title`, `card-text`, `card-title`, `clr-display-block`, `dropdown`, `dropdown-item`, `dropdown-menu`, `dropdown-toggle`, `progress`, `progress-block`, `progress-meter`, `progress-static`

## Examples

### card-clickable

```html
<div class="clr-example nomargin">
  <div class="clr-row">
    <div class="clr-col-lg-6 clr-col-12">
      <a href="javascript://" class="card clickable">
        <div class="card-img">
          <img src="/assets/images/documentation/cards/placeholder_350x150.png" alt="Example of Image in a Card" />
        </div>
        <div class="card-block">
          <p class="card-text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci consectetur magnam eos amet sit rem.
            Ipsam maiores incidunt eum quasi enim! Corporis sunt nisi totam molestias quam commodi maxime mollitia.
          </p>
        </div>
      </a>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/card/card-clickable.html_

### card-dropdown

```html
<div class="clr-example nomargin" ngNonBindable>
  <div class="clr-row">
    <div class="clr-col-lg-6 clr-col-12">
      <div class="card">
        <div class="card-header">Header</div>
        <div class="card-block">
          <div class="card-title">Block</div>
          <div class="card-text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias officiis temporibus quod inventore,
            minus commodi similique corrupti repellat saepe facere aliquam minima deserunt esse nemo, vel illum optio
            necessitatibus deleniti.
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-sm btn-link">Action 1</button>
          <button class="btn btn-sm btn-link">Action 2</button>
          <div class="dropdown top-left open">
            <button class="dropdown-toggle btn btn-sm btn-link">
              Dropdown 1
              <clr-icon shape="angle" direction="down"></clr-icon>
            </button>
            <div class="dropdown-menu" role="menu">
              <a href="javascript://" class="dropdown-item" role="menuitem">Item 1</a>
              <a href="javascript://" class="dropdown-item" role="menuitem">Item 2</a>
              <a href="javascript://" class="dropdown-item" role="menuitem">Item 3</a>
              <a href="javascript://" class="dropdown-item" role="menuitem">Item 4</a>
          
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/card/card-dropdown.html_

### card-grid

```html
<div class="clr-example nomargin">
  <div class="clr-row">
    <div class="clr-col-lg-4 clr-col-12">
      <div class="card">
        <div class="card-block">
          <div class="card-title">Card 1</div>
          <p class="card-text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </p>
        </div>
        <div class="card-footer">
          <a href="javascript://" class="btn btn-sm btn-link">Action 1</a>
        </div>
      </div>
    </div>
    <div class="clr-col-lg-4 clr-col-12">
      <div class="card">
        <div class="card-block">
          <div class="card-title">Card 2</div>
          <p class="card-text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </p>
        </div>
        <div class="card-footer">
          <a href="javascript://" class="btn btn-sm btn-link">Action 2</a>
        </div>
      </div>
    </div>
    <div class="clr-col-lg-4 clr-col-12">
      <div class="card">
        <div class="ca
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/card/card-grid.html_

### card-images

```html
<div class="clr-example nomargin">
  <div class="clr-row">
    <div class="clr-col-lg-4 clr-col-12">
      <a href="javascript://" class="card clickable">
        <div class="card-img">
          <img src="/assets/images/documentation/cards/placeholder_350x150.png" alt="Example of Image in a Card" />
        </div>
        <div class="card-block">
          <p class="card-text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci consectetur magnam eos amet sit rem.
            Ipsam maiores incidunt eum quasi enim! Corporis sunt nisi totam molestias quam commodi maxime mollitia.
          </p>
        </div>
      </a>
    </div>
    <div class="clr-col-lg-4 clr-col-12">
      <a href="javascript://" class="card clickable">
        <div class="card-block">
          <p class="card-text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci consectetur magnam eos amet sit rem.
            Ipsam maiores incidunt eum quasi enim! Corporis sunt nisi totam molestias quam commodi maxime mollitia.
          </p>
        </div>
        <div class="card-img">
          <img src="/assets/images/documentation/cards/placeholder_350x150.png" alt="Example of Image in a Card" />
        </div>
      </a>
    </div>
    <div class="clr-col-lg-4 clr-col-12">
      <a href="javascript://" class="card clickable">
        <div class="card-block"
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/card/card-images.html_

### card-layout

```html
<div class="clr-example nomargin">
  <div class="clr-row">
    <div class="clr-col-lg-5 clr-col-md-8 clr-col-12">
      <div class="card">
        <div class="card-header">Header</div>
        <div class="card-block">
          <div class="card-title">Block</div>
          <div class="card-text">
            Card content can contain text, links, images, data visualizations, lists and more.
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-sm btn-link">Footer Action 1</button>
          <button class="btn btn-sm btn-link">Footer Action 2</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/card/card-layout.html_

### card-list-group

```html
<div class="clr-example nomargin">
  <div class="card">
    <div class="card-img">
      <img src="/assets/images/documentation/cards/placeholder_350x150.png" alt="Example of Image in a Card" />
    </div>
    <div class="card-block">
      <div class="card-title">Title</div>
      <p class="card-text">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea, aut. Nihil nemo, necessitatibus earum.
      </p>
    </div>
    <ul class="list-group">
      <li class="list-group-item">Lorem ipsum dolor.</li>
      <li class="list-group-item">Lorem ipsum dolor sit.</li>
      <li class="list-group-item">Lorem ipsum.</li>
    </ul>
    <div class="card-footer">
      <a href="javascript://" class="btn btn-sm btn-link">Action 1</a>
      <a href="javascript://" class="btn btn-sm btn-link">Action 2</a>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/card/card-list-group.html_

## More

- All documented examples: `card-clickable`, `card-dropdown`, `card-grid`, `card-images`, `card-layout`, `card-list-group`, `card-masonry`, `card-media-block`, `lists-in-cards`, `progress-bar-cards`, `progress-bar-inline-cards`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "card", features: [...] }`
