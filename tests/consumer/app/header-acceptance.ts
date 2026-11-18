/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { ClarityModule, ClrHeader, ResponsiveNavigationService } from '@clr/angular';

/**
 * A Zone-era (Eager) consumer of the header: it hides its header actions while the hamburger menu is open by reading
 * `header.openNavLevel`, like the Clarity website, and opens and adds nav levels from asynchronous callbacks.
 */
@Component({
  selector: 'header-acceptance',
  imports: [ClarityModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (enabled) {
      <clr-main-container>
        <clr-header #header>
          <div class="branding"><span class="title">Header acceptance</span></div>
          @if (header.openNavLevel !== 1) {
            <div class="header-actions" data-testid="header-actions">Actions</div>
          }
        </clr-header>
        <nav class="subnav" [clr-nav-level]="1">
          <ul class="nav">
            <li class="nav-item"><a class="nav-link" href="#" (click)="$event.preventDefault()">Header link</a></li>
          </ul>
        </nav>
        @if (overflow) {
          <div class="header-nav" [clr-nav-level]="2">
            <a class="nav-link" href="#" (click)="$event.preventDefault()">Overflow link</a>
          </div>
        }
        <div class="content-container">
          <main class="content-area">
            <button class="btn" (click)="openOverflowLater()">Open overflow later</button>
            <button class="btn" (click)="overflow = !overflow">Toggle overflow</button>
          </main>
        </div>
      </clr-main-container>
    }
  `,
})
export class HeaderAcceptance {
  readonly enabled = new URLSearchParams(location.search).get('suite') === 'header';
  overflow = false;
  @ViewChild(ClrHeader) private header: ClrHeader;
  private readonly responsiveNavService = inject(ResponsiveNavigationService);

  constructor() {
    Object.assign(window, { headerAcceptance: this });
  }

  openOverflowLater() {
    setTimeout(() => this.header.openNav(2), 25);
  }

  closeAllNavs() {
    this.responsiveNavService.closeAllNavs();
  }
}
