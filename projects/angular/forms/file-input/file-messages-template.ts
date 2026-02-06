/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { inject, TemplateRef } from '@angular/core';
import { Directive } from '@angular/core';

import { ClrFileAcceptError, ClrFileMaxFileSizeError, ClrFileMinFileSizeError } from './file-input-validator-errors';

export interface ClrSingleFileValidationErrors {
  accept?: ClrFileAcceptError;
  minFileSize?: ClrFileMinFileSizeError;
  maxFileSize?: ClrFileMaxFileSizeError;
}

export interface ClrFileMessagesTemplateContext {
  $implicit: File;
  success: boolean;
  errors: ClrSingleFileValidationErrors;
}

@Directive({
  selector: 'ng-template[clr-file-messages]',
  standalone: false,
})
export class ClrFileMessagesTemplate {
  readonly templateRef: TemplateRef<ClrFileMessagesTemplateContext> = inject(TemplateRef);

  static ngTemplateContextGuard(
    directive: ClrFileMessagesTemplate,
    context: unknown
  ): context is ClrFileMessagesTemplateContext {
    return true;
  }
}
