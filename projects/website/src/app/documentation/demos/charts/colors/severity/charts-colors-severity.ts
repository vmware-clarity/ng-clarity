/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ColorExampleItemComponent } from '../../../../../shared/color-example-item/color-example-item.component';
import { ThemedImageComponent } from '../../../../../shared/themed-image/themed-image.component';

@Component({
  selector: 'app-charts-colors-severity',
  templateUrl: './charts-colors-severity.html',
  imports: [ColorExampleItemComponent, ThemedImageComponent],
})
export class ChartsColorsSeverity {}
