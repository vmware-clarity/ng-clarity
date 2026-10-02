# alert — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/alert`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrAlertModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-alert`, `clr-alert-item`, `clr-alerts`, `clr-dropdown`, `clr-dropdown-menu`, `clr-icon`
- Directives / inputs: `clrAlertAppLevel`, `clrAlertClosable`, `clrAlertClosed`, `clrAlertClosedChange`, `clrAlertIcon`, `clrAlertLightweight`, `clrAlertSizeSmall`, `clrAlertType`, `clrCloseButtonAriaLabel`, `clrDropdownItem`, `clrDropdownTrigger`, `clrPosition`
- CSS classes: `alert`, `alert-action`, `alert-actions`, `alert-app-level`, `alert-danger`, `alert-icon`, `alert-icon-wrapper`, `alert-info`, `alert-item`, `alert-items`, `alert-lightweight`, `alert-sm`, `alert-success`, `alert-text`, `alert-warning`, `btn`, `btn-danger`, `btn-link`, `btn-outline`, `btn-primary`, `btn-sm`, `card`, `card-block`, `card-footer`, `card-header`, `card-link`, `card-media-block`, `card-media-description`, `card-media-image`, `card-media-text`, `card-media-title`, `card-text`, `card-title`, `dropdown`, `dropdown-item`, `dropdown-menu`, `dropdown-toggle`, `nav-link`, `progress`

## Examples

### angular

```html
<div class="clr-example">
  <div class="main-container">
    <clr-alerts>
      <clr-alert [clrAlertType]="'info'" [clrAlertAppLevel]="true">
        <clr-alert-item>
          <span class="alert-text"> View additional alerts using the pager </span>
          <div class="alert-actions">
            <button class="btn alert-action">Fix</button>
          </div>
        </clr-alert-item>
      </clr-alert>
      <clr-alert [clrAlertType]="'warning'" [clrAlertAppLevel]="true">
        <clr-alert-item>
          <span class="alert-text"> Application level alerts should only be used for important messages. </span>
          <div class="alert-actions">
            <button class="btn alert-action">Fix</button>
          </div>
        </clr-alert-item>
      </clr-alert>
      <clr-alert [clrAlertType]="'danger'" [clrAlertAppLevel]="true">
        <div class="alert-item">
          <span class="alert-text"> Don't add too many of these alerts! </span>
          <div class="alert-actions">
            <button class="btn alert-action">Fix</button>
          </div>
        </div>
      </clr-alert>
    </clr-alerts>
    <header class="header header-1">
      <div class="branding">
        <span class="nav-link"><span class="title">Header</span></span>
      </div>
    </header>
    <div class="content-container">
      <div class="content-area" cds-layout="m-t:md">
        <p cds-text="bo
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/alert/angular/alert-angular-app-level-alerts.demo.html_

### static

```html
<div class="clr-example">
  <div class="main-container">
    <div class="alert alert-app-level alert-danger" style="margin-bottom: 24px">
      <div class="alert-items">
        <div class="alert-item static">
          <div class="alert-icon-wrapper">
            <clr-icon class="alert-icon" shape="error-standard"> </clr-icon>
          </div>
          <div class="alert-text">Alert Type: Danger</div>
          <div class="alert-actions">
            <button class="btn alert-action">Action</button>
          </div>
        </div>
      </div>
      <button type="button" class="close" aria-label="Close">
        <clr-icon aria-hidden="true" shape="times"></clr-icon>
      </button>
    </div>
    <div class="alert alert-app-level alert-warning" style="margin-bottom: 24px">
      <div class="alert-items">
        <div class="alert-item static">
          <div class="alert-icon-wrapper">
            <clr-icon class="alert-icon" shape="warning-standard"></clr-icon>
          </div>
          <div class="alert-text">Alert Type: Warning</div>
          <div class="alert-actions">
            <button class="btn alert-action">Action</button>
          </div>
        </div>
      </div>
      <button type="button" class="close" aria-label="Close">
        <clr-icon aria-hidden="true" shape="times"></clr-icon>
      </button>
    </div>
    <div class="alert alert-app-level alert-info">
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/alert/static/alert-app-level.demo.html_

## More

- All documented examples: `angular`, `static`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "alert", features: [...] }`
