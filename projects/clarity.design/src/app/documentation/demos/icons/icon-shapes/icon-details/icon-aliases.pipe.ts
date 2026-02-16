/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Pipe, PipeTransform } from '@angular/core';

import { ICON_ALIASES } from '../icon-groups/icon-inventory';

@Pipe({
  name: 'appIconAliases',
  standalone: false,
})
export class IconAliasesPipe implements PipeTransform {
  transform(iconName: string) {
    return ICON_ALIASES[iconName];
  }
}
