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

import { TabsAngularDemo } from './tabs-angular';
import { TabsAngularActionsButtonDemo } from './tabs-angular-actions-button';
import { TabsAngularDynamicSelectionDemo } from './tabs-angular-dynamic-selection';
import { TabsAngularOverflowDemo } from './tabs-angular-overflow';
import { TabsAngularSimpleDemo } from './tabs-angular-simple';
import { TabsAngularVerticalDemo } from './tabs-angular-vertical';
import { TabsStaticDemo } from './tabs-static';
import { TabsStaticVerticalDemo } from './tabs-static-vertical';
import { TabsDemo } from './tabs.demo';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule.forChild([{ path: '', component: TabsDemo }]),
    DocTabsModule,
    StyleDocsComponent,
    StackblitzExampleComponent,
  ],
  declarations: [
    TabsStaticDemo,
    TabsStaticVerticalDemo,
    TabsAngularDemo,
    TabsAngularSimpleDemo,
    TabsAngularDynamicSelectionDemo,
    TabsAngularVerticalDemo,
    TabsAngularOverflowDemo,
    TabsDemo,
    TabsAngularActionsButtonDemo,
  ],
  exports: [TabsDemo],
})
export class TabsDemoModule {}
