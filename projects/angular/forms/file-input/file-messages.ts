/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, inject, InjectionToken } from '@angular/core';

import { ClrFileMessagesTemplateContext } from './file-messages-template';

export const CLR_FILE_MESSAGES_TEMPLATE_CONTEXT = new InjectionToken<ClrFileMessagesTemplateContext>(
  'ClrFileMessagesTemplateContext'
);

@Component({
  selector: 'clr-file-info',
  template: `
    <span class="clr-subtext">
      <ng-content></ng-content>
    </span>
  `,
  host: {
    '[class.clr-subtext-wrapper]': 'true',
  },
  standalone: false,
})
export class ClrFileInfo {}

@Component({
  selector: 'clr-file-success',
  // We check for success here so that consumers don't have to.
  template: `
    @if (context.success) {
      <cds-icon class="clr-validate-icon" shape="success-standard" status="success" aria-hidden="true"></cds-icon>
      <span class="clr-subtext success">
        <ng-content></ng-content>
      </span>
    }
  `,
  host: {
    '[style.display]': 'context.success ? "flex" : "none"',
    '[class.clr-subtext-wrapper]': 'true',
  },
  standalone: false,
})
export class ClrFileSuccess {
  protected readonly context: ClrFileMessagesTemplateContext = inject(CLR_FILE_MESSAGES_TEMPLATE_CONTEXT);
}

@Component({
  selector: 'clr-file-error',
  // The host should have an `*ngIf` or `@if` that checks for the relevant error.
  template: `
    <cds-icon class="clr-validate-icon" shape="error-standard" status="danger" aria-hidden="true"></cds-icon>
    <span class="clr-subtext error">
      <ng-content></ng-content>
    </span>
  `,
  host: {
    '[class.clr-subtext-wrapper]': 'true',
  },
  standalone: false,
})
export class ClrFileError {}
