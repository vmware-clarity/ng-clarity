/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ClarityIcons, ClrIcon, ellipsisHorizontalIcon } from '@clr/angular/src/icon';
import { ClrConditionalModule, ClrKeyFocusModule, ClrTemplateRefModule } from '@clr/angular/src/utils';

import { ActiveOompaLoompa } from './chocolate/active-oompa-loompa';
import { TabsWillyWonka } from './chocolate/tabs-willy-wonka';
import { ClrTab } from './tab';
import { ClrTabAction } from './tab-action.directive';
import { ClrTabContent } from './tab-content';
import { ClrTabLink } from './tab-link.directive';
import { ClrTabOverflowContent } from './tab-overflow-content';
import { ClrTabs } from './tabs';
import { ClrTabsActions } from './tabs-actions';

export const CLR_TABS_DIRECTIVES: Type<any>[] = [
  ClrTabContent,
  ClrTab,
  ClrTabs,
  ClrTabOverflowContent,
  ClrTabLink,
  ClrTabAction,
  ClrTabsActions,
  TabsWillyWonka,
  ActiveOompaLoompa,
];

@NgModule({
  imports: [CommonModule, ClrConditionalModule, ClrIcon, ClrTemplateRefModule, ClrKeyFocusModule],
  declarations: [CLR_TABS_DIRECTIVES],
  exports: [CLR_TABS_DIRECTIVES, ClrConditionalModule],
})
export class ClrTabsModule {
  constructor() {
    ClarityIcons.addIcons(ellipsisHorizontalIcon);
  }
}
