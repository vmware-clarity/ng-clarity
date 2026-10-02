# card-container — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/card-container`

## Import

- Modules used in the demos: _none — basic usage is CSS classes only_
- Granular module for a lean bundle: `ClrCardContainerModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: _(none observed)_
- Directives / inputs: _(none observed)_
- CSS classes: `btn`, `btn-outline`

## Examples

### ng

```html
<div class="clr-mb-16px">
  <button class="btn btn-outline" (click)="addCard()">Add Card</button>
  <button class="btn btn-outline" (click)="removeCard()" [disabled]="cards.length <= 1">Remove Last</button>
</div>
<appfx-card-container [cards]="cards" [containerId]="'demo-container'"></appfx-card-container>
```

_source: projects/website/src/app/documentation/demos/card-container/ng/basic-card-container.html_

## More

- All documented examples: `ng`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "card-container", features: [...] }`
