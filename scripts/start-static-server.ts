/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import * as http from 'http';
import * as nodeStatic from 'node-static';

// Serves a built app directory for the visual regression tests.
//
// Usage: ts-node ./scripts/start-static-server.ts <root> <port> [--spa]
//
// --spa: fall back to index.html for unknown paths. The website is a single-page application,
// so its routes must resolve to index.html (the same behavior as the redirect rule in
// netlify-website.toml).

const [root, port, ...flags] = process.argv.slice(2);
const spaFallback = flags.includes('--spa');
const staticFileServer = new nodeStatic.Server(root);

http
  .createServer((request, response) => {
    request
      .addListener('end', () => {
        staticFileServer.serve(request, response, error => {
          if (!error) {
            return;
          }

          const { status, headers } = error as unknown as { status: number; headers: http.OutgoingHttpHeaders };

          if (spaFallback && status === 404) {
            staticFileServer.serveFile('/index.html', 200, {}, request, response);
          } else {
            response.writeHead(status, headers);
            response.end();
          }
        });
      })
      .resume();
  })
  .listen(Number(port));
