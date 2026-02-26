/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { CollapsiblePanelService } from '@clr/angular/collapsible-panel';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { StepperModel } from '../models/stepper.model';

@Injectable()
export class StepperService extends CollapsiblePanelService {
  readonly activeStep: Observable<string>;
  readonly panelsCompleted = this.getAllCompletedPanelChanges();

  protected override panelGroup = new StepperModel();

  private _activeStepChanges = new Subject<string>();

  constructor() {
    super();

    this.activeStep = this._activeStepChanges.asObservable();
  }

  resetPanels() {
    this.panelGroup.resetPanels();
    this.emitUpdatedPanels();
  }

  setPanelValid(panelId: string) {
    this.panelGroup.setPanelValid(panelId);
    this.emitUpdatedPanels();
  }

  setPanelInvalid(panelId: string) {
    this.panelGroup.setPanelInvalid(panelId);
    this.emitUpdatedPanels();
  }

  setPanelsWithErrors(ids: string[]) {
    this.panelGroup.setPanelsWithErrors(ids);
    this.emitUpdatedPanels();
  }

  navigateToPreviousPanel(currentPanelId: string) {
    this.panelGroup.navigateToPreviousPanel(currentPanelId);
    this.updatePreviousStep(currentPanelId);
    this.emitUpdatedPanels();
  }

  navigateToNextPanel(currentPanelId: string, currentPanelValid = true) {
    this.panelGroup.navigateToNextPanel(currentPanelId, currentPanelValid);
    this.updateNextStep(currentPanelId, currentPanelValid);
    this.emitUpdatedPanels();
  }

  overrideInitialPanel(panelId: string) {
    this.panelGroup.overrideInitialPanel(panelId);
    this.emitUpdatedPanels();
  }

  private updateNextStep(currentPanelId: string, currentPanelValid: boolean) {
    const nextPanel = this.panelGroup.getNextPanel(currentPanelId);

    if (currentPanelValid && nextPanel) {
      this._activeStepChanges.next(nextPanel.id);
    } else if (currentPanelValid) {
      this._activeStepChanges.next(currentPanelId);
    }
  }

  private updatePreviousStep(currentPanelId: string) {
    const prevPanel = this.panelGroup.getPreviousPanel(currentPanelId);

    if (prevPanel) {
      this._activeStepChanges.next(prevPanel.id);
    }
  }

  private getAllCompletedPanelChanges(): Observable<boolean> {
    return this._panelsChanges.pipe(
      map(() => this.panelGroup.allPanelsCompleted),
      distinctUntilChanged()
    );
  }
}
