/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrCheckboxModule } from '@clr/angular/src/forms/checkbox';
import { ClrComboboxModule } from '@clr/angular/src/forms/combobox';
import { ClrCommonFormsModule } from '@clr/angular/src/forms/common';
import { ClrDatalistModule } from '@clr/angular/src/forms/datalist';
import { ClrDatepickerModule } from '@clr/angular/src/forms/datepicker';
import { ClrFileInputModule } from '@clr/angular/src/forms/file-input';
import { ClrInputModule } from '@clr/angular/src/forms/input';
import { ClrNumberInputModule } from '@clr/angular/src/forms/number-input';
import { ClrPasswordModule } from '@clr/angular/src/forms/password';
import { ClrRadioModule } from '@clr/angular/src/forms/radio';
import { ClrRangeModule } from '@clr/angular/src/forms/range';
import { ClrSelectModule } from '@clr/angular/src/forms/select';
import { ClrTextareaModule } from '@clr/angular/src/forms/textarea';

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
