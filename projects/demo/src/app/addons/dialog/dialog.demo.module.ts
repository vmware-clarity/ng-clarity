/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DIALOG_EXAMPLES } from '@clr/examples/dialog';

import { DialogDemoComponent } from './dialog.demo';
import { ExampleListComponent } from '../../_utils/example-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: DialogDemoComponent },
      { path: 'examples', component: ExampleListComponent, data: { examples: DIALOG_EXAMPLES } },
    ]),
    DialogDemoComponent,
  ],
  exports: [DialogDemoComponent],
})
export class DialogDemoModule {}
