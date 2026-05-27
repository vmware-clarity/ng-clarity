/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, map, take } from 'rxjs/operators';

export interface SearchDocument {
  id: string;
  title: string;
  content: string;
  component: string | null;
  type: 'component' | 'page' | 'api' | 'token';
  url: string;
  tags: string[];
  indexer: string;
  metadata: Record<string, any>;
}

export interface SearchResult extends SearchDocument {
  score: number;
  terms: string[];
}

export interface SearchOptions {
  limit?: number;
  types?: Array<'component' | 'page' | 'api' | 'token'>;
  fuzzy?: number;
  prefix?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchIndex: any = null;
  private indexLoaded$ = new BehaviorSubject<boolean>(false);
  private searchCache = new Map<string, SearchResult[]>();

  constructor(private http: HttpClient) {
    this.loadSearchIndex();
  }

  /**
   * Load the pre-built search index
   */
  async loadSearchIndex(): Promise<void> {
    try {
      // Load the pre-built search index data directly
      const indexData = await this.http
        .get('/assets/compiled-content/search-index.json', { responseType: 'text' })
        .toPromise();

      if (indexData) {
        const parsedData = JSON.parse(indexData);
        // Handle both direct object and double-serialized string
        const indexObject = typeof parsedData === 'string' ? JSON.parse(parsedData) : parsedData;
        this.searchIndex = indexObject.documents || [];

        this.indexLoaded$.next(true);
        console.log('Search index loaded successfully:', this.searchIndex.length, 'documents');
      }
    } catch (error) {
      console.warn('Failed to load search index:', error);
      this.indexLoaded$.next(false);
    }
  }

  /**
   * Check if search functionality is available
   */
  isSearchAvailable(): Observable<boolean> {
    return this.indexLoaded$.asObservable();
  }

  /**
   * Perform search with given query and options
   */
  search(query: string, options: SearchOptions = {}): Observable<SearchResult[]> {
    if (!query.trim()) {
      return of([]);
    }

    // Check cache first
    const cacheKey = this.createCacheKey(query, options);
    if (this.searchCache.has(cacheKey)) {
      return of(this.searchCache.get(cacheKey) as SearchResult[]);
    }

    // Wait until the index is loaded, then run a single synchronous search
    return this.indexLoaded$.pipe(
      filter(loaded => loaded),
      take(1),
      map(() => {
        const searchQuery = query;
        if (!this.searchIndex) {
          return [];
        }

        try {
          // Simple client-side search implementation
          const lowerQuery = searchQuery.toLowerCase().trim();
          const queryTerms = lowerQuery.split(/\s+/).filter(term => term.length > 1);

          let results = this.searchIndex
            .map((doc: SearchDocument) => {
              let score = 0;
              const matchedTerms: string[] = [];
              const lowerTitle = doc.title ? doc.title.toLowerCase() : '';
              const lowerContent = doc.content ? doc.content.toLowerCase() : '';
              const lowerComponent = doc.component ? doc.component.toLowerCase() : '';

              // Helper to check for exact word boundary match
              const hasExactWord = (text: string) => {
                const escapedQuery = lowerQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                return new RegExp(`(?:^|\\b|[^a-zA-Z0-9])${escapedQuery}(?:$|\\b|[^a-zA-Z0-9])`).test(text);
              };

              // Search in title
              if (lowerTitle.includes(lowerQuery)) {
                score += 10;
                matchedTerms.push(...queryTerms.filter(term => lowerTitle.includes(term)));

                if (lowerTitle === lowerQuery) {
                  score += 100; // Exact title match
                } else if (hasExactWord(lowerTitle)) {
                  score += 40; // Exact word match in title
                }
              }

              // Search in content
              if (lowerContent.includes(lowerQuery)) {
                score += 5;
                matchedTerms.push(...queryTerms.filter(term => lowerContent.includes(term)));
              }

              // Search in tags
              if (doc.tags) {
                for (const tag of doc.tags) {
                  if (tag.toLowerCase().includes(lowerQuery)) {
                    score += 3;
                    matchedTerms.push(...queryTerms.filter(term => tag.toLowerCase().includes(term)));

                    if (tag.toLowerCase() === lowerQuery) {
                      score += 15; // Exact tag match
                    }
                  }
                }
              }

              // Search in component name
              if (lowerComponent.includes(lowerQuery)) {
                score += 8;
                matchedTerms.push(...queryTerms.filter(term => lowerComponent.includes(term)));

                if (lowerComponent === lowerQuery) {
                  score += 50; // Exact component match
                }
              }

              // Boost by document type
              if (score > 0) {
                // Boost component and page types so they naturally float above API hits
                if (doc.type === 'component') {
                  score += 30;
                }
                if (doc.type === 'page') {
                  score += 20;
                }
              }

              return score > 0
                ? {
                    ...doc,
                    score,
                    terms: [...new Set(matchedTerms)],
                  }
                : null;
            })
            .filter((result: any) => result !== null)
            .sort((a: any, b: any) => b.score - a.score);

          // Filter by content types if specified
          if (options.types && options.types.length > 0) {
            results = results.filter((result: SearchResult) => options.types.includes(result.type));
          }

          // Apply limit per category to ensure diversity of results
          if (options.limit) {
            const categorizedResults: Record<string, SearchResult[]> = {
              component: [],
              page: [],
              api: [],
              token: [],
              other: [],
            };

            // Group results by type
            for (const result of results) {
              const type = categorizedResults[result.type] ? result.type : 'other';
              categorizedResults[type].push(result);
            }

            // Define minimum guaranteed slots per category based on total limit
            const guaranteedSlots = {
              component: Math.max(3, Math.floor(options.limit * 0.3)), // e.g., 6 for limit 20
              page: Math.max(3, Math.floor(options.limit * 0.2)), // e.g., 4 for limit 20
              api: Math.max(5, Math.floor(options.limit * 0.5)), // e.g., 10 for limit 20
              token: Math.max(3, Math.floor(options.limit * 0.2)), // e.g., 4 for limit 20
              other: 3,
            };

            let finalResults: SearchResult[] = [];

            // First pass: take up to the guaranteed slots for each category
            for (const type of Object.keys(categorizedResults)) {
              const max = guaranteedSlots[type as keyof typeof guaranteedSlots] || 3;
              finalResults.push(...categorizedResults[type].slice(0, max));
              // Keep the rest for the second pass
              categorizedResults[type] = categorizedResults[type].slice(max);
            }

            // Second pass: if we haven't reached the total limit, fill with remaining items
            if (finalResults.length < options.limit) {
              const remainingItems = Object.values(categorizedResults)
                .reduce((acc, curr) => acc.concat(curr), [])
                .sort((a, b) => b.score - a.score); // sort highest score first

              const slotsLeft = options.limit - finalResults.length;
              finalResults.push(...remainingItems.slice(0, slotsLeft));
            }

            // Finally, re-sort the limited list by score and apply strict total limit
            results = finalResults.sort((a, b) => b.score - a.score).slice(0, options.limit);
          }

          // Cache results
          this.searchCache.set(cacheKey, results);

          return results;
        } catch (error) {
          console.error('Search error:', error);
          return [];
        }
      }),
      catchError(error => {
        console.error('Search service error:', error);
        return of([]);
      })
    );
  }

  /**
   * Get search suggestions for autocomplete
   */
  getSuggestions(query: string, limit: number = 5): Observable<string[]> {
    if (!query.trim()) {
      return of([]);
    }

    return this.search(query, { limit: limit * 2 }).pipe(
      map(results => {
        const suggestions = new Set<string>();

        for (const result of results) {
          // Add title as suggestion
          if (result.title.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(result.title);
          }

          // Add component name as suggestion
          if (result.component && result.component.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(result.component);
          }

          // Add relevant tags as suggestions
          for (const tag of result.tags) {
            if (tag.toLowerCase().includes(query.toLowerCase()) && tag.length > 2) {
              suggestions.add(tag);
            }
          }

          if (suggestions.size >= limit) {
            break;
          }
        }

        return Array.from(suggestions).slice(0, limit);
      })
    );
  }

  /**
   * Group search results by type
   */
  groupResultsByType(results: SearchResult[]): Record<string, SearchResult[]> {
    const grouped: Record<string, SearchResult[]> = {
      component: [],
      page: [],
      api: [],
      token: [],
    };

    for (const result of results) {
      if (grouped[result.type]) {
        grouped[result.type].push(result);
      }
    }

    return grouped;
  }

  /**
   * Clear search cache
   */
  clearCache(): void {
    this.searchCache.clear();
  }

  /**
   * Create cache key from query and options
   */
  createCacheKey(query: string, options: SearchOptions): string {
    return JSON.stringify({ query: query.toLowerCase(), options });
  }
}
