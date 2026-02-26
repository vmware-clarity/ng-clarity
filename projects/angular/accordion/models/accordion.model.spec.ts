/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AccordionModel } from './accordion.model';
import { AccordionStrategy } from '../enums/accordion-strategy.enum';

describe('AccordionModel', () => {
  let accordionModel: AccordionModel;
  const panel1Id = '0';
  const panel2Id = '1';
  const panel3Id = '2';

  beforeEach(() => {
    accordionModel = new AccordionModel();
    accordionModel.addPanel(panel1Id);
    accordionModel.addPanel(panel2Id);
    accordionModel.addPanel(panel3Id);
    accordionModel.updatePanelOrder([panel1Id, panel2Id, panel3Id]);
  });

  it('should close all other panels when opening a new panel in default strategy', () => {
    expect(accordionModel.panels[0].open).toBe(false);
    expect(accordionModel.panels[1].open).toBe(false);
    expect(accordionModel.panels[2].open).toBe(false);

    accordionModel.togglePanel(panel1Id);

    expect(accordionModel.panels[0].open).toBe(true);
    expect(accordionModel.panels[1].open).toBe(false);
    expect(accordionModel.panels[2].open).toBe(false);

    accordionModel.togglePanel(panel2Id);

    expect(accordionModel.panels[0].open).toBe(false);
    expect(accordionModel.panels[1].open).toBe(true);
    expect(accordionModel.panels[2].open).toBe(false);
  });

  it('should not close all panels when closing an already closed panel', () => {
    accordionModel.togglePanel(panel1Id);

    expect(accordionModel.panels[0].open).toBe(true);
    expect(accordionModel.panels[1].open).toBe(false);
    expect(accordionModel.panels[2].open).toBe(false);

    accordionModel.togglePanel(panel2Id, false);

    expect(accordionModel.panels[0].open).toBe(true);
    expect(accordionModel.panels[1].open).toBe(false);
    expect(accordionModel.panels[2].open).toBe(false);
  });

  it('should allow multiple panels open if in multi panel mode', () => {
    accordionModel.setStrategy(AccordionStrategy.Multi);

    accordionModel.togglePanel(panel1Id);
    accordionModel.togglePanel(panel2Id);

    expect(accordionModel.panels[0].open).toBe(true);
    expect(accordionModel.panels[1].open).toBe(true);
    expect(accordionModel.panels[2].open).toBe(false);
  });
});
