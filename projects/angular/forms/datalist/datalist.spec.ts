/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { spec, TestContext } from '@clr/angular/testing';

import { ClrDatalist } from './datalist';
import { DatalistIdService } from './providers/datalist-id.service';

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

describe('ClrDatalist', () => {
  describe('Clarity Datalist Element', () => {
    let testContext: Context;

    let datalistIdService: DatalistIdService;
    const getContext = spec(ClrDatalist, TestDatalistId, undefined, {
      providers: [DatalistIdService],
    });
    beforeEach(() => {
      testContext = getContext() as Context;
    });

    beforeEach(() => {
      const untypedContext: any = testContext;

      datalistIdService = untypedContext.getClarityProvider(DatalistIdService);
    });

    it('id attribute is generated if no id is provided', () => {
      expect(datalistIdService.id).toEqual(testContext.clarityElement.id);
    });

    it('id attribute is used when provided on the element', () => {
      testContext.testComponent.testId = 'custom-id';
      testContext.detectChanges();
      expect(datalistIdService.id).toEqual(testContext.clarityElement.id);
      expect(testContext.clarityElement.id).toEqual('custom-id');
    });
  });

  describe('Native Datalist Element', () => {
    spec(ClrDatalist, TestNativeDatalist);

    it('handles native datalist element without any errors', () => {
      const nativeDatalist: HTMLElement = document.getElementById('native-datalist');
      expect(nativeDatalist).toBeTruthy();
    });
  });
});
