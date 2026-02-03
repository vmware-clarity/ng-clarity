/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { ZoomLevel } from './zoom-level.model';
import { ZoomLevelService } from './zoom-level.service';

// NOTE: These tests are known to fail with `--browsers Chrome` if the browser window is not
// focussed. With ChromeHeadless there is no issue. ZoomLevelService uses ResizeObserver
// which does not work.
//
// Possible root cause is this: https://github.com/angular/angular/issues/31695
describe('ZoomLevelService', () => {
  beforeEach(function (this: any) {
    TestBed.configureTestingModule({
      providers: [
        ZoomLevelService,
        {
          provide: DOCUMENT,
          useValue: document,
        },
      ],
    });

    this.zoomLevelService = TestBed.inject(ZoomLevelService);
  });

  describe('when initialized', () => {
    it('starts observing document body size changes.', function (this: any, done: DoneFn) {
      let zoomLevel: ZoomLevel;

      const subscription = this.zoomLevelService.onChange.subscribe((newZoomLevel: ZoomLevel) => {
        zoomLevel = newZoomLevel;

        expect(zoomLevel).toBeDefined();
        subscription.unsubscribe();
        done();
      });
    });
  });

  describe('when document body size is less than 576 px', () => {
    it('zoom level is `4x`', function (this: any, done: DoneFn) {
      let zoomLevel = ZoomLevel.none;

      const subscription = this.zoomLevelService.onChange.subscribe((newZoomLevel: ZoomLevel) => {
        zoomLevel = newZoomLevel;

        expect(zoomLevel).toEqual(ZoomLevel.x4);

        subscription.unsubscribe();
        done();
      });

      document.documentElement.style.width = '575px';
    });
  });

  describe('when document body size is greater than 575 px and less than 1200 px', () => {
    it('zoom level is `2x`', function (this: any, done: DoneFn) {
      let zoomLevel = ZoomLevel.none;

      const subscription = this.zoomLevelService.onChange.subscribe((newZoomLevel: ZoomLevel) => {
        zoomLevel = newZoomLevel;

        expect(zoomLevel).toEqual(ZoomLevel.x2);

        subscription.unsubscribe();
        done();
      });

      document.documentElement.style.width = '576px';
    });
  });

  describe('when document body size is greater than or equal to 1200 px', () => {
    it('zoom level is `none`', function (this: any, done: DoneFn) {
      let zoomLevel = ZoomLevel.x2;

      const subscription = this.zoomLevelService.onChange.subscribe((newZoomLevel: ZoomLevel) => {
        zoomLevel = newZoomLevel;

        expect(zoomLevel).toEqual(ZoomLevel.none);

        subscription.unsubscribe();
        done();
      });

      document.documentElement.style.width = '1200px';
    });
  });

  describe('#ngOnDestroy', () => {
    it('unobserves the document element for resize and completes the `onChange` observable', function (this: any) {
      let onChangeObservableCompleted = false;
      spyOn(this.zoomLevelService['observer'], 'unobserve');
      this.zoomLevelService.onChange.subscribe(
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

      this.zoomLevelService.ngOnDestroy();

      expect(this.zoomLevelService['observer'].unobserve).toHaveBeenCalledWith(document.documentElement);
      expect(onChangeObservableCompleted).toBeTruthy();
    });
  });
});
