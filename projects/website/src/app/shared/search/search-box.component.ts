/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ClrPopoverHostDirective,
  ClrPopoverModuleNext,
  ClrPopoverPosition,
  ClrPopoverService,
  ClrPopoverType,
} from '@clr/angular';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FullTextSearchService } from './full-text-search.service';
import { FullTextResult, SearchIndexEntry, SearchResult } from './search-index.model';
import { SearchIndexService } from './search-index.service';
import { searchIndex } from './search-match.util';
import { SearchResultsPanelComponent } from './search-results-panel.component';

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 150;
// Queries this long, or with this many words, are treated as sentences/phrases and also go to the
// full-text index; so does any query the heading index can't answer.
const FULL_TEXT_MIN_LENGTH = 25;
const FULL_TEXT_MIN_WORDS = 3;

// Built on the same ClrPopoverHostDirective/clrPopoverOrigin/*clrPopoverContent primitives
// ClrCombobox uses for its own text-input-with-live-filtered-dropdown pattern, so positioning
// (with viewport-aware flipping), outside-click-to-close, escape-to-close, and scroll handling
// all come from the Angular CDK overlay instead of being hand-rolled here.
@Component({
  selector: 'app-search-box',
  template: `
    <form class="search" clrPopoverOrigin (submit)="$event.preventDefault()">
      <label for="site-search-input">
        <input
          #searchInput
          id="site-search-input"
          type="text"
          placeholder="Search clarity.design..."
          autocomplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-label="Search clarity.design"
          aria-keyshortcuts="Control+K Meta+K"
          aria-controls="site-search-listbox"
          [attr.aria-expanded]="isOpen"
          [attr.aria-activedescendant]="activeIndex >= 0 ? 'search-result-' + activeIndex : null"
          (input)="onInput($event)"
          (click)="onClick($event)"
          (keydown)="onKeydown($event)"
        />
      </label>
    </form>
    <app-search-results-panel
      *clrPopoverContent="isOpen; at: popoverPosition; type: popoverType"
      [results]="results"
      [fullTextResults]="fullTextResults"
      [fullTextLoading]="fullTextLoading"
      [query]="query"
      [activeIndex]="activeIndex"
      (resultSelected)="closePanel()"
    />
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;

        .search:before {
          top: 0;
        }
      }
    `,
  ],
  host: {
    '(document:keydown)': 'onDocumentKeydown($event)',
  },
  hostDirectives: [ClrPopoverHostDirective],
  imports: [ClrPopoverModuleNext, SearchResultsPanelComponent],
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  protected query = '';
  protected results: SearchResult[] = [];
  protected fullTextResults: FullTextResult[] = [];
  protected fullTextLoading = false;
  protected activeIndex = -1;
  protected readonly popoverPosition = ClrPopoverPosition.BOTTOM_LEFT;
  protected readonly popoverType = ClrPopoverType.DROPDOWN;

  private readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  private entries: SearchIndexEntry[] = [];
  private readonly querySubject = new Subject<string>();
  // Incremented per search so a slow full-text response can't overwrite a newer query's results.
  private searchId = 0;
  private readonly subscriptions: Subscription[] = [];

  private readonly router = inject(Router);
  private readonly searchIndexService = inject(SearchIndexService);
  private readonly fullTextSearchService = inject(FullTextSearchService);
  private readonly popoverService = inject(ClrPopoverService);

  protected get isOpen(): boolean {
    return this.popoverService.open;
  }

  private get resultCount() {
    return this.results.length + this.fullTextResults.length;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.searchIndexService.getIndex().subscribe(entries => {
        this.entries = entries;
      }),
      this.querySubject.pipe(debounceTime(DEBOUNCE_MS), distinctUntilChanged()).subscribe(query => {
        this.runSearch(query);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  protected onInput(event: Event) {
    this.query = (event.target as HTMLInputElement).value;
    this.querySubject.next(this.query);
  }

  // Ctrl+K (Windows/Linux) / Cmd+K (macOS) focuses the search box from anywhere on the page,
  // overriding the browser's own Ctrl+K (focus the address-bar search).
  protected onDocumentKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.searchInput().nativeElement.focus();
      this.searchInput().nativeElement.select();
    }
  }

  protected onClick(event: MouseEvent) {
    if (this.query.trim().length >= MIN_QUERY_LENGTH) {
      this.popoverService.openEvent = event;
      this.runSearch(this.query);
    }
  }

  protected onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.runSearch(this.query);
        }
        this.activeIndex = Math.min(this.activeIndex + 1, this.resultCount - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - 1, 0);
        break;
      case 'Enter':
        if (this.activeIndex >= 0 && this.activeIndex < this.resultCount) {
          event.preventDefault();
          this.navigateToResult(this.activeIndex);
        }
        break;
      case 'Escape':
        // The overlay's own escape handling only listens for keydowns inside its content, and
        // focus stays on this input the whole time, so this is still needed here.
        this.closePanel();
        break;
    }
  }

  protected closePanel() {
    this.popoverService.open = false;
    this.activeIndex = -1;
  }

  // Only used for the Enter key: a mouse click on a result is handled by the row's own
  // routerLink, so re-navigating here would trigger a redundant second navigation.
  // Heading results come first, full-text results continue the same index (see the panel).
  private navigateToResult(index: number) {
    const target =
      index < this.results.length ? this.results[index].entry : this.fullTextResults[index - this.results.length];

    this.router.navigate([target.url], { fragment: target.fragment });
    this.closePanel();
  }

  private runSearch(query: string) {
    const trimmedQuery = query.trim();

    const searchId = ++this.searchId;
    this.fullTextResults = [];
    this.fullTextLoading = false;

    if (trimmedQuery.length < MIN_QUERY_LENGTH) {
      this.results = [];
      this.popoverService.open = false;
      this.activeIndex = -1;
      return;
    }

    this.results = searchIndex(this.entries, trimmedQuery);
    this.popoverService.open = true;
    this.activeIndex = -1;

    if (this.shouldSearchFullText(trimmedQuery)) {
      this.fullTextLoading = true;
      this.fullTextSearchService.search(trimmedQuery).then(results => {
        if (searchId !== this.searchId) {
          return;
        }

        // Skip sections the heading index already listed.
        const shown = new Set(this.results.map(({ entry }) => `${entry.url}#${entry.fragment ?? ''}`));
        this.fullTextResults = results.filter(result => !shown.has(`${result.url}#${result.fragment ?? ''}`));
        this.fullTextLoading = false;
      });
    }
  }

  private shouldSearchFullText(query: string) {
    return (
      !this.results.length || query.length >= FULL_TEXT_MIN_LENGTH || query.split(/s+/).length >= FULL_TEXT_MIN_WORDS
    );
  }
}
