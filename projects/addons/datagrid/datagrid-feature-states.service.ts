/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

/**
 * Feature states populated on application level during app initialization.
 * This is needed, because datagrid module does not have direct access to feature-state-service.
 */
@Injectable()
export class DatagridFeatureStates {}
