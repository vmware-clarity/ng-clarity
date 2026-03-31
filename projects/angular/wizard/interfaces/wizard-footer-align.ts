/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export enum ClrWizardFooterAlign {
  START = 'start',
  END = 'end',
}

const CLR_WIZARD_FOOTER_ALIGN_VALUES = new Set<string>(Object.values(ClrWizardFooterAlign));

export function footerAlignAttribute(value: ClrWizardFooterAlign | string): ClrWizardFooterAlign {
  if (CLR_WIZARD_FOOTER_ALIGN_VALUES.has(value as string)) {
    return value as ClrWizardFooterAlign;
  }
  throw new Error(
    `Invalid ClrWizardFooterAlign: "${value}". Expected one of: ${[...CLR_WIZARD_FOOTER_ALIGN_VALUES].join(', ')}`
  );
}
