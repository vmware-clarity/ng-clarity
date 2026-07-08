/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Directive, ElementRef, Host, Input, OnChanges, Renderer2 } from '@angular/core';
import { ClrTabLink } from '@clr/angular/layout/tabs';

const resources = {
  clarity: {
    tabLinkNavigationClasses: ['nav-link', 'btn-link'],
  },
};

/**
 * Toggles CSS classes on a ClrTabLink to switch between default tab style and
 * a button-like appearance, enabling more versatile use of clr-tabs.
 */
@Directive({
  selector: '[renderAsButton]',
  standalone: false,
})
export class RenderAsButtonDirective implements OnChanges, AfterViewInit {
  @Input() renderAsButton: boolean = true;

  constructor(
    @Host() private clrTabLink: ClrTabLink,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnChanges(): void {
    this.patchClarityStyles();
  }

  ngAfterViewInit(): void {
    this.patchClarityStyles();
  }

  private patchClarityStyles(): void {
    const tabLinkElem = this.el.nativeElement;
    if (!tabLinkElem) {
      console.error('RenderAsButtonDirective: Unable to find the element');
      return;
    }
    if (this.clrTabLink.inOverflow) {
      return;
    }
    if (this.renderAsButton) {
      resources.clarity.tabLinkNavigationClasses.forEach(css => this.renderer.removeClass(tabLinkElem, css));
    } else {
      resources.clarity.tabLinkNavigationClasses.forEach(css => this.renderer.addClass(tabLinkElem, css));
    }
  }
}
