/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { take } from 'rxjs/operators';

import { CollapsiblePanelService } from './collapsible-panel.service';
import { CollapsiblePanelStrategy } from '../enums/collapsible-panel-strategy.enum';

describe('CollapsiblePanelService', () => {
  let panelService: CollapsiblePanelService;
  const panel1Id = '0';
  const panel2Id = '1';

  beforeEach(() => {
    panelService = new CollapsiblePanelService();
    panelService.addPanel(panel1Id);
    panelService.addPanel(panel2Id);
    panelService.updatePanelOrder([panel1Id, panel2Id]);
  });

  it('should get updates of an individual panel change', () => {
    panelService
      .getPanelChanges(panel1Id)
      .pipe(take(1))
      .subscribe(panel => expect(panel.id).toBe(panel1Id));
  });

  it('should update of panel changes when toggling to new panel', () => {
    panelService.togglePanel(panel2Id);
    panelService
      .getPanelChanges(panel1Id)
      .pipe(take(1))
      .subscribe(panel => expect(panel.open).toBe(false));
  });

  it('should update panel disabled state', () => {
    panelService.disablePanel(panel1Id, true);
    panelService
      .getPanelChanges(panel1Id)
      .pipe(take(1))
      .subscribe(panel => expect(panel.disabled).toBe(true));
  });

  it('should notify of panel changes when panel order has changed', () => {
    panelService.updatePanelOrder([panel2Id, panel1Id]);
    panelService
      .getPanelChanges(panel1Id)
      .pipe(take(1))
      .subscribe(panel => expect(panel.index).toBe(1));
  });

  it('should allow component to set the active panel strategy', () => {
    panelService.setStrategy(CollapsiblePanelStrategy.Multi);
    panelService.togglePanel(panel1Id);
    panelService.togglePanel(panel2Id);

    panelService
      .getPanelChanges(panel1Id)
      .pipe(take(1))
      .subscribe(panel => expect(panel.open).toBe(true));

    panelService
      .getPanelChanges(panel2Id)
      .pipe(take(1))
      .subscribe(panel => expect(panel.open).toBe(true));
  });
});
