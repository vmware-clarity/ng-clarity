/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClrIcon } from '@clr/angular';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { IntersectionService } from './intersection.service';

interface TableOfContentsEntry {
  id: string;
  label: string;
  children?: TableOfContentsEntry[];
}

@Component({
  selector: 'app-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrl: './table-of-contents.component.scss',
  imports: [CommonModule, RouterModule, ClrIcon],
})
export class TableOfContentsComponent implements OnInit, OnChanges, OnDestroy {
  readonly scrollParent = input<HTMLElement>(document.body);

  protected activeHash: string | undefined;

  protected tableOfContents: TableOfContentsEntry[] | undefined;

  protected showScrollToTopButton = false;

  private readonly subscriptions: Subscription[] = [];
  private readonly intersectionService = new IntersectionService();
  private scrollToTopIntersectionObserver: IntersectionObserver | undefined;

  private headingSelector = 'h2[id],h3[id][data-toc-item]';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private element: ElementRef
  ) {}

  ngOnInit() {
    // set active hash
    this.subscriptions.push(
      this.intersectionService.activeHashChange.subscribe(activeHash => {
        this.activeHash = activeHash;
      }),
      this.activatedRoute.params.pipe(debounceTime(0)).subscribe(() => {
        // Tab-switching case requires the cleanup here
        this.intersectionService.cleanupSections();
        const headingElements = Array.from(document.body.querySelectorAll<HTMLHeadingElement>(this.headingSelector));
        this.intersectionService.initialize(this.scrollParent(), this.headingSelector);
        this.tableOfContents = getTableOfContents(headingElements);
      })
    );

    // We need to know if TOC is visible, so we show/hide the scroll-to-top button
    const intersectionObserverOptions: IntersectionObserverInit = {
      root: document.body,
      rootMargin: '0px',
    };

    this.scrollToTopIntersectionObserver = new IntersectionObserver(entries => {
      this.showScrollToTopButton = !entries[0].isIntersecting;
    }, intersectionObserverOptions);

    this.scrollToTopIntersectionObserver.observe(this.element.nativeElement);

    this.intersectionService.debounce();
    this.activeHash = window.location.hash.replace('#', '');
  }

  ngOnChanges(changes: SimpleChanges) {
    // Skip the initialization,
    // only update on dynamic changes of the scrollParent
    if (changes.scrollParent?.previousValue) {
      this.intersectionService.updateObserver(changes.scrollParent.currentValue, true);
      // The layout has changed too much, the user is already lost.
      // We get back to the ToC
      this.scrollToTop();
    }
  }

  ngOnDestroy(): void {
    this.scrollToTopIntersectionObserver?.disconnect();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.intersectionService.destroy();
  }

  // We enable/disable smooth scrolling with each click, so that it does not cause undesired
  // scrolls while landing on a URL with hash or switching between tabs
  protected smoothScroll(enable: boolean) {
    if (enable) {
      this.scrollParent().style.scrollBehavior = 'smooth';
    } else {
      // We need a slight timeout for the animation to have already started,
      // before switching the smooth scrolling off
      setTimeout(() => {
        this.scrollParent().style.scrollBehavior = 'auto';
      }, 100);
    }
  }

  protected onClick(hash: string) {
    this.intersectionService.debounce();
    this.activeHash = hash;
  }

  protected scrollToTop() {
    this.intersectionService.debounce();
    this.activeHash = this.tableOfContents?.[0]?.id;
    if (window.location.hash && this.activeHash) {
      window.location.hash = this.activeHash;
    }
    document.body.querySelector('.table-of-contents')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function getTableOfContents(headingElements: HTMLHeadingElement[]) {
  const flatEntries = headingElements.map(headingElement => ({
    id: headingElement.id,
    label: headingElement.innerText,
    tagName: headingElement.tagName,
  }));

  const entries: TableOfContentsEntry[] = [];

  for (const entry of flatEntries) {
    switch (entry.tagName) {
      case 'H2':
        entries.push({
          id: entry.id,
          label: entry.label,
          children: [],
        });
        break;
      case 'H3':
        entries[entries.length - 1]?.children?.push({
          id: entry.id,
          label: entry.label,
        });
    }
  }
  return entries;
}
