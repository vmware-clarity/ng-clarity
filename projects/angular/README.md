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
    "node_modules/@cds/core/global.min.css",
    "node_modules/@cds/core/styles/theme.dark.min.css",
    "node_modules/@clr/ui/clr-ui.min.css",
    //... any other styles
  ]
  //...
```

```scss
@use '@cds/core/global.min.css';
@use '@cds/core/styles/theme.dark.min.css';
@use '@clr/ui/clr-ui.min.css';
```

**Note**: The above instructions represent the best practice for Clarity Design System. For information about accommodating legacy themes, see the Legacy Styles section in the @clr/ui package.

4.  Set the Theme
    Add the `cds-theme=”light”` attribute to the body element in your main HTML file:

```
<body cds-theme="light" />
```

You can toggle to dark theme by setting cds-theme="dark".
