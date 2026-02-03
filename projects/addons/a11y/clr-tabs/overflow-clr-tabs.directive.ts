/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  OnDestroy,
  QueryList,
  Renderer2,
} from '@angular/core';
import { ClrTab, ClrTabLink, ClrTabs } from '@clr/angular';
import { merge, of, Subscription } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';

import { ElementResizeService } from '../resize/element-resize.service';

export const resources = {
  layoutChangesDebounceDuration: 10,
  initialLoadDelay: 250,
  clrTabLinkClasses: ['btn-link', 'nav-link'],
  appfxSecondaryTabButtonClass: 'appfx-tab-button',
};

/**
 * Automatically include the tab links in overflow if there is not enough width.
 *
 * This directive relies on the following Clarity internals:
 * 1. ClrTabLink:
 * <code>
 *    @HostBinding('class.btn-link')
 *    @HostBinding('class.nav-link')
 *    get addLinkClasses() {...}
 * </code>
 *
 * 2. ClrTabs:
 * <code>
 *    @ContentChildren(ClrTab) private tabs: QueryList<ClrTab>;
 *
 *    private _tabOverflowEl: HTMLElement;
 * </code>
 */
@Directive({
  selector: 'clr-tabs [appfxOverflowTabs]',
  standalone: false,
})
export class OverflowClrTabsDirective implements AfterViewInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();
  private parentElement: HTMLElement;
  private tabOverflowEl: HTMLElement;

  constructor(
    private cdr: ChangeDetectorRef,
    private element: ElementRef,
    private renderer: Renderer2,
    private clrTabsComponent: ClrTabs,
    private elementResizeService: ElementResizeService
  ) {}

  ngAfterViewInit() {
    this.setup();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private setup() {
    this.patchOverflowContent();

    const tabs: QueryList<ClrTab> = this.clrTabsComponent['tabs'];
    this.parentElement = this.renderer.parentNode(this.element.nativeElement) as HTMLElement;
    this.subscription.add(
      merge(
        tabs.changes,
        of(undefined).pipe(delay(resources.initialLoadDelay)),
        this.elementResizeService.getResizeObservable(this.parentElement)
      )
        .pipe(debounceTime(resources.layoutChangesDebounceDuration))
        .subscribe(() => this.updateOverflowMenu(this.parentElement))
    );
  }

  /**
   * When the More button (...) is clicked, ClrTabOverflowContent is displayed.
   * It is a dropdown with style 'bottom-right'. However when there is just one tab,
   * the overflow component overflows to the left of the viewport and is not visible.
   * This method overrides private field in ClrTabs - _tabOverflowEl - that is set when
   * the ClrTabOverflowContent is created. If all tabs are in overflow, then change the
   * style of &lt;clr-tab-overflow-content&gt; element so that it takes the entire width
   * of the viewport.
   */
  private patchOverflowContent(): void {
    Object.defineProperty(this.clrTabsComponent, '_tabOverflowEl', <PropertyDescriptor>{
      get: () => this.tabOverflowEl,
      set: (el: HTMLElement) => {
        this.tabOverflowEl = el;
        if (!this.tabOverflowEl) {
          return;
        }

        const tabLinks: ClrTabLink[] = this.clrTabsComponent.tabLinkDirectives;
        const allTabsInOverflow = tabLinks.every((tabLink: ClrTabLink) => tabLink.inOverflow);
        if (allTabsInOverflow) {
          this.renderer.setStyle(this.tabOverflowEl, 'left', 0);
          this.renderer.setStyle(this.tabOverflowEl, 'position', 'fixed');
          this.renderer.setStyle(this.tabOverflowEl, 'top', 'auto');
        }
      },
    });
  }

  /**
   * Determine which tab links to be shelved into the overflow menu.
   */
  private updateOverflowMenu(container: HTMLElement): void {
    const tabLinks: ClrTabLink[] = this.clrTabsComponent.tabLinkDirectives;
    this.showAllTabs(tabLinks);

    const clrTabLinkMargin = this.calculateTabLinkMargin(tabLinks);
    this.updateTabsInOverflow(tabLinks, clrTabLinkMargin, container);
  }

  private showAllTabs(tabLinks: ClrTabLink[]): void {
    let overflowStateChanged = false;
    // Move all tabs out of overflow, then update the underlying view to sync the shifted tabs.
    tabLinks.forEach((tabLink: ClrTabLink) => {
      if (tabLink.inOverflow) {
        overflowStateChanged = true;
        tabLink.inOverflow = false;
        // Hidden tabs are displayed, but their style is like regular button. They are
        // wider and this affect the overflow calculation. Temporary add link classes
        // for more precise width calculation.
        this.addTabLinkClasses(tabLink);
      }
    });

    // Trigger change detection only if the overflow of tabs was changed.
    if (overflowStateChanged) {
      this.cdr.detectChanges();
    }
  }

  private calculateTabLinkMargin(tabLinks: ClrTabLink[]): number {
    if (tabLinks.length < 2) {
      return 0;
    }

    const firstLinkEl: HTMLElement = tabLinks[0].el.nativeElement as HTMLElement;
    const secondLinkEl: HTMLElement = tabLinks[1].el.nativeElement as HTMLElement;
    return secondLinkEl.getBoundingClientRect().left - firstLinkEl.getBoundingClientRect().right;
  }

  private updateTabsInOverflow(tabLinks: ClrTabLink[], clrTabLinkMargin: number, container: HTMLElement): void {
    let areNextTabLinksOverflowing = false;
    tabLinks.forEach((tabLink: ClrTabLink) => {
      if (!areNextTabLinksOverflowing) {
        tabLink.inOverflow = areNextTabLinksOverflowing = this.isTabLinkOverflowing(
          container,
          clrTabLinkMargin,
          tabLink
        );
      } else {
        // presume and hide remaining tabs
        tabLink.inOverflow = true;
      }

      // Manually restore the classes that ClrTabLink adds to its parent button.
      // Change detection updates the visibility of the tabs, but does not
      // update the @HostBinding properly.
      if (tabLink.inOverflow) {
        this.removeTabLinkClasses(tabLink);
      } else {
        this.addTabLinkClasses(tabLink);
      }
    });

    // as tabs may have shifted position in/out of menu, synchronize view
    this.cdr.detectChanges();
  }

  private isTabLinkOverflowing(container: HTMLElement, clrTabLinkMargin: number, tabLink: ClrTabLink): boolean {
    const containerBcr: DOMRect = container.getBoundingClientRect();
    const clrTabLinkEl: HTMLElement = tabLink.el.nativeElement;
    const clrTabLinkElementBcr: DOMRect = clrTabLinkEl.getBoundingClientRect();
    // layout decision making process for showing or hiding a tab
    // include natural margin around tab and guarantee some inset padding for the "..." against right edge
    return clrTabLinkElementBcr.right + clrTabLinkMargin > containerBcr.right - clrTabLinkMargin;
  }

  private addTabLinkClasses(tabLink: ClrTabLink): void {
    const buttonClassList = tabLink.el.nativeElement.classList;
    if (buttonClassList.contains(resources.appfxSecondaryTabButtonClass)) {
      // when appfx tabs are rendered as secondary tabs, no need to adjust the tab link classes.
      return;
    }

    resources.clrTabLinkClasses.forEach((cssClass: string) =>
      this.renderer.addClass(tabLink.el.nativeElement, cssClass)
    );
  }

  private removeTabLinkClasses(tabLink: ClrTabLink): void {
    resources.clrTabLinkClasses.forEach((cssClass: string) =>
      this.renderer.removeClass(tabLink.el.nativeElement, cssClass)
    );
  }
}
