/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AccordionStatus } from '../enums/accordion-status.enum';
import { AccordionStrategy } from '../enums/accordion-strategy.enum';

let accordionCount = 0;

export class AccordionPanelModel {
  status = AccordionStatus.Inactive;
  index: number = null;
  disabled = false;
  open = false;
  templateId = `${this.id}-${this.accordionId}`;
  constructor(public id: string, public accordionId: number | string) {}
}

export class AccordionModel {
  protected strategy = AccordionStrategy.Default;
  protected accordionCount = accordionCount++;
  protected _panels: { [id: string]: AccordionPanelModel } = {};

  get panels(): AccordionPanelModel[] {
    return Object.keys(this._panels).map(id => this._panels[id]);
  }

  setStrategy(strategy: AccordionStrategy) {
    this.strategy = strategy;
  }

  updatePanelOrder(ids: string[]) {
    ids.forEach((id, index) => (this._panels[id].index = index));
    this.removeOldPanels(ids);
  }

  addPanel(id: string, open = false) {
    this._panels[id] = new AccordionPanelModel(id, this.accordionCount);
    this._panels[id].open = open;
  }

  togglePanel(panelId: string, open?: boolean) {
    const panelIsOpen = this._panels[panelId].open;
    const newOpenState = open !== undefined ? open : !panelIsOpen;
    if (newOpenState && this.strategy === AccordionStrategy.Default) {
      this.closeAllPanels();
    }

    this._panels[panelId].open = newOpenState;
  }

  disablePanel(panelId: string, disabled: boolean) {
    this._panels[panelId].disabled = disabled;
  }

  private closeAllPanels() {
    this.panels.forEach(panel => (this._panels[panel.id].open = false));
  }

  private removeOldPanels(ids: string[]) {
    this.panels
      .filter(panel => ids.find(id => id === panel.id) === undefined)
      .forEach(panel => delete this._panels[panel.id]);
  }
}
