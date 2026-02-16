/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Pipe, PipeTransform } from '@angular/core';

import { Icon } from './icon-inventory';

@Pipe({
  name: 'appIconBadge',
  standalone: false,
})
export class IconBadgePipe implements PipeTransform {
  transform(badge: string | null | undefined, icon: Icon) {
    if (badge?.includes('triangle')) {
      return icon.shapeCollection.outlineAlerted || icon.shapeCollection.solidAlerted ? badge : null;
    } else if (badge) {
      return icon.shapeCollection.outlineBadged || icon.shapeCollection.solidBadged ? badge : null;
    } else {
      return null;
    }
  }
}
