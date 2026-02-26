/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  chartCollectionAliases,
  chartCollectionIcons,
  commerceCollectionAliases,
  commerceCollectionIcons,
  coreCollectionAliases,
  coreCollectionIcons,
  essentialCollectionAliases,
  essentialCollectionIcons,
  IconAlias,
  IconShapeCollection,
  IconShapeTuple,
  mediaCollectionAliases,
  mediaCollectionIcons,
  socialCollectionAliases,
  socialCollectionIcons,
  technologyCollectionAliases,
  technologyCollectionIcons,
  textEditCollectionAliases,
  textEditCollectionIcons,
  travelCollectionAliases,
  travelCollectionIcons,
} from '@clr/angular';

export interface Icon {
  name: string;
  shapeCollection: IconShapeCollection;
}

export interface IconSet {
  setName: string;
  icons: Icon[];
}

export const ICON_SETS = [
  {
    setName: 'Core Icons',
    icons: convertIcons(coreCollectionIcons),
  },
  {
    setName: 'Essential Icons',
    icons: convertIcons(essentialCollectionIcons),
  },
  {
    setName: 'Commerce Icons',
    icons: convertIcons(commerceCollectionIcons),
  },
  {
    setName: 'Media Icons',
    icons: convertIcons(mediaCollectionIcons),
  },
  {
    setName: 'Social Icons',
    icons: convertIcons(socialCollectionIcons),
  },
  {
    setName: 'Travel Icons',
    icons: convertIcons(travelCollectionIcons),
  },
  {
    setName: 'Text Icons',
    icons: convertIcons(textEditCollectionIcons),
  },
  {
    setName: 'Technology Icons',
    icons: convertIcons(technologyCollectionIcons),
  },
  {
    setName: 'Chart Icons',
    icons: convertIcons(chartCollectionIcons),
  },
];

export const ICON_ALIASES = {
  ...mapAliases(coreCollectionAliases),
  ...mapAliases(essentialCollectionAliases),
  ...mapAliases(commerceCollectionAliases),
  ...mapAliases(mediaCollectionAliases),
  ...mapAliases(socialCollectionAliases),
  ...mapAliases(travelCollectionAliases),
  ...mapAliases(textEditCollectionAliases),
  ...mapAliases(technologyCollectionAliases),
  ...mapAliases(chartCollectionAliases),
};

export const ICONS_STATES = {
  alerted: ['warning-triangle', 'inherit-triangle'],
  badged: ['info', 'success', 'danger', 'warning'],
};

function convertIcons(iconShapeTuples: IconShapeTuple[]) {
  const icons: Icon[] = [];

  for (const [name, shapeCollection] of iconShapeTuples) {
    // skip icons like "vm-bug" that do not have a shape collection
    if (typeof shapeCollection === 'string') {
      continue;
    }

    icons.push({ name, shapeCollection });
  }

  return icons;
}

function mapAliases(aliases: IconAlias[]) {
  return aliases.reduce<Record<string, string[]>>((aliasMap, [iconName, aliases]) => {
    aliasMap[iconName] = aliases;
    return aliasMap;
  }, {});
}
