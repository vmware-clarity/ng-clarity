# stack-view — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/stack-view`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrStackViewModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-icon`, `clr-modal`, `clr-spinner`, `clr-stack-block`, `clr-stack-content`, `clr-stack-header`, `clr-stack-label`, `clr-stack-view`
- Directives / inputs: `clrAssertive`, `clrInline`, `clrModalOpen`, `clrSbExpandable`, `clrSbExpanded`, `clrSbExpandedChange`, `clrSbNotifyChange`, `clrStackInput`, `clrStackViewLevel`
- CSS classes: `alert`, `alert-icon`, `alert-icon-wrapper`, `alert-item`, `alert-items`, `alert-text`, `alert-warning`, `btn`, `btn-link`, `btn-primary`, `btn-sm`

## Examples

### stack-view-angular-basic

```html
<div class="clr-example">
  <clr-stack-view appRemoveStackViewHeadings>
    <clr-stack-header>Angular stack view</clr-stack-header>

    <clr-stack-block [clrStackViewLevel]="1">
      <clr-stack-label>Label 1</clr-stack-label>
      <clr-stack-content>Content 1</clr-stack-content>
    </clr-stack-block>

    <clr-stack-block [clrStackViewLevel]="1">
      <clr-stack-label>Label 2</clr-stack-label>
      <clr-stack-content>Content 2</clr-stack-content>
      <clr-stack-block [clrStackViewLevel]="2">
        <clr-stack-label>Sub-label 1</clr-stack-label>
        <clr-stack-content>Sub-content 1</clr-stack-content>
      </clr-stack-block>
      <clr-stack-block [clrStackViewLevel]="2">
        <clr-stack-label>Sub-label 2</clr-stack-label>
        <clr-stack-content>Sub-content 2</clr-stack-content>
      </clr-stack-block>
      <clr-stack-block [clrStackViewLevel]="2">
        <clr-stack-label>Sub-label 3</clr-stack-label>
        <clr-stack-content>Sub-content 3</clr-stack-content>
      </clr-stack-block>
    </clr-stack-block>

    <clr-stack-block [clrStackViewLevel]="1">
      <clr-stack-label>Label 3</clr-stack-label>
      <clr-stack-content>Content 3</clr-stack-content>
      <clr-stack-block>
        <clr-stack-label>Sub-label 4</clr-stack-label>
        <clr-stack-content>Sub-content 4</clr-stack-content>
      </clr-stack-block>
      <clr-stack-block>
        <clr-
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/stack-view/stack-view-angular-basic.html_

### stack-view-angular-lazyload

```html
<div class="clr-example">
  <clr-stack-view appRemoveStackViewHeadings>
    <clr-stack-header>
      Lazily loaded children
      <button class="stack-action btn btn-sm btn-link" (click)="resetChildren()" type="button">Reset</button>
    </clr-stack-header>

    <clr-stack-block
      #lazyBlock
      [clrSbExpandable]="true"
      (clrSbExpandedChange)="fetchChildren()"
      [clrStackViewLevel]="1"
    >
      <clr-stack-label>Label 1</clr-stack-label>
      <clr-stack-content>Content 1</clr-stack-content>

      @if (children.length == 0) {
      <clr-stack-block [clrStackViewLevel]="2">
        <clr-spinner clrAssertive clrInline> Loading... </clr-spinner>
      </clr-stack-block>
      } @for (child of children; track child; let i = $index) {
      <clr-stack-block [clrStackViewLevel]="2">
        <clr-stack-label>{{ child.title }}</clr-stack-label>
        <clr-stack-content>{{ child.content }}</clr-stack-content>
      </clr-stack-block>
      }
    </clr-stack-block>

    <clr-stack-block [clrStackViewLevel]="1">
      <clr-stack-label>Label 2</clr-stack-label>
      <clr-stack-content>Content 2</clr-stack-content>
    </clr-stack-block>
  </clr-stack-view>
</div>
```

_source: projects/website/src/app/documentation/demos/stack-view/stack-view-angular-lazyload.html_

### stack-view-angular-modal-edit

```html
<div class="clr-example">
  <clr-stack-view appRemoveStackViewHeadings>
    <clr-stack-header>
      Modal editor
      <button class="stack-action btn btn-sm btn-link" (click)="editModal = true" type="button">Edit</button>
    </clr-stack-header>

    @for (block of blocks; track block; let i = $index) {
    <clr-stack-block [clrStackViewLevel]="1">
      <clr-stack-label>{{ block.title }}</clr-stack-label>
      <clr-stack-content>{{ block.content }}</clr-stack-content>
      @for (child of block.children; track child; let j = $index) {
      <clr-stack-block [clrStackViewLevel]="2">
        <clr-stack-label>{{ child.title }}</clr-stack-label>
        <clr-stack-content>{{ child.content }}</clr-stack-content>
      </clr-stack-block>
      }
    </clr-stack-block>
    }
  </clr-stack-view>

  <clr-modal [(clrModalOpen)]="editModal">
    <div class="modal-title">Edit mode</div>
    <div class="modal-body">
      <clr-stack-view>
        @for (block of blocks; track block; let blockIndex = $index) {
        <clr-stack-block [clrSbNotifyChange]="block.content !== 'Content ' + blockIndex" [clrStackViewLevel]="1">
          <clr-stack-label>{{ block.title }}</clr-stack-label>
          <clr-stack-content>
            <input type="text" clrStackInput [(ngModel)]="block.content" />
          </clr-stack-content>
          @for (child of block.children; track child; let blockChildInd
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/stack-view/stack-view-angular-modal-edit.html_

### stack-view-static

```html
<div class="clr-example">
  <div class="stack-header">
    <div class="stack-title">Static stack view</div>
    <span class="stack-actions">
      <button class="stack-action btn btn-sm btn-link" type="button">Edit</button>
    </span>
  </div>
  <div class="stack-view">
    <div class="stack-block">
      <div class="stack-block-label">
        <div class="stack-view-key">Label 1</div>
        <div class="stack-block-content">Content 1</div>
      </div>
    </div>
    <div class="stack-block stack-block-expandable stack-block-expanded">
      <div class="stack-block-label">
        <div class="stack-view-key">Label 2</div>
        <div class="stack-block-content">Content 2</div>
      </div>
      <div class="stack-children">
        <div class="stack-block">
          <div class="stack-block-label">
            <div class="stack-view-key">Sub-label 1</div>
            <div class="stack-block-content">Sub-content 1</div>
          </div>
        </div>
        <div class="stack-block">
          <div class="stack-block-label">
            <div class="stack-view-key">Sub-label 2</div>
            <div class="stack-block-content">Sub-content 2</div>
          </div>
        </div>
        <div class="stack-block">
          <div class="stack-block-label">
            <div class="stack-view-key">Sub-label 3</div>
            <div class="stack-block-content">Sub-content 3</div>
 
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/stack-view/stack-view-static.html_

## More

- All documented examples: `stack-view-angular-basic`, `stack-view-angular-lazyload`, `stack-view-angular-modal-edit`, `stack-view-static`
- Full public API report: `projects/angular/data/data.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "stack-view", features: [...] }`
