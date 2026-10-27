/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PROPERTY_VIEW_EXAMPLES } from '@clr/examples/property-view';

import { PropertyViewDemo } from './property-view.demo';
import { ExampleListComponent } from '../../_utils/example-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: PropertyViewDemo },
      { path: 'examples', component: ExampleListComponent, data: { examples: PROPERTY_VIEW_EXAMPLES } },
    ]),
    PropertyViewDemo,
  ],
})
export class PropertyViewDemoModule {}
