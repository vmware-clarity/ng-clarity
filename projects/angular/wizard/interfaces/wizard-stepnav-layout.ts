/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export enum ClrWizardStepnavLayout {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

const CLR_WIZARD_STEPNAV_LAYOUT_VALUES = new Set<string>(Object.values(ClrWizardStepnavLayout));

export function stepnavLayoutAttribute(value: ClrWizardStepnavLayout | string): ClrWizardStepnavLayout {
  if (CLR_WIZARD_STEPNAV_LAYOUT_VALUES.has(value as string)) {
    return value as ClrWizardStepnavLayout;
  }
  throw new Error(
    `Invalid ClrWizardStepnavLayout: "${value}". Expected one of: ${[...CLR_WIZARD_STEPNAV_LAYOUT_VALUES].join(', ')}`
  );
}
