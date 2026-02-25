/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { take } from 'rxjs/operators';

import { CollapsiblePanelService } from './collapsible-panel.service';

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

  it('should toggle a panel open', () => {
    panelService.togglePanel(panel1Id);
    panelService
      .getPanelChanges(panel1Id)
      .pipe(take(1))
      .subscribe(panel => expect(panel.open).toBe(true));
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

  it('should return undefined from getPanelChanges for an unregistered panel id', () => {
    panelService
      .getPanelChanges('nonexistent')
      .pipe(take(1))
      .subscribe(panel => expect(panel).toBeUndefined());
  });

  it('should not throw when toggling a panel that has not been added', () => {
    expect(() => panelService.togglePanel('nonexistent')).not.toThrow();
  });

  it('should not throw when disabling a panel that has not been added', () => {
    expect(() => panelService.disablePanel('nonexistent', true)).not.toThrow();
  });

  it('should still emit for existing panels after toggling a nonexistent panel', () => {
    panelService.togglePanel('nonexistent');
    panelService
      .getPanelChanges(panel1Id)
      .pipe(take(1))
      .subscribe(panel => expect(panel.open).toBe(false));
  });
});
