/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import * as http from 'http';
import * as nodeStatic from 'node-static';

const port = 8080;
const staticFileServer = new nodeStatic.Server('./dist/docs');

http
  .createServer((request, response) => {
    request.addListener('end', () => staticFileServer.serve(request, response)).resume();
  })
  .listen(port);
