/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { markContext } from '@clr/angular/utils';

/** Marks what spec markup tags `clrContextIgnore` or `clrContextRedact`, as those directives do in a template,
 * inside open shadow roots too. */
export function applyContextMarks(root: ParentNode): void {
  root.querySelectorAll('[clrcontextignore]').forEach(element => markContext(element, 'ignore'));
  root.querySelectorAll('[clrcontextredact]').forEach(element => markContext(element, 'redact'));
  root.querySelectorAll('*').forEach(element => element.shadowRoot && applyContextMarks(element.shadowRoot));
}
