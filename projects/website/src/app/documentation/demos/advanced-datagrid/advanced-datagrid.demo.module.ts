/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { AdvancedDatagridDemo } from './advanced-datagrid.demo';
import { ClientSideDatagridDemoComponent } from './ng/client-side';
import { CustomColumnDefinitionsDemoComponent } from './ng/custom-column-definitions';
import { DetailPaneGridDemoComponent } from './ng/detail-pane';
import { DragDropGridDemoComponent } from './ng/drag-drop';
import { FiltersGridComponent } from './ng/filters';
import { PersistenceGridDemoComponent } from './ng/persistance';
import { ServerDrivenGridDemoComponent } from './ng/server-driven';
import { VirtualScrollGridDemoComponent } from './ng/virtual-scroll';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { LinkCardsComponent } from '../../../shared/link-cards/link-cards.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AdvancedDatagridDemo }]),
    DocTabsModule,
    StyleDocsComponent,
    CodeSnippetComponent,
    ThemedImageComponent,
    StackblitzExampleComponent,
    LinkCardsComponent,
    ClientSideDatagridDemoComponent,
    CustomColumnDefinitionsDemoComponent,
    DetailPaneGridDemoComponent,
    DragDropGridDemoComponent,
    FiltersGridComponent,
    PersistenceGridDemoComponent,
    ServerDrivenGridDemoComponent,
    VirtualScrollGridDemoComponent,
    AdvancedDatagridDemo,
  ],
  exports: [AdvancedDatagridDemo],
})
export class AdvancedDatagridDemoModule {}
