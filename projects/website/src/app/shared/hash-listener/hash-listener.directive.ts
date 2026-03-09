/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Hack while waiting for https://github.com/angular/angular/issues/6595 to be fixed.
 */

import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, Subscription } from 'rxjs';

@Directive({
  selector: '[appHashListener]',
})
export class HashListenerDirective implements AfterViewInit, OnDestroy {
  private subscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit() {
    this.scrollToAnchor(this.route.snapshot.fragment);

    this.subscription = this.route.fragment.pipe(debounceTime(0)).subscribe(fragment => {
      this.scrollToAnchor(fragment);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private scrollToAnchor(fragment: string | null) {
    if (fragment && isPlatformBrowser(this.platformId)) {
      const element = document.querySelector<HTMLElement>(`#${fragment}`);

      if (element) {
        element.scrollIntoView(true);

        // Wait until the element is scrolled into view before focusing it.
        // Otherwise, the focus will interfere with the scroll.
        setTimeout(() => {
          element.setAttribute('tabindex', '-1');
          element.focus();
        });
      }
    }
  }
}
