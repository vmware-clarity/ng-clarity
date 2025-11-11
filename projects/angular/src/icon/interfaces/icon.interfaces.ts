/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

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

export interface IconRegistrySources {
  [key: string]: IconSvgString | IconShapeCollection;
}

export type IconRegistry = Partial<IconRegistrySources>;

type NameOfIconToAlias = string;

export type IconAlias = [NameOfIconToAlias, IconAliases];

export type Directions = 'up' | 'down' | 'left' | 'right';

export type Orientations = 'horizontal' | 'vertical';

export type StatusTypes = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
