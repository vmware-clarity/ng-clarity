/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/member-ordering */

import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import type { ClrPopoverPoint } from '@clr/angular/popover/common';
import { ClrDropdown } from '@clr/angular/popover/dropdown';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { Menu } from './menu.interface';
import { MenuActionComponent } from './model/menu-action.component';
import { MenuItem, MenuItemType } from './model/menu-item.token';
import { NestedMenu } from './model/nested-menu';

@Component({
  selector: 'appfx-menu',
  standalone: false,
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss'],
  providers: [
    {
      provide: MenuItem,
      useExisting: forwardRef(() => MenuComponent),
    },
  ],
})
/**
 * A contextual menu based on `clr-dropdown`
 *
 * The notable features added on top of the generic `clr-dropdown` and describe in further details below are:
 * + positioning based on anchor point instead of anchor button
 * + positioning and scrolling taking into account an encompassing container which in the primary use-case is the viewport
 * + domain specific declarative interface instead of custom HTML markup
 */
export class MenuComponent extends NestedMenu implements Menu, OnInit, OnDestroy, AfterContentInit {
  private trigger?: HTMLElement;

  private openingEvent: Event;

  itemTypes = MenuItemType;

  anchorPoint: ClrPopoverPoint = { x: 0, y: 0 };

  /**
   * The text that will be displayed as label of a nested menu
   */
  @Input() declare text: string;

  @Output() opened: EventEmitter<void> = new EventEmitter<void>();

  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(ClrDropdown) dropdown: ClrDropdown;

  @ViewChild(ClrDropdown, { read: ElementRef }) dropdownElRef: ElementRef<HTMLElement>;

  @ContentChildren(MenuItem) declare menuItems: QueryList<MenuItem>;

  currentZoomLevel: ZoomLevel;
  ZoomLevel = ZoomLevel;

  private subscriptions = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() private zoomLevelService?: ZoomLevelService
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.zoomLevelService) {
      return;
    }
    this.subscriptions.add(
      this.zoomLevelService.onChange.subscribe((zoomLevel: ZoomLevel) => {
        const prevZoomLevel = this.currentZoomLevel;
        this.currentZoomLevel = zoomLevel;

        // Close the action menu if zoom happens.
        // The user will need to reopen it in which case the menu calculations
        // will be done and it will be displayed correctly.
        if (prevZoomLevel !== undefined && prevZoomLevel !== this.currentZoomLevel) {
          this.closed.emit();
        }
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  show(e: Event, x: number, y: number, trigger?: HTMLElement): void {
    this.trigger = trigger;
    this.anchorPoint = { x, y };
    this.dropdown.popoverService.openChange.pipe(first(open => !open)).subscribe(() => {
      this.trigger?.focus();
      this.closed.emit();
    });
    this.dropdown.popoverService.openChange.pipe(first(open => open)).subscribe(() => this.opened.emit());
    this.dropdown.openAtPoint(this.anchorPoint, trigger);
    this.dropdown.popoverService.openEvent = e;
    this.openingEvent = e;
  }

  ngAfterContentInit(): void {
    this.menuItems.changes.subscribe(() => {
      throw new Error(
        `Dear developer.

            You see this error because the set of menu items has changed.

            Usually, adding or removing an item is causing the menu to shrink or expand suddenly, which is considered a bad UX.

            Please don't try to avoid the error by delaying the opening of the menu. It's going to degrade the performance.

            Instead, show all items and disable those, which are unavailable asynchronously.`
      );
    });
  }

  close(e: Event): void {
    if (this.dropdown.popoverService.open) {
      this.dropdown.popoverService.toggleWithEvent(e);
    }
  }

  handleAction(actionItem: MenuActionComponent): void {
    if (actionItem.enabled) {
      if (this.trigger) {
        this.trigger.focus();
      }
      actionItem.handle.next();
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  documentContextMenu(event: Event): void {
    if (this.dropdownElRef.nativeElement.contains(event.target as Node) || event === this.openingEvent) {
      //if the contextmenu event is within the menu or
      //the event is the one opening the menu
      //then do nothing
      event.preventDefault();
    } else {
      //if the contextmenu is outside close the menu to prevent showing multiple menus
      this.close(event);
    }
  }

  protected menuHasIcons(menuItems: Iterable<MenuItem>): boolean {
    for (const item of menuItems) {
      if ((item as any).iconClass) {
        return true;
      }
    }

    return false;
  }

  protected getIconClass(iconClass: string, menuHasIcons: boolean): string {
    if (iconClass) {
      return iconClass;
    }

    if (menuHasIcons) {
      return 'no-icon-item';
    }

    return '';
  }
}
