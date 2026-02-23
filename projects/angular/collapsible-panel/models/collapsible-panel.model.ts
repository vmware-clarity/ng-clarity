/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CollapsiblePanelStrategy } from '../enums/collapsible-panel-strategy.enum';

let panelGroupCount = 0;

export class CollapsiblePanelModel {
  index: number = null;
  disabled = false;
  open = false;
  templateId = `${this.id}-${this.groupId}`;
  constructor(
    public id: string,
    public groupId: number | string
  ) {}
}

export class CollapsiblePanelGroupModel {
  protected strategy = CollapsiblePanelStrategy.Default;
  protected panelGroupCount = panelGroupCount++;
  protected _panels: { [id: string]: CollapsiblePanelModel } = {};

  get panels(): CollapsiblePanelModel[] {
    return Object.keys(this._panels).map(id => this._panels[id]);
  }

  setStrategy(strategy: CollapsiblePanelStrategy) {
    this.strategy = strategy;
  }

  updatePanelOrder(ids: string[]) {
    ids.forEach((id, index) => {
      if (this._panels[id]) {
        this._panels[id].index = index;
      }
    });
    this.removeOldPanels(ids);
  }

  addPanel(id: string, open = false) {
    this._panels[id] = new CollapsiblePanelModel(id, this.panelGroupCount);
    this._panels[id].open = open;
  }

  togglePanel(panelId: string, open?: boolean) {
    if (!this._panels[panelId]) {
      return;
    }

    const panelIsOpen = this._panels[panelId].open;
    const newOpenState = open !== undefined ? open : !panelIsOpen;
    if (newOpenState && this.strategy === CollapsiblePanelStrategy.Default) {
      this.closeAllPanels();
    }

    this._panels[panelId].open = newOpenState;
  }

  disablePanel(panelId: string, disabled: boolean) {
    if (!this._panels[panelId]) {
      return;
    }

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
