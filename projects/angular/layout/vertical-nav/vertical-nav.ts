/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ClrCommonStringsService, uniqueIdFactory } from '@clr/angular/utils';
import { Subscription } from 'rxjs';

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
  standalone: false,
})
export class ClrVerticalNav implements OnInit, OnDestroy {
  @Input('clrVerticalNavToggleLabel') toggleLabel: string;

  contentId = uniqueIdFactory();

  @Output('clrVerticalNavCollapsedChange') private _collapsedChanged = new EventEmitter<boolean>(true);

  private _sub: Subscription;
  private _role: string | null = 'navigation';
  private _roleSet = false;

  constructor(
    private _navService: VerticalNavService,
    private _navIconService: VerticalNavIconService,
    private _navGroupRegistrationService: VerticalNavGroupRegistrationService,
    public commonStrings: ClrCommonStringsService,
    private readonly el: ElementRef<HTMLElement>
  ) {
    this._sub = _navService.collapsedChanged.subscribe(value => {
      this._collapsedChanged.emit(value);
    });
  }

  /**
   * The vertical nav is a navigation landmark, the same way the header is a banner: it
   * lets assistive technology jump to or past it, and lets page-context tooling leave it
   * out as layout. Left off when the nav already sits inside a landmark (a `<nav>`, an
   * element with `role="navigation"`), so a page does not end up with two nested ones.
   * Set `role` on the element to decide either way.
   */
  @Input()
  @HostBinding('attr.role')
  get role(): string | null {
    return this._role;
  }
  set role(value: string | null) {
    this._role = value;
    this._roleSet = true;
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

  ngOnInit() {
    if (!this._roleSet && this.el.nativeElement.parentElement?.closest('nav, [role="navigation"]')) {
      this._role = null;
    }
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

  toggleByButton() {
    this.collapsed = !this.collapsed;
  }
}
