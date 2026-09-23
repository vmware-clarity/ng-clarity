/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, effect, ElementRef, EventEmitter, inject, input, Output } from '@angular/core';
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
            [class.focused]="i === activeIndex()"
            [attr.aria-selected]="i === activeIndex()"
            [routerLink]="[result.entry.url]"
            [fragment]="result.entry.fragment"
            (click)="resultSelected.emit(result.entry)"
          >
            <div cds-text="bold uppercase">
              <app-search-highlight [text]="result.entry.category" [query]="query()" />
            </div>
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
  styleUrl: './search-results-panel.component.scss',
  imports: [RouterModule, SearchHighlightComponent],
})
export class SearchResultsPanelComponent {
  readonly results = input<SearchResult[]>([]);
  readonly query = input('');
  readonly activeIndex = input(-1);

  @Output() resultSelected = new EventEmitter<SearchIndexEntry>();

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
