/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive } from '@angular/core';

import { WillyWonka } from '../../../utils/chocolate/willy-wonka';

@Directive({
  selector: 'form[clrStepper]',
})
export class StepperWillyWonka extends WillyWonka {}
