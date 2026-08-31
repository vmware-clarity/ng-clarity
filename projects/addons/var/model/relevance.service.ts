/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Step, StepInternal } from './step';
import { ComputedVar, SimpleVar } from './var';

@Injectable()
export class RelevanceService {
  loading = false;

  private isRelevantSubs: Subscription[] = [];
  private stepRelevanceChange$ = new Subject<StepInternal>();

  #steps: StepInternal[] = [];

  /**
   * Workflow steps.
   */
  set steps(steps: Step[]) {
    this.#steps = steps || [];
    this.unbindIsRelevantListeners();
    this.bindIsRelevantListeners();
  }

  /**
   * Checks for relevance check to complete.
   */
  checkComplete$(): Observable<Step[]> {
    const relevantVarValues = this.#steps
      .filter(step => step.isRelevant instanceof ComputedVar && step.isRelevant.areDependenciesSatisfied)
      .map(step => (<ComputedVar<boolean>>step.isRelevant).value$);
    let stepsObservable: Observable<StepInternal[]>;
    if (relevantVarValues.length) {
      this.loading = true;
      stepsObservable = combineLatest(relevantVarValues).pipe(
        map(() => {
          this.loading = false;
          return this.#steps;
        })
      );
    } else {
      stepsObservable = of(this.#steps);
    }
    return stepsObservable;
  }

  destroy(): void {
    this.#steps = [];
    this.unbindIsRelevantListeners();
  }

  /**
   * Emits step which relevance has been changed
   */
  onStepRelevanceChange$(): Observable<StepInternal> {
    return this.stepRelevanceChange$.asObservable();
  }

  private bindIsRelevantListeners(): void {
    return this.#steps
      .filter(step => step.isRelevant)
      .forEach((step: StepInternal) => {
        if (step.isRelevant instanceof ComputedVar || step.isRelevant instanceof SimpleVar) {
          this.isRelevantSubs.push(
            step.isRelevant.value$
              .pipe(
                startWith(false) // Assume isRelevant is false by default.
              )
              .subscribe(isRelevant => {
                const oldValue = step.isSkipped;
                step.isSkipped = !isRelevant;
                if (oldValue !== step.isSkipped) {
                  this.stepRelevanceChange$.next(step);
                }
              })
          );
        }
      });
  }

  private unbindIsRelevantListeners(): void {
    this.isRelevantSubs.forEach(s => s.unsubscribe());
    this.isRelevantSubs = [];
  }
}
