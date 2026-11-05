/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { contextText, normalizeContextText } from './text';

describe('normalizeContextText', () => {
  it('collapses and trims whitespace and lowercases', () => {
    expect(normalizeContextText('  Beta \n  Cluster ')).toBe('beta cluster');
  });

  it('keeps the case when asked to', () => {
    expect(normalizeContextText('  Beta \t Cluster', false)).toBe('Beta Cluster');
  });
});

describe('contextText', () => {
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
  });

  afterEach(() => host.remove());

  const read = (html: string) => {
    host.innerHTML = html;
    return contextText(host);
  };

  it('reads what it can of content nested deeper than the stack holds', () => {
    host.append('Top ');
    let innermost: Element = host;
    for (let level = 0; level < 5000; level++) {
      innermost = innermost.appendChild(document.createElement('span'));
    }
    innermost.textContent = 'leaf';
    expect(contextText(host)).toBe('Top');
  });

  it('leaves out text hidden by style as well as by attribute', () => {
    expect(
      read(
        `node-1<span style="display: none">HIDDEN-1</span><span style="visibility: hidden">HIDDEN-2</span>
         <span style="opacity: 0">HIDDEN-3</span><span hidden>HIDDEN-4</span><span aria-hidden="true">HIDDEN-5</span>`
      )
    ).toBe('node-1');
  });

  it('reads block-level parts as separate words, and inline parts as one', () => {
    expect(read('<div>Alpha</div><div>Beta</div><b>Gam</b>ma')).toBe('Alpha Beta Gamma');
    expect(read('Line1<br>Line2')).toBe('Line1 Line2');
  });

  it('reads markup that is not on the page, judging no style', () => {
    const detached = document.createElement('div');
    detached.innerHTML = '<span style="display: none">Kept</span><p>Alpha</p><p>Beta</p>';
    expect(contextText(detached)).toBe('Kept Alpha Beta');
  });
});
