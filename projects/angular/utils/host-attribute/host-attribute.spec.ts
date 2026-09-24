/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrHostAttribute } from './host-attribute';

describe('ClrHostAttribute', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('input');
  });

  function bind(attribute: ClrHostAttribute, computed: string | boolean | null): string | null {
    // What Angular does with the host binding's value.
    const value = attribute.value(computed);
    if (value === null) {
      element.removeAttribute('aria-invalid');
    } else {
      element.setAttribute('aria-invalid', value);
    }
    return value;
  }

  it('reports what the component computes while nothing else touches the attribute', () => {
    const attribute = new ClrHostAttribute(element, 'aria-invalid');
    expect(bind(attribute, true)).toBe('true');
    expect(bind(attribute, null)).toBeNull();
    expect(bind(attribute, true)).toBe('true');
  });

  it('keeps an attribute written in the template', () => {
    element.setAttribute('aria-invalid', 'grammar');
    const attribute = new ClrHostAttribute(element, 'aria-invalid');
    expect(bind(attribute, true)).toBe('grammar');
    expect(bind(attribute, null)).toBe('grammar');
  });

  it('yields to the application once it binds the attribute itself', () => {
    const attribute = new ClrHostAttribute(element, 'aria-invalid');
    expect(bind(attribute, null)).toBeNull();
    element.setAttribute('aria-invalid', 'true'); // the application's own binding
    expect(bind(attribute, null)).toBe('true');
    element.removeAttribute('aria-invalid'); // the application clears it
    expect(bind(attribute, true)).toBeNull();
  });
});
