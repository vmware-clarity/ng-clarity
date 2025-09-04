/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, Inject, Injector, Optional } from '@angular/core';

import { DummyAnchor } from './dummy-anchor';
import { AbstractPopover } from '../../../../angular/src/popover/common/abstract-popover';
import { Point } from '../../../../angular/src/popover/common/popover';
import { POPOVER_HOST_ANCHOR } from '../../../../angular/src/popover/common/popover-host-anchor.token';

@Component({
  selector: 'clr-dummy-menu',
  styleUrls: ['./popovers.demo.scss'],
  template: `<ng-content></ng-content>`,
  host: { '[class.dummy-menu]': 'true' },
})
export class DummyMenu extends AbstractPopover {
  constructor(
    injector: Injector,
    @Optional()
    @Inject(POPOVER_HOST_ANCHOR)
    parentHost: ElementRef<HTMLElement>,
    parent: DummyAnchor
  ) {
    super(injector, parentHost);
    this.configurePopover();
    if (parent && parent.ignore) {
      this.ignoredElement = parent.ignore.nativeElement;
    }
  }

  private configurePopover(): void {
    this.anchorPoint = Point.BOTTOM_LEFT;
    this.popoverPoint = Point.LEFT_TOP;
    this.closeOnOutsideClick = true;
  }
}
