/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrDatalist } from './datalist';
import { DatalistIdService } from './providers/datalist-id.service';
import { spec, TestContext } from '../../utils/testing/helpers.spec';

@Component({
  template: `
    <datalist [id]="testId">
      <option value="one">One</option>
      <option value="two">Two</option>
    </datalist>
  `,
  standalone: false,
})
export class TestDatalistId {
  testId;
}

@Component({
  template: `
    <datalist id="native-datalist">
      <option value="one">One</option>
      <option value="two">Two</option>
    </datalist>
  `,
  standalone: false,
})
export class TestNativeDatalist {}

type Context = TestContext<ClrDatalist, TestDatalistId>;

export default function (): void {
  describe('Clarity Datalist Element', function () {
    let datalistIdService: DatalistIdService;
    spec(ClrDatalist, TestDatalistId, undefined, {
      providers: [DatalistIdService],
    });

    beforeEach(function () {
      datalistIdService = this.getClarityProvider(DatalistIdService);
    });

    it('id attribute is generated if no id is provided', function (this: Context) {
      expect(datalistIdService.id).toEqual(this.clarityElement.id);
    });

    it('id attribute is used when provided on the element', function (this: Context) {
      this.hostComponent.testId = 'custom-id';
      this.detectChanges();
      expect(datalistIdService.id).toEqual(this.clarityElement.id);
      expect(this.clarityElement.id).toEqual('custom-id');
    });
  });

  describe('Native Datalist Element', function () {
    spec(ClrDatalist, TestNativeDatalist);

    it('handles native datalist element without any errors', function () {
      const nativeDatalist: HTMLElement = document.getElementById('native-datalist');
      expect(nativeDatalist).toBeTruthy();
    });
  });
}
