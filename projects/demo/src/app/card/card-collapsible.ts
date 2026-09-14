/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

/**
 * Collapsible card built from the CSS classes only, without the Angular card components.
 * The demo toggles one class and the matching ARIA attributes; the animation is pure CSS.
 */
@Component({
  selector: 'clr-card-collapsible-demo',
  styleUrls: ['./card.demo.scss'],
  templateUrl: './card-collapsible.html',
  standalone: false,
})
export class CardCollapsibleDemo {
  collapsed = false;
  fixedFooterCollapsed = true;
}
