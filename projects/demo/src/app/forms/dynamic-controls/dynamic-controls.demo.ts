/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, inject } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'dynamic-controls-demo',
  templateUrl: './dynamic-controls.demo.html',
})
export class DynamicControlsDemo {
  // radio control
  readonly certValidation = new FormControl<string | null>(null, Validators.required);

  fb = inject(UntypedFormBuilder);

  form: UntypedFormGroup = this.fb.group({
    platform: new FormControl<string | null>(null, [Validators.required]),
  });

  ngOnInit() {
    this.registerPlatformChange();

    this.registerCertValidateChange();
  }

  private registerPlatformChange() {
    this.form.controls.platform.valueChanges.subscribe(value => {
      this.form.removeControl('s3');
      this.form.removeControl('iam');
      this.form.removeControl('console');

      switch (value) {
        case 'CLOUDIAN':
          this.addControlsForCloudian();
          break;
        case 'ECS':
          this.addControlsForECS();
          break;
        default:
          break;
      }

      this.setCertValidationValue();
    });
  }

  private addControlsForCloudian() {
    this.addS3Control('cloudian signature');
    this.addIAMControl();
  }

  private addControlsForECS() {
    this.addS3Control();
    this.addConsoleControl();
  }

  private addS3Control(signature?: string) {
    this.form.addControl(
      's3',
      this.fb.group({
        url: this.fb.control('', [Validators.required]),
        tlsSignature: this.fb.control(
          {
            value: signature,
            disabled: true,
          },
          Validators.required
        ),
      })
    );
  }

  private addIAMControl() {
    this.form.addControl(
      'iam',
      this.fb.group({
        url: this.fb.control('', [Validators.required]),
        tlsSignature: this.fb.control(
          {
            value: '',
            disabled: true,
          },
          Validators.required
        ),
      })
    );
  }

  private addConsoleControl() {
    this.form.addControl(
      'console',
      this.fb.group({
        url: ['', [Validators.required]],
        secretKey: ['', [Validators.required]],
      })
    );
  }

  // set radio based on form value
  private setCertValidationValue() {
    const signatureControl = this.form.controls['s3'].get('tlsSignature') as FormControl;

    const value = signatureControl.value ? 'tlsSignature' : 'publicSigned';

    this.certValidation.setValue(value);
  }

  private registerCertValidateChange() {
    this.certValidation.valueChanges.subscribe(value => {
      const tlsSignature = this.form.controls['s3'].get('tlsSignature') as FormControl;

      if (value === 'tlsSignature') {
        tlsSignature.enable({ emitEvent: false });
      } else {
        // public signed
        tlsSignature.disable({ emitEvent: false });
      }

      setTimeout(() => {
        if (tlsSignature.value) {
          tlsSignature.markAsTouched();
          tlsSignature.updateValueAndValidity();
        }
      });
    });
  }
}
