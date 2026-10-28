/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions } from '@clr/angular/utils';

import { readScope, withinReadScope } from './read-scope';
import { collectContextTreeWithin } from './walk';
import { resolveSnapshotOptions } from '../snapshot-options';

describe('withinReadScope', () => {
  it('keeps lookups for the duration of a read, joined by a nested one, and none after', () => {
    expect(readScope()).toBeNull();
    withinReadScope(() => {
      const outer = readScope();
      expect(outer).not.toBeNull();
      withinReadScope(() => expect(readScope()).toBe(outer));
      expect(readScope()).toBe(outer);
    });
    expect(readScope()).toBeNull();
  });

  it('closes the scope when the read throws', () => {
    expect(() =>
      withinReadScope(() => {
        throw new Error('read failed');
      })
    ).toThrowError('read failed');
    expect(readScope()).toBeNull();
  });
});

describe('a walk’s lookups', () => {
  let container: HTMLElement;
  const options: Required<ClrContextSnapshotOptions> = resolveSnapshotOptions({});

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => container.remove());

  function labels(): (string | undefined)[] {
    return collectContextTreeWithin(container, options).components.map(node => node.label);
  }

  it('names every control by its first label, associated or wrapping', () => {
    container.innerHTML =
      '<label for="a">First</label><label for="a">Second</label><input id="a" />' +
      '<label>Wrapped <input /></label><input id="none" />';

    expect(labels()).toEqual(['First', 'Wrapped', undefined]);
  });

  it('reads labels and styles afresh on the next walk', () => {
    container.innerHTML = '<input id="late" /><button>Save <span>draft</span></button>';
    expect(labels()).toEqual([undefined, 'Save draft']);

    container.insertAdjacentHTML('afterbegin', '<label for="late">Late</label>');
    (container.querySelector('span') as HTMLElement).style.display = 'none';

    expect(labels()).toEqual(['Late', 'Save']);
  });
});
