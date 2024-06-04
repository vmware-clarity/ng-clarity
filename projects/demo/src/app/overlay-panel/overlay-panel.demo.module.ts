/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { OverlayPanelDemo } from './overlay-panel.demo';
import { ROUTING } from './overlay-panel.routing';

@NgModule({
  imports: [CommonModule, FormsModule, ClarityModule, ROUTING],
  declarations: [OverlayPanelDemo],
  exports: [OverlayPanelDemo],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class OverlayPanelDemoModule {}
