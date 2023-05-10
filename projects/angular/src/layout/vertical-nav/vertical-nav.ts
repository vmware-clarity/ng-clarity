/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { VerticalNavGroupRegistrationService } from './providers/vertical-nav-group-registration.service';
import { VerticalNavIconService } from './providers/vertical-nav-icon.service';
import { VerticalNavService } from './providers/vertical-nav.service';

@Component({
  selector: 'clr-vertical-nav',
  templateUrl: './vertical-nav.html',
  providers: [VerticalNavService, VerticalNavIconService, VerticalNavGroupRegistrationService],
  host: {
    class: 'clr-vertical-nav',
    '[class.is-collapsed]': 'collapsed',
    '[class.has-nav-groups]': 'hasNavGroups',
    '[class.has-icons]': 'hasIcons',
  },
})
export class ClrVerticalNav implements OnDestroy {
  @Output('clrVerticalNavCollapsedChange') private _collapsedChanged = new EventEmitter<boolean>(true);

  private _sub: Subscription;

  constructor(
    private _navService: VerticalNavService,
    private _navIconService: VerticalNavIconService,
    private _navGroupRegistrationService: VerticalNavGroupRegistrationService,
    public commonStrings: ClrCommonStringsService
  ) {
    this._sub = this._navService.collapsedChanged.subscribe(value => {
      this._collapsedChanged.emit(value);
    });
  }

  @Input('clrVerticalNavCollapsible')
  get collapsible(): boolean | string {
    return this._navService.collapsible;
  }
  set collapsible(value: boolean | string) {
    this._navService.collapsible = value as boolean;
  }

  @Input('clrVerticalNavCollapsed')
  get collapsed(): boolean | string {
    return this._navService.collapsed;
  }
  set collapsed(value: boolean | string) {
    this._navService.collapsed = value as boolean;
  }

  get hasNavGroups(): boolean {
    return this._navGroupRegistrationService.navGroupCount > 0;
  }

  get hasIcons(): boolean {
    return this._navIconService.hasIcons;
  }

  get ariaExpanded(): string {
    if (!this.collapsible) {
      return null;
    }
    return !this.collapsed ? 'true' : 'false';
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

  toggleByButton() {
    this.collapsed = !this.collapsed;
  }
}
