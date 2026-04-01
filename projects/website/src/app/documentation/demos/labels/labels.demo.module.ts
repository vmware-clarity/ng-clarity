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

import { LabelAngularColorsDemo } from './label-angular-colors';
import { LabelAngularSolidDemo } from './label-angular-solid';
import { LabelAngularStatusDemo } from './label-angular-solid-with-badges';
import { LabelAngularWithBadgesDemo } from './label-angular-with-badges';
import { LabelsClickableDemo } from './labels-clickable';
import { LabelsColorOptionsDemo } from './labels-color-options';
import { LabelsDefaultDemo } from './labels-default';
import { LabelsStatusDemo } from './labels-status';
import { LabelsWithBadgesDemo } from './labels-with-badges';
import { LabelsDemo } from './labels.demo';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule.forChild([{ path: '', component: LabelsDemo }]),
    DocTabsModule,
    DoDontComponent,
    StyleDocsComponent,
    StackblitzExampleComponent,
    LabelAngularColorsDemo,
    LabelAngularSolidDemo,
    LabelAngularStatusDemo,
    LabelAngularWithBadgesDemo,
    LabelsWithBadgesDemo,
    LabelsStatusDemo,
    LabelsClickableDemo,
    LabelsColorOptionsDemo,
    LabelsDefaultDemo,
    LabelsDemo,
  ],
  exports: [LabelsDemo],
})
export class LabelsDemoModule {}
