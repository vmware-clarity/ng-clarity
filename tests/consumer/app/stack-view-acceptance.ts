/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ClarityModule, ClrStackBlock } from '@clr/angular';

/**
 * The root of an application written for Zone.js: Eager, with plain fields that it changes after a timer. With
 * Zone.js the timer triggers change detection, so the stack view must render these changes although its components
 * are OnPush.
 */
@Component({
  selector: 'stack-view-acceptance',
  imports: [ClarityModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button class="btn" (click)="loadLater()">Load stack view changes</button>
    <button class="btn" (click)="changeChildLater()">Change stack view child</button>
    <button class="btn" (click)="expandDirectLater()">Expand direct stack block</button>
    <clr-stack-view>
      <clr-stack-header [clrStackHeaderLevel]="headerLevel">Consumer stack view</clr-stack-header>
      <clr-stack-block class="consumer-parent" [(clrSbExpanded)]="expanded">
        <clr-stack-label>Consumer parent</clr-stack-label>
        <clr-stack-content>{{ content }}</clr-stack-content>
        <clr-stack-block>
          <clr-stack-label>Consumer first child</clr-stack-label>
          <clr-stack-content>Consumer first child content</clr-stack-content>
        </clr-stack-block>
        @if (showChild) {
          <clr-stack-block class="consumer-child" [clrSbNotifyChange]="childChanged">
            <clr-stack-label>Consumer late child</clr-stack-label>
            <clr-stack-content>Consumer late child content</clr-stack-content>
          </clr-stack-block>
        }
      </clr-stack-block>
      <clr-stack-block #direct class="consumer-direct">
        <clr-stack-label>Direct block</clr-stack-label>
        <clr-stack-content>Direct content</clr-stack-content>
        <clr-stack-block>
          <clr-stack-label>Direct child</clr-stack-label>
        </clr-stack-block>
      </clr-stack-block>
    </clr-stack-view>
    <p data-testid="stack-view-expanded">{{ expanded }}</p>
  `,
})
export class StackViewAcceptance {
  @ViewChild('direct') direct: ClrStackBlock;
  headerLevel: 2 = null;
  expanded = false;
  showChild = false;
  childChanged = false;
  content = 'Consumer content';

  loadLater() {
    setTimeout(() => {
      this.headerLevel = 2;
      this.showChild = true;
      this.expanded = true;
      this.content = 'Updated consumer content';
    }, 25);
  }

  changeChildLater() {
    setTimeout(() => {
      this.expanded = false;
      this.childChanged = true;
    }, 25);
  }

  expandDirectLater() {
    setTimeout(() => {
      this.direct.expanded = true;
    }, 25);
  }
}
