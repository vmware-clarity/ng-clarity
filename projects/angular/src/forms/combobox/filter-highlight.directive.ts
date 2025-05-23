/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, HostBinding, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';

import { OptionSelectionService } from './providers/option-selection.service';

// TODO: Check if this directive is properly sanitized and:
//       - return to module
//       - return to dev-app examples
//       - return to website docs
@Directive({
  selector: '[clrFilterHighlight]',
})
export class ClrFilterHighlight<T> implements AfterViewInit, OnDestroy {
  @HostBinding('class') elementClass = 'clr-filter-highlight';

  private subscriptions: Subscription[] = [];
  private initialHtml: string;
  private filter = '';

  constructor(
    private element: ElementRef<HTMLElement>,
    private optionSelectionService: OptionSelectionService<T>,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initialHtml = this.element.nativeElement.innerHTML;
      this.subscriptions.push(
        this.optionSelectionService.inputChanged.subscribe(filter => {
          this.filter = filter;
          this.findMatches();
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private sanitizeForRegexp(value: string): string {
    if (!value) {
      return value;
    }
    // We may want to replace this with a more common sanitization, if we find one
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private findMatches() {
    if (!this.filter) {
      this.element.nativeElement.innerHTML = this.initialHtml;
      return;
    }
    const regex = new RegExp(`(${this.sanitizeForRegexp(this.filter)})`, 'gi');
    if (this.initialHtml.match(regex)) {
      this.element.nativeElement.innerHTML = this.initialHtml.replace(regex, `<b>$1</b>`);
    } else {
      this.element.nativeElement.innerHTML = this.initialHtml;
    }
  }
}
