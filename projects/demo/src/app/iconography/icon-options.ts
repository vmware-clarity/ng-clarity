/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  chartCollectionIcons as ChartShapes,
  commerceCollectionIcons as CommerceShapes,
  coreCollectionIcons as CoreShapes,
  essentialCollectionIcons as EssentialShapes,
  mediaCollectionIcons as MediaShapes,
  Orientations,
  socialCollectionIcons as SocialShapes,
  technologyCollectionIcons as TechnologyShapes,
  textEditCollectionIcons as TextEditShapes,
  travelCollectionIcons as TravelShapes,
} from '@clr/angular';

@Component({
  selector: 'clr-icon-options-demo',
  styleUrls: ['./iconography.demo.scss'],
  templateUrl: './icon-options.demo.html',
  standalone: false,
})
export class IconOptionsDemo {
  shape = 'info-circle';
  size = 'lg';
  direction = '';
  flip: Orientations;
  solid = false;
  status = '';
  inverse = false;
  badge = '';
  innerOffset = 0;

  shapes = [
    ...CoreShapes,
    ...CommerceShapes,
    ...EssentialShapes,
    ...MediaShapes,
    ...SocialShapes,
    ...TravelShapes,
    ...TechnologyShapes,
    ...ChartShapes,
    ...TextEditShapes,
  ]
    .map(i => i[0])
    .sort();
  sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', '12', '16', '24', '32', '48', '64', 'fit'];
  directions = ['up', 'down', 'left', 'right'];
  flips = ['horizontal', 'vertical'];
  statuses = ['info', 'success', 'warning', 'danger', 'neutral'];
  badges = ['info', 'success', 'warning', 'danger', 'inherit', 'warning-triangle', 'inherit-triangle'];

  get snippet(): string {
    const attrs = [`shape="${this.shape}"`];
    if (this.size) {
      attrs.push(`size="${this.size}"`);
    }
    if (this.direction) {
      attrs.push(`direction="${this.direction}"`);
    }
    if (this.flip) {
      attrs.push(`flip="${this.flip}"`);
    }
    if (this.solid) {
      attrs.push('solid');
    }
    if (this.status) {
      attrs.push(`status="${this.status}"`);
    }
    if (this.inverse) {
      attrs.push('inverse');
    }
    if (this.badge) {
      attrs.push(`badge="${this.badge}"`);
    }
    if (this.innerOffset) {
      attrs.push(`inner-offset="${this.innerOffset}"`);
    }
    return `<clr-icon ${attrs.join(' ')} />`;
  }
}
