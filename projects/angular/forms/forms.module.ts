/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrCheckboxModule } from '@clr/angular/forms/checkbox';
import { ClrComboboxModule } from '@clr/angular/forms/combobox';
import { ClrCommonFormsModule } from '@clr/angular/forms/common';
import { ClrDatalistModule } from '@clr/angular/forms/datalist';
import { ClrDatepickerModule } from '@clr/angular/forms/datepicker';
import { ClrFileInputModule } from '@clr/angular/forms/file-input';
import { ClrInputModule } from '@clr/angular/forms/input';
import { ClrNumberInputModule } from '@clr/angular/forms/number-input';
import { ClrPasswordModule } from '@clr/angular/forms/password';
import { ClrRadioModule } from '@clr/angular/forms/radio';
import { ClrRangeModule } from '@clr/angular/forms/range';
import { ClrSelectModule } from '@clr/angular/forms/select';
import { ClrTextareaModule } from '@clr/angular/forms/textarea';

@NgModule({
  imports: [CommonModule],
  exports: [
    ClrCommonFormsModule,
    ClrCheckboxModule,
    ClrComboboxModule,
    ClrDatepickerModule,
    ClrFileInputModule,
    ClrInputModule,
    ClrPasswordModule,
    ClrRadioModule,
    ClrSelectModule,
    ClrTextareaModule,
    ClrRangeModule,
    ClrDatalistModule,
    ClrNumberInputModule,
  ],
})
export class ClrFormsModule {}
