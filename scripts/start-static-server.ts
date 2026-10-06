/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import * as express from 'express';
import * as path from 'path';

// Serves a built app directory for the visual regression tests.
//
// Usage: ts-node ./scripts/start-static-server.ts <root> <port> [--spa]
//
// --spa: fall back to index.html for unknown paths. The website is a single-page application,
// so its routes must resolve to index.html (the same behavior as the redirect rule in
// netlify-website.toml).

const [root, port, ...flags] = process.argv.slice(2);
const spaFallback = flags.includes('--spa');
const rootPath = path.resolve(root);

const app = express();

app.use(express.static(rootPath));

if (spaFallback) {
  // Serve index.html for any path the static middleware did not find.
  app.use((request, _response, next) => {
    request.url = '/index.html';
    next();
  });
  app.use(express.static(rootPath));
}

app.listen(Number(port));
