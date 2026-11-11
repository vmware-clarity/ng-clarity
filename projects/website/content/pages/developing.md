---
title: Developing
---

# Developing

<p class="component-summary">
  This page provides general installation instructions. You can:
</p>

- (Option A) Install the Clarity HTML/CSS Framework and start using it to build your application.
- (Option B) Install Clarity into an existing Angular application.

<div cds-layout="m-t:xxl">
  <app-themed-image
    light-src="/assets/images/clarity-developing-banner.svg"
    dark-src="/assets/images/clarity-developing-banner-dark.svg"
    image-alt=""
    image-style="max-width: 100%"
  ></app-themed-image>
</div>

<p class="clr-mt-16px" cds-text="subsection">
  Both options are covered in the following sections.
</p>

## Installing the Clarity HTML/CSS Framework

If you just want to use our HTML/CSS implementations, use the following instructions.

### Step 1. Install the Clarity Package from npm:

```bash
npm install @clr/ui --save
```

### Step 2: Include the Clarity Styles

Include `@clr/ui/clr-ui.min.css` in your app's stylesheet. You will need to ensure your build process
is configured to bundle CSS from npm packages.

```css
@import '@clr/ui/clr-ui.min.css';
```

Alternatively, you can load the styles using the `npm unpkg` content delivery network (CDN). See
[unpkg.com](https://unpkg.com) for more details. For example:

```html
<!-- Load the latest version -->
<link rel="stylesheet" href="https://unpkg.com/@clr/ui/clr-ui.min.css" />
<!-- Or load a specific version, recommended -->
<link rel="stylesheet" href="https://unpkg.com/@clr/ui@18.0.0/clr-ui.min.css" />
```

### Step 3: Set the Theme

Add the `cds-theme=”light”` attribute to the body element in your main HTML file.

```html
<body cds-theme="light" />
```

You can toggle to dark theme by setting `cds-theme="dark"`.

## Adding Clarity to an Existing Angular Application

You can build an Angular app, then install Clarity onto your project.

### Step 1: Build an Angular App

Create a new Angular application. If you need a quick start, go through the
[Angular tutorial.](https://angular.io/docs/ts/latest/quickstart.html)

### Step 2: Install Clarity Packages

Clarity is published as two packages on npm:

- `@clr/ui`: Contains the static styles for building HTML components.
- `@clr/angular`: Contains the Angular components. This package depends on @clr/ui for styles.

Install the packages by running the following command with npm:

```bash
npm install @clr/angular @clr/ui --save
```

### Step 3: Include the Clarity Styles

If you’re using the Angular CLI, add the following snippet to the `styles` array in your
angular.json file. For example:

```json
"styles": [
    "node_modules/@clr/ui/clr-ui.min.css"
    ...any other styles
    ]
```

If you aren’t using the Angular CLI, include the styles by adding them to the `<head>` element in
your index.html file:

```html
<link rel="stylesheet" href="path/to/node_modules/@clr/ui/clr-ui.min.css" />
```

### Step 4: Set the Theme

Add the `cds-theme=”light”` attribute to the body element in your main HTML file:

```html
<body cds-theme="light" />
```

You can toggle to dark theme by setting `cds-theme="dark"`.

### Step 5: Add Clarity to Angular Application

Import the `ClarityModule` into your Angular application's module. Clarity does not use `@angular/animations` and does not
need `BrowserAnimationsModule` or `provideAnimations()`; keep them only if your application uses `@angular/animations`
triggers of its own. For example:

```typescript
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ClarityModule } from "@clr/angular";

import { AppComponent } from "./app.component";

@NgModule({
  imports: [
    BrowserModule,
    ClarityModule,
    ...
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
```

### Step 6: Run Your App

```bash
npm start
```

## Using Clarity in a Shadow Root or a Narrow Area

These steps apply when Clarity renders inside another application, for example as a plugin in a
shadow root or in a side panel.

### Theme and Density in a Shadow Root

Load Clarity's styles inside the shadow root. The page's `cds-theme` and `clr-density` attributes do
not reach into the shadow root, so set them again on an element inside it. Without them, the content
of the shadow root uses the light theme and the default density, also on a dark or compact page.

```html
<div cds-theme="dark" clr-density="compact">...</div>
```

### Breakpoints That Follow a Container

The grid and `cds-layout` breakpoints follow the viewport. When your layout lives in an area narrower
than the viewport, load `@clr/ui/clr-ui-container-queries.min.css` instead of
`@clr/ui/clr-ui.min.css`. Its breakpoints follow the nearest element declared as a `clr-layout`
container. Custom elements are inline by default, and an inline element can't be a container, so
give a custom element host `display: block`.

```css
/* the element that holds the layout, for example the shadow host */
:host {
  display: block;
  container: clr-layout / inline-size;
}
```

If you compile Clarity from Sass instead of loading the CSS file, set `$clr-breakpoint-query` to
`container` before loading Clarity. Its default, `media`, keeps the viewport breakpoints.

```scss
@use '@clr/ui/styles/variables/variables.layout' with (
  $clr-breakpoint-query: container
);
@use '@clr/ui/main';
```

This covers the grid columns, offsets and ordering, the flex, float and visibility utilities, and
the `cds-layout` utilities with a breakpoint (for example `cols@md:6`). Component styles keep
following the viewport.

Breakpoints apply only to elements inside the container, not to the container itself. Content
outside it, such as overlays rendered outside the container element, matches no breakpoint,
including the `-down` visibility rules.

## Contributing to Clarity

The Clarity team welcomes contributions from the community. See our
[contribution guidelines](https://github.com/vmware-clarity/ng-clarity/blob/main/docs/CONTRIBUTING.md)
on GitHub.

## Reporting an Issue

Feel free to file feature requests or report any issues on our Clarity
[GitHub Issues](https://github.com/vmware-clarity/ng-clarity/issues/new/choose) site.
When submitting issues, provide a minimal app that demonstrates the issue by forking one of the
Clarity Stackblitz projects. Since it depends on your issue, starting with the correct Clarity
version and theme will help us deliver support.

## Attributions

See the [legal attributions](https://github.com/vmware-clarity/ng-clarity/blob/main/docs/ATTRIBUTION.md)
for third party software included in Clarity.
