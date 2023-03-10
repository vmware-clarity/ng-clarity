/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import * as fs from 'fs';
import * as http from 'http';
import * as nodeStatic from 'node-static';
import { chromium } from 'playwright';

const port = 8080;

main();

async function main() {
  const [server, browser] = await Promise.all([startServer(), chromium.launch()]);
  const page = await browser.newPage();

  await page.goto('http://localhost:8080');
  await page.waitForLoadState('networkidle');

  // The story links aren't in the DOM initially since the sidebar tree is lazy,
  // so we need to click all the sidebar buttons to expand the tree.
  await page.evaluate(() => {
    document.querySelectorAll<HTMLButtonElement>('button.sidebar-item').forEach(sidebarButtonElement => {
      sidebarButtonElement.click();
    });
  });

  // Now, we can query for the story links.
  const storyIds = await page.$$eval<string[], HTMLLinkElement>('a.sidebar-item', sidebarLinkElements =>
    sidebarLinkElements.map(sidebarLinkElement => {
      const splitHref = sidebarLinkElement.href.split('/');

      return splitHref[splitHref.length - 1];
    })
  );

  // And write a file for the storybook-vrt `playwright` test to read.
  fs.writeFileSync('./dist/docs/stories.json', JSON.stringify(storyIds));

  await browser.close();
  await closeServer(server);
}

function startServer() {
  return new Promise<http.Server>(resolve => {
    const staticFileServer = new nodeStatic.Server('./dist/docs');

    const server = http
      .createServer((request, response) => {
        request.addListener('end', () => staticFileServer.serve(request, response)).resume();
      })
      .listen(port, () => {
        resolve(server);
      });
  });
}

function closeServer(server: http.Server) {
  return new Promise<void>((resolve, reject) => {
    server.close(error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
