/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { accessibleName } from './accessible-name';
import { resolveRole } from './roles';

describe('accessibleName', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  function nameOf(html: string, selector: string, maxTextLength = 100): string {
    container.innerHTML = html;
    const element = container.querySelector(selector) as HTMLElement;
    return accessibleName(element, resolveRole(element), maxTextLength);
  }

  it('prefers aria-labelledby over aria-label', () => {
    expect(
      nameOf(
        '<span id="t">From labelledby</span><div role="dialog" id="d" aria-labelledby="t" aria-label="From label"></div>',
        '#d'
      )
    ).toBe('From labelledby');
  });

  it('joins the text of every element aria-labelledby references', () => {
    expect(
      nameOf(
        '<span id="a">Firewall</span><span id="b">rules</span><div role="region" id="r" aria-labelledby="a b"></div>',
        '#r'
      )
    ).toBe('Firewall rules');
  });

  it('falls back to aria-label', () => {
    expect(nameOf('<div role="grid" id="g" aria-label="Clusters"></div>', '#g')).toBe('Clusters');
  });

  it('uses a label associated by "for"', () => {
    expect(nameOf('<label for="i">Host name</label><input id="i" />', '#i')).toBe('Host name');
  });

  it('uses a label that wraps the control', () => {
    expect(nameOf('<label>Host name<input id="i" /></label>', '#i')).toBe('Host name');
  });

  it('uses the legend of a fieldset', () => {
    expect(nameOf('<fieldset id="f"><legend>Networking</legend></fieldset>', '#f')).toBe('Networking');
  });

  it('uses the caption of a table', () => {
    expect(nameOf('<table id="t"><caption>Clusters</caption></table>', '#t')).toBe('Clusters');
  });

  it('uses the alt text of an image', () => {
    expect(nameOf('<img id="i" alt="Topology diagram" />', '#i')).toBe('Topology diagram');
  });

  it('uses text content for a role whose name comes from its contents', () => {
    expect(nameOf('<button id="b">Add rule</button>', '#b')).toBe('Add rule');
  });

  it("does not take a container role's name from its subtree text", () => {
    expect(nameOf('<div role="region" id="r"><p>A whole page of prose</p></div>', '#r')).toBe('');
  });

  it('ignores content hidden from assistive technology', () => {
    expect(nameOf('<button id="b">Add <span aria-hidden="true">(beta)</span></button>', '#b')).toBe('Add');
  });

  it('truncates a name to the budget', () => {
    expect(nameOf('<button id="b">abcdefghij</button>', '#b', 5)).toBe('abcd…');
  });

  it('has no name when nothing supplies one', () => {
    expect(nameOf('<div role="region" id="r"></div>', '#r')).toBe('');
  });

  it('ignores visually hidden text, which is guidance for a screen reader not a label', () => {
    // The standard visually-hidden pattern, used by Clarity, Bootstrap, Tailwind and CDK alike.
    expect(
      nameOf(
        '<button id="b">Name <span style="position:absolute;clip-path:inset(50%);width:1px;height:1px;overflow:hidden">Use left or right key to resize the column</span></button>',
        '#b'
      )
    ).toBe('Name');
  });
});

describe('accessibleName, sources the first version missed', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => container.remove());

  function nameOf(html: string, selector: string): string {
    container.innerHTML = html;
    const element = container.querySelector(selector) as HTMLElement;
    return accessibleName(element, resolveRole(element), 100);
  }

  it('falls back to a placeholder, which is often all a search box has', () => {
    expect(nameOf('<input type="search" placeholder="Search hosts" />', 'input')).toBe('Search hosts');
  });

  it('prefers a real label over a placeholder', () => {
    expect(nameOf('<input aria-label="Filter" placeholder="Search hosts" />', 'input')).toBe('Filter');
  });

  it("does not take a wrapping label's name from the control's own options", () => {
    expect(nameOf('<label>Tier <select><option>Gold</option><option>Silver</option></select></label>', 'select')).toBe(
      'Tier'
    );
  });

  it('names a control by the label the browser associates with it', () => {
    expect(nameOf('<label for="h">Host</label><input id="h" />', 'input')).toBe('Host');
  });

  it('leaves out label text that is not rendered, so a toggled label variant names by the visible one', () => {
    expect(
      nameOf('<label for="h"><span style="display: none">Show</span><span>Hide</span></label><input id="h" />', 'input')
    ).toBe('Hide');
  });
});
