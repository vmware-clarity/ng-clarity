/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import express from 'express';
import * as path from 'path';

// Serves a built app directory for the visual regression tests.
//
// Usage: node --experimental-strip-types ./scripts/start-static-server.ts <root> <port> [--spa]
//
// --spa or --spa=<path>: fall back to index.html (or the given path) for unknown paths. The website is a single-page application,
// so its routes must resolve to index.html (the same behavior as the redirect rule in
// netlify-website.toml).

const [root, port, ...flags] = process.argv.slice(2);
const spaIndex = flags.find(flag => flag.startsWith('--spa='))?.slice('--spa='.length);
const spaFallback = flags.includes('--spa') || !!spaIndex;
const rootPath = path.resolve(root);

const app = express();

app.use(express.static(rootPath));

if (spaFallback) {
  // Serve index.html for any path the static middleware did not find.
  app.use((request, _response, next) => {
    request.url = '/' + (spaIndex || 'index.html');
    next();
  });
  app.use(express.static(rootPath));
}

app.listen(Number(port));
