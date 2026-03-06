/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { take } from 'rxjs/operators';

import { AccordionService } from './accordion.service';
import { AccordionStrategy } from '../enums/accordion-strategy.enum';

describe('AccordionService', () => {
  let accordionService: AccordionService;
  const panel1Id = '0';
  const panel2Id = '1';

  beforeEach(() => {
    accordionService = new AccordionService();
    accordionService.addPanel(panel1Id);
    accordionService.addPanel(panel2Id);
    accordionService.updatePanelOrder([panel1Id, panel2Id]);
  });

  it('should close other panels when toggling in default strategy', () => {
    accordionService.togglePanel(panel1Id);
    accordionService.togglePanel(panel2Id);

    accordionService
      .getPanelChanges(panel1Id)
      .pipe(take(1))
      .subscribe(panel => expect(panel.open).toBe(false));

    accordionService
      .getPanelChanges(panel2Id)
      .pipe(take(1))
      .subscribe(panel => expect(panel.open).toBe(true));
  });

  it('should allow multiple panels open in multi strategy', () => {
    accordionService.setStrategy(AccordionStrategy.Multi);
    accordionService.togglePanel(panel1Id);
    accordionService.togglePanel(panel2Id);

    accordionService
      .getPanelChanges(panel1Id)
      .pipe(take(1))
      .subscribe(panel => expect(panel.open).toBe(true));

    accordionService
      .getPanelChanges(panel2Id)
      .pipe(take(1))
      .subscribe(panel => expect(panel.open).toBe(true));
  });
});
