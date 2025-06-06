/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccordionStrategy } from '../enums/accordion-strategy.enum';
import { AccordionModel, AccordionPanelModel } from '../models/accordion.model';

@Injectable()
export class AccordionService {
  protected accordion = new AccordionModel();
  protected readonly _panelsChanges = new BehaviorSubject(this.accordion.panels);

  getPanelChanges(panelId: string): Observable<AccordionPanelModel> {
    return this._panelsChanges.pipe(map(panels => panels.find(s => s.id === panelId)));
  }

  setStrategy(strategy: AccordionStrategy) {
    this.accordion.setStrategy(strategy);
  }

  addPanel(panelId: string, open = false) {
    this.accordion.addPanel(panelId, open);
    this.emitUpdatedPanels();
  }

  togglePanel(panelId: string, open?: boolean) {
    this.accordion.togglePanel(panelId, open);
    this.emitUpdatedPanels();
  }

  disablePanel(panelId: string, disabled?: boolean) {
    this.accordion.disablePanel(panelId, disabled);
    this.emitUpdatedPanels();
  }

  updatePanelOrder(ids: string[]) {
    this.accordion.updatePanelOrder(ids);
    this.emitUpdatedPanels();
  }

  protected emitUpdatedPanels() {
    this._panelsChanges.next(this.accordion.panels);
  }
}
