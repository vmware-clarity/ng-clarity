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

3.  Include the necessary styles in the build. You can do this by either including the compiled/minified css in your angular.json
    file or by importing the scss/css directly in your top level styles.scss/css file.

```
  //...
  "styles": [
    "node_modules/@clr/ui/clr-ui.min.css",
    //... any other styles
  ]
  //...
```

```scss
@use '@clr/ui/clr-ui.min.css';
@use '@clr/ui/clr-ui-dark.min.css'; // dark theme, omit if not using the dark theme
```
