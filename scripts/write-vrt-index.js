/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Writes the index.html of an application build the browser tests use (`npm run _build:website:vrt`,
// `npm run _build:demo:vrt`): the production one with the `ngCspNonce` attribute. With it, the Angular CLI adds the
// nonce to the inline tags it generates and the runtime adds it to the component styles. The test server
// (scripts/start-static-server.ts) replaces the `CSP_NONCE` placeholder with a new nonce per response. The deployed
// applications keep no placeholder: a fixed, public nonce would defeat a Content-Security-Policy added later.
//
// Usage: node ./scripts/write-vrt-index.js <application source directory>

const fs = require('fs');
const path = require('path');

const src = process.argv[2];
if (!src) {
  throw new Error('Usage: node ./scripts/write-vrt-index.js <application source directory>');
}

const html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
const vrtHtml = html.replace('<app-root>', '<app-root ngCspNonce="CSP_NONCE">');
if (vrtHtml === html) {
  throw new Error(`${src}/index.html has no <app-root> element to add the nonce to.`);
}

fs.writeFileSync(path.join(src, 'index.vrt.html'), vrtHtml);
