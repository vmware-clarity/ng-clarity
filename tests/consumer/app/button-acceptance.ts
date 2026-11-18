/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClarityModule, ClrLoadingState } from '@clr/angular';

/**
 * A Zone.js era consumer: Eager, with plain fields that its handlers change at once or after a timeout. Only the
 * Zone.js build refreshes it after a timeout, so the tests run the delayed changes in that build only. It is a root
 * view of its own (see `main.ts`), because the OnPush consumer application would skip an Eager child.
 */
@Component({
  selector: 'button-acceptance',
  imports: [ClarityModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section id="button-acceptance">
      <clr-button-group>
        <clr-button>First action</clr-button>
        <clr-button [clrInMenu]="secondInMenu" [disabled]="disabled">Second action</clr-button>
        @if (extra) {
          <clr-button [clrInMenu]="true">Late action</clr-button>
        }
        <clr-button [clrLoading]="loading">Third action</clr-button>
      </clr-button-group>
      <button class="btn save-button" [clrLoading]="saveState" (clrLoadingChange)="saveState = $event">Save</button>
      <p data-testid="save-state">{{ saveState }}</p>
      <button class="btn" (click)="change()">Change now</button>
      <button class="btn" (click)="changeLater()">Change later</button>
      <button class="btn" (click)="succeedLater()">Succeed later</button>
    </section>
  `,
})
export class ButtonAcceptance {
  secondInMenu = false;
  disabled = false;
  extra = false;
  loading = false;
  saveState = ClrLoadingState.DEFAULT;

  change() {
    this.secondInMenu = true;
    this.disabled = true;
    this.extra = true;
    this.loading = true;
    this.saveState = ClrLoadingState.LOADING;
  }

  changeLater() {
    setTimeout(() => this.change(), 25);
  }

  succeedLater() {
    this.saveState = ClrLoadingState.LOADING;
    setTimeout(() => (this.saveState = ClrLoadingState.SUCCESS), 25);
  }
}
