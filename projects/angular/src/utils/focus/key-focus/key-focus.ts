/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Keys } from '../../enums/keys.enum';
import { ClrFocusDirection } from './enums/focus-direction.enum';
import { FocusableItem } from './interfaces';
import { ClrKeyFocusItem } from './key-focus-item';
import { normalizeKey, preventArrowKeyScroll } from './util';

@Component({
  selector: '[clrKeyFocus]',
  template: '<ng-content></ng-content>',
})
export class ClrKeyFocus {
  constructor(private elementRef: ElementRef) {}
  @Input('clrDirection') direction: ClrFocusDirection | string = ClrFocusDirection.VERTICAL;
  @Input('clrFocusOnLoad') focusOnLoad = false;
  @Output('clrFocusChange') private focusChange = new EventEmitter<number>();
  @ContentChildren(ClrKeyFocusItem, { descendants: true })
  protected clrKeyFocusItems: QueryList<ClrKeyFocusItem>;

  private _focusableItems: Array<FocusableItem>;
  @Input('clrKeyFocus')
  /**
   * Here we use `any` cause any other type require reworking all methods below and a lot of more ifs.
   * this method will only work with array with FocusableItems anyway so any other value will be ignored.
   */
  set focusableItems(elements: Array<FocusableItem> | any) {
    // We accept a list of focusable elements (HTMLElements or existing Directives) or auto query for clrKeyFocusItem
    // We accept a list reference in the cases where we cannot use ContentChildren to query
    // ContentChildren can be unavailable if content is projected outside the scope of the component (see tabs).
    if (Array.isArray(elements) && elements.length) {
      this._focusableItems = elements as Array<FocusableItem>;
      this.initializeFocus();
    }
  }
  get focusableItems() {
    if (this._focusableItems) {
      return this._focusableItems;
    } else if (this.clrKeyFocusItems) {
      return this.clrKeyFocusItems.toArray();
    }
    return [];
  }

  get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  private _current = 0;

  get current() {
    return this._current;
  }

  set current(value: number) {
    if (this._current !== value) {
      this._current = value;
    }
  }

  get currentItem() {
    return this.focusableItems[this._current];
  }

  get currentItemElement(): HTMLElement {
    return this.currentItem.nativeElement ? this.currentItem.nativeElement : (this.currentItem as HTMLElement);
  }

  focusCurrent() {
    this.currentItem.focus();
    this.focusChange.next(this._current);
  }

  moveTo(position: number) {
    if (this.positionInRange(position)) {
      this.current = position;
      this.focusCurrent();
    }
  }

  protected subscriptions: Subscription[] = [];

  ngAfterContentInit() {
    this.subscriptions.push(this.listenForItemUpdates());
    this.initializeFocus();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @HostListener('keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Make sure event was originated on the current item's element
    if (this.currentItemElement !== event.target) {
      const position = this.getItemPosition(event.target as HTMLElement);
      if (this.positionInRange(position)) {
        this.current = position;
      }
    }

    if (this.prevKeyPressed(event) && this.currentFocusIsNotFirstItem()) {
      this.moveTo(this.current - 1);
    } else if (this.nextKeyPressed(event) && this.currentFocusIsNotLastItem()) {
      this.moveTo(this.current + 1);
    } else if (event.code === Keys.Home) {
      this.moveTo(0);
    } else if (event.code === Keys.End) {
      this.moveTo(this.focusableItems.length - 1);
    }

    preventArrowKeyScroll(event);
  }

  @HostListener('click', ['$event'])
  setClickedItemCurrent(event: any) {
    const position = this.getItemPosition(event.target);

    if (position > -1) {
      this.moveTo(position);
    }
  }

  private getItemPosition(item: HTMLElement) {
    if (this._focusableItems) {
      return this.focusableItems.indexOf(item);
    } else {
      return this.focusableItems.map(_item => _item.nativeElement).indexOf(item);
    }
  }

  protected positionInRange(position: number) {
    return position >= 0 && position < this.focusableItems.length;
  }

  protected currentFocusIsNotFirstItem() {
    return this._current - 1 >= 0;
  }

  protected currentFocusIsNotLastItem() {
    return this._current + 1 < this.focusableItems.length;
  }

  protected initializeFocus() {
    if (this.focusableItems && this.focusableItems.length) {
      // It is possible that the focus was on an element, whose index is no longer available.
      // This can happen when some of the focusable elements are being removed.
      // In such cases, the new focus is initialized on the last focusable element.
      if (this._current >= this.focusableItems.length) {
        this._current = this.focusableItems.length - 1;
      }

      if (this.focusOnLoad) {
        this.currentItem.focus();
        this.focusChange.next();
      }
    }
  }

  private listenForItemUpdates() {
    return this.clrKeyFocusItems.changes.subscribe(() => {
      this.initializeFocus();
    });
  }

  protected nextKeyPressed(event: KeyboardEvent) {
    const key = normalizeKey(event.key);

    switch (this.direction) {
      case ClrFocusDirection.VERTICAL:
        return key === Keys.ArrowDown;
      case ClrFocusDirection.HORIZONTAL:
        return key === Keys.ArrowRight;
      case ClrFocusDirection.BOTH:
        return key === Keys.ArrowDown || key === Keys.ArrowRight;
      default:
        return false;
    }
  }

  protected prevKeyPressed(event: KeyboardEvent) {
    const key = normalizeKey(event.key);

    switch (this.direction) {
      case ClrFocusDirection.VERTICAL:
        return key === Keys.ArrowUp;
      case ClrFocusDirection.HORIZONTAL:
        return key === Keys.ArrowLeft;
      case ClrFocusDirection.BOTH:
        return key === Keys.ArrowUp || key === Keys.ArrowLeft;
      default:
        return false;
    }
  }
}
