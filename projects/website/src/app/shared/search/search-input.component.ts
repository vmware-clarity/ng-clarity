/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClarityIcons, ClarityModule, searchIcon, timesIcon } from '@clr/angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';

import { SearchHighlightService } from './search-highlight.service';
import { SearchResult, SearchService } from './search.service';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, ClarityModule],
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  @Input() placeholder: string = 'Search';
  @Input() debounceTime: number = 300;
  @Input() maxResults: number = 20;
  @Input() showSuggestions: boolean = true;

  @Output() searchResults = new EventEmitter<SearchResult[]>();
  @Output() searchQuery = new EventEmitter<string>();
  @Output() resultSelected = new EventEmitter<SearchResult>();

  searchControl = new FormControl('');
  results: SearchResult[] = [];
  suggestions: string[] = [];
  isLoading = false;
  isSearchAvailable = false;
  showResults = false;
  selectedIndex = -1;

  private destroy$ = new Subject<void>();

  constructor(
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private highlightService: SearchHighlightService
  ) {
    ClarityIcons.addIcons(searchIcon, timesIcon);
  }

  ngOnInit(): void {
    // Listen to URL parameters to populate search input on page load or back navigation
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['hl'] && this.searchControl.value !== params['hl']) {
        this.searchControl.setValue(params['hl'], { emitEvent: false });
        setTimeout(() => {
          if (this.searchInput) {
            this.searchInput.nativeElement.focus();
          }
        });
      }
    });

    // Check if search is available
    this.searchService
      .isSearchAvailable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(available => {
        this.isSearchAvailable = available;
      });

    // Set up search with debouncing
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        switchMap(query => this.handleSearch(query || '')),
        takeUntil(this.destroy$)
      )
      .subscribe();

    // Set up global keyboard shortcuts
    this.setupGlobalKeyboardShortcuts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle search query
   */
  handleSearch(query: string) {
    this.searchQuery.emit(query);

    // Dynamically update the highlight on the page as the user types or clears the field
    this.highlightService.updateHighlightTerm(query);

    if (!query.trim()) {
      this.clearResults();
      return this.searchService.search(''); // Returns empty observable
    }

    this.isLoading = true;

    return this.searchService.search(query, { limit: this.maxResults }).pipe(
      tap(results => {
        this.results = results;
        this.showResults = true;
        this.selectedIndex = -1;
        this.isLoading = false;
        this.searchResults.emit(results);
      })
    );
  }

  /**
   * Handle keyboard events inside the combobox input
   */
  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateResults(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateResults(-1);
        break;
      case 'Enter':
        event.preventDefault();
        this.selectCurrentResult();
        break;
      case 'Escape':
        event.preventDefault();
        this.clearResults();
        this.searchInput.nativeElement.blur();
        break;
    }
  }

  /**
   * Navigate through search results
   */
  navigateResults(direction: number): void {
    if (this.results.length === 0) {
      return;
    }

    const newIndex = this.selectedIndex + direction;

    if (newIndex >= -1 && newIndex < this.results.length) {
      this.selectedIndex = newIndex;
    } else if (direction > 0 && newIndex >= this.results.length) {
      this.selectedIndex = 0;
    } else if (direction < 0 && newIndex < -1) {
      this.selectedIndex = this.results.length - 1;
    }

    // Scroll active item into view inside the dropdown listbox
    if (this.selectedIndex >= 0) {
      setTimeout(() => {
        const activeElement = document.getElementById(`search-result-${this.selectedIndex}`);
        if (activeElement) {
          activeElement.scrollIntoView({ block: 'nearest' });
        }
      });
    }
  }

  /**
   * Select the currently highlighted result
   */
  selectCurrentResult(): void {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.results.length) {
      this.selectResult(this.results[this.selectedIndex]);
    } else if (this.results.length > 0) {
      // If no result is selected, select the first one
      this.selectResult(this.results[0]);
    }
  }

  /**
   * Select a search result
   */
  selectResult(result: SearchResult): void {
    this.resultSelected.emit(result);

    // Pass the search term as a query parameter for highlighting
    // For API/Component results, highlight the specific item name if possible
    // For pages, highlight the matched terms or the user's query
    let highlightTerm = this.searchControl.value;
    if (result.type === 'api' || result.type === 'token') {
      highlightTerm = result.title;
    } else if (result.terms && result.terms.length > 0) {
      highlightTerm = result.terms[0];
    }

    this.router.navigate([result.url], {
      queryParams: highlightTerm ? { hl: highlightTerm } : {},
    });

    this.clearResults();
    if (highlightTerm) {
      this.searchControl.setValue(highlightTerm, { emitEvent: false });
      this.searchInput.nativeElement.focus();
    } else {
      this.searchControl.setValue('', { emitEvent: false });
      this.searchInput.nativeElement.blur();
    }
  }

  /**
   * Select result by index (for mouse clicks)
   */
  selectResultByIndex(index: number): void {
    if (index >= 0 && index < this.results.length) {
      this.selectResult(this.results[index]);
    }
  }

  /**
   * Highlight result on hover
   */
  highlightResult(index: number): void {
    this.selectedIndex = index;
  }

  /**
   * Clear search results
   */
  clearResults(): void {
    this.results = [];
    this.showResults = false;
    this.selectedIndex = -1;
    this.isLoading = false;
  }

  /**
   * Clear search input
   */
  clearSearch(): void {
    this.searchControl.setValue('');
    this.clearResults();
    this.searchInput.nativeElement.focus();
  }

  /**
   * Handle input focus
   */
  onFocus(): void {
    if (this.results.length > 0) {
      this.showResults = true;
    }
  }

  /**
   * Handle input blur (with delay to allow clicks)
   */
  onBlur(): void {
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }

  /**
   * Get display text for a result
   */
  getResultDisplayText(result: SearchResult): string {
    if (result.type === 'api' && result.component) {
      const compName = result.component
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return `${result.title} (${compName})`;
    }
    return result.title;
  }

  /**
   * Get result type label
   */
  getResultTypeLabel(result: SearchResult): string {
    const typeLabels = {
      component: 'Component',
      page: 'Page',
      api: 'API',
      token: 'Token',
    };
    return typeLabels[result.type] || result.type;
  }

  /**
   * Get result icon class
   */
  getResultIconClass(result: SearchResult): string {
    const iconClasses = {
      component: 'shapes',
      page: 'document',
      api: 'code',
      token: 'palette',
    };
    return iconClasses[result.type] || 'help';
  }

  /**
   * TrackBy function for ngFor performance
   */
  trackByResultId(index: number, result: SearchResult): string {
    return result.id;
  }

  /**
   * Setup global keyboard shortcuts (Ctrl+K or Cmd+K to focus search)
   */
  setupGlobalKeyboardShortcuts(): void {
    document.addEventListener('keydown', event => {
      // Ctrl+K or Cmd+K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        this.searchInput.nativeElement.focus();
        this.searchInput.nativeElement.select();
      }
    });
  }
}
