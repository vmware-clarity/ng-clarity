# datepicker — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/datepicker`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrDatepickerModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-alert`, `clr-control-error`, `clr-control-helper`, `clr-date-container`, `clr-select-container`
- Directives / inputs: `clrAlertClosable`, `clrAlertType`, `clrDate`, `clrFirstDayOfWeek`, `clrForm`, `clrIfError`, `clrLayout`, `clrSelect`
- CSS classes: `alert-item`, `alert-text`

## Examples

### demos

```html
<h3 data-toc-item id="api-demo" cds-text="section" class="clr-mt-32px">API</h3>
<h4 cds-text="subsection" class="clr-mt-32px"><code cds-text="code">clrDate</code> Directive</h4>
<p cds-text="body" class="clr-mt-16px">
  To use the date picker, add the <code cds-text="code">clrDate</code> directive to an
  <code cds-text="code">input</code> field. Then, place the input inside the
  <code cds-text="code">clr-date-container</code> container element.
</p>
<form clrForm clrLayout="vertical">
  <clr-date-container>
    <label>Basic Demo</label>
    <input type="date" autocomplete="off" clrDate name="demo" [(ngModel)]="demo" />
  </clr-date-container>
</form>

<clr-alert [clrAlertClosable]="false">
  <div class="alert-item">
    <span class="alert-text">
      It is recommended that you set the <code cds-text="code">type</code> to <code cds-text="code">date</code> as it
      increases readability of your code, helps with SEO, and keeps your HTML markup semantic. When the date picker is
      enabled, this <code cds-text="code">type</code> is overridden to <code cds-text="code">text</code> to disable the
      built-in date pickers that some desktop browsers provide.
    </span>
  </div>
</clr-alert>

<h4 cds-text="subsection" class="clr-mt-32px">Min/Max attributes</h4>
<p cds-text="body" class="clr-mt-16px">
  The earliest and latest acceptable dates can also be set. Just like the na
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/datepicker/demos/datepicker-api.demo.html_

## More

- All documented examples: `demos`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "datepicker", features: [...] }`
