/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
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
