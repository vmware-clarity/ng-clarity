# side-panel — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/side-panel`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrSidePanelModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-icon`, `clr-modal`, `clr-side-panel`
- Directives / inputs: `clrModalHost`, `clrModalOpen`, `clrSidePanelAlternateClose`, `clrSidePanelBackdrop`, `clrSidePanelClosable`, `clrSidePanelCloseButtonAriaLabel`, `clrSidePanelOpen`, `clrSidePanelPinnable`, `clrSidePanelPinned`, `clrSidePanelPosition`, `clrSidePanelPreventClose`, `clrSidePanelSize`, `clrSidePanelSkipAnimation`, `clrSidePanelStaticBackdrop`
- CSS classes: `btn`, `btn-outline`, `btn-primary`, `btn-sm`

## Examples

### side-panel-angular-alt-close-demo

```html
<p>
  <button class="btn btn-primary" (click)="showPanel = true">Show side panel</button>
</p>

<clr-side-panel
  [(clrSidePanelOpen)]="showPanel"
  [clrSidePanelPreventClose]="true"
  (clrSidePanelAlternateClose)="showConfirm = true"
  #panel
>
  <div class="side-panel-title">Confirm on close</div>
  <div class="side-panel-body">
    <p>The side panel will require confirmation on close.</p>
  </div>
  <div class="side-panel-footer">
    <button type="button" class="btn btn-primary" (click)="panel.close()">Close</button>
  </div>
</clr-side-panel>

<clr-modal [(clrModalOpen)]="showConfirm">
  <h3 class="modal-title">Are you sure?</h3>
  <div class="modal-body">
    <p>You may lose data if you close now...</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline" (click)="showConfirm = false">Cancel</button>
    <button type="button" class="btn btn-primary" (click)="showConfirm = false; showPanel = false">Yes</button>
  </div>
</clr-modal>
```

_source: projects/website/src/app/documentation/demos/side-panel/side-panel-angular-alt-close-demo.html_

### side-panel-angular-bottom-demo

```html
<p>
  <button class="btn btn-primary" (click)="opened = true">Show bottom side panel</button>
</p>
<clr-side-panel [(clrSidePanelOpen)]="opened" [clrSidePanelStaticBackdrop]="true" [clrSidePanelPosition]="'bottom'">
  <div class="side-panel-title">Bottom Side Panel</div>
  <div class="side-panel-body">
    <p>This side panel slides up from the bottom.</p>
  </div>
  <div class="side-panel-footer">
    <button type="button" class="btn btn-outline" (click)="opened = false">Cancel</button>
    <button type="button" class="btn btn-primary" (click)="opened = false">Ok</button>
  </div>
</clr-side-panel>

@if (showCode()) {

}
```

_source: projects/website/src/app/documentation/demos/side-panel/side-panel-angular-bottom-demo.html_

### side-panel-angular-demo

```html
<p>
  <button class="btn btn-primary" (click)="opened = true">Show side panel</button>
</p>
<clr-side-panel [(clrSidePanelOpen)]="opened" [clrSidePanelStaticBackdrop]="true">
  <div class="side-panel-title">I have a nice title</div>
  <div class="side-panel-body">
    <p>But not much to say...</p>
  </div>
  <div class="side-panel-footer">
    <button type="button" class="btn btn-outline" (click)="opened = false">Cancel</button>
    <button type="button" class="btn btn-primary" (click)="opened = false">Ok</button>
  </div>
</clr-side-panel>

@if (showCode()) {

}
```

_source: projects/website/src/app/documentation/demos/side-panel/side-panel-angular-demo.html_

### side-panel-angular-inline-demo

```html
<div clrModalHost cds-layout="p:md m-t:md" style="border: 1px dashed hotpink; width: 800px; height: 200px">
  <button class="btn btn-primary" (click)="opened = true">Inline side panel</button>
  <clr-side-panel [(clrSidePanelOpen)]="opened" [clrSidePanelStaticBackdrop]="true">
    <div class="side-panel-title">I have a nice title</div>
    <div class="side-panel-body">
      <p>But not much to say...</p>
    </div>
    <div class="side-panel-footer">
      <button type="button" class="btn btn-outline" (click)="opened = false">Cancel</button>
      <button type="button" class="btn btn-primary" (click)="opened = false">Ok</button>
    </div>
  </clr-side-panel>
</div>

@if (showCode()) {

}
```

_source: projects/website/src/app/documentation/demos/side-panel/side-panel-angular-inline-demo.html_

### side-panel-angular-pinnable-demo

```html
<button class="btn btn-primary" (click)="opened = true">Pinnable side panel</button>
@if (opened) {
<div clrModalHost cds-layout="p:md m-t:md" style="width: 800px; height: 260px">
  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus non beatae omnis esse quibusdam dolorum voluptatem
  reiciendis quaerat assumenda optio, porro expedita similique dolore quidem aliquam. Ullam, eaque enim nobis.
  <clr-side-panel #sidePanel [(clrSidePanelOpen)]="opened" [clrSidePanelPinnable]="pinnable" clrSidePanelSize="md">
    <div class="side-panel-title"><clr-icon shape="arrow" direction="left"></clr-icon> Click the Pin Button</div>
    <div class="side-panel-body">
      <p>
        When pinned the close [X] button and backdrop click are blocked. "Gentle Close" button will also not close the
        pinned panel.
      </p>
      <p>"Forced Close" will close the panel no matter if pinned or not.</p>
    </div>
    <div class="side-panel-footer">
      <button type="button" class="btn btn-outline" (click)="opened = false">Forced Close</button>
      <button type="button" class="btn btn-primary" (click)="sidePanel.close()">Gentle Close</button>
    </div>
  </clr-side-panel>
</div>
} @if (showCode()) {

}
```

_source: projects/website/src/app/documentation/demos/side-panel/side-panel-angular-pinnable-demo.html_

### side-panel-angular-pinned-demo

```html
<button class="btn btn-primary" (click)="opened = true">Pinned side panel</button>
@if (opened) {
<div clrModalHost cds-layout="p:md m-t:md" style="width: 800px; height: 260px">
  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus non beatae omnis esse quibusdam dolorum voluptatem
  reiciendis quaerat assumenda optio, porro expedita similique dolore quidem aliquam. Ullam, eaque enim nobis.
  <clr-side-panel
    #sidePanel
    [(clrSidePanelOpen)]="opened"
    [clrSidePanelPinnable]="false"
    [clrSidePanelPinned]="true"
    [clrSidePanelClosable]="false"
    clrSidePanelSize="md"
  >
    <div class="side-panel-title">Pinned by default</div>
    <div class="side-panel-body">
      <p>Panel is by default pinned side by side with the container content.</p>
      <p>No pin/unpin buttons are displayed.</p>
    </div>
    <div class="side-panel-footer">
      <button type="button" class="btn btn-outline" (click)="opened = false">Close</button>
    </div>
  </clr-side-panel>
</div>
} @if (showCode()) {

}
```

_source: projects/website/src/app/documentation/demos/side-panel/side-panel-angular-pinned-demo.html_

## More

- All documented examples: `side-panel-angular-alt-close-demo`, `side-panel-angular-bottom-demo`, `side-panel-angular-demo`, `side-panel-angular-inline-demo`, `side-panel-angular-pinnable-demo`, `side-panel-angular-pinned-demo`, `side-panel-angular-size-demo`, `side-panel-angular-static-backdrop-demo`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "side-panel", features: [...] }`
