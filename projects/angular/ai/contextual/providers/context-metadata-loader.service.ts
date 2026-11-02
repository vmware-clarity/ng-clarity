/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT, inject, Injectable } from '@angular/core';

import { CLR_CONTEXT_APPLICATION } from './context-options';
import { attempt, withTimeout } from '../attempt';
import { parseJsonObject } from '../dom/annotations';

/** A metadata file is meant to be small. */
const MAX_FILE_LENGTH = 64 * 1024;

interface Loaded {
  /** The JSON object, `undefined` while loading, `null` when it could not be loaded. */
  value: Record<string, unknown> | null | undefined;
  done: Promise<void>;
}

/** Loads the JSON objects behind metadata and configuration URLs, once per URL for the session. */
@Injectable({ providedIn: 'root' })
export class ClrContextMetadataLoader {
  private readonly document = inject(DOCUMENT);
  private readonly application = inject(CLR_CONTEXT_APPLICATION, { optional: true });
  private readonly loaded = new Map<string, Loaded>();

  /** The JSON object at `url`: `undefined` while it loads, `null` when it could not be loaded. */
  read(url: string): Record<string, unknown> | null | undefined {
    return this.load(url).value;
  }

  /** Waits for `urls` to load, for at most `timeoutMs`. */
  async settle(urls: string[], timeoutMs: number): Promise<void> {
    await withTimeout(Promise.all(urls.map(url => this.load(url).done)), timeoutMs);
  }

  private load(url: string): Loaded {
    const resolved = attempt(() => new URL(url, this.document.baseURI), null);
    const key = resolved?.href ?? url;
    let entry = this.loaded.get(key);
    if (!entry) {
      const loading: Loaded = { value: undefined, done: Promise.resolve() };
      loading.done = this.fetch(resolved).then(value => {
        loading.value = value;
      });
      this.loaded.set(key, loading);
      entry = loading;
    }
    return entry;
  }

  private async fetch(url: URL | null): Promise<Record<string, unknown> | null> {
    const fetch = this.document.defaultView?.fetch;
    if (!url || !fetch || !this.isAllowed(url)) {
      return null;
    }
    try {
      const response = await fetch.call(this.document.defaultView, url.href, { credentials: 'same-origin' });
      return response.ok ? parseJsonObject(await response.text(), url.href, MAX_FILE_LENGTH) : null;
    } catch {
      return null;
    }
  }

  private isAllowed(url: URL): boolean {
    const own = this.document.location?.origin;
    return url.origin === own || !!this.application?.metadataOrigins?.includes(url.origin);
  }
}
