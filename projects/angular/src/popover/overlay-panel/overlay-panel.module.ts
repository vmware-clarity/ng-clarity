/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ClarityIcons, infoCircleIcon, windowCloseIcon } from '@cds/core/icon';

import { ClrIconModule } from '../../icon/icon.module';
import { ClrConditionalModule } from '../../utils/conditional/conditional.module';
import { ClrFocusOnViewInitModule } from '../../utils/focus/focus-on-view-init/focus-on-view-init.module';
import { ClrOverlayPanel } from '../overlay-panel';
import { ClrOverlayPanelContent } from './overlay-panel-content';
import { ClrOverlayPanelTrigger } from './overlay-panel-trigger';

export const CLR_OVERLAY_PANEL_DIRECTIVES: Type<any>[] = [
  ClrOverlayPanel,
  ClrOverlayPanelContent,
  ClrOverlayPanelTrigger,
];

@NgModule({
  imports: [CommonModule, ClrIconModule, ClrFocusOnViewInitModule],
  declarations: [CLR_OVERLAY_PANEL_DIRECTIVES],
  exports: [CLR_OVERLAY_PANEL_DIRECTIVES, ClrConditionalModule],
})
export class ClrOverlayPanelModule {
  constructor() {
    ClarityIcons.addIcons(windowCloseIcon, infoCircleIcon);
  }
}
