/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { DisplayModeService } from './display-mode.service';
import { DatagridDisplayMode } from '../enums/display-mode.enum';

@Injectable()
export class MockDisplayModeService extends DisplayModeService {
  updateView(mode: DatagridDisplayMode) {
    this._view.next(mode);
  }
}

export const MOCK_DISPLAY_MODE_PROVIDER = {
  provide: DisplayModeService,
  useClass: MockDisplayModeService,
};
