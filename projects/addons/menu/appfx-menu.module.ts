/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ZoomLevelService } from '@clr/addons/a11y';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';

import { FocusableDropdownItemDirective } from './a11y/focusable-dropdown-item.directive';
import { FocusableItemCollectorComponent } from './a11y/focusable-item-collector.component';
import { FocusableMenuDirective } from './a11y/focusable-menu.directive';
import { MenuOutletComponent } from './menu-outlet/menu-outlet.component';
import { MenuComponent } from './menu.component';
import { MenuActionComponent } from './model/menu-action.component';
import { MenuHeaderComponent } from './model/menu-header.component';
import { MenuSeparatorComponent } from './model/menu-separator.component';

@NgModule({
  imports: [ClrDropdownModule, CommonModule],
  declarations: [
    FocusableDropdownItemDirective,
    FocusableItemCollectorComponent,
    FocusableMenuDirective,
    MenuActionComponent,
    MenuComponent,
    MenuHeaderComponent,
    MenuOutletComponent,
    MenuSeparatorComponent,
  ],
  providers: [
    // Enable 200% and 400% zoom support
    ZoomLevelService,
  ],
  exports: [MenuActionComponent, MenuComponent, MenuHeaderComponent, MenuOutletComponent, MenuSeparatorComponent],
})
export class AppfxMenuModule {}
