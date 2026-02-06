/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AlertIconAndTypesService } from './icon-and-types.service';
import { ClrCommonStringsService } from '../../../utils/i18n/common-strings.service';

export default function (): void {
  describe('Alert Icon and Types Service', function () {
    let testMe: AlertIconAndTypesService;

    function testShape(alertType: string): string {
      return testMe.iconInfoFromType(alertType).shape;
    }

    function testCssClass(alertType: string): string {
      return testMe.iconInfoFromType(alertType).cssClass;
    }

    function testTitle(alertType: string): string {
      return testMe.iconInfoFromType(alertType).title;
    }

    beforeEach(() => {
      testMe = new AlertIconAndTypesService(new ClrCommonStringsService());
    });

    afterEach(() => {
      testMe = null;
    });

    describe('alertType()', function () {
      it("alertType is 'info' by default", function () {
        expect(testMe.alertType).toBe('info');
      });

      it('can change alertType to another valid type', function () {
        expect(testMe.alertType).toBe('info');
        testMe.alertType = 'danger';
        expect(testMe.alertType).toBe('danger');
      });

      it('will not change alertType to an invalid type', function () {
        expect(testMe.alertType).toBe('info');
        testMe.alertType = 'ohai';
        expect(testMe.alertType).toBe('info');
        expect(testMe.alertType).not.toBe('ohai');
      });
    });

    describe('alertIconShape()', function () {
      it('returns shape based on alertType if not set', function () {
        expect(testMe.alertType).toBe('info');
        expect(testMe.alertIconShape).toBe('info-standard');
      });

      it('can change alertIconShape', function () {
        expect(testMe.alertIconShape).toBe('info-standard');
        testMe.alertIconShape = 'house';
        expect(testMe.alertIconShape).toBe('house');
      });

      it('will set to empty string and return based on alertType if set to junk', function () {
        expect(testMe.alertIconShape).toBe('info-standard');
        testMe.alertIconShape = null;
        expect(testMe.alertIconShape).toBe('info-standard');
      });
    });

    describe('alertIconTitle()', function () {
      it('returns title based on alertType', function () {
        testMe.alertType = 'warning';
        expect(testMe.alertType).toBe('warning');
        expect(testMe.alertIconTitle).toBe('Warning');
      });
    });

    describe('iconInfoFromType()', function () {
      it('returns default shape as fallthrough', function () {
        expect(testShape(null)).toBe('info-standard');
        expect(testShape('ohai')).toBe('info-standard');
      });

      it('returns .alert-info class as fallthrough', function () {
        expect(testCssClass(null)).toBe('alert-info');
        expect(testCssClass('ohai')).toBe('alert-info');
      });

      it('returns info title as fallthrough', function () {
        expect(testTitle(null)).toBe('Info');
        expect(testTitle('ohai')).toBe('Info');
      });

      it('returns warning icon', function () {
        expect(testShape('warning')).toBe('warning-standard');
      });

      it('returns .alert-warning', function () {
        expect(testCssClass('warning')).toBe('alert-warning');
      });

      it('returns warning title', function () {
        expect(testTitle('warning')).toBe('Warning');
      });

      it('returns danger icon', function () {
        expect(testShape('danger')).toBe('error-standard');
      });

      it('returns .alert-danger', function () {
        expect(testCssClass('danger')).toBe('alert-danger');
      });

      it('returns danger title', function () {
        expect(testTitle('danger')).toBe('Error');
      });

      it('returns success icon', function () {
        expect(testShape('success')).toBe('success-standard');
      });

      it('returns .alert-success', function () {
        expect(testCssClass('success')).toBe('alert-success');
      });

      it('returns success title', function () {
        expect(testTitle('success')).toBe('Success');
      });

      it('returns info icon', function () {
        expect(testShape('info')).toBe('info-standard');
      });

      it('returns .alert-info', function () {
        expect(testCssClass('info')).toBe('alert-info');
      });

      it('returns info title', function () {
        expect(testTitle('info')).toBe('Info');
      });
    });
  });
}
