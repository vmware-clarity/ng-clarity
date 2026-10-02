# app-layout — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/app-layout`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrAppLayoutModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-icon`, `clr-vertical-nav`
- Directives / inputs: `clrVerticalNavLink`
- CSS classes: `alert`, `alert-action`, `alert-actions`, `alert-app-level`, `alert-icon`, `alert-icon-wrapper`, `alert-info`, `alert-item`, `alert-items`, `alert-text`, `btn`, `btn-sm`, `nav`, `nav-icon`, `nav-item`, `nav-link`

## Examples

### layout-all

```html
<div class="clr-example">
  <div class="main-container">
    <div class="alert alert-app-level alert-info">
      <div class="alert-items">
        <div class="alert-item static">
          <div class="alert-icon-wrapper">
            <clr-icon class="alert-icon" shape="info-circle"></clr-icon>
          </div>
          <div class="alert-text">App Level Alert</div>
          <div class="alert-actions">
            <button class="btn btn-sm alert-action">Action</button>
          </div>
        </div>
      </div>
      <button type="button" class="close" aria-label="Close">
        <clr-icon shape="times"></clr-icon>
      </button>
    </div>
    <header class="header header-1">
      <div class="branding">
        <a href="javascript://">
          <clr-icon shape="vm-bug"></clr-icon>
          <span class="title">Clarity Design</span>
        </a>
      </div>
      <div class="header-nav">
        <a href="javascript://" class="nav-link nav-icon" aria-label="cloud service">
          <clr-icon shape="cloud"></clr-icon>
        </a>
        <a href="javascript://" class="active nav-link nav-icon" aria-label="storage service">
          <clr-icon shape="folder"></clr-icon>
        </a>
      </div>
    </header>
    <nav class="subnav">
      <ul class="nav">
        <li class="nav-item">
          <a class="nav-link active" href="javascript://">Subnav Link 1</a>
        </l
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/app-layout/layout-all.html_

## More

- All documented examples: `layout-all`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "app-layout", features: [...] }`
