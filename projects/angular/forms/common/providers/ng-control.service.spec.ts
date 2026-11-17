/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormControl } from '@angular/forms';

import { NgControlService } from './ng-control.service';

describe('Forms common utilities', () => {
  describe('NgControlService', function () {
    let service, testControl;

    beforeEach(() => {
      testControl = new FormControl(true);
      service = new NgControlService();
    });

    it('provides observable for control changes, passing the control', () => {
      const cb = vi.fn();
      const sub = service.controlsChanges.subscribe(controls => cb(controls[0]));
      expect(cb).not.toHaveBeenCalled();
      service.addControl(testControl);
      expect(cb).toHaveBeenCalledWith(testControl);
      sub.unsubscribe();
    });
  });
});
