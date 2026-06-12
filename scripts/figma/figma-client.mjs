/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Thin client around the Figma REST API.
 *
 * Isolates all HTTP concerns (base URL, auth header, error handling) so the rest
 * of the pipeline talks to a small `get`/`post` surface.
 */

export const FIGMA_API = 'https://api.figma.com/v1';

/**
 * Create a Figma REST client bound to a personal access token.
 *
 * @param {string} token Figma personal access token (X-Figma-Token).
 * @param {{ baseUrl?: string }} [options]
 * @returns {{ get: (endpoint: string) => Promise<any>, post: (endpoint: string, body: unknown) => Promise<any> }}
 */
export function createFigmaClient(token, { baseUrl = FIGMA_API } = {}) {
  /** Abort a single request if Figma does not respond within this window. */
  const TIMEOUT_MS = 30_000;

  /**
   * Retry transient failures (HTTP 429 rate limits and 5xx server errors) with
   * exponential backoff. Non-transient errors propagate immediately.
   *
   * @template T
   * @param {() => Promise<T>} fn
   * @param {string} label
   * @param {number} [maxRetries]
   * @returns {Promise<T>}
   */
  async function withRetry(fn, label, maxRetries = 3) {
    let delay = 1000;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        const isRateLimit = err.message?.includes('429');
        const isServerError = err.message?.match(/→ 5\d\d/);
        if ((isRateLimit || isServerError) && attempt < maxRetries) {
          console.warn(`⏳  ${label}: attempt ${attempt} failed (${err.message}). Retrying in ${delay}ms…`);
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
          continue;
        }
        throw err;
      }
    }
  }

  async function get(endpoint) {
    return withRetry(async () => {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        headers: { 'X-Figma-Token': token },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`GET ${endpoint} → ${res.status}: ${body}`);
      }
      return res.json();
    }, `GET ${endpoint}`);
  }

  async function post(endpoint, body) {
    return withRetry(async () => {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'X-Figma-Token': token, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const text = await res.text();
      if (!res.ok) {
        throw new Error(`POST ${endpoint} → ${res.status}: ${text}`);
      }
      return JSON.parse(text);
    }, `POST ${endpoint}`);
  }

  return { get, post };
}
