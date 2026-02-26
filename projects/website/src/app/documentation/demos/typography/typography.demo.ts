/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

import { ColorTypeDemo } from './color-type/color-type.demo';
import { ColorizeCapitalizeLettersPipe } from './colorize-capitalized-letters.pipe';
import { TypographyDemoModule } from './typography.demo.module';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-typography-demo',
  templateUrl: './typography.demo.html',
  styleUrl: './typography.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ThemedImageComponent,
    ClrAlertModule,
    ColorTypeDemo,
    DoDontComponent,
    TypographyDemoModule,
    ColorizeCapitalizeLettersPipe,
  ],
})
export class TypographyDemo extends ClarityDocComponent {
  constructor() {
    super('typography');
  }
}
