/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy } from '@angular/core';
import { ClrCommonStrings, ClrCommonStringsService, commonStringsDefault } from '@clr/angular';

import { frenchTranslation } from './fr-translation';
import { USERS } from './users';

@Component({
  templateUrl: './i18n-a11y.demo.html',
  host: {
    lang: 'fr',
  },
  standalone: false,
})
export class I18nA11yDemo implements OnDestroy {
  users = USERS;
  selected: any[] = [];
  test: ClrCommonStrings;

  constructor(private commonStrings: ClrCommonStringsService) {
    commonStrings.localize(frenchTranslation);
  }

  // We want to reset the strings when leaving this demo.
  ngOnDestroy() {
    this.commonStrings.localize(commonStringsDefault);
  }
}
