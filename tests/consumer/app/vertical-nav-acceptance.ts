/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ClarityModule, ClrVerticalNav } from '@clr/angular';

/**
 * A Zone.js-era consumer: an Eager root component with plain fields, changed later from timers. In a Zone.js
 * application every change here must render without the consumer notifying Angular. Bootstrapped by `main.ts` with
 * `?suite=vertical-nav`.
 */
@Component({
  selector: 'vertical-nav-acceptance',
  imports: [ClarityModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section id="vertical-nav-acceptance">
      <clr-vertical-nav [clrVerticalNavCollapsible]="true" [(clrVerticalNavCollapsed)]="collapsed">
        <a clrVerticalNavLink href="#" (click)="$event.preventDefault()">
          <cds-icon shape="home" clrVerticalNavIcon></cds-icon>
          {{ label }}
        </a>
        <clr-vertical-nav-group [(clrVerticalNavGroupExpanded)]="groupExpanded">
          <cds-icon shape="folder" clrVerticalNavIcon></cds-icon>
          Consumer group
          <clr-vertical-nav-group-children *clrIfExpanded>
            <a clrVerticalNavLink href="#" (click)="$event.preventDefault()">{{ label }} child</a>
          </clr-vertical-nav-group-children>
        </clr-vertical-nav-group>
      </clr-vertical-nav>
      <p data-testid="nav-state">{{ collapsed }} / {{ groupExpanded }}</p>
      <button class="btn" (click)="later(() => (label = 'Renamed'))">Rename later</button>
      <button class="btn" (click)="later(() => (groupExpanded = !groupExpanded))">Toggle group later</button>
      <button class="btn" (click)="later(() => (collapsed = !collapsed))">Toggle collapsed later</button>
      <button class="btn" (click)="later(() => nav.toggleByButton())">Toggle nav API later</button>
    </section>
  `,
})
export class VerticalNavAcceptance {
  label = 'Consumer home';
  collapsed = false;
  groupExpanded = false;
  @ViewChild(ClrVerticalNav) nav: ClrVerticalNav;

  later(change: () => void) {
    setTimeout(change, 25);
  }
}
