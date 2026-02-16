/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClrIconModule, ClrTabsModule } from '@clr/angular';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { DocTabComponent } from './doc-tab.component';
import { DocTabsLinkCardsLinksPipe } from './doc-tabs-link-cards-links.pipe';
import { getFeatureFlags } from '../../feature-flags';
import { HashListenerDirective } from '../hash-listener/hash-listener.directive';
import { LinkCardsComponent } from '../link-cards/link-cards.component';
import { SiteFooterComponent } from '../site-footer/site-footer.component';
import { TableOfContentsComponent } from '../table-of-contents/table-of-contents.component';

@Component({
  selector: 'app-doc-tabs',
  templateUrl: './doc-tabs.component.html',
  styleUrl: './doc-tabs.component.scss',
  host: {
    role: 'main',
  },
  imports: [
    CommonModule,
    RouterModule,
    ClrIconModule,
    ClrTabsModule,
    HashListenerDirective,
    LinkCardsComponent,
    SiteFooterComponent,
    TableOfContentsComponent,
    DocTabsLinkCardsLinksPipe,
  ],
})
export class DocTabsComponent implements AfterViewInit, OnDestroy {
  @Input() title = '';
  @Input() type: string | undefined;
  @Input() storybookPath: string | undefined;

  @ViewChild('doxContent', { read: ElementRef }) doxContent: ElementRef | undefined;
  scrollParent: HTMLElement | undefined;

  readonly componentURL: string;
  readonly currentTab: Observable<string>;
  readonly currentTabComponent: Observable<DocTabComponent | undefined>;
  readonly availableTabs: Record<string, boolean> = {};
  readonly componentPath: string;
  readonly storybookURL = 'https://storybook.clarity.design/?path=/story/';

  protected readonly accessibilityEnabled = getFeatureFlags().accessibility;

  private readonly tabComponents = new ReplaySubject<QueryList<DocTabComponent>>();
  private scrollTitle: boolean | undefined;

  // On smallest screens (less than 576) the scrolling parent gets changed.
  // We start scrolling the title and tabs list too.
  private resizeObserver = new ResizeObserver(entries => {
    if (entries[0].contentRect.width <= 576 && !this.scrollTitle) {
      this.scrollParent = this.element.nativeElement.parentNode;
      this.scrollTitle = true;
    } else if (entries[0].contentRect.width > 576 && (this.scrollTitle || this.scrollTitle === undefined)) {
      this.scrollParent = this.doxContent?.nativeElement;
      this.scrollTitle = false;
    }
  });

  constructor(
    private route: ActivatedRoute,
    private browserTitle: Title,
    private element: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    // This will only happen if the route configuration is changed and this code is not updated.
    if (!this.route.snapshot.parent) {
      throw new Error('Please update the DocTabsComponent constructor after route configuration changes.');
    }

    this.componentPath = this.route.snapshot.parent.url[0].path;
    this.componentURL = `/documentation/${this.componentPath}`;

    this.currentTab = this.route.params.pipe(
      tap(scrollTop),
      map(({ tab }) => tab || 'overview')
    );

    const tabComponents: Observable<QueryList<DocTabComponent>> = this.tabComponents.pipe(
      switchMap(tabs => tabs.changes.pipe(startWith(tabs))),
      shareReplay(1)
    );

    this.currentTabComponent = combineLatest([this.currentTab, tabComponents]).pipe(
      map(([currentTab, tabComponents]) => tabComponents.find(tabComponent => tabComponent.tab === currentTab))
    );

    this.resizeObserver.observe(document.body);
  }

  @ContentChildren(DocTabComponent)
  set _tabComponents(tabComponents: QueryList<DocTabComponent>) {
    this.tabComponents.next(tabComponents);
  }

  ngAfterViewInit() {
    this.browserTitle.setTitle(`${this.title} - Clarity Design System`);

    // virtual scroller dynamic nature need detect changes to represent datagrid properly
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}

function scrollTop() {
  document.querySelector('#moveTop')?.scrollIntoView();
}
