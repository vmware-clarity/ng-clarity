/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { FilePickerOverviewLayouts } from './layouts/file-picker-overview-layouts';
import { FilePickerOverviewStates } from './states/file-picker-overview-states';
import { FilePickerOverviewUsage } from './usage/file-picker-overview-usage';

@Component({
  selector: 'app-file-picker-overview',
  templateUrl: './file-picker-overview.html',
  imports: [FilePickerOverviewUsage, FilePickerOverviewStates, FilePickerOverviewLayouts],
})
export class FilePickerOverview {}
