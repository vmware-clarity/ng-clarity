/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Pipe, PipeTransform } from '@angular/core';

import { IconVariant } from './icon-variants.helpers';

@Pipe({ name: 'appIconAriaLabel' })
export class IconAriaLabelPipe implements PipeTransform {
  transform(iconName: string, iconVariant: IconVariant) {
    let iconAriaLabel = 'select';

    if (iconVariant?.solid) {
      iconAriaLabel += ' solid';
    }

    iconAriaLabel += ` ${iconName} icon`;

    if (iconVariant?.badge) {
      iconAriaLabel += ` with ${iconVariant.badge} badge`;
    }

    return iconAriaLabel;
  }
}
