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

Import the `ClarityModule` and `BrowserAnimationsModule` into your Angular application's module. For
example:

```typescript
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ClarityModule } from "@clr/angular";

import { AppComponent } from "./app.component";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
