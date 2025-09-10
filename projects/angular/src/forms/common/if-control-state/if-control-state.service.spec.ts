/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormControl } from '@angular/forms';
import { delay } from 'projects/angular/src/utils/testing/helpers.spec';
import { EMPTY } from 'rxjs';

import { CONTROL_STATE, IfControlStateService } from './if-control-state.service';
import { NgControlService } from '../providers/ng-control.service';

export default function (): void {
  describe('IfControlStateService', function () {
    let service, ngControlService, testControl;

    beforeEach(() => {
      testControl = new FormControl();
      ngControlService = new NgControlService();
      service = new IfControlStateService(ngControlService);
    });

    it('should not throw error when triggerStatusChange is called and control is not set yet', () => {
      expect(() => service.triggerStatusChange()).not.toThrowError();
    });

    it('provides observable for statusChanges, return valid when touched and no rules added', async () => {
      const cb = jasmine.createSpy('cb');
      const sub = service.statusChanges.subscribe((control: CONTROL_STATE) => cb(control));
      ngControlService.setControl(testControl);
      // Change the state of the input to trigger statusChange
      testControl.markAsTouched();
      testControl.updateValueAndValidity();
      await delay();
      expect(cb).toHaveBeenCalledWith(CONTROL_STATE.VALID);
      sub.unsubscribe();
    });

    it('should allow a manual trigger of status observable, return NONE', () => {
      const cb = jasmine.createSpy('cb');
      const sub = service.statusChanges.subscribe((control: CONTROL_STATE) => cb(control));
      ngControlService.setControl(testControl);
      // Manually trigger status check
      service.triggerStatusChange();
      expect(cb).toHaveBeenCalledWith(CONTROL_STATE.NONE);
      sub.unsubscribe();
    });

    it('should return state TOUCHED', () => {
      const cb = jasmine.createSpy('cb');
      const sub = service.statusChanges.subscribe((control: CONTROL_STATE) => cb(control));
      const fakeControl = {
        statusChanges: EMPTY,
        /* Disabled is not implemented yet so we could use it to test uncovered case */
        status: 'DISABLED',
        touched: true,
      };
      ngControlService.setControl(fakeControl);
      service.triggerStatusChange();
      expect(cb).toHaveBeenCalledWith(CONTROL_STATE.NONE);
      sub.unsubscribe();
    });

    it('should return state NONE', () => {
      const cb = jasmine.createSpy('cb');
      const sub = service.statusChanges.subscribe((control: CONTROL_STATE) => cb(control));
      const fakeControl = {
        statusChanges: EMPTY,
        status: 'INVALID',
        touched: false,
      };
      ngControlService.setControl(fakeControl);
      service.triggerStatusChange();
      expect(cb).toHaveBeenCalledWith(CONTROL_STATE.NONE);
      sub.unsubscribe();
    });

    it('should return state INVALID', async () => {
      const cb = jasmine.createSpy('cb');
      const sub = service.statusChanges.subscribe((control: CONTROL_STATE) => cb(control));
      const fakeControl = {
        statusChanges: EMPTY,
        status: 'INVALID',
        touched: true,
      };
      ngControlService.setControl(fakeControl);
      service.triggerStatusChange();
      await delay();
      expect(cb).toHaveBeenCalledWith(CONTROL_STATE.INVALID);
      sub.unsubscribe();
    });

    it('should return state VALID', async () => {
      const cb = jasmine.createSpy('cb');
      const sub = service.statusChanges.subscribe((control: CONTROL_STATE) => cb(control));
      const fakeControl = {
        statusChanges: EMPTY,
        status: 'VALID',
        touched: true,
      };
      ngControlService.setControl(fakeControl);
      service.triggerStatusChange();
      await delay();
      expect(cb).toHaveBeenCalledWith(CONTROL_STATE.VALID);
      sub.unsubscribe();
    });
  });
}
