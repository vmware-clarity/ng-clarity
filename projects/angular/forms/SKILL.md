---
name: clr-forms
description: Build Clarity forms in `@clr/angular` — `clrForm`, layouts (`clrLayout`, `clrLabelSize`), control containers for input, textarea, select, checkbox, radio, toggle, password, number, range, file picker and datalist, plus helper, error and success messages. Use when creating or validating a form, adding form controls, or choosing between form controls.
metadata:
  docs: /documentation/forms
  guidance:
    [
      '1006:2024-10-30',
      '1009:2024-10-30',
      '1012:2024-10-30',
      '1014:2024-10-30',
      '1019:2024-10-30',
      '1021:2024-10-30',
      '1023:2024-10-30',
      '1024:2024-10-30',
      '1033:2024-10-30',
      '1034:2024-10-30',
      '3001:2024-12-03',
    ]
---

# Clarity forms

## Setup

```ts
import { ClrForm, ClrFormsModule } from '@clr/angular'; // all form controls, incl. combobox and datepicker

@Component({ imports: [ReactiveFormsModule, ClrFormsModule] /* or FormsModule */ })
```

Per-control NgModules also exist (`ClrInputModule`, `ClrSelectModule`, `ClrCheckboxModule`, `ClrRadioModule`, `ClrPasswordModule`, `ClrTextareaModule`, `ClrNumberInputModule`, `ClrRangeModule`, `ClrFileInputModule`, `ClrDatalistModule`). They are NgModules, not standalone components.

## Form and layout

```html
<form clrForm clrLayout="horizontal" [clrLabelSize]="3" [formGroup]="form" (ngSubmit)="save()">
  <clr-input-container>
    <label class="clr-required-mark">Name</label>
    <input clrInput formControlName="name" required />
    <clr-control-helper>As shown on your ID</clr-control-helper>
    <clr-control-error *clrIfError="'required'">Enter a name</clr-control-error>
    <clr-control-error *clrIfError="'maxlength'">Use 40 characters or fewer</clr-control-error>
  </clr-input-container>
  <button type="submit" class="btn btn-primary">Save</button>
</form>
```

- `clrLayout`: `horizontal` (default), `vertical`, `compact` (enum `ClrFormLayout`). `clrLabelSize` (1-12) sets label columns in horizontal layout.
- Each control = container + directive + `<label>`. The container wires ids, `for`, `aria-describedby` and error state automatically.
- `<clr-control-helper>` is always visible; `<clr-control-error>` shows once touched and invalid; `<clr-control-success>` once touched and valid. Use `*clrIfError="'key'"` for one message per validator, `*clrIfSuccess` for success.
- Generic wrapper for custom/other inputs: `<clr-control-container>` with `[clrControl]` on the control.

## Controls

| Control       | Markup                                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| Text input    | `<clr-input-container>` + `<input clrInput />`                                                                    |
| Textarea      | `<clr-textarea-container>` + `<textarea clrTextarea>`                                                             |
| Select        | `<clr-select-container>` + `<select clrSelect>`                                                                   |
| Password      | `<clr-password-container>` + `<input clrPassword />` (`[clrToggle]="false"` removes the show/hide button)         |
| Number        | `<clr-number-input-container>` + `<input type="number" clrNumberInput />`                                         |
| Range         | `<clr-range-container [clrRangeHasProgress]="true">` + `<input type="range" clrRange />`                          |
| Datalist      | `<clr-datalist-container>` + `<input clrDatalistInput />` + `<datalist>`                                          |
| File picker   | `<clr-file-input-container [clrButtonLabel]>` + `<input type="file" clrFileInput />` (optional `<clr-file-list>`) |
| Checkbox      | `<clr-checkbox-container>` + `<clr-checkbox-wrapper>` + `<input type="checkbox" clrCheckbox />`                   |
| Radio         | `<clr-radio-container>` + `<clr-radio-wrapper>` + `<input type="radio" clrRadio />`                               |
| Toggle switch | `<clr-toggle-container>` + `<clr-toggle-wrapper>` + `<input type="checkbox" clrToggle />`                         |

```html
<clr-radio-container clrInline>
  <label>Plan</label>
  @for (plan of plans; track plan.id) {
  <clr-radio-wrapper>
    <input type="radio" clrRadio name="plan" [value]="plan.id" formControlName="plan" />
    <label>{{ plan.name }}</label>
  </clr-radio-wrapper>
  }
  <clr-control-error>Choose a plan</clr-control-error>
</clr-radio-container>

<clr-datalist-container>
  <label>Region</label>
  <input clrDatalistInput formControlName="region" />
  <datalist>
    @for (r of regions; track r) {
    <option [value]="r"></option>
    }
  </datalist>
</clr-datalist-container>

<clr-file-input-container>
  <label>Logo</label>
  <input type="file" clrFileInput accept=".png,.jpg" [clrMaxFileSize]="1048576" formControlName="logo" />
  <clr-control-helper>PNG or JPG, up to 1 MB</clr-control-helper>
  <clr-control-error *clrIfError="'maxFileSize'">File is too large</clr-control-error>
</clr-file-input-container>
```

- Group container `<label>` labels the group; each wrapper `<label>` labels one option. `clrInline` lays options out horizontally.
- Multi-file lists: add `<clr-file-list>` with `<ng-template clr-file-messages let-file let-errors="errors">` containing `<clr-file-error>` / `<clr-file-success>`.

## Validation on submit

On submit call `markAsTouched()` on the `ClrForm` directive, not `markAllAsTouched()` on the form group, so error messages appear.

```ts
form: FormGroup; // name, plan, region, logo
plans: { id: string; name: string }[];
regions: string[];
readonly clrForm = viewChild(ClrForm);

save() {
  if (this.form.invalid) {
    this.clrForm()?.markAsTouched(); // shows all errors
    return;
  }
}
```

## Choosing a control

From the [forms pattern](https://guidance.clarity.design/3001) and control guidance:

- Single line of text: input. Multiple lines: textarea ([1033](https://guidance.clarity.design/1033)).
- One of 2-6 options: radios, with one preselected ([1021](https://guidance.clarity.design/1021)). More than 6: select, with a default option or placeholder ([1024](https://guidance.clarity.design/1024)). Long filterable list: combobox (see `clr-combobox`).
- Predefined suggestions plus a custom value: datalist ([1009](https://guidance.clarity.design/1009)).
- Several independent options or "accept terms": checkbox ([1006](https://guidance.clarity.design/1006)).
- Toggle only for settings that apply immediately, without a submit; use a checkbox for values saved on submit ([1034](https://guidance.clarity.design/1034)). Keep the toggle label the same in both states.
- Password: `clrPassword`, with requirements in `<clr-control-helper>` ([1019](https://guidance.clarity.design/1019)).
- Range: few distinct values belong in radios/select, exact values in a number input ([1023](https://guidance.clarity.design/1023)).
- File picker: list accepted formats in helper text ([1012](https://guidance.clarity.design/1012)).
- Layout: `vertical` for narrow/mobile screens, `horizontal` for longer forms, `compact` for dense areas.

## Rules

- Never set a value or default on a file control (`clrFileInput`): its value is a `FileList` or `null`, and writing anything else throws at runtime.
- Every control needs a visible `<label>`; a placeholder is never a label or helper text. Without a visible label, set `aria-label` ([1014](https://guidance.clarity.design/1014)).
- Mark required fields with `class="clr-required-mark"` on the label and state the asterisk meaning at the top of the form (login forms excepted): use `appfx-required-field-legend` from `@clr/addons/a11y` or plain text.
- No buttons or links inside a `<label>`. For a button next to a control, wrap the control container and button in a `cds-layout="horizontal gap:sm"` element.
- Write specific, actionable error messages, one `*clrIfError` per validator. Don't validate while typing: errors show after blur/touch or `markAsTouched()`.
- Group related controls (for example an address) when a form has more than six inputs.
- Always put the control directive inside its matching container; a bare `clrInput` loses label/error wiring.

## References

- Design guidance: https://guidance.clarity.design/3001 and the per-control pages linked above
- API report: `projects/angular/forms/forms.api.md`
- Docs demos: `projects/website/src/app/documentation/demos/forms/`, `.../demos/{input,select,checkboxes,radio,toggles,password,textarea,range,file-picker,datalist}/`
