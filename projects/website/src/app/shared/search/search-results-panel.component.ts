/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchHighlightComponent } from './search-highlight.component';
import { SearchIndexEntry, SearchResult } from './search-index.model';

@Component({
  selector: 'app-search-results-panel',
  template: `
    <ul id="site-search-listbox" class="search-results-list" role="listbox" aria-label="Search results">
      @if (!results().length) {
        <li class="search-result-empty">No results found for "{{ query() }}"</li>
      }
      @for (result of results(); track result.entry.url + '#' + (result.entry.fragment ?? ''); let i = $index) {
        <li>
          <a
            class="search-result-row"
            role="option"
            [id]="'search-result-' + i"
            [class.active]="i === activeIndex()"
            [attr.aria-selected]="i === activeIndex()"
            [routerLink]="[result.entry.url]"
            [fragment]="result.entry.fragment"
            (click)="resultSelected.emit(result.entry)"
          >
            <span class="search-result-category">{{ result.entry.category }}</span>
            <span class="search-result-breadcrumb">
              <app-search-highlight [text]="result.entry.title" [query]="query()" />
              @if (result.entry.kind === 'heading') {
                @if (result.entry.section) {
                  <span class="search-result-separator"> › </span>
                  <app-search-highlight [text]="result.entry.section" [query]="query()" />
                }
                <span class="search-result-separator"> › </span>
                <app-search-highlight [text]="result.entry.heading" [query]="query()" />
              }
            </span>
          </a>
        </li>
      }
    </ul>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 320px;
        max-width: 480px;
      }
      .search-results-list {
        margin: 0;
        padding: 4px 0;
        list-style: none;
        max-height: 60vh;
        overflow-y: auto;
        background-color: var(--clr-signpost-content-bg-color);
        color: var(--clr-signpost-content-color);
        border: 1px solid var(--clr-signpost-content-border-color);
        border-radius: var(--clr-signpost-border-radius);
        box-shadow: 0 2px 8px rgb(140 140 140 / 25%);
      }
      .search-result-row {
        display: block;
        padding: 6px 12px;
        text-decoration: none;
        color: inherit;
        overflow: hidden;
        white-space: nowrap;

        &:hover,
        &.active {
          background-color: color-mix(in srgb, var(--clr-signpost-content-color) 10%, transparent);
        }
      }
      .search-result-category {
        display: block;
        font-size: 0.6875rem;
        text-transform: uppercase;
        opacity: 0.7;
      }
      .search-result-breadcrumb {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .search-result-empty {
        padding: 6px 12px;
        opacity: 0.7;
      }
    `,
  ],
  imports: [RouterModule, SearchHighlightComponent],
})
export class SearchResultsPanelComponent {
  readonly results = input<SearchResult[]>([]);
  readonly query = input('');
  readonly activeIndex = input(-1);

  @Output() resultSelected = new EventEmitter<SearchIndexEntry>();
}
