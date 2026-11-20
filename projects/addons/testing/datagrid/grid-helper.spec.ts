/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ClrDatagridModule } from '@clr/angular/data/datagrid';
import { renderFixture } from '@clr/angular/utils/testing';
import { expect as assert } from 'vitest';

import { GridHelper, GridRowTestHelper } from './grid-helper';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<clr-datagrid><clr-dg-column>Name</clr-dg-column></clr-datagrid>`,
  standalone: false,
})
class TestGrid {}

describe('Published datagrid assertion helpers', () => {
  beforeEach(() => {
    // Jest rejects a second expect() argument. Keep the published helpers runner-independent.
    vi.stubGlobal('expect', (...args: unknown[]) => {
      if (args.length !== 1) {
        throw new Error('Expect takes at most one argument.');
      }
      return assert(args[0]);
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it('checks included and excluded headers with a single-argument expect', () => {
    TestBed.configureTestingModule({ imports: [ClrDatagridModule], declarations: [TestGrid] });
    const fixture = TestBed.createComponent(TestGrid);
    renderFixture(fixture);
    const grid = new GridHelper(fixture.debugElement);

    assert(() => grid.assertHeaderLabels(['Name'], ['Missing'])).not.toThrow();
    assert(() => grid.assertHeaderLabels(['Wrong'])).toThrow();
    assert(() => grid.assertHeaderLabels(['Name'], ['Name'])).toThrow();
  });

  it('checks absent cells with a single-argument expect', () => {
    const row = new GridRowTestHelper(undefined, document.createElement('div'));

    assert(() => row.assertCellValues([undefined])).not.toThrow();
    assert(() => row.assertCellValues([], [undefined])).toThrow();
  });

  it('checks present cells with a single-argument expect', () => {
    const element = document.createElement('div');
    element.append(document.createElement('clr-dg-cell'));
    const row = new GridRowTestHelper(undefined, element);

    assert(() => row.assertCellValues([], [undefined])).not.toThrow();
    assert(() => row.assertCellValues([undefined])).toThrow();
  });
});
