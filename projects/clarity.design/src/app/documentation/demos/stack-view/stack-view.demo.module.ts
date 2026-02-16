/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { RemoveStackViewHeadingsDirective } from './remove-stack-view-headings.directive';
import { StackViewAngularBasicDemo } from './stack-view-angular-basic';
import { StackViewAngularLazyloadDemo } from './stack-view-angular-lazyload';
import { StackViewAngularModalEditDemo } from './stack-view-angular-modal-edit';
import { StackViewStaticDemo } from './stack-view-static';
import { StackViewDemo } from './stack-view.demo';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: StackViewDemo }]),
    DocTabsModule,
    StyleDocsComponent,
    StackblitzExampleComponent,
  ],
  declarations: [
    StackViewAngularBasicDemo,
    StackViewAngularLazyloadDemo,
    StackViewAngularModalEditDemo,
    StackViewStaticDemo,
    StackViewDemo,
    RemoveStackViewHeadingsDirective,
  ],
  exports: [StackViewDemo],
})
export class StackViewDemoModule {}
