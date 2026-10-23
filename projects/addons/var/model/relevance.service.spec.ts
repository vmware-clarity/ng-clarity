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
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    testContext.relevanceService = new RelevanceService();
    testContext.step1 = {
      title: 'step 1',
      isRelevant: Var.of(false),
      componentClass: MockComponent,
    };
    testContext.step2 = {
      title: 'step 2',
      isRelevant: Var.of(true),
      componentClass: MockComponent,
    };
    testContext.step3Relevant = Var.of<boolean>();
    testContext.step3 = {
      title: 'step 3',
      isRelevant: Var.from(testContext.step3Relevant).by(relevant => of(relevant)),
      componentClass: MockComponent,
    };
    testContext.steps = [testContext.step1, testContext.step2, testContext.step3];
  });

  it('checkComplete$', () => {
    testContext.relevanceService.steps = testContext.steps;
    testContext.relevanceService.checkComplete$().subscribe(() => {
      expect(testContext.step1.isSkipped).toEqual(true);
      expect(testContext.step2.isSkipped).toEqual(false);
    });
  });

  it('bindIsRelevantListeners', () => {
    testContext.relevanceService.steps = testContext.steps;
    expect(testContext.step3.isSkipped).toBeTruthy();
    testContext.step3Relevant.value = false;
    expect(testContext.step3.isSkipped).toBeTruthy();
    testContext.step3Relevant.value = true;
    expect(testContext.step3.isSkipped).toBeFalsy();
  });

  it('onRelevantStepStateChange$ emits when relevance state of step is changed', () => {
    testContext.relevanceService.steps = testContext.steps;
    let relevantStepStateChanged = false;
    testContext.relevanceService.onStepRelevanceChange$().subscribe(step => {
      relevantStepStateChanged = true;
      expect(step).toEqual(testContext.step3);
    });
    testContext.step3Relevant.value = false;
    testContext.step3Relevant.value = true;
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
