/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ICON_ALIASES, ICON_SETS, IconSet } from './icon-inventory';

export function searchIcons(searchTerm: string) {
  if (!searchTerm) {
    return ICON_SETS;
  }

  return ICON_SETS.map<IconSet>(iconSet => ({
    ...iconSet,
    icons: iconSet.icons.filter(
      icon => icon.name.includes(searchTerm) || ICON_ALIASES[icon.name]?.some(alias => alias.includes(searchTerm))
    ),
  }));
}
