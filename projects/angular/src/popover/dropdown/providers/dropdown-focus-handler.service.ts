/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnDestroy, Optional, PLATFORM_ID, Renderer2, SkipSelf } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ClrPopoverService } from '../../../utils';
import { ArrowKeyDirection } from '../../../utils/focus/arrow-key-direction.enum';
import { FocusService } from '../../../utils/focus/focus.service';
import { customFocusableItemProvider } from '../../../utils/focus/focusable-item/custom-focusable-item-provider';
import { FocusableItem } from '../../../utils/focus/focusable-item/focusable-item';
import { Linkers } from '../../../utils/focus/focusable-item/linkers';
import { wrapObservable } from '../../../utils/focus/wrap-observable';
import { uniqueIdFactory } from '../../../utils/id-generator/id-generator.service';

@Injectable()
export class DropdownFocusHandler implements OnDestroy, FocusableItem {
  id = uniqueIdFactory();
  focusBackOnTriggerWhenClosed = false;

  right?: Observable<FocusableItem>;
  down?: Observable<FocusableItem>;
  up?: Observable<FocusableItem>;

  private _trigger: HTMLElement;
  private _container: HTMLElement;
  private children: ReplaySubject<FocusableItem[]>;
  private _unlistenFuncs: (() => void)[] = [];

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
    if (!parent) {
      this.handleRootFocus();
    }
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
      this.renderer.listen(el, 'keydown.tab', event => this.popoverService.toggleWithEvent(event))
    );

    // The root container is the only one we register to the focus service, others do not need focus
    this.focusService.registerContainer(el);

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
    this._unlistenFuncs.forEach((unlisten: () => void) => unlisten());

    this.focusService.detachListeners(this.container);
  }

  /**
   * If the dropdown was opened by clicking on the trigger, we automatically move to the first item
   */
  moveToFirstItemWhenOpen() {
    const subscription = this.popoverService.openChange.subscribe(open => {
      if (open && this.popoverService.originalEvent) {
        // Even if we properly waited for ngAfterViewInit, the container still wouldn't be attached to the DOM.
        // So setTimeout is the only way to wait for the container to be ready to move focus to first item.
        setTimeout(() => {
          this.focusService.moveTo(this);
          if (this.parent) {
            this.focusService.move(ArrowKeyDirection.RIGHT);
          } else {
            this.focusService.move(ArrowKeyDirection.DOWN);
          }
        });
      }
    });

    this._unlistenFuncs.push(() => subscription.unsubscribe());
  }

  /**
   * Focus on the menu when it opens, and focus back on the root trigger when the whole dropdown becomes closed
   */
  handleRootFocus() {
    const subscription = this.popoverService.openChange.subscribe(open => {
      if (!open) {
        // We reset the state of the focus service both on initialization and when closing.
        this.focusService.reset(this);
        // But we only actively focus the trigger when closing, not on initialization.
        if (this.focusBackOnTriggerWhenClosed) {
          this.focus();
        }
      }
      this.focusBackOnTriggerWhenClosed = open;
    });

    this._unlistenFuncs.push(() => subscription.unsubscribe());
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
