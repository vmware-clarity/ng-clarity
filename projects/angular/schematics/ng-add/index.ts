/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { noop, Rule, schematic } from '@angular-devkit/schematics';

import { AiSkillsOptions } from '../ai-skills';

export interface NgAddOptions {
  ai?: 'none' | 'agents' | 'agents-claude';
}

export function ngAdd(options: NgAddOptions): Rule {
  if (!options.ai || options.ai === 'none') {
    return noop();
  }
  return schematic<AiSkillsOptions>('ai-skills', { claude: options.ai === 'agents-claude' });
}
