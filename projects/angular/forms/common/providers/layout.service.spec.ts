/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrFormLayout, LayoutService } from './layout.service';

describe('Forms common utilities', () => {
  describe('LayoutService', function () {
    let service;

    beforeEach(() => {
      service = new LayoutService();
    });

    it('sets layout to horizontal by default', function () {
      expect(service.layout).toEqual(ClrFormLayout.HORIZONTAL);
    });

    it('handles checking isVertical based on current layout', function () {
      expect(service.isVertical()).toBe(false);
      service.layout = ClrFormLayout.VERTICAL;
      expect(service.isVertical()).toBe(true);
      service.layout = ClrFormLayout.COMPACT;
      expect(service.isVertical()).toBe(false);
    });

    it('handles checking isCompact based on current layout', function () {
      expect(service.isCompact()).toBe(false);
      service.layout = ClrFormLayout.VERTICAL;
      expect(service.isCompact()).toBe(false);
      service.layout = ClrFormLayout.COMPACT;
      expect(service.isCompact()).toBe(true);
    });

    it('handles checking isHorizontal based on current layout', function () {
      expect(service.isHorizontal()).toBe(true);
      service.layout = ClrFormLayout.VERTICAL;
      expect(service.isHorizontal()).toBe(false);
      service.layout = ClrFormLayout.COMPACT;
      expect(service.isHorizontal()).toBe(false);
    });

    it('provides the class name', function () {
      expect(service.layoutClass).toEqual('clr-form-horizontal');
      service.layout = ClrFormLayout.VERTICAL;
      expect(service.layoutClass).toEqual('clr-form-vertical');
    });

    it('can validate layouts by string value', () => {
      expect(service.isValid('vertical')).toBe(true);
      expect(service.isValid('horizontal')).toBe(true);
      expect(service.isValid('compact')).toBe(true);
      expect(service.isValid('asdf')).toBe(false);
    });
  });
});
