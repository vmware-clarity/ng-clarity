/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CONTROL_STATE } from '../if-control-state/if-control-state.service';
import { ControlClassService } from './control-class.service';
import { LayoutService } from './layout.service';

export default function (): void {
  describe('ControlClassService', function () {
    let controlClassService: ControlClassService;
    let layoutService: LayoutService;

    beforeEach(() => {
      layoutService = new LayoutService();
      controlClassService = new ControlClassService(layoutService);
    });

    it('should return no classes when no grid or invalid', function () {
      expect(controlClassService.controlClass()).toBe('');
    });

    it('should return clr-error when invalid', function () {
      expect(controlClassService.controlClass(CONTROL_STATE.INVALID)).toBe('clr-error');
    });

    it('should return clr-success when valid', function () {
      expect(controlClassService.controlClass(CONTROL_STATE.VALID)).toBe('clr-success');
    });

    it('should return grid classes when using grid', function () {
      expect(controlClassService.controlClass(CONTROL_STATE.NONE, true)).toBe('clr-col-md-10 clr-col-12');
    });

    it('should return error and grid classes when invalid and using grid', function () {
      expect(controlClassService.controlClass(CONTROL_STATE.INVALID, true)).toBe('clr-error clr-col-md-10 clr-col-12');
    });

    it('should not add grid classes if already present ', function () {
      controlClassService.className = 'clr-col-md-3 clr-col-12';
      expect(controlClassService.controlClass(CONTROL_STATE.NONE, true)).toBe('clr-col-md-3 clr-col-12');
    });

    it('should init the control class', function () {
      const renderer = {
        removeClass: jasmine.createSpy(),
      };
      const element = document.createElement('input');
      element.className = 'test-class';
      controlClassService.initControlClass(renderer as any, element);
      expect(controlClassService.className).toEqual('test-class');
      expect(renderer.removeClass).not.toHaveBeenCalled();
      element.className = 'clr-col-4 test-class';
      controlClassService.initControlClass(renderer as any, element);
      expect(controlClassService.className).toEqual('clr-col-4 test-class');
      expect(renderer.removeClass).toHaveBeenCalledWith(element, 'clr-col-4');
    });

    it('should return any classes provided by default', function () {
      controlClassService.className = 'test-class';
      expect(controlClassService.controlClass(CONTROL_STATE.NONE, false)).toContain('test-class');
    });

    it('should return any additional classes passed by the control', function () {
      controlClassService.className = 'test-class';
      layoutService.labelSize = 2;
      expect(controlClassService.controlClass(CONTROL_STATE.NONE, false, 'extra-class')).toBe('test-class extra-class');
    });

    it('should return appropiate col size classes for grid layouts', function () {
      controlClassService.className = 'test-class';
      layoutService.labelSize = 3;
      expect(controlClassService.controlClass(CONTROL_STATE.NONE, true, 'extra-class')).toBe(
        'test-class extra-class clr-col-md-9 clr-col-12'
      );
    });
  });
}
