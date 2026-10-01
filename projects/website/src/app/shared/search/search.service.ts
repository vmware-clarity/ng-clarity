/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import MiniSearch from 'minisearch';
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
  private miniSearch: MiniSearch | null = null;
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
      const indexData = await this.http
        .get('/assets/compiled-content/search-index.json', { responseType: 'text' })
        .toPromise();

      if (indexData) {
        // Handle both direct object and double-serialized string
        const parsedData = JSON.parse(indexData);
        const indexObject = typeof parsedData === 'string' ? JSON.parse(parsedData) : parsedData;

        this.miniSearch = MiniSearch.loadJS(indexObject, {
          fields: ['title', 'content', 'tags'],
          storeFields: ['title', 'url', 'type', 'component', 'indexer', 'metadata', 'tags'],
        });

        this.indexLoaded$.next(true);
        console.log('Search index loaded successfully with MiniSearch');
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

    const cacheKey = this.createCacheKey(query, options);
    if (this.searchCache.has(cacheKey)) {
      return of(this.searchCache.get(cacheKey) as SearchResult[]);
    }

    return this.indexLoaded$.pipe(
      filter(loaded => loaded),
      take(1),
      map(() => {
        if (!this.miniSearch) {
          return [];
        }

        try {
          const lowerQuery = query.toLowerCase().trim();

          // Execute search using MiniSearch
          let searchResults = this.miniSearch.search(lowerQuery, {
            prefix: term => term.length > 2,
            fuzzy: term => (term.length > 3 ? 0.2 : false),
            boost: { title: 3, tags: 1.5, content: 1 },
            boostDocument: (documentId, term, storedFields) => {
              if (storedFields) {
                // Boost components and pages to prioritize them over APIs
                if (storedFields.type === 'component') {
                  return 2.5;
                }
                if (storedFields.type === 'page') {
                  return 1.8;
                }
                if (storedFields.type === 'api') {
                  return 0.8;
                }
              }
              return 1.0;
            },
          }) as unknown as SearchResult[];

          // Filter by types if specified
          if (options.types && options.types.length > 0) {
            searchResults = searchResults.filter(result => options.types.includes(result.type));
          }

          // Format results to make sure we return clean arrays and types
          let results = searchResults.map(res => ({
            ...res,
            tags: res.tags || [],
            component: res.component || null,
          })) as SearchResult[];

          // Apply guaranteed slots per category if a total limit is requested
          if (options.limit && results.length > options.limit) {
            const categorizedResults: Record<string, SearchResult[]> = {
              component: [],
              page: [],
              api: [],
              token: [],
              other: [],
            };

            for (const result of results) {
              const type = categorizedResults[result.type] ? result.type : 'other';
              categorizedResults[type].push(result);
            }

            // Define minimum guaranteed slots per category based on total limit
            const guaranteedSlots = {
              component: Math.max(3, Math.floor(options.limit * 0.3)),
              page: Math.max(3, Math.floor(options.limit * 0.2)),
              api: Math.max(5, Math.floor(options.limit * 0.5)),
              token: Math.max(3, Math.floor(options.limit * 0.2)),
              other: 3,
            };

            const finalResults: SearchResult[] = [];

            // First pass: take up to the guaranteed slots for each category
            for (const type of Object.keys(categorizedResults)) {
              const max = guaranteedSlots[type as keyof typeof guaranteedSlots] || 3;
              finalResults.push(...categorizedResults[type].slice(0, max));
              categorizedResults[type] = categorizedResults[type].slice(max);
            }

            // Second pass: fill remaining capacity with the highest scoring items regardless of category
            if (finalResults.length < options.limit) {
              const remainingItems = Object.values(categorizedResults)
                .reduce((acc, curr) => acc.concat(curr), [])
                .sort((a, b) => b.score - a.score);

              const slotsLeft = options.limit - finalResults.length;
              finalResults.push(...remainingItems.slice(0, slotsLeft));
            }

            results = finalResults.sort((a, b) => b.score - a.score).slice(0, options.limit);
          } else if (options.limit) {
            results = results.slice(0, options.limit);
          }

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
          if (result.title.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(result.title);
          }

          if (result.component && result.component.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(result.component);
          }

          if (result.tags) {
            for (const tag of result.tags) {
              if (tag.toLowerCase().includes(query.toLowerCase()) && tag.length > 2) {
                suggestions.add(tag);
              }
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
