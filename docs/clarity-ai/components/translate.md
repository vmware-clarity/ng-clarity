# translate — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/translate`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrTranslateModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-icon`, `clr-select-container`
- Directives / inputs: `clrSelect`
- CSS classes: `alert`, `alert-icon`, `alert-icon-wrapper`, `alert-info`, `alert-item`, `alert-items`, `alert-text`

## Examples

### ng

```html
<clr-select-container>
  <label>Locale</label>
  <select clrSelect name="locales" [(ngModel)]="translateService.locale">
    @for (locale of locales; track locale[1]) {
    <option [value]="locale[1]">{{ locale[0] }}</option>
    }
  </select>
</clr-select-container>

<p>{{ 'hello-world' | translate }}</p>
<p>{{ getNow() | dateTime: dateTimeFormat }}</p>
```

_source: projects/website/src/app/documentation/demos/translate/ng/default.html_

## More

- All documented examples: `ng`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "translate", features: [...] }`
