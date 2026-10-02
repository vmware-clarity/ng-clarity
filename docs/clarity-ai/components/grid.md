# grid — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/grid`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrGridModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-alert`, `clr-alert-item`
- Directives / inputs: `clrAlertClosable`, `clrAlertType`
- CSS classes: `alert-text`, `clr-align-items-center`, `clr-align-items-end`, `clr-align-items-start`, `clr-align-self-center`, `clr-align-self-end`, `clr-align-self-start`, `clr-break-row`, `clr-justify-content-around`, `clr-justify-content-between`, `clr-justify-content-center`, `clr-justify-content-end`, `clr-justify-content-start`, `clr-order-2`, `clr-order-3`

## Examples

### grid-auto-layout-1

```html
<div class="clr-example">
  <div class="clr-row">
    <div class="clr-col">
      <span class="clr-example-col-value">1/5</span>
    </div>
    <div class="clr-col">
      <span class="clr-example-col-value">1/5</span>
    </div>
    <div class="clr-col">
      <span class="clr-example-col-value">1/5</span>
    </div>
    <div class="clr-col">
      <span class="clr-example-col-value">1/5</span>
    </div>
    <div class="clr-col">
      <span class="clr-example-col-value">1/5</span>
    </div>
  </div>
  <div class="clr-row">
    <div class="clr-col">
      <span class="clr-example-col-value">1/3</span>
    </div>
    <div class="clr-col">
      <span class="clr-example-col-value">1/3</span>
    </div>
    <div class="clr-col">
      <span class="clr-example-col-value">1/3</span>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/grid/grid-auto-layout-1.html_

### grid-auto-layout-2

```html
<div class="clr-example">
  <div class="clr-row">
    <div class="clr-col-4">
      <span class="clr-example-col-value">1/3 (fixed)</span>
    </div>
    <div class="clr-col">
      <span class="clr-example-col-value">Remaining</span>
    </div>
  </div>
</div>

<div class="clr-example">
  <div class="clr-row">
    <div class="clr-col">
      <span class="clr-example-col-value">1/4 (auto)</span>
    </div>
    <div class="clr-col-6">
      <span class="clr-example-col-value">1/2 (fixed)</span>
    </div>
    <div class="clr-col">
      <span class="clr-example-col-value">1/4 (auto)</span>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/grid/grid-auto-layout-2.html_

### grid-auto-layout-3

```html
<div class="clr-example">
  <div class="clr-row">
    <div class="clr-col clr-col-lg-2">
      <span class="clr-example-col-value">1 of 3</span>
    </div>
    <div class="clr-col-lg-auto">
      <span class="clr-example-col-value">Variable width content</span>
    </div>
    <div class="clr-col clr-col-lg-2">
      <span class="clr-example-col-value">3 of 3</span>
    </div>
  </div>
  <div class="clr-row">
    <div class="clr-col">
      <span class="clr-example-col-value">1 of 3</span>
    </div>
    <div class="clr-col-md-auto">
      <span class="clr-example-col-value">Variable Width Content</span>
    </div>
    <div class="clr-col clr-col-lg-2">
      <span class="clr-example-col-value">3 of 3</span>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/grid/grid-auto-layout-3.html_

### grid-auto-layout-4

```html
<div class="clr-example">
  <div class="clr-row">
    <div class="clr-col">
      <span class="clr-example-col-value">clr-col</span>
    </div>
    <div class="clr-col">
      <span class="clr-example-col-value">clr-col</span>
    </div>
    <div class="clr-break-row"></div>
    <div class="clr-col">
      <span class="clr-example-col-value">clr-col</span>
    </div>
    <div class="clr-col">
      <span class="clr-example-col-value">clr-col</span>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/grid/grid-auto-layout-4.html_

### grid-column-offsetting

```html
<div class="clr-example clr-example-column-demo">
  <div class="clr-row">
    <div class="clr-col-sm-4">
      <span class="clr-example-col-value">clr-col-sm-4</span>
    </div>
    <div class="clr-col-sm-6 clr-offset-sm-2">
      <span class="clr-example-col-value">clr-col-sm-6 clr-offset-sm-2</span>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/grid/grid-column-offsetting.html_

### grid-column-ordering

```html
<div class="clr-example">
  <div class="clr-row">
    <div class="clr-col">
      <span class="clr-example-col-value">1st, Unordered</span>
    </div>
    <div class="clr-col clr-order-3">
      <span class="clr-example-col-value">2nd, Order 3</span>
    </div>
    <div class="clr-col clr-order-2">
      <span class="clr-example-col-value">3rd, Order 2</span>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/grid/grid-column-ordering.html_

## More

- All documented examples: `grid-auto-layout-1`, `grid-auto-layout-2`, `grid-auto-layout-3`, `grid-auto-layout-4`, `grid-column-offsetting`, `grid-column-ordering`, `grid-column-stacking`, `grid-column-wrapping`, `grid-columns`, `grid-items-horizontal-alignment`, `grid-items-individual-vertical-alignment`, `grid-items-vertical-alignment`, `grid-nesting`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "grid", features: [...] }`
