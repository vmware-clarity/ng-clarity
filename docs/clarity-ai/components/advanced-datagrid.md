# advanced-datagrid — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/advanced-datagrid`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrAdvancedDatagridModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-accordion`, `clr-accordion-content`, `clr-accordion-panel`, `clr-accordion-title`, `clr-alert`, `clr-alert-item`, `clr-checkbox-wrapper`, `clr-input-container`, `clr-select-container`, `clr-toggle-container`, `clr-toggle-wrapper`
- Directives / inputs: `clrAlertClosable`, `clrAlertType`, `clrForm`, `clrIfExpanded`, `clrInline`, `clrInput`, `clrSelect`, `clrToggle`
- CSS classes: `alert-text`, `btn`, `btn-primary`, `card`, `card-block`, `card-text`

## Examples

### ng

```html
<grid-confirm-form [(options)]="options"> </grid-confirm-form>

<button class="btn btn-primary" (click)="reset()">Render</button>
<button class="btn btn-primary" (click)="refresh()">Refresh data</button>

@if (options.selectionType !== 'none') {
<div class="card card-block">
  <p class="card-text">
    Selected VMs: @if (selectedVms?.length == 0) {
    <em>No vm selected.</em>
    } @for (vm of selectedVms; track vm) {
    <span>{{ vm.name + ' ' }}</span>
    }
  </p>
</div>
}

<hr />

@if (!resetting) {
<appfx-datagrid
  [gridItems]="filteredVms"
  [selectedItems]="selectedVms"
  [columns]="columns"
  [layoutModel]="{
    stretchToParentHeight: false,
    compact: options.compactDatagrid,
    disabled: options.disabled
  }"
  [footerModel]="{
    clientSideExportConfig: options.enableExport ? exportConfig : undefined,
    showFooter: options.showFooter,
    hideColumnToggle: !options.showColumnToggle
  }"
  [loading]="options.loading"
  [selectionType]="options.selectionType"
  [pageSize]="options.pageSize!"
  [pageSizeOptions]="options.pageSizeOptions!"
  [rowSelectionMode]="options.enableRowSelection"
  (selectedItemsChange)="onSelectedItemsChange($event)"
  (searchTermChange)="onSearchTermChange($event)"
>
</appfx-datagrid>
}
```

_source: projects/website/src/app/documentation/demos/advanced-datagrid/ng/client-side.html_

## More

- All documented examples: `ng`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "advanced-datagrid", features: [...] }`
