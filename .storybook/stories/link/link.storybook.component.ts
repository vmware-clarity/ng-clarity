/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'storybook-link',
  standalone: true,
  imports: [NgClass],
  template: `<a
    href="javascript:void(0)"
    [ngClass]="{
      'link-hovered': hover,
      'link-clicked': active,
      'link-visited': visited,
      'link-visited-hover': visitedHover
    }"
    >Test Link</a
  >`,
})
export class LinkStorybookComponent {
  @Input() active = false;
  @Input() hover = false;
  @Input() visited = false;
  @Input() visitedHover = false;
}
