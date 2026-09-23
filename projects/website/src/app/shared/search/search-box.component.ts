/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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

import { SearchIndexEntry, SearchResult } from './search-index.model';
import { SearchIndexService } from './search-index.service';
import { searchIndex } from './search-match.util';
import { SearchResultsPanelComponent } from './search-results-panel.component';

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 150;

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
          id="site-search-input"
          type="text"
          placeholder="Search clarity.design..."
          autocomplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-label="Search clarity.design"
          aria-controls="site-search-listbox"
          [attr.aria-expanded]="isOpen"
          [attr.aria-activedescendant]="activeIndex >= 0 ? 'search-result-' + activeIndex : null"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (keydown)="onKeydown($event)"
        />
      </label>
    </form>
    <app-search-results-panel
      *clrPopoverContent="isOpen; at: popoverPosition; type: popoverType"
      [results]="results"
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
  hostDirectives: [ClrPopoverHostDirective],
  imports: [ClrPopoverModuleNext, SearchResultsPanelComponent],
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  protected query = '';
  protected results: SearchResult[] = [];
  protected activeIndex = -1;
  protected readonly popoverPosition = ClrPopoverPosition.BOTTOM_LEFT;
  protected readonly popoverType = ClrPopoverType.DROPDOWN;

  private entries: SearchIndexEntry[] = [];
  private readonly querySubject = new Subject<string>();
  private readonly subscriptions: Subscription[] = [];

  private readonly router = inject(Router);
  private readonly searchIndexService = inject(SearchIndexService);
  private readonly popoverService = inject(ClrPopoverService);

  protected get isOpen(): boolean {
    return this.popoverService.open;
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

  protected onFocus() {
    if (this.query.trim().length >= MIN_QUERY_LENGTH) {
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
        this.activeIndex = Math.min(this.activeIndex + 1, this.results.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - 1, 0);
        break;
      case 'Enter':
        if (this.activeIndex >= 0 && this.results[this.activeIndex]) {
          event.preventDefault();
          this.navigateToEntry(this.results[this.activeIndex].entry);
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
  private navigateToEntry(entry: SearchIndexEntry) {
    this.router.navigate([entry.url], { fragment: entry.fragment });
    this.closePanel();
  }

  private runSearch(query: string) {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < MIN_QUERY_LENGTH) {
      this.results = [];
      this.popoverService.open = false;
      this.activeIndex = -1;
      return;
    }

    this.results = searchIndex(this.entries, trimmedQuery);
    this.popoverService.open = true;
    this.activeIndex = -1;
  }
}
