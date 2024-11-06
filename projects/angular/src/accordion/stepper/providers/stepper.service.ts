/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { AccordionService } from '../../providers/accordion.service';
import { StepperModel } from '../models/stepper.model';

@Injectable()
export class StepperService extends AccordionService {
  readonly activeStep: Observable<string>;
  readonly panelsCompleted = this.getAllCompletedPanelChanges();

  protected override accordion = new StepperModel();

  private _activeStepChanges = new Subject<string>();

  constructor() {
    super();

    this.activeStep = this._activeStepChanges.asObservable();
  }

  resetPanels() {
    this.accordion.resetPanels();
    this.emitUpdatedPanels();
  }

  setPanelValid(panelId: string) {
    this.accordion.setPanelValid(panelId);
    this.emitUpdatedPanels();
  }

  setPanelInvalid(panelId: string) {
    this.accordion.setPanelInvalid(panelId);
    this.emitUpdatedPanels();
  }

  setPanelsWithErrors(ids: string[]) {
    this.accordion.setPanelsWithErrors(ids);
    this.emitUpdatedPanels();
  }

  navigateToPreviousPanel(currentPanelId: string) {
    this.accordion.navigateToPreviousPanel(currentPanelId);
    this.updatePreviousStep(currentPanelId);
    this.emitUpdatedPanels();
  }

  navigateToNextPanel(currentPanelId: string, currentPanelValid = true) {
    this.accordion.navigateToNextPanel(currentPanelId, currentPanelValid);
    this.updateNextStep(currentPanelId, currentPanelValid);
    this.emitUpdatedPanels();
  }

  overrideInitialPanel(panelId: string) {
    this.accordion.overrideInitialPanel(panelId);
    this.emitUpdatedPanels();
  }

  private updateNextStep(currentPanelId: string, currentPanelValid: boolean) {
    const nextPanel = this.accordion.getNextPanel(currentPanelId);

    if (currentPanelValid && nextPanel) {
      this._activeStepChanges.next(nextPanel.id);
    } else if (currentPanelValid) {
      this._activeStepChanges.next(currentPanelId);
    }
  }

  private updatePreviousStep(currentPanelId: string) {
    const prevPanel = this.accordion.getPreviousPanel(currentPanelId);

    if (prevPanel) {
      this._activeStepChanges.next(prevPanel.id);
    }
  }

  private getAllCompletedPanelChanges(): Observable<boolean> {
    return this._panelsChanges.pipe(
      map(() => this.accordion.allPanelsCompleted),
      distinctUntilChanged()
    );
  }
}
