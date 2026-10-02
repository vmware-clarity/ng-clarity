# table — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/tables`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrTableModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: _(none observed)_
- Directives / inputs: _(none observed)_
- CSS classes: _(none observed)_

## Examples

### tables-basic

```html
<table class="table" cds-text="body">
  <thead>
    <tr>
      <th>Decimal</th>
      <th>Hexadecimal</th>
      <th>Binary</th>
      <th class="hidden-xs-down">Roman Numeral</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td class="hidden-xs-down">I</td>
    </tr>
    <tr>
      <td>5</td>
      <td>5</td>
      <td>101</td>
      <td class="hidden-xs-down">V</td>
    </tr>
    <tr>
      <td>10</td>
      <td>A</td>
      <td>1010</td>
      <td class="hidden-xs-down">X</td>
    </tr>
    <tr>
      <td>15</td>
      <td>F</td>
      <td>1111</td>
      <td class="hidden-xs-down">XV</td>
    </tr>
  </tbody>
</table>
```

_source: projects/website/src/app/documentation/demos/tables/tables-basic.html_

### tables-compact-noborder

```html
<table cds-text="body" class="table table-compact table-noborder">
  <thead>
    <tr>
      <th class="left">Monster</th>
      <th class="hidden-xs-down">Home</th>
      <th>Likes Cookies</th>
      <th class="left hidden-xs-down">Fun to Play With</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="left">Wolfman</td>
      <td class="hidden-xs-down">Nondisclosed countryside</td>
      <td>Sometimes</td>
      <td class="left hidden-xs-down">Not really</td>
    </tr>
    <tr>
      <td class="left">Mothra</td>
      <td class="hidden-xs-down">Tropical island</td>
      <td>No</td>
      <td class="left hidden-xs-down">Only if you have a flashlight</td>
    </tr>
    <tr>
      <td class="left">Oscar the Grouch</td>
      <td class="hidden-xs-down">Sesame Street</td>
      <td>No</td>
      <td class="left hidden-xs-down">No</td>
    </tr>
    <tr>
      <td class="left">Cookie Monster</td>
      <td class="hidden-xs-down">Sesame Street</td>
      <td>Definitely yes</td>
      <td class="left hidden-xs-down">Only if you have no cookies</td>
    </tr>
  </tbody>
</table>
```

_source: projects/website/src/app/documentation/demos/tables/tables-compact-noborder.html_

### tables-compact

```html
<table cds-text="body" class="table table-compact">
  <thead>
    <tr>
      <th class="left">Monster</th>
      <th class="hidden-xs-down">Home</th>
      <th>Likes Cookies</th>
      <th class="left hidden-xs-down">Fun to Play With</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="left">Wolfman</td>
      <td class="hidden-xs-down">Nondisclosed countryside</td>
      <td>Sometimes</td>
      <td class="left hidden-xs-down">Not really</td>
    </tr>
    <tr>
      <td class="left">Mothra</td>
      <td class="hidden-xs-down">Tropical island</td>
      <td>No</td>
      <td class="left hidden-xs-down">Only if you have a flashlight</td>
    </tr>
    <tr>
      <td class="left">Oscar the Grouch</td>
      <td class="hidden-xs-down">Sesame Street</td>
      <td>No</td>
      <td class="left hidden-xs-down">No</td>
    </tr>
    <tr>
      <td class="left">Cookie Monster</td>
      <td class="hidden-xs-down">Sesame Street</td>
      <td>Definitely yes</td>
      <td class="left hidden-xs-down">Only if you have no cookies</td>
    </tr>
  </tbody>
</table>
```

_source: projects/website/src/app/documentation/demos/tables/tables-compact.html_

### tables-leftcell

```html
<table cds-text="body" class="table">
  <thead>
    <tr>
      <th class="left">Wizard</th>
      <th>Allegiance</th>
      <th class="hidden-xs-down">Triwizard Champion?</th>
      <th>Can Cast Fireball</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="left">Harry</td>
      <td>Gryffindor</td>
      <td class="hidden-xs-down">Yes</td>
      <td>No</td>
    </tr>
    <tr>
      <td class="left">Gandalf</td>
      <td>Hobbits</td>
      <td class="hidden-xs-down">Maybe?</td>
      <td>I don't think so...</td>
    </tr>
    <tr>
      <td class="left">Obi-Wan Kenobi</td>
      <td>Republic/Rebellion</td>
      <td class="hidden-xs-down">No</td>
      <td>No</td>
    </tr>
    <tr>
      <td class="left">Merlin</td>
      <td>King Arthur</td>
      <td class="hidden-xs-down">Probably invented the tournament</td>
      <td>Solid maybe</td>
    </tr>
  </tbody>
</table>
```

_source: projects/website/src/app/documentation/demos/tables/tables-leftcell.html_

### tables-multiline

```html
<div class="clr-row">
  <div class="clr-col-12 clr-col-lg-10 clr-col-xl-8">
    <table cds-text="body" class="table">
      <thead>
        <tr>
          <th class="left">Name</th>
          <th class="hidden-xs-down">A/B</th>
          <th class="left">Comment</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="left">Beetlejuice</td>
          <td class="hidden-xs-down">B</td>
          <td class="left">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </td>
        </tr>
        <tr>
          <td class="left">Mytzlplk</td>
          <td class="hidden-xs-down">A</td>
          <td class="left">Excepteur sint occaecat cupidatat non proident.</td>
        </tr>
        <tr>
          <td class="left">Q</td>
          <td class="hidden-xs-down">A</td>
          <td class="left">
            Ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/tables/tables-multiline.html_

### tables-noborder

```html
<table cds-text="body" class="table table-noborder">
  <thead>
    <tr>
      <th class="left">Monster</th>
      <th class="hidden-xs-down">Home</th>
      <th>Likes Cookies</th>
      <th class="left hidden-xs-down">Fun to Play With</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="left">Wolfman</td>
      <td class="hidden-xs-down">Nondisclosed countryside</td>
      <td>Sometimes</td>
      <td class="left hidden-xs-down">Not really</td>
    </tr>
    <tr>
      <td class="left">Mothra</td>
      <td class="hidden-xs-down">Tropical island</td>
      <td>No</td>
      <td class="left hidden-xs-down">Only if you have a flashlight</td>
    </tr>
    <tr>
      <td class="left">Oscar the Grouch</td>
      <td class="hidden-xs-down">Sesame Street</td>
      <td>No</td>
      <td class="left hidden-xs-down">No</td>
    </tr>
    <tr>
      <td class="left">Cookie Monster</td>
      <td class="hidden-xs-down">Sesame Street</td>
      <td>Definitely yes</td>
      <td class="left hidden-xs-down">Only if you have no cookies</td>
    </tr>
  </tbody>
</table>
```

_source: projects/website/src/app/documentation/demos/tables/tables-noborder.html_

## More

- All documented examples: `tables-basic`, `tables-compact-noborder`, `tables-compact`, `tables-leftcell`, `tables-multiline`, `tables-noborder`, `tables-vertical-noborder-compact`, `tables-vertical`, `tables-width`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "table", features: [...] }`
