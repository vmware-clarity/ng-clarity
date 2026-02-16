/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

/**
 * This is a temporary fix to remove forced headings from the page.
 * @todo Remove after CDE-952 is resolved.
 */
@Directive({
  selector: 'clr-stack-view[appRemoveStackViewHeadings]',
  standalone: false,
})
export class RemoveStackViewHeadingsDirective implements OnInit, OnDestroy {
  private readonly mutationObserver: MutationObserver;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {
    this.mutationObserver = new MutationObserver(() => {
      removeStackBlockHeadingAttributes(elementRef.nativeElement);
    });
  }

  ngOnInit() {
    this.mutationObserver.observe(this.elementRef.nativeElement, { childList: true, subtree: true, attributes: true });
  }

  ngOnDestroy() {
    this.mutationObserver.disconnect();
  }
}

function removeStackBlockHeadingAttributes(stackViewElement: HTMLElement) {
  stackViewElement.querySelectorAll<HTMLHeadingElement>('clr-stack-header h4').forEach(headingElement => {
    const text = headingElement.innerText;

    // We know there is a parent element due to the selector.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const parentElement = headingElement.parentElement!;
    const nextSibling = headingElement.nextSibling;

    headingElement.remove();

    const divElement = document.createElement('div');
    divElement.innerText = text;
    divElement.classList.add('stack-title');
    parentElement.insertBefore(divElement, nextSibling);
  });

  stackViewElement.querySelectorAll<HTMLHeadingElement>('clr-stack-block[role]').forEach(stackBlockElement => {
    stackBlockElement.removeAttribute('role');
  });

  stackViewElement.querySelectorAll<HTMLHeadingElement>('clr-stack-block[aria-level]').forEach(stackBlockElement => {
    stackBlockElement.removeAttribute('aria-level');
  });
}
