/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Directive, ElementRef, HostListener, Inject, Input } from '@angular/core';
import {
  focusElement,
  getFlattenedFocusableItems,
  initializeKeyListItems,
  KeyNavigationCode,
  setActiveKeyListItem,
  validKeyNavigationCode,
} from '@cds/core/internal';

import { FOCUSABLE_ELEMENT_SELECTORS } from './providers/focusable-items';
import { CLR_LIST_KEY_NAVIGATION_CONFIG } from './providers/key-navigation-list.config';
import { getNextKeyListItem } from './utils';

export interface KeyNavigationListConfig {
  keyListItems: string;
  layout: 'both' | 'horizontal' | 'vertical';
  manageFocus: boolean;
  manageTabindex: boolean;
  loop: boolean;
  dir: string | null;
}

@Directive({
  selector: '[clrKeyNavigationList]',
})
export class ClrKeyNavigationList implements AfterViewInit {
  private config: KeyNavigationListConfig;

  @Input()
  set configuration(config: Partial<KeyNavigationListConfig>) {
    this.config = {
      ...this.defaultConfig,
      dir: this.getClosestDirAttribute(),
      ...config,
    };
  }

  constructor(
    private host: ElementRef<HTMLElement>,
    @Inject(CLR_LIST_KEY_NAVIGATION_CONFIG) private defaultConfig: KeyNavigationListConfig,
    @Inject(FOCUSABLE_ELEMENT_SELECTORS) private focusableElementSelectors: string[]
  ) {
    this.config = {
      ...this.defaultConfig,
      dir: this.getClosestDirAttribute(),
    };
  }

  ngAfterViewInit() {
    this.initializeTabIndex();
  }

  @HostListener('click', ['$event'])
  onClick(e: Event) {
    this.clickItem(e);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    this.focusItem(e);
  }

  private initializeTabIndex() {
    if (this.config.manageFocus && this.config.manageTabindex) {
      initializeKeyListItems(this.getListItems());
    }
  }

  private clickItem(e: Event) {
    const activeItem = this.getActiveItem(e);
    if (activeItem) {
      this.setActiveItem(e, activeItem);
    }
  }

  private focusItem(e: KeyboardEvent) {
    if (validKeyNavigationCode(e)) {
      const activeItem = this.getActiveItem(e);
      if (activeItem) {
        const listItems = this.getListItems();
        const { next, previous } = getNextKeyListItem(activeItem, Array.from(listItems), {
          ...this.config,
          dir: this.getClosestDirAttribute(),
          code: e.code as KeyNavigationCode,
        });

        if (next !== previous) {
          this.setActiveItem(e, listItems[next], listItems[previous]);
        }
      }
    }
  }

  private getActiveItem(e: Event) {
    const listItems = this.getListItems();
    return Array.from(listItems).find(
      c => c === (e.target as HTMLElement).closest(listItems[0].tagName.toLocaleLowerCase()) ?? c === e.target
    );
  }

  private setActiveItem(e: any, activeItem: HTMLElement, previousItem?: HTMLElement) {
    if (this.config.manageFocus) {
      if (this.config.manageTabindex) {
        setActiveKeyListItem(this.getListItems(), activeItem);
      }

      const items = getFlattenedFocusableItems(activeItem);
      const item = items[0] ?? activeItem;
      focusElement(item);
      e.preventDefault();
    }

    activeItem.dispatchEvent(
      new CustomEvent('cdsKeyChange', {
        bubbles: true,
        detail: {
          activeItem,
          previousItem,
          code: e.code,
          metaKey: e.ctrlKey || e.metaKey,
          keyListItems: this.config.keyListItems,
        },
      })
    );
  }

  private getListItems(): NodeListOf<HTMLElement> {
    return this.host.nativeElement.querySelectorAll(this.focusableElementSelectors.join(','));
  }

  private getClosestDirAttribute() {
    const el = this.host.nativeElement.closest('[dir]');
    return el ? el.getAttribute('dir') : null;
  }
}
