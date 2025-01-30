/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, Inject, InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { ClrLabel } from '../common/label';
import { ControlIdService } from '../common/providers/control-id.service';

export const IS_TOGGLE = new InjectionToken<BehaviorSubject<boolean>>('IS_TOGGLE');
export function isToggleFactory() {
  return new BehaviorSubject<boolean>(false);
}
export const IS_TOGGLE_PROVIDER = { provide: IS_TOGGLE, useFactory: isToggleFactory };

@Component({
  selector: 'clr-checkbox-wrapper,clr-toggle-wrapper',
  template: `
    <ng-content select="[clrCheckbox],[clrToggle]"></ng-content>
    <ng-content select="label"></ng-content>
    <label *ngIf="!label"></label>
  `,
  host: {
    '[class.clr-checkbox-wrapper]': '!toggle',
    '[class.clr-toggle-wrapper]': 'toggle',
  },
  providers: [ControlIdService, IS_TOGGLE_PROVIDER],
})
export class ClrCheckboxWrapper implements OnInit, OnDestroy {
  @ContentChild(ClrLabel, { static: true }) label: ClrLabel;
  toggle = false;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(IS_TOGGLE) toggleService: BehaviorSubject<boolean>) {
    this.subscriptions.push(
      toggleService.subscribe(state => {
        this.toggle = state;
      })
    );
  }

  ngOnInit() {
    if (this.label) {
      this.label.disableGrid();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
