# modal — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/modal`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrModalModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-alert`, `clr-alert-item`, `clr-icon`, `clr-modal`
- Directives / inputs: `clrAlertClosable`, `clrAlertType`, `clrModalAlternateClose`, `clrModalClosable`, `clrModalCloseButtonAriaLabel`, `clrModalOpen`, `clrModalPreventClose`, `clrModalSize`, `clrModalStaticBackdrop`
- CSS classes: `alert-text`, `btn`, `btn-outline`, `btn-primary`, `btn-sm`

## Examples

### modal-angular-alt-close-demo

```html
<p>
  <button class="btn btn-primary" (click)="showModal = true">Show modal</button>
</p>

<clr-modal
  [(clrModalOpen)]="showModal"
  [clrModalPreventClose]="true"
  (clrModalAlternateClose)="showConfirm = true"
  #modal
>
  <div class="modal-title">Confirm on close</div>
  <div class="modal-body">
    <p>The modal will require confirmation on close.</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" (click)="modal.close()">Close</button>
  </div>
</clr-modal>

<clr-modal [(clrModalOpen)]="showConfirm">
  <h3 class="modal-title">Are you sure?</h3>
  <div class="modal-body">
    <p>You may lose data if you close now...</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline" (click)="showConfirm = false">Cancel</button>
    <button type="button" class="btn btn-primary" (click)="showConfirm = false; showModal = false">Yes</button>
  </div>
</clr-modal>
```

_source: projects/website/src/app/documentation/demos/modal/modal-angular-alt-close-demo.html_

## More

- All documented examples: `modal-angular-alt-close-demo`
- Full public API report: `projects/angular/modal/modal.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "modal", features: [...] }`
