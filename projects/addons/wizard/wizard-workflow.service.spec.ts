/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { Step } from '@clr/addons/var';

import { WorkflowService } from './wizard-workflow.service';

class MockWorkflowService extends WorkflowService {}

@Component({
  standalone: false,
  template: ``,
})
class MockComponent {}

function createMockSteps(numSteps: number): Step[] {
  const steps: Step[] = [];
  for (let i = 1; i <= numSteps; i++) {
    const step = {
      title: `title${i}`,
      componentClass: MockComponent,
    };
    steps.push(step);
  }
  return steps;
}

describe('wizard-workflow-service.spec', () => {
  describe('#constructor', () => {
    it('Empty flow to exist out of the box', function () {
      const workflowService = new MockWorkflowService();
      expect(workflowService.flow).toBeDefined();
      expect(workflowService.flow.length).toEqual(0);
    });
  });

  describe('#addWorkflow', () => {
    it('The method is called successfully', () => {
      const workflowService = new MockWorkflowService();
      const [step1, step2, step3] = createMockSteps(3);
      workflowService.addWorkflow('flow1', [step1, step3]);
      workflowService.addWorkflow('flow2', [step2, step3]);
    });

    it('Error is thrown if flow id is duplicated', () => {
      let error: Error | undefined;
      try {
        const workflowService = new MockWorkflowService();
        const [step1, step2] = createMockSteps(2);
        workflowService.addWorkflow('duplicate-flow-id', [step1]);
        workflowService.addWorkflow('duplicate-flow-id', [step2]);
      } catch (e) {
        error = e as Error;
      }
      expect(error).toBeDefined();
    });
  });

  describe('#switchWorkflow', () => {
    it('WHEN the method is called THEN the pages for the new workflow are returned', () => {
      const workflowService = new MockWorkflowService();
      const [step1, step2, step3] = createMockSteps(3);
      workflowService.addWorkflow('flow1', [step1, step3]);
      workflowService.addWorkflow('flow2', [step2, step3]);

      workflowService.switchToWorkflow('flow1');
      expect(workflowService.flow.map(step => step.title)).toEqual(['title1', 'title3']);

      workflowService.switchToWorkflow('flow2');
      expect(workflowService.flow.map(step => step.title)).toEqual(['title2', 'title3']);
    });
  });
});
