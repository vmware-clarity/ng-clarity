# date-range-picker — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/date-range-picker`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrDateRangePickerModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-alert`, `clr-control-error`, `clr-date-range-container`
- Directives / inputs: `clrAlertClosable`, `clrAlertType`, `clrEndDate`, `clrEndDateChange`, `clrForm`, `clrIfError`, `clrLayout`, `clrStartDate`, `clrStartDateChange`
- CSS classes: `alert-item`, `alert-text`, `clr-hidden-xs-down`

## Examples

### demos

```html
<h3 data-toc-item id="api-demo" cds-text="section" class="clr-mt-32px">API</h3>
<h4 cds-text="subsection" class="clr-mt-32px">
  <code cds-text="code">clrStartDate</code> and <code cds-text="code">clrEndDate</code> Directive
</h4>
<p cds-text="body" class="clr-mt-16px">
  To use the date range picker, add <code cds-text="code">clrStartDate</code> and
  <code cds-text="code">clrEndDate</code> directive to the start and end date <code cds-text="code">input</code> fields
  respectively. Then, place the input inside the <code cds-text="code">clr-date-range-container</code> container
  element.
</p>
<form clrForm clrLayout="vertical">
  <clr-date-range-container>
    <label>Basic Demo</label>
    <input
      id="startDate"
      aria-labelledby="dateRangeCtrl"
      name="startDateBasicDemo"
      type="date"
      clrStartDate
      [(ngModel)]="startDateBasicDemo"
    />
    <input
      id="endDate"
      aria-labelledby="dateRangeCtrl"
      name="endDateBasicDemo"
      type="date"
      clrEndDate
      [(ngModel)]="endDateBasicDemo"
    />
  </clr-date-range-container>
</form>

<clr-alert [clrAlertClosable]="false">
  <div class="alert-item">
    <span class="alert-text">
      It is recommended that you set the <code cds-text="code">type</code> to <code cds-text="code">date</code> as it
      increases readability of your code, helps with SEO, and keeps your HTML markup sem
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/date-range-picker/demos/date-range-picker-api.demo.html_

## More

- All documented examples: `demos`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "date-range-picker", features: [...] }`
