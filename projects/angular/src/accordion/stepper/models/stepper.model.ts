/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AccordionStatus } from '../../enums/accordion-status.enum';
import { AccordionModel } from '../../models/accordion.model';

export class StepperModel extends AccordionModel {
  private stepperModelInitialize = false;
  private initialPanel: string;

  get allPanelsCompleted(): boolean {
    return this.panels.length && this.getNumberOfIncompletePanels() === 0 && this.getNumberOfOpenPanels() === 0;
  }

  get shouldOpenFirstPanel() {
    return !this.initialPanel || (this._panels && Object.keys(this._panels).length && !this._panels[this.initialPanel]);
  }

  override addPanel(id: string, open = false) {
    super.addPanel(id, open);
    this._panels[id].disabled = true;
  }

  override updatePanelOrder(ids: string[]) {
    super.updatePanelOrder(ids);
    if (this.stepperModelInitialize === false) {
      this.openFirstPanel();
    }
  }

  override togglePanel(panelId: string) {
    if (this._panels[panelId].status === AccordionStatus.Complete) {
      this._panels[panelId].open = !this._panels[panelId].open;
    }
  }

  navigateToPreviousPanel(currentPanelId: string) {
    this.openPreviousPanel(this._panels[currentPanelId].id);
  }

  navigateToNextPanel(currentPanelId: string, currentPanelValid = true) {
    if (currentPanelValid) {
      this.completePanel(currentPanelId);
      this.openNextPanel(this._panels[currentPanelId].id);
    } else {
      this.setPanelError(currentPanelId);
    }
  }

  overrideInitialPanel(panelId: string) {
    this.initialPanel = panelId;
    this.panels
      .filter(() => this._panels[panelId] !== undefined)
      .forEach(panel => {
        if (panel.index < this._panels[panelId].index) {
          this.completePanel(panel.id);
        } else if (panel.id === panelId) {
          this._panels[panel.id].open = true;
        } else {
          this._panels[panel.id].open = false;
        }
      });
  }

  setPanelValid(panelId: string) {
    this._panels[panelId].status = AccordionStatus.Complete;
  }

  setPanelInvalid(panelId: string) {
    this._panels[panelId].status = AccordionStatus.Error;
  }

  setPanelsWithErrors(ids: string[]) {
    ids.forEach(id => this.setPanelError(id));
  }

  resetPanels() {
    /* return stepper to initialize state */
    this.stepperModelInitialize = false;
    this.panels.forEach(p => this.resetPanel(p.id));
    this.openFirstPanel();
  }

  getNextPanel(currentPanelId: string) {
    return this.panels.find(s => s.index === this._panels[currentPanelId].index + 1);
  }

  getPreviousPanel(currentPanelId: string) {
    return this.panels.find(s => s.index === this._panels[currentPanelId].index - 1);
  }

  private resetAllFuturePanels(panelId: string) {
    this.panels.filter(panel => panel.index >= this._panels[panelId].index).forEach(panel => this.resetPanel(panel.id));
  }

  private resetPanel(panelId: string) {
    this._panels[panelId].status = AccordionStatus.Inactive;
    this._panels[panelId].open = false;
    this._panels[panelId].disabled = true;
  }

  private openFirstPanel() {
    if (!this.shouldOpenFirstPanel) {
      return;
    }
    const firstPanel = this.getFirstPanel();
    /**
     * You need to call updatePanelOrder first to get the correct order,
     * else the list of panels will not have `index` set and we won't know
     * how to find the first panel.
     */
    if (!firstPanel) {
      return;
    }

    this._panels[firstPanel.id].open = true;
    this._panels[firstPanel.id].disabled = true;
    this.stepperModelInitialize = true;
  }

  private completePanel(panelId: string) {
    this._panels[panelId].status = AccordionStatus.Complete;
    this._panels[panelId].disabled = false;
    this._panels[panelId].open = false;
  }

  private openNextPanel(currentPanelId: string) {
    const nextPanel = this.getNextPanel(currentPanelId);

    if (nextPanel) {
      this.resetAllFuturePanels(nextPanel.id);
      this._panels[nextPanel.id].open = true;
      this._panels[nextPanel.id].disabled = true;
    }
  }

  private openPreviousPanel(currentPanelId: string) {
    const prevPanel = this.getPreviousPanel(currentPanelId);

    if (prevPanel) {
      this._panels[currentPanelId].open = false;
      this._panels[currentPanelId].disabled = false;

      this._panels[prevPanel.id].open = true;
      this._panels[prevPanel.id].disabled = true;
    }
  }

  private setPanelError(panelId: string) {
    this.resetAllFuturePanels(panelId);
    this._panels[panelId].open = true;
    this._panels[panelId].status = AccordionStatus.Error;
  }

  private getFirstPanel() {
    return this.panels.find(panel => panel.index === 0);
  }

  private getNumberOfIncompletePanels() {
    return this.panels.reduce((prev, next) => (next.status !== AccordionStatus.Complete ? prev + 1 : prev), 0);
  }

  private getNumberOfOpenPanels() {
    return this.panels.reduce((prev, next) => (next.open !== false ? prev + 1 : prev), 0);
  }
}
