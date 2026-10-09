---
name: clr-datepicker
description: Use the Clarity date picker and date range picker from `@clr/angular` — `clr-date-container` with `clrDate`, `clr-date-range-container` with `clrStartDate` / `clrEndDate`, min/max, predefined ranges, action buttons and first day of week. Use when adding a date or date range field, binding dates to forms, or validating dates.
metadata:
  docs: /documentation/datepicker
  guidance: ['1010:2024-10-30']
---

# Clarity date picker

## When to use

From the [date picker guidance](https://guidance.clarity.design/1010):

- Use it for dates within about 10 years of today.
- Dates of birth and dates far in the past/future: use a plain `clrInput` text field.
- In tight spaces use a plain text input; the calendar popover keeps a fixed size.

## Setup

```ts
import { ClrDatepickerModule, ClrFormsModule } from '@clr/angular';

@Component({ imports: [ReactiveFormsModule, ClrFormsModule] }) // ClrFormsModule includes ClrDatepickerModule
```

## Date picker

```html
<form clrForm [formGroup]="form">
  <clr-date-container>
    <label>Start date</label>
    <input type="date" autocomplete="off" clrDate formControlName="start" min="2025-01-01" max="2025-12-31" />
    <clr-control-helper>Within 2025</clr-control-helper>
    <clr-control-error *clrIfError="'required'">Enter a date</clr-control-error>
    <clr-control-error *clrIfError="'min'">Date is too early</clr-control-error>
    <clr-control-error *clrIfError="'max'">Date is too late</clr-control-error>
  </clr-date-container>
</form>
```

- Set `type="date"` (Clarity switches it to text and shows its own calendar) and `autocomplete="off"`.
- `ngModel` / `formControlName` hold a string in the current locale format.
- For a `Date` object, use `[(clrDate)]="date"` (output `(clrDateChange)`). Pick one style per input: string model or `clrDate` binding, never both.
- `min` / `max` take `yyyy-mm-dd` strings; out-of-range dates are disabled and produce `min` / `max` errors.
- Container inputs: `[showActionButtons]="true"` (confirm with Cancel/Apply), `[clrFirstDayOfWeek]="ClrWeekday.Monday"` (enum `ClrWeekday`, default from the Angular locale), `clrPosition`.
- Locale and date format come from Angular `LOCALE_ID`.

## Date range picker

```html
<clr-date-range-container [rangeOptions]="ranges" min="2025-01-01">
  <label>Reporting period</label>
  <input type="date" autocomplete="off" clrStartDate formControlName="from" />
  <input type="date" autocomplete="off" clrEndDate formControlName="to" />
  <clr-control-error *clrIfError="'min'">Start is too early</clr-control-error>
  <clr-control-error *clrIfError="'range'">End must be after start</clr-control-error>
</clr-date-range-container>
```

```ts
form: FormGroup; // start, from, to
ranges = [
  { label: 'Today', value: [new Date(), new Date()] },
  { label: 'Last 7 days', value: [addDays(new Date(), -7), addDays(new Date(), -1)] },
];
```

- One container, two inputs: `clrStartDate` and `clrEndDate`. `Date` bindings: `[(clrStartDate)]` / `[(clrEndDate)]`.
- On the range container `min` / `max` go on the container.
- `rangeOptions` items are `{ label: string; value: [Date, Date] }`; invalid items are dropped silently.
- The range picker always shows action buttons; `[showActionButtons]="false"` logs an error.

## Rules

- Always wrap inputs in the matching container with a `<label>`; a placeholder is not a label.
- Add one `*clrIfError` per validator: `required`, `min`, `max`, and on range inputs `range`. Clarity does not flag unparseable text; add your own validator if needed.
- Keep `min` / `max` within the range the guidance allows (about 10 years).

## References

- Design guidance: https://guidance.clarity.design/1010
- API report: `projects/angular/forms/forms.api.md`
- Docs demos: `projects/website/src/app/documentation/demos/datepicker/`, `.../demos/date-range-picker/` (docs page `/documentation/date-range-picker`)
