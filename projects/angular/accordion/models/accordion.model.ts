/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CollapsiblePanelGroupModel } from '@clr/angular/collapsible-panel';

import { AccordionStrategy } from '../enums/accordion-strategy.enum';

export class AccordionModel extends CollapsiblePanelGroupModel {
  private strategy = AccordionStrategy.Default;

  setStrategy(strategy: AccordionStrategy) {
    this.strategy = strategy;
  }

  override togglePanel(panelId: string, open?: boolean) {
    if (!this._panels[panelId]) {
      return;
    }

    const panelIsOpen = this._panels[panelId].open;
    const newOpenState = open !== undefined ? open : !panelIsOpen;
    if (newOpenState && this.strategy === AccordionStrategy.Default) {
      this.closeAllPanels();
    }

    this._panels[panelId].open = newOpenState;
  }

  private closeAllPanels() {
    this.panels.forEach(panel => (this._panels[panel.id].open = false));
  }
}
