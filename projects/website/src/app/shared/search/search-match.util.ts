/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HighlightSegment, SearchIndexEntry, SearchResult } from './search-index.model';

const MAX_RESULTS = 20;

export function searchIndex(entries: SearchIndexEntry[], query: string): SearchResult[] {
  const results: SearchResult[] = [];

  for (const entry of entries) {
    const result = matchEntry(entry, query);

    if (result) {
      results.push(result);
    }
  }

  return rankResults(results);
}

export function splitForHighlight(text: string, query: string): HighlightSegment[] {
  if (!query) {
    return [{ text, matched: false }];
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const segments: HighlightSegment[] = [];
  let i = 0;

  while (i < text.length) {
    const index = lowerText.indexOf(lowerQuery, i);

    if (index === -1) {
      segments.push({ text: text.slice(i), matched: false });
      break;
    }

    if (index > i) {
      segments.push({ text: text.slice(i, index), matched: false });
    }

    segments.push({ text: text.slice(index, index + query.length), matched: true });
    i = index + query.length;
  }

  return segments;
}

// Checked in priority order so a query matching a heading (e.g. "Horizontal Inline") ranks
// above a query that only matches the page it lives on.
function matchEntry(entry: SearchIndexEntry, query: string): SearchResult | null {
  const lowerQuery = query.toLowerCase();
  const fields: [string, number][] =
    entry.kind === 'heading'
      ? [
          [entry.heading, 1],
          [entry.section ?? '', 2],
          [entry.title, 3],
          [entry.category, 4],
        ]
      : [
          [entry.title, 3],
          [entry.category, 4],
        ];

  for (const [field, tier] of fields) {
    const index = field.toLowerCase().indexOf(lowerQuery);

    if (index !== -1) {
      return { entry, tier, matchStartsWith: index === 0 };
    }
  }

  return null;
}

function rankResults(results: SearchResult[]): SearchResult[] {
  return results
    .sort(
      (a, b) =>
        a.tier - b.tier ||
        Number(!a.matchStartsWith) - Number(!b.matchStartsWith) ||
        a.entry.title.localeCompare(b.entry.title)
    )
    .slice(0, MAX_RESULTS);
}
