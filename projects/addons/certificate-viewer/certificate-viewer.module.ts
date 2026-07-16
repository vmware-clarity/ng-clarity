/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppfxTranslateModule } from '@clr/addons/translate';
import {
  angleIcon,
  ClarityIcons,
  ClrAlertModule,
  ClrSpinnerModule,
  ClrTabsModule,
  ClrTreeViewModule,
} from '@clr/angular';

import { CertificateViewerComponent } from './certificate-viewer/certificate-viewer.component';
import { CertificateViewerDetailsComponent } from './certificate-viewer-details/certificate-viewer-details.component';
import { CertificateViewerGeneralComponent } from './certificate-viewer-general/certificate-viewer-general.component';
import { CertificateViewerTranslateFieldPipe } from './certificate-viewer-translate-field/certificate-viewer-translate-field.pipe';

@NgModule({
  imports: [
    AppfxTranslateModule,
    ClrAlertModule,
    ClrSpinnerModule,
    ClrTabsModule,
    ClrTreeViewModule,
    CommonModule,
    RouterModule,
  ],
  declarations: [
    CertificateViewerComponent,
    CertificateViewerDetailsComponent,
    CertificateViewerGeneralComponent,
    CertificateViewerTranslateFieldPipe,
  ],
  exports: [CertificateViewerComponent],
})
export class AppfxCertificateViewerModule {
  constructor() {
    ClarityIcons.addIcons(angleIcon);
  }
}
