/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CollapsiblePanelStrategy } from '../enums/collapsible-panel-strategy.enum';
import { CollapsiblePanelGroupModel, CollapsiblePanelModel } from '../models/collapsible-panel.model';

@Injectable()
export class CollapsiblePanelService {
  protected panelGroup = new CollapsiblePanelGroupModel();
  protected readonly _panelsChanges = new BehaviorSubject(this.panelGroup.panels);

  getPanelChanges(panelId: string): Observable<CollapsiblePanelModel> {
    return this._panelsChanges.pipe(map(panels => panels.find(s => s.id === panelId)));
  }

  setStrategy(strategy: CollapsiblePanelStrategy) {
    this.panelGroup.setStrategy(strategy);
  }

  addPanel(panelId: string, open = false) {
    this.panelGroup.addPanel(panelId, open);
    this.emitUpdatedPanels();
  }

  togglePanel(panelId: string, open?: boolean) {
    this.panelGroup.togglePanel(panelId, open);
    this.emitUpdatedPanels();
  }

  disablePanel(panelId: string, disabled?: boolean) {
    this.panelGroup.disablePanel(panelId, disabled);
    this.emitUpdatedPanels();
  }

  updatePanelOrder(ids: string[]) {
    this.panelGroup.updatePanelOrder(ids);
    this.emitUpdatedPanels();
  }

  protected emitUpdatedPanels() {
    this._panelsChanges.next(this.panelGroup.panels);
  }
}
