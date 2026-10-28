/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { withinReadScope } from './read-scope';
import {
  closestAcrossShadow,
  containsAcrossShadow,
  hasRendered,
  idScope,
  openShadowRoots,
  parentAcrossShadow,
  queryRendered,
  renderedChildNodes,
} from './shadow';

describe('shadow DOM helpers', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => container.remove());

  /** A `<shadow-host>` holding `light`, whose open shadow root holds `shadow`. */
  function host(shadow: string, light = '', parent: ParentNode = container): { host: Element; root: ShadowRoot } {
    const element = document.createElement('shadow-host');
    element.innerHTML = light;
    parent.appendChild(element);
    const root = element.attachShadow({ mode: 'open' });
    root.innerHTML = shadow;
    return { host: element, root };
  }

  function names(nodes: Node[]): string[] {
    return nodes.map(node => (node.nodeType === Node.ELEMENT_NODE ? (node as Element).tagName.toLowerCase() : '#text'));
  }

  describe('renderedChildNodes', () => {
    it('returns the shadow root content of a host, slots included', () => {
      const { host: element } = host('<b></b><slot></slot>', '<i></i>');

      expect(names(renderedChildNodes(element))).toEqual(['b', 'slot']);
    });

    it('returns what is assigned to a slot, or else its fallback', () => {
      const assigned = host('<slot></slot>', '<i></i>').root.querySelector('slot') as HTMLSlotElement;
      const fallback = host('<slot><u></u></slot>').root.querySelector('slot') as HTMLSlotElement;

      expect(names(renderedChildNodes(assigned))).toEqual(['i']);
      expect(names(renderedChildNodes(fallback))).toEqual(['u']);
    });

    it('returns a slot assigned to another slot, so markers on both apply', () => {
      const outer = host('<slot></slot>');
      const inner = host('<slot></slot>', '<i></i>', outer.root);
      inner.host.innerHTML = '<slot></slot>';
      outer.host.innerHTML = '<i></i>';

      expect(names(renderedChildNodes(inner.root.querySelector('slot') as Element))).toEqual(['slot']);
    });

    it('treats a slot outside a shadow root as an ordinary element', () => {
      container.innerHTML = '<slot><i></i></slot>';

      expect(names(renderedChildNodes(container.querySelector('slot') as Element))).toEqual(['i']);
    });

    it('does not walk into the shadow root of an icon', () => {
      container.innerHTML = '<cds-icon></cds-icon>';
      const icon = container.querySelector('cds-icon') as Element;
      icon.attachShadow({ mode: 'open' }).innerHTML = '<svg></svg>';

      expect(renderedChildNodes(icon)).toEqual([]);
      expect(openShadowRoots(container)).toEqual([]);
    });
  });

  describe('ancestry', () => {
    it('goes from slotted content through its slot to the host', () => {
      const { host: element, root } = host('<div class="wrapper"><slot></slot></div>', '<i></i>');
      const slotted = element.querySelector('i') as Element;

      expect(parentAcrossShadow(slotted)).toBe(root.querySelector('slot'));
      expect(closestAcrossShadow(slotted, '.wrapper')).toBe(root.querySelector('.wrapper'));
      expect(containsAcrossShadow(root.querySelector('.wrapper') as Element, slotted)).toBeTrue();
      expect(closestAcrossShadow(root.querySelector('.wrapper') as Element, 'div:not(.wrapper)')).toBe(container);
    });

    it('goes from the top of a shadow root to its host', () => {
      const { host: element, root } = host('<b></b>');

      expect(parentAcrossShadow(root.querySelector('b') as Element)).toBe(element);
      expect(containsAcrossShadow(container, root.querySelector('b') as Element)).toBeTrue();
    });
  });

  it('scopes ids to the shadow root an element is in', () => {
    const { root } = host('<b></b>');

    expect(idScope(root.querySelector('b') as Element)).toBe(root);
    expect(idScope(container)).toBe(document);
  });

  it('finds open shadow roots and what they hold, nested ones included', () => {
    const outer = host('<b></b>');
    const inner = host('<b></b>', '', outer.root);

    expect(openShadowRoots(container)).toEqual([outer.root, inner.root]);
    expect(queryRendered(container, 'b').length).toBe(2);
  });

  it('finds what a slot inside the queried element shows, once', () => {
    const { root } = host('<div class="list"><slot></slot></div>', '<b></b><b></b>');

    expect(queryRendered(root.querySelector('.list') as Element, 'b').length).toBe(2);
    expect(queryRendered(container, 'b').length).toBe(2);
  });

  it('answers for light DOM with one plain query', () => {
    container.innerHTML = '<div><slot></slot><i></i></div>';
    const queries = spyOn(Element.prototype, 'querySelectorAll').and.callThrough();

    expect(hasRendered(container, 'b')).toBeFalse();
    expect(queryRendered(container, 'i').length).toBe(1);
    expect(queries.calls.allArgs().map(([selector]) => selector)).not.toContain('slot');
  });

  it('does not scan below an element whose scanned ancestor has no shadow root', () => {
    container.innerHTML = '<div><div><div><b></b></div></div></div>';
    const deepest = container.querySelector('b') as Element;

    withinReadScope(() => {
      expect(openShadowRoots(container)).toEqual([]);
      const scans = spyOn(Element.prototype, 'querySelectorAll').and.callThrough();

      expect(openShadowRoots(deepest)).toEqual([]);
      expect(scans).not.toHaveBeenCalled();
    });
  });
});
