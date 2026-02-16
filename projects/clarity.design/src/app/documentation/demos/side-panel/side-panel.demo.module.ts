/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { SidePanelAngularAlternateCloseDemo } from './side-panel-angular-alt-close-demo';
import { SidePanelAngularDemo } from './side-panel-angular-demo';
import { SidePanelAngularInlineDemo } from './side-panel-angular-inline-demo';
import { SidePanelAngularPinnableDemo } from './side-panel-angular-pinnable-demo';
import { SidePanelAngularPinnedDemo } from './side-panel-angular-pinned-demo';
import { SidePanelAngularSizeDemo } from './side-panel-angular-size-demo';
import { SidePanelAngularStaticBackdropDemo } from './side-panel-angular-static-backdrop-demo';
import { SidePanelSizeDesignDemo } from './side-panel-size-design';
import { SidePanelDemo } from './side-panel.demo';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    DocTabsModule,
    RouterModule.forChild([{ path: '', component: SidePanelDemo }]),
    DoDontComponent,
    ThemedImageComponent,
    StackblitzExampleComponent,
  ],
  declarations: [
    SidePanelSizeDesignDemo,
    SidePanelAngularDemo,
    SidePanelAngularInlineDemo,
    SidePanelAngularPinnableDemo,
    SidePanelAngularPinnedDemo,
    SidePanelAngularSizeDemo,
    SidePanelAngularStaticBackdropDemo,
    SidePanelAngularAlternateCloseDemo,
    SidePanelDemo,
  ],
  exports: [SidePanelDemo],
})
export class SidePanelDemoModule {}
