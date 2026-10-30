/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { ZoomLevel } from './zoom-level.model';
import { ZoomLevelService } from './zoom-level.service';

// NOTE: These tests are known to fail with `--browsers Chrome` if the browser window is not
// focussed. With ChromeHeadless there is no issue. ZoomLevelService uses ResizeObserver
// which does not work.
//
// Possible root cause is this: https://github.com/angular/angular/issues/31695
describe('ZoomLevelService', () => {
  let testContext: any;
  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ZoomLevelService,
        {
          provide: DOCUMENT,
          useValue: document,
        },
      ],
    });

    testContext.zoomLevelService = TestBed.inject(ZoomLevelService);
  });

  afterEach(() => {
    document.documentElement.style.width = '';
  });

  describe('when initialized', () => {
    it('starts observing document body size changes.', async () => {
      const nextZoomLevel = firstValueFrom(testContext.zoomLevelService.onChange);
      expect(await nextZoomLevel).toBeDefined();
    });
  });

  describe('when document body size is less than 576 px', () => {
    it('zoom level is `4x`', async () => {
      const nextZoomLevel = firstValueFrom(testContext.zoomLevelService.onChange);
      document.documentElement.style.width = '575px';
      expect(await nextZoomLevel).toEqual(ZoomLevel.x4);
    });
  });

  describe('when document body size is greater than 575 px and less than 1200 px', () => {
    it.each([576, 1199])('zoom level is `2x` at %i px', async width => {
      const nextZoomLevel = firstValueFrom(testContext.zoomLevelService.onChange);
      document.documentElement.style.width = `${width}px`;
      expect(await nextZoomLevel).toEqual(ZoomLevel.x2);
    });
  });

  describe('when document body size is greater than or equal to 1200 px', () => {
    it('zoom level is `none`', async () => {
      const nextZoomLevel = firstValueFrom(testContext.zoomLevelService.onChange);
      document.documentElement.style.width = '1200px';
      expect(await nextZoomLevel).toEqual(ZoomLevel.none);
    });
  });

  describe('#ngOnDestroy', () => {
    it('unobserves the document element for resize and completes the `onChange` observable', () => {
      let onChangeObservableCompleted = false;
      vi.spyOn(testContext.zoomLevelService['observer'], 'unobserve').mockImplementation(() => undefined);
      testContext.zoomLevelService.onChange.subscribe(
        () => {
          // no action
        },
        () => {
          // no action
        },
        () => {
          onChangeObservableCompleted = true;
        }
      );

      testContext.zoomLevelService.ngOnDestroy();

      expect(testContext.zoomLevelService['observer'].unobserve).toHaveBeenCalledWith(document.documentElement);
      expect(onChangeObservableCompleted).toBeTruthy();
    });
  });
});
