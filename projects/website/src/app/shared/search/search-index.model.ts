/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export interface PageSearchEntry {
  kind: 'page';
  url: string;
  title: string;
  category: string;
  fragment?: undefined;
}

export interface HeadingSearchEntry {
  kind: 'heading';
  url: string;
  fragment: string;
  title: string;
  category: string;
  section?: string;
  heading: string;
}

export type SearchIndexEntry = PageSearchEntry | HeadingSearchEntry;

export interface SearchResult {
  entry: SearchIndexEntry;
  tier: number;
  matchStartsWith: boolean;
}

export interface HighlightSegment {
  text: string;
  matched: boolean;
}
