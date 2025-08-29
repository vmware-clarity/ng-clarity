/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
  template: `<ng-content></ng-content>`,
  host: {
    '[class.clr-subtext]': 'true',
  },
  standalone: false,
})
export class ClrFileInfo {}

@Component({
  selector: 'clr-file-success',
  // We check for success here so that consumers don't have to.
  template: `@if (context.success) {<ng-content></ng-content>}`,
  host: {
    '[style.display]': 'context.success ? "inline-block" : "none"',
    '[class.clr-subtext]': 'true',
    '[class.success]': 'true',
  },
  standalone: false,
})
export class ClrFileSuccess {
  protected readonly context: ClrFileMessagesTemplateContext = inject(CLR_FILE_MESSAGES_TEMPLATE_CONTEXT);
}

@Component({
  selector: 'clr-file-error',
  // The host should have an `*ngIf` or `@if` that checks for the relevant error.
  template: `<ng-content></ng-content>`,
  host: {
    '[class.clr-subtext]': 'true',
    '[class.error]': 'true',
  },
  standalone: false,
})
export class ClrFileError {}
