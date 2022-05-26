/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';

import { ClrKeyNavigationList } from './key-navigation-list';
import { FOCUSABLE_ELEMENT_SELECTORS_PROVIDER } from './providers/focusable-items';
import { CLR_LIST_KEY_NAVIGATION_COFNIG_PROVIDER } from './providers/key-navigation-list.config';

@NgModule({
  declarations: [ClrKeyNavigationList],
  exports: [ClrKeyNavigationList],
  providers: [CLR_LIST_KEY_NAVIGATION_COFNIG_PROVIDER, FOCUSABLE_ELEMENT_SELECTORS_PROVIDER],
})
export class ClrKeyNavigationListModule {}
