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
  async function get(endpoint) {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      headers: { 'X-Figma-Token': token },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`GET ${endpoint} → ${res.status}: ${body}`);
    }
    return res.json();
  }

  async function post(endpoint, body) {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'X-Figma-Token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`POST ${endpoint} → ${res.status}: ${text}`);
    }
    return JSON.parse(text);
  }

  return { get, post };
}
