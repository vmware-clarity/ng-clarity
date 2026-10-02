# breadcrumbs — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/breadcrumbs`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrBreadcrumbsModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-breadcrumbs`, `clr-icon`, `clr-vertical-nav`
- Directives / inputs: `clrBreadcrumbItemClick`, `clrVerticalNavLink`
- CSS classes: `clr-hidden-sm-up`, `clr-hidden-xs-down`

## Examples

### breadcrumbs-full-routing-example

```html
<div class="clr-example nomargin">
  <div class="main-container">
    <header class="header">
      <div class="branding">
        <a routerLink="./framework" routerLinkActive="active">
          <clr-icon shape="cog"></clr-icon>
          <span class="title">Technology</span>
        </a>
      </div>
    </header>
    <div class="content-container">
      <clr-vertical-nav>
        <a clrVerticalNavLink routerLink="./framework" routerLinkActive="active">Framework</a>
      </clr-vertical-nav>
      <div class="content-area breadcrumbs-content-area">
        <clr-breadcrumbs [items]="(breadcrumbs | async) || []"></clr-breadcrumbs>
        <router-outlet></router-outlet>
      </div>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/breadcrumbs/breadcrumbs-full-routing-example.html_

### breadcrumbs-href-example

```html
<div class="clr-example nomargin">
  <clr-breadcrumbs [items]="breadcrumbs"></clr-breadcrumbs>
</div>
```

_source: projects/website/src/app/documentation/demos/breadcrumbs/breadcrumbs-href-example.html_

### breadcrumbs-routing-example

```html
<div class="clr-example nomargin">
  <clr-breadcrumbs [items]="breadcrumbs"></clr-breadcrumbs>
</div>
```

_source: projects/website/src/app/documentation/demos/breadcrumbs/breadcrumbs-routing-example.html_

## More

- All documented examples: `breadcrumbs-full-routing-example`, `breadcrumbs-href-example`, `breadcrumbs-routing-example`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "breadcrumbs", features: [...] }`
