/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { accessibility2Icon, bulletListIcon, ClarityIcons, codeIcon } from '@cds/core/icon';

import { getFeatureFlags } from '../../feature-flags';
import { LinkCardsLink } from '../link-cards/link-cards.component';

@Pipe({
  name: 'appDocTabsLinkCardsLinks',
})
export class DocTabsLinkCardsLinksPipe implements PipeTransform {
  constructor() {
    ClarityIcons.addIcons(codeIcon, accessibility2Icon, bulletListIcon);
  }

  transform(availableTabs: Record<string, boolean>) {
    const links: LinkCardsLink[] = [];

    if (availableTabs['code']) {
      links.push({
        routerLink: './code',
        text: 'Code & Examples',
        hexagonColor: 'sequential-blue',
        iconShape: 'code',
      });
    }

    if (availableTabs['api']) {
      links.push({
        routerLink: './api',
        text: 'API',
        hexagonColor: 'gray',
        iconShape: 'bullet-list',
      });
    }

    if (availableTabs['accessibility'] && getFeatureFlags().accessibility) {
      links.push({
        routerLink: './accessibility',
        text: 'Accessibility & Implementations',
        hexagonColor: 'utility-tangerine',
        iconShape: 'accessibility-2',
      });
    }

    return links;
  }
}
