## Overview

The `@clr/addons/a11y` package contains a number of components, directives and services to improve accessibility.

You'll need to import the AppfxA11yModule in your module to be able to use them.

Code example for importing the AppfxA11yModule in a custom module:

```ts
import { AppfxA11yModule } from '@clr/addons/a11y';

@NgModule({
  imports: [AppfxA11yModule],
})
export class MyModule {}
```

### Tabs Overflow Directive

Automatically include the tab links in overflow if there is not enough width. You'll need to add the directive **appfxOverflowTabs** to your **`<clr-tabs>`** clarity tab to activate the automatic overflow detection as shown in the example below.

![Overflow example](assets/appfx/appfx-overflow-tabs.png)

Compatible with both:

- [Appfx Tabs] (https://localhost:4200/@clr/addons/tabs/overview), It's supported by default, no need to add any flags or directives to an existing `appfx-tabs` tag.
- [Clarity Tabs] (https://clarity.design/documentation/tabs)

#### Clarity Example

```html
<div>
  <clr-tabs appfxOverflowTabs>
    <clr-tab>
      <button clrTabLink>Tab 1</button>
      <clr-tab-content>Content 1</clr-tab-content>
    </clr-tab>

    <clr-tab>
      <button clrTabLink>Tab 2</button>
      <clr-tab-content>Content 2</clr-tab-content>
    </clr-tab>

    <clr-tab>
      <button clrTabLink>Tab 3</button>
      <clr-tab-content>Content 3</clr-tab-content>
    </clr-tab>

    <clr-tab>
      <button clrTabLink>Tab 4</button>
      <clr-tab-content>Content 4</clr-tab-content>
    </clr-tab>
  </clr-tabs>
</div>
```

### Required Field Legend

A generic required field legend to be used with forms. To use the Required Field Legend, simply use the appfx-required-field-legend component inside the form.

![Required field legend example](assets/appfx/required-field-legend.png)

#### Localization support

Consumers of the appfx-required-field-legend can use the [TranslateService] (@clr/addons/translate/overview) to sync the locale with their application locale.

#### Example Usage

```html
<form clrForm [formGroup]="myFormGroup">
  <appfx-required-field-legend></appfx-required-field-legend>
  <clr-input-container clrInline>
    <label class="clr-required-mark">Label</label>
    <input clrInput type="text" formControlName="myValue" />
  </clr-input-container>
</form>
```

### Zoom Level Indicator Directive

#### Breakpoints and Bootstrap compatibility notes:

Supported zoom levels are 200% and 400% with breakpoints based on Bootstrap responsive breakpoints:
https://getbootstrap.com/docs/4.5/layout/overview/

The mapping between zoom levels and Bootstrap breakpoints is:

- **400%** = Bootstrap XS - <576px
- **200%** = Bootstrap SM | MD | L - ≥576px
- **none** (no-zoom) = Bootstrap XL - ≥1200px

#### Example Usage

```html
<div class="my-component" zoomLevelIndicator>...</div>
```

```css
.my-component {
  &.no-zoom {
    flex-direction: row;
  }

  &.zoom2x,
  &.zoom4x {
    // reflow direction of a div
    flex-direction: column;
  }
}
```

### Zoom Indicator service

A service for detecting zoom level based on document body size. Uses ResizeObserver for detecting body size changes.

#### Example Usage

```ts
import { ZoomLevel, ZoomLevelService } from "@clr/addons/a11y";

...

export class MyComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    public constructor(...
        private zoomLevelService: ZoomLevelService ) {
    }

    public ngOnInit() {
        if (this.zoomLevelService) {
            this.subscription = this.zoomLevelService.onChange.subscribe((zoom) => {
                switch (zoom) {
                    case ZoomLevel.none:
                        // do something when no zoom is detected
                        break;

                    case ZoomLevel.x2:
                        // do something when zoom 200% is detected
                        break;

                    case ZoomLevel.x4:
                        // do something when zoom 400% is detected
                        break;
                }
            });
        }
    }

    public ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
```
