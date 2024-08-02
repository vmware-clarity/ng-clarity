/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { CdkTrapFocusModule } from '../../../../angular/src/utils/cdk/cdk-trap-focus.module';
import { ClrPopoverModuleNext } from '../../../../angular/src/utils/popover/popover.module';
import { DropdownAngularCloseItemFalseDemo } from './dropdown-angular-close-item-false';
import { DropdownAngularNestedDemo } from './dropdown-angular-nested';
import { DropdownAngularPatternDemo } from './dropdown-angular-pattern';
import { DropdownAngularPositioningDemo } from './dropdown-angular-positioning';
import { DropdownHeaderDemo } from './dropdown-header';
import { DropdownStaticButtonLinkToggleDemo } from './dropdown-static-buttonlink-toggle';
import { DropdownStaticDefaultDemo } from './dropdown-static-default';
import { DropdownStaticIconToggleDemo } from './dropdown-static-icon-toggle';
import { DropdownStaticPositioningDemo } from './dropdown-static-positioning';
import { DropdownDemo } from './dropdown.demo';
import { ROUTING } from './dropdown.demo.routing';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    ROUTING,
    FormsModule,
    ReactiveFormsModule,
    ClrPopoverModuleNext,
    CdkTrapFocusModule,
  ],
  declarations: [
    DropdownDemo,
    DropdownStaticDefaultDemo,
    DropdownStaticPositioningDemo,
    DropdownStaticIconToggleDemo,
    DropdownStaticButtonLinkToggleDemo,
    DropdownAngularPositioningDemo,
    DropdownAngularNestedDemo,
    DropdownAngularPatternDemo,
    DropdownAngularCloseItemFalseDemo,
    DropdownHeaderDemo,
  ],
  exports: [
    DropdownDemo,
    DropdownStaticDefaultDemo,
    DropdownStaticPositioningDemo,
    DropdownStaticIconToggleDemo,
    DropdownStaticButtonLinkToggleDemo,
    DropdownAngularPositioningDemo,
    DropdownAngularNestedDemo,
    DropdownAngularPatternDemo,
    DropdownAngularCloseItemFalseDemo,
    DropdownHeaderDemo,
  ],
})
export class DropdownDemoModule {}
