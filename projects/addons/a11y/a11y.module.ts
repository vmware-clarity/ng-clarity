/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';
import { AppfxTranslateModule } from '@clr/addons/translate';

import { OverrideClrStringsDirective } from './clr-stepper-panel/override-clr-strings.directive';
import { OverflowClrTabsDirective } from './clr-tabs/overflow-clr-tabs.directive';
import { RequiredFieldLegendComponent } from './forms/required-field-legend.component';
import { ZoomLevelIndicatorDirective } from './zoom/zoom-level-indicator.directive';
import { ZoomLevelService } from './zoom/zoom-level.service';

/**
 * Provides accessibility related services.
 */
@NgModule({
  declarations: [
    OverflowClrTabsDirective,
    OverrideClrStringsDirective,
    RequiredFieldLegendComponent,
    ZoomLevelIndicatorDirective,
  ],
  imports: [AppfxTranslateModule],
  exports: [
    OverflowClrTabsDirective,
    OverrideClrStringsDirective,
    RequiredFieldLegendComponent,
    ZoomLevelIndicatorDirective,
  ],
  providers: [ZoomLevelService],
})
export class AppfxA11yModule {}
