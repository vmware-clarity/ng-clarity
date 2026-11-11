/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, DOCUMENT, inject, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'clr-dropdown-angular-shadow-root-demo',
  templateUrl: './dropdown-angular-shadow-root.demo.html',
  styleUrls: ['./dropdown.demo.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DropdownAngularShadowRootDemo {
  private readonly body = inject(DOCUMENT).body;

  // The page's theme and density do not reach into the shadow root, so they are set again inside.
  get theme() {
    return this.body.getAttribute('cds-theme');
  }

  get density() {
    return this.body.getAttribute('clr-density');
  }
}
