/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import * as http from 'http';
import * as nodeStatic from 'node-static';

const port = 8081;
const staticFileServer = new nodeStatic.Server('./dist/website');

// The website is a single-page application, so unknown paths must fall back to
// index.html (the same behavior as the redirect rule in netlify-website.toml).
http
  .createServer((request, response) => {
    request
      .addListener('end', () => {
        staticFileServer.serve(request, response, error => {
          if (error && (error as unknown as { status: number }).status === 404) {
            staticFileServer.serveFile('/index.html', 200, {}, request, response);
          }
        });
      })
      .resume();
  })
  .listen(port);
