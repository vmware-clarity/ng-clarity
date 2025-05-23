/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ClrWizard } from '@clr/angular';

const defaultPageNumbers = [1, 2, 3];

const scrollingPageNumbers = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
];

@Component({
  selector: 'clr-wizard-basic',
  templateUrl: './wizard-basic.demo.html',
})
export class WizardBasicDemo {
  @ViewChild('wizard') wizard: ClrWizard;
  open = true; // ***** change to false before merging *****
  horizontal = true; // ***** change to false before merging *****
  longTitles = false;
  fullScreen = false;
  scrollingSteps = false;

  get pageNumbers() {
    return this.scrollingSteps ? scrollingPageNumbers : defaultPageNumbers;
  }
}
