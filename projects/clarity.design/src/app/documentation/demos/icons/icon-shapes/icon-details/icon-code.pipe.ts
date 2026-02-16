/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Pipe, PipeTransform } from '@angular/core';

import { IconVariant } from './icon-variants.helpers';

@Pipe({
  name: 'appIconCode',
  standalone: false,
})
export class IconCodePipe implements PipeTransform {
  transform(iconName: string, iconVariant: IconVariant) {
    let iconCode = `<cds-icon shape="${iconName}"`;

    if (iconVariant?.badge) {
      iconCode += ` badge="${iconVariant.badge}"`;
    }

    if (iconVariant?.solid) {
      iconCode += ` solid="true"`;
    }

    iconCode += '></cds-icon>';

    return iconCode;
  }
}
