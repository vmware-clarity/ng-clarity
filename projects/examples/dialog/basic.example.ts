/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AppfxMultiPageDialogModule } from '@clr/addons/dialog';
import { Step, TabLayout } from '@clr/addons/var';

import {
  BasicDialogNameStepComponent,
  BasicDialogReviewStepComponent,
  NameModel,
  ReviewModel,
} from './dialog-steps';

@Component({
  selector: 'clr-dialog-basic-example',
  templateUrl: './basic.example.html',
  imports: [AppfxMultiPageDialogModule],
})
export class DialogBasicExample {
  TabLayout = TabLayout;
  dialogOpened = false;
  dialogModel = {};
  steps: Step[] = [
    {
      title: 'Name',
      navTitle: 'Name',
      componentClass: BasicDialogNameStepComponent,
      model: new NameModel(),
    } as Step,
    {
      title: 'Ready to Complete',
      navTitle: 'Review',
      componentClass: BasicDialogReviewStepComponent,
      model: new ReviewModel(),
    } as Step,
  ];
}
