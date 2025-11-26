/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive } from '@angular/core';
import { WillyWonka } from '@clr/angular/src/utils';

@Directive({
  selector: 'clr-accordion',
  standalone: false,
})
export class AccordionWillyWonka extends WillyWonka {}
