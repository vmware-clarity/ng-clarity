/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppfxTranslateModule } from '@clr/addons/translate';
import { ClrTreeViewModule } from '@clr/angular';

import { CertificateViewerDetailsComponent } from './certificate-viewer-details.component';
import { CertificateViewerTranslateFieldPipeMock } from '../certificate-viewer-translate-field/certificate-viewer-translate-field.pipe.mock';
import { CertificateChain } from '../models/certificate-chain.model';
import { CertificateField } from '../models/certificate-field.model';
import { Certificate } from '../models/certificate.model';

describe('CertificateViewerDetailsComponent', () => {
  let component: CertificateViewerDetailsComponent;
  let fixture: ComponentFixture<CertificateViewerDetailsComponent>;

  const leafCertificate = { rootField: 'leaf-certificate' } as unknown as Certificate;
  const certificateChain = {
    leafCertificate,
  } as unknown as CertificateChain;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppfxTranslateModule, ClrTreeViewModule, NoopAnimationsModule],
      declarations: [CertificateViewerDetailsComponent, CertificateViewerTranslateFieldPipeMock],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateViewerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnChanges() loads the leaf cert of a certificate chain as the current selected cert', () => {
    component.certificateChain = certificateChain;
    component.ngOnChanges({
      certificateChain: new SimpleChange(undefined, certificateChain, true),
    });

    expect(component.selectedCertificate).toEqual(certificateChain.leafCertificate);
  });

  it('#selectCertificateField should select the certificate field', () => {
    const field = new CertificateField('CN');
    component.selectCertificateField(field);
    expect(component.selectedCertificateField).toBe(field);
  });

  it('#isSelectedField should return correct results when the certificate field is selected', () => {
    const bgField = new CertificateField('BG');
    const cnField = new CertificateField('CN');
    component.selectedCertificateField = bgField;

    expect(component.isSelectedField(bgField)).toEqual(true);
    expect(component.isSelectedField(cnField)).toEqual(false);
    expect(component.isSelectedField(undefined)).toEqual(false);
  });

  it('#isSelected should return correct results when the certificate is selected', () => {
    component.selectedCertificate = leafCertificate;

    expect(component.isSelected(leafCertificate)).toEqual(true);
    expect(component.isSelected(undefined)).toEqual(false);
  });

  it('#getNextCertificate should return next certificate in chain', () => {
    const nextCertificate = {
      ...leafCertificate,
    } as Certificate;
    const mockCertificate = {
      nextCertificateInChain: jasmine.createSpy('nextCertificateInChain').and.returnValue(nextCertificate),
    } as unknown as CertificateChain;

    expect(component.getNextCertificate(undefined)).toEqual([]);

    component.certificateChain = mockCertificate;
    expect(component.getNextCertificate(nextCertificate)).toEqual([nextCertificate]);
  });

  it('#getFieldsChildren should return certificate field children if any', () => {
    const childField = new CertificateField('child');
    const field = new CertificateField('IT', [childField]);

    expect(component.getFieldsChildren(field)).toEqual([childField]);
    expect(component.getFieldsChildren(childField)).toEqual([]);
  });
});
