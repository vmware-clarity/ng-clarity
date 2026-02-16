/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { bookmarkIcon, ClarityIcons } from '@cds/core/icon';

import { ClarityDocComponent } from '../clarity-doc';

const UI_CUSTOM_CLARITY_DARK_SCSS_FILE = `
@import '../node_modules/@clr/ui/src/utils/theme.dark.clarity'; // Overwrites with dark theme

// Clarity Component SCSS
@import '../node_modules/@clr/ui/src/utils/components.clarity';
`;

const UI_CUSTOM_CLARITY_DARK_THEME_SCSS_FILE = `
@import '../node_modules/@clr/ui/src/utils/theme.dark.clarity'; // Dark theme variables

// Your Application Theme File
@import './theme.scss';

// Clarity Component SCSS
@import '../node_modules/@clr/ui/src/utils/components.clarity';
`;

const UI_CUSTOM_CLARITY_LIGHT_SCSS_FILE = `
// Clarity Component SCSS
@import '../node_modules/@clr/ui/src/utils/components.clarity';
`;

const UI_CUSTOM_CLARITY_LIGHT_THEME_SCSS_FILE = `
// Your Application Theme File
@import './theme.scss';

// Clarity Component SCSS
@import '../node_modules/@clr/ui/src/utils/components.clarity';
`;

const UI_NODE_IMPORTS = `
{
  "styles": ["...", "../node_modules/@clr/ui/clr-ui-dark.min.css", "..."]
}
`;

const UI_WEBPACK_IMPORTS = `
{
  "entry": {
    "main": ["./src/main.ts"],
    "styles": ["./node_modules/@clr/ui/clr-ui-dark.min.css", "./src/styles.css"]
  }
}
`;

const UI_CDS_DARK_MODE = `
<body cds-theme="dark">
  ...
</body>
`;

const UI_CDS_TOKENS_EXAMPLE = `
--cds-alias-status-info: var(--cds-global-color-blue-700);
--cds-alias-status-info-tint: var(--cds-global-color-blue-50);
--cds-alias-status-info-shade: var(--cds-global-color-blue-800);

// In the dark theme, these aliases are mapped to different values
[cds-theme~='dark'] {
  --cds-alias-status-info: var(--cds-global-color-blue-400);
  --cds-alias-status-info-tint: var(--cds-global-color-blue-800);
  --cds-alias-status-info-shade: var(--cds-global-color-blue-500);
}
`;

const UI_CDS_CUSTOM_TOKENS_EXAMPLE = `
--myapp-alias-vm-started-color: var(--cds-global-color-blue-500);
--myapp-alias-vm-error-color: var(--cds-global-color-red-700);

[cds-theme~='dark'] {
  --myapp-alias-vm-started-color: var(--cds-global-color-blue-800);
  --myapp-alias-vm-error-color: var(--cds-global-color-red-500);
}
`;

const UI_CDS_USE_SCSS_VARIABLES = `
@use '@cds/core/tokens/tokens.scss';

.my-class {
  color: tokens.$cds-alias-status-info;
}

.other-class {
  --color: #{tokens.$cds-alias-status-info};
}
`;

@Component({
  selector: 'clr-themes-demo',
  templateUrl: './themes.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class ThemesDemo extends ClarityDocComponent {
  uiNodeImports = UI_NODE_IMPORTS;
  uiWebpackImports = UI_WEBPACK_IMPORTS;
  uiCustomClarityLightThemeScssFile = UI_CUSTOM_CLARITY_LIGHT_THEME_SCSS_FILE;
  uiCustomClarityDarkThemeScssFile = UI_CUSTOM_CLARITY_DARK_THEME_SCSS_FILE;
  uiCustomClarityLightScssFile = UI_CUSTOM_CLARITY_LIGHT_SCSS_FILE;
  uiCustomClarityDarkScssFile = UI_CUSTOM_CLARITY_DARK_SCSS_FILE;
  uiCdsDarkMode: string = UI_CDS_DARK_MODE;
  uiCdsTokensExample: string = UI_CDS_TOKENS_EXAMPLE;
  uiCdsCustomTokensExample: string = UI_CDS_CUSTOM_TOKENS_EXAMPLE;
  uiCdsUseScssVariables: string = UI_CDS_USE_SCSS_VARIABLES;

  constructor() {
    super('themes');
    ClarityIcons.addIcons(bookmarkIcon);
  }
}
