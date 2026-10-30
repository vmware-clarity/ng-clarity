/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable, Subscription } from 'rxjs';

import { MockDisplayModeService } from './display-mode.mock';
import { DatagridDisplayMode } from '../enums/display-mode.enum';
import { DatagridRenderStep } from '../enums/render-step.enum';
import { MockDatagridRenderOrganizer } from '../render/render-organizer.mock';

interface UserContext {
  organizer: MockDatagridRenderOrganizer;
  displayService: MockDisplayModeService;
  displayViewServiceSubscription: Subscription;
}

describe('Datagrid', () => {
  describe('Providers', () => {
    describe('DisplayMode Service', () => {
      let testContext: UserContext;
      beforeEach(() => {
        testContext = {} as UserContext;
      });

      beforeEach(() => {
        testContext.organizer = new MockDatagridRenderOrganizer();
        testContext.displayService = new MockDisplayModeService(testContext.organizer);
      });

      afterEach(() => {
        if (testContext.displayViewServiceSubscription) {
          testContext.displayViewServiceSubscription.unsubscribe();
        }
      });

      it('exposes an Observable for display mode view state', () => {
        const untypedContext: any = testContext;

        const viewObservable = untypedContext.displayService.view;
        expect(viewObservable).toBeDefined();
        expect(viewObservable instanceof Observable).toBe(true);
      });

      it('properly updates the view mode when organizer resizes', () => {
        let currentChange: DatagridDisplayMode;
        let displayChangeCount = 0;
        testContext.displayViewServiceSubscription = testContext.displayService.view.subscribe(viewChange => {
          displayChangeCount++;
          currentChange = viewChange;
        });
        expect(currentChange).toBe(DatagridDisplayMode.DISPLAY);
        testContext.organizer.resize();
        expect(currentChange).toBe(DatagridDisplayMode.DISPLAY);
        expect(displayChangeCount).toBe(3); // +1 b/c of the behavior subject.
      });

      it('it defaults to DatagridDisplayMode.DISPLAY', () => {
        const untypedContext: any = testContext;

        const viewObservable = untypedContext.displayService.view;
        let currentView = null;
        untypedContext.displayViewServiceSubscription = viewObservable.subscribe(viewChange => {
          currentView = viewChange;
        });
        expect(currentView).toBe(DatagridDisplayMode.DISPLAY);
      });

      it('updates the view for DatagridDisplayMode.DISPLAY', () => {
        const untypedContext: any = testContext;

        const viewObservable = untypedContext.displayService.view;
        let currentView = null;
        untypedContext.displayViewServiceSubscription = viewObservable.subscribe(viewChange => {
          currentView = viewChange;
        });
        untypedContext.organizer.updateRenderStep.next(DatagridRenderStep.CALCULATE_MODE_OFF);
        expect(currentView).toBe(DatagridDisplayMode.DISPLAY);
      });

      it('updates the view for DatagridDisplayMode.CALCULATE', () => {
        const untypedContext: any = testContext;

        const viewObservable = untypedContext.displayService.view;
        let currentView = null;
        untypedContext.displayViewServiceSubscription = viewObservable.subscribe(viewChange => {
          currentView = viewChange;
        });
        untypedContext.organizer.updateRenderStep.next(DatagridRenderStep.CALCULATE_MODE_ON);
        expect(currentView).toBe(DatagridDisplayMode.CALCULATE);
      });
    });
  });
});
