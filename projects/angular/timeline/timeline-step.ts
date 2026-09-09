/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { Component, ContentChild, ElementRef, Inject, Input, OnDestroy, PLATFORM_ID } from '@angular/core';
import { publishElementContext } from '@clr/angular/utils';

import { ClrTimelineStepState } from './enums/timeline-step-state.enum';
import { TimelineIconAttributeService } from './providers/timeline-icon-attribute.service';
import { ClrTimelineStepTitle } from './timeline-step-title';

@Component({
  selector: 'clr-timeline-step',
  template: `
    <ng-content select="clr-timeline-step-header"></ng-content>
    <span class="clr-sr-only">{{ stepTitleText }}</span>
    @if (!isProcessing) {
      <cds-icon [status]="iconStatus" [shape]="iconShape" [attr.aria-label]="iconAriaLabel" role="img"></cds-icon>
    } @else {
      <clr-spinner clrMedium [attr.aria-label]="iconAriaLabel"></clr-spinner>
    }
    <div class="clr-timeline-step-body">
      <ng-content select="clr-timeline-step-title"></ng-content>
      <ng-content select="clr-timeline-step-description"></ng-content>
    </div>
  `,
  host: { '[class.clr-timeline-step]': 'true', '[attr.role]': '"listitem"' },
  standalone: false,
})
export class ClrTimelineStep implements OnDestroy {
  @Input('clrState') state: ClrTimelineStepState = ClrTimelineStepState.NOT_STARTED;

  @ContentChild(ClrTimelineStepTitle, { read: ElementRef }) stepTitle: ElementRef<HTMLElement>;

  stepTitleText: string;

  private teardownElementContext?: () => void;

  constructor(
    private iconAttributeService: TimelineIconAttributeService,
    @Inject(PLATFORM_ID) private platformId: any,
    private hostElement: ElementRef<HTMLElement>
  ) {}

  get iconAriaLabel(): string {
    return this.iconAttributeService.getAriaLabel(this.state);
  }

  get iconShape(): string {
    return this.iconAttributeService.getIconShape(this.state);
  }

  get iconStatus(): string {
    return this.iconAttributeService.getIconStatus(this.state);
  }

  get isProcessing(): boolean {
    return this.state === ClrTimelineStepState.PROCESSING;
  }

  ngAfterContentInit() {
    if (this.stepTitle && isPlatformBrowser(this.platformId)) {
      this.stepTitleText = this.stepTitle.nativeElement.innerText;
    }

    // The outcome is announced through the icon's accessible name, but a timeline is a
    // list and its steps are list items: page-context tooling summarises a list by item
    // name and never descends to the icon. Reported here so the outcome survives.
    this.teardownElementContext = publishElementContext(this.hostElement.nativeElement, () => ({
      state: { status: this.state },
    }));
  }

  ngOnDestroy() {
    this.teardownElementContext?.();
  }
}
