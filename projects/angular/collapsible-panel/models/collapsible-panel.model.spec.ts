/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CollapsiblePanelGroupModel } from './collapsible-panel.model';
import { CollapsiblePanelStrategy } from '../enums/collapsible-panel-strategy.enum';

describe('CollapsiblePanelGroupModel', () => {
  let panelGroup: CollapsiblePanelGroupModel;
  const panel1Id = '0';
  const panel2Id = '1';
  const panel3Id = '2';

  beforeEach(() => {
    panelGroup = new CollapsiblePanelGroupModel();
    panelGroup.addPanel(panel1Id);
    panelGroup.addPanel(panel2Id);
    panelGroup.addPanel(panel3Id);
    panelGroup.updatePanelOrder([panel1Id, panel2Id, panel3Id]);
  });

  it('should add new CollapsiblePanelModel instances', () => {
    expect(panelGroup.panels.length).toBe(3);
  });

  it('should disable or enable a panel', () => {
    expect(panelGroup.panels.find(p => p.id === panel1Id).disabled).toBe(false);
    panelGroup.disablePanel(panel1Id, true);
    expect(panelGroup.panels.find(p => p.id === panel1Id).disabled).toBe(true);
  });

  it('should remove panels from collection when re-synced with ContentChildren', () => {
    expect(panelGroup.panels.length).toBe(3);
    panelGroup.updatePanelOrder([panel1Id, panel3Id]);
    expect(panelGroup.panels.length).toBe(2);
  });

  it('should close all other panels when opening a new panel', () => {
    expect(panelGroup.panels[0].open).toBe(false);
    expect(panelGroup.panels[1].open).toBe(false);
    expect(panelGroup.panels[2].open).toBe(false);

    panelGroup.togglePanel(panel1Id);

    expect(panelGroup.panels[0].open).toBe(true);
    expect(panelGroup.panels[1].open).toBe(false);
    expect(panelGroup.panels[2].open).toBe(false);

    panelGroup.togglePanel(panel2Id);

    expect(panelGroup.panels[0].open).toBe(false);
    expect(panelGroup.panels[1].open).toBe(true);
    expect(panelGroup.panels[2].open).toBe(false);
  });

  it('should not close all panels when closing an already closed panel', () => {
    expect(panelGroup.panels[0].open).toBe(false);
    expect(panelGroup.panels[1].open).toBe(false);
    expect(panelGroup.panels[2].open).toBe(false);

    panelGroup.togglePanel(panel1Id);

    expect(panelGroup.panels[0].open).toBe(true);
    expect(panelGroup.panels[1].open).toBe(false);
    expect(panelGroup.panels[2].open).toBe(false);

    panelGroup.togglePanel(panel2Id, false);

    expect(panelGroup.panels[0].open).toBe(true);
    expect(panelGroup.panels[1].open).toBe(false);
    expect(panelGroup.panels[2].open).toBe(false);
  });

  it('should allow multiple panels open if in multi panel mode', () => {
    panelGroup.setStrategy(CollapsiblePanelStrategy.Multi);

    expect(panelGroup.panels[0].open).toBe(false);
    expect(panelGroup.panels[1].open).toBe(false);
    expect(panelGroup.panels[2].open).toBe(false);

    panelGroup.togglePanel(panel1Id);
    panelGroup.togglePanel(panel2Id);

    expect(panelGroup.panels[0].open).toBe(true);
    expect(panelGroup.panels[1].open).toBe(true);
    expect(panelGroup.panels[2].open).toBe(false);
  });

  it('should not throw when toggling a panel that does not exist', () => {
    expect(() => panelGroup.togglePanel('nonexistent')).not.toThrow();
  });

  it('should not throw when disabling a panel that does not exist', () => {
    expect(() => panelGroup.disablePanel('nonexistent', true)).not.toThrow();
  });

  it('should not throw when updatePanelOrder contains an unregistered id', () => {
    expect(() => panelGroup.updatePanelOrder(['nonexistent', panel1Id])).not.toThrow();
    expect(panelGroup.panels.find(p => p.id === panel1Id).index).toBe(1);
  });

  it('should preserve existing panels when updatePanelOrder skips unknown ids', () => {
    panelGroup.togglePanel(panel1Id, true);
    panelGroup.updatePanelOrder(['nonexistent', panel1Id, panel2Id]);
    expect(panelGroup.panels.find(p => p.id === panel1Id).open).toBe(true);
  });
});
