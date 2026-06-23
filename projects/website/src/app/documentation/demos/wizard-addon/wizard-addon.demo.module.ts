/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WizardAddonDemoComponent } from './wizard-addon.demo';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: WizardAddonDemoComponent }]), WizardAddonDemoComponent],
  exports: [WizardAddonDemoComponent],
})
export class WizardAddonDemoModule {}
