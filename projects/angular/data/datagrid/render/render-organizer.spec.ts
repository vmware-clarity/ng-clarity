/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatagridRenderOrganizer } from './render-organizer';
import { DatagridRenderStep } from '../enums/render-step.enum';

/**
 * Having a little fun with Typescript just to see how it goes.
 */
interface UserContext {
  organizer: DatagridRenderOrganizer;
}

describe('Datagrid', () => {
  describe('Render', () => {
    describe('DatagridRenderOrganizer', () => {
      let testContext: UserContext;
      beforeEach(() => {
        testContext = {} as UserContext;
      });

      beforeEach(() => {
        testContext.organizer = new DatagridRenderOrganizer();
      });

      it("doesn't clear widths on the first rendering", () => {
        let clearedWidths = false;
        testContext.organizer.renderStep.subscribe(step => {
          if (step === DatagridRenderStep.CLEAR_WIDTHS) {
            clearedWidths = true;
          }
        });
        testContext.organizer.resize();
        expect(clearedWidths).toBe(false);
        testContext.organizer.resize();
        expect(clearedWidths).toBe(true);
      });

      it('follows the correct rendering order', () => {
        // Initial sizing to make sure clearWidths is included in the next one.
        testContext.organizer.resize();
        const stepsRecieved: DatagridRenderStep[] = [];
        testContext.organizer.renderStep.subscribe(renderStep => {
          stepsRecieved.push(renderStep);
        });
        testContext.organizer.resize();

        expect(stepsRecieved).toEqual([
          DatagridRenderStep.CALCULATE_MODE_ON,
          DatagridRenderStep.CLEAR_WIDTHS,
          DatagridRenderStep.COMPUTE_COLUMN_WIDTHS,
          DatagridRenderStep.ALIGN_COLUMNS,
          DatagridRenderStep.CALCULATE_MODE_OFF,
        ]);
      });

      it('provides a filtering utility that targets one step', () => {
        let currentStep: DatagridRenderStep = null;
        testContext.organizer
          .filterRenderSteps(DatagridRenderStep.ALIGN_COLUMNS)
          .subscribe(step => (currentStep = step));
        expect(currentStep).toBeNull();
        testContext.organizer.resize();
        expect(currentStep).toBe(DatagridRenderStep.ALIGN_COLUMNS);
      });
    });
  });
});
