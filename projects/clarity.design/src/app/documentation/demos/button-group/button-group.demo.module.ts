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

import { ButtonGroupAngularBasicStructureDemo } from './angular-basic-structure';
import { ButtonGroupAngularDirectionsDemo } from './angular-directions';
import { ButtonGroupBasicStructureDemo } from './basic-structure';
import { ButtonGroupDemo } from './button-group.demo';
import { ButtonGroupCheckboxDemo } from './checkbox';
import { ButtonGroupIconsDemo } from './icons';
import { MixedButtonGroupDemo } from './mixed';
import { ButtonGroupRadioDemo } from './radio';
import { ButtonGroupTypes } from './types';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    DocTabsModule,
    RouterModule.forChild([{ path: '', component: ButtonGroupDemo }]),
    DoDontComponent,
    NestingTableComponent,
    StyleDocsComponent,
    StackblitzExampleComponent,
  ],
  declarations: [
    ButtonGroupBasicStructureDemo,
    ButtonGroupTypes,
    MixedButtonGroupDemo,
    ButtonGroupIconsDemo,
    ButtonGroupCheckboxDemo,
    ButtonGroupRadioDemo,
    ButtonGroupAngularBasicStructureDemo,
    ButtonGroupAngularDirectionsDemo,
    ButtonGroupDemo,
  ],
  exports: [ButtonGroupDemo],
})
export class ButtonGroupDemoModule {}
