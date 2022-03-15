# Installing the Clarity Design System

## Installing Clarity UI [![npm version](https://badge.fury.io/js/%40clr%2Fui.svg)](https://badge.fury.io/js/%40clr%2Fui)

1.  Install Clarity UI package through npm:

    ```
    npm install @clr/ui
    ```

2.  Include clr-ui.min.css in your HTML file:

    ```
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
