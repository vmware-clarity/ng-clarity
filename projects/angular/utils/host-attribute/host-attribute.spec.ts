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

  it('keeps an attribute written in the template even when the element later changes it', () => {
    element.setAttribute('aria-invalid', 'grammar');
    const attribute = new ClrHostAttribute(element, 'aria-invalid');
    element.setAttribute('aria-invalid', 'spelling');
    expect(attribute.value(true)).toBe('grammar');
  });

  it('keeps an empty attribute written in the template', () => {
    element.setAttribute('aria-invalid', '');
    const attribute = new ClrHostAttribute(element, 'aria-invalid');
    expect(bind(attribute, true)).toBe('');
  });

  it('stays yielded once the application has bound the attribute, whatever the component computes', () => {
    const attribute = new ClrHostAttribute(element, 'aria-invalid');
    expect(bind(attribute, true)).toBe('true');
    element.setAttribute('aria-invalid', 'spelling'); // the application's own binding
    expect(bind(attribute, true)).toBe('spelling');
    expect(bind(attribute, null)).toBe('spelling');
    element.setAttribute('aria-invalid', 'true'); // the application binds what the component would say
    expect(bind(attribute, null)).toBe('true');
  });

  it('yields to a value the application bound before the component first reported', () => {
    // Angular applies the application's template bindings to an element before the host
    // bindings of the directives on it, so on the first pass the application's value is
    // already there, although it was not there when the directive was created.
    const attribute = new ClrHostAttribute(element, 'aria-invalid');
    element.setAttribute('aria-invalid', 'spelling');
    expect(bind(attribute, null)).toBe('spelling');
    expect(bind(attribute, true)).toBe('spelling');
  });

  it('turns true and false into what ARIA expects', () => {
    const attribute = new ClrHostAttribute(element, 'aria-invalid');
    expect(bind(attribute, true)).toBe('true');
    expect(bind(attribute, false)).toBeNull();
    expect(bind(attribute, 'grammar')).toBe('grammar');
  });

  it('works without an element, reporting what the component computes', () => {
    const withoutElement = new ClrHostAttribute(undefined, 'role');
    expect(withoutElement.value('navigation')).toBe('navigation');
    expect(withoutElement.value(null)).toBeNull();
    expect(new ClrHostAttribute(null, 'role').value('navigation')).toBe('navigation');
  });
});
