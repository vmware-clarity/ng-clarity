/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { of } from 'rxjs';

import { RelevanceService } from './relevance.service';
import { StepInternal } from './step';
import { Var } from './var';

describe('relevance-service', () => {
  beforeEach(function (this: ThisTest) {
    this.relevanceService = new RelevanceService();
    this.step1 = {
      title: 'step 1',
      isRelevant: Var.of(false),
      componentClass: MockComponent,
    };
    this.step2 = {
      title: 'step 2',
      isRelevant: Var.of(true),
      componentClass: MockComponent,
    };
    this.step3Relevant = Var.of<boolean>();
    this.step3 = {
      title: 'step 3',
      isRelevant: Var.from(this.step3Relevant).by(relevant => of(relevant)),
      componentClass: MockComponent,
    };
    this.steps = [this.step1, this.step2, this.step3];
  });

  it('checkComplete$', function (this: ThisTest) {
    this.relevanceService.steps = this.steps;
    this.relevanceService.checkComplete$().subscribe(() => {
      expect(this.step1.isSkipped).toEqual(true);
      expect(this.step2.isSkipped).toEqual(false);
    });
  });

  it('bindIsRelevantListeners', function (this: ThisTest) {
    this.relevanceService.steps = this.steps;
    expect(this.step3.isSkipped).toBeTruthy();
    this.step3Relevant.value = false;
    expect(this.step3.isSkipped).toBeTruthy();
    this.step3Relevant.value = true;
    expect(this.step3.isSkipped).toBeFalsy();
  });

  it('onRelevantStepStateChange$ emits when relevance state of step is changed', function (this: ThisTest) {
    this.relevanceService.steps = this.steps;
    let relevantStepStateChanged = false;
    this.relevanceService.onStepRelevanceChange$().subscribe(step => {
      relevantStepStateChanged = true;
      expect(step).toEqual(this.step3);
    });
    this.step3Relevant.value = false;
    this.step3Relevant.value = true;
    expect(relevantStepStateChanged).toEqual(true);
  });
});

interface ThisTest {
  relevanceService: RelevanceService;
  step1: StepInternal;
  step2: StepInternal;
  step3: StepInternal;
  step3Relevant: Var<boolean>;
  steps: StepInternal[];
}

@Component({
  standalone: false,
  template: ``,
})
class MockComponent {}
