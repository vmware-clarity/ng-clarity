/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, AfterViewInit, Inject, PLATFORM_ID, HostBinding } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntil } from 'rxjs/operators';

import { ClrDestroyService } from '../../utils/destroy';
import { OptionSelectionService } from './providers/option-selection.service';

// TODO: Check if this directive is properly sanitized and:
//       - return to module
//       - return to dev-app examples
//       - return to website docs
@Directive({ selector: '[clrFilterHighlight]', providers: [ClrDestroyService] })
export class ClrFilterHighlight<T> implements AfterViewInit {
  private initialHtml: string;
  private filter = '';

  constructor(
    private element: ElementRef,
    private optionSelectionService: OptionSelectionService<T>,
    @Inject(PLATFORM_ID) private platformId: string,
    private destroy$: ClrDestroyService
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initialHtml = this.element.nativeElement.innerHTML;

      this.optionSelectionService.inputChanged.pipe(takeUntil(this.destroy$)).subscribe(filter => {
        this.filter = filter;
        this.findMatches();
      });
    }
  }

  @HostBinding('class') elementClass = 'clr-filter-highlight';

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
