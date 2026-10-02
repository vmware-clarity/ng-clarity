# navigation — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/nav`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrNavigationModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-alert`, `clr-alert-item`, `clr-icon`, `clr-layout-large-screen-nav`, `clr-layout-only-subnav-primary`, `clr-layout-only-vertical-nav-primary`, `clr-layout-small-screen-nav`, `clr-vertical-nav`, `clr-vertical-nav-group`, `clr-vertical-nav-group-children`
- Directives / inputs: `clrAlertClosable`, `clrAlertType`, `clrVerticalNavGroupExpanded`, `clrVerticalNavLink`
- CSS classes: `alert`, `alert-icon`, `alert-icon-wrapper`, `alert-info`, `alert-item`, `alert-items`, `alert-text`, `nav`, `nav-icon`, `nav-item`, `nav-link`, `nav-text`

## Examples

### large-screen-nav

```html
<div class="clr-example">
  <div class="main-container">
    <header class="header header-1">
      <div class="branding">
        <a href="javascript:void(0)">
          <clr-icon shape="vm-bug"></clr-icon>
          <span class="title">Clarity Demo</span>
        </a>
      </div>
      <div class="header-nav">
        <a href="javascript://" class="active nav-link">
          <span class="nav-text">Patterns</span>
        </a>
        <a href="javascript://" class="nav-link" aria-current="page">
          <span class="nav-text">Components</span>
        </a>
      </div>
      <form class="search">
        <label for="search_input">
          <input id="search_input" type="text" placeholder="Search for keywords..." />
        </label>
      </form>
      <div class="settings">
        <a href="javascript://" class="nav-link nav-icon" aria-label="settings">
          <clr-icon shape="cog"></clr-icon>
        </a>
      </div>
    </header>
    <div class="content-container">
      <div class="content-area" cds-layout="m-t:md">
        <p cds-text="body">
          Welcome to clarity demo Application. Here you will find a list of all ClarityNG components. Including work in
          progress.
        </p>
        <p class="clr-mt-16px" cds-text="body">
          Click on one of the components in the side navigation to explore more!
        </p>
      </div>
      <clr-vertical
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/nav/large-screen-nav.html_

### layout-no-subnav

```html
<div class="clr-example">
  <div class="main-container">
    <header class="header-1">
      <div class="branding">
        <a href="javascript://">
          <clr-icon shape="vm-bug"></clr-icon>
          <span class="title">Project Clarity</span>
        </a>
      </div>
      <div class="settings">
        <a href="javascript://" class="nav-link nav-icon" aria-label="settings">
          <clr-icon shape="cog"></clr-icon>
        </a>
      </div>
    </header>
    <div class="content-container">
      <div class="content-area" cds-layout="m-t:md">
        <p cds-text="body">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora eligendi quos unde id optio culpa, illo
          perspiciatis laboriosam explicabo in voluptate incidunt est beatae rerum quisquam accusantium corporis
          reiciendis delectus!
        </p>
        <p class="clr-mt-16px" cds-text="body">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi nisi ad, minus fuga neque voluptatibus quidem
          libero ducimus quas ipsa eveniet explicabo voluptates sunt error! Eligendi a, animi consequatur odit.
        </p>
      </div>
      <clr-vertical-nav>
        <a clrVerticalNavLink>Link 1</a>
        <a clrVerticalNavLink>Link 2</a>
        <a clrVerticalNavLink class="active">Link 3</a>
        <a clrVerticalNavLink>Link 4</a>
        <a clrVerticalNavLink>L
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/nav/layout-no-subnav.html_

### layout-no-vertical-nav

```html
<div class="clr-example">
  <div class="main-container">
    <header class="header-1">
      <div class="branding">
        <a href="javascript://">
          <clr-icon shape="vm-bug"></clr-icon>
          <span class="title">Project Clarity</span>
        </a>
      </div>
      <div class="settings">
        <a href="javascript://" class="nav-link nav-icon" aria-label="settings">
          <clr-icon shape="cog"></clr-icon>
        </a>
      </div>
    </header>
    <nav class="subnav">
      <ul class="nav">
        <li class="nav-item">
          <a class="nav-link active" href="javascript://">Dashboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="javascript://">Management</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="javascript://">Cloud</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="javascript://">Tenants</a>
        </li>
      </ul>
    </nav>
    <div class="content-container">
      <div class="content-area" cds-layout="m-t:md">
        <p cds-text="body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Non enim praesent elementum facilisis leo vel fringilla. Euismod elementum nisi quis eleifend
          quam adipiscing vitae proin. Volutpat consequat mauris nu
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/nav/layout-no-vertical-nav.html_

### layout-only-header

```html
<div class="clr-example">
  <div class="main-container">
    <header class="header header-1">
      <div class="branding">
        <a href="javascript:void(0)">
          <clr-icon shape="vm-bug"></clr-icon>
          <span class="title">Project Clarity</span>
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
    <div class="content-container">
      <div class="content-area" cds-layout="m-t:md">
        <p cds-text="body">Content Area</p>
        <p class="clr-mt-16px" cds-text="body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu odio nisi. Vestibulum dignissim eget massa
          sit amet feugiat. Quisque auctor mattis quam eu suscipit. Morbi ipsum risus, feugiat vitae sem at, tincidunt
          elementum magna. Phasellus tristique posuere dui, ut tempus felis sagittis quis. Integer iaculis ultrices
          elit, sed venenatis eros. Vivamus interdum semper velit eget gravida. Sed finibus eget lacus sed semper.
          Suspendisse fringilla, tellus in molestie cursus, sapien purus volutpat lacus, eget venenatis
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/nav/layout-only-header.html_

### layout-subnav-primary

```html
<div class="clr-example">
  <div class="main-container">
    <header class="header header-1">
      <div class="branding">
        <a href="javascript:void(0)">
          <clr-icon shape="vm-bug"></clr-icon>
          <span class="title">Project Clarity</span>
        </a>
      </div>
      <form class="search">
        <label for="search_input6">
          <input id="search_input6" type="text" placeholder="Search for keywords..." />
        </label>
      </form>
      <div class="settings">
        <a href="javascript://" class="nav-link nav-icon" aria-label="settings">
          <clr-icon shape="cog"></clr-icon>
        </a>
      </div>
    </header>
    <nav class="subnav">
      <ul class="nav">
        <li class="nav-item">
          <a class="nav-link active" href="javascript://">Subnav Link 1</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="javascript://">Subnav Link 2</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="javascript://">Subnav Link 3</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="javascript://">Subnav Link 4</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="javascript://">Subnav Link 5</a>
        </li>
      </ul>
    </nav>
    <div class="content-container">
      <div class="content-area" cds-layout="m-t:md">
    
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/nav/layout-subnav-primary.html_

### layout-vertical-nav-primary

```html
<div class="clr-example">
  <div class="main-container">
    <header class="header header-1">
      <div class="branding">
        <a href="javascript:void(0)">
          <clr-icon shape="vm-bug"></clr-icon>
          <span class="title">Project Clarity</span>
        </a>
      </div>
      <form class="search">
        <label for="search_input7">
          <input id="search_input7" type="text" placeholder="Search for keywords..." />
        </label>
      </form>
      <div class="settings">
        <a href="javascript://" class="nav-link nav-icon" aria-label="settings">
          <clr-icon shape="cog"></clr-icon>
        </a>
      </div>
    </header>
    <div class="content-container">
      <div class="content-area" cds-layout="m-t:md">
        <p cds-text="body">Content Area</p>
        <p class="clr-mt-16px" cds-text="body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu odio nisi. Vestibulum dignissim eget massa
          sit amet feugiat. Quisque auctor mattis quam eu suscipit. Morbi ipsum risus, feugiat vitae sem at, tincidunt
          elementum magna. Phasellus tristique posuere dui, ut tempus felis sagittis quis. Integer iaculis ultrices
          elit, sed venenatis eros. Vivamus interdum semper velit eget gravida. Sed finibus eget lacus sed semper.
          Suspendisse fringilla, tellus in molestie cursus, sapien purus volutpat la
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/nav/layout-vertical-nav-primary.html_

## More

- All documented examples: `large-screen-nav`, `layout-no-subnav`, `layout-no-vertical-nav`, `layout-only-header`, `layout-subnav-primary`, `layout-vertical-nav-primary`, `small-screen-nav`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "navigation", features: [...] }`
