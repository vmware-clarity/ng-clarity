/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { FullTextResult, HighlightSegment } from './search-index.model';

// Fallback for long/sentence queries the heading index can't answer. Reads the sharded index
// written by writeFullTextIndex() in projects/website/scripts/generate-search-index.js, fetching
// meta.json once and then only the word shards / text chunks a query needs.

// [url, fragment, title, heading, category, headingWords, totalWords]
type SectionMeta = [string, string | null, string, string, string, number, number];
type WordShard = Record<string, number[][]>;

interface QueryTerm {
  term: string;
  offset: number;
}

interface TermMatch {
  score: number;
  positions: number[];
}

interface RankedSection {
  id: number;
  score: number;
  phrase: boolean;
}

const BASE_URL = '/fulltext';
const CHUNK_SIZE = 16; // must match FULL_TEXT_CHUNK_SIZE in generate-search-index.js
const STOP_WORDS = new Set(
  (
    'the a an and or of to in is it for on with as by be this that are can you your from at use used ' +
    'when which not how what why where who do does did should would could will my me i we our its into about while ' +
    'there their then than so if any some all also just get using'
  ).split(' ')
);

// BM25 parameters, field boosts and the phrase bonus that always puts an exact phrase on top.
const K1 = 1.2;
const B = 0.75;
const HEADING_BOOST = 4;
const TITLE_BOOST = 2;
const PREFIX_WEIGHT = 0.5;
const MIN_PREFIX_LENGTH = 3;
const PHRASE_BONUS = 1000;
const SNIPPET_CONTEXT_WORDS = 2;
const SNIPPET_MAX_SPAN = 12;

@Injectable({ providedIn: 'root' })
export class FullTextSearchService {
  private readonly httpClient = inject(HttpClient);

  private meta?: Promise<{ sections: SectionMeta[]; averageLength: number }>;
  private readonly shards = new Map<string, Promise<WordShard>>();
  private readonly textChunks = new Map<number, Promise<string[]>>();

  async search(query: string, limit = 10): Promise<FullTextResult[]> {
    const quoted = /^\s*".*"\s*$/.test(query);
    // Each kept word remembers its offset in the full token list, so phrase checks can skip
    // over stop words ("work best for structured" still matches positions n, n+1, n+3).
    const tokens = tokenize(query.replace(/"/g, '')).filter(Boolean);
    const terms: QueryTerm[] = tokens
      .map((term, offset) => ({ term, offset }))
      .filter(({ term }) => term.length > 1 && !STOP_WORDS.has(term));

    if (!terms.length) {
      return [];
    }

    const { sections, averageLength } = await this.loadMeta();
    const shards = new Map<string, WordShard>();

    await Promise.all(
      [...new Set(terms.map(({ term }) => term.slice(0, 2)))].map(async prefix =>
        shards.set(prefix, await this.loadShard(prefix))
      )
    );

    const matches = new Map<number, Map<number, TermMatch>>();

    terms.forEach(({ term }, termIndex) => {
      for (const [word, postings] of Object.entries(shards.get(term.slice(0, 2)) ?? {})) {
        const exact = word === term;

        if (!exact && !(term.length >= MIN_PREFIX_LENGTH && word.startsWith(term))) {
          continue;
        }

        const idf = Math.log(1 + (sections.length - postings.length + 0.5) / (postings.length + 0.5));

        for (const [id, ...positions] of postings) {
          const [, , title, , , headingWords, totalWords] = sections[id];
          const headingHits = positions.filter(position => position < headingWords).length;
          const tf = HEADING_BOOST * headingHits + (positions.length - headingHits);
          let score = (idf * (tf * (K1 + 1))) / (tf + K1 * (1 - B + (B * totalWords) / averageLength));

          if (tokenize(title).includes(term)) {
            score += TITLE_BOOST * idf;
          }

          score *= exact ? 1 : PREFIX_WEIGHT;

          const sectionMatches = matches.get(id) ?? new Map<number, TermMatch>();
          matches.set(id, sectionMatches);
          const previous = sectionMatches.get(termIndex);

          // Only the best expansion of a term counts, so "work" -> "workflow" can't stack on
          // top of "work"; phrase/proximity checks only use exact-word positions.
          sectionMatches.set(termIndex, {
            score: Math.max(score, previous?.score ?? 0),
            positions: exact ? positions : (previous?.positions ?? []),
          });
        }
      }
    });

    const ranked: RankedSection[] = [];

    for (const [id, sectionMatches] of matches) {
      const matched = sectionMatches.size;
      let score = [...sectionMatches.values()].reduce((sum, match) => sum + match.score, 0);

      score *= (matched / terms.length) ** 2;

      const span = minimumSpan([...sectionMatches.values()].map(match => match.positions).filter(p => p.length));

      if (matched > 1 && span) {
        score *= 1 + (matched - 1) / span;
      }

      const phrase = (quoted || terms.length >= 3) && matched === terms.length && hasPhrase(terms, sectionMatches);

      if (phrase) {
        score += PHRASE_BONUS;
      }

      ranked.push({ id, score, phrase });
    }

    ranked.sort((a, b) => b.score - a.score);

    return Promise.all(
      ranked.slice(0, limit).map(async ({ id, phrase }) => {
        const [url, fragment, title, heading, category] = sections[id];
        const text = (await this.loadTextChunk(Math.floor(id / CHUNK_SIZE)))[id % CHUNK_SIZE];

        return {
          url,
          fragment: fragment ?? undefined,
          title,
          heading,
          category,
          snippet: buildSnippet(text, terms, tokens, phrase),
        };
      })
    );
  }

  private loadMeta() {
    this.meta ??= this.fetch<SectionMeta[]>('meta.json', []).then(sections => ({
      sections,
      averageLength: sections.reduce((sum, section) => sum + section[6], 0) / (sections.length || 1),
    }));

    return this.meta;
  }

  private loadShard(prefix: string) {
    let shard = this.shards.get(prefix);

    if (!shard) {
      shard = this.fetch<WordShard>(`words/${prefix}.json`, {});
      this.shards.set(prefix, shard);
    }

    return shard;
  }

  private loadTextChunk(chunk: number) {
    let texts = this.textChunks.get(chunk);

    if (!texts) {
      texts = this.fetch<string[]>(`text/${chunk}.json`, []);
      this.textChunks.set(chunk, texts);
    }

    return texts;
  }

  // A missing shard just means no indexed word starts with that prefix.
  private fetch<T>(file: string, fallback: T): Promise<T> {
    return firstValueFrom(this.httpClient.get<T>(`${BASE_URL}/${file}`)).catch(() => fallback);
  }
}

// Must stay in sync with tokenize() in generate-search-index.js.
function tokenize(text: string) {
  return text.toLowerCase().split(/[^a-z0-9-]+/);
}

// Smallest word distance containing one position from every list.
function minimumSpan(lists: number[][]) {
  if (lists.length < 2) {
    return 0;
  }

  const all = lists.flatMap((list, i) => list.map(position => [position, i])).sort((a, b) => a[0] - b[0]);
  const counts = new Array(lists.length).fill(0);
  let covered = 0;
  let best = Infinity;
  let low = 0;

  for (const [position, i] of all) {
    if (counts[i]++ === 0) {
      covered++;
    }

    while (covered === lists.length) {
      best = Math.min(best, position - all[low][0] + 1);

      if (--counts[all[low][1]] === 0) {
        covered--;
      }

      low++;
    }
  }

  return best;
}

function hasPhrase(terms: QueryTerm[], matches: Map<number, TermMatch>) {
  const base = terms[0].offset;

  return (matches.get(0)?.positions ?? []).some(start =>
    terms.every(({ offset }, i) => matches.get(i)?.positions.includes(start + offset - base))
  );
}

// The matched words plus SNIPPET_CONTEXT_WORDS words on each side: the exact phrase when there is
// one, otherwise the shortest run of words (up to SNIPPET_MAX_SPAN) holding the most distinct query words.
function buildSnippet(text: string, terms: QueryTerm[], tokens: string[], phrase: boolean): HighlightSegment[] {
  const words = text.split(/\s+/).filter(Boolean);
  const termOf = words.map(word => {
    const normalized = word.toLowerCase().replace(/^[^a-z0-9-]+/, '');
    return terms.findIndex(({ term }) => normalized.startsWith(term));
  });
  let span: [number, number] | undefined;

  if (phrase) {
    // Query tokens in order, ignoring punctuation ("structured, homogeneous" -> "structured homogeneous").
    const tokensOf = words.map(word => tokenize(word).filter(Boolean));
    for (let i = 0; i < words.length && !span; i++) {
      const run: string[] = [];
      for (let j = i; j < words.length && run.length < tokens.length; j++) {
        run.push(...tokensOf[j]);
        if (run.length >= tokens.length && tokens.every((token, k) => run[k] === token)) {
          span = [i, j];
        }
      }
    }
  }

  const phraseFound = !!span;

  if (!span) {
    let best = { distinct: 0, length: Infinity };

    for (let i = 0; i < words.length; i++) {
      if (termOf[i] < 0) {
        continue;
      }

      const seen = new Set<number>();

      for (let j = i; j < Math.min(words.length, i + SNIPPET_MAX_SPAN); j++) {
        if (termOf[j] < 0) {
          continue;
        }

        seen.add(termOf[j]);
        const length = j - i + 1;

        if (seen.size > best.distinct || (seen.size === best.distinct && length < best.length)) {
          best = { distinct: seen.size, length };
          span = [i, j];
        }
      }
    }
  }

  const [first, last] = span ?? [0, 0];
  const start = Math.max(0, first - SNIPPET_CONTEXT_WORDS);
  const end = Math.min(words.length, last + 1 + SNIPPET_CONTEXT_WORDS);
  const leading = [start > 0 ? '…' : '', ...words.slice(start, first)].filter(Boolean).join(' ');
  const trailing = [...words.slice(last + 1, end), end < words.length ? '…' : ''].filter(Boolean).join(' ');

  if (!phraseFound) {
    return highlightTerms([leading, ...words.slice(first, last + 1), trailing].filter(Boolean).join(' '), terms);
  }

  // Exact phrase: mark the whole run as one segment, stop words included. Punctuation stuck to the
  // first/last word ("(signpost", "contextual,") stays outside the mark.
  const [, before, matched, after] = /^([^a-z0-9-]*)(.*?)([^a-z0-9-]*)$/i.exec(
    words.slice(first, last + 1).join(' ')
  ) as RegExpExecArray;
  const segments: HighlightSegment[] = [
    { text: `${leading}${leading ? ' ' : ''}${before}`, matched: false },
    { text: matched, matched: true },
    { text: `${after}${trailing ? ' ' : ''}${trailing}`, matched: false },
  ];

  return segments.filter(segment => segment.text);
}

// Marks every word starting with a query term.
function highlightTerms(text: string, terms: QueryTerm[]): HighlightSegment[] {
  const regex = new RegExp(`\\b(?:${terms.map(({ term }) => term).join('|')})[a-z0-9-]*`, 'gi');
  const segments: HighlightSegment[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text))) {
    if (match.index > last) {
      segments.push({ text: text.slice(last, match.index), matched: false });
    }

    segments.push({ text: match[0], matched: true });
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    segments.push({ text: text.slice(last), matched: false });
  }

  return segments;
}
