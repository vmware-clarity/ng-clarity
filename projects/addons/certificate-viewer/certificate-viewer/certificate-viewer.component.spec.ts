/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Input, signal, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppfxTranslateModule } from '@clr/addons/translate';
import { ClrAlertModule, ClrSpinnerModule, ClrTabsModule } from '@clr/angular';
import { renderFixture } from '@clr/angular/utils/testing';

import { CertificateViewerComponent } from './certificate-viewer.component';
import { CertificateChain } from '../models/certificate-chain.model';
import { Certificate } from '../models/certificate.model';
import { TopHeadingLevel } from '../models/heading-level.model';

@Component({
  selector: 'appfx-certificate-viewer-general',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
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
      imports: [AppfxTranslateModule, ClrTabsModule, ClrSpinnerModule],
      declarations: [CertificateViewerComponent, CertificateViewerGeneralMockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateViewerComponent);
    component = fixture.componentInstance;
    renderFixture(fixture);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not update the parsed certificate if the PEM is invalid.', async () => {
    fixture.componentRef.setInput('pemEncodedCertificatesChain', ['foo']);
    await fixture.whenStable();
    const promise = (
      component as unknown as {
        certificateChainPromise: Promise<CertificateChain>;
      }
    ).certificateChainPromise;
    let errorCaught = false;
    try {
      await promise;
    } catch (err) {
      expect(err).toEqual(new Error("Object's schema was not verified against input data for Certificate"));
      errorCaught = true;
    }
    expect(errorCaught).toBe(true);
  });

  it('should update the parsed certificate chain', async () => {
    fixture.componentRef.setInput('pemEncodedCertificatesChain', ['boo']);
    const certificateChainResult = {
      poo: 'certificateChainResult',
    } as unknown as CertificateChain;
    vi.spyOn(CertificateChain, 'fromPemEncodedCertificatesChain').mockReturnValue(
      Promise.resolve(certificateChainResult)
    );

    await fixture.whenStable();

    await (
      component as unknown as {
        certificateChainPromise: Promise<CertificateChain>;
      }
    ).certificateChainPromise;

    expect(component.certificateChain).toEqual(certificateChainResult);
  });
});

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<appfx-certificate-viewer [pemEncodedCertificatesChain]="chain()"></appfx-certificate-viewer>',
})
class OnPushHostComponent {
  readonly chain = signal(['first']);
}

describe('CertificateViewerComponent in an OnPush host', () => {
  let fixture: ComponentFixture<OnPushHostComponent>;
  let parse: ReturnType<typeof vi.spyOn>;

  function chainOf(commonName: string): CertificateChain {
    return { leafCertificate: { subject: { commonName } } } as unknown as CertificateChain;
  }

  function title(): string {
    return fixture.nativeElement.querySelector('.certificate-viewer-title')?.textContent ?? '';
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppfxTranslateModule, ClrAlertModule, ClrTabsModule, ClrSpinnerModule],
      declarations: [CertificateViewerComponent, CertificateViewerGeneralMockComponent, OnPushHostComponent],
    });
    parse = vi.spyOn(CertificateChain, 'fromPemEncodedCertificatesChain');
  });

  afterEach(() => fixture.destroy());

  async function render(result: Promise<CertificateChain>) {
    parse.mockReturnValueOnce(result);
    fixture = TestBed.createComponent(OnPushHostComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
  }

  it('renders the chain once it is parsed', async () => {
    let resolve!: (chain: CertificateChain) => void;
    await render(new Promise(done => (resolve = done)));
    expect(fixture.nativeElement.querySelector('clr-spinner')).not.toBeNull();

    resolve(chainOf('first.example.com'));

    await vi.waitFor(() => expect(title()).toContain('first.example.com'));
    expect(fixture.nativeElement.querySelector('clr-spinner')).toBeNull();
  });

  it('renders a parse error', async () => {
    await render(Promise.reject(new Error('Invalid PEM')));

    await vi.waitFor(() => expect(fixture.nativeElement.querySelector('.alert-text')?.textContent).toBe('Invalid PEM'));
  });

  it('renders a new chain given after the first one', async () => {
    await render(Promise.resolve(chainOf('first.example.com')));
    await vi.waitFor(() => expect(title()).toContain('first.example.com'));

    parse.mockReturnValueOnce(Promise.resolve(chainOf('second.example.com')));
    fixture.componentInstance.chain.set(['second']);

    await vi.waitFor(() => expect(title()).toContain('second.example.com'));
  });
});
