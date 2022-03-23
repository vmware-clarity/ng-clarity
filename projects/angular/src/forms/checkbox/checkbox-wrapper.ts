/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit, ContentChild, Inject, InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ClrDestroyService } from '../../utils/destroy';
import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { ControlIdService } from '../common/providers/control-id.service';
import { ClrLabel } from '../common/label';

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
  providers: [ControlIdService, IS_TOGGLE_PROVIDER, ClrDestroyService],
})
export class ClrCheckboxWrapper implements DynamicWrapper, OnInit {
  // We need both _dynamic for HostWrapper and ContentChild(ClrLabel) in cases where
  // the user puts a radio inside a wrapper without a label, host wrapping doesn't apply
  // but we'd still need to insert a label
  _dynamic = false;
  @ContentChild(ClrLabel, { static: true })
  label: ClrLabel;
  toggle = false;

  constructor(@Inject(IS_TOGGLE) toggleService: BehaviorSubject<boolean>, destroy$: ClrDestroyService) {
    toggleService.pipe(takeUntil(destroy$)).subscribe(state => {
      this.toggle = state;
    });
  }

  ngOnInit() {
    if (this.label) {
      this.label.disableGrid();
    }
  }
}
