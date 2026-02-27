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

import { CardAlertDemo } from './card-alert';
import { CardClickableDemo } from './card-clickable';
import { CardDropdownDemo } from './card-dropdown';
import { CardGridDemo } from './card-grid';
import { CardImagesDemo } from './card-images';
import { CardLayoutDemo } from './card-layout';
import { CardListGroupDemo } from './card-list-group';
import { CardMasonryDemo } from './card-masonry';
import { CardMediaBlockDemo } from './card-media-block';
import { CardsDemo } from './cards.demo';
import { ListsInCardsDemo } from './lists-in-cards';
import { ProgressBarCardsDemo } from './progress-bar-cards';
import { ProgressBarInlineCardsDemo } from './progress-bar-inline-cards';
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
    RouterModule.forChild([{ path: '', component: CardsDemo }]),
    DoDontComponent,
    NestingTableComponent,
    StyleDocsComponent,
    StackblitzExampleComponent,
    CardAlertDemo,
    CardGridDemo,
    CardClickableDemo,
    CardImagesDemo,
    CardLayoutDemo,
    CardMasonryDemo,
    CardMediaBlockDemo,
    CardDropdownDemo,
    CardListGroupDemo,
    ListsInCardsDemo,
    ProgressBarCardsDemo,
    ProgressBarInlineCardsDemo,
    CardsDemo,
  ],
  exports: [CardsDemo],
})
export class CardsDemoModule {}
