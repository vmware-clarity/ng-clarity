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

import { LargeScreenNavDemo } from './large-screen-nav';
import { LayoutNoSubnavDemo } from './layout-no-subnav';
import { LayoutNoVerticalNavDemo } from './layout-no-vertical-nav';
import { LayoutOnlyHeaderDemo } from './layout-only-header';
import { LayoutSubnavPrimaryDemo } from './layout-subnav-primary';
import { LayoutVerticalNavPrimaryDemo } from './layout-vertical-nav-primary';
import { NavigationTypesDemo } from './navigation-types.demo';
import { NavigationDemo } from './navigation.demo';
import { ResponsiveNav1Demo } from './responsive-nav1';
import { ResponsiveNav2Demo } from './responsive-nav2';
import { SmallScreenNavDemo } from './small-screen-nav';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule.forChild([{ path: '', component: NavigationDemo }]),
    DocTabsModule,
    CodeSnippetComponent,
    ThemedImageComponent,
    StackblitzExampleComponent,
  ],
  declarations: [
    ResponsiveNav1Demo,
    ResponsiveNav2Demo,
    NavigationDemo,
    LayoutNoVerticalNavDemo,
    LayoutNoSubnavDemo,
    LayoutOnlyHeaderDemo,
    LayoutVerticalNavPrimaryDemo,
    LayoutSubnavPrimaryDemo,
    NavigationTypesDemo,
    LargeScreenNavDemo,
    SmallScreenNavDemo,
  ],
  exports: [NavigationDemo],
})
export class NavDemoModule {}
