# Installing the Clarity Design System

## Installing Clarity UI [![npm version](https://badge.fury.io/js/%40clr%2Fui.svg)](https://badge.fury.io/js/%40clr%2Fui)

1.  Install Clarity UI package through npm:

    ```
    npm install @clr/ui
    ```

2.  Include @cds/core/global.min.css, @cds/core/styles/theme.dark.min.css and clr-ui.min.css in your HTML file:

    ```
    <link rel="stylesheet" href="path/to/node_modules/@cds/core/global.min.css">
    <link rel="stylesheet" href="path/to/node_modules/@cds/core/styles/theme.dark.min.css">
    <link rel="stylesheet" href="path/to/node_modules/@clr/ui/clr-ui.min.css">
    ```

3.  Write your HTML with the Clarity CSS class names and markup.

## Installing Clarity Angular [![npm version](https://badge.fury.io/js/%40clr%2Fangular.svg)](https://badge.fury.io/js/%40clr%2Fangular)

1.  Install Clarity packages through npm:

    ```
    npm install @clr/ui @clr/angular @cds/core
    ```

2.  Import the ClarityModule into your Angular application's module. Your application's main module might look like this:

    ```
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { ClarityModule } from '@clr/angular';
    import { AppComponent } from './app.component';

    @NgModule({
        imports: [
            BrowserModule,
            ClarityModule,
            ....
         ],
         declarations: [ AppComponent ],
         bootstrap: [ AppComponent ]
    })
    export class AppModule {    }
    ```

## Using Features Before Release

You can install unreleased builds of the `@clr/ui` and `@clr/angular` packages by installing our preview build branches.
These branches are automatically built after each commit to the `main` branch, so you can use features before we release
to npm.

```bash
npm install @clr/ui@github:vmware-clarity/ng-clarity.git#preview-build/main/clr-ui --force
npm install @clr/angular@github:vmware-clarity/ng-clarity.git#preview-build/main/clr-angular --force
```
