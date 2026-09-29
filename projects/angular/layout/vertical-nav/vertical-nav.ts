/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewChecked,
  ChangeDetectorRef,
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

/** A navigation landmark, explicit or implicit. */
const LANDMARK_SELECTOR = 'nav, [role="navigation"]';

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
export class ClrVerticalNav implements OnInit, AfterViewChecked, OnDestroy {
  @Input('clrVerticalNavToggleLabel') toggleLabel: string;
  contentId = uniqueIdFactory();

  @Output('clrVerticalNavCollapsedChange') private _collapsedChanged = new EventEmitter<boolean>(true);

  private _sub: Subscription;
  private readonly roleAttribute: ClrHostAttribute;
  private readonly labelAttribute: ClrHostAttribute;
  /** Whether a navigation landmark is around the nav or inside it; see {@link hostRole}. */
  private landmarkNearby = false;

  constructor(
    private _navService: VerticalNavService,
    private _navIconService: VerticalNavIconService,
    private _navGroupRegistrationService: VerticalNavGroupRegistrationService,
    public commonStrings: ClrCommonStringsService,
    // Optional and last, so that subclasses calling `super()` with the arguments they
    // passed before keep compiling.
    @Optional() private readonly el?: ElementRef<HTMLElement>,
    @Optional() private readonly changeDetector?: ChangeDetectorRef
  ) {
    this.roleAttribute = new ClrHostAttribute(el?.nativeElement, 'role');
    this.labelAttribute = new ClrHostAttribute(el?.nativeElement, 'aria-label');
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
   * element with `role="navigation"`), or holds one the application put in it, so a page
   * does not end up with two nested ones. A `role` the application writes or binds on the
   * element is kept either way.
   */
  @HostBinding('attr.role')
  private get hostRole(): string | null {
    return this.roleAttribute.value(this.landmarkNearby ? null : 'navigation');
  }

  /**
   * A navigation landmark is named, so that it can be told apart from the header's: an
   * `aria-label` or `aria-labelledby` the application gives the element wins, and the
   * translatable `verticalNavLabel` string is used otherwise, while the nav is a landmark.
   */
  @HostBinding('attr.aria-label')
  private get hostLabel(): string | null {
    // Host bindings are evaluated in declaration order, so the role above is settled.
    const landmark =
      this.roleAttribute.current === 'navigation' && !this.el?.nativeElement.hasAttribute('aria-labelledby');
    return this.labelAttribute.value(landmark ? this.commonStrings.keys.verticalNavLabel : null);
  }

  ngOnInit() {
    this.landmarkNearby = this.nearLandmark();
  }

  /**
   * A `<nav>` the application projects under an `@if` or a loop comes and goes after the
   * role is bound, so the nav looks again once each check is done. What it finds is
   * applied on the next turn: changing a host binding within the check that bound it
   * would be an expression changed after it was checked.
   */
  ngAfterViewChecked() {
    if (this.nearLandmark() === this.landmarkNearby) {
      return;
    }
    // A promise rather than `queueMicrotask`, so that under zone.js the change lands in
    // the zone and the application checks again once it has.
    Promise.resolve().then(() => {
      const nearby = this.nearLandmark();
      if (nearby !== this.landmarkNearby) {
        this.landmarkNearby = nearby;
        this.changeDetector?.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

  toggleByButton() {
    this.collapsed = !this.collapsed;
  }

  /** Whether a navigation landmark is around the nav or inside it. */
  private nearLandmark(): boolean {
    const host = this.el?.nativeElement;
    return !!host?.parentElement?.closest(LANDMARK_SELECTOR) || !!host?.querySelector(LANDMARK_SELECTOR);
  }
}
