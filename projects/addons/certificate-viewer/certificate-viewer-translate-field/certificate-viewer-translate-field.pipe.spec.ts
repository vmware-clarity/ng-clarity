/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';
import { AppfxTranslateModule } from '@clr/addons/translate';

import { CertificateViewerTranslateFieldPipe } from './certificate-viewer-translate-field.pipe';
import { CertificateField } from '../models/certificate-field.model';

describe('CertificateViewerTranslateFieldPipe', () => {
  let pipe: CertificateViewerTranslateFieldPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppfxTranslateModule],
      providers: [CertificateViewerTranslateFieldPipe],
    });

    pipe = TestBed.inject(CertificateViewerTranslateFieldPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms an undefined field to an empty string', () => {
    expect(pipe.transform(undefined, 'name')).toBe('');
    expect(pipe.transform(undefined, 'value')).toBe('');
  });

  it('should return an empty string for null field', () => {
    expect(pipe.transform(null as unknown as CertificateField, 'name')).toEqual('');
    expect(pipe.transform(undefined, 'name')).toEqual('');
  });

  it('should throw an error for an invalid property', () => {
    expect(() => {
      pipe.transform(new CertificateField('foo'), 'invalidProperty' as unknown as 'name' | 'value');
    }).toThrowError('Invalid certificate field property');
  });

  it('should translate the field name', () => {
    const certificateField = new CertificateField('boo');
    spyOn(certificateField, 'translateName').and.returnValue('Translated Name');
    const result = pipe.transform(certificateField, 'name');
    expect(result).toEqual('Translated Name');
  });

  it('should translate the field value with date', () => {
    const certificateField = new CertificateField('roo');
    spyOn(certificateField, 'translateValue').and.returnValue('Translated Value');

    const result = pipe.transform(certificateField, 'value');
    expect(result).toEqual('Translated Value');
  });
});
