/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { DropdownAngularCloseItemFalseDemo } from './dropdown-angular-close-item-false';
import { DropdownAngularPositioningDemo } from './dropdown-angular-positioning';
import { DropdownStaticButtonLinkToggleDemo } from './dropdown-static-buttonlink-toggle';
import { DropdownStaticDefaultDemo } from './dropdown-static-default';
import { DropdownStaticIconToggleDemo } from './dropdown-static-icon-toggle';
import { DropdownStaticPositioningDemo } from './dropdown-static-positioning';
import { DropdownsDemo } from './dropdown.demo';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule.forChild([{ path: '', component: DropdownsDemo }]),
    DocTabsModule,
    StyleDocsComponent,
    NestingTableComponent,
    ThemedImageComponent,
    StackblitzExampleComponent,
    DropdownStaticDefaultDemo,
    DropdownStaticPositioningDemo,
    DropdownStaticIconToggleDemo,
    DropdownStaticButtonLinkToggleDemo,
    DropdownAngularPositioningDemo,
    DropdownAngularCloseItemFalseDemo,
    DropdownsDemo,
  ],
  exports: [DropdownsDemo],
})
export class DropdownDemoModule {}
