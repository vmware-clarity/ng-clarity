# tooltip — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/tooltips`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrTooltipModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-icon`, `clr-tooltip`, `clr-tooltip-content`
- Directives / inputs: `clrPosition`, `clrSize`, `clrTooltipTrigger`
- CSS classes: `tooltip`, `tooltip-bottom-left`, `tooltip-bottom-right`, `tooltip-content`, `tooltip-demo`, `tooltip-left`, `tooltip-lg`, `tooltip-md`, `tooltip-right`, `tooltip-sm`, `tooltip-top-left`, `tooltip-top-right`, `tooltip-xs`

## Examples

### tooltips-directions

```html
<h4 cds-text="subsection" class="clr-mt-32px">Top-Right</h4>
<div class="clr-example squeeze example-center">
  <a
    href="javascript://"
    role="tooltip"
    aria-haspopup="true"
    class="tooltip tooltip-sm tooltip-top-right"
    aria-label="top right direction"
  >
    <clr-icon shape="info-circle" size="24"></clr-icon>
    <span class="tooltip-content">Lorem ipsum sit</span>
  </a>
</div>

<h4 cds-text="subsection" class="clr-mt-32px">Top-Left</h4>
<div class="clr-example squeeze example-center">
  <a
    href="javascript://"
    role="tooltip"
    aria-haspopup="true"
    class="tooltip tooltip-sm tooltip-top-left"
    aria-label="top left direction"
  >
    <clr-icon shape="info-circle" size="24"></clr-icon>
    <span class="tooltip-content">Lorem ipsum sit</span>
  </a>
</div>

<h4 cds-text="subsection" class="clr-mt-32px">Bottom-Right</h4>
<div class="clr-example squeeze example-center">
  <a
    href="javascript://"
    role="tooltip"
    aria-haspopup="true"
    class="tooltip tooltip-md tooltip-bottom-right"
    aria-label="bottom right direction"
  >
    <clr-icon shape="info-circle" size="24"></clr-icon>
    <span class="tooltip-content">Lorem ipsum dolor sit amet, ipsum</span>
  </a>
</div>

<h4 cds-text="subsection" class="clr-mt-32px">Bottom-Left</h4>
<div class="clr-example squeeze example-center">
  <a
    href="javascript://"
    role="tooltip"
    aria-
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/tooltips/tooltips-directions.html_

### tooltips-sizes

```html
<h4 cds-text="subsection" class="clr-mt-32px">Extra Small</h4>
<div class="clr-example squeeze example-center">
  <a href="javascript://" role="tooltip" aria-haspopup="true" class="tooltip tooltip-xs" aria-label="extra small">
    <clr-icon shape="info-circle" size="24"></clr-icon>
    <span class="tooltip-content">Lorem</span>
  </a>
</div>

<h4 cds-text="subsection" class="clr-mt-32px">Small</h4>
<div class="clr-example squeeze example-center">
  <a href="javascript://" role="tooltip" aria-haspopup="true" class="tooltip tooltip-sm" aria-label="small">
    <clr-icon shape="info-circle" size="24"></clr-icon>
    <span class="tooltip-content">Lorem ipsum sit</span>
  </a>
</div>

<h4 cds-text="subsection" class="clr-mt-32px">Medium</h4>
<div class="clr-example squeeze example-center">
  <a href="javascript://" role="tooltip" aria-haspopup="true" class="tooltip tooltip-md" aria-label="medium">
    <clr-icon shape="info-circle" size="24"></clr-icon>
    <span class="tooltip-content"> Lorem ipsum dolor sit amet, ipsum </span>
  </a>
</div>

<h4 cds-text="subsection" class="clr-mt-32px">Large</h4>
<div class="clr-example squeeze example-center">
  <a href="javascript://" role="tooltip" aria-haspopup="true" class="tooltip tooltip-lg" aria-label="large">
    <clr-icon shape="info-circle" size="24"></clr-icon>
    <span class="tooltip-content">Lorem ipsum dolor sit amet, consectetur ad
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/tooltips/tooltips-sizes.html_

## More

- All documented examples: `tooltips-directions`, `tooltips-sizes`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "tooltip", features: [...] }`
