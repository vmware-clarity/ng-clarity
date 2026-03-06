/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Input, OnDestroy, output, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription, tap } from 'rxjs';

import { DocTabComponent } from './doc-tab.component';
import { DocTabsComponent } from './doc-tabs.component';

@Directive({
  selector: '[appIfTabActive]',
})
export class DocTabActiveDirective implements OnDestroy {
  readonly activeChange = output<boolean>({ alias: 'appIfTabActiveChange' });
  private subscription: Subscription;
  private isActive = false;

  constructor(
    private tabs: DocTabsComponent,
    private tab: DocTabComponent,
    private template: TemplateRef<any>,
    private container: ViewContainerRef
  ) {
    const tabValue = tab.tab();
    if (tabValue) {
      this.checkAndUpdateView(tabValue);
    }

    this.subscription = tabs.currentTab
      .pipe(
        tap(tab => {
          this.checkAndUpdateView(tab);
        })
      )
      .subscribe();
  }

  @Input('appIfTabActive')
  get active() {
    return this.isActive;
  }
  set active(value: boolean | string) {
    // we can't really set it on the DocTabs
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updateView(value: boolean) {
    if (value) {
      this.container.createEmbeddedView(this.template);
    } else {
      this.container.clear();
    }
  }

  private checkAndUpdateView(tab: string) {
    const isNowActive = this.tab.tab() === tab;
    // only emit if the new active state is changed since last time.
    if (isNowActive !== this.isActive) {
      this.updateView(isNowActive);
      this.activeChange.emit(isNowActive);
      this.isActive = isNowActive;
    }
  }
}
