/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormControl, FormControlDirective, NgControl, Validators } from '@angular/forms';

import { NgControlService } from './ng-control.service';

describe('Forms common utilities', () => {
  describe('NgControlService', function () {
    let service: NgControlService;
    let testControl: FormControl;

    beforeEach(() => {
      testControl = new FormControl(true);
      service = new NgControlService();
    });

    it('provides observable for control changes, passing the control', () => {
      const cb = vi.fn();
      const sub = service.controlsChanges.subscribe(controls => cb(controls[0]));
      expect(cb).not.toHaveBeenCalled();
      service.addControl(testControl as unknown as NgControl);
      expect(cb).toHaveBeenCalledWith(testControl);
      sub.unsubscribe();
    });

    describe('states', () => {
      function ngControlFor(control: FormControl): NgControl {
        const directive = new FormControlDirective([], [], [], null, null);
        directive.form = control;
        return directive;
      }

      it('has one state per control and follows control events', () => {
        const first = new FormControl('', Validators.required);
        const second = new FormControl('value');
        service.addControl(ngControlFor(first));
        service.addControl(ngControlFor(second));

        expect(service.states().map(state => state.status)).toEqual(['INVALID', 'VALID']);

        first.setValue('filled');
        second.disable();
        first.markAsTouched();

        expect(service.states()).toEqual([
          expect.objectContaining({ value: 'filled', status: 'VALID', touched: true, disabled: false }),
          expect.objectContaining({ status: 'DISABLED', disabled: true, touched: false }),
        ]);
      });

      it('follows the new control after emitControlsChange', () => {
        const ngControl = ngControlFor(new FormControl('old'));
        service.addControl(ngControl);
        const previous = ngControl.control;

        (ngControl as FormControlDirective).form = new FormControl('new');
        service.emitControlsChange(service.controls);
        previous.setValue('ignored');

        expect(service.states()[0].value).toBe('new');
      });

      it('stops following controls when destroyed', () => {
        const control = new FormControl('value');
        service.addControl(ngControlFor(control));

        service.ngOnDestroy();
        control.setValue('changed');

        expect(service.states()[0].value).toBe('value');
      });
    });
  });
});
