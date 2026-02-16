/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { COLOR_INTERACTION } from './color-interaction';

@Component({
  selector: 'clr-color-interaction',
  templateUrl: './color-interaction.demo.html',
  standalone: false,
})
export class ColorInteractionDemo {
  protected colorInteraction = COLOR_INTERACTION;
}
