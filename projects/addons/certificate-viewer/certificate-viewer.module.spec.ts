/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { angleIcon, ClarityIcons } from '@clr/angular/icon';

import { AppfxCertificateViewerModule } from './certificate-viewer.module';

describe('AppfxCertificateViewerModule', () => {
  it('registers clarity icons on initialization', () => {
    spyOn(ClarityIcons, 'addIcons').and.returnValue();
    new AppfxCertificateViewerModule();
    expect(ClarityIcons.addIcons).toHaveBeenCalledOnceWith(angleIcon);
  });
});
