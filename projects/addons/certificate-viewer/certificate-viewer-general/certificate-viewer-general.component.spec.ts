/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppfxTranslateModule } from '@clr/addons/translate';

import { CertificateViewerGeneralComponent } from './certificate-viewer-general.component';
import { CertificateViewerTranslateFieldPipeMock } from '../certificate-viewer-translate-field/certificate-viewer-translate-field.pipe.mock';

describe('CertificateViewerGeneralComponent', () => {
  let component: CertificateViewerGeneralComponent;
  let fixture: ComponentFixture<CertificateViewerGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppfxTranslateModule],
      declarations: [CertificateViewerGeneralComponent, CertificateViewerTranslateFieldPipeMock],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateViewerGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
