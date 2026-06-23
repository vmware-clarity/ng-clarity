/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DatagridAdvancedDemo } from './datagrid-advanced.demo';

const ROUTES: Routes = [
  {
    path: '',
    component: DatagridAdvancedDemo,
    children: [
      { path: '', redirectTo: 'client-side', pathMatch: 'full' },
      {
        path: 'client-side',
        loadComponent: () =>
          import('./client-side/client-side-grid-demo.component').then(m => m.ClientSideDatagridDemoComponent),
      },
      {
        path: 'server-driven',
        loadComponent: () =>
          import('./server-driven/server-driven-grid-demo.component').then(m => m.ServerDrivenGridDemoComponent),
      },
      {
        path: 'virtual-scroll',
        loadComponent: () =>
          import('./virtual-scroll/virtual-scroll-grid-demo.component').then(m => m.VirtualScrollGridDemoComponent),
      },
      {
        path: 'drag-drop',
        loadComponent: () => import('./drag-drop/drag-drop-grid-demo.component').then(m => m.DragDropGridDemoComponent),
      },
      {
        path: 'filters',
        loadComponent: () => import('./filters/filters-grid.component').then(m => m.FiltersGridComponent),
      },
      {
        path: 'detail-pane',
        loadComponent: () =>
          import('./detail-pane/detail-pane-grid-demo.component').then(m => m.DetailPaneGridDemoComponent),
      },
      {
        path: 'custom-column-definitions',
        loadComponent: () =>
          import('./custom-column-definitions/custom-column-definitions-demo.component').then(
            m => m.CustomColumnDefinitionsDemoComponent
          ),
      },
      {
        path: 'persistance',
        loadComponent: () =>
          import('./persistance/persistence-grid-demo.component').then(m => m.PersistenceGridDemoComponent),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES), DatagridAdvancedDemo],
})
export class DatagridAdvancedDemoModule {}
