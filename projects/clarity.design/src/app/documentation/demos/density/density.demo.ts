/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { bookmarkIcon, ClarityIcons } from '@cds/core/icon';

import { ClarityDocComponent } from '../clarity-doc';

const UI_CLR_DENSITY = `
<body clr-density="compact">
  ...
</body>
`;

const UI_DENSITY_TOKENS_EXAMPLE = `
--clr-base-vertical-offset-xs: var(--cds-global-space-3);
--clr-base-vertical-offset-s: var(--cds-global-space-4);
--clr-base-vertical-offset-m: var(--cds-global-space-5);
--clr-base-vertical-offset-l: var(--cds-global-space-6);
--clr-base-vertical-offset-xl: var(
  --cds-global-space-7
); // In the compact mode, these aliases are mapped to different values
[clr-density~='compact'] {
  --clr-base-vertical-offset-xs: var(--cds-global-space-2);
  --clr-base-vertical-offset-s: var(--cds-global-space-2);
  --clr-base-vertical-offset-m: 3px;
  --clr-base-vertical-offset-l: var(--cds-global-space-5);
  --clr-base-vertical-offset-xl: var(--cds-global-space-6);
}
`;

const UI_DENSITY_CUSTOM_TOKENS_EXAMPLE = `
--myapp-base-vertical-offset-xs: var(--cds-global-space-5);
--myapp-base-horizontal-offset-xs: var(--cds-global-space-5);

[clr-density~='compact'] {
  --myapp-base-vertical-offset-xs: var(--cds-global-space-3);
  --myapp-base-horizontal-offset-xs: var(--cds-global-space-3);
}
`;

const UI_DENSITY_USE_SCSS_VARIABLES = `
@use 'packages/angular/styles/variables/variables.density' as density;

.my-class {
  padding: 0 density.$clr-base-horizontal-offset-xs;
}

.other-class {
  --padding: 0 #{density.$clr-base-horizontal-offset-xs};
}
`;

@Component({
  selector: 'clr-density-demo',
  templateUrl: './density.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class DensityDemo extends ClarityDocComponent {
  uiClrDensity: string = UI_CLR_DENSITY;
  uiDensityTokensExample: string = UI_DENSITY_TOKENS_EXAMPLE;
  uiDensityCustomTokensExample: string = UI_DENSITY_CUSTOM_TOKENS_EXAMPLE;
  uiDensityUseScssVariables: string = UI_DENSITY_USE_SCSS_VARIABLES;

  constructor() {
    super('density');
    ClarityIcons.addIcons(bookmarkIcon);
  }
}
