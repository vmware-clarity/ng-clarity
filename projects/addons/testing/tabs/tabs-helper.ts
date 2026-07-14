/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DebugElement, EmbeddedViewRef, Predicate } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ClrTab, ClrTabContent, ClrTabs } from '@clr/angular/layout/tabs';

export class TabsHelper {
  private tabs: DebugElement;
  private component: ClrTabs;

  constructor(contextDebugElement: DebugElement) {
    const tabsElementMatches: Array<DebugElement> = contextDebugElement.queryAll(By.directive(ClrTabs));

    if (!tabsElementMatches.length) {
      throw Error('No tabs found under passed context element');
    } else if (tabsElementMatches.length > 1) {
      throw Error('Unable to isolate targeted instance of tabs widget');
    } else {
      this.tabs = tabsElementMatches[0];
      this.component = this.tabs.injector.get<ClrTabs>(ClrTabs);
    }
  }

  /**
   * Discover clarity tab links of (zero or more) items within the tabs.
   */
  getLinkList(): Array<DebugElement> {
    return this.tabs.queryAll(By.css(`[role="tablist"] > [role="presentation"] > [clrTabLink]`));
  }

  /**
   * A DOM pointer to a tab link, as afforded by supplied index into collection.
   */
  findLink(linkIndex: number): DebugElement | undefined {
    return this.getLinkList()[linkIndex];
  }

  /**
   * Retrieves the active Clarity Tab instance.
   */
  getActiveTab(): ClrTab {
    return this.component.tabsService.activeTab;
  }

  /**
   * Determines the active shown tab using relative sequences that map directly to DOM source order.
   */
  getActiveTabIndex(): number {
    return this.component.tabLinkDirectives.findIndex(
      tabLink => tabLink.tabLinkId === this.component.tabsService.activeTab.tabLink.tabLinkId
    );
  }

  /**
   * Extract located projected content as provided for the active tab.
   */
  getActiveTabContentElement(): HTMLElement | undefined {
    const evr = this.getActiveTab().tabContent['viewRef'] as EmbeddedViewRef<ClrTabContent>;
    return evr ? ((evr.rootNodes[0] as HTMLElement).firstElementChild as HTMLElement) || undefined : undefined;
  }

  /**
   * Clicks a tab link given the tab index.
   */
  clickLink(linkIndex: number): void {
    const tabLink = this.component.tabLinkDirectives[linkIndex];
    try {
      tabLink.activate();
    } catch {
      throw Error('No tab link found at index ' + linkIndex);
    }
  }

  /**
   * Searches for tab link text, as applied to a tab button.
   */
  findLinkText(linkIndex: number): string | undefined {
    const tabLinkElement = this.findLink(linkIndex);
    return tabLinkElement ? tabLinkElement.nativeElement.textContent.trim() : undefined;
  }

  /**
   * Debug element for the icon found inside the tab link.
   */
  findLinkIcon(linkIndex: number): DebugElement | undefined {
    const tabLinkElement = this.findLink(linkIndex);
    return (tabLinkElement && tabLinkElement.query(By.css('cds-icon'))) || undefined;
  }

  /**
   * Optionally find the custom component or desired HTML element within the active panel.
   */
  findContentView(childTabContentQuery?: Predicate<DebugElement>): DebugElement | undefined {
    const panel = this.tabs.query(By.css(`section.active`));
    return panel && childTabContentQuery ? panel.query(childTabContentQuery) || undefined : panel || undefined;
  }

  areTabsVisible(): boolean {
    const tabsPanel = this.tabs.query(By.css(`.nav`));
    return getComputedStyle(tabsPanel.nativeElement)['display'] !== 'none';
  }
}
