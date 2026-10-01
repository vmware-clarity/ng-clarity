/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { SearchResult, SearchService } from './search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  imports: [CommonModule, RouterModule, ClarityModule],
})
export class SearchResultsComponent implements OnChanges {
  @Input() results: SearchResult[] = [];
  @Input() query: string = '';
  @Input() groupByType: boolean = true;
  @Input() showResultCount: boolean = true;

  @Output() resultSelected = new EventEmitter<SearchResult>();

  groupedResults: Record<string, SearchResult[]> = {};
  resultTypes: string[] = [];

  constructor(private searchService: SearchService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results'] || changes['groupByType']) {
      this.organizeResults();
    }
  }

  /**
   * Organize results by type if grouping is enabled
   */
  organizeResults(): void {
    if (this.groupByType) {
      this.groupedResults = this.searchService.groupResultsByType(this.results);
      this.resultTypes = Object.keys(this.groupedResults).filter(type => this.groupedResults[type].length > 0);

      // Sort types by priority
      this.resultTypes.sort((a, b) => {
        const typePriority = { component: 0, page: 1, api: 2, token: 3 };
        return (
          (typePriority[a as keyof typeof typePriority] || 99) - (typePriority[b as keyof typeof typePriority] || 99)
        );
      });
    } else {
      this.groupedResults = { all: this.results };
      this.resultTypes = this.results.length > 0 ? ['all'] : [];
    }
  }

  /**
   * Handle result selection
   */
  onResultSelected(result: SearchResult): void {
    this.resultSelected.emit(result);
  }

  /**
   * Get display name for result type
   */
  getTypeDisplayName(type: string): string {
    const typeNames = {
      component: 'Components',
      page: 'Pages',
      api: 'API Documentation',
      token: 'Design Tokens',
      all: 'All Results',
    };
    return typeNames[type as keyof typeof typeNames] || type;
  }

  /**
   * Get icon for result type
   */
  getTypeIcon(type: string): string {
    const typeIcons = {
      component: 'shapes',
      page: 'document',
      api: 'code',
      token: 'palette',
      all: 'search',
    };
    return typeIcons[type as keyof typeof typeIcons] || 'help';
  }

  /**
   * Get result icon based on type
   */
  getResultIcon(result: SearchResult): string {
    const iconMap = {
      component: 'shapes',
      page: 'document',
      api: 'code',
      token: 'palette',
    };
    return iconMap[result.type] || 'help';
  }

  /**
   * Highlight search terms in text
   */
  highlightSearchTerms(text: string): string {
    if (!this.query || !text) {
      return text;
    }

    const terms = this.query
      .toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 1);
    let highlightedText = text;

    for (const term of terms) {
      const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    }

    return highlightedText;
  }

  /**
   * Escape special characters for regex
   */
  escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get truncated content for display
   */
  getTruncatedContent(content: string, maxLength: number = 150): string {
    if (!content) {
      return '';
    }
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  }

  /**
   * TrackBy function for performance
   */
  trackByType(index: number, type: string): string {
    return type;
  }

  /**
   * TrackBy function for results
   */
  trackByResult(index: number, result: SearchResult): string {
    return result.id;
  }
}
