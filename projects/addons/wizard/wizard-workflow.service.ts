/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Step } from '@clr/addons/var';

/**
 * Class that holds data about the steps in the wizard and the flows (combinations of pages).
 */
export abstract class WorkflowService {
  private currentFlow: Step[] = [];
  private stepsByFlowId: { [flowId: string]: Step[] } = {};

  /**
   * Return the flow, selected by {@link switchToWorkflow}.
   */
  get flow(): Step[] {
    return this.currentFlow;
  }

  /**
   * Define a workflow (sequence of steps).
   * When the first flow is added, it is selected as current.
   *
   * @param flowId Unique flow id.
   * @param steps  Steps to include in the flow.
   * @throws Error In case of duplicate flowId.
   */
  addWorkflow(flowId: string, steps: Step[]): void {
    if (Object.prototype.hasOwnProperty.call(this.stepsByFlowId, flowId)) {
      throw new Error(`Duplicate workflow id: ${flowId}`);
    }

    this.stepsByFlowId[flowId] = steps;

    // Preselect the first added workflow.
    if (Object.keys(this.stepsByFlowId).length === 1) {
      this.switchToWorkflow(flowId);
    }
  }

  /**
   * Switches the current workflow.
   *
   * @throws Error
   *    If flow with the given id does not exist.
   */
  switchToWorkflow(newFlowId: string): void {
    const flowSteps = this.stepsByFlowId[newFlowId];
    if (!flowSteps) {
      throw new Error(`Flow with id=${newFlowId} does not exist!`);
    }
    this.currentFlow = flowSteps;
  }
}
