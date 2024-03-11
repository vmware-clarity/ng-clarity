/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  ViewContainerRef,
} from '@angular/core';

import { IF_ACTIVE_ID, IfActiveService } from '../../utils/conditional/if-active.service';
import { TemplateRefContainer } from '../../utils/template-ref/template-ref-container';
import { TabsLayout } from './enums/tabs-layout.enum';
import { TabsService } from './providers/tabs.service';
import { TABS_ID } from './tabs-id.provider';

let nbTabLinkComponents = 0;

@Directive({
  selector: '[clrTabLink]',
  host: {
    '[class.btn]': 'true',
    role: 'tab',
    type: 'button',
  },
})
export class ClrTabLink {
  @Input('id') @HostBinding('id') tabLinkId: string;

  templateRefContainer: TemplateRefContainer;

  private _inOverflow: boolean;

  constructor(
    public ifActiveService: IfActiveService,
    @Inject(IF_ACTIVE_ID) readonly id: number,
    public el: ElementRef,
    private cfr: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private tabsService: TabsService,
    @Inject(TABS_ID) public tabsId: number
  ) {
    if (!this.tabLinkId) {
      this.tabLinkId = 'clr-tab-link-' + nbTabLinkComponents++;
    }

    // Tab links can be rendered in one of two places: in the main area or inside the overflow dropdown menu.
    // Here, we create a container so that its template can be used to create embeddedView on the fly.
    // See TabsService's renderView() method and how it's used in Tabs class for an example.
    const factory = this.cfr.resolveComponentFactory(TemplateRefContainer);
    this.templateRefContainer = this.viewContainerRef.createComponent(factory, undefined, undefined, [
      [this.el.nativeElement],
    ]).instance;
  }

  @Input('clrTabLinkInOverflow')
  get inOverflow(): boolean {
    return this._inOverflow && this.tabsService.layout !== TabsLayout.VERTICAL;
  }
  set inOverflow(inOverflow) {
    this._inOverflow = inOverflow;
  }

  @HostBinding('class.btn-link')
  @HostBinding('class.nav-link')
  get addLinkClasses() {
    return !this.inOverflow;
  }

  @HostBinding('attr.aria-controls')
  get ariaControls(): string {
    return this.tabsService.children.find(tab => tab.tabLink === this)?.tabContent?.tabContentId;
  }

  @HostBinding('class.active')
  @HostBinding('attr.aria-selected')
  get active() {
    return this.ifActiveService.current === this.id;
  }

  @HostBinding('attr.tabindex')
  get tabindex() {
    return this.active ? 0 : -1;
  }

  @HostListener('click')
  activate() {
    this.ifActiveService.current = this.id;
  }
}
