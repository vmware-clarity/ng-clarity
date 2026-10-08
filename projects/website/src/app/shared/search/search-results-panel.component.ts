/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, effect, ElementRef, EventEmitter, inject, input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SearchHighlightComponent } from './search-highlight.component';
import { FullTextResult, SearchResult } from './search-index.model';

@Component({
  selector: 'app-search-results-panel',
  template: `
    <div id="site-search-listbox" class="dropdown-menu search-results-list" role="listbox" aria-label="Search results">
      @if (!results().length && !fullTextResults().length) {
        <div class="search-result-empty">
          @if (fullTextLoading()) {
            Searching page content…
          } @else {
            No results found for "{{ query() }}"
          }
        </div>
      }
      @for (result of results(); track result.entry.url + '#' + (result.entry.fragment ?? ''); let i = $index) {
        <a
          class="dropdown-item search-result-row"
          role="option"
          [id]="'search-result-' + i"
          [class.focused]="i === activeIndex()"
          [attr.aria-selected]="i === activeIndex()"
          [routerLink]="[result.entry.url]"
          [fragment]="result.entry.fragment"
          (click)="resultSelected.emit()"
        >
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
          <div cds-text="bold uppercase">
            <app-search-highlight [text]="result.entry.category" [query]="query()" />
          </div>
        </a>
      }
      @if (fullTextResults().length) {
        <div class="dropdown-header search-result-full-text-header" role="presentation">In page content</div>
      }
      <!-- Continues the same option ids/activeIndex after the heading results, so keyboard
           navigation moves through both lists as one. -->
      @for (result of fullTextResults(); track result.url + '#' + (result.fragment ?? ''); let i = $index) {
        <a
          class="dropdown-item search-result-row search-result-full-text"
          role="option"
          [id]="'search-result-' + (results().length + i)"
          [class.focused]="results().length + i === activeIndex()"
          [attr.aria-selected]="results().length + i === activeIndex()"
          [routerLink]="[result.url]"
          [fragment]="result.fragment"
          (click)="resultSelected.emit()"
        >
          <div class="search-result-heading">
            <span class="search-result-breadcrumb">
              {{ result.title }}
              @if (result.heading !== result.title) {
                <span class="search-result-separator"> › </span>
                {{ result.heading }}
              }
            </span>
            <div cds-text="bold uppercase">{{ result.category }}</div>
          </div>
          <span class="search-result-snippet">
            @for (segment of result.snippet; track $index) {
              @if (segment.matched) {
                <mark>{{ segment.text }}</mark>
              } @else {
                {{ segment.text }}
              }
            }
          </span>
        </a>
      }
    </div>
  `,
  styleUrl: './search-results-panel.component.scss',
  imports: [RouterModule, SearchHighlightComponent],
})
export class SearchResultsPanelComponent {
  readonly results = input<SearchResult[]>([]);
  readonly fullTextResults = input<FullTextResult[]>([]);
  readonly fullTextLoading = input(false);
  readonly query = input('');
  readonly activeIndex = input(-1);

  @Output() resultSelected = new EventEmitter<void>();

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Same approach as ComboboxFocusHandler.scrollIntoSelectedModel: keyboard navigation only
  // moves an index, it never scrolls the list on its own, so the active row must be scrolled
  // into view manually whenever activeIndex changes.
  constructor() {
    effect(() => {
      const index = this.activeIndex();

      if (index < 0) {
        return;
      }

      this.elementRef.nativeElement
        .querySelector(`#search-result-${index}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    });
  }
}
