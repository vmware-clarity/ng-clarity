/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { VizGeneralColorNumberPipe } from './viz-general-color-number.pipe';
import { ColorExampleItemComponent } from '../../../../../shared/color-example-item/color-example-item.component';
import { ThemedImageComponent } from '../../../../../shared/themed-image/themed-image.component';

@Component({
  selector: 'app-charts-colors-categorical',
  templateUrl: './charts-colors-categorical.html',
  imports: [ColorExampleItemComponent, ThemedImageComponent, VizGeneralColorNumberPipe],
})
export class ChartsColorsCategorical {
  protected readonly palettes = [
    {
      name: 'Primary Colors',
      colors: [
        '--cds-alias-viz-general-1',
        '--cds-alias-viz-general-2',
        '--cds-alias-viz-general-3',
        '--cds-alias-viz-general-4',
        '--cds-alias-viz-general-5',
        '--cds-alias-viz-general-6',
        '--cds-alias-viz-general-7',
        '--cds-alias-viz-general-8',
      ],
    },
    {
      name: 'Additional Colors',
      colors: [
        '--cds-alias-viz-general-9',
        '--cds-alias-viz-general-10',
        '--cds-alias-viz-general-11',
        '--cds-alias-viz-general-12',
        '--cds-alias-viz-general-13',
        '--cds-alias-viz-general-14',
        '--cds-alias-viz-general-15',
        '--cds-alias-viz-general-16',
      ],
    },
  ];
}
