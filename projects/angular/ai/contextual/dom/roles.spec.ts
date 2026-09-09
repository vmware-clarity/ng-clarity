/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isLeafRole, isNameFromContents, isPresentationalRole, mayContainControls, resolveRole } from './roles';

describe('resolveRole', () => {
  function roleOf(html: string): string | null {
    const container = document.createElement('div');
    container.innerHTML = html;
    return resolveRole(container.firstElementChild as HTMLElement);
  }

  it('prefers an explicit role over the implicit one', () => {
    expect(roleOf('<table role="presentation"></table>')).toBe('presentation');
  });

  it('resolves the implicit role of a semantic element', () => {
    expect(roleOf('<nav></nav>')).toBe('navigation');
  });

  it('resolves an input to a role based on its type', () => {
    expect(roleOf('<input type="checkbox" />')).toBe('checkbox');
  });

  it('treats a type-less input as a textbox', () => {
    expect(roleOf('<input />')).toBe('textbox');
  });

  it('gives an anchor the link role only when it is navigable', () => {
    expect(roleOf('<a href="/x">x</a>')).toBe('link');
    expect(roleOf('<a>x</a>')).toBeNull();
  });

  it('gives a section the region role only when it is named', () => {
    expect(roleOf('<section aria-label="Rules"></section>')).toBe('region');
    expect(roleOf('<section></section>')).toBeNull();
  });

  it('has no role for a plain container', () => {
    expect(roleOf('<div></div>')).toBeNull();
  });

  it('resolves a custom element to no implicit role', () => {
    expect(roleOf('<clr-datagrid></clr-datagrid>')).toBeNull();
  });
});

describe('isLeafRole', () => {
  it('treats roles whose name comes from their contents as leaves', () => {
    expect(isLeafRole('button')).toBe(true);
    expect(isLeafRole('heading')).toBe(true);
  });

  it('does not treat container roles as leaves', () => {
    expect(isLeafRole('dialog')).toBe(false);
    expect(isLeafRole('region')).toBe(false);
  });
});

describe('isPresentationalRole', () => {
  it('recognises both spellings of the presentational role', () => {
    expect(isPresentationalRole('presentation')).toBe(true);
    expect(isPresentationalRole('none')).toBe(true);
  });

  it('does not treat a real role as presentational', () => {
    expect(isPresentationalRole('grid')).toBe(false);
  });
});

describe('isNameFromContents', () => {
  it('lets a single control take its name from its own text', () => {
    expect(isNameFromContents('button')).toBe(true);
  });

  it('lets a table cell and a list item take their name from their text', () => {
    expect(isNameFromContents('columnheader')).toBe(true);
    expect(isNameFromContents('cell')).toBe(true);
    expect(isNameFromContents('listitem')).toBe(true);
  });

  it('lets an alert take its message as its name', () => {
    expect(isNameFromContents('alert')).toBe(true);
    expect(isNameFromContents('status')).toBe(true);
  });

  it('does not let a container take its name from its subtree', () => {
    expect(isNameFromContents('region')).toBe(false);
    expect(isNameFromContents('form')).toBe(false);
    expect(isNameFromContents('grid')).toBe(false);
  });
});

describe('isLeafRole and isNameFromContents are different questions', () => {
  it('treats a row as naming itself from contents without making it a leaf', () => {
    // A row names itself from its cells, but a grid still needs its rows walked
    // when it is not summarised.
    expect(isNameFromContents('row')).toBe(true);
    expect(isLeafRole('row')).toBe(false);
  });

  it('terminates the walk at an alert, whose content is its message', () => {
    expect(isLeafRole('alert')).toBe(true);
  });
});

describe('mayContainControls', () => {
  it('lets a heading contain a genuinely separate control, such as a button', () => {
    // <h2>Combobox <button>Toggle Disabled</button></h2> is ordinary, valid markup: the
    // button is a real, independently focusable control, not part of the heading's own
    // widget. Swallowing it into the heading's label would make it invisible everywhere,
    // not just under-described.
    expect(mayContainControls('heading')).toBe(true);
  });

  it('lets an alert or a status contain its own dismiss or undo action', () => {
    expect(mayContainControls('alert')).toBe(true);
    expect(mayContainControls('status')).toBe(true);
  });

  it('does not apply to a widget leaf, where nothing inside has independent semantics', () => {
    expect(mayContainControls('button')).toBe(false);
    expect(mayContainControls('link')).toBe(false);
    expect(mayContainControls('checkbox')).toBe(false);
  });
});
