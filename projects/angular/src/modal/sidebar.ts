/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[clrSidebar]',
  host: {
    '[class.sidebar]': 'true',
  },
})
export class ClrSidebar {
  @Input() clrNoBackdrop = false;

  @HostBinding('class.no-backdrop')
  get hideBackdrop() {
    return this.clrNoBackdrop;
  }
}
