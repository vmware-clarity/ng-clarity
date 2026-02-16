/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Icon, ICONS_STATES } from '../icon-groups/icon-inventory';

export interface IconVariant {
  solid: boolean;
  badge: string;
}

export function getIconVariants(icon: Icon) {
  const iconVariants: IconVariant[] = [];

  if (icon.shapeCollection.outline) {
    iconVariants.push({
      solid: false,
      badge: '',
    });
  }

  if (icon.shapeCollection.outlineBadged) {
    iconVariants.push(
      ...ICONS_STATES.badged.map(badge => ({
        solid: false,
        badge: badge,
      }))
    );
  }

  if (icon.shapeCollection.outlineAlerted) {
    iconVariants.push(
      ...ICONS_STATES.alerted.map(badge => ({
        solid: false,
        badge: badge,
      }))
    );
  }

  if (icon.shapeCollection.solid) {
    iconVariants.push({
      solid: true,
      badge: '',
    });
  }

  if (icon.shapeCollection.solidBadged) {
    iconVariants.push(
      ...ICONS_STATES.badged.map(badge => ({
        solid: true,
        badge: badge,
      }))
    );
  }

  if (icon.shapeCollection.solidAlerted) {
    iconVariants.push(
      ...ICONS_STATES.alerted.map(badge => ({
        solid: true,
        badge: badge,
      }))
    );
  }

  return iconVariants;
}
