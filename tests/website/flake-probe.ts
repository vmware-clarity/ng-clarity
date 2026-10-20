/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * TEMPORARY instrumentation for the flaky website/datagrid/code-custom-filtering snapshot (the Preset Column
 * Filters grid sometimes renders its Pokemon column ~3px narrower). Enabled with FLAKE_PROBE=1 only.
 *
 * The datagrid measures its column widths once (DatagridMainRenderer -> organizer.resize() -> header scrollWidth).
 * The probe hooks Element.prototype.scrollWidth and, whenever a clr-dg-column of a "User ID / Name / Creation date /
 * Pokemon / Favorite color" grid is measured, records what the Pokemon column's cells look like at that moment.
 */
import { Page, TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export const flakeProbeEnabled = process.env['FLAKE_PROBE'] === '1';
export const flakeProbeView = 'code-custom-filtering';

const outputDir = path.join('.', 'test-results', 'flake-probe');

export async function installFlakeProbe(page: Page) {
  await page.addInitScript(() => {
    const w = window as any;
    const t0 = performance.now();
    w.__flakeProbe = [];
    w.__flakeEvents = [];
    const ms = () => Math.round((performance.now() - t0) * 10) / 10;
    const event = (e: string) => w.__flakeEvents.push(`${ms()} ${e}`);

    document.fonts.addEventListener('loading', e =>
      event('fonts loading ' + (e as any).fontfaces.map((f: FontFace) => f.weight).join(','))
    );
    document.fonts.addEventListener('loadingdone', e =>
      event('fonts done ' + (e as any).fontfaces.map((f: FontFace) => f.weight).join(','))
    );
    new MutationObserver(mutations => {
      for (const m of mutations) {
        const link = m.target as HTMLLinkElement;
        if (link.tagName === 'LINK' && link.href.includes('styles-')) {
          event('styles.css media -> ' + link.media);
        }
      }
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ['media'] });

    const scrollWidth = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollWidth') as PropertyDescriptor;
    const sw = (el: Element) => (scrollWidth.get as () => number).call(el);
    const titles = 'User,Name,Creation,Pokemon,Favorite';
    const columnTitles = (grid: Element) =>
      [...grid.querySelectorAll('clr-dg-column')].map(c => (c.textContent ?? '').trim().split(/\s+/)[0]).join(',');
    const rect = (el: Element | null) => (el ? Math.round(el.getBoundingClientRect().width * 100) / 100 : null);
    const contentWidth = (el: Element) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return Math.round(range.getBoundingClientRect().width * 100) / 100;
    };
    const font = (el: Element) => {
      const cs = getComputedStyle(el);
      return `${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily.split(',')[0]} ls=${cs.letterSpacing} ws=${cs.whiteSpace} pad=${cs.paddingLeft}/${cs.paddingRight} b=${cs.borderLeftWidth}/${cs.borderRightWidth} disp=${cs.display}`;
    };

    Object.defineProperty(Element.prototype, 'scrollWidth', {
      configurable: true,
      get() {
        const value = sw(this);
        if (this.tagName === 'CLR-DG-COLUMN') {
          const grid = this.closest('clr-datagrid');
          if (grid && columnTitles(grid) === titles && this.textContent.trim().startsWith('Pokemon')) {
            const rows = [...grid.querySelectorAll('clr-dg-row')];
            w.__flakeProbe.push({
              ms: ms(),
              grid: [...document.querySelectorAll('clr-datagrid')].indexOf(grid),
              visible: (grid as HTMLElement).offsetParent !== null,
              gridClass: grid.className,
              headerSW: [...grid.querySelectorAll('clr-dg-column')].map(sw),
              headerStyleW: [...grid.querySelectorAll('clr-dg-column')].map(c => (c as HTMLElement).style.width),
              names: rows.map(r => r.querySelectorAll('clr-dg-cell')[1]?.textContent?.trim()),
              poke: rows.map(r => {
                const cell = r.querySelectorAll('clr-dg-cell')[3];
                if (!cell) {
                  return null;
                }
                const badge = cell.querySelector('.badge');
                return {
                  text: JSON.stringify(cell.textContent),
                  nodes: [...cell.childNodes].map(n =>
                    n.nodeType === 3 ? `T${JSON.stringify(n.textContent)}` : (n as Element).tagName.toLowerCase()
                  ),
                  sw: sw(cell),
                  content: contentWidth(cell),
                  styleW: (cell as HTMLElement).style.width,
                  cellFont: font(cell),
                  badgeW: rect(badge),
                  badgeContent: badge ? contentWidth(badge) : null,
                  badgeFont: badge ? font(badge) : null,
                  badgeClass: badge?.className,
                };
              }),
              fonts: [...document.fonts].map(f => f.weight + f.status[0]).join(' '),
              fontsStatus: document.fonts.status,
              sheets: document.styleSheets.length,
              stylesMedia: (document.querySelector('link[href^="styles-"]') as HTMLLinkElement | null)?.media,
              readyState: document.readyState,
            });
          }
        }
        return value;
      },
    });
  });
}

export async function recordFlakeProbe(page: Page, testInfo: TestInfo, view: string, screenshotFailed: boolean) {
  const final = await page.evaluate(() => {
    const w = window as any;
    const grids = [...document.querySelectorAll('clr-datagrid')]
      .map((grid, index) => ({ grid, index }))
      .filter(({ grid }) =>
        [...grid.querySelectorAll('clr-dg-column')]
          .map(c => (c.textContent ?? '').trim().split(/\s+/)[0])
          .join(',')
          .startsWith('User,Name,Creation,Pokemon,Favorite')
      )
      .map(({ grid, index }) => ({
        index,
        styleW: [...grid.querySelectorAll('clr-dg-column')].map(c => (c as HTMLElement).style.width),
        rectW: [...grid.querySelectorAll('clr-dg-column')].map(
          c => Math.round(c.getBoundingClientRect().width * 100) / 100
        ),
        names: [...grid.querySelectorAll('clr-dg-row')].map(r =>
          r.querySelectorAll('clr-dg-cell')[1]?.textContent?.trim()
        ),
      }));
    return { grids, measurements: w.__flakeProbe, events: w.__flakeEvents };
  });

  fs.mkdirSync(outputDir, { recursive: true });
  const record = {
    worker: testInfo.workerIndex,
    parallelIndex: testInfo.parallelIndex,
    repeat: testInfo.repeatEachIndex,
    view,
    screenshotFailed,
    ...final,
  };
  fs.appendFileSync(
    path.join(outputDir, `probe-${process.env['FLAKE_PROBE_JOB'] ?? 'local'}.jsonl`),
    JSON.stringify(record) + '\n'
  );
}
