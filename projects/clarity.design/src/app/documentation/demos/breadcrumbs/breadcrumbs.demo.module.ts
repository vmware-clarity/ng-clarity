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

import { BreadcrumbFullRoutingDemo } from './breadcrumbs-full-routing-example';
import { BreadcrumbHrefDemo } from './breadcrumbs-href-example';
import { BreadcrumbRoutingDemo } from './breadcrumbs-routing-example';
import { BreadcrumbsDemo } from './breadcrumbs.demo';
import { BreadcrumbAngularExample } from './example/breadcrumbs-angular-example';
import { BreadcrumbClarityExample } from './example/breadcrumbs-clarity-example';
import { BreadcrumbDashboardExample } from './example/breadcrumbs-dashboard-example';
import { BreadcrumbFrameworkExample } from './example/breadcrumbs-framework-example';
import { BreadcrumbReactExample } from './example/breadcrumbs-react-example';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule.forChild([
      {
        path: '',
        component: BreadcrumbsDemo,
        children: [
          {
            path: 'framework',
            component: BreadcrumbFrameworkExample,
            data: {
              breadcrumb: 'Framework',
            },
            children: [
              {
                path: '',
                component: BreadcrumbDashboardExample,
              },
              {
                path: 'angular',
                component: BreadcrumbAngularExample,
                data: {
                  breadcrumb: 'Angular',
                },
                children: [
                  {
                    path: 'clarity',
                    component: BreadcrumbClarityExample,
                    data: {
                      breadcrumb: 'Clarity',
                    },
                  },
                ],
              },
              {
                path: 'react',
                component: BreadcrumbReactExample,
                data: {
                  breadcrumb: 'React',
                },
              },
            ],
          },
        ],
      },
    ]),
    DocTabsModule,
    StyleDocsComponent,
    ThemedImageComponent,
    StackblitzExampleComponent,
  ],
  declarations: [
    BreadcrumbsDemo,
    BreadcrumbRoutingDemo,
    BreadcrumbHrefDemo,
    BreadcrumbFrameworkExample,
    BreadcrumbAngularExample,
    BreadcrumbClarityExample,
    BreadcrumbFullRoutingDemo,
    BreadcrumbDashboardExample,
    BreadcrumbReactExample,
  ],
  exports: [BreadcrumbsDemo],
})
export class BreadcrumbsDemoModule {}
