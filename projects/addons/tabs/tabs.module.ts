/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { A11yModule } from '@clr/addons/a11y';
import { AppfxWorkflowCoreModule } from '@clr/addons/var';
import { ClrIcon } from '@clr/angular/icon';
import { ClrTabsModule } from '@clr/angular/layout/tabs';

import { IfTabActiveDirective } from './if-tab-active/if-tab-active.directive';
import { RenderAsButtonDirective } from './render-as-button/render-as-button.directive';
import { TabLinksComponent } from './tab-links/tab-links.component';
import { TabsComponent } from './tabs.component';

const components = [TabsComponent, TabLinksComponent, IfTabActiveDirective];
const clarityDependencies = [ClrTabsModule, ClrIcon];
const appfxDependencies = [AppfxWorkflowCoreModule, A11yModule];

@NgModule({
  imports: [...appfxDependencies, ...clarityDependencies, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [...components, RenderAsButtonDirective],
  exports: [...components],
})
export class AppfxTabsModule {}
