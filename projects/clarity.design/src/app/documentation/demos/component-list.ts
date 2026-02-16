/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import COMPONENT_JSON from '../../../settings/componentlist.json';

export interface ComponentListElement {
  url: string;
  text: string;
  type: string;
  storybookPath?: string;
}

export const COMPONENT_MAP = new Map<string, ComponentListElement>();

for (const component of COMPONENT_JSON.list) {
  COMPONENT_MAP.set(component.url, component);
}
