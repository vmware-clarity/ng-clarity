# vertical-nav — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/vertical-nav`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrVerticalNavModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-alert`, `clr-alert-item`, `clr-icon`, `clr-vertical-nav`, `clr-vertical-nav-group`, `clr-vertical-nav-group-children`
- Directives / inputs: `clrAlertClosable`, `clrAlertType`, `clrAriaCurrentLink`, `clrFocusOnViewInit`, `clrIfExpanded`, `clrVerticalNavCollapsed`, `clrVerticalNavCollapsible`, `clrVerticalNavGroupExpanded`, `clrVerticalNavIcon`, `clrVerticalNavLink`, `clrVerticalNavToggleLabel`
- CSS classes: `alert-text`, `btn`, `btn-primary`, `clr-hidden-sm-up`, `clr-hidden-xs-down`, `nav`, `nav-box`, `nav-divider`, `nav-header`, `nav-item`, `nav-link`

## Examples

### basic-nav

```html
<div class="clr-example">
  <div class="main-container">
    <header class="header">
      <div class="branding">
        <a href="javascript://">
          <clr-icon shape="bolt"></clr-icon>
          <span class="title">Project Pokémon</span>
        </a>
      </div>
    </header>
    <div class="content-container">
      <clr-vertical-nav>
        <a clrVerticalNavLink href="javascript://">Snorlax</a>
        <a clrVerticalNavLink href="javascript://" class="active">Jigglypuff</a>
        <a clrVerticalNavLink href="javascript://">Ditto</a>
        <a clrVerticalNavLink href="javascript://">Charizard</a>
        <a clrVerticalNavLink href="javascript://">Arcanine</a>
        <a clrVerticalNavLink href="javascript://">Blastoise</a>
        <a clrVerticalNavLink href="javascript://">Gyrados</a>
        <a clrVerticalNavLink href="javascript://">Jolteon</a>
        <a clrVerticalNavLink href="javascript://">Raichu</a>
      </clr-vertical-nav>
      <div class="content-area">
        <div class="subsection bold">Jigglypuff</div>
        <p>
          Jigglypuff is a round, pink ball with pointed ears and large, blue eyes. It has rubbery, balloon-like skin and
          small, stubby arms and somewhat long feet. On top of its head is a curled tuft of fur. As seen in Pokémon
          Stadium, it is filled with air. As a defeated Jigglypuff, it deflates until it is flat. By draw
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/vertical-nav/basic-nav/basic-nav.html_

### basic-nav-usage

```html
<div class="clr-example" style="margin-top: 0">
  <div class="main-container" style="height: 468px">
    <header class="header">
      <div class="branding">
        <a href="javascript://">
          <clr-icon shape="bolt"></clr-icon>
          <span class="title">Project Pokémon</span>
        </a>
      </div>
    </header>
    @if (demoToggleDont()) {
    <nav class="subnav">
      <ul class="nav">
        <li class="nav-item">
          <a class="nav-link active" href="javascript://">Pokédex</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="javascript://">Movies</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="javascript://">Games</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="javascript://">Events</a>
        </li>
      </ul>
    </nav>
    }
    <div class="content-container">
      <clr-vertical-nav>
        <a clrVerticalNavLink href="javascript://">Snorlax</a>
        <a clrVerticalNavLink href="javascript://" class="active">Jigglypuff</a>
        <a clrVerticalNavLink href="javascript://">Ditto</a>
        <a clrVerticalNavLink href="javascript://">Charizard</a>
        <a clrVerticalNavLink href="javascript://">Arcanine</a>
        <a clrVerticalNavLink href="javascript://">Blastoise</a>
        <a clrVerticalNavLink href="javascript://">Gyrados</a>
        <a 
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/vertical-nav/basic-nav-usage/basic-nav-usage.html_

### collapsible-nav

```html
<div class="clr-example" style="margin-top: 0">
  <div class="main-container" style="width: 240px; margin: 12px auto; height: 408px">
    <div class="content-container">
      <clr-vertical-nav [clrVerticalNavCollapsible]="true" [clrVerticalNavCollapsed]="demoCollapsed()">
        <a clrVerticalNavLink href="javascript://">
          @if (!demoHideIcons()) {
          <clr-icon shape="user" clrVerticalNavIcon></clr-icon>
          } Normal
        </a>
        <a clrVerticalNavLink href="javascript://" class="active">
          @if (!demoHideIcons()) {
          <clr-icon shape="flame" clrVerticalNavIcon></clr-icon>
          } Fire
        </a>
        <a clrVerticalNavLink href="javascript://">
          @if (!demoHideIcons()) {
          <clr-icon shape="download-cloud" clrVerticalNavIcon></clr-icon>
          } Water
        </a>
        <a clrVerticalNavLink href="javascript://">
          @if (!demoHideIcons()) {
          <clr-icon shape="bolt" clrVerticalNavIcon></clr-icon>
          } Electric
        </a>
        <a clrVerticalNavLink href="javascript://">
          @if (!demoHideIcons()) {
          <clr-icon shape="bug" clrVerticalNavIcon></clr-icon>
          } Grass
        </a>
        <a clrVerticalNavLink href="javascript://">
          @if (!demoHideIcons()) {
          <clr-icon shape="block" clrVerticalNavIcon></clr-icon>
          } Ice
        </a>
       
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/vertical-nav/collapsible-nav/collapsible-nav.html_

### icons

```html
<div class="clr-example example-margin">
  <div class="main-container nav-box">
    <div class="content-container">
      <clr-vertical-nav>
        <a clrVerticalNavLink href="javascript://">
          <clr-icon shape="user" clrVerticalNavIcon></clr-icon>
          Normal
        </a>
        <a clrVerticalNavLink href="javascript://" class="active">
          <clr-icon shape="flame" clrVerticalNavIcon></clr-icon>
          Fire
        </a>
        <a clrVerticalNavLink href="javascript://">
          @if (!demoHideIcons()) {
          <clr-icon shape="download-cloud" clrVerticalNavIcon></clr-icon>
          } Water
        </a>
        <a clrVerticalNavLink href="javascript://">
          <clr-icon shape="bolt" clrVerticalNavIcon></clr-icon>
          Electric
        </a>
        <a clrVerticalNavLink href="javascript://">
          @if (!demoHideIcons()) {
          <clr-icon shape="bug" clrVerticalNavIcon></clr-icon>
          } Grass
        </a>
        <a clrVerticalNavLink href="javascript://">
          <clr-icon shape="block" clrVerticalNavIcon></clr-icon>
          Ice
        </a>
        @if (!demoLongLabel()) {
        <a clrVerticalNavLink href="javascript://">
          @if (!demoHideIcons()) {
          <clr-icon shape="shield" clrVerticalNavIcon></clr-icon>
          } Fighting
        </a>
        } @if (demoLongLabel()) {
        <a clrVerticalNavLink href
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/vertical-nav/icons/icons.html_

### just-navs

```html
<div class="clr-example example-margin">
  <div class="main-container nav-box">
    <div class="content-container">
      @if (!(demoWithDividers() || demoWithHeadersAndDividers())) {
      <clr-vertical-nav>
        <a clrVerticalNavLink href="javascript://">Snorlax</a>
        <a clrVerticalNavLink href="javascript://" class="active">Jigglypuff</a>
        <a clrVerticalNavLink href="javascript://">Ditto</a>
        @if (!demoLongLabel()) {
        <a clrVerticalNavLink href="javascript://">Charizard</a>
        } @if (demoLongLabel()) {
        <a clrVerticalNavLink href="javascript://">Ultra Rare Mega Charizard EX (Secret Rare)</a>
        }
        <a clrVerticalNavLink href="javascript://">Arcanine</a>
        <a clrVerticalNavLink href="javascript://">Blastoise</a>
        <a clrVerticalNavLink href="javascript://">Gyrados</a>
        <a clrVerticalNavLink href="javascript://">Jolteon</a>
        <a clrVerticalNavLink href="javascript://">Raichu</a>
      </clr-vertical-nav>
      } @if (demoWithDividers()) {
      <clr-vertical-nav>
        <a clrVerticalNavLink href="javascript://">Snorlax</a>
        <a clrVerticalNavLink href="javascript://" class="active">Jigglypuff</a>
        <a clrVerticalNavLink href="javascript://">Ditto</a>
        <div class="nav-divider"></div>
        <a clrVerticalNavLink href="javascript://">Charizard</a>
        <a clrVerticalNavLink hre
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/vertical-nav/just-navs/just-navs.html_

### nav-groups

```html
<div class="clr-example example-margin">
  <div class="main-container nav-box">
    <div class="content-container">
      <clr-vertical-nav [clrVerticalNavCollapsible]="demoCollapsible()">
        <clr-vertical-nav-group>
          @if (!demoHideIcons()) {
          <clr-icon shape="user" clrVerticalNavIcon></clr-icon>
          } Normal
          <clr-vertical-nav-group-children>
            <a href="javascript://" clrVerticalNavLink> Pidgey </a>
            <a href="javascript://" clrVerticalNavLink> Rattata </a>
            <a href="javascript://" clrVerticalNavLink> Spearow </a>
          </clr-vertical-nav-group-children>
        </clr-vertical-nav-group>
        <clr-vertical-nav-group class="active" [clrVerticalNavGroupExpanded]="demoExpandedGroup()">
          @if (!demoHideIcons()) {
          <clr-icon shape="flame" clrVerticalNavIcon></clr-icon>
          } Fire
          <clr-vertical-nav-group-children>
            <a href="javascript://" clrVerticalNavLink class="active"> Charmander </a>
            <a href="javascript://" clrVerticalNavLink> Charmeleon </a>
            @if (!demoLongLabel()) {
            <a href="javascript://" clrVerticalNavLink> Charizard </a>
            } @if (demoLongLabel()) {
            <a href="javascript://" clrVerticalNavLink> Ultra Rare Mega Charizard (Secret Rare) </a>
            }
          </clr-vertical-nav-group-children>
     
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/vertical-nav/nav-groups/nav-groups.html_

## More

- All documented examples: `basic-nav`, `basic-nav-usage`, `collapsible-nav`, `icons`, `just-navs`, `nav-groups`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "vertical-nav", features: [...] }`
