/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * This file prevents an import cycle.
 */

import { TrackByFunction } from '@angular/core';

import { ColumnState } from './interfaces/column-state.interface';

export const columnToggleTrackByFn: TrackByFunction<ColumnState> = index => index;
