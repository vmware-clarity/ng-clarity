/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClarityDocComponent } from '../clarity-doc';
import { ColorInteractionDemo } from './color-interaction/color-interaction.demo';
import { ColorObjectBorderDemo } from './color-object-border/color-object-border.demo';
import { ColorPaletteDemo } from './color-palette/color-palette.demo';
import { ColorStatusDemo } from './color-status/color-status.demo';
import { ColorTypeDemo } from './color-type/color-type.demo';
import { ColorUtilityDemo } from './color-utility/color-utility.demo';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';

@Component({
  selector: 'clr-color-demo',
  templateUrl: './color.demo.html',
  styleUrl: './color.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ColorStatusDemo,
    ColorInteractionDemo,
    ColorObjectBorderDemo,
    ColorTypeDemo,
    ColorUtilityDemo,
    ColorPaletteDemo,
  ],
})
export class ColorDemo extends ClarityDocComponent {
  constructor() {
    super('color');
  }
}
