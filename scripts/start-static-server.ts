/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { randomBytes } from 'crypto';
import express from 'express';
import * as fs from 'fs';
import * as path from 'path';

// Serves a built app directory for the visual regression tests.
//
// Usage: node --experimental-strip-types ./scripts/start-static-server.ts <root> <port> [--spa] [--unsafe-eval]
//
// --spa: fall back to index.html for unknown paths. The website is a single-page application,
// so its routes must resolve to index.html (the same behavior as the redirect rule in
// netlify-website.toml).
//
// --unsafe-eval: allow eval() in the Content-Security-Policy. Storybook compiles the story
// templates at runtime with the Angular JIT compiler, which needs it.
//
// HTML pages are served with a strict Content-Security-Policy and a new nonce per response, the
// setup Angular documents for applications (https://angular.dev/best-practices/security#content-security-policy),
// so the snapshots show what breaks when a Clarity component injects a style or script the policy
// does not allow. The nonce replaces the `CSP_NONCE` placeholder (the `ngCspNonce` attribute the
// Angular runtime and CLI read it from) and is added to the inline <script> and <style> tags
// that have none (Storybook's own).

const [root, port, ...flags] = process.argv.slice(2);
const spaFallback = flags.includes('--spa');
const unsafeEval = flags.includes('--unsafe-eval');
const rootPath = path.resolve(root);

const noncePlaceholder = 'CSP_NONCE';

function contentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${unsafeEval ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ');
}

function sendHtml(filePath: string, response: express.Response) {
  const nonce = randomBytes(16).toString('base64');
  const html = fs
    .readFileSync(filePath, 'utf8')
    .replaceAll(noncePlaceholder, nonce)
    .replace(/<(script|style)\b(?![^>]*\snonce=)/g, `<$1 nonce="${nonce}"`);

  response.setHeader('Content-Security-Policy', contentSecurityPolicy(nonce));
  response.type('html').send(html);
}

const app = express();

app.use((request, response, next) => {
  const requestPath = decodeURIComponent(request.path);
  const filePath = path.join(rootPath, requestPath.endsWith('/') ? `${requestPath}index.html` : requestPath);
  if (filePath.startsWith(rootPath) && filePath.endsWith('.html') && fs.existsSync(filePath)) {
    sendHtml(filePath, response);
  } else {
    next();
  }
});

app.use(express.static(rootPath));

if (spaFallback) {
  // Serve index.html for any path the static middleware did not find.
  app.use((_request, response) => sendHtml(path.join(rootPath, 'index.html'), response));
}

app.listen(Number(port));
