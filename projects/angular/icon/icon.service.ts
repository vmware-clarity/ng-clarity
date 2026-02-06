/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { IconAlias, IconRegistry, IconShapeTuple } from './interfaces/icon.interfaces';
import { GlobalStateService } from './services/global.service';
import { unknownIcon } from './shapes/unknown';

/**
 * ClarityIcons is a static class that gives users the ability to interact with
 * the icon registry. This includes capabilities to add, retrieve, or alias icons
 * in the registry.
 *
 * @privateRemarks
 *
 * The icon registry is private to the module. There is no way to access it directly
 * outside of the module.
 *
 */
// @dynamic
export class ClarityIcons {
  /**
   * Returns a readonly reference of the icon registry.
   */
  static get registry(): Readonly<IconRegistry> {
    return { unknown: unknownIcon[1] as string, ...GlobalStateService.state.iconRegistry };
  }

  static addIcons(...shapes: IconShapeTuple[]) {
    // Use the static GlobalStateService
    const currentRegistry = GlobalStateService.state.iconRegistry;

    GlobalStateService.setValue('iconRegistry', {
      ...currentRegistry,
      // Filter out any icons that already exist
      ...Object.fromEntries(shapes.filter(([name]) => !currentRegistry[name])),
    });
  }

  /**
   * @description
   * Use `addIcons` instead of `addAliases`
   *
   * This method is a backwords compatibility function to the old API
   *
   * The team will revisit this method for possible deprecation.
   */
  static addAliases(...aliases: IconAlias[]) {
    const currentRegistry = ClarityIcons.registry; // Use the getter to include 'unknown'
    const currentGlobalRegistry = GlobalStateService.state.iconRegistry;

    const newAliases = aliases
      .filter(([name]) => currentRegistry[name]) // Check if the icon to be aliased exists
      .map(([name, aliasNames]) => aliasNames.map(alias => [alias, currentRegistry[name]])); // Map to [aliasName, iconTemplate]

    GlobalStateService.setValue('iconRegistry', {
      ...currentGlobalRegistry,
      ...Object.fromEntries(newAliases.flat()),
    });
  }

  static getIconNameFromShape(iconShape: IconShapeTuple) {
    return iconShape[0];
  }
}
