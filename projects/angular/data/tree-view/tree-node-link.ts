/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, HostBinding, OnDestroy, signal } from '@angular/core';

@Directive({
  selector: '.clr-treenode-link',
  standalone: false,
})
export class ClrTreeNodeLink implements OnDestroy {
  // The tree node's content container owns the roving tabindex for the whole treeitem, so
  // the link itself must be removed from the natural tab sequence to avoid a double Tab stop.
  // It remains mouse-clickable and can still be activated programmatically via .click().
  @HostBinding('attr.tabindex') tabindex = -1;

  // The app marks the link active with the `active` class (`routerLinkActive`, a class binding). An observer keeps
  // it in a signal, so that the tree node reading `active` is refreshed when the class changes.
  private readonly _active = signal(false);
  private readonly classObserver: MutationObserver | undefined;

  constructor(private el: ElementRef<HTMLElement>) {
    const element = el.nativeElement;
    const updateActive = () => this._active.set(element.classList.contains('active'));
    updateActive();
    if (typeof MutationObserver !== 'undefined') {
      this.classObserver = new MutationObserver(updateActive);
      this.classObserver.observe(element, { attributes: true, attributeFilter: ['class'] });
    }
  }

  get active() {
    return this._active();
  }

  ngOnDestroy() {
    this.classObserver?.disconnect();
  }

  activate() {
    if (this.el.nativeElement && this.el.nativeElement.click) {
      this.el.nativeElement.click();
    }
  }
}
