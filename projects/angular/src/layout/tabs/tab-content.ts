/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EmbeddedViewRef, Inject, Input, OnDestroy, TemplateRef, ViewChild } from '@angular/core';

import { IF_ACTIVE_ID, IfActiveService } from '../../utils/conditional/if-active.service';
import { TabsService } from './providers/tabs.service';

let nbTabContentComponents = 0;

@Component({
  selector: 'clr-tab-content',
  template: `
    <ng-template #tabContentProjectedRef>
      <section
        [id]="tabContentId"
        role="tabpanel"
        class="tab-content"
        [class.active]="active"
        [hidden]="!active"
        [attr.aria-labelledby]="ariaLabelledBy"
        [attr.aria-hidden]="!active"
      >
        <ng-content></ng-content>
      </section>
    </ng-template>
  `,
})
export class ClrTabContent implements OnDestroy {
  constructor(
    public ifActiveService: IfActiveService,
    @Inject(IF_ACTIVE_ID) public id: number,
    private tabsService: TabsService
  ) {
    if (!this.tabContentId) {
      this.tabContentId = 'clr-tab-content-' + nbTabContentComponents++;
    }
  }

  private viewRef: EmbeddedViewRef<ClrTabContent>;

  // The template must be applied on the top-down phase of view-child initialization to prevent
  // components in the content from initializing before a content container exists.
  // Some child components need their container for sizing calculations.
  @ViewChild('tabContentProjectedRef', { static: true })
  private set templateRef(value: TemplateRef<ClrTabContent>) {
    this.viewRef = this.tabsService.tabContentViewContainer.createEmbeddedView(value);
  }

  get ariaLabelledBy(): string {
    return this.tabsService.children.find(tab => tab.tabContent === this)?.tabLink?.tabLinkId;
  }

  @Input('id') tabContentId: string;

  get active() {
    return this.ifActiveService.current === this.id;
  }

  ngOnDestroy(): void {
    const index = this.tabsService.tabContentViewContainer.indexOf(this.viewRef);
    if (index > -1) {
      this.tabsService.tabContentViewContainer.remove(index);
    }
  }
}
