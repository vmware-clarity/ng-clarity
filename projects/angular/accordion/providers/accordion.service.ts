/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { CollapsiblePanelService } from '@clr/angular/collapsible-panel';

import { AccordionStrategy } from '../enums/accordion-strategy.enum';
import { AccordionModel } from '../models/accordion.model';

@Injectable()
export class AccordionService extends CollapsiblePanelService {
  protected override panelGroup = new AccordionModel();

  setStrategy(strategy: AccordionStrategy) {
    this.panelGroup.setStrategy(strategy);
  }
}
