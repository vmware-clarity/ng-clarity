/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { IconAliasesPipe } from './icon-shapes/icon-details/icon-aliases.pipe';
import { IconAriaLabelPipe } from './icon-shapes/icon-details/icon-aria-label.pipe';
import { IconCodePipe } from './icon-shapes/icon-details/icon-code.pipe';
import { IconDetailsComponent } from './icon-shapes/icon-details/icon-details.component';
import { IconBadgePipe } from './icon-shapes/icon-groups/icon-badge.pipe';
import { IconGroupsComponent } from './icon-shapes/icon-groups/icon-groups.component';
import { IconShapesComponent } from './icon-shapes/icon-shapes.component';
import { IconsDemo } from './icons.demo';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClarityModule,
    DocTabsModule,
    CodeSnippetComponent,
    RouterModule.forChild([{ path: '', component: IconsDemo }]),
    IconsDemo,
    IconShapesComponent,
    IconGroupsComponent,
    IconDetailsComponent,
    IconAliasesPipe,
    IconAriaLabelPipe,
    IconBadgePipe,
    IconCodePipe,
  ],
  exports: [IconsDemo],
})
export class IconsDemoModule {}
