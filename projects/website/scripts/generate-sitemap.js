/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');

const express = require('express');
const parseUrl = require('parse-url');
const playwright = require('playwright');
const xmlJs = require('xml-js');
const xmlbuilder = require('xmlbuilder');

const REPO_ROOT = path.resolve(__dirname, '../../..');
const DIST_WEBSITE = path.join(REPO_ROOT, 'dist', 'website');

main();

async function main() {
  const pages = await crawlPages();

  pages.sort((page1, page2) => page1.url.localeCompare(page2.url));
  fs.writeFileSync(path.join(DIST_WEBSITE, 'pages.json'), JSON.stringify(pages, undefined, 2));

  const sitemap = await generateSitemap(pages);
  fs.writeFileSync(path.join(DIST_WEBSITE, 'sitemap.xml'), sitemap);
}

async function crawlPages() {
  const port = 3000;
  const baseUrl = `http://localhost:${port}`;

  const [server, browser] = await Promise.all([startServer(port), playwright.chromium.launch()]);

  try {
    const queue = ['/'];
    const pages = [];

    const page = await browser.newPage();

    while (queue.length) {
      const url = queue.pop();
      console.log(`Processing ${url}...`);

      await page.goto(`${baseUrl}${url}`);

      pages.push({
        url,
        contentHash: await hashPageContent(page),
      });

      const linkUrls = await page.$$eval('a[href]', linkElements => linkElements.map(linkElement => linkElement.href));

      for (const linkUrl of linkUrls) {
        const relativeLinkUrl = parseUrl(linkUrl).pathname;

        if (
          // skip external links
          !linkUrl.startsWith(baseUrl) ||
          // skip links to files (e.g. clarity-icons.zip)
          linkUrl.match(/\.[a-z0-9]{2,5}$/i) ||
          // skip already-queued links
          queue.includes(relativeLinkUrl) ||
          // skip already-processed links
          pages.find(page => page.url === relativeLinkUrl)
        ) {
          continue;
        }

        queue.push(relativeLinkUrl);
      }
    }

    return pages;
  } finally {
    await browser.close();
    await closeServer(server);
  }

  async function hashPageContent(page) {
    // Remove the footer because it is on all pages.
    // If it is changed, we don't want the `lastmod` date of all pages to be updated.
    await page.evaluate(() => {
      document.querySelector('app-site-footer').remove();
    });

    // Get the text content of the page content area.
    // Using the content area excludes the header and site nav for the same reason the footer is excluded.
    const content = await page.$eval('.content-area', body => body.textContent);

    // Return the sha256 hash as hex.
    return crypto.createHash('sha256').update(content.trim()).digest('hex');
  }
}

async function generateSitemap(pages) {
  console.log('Generating sitemap...');

  const today = new Date().toISOString().split('T')[0];

  const currentSitemapXml = await (await fetch('https://clarity.design/sitemap.xml')).text();
  const currentSitemapJson = xmlJs.xml2json(currentSitemapXml, { compact: true });
  const currentSitemap = JSON.parse(currentSitemapJson).urlset.url.map(url => ({
    loc: url.loc._text,
    lastmod: url.lastmod._text,
  }));

  const currentPages = await (await fetch(`https://clarity.design/pages.json`)).json();

  const sitemapRoot = xmlbuilder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
  sitemapRoot.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

  for (const page of pages) {
    const absoluteUrl = `https://clarity.design${page.url}`;
    const currentPage = currentPages.find(entry => entry.url === page.url);
    const currentSitemapEntry = currentSitemap.find(entry => entry.loc === absoluteUrl);

    const urlElement = sitemapRoot.ele('url');
    urlElement.ele('loc', absoluteUrl);

    if (!currentPage) {
      // page is new
      urlElement.ele('lastmod', today);
    } else if (page.contentHash !== currentPage.contentHash) {
      // page is modified
      urlElement.ele('lastmod', today);
    } else {
      // page is unmodified
      urlElement.ele('lastmod', currentSitemapEntry.lastmod);
    }
  }

  return sitemapRoot.end({ pretty: true });
}

function startServer(port) {
  return new Promise(resolve => {
    const app = express();

    app.use(express.static(DIST_WEBSITE));

    app.get('/*', (req, res) => res.sendFile(path.join(DIST_WEBSITE, 'index.html')));

    const server = http.createServer(app);

    server.listen(port, () => {
      resolve(server);
    });
  });
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close(error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
