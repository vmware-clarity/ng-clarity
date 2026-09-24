/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { ClrCommonStringsService, ClrHostAttribute, uniqueIdFactory } from '@clr/angular/utils';
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
  private readonly roleAttribute: ClrHostAttribute;
  private insideLandmark = false;

  constructor(
    private _navService: VerticalNavService,
    private _navIconService: VerticalNavIconService,
    private _navGroupRegistrationService: VerticalNavGroupRegistrationService,
    public commonStrings: ClrCommonStringsService,
    // Optional and last, so that subclasses calling `super()` with the arguments they
    // passed before keep compiling.
    @Optional() private readonly el?: ElementRef<HTMLElement>
  ) {
    this.roleAttribute = new ClrHostAttribute(el?.nativeElement, 'role');
    this._sub = _navService.collapsedChanged.subscribe(value => {
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

  /**
   * The vertical nav is a navigation landmark, the same way the header is a banner: it
   * lets assistive technology jump to or past it, and lets page-context tooling leave it
   * out as layout. Left off when the nav already sits inside a landmark (a `<nav>`, an
   * element with `role="navigation"`), so a page does not end up with two nested ones. A
   * `role` the application writes or binds on the element is kept either way.
   */
  @HostBinding('attr.role')
  private get hostRole(): string | null {
    return this.roleAttribute.value(this.insideLandmark ? null : 'navigation');
  }

  ngOnInit() {
    this.insideLandmark = !!this.el?.nativeElement.parentElement?.closest('nav, [role="navigation"]');
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

  toggleByButton() {
    this.collapsed = !this.collapsed;
  }
}
