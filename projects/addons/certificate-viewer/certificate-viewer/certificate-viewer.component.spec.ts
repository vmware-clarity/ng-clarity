/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, SimpleChange, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppfxTranslateModule } from '@clr/addons/translate';
import { ClrTabsModule } from '@clr/angular';

import { CertificateViewerComponent } from './certificate-viewer.component';
import { CertificateChain } from '../models/certificate-chain.model';
import { Certificate } from '../models/certificate.model';
import { TopHeadingLevel } from '../models/heading-level.model';

@Component({
  selector: 'appfx-certificate-viewer-general',
  standalone: false,
  template: ``,
})
export class CertificateViewerGeneralMockComponent {
  @Input() certificate: Certificate;
  @Input() topHeadingLevel: TopHeadingLevel;
  @Input() headingTemplate: TemplateRef<unknown>;
}

describe('CertificateViewerComponent', () => {
  let component: CertificateViewerComponent;
  let fixture: ComponentFixture<CertificateViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppfxTranslateModule, ClrTabsModule],
      declarations: [CertificateViewerComponent, CertificateViewerGeneralMockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not update the parsed certificate if the PEM is invalid.', async () => {
    component.pemEncodedCertificatesChain = ['foo'];
    component.ngOnChanges({
      pemEncodedCertificatesChain: new SimpleChange(undefined, ['foo'], true),
      KnownOids: new SimpleChange(undefined, undefined, true),
      certificateChain: new SimpleChange(undefined, undefined, true),
      loading: new SimpleChange(undefined, undefined, true),
      ngOnChanges: new SimpleChange(undefined, undefined, true),
    });
    const promise = (component as unknown as { certificateChainPromise: Promise<CertificateChain> })
      .certificateChainPromise;
    let errorCaught = false;
    try {
      await promise;
    } catch (err) {
      expect(err).toEqual(new Error("Object's schema was not verified against input data for Certificate"));
      errorCaught = true;
    }
    expect(errorCaught).toBeTrue();
  });

  it('should update the parsed certificate chain', async () => {
    component.pemEncodedCertificatesChain = ['boo'];
    const certificateChainResult = {
      poo: 'certificateChainResult',
    } as unknown as CertificateChain;
    spyOn(CertificateChain, 'fromPemEncodedCertificatesChain').and.returnValue(Promise.resolve(certificateChainResult));

    component.ngOnChanges({
      pemEncodedCertificatesChain: new SimpleChange(['foo'], component.pemEncodedCertificatesChain, false),
      KnownOids: new SimpleChange(undefined, undefined, true),
      certificateChain: new SimpleChange(undefined, undefined, true),
      loading: new SimpleChange(undefined, undefined, true),
      ngOnChanges: new SimpleChange(undefined, undefined, true),
    });

    await (component as unknown as { certificateChainPromise: Promise<CertificateChain> }).certificateChainPromise;

    expect(component.certificateChain).toEqual(certificateChainResult);
  });
});
