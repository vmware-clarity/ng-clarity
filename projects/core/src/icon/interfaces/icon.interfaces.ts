/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { IconRegistrySources } from '@cds/core/internal';

type IconSvgString = string;
type IconNameString = string;
type IconAliases = string[];

export interface IconShapeCollection {
  outline?: IconSvgString;
  solid?: IconSvgString;
  outlineBadged?: IconSvgString;
  outlineAlerted?: IconSvgString;
  solidBadged?: IconSvgString;
  solidAlerted?: IconSvgString;
}

export type IconShapeTuple = [IconNameString, IconSvgString | IconShapeCollection];

export interface IconShapeSources {
  [key: string]: IconShapeTuple;
}

declare module '@cds/core/internal' {
  interface IconRegistrySources {
    [key: string]: IconSvgString | IconShapeCollection;
  }
}

export type IconRegistry = Partial<IconRegistrySources>;

type NameOfIconToAlias = string;

export type IconAlias = [NameOfIconToAlias, IconAliases];
