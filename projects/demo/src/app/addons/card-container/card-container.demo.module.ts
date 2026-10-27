/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CARD_CONTAINER_EXAMPLES } from '@clr/examples/card-container';

import { ExampleListComponent } from '../../_utils/example-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: 'examples', pathMatch: 'full' },
      { path: 'examples', component: ExampleListComponent, data: { examples: CARD_CONTAINER_EXAMPLES } },
    ]),
  ],
})
export class CardContainerDemoModule {}
