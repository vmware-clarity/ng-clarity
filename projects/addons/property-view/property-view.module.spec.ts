/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { angleIcon, ClarityIcons } from '@clr/angular/icon';

import { AppfxPropertyViewModule, pvStringsServiceFactory } from './property-view.module';
import { PropertyViewStrings } from './property-view-strings.service';

describe('#pvStringsServiceFactory()', () => {
  it('returns the existing service', () => {
    const strings = new PropertyViewStrings();
    expect(pvStringsServiceFactory(strings)).toBe(strings);
    expect(pvStringsServiceFactory(undefined as any)).not.toBe(strings);
  });
});

describe('AppfxPropertyViewModule', () => {
  it('registers clarity icons on initialization', () => {
    spyOn(ClarityIcons, 'addIcons').and.returnValue();
    new AppfxPropertyViewModule();
    expect(ClarityIcons.addIcons).toHaveBeenCalledOnceWith(angleIcon);
  });
});
