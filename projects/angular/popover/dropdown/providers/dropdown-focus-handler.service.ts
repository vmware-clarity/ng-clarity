/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnDestroy, Optional, PLATFORM_ID, Renderer2, SkipSelf } from '@angular/core';
import { ClrPopoverService } from '@clr/angular/popover/common';
import {
  ArrowKeyDirection,
  customFocusableItemProvider,
  FocusableItem,
  FocusService,
  Linkers,
  uniqueIdFactory,
  wrapObservable,
} from '@clr/angular/utils';
import { EMPTY, Observable, of, ReplaySubject, Subject, Subscription, timer } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
@Injectable()
export class DropdownFocusHandler implements OnDestroy, FocusableItem {
  id = uniqueIdFactory();

  right?: Observable<FocusableItem>;
  down?: Observable<FocusableItem>;
  up?: Observable<FocusableItem>;

  private _trigger: HTMLElement;
  private _container: HTMLElement;
  private children: ReplaySubject<FocusableItem[]>;
  private _unlistenFuncs: (() => void)[] = [];
  private readonly subscriptions = new Subscription();
  private readonly recoverFocus = new Subject<void>();

  constructor(
    private renderer: Renderer2,
    @SkipSelf()
    @Optional()
    private parent: DropdownFocusHandler,
    private popoverService: ClrPopoverService,
    private focusService: FocusService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.resetChildren();
    this.moveToFirstItemWhenOpen();
    this.subscriptions.add(
      popoverService.openChange
        .pipe(
          switchMap(open =>
            open
              ? this.recoverFocus.pipe(
                  switchMap(() => timer(0)),
                  switchMap(() =>
                    document.activeElement === document.body ? (parent ? this.right : this.down).pipe(take(1)) : EMPTY
                  )
                )
              : EMPTY
          )
        )
        .subscribe(item => item && focusService.moveTo(item))
    );
  }

  get trigger() {
    return this._trigger;
  }
  set trigger(el: HTMLElement) {
    this._trigger = el;

    if (this.parent) {
      this._unlistenFuncs.push(
        this.renderer.listen(el, 'keydown.arrowright', event => this.popoverService.toggleWithEvent(event))
      );
    } else {
      this._unlistenFuncs.push(
        this.renderer.listen(el, 'keydown.arrowup', event => this.popoverService.toggleWithEvent(event))
      );
      this._unlistenFuncs.push(
        this.renderer.listen(el, 'keydown.arrowdown', event => this.popoverService.toggleWithEvent(event))
      );
    }
  }

  get container() {
    return this._container;
  }

  set container(el: HTMLElement) {
    this._container = el;

    // whether root container or not, tab key should always toggle (i.e. close) the container
    this._unlistenFuncs.push(
      this.renderer.listen(el, 'keydown.tab', event => this.popoverService.toggleWithEvent(event)),
      this.renderer.listen(el, 'keydown.shift.tab', event => this.popoverService.toggleWithEvent(event))
    );

    // All containers are registered to the focus service.
    this.focusService.registerContainer(el);

    this._unlistenFuncs.push(this.renderer.listen(el, 'focusout', () => this.recoverFocus.next()));

    if (this.parent) {
      // if it's a nested container, pressing escape has the same effect as pressing left key, which closes the current
      // popup and moves up to its parent. Here, we stop propagation so that the parent container
      // doesn't receive the escape keydown
      this._unlistenFuncs.push(
        this.renderer.listen(el, 'keydown.escape', event => {
          this.focusService.move(ArrowKeyDirection.LEFT);
          event.stopPropagation();
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this._unlistenFuncs.forEach((unlisten: () => void) => unlisten());

    this.focusService.detachListeners(this.container);
  }

  /**
   * If the dropdown was opened by clicking on the trigger, we automatically move to the first item
   */
  moveToFirstItemWhenOpen() {
    this.subscriptions.add(
      this.popoverService.openChange
        .pipe(switchMap(open => (open && this.popoverService.openEvent ? timer(0) : EMPTY)))
        .subscribe(() => {
          this.focusService.moveTo(this);
          this.focusService.move(this.parent ? ArrowKeyDirection.RIGHT : ArrowKeyDirection.DOWN);
        })
    );
  }

  focus() {
    if (this.trigger && isPlatformBrowser(this.platformId)) {
      this.trigger.focus();
    }
  }

  blur() {
    if (this.trigger && isPlatformBrowser(this.platformId)) {
      this.trigger.blur();
    }
  }

  activate() {
    if (isPlatformBrowser(this.platformId)) {
      this.trigger.click();
    }
  }

  /**
   * Makes `item` the one the menu's keyboard handling acts on, and focuses it.
   *
   * Space and enter activate whatever the focus service considers current, not whatever the browser
   * has focused - see `FocusService.registerContainer`. So moving focus to a menu item without going
   * through here leaves the two disagreeing, and the keys then fire a different item than the one the
   * user can see is focused.
   */
  moveTo(item: FocusableItem) {
    // Opening the menu already moves to its first item, which focuses it, which is reported back
    // here by the item itself. Without this the same move would be applied twice.
    if (this.focusService.current === item) {
      return;
    }

    this.focusService.moveTo(item);
  }

  resetChildren() {
    this.children = new ReplaySubject<FocusableItem[]>(1);
    if (this.parent) {
      this.right = this.openAndGetChildren().pipe(map(all => all[0]));
    } else {
      this.down = this.openAndGetChildren().pipe(map(all => all[0]));
      this.up = this.openAndGetChildren().pipe(map(all => all[all.length - 1]));
    }
  }

  addChildren(children: FocusableItem[]) {
    Linkers.linkVertical(children);
    if (this.parent) {
      Linkers.linkParent(children, this.closeAndGetThis(), ArrowKeyDirection.LEFT);
    }
    this.children.next(children);
  }

  private openAndGetChildren() {
    return wrapObservable(this.children, () => (this.popoverService.open = true));
  }

  private closeAndGetThis() {
    return wrapObservable(of(this), () => (this.popoverService.open = false));
  }
}

export const DROPDOWN_FOCUS_HANDLER_PROVIDER = customFocusableItemProvider(DropdownFocusHandler);
